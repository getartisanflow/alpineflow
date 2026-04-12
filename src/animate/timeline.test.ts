import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FlowTimeline } from './timeline';
import type { FlowNode, FlowEdge, AnimateTargets, AnimateOptions, FlowAnimationHandle } from '../core/types';
import { resolveEasing } from './easing';
import { lerpNumber, interpolateColor, parseStyle, interpolateStyle } from './interpolators';
import { AnimationEngine } from './engine';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeNodes(): FlowNode[] {
  return [
    { id: 'a', position: { x: 0, y: 0 }, data: {} },
    { id: 'b', position: { x: 100, y: 100 }, data: {} },
    { id: 'c', position: { x: 200, y: 200 }, data: {} },
  ];
}

function makeEdges(): FlowEdge[] {
  return [
    { id: 'e1', source: 'a', target: 'b', color: '#000000', strokeWidth: 1 },
  ];
}

interface MockCanvas {
  nodes: FlowNode[];
  edges: FlowEdge[];
  getNode: (id: string) => FlowNode | undefined;
  getEdge: (id: string) => FlowEdge | undefined;
  animate: (targets: AnimateTargets, options?: AnimateOptions) => FlowAnimationHandle;
  viewport?: { x: number; y: number; zoom: number };
  debug?: boolean;
}

function makeMockCanvas(): MockCanvas {
  const nodes = makeNodes();
  const edges = makeEdges();
  const mockEngine = new AnimationEngine();

  const canvas: MockCanvas = {
    nodes,
    edges,
    getNode: (id: string) => nodes.find((n) => n.id === id),
    getEdge: (id: string) => edges.find((e) => e.id === id),
    animate(targets: AnimateTargets, options: AnimateOptions = {}): FlowAnimationHandle {
      const duration = options.duration ?? 300;
      const easing = resolveEasing(options.easing);
      const delay = options.delay ?? 0;

      // Instant case (duration === 0)
      if (duration === 0) {
        if (targets.nodes) {
          for (const [id, target] of Object.entries(targets.nodes)) {
            const node = canvas.getNode(id);
            if (!node) continue;
            if (target.position?.x !== undefined) node.position.x = target.position.x;
            if (target.position?.y !== undefined) node.position.y = target.position.y;
            if (target.class !== undefined) node.class = target.class;
            if (target.data !== undefined) Object.assign(node.data, target.data);
            if (target.selected !== undefined) node.selected = target.selected;
            if (target.zIndex !== undefined) node.zIndex = target.zIndex;
            if (target.dimensions) {
              if (!node.dimensions) node.dimensions = { width: 0, height: 0 };
              if (target.dimensions.width !== undefined) node.dimensions.width = target.dimensions.width;
              if (target.dimensions.height !== undefined) node.dimensions.height = target.dimensions.height;
            }
            if (target.style !== undefined) node.style = target.style;
          }
        }
        if (targets.edges) {
          for (const [id, target] of Object.entries(targets.edges)) {
            const edge = canvas.getEdge(id);
            if (!edge) continue;
            if (target.color !== undefined && typeof target.color === 'string') edge.color = target.color;
            if (target.strokeWidth !== undefined) edge.strokeWidth = target.strokeWidth;
            if (target.label !== undefined) edge.label = target.label;
            if (target.animated !== undefined) edge.animated = target.animated;
            if (target.class !== undefined) edge.class = target.class;
          }
        }
        if (targets.viewport && canvas.viewport) {
          if (targets.viewport.pan?.x !== undefined) canvas.viewport.x = targets.viewport.pan.x;
          if (targets.viewport.pan?.y !== undefined) canvas.viewport.y = targets.viewport.pan.y;
          if (targets.viewport.zoom !== undefined) canvas.viewport.zoom = targets.viewport.zoom;
        }
        options.onProgress?.(1);
        options.onComplete?.();
        return {
          pause() {},
          resume() {},
          stop() {},
          reverse() {},
          play() {},
          playForward() {},
          playBackward() {},
          restart() {},
          get direction(): 'forward' | 'backward' { return 'forward'; },
          get isFinished() { return true; },
          get currentValue() { return new Map(); },
          finished: Promise.resolve(),
        };
      }

      // Animated case — use engine for timing
      let resolveFinished: () => void;
      const finished = new Promise<void>((r) => { resolveFinished = r; });
      let stopped = false;

      // Capture "from" values for nodes
      const nodeFromPositions: Record<string, { x: number; y: number }> = {};
      const nodeFromDimensions: Record<string, { width: number; height: number }> = {};
      const nodeFromStyles: Record<string, Record<string, string>> = {};

      if (targets.nodes) {
        for (const [id, target] of Object.entries(targets.nodes)) {
          const node = canvas.getNode(id);
          if (!node) continue;
          if (target.position) nodeFromPositions[id] = { ...node.position };
          if (target.dimensions && node.dimensions) nodeFromDimensions[id] = { ...node.dimensions };
          if (target.style && node.style) nodeFromStyles[id] = parseStyle(node.style) as Record<string, string>;
        }
      }

      // Capture "from" values for edges
      const edgeFromColors: Record<string, string> = {};
      const edgeFromStrokeWidths: Record<string, number> = {};

      if (targets.edges) {
        for (const [id, target] of Object.entries(targets.edges)) {
          const edge = canvas.getEdge(id);
          if (!edge) continue;
          if (target.color !== undefined && typeof edge.color === 'string') edgeFromColors[id] = edge.color;
          if (target.strokeWidth !== undefined && edge.strokeWidth !== undefined) edgeFromStrokeWidths[id] = edge.strokeWidth;
        }
      }

      // Capture "from" viewport
      let viewportFrom: { x: number; y: number; zoom: number } | null = null;
      if (targets.viewport && canvas.viewport) {
        viewportFrom = { ...canvas.viewport };
      }

      const handle = mockEngine.register((elapsed) => {
        if (stopped) return true;

        const rawProgress = Math.min(elapsed / duration, 1);
        const progress = easing(rawProgress);

        // Interpolate node positions
        if (targets.nodes) {
          for (const [id, target] of Object.entries(targets.nodes)) {
            const node = canvas.getNode(id);
            if (!node) continue;

            if (target.position && nodeFromPositions[id]) {
              const from = nodeFromPositions[id];
              if (target.position.x !== undefined) {
                node.position.x = lerpNumber(from.x, target.position.x, progress);
              }
              if (target.position.y !== undefined) {
                node.position.y = lerpNumber(from.y, target.position.y, progress);
              }
            }

            if (target.dimensions && nodeFromDimensions[id] && node.dimensions) {
              const from = nodeFromDimensions[id];
              if (target.dimensions.width !== undefined) {
                node.dimensions.width = lerpNumber(from.width, target.dimensions.width, progress);
              }
              if (target.dimensions.height !== undefined) {
                node.dimensions.height = lerpNumber(from.height, target.dimensions.height, progress);
              }
            }

            if (target.style && nodeFromStyles[id]) {
              const toStyle = parseStyle(target.style as string | Record<string, string>);
              node.style = interpolateStyle(nodeFromStyles[id], toStyle as Record<string, string>, progress);
            }

            // Instant properties at completion
            if (rawProgress >= 1) {
              if (target.class !== undefined) node.class = target.class;
              if (target.data !== undefined) Object.assign(node.data, target.data);
              if (target.selected !== undefined) node.selected = target.selected;
              if (target.zIndex !== undefined) node.zIndex = target.zIndex;
            }
          }
        }

        // Interpolate edge properties
        if (targets.edges) {
          for (const [id, target] of Object.entries(targets.edges)) {
            const edge = canvas.getEdge(id);
            if (!edge) continue;

            if (target.color !== undefined && typeof target.color === 'string' && edgeFromColors[id]) {
              edge.color = interpolateColor(edgeFromColors[id], target.color, progress);
            }
            if (target.strokeWidth !== undefined && edgeFromStrokeWidths[id] !== undefined) {
              edge.strokeWidth = lerpNumber(edgeFromStrokeWidths[id], target.strokeWidth, progress);
            }

            if (rawProgress >= 1) {
              if (target.label !== undefined) edge.label = target.label;
              if (target.animated !== undefined) edge.animated = target.animated;
              if (target.class !== undefined) edge.class = target.class;
            }
          }
        }

        // Interpolate viewport
        if (targets.viewport && viewportFrom && canvas.viewport) {
          if (targets.viewport.pan?.x !== undefined) {
            canvas.viewport.x = lerpNumber(viewportFrom.x, targets.viewport.pan.x, progress);
          }
          if (targets.viewport.pan?.y !== undefined) {
            canvas.viewport.y = lerpNumber(viewportFrom.y, targets.viewport.pan.y, progress);
          }
          if (targets.viewport.zoom !== undefined) {
            canvas.viewport.zoom = lerpNumber(viewportFrom.zoom, targets.viewport.zoom, progress);
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
        pause() {},
        resume() {},
        stop() {
          stopped = true;
          handle.stop();
          // Apply final values
          if (targets.nodes) {
            for (const [id, target] of Object.entries(targets.nodes)) {
              const node = canvas.getNode(id);
              if (!node) continue;
              if (target.position?.x !== undefined) node.position.x = target.position.x;
              if (target.position?.y !== undefined) node.position.y = target.position.y;
            }
          }
          options.onComplete?.();
          resolveFinished!();
        },
        reverse() {},
        play() {},
        playForward() {},
        playBackward() {},
        restart() {},
        get direction(): 'forward' | 'backward' { return 'forward'; },
        get isFinished() { return stopped; },
        get currentValue() { return new Map(); },
        get finished() { return finished; },
      };
    },
  };

  return canvas;
}

/**
 * Advance fake timers while flushing microtasks between ticks.
 * This is essential because the timeline uses async/await — step completion
 * resolves promises (microtasks) that schedule the next step's setTimeout.
 */
async function advanceTimers(ms: number, stepMs = 16): Promise<void> {
  const steps = Math.ceil(ms / stepMs) + 1;
  for (let i = 0; i < steps; i++) {
    await vi.advanceTimersByTimeAsync(stepMs);
  }
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── State machine ────────────────────────────────────────────────────────────

describe('FlowTimeline state', () => {
  it('starts in idle state', () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    expect(tl.state).toBe('idle');
  });

  it('transitions to playing on play()', () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 50 }, duration: 100 });
    tl.play();
    expect(tl.state).toBe('playing');
  });

  it('transitions to stopped on stop()', () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 50 }, duration: 100 });
    tl.play();
    tl.stop();
    expect(tl.state).toBe('stopped');
  });

  it('transitions back to idle after all steps complete', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 50 }, duration: 100 });
    const done = tl.play();
    await advanceTimers(200);
    await done;
    expect(tl.state).toBe('idle');
  });
});

