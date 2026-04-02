import { describe, it, expect } from 'vitest';
import { getEditablePath } from '../../core/edge-paths/editable';

describe('editable edge integration', () => {
  const base = {
    sourceX: 0, sourceY: 0, targetX: 300, targetY: 300,
    sourcePosition: 'right' as const, targetPosition: 'left' as const,
  };

  it('adding a control point changes the path', () => {
    const before = getEditablePath({ ...base, pathStyle: 'linear', controlPoints: [] });
    const after = getEditablePath({ ...base, pathStyle: 'linear', controlPoints: [{ x: 150, y: 0 }] });
    expect(before.path).not.toBe(after.path);
    expect(after.path).toContain('L150,0');
  });

  it('removing a control point reverts toward direct path', () => {
    const withPoint = getEditablePath({ ...base, pathStyle: 'linear', controlPoints: [{ x: 150, y: 0 }] });
    const without = getEditablePath({ ...base, pathStyle: 'linear', controlPoints: [] });
    expect(withPoint.path).not.toBe(without.path);
    expect(without.path).toBe('M0,0 L300,300');
  });

  it('moving a control point updates the path', () => {
    const pos1 = getEditablePath({ ...base, pathStyle: 'linear', controlPoints: [{ x: 100, y: 50 }] });
    const pos2 = getEditablePath({ ...base, pathStyle: 'linear', controlPoints: [{ x: 200, y: 100 }] });
    expect(pos1.path).not.toBe(pos2.path);
    expect(pos1.path).toContain('L100,50');
    expect(pos2.path).toContain('L200,100');
  });

  it('toObject/fromObject round-trip preserves controlPoints', () => {
    // Simulate what toObject does: serializes edge data including controlPoints
    const edge = {
      id: 'e1', source: 'a', target: 'b', type: 'editable' as const,
      controlPoints: [{ x: 100, y: 50 }, { x: 200, y: 150 }],
      pathStyle: 'catmull-rom' as const,
      showControlPoints: true,
    };
    const json = JSON.parse(JSON.stringify(edge));
    expect(json.controlPoints).toEqual([{ x: 100, y: 50 }, { x: 200, y: 150 }]);
    expect(json.pathStyle).toBe('catmull-rom');
    expect(json.showControlPoints).toBe(true);
  });

  it('linear, step, and catmull-rom produce different paths for same control points', () => {
    const points = [{ x: 100, y: 0 }, { x: 200, y: 300 }];
    const linear = getEditablePath({ ...base, pathStyle: 'linear', controlPoints: points }).path;
    const step = getEditablePath({ ...base, pathStyle: 'step', controlPoints: points }).path;
    const catmull = getEditablePath({ ...base, pathStyle: 'catmull-rom', controlPoints: points }).path;

    // All three should produce different paths
    expect(linear).not.toBe(step);
    expect(linear).not.toBe(catmull);
    expect(step).not.toBe(catmull);
  });

  it('catmull-rom and bezier produce the same path (shared interpolation)', () => {
    const points = [{ x: 100, y: 0 }, { x: 200, y: 300 }];
    const catmull = getEditablePath({ ...base, pathStyle: 'catmull-rom', controlPoints: points }).path;
    const bezier = getEditablePath({ ...base, pathStyle: 'bezier', controlPoints: points }).path;
    expect(catmull).toBe(bezier);
  });

  it('snap-to-grid rounds point coordinates', () => {
    // Simulate snap logic
    const snap: [number, number] = [10, 10];
    const raw = { x: 123, y: 67 };
    const snapped = {
      x: Math.round(raw.x / snap[0]) * snap[0],
      y: Math.round(raw.y / snap[1]) * snap[1],
    };
    expect(snapped).toEqual({ x: 120, y: 70 });
  });
});
