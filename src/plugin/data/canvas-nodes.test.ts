// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockCtx } from './__test-utils';
import { createNodesMixin } from './canvas-nodes';
import type { FlowNode, FlowEdge } from '../../core/types';

// ── Mock external core modules ──────────────────────────────────────────────

vi.mock('../../core/sub-flow', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    sortNodesTopological: vi.fn((nodes) => nodes),
    getDescendantIds: vi.fn(() => new Set<string>()),
  };
});

vi.mock('../../core/graph', () => ({
  computeReconnectionEdges: vi.fn(() => []),
  getConnectedEdges: vi.fn(() => []),
  getOutgoers: vi.fn(() => []),
  getIncomers: vi.fn(() => []),
  areNodesConnected: vi.fn(() => false),
}));

vi.mock('../../core/child-validation', () => ({
  validateChildAdd: vi.fn(() => ({ valid: true, errors: [] })),
  validateChildRemove: vi.fn(() => ({ valid: true, errors: [] })),
}));

vi.mock('../../core/intersection', () => ({
  getIntersectingNodes: vi.fn(() => []),
  isNodeIntersecting: vi.fn(() => false),
}));

vi.mock('../../collab/store', () => ({
  collabStore: new WeakMap(),
}));

// Re-import mocked modules for assertions
import { sortNodesTopological, getDescendantIds } from '../../core/sub-flow';
import { computeReconnectionEdges, getOutgoers, getIncomers, getConnectedEdges, areNodesConnected } from '../../core/graph';
import { validateChildAdd, validateChildRemove } from '../../core/child-validation';
import { getIntersectingNodes as coreGetIntersectingNodes, isNodeIntersecting as coreIsNodeIntersecting } from '../../core/intersection';

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    position: { x: 0, y: 0 },
    data: {},
    ...overrides,
  } as FlowNode;
}

function makeEdge(id: string, source: string, target: string, overrides: Partial<FlowEdge> = {}): FlowEdge {
  return { id, source, target, ...overrides };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── addNodes ────────────────────────────────────────────────────────────────

describe('createNodesMixin — addNodes', () => {
  it('adds a single node to ctx.nodes', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    const node = makeNode('n1');

    mixin.addNodes(node);

    expect(ctx.nodes).toHaveLength(1);
    expect(ctx.nodes[0].id).toBe('n1');
  });

  it('adds an array of nodes', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    const nodes = [makeNode('n1'), makeNode('n2'), makeNode('n3')];

    mixin.addNodes(nodes);

    expect(ctx.nodes).toHaveLength(3);
    expect(ctx.nodes.map((n: FlowNode) => n.id)).toEqual(['n1', 'n2', 'n3']);
  });

  it('captures history and emits nodes-change', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    const node = makeNode('n1');

    mixin.addNodes(node);

    expect(ctx._captureHistory).toHaveBeenCalledOnce();
    expect(ctx._emit).toHaveBeenCalledWith('nodes-change', {
      type: 'add',
      nodes: [node],
    });
  });

  it('sorts topologically and rebuilds node map', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);

    mixin.addNodes(makeNode('n1'));

    expect(sortNodesTopological).toHaveBeenCalledWith(ctx.nodes);
    expect(ctx._rebuildNodeMap).toHaveBeenCalledOnce();
  });

  it('saves initial dimensions when node has dimensions', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    const node = makeNode('n1', { dimensions: { width: 200, height: 100 } });

    mixin.addNodes(node);

    expect(ctx._initialDimensions.has('n1')).toBe(true);
    expect(ctx._initialDimensions.get('n1')).toEqual({ width: 200, height: 100 });
  });

  it('does not save initial dimensions when node has no dimensions', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    const node = makeNode('n1');

    mixin.addNodes(node);

    expect(ctx._initialDimensions.has('n1')).toBe(false);
  });

  it('rejects node when validateChildAdd fails', () => {
    const parentNode = makeNode('parent');
    const ctx = mockCtx({
      nodes: [parentNode],
    });
    ctx._nodeMap.set('parent', parentNode);

    const onFail = vi.fn();
    ctx._config = { onChildValidationFail: onFail } as any;
    ctx._getChildValidation = vi.fn(() => ({ maxChildren: 0 })) as any;
    vi.mocked(validateChildAdd).mockReturnValueOnce({
      valid: false,
      rule: 'maxChildren',
      message: 'Too many children',
    } as any);

    const mixin = createNodesMixin(ctx);
    const child = makeNode('child', { parentId: 'parent' });

    mixin.addNodes(child);

    // Node should not be added
    expect(ctx.nodes.filter((n: FlowNode) => n.id === 'child')).toHaveLength(0);
    // Callback should be invoked
    expect(onFail).toHaveBeenCalledWith(
      expect.objectContaining({
        parent: parentNode,
        child,
        operation: 'add',
        rule: 'maxChildren',
        message: 'Too many children',
      }),
    );
  });

  it('calls layoutChildren for layout parents that received new children', () => {
    const parentNode = makeNode('parent', { childLayout: { direction: 'vertical' } } as any);
    const ctx = mockCtx({
      nodes: [parentNode],
    });
    ctx._nodeMap.set('parent', parentNode);

    // After addNodes pushes nodes and rebuilds map, parent must still be in _nodeMap
    ctx._rebuildNodeMap = vi.fn(() => {
      ctx._nodeMap.set('parent', parentNode);
    });

    const mixin = createNodesMixin(ctx);
    const child = makeNode('child', { parentId: 'parent' });

    mixin.addNodes(child);

    expect(ctx.layoutChildren).toHaveBeenCalledWith('parent');
  });

  it('schedules auto-layout after adding', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);

    mixin.addNodes(makeNode('n1'));

    expect(ctx._scheduleAutoLayout).toHaveBeenCalledOnce();
  });

  it('recomputes child validation after adding', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);

    mixin.addNodes(makeNode('n1'));

    expect(ctx._recomputeChildValidation).toHaveBeenCalledOnce();
  });
});

