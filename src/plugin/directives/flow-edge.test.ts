// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowEdgeDirective } from './flow-edge';
import { CORRIDOR_MARGIN } from '../../core/edge-paths/orthogonal';

// ============================================================================
// x-flow-edge directive — reactivity-scoping tests (Workstream 4)
//
// These tests mount a real x-flow-edge <g> inside a hand-built reactive canvas
// scope (same pattern as flow-context-menu.test.ts) and assert which node/state
// mutations do — and do not — re-run the edge effect. Each effect run writes the
// path `d` attribute (flow-edge.ts), so a MutationObserver on `d` counts runs.
// ============================================================================

const SVG_NS = 'http://www.w3.org/2000/svg';

// jsdom doesn't implement CSS.escape — minimal polyfill for simple IDs
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

/** Flush Alpine's reactive scheduler so directive effects re-run. */
function flush(): Promise<void> {
  return new Promise<void>((resolve) => Alpine.nextTick(() => resolve()));
}

interface MockNode {
  id: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  data: Record<string, unknown>;
  parentId?: string;
  [k: string]: unknown;
}

interface MockEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceHandle?: string;
  targetHandle?: string;
  selected?: boolean;
  [k: string]: unknown;
}

let canvasSeq = 0;

/**
 * Build a minimal-but-complete reactive canvas scope for the edge effect,
 * mount `<svg><g x-flow-edge="edges[N]">` for each edge, and return handles.
 */
