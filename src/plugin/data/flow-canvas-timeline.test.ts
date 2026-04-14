import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FlowTimeline } from '../../animate/timeline';
import type { AnimateTargets, AnimateOptions, FlowAnimationHandle } from '../../core/types';
import { resolveEasing } from '../../animate/easing';
import { lerpNumber } from '../../animate/interpolators';
import { AnimationEngine } from '../../animate/engine';

function makeRefCountedCanvas() {
  const nodes = [
    { id: 'a', position: { x: 0, y: 0 }, data: {} },
    { id: 'b', position: { x: 100, y: 100 }, data: {} },
  ];
  const edges: any[] = [];
  const mockEngine = new AnimationEngine();

  const canvas = {
    nodes,
    edges,
    getNode: (id: string) => nodes.find((n) => n.id === id),
    getEdge: (id: string) => edges.find((e: any) => e.id === id),

    animate(targets: AnimateTargets, options: AnimateOptions = {}): FlowAnimationHandle {
      const duration = options.duration ?? 300;
      const easing = resolveEasing(options.easing);
      const delay = options.delay ?? 0;

      if (duration === 0) {
        if (targets.nodes) {
          for (const [id, target] of Object.entries(targets.nodes)) {
            const node = canvas.getNode(id);
            if (!node) continue;
            if (target.position?.x !== undefined) node.position.x = target.position.x;
            if (target.position?.y !== undefined) node.position.y = target.position.y;
          }
        }
        options.onProgress?.(1);
        options.onComplete?.();
        return {
          pause() {}, resume() {}, stop() {}, reverse() {},
          play() {}, playForward() {}, playBackward() {}, restart() {},
          get direction(): 'forward' | 'backward' { return 'forward'; },
          get isFinished() { return true; },
          get currentValue() { return new Map(); },
          finished: Promise.resolve(),
        };
      }

      let resolveFinished: () => void;
      const finished = new Promise<void>((r) => { resolveFinished = r; });
      let stopped = false;

      const nodeFromPositions: Record<string, { x: number; y: number }> = {};
      if (targets.nodes) {
        for (const [id, target] of Object.entries(targets.nodes)) {
          const node = canvas.getNode(id);
          if (!node) continue;
          if (target.position) nodeFromPositions[id] = { ...node.position };
        }
      }

      const handle = mockEngine.register((elapsed) => {
        if (stopped) return true;
        const rawProgress = Math.min(elapsed / duration, 1);
        const progress = easing(rawProgress);

        if (targets.nodes) {
          for (const [id, target] of Object.entries(targets.nodes)) {
            const node = canvas.getNode(id);
            if (!node) continue;
            if (target.position && nodeFromPositions[id]) {
              const from = nodeFromPositions[id];
              if (target.position.x !== undefined) node.position.x = lerpNumber(from.x, target.position.x, progress);
              if (target.position.y !== undefined) node.position.y = lerpNumber(from.y, target.position.y, progress);
            }
          }
        }

        options.onProgress?.(rawProgress);
        if (rawProgress >= 1) {
          options.onComplete?.();
          resolveFinished!();
          return true;
        }
        return false;
      }, delay);

      return {
        pause() {}, resume() {},
        stop() {
          stopped = true;
          handle.stop();
          options.onComplete?.();
          resolveFinished!();
        },
        reverse() {},
        play() {}, playForward() {}, playBackward() {}, restart() {},
        get direction(): 'forward' | 'backward' { return 'forward'; },
        get isFinished() { return stopped; },
        get currentValue() { return new Map(); },
        get finished() { return finished; },
      };
    },

    _activeTimelines: new Set<FlowTimeline>(),
    _animationLocked: false,
    _historyActive: true,

    _suspendHistory() { this._historyActive = false; },
    _resumeHistory() { this._historyActive = true; },

    _syncAnimationState() {
      const anyLocked = [...this._activeTimelines].some((tl) => tl.locked);
      this._animationLocked = anyLocked;
      if (this._activeTimelines.size === 0) {
        this._resumeHistory();
      } else {
        this._suspendHistory();
      }
    },

    timeline(): FlowTimeline {
      const tl = new FlowTimeline(this as any);
      tl.on('play', () => {
        this._activeTimelines.add(tl);
        this._syncAnimationState();
      });
      tl.on('resume', () => {
        this._activeTimelines.add(tl);
        this._syncAnimationState();
      });
      for (const event of ['pause', 'stop', 'complete'] as const) {
        tl.on(event, () => {
          this._activeTimelines.delete(tl);
          this._syncAnimationState();
        });
      }
      return tl;
    },
  };

  return canvas;
}

async function advanceTimers(ms: number, stepMs = 16): Promise<void> {
  const steps = Math.ceil(ms / stepMs) + 1;
  for (let i = 0; i < steps; i++) {
    await vi.advanceTimersByTimeAsync(stepMs);
  }
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('Concurrent timeline ref-counting', () => {
  it('history stays suspended while any timeline is playing', async () => {
    const canvas = makeRefCountedCanvas();
    const tl1 = canvas.timeline();
    const tl2 = canvas.timeline();

    tl1.step({ nodes: ['a'], position: { x: 50 }, duration: 200 });
    tl2.step({ nodes: ['b'], position: { x: 50 }, duration: 400 });

    tl1.play();
    tl2.play();

    expect(canvas._historyActive).toBe(false);
    expect(canvas._activeTimelines.size).toBe(2);

    await advanceTimers(300);
    expect(canvas._activeTimelines.size).toBe(1);
    expect(canvas._historyActive).toBe(false);

    await advanceTimers(300);
    expect(canvas._activeTimelines.size).toBe(0);
    expect(canvas._historyActive).toBe(true);
  });

  it('lock reflects any locked timeline', async () => {
    const canvas = makeRefCountedCanvas();
    const tl1 = canvas.timeline();
    const tl2 = canvas.timeline();

    tl1.lock().step({ nodes: ['a'], position: { x: 50 }, duration: 100 });
    tl2.step({ nodes: ['b'], position: { x: 50 }, duration: 100 });

    tl1.play();
    tl2.play();

    expect(canvas._animationLocked).toBe(true);
  });

  it('stop removes timeline from active set', () => {
    const canvas = makeRefCountedCanvas();
    const tl = canvas.timeline();
    tl.step({ nodes: ['a'], position: { x: 50 }, duration: 1000 });
    tl.play();
    expect(canvas._activeTimelines.size).toBe(1);
    tl.stop();
    expect(canvas._activeTimelines.size).toBe(0);
    expect(canvas._historyActive).toBe(true);
  });
});
