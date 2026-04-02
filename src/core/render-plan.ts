// ============================================================================
// Render Plan — SSR/SSG Pre-computation
//
// Pure function that computes all layout, edge paths, markers, and viewport
// data needed to render a flow diagram without JavaScript. No DOM dependencies.
// ============================================================================

import type { FlowNode, FlowEdge, Rect, Viewport } from './types';
import { getEdgePath } from './edge-utils';
import { normalizeMarker, getMarkerId, getMarkerSvg } from './markers';
import { getNodesBounds, DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from './geometry';

// ─── Public Types ────────────────────────────────────────────────────────────

/** A single node in the render plan output. */
export interface RenderPlanNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  class?: string;
  style?: string;
  data: Record<string, any>;
}

/** A single edge in the render plan output. */
export interface RenderPlanEdge {
  id: string;
  source: string;
  target: string;
  pathD: string;
  markerStart?: string;
  markerEnd?: string;
  class?: string;
  label?: string;
  labelX?: number;
  labelY?: number;
}

/** Full render plan returned by computeRenderPlan(). */
export interface RenderPlan {
  nodes: RenderPlanNode[];
  edges: RenderPlanEdge[];
  markers: string;
  viewBox: Rect;
  viewport: Viewport;
}

/** Optional configuration for computeRenderPlan(). */
export interface RenderPlanConfig {
  /** Default dimensions for nodes without explicit dimensions. Default: { width: 150, height: 50 } */
  defaultDimensions?: { width: number; height: number };
  /** Padding around the viewBox in flow-space pixels. Default: 20 */
  padding?: number;
  /** Flow ID used for marker ID generation. Default: 'ssr' */
  flowId?: string;
}

// ─── Core Function ───────────────────────────────────────────────────────────

/**
 * Compute a complete render plan from nodes and edges.
 *
 * Pre-computes edge SVG paths, marker defs, and viewport so a flow diagram
 * can be rendered server-side without any DOM or JavaScript.
 */
export function computeRenderPlan(
  nodes: FlowNode[],
  edges: FlowEdge[],
  config?: RenderPlanConfig,
): RenderPlan {
  const defaultWidth = config?.defaultDimensions?.width ?? DEFAULT_NODE_WIDTH;
  const defaultHeight = config?.defaultDimensions?.height ?? DEFAULT_NODE_HEIGHT;
  const padding = config?.padding ?? 20;
  const flowId = config?.flowId ?? 'ssr';

  // ── 1. Filter hidden nodes, ensure dimensions ──────────────────────────

  const visibleNodes = nodes.filter((n) => !n.hidden);

  // Build prepared nodes with guaranteed dimensions for path computation
  const preparedNodes: FlowNode[] = visibleNodes.map((n) => ({
    ...n,
    dimensions: {
      width: n.dimensions?.width ?? defaultWidth,
      height: n.dimensions?.height ?? defaultHeight,
    },
  }));

  // Build node lookup map
  const nodeMap = new Map<string, FlowNode>();
  for (const n of preparedNodes) {
    nodeMap.set(n.id, n);
  }

  // ── 2. Build output nodes ──────────────────────────────────────────────

  const outputNodes: RenderPlanNode[] = preparedNodes.map((n) => ({
    id: n.id,
    x: n.position.x,
    y: n.position.y,
    width: n.dimensions!.width,
    height: n.dimensions!.height,
    ...(n.class ? { class: n.class } : {}),
    ...(n.style
      ? {
          style: typeof n.style === 'string'
            ? n.style
            : Object.entries(n.style).map(([k, v]) => `${k}:${v}`).join(';'),
        }
      : {}),
    data: n.data ?? {},
  }));

  // ── 3. Process edges ───────────────────────────────────────────────────

  const visibleEdges = edges.filter((e) => !e.hidden);
  const outputEdges: RenderPlanEdge[] = [];
  const markerDefs = new Map<string, string>(); // id → SVG markup

  for (const edge of visibleEdges) {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    // Skip edges with missing endpoints
    if (!sourceNode || !targetNode) {
      continue;
    }

    // Compute edge path — getEdgePath returns an EdgePathResult object
    let pathD: string;
    let pathLabelPosition: { x: number; y: number } | undefined;
    try {
      const result = getEdgePath(
        edge,
        sourceNode,
        targetNode,
        sourceNode.sourcePosition ?? 'bottom',
        targetNode.targetPosition ?? 'top',
      );
      pathD = result.path;
      pathLabelPosition = result.labelPosition;
    } catch {
      // Skip edges whose path computation fails (e.g. unrecognized type)
      continue;
    }

    // Collect markers
    let markerStartRef: string | undefined;
    let markerEndRef: string | undefined;

    if (edge.markerStart) {
      const cfg = normalizeMarker(edge.markerStart);
      const id = getMarkerId(cfg, flowId);
      if (!markerDefs.has(id)) {
        markerDefs.set(id, getMarkerSvg(cfg, id));
      }
      markerStartRef = `url(#${id})`;
    }

    if (edge.markerEnd) {
      const cfg = normalizeMarker(edge.markerEnd);
      const id = getMarkerId(cfg, flowId);
      if (!markerDefs.has(id)) {
        markerDefs.set(id, getMarkerSvg(cfg, id));
      }
      markerEndRef = `url(#${id})`;
    }

    // Compute label position — prefer the path's computed midpoint, fall back to node-center midpoint
    let labelX: number | undefined;
    let labelY: number | undefined;
    if (edge.label) {
      if (pathLabelPosition) {
        labelX = pathLabelPosition.x;
        labelY = pathLabelPosition.y;
      } else {
        const srcCenterX = sourceNode.position.x + sourceNode.dimensions!.width / 2;
        const srcCenterY = sourceNode.position.y + sourceNode.dimensions!.height / 2;
        const tgtCenterX = targetNode.position.x + targetNode.dimensions!.width / 2;
        const tgtCenterY = targetNode.position.y + targetNode.dimensions!.height / 2;
        labelX = (srcCenterX + tgtCenterX) / 2;
        labelY = (srcCenterY + tgtCenterY) / 2;
      }
    }

    outputEdges.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      pathD,
      ...(markerStartRef ? { markerStart: markerStartRef } : {}),
      ...(markerEndRef ? { markerEnd: markerEndRef } : {}),
      ...(edge.class ? { class: edge.class } : {}),
      ...(edge.label ? { label: edge.label } : {}),
      ...(labelX !== undefined ? { labelX } : {}),
      ...(labelY !== undefined ? { labelY } : {}),
    });
  }

  // ── 4. Build markers string ────────────────────────────────────────────

  const markers = Array.from(markerDefs.values()).join('\n');

  // ── 5. Compute viewBox and viewport ────────────────────────────────────

  let viewBox: Rect;
  let viewport: Viewport;

  if (preparedNodes.length === 0) {
    viewBox = { x: 0, y: 0, width: 0, height: 0 };
    viewport = { x: 0, y: 0, zoom: 1 };
  } else {
    const bounds = getNodesBounds(preparedNodes);
    viewBox = {
      x: bounds.x - padding,
      y: bounds.y - padding,
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2,
    };
    viewport = {
      x: -viewBox.x,
      y: -viewBox.y,
      zoom: 1,
    };
  }

  return {
    nodes: outputNodes,
    edges: outputEdges,
    markers,
    viewBox,
    viewport,
  };
}
