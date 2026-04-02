import { describe, it, expect } from 'vitest';
import { builtinShapes, rectPerimeter } from './shapes';

const W = 150;
const H = 80;

describe('rectPerimeter', () => {
  it('returns cardinal midpoints', () => {
    expect(rectPerimeter(W, H, 'top')).toEqual({ x: 75, y: 0 });
    expect(rectPerimeter(W, H, 'right')).toEqual({ x: 150, y: 40 });
    expect(rectPerimeter(W, H, 'bottom')).toEqual({ x: 75, y: 80 });
    expect(rectPerimeter(W, H, 'left')).toEqual({ x: 0, y: 40 });
  });

  it('returns corners', () => {
    expect(rectPerimeter(W, H, 'top-left')).toEqual({ x: 0, y: 0 });
    expect(rectPerimeter(W, H, 'bottom-right')).toEqual({ x: 150, y: 80 });
  });
});

describe('circle perimeterPoint', () => {
  const pp = builtinShapes.circle.perimeterPoint;

  it('cardinal points are on the ellipse boundary', () => {
    expect(pp(W, H, 'top')).toEqual({ x: 75, y: 0 });
    expect(pp(W, H, 'right')).toEqual({ x: 150, y: 40 });
    expect(pp(W, H, 'bottom')).toEqual({ x: 75, y: 80 });
    expect(pp(W, H, 'left')).toEqual({ x: 0, y: 40 });
  });

  it('corner points are on the ellipse (not the bounding box corner)', () => {
    const tr = pp(W, H, 'top-right');
    expect(tr.x).toBeLessThan(150);
    expect(tr.y).toBeGreaterThan(0);
    const cx = 75, cy = 40, rx = 75, ry = 40;
    const dist = ((tr.x - cx) / rx) ** 2 + ((tr.y - cy) / ry) ** 2;
    expect(dist).toBeCloseTo(1, 5);
  });
});

describe('diamond perimeterPoint', () => {
  const pp = builtinShapes.diamond.perimeterPoint;

  it('cardinal points are diamond vertices', () => {
    expect(pp(W, H, 'top')).toEqual({ x: 75, y: 0 });
    expect(pp(W, H, 'right')).toEqual({ x: 150, y: 40 });
    expect(pp(W, H, 'bottom')).toEqual({ x: 75, y: 80 });
    expect(pp(W, H, 'left')).toEqual({ x: 0, y: 40 });
  });

  it('corner points are midpoints of diamond edges', () => {
    const tr = pp(W, H, 'top-right');
    expect(tr.x).toEqual(W * 0.75);
    expect(tr.y).toEqual(H * 0.25);
  });
});

describe('hexagon perimeterPoint', () => {
  const pp = builtinShapes.hexagon.perimeterPoint;

  it('cardinal points', () => {
    expect(pp(W, H, 'top')).toEqual({ x: 75, y: 0 });
    expect(pp(W, H, 'right')).toEqual({ x: 150, y: 40 });
  });

  it('top corners map to hexagon vertices', () => {
    expect(pp(W, H, 'top-right')).toEqual({ x: W * 0.75, y: 0 });
    expect(pp(W, H, 'top-left')).toEqual({ x: W * 0.25, y: 0 });
  });
});

describe('parallelogram perimeterPoint', () => {
  const pp = builtinShapes.parallelogram.perimeterPoint;

  it('corner points account for skew', () => {
    const tl = pp(W, H, 'top-left');
    expect(tl.x).toBeCloseTo(W * 0.15);
    expect(tl.y).toBe(0);

    const br = pp(W, H, 'bottom-right');
    expect(br.x).toBeCloseTo(W * 0.85);
    expect(br.y).toBe(H);
  });
});

describe('triangle perimeterPoint', () => {
  const pp = builtinShapes.triangle.perimeterPoint;

  it('top is apex', () => {
    expect(pp(W, H, 'top')).toEqual({ x: 75, y: 0 });
  });

  it('bottom corners are base vertices', () => {
    expect(pp(W, H, 'bottom-left')).toEqual({ x: 0, y: H });
    expect(pp(W, H, 'bottom-right')).toEqual({ x: W, y: H });
  });
});

describe('cylinder perimeterPoint', () => {
  const pp = builtinShapes.cylinder.perimeterPoint;

  it('top is offset by cap height', () => {
    const top = pp(W, H, 'top');
    expect(top.x).toBe(75);
    expect(top.y).toBeGreaterThan(0);
    expect(top.y).toBeCloseTo(H * 0.12);
  });

  it('left and right are at vertical center', () => {
    expect(pp(W, H, 'left')).toEqual({ x: 0, y: 40 });
    expect(pp(W, H, 'right')).toEqual({ x: 150, y: 40 });
  });
});

describe('stadium perimeterPoint', () => {
  const pp = builtinShapes.stadium.perimeterPoint;

  it('cardinal points are at boundary', () => {
    expect(pp(W, H, 'top')).toEqual({ x: 75, y: 0 });
    expect(pp(W, H, 'right')).toEqual({ x: 150, y: 40 });
  });

  it('corner points are on semicircular caps', () => {
    const tr = pp(W, H, 'top-right');
    expect(tr.x).toBeLessThan(W);
    expect(tr.y).toBeGreaterThan(0);
  });
});

describe('all shapes handle all 8 positions', () => {
  const positions = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

  for (const [name, def] of Object.entries(builtinShapes)) {
    it(`${name} returns valid coordinates for all positions`, () => {
      for (const pos of positions) {
        const pt = def.perimeterPoint(W, H, pos);
        expect(pt.x).toBeGreaterThanOrEqual(-1);
        expect(pt.x).toBeLessThanOrEqual(W + 1);
        expect(pt.y).toBeGreaterThanOrEqual(-1);
        expect(pt.y).toBeLessThanOrEqual(H + 1);
      }
    });
  }
});
