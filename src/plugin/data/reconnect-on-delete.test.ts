import { describe, it, expect, vi } from 'vitest';
import type { FlowNode, FlowEdge } from '../../core/types';
import { computeReconnectionEdges } from '../../core/graph';

function makeCanvas(opts?: {
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  reconnectOnDelete?: boolean;
  onBeforeDelete?: (detail: { nodes: FlowNode[]; edges: FlowEdge[] }) => Promise<{ nodes: FlowNode[]; edges: FlowEdge[] } | false>;
}) {
  const _nodes = opts?.nodes ?? [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'b', position: { x: 100, y: 0 }, data: { label: 'B' } },
    { id: 'c', position: { x: 200, y: 0 }, data: { label: 'C' } },
  ];
  const _edges: FlowEdge[] = opts?.edges ?? [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'b', target: 'c' },
  ];
  const emitted: { event: string; detail: any }[] = [];
  const selectedNodes = new Set<string>();
  const selectedEdges = new Set<string>();
  const historyLog: string[] = [];

  const canvas = {
    nodes: _nodes as FlowNode[],
    edges: _edges as FlowEdge[],
    selectedNodes,
    selectedEdges,
    _config: {
      reconnectOnDelete: opts?.reconnectOnDelete ?? false,
      onBeforeDelete: opts?.onBeforeDelete,
    },
    getNode(id: string) { return (canvas.nodes as FlowNode[]).find(n => n.id === id); },
    getEdge(id: string) { return (canvas.edges as FlowEdge[]).find(e => e.id === id); },
    _emit(event: string, detail: any) { emitted.push({ event, detail }); },
    _captureHistory() { historyLog.push('capture'); },
    _suspendHistory() { historyLog.push('suspend'); },
    _resumeHistory() { historyLog.push('resume'); },
    _recomputeChildValidation() {},
    emitted,
    historyLog,

    removeNodes(ids: string | string[]) {
      const idArr = Array.isArray(ids) ? ids : [ids];
      const idSet = new Set(idArr);

      // Compute reconnection edges BEFORE removing connected edges
      let reconnected: FlowEdge[] = [];
      if (canvas._config.reconnectOnDelete) {
        reconnected = computeReconnectionEdges(idSet, canvas.nodes as FlowNode[], canvas.edges as FlowEdge[]);
      }

      const removed = (canvas.nodes as FlowNode[]).filter(n => idSet.has(n.id));
      // Remove connected edges
      canvas.edges = (canvas.edges as FlowEdge[]).filter(
        e => !idSet.has(e.source) && !idSet.has(e.target),
      );
      // Add reconnection bridge edges
      if (reconnected.length) {
        canvas.edges.push(...reconnected);
      }
      canvas.nodes = (canvas.nodes as FlowNode[]).filter(n => !idSet.has(n.id));
      for (const id of idArr) selectedNodes.delete(id);
      if (removed.length) canvas._emit('nodes-change', { type: 'remove', nodes: removed });
      if (reconnected.length) canvas._emit('edges-change', { type: 'add', edges: reconnected });
    },

    removeEdges(ids: string[]) {
      const idSet = new Set(ids);
      const removed = (canvas.edges as FlowEdge[]).filter(e => idSet.has(e.id));
      canvas.edges = (canvas.edges as FlowEdge[]).filter(e => !idSet.has(e.id));
      for (const id of ids) selectedEdges.delete(id);
      if (removed.length) canvas._emit('edges-change', { type: 'remove', edges: removed });
    },

    async _deleteSelected(): Promise<void> {
      const nodeIds = [...selectedNodes].filter(id => {
        const n = canvas.getNode(id);
        return n?.deletable !== false;
      });
      const edgeIds = [...selectedEdges].filter(id => {
        const e = canvas.getEdge(id);
        return e?.deletable !== false;
      });

      const nodesToDelete = nodeIds.map(id => canvas.getNode(id)!).filter(Boolean);
      const nodeIdSet = new Set(nodeIds);
      const cascadedEdges = (canvas.edges as FlowEdge[]).filter(
        (e: FlowEdge) => nodeIdSet.has(e.source) || nodeIdSet.has(e.target),
      );
      const allEdgeMap = new Map<string, FlowEdge>();
      for (const e of cascadedEdges) allEdgeMap.set(e.id, e);
      for (const id of edgeIds) {
        const e = canvas.getEdge(id);
        if (e) allEdgeMap.set(e.id, e);
      }
      const edgesToDelete = [...allEdgeMap.values()];

      if (nodesToDelete.length === 0 && edgesToDelete.length === 0) return;

      // Single history step for delete + reconnect
      canvas._captureHistory();
      canvas._suspendHistory();
      try {
        if (canvas._config?.onBeforeDelete) {
          const result = await canvas._config.onBeforeDelete({
            nodes: nodesToDelete,
            edges: edgesToDelete,
          });
          if (result === false) return;
          if (result.nodes.length > 0) {
            canvas.removeNodes(result.nodes.map(n => n.id));
          }
          if (result.edges.length > 0) {
            const remainingEdgeIds = result.edges
              .map(e => e.id)
              .filter(id => (canvas.edges as FlowEdge[]).some(e => e.id === id));
            if (remainingEdgeIds.length > 0) {
              canvas.removeEdges(remainingEdgeIds);
            }
          }
          return;
        }

        if (nodesToDelete.length > 0) {
          canvas.removeNodes(nodeIds);
        }
        if (edgeIds.length > 0) {
          const remainingEdgeIds = edgeIds.filter(id =>
            (canvas.edges as FlowEdge[]).some(e => e.id === id),
          );
          if (remainingEdgeIds.length > 0) {
            canvas.removeEdges(remainingEdgeIds);
          }
        }
      } finally {
        canvas._resumeHistory();
      }
    },
  };

  return canvas;
}

