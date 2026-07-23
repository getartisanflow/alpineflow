// @vitest-environment jsdom
// ============================================================================
// Config-callback context (WS4) — config callbacks receive the canvas context
// as a second argument, so handlers don't need global-variable hacks to reach
// the canvas. The dispatched DOM CustomEvent detail must stay ctx-free (locked
// decision #1: a context ref in `detail` would be circular and break
// structuredClone / JSON / wireflow serialization).
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
  while (mounted.length) {
    mounted.pop()?.remove();
  }
});

describe('flowCanvas — config-callback context', () => {
  it('passes the canvas context as the second arg to _emit config callbacks', () => {
    const onConnect = vi.fn();
    const canvas = mountCanvas({ onConnect });

    const detail = { source: 'a', sourceHandle: null, target: 'b', targetHandle: null } as any;
    canvas._emit('connect', detail);

    expect(onConnect).toHaveBeenCalledTimes(1);
    const [passedDetail, passedCtx] = onConnect.mock.calls[0];
    expect(passedDetail).toEqual(detail);
    // The second arg is the live canvas context.
    expect(passedCtx).toBeDefined();
    expect(typeof passedCtx.addNodes).toBe('function');
  });

  it('does not leak the context into the dispatched DOM CustomEvent detail', () => {
    const canvas = mountCanvas({});
    const container = canvas._container as HTMLElement;

    let captured: any;
    container.addEventListener('flow-connect', (e: any) => {
      captured = e.detail;
    });

    const detail = { source: 'a', target: 'b' } as any;
    canvas._emit('connect', detail);

    expect(captured).toEqual(detail);
    // No ctx / no cycle — must survive JSON serialization (wireflow contract).
    expect(() => JSON.stringify(captured)).not.toThrow();
  });

  it('passes the canvas context as the second arg to onDrop', () => {
    const onDrop = vi.fn(() => null);
    const canvas = mountCanvas({ onDrop });
    const container = canvas._container as HTMLElement;
    // jsdom lacks elementsFromPoint (used for targetNode resolution) — stub it.
    (document as any).elementsFromPoint = () => [];

    const evt: any = {
      preventDefault: () => {},
      target: container,
      clientX: 50,
      clientY: 50,
      dataTransfer: {
        types: ['application/alpineflow'],
        getData: (m: string) =>
          m === 'application/alpineflow' ? JSON.stringify({ label: 'X' }) : '',
      },
    };
    canvas._onDropZoneDrop(evt);

    expect(onDrop).toHaveBeenCalledTimes(1);
    const [detail, ctx] = onDrop.mock.calls[0];
    expect(detail).toMatchObject({ mimeType: 'application/alpineflow' });
    expect(typeof ctx?.addNodes).toBe('function');
  });
});
