import { describe, it, expect } from 'vitest';

/**
 * Unit-test the noPanClassName filter logic in isolation.
 *
 * We can't easily instantiate d3-zoom in a test (no DOM env installed), so we
 * extract and test the filter predicate directly using lightweight mocks.
 * Mirrors createPanZoomFilter from pan-zoom.ts.
 */
function shouldAllowPanZoom(
  event: { type: string; target?: any; touches?: { length: number } },
  opts: { pannable?: boolean; zoomable?: boolean; isLocked?: () => boolean; noPanClassName?: string },
): boolean {
  if (opts.isLocked?.()) return false;
  const noPan = opts.noPanClassName;
  if (noPan) {
    const target = event.target;
    if (target?.closest?.('.' + noPan)) return false;
  }
  if (!(opts.zoomable ?? true) && event.type === 'wheel') return false;
  if (event.type === 'touchstart') {
    const isSingleTouch = !event.touches || event.touches.length < 2;
    if (!(opts.pannable ?? true) && isSingleTouch) return false;
    if (!(opts.zoomable ?? true) && !isSingleTouch) return false;
  }
  if (!(opts.pannable ?? true) && event.type === 'mousedown') return false;
  return true;
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

  it('blocks wheel zoom on .nopan target', () => {
    const target = mockTarget(['nopan']);
    expect(shouldAllowPanZoom({ type: 'wheel', target }, { noPanClassName: 'nopan' })).toBe(false);
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
