// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { mockCtx } from './__test-utils';
import { createAnimationMixin } from './canvas-animation';
import type { FlowNode, FlowEdge } from '../../core/types';
import { registerParticleRenderer } from '../../animate/particle-renderers';

// ── Mock Alpine ──────────────────────────────────────────────────────────────

import { setAlpine } from '../alpine-ref';
setAlpine({ raw: (x: any) => x } as any);

// ── Mock FlowTimeline ────────────────────────────────────────────────────────

interface MockTimeline {
  on: ReturnType<typeof vi.fn>;
  step: ReturnType<typeof vi.fn>;
  parallel: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  locked: boolean;
  _handlers: Record<string, Function[]>;
  _emit(event: string): void;
}

let lastTimelineInstance: MockTimeline;

vi.mock('../../animate/timeline', () => ({
  FlowTimeline: class MockFlowTimeline {
    on: ReturnType<typeof vi.fn>;
    step: ReturnType<typeof vi.fn>;
    parallel: ReturnType<typeof vi.fn>;
    play: ReturnType<typeof vi.fn>;
    locked = false;
    _handlers: Record<string, Function[]> = {};

    constructor(_ctx: any) {
      this.on = vi.fn((event: string, cb: Function) => {
        if (!this._handlers[event]) this._handlers[event] = [];
        this._handlers[event].push(cb);
      });
      this.step = vi.fn();
      this.parallel = vi.fn();
      this.play = vi.fn(() => Promise.resolve());
      lastTimelineInstance = this as any;
    }

    _emit(event: string) {
      for (const cb of this._handlers[event] ?? []) cb();
    }
  },
}));

// ── Mock engine ──────────────────────────────────────────────────────────────

const mockEngineStop = vi.fn();
let lastEngineCallback: Function;

vi.mock('../../animate/engine', () => ({
  engine: {
    register: vi.fn((cb: Function) => {
      lastEngineCallback = cb;
      return { stop: mockEngineStop };
    }),
  },
}));

// ── Mock interpolators ───────────────────────────────────────────────────────

