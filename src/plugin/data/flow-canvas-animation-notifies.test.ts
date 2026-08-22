// @vitest-environment jsdom
// ============================================================================
// animate() — what hears about a move once it has finished
//
// Mounts a REAL flowCanvas, because the point is Alpine's reactivity: the
// animator writes positions through `Alpine.raw()` on purpose and flushes the
// DOM by hand, so the only thing that can tell a watcher the graph moved is the
// sync at the end.
// ============================================================================

import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import type { FlowCanvasConfig } from '../../core/types';

// jsdom doesn't implement CSS.escape — the edge-style flush at the end of an edge animation looks
// its path element up by id and would throw without it.
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
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

function mountCanvas(config: FlowCanvasConfig = {}): any {
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

  return Alpine.$data(el);
}

const settle = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove();
});

describe('animate — the reactive sync at the end', () => {
  it('tells a watcher of nodes that the graph moved', async () => {
    // What the minimap is built on: `$watch('nodes', () => minimap.render())`, and nothing else.
    //
    // The sync at the end used to assign `node.position.x = raw.position.x`. `Alpine.raw()`
    // returns the object the proxy WRAPS, so the animator's own writes had already put the final
    // coordinate there — the assignment set a value that was already equal, reactivity skipped
    // it, and nothing was notified. The minimap went on showing the graph as it stood before.
    const canvas = mountCanvas({
      nodes: [
        { id: 'n1', position: { x: 0, y: 0 }, data: {} },
        { id: 'n2', position: { x: 200, y: 0 }, data: {} },
      ],
    });

    let seen = 0;
    Alpine.effect(() => {
      // Reading the way $watch does — deeply, so a moved node counts as a change.
      JSON.stringify(canvas.nodes);
      seen++;
    });

    const before = seen;

    canvas.animate({ nodes: { n1: { position: { x: 400, y: 120 } } } }, { duration: 20 });

    await settle();

    expect(seen).toBeGreaterThan(before);
    expect(canvas.nodes[0].position).toEqual({ x: 400, y: 120 });
  });

  it('tells a watcher that a node style animation finished', async () => {
    // The same hole, one property over: the per-frame writes go to `Alpine.raw(n).style`, so the
    // sync's `node.style = raw.style` assigned the object that was already there.
    const canvas = mountCanvas({
      nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: {}, style: { opacity: '0' } }],
    });

    let seen = 0;
    Alpine.effect(() => {
      JSON.stringify(canvas.nodes);
      seen++;
    });

    const before = seen;

    canvas.animate({ nodes: { n1: { style: { opacity: '1' } } } }, { duration: 20 });

    await settle();

    expect(seen).toBeGreaterThan(before);
    expect(canvas.nodes[0].style).toMatchObject({ opacity: '1' });
  });

  it('tells a watcher that an edge colour animation finished', async () => {
    // `color` is a primitive, so replacing the object — which is what fixes `position` — has
    // nothing to replace. It still has to be published.
    const canvas = mountCanvas({
      nodes: [
        { id: 'n1', position: { x: 0, y: 0 }, data: {} },
        { id: 'n2', position: { x: 200, y: 0 }, data: {} },
      ],
      edges: [{ id: 'e1', source: 'n1', target: 'n2', color: 'rgb(0, 0, 0)' }],
    });

    let seen = 0;
    Alpine.effect(() => {
      JSON.stringify(canvas.edges);
      seen++;
    });

    const before = seen;

    canvas.animate({ edges: { e1: { color: 'rgb(255, 0, 0)' } } }, { duration: 20 });

    await settle();

    expect(seen).toBeGreaterThan(before);
    expect(canvas.edges[0].color).toBe('rgb(255, 0, 0)');
  });

  it('tells a watcher that an edge stroke-width animation finished', async () => {
    const canvas = mountCanvas({
      nodes: [
        { id: 'n1', position: { x: 0, y: 0 }, data: {} },
        { id: 'n2', position: { x: 200, y: 0 }, data: {} },
      ],
      edges: [{ id: 'e1', source: 'n1', target: 'n2', strokeWidth: 1 }],
    });

    let seen = 0;
    Alpine.effect(() => {
      JSON.stringify(canvas.edges);
      seen++;
    });

    const before = seen;

    canvas.animate({ edges: { e1: { strokeWidth: 6 } } }, { duration: 20 });

    await settle();

    expect(seen).toBeGreaterThan(before);
    expect(canvas.edges[0].strokeWidth).toBe(6);
  });

  it('leaves an edge nobody animated alone', async () => {
    const canvas = mountCanvas({
      nodes: [
        { id: 'n1', position: { x: 0, y: 0 }, data: {} },
        { id: 'n2', position: { x: 200, y: 0 }, data: {} },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', color: 'rgb(0, 0, 0)', strokeWidth: 1 },
        { id: 'e2', source: 'n2', target: 'n1', color: 'rgb(0, 0, 255)', strokeWidth: 2 },
      ],
    });

    canvas.animate({ edges: { e1: { color: 'rgb(255, 0, 0)' } } }, { duration: 20 });

    await settle();

    expect(canvas.edges[1].color).toBe('rgb(0, 0, 255)');
    expect(canvas.edges[1].strokeWidth).toBe(2);
  });

  it('leaves a node nobody animated alone', async () => {
    const canvas = mountCanvas({
      nodes: [
        { id: 'n1', position: { x: 0, y: 0 }, data: {} },
        { id: 'n2', position: { x: 200, y: 0 }, data: {} },
      ],
    });

    canvas.animate({ nodes: { n1: { position: { x: 400, y: 0 } } } }, { duration: 20 });

    await settle();

    expect(canvas.nodes[1].position).toEqual({ x: 200, y: 0 });
  });
});
