import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnimationEngine } from './engine';
import type { FrameScheduler } from './engine';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Create a setTimeout-based scheduler suitable for fake-timer tests. */
function makeTimeoutScheduler(): FrameScheduler {
  return {
    request: (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as unknown as number,
    cancel: (id: number) => clearTimeout(id),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── Core behaviour ──────────────────────────────────────────────────────────

describe('AnimationEngine', () => {
  it('calls registered callback each frame with elapsed time', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    const elapsed: number[] = [];
    engine.register((e) => {
      elapsed.push(e);
    });

    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    expect(elapsed.length).toBeGreaterThanOrEqual(2);
    // Elapsed times should be increasing
    for (let i = 1; i < elapsed.length; i++) {
      expect(elapsed[i]).toBeGreaterThanOrEqual(elapsed[i - 1]);
    }
  });

  it('stops calling callback after it returns true', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let callCount = 0;
    engine.register(() => {
      callCount++;
      return true; // signal done on first call
    });

    await vi.advanceTimersByTimeAsync(16);
    const countAfterFirst = callCount;

    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    // Should have been called once, then stopped
    expect(countAfterFirst).toBe(1);
    expect(callCount).toBe(1);
  });

  it('handle.stop() removes callback', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let callCount = 0;
    const handle = engine.register(() => {
      callCount++;
    });

    await vi.advanceTimersByTimeAsync(16);
    expect(callCount).toBe(1);

    handle.stop();

    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    // Should not have been called after stop
    expect(callCount).toBe(1);
  });

  it('auto-stops loop when last callback is removed (engine.active === false)', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    const handle = engine.register(() => {});
    expect(engine.active).toBe(true);

    handle.stop();
    // Allow one more frame for the engine to detect emptiness and stop
    await vi.advanceTimersByTimeAsync(16);

    expect(engine.active).toBe(false);
  });

  it('auto-starts loop when first callback is registered (engine.active === true)', () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    expect(engine.active).toBe(false);

    engine.register(() => {});

    expect(engine.active).toBe(true);
  });

  it('supports multiple concurrent callbacks', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let callsA = 0;
    let callsB = 0;

    engine.register(() => { callsA++; });
    engine.register(() => { callsB++; });

    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    expect(callsA).toBeGreaterThanOrEqual(2);
    expect(callsB).toBeGreaterThanOrEqual(2);
  });

  it('supports delay before first callback invocation', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let called = false;
    engine.register(() => {
      called = true;
    }, 100);

    // Before delay elapses, callback should not fire
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);
    expect(called).toBe(false);

    // After delay elapses (100ms from first frame), callback should fire
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    expect(called).toBe(true);
  });

  it('setScheduler replaces the frame scheduler', async () => {
    const engine = new AnimationEngine();

    const requestSpy = vi.fn((cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now()), 16) as unknown as number,
    );
    const cancelSpy = vi.fn((id: number) => clearTimeout(id));

    engine.setScheduler({ request: requestSpy, cancel: cancelSpy });

    engine.register(() => {});

    await vi.advanceTimersByTimeAsync(16);

    expect(requestSpy).toHaveBeenCalled();
  });

  it('auto-stops when callback returns true (last callback)', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    engine.register(() => true); // done immediately

    await vi.advanceTimersByTimeAsync(16);
    // Allow engine to process removal
    await vi.advanceTimersByTimeAsync(16);

    expect(engine.active).toBe(false);
  });

  it('remains active when one callback completes but others remain', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    engine.register(() => true); // done immediately
    engine.register(() => {}); // stays active

    await vi.advanceTimersByTimeAsync(16);

    expect(engine.active).toBe(true);
  });

  it('delayed callback does not receive elapsed time from before delay', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    const elapsed: number[] = [];
    engine.register((e) => {
      elapsed.push(e);
    }, 100);

    // Advance past the delay
    for (let i = 0; i < 10; i++) {
      await vi.advanceTimersByTimeAsync(16);
    }

    // The first elapsed value should be small (close to 0), not ~100ms
    if (elapsed.length > 0) {
      expect(elapsed[0]).toBeLessThan(50);
    }
  });
});

// ── onPostTick ───────────────────────────────────────────────────────────────

