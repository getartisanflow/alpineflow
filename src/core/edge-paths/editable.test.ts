import { describe, it, expect } from 'vitest';
import { getEditablePath } from './editable';

const base = {
  sourceX: 0, sourceY: 0,
  targetX: 200, targetY: 200,
  sourcePosition: 'right' as const,
  targetPosition: 'left' as const,
};

describe('getEditablePath', () => {
  // ── No control points ──────────────────────────────────────────
  it('returns valid path with no control points (linear)', () => {
    const { path } = getEditablePath({ ...base, pathStyle: 'linear' });
    expect(path).toMatch(/^M0,0 L200,200$/);
  });

  it('returns valid path with no control points (bezier)', () => {
    const { path } = getEditablePath({ ...base, pathStyle: 'bezier' });
    expect(path).toMatch(/^M0,0 L200,200$/); // 2 points degrades to line
  });

  // ── Linear ─────────────────────────────────────────────────────
  it('linear: creates polyline through control points', () => {
    const { path } = getEditablePath({
      ...base,
      pathStyle: 'linear',
      controlPoints: [{ x: 100, y: 0 }, { x: 100, y: 200 }],
    });
    expect(path).toBe('M0,0 L100,0 L100,200 L200,200');
  });

  // ── Step ───────────────────────────────────────────────────────
  it('step: produces path with L and Q commands', () => {
    const { path } = getEditablePath({
      ...base,
      pathStyle: 'step',
      controlPoints: [{ x: 100, y: 50 }],
    });
    expect(path).toContain('M0,0');
    expect(path).toContain('200,200');
    // Should have L and/or Q commands for bends
    expect(path).toMatch(/[LQ]/);
  });

  // ── Catmull-Rom ────────────────────────────────────────────────
  it('catmull-rom: produces cubic bezier commands for 3+ waypoints', () => {
    const { path } = getEditablePath({
      ...base,
      pathStyle: 'catmull-rom',
      controlPoints: [{ x: 50, y: 100 }, { x: 150, y: 100 }],
    });
    expect(path).toContain('M0,0');
    expect(path).toContain('C'); // cubic bezier commands
  });

  // ── Bezier (default) ──────────────────────────────────────────
  it('bezier: is the default pathStyle', () => {
    const { path } = getEditablePath({
      ...base,
      controlPoints: [{ x: 50, y: 100 }, { x: 150, y: 100 }],
    });
    expect(path).toContain('C'); // uses catmull-rom interpolation
  });

  // ── Many control points ───────────────────────────────────────
  it('handles 5+ control points', () => {
    const points = Array.from({ length: 6 }, (_, i) => ({
      x: 20 + i * 30, y: 50 + (i % 2) * 100,
    }));
    const { path } = getEditablePath({
      ...base, pathStyle: 'linear', controlPoints: points,
    });
    // 2 endpoints + 6 control = 8 points, 7 L commands
    expect(path.match(/L/g)?.length).toBe(7);
  });

  // ── Single control point ──────────────────────────────────────
  it('works with a single control point (linear)', () => {
    const { path } = getEditablePath({
      ...base, pathStyle: 'linear',
      controlPoints: [{ x: 100, y: 100 }],
    });
    expect(path).toBe('M0,0 L100,100 L200,200');
  });

  it('works with a single control point (catmull-rom)', () => {
    const { path } = getEditablePath({
      ...base, pathStyle: 'catmull-rom',
      controlPoints: [{ x: 100, y: 100 }],
    });
    expect(path).toContain('M0,0');
    expect(path).toContain('C'); // 3 points = curve segments
  });

  // ── Label position ────────────────────────────────────────────
  it('returns label position at polyline midpoint', () => {
    const { labelPosition } = getEditablePath({
      ...base, pathStyle: 'linear',
      controlPoints: [],
    });
    // Midpoint of straight line (0,0)→(200,200) = (100,100)
    expect(labelPosition.x).toBeCloseTo(100);
    expect(labelPosition.y).toBeCloseTo(100);
  });

  it('returns label position accounting for control points', () => {
    const { labelPosition } = getEditablePath({
      ...base, pathStyle: 'linear',
      controlPoints: [{ x: 200, y: 0 }],
    });
    // Path: (0,0)→(200,0)→(200,200). Total len = 200+200=400.
    // Midpoint at 200 along path = (200, 0) — the control point itself
    expect(labelPosition.x).toBeCloseTo(200);
    expect(labelPosition.y).toBeCloseTo(0);
  });
});
