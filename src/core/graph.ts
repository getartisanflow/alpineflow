// ============================================================================
// Graph Utilities
//
// Pure graph traversal functions. Forked from @xyflow/system utils/graph.ts
// (MIT License, Copyright 2019-2025 webkid GmbH). Simplified to work with
// plain objects instead of Map-based stores.
// ============================================================================

import type { FlowNode, FlowEdge } from './types';

/**
 * Get all edges connected to a node (incoming and outgoing).
 */
export function getConnectedEdges(nodeId: string, edges: FlowEdge[]): FlowEdge[] {
  return edges.filter((e) => e.source === nodeId || e.target === nodeId);
}

/**
 * Get all edges connected to any of the given nodes.
 */
export function getConnectedEdgesForNodes(nodeIds: string[], edges: FlowEdge[]): FlowEdge[] {
  const idSet = new Set(nodeIds);
  return edges.filter((e) => idSet.has(e.source) || idSet.has(e.target));
}

/**
 * Get all nodes that a given node connects to (outgoing edges).
 */
export function getOutgoers(nodeId: string, nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
  const outgoingIds = new Set(
    edges.filter((e) => e.source === nodeId).map((e) => e.target),
  );
  return nodes.filter((n) => outgoingIds.has(n.id));
}

/**
 * Get all nodes that connect to a given node (incoming edges).
 */
export function getIncomers(nodeId: string, nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
  const incomingIds = new Set(
    edges.filter((e) => e.target === nodeId).map((e) => e.source),
  );
  return nodes.filter((n) => incomingIds.has(n.id));
}

/**
 * Check whether adding an edge from `source` to `target` would create a cycle
 * in the directed graph defined by `edges`. Uses iterative DFS from `target`
 * following outgoing edges — if `source` is reachable, the new edge would
 * close a loop.
 */
export function wouldCreateCycle(
  source: string,
  target: string,
  edges: { source: string; target: string }[],
): boolean {
  // Self-loop is a trivial cycle
  if (source === target) return true;

  // Build adjacency list (outgoing edges only)
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    let list = adj.get(e.source);
    if (!list) {
      list = [];
      adj.set(e.source, list);
    }
    list.push(e.target);
  }

  // Iterative DFS from target — can we reach source?
  const stack = [target];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node === source) return true;
    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = adj.get(node);
    if (neighbors) {
      for (const n of neighbors) {
        if (!visited.has(n)) stack.push(n);
      }
    }
  }

  return false;
}

/**
 * Check if two nodes are directly connected by an edge.
 */
export function areNodesConnected(
  nodeA: string,
  nodeB: string,
  edges: FlowEdge[],
  directed: boolean = false,
): boolean {
  return edges.some((e) => {
    if (directed) {
      return e.source === nodeA && e.target === nodeB;
    }
    return (
      (e.source === nodeA && e.target === nodeB) ||
      (e.source === nodeB && e.target === nodeA)
    );
  });
}

/**
 * Compute bridge edges that reconnect predecessors to successors
 * when middle nodes are deleted. For each deleted node that has both
 * incoming and outgoing edges (to/from non-deleted nodes), creates
 * edges from each predecessor to each successor.
 */
export function computeReconnectionEdges(
  deletionIds: Set<string>,
  nodes: FlowNode[],
  edges: FlowEdge[],
): FlowEdge[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  // Build set of existing source+target+handles combos for dedup
  const existingKeys = new Set(
    edges.map((e) => `${e.source}|${e.target}|${e.sourceHandle ?? ''}|${e.targetHandle ?? ''}`),
  );
  const result: FlowEdge[] = [];
  const newKeys = new Set<string>();
  let counter = 0;

  for (const nodeId of deletionIds) {
    const node = nodeMap.get(nodeId);
    if (node?.reconnectOnDelete === false) continue;

    // Find incoming edges from non-deleted sources
    const incoming = edges.filter(
      (e) => e.target === nodeId && !deletionIds.has(e.source),
    );
    // Find outgoing edges to non-deleted targets
    const outgoing = edges.filter(
      (e) => e.source === nodeId && !deletionIds.has(e.target),
    );

    if (incoming.length === 0 || outgoing.length === 0) continue;

    for (const inc of incoming) {
      for (const out of outgoing) {
        // Skip self-loops
        if (inc.source === out.target) continue;

        const key = `${inc.source}|${out.target}|${inc.sourceHandle ?? ''}|${out.targetHandle ?? ''}`;
        // Skip if edge already exists or already created in this batch
        if (existingKeys.has(key) || newKeys.has(key)) continue;

        const bridge: FlowEdge = {
          id: `reconnect-${inc.source}-${out.target}-${counter++}`,
          source: inc.source,
          target: out.target,
          sourceHandle: inc.sourceHandle,
          targetHandle: out.targetHandle,
        };

        // Inherit visual properties from incoming edge
        if (inc.type) bridge.type = inc.type;
        if (inc.animated !== undefined) bridge.animated = inc.animated;
        if (inc.style) bridge.style = inc.style;
        if (inc.class) bridge.class = inc.class;
        if (inc.markerEnd) bridge.markerEnd = inc.markerEnd;
        if (inc.markerStart) bridge.markerStart = inc.markerStart;
        if (inc.label) bridge.label = inc.label;

        newKeys.add(key);
        result.push(bridge);
      }
    }
  }

  return result;
}
