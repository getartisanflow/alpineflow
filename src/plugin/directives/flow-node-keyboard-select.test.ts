// @vitest-environment jsdom
// ============================================================================
// x-flow-node — keyboard activation (Enter/Space) vs. the selectable gate
//
// The mouse path emits `node-click` and *then* asks whether the node may be
// selected. This file pins the keyboard path to the same order: the click
// happened either way, only the selection is gated. Mirrors the mounted-
// directive harness in flow-node-drag-degradation.test.ts.
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';

vi.mock('../../core/drag', () => ({
  createDrag: vi.fn(() => ({ destroy: vi.fn() })),
}));

import { registerFlowNodeDirective } from './flow-node';

function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

let mountCounter = 0;

type NodeOpts = { selectable?: boolean };

function node(id: string, opts: NodeOpts = {}): Record<string, unknown> {
  const n: Record<string, unknown> = { id, type: 'default', position: { x: 0, y: 0 }, data: {} };
  if (opts.selectable !== undefined) n.selectable = opts.selectable;
  return n;
}

function baseCanvas(
  nodes: Record<string, unknown>[],
  config: Record<string, unknown>,
): () => Record<string, unknown> {
  return () => ({
    nodes,
    edges: [] as unknown[],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedNodes: new Set<string>(),
    selectedEdges: new Set<string>(),
    _config: { nodeOrigin: [0, 0], autoPanOnNodeDrag: false, ...config } as Record<string, unknown>,
    _shortcuts: { multiSelect: 'meta' } as Record<string, unknown>,
    _childrenIds: new Map<string, string[]>(),
    _shapeRegistry: {} as Record<string, unknown>,
    _nodeElements: new Map<string, HTMLElement>(),
    _draggingNodeIds: new Set<string>(),
    _commitNodeGeometry: vi.fn(),
    _emit: vi.fn(),
    _emitSelectionChange: vi.fn(),
    deselectAll: vi.fn(),
    getNode(this: { nodes: Array<{ id: string }> }, id: string) {
      return this.nodes.find((n) => n.id === id);
    },
    getAbsolutePosition(this: { getNode: (id: string) => { position: unknown } | undefined }, id: string) {
      const n = this.getNode(id);
      return n ? n.position : { x: 0, y: 0 };
    },
  });
}

function mount(nodes: Record<string, unknown>[], config: Record<string, unknown> = {}) {
  clearChildren(document.body);
  const host = document.createElement('div');
  host.classList.add('flow-container');
  host.setAttribute('data-flow-canvas', '');
  const dataName = `keyboardSelectCanvas${++mountCounter}`;
  host.setAttribute('x-data', dataName);

  const nodeEl = document.createElement('div');
  nodeEl.setAttribute('x-flow-node', 'nodes[0]');
  nodeEl.setAttribute('data-flow-node-id', nodes[0].id as string);
  host.appendChild(nodeEl);

  Alpine.data(dataName, baseCanvas(nodes, config));
  document.body.appendChild(host);
  Alpine.initTree(host);

  return { host, nodeEl, scope: () => Alpine.$data(host) as Record<string, any> };
}

beforeEach(() => {
  registerFlowNodeDirective(Alpine);
  if (!(Alpine as unknown as { __started?: boolean }).__started) {
    Alpine.start();
    (Alpine as unknown as { __started?: boolean }).__started = true;
  }
});

/** Press Enter on the node wrapper itself — what a focused node receives. */
function pressEnter(el: HTMLElement) {
  const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
  Object.defineProperty(ev, 'target', { value: el });
  el.dispatchEvent(ev);
  return ev;
}

function nodeClickEmits(canvas: Record<string, any>) {
  return vi.mocked(canvas._emit).mock.calls.filter((c: unknown[]) => c[0] === 'node-click');
}

describe('x-flow-node — keyboard activation vs. the selectable gate', () => {
  it('emits node-click on Enter when the canvas says nodes are not selectable', async () => {
    const { nodeEl, scope } = mount([node('n1')], { nodesSelectable: false });
    await Alpine.nextTick();
    const canvas = scope();

    pressEnter(nodeEl);

    expect(nodeClickEmits(canvas)).toHaveLength(1);
  });

  it('does not select on Enter when the canvas says nodes are not selectable', async () => {
    const { nodeEl, scope } = mount([node('n1')], { nodesSelectable: false });
    await Alpine.nextTick();
    const canvas = scope();

    pressEnter(nodeEl);

    expect(canvas.selectedNodes.size).toBe(0);
    expect(canvas.nodes[0].selected).toBeUndefined();
    expect(canvas._emitSelectionChange).not.toHaveBeenCalled();
  });

  it('emits node-click on Enter for a node that opted out on an otherwise selectable canvas', async () => {
    const { nodeEl, scope } = mount([node('n1', { selectable: false })]);
    await Alpine.nextTick();
    const canvas = scope();

    pressEnter(nodeEl);

    expect(nodeClickEmits(canvas)).toHaveLength(1);
    expect(canvas.selectedNodes.size).toBe(0);
  });

  it('still selects on Enter by default', async () => {
    const { nodeEl, scope } = mount([node('n1')]);
    await Alpine.nextTick();
    const canvas = scope();

    pressEnter(nodeEl);

    expect(nodeClickEmits(canvas)).toHaveLength(1);
    expect(canvas.selectedNodes.has('n1')).toBe(true);
    expect(canvas.nodes[0].selected).toBe(true);
    expect(canvas._emitSelectionChange).toHaveBeenCalled();
  });

  it('still selects on Enter for a node that opts in on a non-selectable canvas', async () => {
    const { nodeEl, scope } = mount([node('n1', { selectable: true })], { nodesSelectable: false });
    await Alpine.nextTick();
    const canvas = scope();

    pressEnter(nodeEl);

    expect(canvas.selectedNodes.has('n1')).toBe(true);
    expect(canvas.nodes[0].selected).toBe(true);
  });
});
