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
import type { StopOptions } from '../core/types';
import { HandleRegistry } from './handle-registry';
import type { Taggable } from './handle-registry';
import { Transaction } from './transaction';
import type { MotionConfig, PhysicsState, SpringMotion, DecayMotion, InertiaMotion, KeyframesMotion } from './motion';
import { resolveMotion, stepSpring, stepDecay, stepInertia, stepKeyframes } from './motion';

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
  loop?: boolean | 'reverse' | 'ping-pong';
  startAt?: 'start' | 'end';
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  tag?: string;
  tags?: string[];
  /** Predicate evaluated once per frame; stops the animation when it returns false. */
  while?: () => boolean;
  /** Controls how the animation stops when `while` returns false. Default: 'jump-end'. */
  whileStopMode?: 'jump-end' | 'rollback' | 'freeze';
  /** Physics-based motion configuration. When provided, bypasses eased interpolation. */
  motion?: MotionConfig | string;
  /** Maximum duration (ms) for physics animations. Prevents runaway springs. Default: 5000. */
  maxDuration?: number;
}

/** Handle returned by `animate()` — controls the animation lifecycle. */
export interface AnimationHandle {
  pause(): void;
  resume(): void;
  stop(options?: StopOptions): void;
  reverse(): void;
  play(): void;
  playForward(): void;
  playBackward(): void;
  restart(options?: { direction?: 'forward' | 'backward' }): void;
  readonly direction: 'forward' | 'backward';
  readonly isFinished: boolean;
  readonly currentValue: Map<string, number | string>;
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
  direction: 'forward' | 'backward';
  duration: number;
  easingFn: EasingFn;
  loop: boolean | 'reverse';
  onStart?: () => void;
  startFired: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  resolve: (() => void) | null;
  stopped: boolean;
  /** True when the animation reaches its current-direction endpoint. */
  isFinished: boolean;
  /** Current interpolated values per key, updated every frame. */
  currentValues: Map<string, number | string>;
  /** Last elapsed time from engine tick, used for seamless reverse. */
  _lastElapsed: number;
  /** Starting values captured at animate() call time. Persists after completion. */
  snapshot: Map<string, number | string>;
  /** Target values captured at animate() call time. Persists after completion. */
  target: Map<string, number | string>;
  /** Current finished promise — renewed on reverse/restart after completion. */
  _currentFinished: Promise<void>;
  /** Reference to the public handle for registry deregistration. */
  _handle?: Taggable;
  /** Optional predicate evaluated each frame; stops the animation when false. */
  whilePredicate?: () => boolean;
  /** How to stop the animation when whilePredicate returns false. */
  whileStopMode: 'jump-end' | 'rollback' | 'freeze';
  /** Resolved motion config for physics-based animation. */
  motionConfig?: MotionConfig;
  /** Per-property physics state. Only set when motionConfig is present. */
  physicsStates?: Map<string, PhysicsState>;
  /** Maximum duration (ms) for physics animations. Default: 5000. */
  maxDuration: number;
  /** True when this group uses physics-based motion instead of eased interpolation. */
  isPhysics: boolean;
  /** Previous elapsed time for computing dt in physics tick. */
  _prevElapsed: number;
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
  private _registry = new HandleRegistry();
  private _activeTransaction: Transaction | null = null;

  constructor(engine: AnimationEngine) {
    this._engine = engine;
  }

  /** Whether any animations are currently running. */
  get active(): boolean {
    return this._groups.size > 0;
  }

  /** The handle registry for tag-based animation control. */
  get registry(): HandleRegistry {
    return this._registry;
  }

  /** Begin a new transaction — all subsequent `animate()` calls will be tracked until `endTransaction()`. */
  beginTransaction(): Transaction {
    const tx = new Transaction();
    this._activeTransaction = tx;
    return tx;
  }

  /** End the current transaction context (does NOT commit or rollback — the caller decides). */
  endTransaction(): void {
    this._activeTransaction = null;
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
      startAt,
      onStart,
      onProgress,
      onComplete,
      tag,
      tags,
      while: whilePredicate,
      whileStopMode = 'jump-end',
      motion,
      maxDuration = 5000,
    } = options;

    // Resolve easing once
    const easingFn = resolveEasing(easing);

    // Resolve motion config (physics-based animation)
    const resolvedMotion = motion ? resolveMotion(motion) : undefined;

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

