import { describe, it, expect } from 'vitest';
import { createPanZoomFilter, resolveDblClickZoom } from './pan-zoom';

/**
 * Unit-test the real filter predicate (createPanZoomFilter). We can't easily
 * instantiate d3-zoom in a test, but the filter is a pure function of the event +
 * options, so we exercise it directly with mock targets.
 */
function shouldAllowPanZoom(
  event: { type: string; target?: any; touches?: { length: number }; button?: number },
  opts: Parameters<typeof createPanZoomFilter>[0],
): boolean {
  // pannable/zoomable default to true at the createPanZoom layer; the filter itself
  // reads them raw, so tests pass them explicitly.
  return createPanZoomFilter({ pannable: true, zoomable: true, ...opts })(event);
}

/**
 * Create a mock element that has the given classes and optionally a parent
 * chain. `closest` walks the class list of self and ancestors.
 */
function mockTarget(classes: string[], ancestorClasses: string[][] = []) {
  const classSet = new Set(classes);
  const allSets = [classSet, ...ancestorClasses.map((c) => new Set(c))];

  return {
    closest(selector: string): any {
      // selector is always '.<className>' in our usage
      const cls = selector.startsWith('.') ? selector.slice(1) : selector;
      for (const s of allSets) {
        if (s.has(cls)) return {}; // truthy = found
      }
      return null;
    },
  };
}

describe('pan-zoom filter noPanClassName', () => {
  it('blocks mousedown pan on .nopan target', () => {
    const target = mockTarget(['nopan']);
    expect(shouldAllowPanZoom({ type: 'mousedown', target }, { noPanClassName: 'nopan' })).toBe(false);
  });

  it('ALLOWS wheel zoom over a .nopan target — nopan gates pan, not wheel', () => {
    // Regression: nodes carry `nopan` so dragging them doesn't pan the canvas, but
    // that must not swallow wheel-zoom when the cursor is over a node. Wheel is gated
    // by noWheelClassName instead (see below).
    const target = mockTarget(['nopan']);
    expect(shouldAllowPanZoom({ type: 'wheel', target }, { noPanClassName: 'nopan' })).toBe(true);
  });

  it('still blocks wheel zoom over a .nowheel target', () => {
    const target = mockTarget(['nowheel']);
    expect(shouldAllowPanZoom({ type: 'wheel', target }, { noWheelClassName: 'nowheel' })).toBe(false);
  });

  it('allows mousedown pan on normal target', () => {
    const target = mockTarget(['other-class']);
    expect(shouldAllowPanZoom({ type: 'mousedown', target }, { noPanClassName: 'nopan' })).toBe(true);
  });

  it('blocks when target is inside a .nopan ancestor', () => {
    const target = mockTarget([], [['nopan']]);
    expect(shouldAllowPanZoom({ type: 'mousedown', target }, { noPanClassName: 'nopan' })).toBe(false);
  });

  it('respects custom class name', () => {
    const target = mockTarget(['my-no-pan']);
    expect(shouldAllowPanZoom({ type: 'mousedown', target }, { noPanClassName: 'my-no-pan' })).toBe(false);
  });

  it('allows when noPanClassName is undefined', () => {
    const target = mockTarget(['nopan']);
    expect(shouldAllowPanZoom({ type: 'mousedown', target }, {})).toBe(true);
  });
});

describe('PanZoomOptions move callbacks', () => {
  it('accepts onMoveStart callback in options', () => {
    const opts: Parameters<typeof shouldAllowPanZoom>[1] & {
      onMoveStart?: (vp: { x: number; y: number; zoom: number }) => void;
      onMove?: (vp: { x: number; y: number; zoom: number }) => void;
      onMoveEnd?: (vp: { x: number; y: number; zoom: number }) => void;
    } = {
      onMoveStart: (vp) => { expect(vp).toHaveProperty('x'); },
      onMove: (vp) => { expect(vp).toHaveProperty('y'); },
      onMoveEnd: (vp) => { expect(vp).toHaveProperty('zoom'); },
    };
    // Verify the callbacks are callable
    opts.onMoveStart!({ x: 0, y: 0, zoom: 1 });
    opts.onMove!({ x: 10, y: 20, zoom: 1.5 });
    opts.onMoveEnd!({ x: 10, y: 20, zoom: 1.5 });
  });

  it('callbacks are optional', () => {
    const opts = { pannable: true, zoomable: true };
    // Should not throw when callbacks are undefined
    expect(shouldAllowPanZoom({ type: 'mousedown' }, opts)).toBe(true);
  });
});

