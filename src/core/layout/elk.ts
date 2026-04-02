// ============================================================================
// ELK Auto-Layout
//
// Computes hierarchical node positions using elkjs (Eclipse Layout Kernel).
// Supports multiple algorithms: layered, force, mrtree, radial, stress.
// Returns a position map — does NOT mutate nodes directly.
// NOTE: elk.layout() is async — this function returns a Promise.
// ============================================================================

import ELK from 'elkjs/lib/elk.bundled.js';
import type { FlowNode, FlowEdge } from '../types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../geometry';

export type ElkAlgorithm = 'layered' | 'force' | 'mrtree' | 'radial' | 'stress';
export type ElkDirection = 'DOWN' | 'RIGHT' | 'UP' | 'LEFT';

export interface ElkLayoutOptions {
  algorithm?: ElkAlgorithm;
  direction?: ElkDirection;
  nodeSpacing?: number;
  layerSpacing?: number;
}

export async function computeElkLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  options: ElkLayoutOptions = {},
): Promise<Map<string, { x: number; y: number }>> {
  const {
    algorithm = 'layered',
    direction = 'DOWN',
    nodeSpacing = 50,
    layerSpacing = 80,
  } = options;

  const elk = new ELK();

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': algorithm,
      'elk.direction': direction,
      'elk.spacing.nodeNode': String(nodeSpacing),
      'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing),
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: node.dimensions?.width ?? DEFAULT_NODE_WIDTH,
      height: node.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  let result;
  try {
    result = await elk.layout(graph);
  } catch (err: any) {
    console.error('[AlpineFlow] ELK layout failed:', err.message ?? err);
    return new Map();
  }

  // ELK returns top-left coordinates natively — no conversion needed
  const positions = new Map<string, { x: number; y: number }>();
  for (const child of result.children ?? []) {
    positions.set(child.id, { x: child.x ?? 0, y: child.y ?? 0 });
  }

  return positions;
}
