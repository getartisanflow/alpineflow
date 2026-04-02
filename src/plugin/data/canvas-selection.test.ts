// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { mockCtx } from './__test-utils';
import { createSelectionMixin } from './canvas-selection';
import { copySelection, pasteClipboard, cutSelection, clearClipboard } from '../../core/clipboard';
import type { FlowNode, FlowEdge } from '../../core/types';

// jsdom doesn't implement CSS.escape — polyfill it (W3C spec algorithm)
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string): string => {
      const str = String(value);
      const len = str.length;
      let result = '';
      for (let i = 0; i < len; i++) {
        const ch = str.charCodeAt(i);
        if (ch === 0x0000) { result += '\uFFFD'; continue; }
        if (
          (ch >= 0x0001 && ch <= 0x001F) || ch === 0x007F ||
          (i === 0 && ch >= 0x0030 && ch <= 0x0039) ||
          (i === 1 && ch >= 0x0030 && ch <= 0x0039 && str.charCodeAt(0) === 0x002D)
        ) {
          result += '\\' + ch.toString(16) + ' ';
          continue;
        }
        if (i === 0 && len === 1 && ch === 0x002D) { result += '\\' + str.charAt(i); continue; }
        if (
          ch >= 0x0080 ||
          ch === 0x002D || ch === 0x005F ||
          (ch >= 0x0030 && ch <= 0x0039) ||
          (ch >= 0x0041 && ch <= 0x005A) ||
          (ch >= 0x0061 && ch <= 0x007A)
        ) {
          result += str.charAt(i);
          continue;
        }
        result += '\\' + str.charAt(i);
      }
      return result;
    };
  }
});

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

// ── deselectAll ───────────────────────────────────────────────────────────────

describe('createSelectionMixin — deselectAll', () => {
  it('does nothing when nothing is selected', () => {
    const ctx = mockCtx();
    const mixin = createSelectionMixin(ctx);

    mixin.deselectAll();

    expect(ctx._emitSelectionChange).not.toHaveBeenCalled();
  });

  it('clears selectedNodes and selectedEdges sets', () => {
    const n1 = makeNode('n1', { selected: true });
    const e1 = makeEdge('e1', { selected: true } as any);
    const ctx = mockCtx();
    ctx.selectedNodes.add('n1');
    ctx.selectedEdges.add('e1');
    vi.mocked(ctx.getNode).mockImplementation((id: string) => (id === 'n1' ? n1 : undefined));
    vi.mocked(ctx.getEdge).mockImplementation((id: string) => (id === 'e1' ? e1 : undefined));
    const mixin = createSelectionMixin(ctx);

    mixin.deselectAll();

    expect(ctx.selectedNodes.size).toBe(0);
    expect(ctx.selectedEdges.size).toBe(0);
  });

  it('sets selected = false on node and edge data objects', () => {
    const n1 = makeNode('n1', { selected: true });
    const e1 = makeEdge('e1', { selected: true } as any);
    const ctx = mockCtx();
    ctx.selectedNodes.add('n1');
    ctx.selectedEdges.add('e1');
    vi.mocked(ctx.getNode).mockImplementation((id: string) => (id === 'n1' ? n1 : undefined));
    vi.mocked(ctx.getEdge).mockImplementation((id: string) => (id === 'e1' ? e1 : undefined));
    const mixin = createSelectionMixin(ctx);

    mixin.deselectAll();

    expect(n1.selected).toBe(false);
    expect(e1.selected).toBe(false);
  });

  it('clears selectedRows', () => {
    const ctx = mockCtx();
    ctx.selectedRows.add('row1');
    const mixin = createSelectionMixin(ctx);

    mixin.deselectAll();

    expect(ctx.selectedRows.size).toBe(0);
  });

  it('removes CSS selection classes from DOM elements', () => {
    const container = document.createElement('div');
    const nodeEl = document.createElement('div');
    nodeEl.classList.add('flow-node-selected');
    nodeEl.setAttribute('data-flow-node-id', 'n1');
    container.appendChild(nodeEl);

    const edgeEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgeEl.classList.add('flow-edge-selected');
    edgeEl.setAttribute('data-flow-edge-id', 'e1');
    container.appendChild(edgeEl);

    const rowEl = document.createElement('div');
    rowEl.classList.add('flow-row-selected');
    container.appendChild(rowEl);

    const ctx = mockCtx({ _container: container });
    ctx.selectedNodes.add('n1');
    const mixin = createSelectionMixin(ctx);

    mixin.deselectAll();

    expect(nodeEl.classList.contains('flow-node-selected')).toBe(false);
    expect(edgeEl.classList.contains('flow-edge-selected')).toBe(false);
    expect(rowEl.classList.contains('flow-row-selected')).toBe(false);
  });

  it('emits selection-change event', () => {
    const ctx = mockCtx();
    ctx.selectedNodes.add('n1');
    const mixin = createSelectionMixin(ctx);

    mixin.deselectAll();

    expect(ctx._emitSelectionChange).toHaveBeenCalledOnce();
  });
});

