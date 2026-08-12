// @vitest-environment jsdom
// ============================================================================
// animate() — what hears about a move once it has finished
//
// Mounts a REAL flowCanvas, because the point is Alpine's reactivity: the
// animator writes positions through `Alpine.raw()` on purpose and flushes the
// DOM by hand, so the only thing that can tell a watcher the graph moved is the
// sync at the end.
// ============================================================================

import { describe, it, expect, afterEach } from 'vitest';
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
