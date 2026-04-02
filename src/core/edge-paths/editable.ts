// ============================================================================
// Editable Edge Path
//
// User-controlled waypoints with 4 interpolation styles:
// linear, step, catmull-rom, bezier (default).
// ============================================================================

import type { HandlePosition } from '../types';
import { getBend, getEdgeCenter, type EdgePathResult } from './utils';
import { buildCatmullRomPath } from './avoidant';

export type EditablePathStyle = 'linear' | 'step' | 'smoothstep' | 'catmull-rom' | 'bezier';

export interface EditablePathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: HandlePosition;
  targetX: number;
  targetY: number;
  targetPosition?: HandlePosition;
  controlPoints?: { x: number; y: number }[];
  pathStyle?: EditablePathStyle;
  borderRadius?: number;
}

/**
 * Build an SVG path through [source, ...controlPoints, target]
 * using the chosen interpolation style.
 */
export function getEditablePath(params: EditablePathParams): EdgePathResult {
  const {
    sourceX, sourceY,
    targetX, targetY,
    controlPoints = [],
    pathStyle = 'bezier',
    borderRadius = 5,
  } = params;

  const waypoints = [
    { x: sourceX, y: sourceY },
    ...controlPoints,
    { x: targetX, y: targetY },
  ];

  let path: string;

  switch (pathStyle) {
    case 'linear':
      path = buildLinearPath(waypoints);
      break;
    case 'step':
      path = buildStepPath(waypoints, 0);
      break;
    case 'smoothstep':
      path = buildSmoothStepPath(waypoints, borderRadius);
      break;
    case 'catmull-rom':
    case 'bezier':
      path = buildCatmullRomPath(waypoints.map((p, i) => ({ ...p, index: i })));
      break;
    default:
      path = buildLinearPath(waypoints);
  }

  // Label position: midpoint of the polyline by distance
  const mid = getPolylineMidpoint(waypoints);
  const center = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

  return {
    path,
    labelPosition: mid,
    labelOffsetX: center.offsetX,
    labelOffsetY: center.offsetY,
  };
}

/** Straight line segments between each waypoint. */
function buildLinearPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L${points[i].x},${points[i].y}`;
  }
  return d;
}

/** Orthogonal L-bends between each consecutive pair with rounded corners. */
function buildStepPath(points: { x: number; y: number }[], borderRadius: number): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return buildStepSegment(points[0], points[1], borderRadius);
  }

  // For 3+ points: straight segments between explicit waypoints
  // with rounded corners at each waypoint via getBend
  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    d += getBend(prev.x, prev.y, curr.x, curr.y, next.x, next.y, borderRadius);
  }

  const last = points[points.length - 1];
  d += ` L${last.x},${last.y}`;
  return d;
}

/** Build an L-bend step segment between two points. */
function buildStepSegment(
  from: { x: number; y: number },
  to: { x: number; y: number },
  borderRadius: number,
): string {
  const midX = (from.x + to.x) / 2;
  // Route: horizontal to midX, then vertical to target Y, then horizontal to target
  const bend1 = getBend(from.x, from.y, midX, from.y, midX, to.y, borderRadius);
  const bend2 = getBend(midX, from.y, midX, to.y, to.x, to.y, borderRadius);
  return `M${from.x},${from.y}${bend1}${bend2} L${to.x},${to.y}`;
}

/**
 * Proper smoothstep: orthogonal (axis-aligned) routing between each pair
 * of waypoints with rounded corners, like the regular smoothstep edge type.
 */
function buildSmoothStepPath(points: { x: number; y: number }[], borderRadius: number): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return buildStepSegment(points[0], points[1], borderRadius);
  }

  // Expand waypoints by inserting orthogonal routing points between each pair.
  // Between A and B, route: A → (midX, A.y) → (midX, B.y) → B
  const expanded: { x: number; y: number }[] = [points[0]];

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const dx = Math.abs(b.x - a.x);
    const dy = Math.abs(b.y - a.y);

    if (dx < 1 || dy < 1) {
      // Already axis-aligned, just go straight
      expanded.push(b);
    } else {
      const midX = (a.x + b.x) / 2;
      expanded.push({ x: midX, y: a.y });
      expanded.push({ x: midX, y: b.y });
      expanded.push(b);
    }
  }

  // Draw the expanded path with rounded bends at each intermediate point
  let d = `M${expanded[0].x},${expanded[0].y}`;
  for (let i = 1; i < expanded.length - 1; i++) {
    const prev = expanded[i - 1];
    const curr = expanded[i];
    const next = expanded[i + 1];
    d += getBend(prev.x, prev.y, curr.x, curr.y, next.x, next.y, borderRadius);
  }
  const last = expanded[expanded.length - 1];
  d += ` L${last.x},${last.y}`;
  return d;
}

/** Find the midpoint along a polyline by accumulated distance. */
function getPolylineMidpoint(points: { x: number; y: number }[]): { x: number; y: number } {
  if (points.length < 2) return points[0] ?? { x: 0, y: 0 };

  let totalLen = 0;
  const segLengths: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segLengths.push(len);
    totalLen += len;
  }

  if (totalLen === 0) return points[0];

  let target = totalLen / 2;
  for (let i = 0; i < segLengths.length; i++) {
    if (target <= segLengths[i]) {
      const t = target / segLengths[i];
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * t,
        y: points[i].y + (points[i + 1].y - points[i].y) * t,
      };
    }
    target -= segLengths[i];
  }

  return points[points.length - 1];
}
