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

export type ElkAlgorithm = 'layered' | 'force' | 'mrtree' | 'radial' | 'stress' | 'rectpacking';
export type ElkDirection = 'DOWN' | 'RIGHT' | 'UP' | 'LEFT';

export interface ElkLayoutOptions {
  algorithm?: ElkAlgorithm;
  direction?: ElkDirection;
  nodeSpacing?: number;
  layerSpacing?: number;
  /** Target aspect ratio (width / height). Used by rectpacking and honoured by
   *  several other algorithms. Maps to `elk.aspectRatio`. */
  aspectRatio?: number;
  /** Escape hatch: raw ELK layout options merged last, so callers can set any
   *  `elk.*` id (e.g. `elk.rectpacking.orderBySize`) without a wrapper change. */
  layoutOptions?: Record<string, string>;
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
    aspectRatio,
    layoutOptions,
  } = options;

  const elk = new ELK();

  // rectpacking is designed for unconnected boxes — it ignores edges. Feeding
  // it edges is at best wasted work, so drop them for that algorithm.
  const usesEdges = algorithm !== 'rectpacking';

  const layout: Record<string, string> = {
    'elk.algorithm': algorithm,
    'elk.direction': direction,
    'elk.spacing.nodeNode': String(nodeSpacing),
    'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing),
  };
  if (aspectRatio !== undefined) {
    layout['elk.aspectRatio'] = String(aspectRatio);
  }
  // Caller-supplied raw options win over everything above.
  if (layoutOptions) {
    Object.assign(layout, layoutOptions);
  }

  const graph = {
    id: 'root',
    layoutOptions: layout,
    children: nodes.map((node) => ({
      id: node.id,
      width: node.dimensions?.width ?? DEFAULT_NODE_WIDTH,
      height: node.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
    })),
    edges: usesEdges
      ? edges.map((edge) => ({
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        }))
      : [],
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
