// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPanZoom, DBLCLICK_ZOOM_DURATION, type PanZoomInstance } from './pan-zoom';

/**
 * The double-click *wiring*: which handler ends up bound for each
 * `zoomOnDoubleClick` value. The decision the toggle makes once it is bound is
 * covered by the pure resolveDblClickZoom suite in pan-zoom.test.ts.
 *
 * d3-selection records its listeners on the element as `__on`, so "is d3's native
 * dblclick.zoom still bound?" is directly observable — which is the property that
 * matters here: the default must not move consumers off d3's behaviour.
 */
function hasD3DblClickZoom(el: HTMLElement): boolean {
  const listeners = (el as any).__on as Array<{ type: string; name: string }> | undefined;
  return !!listeners?.some((l) => l.type === 'dblclick' && l.name === 'zoom');
}

describe('double-click mode wiring', () => {
  let container: HTMLElement;
  let instance: PanZoomInstance | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    instance?.destroy();
    instance = null;
    container.remove();
  });

  const create = (options: Parameters<typeof createPanZoom>[1] = { onTransformChange: () => {} }) => {
    instance = createPanZoom(container, { onTransformChange: () => {}, ...options });
    return instance;
  };

  it('leaves d3 native dblclick zoom bound by default', () => {
    create();
    expect(hasD3DblClickZoom(container)).toBe(true);
  });

  it("leaves d3 native dblclick zoom bound for the explicit 'step' mode", () => {
    create({ onTransformChange: () => {}, zoomOnDoubleClick: 'step' });
    expect(hasD3DblClickZoom(container)).toBe(true);
  });

  it('leaves d3 native dblclick zoom bound for the legacy `true`', () => {
    create({ onTransformChange: () => {}, zoomOnDoubleClick: true });
    expect(hasD3DblClickZoom(container)).toBe(true);
  });

  it("unbinds d3's handler in 'toggle' mode so the two never fight", () => {
    create({ onTransformChange: () => {}, zoomOnDoubleClick: 'toggle' });
    expect(hasD3DblClickZoom(container)).toBe(false);
  });

  it('unbinds d3\'s handler when double-click zoom is disabled', () => {
    create({ onTransformChange: () => {}, zoomOnDoubleClick: false });
    expect(hasD3DblClickZoom(container)).toBe(false);
  });

  // A toggle whose level is clamped onto minZoom has nowhere to zoom back out to.
  // Rather than install a gesture that stalls on the second double-click, fall back
  // to d3's stepped handler, which still zooms both ways.
  it('falls back to d3 when the toggle level has no headroom above minZoom', () => {
    create({ onTransformChange: () => {}, zoomOnDoubleClick: 'toggle', minZoom: 2, maxZoom: 4 });
    expect(hasD3DblClickZoom(container)).toBe(true);
  });

  it('attaches the toggle when an explicit level clears minZoom', () => {
    create({
      onTransformChange: () => {},
      zoomOnDoubleClick: 'toggle',
      minZoom: 2,
      maxZoom: 4,
      dblClickZoomLevel: 3,
    });
    expect(hasD3DblClickZoom(container)).toBe(false);
  });

  /**
   * Behaviour of the bound toggle handler once a real double-click drives it. These
   * exercise the whole path — DOM dblclick → resolveDblClickZoom → d3 transition —
   * so they wait out the animation (a real timer; the transition is driven by
   * jsdom's rAF/timeout, not fake timers) before reading the settled transform off
   * `element.__zoom`.
   */
  describe('toggle mode — runtime behaviour & invalidation', () => {
    // Comfortably past the transition so `__zoom` has reached its final value.
    const SETTLE_MS = DBLCLICK_ZOOM_DURATION + 120;
    const settle = () => new Promise((resolve) => setTimeout(resolve, SETTLE_MS));

    /** Pin a deterministic box so cursor→container coordinates don't depend on layout. */
    const stubRect = (el: HTMLElement) => {
      el.getBoundingClientRect = () =>
        ({ left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600, x: 0, y: 0, toJSON() {} }) as DOMRect;
    };

    const dblclickAt = (el: HTMLElement, x: number, y: number) => {
      el.dispatchEvent(new MouseEvent('dblclick', { clientX: x, clientY: y, bubbles: true, cancelable: true }));
    };

    /** The d3-zoom transform d3 stores on the element: { k: scale, x, y }. */
    const zoomOf = (el: HTMLElement) => (el as any).__zoom as { k: number; x: number; y: number };

    const toggleOpts = { zoomOnDoubleClick: 'toggle' as const, minZoom: 0.5, maxZoom: 2, dblClickZoomLevel: 1.5 };

    it('setViewport() invalidates the remembered viewport so toggle-out does not jump back to it', async () => {
      create({ onTransformChange: () => {}, ...toggleOpts });
      stubRect(container);

      // Toggle in from identity (zoom 1): remembers { x:0, y:0, zoom:1 }, animates to 1.5.
      dblclickAt(container, 100, 50);
      await settle();
      expect(zoomOf(container).k).toBeCloseTo(1.5, 5);

      // The consumer moves the viewport itself — the remembered one is now stale.
      instance!.setViewport({ x: 200, y: 100, zoom: 1.8 });
      expect(zoomOf(container).k).toBeCloseTo(1.8, 5);

      // Toggle out: with the memory invalidated it behaves as "nothing remembered"
      // (zoom out to minZoom about the cursor), NOT a jump back to the pre-zoom zoom of 1.
      dblclickAt(container, 100, 50);
      await settle();
      expect(zoomOf(container).k).toBeCloseTo(0.5, 5); // zoomed out to minZoom
      expect(zoomOf(container).k).not.toBeCloseTo(1, 5); // did not restore the pre-zoom viewport
    });

    it('the toggle-in\'s own programmatic transition keeps the memory (round-trip restores exactly)', async () => {
      // Contrast to the setViewport case: a programmatic transition carries no
      // sourceEvent, so the d3 'start' handler leaves rememberedViewport intact and
      // the second double-click can put the viewport back.
      create({ onTransformChange: () => {}, ...toggleOpts });
      stubRect(container);

      dblclickAt(container, 100, 50); // toggle in from identity → remembers { 0, 0, 1 }
      await settle();
      expect(zoomOf(container).k).toBeCloseTo(1.5, 5);

      dblclickAt(container, 100, 50); // toggle out → restores the remembered viewport
      await settle();
      const back = zoomOf(container);
      expect(back.k).toBeCloseTo(1, 5);
      expect(back.x).toBeCloseTo(0, 5);
      expect(back.y).toBeCloseTo(0, 5);
    });

    it('a user gesture (wheel) invalidates the memory via the user-sourced d3 \'start\'', async () => {
      let moveStarts = 0;
      create({ onTransformChange: () => {}, onMoveStart: () => { moveStarts++; }, ...toggleOpts });
      stubRect(container);

      dblclickAt(container, 100, 50); // toggle in → remembers { 0, 0, 1 }
      await settle();
      expect(zoomOf(container).k).toBeCloseTo(1.5, 5);

      // A wheel zoom is a user gesture: d3 fires 'start' with a truthy sourceEvent,
      // which is what clears rememberedViewport.
      container.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, clientX: 100, clientY: 50, bubbles: true, cancelable: true }));
      await settle(); // let the wheel gesture's debounced 'end' fire
      expect(moveStarts).toBeGreaterThan(0); // proves a user-sourced 'start' actually ran
      expect(zoomOf(container).k).toBeGreaterThanOrEqual(1.5); // wheel zoomed further in, still above the level

      // Toggle out: memory was invalidated, so this zooms out to minZoom rather than
      // restoring the pre-zoom viewport (zoom 1).
      dblclickAt(container, 100, 50);
      await settle();
      expect(zoomOf(container).k).toBeCloseTo(0.5, 5);
      expect(zoomOf(container).k).not.toBeCloseTo(1, 5);
    });

    it('stays live under zoomable:false, matching what the filter always let dblclick do in step mode', async () => {
      // `zoomable: false` gates wheel/pinch in createPanZoomFilter and has never
      // filtered dblclick — d3's native step handler (shift-out included) stays live
      // under it. The toggle mirrors that: a consumer that turns off wheel zoom to
      // drive zooming itself keeps the double-click gesture in either mode.
      create({ onTransformChange: () => {}, zoomable: false, ...toggleOpts });
      stubRect(container);

      dblclickAt(container, 100, 50);
      await settle();
      expect(zoomOf(container).k).toBeCloseTo(1.5, 5); // toggled in despite zoomable:false
    });

    it('update({ zoomable: false }) leaves the toggle live too — zoomOnDoubleClick owns the gesture', async () => {
      create({ onTransformChange: () => {}, ...toggleOpts });
      stubRect(container);

      instance!.update({ zoomable: false });
      dblclickAt(container, 100, 50);
      await settle();
      expect(zoomOf(container).k).toBeCloseTo(1.5, 5);

      // And the round trip still works under the flag.
      dblclickAt(container, 100, 50);
      await settle();
      expect(zoomOf(container).k).toBeCloseTo(1, 5);
    });

    it('destroy() removes the custom toggle dblclick listener', async () => {
      let changes = 0;
      create({ onTransformChange: () => { changes++; }, ...toggleOpts });
      stubRect(container);

      instance!.destroy();
      instance = null; // already torn down; keep afterEach from destroying twice
      changes = 0;

      dblclickAt(container, 100, 50); // no listener left → nothing happens
      await settle();
      expect(changes).toBe(0);
      expect(zoomOf(container).k).toBe(1);
    });

    /**
     * `dblClickZoomOutLevel` only governs the branch with no remembered viewport —
     * reached here by starting above the level, which is exactly how a canvas comes
     * back from a restored or fitted viewport.
     */
    describe('zoom-out fallback', () => {
      it("puts the whole graph back on screen under 'fit'", async () => {
        const fitViewport = { x: 24, y: -12, zoom: 0.6 };
        create({
          onTransformChange: () => {},
          ...toggleOpts,
          dblClickZoomOutLevel: 'fit',
          getFitViewport: () => fitViewport,
        });
        stubRect(container);

        // Above the level with nothing remembered: a programmatic setViewport leaves
        // no memory behind, same as arriving on a restored viewport.
        instance!.setViewport({ x: 200, y: 100, zoom: 1.8 });

        dblclickAt(container, 100, 50);
        await settle();

        const settled = zoomOf(container);
        expect(settled.k).toBeCloseTo(fitViewport.zoom, 5);
        expect(settled.x).toBeCloseTo(fitViewport.x, 5);
        expect(settled.y).toBeCloseTo(fitViewport.y, 5);
      });

      it('does not measure the graph while the gesture is still zooming in', async () => {
        let measured = 0;
        create({
          onTransformChange: () => {},
          ...toggleOpts,
          dblClickZoomOutLevel: 'fit',
          getFitViewport: () => { measured++; return { x: 0, y: 0, zoom: 0.6 }; },
        });
        stubRect(container);

        dblclickAt(container, 100, 50); // from identity: zooms in to the level
        await settle();

        expect(zoomOf(container).k).toBeCloseTo(1.5, 5);
        expect(measured).toBe(0);
      });

      it('falls back to d3 when a fixed out-level leaves the toggle no headroom', () => {
        // Same rule as a level clamped onto minZoom: the second double-click would
        // stall, so keep the stepped handler that still zooms both ways.
        create({
          onTransformChange: () => {},
          zoomOnDoubleClick: 'toggle',
          minZoom: 0.5,
          maxZoom: 2,
          dblClickZoomLevel: 1.5,
          dblClickZoomOutLevel: 1.5,
        });

        expect(hasD3DblClickZoom(container)).toBe(true);
      });

      it('attaches the toggle when the fixed out-level sits below the level', () => {
        create({
          onTransformChange: () => {},
          zoomOnDoubleClick: 'toggle',
          minZoom: 0.5,
          maxZoom: 2,
          dblClickZoomLevel: 1.5,
          dblClickZoomOutLevel: 1,
        });

        expect(hasD3DblClickZoom(container)).toBe(false);
      });
    });
  });
});
