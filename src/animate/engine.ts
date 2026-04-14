// ============================================================================
// AnimationEngine — Shared requestAnimationFrame loop
//
// Manages a single rAF loop that ticks all active animation callbacks in the
// same frame. Replaces per-timeline setTimeout loops for better performance
// and frame coherence.
// ============================================================================

// ── Types ────────────────────────────────────────────────────────────────────

/**
 * Callback invoked each animation frame.
 * @param elapsed - Milliseconds since this callback was activated.
 * @returns `true` to signal completion and unregister, or `void`/`false` to continue.
 */
export type TickCallback = (elapsed: number) => boolean | void;

/** Handle returned by `register()` — call `stop()` to unregister the callback. */
export interface EngineHandle {
  stop(): void;
}

/** Injectable frame scheduler — allows tests to swap in fake timers. */
export interface FrameScheduler {
  request: (cb: FrameRequestCallback) => number;
  cancel: (id: number) => void;
}

// ── Internal entry type ──────────────────────────────────────────────────────

interface CallbackEntry {
  callback: TickCallback;
  startTime: number;         // performance.now() when activated (after delay)
  delay: number;             // delay before first invocation
  registeredAt: number;      // performance.now() when registered
  activated: boolean;        // true once delay has elapsed
  removed: boolean;          // true when stop() called or callback returned true
}

// ── Default scheduler ────────────────────────────────────────────────────────

const FRAME_INTERVAL = 16; // ~60fps fallback

function createDefaultScheduler(): FrameScheduler {
  if (typeof requestAnimationFrame === 'function') {
    return {
      request: (cb) => requestAnimationFrame(cb),
      cancel: (id) => cancelAnimationFrame(id),
    };
  }
  // Node / non-browser fallback
  return {
    request: (cb) => setTimeout(() => cb(performance.now()), FRAME_INTERVAL) as unknown as number,
    cancel: (id) => clearTimeout(id),
  };
}

// ── Post-tick entry type ─────────────────────────────────────────────────────

interface PostTickEntry {
  callback: (frameTime: number) => void;
  removed: boolean;
  keepAlive: boolean;
}

// ── AnimationEngine ──────────────────────────────────────────────────────────

export class AnimationEngine {
  private _scheduler: FrameScheduler = createDefaultScheduler();
  private _entries: CallbackEntry[] = [];
  private _postTickCallbacks: PostTickEntry[] = [];
  private _frameId: number | null = null;
  private _running = false;

  /** True when the rAF loop is running. */
  get active(): boolean {
    return this._running;
  }

  /** Replace the frame scheduler (useful for tests with fake timers). */
  setScheduler(scheduler: FrameScheduler): void {
    this._scheduler = scheduler;
  }

  /**
   * Register a tick callback.
   * @param callback - Called each frame with elapsed ms since activation.
   * @param delay - Optional delay (ms) before first invocation, measured from rAF frames.
   * @returns Handle with a `stop()` method to unregister.
   */
  register(callback: TickCallback, delay = 0): EngineHandle {
    const entry: CallbackEntry = {
      callback,
      startTime: 0,
      delay,
      registeredAt: performance.now(),
      activated: delay <= 0,
      removed: false,
    };

    if (entry.activated) {
      entry.startTime = performance.now();
    }

    this._entries.push(entry);

    if (!this._running) {
      this._start();
    }

    const handle: EngineHandle = {
      stop: () => {
        entry.removed = true;
      },
    };

    return handle;
  }

  /**
   * Register a post-tick callback, fired after all regular tick callbacks each frame.
   * @param callback - Called with the frame timestamp (same `now` value passed to `_tick`).
   * @param options - Optional settings. `keepAlive: true` keeps the engine loop running
   *   even when no regular callbacks are registered (useful for recorders that need every frame).
   * @returns Handle with a `stop()` method to unregister.
   */
  onPostTick(callback: (frameTime: number) => void, options?: { keepAlive?: boolean }): EngineHandle {
    const entry: PostTickEntry = { callback, removed: false, keepAlive: options?.keepAlive ?? false };
    this._postTickCallbacks.push(entry);

    // If keepAlive is set and the engine isn't running, start it now
    if (entry.keepAlive && !this._running) {
      this._start();
    }

    return {
      stop: () => {
        entry.removed = true;
      },
    };
  }

  // ── Internal: loop management ──────────────────────────────────────

  private _start(): void {
    if (this._running) return;
    this._running = true;
    this._scheduleFrame();
  }

  private _stop(): void {
    if (!this._running) return;
    this._running = false;
    if (this._frameId !== null) {
      this._scheduler.cancel(this._frameId);
      this._frameId = null;
    }
  }

  private _scheduleFrame(): void {
    this._frameId = this._scheduler.request((now) => {
      this._tick(now);
    });
  }

  private _tick(now: number): void {
    const entries = this._entries.slice();
    // Process all entries
    for (const entry of entries) {
      if (entry.removed) continue;

      // Check delay
      if (!entry.activated) {
        const waitedMs = now - entry.registeredAt;
        if (waitedMs < entry.delay) continue;

        // Activate: set startTime to now so elapsed starts from 0
        entry.activated = true;
        entry.startTime = now;
      }

      const elapsed = now - entry.startTime;
      const done = entry.callback(elapsed);
      if (done === true) {
        entry.removed = true;
      }
    }

    // Prune removed entries
    this._entries = this._entries.filter((e) => !e.removed);

    // Fire post-tick callbacks (only when the engine is actively running frames)
    for (const postEntry of this._postTickCallbacks) {
      if (!postEntry.removed) {
        postEntry.callback(now);
      }
    }

    // Prune removed post-tick callbacks
    this._postTickCallbacks = this._postTickCallbacks.filter((e) => !e.removed);

    // Auto-stop if no callbacks remain and no keepAlive postTick observers
    const hasKeepAlive = this._postTickCallbacks.some((e) => !e.removed && e.keepAlive);
    if (this._entries.length === 0 && !hasKeepAlive) {
      this._stop();
      return;
    }

    // Schedule next frame
    this._scheduleFrame();
  }
}

// ── Module-level singleton ───────────────────────────────────────────────────

export const engine = new AnimationEngine();