// ── deleteSelected ───────────────────────────────────────────────────────────

describe('createSelectionMixin — deleteSelected', () => {
  it('does nothing when nothing is selected', async () => {
    const ctx = mockCtx();
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(ctx.removeNodes).not.toHaveBeenCalled();
    expect(ctx.removeEdges).not.toHaveBeenCalled();
  });

  it('deletes selected nodes and calls removeNodes', async () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    ctx.selectedNodes.add('n1');
    ctx.selectedNodes.add('n2');
    vi.mocked(ctx.getNode).mockImplementation((id: string) => {
      if (id === 'n1') return n1;
      if (id === 'n2') return n2;
      return undefined;
    });
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(ctx.removeNodes).toHaveBeenCalledWith(['n1', 'n2']);
  });

  it('deletes selected edges and calls removeEdges', async () => {
    const e1 = makeEdge('e1');
    const e2 = makeEdge('e2');
    const ctx = mockCtx({ edges: [e1, e2] });
    ctx.selectedEdges.add('e1');
    ctx.selectedEdges.add('e2');
    vi.mocked(ctx.getEdge).mockImplementation((id: string) => {
      if (id === 'e1') return e1;
      if (id === 'e2') return e2;
      return undefined;
    });
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(ctx.removeEdges).toHaveBeenCalled();
  });

  it('skips nodes with deletable === false', async () => {
    const n1 = makeNode('n1', { deletable: false });
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    ctx.selectedNodes.add('n1');
    ctx.selectedNodes.add('n2');
    vi.mocked(ctx.getNode).mockImplementation((id: string) => {
      if (id === 'n1') return n1;
      if (id === 'n2') return n2;
      return undefined;
    });
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    // Only n2 should be deleted
    expect(ctx.removeNodes).toHaveBeenCalledWith(['n2']);
  });

  it('skips edges with deletable === false', async () => {
    const e1 = makeEdge('e1', { deletable: false } as any);
    const e2 = makeEdge('e2');
    const ctx = mockCtx({ edges: [e1, e2] });
    ctx.selectedEdges.add('e1');
    ctx.selectedEdges.add('e2');
    vi.mocked(ctx.getEdge).mockImplementation((id: string) => {
      if (id === 'e1') return e1;
      if (id === 'e2') return e2;
      return undefined;
    });
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    // Only e2 should be in the remaining edges filter
    const removeCall = vi.mocked(ctx.removeEdges).mock.calls[0];
    expect(removeCall[0]).toEqual(['e2']);
  });

  it('cascades edge deletion for edges connected to deleted nodes', async () => {
    const n1 = makeNode('n1');
    const e1 = makeEdge('e1', { source: 'n1', target: 'n2' });
    const ctx = mockCtx({ nodes: [n1], edges: [e1] });
    ctx.selectedNodes.add('n1');
    vi.mocked(ctx.getNode).mockImplementation((id: string) => (id === 'n1' ? n1 : undefined));
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(ctx.removeNodes).toHaveBeenCalledWith(['n1']);
  });

  it('captures history and suspends/resumes around deletion', async () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    ctx.selectedNodes.add('n1');
    vi.mocked(ctx.getNode).mockReturnValue(n1);
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(ctx._captureHistory).toHaveBeenCalledOnce();
    expect(ctx._suspendHistory).toHaveBeenCalledOnce();
    expect(ctx._resumeHistory).toHaveBeenCalledOnce();
  });

  it('calls _recomputeChildValidation after deletion', async () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    ctx.selectedNodes.add('n1');
    vi.mocked(ctx.getNode).mockReturnValue(n1);
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(ctx._recomputeChildValidation).toHaveBeenCalledOnce();
  });

  it('calls onBeforeDelete callback when configured', async () => {
    const n1 = makeNode('n1');
    const e1 = makeEdge('e1', { source: 'n1', target: 'n2' });
    const onBeforeDelete = vi.fn().mockResolvedValue({ nodes: [n1], edges: [e1] });
    const ctx = mockCtx({
      nodes: [n1],
      edges: [e1],
      _config: { onBeforeDelete } as any,
    });
    ctx.selectedNodes.add('n1');
    vi.mocked(ctx.getNode).mockReturnValue(n1);
    vi.mocked(ctx.getEdge).mockReturnValue(e1);
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(onBeforeDelete).toHaveBeenCalledOnce();
    expect(ctx.removeNodes).toHaveBeenCalledWith(['n1']);
  });

  it('cancels deletion when onBeforeDelete returns false', async () => {
    const n1 = makeNode('n1');
    const onBeforeDelete = vi.fn().mockResolvedValue(false);
    const ctx = mockCtx({
      nodes: [n1],
      edges: [],
      _config: { onBeforeDelete } as any,
    });
    ctx.selectedNodes.add('n1');
    vi.mocked(ctx.getNode).mockReturnValue(n1);
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(ctx.removeNodes).not.toHaveBeenCalled();
    expect(ctx.removeEdges).not.toHaveBeenCalled();
  });

  it('validates child removal before deleting child nodes', async () => {
    const parent = makeNode('parent');
    const child = makeNode('child', { parentId: 'parent' });
    const ctx = mockCtx({ nodes: [parent, child] });
    ctx.selectedNodes.add('child');
    vi.mocked(ctx.getNode).mockImplementation((id: string) => {
      if (id === 'parent') return parent;
      if (id === 'child') return child;
      return undefined;
    });
    // Return rules that block removal (minChildren = 1 with 1 current child)
    vi.mocked(ctx._getChildValidation).mockReturnValue({ minChildren: 2 });
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    // Child should be blocked from deletion — nothing to delete
    expect(ctx.removeNodes).not.toHaveBeenCalled();
  });

  it('calls onChildValidationFail when child deletion violates constraints', async () => {
    const parent = makeNode('parent');
    const child = makeNode('child', { parentId: 'parent' });
    const onChildValidationFail = vi.fn();
    const ctx = mockCtx({
      nodes: [parent, child],
      _config: { onChildValidationFail } as any,
    });
    ctx.selectedNodes.add('child');
    vi.mocked(ctx.getNode).mockImplementation((id: string) => {
      if (id === 'parent') return parent;
      if (id === 'child') return child;
      return undefined;
    });
    vi.mocked(ctx._getChildValidation).mockReturnValue({ minChildren: 2 });
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    expect(onChildValidationFail).toHaveBeenCalledWith(
      expect.objectContaining({
        parent,
        child,
        operation: 'remove',
      }),
    );
  });

  it('resumes history even when an error occurs', async () => {
    const n1 = makeNode('n1');
    const ctx = mockCtx({ nodes: [n1] });
    ctx.selectedNodes.add('n1');
    vi.mocked(ctx.getNode).mockReturnValue(n1);
    vi.mocked(ctx.removeNodes).mockImplementation(() => { throw new Error('boom'); });
    const mixin = createSelectionMixin(ctx);

    await expect(mixin._deleteSelected()).rejects.toThrow('boom');

    // _resumeHistory should still be called via finally
    expect(ctx._resumeHistory).toHaveBeenCalledOnce();
  });
});

