// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockCtx } from './__test-utils';
import { createLayoutMixin } from './canvas-layout';
import { registerAddon, _resetRegistry } from '../../core/registry';
import type { FlowNode } from '../../core/types';

// ── Mock external core modules ──────────────────────────────────────────────

vi.mock('../../core/child-layout', () => ({
  computeChildLayout: vi.fn(() => ({
    positions: new Map(),
    dimensions: new Map(),
    parentDimensions: { width: 200, height: 100 },
  })),
}));

vi.mock('../../core/layout/dagre', () => ({
  computeDagreLayout: vi.fn(() => new Map([['n1', { x: 100, y: 50 }]])),
}));

vi.mock('../../core/layout/force', () => ({
  computeForceLayout: vi.fn(() => new Map([['n1', { x: 80, y: 60 }]])),
}));

vi.mock('../../core/layout/hierarchy', () => ({
  computeHierarchyLayout: vi.fn(() => new Map([['n1', { x: 120, y: 40 }]])),
}));

vi.mock('../../core/layout/elk', () => ({
  computeElkLayout: vi.fn(() => Promise.resolve(new Map([['n1', { x: 90, y: 70 }]]))),
}));

// Re-import mocked modules for assertions
import { computeChildLayout } from '../../core/child-layout';
import { computeDagreLayout } from '../../core/layout/dagre';
import { computeForceLayout } from '../../core/layout/force';
import { computeHierarchyLayout } from '../../core/layout/hierarchy';
import { computeElkLayout } from '../../core/layout/elk';

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    position: { x: 0, y: 0 },
    data: {},
    ...overrides,
  } as FlowNode;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();

  // Register mocked layout compute functions in the addon registry
  _resetRegistry();
  registerAddon('layout:dagre', computeDagreLayout);
  registerAddon('layout:force', computeForceLayout);
  registerAddon('layout:hierarchy', computeHierarchyLayout);
  registerAddon('layout:elk', computeElkLayout);
});

// ── _scheduleAutoLayout ─────────────────────────────────────────────────────

describe('createLayoutMixin — _scheduleAutoLayout', () => {
  it('no-ops when no autoLayout config', () => {
    const ctx = mockCtx({ _config: {} as any });
    const mixin = createLayoutMixin(ctx);

    mixin._scheduleAutoLayout();

    expect(ctx._autoLayoutTimer).toBeNull();
  });

  it('no-ops when _autoLayoutFailed is true', () => {
    const ctx = mockCtx({
      _config: { autoLayout: { algorithm: 'dagre' } } as any,
      _autoLayoutReady: true,
      _autoLayoutFailed: true,
    });
    const mixin = createLayoutMixin(ctx);

    mixin._scheduleAutoLayout();

    expect(ctx._autoLayoutTimer).toBeNull();
  });

  it('clears existing timer and sets a new one', () => {
    const ctx = mockCtx({
      _config: { autoLayout: { algorithm: 'dagre', debounce: 100 } } as any,
      _autoLayoutReady: true,
      _autoLayoutFailed: false,
    });
    const mixin = createLayoutMixin(ctx);

    // Schedule once
    mixin._scheduleAutoLayout();
    const firstTimer = ctx._autoLayoutTimer;
    expect(firstTimer).not.toBeNull();

    // Schedule again — should clear the first timer
    mixin._scheduleAutoLayout();
    expect(ctx._autoLayoutTimer).not.toBeNull();
    expect(ctx._autoLayoutTimer).not.toBe(firstTimer);
  });
});

// ── _runAutoLayout ──────────────────────────────────────────────────────────

