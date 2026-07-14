// @vitest-environment jsdom
// ============================================================================
// flowCanvas.destroy() — the teardown contract
//
// destroy() was shadowed by the animation mixin's own `destroy` for its entire life
// (see canvas-mixin-shadowing.test.ts), so its ~140-line body had NEVER executed in
// production. Un-shadowing it turns all of that on at once. These tests pin the parts
// of the newly-live body where "what it does" is a deliberate decision rather than an
// accident of code that nobody could run:
//
//   1. OWNERSHIP — the canvas destroys what the canvas CONSTRUCTED (bridge, awareness,
//      cursor layer) and NOT the collab provider the app handed it.
//   2. Alpine calls destroy() unwrapped; a throwing USER callback must not abort it.
//   3. Animator/timeline teardown happens exactly once, in `_destroyAnimations()`.
// ============================================================================

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import { registerAddon } from '../../core/registry';
import type { FlowCanvasConfig } from '../../core/types';

let pluginRegistered = false;
const mounted: HTMLElement[] = [];

beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
  if (typeof document.elementFromPoint !== 'function') {
    document.elementFromPoint = () => null;
  }
});

function ensurePluginRegistered(): void {
  if (pluginRegistered) return;
  (window as any).Alpine = Alpine;
  Alpine.plugin(AlpineFlow);
  Alpine.start();
  pluginRegistered = true;
}

const BASE_CONFIG: FlowCanvasConfig = {
  nodes: [{ id: 'a', position: { x: 0, y: 0 }, data: {} }],
  edges: [],
  autoPanOnConnect: false,
  fitViewOnInit: false,
  controls: false,
  minimap: false,
};

function mountCanvas(config: Partial<FlowCanvasConfig> = {}): any {
  ensurePluginRegistered();

  const wrapper = document.createElement('div');
  (wrapper as any).__config = { ...BASE_CONFIG, ...config };

  const el = document.createElement('div');
  el.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
  el.className = 'flow-container';
  el.innerHTML = `
    <div x-flow-viewport>
      <template x-for="node in nodes" :key="node.id">
        <div x-flow-node="node"><div x-flow-handle:source></div></div>
      </template>
    </div>
  `;
  wrapper.appendChild(el);

  document.body.appendChild(wrapper);
  mounted.push(wrapper);
  Alpine.initTree(wrapper);

  return Alpine.$data(el) as any;
}

afterEach(() => {
  for (const el of mounted) {
    Alpine.destroyTree(el);
    el.remove();
  }
  mounted.length = 0;
  vi.restoreAllMocks();
});

// ── 1. Collab ownership ─────────────────────────────────────────────────────

/**
 * Minimal stand-ins for the collab addon's four exports. The real ones drag in yjs;
 * destroy() only cares that the things the canvas CONSTRUCTED get torn down, so the
 * stubs just record their own teardown.
 */
function registerStubCollabAddon(): { bridgeDestroys: () => number; awarenessDestroys: () => number } {
  let bridgeDestroys = 0;
  let awarenessDestroys = 0;

  registerAddon('collab', {
    Doc: class { },
    Awareness: class { constructor(_doc: unknown) { } },
    CollabBridge: class {
      constructor(_doc: unknown, _canvas: unknown, _provider: unknown) { }
      destroy(): void { bridgeDestroys += 1; }
    },
    CollabAwareness: class {
      constructor(_awareness: unknown, _user: unknown) { }
      updateCursor(_pos: unknown): void { }
      destroy(): void { awarenessDestroys += 1; }
    },
  });

  return { bridgeDestroys: () => bridgeDestroys, awarenessDestroys: () => awarenessDestroys };
}

function stubProvider() {
  return {
    connect: vi.fn(),
    disconnect: vi.fn(),
    destroy: vi.fn(),
    connected: true,
    roomId: 'test-room',
    on: vi.fn(),
    off: vi.fn(),
  };
}

describe('flowCanvas.destroy() — collab ownership', () => {
  it('destroys the bridge and awareness it CREATED, but never the caller-supplied provider', () => {
    const collab = registerStubCollabAddon();
    const provider = stubProvider();

    const canvas = mountCanvas({
      collab: { provider, user: { name: 'Zach', color: '#f00' } },
    } as Partial<FlowCanvasConfig>);

    expect(provider.connect).toHaveBeenCalledTimes(1); // control: collab really did init

    canvas.destroy();

    // Created by the canvas → destroyed by the canvas.
    expect(collab.bridgeDestroys()).toBe(1);
    expect(collab.awarenessDestroys()).toBe(1);

    // Constructed by the APP and passed in. Nothing forbids sharing one provider across
    // two canvases, so destroying it here would silently kill collaboration on every
    // other canvas still mounted on it. The app owns it; the app destroys it.
    expect(provider.destroy).not.toHaveBeenCalled();
  });

  it('leaves a provider shared by two canvases working after one of them is destroyed', () => {
    registerStubCollabAddon();
    const provider = stubProvider();

    const a = mountCanvas({ collab: { provider, user: { name: 'A', color: '#f00' } } } as Partial<FlowCanvasConfig>);
    mountCanvas({ collab: { provider, user: { name: 'B', color: '#00f' } } } as Partial<FlowCanvasConfig>);

    a.destroy();

    // Canvas B is still mounted on this provider.
    expect(provider.destroy).not.toHaveBeenCalled();
  });
});

// ── 2. A throwing user callback cannot abort Alpine's cleanup ───────────────

describe('flowCanvas.destroy() — hardened against user callbacks', () => {
  it('does not let a throwing onDestroy escape, and finishes the teardown anyway', () => {
    const onDestroy = vi.fn(() => { throw new Error('consumer callback blew up'); });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    const canvas = mountCanvas({ onDestroy } as Partial<FlowCanvasConfig>);
    expect(canvas._panZoom).not.toBeNull(); // control

    // Alpine runs destroy() UNWRAPPED inside cleanupAttributes(). A throw escaping here
    // aborts Alpine's own cleanup loop: the remaining directive undo()s never run and
    // `_x_dataStack` leaks.
    expect(() => canvas.destroy()).not.toThrow();

    expect(onDestroy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalled(); // swallowed, but loudly

    // …and everything AFTER the _emit('destroy') still ran.
    expect(canvas._panZoom).toBeNull();
    expect(canvas._handleDelegationCleanup).toBeNull();
    expect(canvas._container.hasAttribute('data-flow-canvas')).toBe(false);
  });
});

// ── 3. Animation teardown happens once, in _destroyAnimations() ─────────────

describe('flowCanvas.destroy() — animation teardown', () => {
  it('stops the animator and clears active timelines, then drops the reference', async () => {
    const canvas = mountCanvas();
    await Alpine.nextTick();

    const stopAll = vi.fn();
    canvas._animator = { stopAll };
    canvas._activeTimelines.add({ stop: vi.fn() });

    canvas.destroy();

    // `_destroyAnimations()` owns all three: stopAll, destroyParticles, and
    // stop-and-clear every active timeline. destroy() must not re-do any of it.
    expect(stopAll).toHaveBeenCalledTimes(1);
    expect(canvas._activeTimelines.size).toBe(0);
    expect(canvas._animator).toBeNull();
  });
});
