// @vitest-environment jsdom
// ============================================================================
// Crossing reduction — integration at the edge seam (WS-3, Task 5)
//
// Mounts real x-flow-edge <g> directives against a hand-built reactive canvas
// (same stub pattern as flow-edge.test.ts / endpoint-spread-integration.test.ts —
// the established `d`-string test path), supplies a `_crossingPlan` on the canvas
// (Task 4 proves the real plan computation on a real canvas), and asserts the
// seam threads each edge's lane offset into the router:
//   • OFF (flag false / no plan) is BYTE-IDENTICAL to the no-config baseline.
//   • ON (plan present) shifts the shared-corridor edge's route (offset engaged).
//   • Deterministic: identical ON mounts render identical `d`.
// ============================================================================

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowEdgeDirective } from './flow-edge';

const SVG_NS = 'http://www.w3.org/2000/svg';

if (typeof globalThis.CSS === 'undefined') {
  (globalThis as unknown as { CSS: Partial<typeof CSS> }).CSS = {};
}
if (typeof CSS.escape !== 'function') {
  CSS.escape = (value: string) => String(value);
}

beforeAll(() => {
  registerFlowEdgeDirective(Alpine);
});

const mountedHosts: HTMLElement[] = [];
afterEach(() => {
  while (mountedHosts.length > 0) {
    mountedHosts.pop()?.remove();
  }
});

function flush(): Promise<void> {
  return new Promise<void>((resolve) => Alpine.nextTick(() => resolve()));
}

interface MockNode {
  id: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  data: Record<string, unknown>;
  [k: string]: unknown;
}
interface MockEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  [k: string]: unknown;
}

let canvasSeq = 0;

function mountEdges(
  nodes: MockNode[],
  edges: MockEdge[],
  opts: { config?: Record<string, unknown>; plan?: Map<string, number> | null } = {},
) {
  const host = document.createElement('div');
  const canvas = {
    nodes,
    edges,
    selectedRows: new Set<string>(),
    selectedEdges: new Set<string>(),
    selectedNodes: new Set<string>(),
    _layoutAnimTick: 0,
    _zoomLevel: 'close' as 'far' | 'medium' | 'close',
    viewport: { x: 0, y: 0, zoom: 1 },
    _config: { ...(opts.config ?? {}) } as Record<string, unknown>,
    _shapeRegistry: undefined as unknown,
    _nodeMap: new Map<string, MockNode>(),
    _nodeElements: new Map<string, HTMLElement>(),
    _id: 'xr-canvas',
    _obstacleSnapshot: null as Array<{ id: string; x: number; y: number; width: number; height: number }> | null,
    _edgeDirtyTicks: new Map<string, number>(),
    _edgeCorridors: new Map<string, { minX: number; minY: number; maxX: number; maxY: number }>(),
    _draggingNodeIds: new Set<string>(),
    // WS-3: crossing-reduction lane offsets. Hand-built here (the real
    // _computeCrossingPlan is proven on a real canvas in
    // flow-canvas-crossing.test.ts); this file proves the SEAM applies it.
    _crossingPlan: (opts.plan ?? null) as Map<string, number> | null,
    _commitNodeGeometry() {
      const rects = this.nodes.map((n) => ({
        id: n.id,
        x: n.position.x,
        y: n.position.y,
        width: n.dimensions.width,
        height: n.dimensions.height,
      }));
      if (this._obstacleSnapshot) {
        this._obstacleSnapshot.length = 0;
        this._obstacleSnapshot.push(...rects);
      } else {
        this._obstacleSnapshot = rects;
      }
      for (const e of this.edges) this._edgeDirtyTicks.set(e.id, (this._edgeDirtyTicks.get(e.id) ?? 0) + 1);
    },
    getNode(id: string) {
      return this.nodes.find((n) => n.id === id);
    },
    getEdge(id: string) {
      return this.edges.find((e) => e.id === id);
    },
    selectRow(key: string) {
      this.selectedRows.add(key);
    },
    deselectAll() {},
    _emitSelectionChange() {},
  };

  const scopeName = `__xrCanvas_${canvasSeq++}`;
  (window as unknown as Record<string, unknown>)[scopeName] = () => canvas;
  host.setAttribute('x-data', `${scopeName}()`);

  const containerEl = document.createElement('div');
  containerEl.className = 'flow-container';
  host.appendChild(containerEl);

  const svg = document.createElementNS(SVG_NS, 'svg');
  containerEl.appendChild(svg);

  const groups: SVGGElement[] = [];
  edges.forEach((_, i) => {
    const g = document.createElementNS(SVG_NS, 'g') as SVGGElement;
    g.setAttribute('x-flow-edge', `edges[${i}]`);
    svg.appendChild(g);
    groups.push(g);
  });

  document.body.appendChild(host);
  mountedHosts.push(host);
  Alpine.initTree(host);

  const data = Alpine.$data(host) as unknown as typeof canvas;
  const visiblePath = (g: SVGGElement): SVGPathElement => {
    const paths = g.querySelectorAll('path');
    return paths[paths.length - 1] as SVGPathElement;
  };
  return { host, data, groups, visiblePath };
}

