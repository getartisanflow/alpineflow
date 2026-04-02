import { describe, it, expect } from 'vitest';
import { svgPathToFunction, orbit, wave, along, pendulum, drift, stagger } from './paths';
import type { PathFunction } from './paths';

describe('PathFunction type', () => {
  it('accepts a function returning {x, y}', () => {
    const fn: PathFunction = (t) => ({ x: t * 100, y: t * 200 });
    expect(fn(0)).toEqual({ x: 0, y: 0 });
    expect(fn(1)).toEqual({ x: 100, y: 200 });
    expect(fn(0.5)).toEqual({ x: 50, y: 100 });
  });
});

describe('svgPathToFunction', () => {
  it('returns null when SVG APIs are unavailable', () => {
    const result = svgPathToFunction('M 0 0 L 100 100');
    expect(result).toBeNull();
  });
});

describe('orbit', () => {
  it('returns a PathFunction', () => {
    const fn = orbit({ cx: 0, cy: 0, radius: 100 });
    expect(typeof fn).toBe('function');
    const pt = fn(0);
    expect(pt).toHaveProperty('x');
    expect(pt).toHaveProperty('y');
  });

  it('places node at (cx + radius, cy) at t=0', () => {
    const fn = orbit({ cx: 50, cy: 50, radius: 100 });
    const pt = fn(0);
    expect(pt.x).toBeCloseTo(150);
    expect(pt.y).toBeCloseTo(50);
  });

  it('completes full circle at t=1 (back to start)', () => {
    const fn = orbit({ cx: 0, cy: 0, radius: 100 });
    const start = fn(0);
    const end = fn(1);
    expect(end.x).toBeCloseTo(start.x);
    expect(end.y).toBeCloseTo(start.y);
  });

  it('at t=0.25 reaches (cx, cy + radius) for clockwise', () => {
    const fn = orbit({ cx: 0, cy: 0, radius: 100 });
    const pt = fn(0.25);
    expect(pt.x).toBeCloseTo(0, 5);
    expect(pt.y).toBeCloseTo(100, 5);
  });

  it('supports elliptical rx/ry', () => {
    const fn = orbit({ cx: 0, cy: 0, rx: 200, ry: 50 });
    const pt0 = fn(0);
    expect(pt0.x).toBeCloseTo(200);
    expect(pt0.y).toBeCloseTo(0);

    const pt25 = fn(0.25);
    expect(pt25.x).toBeCloseTo(0, 5);
    expect(pt25.y).toBeCloseTo(50, 5);
  });

  it('supports phase offset', () => {
    const fn = orbit({ cx: 0, cy: 0, radius: 100, offset: 0.25 });
    // offset=0.25 means starting 90deg into the cycle
    const pt = fn(0);
    expect(pt.x).toBeCloseTo(0, 5);
    expect(pt.y).toBeCloseTo(100, 5);
  });

  it('supports counter-clockwise', () => {
    const fn = orbit({ cx: 0, cy: 0, radius: 100, clockwise: false });
    const pt = fn(0.25);
    // counter-clockwise: at t=0.25, y should be negative
    expect(pt.x).toBeCloseTo(0, 5);
    expect(pt.y).toBeCloseTo(-100, 5);
  });
});

describe('wave', () => {
  it('starts at startX/startY at t=0', () => {
    const fn = wave({ startX: 10, startY: 20, endX: 110, endY: 20 });
    const pt = fn(0);
    expect(pt.x).toBeCloseTo(10);
    expect(pt.y).toBeCloseTo(20);
  });

  it('ends at endX/endY at t=1', () => {
    const fn = wave({ startX: 10, startY: 20, endX: 110, endY: 20 });
    const pt = fn(1);
    // sin(TAU * 1) = sin(2*PI) = 0, so wave displacement = 0
    expect(pt.x).toBeCloseTo(110);
    expect(pt.y).toBeCloseTo(20);
  });

  it('oscillates perpendicular to travel direction at t=0.25', () => {
    // Horizontal travel: perpendicular is vertical
    const fn = wave({ startX: 0, startY: 0, endX: 100, endY: 0, amplitude: 30, frequency: 1 });
    const pt = fn(0.25);
    // At t=0.25, sin(TAU * 0.25) = sin(PI/2) = 1
    // For horizontal travel (dx=100, dy=0), ux=1, uy=0, px=-uy=0, py=ux=1
    // So displacement is in y direction: py * amplitude * sin(...) = 1 * 30 * 1 = 30
    expect(pt.x).toBeCloseTo(25);
    expect(pt.y).toBeCloseTo(30);
  });

  it('supports custom frequency', () => {
    const fn = wave({ startX: 0, startY: 0, endX: 100, endY: 0, amplitude: 30, frequency: 2 });
    // At t=0.25 with frequency=2: sin(TAU * 2 * 0.25) = sin(PI) = 0
    const pt = fn(0.25);
    expect(pt.y).toBeCloseTo(0, 5);
  });

  it('works along diagonal axis', () => {
    const fn = wave({ startX: 0, startY: 0, endX: 100, endY: 100, amplitude: 30, frequency: 1 });
    const pt = fn(0);
    expect(pt.x).toBeCloseTo(0);
    expect(pt.y).toBeCloseTo(0);

    const ptEnd = fn(1);
    expect(ptEnd.x).toBeCloseTo(100);
    expect(ptEnd.y).toBeCloseTo(100);
  });
});

