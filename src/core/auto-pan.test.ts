import { describe, it, expect } from 'vitest';
import { getAutoPanDelta } from './auto-pan';
import { makeDOMRect } from './__fixtures__/nodes';

const rect = makeDOMRect(0, 0, 800, 600);
const speed = 15;

describe('getAutoPanDelta', () => {
  // ── Center (no pan) ─────────────────────────────────────────────────────

  it('returns zero delta when pointer is in the center', () => {
    const { dx, dy } = getAutoPanDelta(400, 300, rect, speed);
    expect(dx).toBe(0);
    expect(dy).toBe(0);
  });

  // ── Left edge ───────────────────────────────────────────────────────────

  it('returns negative dx near left edge', () => {
    const { dx, dy } = getAutoPanDelta(20, 300, rect, speed);
    expect(dx).toBeLessThan(0);
    expect(dy).toBe(0);
  });

  it('increases magnitude closer to left edge', () => {
    const { dx: dx20 } = getAutoPanDelta(20, 300, rect, speed);
    const { dx: dx10 } = getAutoPanDelta(10, 300, rect, speed);
    expect(Math.abs(dx10)).toBeGreaterThan(Math.abs(dx20));
  });

  // ── Right edge ──────────────────────────────────────────────────────────

  it('returns positive dx near right edge', () => {
    const { dx, dy } = getAutoPanDelta(785, 300, rect, speed);
    expect(dx).toBeGreaterThan(0);
    expect(dy).toBe(0);
  });

  // ── Top edge ────────────────────────────────────────────────────────────

  it('returns negative dy near top edge', () => {
    const { dx, dy } = getAutoPanDelta(400, 15, rect, speed);
    expect(dx).toBe(0);
    expect(dy).toBeLessThan(0);
  });

  // ── Bottom edge ─────────────────────────────────────────────────────────

  it('returns positive dy near bottom edge', () => {
    const { dx, dy } = getAutoPanDelta(400, 590, rect, speed);
    expect(dx).toBe(0);
    expect(dy).toBeGreaterThan(0);
  });

  // ── Corner ──────────────────────────────────────────────────────────────

  it('returns both dx and dy near corner', () => {
    const { dx, dy } = getAutoPanDelta(10, 10, rect, speed);
    expect(dx).toBeLessThan(0);
    expect(dy).toBeLessThan(0);
  });

  // ── Outside container ───────────────────────────────────────────────────

  it('returns zero when pointer is outside container (negative)', () => {
    const { dx, dy } = getAutoPanDelta(-10, -10, rect, speed);
    expect(dx).toBe(0);
    expect(dy).toBe(0);
  });

  // ── Threshold boundary ──────────────────────────────────────────────────

  it('returns zero at exactly the threshold distance', () => {
    // EDGE_THRESHOLD is 40. At 40px from left (x=40), distLeft = 40, which is NOT < 40
    const { dx } = getAutoPanDelta(40, 300, rect, speed);
    expect(dx).toBe(0);
  });

  it('returns non-zero just inside the threshold', () => {
    const { dx } = getAutoPanDelta(39, 300, rect, speed);
    expect(dx).toBeLessThan(0);
  });
});
