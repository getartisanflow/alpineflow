// @vitest-environment jsdom
// ============================================================================
// x-flow-node — _draggingNodeIds populate/clear (Workstream D)
//
// d3-drag can't be driven directly in jsdom (see core/drag.test.ts's doc
// comment), so this mocks core/drag's createDrag to capture the DragOptions
// object the directive builds, then invokes its onDragStart/onDragEnd
// callbacks directly — mirroring the mounted-directive pattern already used
// in flow-node-perf.test.ts, but exercising the drag lifecycle handlers
// instead of the render effect.
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';

vi.mock('../../core/drag', () => ({
  createDrag: vi.fn(() => ({ destroy: vi.fn() })),
}));

import { createDrag, type DragOptions } from '../../core/drag';
import { registerFlowNodeDirective } from './flow-node';

function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

let mountCounter = 0;

function node(id: string): Record<string, unknown> {
  return { id, type: 'default', position: { x: 0, y: 0 }, data: {} };
}

function baseCanvas(nodes: Record<string, unknown>[]): () => Record<string, unknown> {
  return () => ({
    nodes,
    edges: [] as unknown[],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedNodes: new Set<string>(),
    selectedEdges: new Set<string>(),
    // autoPanOnNodeDrag: false keeps onDragStart out of the createAutoPan
    // branch, which needs a much larger canvas mock (panZoom, etc.) — not
    // relevant to what this file is testing.
    _config: { nodeOrigin: [0, 0], autoPanOnNodeDrag: false } as Record<string, unknown>,
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

function mount(nodes: Record<string, unknown>[]) {
  clearChildren(document.body);
  const host = document.createElement('div');
  host.classList.add('flow-container');
  host.setAttribute('data-flow-canvas', '');
  const dataName = `dragDegCanvas${++mountCounter}`;
  host.setAttribute('x-data', dataName);

  const nodeEl = document.createElement('div');
  nodeEl.setAttribute('x-flow-node', 'nodes[0]');
  nodeEl.setAttribute('data-flow-node-id', nodes[0].id as string);
  host.appendChild(nodeEl);

  Alpine.data(dataName, baseCanvas(nodes));
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
  vi.mocked(createDrag).mockClear();
});

/** Grab the DragOptions the directive most recently passed to createDrag. */
function capturedDragOptions(): DragOptions {
  const calls = vi.mocked(createDrag).mock.calls;
  return calls[calls.length - 1][2];
}

describe('x-flow-node — _draggingNodeIds populate/clear (WS-D, avoidantSimplifyOnDrag)', () => {
  it('onDragStart adds the dragged node id to the reactive _draggingNodeIds set', async () => {
    const { scope } = mount([node('n1')]);
    await Alpine.nextTick();
    const canvas = scope();
    const options = capturedDragOptions();

    expect(canvas._draggingNodeIds.size).toBe(0);
    options.onDragStart!({ nodeId: 'n1', position: { x: 0, y: 0 }, sourceEvent: {} as MouseEvent });

    expect(canvas._draggingNodeIds.has('n1')).toBe(true);
    expect(canvas._draggingNodeIds.size).toBe(1);
  });

  it('onDragStart also adds group-drag members when the dragged node is part of a multi-selection', async () => {
    const nodes = [node('n1'), node('n2'), node('n3')];
    const { scope } = mount(nodes);
    await Alpine.nextTick();
    const canvas = scope();
    canvas.selectedNodes.add('n1');
    canvas.selectedNodes.add('n2');
    canvas.selectedNodes.add('n3');
    const options = capturedDragOptions();

    options.onDragStart!({ nodeId: 'n1', position: { x: 0, y: 0 }, sourceEvent: {} as MouseEvent });

    expect(canvas._draggingNodeIds.has('n1')).toBe(true);
    expect(canvas._draggingNodeIds.has('n2')).toBe(true);
    expect(canvas._draggingNodeIds.has('n3')).toBe(true);
    expect(canvas._draggingNodeIds.size).toBe(3);
  });

  it('onDragEnd clears _draggingNodeIds unconditionally, even for a plain click that never moved', async () => {
    const { scope } = mount([node('n1')]);
    await Alpine.nextTick();
    const canvas = scope();
    const options = capturedDragOptions();

    options.onDragStart!({ nodeId: 'n1', position: { x: 0, y: 0 }, sourceEvent: {} as MouseEvent });
    expect(canvas._draggingNodeIds.has('n1')).toBe(true);

    // No onDrag call in between — this is the plain-click case (didDrag stays false).
    options.onDragEnd!({ nodeId: 'n1', position: { x: 0, y: 0 }, sourceEvent: {} as MouseEvent });

    expect(canvas._draggingNodeIds.size).toBe(0);
  });

  it('prunes the id when the node directive is torn down mid-drag, before onDragEnd ever fires (interrupted-drag guard)', async () => {
    const { scope, nodeEl } = mount([node('n1')]);
    await Alpine.nextTick();
    const canvas = scope();
    const options = capturedDragOptions();

    options.onDragStart!({ nodeId: 'n1', position: { x: 0, y: 0 }, sourceEvent: {} as MouseEvent });
    expect(canvas._draggingNodeIds.has('n1')).toBe(true);

    // Directive torn down mid-gesture — e.g. a collaborator deletes the node
    // or the host component unmounts — with no onDragEnd ever firing.
    Alpine.destroyTree(nodeEl);

    expect(canvas._draggingNodeIds.has('n1')).toBe(false);
  });
});
