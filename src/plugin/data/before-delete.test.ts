import { describe, it, expect, vi } from 'vitest';
import type { FlowNode, FlowEdge } from '../../core/types';

function makeNodes(): FlowNode[] {
  return [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'b', position: { x: 100, y: 0 }, data: { label: 'B' } },
    { id: 'c', position: { x: 200, y: 0 }, data: { label: 'C' }, deletable: false },
  ];
}

function makeEdges(): FlowEdge[] {
  return [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'b', target: 'c' },
  ];
}

function makeCanvas(opts?: {
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  onBeforeDelete?: (detail: { nodes: FlowNode[]; edges: FlowEdge[] }) => Promise<{ nodes: FlowNode[]; edges: FlowEdge[] } | false>;
}) {
  const _nodes = opts?.nodes ?? makeNodes();
  const _edges = opts?.edges ?? makeEdges();
  const emitted: { event: string; detail: any }[] = [];
  const selectedNodes = new Set<string>();
  const selectedEdges = new Set<string>();

  const canvas = {
    nodes: _nodes,
    edges: _edges,
    selectedNodes,
    selectedEdges,
    _config: { onBeforeDelete: opts?.onBeforeDelete },
    getNode(id: string) { return _nodes.find(n => n.id === id); },
    getEdge(id: string) { return _edges.find(e => e.id === id); },
    _emit(event: string, detail: any) { emitted.push({ event, detail }); },
    emitted,

    removeNodes(ids: string[]) {
      const idSet = new Set(ids);
      const removed = _nodes.filter(n => idSet.has(n.id));
      canvas.nodes = _nodes.filter(n => !idSet.has(n.id));
      // Cascade edges
      canvas.edges = canvas.edges.filter(
        e => !idSet.has(e.source) && !idSet.has(e.target),
      );
      for (const id of ids) selectedNodes.delete(id);
      if (removed.length) canvas._emit('nodes-change', { type: 'remove', nodes: removed });
    },

    removeEdges(ids: string[]) {
      const idSet = new Set(ids);
      const removed = _edges.filter(e => idSet.has(e.id));
      canvas.edges = canvas.edges.filter(e => !idSet.has(e.id));
      for (const id of ids) selectedEdges.delete(id);
      if (removed.length) canvas._emit('edges-change', { type: 'remove', edges: removed });
    },

    async _deleteSelected(): Promise<void> {
      // Collect deletable selected nodes
      const nodeIds = [...selectedNodes].filter(id => {
        const n = canvas.getNode(id);
        return n?.deletable !== false;
      });
      // Collect deletable selected edges
      const edgeIds = [...selectedEdges].filter(id => {
        const e = canvas.getEdge(id);
        return e?.deletable !== false;
      });

      const nodesToDelete = nodeIds.map(id => canvas.getNode(id)!).filter(Boolean);
      // Compute cascaded edges (connected to deleted nodes)
      const nodeIdSet = new Set(nodeIds);
      const cascadedEdges = canvas.edges.filter(
        (e: FlowEdge) => nodeIdSet.has(e.source) || nodeIdSet.has(e.target),
      );
      // Merge explicitly selected edges with cascaded (dedupe)
      const allEdgeMap = new Map<string, FlowEdge>();
      for (const e of cascadedEdges) allEdgeMap.set(e.id, e);
      for (const id of edgeIds) {
        const e = canvas.getEdge(id);
        if (e) allEdgeMap.set(e.id, e);
      }
      const edgesToDelete = [...allEdgeMap.values()];

      if (nodesToDelete.length === 0 && edgesToDelete.length === 0) return;

      // Call onBeforeDelete if configured
      if (canvas._config?.onBeforeDelete) {
        const result = await canvas._config.onBeforeDelete({
          nodes: nodesToDelete,
          edges: edgesToDelete,
        });
        if (result === false) return;
        // Delete only the subset returned
        if (result.nodes.length > 0) {
          canvas.removeNodes(result.nodes.map(n => n.id));
        }
        if (result.edges.length > 0) {
          // Only remove edges not already cascade-removed by removeNodes
          const remainingEdgeIds = result.edges
            .map(e => e.id)
            .filter(id => canvas.edges.some((e: FlowEdge) => e.id === id));
          if (remainingEdgeIds.length > 0) {
            canvas.removeEdges(remainingEdgeIds);
          }
        }
        return;
      }

      // No callback — delete everything
      if (nodesToDelete.length > 0) {
        canvas.removeNodes(nodeIds);
      }
      if (edgeIds.length > 0) {
        // Only remove edges not already cascade-removed by removeNodes
        const remainingEdgeIds = edgeIds.filter(id =>
          canvas.edges.some((e: FlowEdge) => e.id === id),
        );
        if (remainingEdgeIds.length > 0) {
          canvas.removeEdges(remainingEdgeIds);
        }
      }
    },
  };

  return canvas;
}

