// ============================================================================
// Force-Directed Auto-Layout
//
// Computes organic/physics-based node positions using d3-force.
// Returns a position map — does NOT mutate nodes directly.
// ============================================================================

import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import type { FlowNode, FlowEdge } from '../types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../geometry';

export interface ForceLayoutOptions {
  strength?: number;
  distance?: number;
  charge?: number;
  iterations?: number;
  center?: { x: number; y: number };
}

interface SimNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SimLink {
  source: string;
  target: string;
}

export function computeForceLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  options: ForceLayoutOptions = {},
): Map<string, { x: number; y: number }> {
  const {
    strength = 1,
    distance = 150,
    charge = -300,
    iterations = 300,
    center = { x: 0, y: 0 },
  } = options;

  const simNodes: SimNode[] = nodes.map((node) => ({
    id: node.id,
    x: node.position?.x ?? 0,
    y: node.position?.y ?? 0,
    width: node.dimensions?.width ?? DEFAULT_NODE_WIDTH,
    height: node.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
  }));

  const simLinks: SimLink[] = edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
  }));

  const simulation = forceSimulation(simNodes)
    .force('link', forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).strength(strength).distance(distance))
    .force('charge', forceManyBody().strength(charge))
    .force('center', forceCenter(center.x, center.y))
    .force('collide', forceCollide<SimNode>().radius((d) => Math.max(d.width, d.height) / 2 + 10))
    .stop();

  simulation.tick(iterations);

  // d3-force uses center coords; convert to top-left
  const positions = new Map<string, { x: number; y: number }>();
  for (const simNode of simNodes) {
    positions.set(simNode.id, {
      x: simNode.x - simNode.width / 2,
      y: simNode.y - simNode.height / 2,
    });
  }

  return positions;
}
