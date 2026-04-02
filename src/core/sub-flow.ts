// ============================================================================
// Sub-Flow Utilities
//
// Pure utility functions for parent-child node hierarchies. Handles relative
// positioning, absolute position resolution, topological sorting, z-index
// computation, extent clamping, and parent expansion.
//
// No DOM or Alpine dependencies — works with plain FlowNode objects.
// ============================================================================

import type { FlowNode, XYPosition, Dimensions, CoordinateExtent } from './types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from './geometry';

/** Padding (in px) added when expanding a parent to fit a child. */
const EXPAND_PADDING = 20;

/**
 * Build a Map<string, FlowNode> for O(1) lookups by node ID.
 */
export function buildNodeMap(nodes: FlowNode[]): Map<string, FlowNode> {
  return new Map(nodes.map((node) => [node.id, node]));
}

/**
 * Walk the parentId chain and sum positions to get the absolute flow-space
 * position of a node. Iterative with a visited-set cycle guard.
 */
export function getAbsolutePosition(
  node: FlowNode,
  nodeMap: Map<string, FlowNode>,
  globalOrigin?: [number, number],
): XYPosition {
  if (!node.position) return { x: 0, y: 0 };
  let x = node.position.x;
  let y = node.position.y;

  const visited = new Set<string>();
  visited.add(node.id);

  let current = node.parentId ? nodeMap.get(node.parentId) : undefined;
  while (current) {
    if (visited.has(current.id)) {
      break; // cycle guard
    }
    visited.add(current.id);

    // Use parent's visual top-left (accounting for its nodeOrigin)
    const origin = current.nodeOrigin ?? globalOrigin ?? [0, 0];
    const pw = current.dimensions?.width ?? DEFAULT_NODE_WIDTH;
    const ph = current.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
    x += current.position.x - pw * origin[0];
    y += current.position.y - ph * origin[1];

    current = current.parentId ? nodeMap.get(current.parentId) : undefined;
  }

  return { x, y };
}

/**
 * Create a shallow copy of a node with its position set to absolute
 * flow-space coordinates. Shares all other property references.
 */
export function toAbsoluteNode(
  node: FlowNode,
  nodeMap: Map<string, FlowNode>,
  globalOrigin?: [number, number],
): FlowNode {
  if (!node.parentId) {
    return node;
  }
  const abs = getAbsolutePosition(node, nodeMap, globalOrigin);
  return { ...node, position: abs };
}

/**
 * Map all nodes to absolute-position wrappers.
 */
export function toAbsoluteNodes(
  nodes: FlowNode[],
  nodeMap: Map<string, FlowNode>,
  globalOrigin?: [number, number],
): FlowNode[] {
  return nodes.map((n) => toAbsoluteNode(n, nodeMap, globalOrigin));
}

/**
 * BFS to collect all descendant IDs of a given node.
 */
export function getDescendantIds(
  nodeId: string,
  nodes: FlowNode[],
): Set<string> {
  const descendants = new Set<string>();
  const queue = [nodeId];

  // Build a quick children lookup
  const childrenOf = new Map<string, string[]>();
  for (const node of nodes) {
    if (node.parentId) {
      const siblings = childrenOf.get(node.parentId);
      if (siblings) {
        siblings.push(node.id);
      } else {
        childrenOf.set(node.parentId, [node.id]);
      }
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = childrenOf.get(current);
    if (children) {
      for (const childId of children) {
        if (!descendants.has(childId)) {
          descendants.add(childId);
          queue.push(childId);
        }
      }
    }
  }

  return descendants;
}

/**
 * Sort nodes so parents appear before children. Preserves sibling order.
 */
export function sortNodesTopological(nodes: FlowNode[]): FlowNode[] {
  const nodeMap = buildNodeMap(nodes);
  const sorted: FlowNode[] = [];
  const visited = new Set<string>();

  function visit(node: FlowNode): void {
    if (visited.has(node.id)) {
      return;
    }
    // Ensure parent is visited first
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        visit(parent);
      }
    }
    visited.add(node.id);
    sorted.push(node);
  }

  for (const node of nodes) {
    visit(node);
  }

  return sorted;
}

