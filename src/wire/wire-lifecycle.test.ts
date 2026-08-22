// @vitest-environment jsdom
// ============================================================================
// The bridge at MOUNT time, and what it leaves behind.
//
// wire-events-integration.test.ts attaches $wire after the canvas is mounted and
// calls setup() by hand, which is the shape a fake canvas allows — and it is why
// a green suite could hide the `init` regression: the only `init` a canvas ever
// emits happens during Alpine.initTree, before the test's setup() call.
//
// So these mount with $wire ALREADY there, through an Alpine magic, the way a
// Livewire page does, and drive the real activation path (_initAddons).
// ============================================================================

import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../index';
import AlpineFlowWire from './index';
import { unregisterAddon } from '../core/registry';
import type { FlowCanvasConfig } from '../core/types';

let $wire: any;
const mounted: HTMLElement[] = [];

beforeAll(() => {
  (window as any).Alpine = Alpine;
  // `$wire` is a magic on a Livewire page, so `this.$wire` resolves while the
  // component initialises — which is the timing the whole file is about.
  Alpine.magic('wire', () => $wire);
  Alpine.plugin(AlpineFlow);
  Alpine.start();
});

function mountCanvas(config: FlowCanvasConfig = {}): any {
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
  $wire = undefined;
  while (mounted.length) {
    mounted.pop()?.remove();
  }
  vi.restoreAllMocks();
});

describe('init', () => {
  it('forwards the init event a mapping asked for', () => {
    // Core emits `init` from _initChildLayout(), which runs before _initAddons()
    // sets this addon up — so the mapping installs its wrapper after the only
    // `init` there will ever be. It forwarded before the bridge moved out of
    // core, and `init` is on WireFlow's KNOWN_EVENTS, so the addon replays it.
    AlpineFlowWire(Alpine as any);

    const onFlowReady = vi.fn();
    $wire = { onFlowReady, on: vi.fn(() => vi.fn()) };

    mountCanvas({ wireEvents: { init: 'onFlowReady' } });

    expect(onFlowReady).toHaveBeenCalledTimes(1);
  });

  it('does not run the consumer\'s own onInit a second time', () => {
    // Core already called it, before the addon existed. Replaying through the
    // installed wrapper would fix one bug by introducing another, so the replay
    // calls the Livewire method directly.
    AlpineFlowWire(Alpine as any);

    const onFlowReady = vi.fn();
    const onInit = vi.fn();
    $wire = { onFlowReady, on: vi.fn(() => vi.fn()) };

    mountCanvas({ wireEvents: { init: 'onFlowReady' }, onInit });

    expect(onInit).toHaveBeenCalledTimes(1);
    expect(onFlowReady).toHaveBeenCalledTimes(1);
  });

  it('says nothing when no mapping asked for it', () => {
    AlpineFlowWire(Alpine as any);

    const onFlowReady = vi.fn();
    $wire = { onFlowReady, on: vi.fn(() => vi.fn()) };

    mountCanvas({ wireEvents: { 'node-click': 'handleNodeClick' } });

    expect(onFlowReady).not.toHaveBeenCalled();
  });
});

describe('setting up twice on the same config', () => {
  it('does not stack wrappers, so one event is one call', () => {
    // The config object outlives the canvas: a Livewire morph, an x-if flipping
    // back, a canvas destroyed and re-created against the same options object.
    // Wrapping the wrapper doubles every event from then on.
    AlpineFlowWire(Alpine as any);

    const handleNodeClick = vi.fn();
    $wire = { handleNodeClick, on: vi.fn(() => vi.fn()) };

    const config: FlowCanvasConfig = { wireEvents: { 'node-click': 'handleNodeClick' } };

    const first = mountCanvas(config);
    first.destroy();

    const second = mountCanvas(config);
    second._emit('node-click', { node: { id: 'n1' }, event: {} });

    expect(handleNodeClick).toHaveBeenCalledTimes(1);
  });

  it('gives the config back exactly as it was', () => {
    AlpineFlowWire(Alpine as any);

    const onNodeClick = vi.fn();
    $wire = { handleNodeClick: vi.fn(), on: vi.fn(() => vi.fn()) };

    const config: FlowCanvasConfig = {
      wireEvents: { 'node-click': 'handleNodeClick', 'pane-click': 'handlePaneClick' },
      onNodeClick,
    };

    mountCanvas(config).destroy();

    expect((config as any).onNodeClick).toBe(onNodeClick)
      // Never had one, so it should not have gained one.
      ;
    expect('onPaneClick' in config).toBe(false);
  });
});

describe('the canvas argument', () => {
  it('reaches a consumer callback that a mapping wraps', () => {
    // `_emit` calls `callback(detail, this)` so a handler can reach the canvas
    // without a global. Dropping the second argument for events that happen to
    // be mapped is a difference nobody would look for.
    AlpineFlowWire(Alpine as any);

    const onNodeClick = vi.fn();
    $wire = { handleNodeClick: vi.fn(), on: vi.fn(() => vi.fn()) };

    const canvas = mountCanvas({
      wireEvents: { 'node-click': 'handleNodeClick' },
      onNodeClick,
    });

    canvas._emit('node-click', { node: { id: 'n1' }, event: {} });

    expect(onNodeClick).toHaveBeenCalledTimes(1);
    expect(onNodeClick.mock.calls[0][1]).toBe(canvas);
  });
});

describe('a Livewire canvas with no bridge', () => {
  it('warns when $wire is there and the addon is not', () => {
    // The likelier half of the version skew, and the quiet one: the Blade
    // component still sets wireEvents, nothing reads it, flow:* commands land
    // nowhere, and the symptom is "dragging a node stopped saving".
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    $wire = { handleNodeClick: vi.fn(), on: vi.fn(() => vi.fn()) };

    mountCanvas({ wireEvents: { 'node-click': 'handleNodeClick' } });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('/wire addon is not registered');
  });

  it('says nothing on a canvas that is not a Livewire one', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mountCanvas({});

    expect(warn).not.toHaveBeenCalled();
  });

  it('says nothing once the addon is registered', () => {
    AlpineFlowWire(Alpine as any);

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    $wire = { handleNodeClick: vi.fn(), on: vi.fn(() => vi.fn()) };

    mountCanvas({ wireEvents: { 'node-click': 'handleNodeClick' } });

    expect(warn).not.toHaveBeenCalled();
  });
});
