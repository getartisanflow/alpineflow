import { describe, it, expect } from 'vitest';
import { getAvoidantPath } from './avoidant';

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