// ── Step sequencing ──────────────────────────────────────────────────────────

describe('FlowTimeline step sequencing', () => {
  it('animates a single node position', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 300, y: 100 }, duration: 100 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    const nodeA = canvas.getNode('a')!;
    expect(nodeA.position.x).toBe(300);
    expect(nodeA.position.y).toBe(100);
  });

  it('plays steps sequentially', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 100 });
    tl.step({ nodes: ['b'], position: { x: 200 }, duration: 100 });
    const done = tl.play();
    await advanceTimers(400);
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(100);
    expect(canvas.getNode('b')!.position.x).toBe(200);
  });

  it('handles instant steps (duration: 0)', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 500 }, duration: 0 });
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(500);
  });

  it('applies class changes instantly', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], class: 'highlight', duration: 0 });
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getNode('a')!.class).toBe('highlight');
  });

  it('applies data changes', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], data: { label: 'updated' }, duration: 0 });
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getNode('a')!.data.label).toBe('updated');
  });

  it('applies selected state', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], selected: true, duration: 0 });
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getNode('a')!.selected).toBe(true);
  });

  it('applies zIndex', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], zIndex: 10, duration: 0 });
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getNode('a')!.zIndex).toBe(10);
  });
});

// ── Edge property animation ─────────────────────────────────────────────────

describe('FlowTimeline edge properties', () => {
  it('animates edge strokeWidth', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ edges: ['e1'], edgeStrokeWidth: 5, duration: 100 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(canvas.getEdge('e1')!.strokeWidth).toBe(5);
  });

  it('sets edge animated mode', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ edges: ['e1'], edgeAnimated: 'dot', duration: 0 });
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getEdge('e1')!.animated).toBe('dot');
  });

  it('sets edge class', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ edges: ['e1'], edgeClass: 'active', duration: 0 });
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getEdge('e1')!.class).toBe('active');
  });

  it('sets edge label', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ edges: ['e1'], edgeLabel: 'connected', duration: 0 });
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getEdge('e1')!.label).toBe('connected');
  });
});

// ── Parallel execution ───────────────────────────────────────────────────────

