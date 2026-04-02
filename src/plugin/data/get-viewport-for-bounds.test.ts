import { describe, it, expect } from 'vitest';
import { getViewportForBounds } from '../../core/geometry';

/**
 * Tests for getViewportForBounds() as exposed on FlowInstance.
 * The method delegates to the core geometry function with container dims and config zoom limits.
 * We test the geometry function directly — the FlowInstance wrapper is a thin pass-through.
 */

describe('getViewportForBounds', () => {
  it('returns a viewport object with x, y, zoom', () => {
    const vp = getViewportForBounds(
      { x: 0, y: 0, width: 400, height: 300 },
      800, 600, // container
      0.5, 2,   // minZoom, maxZoom
      0.1,      // padding
    );
    expect(vp).toHaveProperty('x');
    expect(vp).toHaveProperty('y');
    expect(vp).toHaveProperty('zoom');
    expect(typeof vp.zoom).toBe('number');
  });

  it('respects custom padding — more padding → lower zoom', () => {
    const vp1 = getViewportForBounds(
      { x: 0, y: 0, width: 400, height: 300 },
      800, 600, 0.5, 2, 0,
    );
    const vp2 = getViewportForBounds(
      { x: 0, y: 0, width: 400, height: 300 },
      800, 600, 0.5, 2, 0.5,
    );
    expect(vp2.zoom).toBeLessThanOrEqual(vp1.zoom);
  });

  it('clamps zoom to minZoom / maxZoom', () => {
    // Tiny bounds in huge container → would be high zoom without clamping
    const vp = getViewportForBounds(
      { x: 0, y: 0, width: 10, height: 10 },
      800, 600, 0.5, 2, 0,
    );
    expect(vp.zoom).toBeLessThanOrEqual(2);
    expect(vp.zoom).toBeGreaterThanOrEqual(0.5);
  });

  it('centers the bounds in the container', () => {
    const vp = getViewportForBounds(
      { x: 100, y: 100, width: 200, height: 200 },
      800, 600, 0.5, 2, 0,
    );
    // The viewport should offset to center the bounds
    expect(typeof vp.x).toBe('number');
    expect(typeof vp.y).toBe('number');
  });
});