// ── removeNodes ─────────────────────────────────────────────────────────────

describe('createNodesMixin — removeNodes', () => {
  it('removes a single node by string ID', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    ctx._nodeMap.set('n1', n1);
    ctx._nodeMap.set('n2', n2);
    const mixin = createNodesMixin(ctx);

    mixin.removeNodes('n1');

    expect(ctx.nodes).toHaveLength(1);
    expect(ctx.nodes[0].id).toBe('n2');
  });

  it('removes multiple nodes by ID array', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const n3 = makeNode('n3');
    const ctx = mockCtx({ nodes: [n1, n2, n3] });
    ctx._nodeMap.set('n1', n1);
    ctx._nodeMap.set('n2', n2);
    ctx._nodeMap.set('n3', n3);
    const mixin = createNodesMixin(ctx);

    mixin.removeNodes(['n1', 'n3']);

    expect(ctx.nodes).toHaveLength(1);
    expect(ctx.nodes[0].id).toBe('n2');
  });

  it('cascades removal to descendants', () => {
    const parent = makeNode('parent');
    const child = makeNode('child', { parentId: 'parent' });
    const ctx = mockCtx({ nodes: [parent, child] });
    ctx._nodeMap.set('parent', parent);
    ctx._nodeMap.set('child', child);

    vi.mocked(getDescendantIds).mockReturnValueOnce(new Set(['child']));

    const mixin = createNodesMixin(ctx);
    mixin.removeNodes('parent');

    // Both parent and descendant should be removed
    expect(ctx.nodes).toHaveLength(0);
  });

  it('removes connected edges', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const n3 = makeNode('n3');
    const e1 = makeEdge('e1', 'n1', 'n2');
    const e2 = makeEdge('e2', 'n2', 'n3');
    const ctx = mockCtx({
      nodes: [n1, n2, n3],
      edges: [e1, e2],
    });
    ctx._nodeMap.set('n1', n1);
    ctx._nodeMap.set('n2', n2);
    ctx._nodeMap.set('n3', n3);
    const mixin = createNodesMixin(ctx);

    mixin.removeNodes('n2');

    // Both edges connected to n2 should be removed
    expect(ctx.edges).toHaveLength(0);
  });

  it('blocks removal when validateChildRemove fails', () => {
    const parent = makeNode('parent');
    const child = makeNode('child', { parentId: 'parent' });
    const ctx = mockCtx({ nodes: [parent, child] });
    ctx._nodeMap.set('parent', parent);
    ctx._nodeMap.set('child', child);

    const onFail = vi.fn();
    ctx._config = { onChildValidationFail: onFail } as any;
    ctx._getChildValidation = vi.fn(() => ({ minChildren: 1 })) as any;
    vi.mocked(validateChildRemove).mockReturnValueOnce({
      valid: false,
      rule: 'minChildren',
      message: 'Minimum children required',
    } as any);

    const mixin = createNodesMixin(ctx);
    mixin.removeNodes('child');

    // Child should NOT be removed because validation failed
    expect(ctx.nodes).toHaveLength(2);
    expect(onFail).toHaveBeenCalledWith(
      expect.objectContaining({
        parent,
        child,
        operation: 'remove',
        rule: 'minChildren',
        message: 'Minimum children required',
      }),
    );
  });

  it('cleans up selection and initial dimensions', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    ctx._nodeMap.set('n1', n1);
    ctx.selectedNodes.add('n1');
    ctx._initialDimensions.set('n1', { width: 100, height: 50 });
    const mixin = createNodesMixin(ctx);

    mixin.removeNodes('n1');

    expect(ctx.selectedNodes.has('n1')).toBe(false);
    expect(ctx._initialDimensions.has('n1')).toBe(false);
  });

  it('creates reconnection edges when config.reconnectOnDelete is set', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const n3 = makeNode('n3');
    const e1 = makeEdge('e1', 'n1', 'n2');
    const e2 = makeEdge('e2', 'n2', 'n3');
    const ctx = mockCtx({
      nodes: [n1, n2, n3],
      edges: [e1, e2],
      _config: { reconnectOnDelete: true } as any,
    });
    ctx._nodeMap.set('n1', n1);
    ctx._nodeMap.set('n2', n2);
    ctx._nodeMap.set('n3', n3);

    const reconnEdge = makeEdge('r1', 'n1', 'n3');
    vi.mocked(computeReconnectionEdges).mockReturnValueOnce([reconnEdge]);

    const mixin = createNodesMixin(ctx);
    mixin.removeNodes('n2');

    expect(computeReconnectionEdges).toHaveBeenCalled();
    // Reconnection edge should be added
    expect(ctx.edges).toContain(reconnEdge);
    // Should emit edges-change for reconnected edges
    expect(ctx._emit).toHaveBeenCalledWith('edges-change', {
      type: 'add',
      edges: [reconnEdge],
    });
  });

  it('re-layouts parent nodes that lost children', () => {
    const parent = makeNode('parent', { childLayout: { direction: 'vertical' } } as any);
    const child = makeNode('child', { parentId: 'parent' });
    const ctx = mockCtx({ nodes: [parent, child] });
    ctx._nodeMap.set('parent', parent);
    ctx._nodeMap.set('child', child);

    // After removeNodes filters nodes, parent should still be in _nodeMap
    ctx._rebuildNodeMap = vi.fn(() => {
      ctx._nodeMap.set('parent', parent);
    });

    const mixin = createNodesMixin(ctx);
    mixin.removeNodes('child');

    expect(ctx.layoutChildren).toHaveBeenCalledWith('parent');
  });

  it('captures history before mutation', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    ctx._nodeMap.set('n1', n1);
    const mixin = createNodesMixin(ctx);

    mixin.removeNodes('n1');

    expect(ctx._captureHistory).toHaveBeenCalledOnce();
  });

  it('schedules auto-layout after removing', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    ctx._nodeMap.set('n1', n1);
    const mixin = createNodesMixin(ctx);

    mixin.removeNodes('n1');

    expect(ctx._scheduleAutoLayout).toHaveBeenCalledOnce();
  });
});