describe('along', () => {
  it('returns null when SVG APIs are unavailable', () => {
    const result = along('M 0 0 L 100 100');
    expect(result).toBeNull();
  });

  it('supports reverse option (returns null gracefully)', () => {
    const result = along('M 0 0 L 100 100', { reverse: true });
    expect(result).toBeNull();
  });

  it('supports startAt/endAt (returns null gracefully)', () => {
    const result = along('M 0 0 L 100 100', { startAt: 0.2, endAt: 0.8 });
    expect(result).toBeNull();
  });
});

describe('pendulum', () => {
  it('returns a PathFunction', () => {
    const fn = pendulum({ cx: 0, cy: 0, radius: 100 });
    expect(typeof fn).toBe('function');
    const pt = fn(0);
    expect(pt).toHaveProperty('x');
    expect(pt).toHaveProperty('y');
  });

  it('hangs at (cx, cy + radius) at t=0', () => {
    const fn = pendulum({ cx: 50, cy: 50, radius: 100 });
    const pt = fn(0);
    // sin(0)=0 so theta=0, x = cx + r*sin(0) = cx, y = cy + r*cos(0) = cy + r
    expect(pt.x).toBeCloseTo(50);
    expect(pt.y).toBeCloseTo(150);
  });

  it('swings to max angle at t=0.25', () => {
    const fn = pendulum({ cx: 0, cy: 0, radius: 100, angle: 60 });
    const pt = fn(0.25);
    // At t=0.25, sin(TAU * 0.25) = sin(PI/2) = 1
    // theta = maxRadians * 1 = 60deg in radians = PI/3
    const maxRad = (60 * Math.PI) / 180;
    expect(pt.x).toBeCloseTo(100 * Math.sin(maxRad));
    expect(pt.y).toBeCloseTo(100 * Math.cos(maxRad));
  });

  it('returns to center at t=0.5', () => {
    const fn = pendulum({ cx: 0, cy: 0, radius: 100, angle: 60 });
    const pt = fn(0.5);
    // At t=0.5, sin(TAU * 0.5) = sin(PI) = 0
    // theta = 0, back to hanging straight down
    expect(pt.x).toBeCloseTo(0, 5);
    expect(pt.y).toBeCloseTo(100, 5);
  });
});

describe('drift', () => {
  it('returns a PathFunction', () => {
    const fn = drift({ originX: 0, originY: 0 });
    expect(typeof fn).toBe('function');
    const pt = fn(0);
    expect(pt).toHaveProperty('x');
    expect(pt).toHaveProperty('y');
  });

  it('stays within range of origin', () => {
    const fn = drift({ originX: 50, originY: 50, range: 20 });
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const pt = fn(t);
      expect(pt.x).toBeGreaterThanOrEqual(50 - 20);
      expect(pt.x).toBeLessThanOrEqual(50 + 20);
      expect(pt.y).toBeGreaterThanOrEqual(50 - 20);
      expect(pt.y).toBeLessThanOrEqual(50 + 20);
    }
  });

  it('same seed produces same path', () => {
    const fn1 = drift({ originX: 0, originY: 0, seed: 42 });
    const fn2 = drift({ originX: 0, originY: 0, seed: 42 });
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      expect(fn1(t).x).toBe(fn2(t).x);
      expect(fn1(t).y).toBe(fn2(t).y);
    }
  });

  it('different seeds produce different paths', () => {
    const fn1 = drift({ originX: 0, originY: 0, seed: 1 });
    const fn2 = drift({ originX: 0, originY: 0, seed: 5 });
    let differs = false;
    for (let i = 1; i <= 10; i++) {
      const t = i / 10;
      if (fn1(t).x !== fn2(t).x || fn1(t).y !== fn2(t).y) {
        differs = true;
        break;
      }
    }
    expect(differs).toBe(true);
  });
});

describe('stagger', () => {
  it('returns a function', () => {
    const fn = stagger(0.25);
    expect(typeof fn).toBe('function');
  });

  it('distributes offsets evenly', () => {
    const fn = stagger(0.25);
    expect(fn(0, 4)).toBeCloseTo(0);
    expect(fn(1, 4)).toBeCloseTo(0.25);
    expect(fn(2, 4)).toBeCloseTo(0.5);
    expect(fn(3, 4)).toBeCloseTo(0.75);
  });

  it('supports custom start offset', () => {
    const fn = stagger(0.25, { from: 0.1 });
    expect(fn(0, 4)).toBeCloseTo(0.1);
    expect(fn(1, 4)).toBeCloseTo(0.35);
    expect(fn(2, 4)).toBeCloseTo(0.6);
    expect(fn(3, 4)).toBeCloseTo(0.85);
  });
});
