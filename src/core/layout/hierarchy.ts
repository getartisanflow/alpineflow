// ============================================================================
// d3-hierarchy Tree/Cluster Auto-Layout
//
// Computes tree or cluster (dendrogram) node positions using d3-hierarchy.
// Converts flat nodes+edges → tree structure via d3.stratify(), then
// extracts positions back to a flat map. Returns a position map — does NOT
// mutate nodes directly.
// ============================================================================

import { stratify, tree, cluster } from 'd3-hierarchy';
import type { FlowNode, FlowEdge } from '../types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../geometry';

export type HierarchyLayoutType = 'tree' | 'cluster';
export type HierarchyDirection = 'TB' | 'LR';

export interface HierarchyLayoutOptions {
  layoutType?: HierarchyLayoutType;
  direction?: HierarchyDirection;
  nodeWidth?: number;
  nodeHeight?: number;
}

/** @internal Sentinel ID for the synthetic root used when there are multiple real roots. */
const VIRTUAL_ROOT_ID = '__virtual_root';

export function computeHierarchyLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  options: HierarchyLayoutOptions = {},
): Map<string, { x: number; y: number }> {
  const {
    layoutType = 'tree',
    direction = 'TB',
    nodeWidth = DEFAULT_NODE_WIDTH,
    nodeHeight = DEFAULT_NODE_HEIGHT,
  } = options;

  if (nodes.length === 0) {
    return new Map();
  }

  // Build child → parent map from edges (each edge.target has parent edge.source)
  const childToParent = new Map<string, string>();
  for (const edge of edges) {
    childToParent.set(edge.target, edge.source);
  }

  // Detect root nodes (nodes with no incoming edge)
  const roots = nodes.filter((n) => !childToParent.has(n.id));

  if (roots.length === 0) {
    console.warn(
      '[AlpineFlow] computeHierarchyLayout: no root nodes found (every node has an incoming edge). Returning empty layout.',
    );
    return new Map();
  }

  // Build stratify-compatible data: { id, parentId }
  const data: { id: string; parentId: string | null }[] = nodes.map((node) => ({
    id: node.id,
    parentId: childToParent.get(node.id) ?? null,
  }));

  // If multiple roots, insert a virtual root that parents all of them
  const hasVirtualRoot = roots.length > 1;
  if (hasVirtualRoot) {
    data.push({ id: VIRTUAL_ROOT_ID, parentId: null });
    for (const entry of data) {
      if (entry.parentId === null && entry.id !== VIRTUAL_ROOT_ID) {
        entry.parentId = VIRTUAL_ROOT_ID;
      }
    }
  }

  // Create hierarchy via stratify
  const root = stratify<{ id: string; parentId: string | null }>()
    .id((d) => d.id)
    .parentId((d) => d.parentId)(data);

  // Apply tree or cluster layout with nodeSize for spacing
  // nodeSize([sibling separation, level depth]) — in the tree's native TB axes.
  // For LR, x↔y are swapped later, so the depth axis (y) becomes horizontal.
  // Use the wider nodeWidth multiplier for depth so nodes don't overlap edges.
  const layoutFn = layoutType === 'cluster' ? cluster<{ id: string; parentId: string | null }>() : tree<{ id: string; parentId: string | null }>();
  layoutFn.nodeSize(
    direction === 'LR'
      ? [nodeHeight * 2, nodeWidth * 2]
      : [nodeWidth * 1.5, nodeHeight * 2],
  );
  layoutFn(root);

  // Extract positions from descendants
  // d3 tree: x = horizontal spread, y = depth
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const positions = new Map<string, { x: number; y: number }>();

  // When a virtual root was added, shift all y-values up by one level depth
  // so the real roots sit at y=0 instead of one level below the virtual root.
  const depthOffset = hasVirtualRoot
    ? (direction === 'LR' ? nodeWidth * 2 : nodeHeight * 2)
    : 0;

  for (const descendant of root.descendants()) {
    // Skip the virtual root — it should never appear in the output
    if (descendant.id === VIRTUAL_ROOT_ID) {
      continue;
    }

    const original = nodeMap.get(descendant.id!);
    const w = original?.dimensions?.width ?? nodeWidth;
    const h = original?.dimensions?.height ?? nodeHeight;

    if (direction === 'LR') {
      // Swap x↔y for left-to-right layout, convert center → top-left
      positions.set(descendant.id!, {
        x: descendant.y! - depthOffset - w / 2,
        y: descendant.x! - h / 2,
      });
    } else {
      // TB: keep as-is, convert center → top-left
      positions.set(descendant.id!, {
        x: descendant.x! - w / 2,
        y: descendant.y! - depthOffset - h / 2,
      });
    }
  }

  return positions;
}