// ── getNode ─────────────────────────────────────────────────────────────────

describe('createNodesMixin — getNode', () => {
  it('returns node from _nodeMap', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx();
    ctx._nodeMap.set('n1', n1);
    const mixin = createNodesMixin(ctx);

    expect(mixin.getNode('n1')).toBe(n1);
  });

  it('returns undefined for missing node', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);

    expect(mixin.getNode('nonexistent')).toBeUndefined();
  });
});

// ── getOutgoers ─────────────────────────────────────────────────────────────

describe('createNodesMixin — getOutgoers', () => {
  it('delegates to graph utils', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    vi.mocked(getOutgoers).mockReturnValueOnce([n2]);
    const mixin = createNodesMixin(ctx);

    const result = mixin.getOutgoers('n1');

    expect(getOutgoers).toHaveBeenCalledWith('n1', ctx.nodes, ctx.edges);
    expect(result).toEqual([n2]);
  });
});

// ── getIncomers ─────────────────────────────────────────────────────────────

describe('createNodesMixin — getIncomers', () => {
  it('delegates to graph utils', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    vi.mocked(getIncomers).mockReturnValueOnce([n1]);
    const mixin = createNodesMixin(ctx);

    const result = mixin.getIncomers('n2');

    expect(getIncomers).toHaveBeenCalledWith('n2', ctx.nodes, ctx.edges);
    expect(result).toEqual([n1]);
  });
});