describe('FlowTimeline parallel', () => {
  it('runs parallel steps simultaneously', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.parallel([
      { nodes: ['a'], position: { x: 100 }, duration: 100 },
      { nodes: ['b'], position: { x: 200 }, duration: 100 },
    ]);
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(100);
    expect(canvas.getNode('b')!.position.x).toBe(200);
  });

  it('waits for the longest parallel step to finish', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.parallel([
      { nodes: ['a'], position: { x: 100 }, duration: 50 },
      { nodes: ['b'], position: { x: 200 }, duration: 200 },
    ]);
    tl.step({ nodes: ['c'], position: { x: 300 }, duration: 100 });
    const done = tl.play();
    await advanceTimers(500);
    await done;

    // All should be at final positions — c's step ran after parallel completed
    expect(canvas.getNode('a')!.position.x).toBe(100);
    expect(canvas.getNode('b')!.position.x).toBe(200);
    expect(canvas.getNode('c')!.position.x).toBe(300);
  });

  it('supports parallel via step config (parallel property)', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      parallel: [
        { nodes: ['a'], position: { x: 100 }, duration: 100 },
        { nodes: ['b'], position: { x: 200 }, duration: 100 },
      ],
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(100);
    expect(canvas.getNode('b')!.position.x).toBe(200);
  });

  it('respects delay in parallel sub-steps', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.parallel([
      { nodes: ['a'], position: { x: 100 }, duration: 100, delay: 0 },
      { nodes: ['b'], position: { x: 200 }, duration: 100, delay: 100 },
    ]);
    const done = tl.play();
    await advanceTimers(400);
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(100);
    expect(canvas.getNode('b')!.position.x).toBe(200);
  });
});

// ── Dynamic steps (function) ─────────────────────────────────────────────────

describe('FlowTimeline dynamic steps', () => {
  it('accepts a function returning a step config', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step((_ctx) => ({
      nodes: ['a'],
      position: { x: 50 },
      duration: 0,
    }));
    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(50);
  });
});

// ── Reverse ──────────────────────────────────────────────────────────────────

describe('FlowTimeline reverse', () => {
  it('plays steps in reverse order', async () => {
    const canvas = makeMockCanvas();
    const order: string[] = [];
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'], position: { x: 100 }, duration: 50,
      onComplete: () => order.push('step1'),
    });
    tl.step({
      nodes: ['b'], position: { x: 200 }, duration: 50,
      onComplete: () => order.push('step2'),
    });
    tl.reverse();
    const done = tl.play();
    await advanceTimers(300);
    await done;

    // In reverse, step2 plays first, then step1
    expect(order).toEqual(['step2', 'step1']);
  });

  it('with single step, still animates to the target position', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 300 }, duration: 100 });
    tl.reverse();
    const done = tl.play();
    await advanceTimers(200);
    await done;

    // Reverse only reverses step ORDER. A single step still animates to its target.
    // "Always animate from current state" — node goes from 0 to 300.
    expect(canvas.getNode('a')!.position.x).toBe(300);
  });
});

// ── Loop ─────────────────────────────────────────────────────────────────────

describe('FlowTimeline loop', () => {
  it('loops the specified number of times', async () => {
    const canvas = makeMockCanvas();
    let loopCount = 0;
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    tl.loop(2);
    tl.on('loop', () => loopCount++);
    const done = tl.play();
    // 3 total plays (initial + 2 loops), each ~50ms + overhead
    await advanceTimers(600);
    await done;

    expect(loopCount).toBe(2);
  });

  it('infinite loop emits incrementing iteration numbers', async () => {
    const canvas = makeMockCanvas();
    const iterations: number[] = [];
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    tl.loop(); // infinite (count = 0)
    tl.on('loop', (detail: { iteration: number }) => {
      iterations.push(detail.iteration);
    });
    const done = tl.play();

    // Let it run through ~5 loop iterations (each ~50ms + overhead)
    await advanceTimers(600);

    // Stop to break out of the infinite loop
    tl.stop();
    await done;

    // Should have recorded multiple iterations with incrementing numbers
    expect(iterations.length).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < iterations.length; i++) {
      expect(iterations[i]).toBe(i);
    }
  });

  it('fires complete event after all loops', async () => {
    const canvas = makeMockCanvas();
    let completed = false;
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    tl.loop(1);
    tl.on('complete', () => { completed = true; });
    const done = tl.play();
    await advanceTimers(400);
    await done;

    expect(completed).toBe(true);
  });
});

// ── Reset ────────────────────────────────────────────────────────────────────

describe('FlowTimeline reset', () => {
  it('restores node positions to pre-animation state', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 500 }, duration: 50 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(500);

    tl.reset();
    expect(canvas.getNode('a')!.position.x).toBe(0);
  });

  it('resets state to idle', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    tl.reset();
    expect(tl.state).toBe('idle');
  });

  it('replays when reset(true) is called', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    const replayDone = tl.reset(true);
    expect(tl.state).toBe('playing');
    await advanceTimers(200);
    await replayDone;

    expect(canvas.getNode('a')!.position.x).toBe(100);
  });

  it('preserves Date objects in node.data through snapshot/restore', async () => {
    const dateValue = new Date('2026-01-01');
    const canvas = makeMockCanvas();
    const nodeA = canvas.getNode('a')!;
    nodeA.data = { created: dateValue, label: 'test' };

    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 0 });

    // play() captures snapshot, then runs the instant step
    const done = tl.play();
    await advanceTimers(50);
    await done;

    // Mutate the data to verify reset actually restores from snapshot
    nodeA.data.created = new Date('2099-12-31');
    nodeA.data.label = 'mutated';

    tl.reset();

    expect(nodeA.data.created).toBeInstanceOf(Date);
    expect(nodeA.data.created.getTime()).toBe(dateValue.getTime());
    expect(nodeA.data.label).toBe('test');
  });
});

// ── Events ───────────────────────────────────────────────────────────────────

describe('FlowTimeline events', () => {
  it('fires play event', () => {
    const canvas = makeMockCanvas();
    let fired = false;
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 100 });
    tl.on('play', () => { fired = true; });
    tl.play();
    expect(fired).toBe(true);
  });

  it('fires step event with index', async () => {
    const canvas = makeMockCanvas();
    const events: Array<{ index: number; id?: string }> = [];
    const tl = new FlowTimeline(canvas);
    tl.step({ id: 'first', nodes: ['a'], position: { x: 100 }, duration: 50 });
    tl.on('step', (detail: { index: number; id?: string }) => events.push(detail));
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(events).toEqual([{ index: 0, id: 'first' }]);
  });

  it('fires step-complete event', async () => {
    const canvas = makeMockCanvas();
    let completed = 0;
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    tl.on('step-complete', () => completed++);
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(completed).toBe(1);
  });

  it('fires complete event when all steps finish', async () => {
    const canvas = makeMockCanvas();
    let completed = false;
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    tl.on('complete', () => { completed = true; });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(completed).toBe(true);
  });

  it('fires stop event on stop()', () => {
    const canvas = makeMockCanvas();
    let fired = false;
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 500 });
    tl.on('stop', () => { fired = true; });
    tl.play();
    tl.stop();
    expect(fired).toBe(true);
  });

  it('fires reset event on reset()', async () => {
    const canvas = makeMockCanvas();
    let fired = false;
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    tl.on('reset', () => { fired = true; });
    tl.reset();
    expect(fired).toBe(true);
  });

  it('fires reverse event', () => {
    const canvas = makeMockCanvas();
    let fired = false;
    const tl = new FlowTimeline(canvas);
    tl.on('reverse', () => { fired = true; });
    tl.reverse();
    expect(fired).toBe(true);
  });
});

