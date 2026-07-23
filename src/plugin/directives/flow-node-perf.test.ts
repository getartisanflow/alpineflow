// @vitest-environment jsdom
// ============================================================================
// x-flow-node — perf behaviour (mounted directive)
//
// A node's position changes on every pointermove during a drag. The position
// write lives in its OWN lean effect, split out of the main node effect, so a
// position-only change re-positions the element WITHOUT re-running the heavy
// effect (base/selected/validation/runState/shape/custom classes, dimensions,
// inline styles, rotation). This is the regression guard for the drag-smoothness
// fix — if position ever moves back into the monolithic effect, test #1 fails.
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowNodeDirective } from './flow-node';

function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

let mountCounter = 0;

function baseCanvas(): () => Record<string, any> {
  return () => ({
    nodes: [{ id: 'n1', type: 'default', position: { x: 10, y: 20 }, data: { label: 'N1' } }],
    edges: [] as any[],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedNodes: new Set<string>(),
    selectedEdges: new Set<string>(),
    _config: { nodeOrigin: [0, 0] },
    _childrenIds: new Map<string, string[]>(),
    _shapeRegistry: {} as Record<string, any>,
    _nodeElements: new Map<string, HTMLElement>(),
    getNode(id: string) {
      return (this.nodes as any[]).find((n) => n.id === id);
    },
    getAbsolutePosition(id: string) {
      const n = this.getNode(id);
      return n ? n.position : { x: 0, y: 0 };
    },
  });
}

function mount(canvasFactory = baseCanvas()) {
  clearChildren(document.body);
  const host = document.createElement('div');
  host.classList.add('flow-container');
  host.setAttribute('data-flow-canvas', '');
  const dataName = `canvas${++mountCounter}`;
  host.setAttribute('x-data', dataName);

  const nodeEl = document.createElement('div');
  nodeEl.setAttribute('x-flow-node', 'nodes[0]');
  nodeEl.setAttribute('data-flow-node-id', 'n1');
  host.appendChild(nodeEl);

  Alpine.data(dataName, canvasFactory);
  document.body.appendChild(host);
  Alpine.initTree(host);

  return { host, nodeEl, scope: () => Alpine.$data(host) as any };
}

beforeEach(() => {
  registerFlowNodeDirective(Alpine);
  if (!(Alpine as any).__started) {
    Alpine.start();
    (Alpine as any).__started = true;
  }
});

describe('x-flow-node — split position effect (drag perf)', () => {
  it('a position-only change re-positions the node but does NOT re-run the heavy effect', async () => {
    const { nodeEl, scope } = mount();
    await Alpine.nextTick();
    expect(nodeEl.style.left).toBe('10px'); // lean position effect ran on mount
    expect(nodeEl.style.top).toBe('20px');

    // The heavy effect's initial run is DEFERRED (~2 animation frames after mount in
    // jsdom) and applies the base classes via a single `classList.add('flow-node',
    // 'nopan')`. The previous guard waited on `classList.contains('flow-node')` — a
    // state read — and installed the spy AFTER it, but that state flip and the deferred
    // add resolve within a sub-millisecond of each other, so under full-suite CPU
    // contention the spy occasionally installed in the gap just before the add fired
    // and caught the initial application, misreading it as a heavy-effect re-run.
    //
    // Close the race by synchronising on the spy itself instead of a state read:
    // install it FIRST, wait until it has actually recorded the initial base-class add,
    // then clear it. Anything the spy sees after that is caused solely by the
    // position-only change below (the heavy effect applies base classes exactly once —
    // it has no second settling run).
    const addSpy = vi.spyOn(nodeEl.classList, 'add');
    const removeSpy = vi.spyOn(nodeEl.classList, 'remove');
    await vi.waitFor(() => expect(addSpy).toHaveBeenCalledWith('flow-node', 'nopan'));
    addSpy.mockClear();
    removeSpy.mockClear();

    scope().nodes[0].position.x = 250; // the drag case: a position-only change
    scope().nodes[0].position.y = 260;
    await Alpine.nextTick();

    expect(nodeEl.style.left).toBe('250px'); // lean effect re-ran → repositioned
    expect(nodeEl.style.top).toBe('260px');
    // The heavy effect touches classList on every run; it must NOT have re-run.
    expect(addSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('a non-position change still re-runs the heavy effect (not over-split)', async () => {
    const { nodeEl, scope } = mount();
    await Alpine.nextTick();

    const addSpy = vi.spyOn(nodeEl.classList, 'add');
    scope().selectedNodes = new Set(['n1']); // a heavy-effect concern (selected class)
    await Alpine.nextTick();

    expect(addSpy).toHaveBeenCalledWith('flow-node-selected'); // heavy effect re-ran
  });
});