// ── getConnectedEdges ───────────────────────────────────────────────────────

describe('createNodesMixin — getConnectedEdges', () => {
  it('delegates to graph utils', () => {
    const edge = makeEdge('e1', 'n1', 'n2');
    const ctx = mockCtx({ edges: [edge] });
    vi.mocked(getConnectedEdges).mockReturnValueOnce([edge]);
    const mixin = createNodesMixin(ctx);

    const result = mixin.getConnectedEdges('n1');

    expect(getConnectedEdges).toHaveBeenCalledWith('n1', ctx.edges);
    expect(result).toEqual([edge]);
  });
});

// ── areNodesConnected ───────────────────────────────────────────────────────

describe('createNodesMixin — areNodesConnected', () => {
  it('delegates to graph utils with default directed=false', () => {
    const ctx = mockCtx();
    vi.mocked(areNodesConnected).mockReturnValueOnce(true);
    const mixin = createNodesMixin(ctx);

    const result = mixin.areNodesConnected('n1', 'n2');

    expect(areNodesConnected).toHaveBeenCalledWith('n1', 'n2', ctx.edges, false);
    expect(result).toBe(true);
  });

  it('passes directed=true when specified', () => {
    const ctx = mockCtx();
    vi.mocked(areNodesConnected).mockReturnValueOnce(false);
    const mixin = createNodesMixin(ctx);

    const result = mixin.areNodesConnected('n1', 'n2', true);

    expect(areNodesConnected).toHaveBeenCalledWith('n1', 'n2', ctx.edges, true);
    expect(result).toBe(false);
  });
});

// ── setNodeFilter ───────────────────────────────────────────────────────────

describe('createNodesMixin — setNodeFilter', () => {
  it('sets filtered flag on nodes', () => {
    const n1 = makeNode('n1', { data: { type: 'input' } });
    const n2 = makeNode('n2', { data: { type: 'output' } });
    const ctx = mockCtx({ nodes: [n1, n2] });
    const mixin = createNodesMixin(ctx);

    mixin.setNodeFilter((node) => node.data.type === 'input');

    expect(n1.filtered).toBe(false);
    expect(n2.filtered).toBe(true);
  });

  it('emits node-filter-change with filtered and visible arrays', () => {
    const n1 = makeNode('n1', { data: { type: 'input' } });
    const n2 = makeNode('n2', { data: { type: 'output' } });
    const ctx = mockCtx({ nodes: [n1, n2] });
    const mixin = createNodesMixin(ctx);

    mixin.setNodeFilter((node) => node.data.type === 'input');

    expect(ctx._emit).toHaveBeenCalledWith('node-filter-change', {
      filtered: [n2],
      visible: [n1],
    });
  });
});