        // If the old group has no properties left, stop it as superseded
        if (existing.entries.length === 0) {
          this._stop(existing, 'superseded');
        }
      }
    }

    // Transaction: capture property snapshots (after blend/compose resolves entry.from)
    if (this._activeTransaction && this._activeTransaction.state === 'active') {
      for (const entry of entries) {
        this._activeTransaction.captureProperty(entry.key, entry.from, entry.apply);
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

      const allTags = [...(tag ? [tag] : []), ...(tags ?? [])];
      const handle: AnimationHandle & { _tags?: string[] } = {
        _tags: allTags.length > 0 ? allTags : undefined,
        pause: () => {},
        resume: () => {},
        stop: () => {},
        reverse: () => {},
        play: () => {},
        playForward: () => {},
        playBackward: () => {},
        restart: () => {},
        get direction(): 'forward' | 'backward' { return 'forward'; },
        get isFinished() { return true; },
        get currentValue() { return tgt; },
        finished: Promise.resolve(),
        get _snapshot() { return snap; },
        get _target() { return tgt; },
      };

      this._registry.register(handle as Taggable);
      queueMicrotask(() => this._registry.unregister(handle as Taggable));

      // Transaction: track instant handle
      if (this._activeTransaction && this._activeTransaction.state === 'active') {
        this._activeTransaction.trackHandle(handle);
      }

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

    // Build physics states for motion-based animation
    let physicsStates: Map<string, PhysicsState> | undefined;
    const isPhysics = !!resolvedMotion;
    if (resolvedMotion) {
      physicsStates = new Map();
      for (const entry of entries) {
        if (typeof entry.from !== 'number' || typeof entry.to !== 'number') {
          // Non-numeric property — can't use physics, snap immediately
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${entry.key}" is non-numeric; snapping to target.`,
          );
          entry.apply(entry.to);
          continue;
        }
        let initialVelocity = 0;
        if (resolvedMotion.type === 'decay' || resolvedMotion.type === 'inertia') {
          const vel = (resolvedMotion as { velocity?: number | { x: number; y: number } }).velocity;
          if (typeof vel === 'number') {
            initialVelocity = vel;
          } else if (vel && typeof vel === 'object' && entry.key in vel) {
            initialVelocity = (vel as Record<string, number>)[entry.key];
          }
        }
        physicsStates.set(entry.key, {
          value: entry.from as number,
          velocity: initialVelocity,
          target: entry.to as number,
          settled: false,
        });
      }

      // If no entries could be used for physics, fall back to eased animation
      if (physicsStates.size === 0) {
        physicsStates = undefined;
      }
    }

    // Normalize loop: 'ping-pong' is an alias for 'reverse'
    const normalizedLoop = loop === 'ping-pong' ? 'reverse' : loop;

    // Determine initial direction
    const initialDirection: 'forward' | 'backward' = startAt === 'end' ? 'backward' : 'forward';

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
      direction: initialDirection,
      duration,
      easingFn,
      loop: normalizedLoop,
      onStart,
      startFired: false,
      onProgress,
      onComplete,
      resolve: resolveFinished,
      stopped: false,
      isFinished: false,
      currentValues: new Map(),
      _lastElapsed: 0,
      snapshot,
      target,
      _currentFinished: finished,
      whilePredicate,
      whileStopMode,
      motionConfig: physicsStates ? resolvedMotion! : undefined,
      physicsStates,
      maxDuration,
      isPhysics: !!physicsStates,
      _prevElapsed: 0,
    };

    // Initialize current values
    if (startAt === 'end') {
      // Snap to target values immediately; animation will play backward to snapshot
      for (const entry of group.entries) {
        entry.apply(entry.to);
        group.currentValues.set(entry.key, entry.to);
      }
    } else {
      for (const entry of group.entries) {
        group.currentValues.set(entry.key, entry.from);
      }
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

    // Compute tags for this animation
    const allTags = [...(tag ? [tag] : []), ...(tags ?? [])];

    // Build the animation handle
    const handle: AnimationHandle & { _tags?: string[] } = {
      _tags: allTags.length > 0 ? allTags : undefined,
      pause: () => this._pause(group),
      resume: () => this._resume(group),
      stop: (options?: StopOptions) => this._stop(group, options?.mode ?? 'jump-end'),
      reverse: () => this._reverse(group),
      play: () => this._play(group),
      playForward: () => this._playDirection(group, 'forward'),
      playBackward: () => this._playDirection(group, 'backward'),
      restart: (opts?: { direction?: 'forward' | 'backward' }) => this._restart(group, opts),
      get direction() { return group.direction; },
      get isFinished() { return group.isFinished; },
      get currentValue() { return group.currentValues; },
      get finished() { return group._currentFinished; },
      get _snapshot() { return group.snapshot; },
      get _target() { return group.target; },
    };

    // Register handle for tag-based control
    this._registry.register(handle as Taggable);
    // Store handle reference on group for auto-deregister on completion
    group._handle = handle as Taggable;

    // Transaction: track this handle
    if (this._activeTransaction && this._activeTransaction.state === 'active') {
      this._activeTransaction.trackHandle(handle);
    }

    return handle;
  }

  /** Stop all active animations. */
  stopAll(options?: StopOptions): void {
    const mode = options?.mode ?? 'jump-end';
    for (const group of this._groups) {
      if (!group.stopped) {
        this._stop(group, mode);
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

    // Physics-based animation: delegate to _tickPhysics
    if (group.isPhysics) {
      return this._tickPhysics(group, elapsed);
    }

    // State-aware cancellation: evaluate the while predicate and stop if false
    if (group.whilePredicate && !group.whilePredicate()) {
      this._stop(group, group.whileStopMode);
      return true;
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
    const directedProgress = group.direction === 'backward' ? 1 - rawProgress : rawProgress;

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
        const target = group.direction === 'backward' ? entry.from : entry.to;
        entry.apply(target);
        group.currentValues.set(entry.key, target);
      }

      this._completeGroup(group);
      return true;
    }
  }

  /**
   * Mark a group as complete: set flags, clean up, fire callbacks, resolve promise,
   * and schedule auto-deregistration. Shared by both the eased and physics paths.
   */
  private _completeGroup(group: ActiveGroup): void {
    group.stopped = true;
    group.isFinished = true;
    this._cleanup(group);
    group.onComplete?.();
    group.resolve?.();
    if (group._handle) {
      const handle = group._handle;
      queueMicrotask(() => {
        if (group.isFinished) {
          this._registry.unregister(handle);
        }
      });
    }
  }

  /**
   * Per-frame tick for a physics-based animation group.
   * Runs the physics integrator (spring, etc.) each frame instead of eased interpolation.
   * @returns `true` when the animation is complete (to unregister from engine).
   */
  private _tickPhysics(group: ActiveGroup, elapsed: number): boolean | void {
    // State-aware cancellation
    if (group.whilePredicate && !group.whilePredicate()) {
      this._stop(group, group.whileStopMode);
      return true;
    }

    // Just resumed: reset timing for physics continuity
    if (group._resumeNeeded) {
      group._resumeNeeded = false;
      // Reset _prevElapsed to current so first post-resume dt is small
      group._prevElapsed = elapsed;
      group.startTime = elapsed - (group._lastElapsed - group.startTime);
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

    // Compute dt in seconds, capped to prevent explosion on background tabs
    const prevElapsed = group._prevElapsed || elapsed;
    const dt = Math.min((elapsed - prevElapsed) / 1000, 0.064); // cap at 64ms
    group._prevElapsed = elapsed;
    group._lastElapsed = elapsed;

    if (dt <= 0) {
      return; // skip zero-delta ticks (first frame)
    }

    const physicsStates = group.physicsStates!;
    let allSettled = true;

    // Step each physics state
    for (const entry of group.entries) {
      const state = physicsStates.get(entry.key);
      if (!state) {
        continue; // non-physics entry, already snapped
      }

      if (!state.settled) {
        // Direction handling: update target based on direction
        if (group.direction === 'backward') {
          state.target = group.snapshot.get(entry.key) as number;
        } else {
          state.target = group.target.get(entry.key) as number;
        }

        // Call the appropriate integrator based on motion type
        switch (group.motionConfig!.type) {
          case 'spring':
            stepSpring(state, group.motionConfig as SpringMotion, dt);
            break;
          case 'decay':
            stepDecay(state, group.motionConfig as DecayMotion, dt);
            break;
          case 'inertia':
            stepInertia(state, group.motionConfig as InertiaMotion, dt, entry.key);
            break;
          case 'keyframes': {
            const totalElapsed = elapsed - group.startTime;
            const kfDuration = (group.motionConfig as KeyframesMotion).duration ?? group.maxDuration;
            const kfProgress = Math.min(totalElapsed / kfDuration, 1);
            stepKeyframes(state, group.motionConfig as KeyframesMotion, kfProgress, entry.key);
            break;
          }
        }

        group.currentValues.set(entry.key, state.value);
        entry.apply(state.value);
      }

      if (!state.settled) {
        allSettled = false;
      }
    }

    // Progress approximation for physics (useful for onProgress)
    const totalElapsed = elapsed - group.startTime;
    const approxProgress = Math.min(totalElapsed / group.maxDuration, 1);
    group.onProgress?.(approxProgress);

    // Check maxDuration cap
    if (totalElapsed >= group.maxDuration) {
      // Force settle all states
      for (const [key, state] of physicsStates) {
        if (!state.settled) {
          state.value = state.target;
          state.velocity = 0;
          state.settled = true;
          const entry = group.entries.find((e) => e.key === key);
          if (entry) {
            entry.apply(state.value);
            group.currentValues.set(entry.key, state.value);
          }
        }
      }
      allSettled = true;
    }

    if (allSettled) {
      this._completeGroup(group);
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

  private _stop(group: ActiveGroup, mode: 'jump-end' | 'rollback' | 'freeze' | 'superseded' = 'jump-end'): void {
    if (group.stopped) {
      return;
    }

    group.stopped = true;
    group.engineHandle.stop();

    if (mode === 'jump-end') {
      // Apply final target values (current behavior)
      for (const entry of group.entries) {
        const target = group.direction === 'backward' ? entry.from : entry.to;
        entry.apply(target);
      }
      // Force-settle physics states
      if (group.isPhysics && group.physicsStates) {
        for (const [, state] of group.physicsStates) {
          state.value = state.target;
          state.velocity = 0;
          state.settled = true;
        }
      }
    } else if (mode === 'rollback') {
      // Revert to snapshot (start state)
      for (const entry of group.entries) {
        const snapValue = group.snapshot.get(entry.key);
        if (snapValue !== undefined) {
          entry.apply(snapValue);
        }
      }
    } else if (mode === 'freeze') {
      // No property writes — leave at current interpolated value
    } else if (mode === 'superseded') {
      // No property writes — new owner is about to overwrite
    }

    this._cleanup(group);

    // onComplete fires for consumer-facing modes, not for superseded
    if (mode !== 'superseded') {
      group.onComplete?.();
    }
    group.resolve?.();
    if (group._handle) {
      const handle = group._handle;
      queueMicrotask(() => {
        if (group.isFinished || group.stopped) {
          this._registry.unregister(handle);
        }
      });
    }
  }

  private _reverse(group: ActiveGroup): void {
    // Reverse on a finished handle: revive and play in opposite direction
    if (group.isFinished) {
      group.direction = group.direction === 'forward' ? 'backward' : 'forward';

      // Reset physics states for the new direction
      if (group.isPhysics && group.physicsStates) {
        for (const [key, state] of group.physicsStates) {
          // value stays at current (where the spring settled)
          // target switches to the other end
          if (group.direction === 'backward') {
            state.target = group.snapshot.get(key) as number;
          } else {
            state.target = group.target.get(key) as number;
          }
          state.velocity = 0;
          state.settled = false;
        }
      }

      this._revive(group);
      return;
    }

    if (group.stopped) {
      return;
    }

    group.direction = group.direction === 'forward' ? 'backward' : 'forward';

    if (group.isPhysics && group.physicsStates) {
      // For physics groups: update targets and reset velocity so the spring pulls toward new target
      for (const [key, state] of group.physicsStates) {
        if (group.direction === 'backward') {
          state.target = group.snapshot.get(key) as number;
        } else {
          state.target = group.target.get(key) as number;
        }
        state.velocity = 0;
        state.settled = false;
      }
      return;
    }

    // Adjust startTime so that directedProgress is continuous.
    // Before reverse at rawProgress p: directedProgress = p (or 1-p if already reversed).
    // After flipping, we need 1 - newRawProgress = oldRawProgress, so
    // newRawProgress = 1 - oldRawProgress, meaning newStartTime = elapsed - (1-p)*duration.
    if (group._lastElapsed > 0 && group.startTime > 0) {
      const elapsed = group._lastElapsed;
      const rawProgress = Math.min((elapsed - group.startTime) / group.duration, 1);
      group.startTime = elapsed - (1 - rawProgress) * group.duration;
    }
  }

  private _play(group: ActiveGroup): void {
    if (group.isFinished) {
      // Restart in current direction from the beginning
      this._revive(group);
      return;
    }

    if (group.stopped) {
      return;
    }

    // If paused, resume
    if (group.pausedElapsed !== null) {
      this._resume(group);
    }
  }

  private _playDirection(group: ActiveGroup, direction: 'forward' | 'backward'): void {
    const directionChanged = group.direction !== direction;
    group.direction = direction;

    if (group.isFinished) {
      this._revive(group);
      return;
    }

    if (group.stopped) {
      return;
    }

    // For physics groups: update targets when direction changes
    if (directionChanged && group.isPhysics && group.physicsStates) {
      for (const [key, state] of group.physicsStates) {
        if (direction === 'backward') {
          state.target = group.snapshot.get(key) as number;
        } else {
          state.target = group.target.get(key) as number;
        }
        state.velocity = 0;
        state.settled = false;
      }
    } else if (directionChanged && group._lastElapsed > 0 && group.startTime > 0) {
      // Same adjustment as _reverse() for seamless mid-flight direction change
      const elapsed = group._lastElapsed;
      const rawProgress = Math.min((elapsed - group.startTime) / group.duration, 1);
      group.startTime = elapsed - (1 - rawProgress) * group.duration;
    }

    // If paused, resume
    if (group.pausedElapsed !== null) {
      this._resume(group);
    }
  }

  private _restart(group: ActiveGroup, options?: { direction?: 'forward' | 'backward' }): void {
    const direction = options?.direction ?? 'forward';
    group.direction = direction;

    // Apply snapshot or target values based on direction
    if (direction === 'forward') {
      // Reset to snapshot values
      for (const entry of group.entries) {
        const snapValue = group.snapshot.get(entry.key);
        if (snapValue !== undefined) {
          entry.apply(snapValue);
          group.currentValues.set(entry.key, snapValue);
        }
      }
    } else {
      // Reset to target values
      for (const entry of group.entries) {
        const targetValue = group.target.get(entry.key);
        if (targetValue !== undefined) {
          entry.apply(targetValue);
          group.currentValues.set(entry.key, targetValue);
        }
      }
    }

    // Reset physics states for physics-based animations
    if (group.isPhysics && group.physicsStates) {
      for (const [key, state] of group.physicsStates) {
        if (direction === 'forward') {
          state.value = group.snapshot.get(key) as number;
          state.target = group.target.get(key) as number;
        } else {
          state.value = group.target.get(key) as number;
          state.target = group.snapshot.get(key) as number;
        }
        state.velocity = 0;
        state.settled = false;
      }
    }

    this._revive(group);
  }

  /** Revive a finished/stopped group: reset timing, re-register on engine, renew promise. */
  private _revive(group: ActiveGroup): void {
    group.isFinished = false;
    group.stopped = false;
    group.startTime = 0;
    group.startFired = false;
    group.pausedElapsed = null;
    group._resumeNeeded = false;
    group._lastElapsed = 0;
    group._prevElapsed = 0;

    // Reset physics states that haven't already been prepared by the caller.
    // For physics groups: ensure unsettled states are ready for integration.
    // Callers like _reverse() and _restart() may have already set up the states;
    // this only resets states that are still marked as settled.
    if (group.isPhysics && group.physicsStates) {
      for (const [key, state] of group.physicsStates) {
        if (state.settled) {
          // Reset to starting position for current direction
          if (group.direction === 'forward') {
            state.value = group.snapshot.get(key) as number;
            state.target = group.target.get(key) as number;
          } else {
            state.value = group.target.get(key) as number;
            state.target = group.snapshot.get(key) as number;
          }
          state.velocity = 0;
          state.settled = false;
        }
      }
    }

    // Renew the finished promise
    this._renewFinished(group);

    // Re-register ownership
    for (const entry of group.entries) {
      this._ownership.set(entry.key, group);
    }

    // Re-add to active groups
    this._groups.add(group);

    // Re-register handle in the registry (may have been deregistered on completion)
    if (group._handle) {
      this._registry.register(group._handle);
    }

    // Re-register on engine
    const engineHandle = this._engine.register((elapsed) => {
      return this._tick(group, elapsed);
    });
    group.engineHandle = engineHandle;
  }

  /** Create a new finished promise for the group (old one stays resolved). */
  private _renewFinished(group: ActiveGroup): void {
    group.resolve = null;
    const promise = new Promise<void>((resolve) => {
      group.resolve = resolve;
    });
    group._currentFinished = promise;
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
