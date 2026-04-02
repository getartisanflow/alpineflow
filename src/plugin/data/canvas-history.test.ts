// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { mockCtx } from './__test-utils';
import { createHistoryMixin } from './canvas-history';
import type { FlowNode, FlowEdge } from '../../core/types';
import { FlowHistory } from '../../core/history';

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    type: 'default',
    position: { x: 0, y: 0 },
    data: {},
    ...overrides,
  } as FlowNode;
}

function makeEdge(id: string, overrides: Partial<FlowEdge> = {}): FlowEdge {
  return { id, source: 'a', target: 'b', ...overrides };
}

// ── toObject ─────────────────────────────────────────────────────────────────

describe('createHistoryMixin — toObject', () => {
  it('returns a deep clone of nodes, edges, and viewport', () => {
    const node = makeNode('n1', { position: { x: 10, y: 20 } });
    const edge = makeEdge('e1');
    const ctx = mockCtx({
      nodes: [node],
      edges: [edge],
      viewport: { x: 5, y: 10, zoom: 1.5 },
    });
    const mixin = createHistoryMixin(ctx);

    const result = mixin.toObject();

    // Values should match
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].id).toBe('n1');
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].id).toBe('e1');
    expect(result.viewport).toEqual({ x: 5, y: 10, zoom: 1.5 });

    // Should be deep clones (not same references)
    expect(result.nodes).not.toBe(ctx.nodes);
    expect(result.edges).not.toBe(ctx.edges);
    expect(result.viewport).not.toBe(ctx.viewport);
  });

  it('emits a "save" event with the snapshot', () => {
    const ctx = mockCtx({
      nodes: [makeNode('n1')],
      edges: [makeEdge('e1')],
    });
    const mixin = createHistoryMixin(ctx);

    const result = mixin.toObject();

    expect(ctx._emit).toHaveBeenCalledWith('save', result);
  });

  it('returns empty arrays when canvas is empty', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);

    const result = mixin.toObject();

    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
    expect(result.viewport).toEqual({ x: 0, y: 0, zoom: 1 });
  });
});

// ── fromObject ───────────────────────────────────────────────────────────────

describe('createHistoryMixin — fromObject', () => {
  it('restores nodes and edges from a saved object', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);
    const saved = {
      nodes: [makeNode('n1'), makeNode('n2')],
      edges: [makeEdge('e1')],
    };

    mixin.fromObject(saved);

    expect(ctx.nodes).toHaveLength(2);
    expect(ctx.edges).toHaveLength(1);
  });

  it('deep-clones incoming nodes to avoid shared references', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);
    const original = [makeNode('n1')];

    mixin.fromObject({ nodes: original });

    expect(ctx.nodes[0]).not.toBe(original[0]);
    expect(ctx.nodes[0].id).toBe('n1');
  });

  it('deep-clones incoming edges to avoid shared references', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);
    const original = [makeEdge('e1')];

    mixin.fromObject({ edges: original });

    expect(ctx.edges[0]).not.toBe(original[0]);
    expect(ctx.edges[0].id).toBe('e1');
  });

  it('rebuilds node and edge maps', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);

    mixin.fromObject({ nodes: [makeNode('n1')], edges: [makeEdge('e1')] });

    expect(ctx._rebuildNodeMap).toHaveBeenCalledOnce();
    expect(ctx._rebuildEdgeMap).toHaveBeenCalledOnce();
  });

  it('applies viewport via panZoom when provided', () => {
    const setViewport = vi.fn();
    const ctx = mockCtx({
      _panZoom: { setViewport } as any,
      viewport: { x: 0, y: 0, zoom: 1 },
    });
    const mixin = createHistoryMixin(ctx);

    mixin.fromObject({ viewport: { x: 100, y: 200, zoom: 2 } });

    expect(setViewport).toHaveBeenCalledWith({ x: 100, y: 200, zoom: 2 });
  });

  it('merges partial viewport with current viewport', () => {
    const setViewport = vi.fn();
    const ctx = mockCtx({
      _panZoom: { setViewport } as any,
      viewport: { x: 10, y: 20, zoom: 1.5 },
    });
    const mixin = createHistoryMixin(ctx);

    mixin.fromObject({ viewport: { zoom: 2 } });

    expect(setViewport).toHaveBeenCalledWith({ x: 10, y: 20, zoom: 2 });
  });

  it('does not call setViewport when no viewport provided', () => {
    const setViewport = vi.fn();
    const ctx = mockCtx({
      _panZoom: { setViewport } as any,
    });
    const mixin = createHistoryMixin(ctx);

    mixin.fromObject({ nodes: [makeNode('n1')] });

    expect(setViewport).not.toHaveBeenCalled();
  });

  it('deselects all after restoring', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);

    mixin.fromObject({ nodes: [makeNode('n1')] });

    expect(ctx.deselectAll).toHaveBeenCalledOnce();
  });

  it('emits a "restore" event with the input object', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);
    const saved = { nodes: [makeNode('n1')], edges: [makeEdge('e1')] };

    mixin.fromObject(saved);

    expect(ctx._emit).toHaveBeenCalledWith('restore', saved);
  });

  it('schedules auto-layout after restoring', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);

    mixin.fromObject({ nodes: [makeNode('n1')] });

    expect(ctx._scheduleAutoLayout).toHaveBeenCalledOnce();
  });

  it('skips nodes assignment when obj.nodes is undefined', () => {
    const ctx = mockCtx({ nodes: [makeNode('existing')] });
    const mixin = createHistoryMixin(ctx);

    mixin.fromObject({ edges: [makeEdge('e1')] });

    // Nodes should not have been replaced
    expect(ctx.nodes).toHaveLength(1);
    expect(ctx.nodes[0].id).toBe('existing');
  });

  it('skips edges assignment when obj.edges is undefined', () => {
    const ctx = mockCtx({ edges: [makeEdge('existing')] });
    const mixin = createHistoryMixin(ctx);

    mixin.fromObject({ nodes: [makeNode('n1')] });

    // Edges should not have been replaced
    expect(ctx.edges).toHaveLength(1);
    expect(ctx.edges[0].id).toBe('existing');
  });
});

