import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnimationEngine } from './engine';
import type { FrameScheduler } from './engine';
import { Animator } from './animator';
import type { PropertyEntry, AnimateInternalOptions } from './animator';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Create a setTimeout-based scheduler suitable for fake-timer tests. */
function makeTimeoutScheduler(): FrameScheduler {
  return {
    request: (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as unknown as number,
    cancel: (id: number) => clearTimeout(id),
  };
}

/** Advance fake timers in 16ms steps (one frame at a time). */
async function advanceTimers(ms: number, stepMs = 16): Promise<void> {
  const steps = Math.ceil(ms / stepMs);
  for (let i = 0; i < steps; i++) {
    await vi.advanceTimersByTimeAsync(stepMs);
  }
}

/** Create a fresh AnimationEngine with timeout scheduler for tests. */
function createEngine(): AnimationEngine {
  const engine = new AnimationEngine();
  engine.setScheduler(makeTimeoutScheduler());
  return engine;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── Animator Tests ───────────────────────────────────────────────────────────

describe('Animator', () => {
  it('interpolates numeric properties over duration', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const entry: PropertyEntry = {
      key: 'x',
      from: 0,
      to: 100,
      apply: (v) => { value = v as number; },
    };

    animator.animate([entry], { duration: 160 });

    // Advance ~80ms (roughly half)
    await advanceTimers(80);
    // Mid-animation: value should be somewhere between 0 and 100
    // With easeInOut default easing the exact value varies, but it should not be 0 or 100
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);

    // Advance to completion
    await advanceTimers(160);
    expect(value).toBe(100);
  });

  it('applies values instantly when duration is 0', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    let completed = false;
    const entry: PropertyEntry = {
      key: 'x',
      from: 0,
      to: 42,
      apply: (v) => { value = v as number; },
    };

    const handle = animator.animate([entry], {
      duration: 0,
      onComplete: () => { completed = true; },
    });

    // Should be applied immediately, no timer advance needed
    expect(value).toBe(42);
    expect(completed).toBe(true);

    // finished should already be resolved
    await handle.finished;
  });

  it('blend/compose: captures in-flight value when new animation targets same key', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const apply = (v: number | string): void => { value = v as number; };

    // Start first animation: 0 -> 100 over 160ms
    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply }],
      { duration: 160, easing: 'linear' },
    );

    // Advance ~80ms (about halfway) — value should be around 50
    await advanceTimers(80);
    const midValue = value;
    expect(midValue).toBeGreaterThan(20);
    expect(midValue).toBeLessThan(80);

    // Start second animation targeting same key: current -> 200 over 160ms
    const entry2: PropertyEntry = {
      key: 'x',
      from: 0, // will be overwritten by blend/compose
      to: 200,
      apply,
    };

    animator.animate([entry2], { duration: 160, easing: 'linear' });

    // The new entry's "from" should have been captured near midValue
    expect(entry2.from).toBeGreaterThan(20);
    expect(entry2.from).toBeLessThan(80);

    // Advance to completion of second animation
    await advanceTimers(240);
    expect(value).toBe(200);
  });

  it('handle.stop() jumps to end state', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    let completed = false;
    const entry: PropertyEntry = {
      key: 'x',
      from: 0,
      to: 100,
      apply: (v) => { value = v as number; },
    };

    const handle = animator.animate([entry], {
      duration: 500,
      onComplete: () => { completed = true; },
    });

    // Advance a bit
    await advanceTimers(48);
    expect(value).toBeLessThan(100);

    // Stop should jump to end
    handle.stop();
    expect(value).toBe(100);
    expect(completed).toBe(true);

    await handle.finished;
  });

  it('handle.finished resolves when animation completes', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let resolved = false;
    const entry: PropertyEntry = {
      key: 'x',
      from: 0,
      to: 100,
      apply: () => {},
    };

    const handle = animator.animate([entry], { duration: 80 });
    handle.finished.then(() => { resolved = true; });

    await advanceTimers(48);
    // Flush microtask queue
    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(false);

    // Advance past duration
    await advanceTimers(80);
    // Flush microtask queue
    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(true);
  });

  it('loop: true restarts animation', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const values: number[] = [];
    const entry: PropertyEntry = {
      key: 'x',
      from: 0,
      to: 100,
      apply: (v) => { values.push(v as number); },
    };

    const handle = animator.animate([entry], {
      duration: 80,
      easing: 'linear',
      loop: true,
    });

    // Advance through ~3 cycles (240ms)
    await advanceTimers(240);

    // With looping, values wrap around via modulo. With 80ms duration and 16ms steps,
    // we get progress values like 0.2, 0.4, 0.6, 0.8, 0.2, 0.4... (wraps at 1.0)
    // Check we saw values increasing above 50 and then dropping back below 50
    const highValues = values.filter((v) => v > 50);
    expect(highValues.length).toBeGreaterThan(0);

    // Find values below 40 that appear AFTER a value above 50 (indicating loop reset)
    const lowAfterHigh = values.filter((v, i) => {
      const prevHigh = values.slice(0, i).some((pv) => pv > 50);
      return prevHigh && v < 40;
    });
    expect(lowAfterHigh.length).toBeGreaterThan(0);

    handle.stop();
  });

  it('loop: "reverse" ping-pongs', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const values: number[] = [];
    const entry: PropertyEntry = {
      key: 'x',
      from: 0,
      to: 100,
      apply: (v) => { values.push(v as number); },
    };

    const handle = animator.animate([entry], {
      duration: 80,
      easing: 'linear',
      loop: 'reverse',
    });

    // Advance through ~2 cycles (160ms worth)
    await advanceTimers(176);

    // In ping-pong, values should go up in first cycle and come back down in second
    // Find the peak and check that values decrease after it
    const peak = Math.max(...values);
    const peakIndex = values.indexOf(peak);
    expect(peak).toBeGreaterThan(80);

    // Values after the peak should include some that are decreasing
    const afterPeak = values.slice(peakIndex + 1);
    const decreasingValues = afterPeak.filter((v) => v < peak - 10);
    expect(decreasingValues.length).toBeGreaterThan(0);

    handle.stop();
  });

  it('stopAll() clears all animations', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let valueA = 0;
    let valueB = 0;

    animator.animate(
      [{ key: 'a', from: 0, to: 100, apply: (v) => { valueA = v as number; } }],
      { duration: 500 },
    );
    animator.animate(
      [{ key: 'b', from: 0, to: 200, apply: (v) => { valueB = v as number; } }],
      { duration: 500 },
    );

    expect(animator.active).toBe(true);

    await advanceTimers(48);

    animator.stopAll();

    expect(animator.active).toBe(false);
    expect(valueA).toBe(100);
    expect(valueB).toBe(200);
  });

  it('pause/resume works', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const entry: PropertyEntry = {
      key: 'x',
      from: 0,
      to: 100,
      apply: (v) => { value = v as number; },
    };

    const handle = animator.animate([entry], {
      duration: 160,
      easing: 'linear',
    });

    // Advance 48ms
    await advanceTimers(48);
    const valueAtPause = value;
    expect(valueAtPause).toBeGreaterThan(0);

    // Pause
    handle.pause();

    // Advance 80ms while paused
    await advanceTimers(80);
    // Value should not have changed during pause
    expect(value).toBe(valueAtPause);

    // Resume
    handle.resume();

    // Advance to what should be completion
    await advanceTimers(160);
    expect(value).toBe(100);
  });

  it('handle.reverse() changes animation direction', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const values: number[] = [];
    const handle = animator.animate(
      [{ key: 'a', from: 0, to: 100, apply: (v) => { values.push(v as number); } }],
      { duration: 160 },
    );

    // Run forward for a bit
    await advanceTimers(80);
    const midValue = values[values.length - 1];
    expect(midValue).toBeGreaterThan(20);

    // Reverse
    handle.reverse();

    // After reversing, values should decrease
    await advanceTimers(80);
    const afterReverse = values[values.length - 1];
    expect(afterReverse).toBeLessThan(midValue);

    handle.stop();
  });

  it('stopAll() fires onComplete for each group', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let completedA = false;
    let completedB = false;

    animator.animate(
      [{ key: 'a', from: 0, to: 100, apply: () => {} }],
      { duration: 500, onComplete: () => { completedA = true; } },
    );
    animator.animate(
      [{ key: 'b', from: 0, to: 200, apply: () => {} }],
      { duration: 500, onComplete: () => { completedB = true; } },
    );

    await advanceTimers(48);

    animator.stopAll();

    expect(completedA).toBe(true);
    expect(completedB).toBe(true);
  });

  it('pause before first tick is a no-op and does not corrupt timing', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const entry: PropertyEntry = {
      key: 'x',
      from: 0,
      to: 100,
      apply: (v) => { value = v as number; },
    };

    const handle = animator.animate([entry], {
      duration: 160,
      easing: 'linear',
    });

    // Pause IMMEDIATELY — before any tick has fired (startTime is still 0)
    handle.pause();

    // Advance timers; the animation should still be running because
    // _pause() is a no-op when startTime === 0
    await advanceTimers(80);

    // Value should have advanced (pause was ignored)
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);

    // Resume should also be safe (pausedAt is still null, so resume is a no-op too)
    handle.resume();

    // Advance to completion
    await advanceTimers(160);
    expect(value).toBe(100);
  });

  it('interpolates color strings', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = '';
    const entry: PropertyEntry = {
      key: 'color',
      from: '#000000',
      to: '#ffffff',
      apply: (v) => { value = v as string; },
    };

    animator.animate([entry], {
      duration: 160,
      easing: 'linear',
    });

    // Advance ~80ms (halfway)
    await advanceTimers(80);

    // Mid-value should be a color string (rgb format from d3-interpolate)
    expect(value).toBeTruthy();
    expect(typeof value).toBe('string');
    // d3-interpolateRgb returns "rgb(r, g, b)" format
    expect(value).toMatch(/^rgb\(/);

    // Advance to completion
    await advanceTimers(160);
    // Final value is the exact "to" string since we apply entry.to on completion
    expect(value).toBe('#ffffff');
  });

  it('onStart fires on the first tick', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let started = false;
    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 500, onStart: () => { started = true; } },
    );

    expect(started).toBe(false);
    await advanceTimers(16);
    expect(started).toBe(true);
  });

  it('onStart fires after delay elapses', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let started = false;
    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 500, delay: 200, onStart: () => { started = true; } },
    );

    await advanceTimers(100);
    expect(started).toBe(false);
    await advanceTimers(200);
    expect(started).toBe(true);
  });

  it('onStart fires only once', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let count = 0;
    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 500, onStart: () => { count++; } },
    );

    await advanceTimers(16);
    await advanceTimers(16);
    await advanceTimers(16);
    expect(count).toBe(1);
  });

  it('onStart fires immediately for duration 0', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let started = false;
    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 0, onStart: () => { started = true; } },
    );

    expect(started).toBe(true);
  });

  it('pause/resume uses engine-relative time, not wall-clock', async () => {
    // Use a custom scheduler that passes its own counter as `elapsed`,
    // independent of performance.now(). This lets us simulate the engine
    // elapsed diverging from wall-clock time.
    let engineElapsed = 0;
    let scheduledCb: FrameRequestCallback | null = null;

    const detachedScheduler: FrameScheduler = {
      request: (cb) => {
        scheduledCb = cb;
        return 1;
      },
      cancel: () => {
        scheduledCb = null;
      },
    };

    /** Advance engine by `ms`, firing as many 16ms frames as needed. */
    function driveEngine(ms: number): void {
      const target = engineElapsed + ms;
      while (engineElapsed < target && scheduledCb) {
        engineElapsed = Math.min(engineElapsed + 16, target);
        const cb = scheduledCb;
        scheduledCb = null;
        cb(engineElapsed);
      }
    }

    const engine = new AnimationEngine();
    engine.setScheduler(detachedScheduler);
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 1000, easing: 'linear' },
    );

    // Advance ~500ms of engine time (roughly 50% through)
    driveEngine(500);
    const valueAtPause = value;
    expect(valueAtPause).toBeGreaterThan(40);
    expect(valueAtPause).toBeLessThan(60);

    // Pause the animation
    handle.pause();

    // Simulate wall-clock advancing 2000ms — but we do NOT drive the engine.
    // This diverges wall-clock from engine time. If pause used performance.now()
    // those 2000ms would corrupt startTime on resume.
    engineElapsed += 2000;

    // Resume
    handle.resume();

    // Drive one frame so the resume adjustment is applied
    driveEngine(16);

    // The animation should still be at ~50%, not jumped to completion
    expect(value).toBeGreaterThan(40);
    expect(value).toBeLessThan(60);

    // Advance another ~600ms of engine time so the animation reaches completion
    driveEngine(600);
    expect(value).toBe(100);
  });
});