vi.mock('../../animate/interpolators', () => ({
  parseStyle: vi.fn((s: any) => (typeof s === 'string' ? {} : { ...s })),
  interpolateStyle: vi.fn((_from: any, to: any, _t: number) => to),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    position: { x: 0, y: 0 },
    data: {},
    ...overrides,
  } as FlowNode;
}

function makeEdge(id: string, overrides: Partial<FlowEdge> = {}): FlowEdge {
  return { id, source: 'a', target: 'b', ...overrides };
}

// ── CSS.escape polyfill for jsdom ────────────────────────────────────────────

beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// _syncAnimationState
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — _syncAnimationState', () => {
  it('sets _animationLocked=true when a timeline has locked=true', () => {
    const ctx = mockCtx();
    const tl = { locked: true } as any;
    ctx._activeTimelines.add(tl);
    const mixin = createAnimationMixin(ctx);

    mixin._syncAnimationState();

    expect(ctx._animationLocked).toBe(true);
  });

  it('sets _animationLocked=false when no timelines are locked', () => {
    const ctx = mockCtx();
    const tl = { locked: false } as any;
    ctx._activeTimelines.add(tl);
    const mixin = createAnimationMixin(ctx);

    mixin._syncAnimationState();

    expect(ctx._animationLocked).toBe(false);
  });

  it('suspends history when timelines are active', () => {
    const ctx = mockCtx();
    const tl = { locked: false } as any;
    ctx._activeTimelines.add(tl);
    const mixin = createAnimationMixin(ctx);

    mixin._syncAnimationState();

    expect(ctx._suspendHistory).toHaveBeenCalledOnce();
    expect(ctx._resumeHistory).not.toHaveBeenCalled();
  });

  it('resumes history when no timelines are active', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    mixin._syncAnimationState();

    expect(ctx._resumeHistory).toHaveBeenCalledOnce();
    expect(ctx._suspendHistory).not.toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// timeline
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — timeline', () => {
  it('creates a FlowTimeline and returns it', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    const tl = mixin.timeline();

    expect(tl).toBeDefined();
    expect(tl.on).toBeDefined();
  });

  it('wires play event to add timeline to active set', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    const tl = mixin.timeline() as any;

    expect(ctx._activeTimelines.has(tl)).toBe(false);
    tl._emit('play');
    expect(ctx._activeTimelines.has(tl)).toBe(true);
  });

  it('wires resume event to add timeline to active set', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    const tl = mixin.timeline() as any;

    tl._emit('resume');
    expect(ctx._activeTimelines.has(tl)).toBe(true);
  });

  it('wires pause/stop/complete events to remove timeline from active set', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    for (const event of ['pause', 'stop', 'complete']) {
      ctx._activeTimelines.clear();
      const tl = mixin.timeline() as any;
      ctx._activeTimelines.add(tl);

      tl._emit(event);

      expect(ctx._activeTimelines.has(tl)).toBe(false);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// registerAnimation / unregisterAnimation
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — registerAnimation / unregisterAnimation', () => {
  it('registers a named animation in the registry', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);
    const steps = [{ parallel: [{ id: 'n1' }] }];

    mixin.registerAnimation('fadeIn', steps);

    expect(ctx._animationRegistry.get('fadeIn')).toBe(steps);
  });

  it('unregisters a named animation', () => {
    const ctx = mockCtx();
    ctx._animationRegistry.set('fadeIn', []);
    const mixin = createAnimationMixin(ctx);

    mixin.unregisterAnimation('fadeIn');

    expect(ctx._animationRegistry.has('fadeIn')).toBe(false);
  });

  it('unregister of nonexistent name is a no-op', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    expect(() => mixin.unregisterAnimation('nonexistent')).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// playAnimation
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — playAnimation', () => {
  it('returns early when animation name is not registered', async () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    await mixin.playAnimation('nonexistent');

    // Should not throw and no timeline should be created
  });

  it('creates a timeline and plays registered steps', async () => {
    const ctx = mockCtx();
    const steps = [
      { target: 'n1', position: { x: 100 } },
      { parallel: [{ target: 'n2' }] },
    ];
    ctx._animationRegistry.set('myAnim', steps);
    const mixin = createAnimationMixin(ctx);
    // playAnimation calls ctx.timeline() — wire it to the mixin's method
    (ctx as any).timeline = mixin.timeline;

    await mixin.playAnimation('myAnim');

    // The mock FlowTimeline's step/parallel/play should have been called
    expect(lastTimelineInstance.step).toHaveBeenCalledWith(steps[0]);
    expect(lastTimelineInstance.parallel).toHaveBeenCalledWith(steps[1].parallel);
    expect(lastTimelineInstance.play).toHaveBeenCalledOnce();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// animate — instant case
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — animate (instant)', () => {
  it('returns noop handle when duration=0 and calls onComplete', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);
    const onComplete = vi.fn();

    const handle = mixin.animate({}, { duration: 0, onComplete });

    expect(handle.pause).toBeTypeOf('function');
    expect(handle.resume).toBeTypeOf('function');
    expect(handle.stop).toBeTypeOf('function');
    expect(handle.reverse).toBeTypeOf('function');
    expect(handle.finished).toBeInstanceOf(Promise);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('instantly applies node position and flushes', () => {
    const n1 = makeNode('n1', { position: { x: 10, y: 20 } });
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { nodes: { n1: { position: { x: 100, y: 200 } } } },
      { duration: 0 },
    );

    expect(n1.position.x).toBe(100);
    expect(n1.position.y).toBe(200);
    expect(ctx._flushNodePositions).toHaveBeenCalled();
    expect(ctx._refreshEdgePaths).toHaveBeenCalled();
  });

  it('instantly applies node style and flushes', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { nodes: { n1: { style: { background: 'red' } } } },
      { duration: 0 },
    );

    expect(n1.style).toEqual({ background: 'red' });
    expect(ctx._flushNodeStyles).toHaveBeenCalled();
  });

  it('instantly applies instant-only node properties (data, class, selected, zIndex)', () => {
    const n1 = makeNode('n1', { data: { foo: 1 }, zIndex: 0 });
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      {
        nodes: {
          n1: {
            data: { bar: 2 },
            class: 'highlight',
            selected: true,
            zIndex: 10,
          },
        },
      },
      { duration: 0 },
    );

    expect(n1.data).toEqual({ foo: 1, bar: 2 });
    expect(n1.class).toBe('highlight');
    expect(n1.selected).toBe(true);
    expect(n1.zIndex).toBe(10);
  });

  it('instantly applies edge color and flushes', () => {
    const e1 = makeEdge('e1', { color: '#000' });
    const ctx = mockCtx();
    ctx._edgeMap.set('e1', e1);
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { edges: { e1: { color: '#fff' } } },
      { duration: 0 },
    );

    expect(e1.color).toBe('#fff');
    expect(ctx._flushEdgeStyles).toHaveBeenCalled();
  });

  it('instantly applies edge strokeWidth', () => {
    const e1 = makeEdge('e1', { strokeWidth: 1 });
    const ctx = mockCtx();
    ctx._edgeMap.set('e1', e1);
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { edges: { e1: { strokeWidth: 3 } } },
      { duration: 0 },
    );

    expect(e1.strokeWidth).toBe(3);
  });

  it('instantly applies edge instant-only properties (label, animated, class)', () => {
    const e1 = makeEdge('e1');
    const ctx = mockCtx();
    ctx._edgeMap.set('e1', e1);
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { edges: { e1: { label: 'test', animated: true, class: 'special' } } },
      { duration: 0 },
    );

    expect(e1.label).toBe('test');
    expect(e1.animated).toBe(true);
    expect(e1.class).toBe('special');
  });

  it('instantly applies viewport pan and zoom', () => {
    const ctx = mockCtx();
    ctx.viewport = { x: 0, y: 0, zoom: 1 };
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { viewport: { pan: { x: 100, y: 200 }, zoom: 2, _duration: 0 } },
      { duration: 0 },
    );

    expect(ctx.viewport.x).toBe(100);
    expect(ctx.viewport.y).toBe(200);
    expect(ctx.viewport.zoom).toBe(2);
  });

  it('instantly applies node dimensions', () => {
    const n1 = makeNode('n1', { dimensions: { width: 100, height: 50 } });
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { nodes: { n1: { dimensions: { width: 200, height: 100 } } } },
      { duration: 0 },
    );

    expect(n1.dimensions!.width).toBe(200);
    expect(n1.dimensions!.height).toBe(100);
  });

  it('skips nonexistent nodes gracefully', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    expect(() =>
      mixin.animate(
        { nodes: { nonexistent: { position: { x: 100 } } } },
        { duration: 0 },
      ),
    ).not.toThrow();
  });

  it('skips nonexistent edges gracefully', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    expect(() =>
      mixin.animate(
        { edges: { nonexistent: { color: '#fff' } } },
        { duration: 0 },
      ),
    ).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// animate — animated case
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — animate (animated)', () => {
  it('delegates to Animator when entries are produced', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);

    const mockAnimateResult = {
      pause: vi.fn(),
      resume: vi.fn(),
      stop: vi.fn(),
      reverse: vi.fn(),
      finished: Promise.resolve(),
    };
    ctx._animator = {
      animate: vi.fn(() => mockAnimateResult),
    } as any;
    const mixin = createAnimationMixin(ctx);

    const handle = mixin.animate(
      { nodes: { n1: { position: { x: 100, y: 100 } } } },
      { duration: 300 },
    );

    expect(ctx._animator!.animate).toHaveBeenCalled();
    expect(handle).toBe(mockAnimateResult);
  });

  it('passes easing, delay, and loop options to Animator', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    ctx._animator = {
      animate: vi.fn(() => ({
        pause: vi.fn(), resume: vi.fn(), stop: vi.fn(), reverse: vi.fn(),
        finished: Promise.resolve(),
      })),
    } as any;
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { nodes: { n1: { position: { x: 50 } } } },
      { duration: 500, easing: 'ease-in', delay: 100, loop: 3 },
    );

    const callArgs = (ctx._animator!.animate as any).mock.calls[0][1];
    expect(callArgs.duration).toBe(500);
    expect(callArgs.easing).toBe('ease-in');
    expect(callArgs.delay).toBe(100);
    expect(callArgs.loop).toBe(3);
  });

  it('builds edge color entries for animated string color', () => {
    const e1 = makeEdge('e1', { color: '#000000' });
    const ctx = mockCtx();
    ctx._edgeMap.set('e1', e1);
    ctx._animator = {
      animate: vi.fn(() => ({
        pause: vi.fn(), resume: vi.fn(), stop: vi.fn(), reverse: vi.fn(),
        finished: Promise.resolve(),
      })),
    } as any;
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { edges: { e1: { color: '#ffffff' } } },
      { duration: 300 },
    );

    const entries = (ctx._animator!.animate as any).mock.calls[0][0];
    expect(entries).toHaveLength(1);
    expect(entries[0].key).toBe('edge:e1:color');
    expect(entries[0].from).toBe('#000000');
    expect(entries[0].to).toBe('#ffffff');
  });

  it('builds edge strokeWidth entries for animated transition', () => {
    const e1 = makeEdge('e1', { strokeWidth: 1 });
    const ctx = mockCtx();
    ctx._edgeMap.set('e1', e1);
    ctx._animator = {
      animate: vi.fn(() => ({
        pause: vi.fn(), resume: vi.fn(), stop: vi.fn(), reverse: vi.fn(),
        finished: Promise.resolve(),
      })),
    } as any;
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { edges: { e1: { strokeWidth: 5 } } },
      { duration: 300 },
    );

    const entries = (ctx._animator!.animate as any).mock.calls[0][0];
    expect(entries).toHaveLength(1);
    expect(entries[0].key).toBe('edge:e1:strokeWidth');
    expect(entries[0].from).toBe(1);
    expect(entries[0].to).toBe(5);
  });

  it('builds viewport pan/zoom entries for animated transition', () => {
    const ctx = mockCtx();
    ctx.viewport = { x: 0, y: 0, zoom: 1 };
    ctx._animator = {
      animate: vi.fn(() => ({
        pause: vi.fn(), resume: vi.fn(), stop: vi.fn(), reverse: vi.fn(),
        finished: Promise.resolve(),
      })),
    } as any;
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { viewport: { pan: { x: 100, y: 200 }, zoom: 2 } },
      { duration: 300 },
    );

    const entries = (ctx._animator!.animate as any).mock.calls[0][0];
    expect(entries).toHaveLength(3);
    expect(entries.map((e: any) => e.key)).toEqual([
      'viewport:pan.x',
      'viewport:pan.y',
      'viewport:zoom',
    ]);
  });

  it('handles gradient edge color as instant (object type)', () => {
    const e1 = makeEdge('e1', { color: '#000' });
    const ctx = mockCtx();
    ctx._edgeMap.set('e1', e1);
    const mixin = createAnimationMixin(ctx);

    // Gradient object — applied instantly
    mixin.animate(
      { edges: { e1: { color: { from: '#000', to: '#fff' } as any } } },
      { duration: 0 },
    );

    expect((e1 as any).color).toEqual({ from: '#000', to: '#fff' });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// follow
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — follow', () => {
  it('returns a FlowAnimationHandle with stop method', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    const handle = mixin.follow({ x: 100, y: 100 });

    expect(handle.stop).toBeTypeOf('function');
    expect(handle.pause).toBeTypeOf('function');
    expect(handle.resume).toBeTypeOf('function');
    expect(handle.reverse).toBeTypeOf('function');
    expect(handle.finished).toBeInstanceOf(Promise);
  });

  it('registers an engine callback', async () => {
    const { engine: eng } = vi.mocked(await import('../../animate/engine'));
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    mixin.follow({ x: 100, y: 100 });

    expect(eng.register).toHaveBeenCalled();
  });

  it('stops previous follow handle before starting new one', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    const handle1 = mixin.follow({ x: 0, y: 0 });
    const stopSpy = vi.spyOn(handle1, 'stop');

    // Store the handle like the real code does
    (ctx as any)._followHandle = handle1;

    mixin.follow({ x: 100, y: 100 });

    expect(stopSpy).toHaveBeenCalled();
  });

  it('stop() cleans up and resolves finished promise', async () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    const handle = mixin.follow({ x: 50, y: 50 });
    handle.stop();

    expect((ctx as any)._followHandle).toBeNull();
    // finished should resolve
    await expect(handle.finished).resolves.toBeUndefined();
  });

  it('follows a static XYPosition — engine callback updates viewport', () => {
    const ctx = mockCtx();
    ctx.viewport = { x: 0, y: 0, zoom: 1 };
    // Give container dimensions
    ctx._container = {
      clientWidth: 800,
      clientHeight: 600,
    } as any;
    const mixin = createAnimationMixin(ctx);

    mixin.follow({ x: 100, y: 100 });

    // Call the engine callback
    const result = lastEngineCallback();

    expect(result).toBe(false);
    // Viewport should have been nudged toward the target position
    expect(ctx._flushViewport).toHaveBeenCalled();
    expect(ctx.viewport.x).not.toBe(0); // lerp moved it
  });

  it('follows a node by ID — uses getAbsolutePosition for parented nodes', () => {
    const n1 = makeNode('n1', {
      position: { x: 50, y: 50 },
      parentId: 'parent',
      dimensions: { width: 100, height: 60 },
    });
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    ctx.viewport = { x: 0, y: 0, zoom: 1 };
    ctx._container = { clientWidth: 800, clientHeight: 600 } as any;
    (ctx.getAbsolutePosition as any).mockReturnValue({ x: 150, y: 150 });
    const mixin = createAnimationMixin(ctx);

    mixin.follow('n1');

    lastEngineCallback();

    expect(ctx.getAbsolutePosition).toHaveBeenCalledWith('n1');
    expect(ctx._flushViewport).toHaveBeenCalled();
  });

  it('follows a ParticleHandle — stops when particle completes', () => {
    const ctx = mockCtx();
    ctx.viewport = { x: 0, y: 0, zoom: 1 };
    const mixin = createAnimationMixin(ctx);

    const particleHandle = {
      getCurrentPosition: vi.fn(() => null), // particle done
      stop: vi.fn(),
      finished: Promise.resolve(),
    };

    mixin.follow(particleHandle as any);

    const result = lastEngineCallback();

    expect(result).toBe(true); // should auto-stop
    expect(mockEngineStop).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// _tickParticles
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — _tickParticles', () => {
  it('returns true and clears engine handle when no particles remain', () => {
    const ctx = mockCtx();
    ctx._particleEngineHandle = { stop: vi.fn() } as any;
    const mixin = createAnimationMixin(ctx);

    const result = mixin._tickParticles(0);

    expect(result).toBe(true);
    expect(ctx._particleEngineHandle).toBeNull();
  });

  it('removes completed particles (progress >= 1)', () => {
    const ctx = mockCtx();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.appendChild(element);

    const onComplete = vi.fn();
    const mockRenderer = { create: vi.fn(), update: vi.fn(), destroy: vi.fn((el: SVGElement) => el.remove()) };

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    const particle = {
      element,
      renderer: mockRenderer,
      pathEl,
      startElapsed: 0,     // started at elapsed=0
      ms: 1000,            // 1s duration
      onComplete,
      currentPosition: { x: 0, y: 0 },
    };

    ctx._activeParticles.add(particle);
    const mixin = createAnimationMixin(ctx);

    // Pass elapsed=2000, well past the 1000ms duration
    const result = mixin._tickParticles(2000);

    expect(ctx._activeParticles.size).toBe(0);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(mockRenderer.destroy).toHaveBeenCalledWith(element);
    expect(result).toBe(true); // all particles done
  });

  it('updates position of in-progress particles via renderer', () => {
    const ctx = mockCtx();

    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.appendChild(element);

    const mockRenderer = { create: vi.fn(), update: vi.fn(), destroy: vi.fn() };

    // Create an SVG path with mock methods
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // jsdom doesn't implement getTotalLength/getPointAtLength, so mock them
    (pathEl as any).getTotalLength = vi.fn(() => 100);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 42, y: 84 }));

    const particle = {
      element,
      renderer: mockRenderer,
      pathEl,
      startElapsed: 0,     // started at elapsed=0
      ms: 10000,           // long duration
      onComplete: vi.fn(),
      currentPosition: { x: 0, y: 0 },
    };

    ctx._activeParticles.add(particle);
    const mixin = createAnimationMixin(ctx);

    // Pass elapsed=100 (small progress)
    const result = mixin._tickParticles(100);

    expect(result).toBe(false); // still running
    expect(mockRenderer.update).toHaveBeenCalledWith(element, expect.objectContaining({ x: 42, y: 84 }));
  });

  it('sets startElapsed on first tick when particle has startElapsed=-1', () => {
    const ctx = mockCtx();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.appendChild(element);

    const mockRenderer = { create: vi.fn(), update: vi.fn(), destroy: vi.fn() };

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    (pathEl as any).getTotalLength = vi.fn(() => 100);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 10, y: 20 }));

    const particle = {
      element,
      renderer: mockRenderer,
      pathEl,
      startElapsed: -1,    // not yet ticked
      ms: 2000,
      onComplete: vi.fn(),
      currentPosition: { x: 0, y: 0 },
    };

    ctx._activeParticles.add(particle);
    const mixin = createAnimationMixin(ctx);

    mixin._tickParticles(500);

    // startElapsed should now be set to the elapsed value from first tick
    expect(particle.startElapsed).toBe(500);
  });

  it('updates currentPosition on each tick', () => {
    const ctx = mockCtx();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.appendChild(element);

    const mockRenderer = { create: vi.fn(), update: vi.fn(), destroy: vi.fn() };

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    (pathEl as any).getTotalLength = vi.fn(() => 100);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 55, y: 33 }));

    const particle = {
      element,
      renderer: mockRenderer,
      pathEl,
      startElapsed: 0,
      ms: 10000,
      onComplete: vi.fn(),
      currentPosition: { x: 0, y: 0 },
    };

    ctx._activeParticles.add(particle);
    const mixin = createAnimationMixin(ctx);

    mixin._tickParticles(500);

    expect(particle.currentPosition).toEqual({ x: 55, y: 33 });
  });

  it('removes particle correctly with a very large elapsed value', () => {
    const ctx = mockCtx();
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.appendChild(element);

    const mockRenderer = { create: vi.fn(), update: vi.fn(), destroy: vi.fn((el: SVGElement) => el.remove()) };
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const onComplete = vi.fn();

    const particle = {
      element,
      renderer: mockRenderer,
      pathEl,
      startElapsed: 0,
      ms: 1000,
      onComplete,
      currentPosition: { x: 0, y: 0 },
    };

    ctx._activeParticles.add(particle);
    const mixin = createAnimationMixin(ctx);

    // Elapsed far beyond duration — progress >= 1 completes it normally
    const result = mixin._tickParticles(999999);

    expect(ctx._activeParticles.size).toBe(0);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// sendParticle
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — sendParticle', () => {
  it('returns undefined when edge is not found', () => {
    const ctx = mockCtx();
    ctx.edges = [];
    const mixin = createAnimationMixin(ctx);

    const result = mixin.sendParticle('nonexistent');

    expect(result).toBeUndefined();
  });

  it('returns undefined when edge SVG is hidden (culled)', () => {
    const ctx = mockCtx();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.display = 'none';
    ctx._edgeSvgElements.set('e1', svg);
    ctx.edges = [makeEdge('e1')];
    const mixin = createAnimationMixin(ctx);

    const result = mixin.sendParticle('e1');

    expect(result).toBeUndefined();
  });

  it('returns undefined when no path element exists', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];
    // getEdgePathElement returns null by default in mockCtx
    const mixin = createAnimationMixin(ctx);

    const result = mixin.sendParticle('e1');

    expect(result).toBeUndefined();
  });

  it('returns undefined when path has no d attribute', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // No d attribute set
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);
    const mixin = createAnimationMixin(ctx);

    const result = mixin.sendParticle('e1');

    expect(result).toBeUndefined();
  });

  it('creates a particle and returns a handle when edge/path are valid', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getTotalLength = vi.fn(() => 200);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    const handle = mixin.sendParticle('e1');

    expect(handle).toBeDefined();
    expect(handle!.getCurrentPosition).toBeTypeOf('function');
    expect(handle!.stop).toBeTypeOf('function');
    expect(handle!.finished).toBeInstanceOf(Promise);
    expect(ctx._activeParticles.size).toBe(1);
  });

  it('applies custom CSS class to particle element via renderer', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getTotalLength = vi.fn(() => 200);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    mixin.sendParticle('e1', { class: 'custom-dot glow' });

    // The circle renderer creates a <circle> element in the gEl
    const circle = gEl.querySelector('circle')!;
    expect(circle).not.toBeNull();
    expect(circle.classList.contains('flow-edge-particle')).toBe(true);
    expect(circle.classList.contains('custom-dot')).toBe(true);
    expect(circle.classList.contains('glow')).toBe(true);
  });

  it('handle.stop() removes particle and resolves finished', async () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getTotalLength = vi.fn(() => 200);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    const handle = mixin.sendParticle('e1')!;
    expect(ctx._activeParticles.size).toBe(1);

    handle.stop();

    expect(ctx._activeParticles.size).toBe(0);
    await expect(handle.finished).resolves.toBeUndefined();
  });

  it('handle.getCurrentPosition() returns position of active particle', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getTotalLength = vi.fn(() => 200);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 50, y: 75 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    const handle = mixin.sendParticle('e1')!;

    // getCurrentPosition reads from internal state set by renderer.update at creation
    const pos = handle.getCurrentPosition();

    expect(pos).toEqual({ x: 50, y: 75 });
  });

  it('handle.getCurrentPosition() returns null after particle is stopped', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getTotalLength = vi.fn(() => 200);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    const handle = mixin.sendParticle('e1')!;
    handle.stop();

    expect(handle.getCurrentPosition()).toBeNull();
  });

  it('registers engine tick when first particle is created', async () => {
    const { engine: eng } = vi.mocked(await import('../../animate/engine'));
    eng.register.mockClear();

    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];
    ctx._particleEngineHandle = null;

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getTotalLength = vi.fn(() => 200);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    mixin.sendParticle('e1');

    expect(eng.register).toHaveBeenCalled();
  });

  it('returns undefined when getEdgeElement returns null', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);
    (ctx.getEdgeElement as any).mockReturnValue(null);

    const mixin = createAnimationMixin(ctx);

    const result = mixin.sendParticle('e1');

    expect(result).toBeUndefined();
  });

  it('sendParticle uses the default circle renderer', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getTotalLength = vi.fn(() => 200);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    const handle = mixin.sendParticle('e1');

    expect(handle).toBeDefined();
    // The default circle renderer creates a <circle> SVG element
    const circle = gEl.querySelector('circle');
    expect(circle).not.toBeNull();
  });

  it('sendParticle uses a custom renderer when specified', () => {
    const mockCreate = vi.fn((svgLayer: SVGElement) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      svgLayer.appendChild(rect);
      return rect;
    });
    const mockUpdate = vi.fn();
    const mockDestroy = vi.fn((el: SVGElement) => el.remove());

    registerParticleRenderer('custom-test', {
      create: mockCreate,
      update: mockUpdate,
      destroy: mockDestroy,
    });

    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getTotalLength = vi.fn(() => 200);
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    const handle = mixin.sendParticle('e1', { renderer: 'custom-test' });

    expect(handle).toBeDefined();
    expect(mockCreate).toHaveBeenCalled();
    // The custom renderer's update is called for initial positioning
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('unknown renderer returns undefined', () => {
    const ctx = mockCtx();
    ctx.edges = [makeEdge('e1')];

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', 'M0,0 L100,100');
    (pathEl as any).getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
    (ctx.getEdgePathElement as any).mockReturnValue(pathEl);

    const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    (ctx.getEdgeElement as any).mockReturnValue(gEl);

    const mixin = createAnimationMixin(ctx);

    const result = mixin.sendParticle('e1', { renderer: 'nonexistent' });

    expect(result).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// animate — respectReducedMotion
// ═══════════════════════════════════════════════════════════════════════════════

describe('animate — respectReducedMotion', () => {
  it('collapses animate duration to 0 when respectReducedMotion is true', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ _config: { respectReducedMotion: true } as any });
    ctx._nodeMap.set('n1', n1);
    const mixin = createAnimationMixin(ctx);

    // With duration: 500 but reduced motion forced on, changes should be instant.
    mixin.animate(
      { nodes: { n1: { position: { x: 200, y: 300 } } } },
      { duration: 500 },
    );

    // Values should have jumped to target immediately (instant path).
    expect(n1.position.x).toBe(200);
    expect(n1.position.y).toBe(300);
    expect(ctx._flushNodePositions).toHaveBeenCalled();
  });

  it('does not reduce motion when respectReducedMotion is false', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ _config: { respectReducedMotion: false } as any });
    ctx._nodeMap.set('n1', n1);
    ctx._animator = {
      animate: vi.fn(() => ({
        pause: vi.fn(),
        resume: vi.fn(),
        stop: vi.fn(),
        reverse: vi.fn(),
        finished: Promise.resolve(),
      })),
    } as any;
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { nodes: { n1: { position: { x: 200, y: 300 } } } },
      { duration: 500 },
    );

    // Animator should have been invoked with the full 500ms duration.
    expect(ctx._animator!.animate).toHaveBeenCalled();
    const callArgs = (ctx._animator!.animate as any).mock.calls[0][1];
    expect(callArgs.duration).toBe(500);
    // Position should NOT have jumped — still animating.
    expect(n1.position.x).toBe(0);
    expect(n1.position.y).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// destroy