// ── $reset ───────────────────────────────────────────────────────────────────

describe('createHistoryMixin — $reset', () => {
  it('restores to initial config state', () => {
    const ctx = mockCtx({
      _config: {
        nodes: [makeNode('initial')],
        edges: [makeEdge('initial-edge')],
        viewport: { x: 50, y: 50, zoom: 2 },
      } as any,
    });
    const mixin = createHistoryMixin(ctx);

    mixin.$reset();

    // fromObject should have been called and populated nodes/edges
    expect(ctx.nodes).toHaveLength(1);
    expect(ctx.nodes[0].id).toBe('initial');
    expect(ctx.edges).toHaveLength(1);
    expect(ctx.edges[0].id).toBe('initial-edge');
  });

  it('uses defaults when config has no nodes/edges/viewport', () => {
    const ctx = mockCtx({ _config: {} as any });
    const mixin = createHistoryMixin(ctx);

    mixin.$reset();

    // Should pass empty arrays and default viewport
    expect(ctx.nodes).toEqual([]);
    expect(ctx.edges).toEqual([]);
    expect(ctx._rebuildNodeMap).toHaveBeenCalled();
    expect(ctx._rebuildEdgeMap).toHaveBeenCalled();
  });
});

// ── $clear ───────────────────────────────────────────────────────────────────

describe('createHistoryMixin — $clear', () => {
  it('empties all nodes and edges', () => {
    const ctx = mockCtx({
      nodes: [makeNode('n1'), makeNode('n2')],
      edges: [makeEdge('e1')],
    });
    const mixin = createHistoryMixin(ctx);

    mixin.$clear();

    expect(ctx.nodes).toEqual([]);
    expect(ctx.edges).toEqual([]);
  });

  it('rebuilds maps and deselects after clearing', () => {
    const ctx = mockCtx({
      nodes: [makeNode('n1')],
      edges: [makeEdge('e1')],
    });
    const mixin = createHistoryMixin(ctx);

    mixin.$clear();

    expect(ctx._rebuildNodeMap).toHaveBeenCalledOnce();
    expect(ctx._rebuildEdgeMap).toHaveBeenCalledOnce();
    expect(ctx.deselectAll).toHaveBeenCalledOnce();
  });

  it('schedules auto-layout after clearing', () => {
    const ctx = mockCtx();
    const mixin = createHistoryMixin(ctx);

    mixin.$clear();

    expect(ctx._scheduleAutoLayout).toHaveBeenCalledOnce();
  });
});

// ── undo ─────────────────────────────────────────────────────────────────────

