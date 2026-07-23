// @vitest-environment jsdom
// ============================================================================
// _computeCrossingPlan — crossing-reduction lane offsets (WS-3, Task 4)
//
// Mounts a REAL flowCanvas (mirroring flow-canvas-endpoint-spread.test.ts) so
// the plan pass reads genuine reactive node/edge state through Alpine.raw, base-
// routes each opted-in edge against the shared obstacle snapshot, and mutates
// `_crossingPlan` in place — exactly like `_endpointSpreadGrouping`.
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

function makeNode(id: string, x: number, y: number, w: number, h: number): FlowNode {
  return {
    id,
    type: 'default',
    position: { x, y },
    dimensions: { width: w, height: h },
    data: {},
  } as FlowNode;
}

// Verified via findRoute probe. A tall central obstacle `mid` (padded band
// 130..370) forces both edges to detour UP to a horizontal interior run at
// y=130 spanning x 280..470 — the SAME channel. The two source rows sit 50px
// apart so neither edge's endpoint falls inside the other's padded obstacle.
//   e1: a(centre 75,180) → c(675,180)  → run at 130, bary 180
//   e2: b(centre 75,230) → d(675,230)  → run at 130, bary 230
// bary asc (e1 < e2) → e1 lane -gap/2, e2 lane +gap/2.
const CORRIDOR_NODES: FlowNode[] = [
  makeNode('a', 0, 170, 150, 20),   // centre y=180
  makeNode('c', 600, 170, 150, 20),
  makeNode('b', 0, 220, 150, 20),   // centre y=230
  makeNode('d', 600, 220, 150, 20),
  makeNode('mid', 300, 150, 150, 200), // centre y=250, padded 130..370
];
const CORRIDOR_EDGES: FlowEdge[] = [
  { id: 'e1', source: 'a', target: 'c', type: 'avoidant' },
  { id: 'e2', source: 'b', target: 'd', type: 'avoidant' },
] as FlowEdge[];

afterEach(() => {
  for (const el of mounted) {
    Alpine.destroyTree(el);
    el.remove();
  }
  mounted.length = 0;
});

describe('_computeCrossingPlan (WS-3)', () => {
  it('is empty when the flag is off', () => {
    const canvas = mountCanvas({ nodes: CORRIDOR_NODES, edges: CORRIDOR_EDGES, defaultEdgeType: 'avoidant' });
    canvas._commitNodeGeometry();
    canvas._computeCrossingPlan();
    expect(canvas._crossingPlan === null || canvas._crossingPlan.size === 0).toBe(true);
  });

  it('assigns opposite-signed lane offsets to two edges sharing a corridor', () => {
    const canvas = mountCanvas({
      avoidantCrossingReduction: { channelGap: 12 },
      defaultEdgeType: 'avoidant',
      nodes: CORRIDOR_NODES,
      edges: CORRIDOR_EDGES,
    });
    canvas._commitNodeGeometry();          // builds the obstacle snapshot the plan routes against
    canvas._computeCrossingPlan();
    const o1 = canvas._crossingPlan!.get('e1') ?? 0;
    const o2 = canvas._crossingPlan!.get('e2') ?? 0;
    expect(Math.sign(o1)).toBe(-Math.sign(o2)); // separated into opposite lanes
    expect(Math.abs(o1)).toBeCloseTo(6);        // centred: ±gap/2 for a 2-edge channel
    expect(Math.abs(o2)).toBeCloseTo(6);
  });

  it('keeps the same Map reference across recomputes (reference stability)', () => {
    const canvas = mountCanvas({ avoidantCrossingReduction: true, nodes: [], edges: [] });
    canvas._computeCrossingPlan();
    const ref = canvas._crossingPlan;
    canvas._computeCrossingPlan();
    expect(canvas._crossingPlan).toBe(ref);
  });
});