// ── Pause / Resume ───────────────────────────────────────────────────────────

describe('FlowTimeline pause/resume', () => {
  it('pauses at a pause point', async () => {
    const canvas = makeMockCanvas();
    let resumeFn: ((ctx?: Record<string, any>) => void) | null = null;

    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    tl.pause((resume) => { resumeFn = resume; });
    tl.step({ nodes: ['b'], position: { x: 200 }, duration: 50 });
    tl.play();
    await advanceTimers(200);

    // Should be paused — step 1 done, waiting at pause point
    expect(tl.state).toBe('paused');
    expect(canvas.getNode('a')!.position.x).toBe(100);
    // b should not have moved yet
    expect(canvas.getNode('b')!.position.x).toBe(100);

    // Resume
    resumeFn!();
    await advanceTimers(200);

    expect(canvas.getNode('b')!.position.x).toBe(200);
  });

  it('forwards context from resume to subsequent steps', async () => {
    const canvas = makeMockCanvas();
    let resumeFn: ((ctx?: Record<string, any>) => void) | null = null;
    let receivedCtx: any = null;

    const tl = new FlowTimeline(canvas);
    tl.pause((resume) => { resumeFn = resume; });
    tl.step((ctx) => {
      receivedCtx = ctx;
      return { nodes: ['a'], position: { x: 100 }, duration: 0 };
    });
    tl.play();
    await advanceTimers(50);

    resumeFn!({ choice: 'yes' });
    await advanceTimers(100);

    expect(receivedCtx).toMatchObject({ choice: 'yes' });
  });

  it('fires pause and resume events', async () => {
    const canvas = makeMockCanvas();
    let paused = false;
    let resumed = false;
    let resumeFn: ((ctx?: Record<string, any>) => void) | null = null;

    const tl = new FlowTimeline(canvas);
    tl.pause((resume) => { resumeFn = resume; });
    tl.on('pause', () => { paused = true; });
    tl.on('resume', () => { resumed = true; });
    tl.play();
    await advanceTimers(50);

    expect(paused).toBe(true);
    expect(resumed).toBe(false);

    resumeFn!();
    await advanceTimers(50);
    expect(resumed).toBe(true);
  });
});

// ── Step hooks ───────────────────────────────────────────────────────────────

describe('FlowTimeline step hooks', () => {
  it('calls onStart when step begins', async () => {
    const canvas = makeMockCanvas();
    let started = false;
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'], position: { x: 100 }, duration: 50,
      onStart: () => { started = true; },
    });
    tl.play();
    await advanceTimers(10);
    expect(started).toBe(true);
  });

  it('calls onComplete when step finishes', async () => {
    const canvas = makeMockCanvas();
    let completed = false;
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'], position: { x: 100 }, duration: 50,
      onComplete: () => { completed = true; },
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;
    expect(completed).toBe(true);
  });

  it('calls onProgress with progress 0–1 during animation', async () => {
    const canvas = makeMockCanvas();
    const progressValues: number[] = [];
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'], position: { x: 100 }, duration: 100,
      onProgress: (progress: number) => { progressValues.push(progress); },
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(progressValues.length).toBeGreaterThan(0);
    // First value should be near 0, last should be 1
    expect(progressValues[progressValues.length - 1]).toBe(1);
  });
});

// ── Chaining API ─────────────────────────────────────────────────────────────

describe('FlowTimeline chaining', () => {
  it('supports fluent chaining', () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    const result = tl
      .step({ nodes: ['a'], position: { x: 100 }, duration: 100 })
      .step({ nodes: ['b'], position: { x: 200 }, duration: 100 })
      .loop(2)
      .reverse()
      .lock(true);
    expect(result).toBe(tl);
  });
});

// ── Lock ─────────────────────────────────────────────────────────────────────

describe('FlowTimeline lock', () => {
  it('exposes locked state', () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.lock(true);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 100 });
    tl.play();
    expect(tl.locked).toBe(true);
  });

  it('unlocks after playback completes', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.lock(true);
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 50 });
    const done = tl.play();
    await advanceTimers(200);
    await done;
    expect(tl.locked).toBe(false);
  });
});

// ── Missing targets ──────────────────────────────────────────────────────────

describe('FlowTimeline missing targets', () => {
  it('silently skips missing node IDs', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ nodes: ['nonexistent'], position: { x: 100 }, duration: 50 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    // Should complete without error
    expect(tl.state).toBe('idle');
  });

  it('silently skips missing edge IDs', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({ edges: ['nonexistent'], edgeStrokeWidth: 5, duration: 50 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(tl.state).toBe('idle');
  });
});

// ── Edge transitions: addEdges ────────────────────────────────────────────────

