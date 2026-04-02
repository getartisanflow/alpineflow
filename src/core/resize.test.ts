import { describe, it, expect } from 'vitest';
import { computeResize, DEFAULT_RESIZE_CONSTRAINTS, type ResizeDirection } from './resize';

const startPos = { x: 100, y: 100 };
const startDims = { width: 200, height: 150 };
const constraints = DEFAULT_RESIZE_CONSTRAINTS;

describe('computeResize', () => {
  // ── Right handle ────────────────────────────────────────────────────────

  describe('right handle', () => {
    it('increases width on positive dx', () => {
      const r = computeResize('right', { x: 50, y: 0 }, startPos, startDims, constraints);
      expect(r.dimensions.width).toBe(250);
      expect(r.dimensions.height).toBe(150);
      expect(r.position).toEqual(startPos);
    });

    it('decreases width on negative dx', () => {
      const r = computeResize('right', { x: -50, y: 0 }, startPos, startDims, constraints);
      expect(r.dimensions.width).toBe(150);
    });
  });

  // ── Left handle ─────────────────────────────────────────────────────────

  describe('left handle', () => {
    it('increases width and shifts position left', () => {
      const r = computeResize('left', { x: -50, y: 0 }, startPos, startDims, constraints);
      expect(r.dimensions.width).toBe(250);
      expect(r.position.x).toBe(50); // 100 - 50
    });

    it('decreases width and shifts position right', () => {
      const r = computeResize('left', { x: 50, y: 0 }, startPos, startDims, constraints);
      expect(r.dimensions.width).toBe(150);
      expect(r.position.x).toBe(150); // 100 + 50
    });
  });

  // ── Bottom handle ───────────────────────────────────────────────────────

  describe('bottom handle', () => {
    it('increases height on positive dy', () => {
      const r = computeResize('bottom', { x: 0, y: 80 }, startPos, startDims, constraints);
      expect(r.dimensions.height).toBe(230);
      expect(r.position).toEqual(startPos);
    });
  });

  // ── Top handle ──────────────────────────────────────────────────────────

  describe('top handle', () => {
    it('increases height and shifts position up', () => {
      const r = computeResize('top', { x: 0, y: -60 }, startPos, startDims, constraints);
      expect(r.dimensions.height).toBe(210);
      expect(r.position.y).toBe(40); // 100 - 60
    });
  });

  // ── Corner handles ──────────────────────────────────────────────────────

  describe('corner handles', () => {
    it('top-left: grows both dimensions and shifts position', () => {
      const r = computeResize('top-left', { x: -30, y: -20 }, startPos, startDims, constraints);
      expect(r.dimensions).toEqual({ width: 230, height: 170 });
      expect(r.position).toEqual({ x: 70, y: 80 });
    });

    it('top-right: grows width right, height up', () => {
      const r = computeResize('top-right', { x: 30, y: -20 }, startPos, startDims, constraints);
      expect(r.dimensions).toEqual({ width: 230, height: 170 });
      expect(r.position).toEqual({ x: 100, y: 80 });
    });

    it('bottom-left: grows width left, height down', () => {
      const r = computeResize('bottom-left', { x: -30, y: 20 }, startPos, startDims, constraints);
      expect(r.dimensions).toEqual({ width: 230, height: 170 });
      expect(r.position).toEqual({ x: 70, y: 100 });
    });

    it('bottom-right: grows both dimensions, position unchanged', () => {
      const r = computeResize('bottom-right', { x: 30, y: 20 }, startPos, startDims, constraints);
      expect(r.dimensions).toEqual({ width: 230, height: 170 });
      expect(r.position).toEqual(startPos);
    });
  });

  // ── Constraints ─────────────────────────────────────────────────────────

  describe('constraints', () => {
    it('clamps to minWidth', () => {
      const r = computeResize('right', { x: -250, y: 0 }, startPos, startDims, constraints);
      expect(r.dimensions.width).toBe(30); // DEFAULT min
    });

    it('clamps to minHeight', () => {
      const r = computeResize('bottom', { x: 0, y: -250 }, startPos, startDims, constraints);
      expect(r.dimensions.height).toBe(30);
    });

    it('clamps to maxWidth', () => {
      const c = { ...constraints, maxWidth: 300 };
      const r = computeResize('right', { x: 200, y: 0 }, startPos, startDims, c);
      expect(r.dimensions.width).toBe(300);
    });

    it('clamps to maxHeight', () => {
      const c = { ...constraints, maxHeight: 200 };
      const r = computeResize('bottom', { x: 0, y: 200 }, startPos, startDims, c);
      expect(r.dimensions.height).toBe(200);
    });

    it('position does not drift when left handle hits minWidth', () => {
      const r = computeResize('left', { x: 300, y: 0 }, startPos, startDims, constraints);
      // width clamped to 30, actualDelta = 30 - 200 = -170
      // position = 100 - (-170) = 270
      expect(r.dimensions.width).toBe(30);
      expect(r.position.x).toBe(270);
    });
  });

  // ── Grid snapping ───────────────────────────────────────────────────────

  describe('grid snapping', () => {
    it('snaps dimensions to grid', () => {
      const r = computeResize('right', { x: 47, y: 0 }, startPos, startDims, constraints, [20, 20]);
      // raw = 247, snapped = 240 (nearest multiple of 20)
      expect(r.dimensions.width).toBe(240);
    });

    it('snaps both axes on corner resize', () => {
      const r = computeResize('bottom-right', { x: 33, y: 27 }, startPos, startDims, constraints, [25, 25]);
      // width: 233 → 225, height: 177 → 175
      expect(r.dimensions.width).toBe(225);
      expect(r.dimensions.height).toBe(175);
    });

    it('re-clamps after snapping', () => {
      const c = { ...constraints, minWidth: 100 };
      const r = computeResize('right', { x: -110, y: 0 }, startPos, startDims, c, [20, 20]);
      // raw = 90, snapped = 80, re-clamp to 100
      expect(r.dimensions.width).toBe(100);
    });
  });
});
