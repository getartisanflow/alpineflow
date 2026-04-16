// ============================================================================
// Shared Edge Path Utilities
//
// Pure computation functions for edge paths, extracted from the flow-edge
// directive so they can be reused by flow-canvas (e.g. animate()).
// No DOM or Alpine dependencies — pure geometry and dispatching.
// ============================================================================

import type { FlowEdge, FlowNode, HandlePosition, Rect, ShapeDefinition } from './types';
import type { MarkerType, MarkerConfig } from './markers';
import type { EdgePathResult } from './edge-paths/utils';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT, getNodeVisualPosition } from './geometry';
import { builtinShapes, rectPerimeter } from './shapes';
import { rotatePoint } from './rotation';
import { getAvoidantPath } from './edge-paths/avoidant';
import { getBezierPath } from './edge-paths/bezier';
import { getEditablePath } from './edge-paths/editable';
import { getOrthogonalPath } from './edge-paths/orthogonal';
import { getSmoothStepPath } from './edge-paths/smoothstep';
import { getStraightPath } from './edge-paths/straight';

/**
 * Compute the x,y coordinates where an edge connects to a node based on
 * the handle's position (top/right/bottom/left + corners).
 * When the node has a shape, uses the shape's perimeter function for
 * accurate connection points.
 */
export function getHandleCoords(
  node: FlowNode,
  position: HandlePosition,
  shapeRegistry?: Record<string, ShapeDefinition>,
  globalOrigin?: [number, number],
): { x: number; y: number } {
  const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
  const vp = getNodeVisualPosition(node, globalOrigin);

  let coords: { x: number; y: number };

  // Shape-aware perimeter point
  if (node.shape) {
    const shapeDef = shapeRegistry?.[node.shape] ?? builtinShapes[node.shape];
    if (shapeDef) {
      const local = shapeDef.perimeterPoint(w, h, position);
      coords = { x: vp.x + local.x, y: vp.y + local.y };
    } else {
      const local = rectPerimeter(w, h, position);
      coords = { x: vp.x + local.x, y: vp.y + local.y };
    }
  } else {
    // Rectangular fallback
    const local = rectPerimeter(w, h, position);
    coords = { x: vp.x + local.x, y: vp.y + local.y };
  }

  // Rotate around node center to match the CSS transform rotation.
  // Handles are inside the rotated DOM element so they visually rotate;
  // edge endpoints must follow.
  if (node.rotation) {
    const cx = vp.x + w / 2;
    const cy = vp.y + h / 2;
    coords = rotatePoint(coords.x, coords.y, cx, cy, node.rotation);
  }

  return coords;
}

/**
 * Normalize corner positions to the nearest cardinal direction for
 * path generators that only understand top/right/bottom/left.
 */
export function toCardinalPosition(pos: HandlePosition): 'top' | 'right' | 'bottom' | 'left' {
  switch (pos) {
    case 'top-left':
    case 'top-right':
      return 'top';
    case 'bottom-left':
    case 'bottom-right':
      return 'bottom';
    default:
      return pos;
  }
}

/**
 * Return a unit vector pointing outward from the node for a given handle position.
 */
export function getHandleOutwardDirection(position: HandlePosition): { x: number; y: number } {
  const DIAG = Math.SQRT1_2; // ~0.7071
  switch (position) {
    case 'top':          return { x: 0,     y: -1 };
    case 'bottom':       return { x: 0,     y: 1 };
    case 'left':         return { x: -1,    y: 0 };
    case 'right':        return { x: 1,     y: 0 };
    case 'top-left':     return { x: -DIAG, y: -DIAG };
    case 'top-right':    return { x: DIAG,  y: -DIAG };
    case 'bottom-left':  return { x: -DIAG, y: DIAG };
    case 'bottom-right': return { x: DIAG,  y: DIAG };
  }
}

/** Stroke width used on edge paths (matches CSS `.flow-edges path` stroke-width). */
const EDGE_STROKE_WIDTH = 1.5;

