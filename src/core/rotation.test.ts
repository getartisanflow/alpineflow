import { describe, it, expect } from 'vitest';
import { rotatePoint } from './rotation';

describe('rotatePoint', () => {
  it('returns same point for 0 rotation', () => {
    const result = rotatePoint(10, 20, 5, 10, 0);
    expect(result.x).toBeCloseTo(10);
    expect(result.y).toBeCloseTo(20);
  });

  it('rotates point 90 degrees around center', () => {
    // Point (10, 0) around center (5, 5): offset (5, -5) → rotated (5, 5) → result (10, 10)
    const result = rotatePoint(10, 0, 5, 5, 90);
    expect(result.x).toBeCloseTo(10);
    expect(result.y).toBeCloseTo(10);
  });

  it('rotates point 180 degrees around center', () => {
    // Point (10, 0) around center (5, 5) → result (0, 10)
    const result = rotatePoint(10, 0, 5, 5, 180);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(10);
  });

  it('rotates point 45 degrees', () => {
    // Point (10, 5) around center (5, 5): offset (5, 0) → rotated
    const result = rotatePoint(10, 5, 5, 5, 45);
    const r = 5;
    expect(result.x).toBeCloseTo(5 + r * Math.cos(Math.PI / 4));
    expect(result.y).toBeCloseTo(5 + r * Math.sin(Math.PI / 4));
  });
});
