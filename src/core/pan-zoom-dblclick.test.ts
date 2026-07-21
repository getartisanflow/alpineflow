// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPanZoom, type PanZoomInstance } from './pan-zoom';

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
});
