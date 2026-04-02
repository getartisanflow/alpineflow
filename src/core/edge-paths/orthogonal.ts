// ============================================================================
// Orthogonal Edge Path
//
// Routes edges with right-angle segments around obstacle nodes using a
// visibility graph + Dijkstra pathfinding algorithm. Falls back to
// getSmoothStepPath when no obstacles exist or routing fails.
// ============================================================================

import type { HandlePosition, Rect } from '../types';
import { getBend, type EdgePathResult } from './utils';
import { getSmoothStepPath } from './smoothstep';

export const OBSTACLE_PADDING = 20;

export interface OrthogonalPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: HandlePosition;
  targetX: number;
  targetY: number;
  targetPosition?: HandlePosition;
  obstacles?: Rect[];
  borderRadius?: number;
}

/** Offset from the handle before routing begins. Slightly larger than OBSTACLE_PADDING
 *  so the offset point is guaranteed to land outside the padded source/target rect. */
const HANDLE_OFFSET = OBSTACLE_PADDING + 1;

function getDirection(position: HandlePosition): { x: number; y: number } {
  switch (position) {
    case 'top':
      return { x: 0, y: -1 };
    case 'bottom':
      return { x: 0, y: 1 };
    case 'left':
      return { x: -1, y: 0 };
    case 'right':
      return { x: 1, y: 0 };
    default:
      return { x: 0, y: 1 };
  }
}

// ── Geometry helpers ─────────────────────────────────────────────────────────

function padRect(rect: Rect, padding: number): Rect {
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

function isInsideRect(px: number, py: number, rect: Rect): boolean {
  return (
    px > rect.x &&
    px < rect.x + rect.width &&
    py > rect.y &&
    py < rect.y + rect.height
  );
}

function isHSegmentBlocked(
  x1: number,
  x2: number,
  y: number,
  rects: Rect[],
): boolean {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);

  for (const r of rects) {
    const rLeft = r.x;
    const rRight = r.x + r.width;
    const rTop = r.y;
    const rBottom = r.y + r.height;

    // Segment must cross the rect's vertical span and horizontal span
    if (y > rTop && y < rBottom && maxX > rLeft && minX < rRight) {
      return true;
    }
  }

  return false;
}

function isVSegmentBlocked(
  x: number,
  y1: number,
  y2: number,
  rects: Rect[],
): boolean {
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  for (const r of rects) {
    const rLeft = r.x;
    const rRight = r.x + r.width;
    const rTop = r.y;
    const rBottom = r.y + r.height;

    if (x > rLeft && x < rRight && maxY > rTop && minY < rBottom) {
      return true;
    }
  }

  return false;
}

// ── Visibility graph ─────────────────────────────────────────────────────────

export interface RoutePoint {
  x: number;
  y: number;
  index: number;
}

function buildVisibilityGraph(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  paddedObstacles: Rect[],
): RoutePoint[] {
  // Collect all candidate X and Y coordinates (scanlines)
  const xSet = new Set<number>([sourceX, targetX]);
  const ySet = new Set<number>([sourceY, targetY]);

  for (const r of paddedObstacles) {
    xSet.add(r.x);
    xSet.add(r.x + r.width);
    ySet.add(r.y);
    ySet.add(r.y + r.height);
  }

  const xCoords = Array.from(xSet).sort((a, b) => a - b);
  const yCoords = Array.from(ySet).sort((a, b) => a - b);

  // Generate all grid intersection points, filtering out those inside obstacles
  const points: RoutePoint[] = [];
  let index = 0;

  for (const x of xCoords) {
    for (const y of yCoords) {
      let inside = false;
      for (const r of paddedObstacles) {
        if (isInsideRect(x, y, r)) {
          inside = true;
          break;
        }
      }
      if (!inside) {
        points.push({ x, y, index: index++ });
      }
    }
  }

  return points;
}

// ── Dijkstra ─────────────────────────────────────────────────────────────────

