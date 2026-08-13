// @vitest-environment jsdom
// ============================================================================
// The canvas gestures underneath the chrome — the overlays that are directives
//
// Every overlay drawn inside the container sits in the bubble path of the
// canvas's own pan and zoom. Four of them swallow those gestures so a press
// aimed at the chrome is not also a press on the canvas, and three of the four
// were missing `dblclick` — so a double-click inside a panel zoomed the canvas
// underneath it.
//
// The controls and the minimap are covered in their own files; these are the
// two that are Alpine directives.
// ============================================================================

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowPanelDirective } from './flow-panel';
import { registerFlowDevtoolsDirective } from './flow-devtools';
import { CANVAS_GESTURES } from '../../core/canvas-gestures';

beforeAll(() => {
  registerFlowPanelDirective(Alpine);
  registerFlowDevtoolsDirective(Alpine);
});

const mounted: HTMLElement[] = [];

afterEach(() => {
  while (mounted.length > 0) {
    mounted.pop()?.remove();
  }
  vi.restoreAllMocks();
});

/** A panel inside a container, the way the canvas draws one. */
function mountPanel(): { container: HTMLElement; panel: HTMLElement; inside: HTMLElement } {
  const container = document.createElement('div');
  container.className = 'flow-container';

  const panel = document.createElement('div');
  panel.setAttribute('x-flow-panel', '');

  const inside = document.createElement('button');
  inside.textContent = 'Something to press';
  panel.appendChild(inside);

  container.appendChild(panel);
  document.body.appendChild(container);
  mounted.push(container);

  Alpine.initTree(container);

  return { container, panel, inside };
}

function fire(el: HTMLElement, type: string): void {
  el.dispatchEvent(type === 'wheel'
    ? new WheelEvent(type, { bubbles: true, cancelable: true })
    : new MouseEvent(type, { bubbles: true, cancelable: true }));
}

let devtoolsMounts = 0;

/** The devtools overlay, which needs a canvas scope and a `.flow-container` to attach to. */
function mountDevtools(): { container: HTMLElement; devtools: HTMLElement } {
  const container = document.createElement('div');
  container.className = 'flow-container';

  const name = `gestureCanvas${++devtoolsMounts}`;
  Alpine.data(name, () => ({
    nodes: [] as any[],
    edges: [] as any[],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedNodes: new Set<string>(),
    selectedEdges: new Set<string>(),
    getNode: () => undefined,
  }));
  container.setAttribute('x-data', name);

  const devtools = document.createElement('div');
  devtools.setAttribute('x-flow-devtools', '');
  container.appendChild(devtools);

  document.body.appendChild(container);
  mounted.push(container);

  Alpine.initTree(container);

  return { container, devtools };
}

describe('x-flow-panel — the canvas gestures underneath', () => {
  it.each([...CANVAS_GESTURES])('keeps %s inside the panel', (gesture) => {
    const { container, inside } = mountPanel();
    const reachedCanvas = vi.fn();
    container.addEventListener(gesture, reachedCanvas);

    fire(inside, gesture);

    expect(reachedCanvas).not.toHaveBeenCalled();
  });

  it('still lets what is inside the panel do its own work', () => {
    // Swallowing at the panel must not disarm the controls it holds — a panel that eats its own
    // clicks is worse than one that leaks them.
    const { inside } = mountPanel();
    const pressed = vi.fn();
    inside.addEventListener('dblclick', pressed);

    fire(inside, 'dblclick');

    expect(pressed).toHaveBeenCalledTimes(1);
  });

  it('lets a gesture aimed at the canvas itself through', () => {
    // The check that this test can fail: only the panel's own events are stopped.
    const { container } = mountPanel();
    const reachedCanvas = vi.fn();
    container.addEventListener('dblclick', reachedCanvas);

    fire(container, 'dblclick');

    expect(reachedCanvas).toHaveBeenCalledTimes(1);
  });
});

describe('x-flow-devtools — the canvas gestures underneath', () => {
  // Dev-only, so lower stakes — but it stopped `wheel` alone, which is the lightest version of
  // the same omission: everything else it was drawn over answered gestures aimed at it.
  it.each([...CANVAS_GESTURES])('keeps %s inside the overlay', (gesture) => {
    const { container, devtools } = mountDevtools();
    const reachedCanvas = vi.fn();
    container.addEventListener(gesture, reachedCanvas);

    fire(devtools, gesture);

    expect(reachedCanvas).not.toHaveBeenCalled();
  });

  it('still opens and closes on its own toggle', () => {
    // The overlay's own button is the thing it exists for; isolation must not reach it.
    const { devtools } = mountDevtools();
    const toggle = devtools.querySelector('.flow-devtools-toggle') as HTMLElement;
    const panel = devtools.querySelector('.flow-devtools-panel') as HTMLElement;

    expect(toggle).not.toBeNull();
    expect(panel.style.display).toBe('none');

    toggle.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(panel.style.display).toBe('');

    toggle.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(panel.style.display).toBe('none');
  });
});
