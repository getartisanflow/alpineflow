// @vitest-environment jsdom
// ============================================================================
// Minimap size, end to end on a real canvas.
//
// The size is the one minimap option that is not purely cosmetic: the scale
// that fits the graph in, the centring, and the rectangle marking the viewport
// are all computed against it. So it has to reach the drawn instance, and the
// config has to keep saying what is on screen — otherwise a host that persists
// the size persists the wrong number.
//
// Mounts a REAL flowCanvas (mirroring canvas-interactive-config.test.ts) so the
// resizeMinimap → config → event chain and the patchConfig path are exercised
// together rather than mocked apart.
// ============================================================================

import { describe, it, expect, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import type { FlowCanvasConfig } from '../../core/types';

let pluginRegistered = false;
const mounted: HTMLElement[] = [];

function ensurePluginRegistered() {
  if (pluginRegistered) return;
  (window as any).Alpine = Alpine;
  Alpine.plugin(AlpineFlow);
  Alpine.start();
  pluginRegistered = true;
}

/** Mount a `flowCanvas(config)` with a minimap and return its scope plus the drawn svg. */
function mountCanvas(config: FlowCanvasConfig = {}) {
  ensurePluginRegistered();

  const wrapper = document.createElement('div');
  (wrapper as any).__config = { minimap: true, ...config };

  const el = document.createElement('div');
  el.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
  el.className = 'flow-container';
  wrapper.appendChild(el);

  document.body.appendChild(wrapper);
  mounted.push(wrapper);

  Alpine.initTree(wrapper);

  return {
    canvas: Alpine.$data(el) as any,
    svg: () => el.querySelector('.flow-minimap svg') as SVGElement,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  while (mounted.length) {
    mounted.pop()?.remove();
  }
});

describe('flowCanvas — resizeMinimap', () => {
  it('draws the minimap at the new box', () => {
    const { canvas, svg } = mountCanvas();

    canvas.resizeMinimap(160, 60);

    expect(svg().getAttribute('width')).toBe('160');
    expect(svg().getAttribute('height')).toBe('60');
  });

  it('writes the new box back into the config', () => {
    // Without this the config keeps reporting the size it was constructed with, and a host asked
    // to save "the current size" saves the wrong one.
    const { canvas } = mountCanvas({ minimapWidth: 200, minimapHeight: 150 });

    canvas.resizeMinimap(160, 60);

    expect(canvas._config.minimapWidth).toBe(160);
    expect(canvas._config.minimapHeight).toBe(60);
  });

  it('announces the resize so a host can persist it', () => {
    const onMinimapResize = vi.fn();
    const { canvas } = mountCanvas({ onMinimapResize });

    canvas.resizeMinimap(160, 60);

    expect(onMinimapResize).toHaveBeenCalledTimes(1);
    expect(onMinimapResize.mock.calls[0][0]).toEqual({ width: 160, height: 60 });
  });

  it('dispatches flow-minimap-resize on the container', () => {
    const { canvas } = mountCanvas();
    const seen: unknown[] = [];
    canvas._container.addEventListener('flow-minimap-resize', (e: Event) => {
      seen.push((e as CustomEvent).detail);
    });

    canvas.resizeMinimap(160, 60);

    expect(seen).toEqual([{ width: 160, height: 60 }]);
  });

  it('says nothing when asked for the box it already has', () => {
    // A ResizeObserver on the consumer side fires far more often than the box actually changes;
    // forwarding every one of those to the server would be a round-trip per frame.
    const onMinimapResize = vi.fn();
    const { canvas } = mountCanvas({ onMinimapResize });

    canvas.resizeMinimap(160, 60);
    canvas.resizeMinimap(160, 60);

    expect(onMinimapResize).toHaveBeenCalledTimes(1);
  });

  it('says nothing, and changes nothing, for a box that is not a box', () => {
    const onMinimapResize = vi.fn();
    const { canvas, svg } = mountCanvas({ onMinimapResize });

    canvas.resizeMinimap(0, 60);
    canvas.resizeMinimap(-5, -5);
    canvas.resizeMinimap(NaN, 60);

    expect(onMinimapResize).not.toHaveBeenCalled();
    expect(canvas._config.minimapWidth).toBeUndefined();
    expect(svg().getAttribute('width')).toBe('200');
  });
});

describe('flowCanvas — minimap size via patchConfig', () => {
  it('redraws the minimap at a size pushed through patchConfig', () => {
    // This is the inbound half: `flow:patchConfig` is already in WIRE_COMMAND_MAP, so a server
    // applying a saved size needs no new bridge command.
    const { canvas, svg } = mountCanvas();

    canvas.patchConfig({ minimapWidth: 160, minimapHeight: 60 });

    expect(svg().getAttribute('width')).toBe('160');
    expect(svg().getAttribute('height')).toBe('60');
  });

  it('announces a size pushed through patchConfig the same way a client-driven one is', () => {
    const onMinimapResize = vi.fn();
    const { canvas } = mountCanvas({ onMinimapResize });

    canvas.patchConfig({ minimapWidth: 160, minimapHeight: 60 });

    expect(onMinimapResize.mock.calls).toEqual([[{ width: 160, height: 60 }, canvas]]);
  });

  it('keeps the other dimension when a patch sets only one', () => {
    const { canvas, svg } = mountCanvas({ minimapWidth: 200, minimapHeight: 60 });

    canvas.patchConfig({ minimapWidth: 160 });

    expect(svg().getAttribute('width')).toBe('160');
    expect(svg().getAttribute('height')).toBe('60');
  });
});
