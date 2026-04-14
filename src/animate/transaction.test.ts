import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnimationEngine } from './engine';
import type { FrameScheduler } from './engine';
import { Animator } from './animator';
import type { PropertyEntry } from './animator';
import { Transaction } from './transaction';

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

// ── Transaction Tests ────────────────────────────────────────────────────────

describe('Transaction', () => {
  it('tracks handles created during the transaction', () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const tx = animator.beginTransaction();

    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 500 },
    );
    animator.animate(
      [{ key: 'y', from: 0, to: 200, apply: () => {} }],
      { duration: 500 },
    );

    animator.endTransaction();

    expect(tx.handles).toHaveLength(2);
  });

  it('rollback() stops all tracked handles with freeze', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let x = 0;
    const tx = animator.beginTransaction();

    const handle = animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: (v) => { x = v as number; } }],
      { duration: 500, easing: 'linear' },
    );

    animator.endTransaction();

    // Advance partway
    await advanceTimers(160);
    const frozenValue = x;
    expect(frozenValue).toBeGreaterThan(0);
    expect(frozenValue).toBeLessThan(100);

    tx.rollback();

    // After rollback, x should be reverted to pre-transaction value (0), not frozen
    expect(x).toBe(0);

    // Handle should be finished (stopped)
    expect(handle.isFinished).toBe(false); // freeze mode doesn't set isFinished on the group directly
  });

  it('rollback() reverts properties to pre-transaction values', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let x = 50;
    const tx = animator.beginTransaction();

    animator.animate(
      [{ key: 'x', from: 50, to: 200, apply: (v) => { x = v as number; } }],
      { duration: 500, easing: 'linear' },
    );

    animator.endTransaction();

    // Advance halfway
    await advanceTimers(256);
    expect(x).toBeGreaterThan(50);
    expect(x).toBeLessThan(200);

    tx.rollback();
    expect(x).toBe(50); // reverted to pre-transaction value
  });

  it('onAfterRollback() fires after property reverts with the reverted keys', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let x = 50;
    const tx = animator.beginTransaction();

    animator.animate(
      [{ key: 'node:a:position.x', from: 50, to: 200, apply: (v) => { x = v as number; } }],
      { duration: 500, easing: 'linear' },
    );
    animator.endTransaction();
    await advanceTimers(100);

    let observed: string[] = [];
    let xAtCallback: number | null = null;
    tx.onAfterRollback((keys) => {
      observed = keys;
      xAtCallback = x;
    });

    tx.rollback();

    expect(observed).toEqual(['node:a:position.x']);
    expect(xAtCallback).toBe(50); // reverts have already run when callback fires
  });

  it('onAfterRollback() is not called when rollback is a no-op (already settled)', () => {
    const tx = new Transaction();
    const cb = vi.fn();
    tx.onAfterRollback(cb);
    tx.commit();
    tx.rollback();
    expect(cb).not.toHaveBeenCalled();
  });

  it('commit() releases the transaction', () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const tx = animator.beginTransaction();

    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 500 },
    );

    animator.endTransaction();

    tx.commit();
    expect(tx.state).toBe('committed');
  });

  it('lazy capture: only snapshots a property the first time', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let x = 10;
    const apply = (v: number | string): void => { x = v as number; };

    const tx = animator.beginTransaction();

    // First animate: x from 10 -> 100
    animator.animate(
      [{ key: 'x', from: 10, to: 100, apply }],
      { duration: 200, easing: 'linear' },
    );

    // Advance a bit so x is in-flight
    await advanceTimers(96);
    const midValue = x;
    expect(midValue).toBeGreaterThan(10);

    // Second animate targeting same key — blend/compose captures in-flight value
    animator.animate(
      [{ key: 'x', from: 0, to: 300, apply }],
      { duration: 200, easing: 'linear' },
    );

    animator.endTransaction();

    // Advance partway through second animation
    await advanceTimers(96);

    // Rollback should revert to 10 (first captured value), not the blended mid-value
    tx.rollback();
    expect(x).toBe(10);
  });

  it('state is active during transaction, rolled-back after rollback', () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const tx = animator.beginTransaction();
    expect(tx.state).toBe('active');

    animator.endTransaction();

    tx.rollback();
    expect(tx.state).toBe('rolled-back');
  });

  it('finished promise resolves on commit', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const tx = animator.beginTransaction();
    animator.endTransaction();

    let resolved = false;
    tx.finished.then(() => { resolved = true; });

    tx.commit();

    // Flush microtask queue
    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(true);
  });

  it('finished promise resolves on rollback', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const tx = animator.beginTransaction();
    animator.endTransaction();

    let resolved = false;
    tx.finished.then(() => { resolved = true; });

    tx.rollback();

    // Flush microtask queue
    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(true);
  });

  it('ignores handles created after endTransaction', () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    const tx = animator.beginTransaction();

    animator.animate(
      [{ key: 'x', from: 0, to: 100, apply: () => {} }],
      { duration: 500 },
    );

    animator.endTransaction();

    // This animate call happens after endTransaction — should NOT be tracked
    animator.animate(
      [{ key: 'y', from: 0, to: 200, apply: () => {} }],
      { duration: 500 },
    );

    expect(tx.handles).toHaveLength(1);
  });

  it('does not capture properties or track handles after commit', async () => {
    const tx = new Transaction();

    tx.commit();

    // These should be no-ops after commit
    const mockHandle = {
      pause: () => {},
      resume: () => {},
      stop: () => {},
      reverse: () => {},
      play: () => {},
      playForward: () => {},
      playBackward: () => {},
      restart: () => {},
      direction: 'forward' as const,
      isFinished: false,
      currentValue: new Map(),
      finished: Promise.resolve(),
      _snapshot: new Map(),
      _target: new Map(),
    };

    tx.trackHandle(mockHandle);
    tx.captureProperty('x', 42, () => {});

    expect(tx.handles).toHaveLength(0);
  });

  it('does not capture properties or track handles after rollback', () => {
    const tx = new Transaction();

    tx.rollback();

    const mockHandle = {
      pause: () => {},
      resume: () => {},
      stop: () => {},
      reverse: () => {},
      play: () => {},
      playForward: () => {},
      playBackward: () => {},
      restart: () => {},
      direction: 'forward' as const,
      isFinished: false,
      currentValue: new Map(),
      finished: Promise.resolve(),
      _snapshot: new Map(),
      _target: new Map(),
    };

    tx.trackHandle(mockHandle);
    tx.captureProperty('x', 42, () => {});

    expect(tx.handles).toHaveLength(0);
  });

  it('rollback is idempotent — second call is a no-op', () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let x = 50;
    const tx = animator.beginTransaction();

    animator.animate(
      [{ key: 'x', from: 50, to: 200, apply: (v) => { x = v as number; } }],
      { duration: 500 },
    );

    animator.endTransaction();

    tx.rollback();
    expect(tx.state).toBe('rolled-back');
    expect(x).toBe(50);

    // Mutate x to prove second rollback doesn't re-apply
    x = 999;
    tx.rollback();
    expect(x).toBe(999); // unchanged — second rollback is a no-op
  });

  it('commit is idempotent — second call is a no-op', () => {
    const tx = new Transaction();
    tx.commit();
    expect(tx.state).toBe('committed');

    // Should not throw or change state
    tx.commit();
    expect(tx.state).toBe('committed');
  });

  it('rollback reverts multiple properties', async () => {
    const engine = createEngine();
    const animator = new Animator(engine);

    let x = 10;
    let y = 20;

    const tx = animator.beginTransaction();

    animator.animate(
      [
        { key: 'x', from: 10, to: 100, apply: (v) => { x = v as number; } },
        { key: 'y', from: 20, to: 200, apply: (v) => { y = v as number; } },
      ],
      { duration: 500, easing: 'linear' },
    );

    animator.endTransaction();

    await advanceTimers(160);
    expect(x).toBeGreaterThan(10);
    expect(y).toBeGreaterThan(20);

    tx.rollback();
    expect(x).toBe(10);
    expect(y).toBe(20);
  });
});