describe('createLayoutMixin — _runAutoLayout', () => {
  it('delegates to layout() for dagre algorithm', async () => {
    const ctx = mockCtx({
      _config: {
        autoLayout: { algorithm: 'dagre', direction: 'LR', fitView: true, duration: 200 },
      } as any,
      nodes: [makeNode('n1')],
    });
    const mixin = createLayoutMixin(ctx);

    await mixin._runAutoLayout();

    // layout() was called — which calls computeDagreLayout
    expect(computeDagreLayout).toHaveBeenCalled();
  });

  it('catches errors and sets _autoLayoutFailed', async () => {
    const ctx = mockCtx({
      _config: {
        autoLayout: { algorithm: 'dagre' },
      } as any,
      nodes: [makeNode('n1')],
    });
    const mixin = createLayoutMixin(ctx);

    // Make the dynamic import throw
    vi.mocked(computeDagreLayout).mockImplementationOnce(() => {
      throw new Error('test error');
    });

    await mixin._runAutoLayout();

    expect(ctx._autoLayoutFailed).toBe(true);
    expect(ctx._warn).toHaveBeenCalledWith('AUTO_LAYOUT_FAILED', expect.stringContaining('test error'));
  });
});

// ── _applyLayout ────────────────────────────────────────────────────────────

describe('createLayoutMixin — _applyLayout', () => {
  it('applies positions directly when duration=0', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const n2 = makeNode('n2', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [n1, n2] });
    const mixin = createLayoutMixin(ctx);

    const positions = new Map([
      ['n1', { x: 100, y: 50 }],
      ['n2', { x: 200, y: 150 }],
    ]);

    mixin._applyLayout(positions, { duration: 0, fitView: false });

    expect(n1.position).toEqual({ x: 100, y: 50 });
    expect(n2.position).toEqual({ x: 200, y: 150 });
    expect(ctx.animate).not.toHaveBeenCalled();
  });

  it('calls ctx.animate when duration > 0', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createLayoutMixin(ctx);

    const positions = new Map([['n1', { x: 100, y: 50 }]]);
    mixin._applyLayout(positions, { duration: 300, fitView: false });

    expect(ctx.animate).toHaveBeenCalledWith(
      { nodes: { n1: { position: { x: 100, y: 50 } } } },
      expect.objectContaining({
        duration: 300,
        easing: 'easeInOut',
      }),
    );
  });

  it('calls fitView in onComplete when duration > 0', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createLayoutMixin(ctx);

    const positions = new Map([['n1', { x: 100, y: 50 }]]);
    mixin._applyLayout(positions, { duration: 300, fitView: true });

    const animateCall = vi.mocked(ctx.animate).mock.calls[0];
    const opts = animateCall[1] as any;
    opts.onComplete();

    expect(ctx.fitView).toHaveBeenCalledWith({ padding: 0.2, duration: 300 });
  });

  it('calls fitView immediately when duration=0 and fitView not disabled', () => {
    const ctx = mockCtx({ nodes: [] });
    const mixin = createLayoutMixin(ctx);

    mixin._applyLayout(new Map(), { duration: 0 });

    expect(ctx.fitView).toHaveBeenCalledWith({ padding: 0.2, duration: 0 });
  });

  it('does not call fitView when fitView=false', () => {
    const ctx = mockCtx({ nodes: [] });
    const mixin = createLayoutMixin(ctx);

    mixin._applyLayout(new Map(), { duration: 0, fitView: false });

    expect(ctx.fitView).not.toHaveBeenCalled();
  });

  it('calls _adjustHandlePositions when adjustHandles is true', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createLayoutMixin(ctx);
    const spy = vi.spyOn(mixin, '_adjustHandlePositions');

    mixin._applyLayout(new Map(), {
      adjustHandles: true,
      handleDirection: 'LR',
      fitView: false,
      duration: 0,
    });

    expect(spy).toHaveBeenCalledWith('LR');
  });
});

// ── _adjustHandlePositions ──────────────────────────────────────────────────