function dijkstra(
  source: RoutePoint,
  target: RoutePoint,
  graphPoints: RoutePoint[],
  obstacles: Rect[],
): RoutePoint[] | null {
  const n = graphPoints.length;
  const dist = new Float64Array(n).fill(Infinity);
  const prev = new Int32Array(n).fill(-1);
  const visited = new Uint8Array(n);

  dist[source.index] = 0;

  // Simple priority queue via sorted array (adequate for small graphs)
  // For the typical number of graph points (<200) this outperforms a heap.
  const queue: number[] = [source.index];

  while (queue.length > 0) {
    // Find minimum distance node in queue
    let minIdx = 0;
    for (let i = 1; i < queue.length; i++) {
      if (dist[queue[i]] < dist[queue[minIdx]]) {
        minIdx = i;
      }
    }
    const uIdx = queue[minIdx];
    queue.splice(minIdx, 1);

    if (visited[uIdx]) continue;
    visited[uIdx] = 1;

    if (uIdx === target.index) break;

    const u = graphPoints[uIdx];

    // Check all other points for orthogonal connectivity
    for (let i = 0; i < n; i++) {
      if (visited[i]) continue;

      const v = graphPoints[i];

      // Only connect orthogonally (same x or same y)
      if (u.x !== v.x && u.y !== v.y) continue;

      // Check if the segment is blocked by any obstacle
      let blocked = false;
      if (u.x === v.x) {
        blocked = isVSegmentBlocked(u.x, u.y, v.y, obstacles);
      } else {
        blocked = isHSegmentBlocked(u.x, v.x, u.y, obstacles);
      }

      if (blocked) continue;

      const weight = Math.abs(v.x - u.x) + Math.abs(v.y - u.y);
      const newDist = dist[uIdx] + weight;

      if (newDist < dist[i]) {
        dist[i] = newDist;
        prev[i] = uIdx;
        queue.push(i);
      }
    }
  }

  if (dist[target.index] === Infinity) return null;

  // Reconstruct path
  const path: RoutePoint[] = [];
  let current = target.index;
  while (current !== -1) {
    path.unshift(graphPoints[current]);
    current = prev[current];
  }

  return path;
}

// ── Path simplification & SVG ────────────────────────────────────────────────

function simplifyPath(points: RoutePoint[]): RoutePoint[] {
  if (points.length <= 2) return points;

  const result: RoutePoint[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1];
    const next = points[i + 1];
    const curr = points[i];

    // Keep the point if direction changes (not collinear)
    const sameX = prev.x === curr.x && curr.x === next.x;
    const sameY = prev.y === curr.y && curr.y === next.y;

    if (!sameX && !sameY) {
      result.push(curr);
    }
  }

  result.push(points[points.length - 1]);
  return result;
}

function buildSvgPath(waypoints: RoutePoint[], borderRadius: number): string {
  if (waypoints.length < 2) return '';

  let path = `M${waypoints[0].x},${waypoints[0].y}`;

  for (let i = 1; i < waypoints.length - 1; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    const next = waypoints[i + 1];

    if (borderRadius > 0) {
      path += ` ${getBend(prev.x, prev.y, curr.x, curr.y, next.x, next.y, borderRadius)}`;
    } else {
      path += ` L${curr.x},${curr.y}`;
    }
  }

  const last = waypoints[waypoints.length - 1];
  path += ` L${last.x},${last.y}`;

  return path;
}

function getPathMidpoint(
  waypoints: RoutePoint[],
): { x: number; y: number; offsetX: number; offsetY: number } {
  if (waypoints.length < 2) {
    return { x: waypoints[0]?.x ?? 0, y: waypoints[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  }

  // Compute total polyline length
  let totalLength = 0;
  const segLengths: number[] = [];

  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i].x - waypoints[i - 1].x;
    const dy = waypoints[i].y - waypoints[i - 1].y;
    const len = Math.abs(dx) + Math.abs(dy); // Manhattan distance for orthogonal paths
    segLengths.push(len);
    totalLength += len;
  }

  // Walk to the midpoint
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

  // Fallback: last point
  const last = waypoints[waypoints.length - 1];
  return { x: last.x, y: last.y, offsetX: 0, offsetY: 0 };
}

