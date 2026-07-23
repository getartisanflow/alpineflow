// ============================================================================
// Crossing Reduction (WS-3)
//
// Pure geometry for reordering avoidant/orthogonal edges that share a routing
// corridor into ordered parallel lanes. No DOM, no Alpine: the canvas grouping
// pass supplies base routes; this file detects shared channels, orders each by
// endpoint barycenter, and shifts an edge's dominant INTERIOR run perpendicular
// by a signed offset. Shifting only interior corners keeps the route orthogonal
// (the neighbour segments, perpendicular to the run, merely lengthen).
// ============================================================================

import { OBSTACLE_PADDING, type RoutePoint } from './edge-paths/orthogonal';
import type { Rect } from './types';

export type CrossingReductionConfig = boolean | { channelGap?: number };

/** Default px separation between adjacent lanes in a shared channel. */
export const DEFAULT_CHANNEL_GAP = 12;

/** Resolve the desired channel gap from the config value; null = disabled. */
export function resolveChannelGap(value: CrossingReductionConfig | undefined): number | null {
  if (!value) return null;
  if (value === true) return DEFAULT_CHANNEL_GAP;
  return value.channelGap ?? DEFAULT_CHANNEL_GAP;
}

// ── Crossing metric (tests + acceptance) ─────────────────────────────────────

function ccw(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
  return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
}

/** Proper segment intersection, ignoring shared endpoints and collinear touches. */
export function segmentsCross(a: RoutePoint, b: RoutePoint, c: RoutePoint, d: RoutePoint): boolean {
  const same = (u: RoutePoint, v: RoutePoint): boolean => u.x === v.x && u.y === v.y;
  if (same(a, c) || same(a, d) || same(b, c) || same(b, d)) return false;
  return ccw(a.x, a.y, c.x, c.y, d.x, d.y) !== ccw(b.x, b.y, c.x, c.y, d.x, d.y)
    && ccw(a.x, a.y, b.x, b.y, c.x, c.y) !== ccw(a.x, a.y, b.x, b.y, d.x, d.y);
}

/** Total pairwise crossings between distinct routes (segments of the same route never count). */
export function countCrossings(routes: RoutePoint[][]): number {
  let n = 0;
  for (let i = 0; i < routes.length; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      const A = routes[i], B = routes[j];
      for (let a = 0; a < A.length - 1; a++) {
        for (let b = 0; b < B.length - 1; b++) {
          if (segmentsCross(A[a], A[a + 1], B[b], B[b + 1])) n++;
        }
      }
    }
  }
  return n;
}

// ── Dominant interior run ────────────────────────────────────────────────────

export interface Run {
  axis: 'h' | 'v';
  /** cross-axis coordinate: y for a horizontal run, x for a vertical run. */
  at: number;
  /** run-axis span (min). */
  from: number;
  /** run-axis span (max). */
  to: number;
  /** waypoint indices of the run's two ends (both interior: 1..len-2). */
  i: number;
  j: number;
}

/**
 * The longest axis-aligned straight run whose BOTH ends are interior corners
 * (never the source/target endpoint). Interior-only so shifting it keeps the
 * route orthogonal AND never detaches an endpoint from its handle. Null when no
 * interior run exists (short/L-shaped routes degrade gracefully to no shift).
 */
export function dominantRun(waypoints: RoutePoint[]): Run | null {
  let best: Run | null = null;
  let bestLen = 0;
  for (let i = 1; i < waypoints.length - 2; i++) {
    const a = waypoints[i], b = waypoints[i + 1];
    const horizontal = a.y === b.y, vertical = a.x === b.x;
    if (!horizontal && !vertical) continue;
    const len = horizontal ? Math.abs(b.x - a.x) : Math.abs(b.y - a.y);
    if (len <= bestLen) continue;
    bestLen = len;
    best = horizontal
      ? { axis: 'h', at: a.y, from: Math.min(a.x, b.x), to: Math.max(a.x, b.x), i, j: i + 1 }
      : { axis: 'v', at: a.x, from: Math.min(a.y, b.y), to: Math.max(a.y, b.y), i, j: i + 1 };
  }
  return best;
}

// ── Channel grouping + barycenter ordering ───────────────────────────────────

export interface ChannelMember {
  edgeId: string;
  run: Run;
  /** endpoint barycenter on the run's cross-axis (where the edge "wants" to sit). */
  bary: number;
}

