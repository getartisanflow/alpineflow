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
import { applyChannelOffset } from '../crossing-reduction';

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
  /** WS-3: signed px offset applied to the route's dominant interior run after routing. */
  channelOffset?: number;
}

/** Offset from the handle before routing begins. Slightly larger than OBSTACLE_PADDING
 *  so the offset point is guaranteed to land outside the padded source/target rect. */
const HANDLE_OFFSET = OBSTACLE_PADDING + 1;

/** Secondary-cost weights for route quality. These live ONLY in the lexicographic
 *  tie-break — they never affect the primary Manhattan length, so a route is never
 *  made longer to save a bend or reduce deviation. Tunable (see spec §3.3). */
const BEND_WEIGHT = 1;
const DEVIATION_WEIGHT = 0.5;

/** Signature of the cost constants, folded into the route cache key so tuning the
 *  weights (or a future routing config) can't serve routes computed under the old
 *  cost. See {@link routeKey}. */
export const ROUTE_COST_VERSION = `b${BEND_WEIGHT}d${DEVIATION_WEIGHT}`;

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
 * Binary min-heap of indices ordered by a caller-supplied `less` comparator.
 * Decrease-key is emulated with lazy insertion — a node may appear multiple
 * times; stale entries are skipped via the caller's `visited` set on pop.
 */
class MinHeap {
  private items: number[] = [];

  constructor(private less: (a: number, b: number) => boolean) {}

  get size(): number {
    return this.items.length;
  }