describe('createLayoutMixin — _adjustHandlePositions', () => {
  it('sets source/target positions on nodes for TB direction', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    const mixin = createLayoutMixin(ctx);

    mixin._adjustHandlePositions('TB');

    expect(n1.sourcePosition).toBe('bottom');
    expect(n1.targetPosition).toBe('top');
    expect(n2.sourcePosition).toBe('bottom');
    expect(n2.targetPosition).toBe('top');
  });

  it('sets source/target positions on nodes for LR direction', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createLayoutMixin(ctx);

    mixin._adjustHandlePositions('LR');

    expect(n1.sourcePosition).toBe('right');
    expect(n1.targetPosition).toBe('left');
  });
});

// ── layoutChildren ──────────────────────────────────────────────────────────

describe('createLayoutMixin — layoutChildren', () => {
  it('returns early if parent has no childLayout', () => {
    const parent = makeNode('parent');
    const ctx = mockCtx({ nodes: [parent] });
    const mixin = createLayoutMixin(ctx);

    mixin.layoutChildren('parent');

    expect(computeChildLayout).not.toHaveBeenCalled();
  });

  it('applies computed positions to children', () => {
    const parent = makeNode('parent', { childLayout: { direction: 'vertical' } } as any);
    const child1 = makeNode('c1', { parentId: 'parent', position: { x: 0, y: 0 } });
    const child2 = makeNode('c2', { parentId: 'parent', position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [parent, child1, child2] });
    const mixin = createLayoutMixin(ctx);

    vi.mocked(computeChildLayout).mockReturnValueOnce({
      positions: new Map([
        ['c1', { x: 10, y: 20 }],
        ['c2', { x: 10, y: 60 }],
      ]),
      dimensions: new Map(),
      parentDimensions: { width: 200, height: 100 },
    });

    mixin.layoutChildren('parent');

    expect(child1.position).toEqual({ x: 10, y: 20 });
    expect(child2.position).toEqual({ x: 10, y: 60 });
  });

  it('recurses into nested layout parents', () => {
    const parent = makeNode('parent', { childLayout: { direction: 'vertical' } } as any);
    const nested = makeNode('nested', {
      parentId: 'parent',
      childLayout: { direction: 'horizontal' },
      position: { x: 0, y: 0 },
    } as any);
    const grandchild = makeNode('gc', { parentId: 'nested', position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [parent, nested, grandchild] });
    const mixin = createLayoutMixin(ctx);

    // First call for nested parent (bottom-up recursion), second for parent
    vi.mocked(computeChildLayout)
      .mockReturnValueOnce({
        positions: new Map([['gc', { x: 5, y: 5 }]]),
        dimensions: new Map(),
        parentDimensions: { width: 100, height: 50 },
      })
      .mockReturnValueOnce({
        positions: new Map([['nested', { x: 10, y: 20 }]]),
        dimensions: new Map(),
        parentDimensions: { width: 200, height: 100 },
      });

    mixin.layoutChildren('parent');

    // computeChildLayout should be called twice (once for nested, once for parent)
    expect(computeChildLayout).toHaveBeenCalledTimes(2);
  });

  it('skips excludeId when applying positions', () => {
    const parent = makeNode('parent', { childLayout: { direction: 'vertical' } } as any);
    const child1 = makeNode('c1', { parentId: 'parent', position: { x: 0, y: 0 } });
    const child2 = makeNode('c2', { parentId: 'parent', position: { x: 99, y: 99 } });
    const ctx = mockCtx({ nodes: [parent, child1, child2] });
    const mixin = createLayoutMixin(ctx);

    vi.mocked(computeChildLayout).mockReturnValueOnce({
      positions: new Map([
        ['c1', { x: 10, y: 20 }],
        ['c2', { x: 10, y: 60 }],
      ]),
      dimensions: new Map(),
      parentDimensions: { width: 200, height: 100 },
    });

    mixin.layoutChildren('parent', 'c2');

    expect(child1.position).toEqual({ x: 10, y: 20 });
    // c2 should not be moved
    expect(child2.position).toEqual({ x: 99, y: 99 });
  });

  it('auto-sizes parent with min/max constraints', () => {
    const parent = makeNode('parent', {
      childLayout: { direction: 'vertical' },
      minDimensions: { width: 300, height: 200 },
    } as any);
    const child = makeNode('c1', { parentId: 'parent', position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [parent, child] });
    const mixin = createLayoutMixin(ctx);

    // Computed size is smaller than min
    vi.mocked(computeChildLayout).mockReturnValueOnce({
      positions: new Map([['c1', { x: 10, y: 20 }]]),
      dimensions: new Map(),
      parentDimensions: { width: 150, height: 80 },
    });

    mixin.layoutChildren('parent');

    // Should be clamped to minDimensions
    expect(parent.dimensions!.width).toBe(300);
    expect(parent.dimensions!.height).toBe(200);
  });

  it('clamps children when parent is constrained', () => {
    const parent = makeNode('parent', {
      childLayout: { direction: 'vertical', padding: 10 },
      maxDimensions: { width: 100, height: 60 },
    } as any);
    const child = makeNode('c1', {
      parentId: 'parent',
      position: { x: 0, y: 0 },
      dimensions: { width: 200, height: 200 },
    });
    const ctx = mockCtx({ nodes: [parent, child] });
    const mixin = createLayoutMixin(ctx);

    // First call: unconstrained computation exceeds max
    vi.mocked(computeChildLayout).mockReturnValueOnce({
      positions: new Map([['c1', { x: 10, y: 10 }]]),
      dimensions: new Map(),
      parentDimensions: { width: 250, height: 200 },
    });
    // Second call: re-computation with constrained size feeds back clamped dims
    vi.mocked(computeChildLayout).mockReturnValueOnce({
      positions: new Map([['c1', { x: 10, y: 10 }]]),
      dimensions: new Map([['c1', { width: 80, height: 40 }]]),
      parentDimensions: { width: 100, height: 60 },
    });

    mixin.layoutChildren('parent');

    // Parent should be clamped to max
    expect(parent.dimensions!.width).toBe(100);
    expect(parent.dimensions!.height).toBe(60);

    // Children should be re-computed with constrained size (100 - 10*2 = 80, 60 - 10*2 = 40)
    expect(child.dimensions!.width).toBe(80);
    expect(child.dimensions!.height).toBe(40);
  });
});