describe('addEdges', () => {
  it('adds edges to the canvas immediately (transition none)', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      addEdges: [{ id: 'e-new', source: 'a', target: 'c' }],
      duration: 0,
    });
    const done = tl.play();
    await done;

    expect(canvas.edges.find((e) => e.id === 'e-new')).toBeDefined();
    expect(canvas.getEdge('e-new')).toBeDefined();
  });

  it('adds edge with draw transition (calls getEdgePathElement)', async () => {
    const mockStyles: Record<string, string> = {};
    const mockAttrs: Record<string, string> = {};
    const mockPathEl = {
      getTotalLength: () => 200,
      getAttribute: (name: string) => mockAttrs[name] ?? null,
      setAttribute: (name: string, value: string) => { mockAttrs[name] = value; },
      removeAttribute: (name: string) => { delete mockAttrs[name]; },
      style: {
        get strokeDasharray() { return mockStyles['stroke-dasharray'] ?? ''; },
        set strokeDasharray(v: string) { mockStyles['stroke-dasharray'] = v; },
        get strokeDashoffset() { return mockStyles['stroke-dashoffset'] ?? ''; },
        set strokeDashoffset(v: string) { mockStyles['stroke-dashoffset'] = v; },
        setProperty(name: string, value: string) { mockStyles[name] = value; },
        removeProperty(name: string) { delete mockStyles[name]; },
      },
    } as unknown as SVGPathElement;

    const canvas = {
      ...makeMockCanvas(),
      getEdgePathElement: vi.fn(() => mockPathEl),
    };

    const tl = new FlowTimeline(canvas);
    tl.step({
      addEdges: [{ id: 'e-draw', source: 'a', target: 'c' }],
      edgeTransition: 'draw',
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    // Edge was added to the canvas
    expect(canvas.edges.find((e) => e.id === 'e-draw')).toBeDefined();
    // Draw styles cleaned up after completion
    expect(mockStyles['stroke-dasharray']).toBeUndefined();
    expect(mockStyles['stroke-dashoffset']).toBeUndefined();
  });

  it('adds edge with fade transition (calls getEdgeElement)', async () => {
    const mockStyles: Record<string, string> = {};
    const mockGroupEl = {
      style: {
        get opacity() { return mockStyles.opacity ?? ''; },
        set opacity(v: string) { mockStyles.opacity = v; },
        removeProperty(name: string) { delete mockStyles[name]; },
      },
    } as unknown as SVGElement;

    const canvas = {
      ...makeMockCanvas(),
      getEdgeElement: vi.fn(() => mockGroupEl),
    };

    const tl = new FlowTimeline(canvas);
    tl.step({
      addEdges: [{ id: 'e-fade', source: 'a', target: 'c' }],
      edgeTransition: 'fade',
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    // Edge was added
    expect(canvas.edges.find((e) => e.id === 'e-fade')).toBeDefined();
    // Fade styles cleaned up
    expect(mockStyles.opacity).toBeUndefined();
  });
});

// ── Edge transitions: removeEdges ─────────────────────────────────────────────

describe('removeEdges', () => {
  it('removes edges from the canvas immediately (transition none)', async () => {
    const canvas = makeMockCanvas();
    expect(canvas.getEdge('e1')).toBeDefined();

    const tl = new FlowTimeline(canvas);
    tl.step({
      removeEdges: ['e1'],
      duration: 0,
    });
    const done = tl.play();
    await done;

    expect(canvas.edges.find((e) => e.id === 'e1')).toBeUndefined();
  });

  it('removes edge after draw-out transition completes', async () => {
    const mockStyles: Record<string, string> = {};
    const mockAttrs: Record<string, string> = {};
    const mockPathEl = {
      getTotalLength: () => 200,
      getAttribute: (name: string) => mockAttrs[name] ?? null,
      setAttribute: (name: string, value: string) => { mockAttrs[name] = value; },
      removeAttribute: (name: string) => { delete mockAttrs[name]; },
      style: {
        get strokeDasharray() { return mockStyles['stroke-dasharray'] ?? ''; },
        set strokeDasharray(v: string) { mockStyles['stroke-dasharray'] = v; },
        get strokeDashoffset() { return mockStyles['stroke-dashoffset'] ?? ''; },
        set strokeDashoffset(v: string) { mockStyles['stroke-dashoffset'] = v; },
        setProperty(name: string, value: string) { mockStyles[name] = value; },
        removeProperty(name: string) { delete mockStyles[name]; },
      },
    } as unknown as SVGPathElement;

    const canvas = {
      ...makeMockCanvas(),
      getEdgePathElement: vi.fn(() => mockPathEl),
    };

    const tl = new FlowTimeline(canvas);
    tl.step({
      removeEdges: ['e1'],
      edgeTransition: 'draw',
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    // Edge removed after animation
    expect(canvas.edges.find((e) => e.id === 'e1')).toBeUndefined();
  });

  it('removes edge after fade-out transition completes', async () => {
    const mockStyles: Record<string, string> = {};
    const mockGroupEl = {
      style: {
        get opacity() { return mockStyles.opacity ?? ''; },
        set opacity(v: string) { mockStyles.opacity = v; },
        removeProperty(name: string) { delete mockStyles[name]; },
      },
    } as unknown as SVGElement;

    const canvas = {
      ...makeMockCanvas(),
      getEdgeElement: vi.fn(() => mockGroupEl),
    };

    const tl = new FlowTimeline(canvas);
    tl.step({
      removeEdges: ['e1'],
      edgeTransition: 'fade',
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    // Edge removed after animation
    expect(canvas.edges.find((e) => e.id === 'e1')).toBeUndefined();
  });

  it('skips removal of nonexistent edges', async () => {
    const canvas = makeMockCanvas();
    const originalLength = canvas.edges.length;

    const tl = new FlowTimeline(canvas);
    tl.step({
      removeEdges: ['nonexistent'],
      duration: 0,
    });
    const done = tl.play();
    await done;

    expect(canvas.edges.length).toBe(originalLength);
  });
});

// ── Viewport animation ────────────────────────────────────────────────────────

function makeMockCanvasWithViewport() {
  const canvas = makeMockCanvas() as MockCanvas & {
    getContainerDimensions: () => { width: number; height: number };
    minZoom: number;
    maxZoom: number;
  };
  canvas.viewport = { x: 0, y: 0, zoom: 1 };
  (canvas as any).getContainerDimensions = () => ({ width: 800, height: 600 });
  (canvas as any).minZoom = 0.1;
  (canvas as any).maxZoom = 4;
  return canvas as MockCanvas & {
    viewport: { x: number; y: number; zoom: number };
    getContainerDimensions: () => { width: number; height: number };
    minZoom: number;
    maxZoom: number;
  };
}

describe('viewport step', () => {
  it('interpolates viewport x, y, zoom over duration', async () => {
    const canvas = makeMockCanvasWithViewport();
    const tl = new FlowTimeline(canvas);
    tl.step({
      viewport: { x: 100, y: 200, zoom: 2 },
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(canvas.viewport.x).toBe(100);
    expect(canvas.viewport.y).toBe(200);
    expect(canvas.viewport.zoom).toBe(2);
  });

  it('partially updates viewport (only x)', async () => {
    const canvas = makeMockCanvasWithViewport();
    canvas.viewport = { x: 0, y: 50, zoom: 1.5 };
    const tl = new FlowTimeline(canvas);
    tl.step({
      viewport: { x: 200 },
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(canvas.viewport.x).toBe(200);
    expect(canvas.viewport.y).toBe(50); // unchanged
    expect(canvas.viewport.zoom).toBe(1.5); // unchanged
  });

  it('applies viewport instantly when duration is 0', async () => {
    const canvas = makeMockCanvasWithViewport();
    const tl = new FlowTimeline(canvas);
    tl.step({
      viewport: { x: 300, y: 400, zoom: 2 },
      duration: 0,
    });
    await tl.play();

    expect(canvas.viewport.x).toBe(300);
    expect(canvas.viewport.y).toBe(400);
    expect(canvas.viewport.zoom).toBe(2);
  });
});

describe('fitView step', () => {
  it('fits viewport to all nodes when no nodes specified', async () => {
    const canvas = makeMockCanvasWithViewport();
    // Nodes: a(0,0), b(100,100), c(200,200) — no dimensions set, defaults to 150x40
    const tl = new FlowTimeline(canvas);
    tl.step({
      fitView: true,
      duration: 0,
    });
    await tl.play();

    // Should have zoomed/panned to fit all nodes
    expect(canvas.viewport.zoom).toBeGreaterThan(0);
    expect(canvas.viewport.zoom).toBeLessThanOrEqual(4);
  });

  it('fits viewport to specific nodes when nodes are specified', async () => {
    const canvas = makeMockCanvasWithViewport();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      fitView: true,
      duration: 0,
    });
    await tl.play();

    // Should fit to just node 'a' at (0,0)
    expect(canvas.viewport.zoom).toBeGreaterThan(0);
  });

  it('uses fitViewPadding', async () => {
    const canvas = makeMockCanvasWithViewport();
    const tl = new FlowTimeline(canvas);
    tl.step({ fitView: true, fitViewPadding: 0.5, duration: 0 });
    const done1 = tl.play();
    await done1;
    const zoomWithPadding = canvas.viewport.zoom;

    // Reset and try with less padding
    const canvas2 = makeMockCanvasWithViewport();
    const tl2 = new FlowTimeline(canvas2);
    tl2.step({ fitView: true, fitViewPadding: 0.01, duration: 0 });
    await tl2.play();
    const zoomLessPadding = canvas2.viewport.zoom;

    // More padding = smaller zoom (more space around nodes)
    expect(zoomWithPadding).toBeLessThanOrEqual(zoomLessPadding);
  });

  it('animates fitView over duration', async () => {
    const canvas = makeMockCanvasWithViewport();
    canvas.viewport = { x: -500, y: -500, zoom: 0.5 };
    const tl = new FlowTimeline(canvas);
    tl.step({ fitView: true, duration: 100 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    // After animation, should be at the fit-view position
    expect(canvas.viewport.zoom).toBeGreaterThan(0);
  });
});

describe('panTo step', () => {
  it('centers viewport on the target node', async () => {
    const canvas = makeMockCanvasWithViewport();
    // Node 'b' is at (100, 100)
    const tl = new FlowTimeline(canvas);
    tl.step({ panTo: 'b', duration: 0 });
    await tl.play();

    // Viewport should be centered on node 'b'
    // With default node size 150x50, center is at (175, 125)
    // Viewport x = containerWidth/2 - centerX * zoom = 400 - 175 = 225
    // Viewport y = containerHeight/2 - centerY * zoom = 300 - 125 = 175
    expect(canvas.viewport.x).toBeCloseTo(225, 0);
    expect(canvas.viewport.y).toBeCloseTo(175, 0);
    expect(canvas.viewport.zoom).toBe(1); // zoom unchanged
  });

  it('animates panTo over duration', async () => {
    const canvas = makeMockCanvasWithViewport();
    const tl = new FlowTimeline(canvas);
    tl.step({ panTo: 'c', duration: 100 });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    // Node 'c' at (200,200), default dims 150x50, center (275, 225)
    // VP: x = 400 - 275 = 125, y = 300 - 225 = 75
    expect(canvas.viewport.x).toBeCloseTo(125, 0);
    expect(canvas.viewport.y).toBeCloseTo(75, 0);
  });

  it('skips panTo for nonexistent node', async () => {
    const canvas = makeMockCanvasWithViewport();
    canvas.viewport = { x: 10, y: 20, zoom: 1 };
    const tl = new FlowTimeline(canvas);
    tl.step({ panTo: 'nonexistent', duration: 0 });
    await tl.play();

    // Viewport unchanged
    expect(canvas.viewport.x).toBe(10);
    expect(canvas.viewport.y).toBe(20);
  });
});

// ── Reduced motion ──────────────────────────────────────────────────────────

describe('prefers-reduced-motion', () => {
  function mockReducedMotion(matches: boolean): void {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches }));
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('overrides durations to 0 when reduced motion is preferred', async () => {
    mockReducedMotion(true);
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    const progress: number[] = [];
    tl.step({
      nodes: ['a'],
      position: { x: 100 },
      duration: 500,
      onProgress: (p) => progress.push(p),
    });
    await tl.play();

    // With reduced motion, duration is forced to 0 — instant transition
    expect(canvas.nodes[0].position.x).toBe(100);
    // Should have fired progress with 1 (instant)
    expect(progress).toContain(1);
  });

  it('overrides delays to 0 when reduced motion is preferred', async () => {
    mockReducedMotion(true);
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      position: { x: 50 },
      duration: 0,
      delay: 1000,
    });
    // Should complete instantly without waiting for delay
    await tl.play();
    expect(canvas.nodes[0].position.x).toBe(50);
  });

  it('respects normal durations when reduced motion is not preferred', async () => {
    mockReducedMotion(false);
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      position: { x: 100 },
      duration: 200,
    });
    const done = tl.play();
    // After 50ms (partial) node should not be at final position
    await advanceTimers(50);
    expect(canvas.nodes[0].position.x).not.toBe(100);
    await advanceTimers(300);
    await done;
    expect(canvas.nodes[0].position.x).toBe(100);
  });

  it('can opt out of reduced motion with respectReducedMotion(false)', async () => {
    mockReducedMotion(true);
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.respectReducedMotion(false);
    tl.step({
      nodes: ['a'],
      position: { x: 100 },
      duration: 200,
    });
    const done = tl.play();
    // Should animate normally (not instant) despite OS reduced motion
    await advanceTimers(50);
    expect(canvas.nodes[0].position.x).not.toBe(100);
    await advanceTimers(300);
    await done;
    expect(canvas.nodes[0].position.x).toBe(100);
  });

  it('hooks still fire with reduced motion', async () => {
    mockReducedMotion(true);
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    const started: number[] = [];
    const completed: number[] = [];
    tl.step({
      nodes: ['a'],
      position: { x: 10 },
      duration: 500,
      onStart: (ctx) => started.push(ctx.stepIndex),
      onComplete: (ctx) => completed.push(ctx.stepIndex),
    });
    tl.step({
      nodes: ['b'],
      position: { x: 20 },
      duration: 500,
      onStart: (ctx) => started.push(ctx.stepIndex),
      onComplete: (ctx) => completed.push(ctx.stepIndex),
    });
    await tl.play();
    expect(started).toEqual([0, 1]);
    expect(completed).toEqual([0, 1]);
  });
});

// ── Missing targets ─────────────────────────────────────────────────────────

describe('missing target handling', () => {
  it('silently skips missing node IDs and processes valid ones', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a', 'nonexistent', 'b'],
      position: { x: 50 },
      duration: 0,
    });
    await tl.play();

    expect(canvas.nodes[0].position.x).toBe(50); // 'a' updated
    expect(canvas.nodes[1].position.x).toBe(50); // 'b' updated
  });

  it('logs warning for missing nodes when debug is enabled', async () => {
    const canvas = makeMockCanvas() as any;
    canvas.debug = true;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tl = new FlowTimeline(canvas);
    tl.step({
      id: 'step1',
      nodes: ['nonexistent'],
      position: { x: 50 },
      duration: 0,
    });
    await tl.play();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('nonexistent'),
    );
    warnSpy.mockRestore();
  });

  it('does not log warning when debug is disabled', async () => {
    const canvas = makeMockCanvas();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['nonexistent'],
      position: { x: 50 },
      duration: 0,
    });
    await tl.play();
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('completes instantly when a step has zero valid targets', async () => {
    const canvas = makeMockCanvas();
    const completed: string[] = [];
    const tl = new FlowTimeline(canvas);
    tl.step({
      id: 'empty',
      nodes: ['nonexistent1', 'nonexistent2'],
      position: { x: 100 },
      duration: 500,
      onComplete: () => completed.push('empty'),
    });
    tl.step({
      id: 'real',
      nodes: ['a'],
      position: { x: 99 },
      duration: 0,
      onComplete: () => completed.push('real'),
    });
    await tl.play();

    // Both steps should complete, and 'a' should be at 99
    expect(completed).toEqual(['empty', 'real']);
    expect(canvas.nodes[0].position.x).toBe(99);
  });

  it('silently skips missing edge IDs and processes valid ones', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      edges: ['e1', 'nonexistent_edge'],
      edgeAnimated: true,
      duration: 0,
    });
    await tl.play();

    expect(canvas.edges[0].animated).toBe(true);
  });
});