// Fixture: two avoidant edges on separate rows, each forced to route around a
// tall shared obstacle `mid` — so each renders a REAL multi-segment orthogonal
// route (not the empty-obstacle bezier fast path) with an interior run the lane
// offset can shift. Distinct endpoints (no shared hub).
//
// The `_crossingPlan` below is a representative lane assignment. The correctness
// of the REAL plan (which edges group into a channel, and the barycenter-ordered
// offsets) is proven against a real canvas in flow-canvas-crossing.test.ts; this
// file proves the SEAM threads each edge's offset into the router.
function corridorNodes(): MockNode[] {
  return [
    { id: 'a1', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
    { id: 'b1', position: { x: 400, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
    { id: 'a2', position: { x: 0, y: 120 }, dimensions: { width: 100, height: 60 }, data: {} },
    { id: 'b2', position: { x: 400, y: 120 }, dimensions: { width: 100, height: 60 }, data: {} },
    { id: 'mid', position: { x: 200, y: -40 }, dimensions: { width: 100, height: 260 }, data: {} },
  ];
}
function corridorEdges(): MockEdge[] {
  return [
    { id: 'e1', source: 'a1', target: 'b1', type: 'avoidant' },
    { id: 'e2', source: 'a2', target: 'b2', type: 'avoidant' },
  ];
}
const CORRIDOR_PLAN = new Map<string, number>([['e1', -8], ['e2', 8]]);

/** Count `C` (cubic bezier) commands — a routed path has many; the empty-obstacle bezier fast path has exactly one. */
function countC(d: string): number {
  return (d.match(/C/g) ?? []).length;
}

async function dStrings(config: Record<string, unknown>, plan: Map<string, number> | null): Promise<string[]> {
  const h = mountEdges(corridorNodes(), corridorEdges(), { config, plan });
  h.data._commitNodeGeometry();
  await flush();
  await flush();
  return corridorEdges().map((_, i) => h.visiblePath(h.groups[i]).getAttribute('d') ?? '');
}

describe('crossing reduction — seam integration', () => {
  it('the fixture routes for real (multi-segment orthogonal, not the bezier fast path)', async () => {
    const baseline = await dStrings({}, null);
    // A real avoidant route emits one C per bend (many); the fast path emits one.
    baseline.forEach((d) => expect(countC(d)).toBeGreaterThan(1));
  });

  it('OFF is byte-identical to the no-config baseline (default-off parity)', async () => {
    // Gating is at plan COMPUTATION: `_computeCrossingPlan` yields an EMPTY plan
    // when the flag is off (proven in flow-canvas-crossing.test.ts), so the seam
    // never sees an offset. Off here = plan null → every route matches baseline.
    const baseline = await dStrings({}, null);
    const flagFalse = await dStrings({ avoidantCrossingReduction: false }, null);
    corridorEdges().forEach((e, i) => {
      expect(`${e.id}:${flagFalse[i]}`).toBe(`${e.id}:${baseline[i]}`);
    });
  });

  it('ON engages the seam: each planned edge is shifted vs the baseline route', async () => {
    const baseline = await dStrings({}, null);
    const on = await dStrings({ avoidantCrossingReduction: true }, CORRIDOR_PLAN);
    // Every edge carrying a nonzero plan offset must re-route (offset threaded through getEdgePath).
    corridorEdges().forEach((e, i) => {
      expect(`${e.id}:${on[i]}`).not.toBe(`${e.id}:${baseline[i]}`);
    });
  });

  it('is deterministic: identical ON mounts render identical d strings', async () => {
    const a = await dStrings({ avoidantCrossingReduction: true }, CORRIDOR_PLAN);
    const b = await dStrings({ avoidantCrossingReduction: true }, CORRIDOR_PLAN);
    corridorEdges().forEach((e, i) => {
      expect(`${e.id}:${b[i]}`).toBe(`${e.id}:${a[i]}`);
    });
  });
});