// ── reorderChild ────────────────────────────────────────────────────────────

describe('createLayoutMixin — reorderChild', () => {
  it('returns early if node has no parent', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    const mixin = createLayoutMixin(ctx);

    mixin.reorderChild('n1', 0);

    expect(ctx._captureHistory).not.toHaveBeenCalled();
  });

  it('reassigns order values', () => {
    const parent = makeNode('parent', { childLayout: { direction: 'vertical' } } as any);
    const c1 = makeNode('c1', { parentId: 'parent', order: 0 });
    const c2 = makeNode('c2', { parentId: 'parent', order: 1 });
    const c3 = makeNode('c3', { parentId: 'parent', order: 2 });
    const ctx = mockCtx({ nodes: [parent, c1, c2, c3] });
    ctx._nodeMap.set('parent', parent);
    ctx._nodeMap.set('c1', c1);
    ctx._nodeMap.set('c2', c2);
    ctx._nodeMap.set('c3', c3);
    const mixin = createLayoutMixin(ctx);

    // Move c3 to position 0
    mixin.reorderChild('c3', 0);

    expect(c3.order).toBe(0);
    expect(c1.order).toBe(1);
    expect(c2.order).toBe(2);
  });

  it('calls layoutChildren and emits child-reorder', () => {
    const parent = makeNode('parent', { childLayout: { direction: 'vertical' } } as any);
    const c1 = makeNode('c1', { parentId: 'parent', order: 0 });
    const c2 = makeNode('c2', { parentId: 'parent', order: 1 });
    const ctx = mockCtx({ nodes: [parent, c1, c2] });
    ctx._nodeMap.set('parent', parent);
    ctx._nodeMap.set('c1', c1);
    ctx._nodeMap.set('c2', c2);
    const mixin = createLayoutMixin(ctx);

    mixin.reorderChild('c2', 0);

    expect(ctx._captureHistory).toHaveBeenCalledOnce();
    expect(ctx._emit).toHaveBeenCalledWith('child-reorder', {
      nodeId: 'c2',
      parentId: 'parent',
      order: 0,
    });
  });
});

