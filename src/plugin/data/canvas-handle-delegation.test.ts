// @vitest-environment jsdom
// ============================================================================
// flowCanvas — the CANVAS side of handle delegation (install + teardown)
//
// `handle-delegation.test.ts` covers the listener's BEHAVIOUR by calling
// `installHandleDelegation` by hand. This file covers the canvas's OWNERSHIP of
// that listener, which nothing else exercises:
//
//   1. `_initHandleDelegation()` actually installs one — on a REAL flowCanvas,
//      through the real `$nextTick` deferral, resolving the real `_viewportEl`.
//   2. `destroy()` actually takes it OFF. The listener is registered with the
//      capture flag; `removeEventListener` without that flag is a silent no-op,
//      so a leaked listener would keep a destroyed canvas alive and driving.
//   3. A canvas destroyed BEFORE the queued tick flushes never installs at all.
//      Alpine's `nextTick` runs off a global tickStack that component teardown
//      does not cancel, so the tick fires on a dead canvas — without a guard it
//      would install a capture listener holding the corpse.
//   4. `delegatedHandleEvents: false` stops the CANVAS installing (the per-handle
//      revert path is asserted in handle-delegation.test.ts).
//
// Mounts a real flowCanvas with real production markup (x-flow-viewport / x-for /
// x-flow-node / x-flow-handle), same harness pattern as canvas-culling.test.ts.
// ============================================================================

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
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
  nodes: [
    { id: 'a', position: { x: 0, y: 0 }, data: {} },
    { id: 'b', position: { x: 300, y: 0 }, data: {} },
  ],
  edges: [],
  // Deterministic: no rAF autopan loop, no fitView transform on mount.
  autoPanOnConnect: false,
  fitViewOnInit: false,
  controls: false,
  minimap: false,
};

/**
 * Mount a real `flowCanvas` with real node/handle markup. Returns the reactive
 * Alpine scope plus the wrapper, WITHOUT awaiting the tick — the destroy-race
 * test has to act inside the same task the install was queued in.
 */
function mountCanvas(config: Partial<FlowCanvasConfig> = {}): { canvas: any; wrapper: HTMLElement } {
  ensurePluginRegistered();

  const wrapper = document.createElement('div');
  (wrapper as any).__config = { ...BASE_CONFIG, ...config };

  const el = document.createElement('div');
  el.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
  el.className = 'flow-container';
  el.innerHTML = `
    <div x-flow-viewport>
      <template x-for="node in nodes" :key="node.id">
        <div x-flow-node="node">
          <div x-flow-handle:source></div>
          <div x-flow-handle:target></div>
        </div>
      </template>
    </div>
  `;
  wrapper.appendChild(el);

  document.body.appendChild(wrapper);
  mounted.push(wrapper);

  Alpine.initTree(wrapper);

  return { canvas: Alpine.$data(el) as any, wrapper };
}

function sourceHandle(): HTMLElement {
  const el = document.querySelector('[data-flow-handle-type="source"]') as HTMLElement | null;
  if (!el) throw new Error('no source handle was stamped — the harness markup is wrong');
  return el;
}

function pointerdown(target: Element, x = 10, y = 10): PointerEvent {
  const ev = new PointerEvent('pointerdown', {
    clientX: x, clientY: y, button: 0, bubbles: true, cancelable: true,
  });
  target.dispatchEvent(ev);
  return ev;
}

afterEach(() => {
  for (const el of mounted) {
    Alpine.destroyTree(el);
    el.remove();
  }
  mounted.length = 0;
});

describe('flowCanvas — delegated handle listener install', () => {
  it('installs one delegated listener on the viewport and drives a handle press', async () => {
    const { canvas } = mountCanvas();
    await Alpine.nextTick();

    expect(canvas._handleDelegationCleanup).toBeTypeOf('function');

    // The source gesture preventDefault()s unconditionally as its first statement,
    // so a defaultPrevented press is proof the delegated listener drove the canvas.
    // (The directive attaches NO per-handle pointerdown listener under delegation,
    // so there is nothing else that could have done it.)
    const ev = pointerdown(sourceHandle());
    expect(ev.defaultPrevented).toBe(true);

    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 10, clientY: 10 }));
  });
});

describe('flowCanvas — delegated handle listener teardown', () => {
  it('removes the listener on destroy(): a later handle press does nothing', async () => {
    const { canvas } = mountCanvas();
    await Alpine.nextTick();

    expect(pointerdown(sourceHandle()).defaultPrevented).toBe(true); // control
    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 10, clientY: 10 }));

    canvas.destroy();

    // The listener was registered WITH the capture flag; removing it without that
    // flag is a silent no-op and this press would still be prevented.
    const ev = pointerdown(sourceHandle());
    expect(ev.defaultPrevented).toBe(false);
    expect(canvas._handleDelegationCleanup).toBeNull();
  });

  it('never installs when the canvas is destroyed before the queued tick flushes', async () => {
    // x-if flipping false, a Livewire morph, Alpine.destroyTree in a test: the
    // component dies in the SAME task init() queued the install in. Alpine's
    // tickStack is global and does not cancel on teardown, so the callback still
    // fires — on a dead canvas.
    const { canvas, wrapper } = mountCanvas();
    const handle = sourceHandle();

    canvas.destroy();
    await Alpine.nextTick();

    expect(canvas._handleDelegationCleanup).toBeNull();

    // Nothing installed → no leaked capture listener on a viewport that outlived
    // its canvas, and no dead canvas driving a live press.
    const ev = pointerdown(handle);
    expect(ev.defaultPrevented).toBe(false);

    Alpine.destroyTree(wrapper);
  });
});

describe('flowCanvas — destroy() is the CANVAS destroy, not a mixin override', () => {
  // Mixins are applied onto the canvas with `Object.defineProperties`, so ANY mixin
  // method named `destroy` overwrites `flowCanvas`'s own. The animation mixin had
  // one, which took the whole canvas teardown body out of the lifecycle — silently,
  // for as long as it existed. F2's `_handleDelegationCleanup?.()` lives in that
  // body and was its most recent victim: the delegated listener could never come
  // off. This test fails the moment a mixin re-introduces a `destroy`.
  it('runs BOTH the canvas teardown and the animation teardown', async () => {
    const { canvas } = mountCanvas();
    await Alpine.nextTick();

    // Assigned rather than vi.spyOn'd: `canvas` is Alpine's merged $data proxy and
    // spyOn's descriptor dance does not survive it. A plain write does.
    let animationTeardowns = 0;
    canvas._destroyAnimations = () => { animationTeardowns += 1; };

    expect(canvas._panZoom).not.toBeNull(); // control: the canvas really did init

    canvas.destroy();

    // Canvas half — none of this ran while the mixin's destroy() was shadowing it.
    expect(canvas._panZoom).toBeNull();
    expect(canvas._container.hasAttribute('data-flow-canvas')).toBe(false);

    // Animation half — still runs, now BY the canvas destroy rather than instead of it.
    expect(animationTeardowns).toBe(1);
  });
});

describe('flowCanvas — delegatedHandleEvents: false', () => {
  it('stops the CANVAS from installing the delegated listener', async () => {
    const { canvas } = mountCanvas({ delegatedHandleEvents: false });
    await Alpine.nextTick();

    expect(canvas._handleDelegationCleanup).toBeNull();

    // …and the per-handle listener the directive re-attaches still drives it.
    const ev = pointerdown(sourceHandle());
    expect(ev.defaultPrevented).toBe(true);

    document.dispatchEvent(new PointerEvent('pointerup', { clientX: 10, clientY: 10 }));
  });
});