// ── followPath ───────────────────────────────────────────────────────────────

describe('FlowTimeline followPath', () => {
  it('moves node along a function path', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      followPath: (t) => ({ x: t * 100, y: t * 100 }),
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    const nodeA = canvas.getNode('a')!;
    expect(nodeA.position.x).toBe(100);
    expect(nodeA.position.y).toBe(100);
  });

  it('followPath overrides position when both are set', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      position: { x: 999, y: 999 },
      followPath: (t) => ({ x: t * 50, y: t * 50 }),
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    const nodeA = canvas.getNode('a')!;
    expect(nodeA.position.x).toBe(50);
    expect(nodeA.position.y).toBe(50);
  });

  it('applies easing to progress before calling path function', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    const pathCalls: number[] = [];
    tl.step({
      nodes: ['a'],
      followPath: (t) => {
        pathCalls.push(t);
        return { x: t * 100, y: 0 };
      },
      easing: 'linear',
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(pathCalls.length).toBeGreaterThan(0);
    expect(pathCalls[pathCalls.length - 1]).toBeCloseTo(1, 1);
  });

  it('reset() restores node to pre-animation position', async () => {
    const canvas = makeMockCanvas();
    const nodeA = canvas.getNode('a')!;
    nodeA.position.x = 10;
    nodeA.position.y = 20;

    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      followPath: (t) => ({ x: t * 200, y: t * 200 }),
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(nodeA.position.x).toBe(200);
    tl.reset();
    expect(nodeA.position.x).toBe(10);
    expect(nodeA.position.y).toBe(20);
  });

  it('applies followPath to multiple nodes', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a', 'b'],
      followPath: (t) => ({ x: t * 50, y: t * 50 }),
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(50);
    expect(canvas.getNode('b')!.position.x).toBe(50);
  });

  it('works with duration: 0 (instant)', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      followPath: (t) => ({ x: t * 100, y: t * 100 }),
      duration: 0,
    });
    const done = tl.play();
    await done;

    const nodeA = canvas.getNode('a')!;
    expect(nodeA.position.x).toBe(100);
    expect(nodeA.position.y).toBe(100);
  });
});