// ── copy ──────────────────────────────────────────────────────────────────────

describe('createSelectionMixin — copy', () => {
  beforeEach(() => {
    clearClipboard();
  });

  it('copies selected nodes to clipboard and emits copy event', () => {
    const n1 = makeNode('n1', { selected: true });
    const ctx = mockCtx({ nodes: [n1], edges: [] });
    const mixin = createSelectionMixin(ctx);

    mixin.copy();

    expect(ctx._emit).toHaveBeenCalledWith('copy', { nodeCount: 1, edgeCount: 0 });
  });

  it('does not emit when no nodes are selected', () => {
    const n1 = makeNode('n1', { selected: false });
    const ctx = mockCtx({ nodes: [n1], edges: [] });
    const mixin = createSelectionMixin(ctx);

    mixin.copy();

    expect(ctx._emit).not.toHaveBeenCalledWith('copy', expect.anything());
  });

  it('includes internal edges between selected nodes', () => {
    const n1 = makeNode('n1', { selected: true });
    const n2 = makeNode('n2', { selected: true });
    const e1 = makeEdge('e1', { source: 'n1', target: 'n2' });
    const ctx = mockCtx({ nodes: [n1, n2], edges: [e1] });
    const mixin = createSelectionMixin(ctx);

    mixin.copy();

    expect(ctx._emit).toHaveBeenCalledWith('copy', { nodeCount: 2, edgeCount: 1 });
  });
});

