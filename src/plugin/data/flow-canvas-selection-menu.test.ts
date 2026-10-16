// @vitest-environment jsdom
// ============================================================================
// selection-context-menu — what a right-click on a selection is told about
//
// Mounts a REAL flowCanvas (mirroring flow-canvas-crossing.test.ts), because the
// payload is assembled in the DOM handlers and nowhere else.
//
// THREE ways open this menu — a right-click on the pane, a right-click on one of
// the selected nodes, a long press on a touch device — and each gathered the
// selection by hand, which is how the touch path came to send the nodes and
// forget the edges. Every one of them is exercised here, and so is the built-in
// menu state they fill, which dropped the edges again on its way in.
// ============================================================================

import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import type { FlowCanvasConfig } from '../../core/types';

// jsdom doesn't implement CSS.escape, which the edge directive calls once real nodes/edges render.
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

/** Mount a `flowCanvas(config)` and return its element and reactive Alpine scope. */
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

/**
 * Like `mountCanvas`, but also renders the nodes as real `x-flow-node` elements so the node
 * directive's own contextmenu handler is wired — the right-click-on-a-selected-node path.
 */
function mountCanvasWithNodeEls(config: FlowCanvasConfig = {}): { el: HTMLElement; canvas: any } {
  ensurePluginRegistered();

  const wrapper = document.createElement('div');
  (wrapper as any).__config = config;

  const el = document.createElement('div');
  el.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
  el.className = 'flow-container';
  el.innerHTML = `
    <div x-flow-viewport>
      <template x-for="node in nodes" :key="node.id">
        <div x-flow-node="node" :data-node-id="node.id"></div>
      </template>
    </div>`;
  wrapper.appendChild(el);

  document.body.appendChild(wrapper);
  mounted.push(wrapper);

  Alpine.initTree(wrapper);

  return { el, canvas: Alpine.$data(el) };
}

beforeEach(() => {
  // The long press is a timer, and the point of the test is what happens when it fires.
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  while (mounted.length) mounted.pop()?.remove();
});