describe('Animator — per-handle snapshot', () => {
  it('captures from-values at animate() time as _snapshot', () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const handle = animator.animate(
      [{ key: 'x', from: 50, to: 200, apply: () => {} }],
      { duration: 500 },
    );

    expect(handle._snapshot.get('x')).toBe(50);
  });

  it('captures target values as _target', () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 500 },
    );

    expect(handle._target.get('x')).toBe(100);
  });

  it('preserves snapshot after animation completes', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const handle = animator.animate(
      [{ key: 'x', from: 10, to: 90, apply: () => {} }],
      { duration: 80 },
    );

    // Advance past duration to complete the animation
    await advanceTimers(160);
    await handle.finished;

    // Maps must survive after completion
    expect(handle._snapshot.get('x')).toBe(10);
    expect(handle._target.get('x')).toBe(90);
  });

  it('captures in-flight value in new handle snapshot during blend/compose', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const apply = (v: number | string): void => { value = v as number; };

    // Animate x from 0 → 100 over 160ms with linear easing
    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply }],
      { duration: 160, easing: 'linear' },
    );

    // Advance ~80ms to reach ~50%
    await advanceTimers(80);
    const midValue = value;
    expect(midValue).toBeGreaterThan(20);
    expect(midValue).toBeLessThan(80);

    // Start a new animation on the same key; blend/compose will capture mid-value as new from
    const handle2 = animator.animate(
      [{ key: 'x', from: 0, to: 200, apply }],
      { duration: 160, easing: 'linear' },
    );

    // The new handle's snapshot should reflect the captured mid-flight value
    expect(handle2._snapshot.get('x')).toBeGreaterThan(20);
    expect(handle2._snapshot.get('x')).toBeLessThan(80);
    expect(handle2._target.get('x')).toBe(200);

    handle2.stop();
  });

  it('provides snapshot and target for duration-0 instant animations', () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const handle = animator.animate(
      [{ key: 'y', from: 5, to: 75, apply: () => {} }],
      { duration: 0 },
    );

    expect(handle._snapshot.get('y')).toBe(5);
    expect(handle._target.get('y')).toBe(75);
  });
});