describe('createHistoryMixin — undo', () => {
  it('does nothing when _history is null', () => {
    const ctx = mockCtx({ _history: null });
    const mixin = createHistoryMixin(ctx);

    // Should not throw
    mixin.undo();

    expect(ctx._rebuildNodeMap).not.toHaveBeenCalled();
  });

  it('applies snapshot from history and rebuilds maps', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history });
    const mixin = createHistoryMixin(ctx);

    // Capture initial state, then change nodes
    const original = [makeNode('original')];
    history.capture({ nodes: original, edges: [] });
    ctx.nodes = [makeNode('modified')];

    mixin.undo();

    expect(ctx.nodes).toHaveLength(1);
    expect(ctx.nodes[0].id).toBe('original');
    expect(ctx._rebuildNodeMap).toHaveBeenCalled();
    expect(ctx._rebuildEdgeMap).toHaveBeenCalled();
  });

  it('deselects all after applying undo', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history });
    const mixin = createHistoryMixin(ctx);

    history.capture({ nodes: [makeNode('n1')], edges: [] });

    mixin.undo();

    expect(ctx.deselectAll).toHaveBeenCalledOnce();
  });

  it('does nothing when history has no past snapshots', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history });
    const mixin = createHistoryMixin(ctx);

    mixin.undo();

    // No snapshot returned, so no rebuilds
    expect(ctx._rebuildNodeMap).not.toHaveBeenCalled();
    expect(ctx.deselectAll).not.toHaveBeenCalled();
  });

  it('restores edges from snapshot', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history });
    const mixin = createHistoryMixin(ctx);

    history.capture({ nodes: [], edges: [makeEdge('original-edge')] });
    ctx.edges = [makeEdge('modified-edge')];

    mixin.undo();

    expect(ctx.edges).toHaveLength(1);
    expect(ctx.edges[0].id).toBe('original-edge');
  });
});

// ── redo ─────────────────────────────────────────────────────────────────────

describe('createHistoryMixin — redo', () => {
  it('does nothing when _history is null', () => {
    const ctx = mockCtx({ _history: null });
    const mixin = createHistoryMixin(ctx);

    mixin.redo();

    expect(ctx._rebuildNodeMap).not.toHaveBeenCalled();
  });

  it('applies snapshot from history future stack', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history });
    const mixin = createHistoryMixin(ctx);

    // Set up: capture, change, undo, then redo should get us back
    history.capture({ nodes: [makeNode('state1')], edges: [] });
    ctx.nodes = [makeNode('state2')];

    // Undo to go back to state1
    mixin.undo();
    expect(ctx.nodes[0].id).toBe('state1');

    // Reset mocks so we can assert the redo call independently
    vi.mocked(ctx._rebuildNodeMap).mockClear();
    vi.mocked(ctx._rebuildEdgeMap).mockClear();
    vi.mocked(ctx.deselectAll).mockClear();

    // Redo to go forward to state2
    mixin.redo();
    expect(ctx.nodes[0].id).toBe('state2');
    expect(ctx._rebuildNodeMap).toHaveBeenCalled();
    expect(ctx._rebuildEdgeMap).toHaveBeenCalled();
    expect(ctx.deselectAll).toHaveBeenCalled();
  });

  it('does nothing when history has no future snapshots', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history });
    const mixin = createHistoryMixin(ctx);

    mixin.redo();

    expect(ctx._rebuildNodeMap).not.toHaveBeenCalled();
    expect(ctx.deselectAll).not.toHaveBeenCalled();
  });
});

// ── canUndo / canRedo ────────────────────────────────────────────────────────

describe('createHistoryMixin — canUndo / canRedo', () => {
  it('returns false when _history is null', () => {
    const ctx = mockCtx({ _history: null });
    const mixin = createHistoryMixin(ctx);

    expect(mixin.canUndo).toBe(false);
    expect(mixin.canRedo).toBe(false);
  });

  it('delegates canUndo to _history', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history });
    const mixin = createHistoryMixin(ctx);

    expect(mixin.canUndo).toBe(false);

    history.capture({ nodes: [makeNode('n1')], edges: [] });

    expect(mixin.canUndo).toBe(true);
  });

  it('delegates canRedo to _history', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history });
    const mixin = createHistoryMixin(ctx);

    expect(mixin.canRedo).toBe(false);

    history.capture({ nodes: [makeNode('n1')], edges: [] });
    // Undo creates a future entry
    history.undo({ nodes: [], edges: [] });

    expect(mixin.canRedo).toBe(true);
  });
});
