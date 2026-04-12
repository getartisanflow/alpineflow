// ============================================================================
// Animator — Unified property animation with blend/compose support
//
// Manages per-property animation entries on a shared AnimationEngine rAF loop.
// Handles interpolation, easing, looping, pause/resume, reverse, and automatic
// conflict resolution when a new animation targets an already-in-flight key.
// ============================================================================

import { AnimationEngine } from './engine';
import type { EngineHandle } from './engine';
import { resolveEasing } from './easing';
import type { EasingName, EasingFn } from './easing';
import { lerpNumber, interpolateColor } from './interpolators';

// ── Types ────────────────────────────────────────────────────────────────────

/** A single property to animate. */
export interface PropertyEntry {
  key: string;
  from: number | string;
  to: number | string;
  apply: (value: number | string) => void;
}

/** Internal options for the `animate()` method. */
export interface AnimateInternalOptions {
  duration: number;
  easing?: EasingName | EasingFn;
  delay?: number;
  loop?: boolean | 'reverse';
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

/** Handle returned by `animate()` — controls the animation lifecycle. */
export interface AnimationHandle {
  pause(): void;
  resume(): void;
  stop(): void;
  reverse(): void;
  readonly finished: Promise<void>;
  readonly _snapshot: Map<string, number | string>;
  readonly _target: Map<string, number | string>;
}

// ── Internal types ───────────────────────────────────────────────────────────

/** Tracks a group of properties being animated together. */
interface ActiveGroup {
  /** Unique identifier for this group, used for ownership comparisons. */
  _id: number;
  entries: PropertyEntry[];
  engineHandle: EngineHandle;
  startTime: number;
  /**
   * Engine-relative elapsed value at the moment of pause, or null when not paused.
   * Uses engine tick elapsed (not wall-clock) so fake schedulers stay in sync.
   */
  pausedElapsed: number | null;
  /** When true, the next tick adjusts startTime to account for the pause gap. */
  _resumeNeeded: boolean;
  reversed: boolean;
  duration: number;
  easingFn: EasingFn;
  loop: boolean | 'reverse';
  onStart?: () => void;
  startFired: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  resolve: () => void;
  stopped: boolean;
  /** Current interpolated values per key, updated every frame. */
  currentValues: Map<string, number | string>;
  /** Last elapsed time from engine tick, used for seamless reverse. */
  _lastElapsed: number;
  /** Starting values captured at animate() call time. Persists after completion. */
  snapshot: Map<string, number | string>;
  /** Target values captured at animate() call time. Persists after completion. */
  target: Map<string, number | string>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Detect whether a value looks like a color string. */
function isColorString(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  return /^(#|rgb|hsl)/.test(value);
}

/** Interpolate a single property value based on from/to types. */
function interpolateValue(from: number | string, to: number | string, t: number): number | string {
  if (typeof from === 'number' && typeof to === 'number') {
    return lerpNumber(from, to, t);
  }

  if (isColorString(from) && isColorString(to)) {
    return interpolateColor(from, to, t);
  }

  // Non-interpolatable strings: snap at midpoint
  return t < 0.5 ? from : to;
}

// ── Animator ─────────────────────────────────────────────────────────────────

export class Animator {
  private _engine: AnimationEngine;
  /** Maps property key -> the ActiveGroup that currently owns it. */
  private _ownership = new Map<string, ActiveGroup>();
  /** All active groups. */
  private _groups = new Set<ActiveGroup>();
  private _nextGroupId = 0;

  constructor(engine: AnimationEngine) {
    this._engine = engine;
  }

  /** Whether any animations are currently running. */
  get active(): boolean {
    return this._groups.size > 0;
  }

  /**
   * Animate a set of property entries over the given duration.
   *
   * If any entry targets a key already being animated, the current in-flight
   * value is captured as the new "from" and the property is removed from the
   * old group (blend/compose).
   */
  animate(entries: PropertyEntry[], options: AnimateInternalOptions): AnimationHandle {
    const {
      duration,
      easing,
      delay = 0,
      loop = false,
      onStart,
      onProgress,
      onComplete,
    } = options;

    // Resolve easing once
    const easingFn = resolveEasing(easing);

    // Blend/compose: capture in-flight values and steal ownership
    for (const entry of entries) {
      const existing = this._ownership.get(entry.key);
      if (existing && !existing.stopped) {
        // Capture the current interpolated value as the new "from"
        const currentValue = existing.currentValues.get(entry.key);
        if (currentValue !== undefined) {
          entry.from = currentValue;
        }

        // Remove this property from the old group
        existing.entries = existing.entries.filter((e) => e.key !== entry.key);

        // If the old group has no properties left, stop its engine handle
        if (existing.entries.length === 0) {
          existing.stopped = true;
          existing.engineHandle.stop();
          this._groups.delete(existing);
          existing.resolve();
        }
      }
    }

    // Duration 0 = instant snap
    if (duration <= 0) {
      const snap = new Map<string, number | string>();
      const tgt = new Map<string, number | string>();
      for (const entry of entries) {
        snap.set(entry.key, entry.from);
        tgt.set(entry.key, entry.to);
      }

      onStart?.();

      for (const entry of entries) {
        entry.apply(entry.to);
      }

      const handle: AnimationHandle = {
        pause: () => {},
        resume: () => {},
        stop: () => {},
        reverse: () => {},
        finished: Promise.resolve(),
        get _snapshot() { return snap; },
        get _target() { return tgt; },
      };

      onComplete?.();
      return handle;
    }

    // Build snapshot and target maps before group construction
    const snapshot = new Map<string, number | string>();
    const target = new Map<string, number | string>();
    for (const entry of entries) {
      snapshot.set(entry.key, entry.from);
      target.set(entry.key, entry.to);
    }

    // Set up the active group
    let resolveFinished!: () => void;
    const finished = new Promise<void>((resolve) => {
      resolveFinished = resolve;
    });

    const group: ActiveGroup = {
      _id: this._nextGroupId++,
      entries: [...entries],
      engineHandle: null as unknown as EngineHandle,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: false,
      reversed: false,
      duration,
      easingFn,
      loop,
      onStart,
      startFired: false,
      onProgress,
      onComplete,
      resolve: resolveFinished,
      stopped: false,
      currentValues: new Map(),
      _lastElapsed: 0,
      snapshot,
      target,
    };

    // Initialize current values to "from"
    for (const entry of entries) {
      group.currentValues.set(entry.key, entry.from);
    }

    // Register ownership
    for (const entry of entries) {
      this._ownership.set(entry.key, group);
    }

    this._groups.add(group);

    // Register on engine
    const engineHandle = this._engine.register((elapsed) => {
      return this._tick(group, elapsed);
    }, delay);

    group.engineHandle = engineHandle;

    // Build the animation handle
    const handle: AnimationHandle = {
      pause: () => this._pause(group),
      resume: () => this._resume(group),
      stop: () => this._stop(group),
      reverse: () => this._reverse(group),
      finished,
      get _snapshot() { return group.snapshot; },
      get _target() { return group.target; },
    };

    return handle;
  }

  /** Stop all active animations. */
  stopAll(): void {
    for (const group of this._groups) {
      if (!group.stopped) {
        group.stopped = true;
        group.engineHandle.stop();
        // Apply end values
        for (const entry of group.entries) {
          const target = group.reversed ? entry.from : entry.to;
          entry.apply(target);
        }
        group.onComplete?.();
        group.resolve();
      }
    }
    this._groups.clear();
    this._ownership.clear();
  }

  // ── Internal: tick ───────────────────────────────────────────────────

  /**
   * Per-frame tick for an animation group.
   * @returns `true` when the animation is complete (to unregister from engine).
   */
  private _tick(group: ActiveGroup, elapsed: number): boolean | void {
    if (group.stopped) {
      return true;
    }

    // Paused: don't advance
    if (group.pausedElapsed !== null) {
      return;
    }

    // Just resumed: adjust startTime so the animation continues from the paused position.
    // The gap between pausedElapsed and now is dead time that should not count toward progress.
    if (group._resumeNeeded) {
      group.startTime += elapsed - group._lastElapsed;
      group._resumeNeeded = false;
    }

    // On first tick, record startTime
    if (group.startTime === 0) {
      group.startTime = elapsed;
    }

    // Fire onStart once on the first active tick
    if (!group.startFired) {
      group.startFired = true;
      group.onStart?.();
    }

    group._lastElapsed = elapsed;
    const timeSinceStart = elapsed - group.startTime;
    let rawProgress = Math.min(timeSinceStart / group.duration, 1);

    // Handle looping
    if (group.loop && rawProgress >= 1) {
      if (group.loop === 'reverse') {
        // Ping-pong: cycle through 0->1->0->1...
        const cycles = timeSinceStart / group.duration;
        const cycleIndex = Math.floor(cycles);
        const fractional = cycles - cycleIndex;
        // Even cycles go forward, odd cycles go backward
        rawProgress = cycleIndex % 2 === 0 ? fractional : 1 - fractional;
      } else {
        // loop: true — restart
        const fractional = (timeSinceStart % group.duration) / group.duration;
        rawProgress = fractional;
      }
    }

    // Apply reverse
    const directedProgress = group.reversed ? 1 - rawProgress : rawProgress;

    // Apply easing
    const easedProgress = group.easingFn(directedProgress);

    // Interpolate and apply all entries
    for (const entry of group.entries) {
      const value = interpolateValue(entry.from, entry.to, easedProgress);
      group.currentValues.set(entry.key, value);
      entry.apply(value);
    }

    // Report progress
    group.onProgress?.(directedProgress);

    // Check completion (non-looping only)
    if (!group.loop && rawProgress >= 1) {
      // Ensure final values are exact
      for (const entry of group.entries) {
        const target = group.reversed ? entry.from : entry.to;
        entry.apply(target);
        group.currentValues.set(entry.key, target);
      }

      group.stopped = true;
      this._cleanup(group);
      group.onComplete?.();
      group.resolve();
      return true;
    }
  }

  // ── Internal: handle actions ─────────────────────────────────────────

  private _pause(group: ActiveGroup): void {
    if (group.stopped || group.pausedElapsed !== null || group.startTime === 0) {
      return;
    }
    // Store the engine-relative elapsed value at pause time so resume can compute
    // the exact gap without relying on wall-clock (performance.now()).
    group.pausedElapsed = group._lastElapsed;
  }

  private _resume(group: ActiveGroup): void {
    if (group.stopped || group.pausedElapsed === null) {
      return;
    }
    // Signal the next tick to adjust startTime by the pause gap.
    // _lastElapsed still holds the elapsed value from just before the pause,
    // and _tick will receive the new elapsed on the next frame.
    group._resumeNeeded = true;
    group.pausedElapsed = null;
  }

  private _stop(group: ActiveGroup): void {
    if (group.stopped) {
      return;
    }

    group.stopped = true;
    group.engineHandle.stop();

    // Jump to end state
    for (const entry of group.entries) {
      const target = group.reversed ? entry.from : entry.to;
      entry.apply(target);
    }

    this._cleanup(group);
    group.onComplete?.();
    group.resolve();
  }

  private _reverse(group: ActiveGroup): void {
    if (group.stopped) {
      return;
    }
    group.reversed = !group.reversed;

    // Adjust startTime so that directedProgress is continuous.
    // Before reverse at rawProgress p: directedProgress = p (or 1-p if already reversed).
    // After flipping reversed, we need 1 - newRawProgress = oldRawProgress, so
    // newRawProgress = 1 - oldRawProgress, meaning newStartTime = elapsed - (1-p)*duration.
    if (group._lastElapsed > 0 && group.startTime > 0) {
      const elapsed = group._lastElapsed;
      const rawProgress = Math.min((elapsed - group.startTime) / group.duration, 1);
      group.startTime = elapsed - (1 - rawProgress) * group.duration;
    }
  }

  // ── Internal: cleanup ────────────────────────────────────────────────

  private _cleanup(group: ActiveGroup): void {
    // Remove ownership for all keys in this group.
    // Compare by _id rather than reference equality to guard against callers
    // that may wrap the Animator in a proxy (e.g. Alpine.js reactive system),
    // which would cause Map.get() to return a proxy-wrapped group that fails
    // strict equality (===) against the raw group object.
    for (const entry of group.entries) {
      const owner = this._ownership.get(entry.key);
      if (owner && owner._id === group._id) {
        this._ownership.delete(entry.key);
      }
    }
    this._groups.delete(group);
  }
}