// ── Constructor DI: injected engine ──────────────────────────────────────────

describe('FlowTimeline engine injection', () => {
  it('uses injected engine instance instead of creating a private one', () => {
    const canvas = makeMockCanvas();
    const injectedEngine = new AnimationEngine();
    const registerSpy = vi.spyOn(injectedEngine, 'register');

    const tl = new FlowTimeline(canvas, injectedEngine);
    tl.step({ nodes: ['a'], followPath: (t) => ({ x: t * 100, y: 0 }), duration: 100 });
    tl.play();

    expect(registerSpy).toHaveBeenCalled();
    tl.stop();
  });

  it('falls back to a private engine when no engine is injected', () => {
    const canvas = makeMockCanvas();
    // Should not throw — the fallback new AnimationEngine() is used
    expect(() => {
      const tl = new FlowTimeline(canvas);
      tl.step({ nodes: ['a'], position: { x: 50 }, duration: 0 });
    }).not.toThrow();
  });
});

// ── guidePath ────────────────────────────────────────────────────────────────

describe('FlowTimeline guidePath', () => {
  it('accepts guidePath option without error in non-DOM environment', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      followPath: (t: number) => ({ x: t * 100, y: 0 }),
      guidePath: { visible: true },
      duration: 100,
    });
    const done = tl.play();
    await advanceTimers(200);
    await done;
    expect(canvas.getNode('a')!.position.x).toBe(100);
  });

  it('stores guidePath config on TimelineStep type', () => {
    const step: import('./timeline').TimelineStep = {
      nodes: ['a'],
      followPath: (t: number) => ({ x: t * 100, y: 0 }),
      guidePath: { visible: true, class: 'my-guide', autoRemove: false },
      duration: 100,
    };
    expect(step.guidePath?.visible).toBe(true);
    expect(step.guidePath?.class).toBe('my-guide');
    expect(step.guidePath?.autoRemove).toBe(false);
  });
});

// ── Typed context generic ─────────────────────────────────────────────────────