describe('AnimationEngine.onPostTick', () => {
  it('fires postTick callbacks after all regular callbacks complete', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    const order: string[] = [];

    engine.register(() => { order.push('tick-A'); });
    engine.register(() => { order.push('tick-B'); });
    engine.onPostTick(() => { order.push('postTick'); });

    await vi.advanceTimersByTimeAsync(16);

    // Both regular ticks fire before postTick
    expect(order.indexOf('tick-A')).toBeLessThan(order.indexOf('postTick'));
    expect(order.indexOf('tick-B')).toBeLessThan(order.indexOf('postTick'));
  });

  it('does not fire postTick when engine is not running (no regular callbacks)', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let postTickCount = 0;
    engine.onPostTick(() => { postTickCount++; });

    // No regular callbacks registered — engine should never start
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    expect(postTickCount).toBe(0);
    expect(engine.active).toBe(false);
  });

  it('returns a handle with stop() that unregisters the postTick callback', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let postTickCount = 0;
    const handle = engine.onPostTick(() => { postTickCount++; });

    // Register a regular callback so the engine runs
    engine.register(() => {});

    await vi.advanceTimersByTimeAsync(16);
    expect(postTickCount).toBe(1);

    handle.stop();

    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    // Should not have been called after stop
    expect(postTickCount).toBe(1);
  });

  it('passes the frame timestamp to postTick callbacks', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    const timestamps: number[] = [];
    engine.onPostTick((frameTime) => { timestamps.push(frameTime); });

    engine.register(() => {});

    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    expect(timestamps.length).toBeGreaterThanOrEqual(2);
    // Timestamps should be positive numbers (frame time from the scheduler)
    for (const t of timestamps) {
      expect(t).toBeGreaterThan(0);
    }
    // Timestamps should be non-decreasing
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
    }
  });
});

// ── onPostTick keepAlive ────────────────────────────────────────────────────

describe('AnimationEngine.onPostTick keepAlive', () => {
  it('keeps the engine running after regular callbacks complete when keepAlive is true', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let postTickCount = 0;
    engine.onPostTick(() => { postTickCount++; }, { keepAlive: true });

    // Register a regular callback that completes immediately
    engine.register(() => true);

    // Allow the regular callback to fire and complete
    await vi.advanceTimersByTimeAsync(16);
    expect(postTickCount).toBe(1);

    // Engine should still be running because keepAlive postTick is active
    expect(engine.active).toBe(true);

    // PostTick should keep firing on subsequent frames
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    expect(postTickCount).toBeGreaterThanOrEqual(3);
    expect(engine.active).toBe(true);
  });

  it('engine stops after regular callbacks complete when keepAlive is false (default)', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let postTickCount = 0;
    engine.onPostTick(() => { postTickCount++; });

    // Register a regular callback that completes immediately
    engine.register(() => true);

    // Allow the regular callback to fire and complete
    await vi.advanceTimersByTimeAsync(16);
    const countAfterFirst = postTickCount;

    // Engine should have stopped
    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    // PostTick should have fired once (the frame where the regular callback completed)
    // then engine stopped — no more postTick calls
    expect(postTickCount).toBe(countAfterFirst);
    expect(engine.active).toBe(false);
  });

  it('keepAlive postTick starts the engine even without regular callbacks', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    expect(engine.active).toBe(false);

    let postTickCount = 0;
    engine.onPostTick(() => { postTickCount++; }, { keepAlive: true });

    // Engine should start immediately due to keepAlive
    expect(engine.active).toBe(true);

    await vi.advanceTimersByTimeAsync(16);
    await vi.advanceTimersByTimeAsync(16);

    expect(postTickCount).toBeGreaterThanOrEqual(2);
  });

  it('stopping keepAlive handle allows engine to auto-stop', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    let postTickCount = 0;
    const handle = engine.onPostTick(() => { postTickCount++; }, { keepAlive: true });

    // Engine is running due to keepAlive
    await vi.advanceTimersByTimeAsync(16);
    expect(engine.active).toBe(true);
    expect(postTickCount).toBe(1);

    // Stop the keepAlive observer
    handle.stop();

    // Engine should stop on the next frame (no regular callbacks, no keepAlive)
    await vi.advanceTimersByTimeAsync(16);
    expect(engine.active).toBe(false);
  });

  it('keepAlive postTick survives engine stop/restart cycles', async () => {
    const engine = new AnimationEngine();
    engine.setScheduler(makeTimeoutScheduler());

    const postTickTimestamps: number[] = [];
    engine.onPostTick((frameTime) => { postTickTimestamps.push(frameTime); }, { keepAlive: true });

    // First burst: register a callback that completes in one frame
    engine.register(() => true);
    await vi.advanceTimersByTimeAsync(16);

    const countAfterFirstBurst = postTickTimestamps.length;
    expect(countAfterFirstBurst).toBeGreaterThanOrEqual(1);
    // Engine stays alive because of keepAlive
    expect(engine.active).toBe(true);

    // PostTick keeps receiving frames
    await vi.advanceTimersByTimeAsync(16);
    expect(postTickTimestamps.length).toBeGreaterThan(countAfterFirstBurst);

    // Second burst: register another callback
    engine.register(() => true);
    await vi.advanceTimersByTimeAsync(16);

    // PostTick should have continued receiving frames throughout
    expect(postTickTimestamps.length).toBeGreaterThan(countAfterFirstBurst + 1);
  });
});