// ── layout (dagre) ──────────────────────────────────────────────────────────

describe('createLayoutMixin — layout (dagre)', () => {
  it('calls _applyLayout with computed positions', async () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createLayoutMixin(ctx);

    await mixin.layout({ direction: 'LR', fitView: false, duration: 0 });

    // After C2 filter: nodes without parentId — same content as ctx.nodes here
    expect(computeDagreLayout).toHaveBeenCalledWith([n1], ctx.edges, {
      direction: 'LR',
      nodesep: undefined,
      ranksep: undefined,
    });
    // Node should have been repositioned by _applyLayout (instant, duration=0)
    expect(n1.position).toEqual({ x: 100, y: 50 });
    expect(ctx._emit).toHaveBeenCalledWith('layout', { type: 'dagre', direction: 'LR' });
  });
});

// ── forceLayout ─────────────────────────────────────────────────────────────

describe('createLayoutMixin — forceLayout', () => {
  it('calls _applyLayout with computed positions', async () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createLayoutMixin(ctx);

    await mixin.forceLayout({ charge: -500, fitView: false, duration: 0 });

    // After C2 filter: nodes without parentId — same content as ctx.nodes here
    expect(computeForceLayout).toHaveBeenCalledWith([n1], ctx.edges, {
      strength: undefined,
      distance: undefined,
      charge: -500,
      iterations: undefined,
      center: undefined,
    });
    expect(n1.position).toEqual({ x: 80, y: 60 });
    expect(ctx._emit).toHaveBeenCalledWith('layout', { type: 'force', charge: -500, distance: 150 });
  });
});

// ── treeLayout ──────────────────────────────────────────────────────────────

describe('createLayoutMixin — treeLayout', () => {
  it('calls _applyLayout with computed positions', async () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createLayoutMixin(ctx);

    await mixin.treeLayout({ layoutType: 'tree', direction: 'TB', fitView: false, duration: 0 });

    // After C2 filter: nodes without parentId — same content as ctx.nodes here
    expect(computeHierarchyLayout).toHaveBeenCalledWith([n1], ctx.edges, {
      layoutType: 'tree',
      direction: 'TB',
      nodeWidth: undefined,
      nodeHeight: undefined,
    });
    expect(n1.position).toEqual({ x: 120, y: 40 });
    expect(ctx._emit).toHaveBeenCalledWith('layout', { type: 'tree', layoutType: 'tree', direction: 'TB' });
  });
});

// ── elkLayout ───────────────────────────────────────────────────────────────

describe('createLayoutMixin — elkLayout', () => {
  it('calls _applyLayout with computed positions', async () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createLayoutMixin(ctx);

    await mixin.elkLayout({ algorithm: 'layered', direction: 'DOWN', fitView: false, duration: 0 });

    // After C2 filter: nodes without parentId — same content as ctx.nodes here
    expect(computeElkLayout).toHaveBeenCalledWith([n1], ctx.edges, {
      algorithm: 'layered',
      direction: 'DOWN',
      nodeSpacing: undefined,
      layerSpacing: undefined,
    });
    expect(n1.position).toEqual({ x: 90, y: 70 });
    expect(ctx._emit).toHaveBeenCalledWith('layout', { type: 'elk', algorithm: 'layered', direction: 'DOWN' });
  });
});
