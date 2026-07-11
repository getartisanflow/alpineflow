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

/**
 * Binary min-heap keyed by an external distance array. Indices (into
 * `graphPoints`) are stored; ordering reads `dist[index]`. Decrease-key is
 * emulated with lazy insertion — a node may appear multiple times, and stale
 * entries are skipped via the caller's `visited` set on pop.
 */
class MinHeap {
  private items: number[] = [];

  constructor(private dist: Float64Array) {}

  get size(): number {
    return this.items.length;
  }

  push(i: number): void {
    this.items.push(i);
    let c = this.items.length - 1;
    while (c > 0) {
      const p = (c - 1) >> 1;
      if (this.dist[this.items[p]] <= this.dist[this.items[c]]) break;
      [this.items[p], this.items[c]] = [this.items[c], this.items[p]];
      c = p;
    }
  }

  pop(): number | undefined {
    const n = this.items.length;
    if (n === 0) return undefined;
    const top = this.items[0];
    const last = this.items.pop()!;
    if (n > 1) {
      this.items[0] = last;
      let p = 0;
      for (;;) {
        const l = 2 * p + 1;
        const r = l + 1;
        let m = p;
        if (l < this.items.length && this.dist[this.items[l]] < this.dist[this.items[m]]) m = l;
        if (r < this.items.length && this.dist[this.items[r]] < this.dist[this.items[m]]) m = r;
        if (m === p) break;
        [this.items[p], this.items[m]] = [this.items[m], this.items[p]];
        p = m;
      }
    }
    return top;
  }
}

/**
 * Build orthogonal adjacency from scanline geometry: along each shared x-line
 * (and y-line) connect only *consecutive* points whose joining segment is
 * unobstructed. Because the weight is additive Manhattan distance, chaining
 * through the intermediate collinear points costs exactly the same as a direct
 * non-consecutive hop, so shortest-path cost is preserved while the neighbour
 * scan drops from O(N) per pop to the handful of segments that actually touch
 * each point. `point.index` equals the array position (see buildVisibilityGraph
 * and findRoute), so it doubles as the adjacency index.
 */
