import { describe, it, expect } from 'vitest';
import { resolveSpreadSpacing, laneOffset, applyLaneOffset, DEFAULT_SPREAD_SPACING } from './endpoint-spread';

describe('resolveSpreadSpacing', () => {
  it('returns null when disabled', () => {
    expect(resolveSpreadSpacing(false)).toBeNull();
    expect(resolveSpreadSpacing(undefined)).toBeNull();
  });
  it('returns the default for true', () => {
    expect(resolveSpreadSpacing(true)).toBe(DEFAULT_SPREAD_SPACING);
  });
  it('returns the object spacing, defaulting when absent', () => {
    expect(resolveSpreadSpacing({ spacing: 9 })).toBe(9);
    expect(resolveSpreadSpacing({})).toBe(DEFAULT_SPREAD_SPACING);
  });
});

describe('laneOffset', () => {
  it('is 0 for a single edge (unchanged centre)', () => {
    expect(laneOffset(0, 1, 24, 5)).toBe(0);
  });
  it('is symmetric about the centre for two edges', () => {
    expect(laneOffset(0, 2, 24, 6)).toBeCloseTo(-3);
    expect(laneOffset(1, 2, 24, 6)).toBeCloseTo(3);
  });
  it('uses the requested spacing when the fan fits the extent', () => {
    // 3 edges, spacing 5 → span 10 ≤ extent 24 → offsets -5, 0, 5
    expect(laneOffset(0, 3, 24, 5)).toBeCloseTo(-5);
    expect(laneOffset(1, 3, 24, 5)).toBeCloseTo(0);
    expect(laneOffset(2, 3, 24, 5)).toBeCloseTo(5);
  });
  it('condenses so the fan never exceeds the extent (high fan-in)', () => {
    // 10 edges, spacing 5 → desired span 45 > extent 18 → clamp to 18
    const first = laneOffset(0, 10, 18, 5);
    const last = laneOffset(9, 10, 18, 5);
    expect(last - first).toBeCloseTo(18);      // total span == extent, not 45
    expect(Math.abs(first)).toBeCloseTo(9);     // centred
  });
});

describe('applyLaneOffset', () => {
  it('fans left/right handles vertically', () => {
    expect(applyLaneOffset({ x: 100, y: 50 }, 'left', 7)).toEqual({ x: 100, y: 57 });
    expect(applyLaneOffset({ x: 100, y: 50 }, 'right', -7)).toEqual({ x: 100, y: 43 });
  });
  it('fans top/bottom handles horizontally', () => {
    expect(applyLaneOffset({ x: 100, y: 50 }, 'top', 7)).toEqual({ x: 107, y: 50 });
    expect(applyLaneOffset({ x: 100, y: 50 }, 'bottom', -7)).toEqual({ x: 93, y: 50 });
  });
});