// ── clearNodeFilter ─────────────────────────────────────────────────────────

describe('createNodesMixin — clearNodeFilter', () => {
  it('clears filtered flags on nodes', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    (n1 as any).filtered = true;
    (n2 as any).filtered = true;
    const ctx = mockCtx({ nodes: [n1, n2] });
    const mixin = createNodesMixin(ctx);

    mixin.clearNodeFilter();

    expect(n1.filtered).toBe(false);
    expect(n2.filtered).toBe(false);
    expect(ctx._emit).toHaveBeenCalledWith('node-filter-change', {
      filtered: [],
      visible: [n1, n2],
    });
  });

  it('does not emit when nothing was filtered', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    const mixin = createNodesMixin(ctx);

    mixin.clearNodeFilter();

    expect(ctx._emit).not.toHaveBeenCalled();
  });
});

// ── getIntersectingNodes ────────────────────────────────────────────────────

describe('createNodesMixin — getIntersectingNodes', () => {
  it('accepts string ID and looks up node from ctx.nodes', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    vi.mocked(coreGetIntersectingNodes).mockReturnValueOnce([n2]);
    const mixin = createNodesMixin(ctx);

    const result = mixin.getIntersectingNodes('n1');

    expect(coreGetIntersectingNodes).toHaveBeenCalledWith(n1, ctx.nodes, undefined);
    expect(result).toEqual([n2]);
  });

  it('accepts FlowNode object directly', () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    vi.mocked(coreGetIntersectingNodes).mockReturnValueOnce([]);
    const mixin = createNodesMixin(ctx);

    mixin.getIntersectingNodes(n1, true);

    expect(coreGetIntersectingNodes).toHaveBeenCalledWith(n1, ctx.nodes, true);
  });

  it('returns empty array for unknown ID', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);

    const result = mixin.getIntersectingNodes('nonexistent');

    expect(result).toEqual([]);
    expect(coreGetIntersectingNodes).not.toHaveBeenCalled();
  });
});

// ── isNodeIntersecting ──────────────────────────────────────────────────────

describe('createNodesMixin — isNodeIntersecting', () => {
  it('returns boolean from core', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    vi.mocked(coreIsNodeIntersecting).mockReturnValueOnce(true);
    const mixin = createNodesMixin(ctx);

    const result = mixin.isNodeIntersecting('n1', 'n2');

    expect(coreIsNodeIntersecting).toHaveBeenCalledWith(n1, n2, undefined);
    expect(result).toBe(true);
  });

  it('returns false when node not found', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);

    const result = mixin.isNodeIntersecting('nonexistent', 'other');

    expect(result).toBe(false);
    expect(coreIsNodeIntersecting).not.toHaveBeenCalled();
  });

  it('accepts FlowNode objects directly', () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    vi.mocked(coreIsNodeIntersecting).mockReturnValueOnce(false);
    const mixin = createNodesMixin(ctx);

    const result = mixin.isNodeIntersecting(n1, n2, true);

    expect(coreIsNodeIntersecting).toHaveBeenCalledWith(n1, n2, true);
    expect(result).toBe(false);
  });
});

// ── addNodes center:true immutability ───────────────────────────────────────

describe('createNodesMixin — addNodes center:true immutability', () => {
  it('does not mutate the caller\'s original node objects when center is true', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    const originalPosition = { x: 100, y: 200 };
    const node = makeNode('n1', { position: { ...originalPosition } });

    mixin.addNodes(node, { center: true });

    // The caller's original node position should remain unchanged
    expect(node.position).toEqual(originalPosition);
  });

  it('does not mutate positions of multiple original nodes when center is true', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    const pos1 = { x: 50, y: 60 };
    const pos2 = { x: 300, y: 400 };
    const n1 = makeNode('n1', { position: { ...pos1 } });
    const n2 = makeNode('n2', { position: { ...pos2 } });

    mixin.addNodes([n1, n2], { center: true });

    expect(n1.position).toEqual(pos1);
    expect(n2.position).toEqual(pos2);
  });
});
