// @vitest-environment jsdom
// ============================================================================
// `controlsDuration` — how long the viewport takes to answer a control
//
// Mounts a REAL flowCanvas (mirroring canvas-interactive-config.test.ts) so the
// buttons the panel builds are the ones being pressed, rather than handlers
// restated in the test.
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

function mountCanvas(config: FlowCanvasConfig = {}): { scope: any; el: HTMLElement } {
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

  return { scope: Alpine.$data(el), el };
}

/**
 * Record what a viewport method is handed, and stop it there.
 *
 * Assignment rather than `vi.spyOn`: the panel's handlers are built as `() => this.zoomIn(…)`
 * during init, and they reach the method through the component itself — a spy installed on the
 * object `$data` hands back is not the one they call.
 */
function record(scope: any, method: 'zoomIn' | 'zoomOut' | 'fitView'): Array<Record<string, unknown>> {
  const calls: Array<Record<string, unknown>> = [];

  Alpine.raw(scope)[method] = (options: Record<string, unknown>) => {
    calls.push(options);
  };

  return calls;
}

/** Press a control by the label the panel gives it. */
function press(el: HTMLElement, label: string): void {
  const button = el.querySelector(`.flow-controls button[aria-label="${label}"]`) as HTMLElement | null;

  expect(button, `no control labelled "${label}"`).not.toBeNull();

  button!.click();
}

afterEach(() => {
  vi.restoreAllMocks();
  while (mounted.length) {
    mounted.pop()?.remove();
  }
});

describe('flowCanvas — controlsDuration', () => {
  it('hands each control the duration it was configured with', () => {
    const { scope, el } = mountCanvas({ controls: true, controlsDuration: 250 });

    const zoomIn = record(scope, 'zoomIn');
    const zoomOut = record(scope, 'zoomOut');
    const fitView = record(scope, 'fitView');

    press(el, 'Zoom in');
    press(el, 'Zoom out');
    press(el, 'Fit view');

    expect(zoomIn).toEqual([{ duration: 250 }]);
    expect(zoomOut).toEqual([{ duration: 250 }]);
    expect(fitView[0]).toMatchObject({ duration: 250 });
  });

  it('jumps by default, which is what these buttons did before', () => {
    // The knob is opt-in on purpose: a control that suddenly glides is a timing change for
    // everybody who has one on screen, and `duration: 0` takes the same synchronous road the
    // panel took when it passed nothing at all.
    const { scope, el } = mountCanvas({ controls: true });

    const zoomIn = record(scope, 'zoomIn');
    const fitView = record(scope, 'fitView');

    press(el, 'Zoom in');
    press(el, 'Fit view');

    expect(zoomIn).toEqual([{ duration: 0 }]);
    expect(fitView[0]).toMatchObject({ duration: 0 });
  });

  it('reads the config per press, so it can be changed after init', () => {
    const { scope, el } = mountCanvas({ controls: true, controlsDuration: 0 });

    const zoomIn = record(scope, 'zoomIn');

    press(el, 'Zoom in');
    scope._config.controlsDuration = 400;
    press(el, 'Zoom in');

    expect(zoomIn).toEqual([{ duration: 0 }, { duration: 400 }]);
  });

  it('keeps the padding fit view was already given', () => {
    // The duration is added to that call, not swapped for what was in it.
    const { scope, el } = mountCanvas({ controls: true, controlsDuration: 300 });

    const fitView = record(scope, 'fitView');

    press(el, 'Fit view');

    expect(fitView[0]).toHaveProperty('padding');
  });
});
