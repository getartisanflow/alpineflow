import { describe, it, expect } from 'vitest';
import { getOrthogonalPath, OBSTACLE_PADDING, findRoute, type RoutePoint } from './orthogonal';

interface TestRect { x: number; y: number; width: number; height: number }

/** Manhattan length of a polyline — routing cost is invariant to waypoint ties. */
function manhattanLength(points: RoutePoint[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.abs(points[i].x - points[i - 1].x) + Math.abs(points[i].y - points[i - 1].y);
  }
  return len;
}

/** True if the axis-aligned segment a→b passes through any obstacle interior. */
function segmentHitsObstacle(a: RoutePoint, b: RoutePoint, obstacles: TestRect[]): boolean {
  const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
  for (const r of obstacles) {
    if (maxX > r.x && minX < r.x + r.width && maxY > r.y && minY < r.y + r.height) return true;
  }
  return false;
}

function routeHitsAny(route: RoutePoint[], obstacles: TestRect[]): boolean {
  for (let i = 1; i < route.length; i++) {
    if (segmentHitsObstacle(route[i - 1], route[i], obstacles)) return true;
  }
  return false;
}

// ── getOrthogonalPath ────────────────────────────────────────────────────────

describe('getOrthogonalPath', () => {
  it('falls back to smoothstep-like path when no obstacles', () => {
    const result = getOrthogonalPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: 'bottom',
      targetX: 200,
      targetY: 200,
      targetPosition: 'top',
    });

    expect(result.path).toMatch(/^M0,0/);
    expect(result.labelPosition).toBeDefined();
    expect(result.labelPosition.x).toBeGreaterThanOrEqual(0);
    expect(result.labelPosition.y).toBeGreaterThanOrEqual(0);
  });

  it('returns label at a reasonable midpoint when no obstacles', () => {
    const result = getOrthogonalPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 200,
    });

    expect(result.labelPosition.x).toBeCloseTo(100, 0);
    expect(result.labelPosition.y).toBeCloseTo(100, 0);
  });

  it('routes around a single obstacle', () => {
    const result = getOrthogonalPath({
      sourceX: 0,
      sourceY: 100,
      sourcePosition: 'right',
      targetX: 400,
      targetY: 100,
      targetPosition: 'left',
      obstacles: [{ x: 150, y: 50, width: 100, height: 100 }],
      borderRadius: 5,
    });

    // Path starts at source
    expect(result.path).toMatch(/^M0,100/);
    // Path ends at target
    expect(result.path).toContain('400,100');
    // Should have direction changes (L commands for bends)
    expect(result.path).toContain('L');
    // With borderRadius > 0 and bends, should have Q commands
    expect(result.path).toContain('Q');
  });

  it('does not produce Q commands when borderRadius is 0', () => {
    const result = getOrthogonalPath({
      sourceX: 0,
      sourceY: 100,
      sourcePosition: 'right',
      targetX: 400,
      targetY: 100,
      targetPosition: 'left',
      obstacles: [{ x: 150, y: 50, width: 100, height: 100 }],
      borderRadius: 0,
    });

    expect(result.path).not.toContain('Q');
    expect(result.path).toContain('L');
  });

  it('routes around multiple obstacles', () => {
    const result = getOrthogonalPath({
      sourceX: 0,
      sourceY: 100,
      sourcePosition: 'right',
      targetX: 600,
      targetY: 100,
      targetPosition: 'left',
      obstacles: [
        { x: 120, y: 50, width: 80, height: 100 },
        { x: 350, y: 50, width: 80, height: 100 },
      ],
      borderRadius: 0,
    });

    // Path starts at source and ends at target
    expect(result.path).toMatch(/^M0,100/);
    expect(result.path).toContain('600,100');
    // Should have multiple direction changes
    const lCount = (result.path.match(/L/g) ?? []).length;
    expect(lCount).toBeGreaterThanOrEqual(2);
  });

  it('falls back to smoothstep when route is impossible', () => {
    // Source and target are both inside the same obstacle
    const result = getOrthogonalPath({
      sourceX: 50,
      sourceY: 50,
      sourcePosition: 'right',
      targetX: 150,
      targetY: 150,
      targetPosition: 'left',
      obstacles: [{ x: -OBSTACLE_PADDING - 1, y: -OBSTACLE_PADDING - 1, width: 300, height: 300 }],
    });

    // Should still return a valid path (smoothstep fallback)
    expect(result.path).toMatch(/^M/);
    expect(result.labelPosition).toBeDefined();
  });

  it('returns all required EdgePathResult properties', () => {
    const result = getOrthogonalPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 200,
      obstacles: [{ x: 80, y: 80, width: 40, height: 40 }],
    });

    expect(result).toHaveProperty('path');
    expect(result).toHaveProperty('labelPosition');
    expect(result).toHaveProperty('labelOffsetX');
    expect(result).toHaveProperty('labelOffsetY');
    expect(typeof result.path).toBe('string');
    expect(typeof result.labelPosition.x).toBe('number');
    expect(typeof result.labelPosition.y).toBe('number');
    expect(typeof result.labelOffsetX).toBe('number');
    expect(typeof result.labelOffsetY).toBe('number');
  });

  it('exports OBSTACLE_PADDING constant', () => {
    expect(OBSTACLE_PADDING).toBe(20);
  });
});

// ── findRoute: heap + scanline-adjacency Dijkstra (Task 24) ──────────────────

describe('findRoute (heap + scanline adjacency)', () => {
  // 8×6 grid of 48 obstacles — thousands of visibility-graph points.
  const denseObstacles: TestRect[] = Array.from({ length: 48 }, (_, i) => ({
    x: (i % 8) * 150,
    y: Math.floor(i / 8) * 120,
    width: 100,
    height: 80,
  }));

  // Recorded from the pre-refactor (linear-PQ + all-pairs) implementation.
  // Shortest-path COST is invariant; only tie-broken waypoints may differ.
  const KNOWN_LENGTH = 2100;

  it('finds a route of equal length on a dense obstacle field', () => {
    const route = findRoute(-50, -50, 'right', 1250, 750, 'left', denseObstacles);
    expect(route).not.toBeNull();
    expect(manhattanLength(route!)).toBe(KNOWN_LENGTH);
  });

  it('every segment of the dense route clears every obstacle', () => {
    const route = findRoute(-50, -50, 'right', 1250, 750, 'left', denseObstacles);
    expect(route).not.toBeNull();
    expect(routeHitsAny(route!, denseObstacles)).toBe(false);
  });

  it('routes around a single obstacle with the expected cost', () => {
    const route = findRoute(0, 30, 'right', 300, 30, 'left', [{ x: 100, y: 0, width: 80, height: 60 }]);
    expect(route).not.toBeNull();
    expect(manhattanLength(route!)).toBe(400);
    expect(routeHitsAny(route!, [{ x: 100, y: 0, width: 80, height: 60 }])).toBe(false);
  });

  it('returns null when the target is fully enclosed', () => {
    // Target boxed in by a ring the router cannot escape.
    const route = findRoute(
      -50, -50, 'right', 150, 150, 'left',
      [{ x: -OBSTACLE_PADDING - 1, y: -OBSTACLE_PADDING - 1, width: 400, height: 400 }],
    );
    expect(route).toBeNull();
  });
});
