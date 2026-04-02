// ============================================================================
// Dagre Auto-Layout
//
// Computes hierarchical/tree node positions using the dagre library.
// Returns a position map — does NOT mutate nodes directly.
// ============================================================================

import dagre from '@dagrejs/dagre';
import type { FlowNode, FlowEdge } from '../types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../geometry';

export type DagreDirection = 'TB' | 'LR' | 'BT' | 'RL';

export interface DagreLayoutOptions {
  direction?: DagreDirection;
  nodesep?: number;
  ranksep?: number;
}

export function computeDagreLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  options: DagreLayoutOptions = {},
): Map<string, { x: number; y: number }> {
  const { direction = 'TB', nodesep = 50, ranksep = 80 } = options;

  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep, ranksep });

  for (const node of nodes) {
    const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
    const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
    g.setNode(node.id, { width: w, height: h });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  // Dagre uses center coords; convert to top-left
  const positions = new Map<string, { x: number; y: number }>();
  for (const node of nodes) {
    const pos = g.node(node.id);
    const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
    const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
    positions.set(node.id, { x: pos.x - w / 2, y: pos.y - h / 2 });
  }

  return positions;
}