describe('FlowTimeline — typed context', () => {
  it('accepts typed context generic parameter', async () => {
    interface MyContext { userId: string; isPremium: boolean }
    const canvas = makeMockCanvas();

    // This should compile without errors — the generic is accepted
    const tl = new FlowTimeline<MyContext>(canvas);

    let receivedCtx: import('./timeline').StepContext<MyContext> | null = null;
    tl.step({
      nodes: ['a'],
      position: { x: 100 },
      duration: 0,
      onStart: (ctx) => { receivedCtx = ctx; },
    });

    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(receivedCtx).toBeDefined();
    expect(receivedCtx!.stepIndex).toBe(0);
  });

  it('untyped FlowTimeline still works (default Record<string, any>)', async () => {
    const canvas = makeMockCanvas();
    let receivedCtx: any = null;

    const tl = new FlowTimeline(canvas);
    tl.step({
      nodes: ['a'],
      position: { x: 50 },
      duration: 0,
      onStart: (ctx) => { receivedCtx = ctx; },
    });

    const done = tl.play();
    await advanceTimers(50);
    await done;

    expect(receivedCtx).toBeDefined();
    expect(receivedCtx.stepIndex).toBe(0);
  });

  it('forwards typed context through pause/resume', async () => {
    interface FlowCtx { tier: string }
    const canvas = makeMockCanvas();
    let resumeFn: ((ctx?: Record<string, any>) => void) | null = null;
    let receivedCtx: import('./timeline').StepContext<FlowCtx> | null = null;

    const tl = new FlowTimeline<FlowCtx>(canvas);
    tl.pause((resume) => { resumeFn = resume; });
    tl.step((ctx) => {
      receivedCtx = ctx;
      return { nodes: ['a'], position: { x: 100 }, duration: 0 };
    });

    tl.play();
    await advanceTimers(50);

    resumeFn!({ tier: 'pro' });
    await advanceTimers(100);

    expect(receivedCtx).toMatchObject({ tier: 'pro' });
  });
});

// ── Awaitable steps ─────────────────────────────────────────────────────────

describe('FlowTimeline — awaitable steps', () => {
  it('step with await: Promise blocks until promise resolves', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    let resolved = false;
    const gate = new Promise<void>((resolve) => {
      setTimeout(() => { resolved = true; resolve(); }, 100);
    });

    tl.step({ await: gate });
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 0 });

    const done = tl.play();

    // Step 1 should be blocking
    expect(resolved).toBe(false);
    expect(canvas.getNode('a')!.position.x).not.toBe(100);

    // Resolve the gate
    await vi.advanceTimersByTimeAsync(100);
    await done;

    expect(resolved).toBe(true);
    expect(canvas.getNode('a')!.position.x).toBe(100);
  });

  it('step with await: { finished } unwraps the handle', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    let resolveHandle!: () => void;
    const fakeHandle = {
      finished: new Promise<void>((r) => { resolveHandle = r; }),
    };

    tl.step({ await: fakeHandle });
    tl.step({ nodes: ['a'], position: { x: 200 }, duration: 0 });

    const done = tl.play();
    resolveHandle();
    await done;

    expect(canvas.getNode('a')!.position.x).toBe(200);
  });

  it('step with await: thunk evaluates at step activation', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    let thunkCalled = false;
    tl.step({
      await: () => {
        thunkCalled = true;
        return Promise.resolve();
      },
    });

    expect(thunkCalled).toBe(false); // not called at build time
    await tl.play();
    expect(thunkCalled).toBe(true); // called at step activation
  });

  it('step with timeout emits step-timeout and advances', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    const events: string[] = [];
    tl.on('step-timeout', () => events.push('timeout'));

    // Promise that never resolves
    const neverResolves = new Promise(() => {});

    tl.step({ await: neverResolves, timeout: 50 });
    tl.step({ nodes: ['a'], position: { x: 100 }, duration: 0 });

    const done = tl.play();
    await vi.advanceTimersByTimeAsync(50);
    await done;

    expect(events).toContain('timeout');
    expect(canvas.getNode('a')!.position.x).toBe(100); // second step ran
  });

  it('await-only step (no targets) acts as a pure wait', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    let waited = false;
    tl.step({
      await: () => {
        waited = true;
        return Promise.resolve();
      },
    });

    await tl.play();
    expect(waited).toBe(true);
  });
});

// ── Conditional when/else steps ─────────────────────────────────────────────

describe('FlowTimeline — conditional steps', () => {
  it('when: true executes the step normally', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    tl.step({
      when: () => true,
      nodes: ['a'],
      position: { x: 100 },
      duration: 0,
    });

    await tl.play();
    expect(canvas.getNode('a')!.position.x).toBe(100);
  });

  it('when: false skips the step entirely', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    tl.step({
      when: () => false,
      nodes: ['a'],
      position: { x: 999 },
      duration: 0,
    });

    await tl.play();
    // Node should NOT have moved
    expect(canvas.getNode('a')!.position.x).not.toBe(999);
  });

  it('when: false with else: executes the alternative', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    tl.step({
      when: () => false,
      nodes: ['a'],
      position: { x: 999 },
      duration: 0,
      else: {
        nodes: ['a'],
        position: { x: 42 },
        duration: 0,
      },
    });

    await tl.play();
    expect(canvas.getNode('a')!.position.x).toBe(42);
  });

  it('skipped step emits step-skipped event', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    const events: string[] = [];
    tl.on('step-skipped', () => events.push('skipped'));

    tl.step({ when: () => false, id: 'skip-me', duration: 0 });

    await tl.play();
    expect(events).toContain('skipped');
  });

  it('when receives the step context with stepIndex', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    let receivedIndex = -1;
    tl.step({ nodes: ['a'], position: { x: 10 }, duration: 0 });
    tl.step({
      when: (ctx) => { receivedIndex = ctx.stepIndex; return true; },
      nodes: ['a'],
      position: { x: 20 },
      duration: 0,
    });

    await tl.play();
    expect(receivedIndex).toBe(1); // second step
  });

  it('chained when steps work for multi-way branching', async () => {
    const canvas = makeMockCanvas();
    const tl = new FlowTimeline(canvas);

    const mode = 'b';
    tl.step({
      when: () => mode === 'a',
      nodes: ['a'], position: { x: 100 }, duration: 0,
    });
    tl.step({
      when: () => mode === 'b',
      nodes: ['a'], position: { x: 200 }, duration: 0,
    });
    tl.step({
      when: () => mode === 'c',
      nodes: ['a'], position: { x: 300 }, duration: 0,
    });

    await tl.play();
    expect(canvas.getNode('a')!.position.x).toBe(200); // only mode 'b' ran
  });
});
