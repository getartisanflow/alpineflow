// ============================================================================
// Collapse/Expand — Core Logic
//
// Pure functions for collapsing and expanding nodes. Two behaviors:
//   - Group nodes (type === 'group'): hide children via parentId hierarchy
//   - Regular nodes: hide direct outgoers via edges
//
// These handle data mutations (hidden flags, dimension changes, edge rerouting)
// but not animation — that's handled by the canvas methods that call these.
// ============================================================================

import type { FlowNode, FlowEdge, Dimensions, XYPosition } from './types';
import { getDescendantIds } from './sub-flow';
import { getOutgoers } from './graph';

/** Saved state needed to restore a node after expanding. */
export interface CollapseState {
  targetPositions: Map<string, XYPosition>;
  originalDimensions?: Dimensions;
  reroutedEdges: Map<string, { source: string; target: string; hidden?: boolean }>;
}

/**
 * Determine which nodes to hide when collapsing a given node.
 *
 * Group nodes: returns all descendants via parentId hierarchy.
 * Regular nodes: returns direct outgoers via edges, or all downstream
 * outgoers when recursive is true.
 */
export function getCollapseTargets(
  nodeId: string,
  nodes: FlowNode[],
  edges: FlowEdge[],
  options?: { recursive?: boolean },
): Set<string> {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return new Set();

  if (node.type === 'group') {
    return getDescendantIds(nodeId, nodes);
  }

  const targets = new Set<string>();
  const directOutgoers = getOutgoers(nodeId, nodes, edges);
  for (const o of directOutgoers) {
    targets.add(o.id);
  }

  if (options?.recursive) {
    const queue = directOutgoers.map(o => o.id);
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const nextOutgoers = getOutgoers(currentId, nodes, edges);
      for (const o of nextOutgoers) {
        if (!targets.has(o.id) && o.id !== nodeId) {
          targets.add(o.id);
          queue.push(o.id);
        }
      }
    }
  }

  return targets;
}

/**
 * Capture the current state of a node before collapsing.
 */
export function captureCollapseState(
  node: FlowNode,
  allNodes: FlowNode[],
  targets: Set<string>,
): CollapseState {
  const targetPositions = new Map<string, XYPosition>();

  for (const n of allNodes) {
    if (targets.has(n.id)) {
      targetPositions.set(n.id, { ...n.position });
    }
  }

  return {
    targetPositions,
    originalDimensions: node.type === 'group'
      ? { ...(node.dimensions ?? { width: 400, height: 300 }) }
      : undefined,
    reroutedEdges: new Map(),
  };
}

/**
 * Apply collapse: hide targets, optionally shrink node, set collapsed flag.
 * When collapsedDimensions is provided the node is resized (typical for groups);
 * when omitted the node keeps its current size (typical for regular nodes).
 */
export function applyCollapse(
  node: FlowNode,
  allNodes: FlowNode[],
  state: CollapseState,
  collapsedDimensions?: Dimensions,
): void {
  node.collapsed = true;

  if (collapsedDimensions) {
    node.dimensions = { ...collapsedDimensions };
  }

  for (const n of allNodes) {
    if (state.targetPositions.has(n.id)) {
      n.hidden = true;
    }
  }
}

/**
 * Apply expand: unhide targets, optionally restore dimensions, restore positions.
 * For group nodes, respects nested collapsed groups — their descendants stay hidden.
 */
export function applyExpand(
  node: FlowNode,
  allNodes: FlowNode[],
  state: CollapseState,
  restoreDimensions: boolean = true,
): void {
  node.collapsed = false;

  if (restoreDimensions && state.originalDimensions) {
    node.dimensions = { ...state.originalDimensions };
  }

  // For group nodes: build set of IDs that belong to a nested collapsed group
  const nestedCollapsedIds = new Set<string>();
  if (node.type === 'group') {
    for (const n of allNodes) {
      if (n.collapsed && n.id !== node.id && state.targetPositions.has(n.id)) {
        const innerDescendants = getDescendantIds(n.id, allNodes);
        for (const id of innerDescendants) {
          nestedCollapsedIds.add(id);
        }
      }
    }
  }

  for (const n of allNodes) {
    if (state.targetPositions.has(n.id)) {
      const savedPos = state.targetPositions.get(n.id)!;
      n.position = { ...savedPos };

      if (!nestedCollapsedIds.has(n.id)) {
        n.hidden = false;
      }
    }
  }
}

/**
 * Reroute edges for collapse. Trigger-aware: edges between the trigger and
 * hidden nodes are hidden (to prevent self-loops). External edges crossing
 * the boundary are rerouted to the trigger. Returns saved originals for restore.
 */
export function rerouteEdgesForCollapse(
  triggerId: string,
  edges: FlowEdge[],
  hiddenSet: Set<string>,
): Map<string, { source: string; target: string; hidden?: boolean }> {
  const saved = new Map<string, { source: string; target: string; hidden?: boolean }>();

  for (const edge of edges) {
    const srcIsHidden = hiddenSet.has(edge.source);
    const tgtIsHidden = hiddenSet.has(edge.target);
    const srcIsTrigger = edge.source === triggerId;
    const tgtIsTrigger = edge.target === triggerId;

    if (!srcIsHidden && !tgtIsHidden) continue;

    saved.set(edge.id, { source: edge.source, target: edge.target, hidden: edge.hidden });

    if (srcIsHidden && tgtIsHidden) {
      edge.hidden = true;
    } else if (srcIsTrigger && tgtIsHidden) {
      edge.hidden = true;
    } else if (srcIsHidden && tgtIsTrigger) {
      edge.hidden = true;
    } else if (srcIsHidden) {
      edge.source = triggerId;
    } else {
      edge.target = triggerId;
    }
  }

  return saved;
}

/**
 * Restore edges to their original source/target after expanding.
 */
export function restoreReroutedEdges(
  edges: FlowEdge[],
  saved: Map<string, { source: string; target: string; hidden?: boolean }>,
): void {
  for (const edge of edges) {
    const original = saved.get(edge.id);
    if (original) {
      edge.source = original.source;
      edge.target = original.target;
      if (original.hidden !== undefined) {
        edge.hidden = original.hidden;
      } else {
        delete edge.hidden;
      }
    }
  }
}
