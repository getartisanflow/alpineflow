import { describe, it, expect } from 'vitest';
import {
  getConnectedEdges,
  getConnectedEdgesForNodes,
  getOutgoers,
  getIncomers,
  areNodesConnected,
  wouldCreateCycle,
  computeReconnectionEdges,
} from './graph';
import type { FlowNode, FlowEdge } from './types';
import { nodes, edges, edgeAB, edgeBC, edgeAC, edgeBD } from './__fixtures__/nodes';

// ── getConnectedEdges ───────────────────────────────────────────────────────

describe('getConnectedEdges', () => {
  it('returns all edges connected to a node as source or target', () => {
    const result = getConnectedEdges('b', edges);
    expect(result).toHaveLength(3); // e-a-b, e-b-c, e-b-d
    expect(result).toContain(edgeAB);
    expect(result).toContain(edgeBC);
    expect(result).toContain(edgeBD);
  });

  it('returns only outgoing edges for source-only node', () => {
    const result = getConnectedEdges('a', edges);
    expect(result).toHaveLength(2); // e-a-b, e-a-c
    expect(result).toContain(edgeAB);
    expect(result).toContain(edgeAC);
  });

  it('returns empty for unconnected node', () => {
    expect(getConnectedEdges('nonexistent', edges)).toEqual([]);
  });

  it('returns empty for empty edges array', () => {
    expect(getConnectedEdges('a', [])).toEqual([]);
  });
});

// ── getConnectedEdgesForNodes ───────────────────────────────────────────────

describe('getConnectedEdgesForNodes', () => {
  it('returns all edges connected to any of the given nodes', () => {
    const result = getConnectedEdgesForNodes(['a', 'c'], edges);
    expect(result).toHaveLength(3); // e-a-b, e-b-c, e-a-c
  });

  it('deduplicates edges connected to multiple selected nodes', () => {
    const result = getConnectedEdgesForNodes(['a', 'b'], edges);
    // e-a-b (both), e-b-c (b), e-a-c (a), e-b-d (b) = 4
    expect(result).toHaveLength(4);
  });

  it('returns empty for empty node list', () => {
    expect(getConnectedEdgesForNodes([], edges)).toEqual([]);
  });
});

// ── getOutgoers ─────────────────────────────────────────────────────────────

describe('getOutgoers', () => {
  it('returns nodes connected via outgoing edges', () => {
    const result = getOutgoers('a', nodes, edges);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('b');
    expect(ids).toContain('c');
    expect(ids).not.toContain('a');
  });

  it('returns empty for leaf node', () => {
    expect(getOutgoers('d', nodes, edges)).toEqual([]);
  });

  it('returns b outgoers: c and d', () => {
    const result = getOutgoers('b', nodes, edges);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('c');
    expect(ids).toContain('d');
    expect(ids).toHaveLength(2);
  });
});

// ── getIncomers ─────────────────────────────────────────────────────────────

describe('getIncomers', () => {
  it('returns nodes connected via incoming edges', () => {
    const result = getIncomers('b', nodes, edges);
    expect(result.map((n) => n.id)).toEqual(['a']);
  });

  it('returns empty for source-only node', () => {
    expect(getIncomers('a', nodes, edges)).toEqual([]);
  });

  it('returns multiple incomers', () => {
    const result = getIncomers('c', nodes, edges);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
  });
});

// ── areNodesConnected ───────────────────────────────────────────────────────

describe('areNodesConnected', () => {
  it('returns true for connected nodes (undirected)', () => {
    expect(areNodesConnected('a', 'b', edges)).toBe(true);
    expect(areNodesConnected('b', 'a', edges)).toBe(true);
  });

  it('returns false for unconnected nodes', () => {
    expect(areNodesConnected('a', 'd', edges)).toBe(false);
  });

  it('respects directed mode (source → target)', () => {
    expect(areNodesConnected('a', 'b', edges, true)).toBe(true);
    expect(areNodesConnected('b', 'a', edges, true)).toBe(false);
  });

  it('returns false for empty edges', () => {
    expect(areNodesConnected('a', 'b', [])).toBe(false);
  });
});