describe('resolveDblClickZoom — double-click is a toggle, not zoom-in-only', () => {
  const identity = { x: 0, y: 0, zoom: 1 };
  const opts = (remembered: { x: number; y: number; zoom: number } | null = null) =>
    ({ level: 1.5, minZoom: 0.5, remembered });

  it('zooms in to the configured level on the first double-click', () => {
    const { next } = resolveDblClickZoom(identity, { x: 100, y: 50 }, opts());
    expect(next.zoom).toBe(1.5);
  });

  it('keeps the point under the cursor fixed while zooming in', () => {
    const pointer = { x: 100, y: 50 };
    const { next } = resolveDblClickZoom(identity, pointer, opts());
    // Flow-space point under the cursor before and after must be identical.
    const before = { x: (pointer.x - identity.x) / identity.zoom, y: (pointer.y - identity.y) / identity.zoom };
    const after = { x: (pointer.x - next.x) / next.zoom, y: (pointer.y - next.y) / next.zoom };
    expect(after.x).toBeCloseTo(before.x, 10);
    expect(after.y).toBeCloseTo(before.y, 10);
  });

  it('remembers the pre-zoom viewport so it can be restored', () => {
    const current = { x: 12, y: -34, zoom: 0.8 };
    const { remember } = resolveDblClickZoom(current, { x: 0, y: 0 }, opts());
    expect(remember).toEqual(current);
  });

  it('restores the remembered viewport exactly on the second double-click', () => {
    const current = { x: 12, y: -34, zoom: 0.8 };
    const zoomedIn = resolveDblClickZoom(current, { x: 100, y: 50 }, opts());
    const back = resolveDblClickZoom(zoomedIn.next, { x: 100, y: 50 }, opts(zoomedIn.remember));
    expect(back.next).toEqual(current);
    expect(back.remember).toBeNull(); // remembered viewport is consumed
  });

  it('treats being exactly at the level as "already zoomed in"', () => {
    const { next } = resolveDblClickZoom({ x: 0, y: 0, zoom: 1.5 }, { x: 0, y: 0 }, opts());
    expect(next.zoom).not.toBe(1.5); // it zoomed back out rather than no-opping
  });

  it('zooms out to minZoom when zoomed in with nothing remembered (wheel-zoomed in)', () => {
    // The regression: d3-zoom only zooms in, so at maxZoom the gesture did nothing.
    const { next, remember } = resolveDblClickZoom({ x: 0, y: 0, zoom: 2 }, { x: 100, y: 50 }, opts());
    expect(next.zoom).toBe(0.5);
    expect(remember).toBeNull();
  });

  it('never stalls: a double-click always changes the viewport', () => {
    for (const zoom of [0.5, 0.9, 1, 1.5, 1.9, 2]) {
      const { next } = resolveDblClickZoom({ x: 0, y: 0, zoom }, { x: 100, y: 50 }, opts());
      expect(next.zoom).not.toBe(zoom);
    }
  });

  // The degenerate configuration: a consumer sets minZoom >= the default level, so
  // clamping pushes `level` up onto `minZoom` and the toggle has no headroom below
  // to return to. createPanZoom refuses to attach the toggle in this case (see the
  // 'double-click mode wiring' suite), but the pure function must still be honest
  // about it rather than handing back a transform that only looks like a move.
  describe('level === minZoom (no headroom)', () => {
    const degenerate = (remembered: { x: number; y: number; zoom: number } | null = null) =>
      ({ level: 2, minZoom: 2, remembered });

    it('returns the current viewport unchanged instead of a disguised no-op', () => {
      const current = { x: 10, y: 20, zoom: 2 };
      const { next, remember } = resolveDblClickZoom(current, { x: 100, y: 50 }, degenerate());
      // Reference identity, not just deep equality: the no-headroom branch must hand
      // back the very object it was given, so callers can cheaply detect "no move" —
      // a rebuilt look-alike would defeat that and only look like a transition.
      expect(next).toBe(current);
      expect(remember).toBeNull();
    });

    it('still restores a remembered viewport when there is one', () => {
      const remembered = { x: 1, y: 2, zoom: 0.5 };
      const { next } = resolveDblClickZoom({ x: 10, y: 20, zoom: 2 }, { x: 0, y: 0 }, degenerate(remembered));
      expect(next).toEqual(remembered);
    });

    it('still zooms in when below the level', () => {
      const { next } = resolveDblClickZoom({ x: 0, y: 0, zoom: 1 }, { x: 100, y: 50 }, degenerate());
      expect(next.zoom).toBe(2);
    });
  });
});
