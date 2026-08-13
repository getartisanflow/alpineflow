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

describe('pan-zoom filter mouse button (panOnDrag default)', () => {
  it('pans on the primary (left) button', () => {
    expect(shouldAllowPanZoom({ type: 'mousedown', button: 0 }, {})).toBe(true);
  });

  it('pans when button is absent (treated as primary)', () => {
    expect(shouldAllowPanZoom({ type: 'mousedown' }, {})).toBe(true);
  });

  it('does NOT pan on the right button — a right-click must not dismiss the context menu it opened', () => {
    expect(shouldAllowPanZoom({ type: 'mousedown', button: 2 }, {})).toBe(false);
  });

  it('does NOT pan on the middle button by default', () => {
    expect(shouldAllowPanZoom({ type: 'mousedown', button: 1 }, {})).toBe(false);
  });

  it('still honors an explicit panOnDrag button list', () => {
    expect(shouldAllowPanZoom({ type: 'mousedown', button: 2 }, { panOnDrag: [0, 2] })).toBe(true);
  });
});

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

  // Only the zoom-out fallback is configurable: it is the branch with no viewport to
  // go back to. `minZoom` is a floor, which is the right answer for a canvas people
  // survey and the wrong one for a canvas they read — there, "show me all of it"
  // is the graph's own extent, not an arbitrary level.
  describe('zoom-out fallback (dblClickZoomOutLevel)', () => {
    const zoomedIn = { x: 40, y: 20, zoom: 2 };
    const fitViewport = { x: 15, y: -8, zoom: 0.72 };

    it("goes to the fitted viewport under 'fit', pan and all", () => {
      const { next, remember } = resolveDblClickZoom(zoomedIn, { x: 100, y: 50 }, {
        level: 1.5, minZoom: 0.5, remembered: null, zoomOut: 'fit', fit: () => fitViewport,
      });

      // The whole transform, not just the zoom: fitting is a pan as much as a scale,
      // and zooming out about the cursor would leave the graph off-centre.
      expect(next).toEqual(fitViewport);
      expect(remember).toBeNull();
    });

    it('declines a fit that would zoom the reader IN, and zooms out instead', () => {
      // The case the option exists for, on a small graph: `dblClickZoomLevel: 1`, the
      // reader wheels in past it, double-clicks meaning "show me all of it" — and the
      // whole graph frames at 1.4, above where they already are. Returning that would
      // zoom them further in; and with nothing remembered, the next double-click would
      // do it again, so the way out would never come.
      const { next, remember } = resolveDblClickZoom({ x: 0, y: 0, zoom: 1.2 }, { x: 100, y: 50 }, {
        level: 1, minZoom: 0.5, remembered: null, zoomOut: 'fit', fit: () => ({ x: 5, y: 5, zoom: 1.4 }),
      });

      expect(next.zoom).toBe(0.5);
      expect(remember).toBeNull();
    });

    it('takes a fit that frames the graph below the current zoom', () => {
      // The other side of the same rule: a fit that IS a way out is taken whole,
      // rather than being second-guessed into `minZoom`.
      const { next } = resolveDblClickZoom({ x: 0, y: 0, zoom: 1.2 }, { x: 100, y: 50 }, {
        level: 1, minZoom: 0.5, remembered: null, zoomOut: 'fit', fit: () => ({ x: 5, y: 5, zoom: 0.9 }),
      });

      expect(next).toEqual({ x: 5, y: 5, zoom: 0.9 });
    });

    it("reads an out-level it does not recognise as 'min'", () => {
      // AlpineFlow is configured from Blade and plain JS as often as from TypeScript,
      // where a typo is not caught by anything. Passed through, `'fitt'` would reach
      // `Math.max(minZoom, 'fitt')` — NaN — and a NaN scale is a canvas that cannot be
      // zoomed or panned back.
      const { next } = resolveDblClickZoom(zoomedIn, { x: 100, y: 50 }, {
        level: 1.5, minZoom: 0.5, remembered: null, zoomOut: 'fitt' as unknown as 'fit',
      });

      expect(next.zoom).toBe(0.5);
      expect(Number.isNaN(next.x)).toBe(false);
      expect(Number.isNaN(next.y)).toBe(false);
    });

    it('falls back to minZoom when there is nothing to fit', () => {
      // An empty canvas, or one whose nodes have not been measured yet. minZoom is
      // still a move, and a dead gesture is worse than a blunt one.
      const { next } = resolveDblClickZoom(zoomedIn, { x: 100, y: 50 }, {
        level: 1.5, minZoom: 0.5, remembered: null, zoomOut: 'fit', fit: () => null,
      });

      expect(next.zoom).toBe(0.5);
    });

    it('does not measure the graph on the double-click that zooms in', () => {
      // The fit is a thunk for this reason: most double-clicks zoom in, and walking
      // every node's bounds for a branch that will not run is work nobody asked for.
      let measured = 0;
      resolveDblClickZoom({ x: 0, y: 0, zoom: 1 }, { x: 100, y: 50 }, {
        level: 1.5, minZoom: 0.5, remembered: null, zoomOut: 'fit', fit: () => { measured++; return fitViewport; },
      });

      expect(measured).toBe(0);
    });

    it('a remembered viewport still wins over the fallback', () => {
      const remembered = { x: 1, y: 2, zoom: 0.9 };
      const { next } = resolveDblClickZoom(zoomedIn, { x: 100, y: 50 }, {
        level: 1.5, minZoom: 0.5, remembered, zoomOut: 'fit', fit: () => fitViewport,
      });

      expect(next).toEqual(remembered);
    });

    it('zooms out to a fixed number about the cursor', () => {
      const pointer = { x: 100, y: 50 };
      const { next } = resolveDblClickZoom(zoomedIn, pointer, {
        level: 1.5, minZoom: 0.5, remembered: null, zoomOut: 0.8,
      });

      expect(next.zoom).toBe(0.8);
      const before = { x: (pointer.x - zoomedIn.x) / zoomedIn.zoom, y: (pointer.y - zoomedIn.y) / zoomedIn.zoom };
      const after = { x: (pointer.x - next.x) / next.zoom, y: (pointer.y - next.y) / next.zoom };
      expect(after.x).toBeCloseTo(before.x, 10);
      expect(after.y).toBeCloseTo(before.y, 10);
    });

    it('never zooms out below minZoom', () => {
      const { next } = resolveDblClickZoom(zoomedIn, { x: 0, y: 0 }, {
        level: 1.5, minZoom: 0.5, remembered: null, zoomOut: 0.1,
      });

      expect(next.zoom).toBe(0.5);
    });

    it('is honest when the fixed level leaves no room below the current zoom', () => {
      // Same contract as the level === minZoom case above: hand back the very object,
      // so a caller can tell "no move" from a transition.
      const current = { x: 10, y: 20, zoom: 1.5 };
      const { next, remember } = resolveDblClickZoom(current, { x: 100, y: 50 }, {
        level: 1.5, minZoom: 0.5, remembered: null, zoomOut: 1.5,
      });

      expect(next).toBe(current);
      expect(remember).toBeNull();
    });

    it("defaults to 'min', matching the behaviour before the option existed", () => {
      const withOption = resolveDblClickZoom(zoomedIn, { x: 100, y: 50 }, {
        level: 1.5, minZoom: 0.5, remembered: null, zoomOut: 'min',
      });
      const without = resolveDblClickZoom(zoomedIn, { x: 100, y: 50 }, {
        level: 1.5, minZoom: 0.5, remembered: null,
      });

      expect(withOption.next).toEqual(without.next);
      expect(without.next.zoom).toBe(0.5);
    });
  });
});
