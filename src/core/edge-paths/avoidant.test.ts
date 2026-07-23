import { describe, it, expect } from 'vitest';
import { getAvoidantPath, buildRoundedPath } from './avoidant';
import type { RoutePoint } from './orthogonal';

/** Every coordinate pair in a path `d` string (endpoints + bezier control points). */
function pathCoords(d: string): Array<{ x: number; y: number }> {
  return [...d.matchAll(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g)].map((m) => ({ x: +m[1], y: +m[2] }));
}

describe('getAvoidantPath', () => {
  it('falls back to bezier-like path when no obstacles', () => {
    const result = getAvoidantPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: 'bottom',
      targetX: 200,
      targetY: 200,
      targetPosition: 'top',
    });

    // Bezier fallback produces a cubic bezier (C command)
    expect(result.path).toMatch(/^M0,0 C/);
    expect(result.path).toContain('200,200');
  });

  it('returns label at a reasonable midpoint when no obstacles', () => {
    const result = getAvoidantPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 200,
    });

    expect(result.labelPosition.x).toBeCloseTo(100, 0);
    expect(result.labelPosition.y).toBeCloseTo(100, 0);
  });

  it('routes around a single obstacle with smooth curves', () => {
    const result = getAvoidantPath({
      sourceX: 0,
      sourceY: 100,
      sourcePosition: 'right',
      targetX: 400,
      targetY: 100,
      targetPosition: 'left',
      obstacles: [{ x: 150, y: 50, width: 100, height: 100 }],
    });

    // Path starts at source
    expect(result.path).toMatch(/^M0,100/);
    // Path ends at target
    expect(result.path).toContain('400,100');
    // Should use cubic bezier commands (C), not line segments (L)
    expect(result.path).toContain('C');
  });

  it('produces smooth curves not sharp bends', () => {
    const result = getAvoidantPath({
      sourceX: 0,
      sourceY: 100,
      sourcePosition: 'right',
      targetX: 400,
      targetY: 100,
      targetPosition: 'left',
      obstacles: [{ x: 150, y: 50, width: 100, height: 100 }],
    });

    // Should NOT contain Q (quadratic, used by orthogonal bends)
    expect(result.path).not.toContain('Q');
    // Should contain C (cubic bezier, Catmull-Rom)
    expect(result.path).toContain('C');
  });

  it('routes around multiple obstacles', () => {
    const result = getAvoidantPath({
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
    });

    expect(result.path).toMatch(/^M0,100/);
    expect(result.path).toContain('600,100');
    // Multiple bezier segments
    const cCount = (result.path.match(/C/g) ?? []).length;
    expect(cCount).toBeGreaterThanOrEqual(2);
  });

  it('falls back to bezier when route is impossible', () => {
    const result = getAvoidantPath({
      sourceX: 50,
      sourceY: 50,
      sourcePosition: 'right',
      targetX: 150,
      targetY: 150,
      targetPosition: 'left',
      obstacles: [{ x: -22, y: -22, width: 300, height: 300 }],
    });

    // Should still return a valid path (bezier fallback)
    expect(result.path).toMatch(/^M/);
    expect(result.path).toContain('C');
  });

  it('rounded smoothing hugs the route and does not overshoot the corner', () => {
    // Short handle stub (0→21) then a sharp 90° turn — the case where a
    // Catmull-Rom spline (uniform OR centripetal) bulges well past the corner.
    // The rounded fillet lives inside the corner, so no coordinate (endpoint or
    // control point) crosses above the corner's y (20).
    const pts: RoutePoint[] = [
      { x: 0, y: 100, index: 0 },
      { x: 21, y: 100, index: 1 },
      { x: 21, y: 20, index: 2 },
      { x: 200, y: 20, index: 3 },
    ];
    const coords = pathCoords(buildRoundedPath(pts));
    // Waypoint min-y is 20; the rounded curve never rises above it.
    expect(Math.min(...coords.map((c) => c.y))).toBeGreaterThanOrEqual(20);
  });

  it('rounds corners with cubic beziers and no sharp quadratic bends', () => {
    const pts: RoutePoint[] = [
      { x: 0, y: 0, index: 0 },
      { x: 100, y: 0, index: 1 },
      { x: 100, y: 100, index: 2 },
    ];
    const d = buildRoundedPath(pts);
    expect(d).toContain('C'); // smooth cubic fillet
    expect(d).not.toContain('Q'); // stays distinct from orthogonal's tight bends
  });

  it('returns all required EdgePathResult properties', () => {
    const result = getAvoidantPath({
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
});

describe('getAvoidantPath channelOffset (WS-3)', () => {
  // Obstacle straddles the straight source→target line at y=100, forcing a routed
  // corridor. Verified via findRoute: the route is
  //   [0,100] [100,100] [100,50] [200,50] [200,100] [300,100]
  // so the dominant INTERIOR run is the horizontal run at y=50, ABOVE the obstacle.
  // → a negative offset shifts the run further up (clears, path changes);
  //   a positive offset drives it down into the padded obstacle (revert to base).
  const obstacles = [{ x: 120, y: 70, width: 60, height: 60 }];
  const base = { sourceX: 0, sourceY: 100, sourcePosition: 'right' as const, targetX: 300, targetY: 100, targetPosition: 'left' as const, obstacles };

  it('offset 0 / undefined is byte-identical to no offset', () => {
    const a = getAvoidantPath({ ...base }).path;
    const b = getAvoidantPath({ ...base, channelOffset: 0 }).path;
    expect(b).toBe(a);
  });

  it('a nonzero offset changes the path (shifts the interior run)', () => {
    const a = getAvoidantPath({ ...base }).path;
    const c = getAvoidantPath({ ...base, channelOffset: -14 }).path;
    expect(c).not.toBe(a);
  });

  it('reverts to base when the shift would hit an obstacle (no collision)', () => {
    // +50 drives the interior run down into the padded obstacle → revert to base path.
    const a = getAvoidantPath({ ...base }).path;
    const big = getAvoidantPath({ ...base, channelOffset: 50 }).path;
    expect(big).toBe(a);
  });
});

describe('getAvoidantPath buried-endpoint obstacles', () => {
  it('routes around remaining obstacles when a third-party node covers the target handle', () => {
    // Mirrors the schema-scramble bug: a node landed on the target handle.
    // The edge must still get a routed (L-run) path around the mid obstacle,
    // not the straight bezier fallback.
    const result = getAvoidantPath({
      sourceX: 0,
      sourceY: 30,
      sourcePosition: 'right',
      targetX: 300,
      targetY: 30,
      targetPosition: 'left',
      obstacles: [
        { x: 100, y: 0, width: 80, height: 60 },   // legit mid obstacle
        { x: 290, y: 10, width: 60, height: 40 },  // covers the target handle
      ],
    });

    const lCount = (result.path.match(/L/g) ?? []).length;
    expect(lCount).toBeGreaterThanOrEqual(1);
  });
});