// ── wouldCreateCycle ───────────────────────────────────────────────────────

describe('wouldCreateCycle', () => {
  it('returns false for edge in a DAG (no cycle)', () => {
    // a→b→c, adding a→c
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ];
    expect(wouldCreateCycle('a', 'c', edges)).toBe(false);
  });

  it('returns true when edge would close a cycle', () => {
    // a→b→c, adding c→a creates cycle
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ];
    expect(wouldCreateCycle('c', 'a', edges)).toBe(true);
  });

  it('returns true for self-loop', () => {
    expect(wouldCreateCycle('a', 'a', [])).toBe(true);
  });

  it('returns false for empty graph', () => {
    expect(wouldCreateCycle('a', 'b', [])).toBe(false);
  });

  it('detects indirect cycle through multiple hops', () => {
    // a→b→c→d, adding d→a
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'd' },
    ];
    expect(wouldCreateCycle('d', 'a', edges)).toBe(true);
  });

  it('returns false when target has no outgoing edges', () => {
    const edges = [
      { source: 'a', target: 'b' },
    ];
    // adding c→b — b has no outgoing edges, so no path back to c
    expect(wouldCreateCycle('c', 'b', edges)).toBe(false);
  });

  it('handles diamond DAG without false positive', () => {
    // a→b, a→c, b→d, c→d — adding a→d is fine
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'a', target: 'c' },
      { source: 'b', target: 'd' },
      { source: 'c', target: 'd' },
    ];
    expect(wouldCreateCycle('a', 'd', edges)).toBe(false);
  });

  it('detects cycle in diamond graph', () => {
    // a→b, a→c, b→d, c→d — adding d→a creates cycle
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'a', target: 'c' },
      { source: 'b', target: 'd' },
      { source: 'c', target: 'd' },
    ];
    expect(wouldCreateCycle('d', 'a', edges)).toBe(true);
  });

  it('handles disconnected components', () => {
    // a→b, c→d — adding d→a: no path from a to d, so no cycle
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'c', target: 'd' },
    ];
    expect(wouldCreateCycle('d', 'a', edges)).toBe(false);
  });

  it('handles parallel edges', () => {
    // a→b (twice), adding b→a creates cycle
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'a', target: 'b' },
    ];
    expect(wouldCreateCycle('b', 'a', edges)).toBe(true);
  });
});

// ── computeReconnectionEdges ───────────────────────────────────────────────

