// ============================================================================
// Avoidant Edge Path
//
// Routes edges around obstacle nodes using smooth Catmull-Rom splines.
// Uses the same visibility graph + Dijkstra pathfinding as orthogonal routing
// to find obstacle-free waypoints, then fits a smooth cubic bezier spline
// through them instead of sharp right-angle segments.
// Falls back to getBezierPath when no obstacles exist or routing fails.
// ============================================================================

import type { HandlePosition, Rect } from '../types';
import type { EdgePathResult } from './utils';
import { getBezierPath } from './bezier';
import { findRoute, type RoutePoint } from './orthogonal';

export interface AvoidantPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: HandlePosition;
  targetX: number;
  targetY: number;
  targetPosition?: HandlePosition;
  obstacles?: Rect[];
}

// ── Catmull-Rom to cubic bezier ──────────────────────────────────────────────

/**
 * Convert waypoints into a smooth SVG path using Catmull-Rom spline
 * interpolation, rendered as a series of cubic bezier (C) commands.
 *
 * Each segment from P[i] to P[i+1] uses neighboring points P[i-1] and P[i+2]
 * to compute tangent-based control points:
 *   CP1 = P[i]   + (P[i+1] - P[i-1]) / 6
 *   CP2 = P[i+1] - (P[i+2] - P[i])   / 6
 *
 * For endpoints, the missing neighbor is mirrored from the nearest available.
 */
export function buildCatmullRomPath(waypoints: RoutePoint[]): string {
  if (waypoints.length < 2) return '';

  if (waypoints.length === 2) {
    return `M${waypoints[0].x},${waypoints[0].y} L${waypoints[1].x},${waypoints[1].y}`;
  }

  let path = `M${waypoints[0].x},${waypoints[0].y}`;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = waypoints[Math.max(0, i - 1)];
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const p3 = waypoints[Math.min(waypoints.length - 1, i + 2)];

    // Catmull-Rom to cubic bezier control points
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return path;
}

/**
 * Compute the midpoint along the waypoint polyline for label placement.
 */
function getSplineMidpoint(
  waypoints: RoutePoint[],
): { x: number; y: number; offsetX: number; offsetY: number } {
  if (waypoints.length < 2) {
    return { x: waypoints[0]?.x ?? 0, y: waypoints[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  }

  // Walk polyline segments using Euclidean distance (spline is smooth, not Manhattan)
  let totalLength = 0;
  const segLengths: number[] = [];

  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i].x - waypoints[i - 1].x;
    const dy = waypoints[i].y - waypoints[i - 1].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segLengths.push(len);
    totalLength += len;
  }

  let remaining = totalLength / 2;

  for (let i = 0; i < segLengths.length; i++) {
    if (remaining <= segLengths[i]) {
      const t = segLengths[i] > 0 ? remaining / segLengths[i] : 0;
      const x = waypoints[i].x + (waypoints[i + 1].x - waypoints[i].x) * t;
      const y = waypoints[i].y + (waypoints[i + 1].y - waypoints[i].y) * t;

      return {
        x,
        y,
        offsetX: Math.abs(waypoints[waypoints.length - 1].x - waypoints[0].x) / 2,
        offsetY: Math.abs(waypoints[waypoints.length - 1].y - waypoints[0].y) / 2,
      };
    }
    remaining -= segLengths[i];
  }

  const last = waypoints[waypoints.length - 1];
  return { x: last.x, y: last.y, offsetX: 0, offsetY: 0 };
}

// ── Main export ──────────────────────────────────────────────────────────────

export function getAvoidantPath({
  sourceX,
  sourceY,
  sourcePosition = 'bottom',
  targetX,
  targetY,
  targetPosition = 'top',
  obstacles,
}: AvoidantPathParams): EdgePathResult {
  // Fast path: no obstacles → delegate to bezier
  if (!obstacles || obstacles.length === 0) {
    return getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  const waypoints = findRoute(sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, obstacles);

  // No route found → fall back to bezier
  if (!waypoints) {
    return getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  // Build smooth spline through waypoints
  const path = buildCatmullRomPath(waypoints);

  // Compute label midpoint
  const { x, y, offsetX, offsetY } = getSplineMidpoint(waypoints);

  return {
    path,
    labelPosition: { x, y },
    labelOffsetX: offsetX,
    labelOffsetY: offsetY,
  };
}