function mountEdges(
  nodes: MockNode[],
  edges: MockEdge[],
  opts: { nodeElements?: boolean; config?: Record<string, unknown> } = {},
) {
  const host = document.createElement('div');
  const canvas = {
    nodes,
    edges,
    selectedRows: new Set<string>(),
    selectedEdges: new Set<string>(),
    selectedNodes: new Set<string>(),
    _layoutAnimTick: 0,
    // ── Interaction degradation (Workstream D) ──────────────────────────
    // REACTIVE bucketed zoom level, mirroring flow-canvas.ts's `_zoomLevel`
    // (set by `_applyZoomLevel`). Edge effects read it only when `edgeLod`
    // is configured (WS-D task D2). Existing tests never read it, so
    // defaulting to 'close' here is safe.
    _zoomLevel: 'close' as 'far' | 'medium' | 'close',
    viewport: { x: 0, y: 0, zoom: 1 },
    _config: { ...(opts.config ?? {}) } as Record<string, unknown>,
    _shapeRegistry: undefined as unknown,
    // toAbsoluteNode returns parentless nodes untouched, so an empty map is fine
    // for these flat fixtures.
    _nodeMap: new Map<string, MockNode>(),
    _nodeElements: new Map<string, HTMLElement>(),
    _id: 'test-canvas',
    // ── Workstream C (task C2): shared obstacle snapshot + dirty-corridor
    // invalidation. This is a hand-rolled mirror of the real
    // flowCanvas._commitNodeGeometry/_markDirtyEdges pair (flow-canvas.ts) —
    // duplicated here because this harness builds a plain reactive scope
    // rather than mounting the full flowCanvas Alpine.data() factory.
    // INTENTIONALLY SIMPLIFIED: unlike the real implementation, this mock
    // omits the hidden-node obstacle filter and the edge-removal/full-
    // invalidation pruning of _edgeDirtyTicks/_edgeCorridors. The real
    // methods are covered against a real mounted flowCanvas in
    // canvas-geometry-commit.test.ts — treat that file as the source of
    // truth for behavior this mirror doesn't reproduce.
    _obstacleSnapshot: null as Array<{ id: string; x: number; y: number; width: number; height: number }> | null,
    _edgeDirtyTicks: new Map<string, number>(),
    _edgeCorridors: new Map<string, { minX: number; minY: number; maxX: number; maxY: number }>(),
    // ── Interaction degradation (Workstream D) ──────────────────────────
    // REACTIVE Set of node ids currently being dragged, mirroring
    // flow-canvas.ts's `_draggingNodeIds`. Edge effects read key-scoped
    // `.has(edge.source)` / `.has(edge.target)` on it (avoidantSimplifyOnDrag).
    _draggingNodeIds: new Set<string>(),
    _commitNodeGeometry(changedNodeIds?: string[]) {
      // Shallow-copy BEFORE mutating in place below (see the "keep the same
      // reference" comment) so _markDirtyEdges can see the pre-commit rects.
      const existing = this._obstacleSnapshot;
      const prevSnapshot = existing ? existing.slice() : null;
      const rects = this.nodes.map((n) => ({
        id: n.id,
        x: n.position.x,
        y: n.position.y,
        width: n.dimensions.width,
        height: n.dimensions.height,
      }));
      // Mirrors flow-canvas.ts's _commitNodeGeometry: keep the SAME array
      // reference across commits (mutate in place) instead of reassigning.
      // Reading `canvas._obstacleSnapshot` through Alpine's reactive scope —
      // even immediately wrapped in Alpine.raw() — tracks a dependency on
      // that property's identity, so reassigning it every commit would
      // re-run EVERY orthogonal/avoidant edge's effect every commit and
      // defeat dirty-corridor invalidation entirely.
      if (existing) {
        existing.length = 0;
        existing.push(...rects);
      } else {
        this._obstacleSnapshot = rects;
      }
      this._markDirtyEdges(changedNodeIds, prevSnapshot);
    },
    _markDirtyEdges(
      changedNodeIds?: string[],
      prevSnapshot?: Array<{ id: string; x: number; y: number; width: number; height: number }> | null,
    ) {
      const bump = (id: string) => this._edgeDirtyTicks.set(id, (this._edgeDirtyTicks.get(id) ?? 0) + 1);
      if (!changedNodeIds || changedNodeIds.length === 0) {
        for (const e of this.edges) bump(e.id);
        return;
      }
      const changed = new Set(changedNodeIds);
      const changedRects: Array<{ x: number; y: number; width: number; height: number }> = [];
      for (const id of changed) {
        const nr = this._obstacleSnapshot?.find((o) => o.id === id);
        if (nr) changedRects.push(nr);
        const pr = prevSnapshot?.find((o) => o.id === id);
        if (pr) changedRects.push(pr);
      }
      for (const e of this.edges) {
        let dirty = changed.has(e.source) || changed.has(e.target);
        if (!dirty) {
          const corridor = this._edgeCorridors.get(e.id);
          if (corridor) {
            for (const r of changedRects) {
              if (
                r.x < corridor.maxX + CORRIDOR_MARGIN && r.x + r.width > corridor.minX - CORRIDOR_MARGIN &&
                r.y < corridor.maxY + CORRIDOR_MARGIN && r.y + r.height > corridor.minY - CORRIDOR_MARGIN
              ) {
                dirty = true;
                break;
              }
            }
          } else {
            dirty = true; // never-routed-yet — conservative, matches production
          }
        }
        if (dirty) bump(e.id);
      }
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

  const scopeName = `__edgeCanvas_${canvasSeq++}`;
  (window as unknown as Record<string, unknown>)[scopeName] = () => canvas;
  host.setAttribute('x-data', `${scopeName}()`);

  // Optional real node elements (for endpoint-lookup tests). Registered in
  // both the DOM (so querySelector fallback works) and canvas._nodeElements
  // (so the O(1) map-lookup path is exercised).
  if (opts.nodeElements) {
    for (const n of nodes) {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'flow-node';
      nodeEl.setAttribute('data-flow-node-id', n.id);
      host.appendChild(nodeEl);
      canvas._nodeElements.set(n.id, nodeEl);
    }
  }

  // A `.flow-container` ancestor is required: the row-highlight path calls
  // getComputedStyle(gEl.closest('.flow-container')), which throws on null.
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

/**
 * Count `d`-attribute writes on a path element. Every edge effect run writes
 * `d`, so this counts effect re-runs. `count()` drains pending MO records
 * synchronously so it doesn't race async delivery.
 */
function observePathD(pathEl: Element) {
  let n = 0;
  const obs = new MutationObserver((records) => {
    for (const r of records) if (r.attributeName === 'd') n++;
  });
  obs.observe(pathEl, { attributes: true, attributeFilter: ['d'] });
  return {
    count(): number {
      for (const r of obs.takeRecords()) if (r.attributeName === 'd') n++;
      return n;
    },
    disconnect(): void {
      obs.disconnect();
    },
  };
}

function flatNodes(): MockNode[] {
  return [
    { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
    { id: 'b', position: { x: 400, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
    { id: 'c', position: { x: 200, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
  ];
}

describe('x-flow-edge obstacle reactivity (Task 21)', () => {
  it('mutating an unrelated node does not re-run an avoidant edge effect', async () => {
    const { data, groups, visiblePath } = mountEdges(flatNodes(), [
      { id: 'e1', source: 'a', target: 'b', type: 'avoidant' },
    ]);
    await flush();
    const counts = observePathD(visiblePath(groups[0]));

    // Direct write to an unrelated node (c is neither source nor target).
    // No _layoutAnimTick bump — this is the "someone edited data, not a drag" path.
    data.getNode('c')!.position.x = 500;
    await flush();

    expect(counts.count()).toBe(0);
    counts.disconnect();
  });

  it('the edge still re-routes when its own endpoint moves', async () => {
    const { data, groups, visiblePath } = mountEdges(flatNodes(), [
      { id: 'e1', source: 'a', target: 'b', type: 'avoidant' },
    ]);
    await flush();
    const counts = observePathD(visiblePath(groups[0]));

    data.getNode('a')!.position.x = 50;
    await flush();

    expect(counts.count()).toBeGreaterThan(0);
    counts.disconnect();
  });

  it('bumping _layoutAnimTick re-routes the edge (obstacle refresh signal)', async () => {
    // Obstacle geometry is non-reactive, so the ONLY way an unrelated node's
    // move (drag-end, resize, reorder) reaches dependent edges is via this tick.
    const { data, groups, visiblePath } = mountEdges(flatNodes(), [
      { id: 'e1', source: 'a', target: 'b', type: 'avoidant' },
    ]);
    await flush();
    const counts = observePathD(visiblePath(groups[0]));

    data.getNode('c')!.position.x = 500; // move an obstacle (no re-route yet)
    data._layoutAnimTick++; // ...then the refresh signal fires
    await flush();

    expect(counts.count()).toBeGreaterThan(0);
    counts.disconnect();
  });
});

describe('x-flow-edge row-highlight reactivity (Task 22)', () => {
  function schemaNodes(): MockNode[] {
    return [
      { id: 'users', position: { x: 0, y: 0 }, dimensions: { width: 160, height: 120 }, data: {} },
      { id: 'posts', position: { x: 400, y: 0 }, dimensions: { width: 160, height: 120 }, data: {} },
      { id: 'teams', position: { x: 0, y: 300 }, dimensions: { width: 160, height: 120 }, data: {} },
    ];
  }

  it('selecting a row only re-runs edges touching that row', async () => {
    const { data, groups, visiblePath } = mountEdges(schemaNodes(), [
      { id: 'e1', source: 'users', target: 'posts', sourceHandle: 'users.id-r', targetHandle: 'posts.user_id-l' },
      { id: 'e2', source: 'teams', target: 'users', sourceHandle: 'teams.id-r', targetHandle: 'users.team_id-l' },
    ]);
    await flush();
    const c1 = observePathD(visiblePath(groups[0]));
    const c2 = observePathD(visiblePath(groups[1]));

    data.selectRow('users.id'); // matches e1's sourceHandle (stripped), not e2's handles
    await flush();

    expect(c1.count()).toBeGreaterThan(0); // e1 touches users.id
    expect(c2.count()).toBe(0); // e2 must not re-run
    c1.disconnect();
    c2.disconnect();
  });
});

describe('x-flow-edge endpoint lookup refactor (Task 23)', () => {
  function twoNodes(): MockNode[] {
    return [
      { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 120, height: 60 }, data: {} },
      { id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 120, height: 60 }, data: {} },
    ];
  }

  // Characterization: pins the emitted `d` for a 2-node + 1-edge fixture so the
  // switch to _nodeElements-based endpoint resolution provably changes nothing.
  // The inline snapshot is captured on pre-refactor code, then re-verified after.
  it('edge path is unchanged after _nodeElements lookup refactor', async () => {
    const { groups, visiblePath } = mountEdges(
      twoNodes(),
      [{ id: 'e1', source: 'a', target: 'b', sourceHandle: 'a-r', targetHandle: 'b-l' }],
      { nodeElements: true },
    );
    await flush();
    const d = visiblePath(groups[0]).getAttribute('d');
    expect(d).toBeTruthy();
    expect(d).toMatchInlineSnapshot(`"M60,60 C60,130 360,130 360,200"`);
  });
});

describe('x-flow-edge dirty-corridor invalidation (Workstream C, task C2)', () => {
  function farNodes(): MockNode[] {
    return [
      { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'b', position: { x: 400, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'c', position: { x: 2000, y: 2000 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'd', position: { x: 2400, y: 2000 }, dimensions: { width: 100, height: 60 }, data: {} },
    ];
  }

  it('endpoint-touching edge re-routes and the far edge stays clean after _commitNodeGeometry', async () => {
    const { data, groups, visiblePath } = mountEdges(farNodes(), [
      { id: 'e1', source: 'a', target: 'b', type: 'avoidant' },
      { id: 'e2', source: 'c', target: 'd', type: 'avoidant' },
    ]);
    await flush(); // initial render records both edges' corridors

    // Prime the shared snapshot with one full-invalidation commit first (as a
    // real app would on initial layout). This FIRST commit is the null→array
    // transition on `_obstacleSnapshot` (a genuine reassignment, since there
    // is no existing array yet to mutate in place) — every already-rendered
    // edge tracks that property and so legitimately re-runs once here. Only
    // AFTER this priming commit does `_obstacleSnapshot` become a stable
    // array reference that subsequent commits mutate in place, which is what
    // makes selective re-routing possible on the SECOND+ commit onward.
    data._commitNodeGeometry();
    await flush();

    const c1 = observePathD(visiblePath(groups[0]));
    const c2 = observePathD(visiblePath(groups[1]));

    data.getNode('a')!.position.x += 40;
    data._commitNodeGeometry(['a']);
    await flush();

    expect(c1.count()).toBeGreaterThan(0); // e1 re-routes (endpoint match)
    expect(c2.count()).toBe(0); // e2 does NOT re-run (corridor far away)
    c1.disconnect();
    c2.disconnect();
  });

  it('an edge whose endpoints never move still re-routes solely via its dirty tick when an obstacle corners it', async () => {
    // s/t never move — only an unrelated obstacle node ('ob') moves into e3's
    // recorded corridor. The ONLY dependency that can trigger a re-run here is
    // `_edgeDirtyTicks.get('e3')` (no direct position read, no _layoutAnimTick
    // bump) — this isolates the new routing-dependency wiring.
    const nodes: MockNode[] = [
      { id: 's', position: { x: 5000, y: 5000 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 't', position: { x: 5400, y: 5000 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'ob', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
    ];
    const { data, groups, visiblePath } = mountEdges(nodes, [
      { id: 'e3', source: 's', target: 't', type: 'avoidant' },
    ]);
    await flush(); // records e3's corridor around the s/t bounding box
    expect(data._edgeCorridors.get('e3')).toBeTruthy();

    // Prime the shared snapshot (see the priming comment in the previous
    // test): the null→array transition on the FIRST _commitNodeGeometry call
    // is a genuine reassignment that legitimately re-runs already-rendered
    // edges once. Priming here first means the observed commit below is a
    // pure in-place mutation, isolating the dirty-tick as the sole cause.
    data._commitNodeGeometry();
    await flush();

    const c3 = observePathD(visiblePath(groups[0]));

    // Move 'ob' into e3's recorded corridor (well within CORRIDOR_MARGIN).
    const corridor = data._edgeCorridors.get('e3')!;
    data.getNode('ob')!.position.x = corridor.minX + (corridor.maxX - corridor.minX) / 2;
    data.getNode('ob')!.position.y = corridor.minY;
    data._commitNodeGeometry(['ob']);
    await flush();

    expect(c3.count()).toBeGreaterThan(0);
    c3.disconnect();
  });

  it('sanity: CORRIDOR_MARGIN import matches the router constant (no magic-number duplication)', () => {
    expect(CORRIDOR_MARGIN).toBe(200);
  });
});

describe('x-flow-edge drag simplification (WS-D)', () => {
  /** a/b are the edge endpoints; c sits between them and forces a real
   *  avoidant route around it.
   *
   *  Path-command facts (empirically verified against avoidant.ts /
   *  bezier.ts — NOT "no C"; avoidant routing always renders via Catmull-Rom
   *  cubic-bezier segments, so `C` is present either way):
   *  - A real multi-waypoint route around an obstacle emits ONE `C` segment
   *    PER waypoint pair (buildCatmullRomPath) — i.e. multiple `C`s.
   *  - The empty-obstacle fast path (getAvoidantPath -> getBezierPath) emits
   *    exactly ONE `M...C...` segment — a single `C`.
   *  So "bezier fallback" is distinguished by C-count === 1, not by C's
   *  absence/presence. */
  function dragFixtureNodes(): MockNode[] {
    return [
      { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'b', position: { x: 400, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'c', position: { x: 200, y: -20 }, dimensions: { width: 100, height: 100 }, data: {} },
    ];
  }

  /** Count `C` (cubic bezier) commands in a path's `d` attribute. */
  function countC(d: string | null): number {
    return d ? (d.match(/C/g) ?? []).length : 0;
  }

  it('edges touching a dragged node route as bezier during the drag', async () => {
    const { data, groups, visiblePath } = mountEdges(dragFixtureNodes(), [
      { id: 'e1', source: 'a', target: 'b', type: 'avoidant' },
    ]);
    await flush();

    // Initial render: real pathfinding around obstacle 'c' — multiple bend
    // segments (more than the single-C bezier fast path).
    expect(countC(visiblePath(groups[0]).getAttribute('d'))).toBeGreaterThan(1);

    // Start dragging endpoint 'a' — the edge should degrade to a single-curve
    // bezier for the duration of the gesture (avoidantSimplifyOnDrag, default true).
    data._draggingNodeIds.add('a');
    await flush();
    expect(countC(visiblePath(groups[0]).getAttribute('d'))).toBe(1);

    // Drop: clear the dragging set and commit final geometry — routes again.
    data._draggingNodeIds.clear();
    data._commitNodeGeometry(['a']);
    await flush();
    expect(countC(visiblePath(groups[0]).getAttribute('d'))).toBeGreaterThan(1);
  });

  it('respects avoidantSimplifyOnDrag: false', async () => {
    const { data, groups, visiblePath } = mountEdges(
      dragFixtureNodes(),
      [{ id: 'e1', source: 'a', target: 'b', type: 'avoidant' }],
      { config: { avoidantSimplifyOnDrag: false } },
    );
    await flush();
    expect(countC(visiblePath(groups[0]).getAttribute('d'))).toBeGreaterThan(1);

    data._draggingNodeIds.add('a');
    await flush();

    // Flag disabled — pathfinding still runs during the drag (still multi-segment).
    expect(countC(visiblePath(groups[0]).getAttribute('d'))).toBeGreaterThan(1);
  });

  it('only edges touching a dragged node re-run', async () => {
    const nodes: MockNode[] = [
      ...dragFixtureNodes(),
      { id: 'd', position: { x: 2000, y: 2000 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'e', position: { x: 2400, y: 2000 }, dimensions: { width: 100, height: 60 }, data: {} },
    ];
    const { data, groups, visiblePath } = mountEdges(nodes, [
      { id: 'e1', source: 'a', target: 'b', type: 'avoidant' },
      { id: 'e2', source: 'd', target: 'e', type: 'avoidant' },
    ]);
    await flush();

    const c1 = observePathD(visiblePath(groups[0]));
    const c2 = observePathD(visiblePath(groups[1]));

    data._draggingNodeIds.add('a');
    await flush();

    expect(c1.count()).toBeGreaterThan(0); // e1 touches 'a' — re-runs
    expect(c2.count()).toBe(0); // e2 doesn't touch 'a' — key-scoped, no re-run
    c1.disconnect();
    c2.disconnect();
  });
});

describe('x-flow-edge zoom LOD (WS-D)', () => {
  /** a/b are the edge endpoints; c sits between them and forces a real
   *  avoidant route around it (same fixture as the drag-simplification
   *  block above). */
  function lodFixtureNodes(): MockNode[] {
    return [
      { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'b', position: { x: 400, y: 0 }, dimensions: { width: 100, height: 60 }, data: {} },
      { id: 'c', position: { x: 200, y: -20 }, dimensions: { width: 100, height: 100 }, data: {} },
    ];
  }

  it('simplifies to a straight path at/under the configured zoom bucket, restores above it', async () => {
    const { data, groups, visiblePath } = mountEdges(
      lodFixtureNodes(),
      [{ id: 'e1', source: 'a', target: 'b', type: 'avoidant' }],
      { config: { edgeLod: { simplifyAt: 'far' } } },
    );
    await flush();

    // Initial render at 'close' — real avoidant routing around obstacle 'c'.
    const closeD = visiblePath(groups[0]).getAttribute('d');
    expect(closeD).toContain('C');

    // Drop to 'far' — LOD simplifies to a straight path.
    data._zoomLevel = 'far';
    await flush();
    const farD = visiblePath(groups[0]).getAttribute('d');
    expect(farD).toContain('L');
    expect(farD).not.toContain('C');
    expect(farD).not.toBe(closeD);

    // Back to 'close' — avoidant routing restored.
    data._zoomLevel = 'close';
    await flush();
    expect(visiblePath(groups[0]).getAttribute('d')).toContain('C');
  });

  it("simplifyAt:'medium' simplifies at both 'medium' and 'far', not 'close'", async () => {
    const { data, groups, visiblePath } = mountEdges(
      lodFixtureNodes(),
      [{ id: 'e1', source: 'a', target: 'b', type: 'avoidant' }],
      { config: { edgeLod: { simplifyAt: 'medium' } } },
    );
    await flush();
    expect(visiblePath(groups[0]).getAttribute('d')).toContain('C');

    data._zoomLevel = 'medium';
    await flush();
    let d = visiblePath(groups[0]).getAttribute('d');
    expect(d).toContain('L');
    expect(d).not.toContain('C');

    data._zoomLevel = 'far';
    await flush();
    d = visiblePath(groups[0]).getAttribute('d');
    expect(d).toContain('L');
    expect(d).not.toContain('C');

    data._zoomLevel = 'close';
    await flush();
    expect(visiblePath(groups[0]).getAttribute('d')).toContain('C');
  });

  it('with edgeLod unset, changing _zoomLevel does NOT re-run the edge effect (zero new deps by default)', async () => {
    const { data, groups, visiblePath } = mountEdges(lodFixtureNodes(), [
      { id: 'e1', source: 'a', target: 'b', type: 'avoidant' },
    ]);
    await flush();

    const counts = observePathD(visiblePath(groups[0]));
    data._zoomLevel = 'far';
    await flush();
    expect(counts.count()).toBe(0);
    counts.disconnect();
  });
});

describe('x-flow-edge label path-length caching (Task B1)', () => {
  it('caches getTotalLength keyed by d — unchanged d does not re-measure; changed d does', async () => {
    const getTotalLengthSpy = vi.fn(() => 100);
    const getPointAtLengthSpy = vi.fn(() => ({ x: 5, y: 5 }));

    // This jsdom build doesn't expose SVGPathElement globally (no SVG geometry
    // interfaces at all), so the prototype can't be patched ahead of mount.
    // Mount WITHOUT a label first (label block is a no-op, nothing to spy on
    // yet), grab the real path element, patch geometry methods on that
    // instance, then turn the label on reactively so the first measurement
    // happens under the mock.
    const { data, groups, visiblePath } = mountEdges(flatNodes(), [
      { id: 'e1', source: 'a', target: 'b' },
    ]);
    await flush();

    const pathEl = visiblePath(groups[0]);
    (pathEl as unknown as { getTotalLength: unknown }).getTotalLength = getTotalLengthSpy;
    (pathEl as unknown as { getPointAtLength: unknown }).getPointAtLength = getPointAtLengthSpy;

    // run 1 (with geometry now spyable): turning the label on measures + caches.
    data.getEdge('e1')!.label = 'hi';
    await flush();
    getTotalLengthSpy.mockClear();

    // run 2: force an effect re-run WITHOUT changing geometry (toggle selection).
    data.getEdge('e1')!.selected = true;
    await flush();
    expect(getTotalLengthSpy).not.toHaveBeenCalled(); // cache hit: no re-measure

    // change geometry so d changes → must re-measure.
    data.getNode('a')!.position.x = 80;
    await flush();
    expect(getTotalLengthSpy).toHaveBeenCalled(); // re-measured on new d
  });
});

describe('x-flow-edge label markup (labelHtml)', () => {
  // The harness builds host > .flow-container > svg > g and no viewport, so labels are created
  // but never appended. Marking the container as the viewport gives `ensureLabel` somewhere to
  // put them, and the label block re-runs on the next mutation.
  const withViewport = (host: HTMLElement): void => {
    host.querySelector('.flow-container')!.classList.add('flow-viewport');
  };

  it('writes a label as text by default, so markup shows as the tags it is', async () => {
    const { host, data } = mountEdges(flatNodes(), [{ id: 'e1', source: 'a', target: 'b' }]);
    await flush();
    withViewport(host);

    data.getEdge('e1')!.label = '<b>bold</b>';
    await flush();

    const label = host.querySelector('.flow-edge-label') as HTMLElement;
    expect(label.textContent).toBe('<b>bold</b>');
    expect(label.querySelector('b')).toBeNull();
  });

  it('renders a label as HTML when the edge asks for it', async () => {
    const { host, data } = mountEdges(flatNodes(), [
      { id: 'e1', source: 'a', target: 'b', labelHtml: true },
    ]);
    await flush();
    withViewport(host);

    data.getEdge('e1')!.label = 'over the limit<br>and no manager';
    await flush();

    const label = host.querySelector('.flow-edge-label') as HTMLElement;
    expect(label.querySelector('br')).not.toBeNull();
    expect(label.textContent).toBe('over the limitand no manager');
  });

  it('applies to the start and end labels too', async () => {
    const { host, data } = mountEdges(flatNodes(), [
      { id: 'e1', source: 'a', target: 'b', labelHtml: true },
    ]);
    await flush();
    withViewport(host);

    const edge = data.getEdge('e1')!;
    edge.labelStart = '<em>from</em>';
    edge.labelEnd = '<em>to</em>';
    await flush();

    expect(host.querySelector('.flow-edge-label-start')!.querySelector('em')).not.toBeNull();
    expect(host.querySelector('.flow-edge-label-end')!.querySelector('em')).not.toBeNull();
  });
});