// ── paste ─────────────────────────────────────────────────────────────────────

describe('createSelectionMixin — paste', () => {
  beforeEach(() => {
    clearClipboard();
  });

  it('does nothing when clipboard is empty', () => {
    const ctx = mockCtx();
    const mixin = createSelectionMixin(ctx);

    mixin.paste();

    expect(ctx._captureHistory).not.toHaveBeenCalled();
  });

  it('adds pasted nodes and edges to the canvas', () => {
    const n1 = makeNode('n1', { selected: true, position: { x: 100, y: 200 } });
    const ctx = mockCtx({ nodes: [n1], edges: [] });

    // Populate clipboard
    copySelection([n1], []);

    // Reset nodes to empty for paste target
    ctx.nodes = [];
    const mixin = createSelectionMixin(ctx);

    mixin.paste();

    // Should have pushed one node
    expect(ctx.nodes.length).toBeGreaterThanOrEqual(1);
    // Pasted node should have offset position
    const pasted = ctx.nodes[ctx.nodes.length - 1];
    expect(pasted.position.x).toBe(120); // 100 + 20 (PASTE_OFFSET * 1)
    expect(pasted.position.y).toBe(220); // 200 + 20
  });

  it('deselects all before pasting', () => {
    const n1 = makeNode('n1', { selected: true });
    const ctx = mockCtx({ nodes: [n1], edges: [] });
    copySelection([n1], []);
    ctx.nodes = [];
    const mixin = createSelectionMixin(ctx);

    mixin.paste();

    expect(ctx.deselectAll).toHaveBeenCalledOnce();
  });

  it('selects pasted nodes and edges', () => {
    const n1 = makeNode('n1', { selected: true });
    const n2 = makeNode('n2', { selected: true });
    const e1 = makeEdge('e1', { source: 'n1', target: 'n2' });
    const ctx = mockCtx({ nodes: [n1, n2], edges: [e1] });
    copySelection([n1, n2], [e1]);
    ctx.nodes = [];
    ctx.edges = [];
    const mixin = createSelectionMixin(ctx);

    mixin.paste();

    // selectedNodes and selectedEdges should have the new IDs
    expect(ctx.selectedNodes.size).toBe(2);
    expect(ctx.selectedEdges.size).toBe(1);
  });

  it('captures history before paste', () => {
    const n1 = makeNode('n1', { selected: true });
    const ctx = mockCtx({ nodes: [n1], edges: [] });
    copySelection([n1], []);
    ctx.nodes = [];
    const mixin = createSelectionMixin(ctx);

    mixin.paste();

    expect(ctx._captureHistory).toHaveBeenCalledOnce();
  });

  it('rebuilds node and edge maps after paste', () => {
    const n1 = makeNode('n1', { selected: true });
    const ctx = mockCtx({ nodes: [n1], edges: [] });
    copySelection([n1], []);
    ctx.nodes = [];
    const mixin = createSelectionMixin(ctx);

    mixin.paste();

    expect(ctx._rebuildNodeMap).toHaveBeenCalled();
    expect(ctx._rebuildEdgeMap).toHaveBeenCalled();
  });

  it('emits selection-change, nodes-change, edges-change, and paste events', () => {
    const n1 = makeNode('n1', { selected: true });
    const ctx = mockCtx({ nodes: [n1], edges: [] });
    copySelection([n1], []);
    ctx.nodes = [];
    const mixin = createSelectionMixin(ctx);

    mixin.paste();

    expect(ctx._emitSelectionChange).toHaveBeenCalled();
    expect(ctx._emit).toHaveBeenCalledWith('nodes-change', expect.objectContaining({ type: 'add' }));
    expect(ctx._emit).toHaveBeenCalledWith('edges-change', expect.objectContaining({ type: 'add' }));
    expect(ctx._emit).toHaveBeenCalledWith('paste', expect.objectContaining({ nodes: expect.any(Array) }));
  });
});

// ── cut ───────────────────────────────────────────────────────────────────────