/** True when two same-axis runs share a corridor: cross-axis within `bandTol` and run-axis overlapping. */
function shareChannel(a: Run, b: Run, bandTol: number): boolean {
  if (a.axis !== b.axis) return false;
  if (Math.abs(a.at - b.at) > bandTol) return false;
  return a.from <= b.to && b.from <= a.to; // extent overlap
}

/**
 * Group members into shared channels (transitive closure over `shareChannel`).
 * Deterministic: members are processed in input order; callers pass a stable
 * (edgeId-sorted) list. Singletons come back as length-1 groups.
 */
export function groupChannels(members: ChannelMember[], bandTol: number): ChannelMember[][] {
  const groups: ChannelMember[][] = [];
  const used = new Set<number>();
  for (let i = 0; i < members.length; i++) {
    if (used.has(i)) continue;
    const group = [members[i]];
    used.add(i);
    // simple transitive expansion: repeatedly absorb any unused member sharing a channel with the group
    let grew = true;
    while (grew) {
      grew = false;
      for (let k = 0; k < members.length; k++) {
        if (used.has(k)) continue;
        if (group.some((g) => shareChannel(g.run, members[k].run, bandTol))) {
          group.push(members[k]);
          used.add(k);
          grew = true;
        }
      }
    }
    groups.push(group);
  }
  return groups;
}

/**
 * Signed lane offsets per edge, centred on 0 and spaced by `gap`, ordered by
 * ascending barycenter (edgeId as a deterministic tie-break). A single-member
 * group yields offset 0 (untouched). Returns a flat `edgeId -> offset` map over
 * ALL members of ALL groups.
 */
export function assignOffsets(members: ChannelMember[], gap: number): Map<string, number> {
  // NB: caller passes ONE channel group at a time OR a pre-grouped flat list;
  // this function centres within the members it receives. See _computeCrossingPlan.
  const out = new Map<string, number>();
  const sorted = [...members].sort((p, q) => p.bary - q.bary || (p.edgeId < q.edgeId ? -1 : 1));
  const count = sorted.length;
  sorted.forEach((m, k) => out.set(m.edgeId, (k - (count - 1) / 2) * gap));
  return out;
}

// ── Offset application (post-route transform) ────────────────────────────────

/**
 * Shift a route's dominant interior run perpendicular by `offset`, returning a
 * NEW waypoint array (base untouched). Because `run.i`/`run.j` are interior and
 * their neighbours run perpendicular to the run, moving just those two points
 * keeps every segment axis-aligned. `offset === 0` returns an equal array.
 */
export function offsetRun(waypoints: RoutePoint[], run: Run, offset: number): RoutePoint[] {
  if (offset === 0) return waypoints.map((p) => ({ ...p }));
  const out = waypoints.map((p) => ({ ...p }));
  if (run.axis === 'h') {
    out[run.i].y += offset;
    out[run.j].y += offset;
  } else {
    out[run.i].x += offset;
    out[run.j].x += offset;
  }
  return out;
}

/**
 * WS-3: shift the dominant interior run by `channelOffset`, reverting to the
 * base route if the shift would collide with an obstacle. No offset → base
 * route (byte-identical). Shared by the avoidant + orthogonal path builders.
 * Lives here (not in a router) so both routers import it without an
 * avoidant↔orthogonal import cycle; only the leaf constant `OBSTACLE_PADDING`
 * is pulled from `./edge-paths/orthogonal`.
 */
export function applyChannelOffset(
  waypoints: RoutePoint[],
  channelOffset: number | undefined,
  obstacles: Rect[] | undefined,
): RoutePoint[] {
  if (!channelOffset) return waypoints;
  const run = dominantRun(waypoints);
  if (!run) return waypoints;
  const shifted = offsetRun(waypoints, run, channelOffset);
  if (obstacles && routeHitsObstacles(shifted, obstacles, OBSTACLE_PADDING)) return waypoints;
  return shifted;
}

/** Axis-aligned test: does any segment of `waypoints` pass through a padded rect interior? */
export function routeHitsObstacles(waypoints: RoutePoint[], obstacles: Rect[], padding: number): boolean {
  for (let s = 0; s < waypoints.length - 1; s++) {
    const a = waypoints[s], b = waypoints[s + 1];
    const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
    for (const r of obstacles) {
      const rx1 = r.x - padding, ry1 = r.y - padding;
      const rx2 = r.x + r.width + padding, ry2 = r.y + r.height + padding;
      // segment bbox overlaps padded rect interior (strict, so touching a face is allowed)
      if (minX < rx2 && maxX > rx1 && minY < ry2 && maxY > ry1) return true;
    }
  }
  return false;
}
