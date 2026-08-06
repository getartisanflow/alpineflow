// @vitest-environment jsdom
// ============================================================================
// Wire-events integration — the client→server half of the bridge, exercised
// against a REAL mounted canvas (not a fakeCanvas). registerWireEvents wraps
// the config callbacks that core's _emit reads; this test proves an AlpineFlow
// event actually reaches $wire. It mounts flowCanvas() so _emit reads the true
// closure config — the object identity that wire-addon.test.ts (fakeCanvas)
// could not catch.
// ============================================================================

import { describe, it, expect, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../index';
import AlpineFlowWire from './index';
import { getAddon, unregisterAddon } from '../core/registry';
import type { FlowCanvasConfig } from '../core/types';

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
  unregisterAddon('wire');
  while (mounted.length) {
    mounted.pop()?.remove();
  }
});

describe('wire events — client→server forwarding against a real canvas', () => {
  it('forwards a mapped AlpineFlow event to the $wire method', () => {
    // Register the wire addon so getAddon('wire').setup exists.
    AlpineFlowWire(Alpine as any);

    // wireEvents maps 'node-click' → the Livewire method 'handleNodeClick'.
    const canvas = mountCanvas({ wireEvents: { 'node-click': 'handleNodeClick' } });

    const handleNodeClick = vi.fn();
    canvas.$wire = { handleNodeClick, on: vi.fn(() => vi.fn()) };

    // Activate the bridge against the real canvas (mount-time auto-setup was a
    // no-op because $wire was not yet attached).
    (getAddon('wire') as any).setup(canvas);

    const node = { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'X' } };
    canvas._emit('node-click', { node, event: {} });

    // The wrapper registerWireEvents installed must be the callback _emit reads,
    // extract node-click args via WIRE_PAYLOAD_MAP, and call the Livewire method.
    expect(handleNodeClick).toHaveBeenCalledTimes(1);
    expect(handleNodeClick).toHaveBeenCalledWith('n1', node);
  });
});