describe('createSelectionMixin — cut', () => {
  beforeEach(() => {
    clearClipboard();
  });

  it('does nothing when no nodes are selected', async () => {
    const ctx = mockCtx({ nodes: [], edges: [] });
    const mixin = createSelectionMixin(ctx);

    await mixin.cut();

    expect(ctx._deleteSelected).not.toHaveBeenCalled();
    expect(ctx._emit).not.toHaveBeenCalledWith('cut', expect.anything());
  });

  it('copies to clipboard and calls _deleteSelected', async () => {
    const n1 = makeNode('n1', { selected: true });
    const ctx = mockCtx({ nodes: [n1], edges: [] });
    ctx.selectedNodes.add('n1');
    const mixin = createSelectionMixin(ctx);

    await mixin.cut();

    expect(ctx._deleteSelected).toHaveBeenCalledOnce();
  });

  it('emits cut event with node and edge counts', async () => {
    const n1 = makeNode('n1', { selected: true });
    const n2 = makeNode('n2', { selected: true });
    const e1 = makeEdge('e1', { source: 'n1', target: 'n2' });
    const ctx = mockCtx({ nodes: [n1, n2], edges: [e1] });
    ctx.selectedNodes.add('n1');
    ctx.selectedNodes.add('n2');
    const mixin = createSelectionMixin(ctx);

    await mixin.cut();

    expect(ctx._emit).toHaveBeenCalledWith('cut', { nodeCount: 2, edgeCount: 1 });
  });

  it('does not overwrite clipboard when no nodes are selected', async () => {
    // Pre-populate the clipboard with a previous copy
    const prev = makeNode('prev', { selected: true });
    copySelection([prev], []);

    // Create context with no selected nodes
    const ctx = mockCtx({ nodes: [], edges: [] });
    const mixin = createSelectionMixin(ctx);

    await mixin.cut();

    // Clipboard should still hold the previous copy — paste should succeed
    const pasted = pasteClipboard();
    expect(pasted).not.toBeNull();
    expect(pasted!.nodes).toHaveLength(1);
    expect(pasted!.nodes[0].id).toContain('prev');
  });
});

// ── deleteSelected stale cleanup ──────────────────────────────────────────────

describe('createSelectionMixin — _deleteSelected stale selection cleanup', () => {
  it('removes deleted node IDs from selectedNodes after deletion', async () => {
    const n1 = makeNode('n1');
    const n2 = makeNode('n2');
    const ctx = mockCtx({ nodes: [n1, n2] });
    ctx.selectedNodes.add('n1');
    ctx.selectedNodes.add('n2');
    vi.mocked(ctx.getNode).mockImplementation((id: string) => {
      if (id === 'n1') return n1;
      if (id === 'n2') return n2;
      return undefined;
    });
    // Simulate removeNodes actually removing nodes from ctx.nodes
    vi.mocked(ctx.removeNodes).mockImplementation((ids: string | string[]) => {
      const idArr = Array.isArray(ids) ? ids : [ids];
      ctx.nodes = ctx.nodes.filter((n: FlowNode) => !idArr.includes(n.id));
    });
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    // After deletion, selectedNodes should not contain deleted IDs
    expect(ctx.selectedNodes.has('n1')).toBe(false);
    expect(ctx.selectedNodes.has('n2')).toBe(false);
  });

  it('removes deleted edge IDs from selectedEdges after deletion', async () => {
    const e1 = makeEdge('e1', { source: 'n1', target: 'n2' });
    const e2 = makeEdge('e2', { source: 'n2', target: 'n3' });
    const ctx = mockCtx({ edges: [e1, e2] });
    ctx.selectedEdges.add('e1');
    ctx.selectedEdges.add('e2');
    vi.mocked(ctx.getEdge).mockImplementation((id: string) => {
      if (id === 'e1') return e1;
      if (id === 'e2') return e2;
      return undefined;
    });
    // Simulate removeEdges actually removing edges from ctx.edges
    vi.mocked(ctx.removeEdges).mockImplementation((ids: string | string[]) => {
      const idArr = Array.isArray(ids) ? ids : [ids];
      ctx.edges = ctx.edges.filter((e: FlowEdge) => !idArr.includes(e.id));
    });
    const mixin = createSelectionMixin(ctx);

    await mixin._deleteSelected();

    // After deletion, selectedEdges should not contain deleted IDs
    expect(ctx.selectedEdges.has('e1')).toBe(false);
    expect(ctx.selectedEdges.has('e2')).toBe(false);
  });
});