// ═══════════════════════════════════════════════════════════════════════════════

describe('createAnimationMixin — destroy()', () => {
  it('stops all active animations on destroy', () => {
    const ctx = mockCtx();
    const stopAll = vi.fn();
    ctx._animator = { animate: vi.fn(), stopAll } as any;
    const mixin = createAnimationMixin(ctx);

    mixin.destroy();

    expect(stopAll).toHaveBeenCalledOnce();
  });

  it('is safe when _animator is null', () => {
    const ctx = mockCtx();
    ctx._animator = null;
    const mixin = createAnimationMixin(ctx);

    expect(() => mixin.destroy()).not.toThrow();
  });

  it('destroys all active particles on destroy', () => {
    const ctx = mockCtx();
    const stopHandle = vi.fn();
    ctx._particleEngineHandle = { stop: stopHandle } as any;
    const mixin = createAnimationMixin(ctx);

    mixin.destroy();

    // destroyParticles() stops the engine handle and clears active particles
    expect(stopHandle).toHaveBeenCalledOnce();
    expect(ctx._particleEngineHandle).toBeNull();
  });

  it('stops all active timelines on destroy', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);

    const tl1 = { stop: vi.fn(), locked: false } as any;
    const tl2 = { stop: vi.fn(), locked: false } as any;
    ctx._activeTimelines.add(tl1);
    ctx._activeTimelines.add(tl2);

    mixin.destroy();

    expect(tl1.stop).toHaveBeenCalledOnce();
    expect(tl2.stop).toHaveBeenCalledOnce();
  });

  it('clears _activeTimelines after destroy', () => {
    const ctx = mockCtx();
    const mixin = createAnimationMixin(ctx);
    ctx._activeTimelines.add({ stop: vi.fn(), locked: false } as any);

    mixin.destroy();

    expect(ctx._activeTimelines.size).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Tier A integration — getHandles, cancelAll, group, transaction, snapshot, boundTo
// ═══════════════════════════════════════════════════════════════════════════════

describe('canvas animation — Tier A integration', () => {
  function makeAnimator() {
    const registry = {
      getHandles: vi.fn(() => []),
      cancelAll: vi.fn(),
      pauseAll: vi.fn(),
      resumeAll: vi.fn(),
      register: vi.fn(),
      unregister: vi.fn(),
    };
    const animator = {
      animate: vi.fn(() => ({
        pause: vi.fn(),
        resume: vi.fn(),
        stop: vi.fn(),
        reverse: vi.fn(),
        play: vi.fn(),
        playForward: vi.fn(),
        playBackward: vi.fn(),
        restart: vi.fn(),
        direction: 'forward' as const,
        isFinished: false,
        currentValue: new Map(),
        finished: Promise.resolve(),
      })),
      stopAll: vi.fn(),
      registry,
      beginTransaction: vi.fn(() => ({
        state: 'active',
        handles: [],
        commit: vi.fn(),
        rollback: vi.fn(),
        trackHandle: vi.fn(),
        captureProperty: vi.fn(),
        finished: Promise.resolve(),
      })),
      endTransaction: vi.fn(),
    };
    return animator;
  }

  it('getHandles() returns handles from the registry', () => {
    const ctx = mockCtx();
    const animator = makeAnimator();
    const mockHandles = [
      { _tags: ['test'], pause: vi.fn(), resume: vi.fn(), stop: vi.fn(), isFinished: false },
    ];
    animator.registry.getHandles.mockReturnValue(mockHandles);
    ctx._animator = animator as any;
    const mixin = createAnimationMixin(ctx);

    const handles = mixin.getHandles({ tag: 'test' });

    expect(animator.registry.getHandles).toHaveBeenCalledWith({ tag: 'test' });
    expect(handles).toBe(mockHandles);
  });

  it('cancelAll() stops tagged handles', () => {
    const ctx = mockCtx();
    const animator = makeAnimator();
    ctx._animator = animator as any;
    const mixin = createAnimationMixin(ctx);

    mixin.cancelAll({ tag: 'highlight' }, { mode: 'freeze' });

    expect(animator.registry.cancelAll).toHaveBeenCalledWith(
      { tag: 'highlight' },
      { mode: 'freeze' },
    );
  });

  it('pauseAll() pauses tagged handles', () => {
    const ctx = mockCtx();
    const animator = makeAnimator();
    ctx._animator = animator as any;
    const mixin = createAnimationMixin(ctx);

    mixin.pauseAll({ tag: 'bg' });

    expect(animator.registry.pauseAll).toHaveBeenCalledWith({ tag: 'bg' });
  });

  it('resumeAll() resumes tagged handles', () => {
    const ctx = mockCtx();
    const animator = makeAnimator();
    ctx._animator = animator as any;
    const mixin = createAnimationMixin(ctx);

    mixin.resumeAll({ tags: ['a', 'b'] });

    expect(animator.registry.resumeAll).toHaveBeenCalledWith({ tags: ['a', 'b'] });
  });

  it('group() returns a FlowGroup that auto-tags', () => {
    const ctx = mockCtx();
    const animator = makeAnimator();
    ctx._animator = animator as any;
    const mixin = createAnimationMixin(ctx);

    const grp = mixin.group('my-group');

    expect(grp).toBeDefined();
    expect(grp.name).toBe('my-group');

    // Calling animate on the group should delegate to the mixin with the group tag
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    ctx._nodeMap.set('n1', n1);

    grp.animate(
      { nodes: { n1: { position: { x: 100 } } } },
      { duration: 300 },
    );

    expect(animator.animate).toHaveBeenCalled();
    const callArgs = animator.animate.mock.calls[0][1];
    expect(callArgs.tag).toBe('my-group');
  });

  it('transaction() tracks handles and supports rollback', () => {
    const ctx = mockCtx();
    const animator = makeAnimator();
    const mockTx = {
      state: 'active' as const,
      handles: [],
      commit: vi.fn(),
      rollback: vi.fn(),
      trackHandle: vi.fn(),
      captureProperty: vi.fn(),
      finished: Promise.resolve(),
    };
    animator.beginTransaction.mockReturnValue(mockTx);
    ctx._animator = animator as any;
    const mixin = createAnimationMixin(ctx);

    const tx = mixin.transaction(() => {
      // Synchronous work inside transaction
    });

    expect(animator.beginTransaction).toHaveBeenCalledOnce();
    expect(animator.endTransaction).toHaveBeenCalledOnce();
    expect(tx).toBe(mockTx);
  });

  it('transaction() calls rollback on sync error', () => {
    const ctx = mockCtx();
    const animator = makeAnimator();
    const mockTx = {
      state: 'active' as const,
      handles: [],
      commit: vi.fn(),
      rollback: vi.fn(),
      trackHandle: vi.fn(),
      captureProperty: vi.fn(),
      finished: Promise.resolve(),
    };
    animator.beginTransaction.mockReturnValue(mockTx);
    ctx._animator = animator as any;
    const mixin = createAnimationMixin(ctx);

    expect(() => {
      mixin.transaction(() => {
        throw new Error('boom');
      });
    }).toThrow();

    expect(mockTx.rollback).toHaveBeenCalledOnce();
    expect(animator.endTransaction).toHaveBeenCalledOnce();
  });

  it('transaction() ends transaction after async resolution', async () => {
    const ctx = mockCtx();
    const animator = makeAnimator();
    const mockTx = {
      state: 'active' as const,
      handles: [],
      commit: vi.fn(),
      rollback: vi.fn(),
      trackHandle: vi.fn(),
      captureProperty: vi.fn(),
      finished: Promise.resolve(),
    };
    animator.beginTransaction.mockReturnValue(mockTx);
    ctx._animator = animator as any;
    const mixin = createAnimationMixin(ctx);

    mixin.transaction(async () => {
      // async work
    });

    // Wait for the microtask to resolve
    await new Promise((r) => setTimeout(r, 0));

    // beginTransaction called once, endTransaction called twice:
    // once in the sync path (since result is a promise, it doesn't call
    // endTransaction there), actually the logic calls endTransaction in .then()
    expect(animator.beginTransaction).toHaveBeenCalledOnce();
    // endTransaction is called in the .then() callback
    expect(animator.endTransaction).toHaveBeenCalled();
  });

  it('snapshot() captures and restores canvas state', () => {
    const ctx = mockCtx();
    const n1 = makeNode('n1', { position: { x: 10, y: 20 } });
    const n2 = makeNode('n2', { position: { x: 30, y: 40 } });
    const e1 = makeEdge('e1');
    ctx.nodes = [n1, n2];
    ctx.edges = [e1];
    ctx.viewport = { x: 100, y: 200, zoom: 1.5 };
    const mixin = createAnimationMixin(ctx);

    const snap = mixin.snapshot();

    // Mutate the state
    ctx.nodes[0].position.x = 999;
    ctx.nodes.splice(1, 1); // Remove n2
    ctx.edges.splice(0, 1); // Remove e1
    ctx.viewport.x = 0;
    ctx.viewport.y = 0;
    ctx.viewport.zoom = 1;

    // Restore
    snap.restore();

    expect(ctx.nodes).toHaveLength(2);
    expect(ctx.nodes[0].position.x).toBe(10);
    expect(ctx.nodes[1].position.x).toBe(30);
    expect(ctx.edges).toHaveLength(1);
    expect(ctx.edges[0].id).toBe('e1');
    expect(ctx.viewport.x).toBe(100);
    expect(ctx.viewport.y).toBe(200);
    expect(ctx.viewport.zoom).toBe(1.5);
  });

  it('boundTo compiles to a while predicate for nodes', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 }, data: { runState: 'running' } });
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    ctx.nodes = [n1];

    const animator = makeAnimator();
    ctx._animator = animator as any;

    // Wire up getNode to actually return from nodeMap
    (ctx.getNode as any).mockImplementation((id: string) => ctx._nodeMap.get(id));

    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { nodes: { n1: { position: { x: 100 } } } },
      {
        duration: 300,
        boundTo: { node: 'n1', property: 'runState', equals: 'running' },
      },
    );

    // The animate call should pass a `while` predicate to the animator
    expect(animator.animate).toHaveBeenCalled();
    const callArgs = animator.animate.mock.calls[0][1];
    expect(callArgs.while).toBeTypeOf('function');

    // While data.runState is 'running', predicate returns true
    // Actually, the binding is on the node object itself, not data
    // Since 'runState' doesn't exist on node directly, let's set it
    (n1 as any).runState = 'running';
    expect(callArgs.while()).toBe(true);

    // Change the state — predicate should return false
    (n1 as any).runState = 'stopped';
    expect(callArgs.while()).toBe(false);
  });

  it('boundTo compiles to a while predicate for edges', () => {
    const e1 = makeEdge('e1', { animated: true, color: '#000' });
    const ctx = mockCtx();
    ctx._edgeMap.set('e1', e1);
    ctx.edges = [e1];

    const animator = makeAnimator();
    ctx._animator = animator as any;

    // Wire up getEdge to return from edgeMap
    (ctx.getEdge as any).mockImplementation((id: string) => ctx._edgeMap.get(id));

    // We need at least one animatable entry, so let's animate edge color
    const mixin = createAnimationMixin(ctx);

    mixin.animate(
      { edges: { e1: { color: '#fff' } } },
      {
        duration: 300,
        boundTo: { edge: 'e1', property: 'animated', equals: true },
      },
    );

    expect(animator.animate).toHaveBeenCalled();
    const callArgs = animator.animate.mock.calls[0][1];
    expect(callArgs.while).toBeTypeOf('function');

    // animated is true — predicate should return true
    expect(callArgs.while()).toBe(true);

    // Change animated to false — predicate should return false
    e1.animated = false;
    expect(callArgs.while()).toBe(false);
  });

  it('boundTo passes through to update() via animate()', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);

    const animator = makeAnimator();
    ctx._animator = animator as any;

    (ctx.getNode as any).mockImplementation((id: string) => ctx._nodeMap.get(id));

    const mixin = createAnimationMixin(ctx);

    // Use update() directly
    mixin.update(
      { nodes: { n1: { position: { x: 50 } } } },
      {
        duration: 500,
        boundTo: { node: 'n1', property: 'selected', equals: true },
      },
    );

    const callArgs = animator.animate.mock.calls[0][1];
    expect(callArgs.while).toBeTypeOf('function');

    n1.selected = true;
    expect(callArgs.while()).toBe(true);

    n1.selected = false;
    expect(callArgs.while()).toBe(false);
  });
});