describe('Animator — configurable stop modes', () => {
  it('stop() defaults to jump-end (existing behavior)', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 500, easing: 'linear' },
    );

    // Advance to ~50%
    await advanceTimers(250);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);

    handle.stop();
    expect(value).toBe(100);
  });

  it('stop({ mode: "rollback" }) reverts to snapshot values', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 500, easing: 'linear' },
    );

    // Advance to ~50%
    await advanceTimers(250);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);

    handle.stop({ mode: 'rollback' });
    expect(value).toBe(0);
  });

  it('stop({ mode: "freeze" }) leaves at current value', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 500, easing: 'linear' },
    );

    // Advance to ~50%
    await advanceTimers(250);
    const frozenAt = value;
    expect(frozenAt).toBeGreaterThan(0);
    expect(frozenAt).toBeLessThan(100);

    handle.stop({ mode: 'freeze' });
    // Value should remain exactly where it was
    expect(value).toBe(frozenAt);
  });

  it('stopAll({ mode: "rollback" }) reverts all animations', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let valueA = 50;
    let valueB = 200;

    animator.animate(
      [{ key: 'a', from: 50, to: 150, apply: (v) => { valueA = v as number; } }],
      { duration: 500, easing: 'linear' },
    );
    animator.animate(
      [{ key: 'b', from: 200, to: 400, apply: (v) => { valueB = v as number; } }],
      { duration: 500, easing: 'linear' },
    );

    // Advance partway
    await advanceTimers(250);
    expect(valueA).toBeGreaterThan(50);
    expect(valueB).toBeGreaterThan(200);

    animator.stopAll({ mode: 'rollback' });

    expect(valueA).toBe(50);
    expect(valueB).toBe(200);
    expect(animator.active).toBe(false);
  });

  it('blend/compose uses superseded mode (no onComplete)', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const onComplete = vi.fn();

    // Start first animation with onComplete spy
    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 500, easing: 'linear', onComplete },
    );

    // Advance partway so the first group has a current value
    await advanceTimers(250);

    // Start second animation on the same key — steals ownership, supersedes first
    animator.animate(
      [{ key: 'x', from: 0, to: 200, apply: () => {} }],
      { duration: 500, easing: 'linear' },
    );

    // onComplete should NOT have been called (superseded, not a consumer stop)
    expect(onComplete).not.toHaveBeenCalled();

    // Advance to completion of second animation
    await advanceTimers(500);
  });
});