/**
 * Compute the effective z-index for a node.
 *
 * Base layering is handled by CSS:
 *   .flow-node-group { z-index: 0 }  →  .flow-edges { z-index: 1 }  →  .flow-node { z-index: 2 }
 *
 * This function is used by the directive to compute inline overrides for
 * child nodes in sub-flows and nodes with explicit zIndex. Returns null
 * when the CSS default is sufficient (regular root nodes without zIndex).
 *
 * - Group nodes (`type === 'group'`): 0 + (node.zIndex ?? 0)  — below edge layer
 * - Regular root nodes: 2 + (node.zIndex ?? 0)  — above edge layer
 * - Child nodes: parentComputedZ + 2 + (node.zIndex ?? 0) — above edge layer & parent
 */
export function computeZIndex(
  node: FlowNode,
  nodeMap: Map<string, FlowNode>,
  visited: Set<string> = new Set<string>(),
): number {
  if (visited.has(node.id)) {
    return node.zIndex ?? 2;
  }
  visited.add(node.id);

  if (!node.parentId) {
    if (node.zIndex !== undefined) {
      return node.zIndex;
    }
    return node.type === 'group' ? 0 : 2;
  }

  const parent = nodeMap.get(node.parentId);
  if (!parent) {
    return (node.zIndex ?? 0) + 2;
  }

  const parentZ = computeZIndex(parent, nodeMap, visited);
  return parentZ + 2 + (node.zIndex ?? 0);
}

/**
 * Clamp a position within a coordinate extent [[minX, minY], [maxX, maxY]].
 * Subtracts node dimensions from max so the entire node stays in bounds.
 */
export function clampToExtent(
  position: XYPosition,
  extent: CoordinateExtent,
  dimensions?: Dimensions,
): XYPosition {
  return {
    x: Math.max(extent[0][0], Math.min(position.x, extent[1][0] - (dimensions?.width ?? 0))),
    y: Math.max(extent[0][1], Math.min(position.y, extent[1][1] - (dimensions?.height ?? 0))),
  };
}

/**
 * Clamp a relative position so the child stays within parent bounds.
 */
export function clampToParent(
  relPos: XYPosition,
  childDims: Dimensions,
  parentDims: Dimensions,
): XYPosition {
  return {
    x: Math.max(0, Math.min(relPos.x, parentDims.width - childDims.width)),
    y: Math.max(0, Math.min(relPos.y, parentDims.height - childDims.height)),
  };
}

/**
 * Return expanded parent dimensions if the child exceeds the parent bounds.
 * Grows right/bottom with padding. Returns null if no expansion needed.
 */
/**
 * Clamp a root-level node's position within its applicable extent.
 * Skips nodes with parentId or 'parent' extent (those use clampToParent).
 */
export function clampRootNodePosition(
  position: XYPosition,
  node: FlowNode,
  globalExtent?: CoordinateExtent | 'parent',
): XYPosition {
  const extent = node.extent ?? globalExtent;
  if (!extent || extent === 'parent' || node.parentId) return position;
  const dims = node.dimensions ?? { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT };
  return clampToExtent(position, extent as CoordinateExtent, dims);
}

export function expandParentToFitChild(
  relPos: XYPosition,
  childDims: Dimensions,
  parentDims: Dimensions,
): Dimensions | null {
  const neededWidth = relPos.x + childDims.width + EXPAND_PADDING;
  const neededHeight = relPos.y + childDims.height + EXPAND_PADDING;

  const newWidth = Math.max(parentDims.width, neededWidth);
  const newHeight = Math.max(parentDims.height, neededHeight);

  if (newWidth === parentDims.width && newHeight === parentDims.height) {
    return null;
  }

  return { width: newWidth, height: newHeight };
}