describe('_deleteSelected without onBeforeDelete', () => {
  it('deletes selected nodes and cascaded edges', async () => {
    const canvas = makeCanvas();
    canvas.selectedNodes.add('a');
    await canvas._deleteSelected();

    expect(canvas.nodes.map(n => n.id)).toEqual(['b', 'c']);
    // e1 (a→b) cascade-deleted, e2 (b→c) remains
    expect(canvas.edges.map(e => e.id)).toEqual(['e2']);
  });

  it('respects deletable: false on nodes', async () => {
    const canvas = makeCanvas();
    canvas.selectedNodes.add('c'); // deletable: false
    await canvas._deleteSelected();

    expect(canvas.nodes.map(n => n.id)).toEqual(['a', 'b', 'c']);
  });

  it('deletes selected edges without node deletion', async () => {
    const canvas = makeCanvas();
    canvas.selectedEdges.add('e1');
    await canvas._deleteSelected();

    expect(canvas.edges.map(e => e.id)).toEqual(['e2']);
    expect(canvas.nodes).toHaveLength(3); // nodes untouched
  });

  it('is a no-op when nothing is selected', async () => {
    const canvas = makeCanvas();
    await canvas._deleteSelected();

    expect(canvas.emitted).toHaveLength(0);
  });
});

describe('_deleteSelected with onBeforeDelete', () => {
  it('passes nodes and edges to callback', async () => {
    const spy = vi.fn().mockResolvedValue({ nodes: [], edges: [] });
    const canvas = makeCanvas({ onBeforeDelete: spy });
    canvas.selectedNodes.add('a');
    canvas.selectedEdges.add('e2');
    await canvas._deleteSelected();

    expect(spy).toHaveBeenCalledOnce();
    const detail = spy.mock.calls[0][0];
    expect(detail.nodes.map((n: FlowNode) => n.id)).toEqual(['a']);
    // edges include cascaded e1 (a→b) + selected e2
    expect(detail.edges.map((e: FlowEdge) => e.id).sort()).toEqual(['e1', 'e2']);
  });

  it('cancels deletion when callback returns false', async () => {
    const canvas = makeCanvas({
      onBeforeDelete: async () => false,
    });
    canvas.selectedNodes.add('a');
    canvas.selectedNodes.add('b');
    await canvas._deleteSelected();

    expect(canvas.nodes).toHaveLength(3);
    expect(canvas.edges).toHaveLength(2);
  });

  it('deletes only the subset returned by callback', async () => {
    const canvas = makeCanvas({
      onBeforeDelete: async ({ nodes }) => ({
        // Keep node 'a', only delete 'b'
        nodes: nodes.filter(n => n.id === 'b'),
        edges: [],
      }),
    });
    canvas.selectedNodes.add('a');
    canvas.selectedNodes.add('b');
    await canvas._deleteSelected();

    expect(canvas.nodes.map(n => n.id)).toEqual(['a', 'c']);
  });

  it('includes cascaded edges in callback detail', async () => {
    const spy = vi.fn().mockResolvedValue({ nodes: [], edges: [] });
    const canvas = makeCanvas({ onBeforeDelete: spy });
    canvas.selectedNodes.add('b');
    await canvas._deleteSelected();

    const detail = spy.mock.calls[0][0];
    // b is connected to e1 (a→b) and e2 (b→c)
    expect(detail.edges.map((e: FlowEdge) => e.id).sort()).toEqual(['e1', 'e2']);
  });

  it('handles async callback (e.g. confirm dialog)', async () => {
    const canvas = makeCanvas({
      onBeforeDelete: async ({ nodes, edges }) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return { nodes, edges };
      },
    });
    canvas.selectedNodes.add('a');
    await canvas._deleteSelected();

    expect(canvas.nodes.map(n => n.id)).toEqual(['b', 'c']);
  });
});
