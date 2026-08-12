// @vitest-environment jsdom
// ============================================================================
// selection-context-menu — what a right-click on a selection is told about
//
// Mounts a REAL flowCanvas (mirroring flow-canvas-crossing.test.ts) and
// right-clicks the pane with a selection made, because the payload is assembled
// in the DOM handler and nowhere else.
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

afterEach(() => {
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
});
