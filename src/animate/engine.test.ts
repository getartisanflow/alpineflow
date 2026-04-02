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