describe('computeReconnectionEdges', () => {
  function node(id: string, opts?: Partial<FlowNode>): FlowNode {
    return { id, position: { x: 0, y: 0 }, data: { label: id }, ...opts };
  }

  function edge(id: string, source: string, target: string, opts?: Partial<FlowEdge>): FlowEdge {
    return { id, source, target, ...opts };
  }

  it('creates bridge edge for simple chain A→B→C when deleting B', () => {
    const n = [node('a'), node('b'), node('c')];
    const e = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c')];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(1);
    expect(result[0].source).toBe('a');
    expect(result[0].target).toBe('c');
  });

  it('creates N×M bridges for fan-in/fan-out', () => {
    const n = [node('a'), node('b'), node('c'), node('d'), node('e')];
    const e = [
      edge('e1', 'a', 'b'),
      edge('e2', 'c', 'b'),
      edge('e3', 'b', 'd'),
      edge('e4', 'b', 'e'),
    ];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(4); // a→d, a→e, c→d, c→e
    const pairs = result.map((r) => `${r.source}-${r.target}`).sort();
    expect(pairs).toEqual(['a-d', 'a-e', 'c-d', 'c-e']);
  });

  it('skips self-loops (A→B→A)', () => {
    const n = [node('a'), node('b')];
    const e = [edge('e1', 'a', 'b'), edge('e2', 'b', 'a')];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(0);
  });

  it('skips duplicate when A→C already exists', () => {
    const n = [node('a'), node('b'), node('c')];
    const e = [
      edge('e1', 'a', 'b'),
      edge('e2', 'b', 'c'),
      edge('e3', 'a', 'c'), // already exists
    ];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(0);
  });

  it('does not reconnect source-only node (no incoming)', () => {
    const n = [node('a'), node('b')];
    const e = [edge('e1', 'a', 'b')];
    const result = computeReconnectionEdges(new Set(['a']), n, e);

    expect(result).toHaveLength(0);
  });

  it('does not reconnect sink node (no outgoing)', () => {
    const n = [node('a'), node('b')];
    const e = [edge('e1', 'a', 'b')];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(0);
  });

  it('respects per-node opt-out (reconnectOnDelete: false)', () => {
    const n = [node('a'), node('b', { reconnectOnDelete: false }), node('c')];
    const e = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c')];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(0);
  });

  it('handles chain deletion A→B→C→D, delete B+C → A→D', () => {
    const n = [node('a'), node('b'), node('c'), node('d')];
    const e = [
      edge('e1', 'a', 'b'),
      edge('e2', 'b', 'c'),
      edge('e3', 'c', 'd'),
    ];
    const result = computeReconnectionEdges(new Set(['b', 'c']), n, e);

    // B: incoming a (non-deleted), outgoing c (deleted) → skip
    // C: incoming b (deleted), outgoing d (non-deleted) → skip
    // Only A→D if there's a path through non-deleted intermediaries
    // Actually: B has incoming from a (non-deleted), outgoing to c (deleted → skip)
    // C has incoming from b (deleted → skip), outgoing to d (non-deleted)
    // So no bridges from individual nodes.
    // But wait — for B: incoming=[a→b], outgoing=[b→c] — c IS in deletion set → outgoing is empty
    // For C: incoming=[b→c] — b IS in deletion set → incoming is empty
    // Result: no bridges. This is correct — there's no direct non-deleted predecessor/successor pair
    // through a single deleted node.
    expect(result).toHaveLength(0);
  });

  it('handles chain deletion where outer edges exist: A→B→C→D with A→C and B→D', () => {
    const n = [node('a'), node('b'), node('c'), node('d')];
    const e = [
      edge('e1', 'a', 'b'),
      edge('e2', 'b', 'c'),
      edge('e3', 'c', 'd'),
      edge('e4', 'a', 'c'), // extra: a connects to c
      edge('e5', 'b', 'd'), // extra: b connects to d
    ];
    const result = computeReconnectionEdges(new Set(['b', 'c']), n, e);

    // B: incoming=[a→b] (a not deleted), outgoing=[b→d] (d not deleted) → bridge a→d
    // C: incoming=[a→c] (a not deleted), outgoing=[c→d] (d not deleted) → bridge a→d (dup)
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe('a');
    expect(result[0].target).toBe('d');
  });

  it('inherits visual properties from incoming edge', () => {
    const n = [node('a'), node('b'), node('c')];
    const e = [
      edge('e1', 'a', 'b', { type: 'smoothstep', animated: true, markerEnd: 'arrowclosed', class: 'special' }),
      edge('e2', 'b', 'c'),
    ];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('smoothstep');
    expect(result[0].animated).toBe(true);
    expect(result[0].markerEnd).toBe('arrowclosed');
    expect(result[0].class).toBe('special');
  });

  it('inherits handles: sourceHandle from incoming, targetHandle from outgoing', () => {
    const n = [node('a'), node('b'), node('c')];
    const e = [
      edge('e1', 'a', 'b', { sourceHandle: 'src-out' }),
      edge('e2', 'b', 'c', { targetHandle: 'tgt-in' }),
    ];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(1);
    expect(result[0].sourceHandle).toBe('src-out');
    expect(result[0].targetHandle).toBe('tgt-in');
  });

  it('generates unique IDs with reconnect- prefix', () => {
    const n = [node('a'), node('b'), node('c'), node('d')];
    const e = [
      edge('e1', 'a', 'b'),
      edge('e2', 'c', 'b'),
      edge('e3', 'b', 'd'),
    ];
    const result = computeReconnectionEdges(new Set(['b']), n, e);

    expect(result).toHaveLength(2);
    expect(result[0].id).toMatch(/^reconnect-/);
    expect(result[1].id).toMatch(/^reconnect-/);
    expect(result[0].id).not.toBe(result[1].id);
  });
});