  push(i: number): void {
    this.items.push(i);
    let c = this.items.length - 1;
    while (c > 0) {
      const p = (c - 1) >> 1;
      if (!this.less(this.items[c], this.items[p])) break;
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
        if (l < this.items.length && this.less(this.items[l], this.items[m])) m = l;
        if (r < this.items.length && this.less(this.items[r], this.items[m])) m = r;
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
  // Two arrival-axis states per vertex: state s = axis * n + vertexIndex,
  // where axis 0 = arrived on a horizontal segment, 1 = arrived on a vertical one.
  const S = 2 * n;
  const len = new Float64Array(S).fill(Infinity); // primary cost: Manhattan length
  const tie = new Float64Array(S).fill(Infinity); // secondary cost: bends + deviation
  const prev = new Int32Array(S).fill(-1);        // predecessor STATE index
  const visited = new Uint8Array(S);

  const adj = buildAdjacency(graphPoints, obstacles);

  // Endpoint bounding box for the corridor-deviation term.
  const bx0 = Math.min(source.x, target.x);
  const bx1 = Math.max(source.x, target.x);
  const by0 = Math.min(source.y, target.y);
  const by1 = Math.max(source.y, target.y);
  const outOfBox = (p: RoutePoint): number =>
    Math.max(0, bx0 - p.x) + Math.max(0, p.x - bx1) +
    Math.max(0, by0 - p.y) + Math.max(0, p.y - by1);

  // Lexicographic order: primary Manhattan length, then secondary tie cost.
  const less = (a: number, b: number): boolean =>
    len[a] < len[b] || (len[a] === len[b] && tie[a] < tie[b]);
  const heap = new MinHeap(less);

  // Seed both arrival axes at the source so the first move is bend-free.
  for (let axis = 0; axis < 2; axis++) {
    const s = axis * n + source.index;
    len[s] = 0;
    tie[s] = 0;
    heap.push(s);
  }

  const stateNode = (s: number): number => s % n;
  const stateAxis = (s: number): number => (s < n ? 0 : 1);

  let bestTarget = -1;
  while (heap.size > 0) {
    const s = heap.pop()!;
    if (visited[s]) continue;
    visited[s] = 1;

    const uIdx = stateNode(s);
    if (uIdx === target.index) {
      bestTarget = s; // first target state popped is lexicographically optimal
      break;
    }

    const axisIn = stateAxis(s);
    const u = graphPoints[uIdx];

    for (const vIdx of adj[uIdx]) {
      const v = graphPoints[vIdx];
      const moveAxis = u.x === v.x ? 1 : 0; // vertical move shares x
      const t = moveAxis * n + vIdx;
      if (visited[t]) continue;

      const stepLen = Math.abs(v.x - u.x) + Math.abs(v.y - u.y);
      const bend = axisIn === moveAxis ? 0 : 1;
      const stepTie = BEND_WEIGHT * bend + DEVIATION_WEIGHT * outOfBox(v);

      const newLen = len[s] + stepLen;
      const newTie = tie[s] + stepTie;

      if (newLen < len[t] || (newLen === len[t] && newTie < tie[t])) {
        len[t] = newLen;
        tie[t] = newTie;
        prev[t] = s;
        heap.push(t);
      }
    }
  }

  if (bestTarget === -1) {
    // Target never popped → unreachable in both axis states.
    const s0 = target.index;
    const s1 = n + target.index;
    if (len[s0] === Infinity && len[s1] === Infinity) return null;
    bestTarget = less(s0, s1) ? s0 : s1;
  }

  // Reconstruct path (state indices → vertices).
  const path: RoutePoint[] = [];
  let cur = bestTarget;
  while (cur !== -1) {
    path.unshift(graphPoints[stateNode(cur)]);
    cur = prev[cur];
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
export const CORRIDOR_MARGIN = 200;

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
 *
 * Internal — call the memoized {@link findRoute} wrapper instead.
 */
function computeRoute(
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

// ── Route memo cache ─────────────────────────────────────────────────────────

const ROUTE_CACHE_MAX = 512;
const routeCache = new Map<string, RoutePoint[] | null>();
const cacheStats = {
  hits: 0,
  misses: 0,
  clear(): void {
    routeCache.clear();
    this.hits = 0;
    this.misses = 0;
  },
};

/**
 * Cache key from endpoints + obstacle geometry. Coordinates are rounded to
 * integers so sub-pixel churn (drag jitter, fractional zoom) stays cache-hot.
 */
function routeKey(
  sx: number,
  sy: number,
  sp: HandlePosition,
  tx: number,
  ty: number,
  tp: HandlePosition,
  obstacles: Rect[],
): string {
  let key = `${ROUTE_COST_VERSION}|${Math.round(sx)},${Math.round(sy)},${sp}|${Math.round(tx)},${Math.round(ty)},${tp}`;
  for (const r of obstacles) {
    key += `|${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}`;
  }
  return key;
}

/**
 * Memoized {@link computeRoute}. Full-graph passes (undo tick, selection flush)
 * re-route every edge even when nothing moved; identical (endpoints, obstacles)
 * inputs return the cached result instead of recomputing.
 *
 * The cached array is returned by reference; callers (getOrthogonalPath,
 * avoidant.ts) only read it. If a future caller mutates the waypoint array,
 * return a shallow copy on hit.
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
  const key = routeKey(sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, obstacles);

  if (routeCache.has(key)) {
    cacheStats.hits++;
    // LRU touch: re-insert so this key becomes most-recently used.
    const cached = routeCache.get(key)!;
    routeCache.delete(key);
    routeCache.set(key, cached);
    return cached;
  }

  cacheStats.misses++;
  const result = computeRoute(sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, obstacles);
  routeCache.set(key, result);
  if (routeCache.size > ROUTE_CACHE_MAX) {
    // Evict least-recently used (first insertion-ordered key).
    routeCache.delete(routeCache.keys().next().value!);
  }
  return result;
}

export function routeCacheStatsForTests(): typeof cacheStats {
  return cacheStats;
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
  channelOffset,
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

  // WS-3: shift the dominant interior run by the crossing-reduction offset (revert on collision)
  const finalWaypoints = applyChannelOffset(waypoints, channelOffset, obstacles);

  // Build SVG path
  const path = buildSvgPath(finalWaypoints, borderRadius);

  // Compute label midpoint along polyline
  const { x, y, offsetX, offsetY } = getPathMidpoint(finalWaypoints);

  return {
    path,
    labelPosition: { x, y },
    labelOffsetX: offsetX,
    labelOffsetY: offsetY,
  };
}