// ── Shared routing pipeline ──────────────────────────────────────────────────

/**
 * Find an obstacle-free route from source to target using handle-aware offsets,
 * a visibility graph, and Dijkstra pathfinding.
 *
 * Returns simplified waypoints (including actual source/target endpoints) or
 * null if no route can be found.
 */
export function findRoute(
  sourceX: number,
  sourceY: number,
  sourcePosition: HandlePosition,
  targetX: number,
  targetY: number,
  targetPosition: HandlePosition,
  obstacles: Rect[],
): RoutePoint[] | null {
  // Compute handle-direction offset points so the edge leaves/arrives correctly
  const srcDir = getDirection(sourcePosition);
  const tgtDir = getDirection(targetPosition);
  const srcOffX = sourceX + srcDir.x * HANDLE_OFFSET;
  const srcOffY = sourceY + srcDir.y * HANDLE_OFFSET;
  const tgtOffX = targetX + tgtDir.x * HANDLE_OFFSET;
  const tgtOffY = targetY + tgtDir.y * HANDLE_OFFSET;

  // Pad obstacles
  const paddedObstacles = obstacles.map((r) => padRect(r, OBSTACLE_PADDING));

  // Build visibility graph between the offset points
  const graphPoints = buildVisibilityGraph(
    srcOffX,
    srcOffY,
    tgtOffX,
    tgtOffY,
    paddedObstacles,
  );

  // Find offset source and target in graph points
  const sourcePoint = graphPoints.find((p) => p.x === srcOffX && p.y === srcOffY);
  const targetPoint = graphPoints.find((p) => p.x === tgtOffX && p.y === tgtOffY);

  if (!sourcePoint) {
    graphPoints.push({ x: srcOffX, y: srcOffY, index: graphPoints.length });
  }
  if (!targetPoint) {
    graphPoints.push({ x: tgtOffX, y: tgtOffY, index: graphPoints.length });
  }
  const finalSource = sourcePoint ?? graphPoints[graphPoints.length - (targetPoint ? 1 : 2)];
  const finalTarget = targetPoint ?? graphPoints[graphPoints.length - 1];

  // Run Dijkstra between offset points
  const route = dijkstra(finalSource, finalTarget, graphPoints, paddedObstacles);

  if (!route || route.length < 2) return null;

  // Prepend actual source and append actual target
  const fullRoute: RoutePoint[] = [
    { x: sourceX, y: sourceY, index: -1 },
    ...route,
    { x: targetX, y: targetY, index: -2 },
  ];

  return simplifyPath(fullRoute);
}

// ── Main export ──────────────────────────────────────────────────────────────

export function getOrthogonalPath({
  sourceX,
  sourceY,
  sourcePosition = 'bottom',
  targetX,
  targetY,
  targetPosition = 'top',
  obstacles,
  borderRadius = 5,
}: OrthogonalPathParams): EdgePathResult {
  // Fast path: no obstacles → delegate to smoothstep
  if (!obstacles || obstacles.length === 0) {
    return getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius,
    });
  }

  const waypoints = findRoute(sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, obstacles);

  // No route found → fall back
  if (!waypoints) {
    return getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius,
    });
  }

  // Build SVG path
  const path = buildSvgPath(waypoints, borderRadius);

  // Compute label midpoint along polyline
  const { x, y, offsetX, offsetY } = getPathMidpoint(waypoints);

  return {
    path,
    labelPosition: { x, y },
    labelOffsetX: offsetX,
    labelOffsetY: offsetY,
  };
}
