// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import { registerAddon, unregisterAddon } from '../../core/registry';
import type { FlowCanvasConfig } from '../../core/types';

let pluginRegistered = false;
const mounted: HTMLElement[] = [];

beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') (globalThis as any).CSS = {};
  if (typeof CSS.escape !== 'function') CSS.escape = (v: string) => String(v);
  if (typeof document.elementFromPoint !== 'function') document.elementFromPoint = () => null;
});

function ensurePluginRegistered(): void {
  if (pluginRegistered) return;
  (window as any).Alpine = Alpine;
  Alpine.plugin(AlpineFlow);
  Alpine.start();
  pluginRegistered = true;
}

function mountCanvas(config: Partial<FlowCanvasConfig> = {}): { canvas: any; el: HTMLElement } {
  ensurePluginRegistered();
  const wrapper = document.createElement('div');
  (wrapper as any).__config = {
    nodes: [{ id: 'a', position: { x: 0, y: 0 }, data: {} }],
    edges: [], fitViewOnInit: false, controls: false, minimap: false, ...config,
  };
  const el = document.createElement('div');
  el.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
  el.className = 'flow-container';
  el.innerHTML = `<div x-flow-viewport><template x-for="node in nodes" :key="node.id"><div x-flow-node="node"><div x-flow-handle:source></div></div></template></div>`;
  wrapper.appendChild(el);
  document.body.appendChild(wrapper);
  mounted.push(wrapper);
  Alpine.initTree(wrapper);
  return { canvas: Alpine.$data(el) as any, el: wrapper };
}

afterEach(() => {
  for (const el of mounted) { Alpine.destroyTree(el); el.remove(); }
  mounted.length = 0;
  unregisterAddon('cleanup-probe');
  vi.restoreAllMocks();
});

describe('addon setup() cleanup capture', () => {
  it('invokes the cleanup an addon returns from setup() exactly once on destroy', () => {
    const cleanup = vi.fn();
    registerAddon('cleanup-probe', { setup: (_canvas: any) => cleanup });

    const { el } = mountCanvas();
    expect(cleanup).not.toHaveBeenCalled();

    Alpine.destroyTree(el);
    mounted.length = 0; // prevent afterEach double-destroy
    el.remove();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('does not throw when an addon setup() returns undefined', () => {
    registerAddon('cleanup-probe', { setup: (_canvas: any) => undefined });
    const { el } = mountCanvas();
    expect(() => { Alpine.destroyTree(el); mounted.length = 0; el.remove(); }).not.toThrow();
  });
});
