// @vitest-environment jsdom
// ============================================================================
// _computeEndpointGrouping — endpoint-spread lane assignment (WS-2, Task 3)
//
// Mounts a REAL flowCanvas (mirroring canvas-geometry-commit.test.ts) so the
// grouping pass reads genuine reactive node/edge state through Alpine.raw and
// mutates `_endpointSpreadGrouping` in place, exactly like `_obstacleSnapshot`.
// ============================================================================

import { describe, it, expect, afterEach } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import type { FlowNode, FlowEdge, FlowCanvasConfig } from '../../core/types';

let pluginRegistered = false;
const mounted: HTMLElement[] = [];

function ensurePluginRegistered() {
  if (pluginRegistered) return;
  (window as any).Alpine = Alpine;
  Alpine.plugin(AlpineFlow);
  Alpine.start();
  pluginRegistered = true;
}

/** Mount a `flowCanvas(config)` and return its reactive Alpine scope. */
function mountCanvas(config: FlowCanvasConfig = {}): any {
  ensurePluginRegistered();

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

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    type: 'default',
    position: { x: 0, y: 0 },
    dimensions: { width: 150, height: 50 },
    data: {},
    ...overrides,
  } as FlowNode;
}

afterEach(() => {
  for (const el of mounted) {
    Alpine.destroyTree(el);
    el.remove();
  }
  mounted.length = 0;
});

describe('_computeEndpointGrouping (WS-2)', () => {
  it('assigns one lane per edge sharing (node, handle), 0 for singletons', () => {
    const canvas = mountCanvas({
      avoidantEndpointSpread: true,
      defaultEdgeType: 'avoidant',
      nodes: [
        makeNode('a', { position: { x: 0, y: 300 } }),
        makeNode('b', { position: { x: 0, y: 100 } }),
        makeNode('c', { position: { x: 0, y: 500 } }),
        makeNode('hub', { position: { x: 400, y: 300 } }),
        makeNode('z', { position: { x: 400, y: 900 } }),
      ],
      edges: [
        { id: 'e1', source: 'a', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
        { id: 'e2', source: 'b', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
        { id: 'e3', source: 'c', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
        { id: 'e4', source: 'a', target: 'z', targetHandle: 'id-l', type: 'avoidant' },
      ] as FlowEdge[],
    });

    canvas._computeEndpointGrouping();
    const g = canvas._endpointSpreadGrouping!.get('hub|id-l')!;
    expect(g.count).toBe(3);
    // ordered by opposite-endpoint (source) Y ascending: b(100) < a(300) < c(500)
    expect(g.lanes.get('e2')).toBe(0);
    expect(g.lanes.get('e1')).toBe(1);
    expect(g.lanes.get('e3')).toBe(2);
    // singleton handle → count 1
    expect(canvas._endpointSpreadGrouping!.get('z|id-l')!.count).toBe(1);
  });

  it('keeps the same Map reference across recomputes (reference stability)', () => {
    const canvas = mountCanvas({ avoidantEndpointSpread: true, nodes: [], edges: [] });
    canvas._computeEndpointGrouping();
    const ref = canvas._endpointSpreadGrouping;
    canvas._computeEndpointGrouping();
    expect(canvas._endpointSpreadGrouping).toBe(ref); // mutated in place, not reassigned
  });

  it('re-lanes and dirties the group when an edge is added to a shared handle', () => {
    const canvas = mountCanvas({
      avoidantEndpointSpread: true,
      defaultEdgeType: 'avoidant',
      nodes: [
        makeNode('a', { position: { x: 0, y: 300 } }),
        makeNode('b', { position: { x: 0, y: 100 } }),
        makeNode('c', { position: { x: 0, y: 500 } }),
        makeNode('d', { position: { x: 0, y: 700 } }),
        makeNode('hub', { position: { x: 400, y: 300 } }),
      ],
      edges: [
        { id: 'e1', source: 'a', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
        { id: 'e2', source: 'b', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
        { id: 'e3', source: 'c', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
      ] as FlowEdge[],
    });
    canvas._computeEndpointGrouping();
    expect(canvas._endpointSpreadGrouping!.get('hub|id-l')!.count).toBe(3);

    // addEdges must re-lane the group (via the wired _computeEndpointGrouping)
    // and dirty its members so they re-route.
    canvas.addEdges({ id: 'e4', source: 'd', target: 'hub', targetHandle: 'id-l', type: 'avoidant' } as FlowEdge);

    const g = canvas._endpointSpreadGrouping!.get('hub|id-l')!;
    expect(g.count).toBe(4);
    expect(g.lanes.get('e4')).toBe(3); // d (y700) sorts last
    // group count changed (3 → 4) → every member re-spaces → all dirtied.
    expect(canvas._edgeDirtyTicks.get('e4')).toBeGreaterThanOrEqual(1);
    expect(canvas._edgeDirtyTicks.get('e1')).toBeGreaterThanOrEqual(1);
  });

  it('re-lanes and dirties survivors when an edge is removed from a shared handle', () => {
    const canvas = mountCanvas({
      avoidantEndpointSpread: true,
      defaultEdgeType: 'avoidant',
      nodes: [
        makeNode('a', { position: { x: 0, y: 300 } }),
        makeNode('b', { position: { x: 0, y: 100 } }),
        makeNode('c', { position: { x: 0, y: 500 } }),
        makeNode('hub', { position: { x: 400, y: 300 } }),
      ],
      edges: [
        { id: 'e1', source: 'a', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
        { id: 'e2', source: 'b', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
        { id: 'e3', source: 'c', target: 'hub', targetHandle: 'id-l', type: 'avoidant' },
      ] as FlowEdge[],
    });
    canvas._computeEndpointGrouping();
    expect(canvas._endpointSpreadGrouping!.get('hub|id-l')!.count).toBe(3);

    canvas.removeEdges('e2'); // middle lane removed → survivors re-space

    const g = canvas._endpointSpreadGrouping!.get('hub|id-l')!;
    expect(g.count).toBe(2);
    // b(100) < a(300) < c(500); with e2 gone: a→0, c→1
    expect(g.lanes.get('e1')).toBe(0);
    expect(g.lanes.get('e3')).toBe(1);
    expect(canvas._edgeDirtyTicks.get('e1')).toBeGreaterThanOrEqual(1);
  });
});
