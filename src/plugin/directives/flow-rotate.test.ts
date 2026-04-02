import { describe, it, expect } from 'vitest';
import { computeRotationAngle, snapAngle } from './flow-rotate';

describe('computeRotationAngle', () => {
  it('returns 0 for pointer directly above center', () => {
    // Pointer at (50, 0), center at (50, 50) → straight up → 0°
    const angle = computeRotationAngle(50, 0, 50, 50);
    expect(angle).toBeCloseTo(0);
  });

  it('returns 90 for pointer directly right of center', () => {
    const angle = computeRotationAngle(100, 50, 50, 50);
    expect(angle).toBeCloseTo(90);
  });

  it('returns 180 for pointer directly below center', () => {
    const angle = computeRotationAngle(50, 100, 50, 50);
    expect(angle).toBeCloseTo(180);
  });

  it('returns 270 for pointer directly left of center', () => {
    const angle = computeRotationAngle(0, 50, 50, 50);
    expect(angle).toBeCloseTo(270);
  });
});

describe('snapAngle', () => {
  it('snaps to nearest 15 degree increment by default', () => {
    expect(snapAngle(7, 15)).toBe(0);
    expect(snapAngle(8, 15)).toBe(15);
    expect(snapAngle(22, 15)).toBe(15);
    expect(snapAngle(23, 15)).toBe(30);
  });

  it('snaps to custom increment', () => {
    expect(snapAngle(20, 45)).toBe(0);
    expect(snapAngle(23, 45)).toBe(45);
    expect(snapAngle(44, 45)).toBe(45);
  });

  it('wraps around 360', () => {
    expect(snapAngle(355, 15)).toBe(0);
  });
});
