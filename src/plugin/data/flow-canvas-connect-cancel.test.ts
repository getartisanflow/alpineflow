// @vitest-environment jsdom
// ============================================================================
// Cancelling an in-progress connection clears the `.flow-connecting` flag.
//
// The flag gates the target-handle valid/invalid outlines (`.flow-connecting
// .flow-handle-target { … }`), so a cancel that leaves it raised leaves every
// target handle lit. Escape is handled on the canvas itself (_onKeyDown), and
// is exercised here against a REAL mounted flowCanvas.
// ============================================================================

import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import type { FlowCanvasConfig } from '../../core/types';

// jsdom doesn't implement CSS.escape, which the canvas touches once real edges render.
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string): string => String(value);
  }
});

let pluginRegistered = false;
const mounted: HTMLElement[] = [];

function ensurePluginRegistered() {
  if (pluginRegistered) return;
  (window as any).Alpine = Alpine;
  Alpine.plugin(AlpineFlow);
  Alpine.start();
  pluginRegistered = true;
}

function mountCanvas(config: FlowCanvasConfig = {}): { el: HTMLElement; canvas: any } {
  ensurePluginRegistered();

  const wrapper = document.createElement('div');
  (wrapper as any).__config = config;

  const el = document.createElement('div');
  el.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
  el.className = 'flow-container';
  wrapper.appendChild(el);

  document.body.appendChild(wrapper);
  mounted.push(wrapper);

  Alpine.initTree(wrapper);

  return { el, canvas: Alpine.$data(el) };
}

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

describe('connection cancel — the .flow-connecting flag', () => {
  const graph: FlowCanvasConfig = {
    nodes: [
      { id: 'n1', position: { x: 0, y: 0 }, data: {} },
      { id: 'n2', position: { x: 200, y: 0 }, data: {} },
    ],
    edges: [],
  };

  it('drops .flow-connecting and the pending connection when Escape is pressed', () => {
    const { el, canvas } = mountCanvas(graph);
    canvas._active = true;

    // Mid-gesture: a click-to-connect is pending and the flag is raised.
    canvas.pendingConnection = { source: 'n1', sourceHandle: 'source' };
    el.classList.add('flow-connecting');

    let ended = false;
    el.addEventListener('flow-connect-end', () => { ended = true; });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(canvas.pendingConnection).toBeNull();
    expect(el.classList.contains('flow-connecting')).toBe(false);
    expect(ended, 'Escape should end the connection').toBe(true);
  });

  it('leaves .flow-connecting alone when Escape is pressed with no pending connection', () => {
    const { el, canvas } = mountCanvas(graph);
    canvas._active = true;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    // Nothing to cancel, nothing emitted, no throw.
    expect(canvas.pendingConnection).toBeNull();
    expect(el.classList.contains('flow-connecting')).toBe(false);
  });
});
