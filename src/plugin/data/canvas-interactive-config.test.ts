// @vitest-environment jsdom
// ============================================================================
// Canvas-level `interactive` config (WS3) — declarative "start locked".
//
// Mounts a REAL flowCanvas (mirroring flow-canvas-crossing.test.ts) so the
// isInteractive seed and the panZoom-init precedence are exercised end-to-end.
// ============================================================================

import { describe, it, expect, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import * as panZoomModule from '../../core/pan-zoom';
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

/** Mount a `flowCanvas(config)` and return its reactive Alpine scope. */
function mountCanvas(config: FlowCanvasConfig = {}): any {
  ensurePluginRegistered();

  const wrapper = document.createElement('div');
  (wrapper as any).__config = config;

  const canvas = document.createElement('div');
  canvas.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
  canvas.className = 'flow-container';
  wrapper.appendChild(canvas);

  document.body.appendChild(wrapper);
  mounted.push(wrapper);

  Alpine.initTree(wrapper);

  return Alpine.$data(canvas);
}

afterEach(() => {
  vi.restoreAllMocks();
  while (mounted.length) {
    mounted.pop()?.remove();
  }
});

describe('flowCanvas — interactive config', () => {
  it('seeds isInteractive false when interactive: false', () => {
    const canvas = mountCanvas({ interactive: false });
    expect(canvas.isInteractive).toBe(false);
  });

  it('defaults isInteractive true when interactive is unset', () => {
    const canvas = mountCanvas({});
    expect(canvas.isInteractive).toBe(true);
  });

  it('honours an explicit interactive: true', () => {
    const canvas = mountCanvas({ interactive: true });
    expect(canvas.isInteractive).toBe(true);
  });

  it('starts panZoom non-pannable/non-zoomable when interactive: false, overriding per-axis config', () => {
    const spy = vi.spyOn(panZoomModule, 'createPanZoom');
    mountCanvas({ interactive: false, pannable: true, zoomable: true });

    const opts = spy.mock.calls.at(-1)?.[1];
    expect(opts?.pannable).toBe(false);
    expect(opts?.zoomable).toBe(false);
  });

  it('leaves panZoom axes untouched when interactive is unset', () => {
    const spy = vi.spyOn(panZoomModule, 'createPanZoom');
    mountCanvas({ pannable: true, zoomable: true });

    const opts = spy.mock.calls.at(-1)?.[1];
    expect(opts?.pannable).toBe(true);
    expect(opts?.zoomable).toBe(true);
  });
});