function buildAdjacency(points: RoutePoint[], obstacles: Rect[]): number[][] {
  const adj: number[][] = points.map(() => []);
  const byX = new Map<number, RoutePoint[]>();
  const byY = new Map<number, RoutePoint[]>();

  for (const p of points) {
    let xs = byX.get(p.x);
    if (!xs) {
      xs = [];
      byX.set(p.x, xs);
    }
    xs.push(p);

    let ys = byY.get(p.y);
    if (!ys) {
      ys = [];
      byY.set(p.y, ys);
    }
    ys.push(p);
  }

  for (const line of byX.values()) {
    line.sort((a, b) => a.y - b.y);
    for (let i = 1; i < line.length; i++) {
      const a = line[i - 1];
      const b = line[i];
      if (!isVSegmentBlocked(a.x, a.y, b.y, obstacles)) {
        adj[a.index].push(b.index);
        adj[b.index].push(a.index);
      }
    }
  }

  for (const line of byY.values()) {
    line.sort((a, b) => a.x - b.x);
    for (let i = 1; i < line.length; i++) {
      const a = line[i - 1];
      const b = line[i];
      if (!isHSegmentBlocked(a.x, b.x, a.y, obstacles)) {
        adj[a.index].push(b.index);
        adj[b.index].push(a.index);
      }
    }
  }

  return adj;
}

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

  const adj = buildAdjacency(graphPoints, obstacles);

  dist[source.index] = 0;
  const heap = new MinHeap(dist);
  heap.push(source.index);

  while (heap.size > 0) {
    const uIdx = heap.pop()!;

    if (visited[uIdx]) continue;
    visited[uIdx] = 1;

    if (uIdx === target.index) break;

    const u = graphPoints[uIdx];
    const du = dist[uIdx];

    for (const vIdx of adj[uIdx]) {
      if (visited[vIdx]) continue;

      const v = graphPoints[vIdx];
      const weight = Math.abs(v.x - u.x) + Math.abs(v.y - u.y);
      const newDist = du + weight;

      if (newDist < dist[vIdx]) {
        dist[vIdx] = newDist;
        prev[vIdx] = uIdx;
        heap.push(vIdx); // lazy decrease-key; the visited skip drops stale pops
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

/** Flow units beyond the endpoint bounding box that the corridor retains. */
const CORRIDOR_MARGIN = 200;

/** Test-only diagnostics for the most recent findRoute call. */
const routeDebug = { gridSize: 0, usedFullSet: false };

export function __routeDebugForTests(): { gridSize: number; usedFullSet: boolean } {
  return { ...routeDebug };
}

/**
 * Keep only obstacles whose bounding box intersects the endpoint bounding box
 * expanded by CORRIDOR_MARGIN. Most routes interact only with nearby obstacles,
 * so this collapses the scanline grid from every-node to a local neighbourhood.
 */
function corridorObstacles(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  obstacles: Rect[],
): Rect[] {
  const minX = Math.min(sx, tx) - CORRIDOR_MARGIN;
  const maxX = Math.max(sx, tx) + CORRIDOR_MARGIN;
  const minY = Math.min(sy, ty) - CORRIDOR_MARGIN;
  const maxY = Math.max(sy, ty) + CORRIDOR_MARGIN;
  return obstacles.filter(
    (r) => r.x < maxX && r.x + r.width > minX && r.y < maxY && r.y + r.height > minY,
  );
}

/** True if any axis-aligned segment of a graph route crosses a padded obstacle. */
function routeCrossesObstacles(route: RoutePoint[], paddedObstacles: Rect[]): boolean {
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1];
    const b = route[i];
    if (a.x === b.x) {
      if (isVSegmentBlocked(a.x, a.y, b.y, paddedObstacles)) return true;
    } else if (a.y === b.y) {
      if (isHSegmentBlocked(a.x, b.x, a.y, paddedObstacles)) return true;
    }
  }
  return false;
}

/**
 * Find an obstacle-free route from source to target using handle-aware offsets,
 * a visibility graph, and Dijkstra pathfinding.
 *
 * Obstacles are first pruned to a corridor around the endpoints; the pruned
 * route is validated against the FULL obstacle set, so pruning that either
 * fails to find a route (coarser grid) or routes through a dropped obstacle
 * transparently retries once with the complete set.
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

  // Route against an arbitrary obstacle subset, returning the graph route
  // (offset → … → offset) computed on its padded scanline grid.
  const routeAgainst = (subset: Rect[]): RoutePoint[] | null => {
    const paddedObstacles = subset.map((r) => padRect(r, OBSTACLE_PADDING));
    const graphPoints = buildVisibilityGraph(srcOffX, srcOffY, tgtOffX, tgtOffY, paddedObstacles);
    routeDebug.gridSize = graphPoints.length;

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

    return dijkstra(finalSource, finalTarget, graphPoints, paddedObstacles);
  };

  const pruned = corridorObstacles(sourceX, sourceY, targetX, targetY, obstacles);
  const prunedRemovedSome = pruned.length < obstacles.length;
  routeDebug.usedFullSet = !prunedRemovedSome;

  let route = routeAgainst(pruned);

  // Validate against the full padded set: pruning may fail to route (coarser
  // grid) or route through an obstacle it dropped. Retry once with everything.
  if (prunedRemovedSome) {
    const fullPadded = obstacles.map((r) => padRect(r, OBSTACLE_PADDING));
    const usable = route !== null && route.length >= 2;
    if (!usable || routeCrossesObstacles(route as RoutePoint[], fullPadded)) {
      routeDebug.usedFullSet = true;
      route = routeAgainst(obstacles);
    }
  }

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