/** Ratio of arrow body depth to the marker viewBox (arrow polyline spans 5 of 20 units). */
const ARROW_DEPTH_RATIO = 5 / 20;

/**
 * Shorten an edge endpoint away from the handle center so the marker tip
 * sits just outside the handle's visible boundary.
 */
export function shortenEndpoint(
  coords: { x: number; y: number },
  position: HandlePosition,
  measurement: { handleWidth: number; handleHeight: number } | null,
  marker: MarkerType | MarkerConfig | undefined,
): { x: number; y: number } {
  if (!marker) return coords;

  const cfg = typeof marker === 'string' ? { type: marker } as MarkerConfig : marker;

  // Handle radius — use measured dimensions when available, else default 5px
  const handleRadius = measurement
    ? Math.min(measurement.handleWidth, measurement.handleHeight) / 2
    : 5;

  // Check for explicit offset override
  if (cfg.offset !== undefined) {
    const dir = getHandleOutwardDirection(position);
    return { x: coords.x + dir.x * cfg.offset, y: coords.y + dir.y * cfg.offset };
  }

  // Automatic calculation: handle radius + marker padding
  const markerWidth = cfg.width ?? 12.5;
  const markerDepth = markerWidth * EDGE_STROKE_WIDTH * ARROW_DEPTH_RATIO;
  const markerPadding = markerDepth * 0.4;
  const totalOffset = handleRadius + markerPadding;

  const dir = getHandleOutwardDirection(position);
  return { x: coords.x + dir.x * totalOffset, y: coords.y + dir.y * totalOffset };
}

/**
 * Compute the SVG path for an edge given source/target nodes and handle positions.
 * Dispatches to the appropriate path generator based on edge type.
 */
export function getEdgePath(
  edge: FlowEdge,
  sourceNode: FlowNode,
  targetNode: FlowNode,
  sourcePosition: HandlePosition = 'bottom',
  targetPosition: HandlePosition = 'top',
  sourceCoords?: { x: number; y: number },
  targetCoords?: { x: number; y: number },
  edgeTypes?: Record<string, (params: { sourceX: number; sourceY: number; sourcePosition: 'top' | 'right' | 'bottom' | 'left'; targetX: number; targetY: number; targetPosition: 'top' | 'right' | 'bottom' | 'left' }) => EdgePathResult>,
  obstacles?: Rect[],
  shapeRegistry?: Record<string, ShapeDefinition>,
  globalOrigin?: [number, number],
  defaultEdgeType?: string,
) {
  const source = sourceCoords ?? getHandleCoords(sourceNode, sourcePosition, shapeRegistry, globalOrigin);
  const target = targetCoords ?? getHandleCoords(targetNode, targetPosition, shapeRegistry, globalOrigin);

  const params = {
    sourceX: source.x, sourceY: source.y, sourcePosition: toCardinalPosition(sourcePosition),
    targetX: target.x, targetY: target.y, targetPosition: toCardinalPosition(targetPosition),
  };

  const edgeType = edge.type ?? defaultEdgeType ?? 'bezier';

  // Check custom edge types first
  if (edgeTypes?.[edgeType]) {
    return edgeTypes[edgeType](params);
  }

  // For floating edges, use pathType to pick the path generator; otherwise use edge.type
  const pathStyle = edgeType === 'floating' ? (edge.pathType ?? 'bezier') : edgeType;

  switch (pathStyle) {
    case 'editable':
      return getEditablePath({
        ...params,
        controlPoints: edge.controlPoints,
        pathStyle: edge.pathStyle,
      });
    case 'avoidant':
      return getAvoidantPath({ ...params, obstacles });
    case 'orthogonal':
      return getOrthogonalPath({ ...params, obstacles });
    case 'smoothstep':
      return getSmoothStepPath(params);
    case 'straight':
      return getStraightPath({ sourceX: source.x, sourceY: source.y, targetX: target.x, targetY: target.y });
    case 'bezier':
    default:
      return getBezierPath(params);
  }
}