// ── removeNodes with reconnectOnDelete ────────────────────────────────────

describe('removeNodes with reconnectOnDelete', () => {
  it('creates bridge edge when deleting middle node', () => {
    const canvas = makeCanvas({ reconnectOnDelete: true });
    canvas.removeNodes(['b']);

    expect(canvas.nodes.map(n => n.id)).toEqual(['a', 'c']);
    expect(canvas.edges).toHaveLength(1);
    expect(canvas.edges[0].source).toBe('a');
    expect(canvas.edges[0].target).toBe('c');
    expect(canvas.edges[0].id).toMatch(/^reconnect-/);
  });

  it('does not create bridges when reconnectOnDelete is false', () => {
    const canvas = makeCanvas({ reconnectOnDelete: false });
    canvas.removeNodes(['b']);

    expect(canvas.nodes.map(n => n.id)).toEqual(['a', 'c']);
    expect(canvas.edges).toHaveLength(0);
  });

  it('respects per-node opt-out', () => {
    const canvas = makeCanvas({
      reconnectOnDelete: true,
      nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
        { id: 'b', position: { x: 100, y: 0 }, data: { label: 'B' }, reconnectOnDelete: false },
        { id: 'c', position: { x: 200, y: 0 }, data: { label: 'C' } },
      ],
    });
    canvas.removeNodes(['b']);

    expect(canvas.edges).toHaveLength(0);
  });

  it('creates N×M bridges for fan-in/fan-out', () => {
    const canvas = makeCanvas({
      reconnectOnDelete: true,
      nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
        { id: 'b', position: { x: 0, y: 0 }, data: { label: 'B' } },
        { id: 'mid', position: { x: 0, y: 0 }, data: { label: 'Mid' } },
        { id: 'c', position: { x: 0, y: 0 }, data: { label: 'C' } },
        { id: 'd', position: { x: 0, y: 0 }, data: { label: 'D' } },
      ],
      edges: [
        { id: 'e1', source: 'a', target: 'mid' },
        { id: 'e2', source: 'b', target: 'mid' },
        { id: 'e3', source: 'mid', target: 'c' },
        { id: 'e4', source: 'mid', target: 'd' },
      ],
    });
    canvas.removeNodes(['mid']);

    expect(canvas.edges).toHaveLength(4);
    const pairs = canvas.edges.map(e => `${e.source}-${e.target}`).sort();
    expect(pairs).toEqual(['a-c', 'a-d', 'b-c', 'b-d']);
  });

  it('emits edges-change add event for bridge edges', () => {
    const canvas = makeCanvas({ reconnectOnDelete: true });
    canvas.removeNodes(['b']);

    const addEvent = canvas.emitted.find(
      e => e.event === 'edges-change' && e.detail.type === 'add',
    );
    expect(addEvent).toBeDefined();
    expect(addEvent!.detail.edges).toHaveLength(1);
    expect(addEvent!.detail.edges[0].source).toBe('a');
    expect(addEvent!.detail.edges[0].target).toBe('c');
  });
});

// ── _deleteSelected with reconnectOnDelete ────────────────────────────────

describe('_deleteSelected with reconnectOnDelete', () => {
  it('creates bridge edges when deleting selected middle node', async () => {
    const canvas = makeCanvas({ reconnectOnDelete: true });
    canvas.selectedNodes.add('b');
    await canvas._deleteSelected();

    expect(canvas.nodes.map(n => n.id)).toEqual(['a', 'c']);
    expect(canvas.edges).toHaveLength(1);
    expect(canvas.edges[0].source).toBe('a');
    expect(canvas.edges[0].target).toBe('c');
  });

  it('produces single history capture (capture + suspend + resume)', async () => {
    const canvas = makeCanvas({ reconnectOnDelete: true });
    canvas.selectedNodes.add('b');
    await canvas._deleteSelected();

    expect(canvas.historyLog).toEqual(['capture', 'suspend', 'resume']);
  });

  it('works with onBeforeDelete hook', async () => {
    const canvas = makeCanvas({
      reconnectOnDelete: true,
      onBeforeDelete: async ({ nodes, edges }) => ({ nodes, edges }),
    });
    canvas.selectedNodes.add('b');
    await canvas._deleteSelected();

    expect(canvas.nodes.map(n => n.id)).toEqual(['a', 'c']);
    expect(canvas.edges).toHaveLength(1);
    expect(canvas.edges[0].source).toBe('a');
    expect(canvas.edges[0].target).toBe('c');
  });

  it('does not bridge when onBeforeDelete cancels', async () => {
    const canvas = makeCanvas({
      reconnectOnDelete: true,
      onBeforeDelete: async () => false,
    });
    canvas.selectedNodes.add('b');
    await canvas._deleteSelected();

    expect(canvas.nodes).toHaveLength(3);
    expect(canvas.edges).toHaveLength(2);
  });
});