describe('Animator — direction state machine', () => {
  it('handle.direction starts as "forward"', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 160 },
    );

    expect(handle.direction).toBe('forward');
    handle.stop();
  });

  it('handle.isFinished is true when animation reaches endpoint', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 80 },
    );

    expect(handle.isFinished).toBe(false);

    // Advance past duration
    await advanceTimers(160);
    await handle.finished;

    expect(handle.isFinished).toBe(true);
  });

  it('reverse() on a finished handle plays backward to snapshot', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 80, easing: 'linear' },
    );

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;
    expect(handle.isFinished).toBe(true);
    expect(value).toBe(100);

    // Reverse the finished handle
    handle.reverse();
    expect(handle.direction).toBe('backward');
    expect(handle.isFinished).toBe(false);

    // Advance to completion of backward animation
    await advanceTimers(160);
    await handle.finished;

    // Should be back at snapshot value
    expect(value).toBe(0);
    expect(handle.isFinished).toBe(true);
  });

  it('restart() resets to snapshot and plays forward again', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 80, easing: 'linear' },
    );

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(100);

    // Restart
    handle.restart();
    expect(handle.direction).toBe('forward');
    expect(handle.isFinished).toBe(false);

    // Value should be reset to snapshot
    expect(value).toBe(0);

    // Advance to completion again
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(100);
  });

  it('restart({ direction: "backward" }) resets to target and plays backward', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 80, easing: 'linear' },
    );

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(100);

    // Restart backward
    handle.restart({ direction: 'backward' });
    expect(handle.direction).toBe('backward');

    // Value should be at target (reset for backward play)
    expect(value).toBe(100);

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(0);
  });

  it('playBackward() sets direction and plays from current position', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 80, easing: 'linear' },
    );

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(100);

    // playBackward from finished state
    handle.playBackward();
    expect(handle.direction).toBe('backward');
    expect(handle.isFinished).toBe(false);

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(0);
  });

  it('playForward() sets direction and plays from current position', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 80, easing: 'linear' },
    );

    // Advance to completion, then reverse to finish backward
    await advanceTimers(160);
    await handle.finished;
    handle.reverse();
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(0);
    expect(handle.direction).toBe('backward');

    // Now playForward from the backward-finished state
    handle.playForward();
    expect(handle.direction).toBe('forward');
    expect(handle.isFinished).toBe(false);

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(100);
  });

  it('play() on a finished handle restarts in current direction', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 80, easing: 'linear' },
    );

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(100);
    expect(handle.isFinished).toBe(true);

    // play() on finished restarts in current (forward) direction
    handle.play();
    expect(handle.isFinished).toBe(false);

    // Advance to completion again
    await advanceTimers(160);
    await handle.finished;
    expect(value).toBe(100);
  });

  it('play() on a paused handle resumes', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 160, easing: 'linear' },
    );

    // Advance partway and pause
    await advanceTimers(48);
    const midValue = value;
    expect(midValue).toBeGreaterThan(0);
    handle.pause();

    // Advance while paused — value should not change
    await advanceTimers(80);
    expect(value).toBe(midValue);

    // play() should resume
    handle.play();

    // Advance to completion
    await advanceTimers(160);
    expect(value).toBe(100);
  });

  it('loop "ping-pong" works as an alias for "reverse"', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const values: number[] = [];
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { values.push(v as number); } }],
      { duration: 80, easing: 'linear', loop: 'ping-pong' },
    );

    // Advance through ~2 cycles (160ms)
    await advanceTimers(176);

    // Should ping-pong just like loop: 'reverse'
    const peak = Math.max(...values);
    const peakIndex = values.indexOf(peak);
    expect(peak).toBeGreaterThan(80);

    // Values after the peak should include some that are decreasing
    const afterPeak = values.slice(peakIndex + 1);
    const decreasingValues = afterPeak.filter((v) => v < peak - 10);
    expect(decreasingValues.length).toBeGreaterThan(0);

    handle.stop();
  });

  it('startAt "end" starts at target with backward direction', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 80, easing: 'linear', startAt: 'end' },
    );

    // Should immediately be at target
    expect(value).toBe(100);
    expect(handle.direction).toBe('backward');

    // Advance to completion
    await advanceTimers(160);
    await handle.finished;

    // Should be at snapshot value
    expect(value).toBe(0);
  });

  it('currentValue reflects latest interpolated state', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 160, easing: 'linear' },
    );

    // Initially at start
    expect(handle.currentValue.get('x')).toBe(0);

    // Advance partway
    await advanceTimers(80);
    const cv = handle.currentValue.get('x') as number;
    expect(cv).toBeGreaterThan(0);
    expect(cv).toBeLessThan(100);
    // currentValue should match what was applied
    expect(cv).toBe(value);

    handle.stop();
  });

  it('reverse() mid-animation flips direction smoothly', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 160, easing: 'linear' },
    );

    // Advance to ~50%
    await advanceTimers(80);
    const midValue = value;
    expect(midValue).toBeGreaterThan(20);
    expect(midValue).toBeLessThan(80);
    expect(handle.direction).toBe('forward');

    // Reverse mid-flight
    handle.reverse();
    expect(handle.direction).toBe('backward');

    // Advance — value should head back toward 0
    await advanceTimers(80);
    expect(value).toBeLessThan(midValue);

    handle.stop();
  });

  it('finished promise renews after reverse() on finished handle', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let value = 0;
    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { value = v as number; } }],
      { duration: 80, easing: 'linear' },
    );

    // Complete forward
    await advanceTimers(160);
    const firstFinished = handle.finished;
    await firstFinished;

    // Reverse
    handle.reverse();

    // New finished promise should be different from the old one
    const secondFinished = handle.finished;
    expect(secondFinished).not.toBe(firstFinished);

    // Complete backward
    await advanceTimers(160);
    await secondFinished;
    expect(value).toBe(0);
    expect(handle.isFinished).toBe(true);
  });
});