describe('selection-context-menu', () => {
  const graph: FlowCanvasConfig = {
    nodes: [
      { id: 'n1', position: { x: 0, y: 0 }, data: {} },
      { id: 'n2', position: { x: 200, y: 0 }, data: {} },
      { id: 'n3', position: { x: 400, y: 0 }, data: {} },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  };

  it('carries the selected edges, not only the nodes', () => {
    // The Livewire bridge has always read `edges` off this payload
    // (`WIRE_PAYLOAD_MAP['selection-context-menu']`), and the payload never had them: a consumer
    // acting on a selection was handed half of it and told nothing about the other half.
    const { el, canvas } = mountCanvas(graph);

    canvas.selectedNodes.add('n1');
    canvas.selectedNodes.add('n2');
    canvas.selectedEdges.add('e1');

    let detail: any = null;
    el.addEventListener('flow-selection-context-menu', (e: any) => { detail = e.detail; });

    el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    expect(detail).not.toBeNull();
    expect(detail.nodes.map((n: any) => n.id)).toEqual(['n1', 'n2']);
    expect(detail.edges.map((edge: any) => edge.id)).toEqual(['e1']);
  });

  it('carries an empty list when nothing but nodes is selected', () => {
    // The shape does not change with the selection: a consumer reads `edges` and gets an array.
    const { el, canvas } = mountCanvas(graph);

    canvas.selectedNodes.add('n1');
    canvas.selectedNodes.add('n2');

    let detail: any = null;
    el.addEventListener('flow-selection-context-menu', (e: any) => { detail = e.detail; });

    el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    expect(detail.edges).toEqual([]);
  });

  it('gathers the same selection whichever way the menu is opened', () => {
    // One helper behind all three sites. Reading it directly is what makes the other tests here
    // about the WIRING rather than about the filtering.
    const { canvas } = mountCanvas(graph);

    canvas.selectedNodes.add('n1');
    canvas.selectedNodes.add('n2');
    canvas.selectedEdges.add('e2');

    const { nodes, edges } = canvas.getSelectedNodesAndEdges();

    expect(nodes.map((n: any) => n.id)).toEqual(['n1', 'n2']);
    expect(edges.map((edge: any) => edge.id)).toEqual(['e2']);
  });

  it('carries the edges when the menu is opened by a long press', () => {
    // The site the first pass missed. A long press is the default touch gesture, so on a phone
    // this WAS the bug the rest of the change fixes — just reached by a different finger.
    const { el, canvas } = mountCanvas(graph);

    canvas.selectedNodes.add('n1');
    canvas.selectedNodes.add('n2');
    canvas.selectedEdges.add('e1');

    let detail: any = null;
    el.addEventListener('flow-selection-context-menu', (e: any) => { detail = e.detail; });

    // The long press is watched on POINTER events, so this is the gesture as the helper sees it:
    // a touch pointer down, held, with nothing moving it far enough to cancel.
    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, cancelable: true, pointerType: 'touch', clientX: 10, clientY: 10,
    }));

    vi.advanceTimersByTime(1000);

    expect(detail, 'no menu opened — the long press never fired').not.toBeNull();
    expect(detail.edges.map((edge: any) => edge.id)).toEqual(['e1']);
  });

  it('carries the edges when a selected node itself is right-clicked', () => {
    // The third way the menu opens: a right-click on one of the selected nodes runs the node
    // directive's own handler (flow-node.ts), which — for a multi-selection — must open the
    // selection menu with the same nodes AND edges as the pane path, via the shared gather helper.
    vi.useRealTimers(); // rendering the x-flow-node elements runs on real microtasks
    const { el, canvas } = mountCanvasWithNodeEls(graph);

    canvas.selectedNodes.add('n1');
    canvas.selectedNodes.add('n2');
    canvas.selectedEdges.add('e1');

    let detail: any = null;
    el.addEventListener('flow-selection-context-menu', (e: any) => { detail = e.detail; });

    const nodeEl = el.querySelector('[data-node-id="n1"]') as HTMLElement | null;
    expect(nodeEl, 'the node element did not render').not.toBeNull();
    nodeEl!.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    expect(detail, 'right-clicking the selected node did not open the selection menu').not.toBeNull();
    expect(detail.nodes.map((n: any) => n.id)).toEqual(['n1', 'n2']);
    expect(detail.edges.map((edge: any) => edge.id)).toEqual(['e1']);
  });

  it('tells the built-in menu about the edges too', () => {
    // A plain-AlpineFlow menu binds to `contextMenu`, which is filled by a handler of the canvas's
    // own. It copied `nodes` and dropped `edges`, so the payload arrived whole and the menu still
    // could not act on the selection it was opened for.
    const { el, canvas } = mountCanvas(graph);

    canvas.selectedNodes.add('n1');
    canvas.selectedNodes.add('n2');
    canvas.selectedEdges.add('e1');

    el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    expect(canvas.contextMenu.type).toBe('selection');
    expect(canvas.contextMenu.nodes.map((n: any) => n.id)).toEqual(['n1', 'n2']);
    expect(canvas.contextMenu.edges.map((edge: any) => edge.id)).toEqual(['e1']);
  });

  it('leaves the edges empty on the menus that are not about a selection', () => {
    // The state object is assigned whole by every handler, so a field one of them forgets keeps
    // the LAST menu's value — a right-click on one node would show the previous selection's edges.
    const { el, canvas } = mountCanvas(graph);

    canvas.selectedNodes.add('n1');
    canvas.selectedNodes.add('n2');
    canvas.selectedEdges.add('e1');
    el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    canvas.selectedNodes.clear();
    canvas.selectedEdges.clear();
    el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

    expect(canvas.contextMenu.type).toBe('pane');
    expect(canvas.contextMenu.edges).toBeNull();
  });
});
