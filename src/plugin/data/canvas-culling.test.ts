// @vitest-environment jsdom
// ============================================================================
// _applyCulling — transition-only display writes + edge SVG culling
// (Workstream E, task E1)
//
// Verifies two behavior changes to `_applyCulling` (flow-canvas.ts):
//   1. Node `el.style.display` is only WRITTEN when a node's visibility
//      actually transitions between frames — not unconditionally every call
//      (mutation-record churn devtools amplifies).
//   2. Edge SVGs are now culled too: an edge is visible iff either endpoint
//      node is visible, OR its recorded route corridor intersects the
//      visible bounds (corridors can exceed their endpoints).
//
// Mounts a REAL flowCanvas (not a hand-rolled mock ctx) so `_applyCulling`
// runs against genuine reactive node/edge state, same harness pattern as
// canvas-geometry-commit.test.ts.
// ============================================================================

import { describe, it, expect, vi, afterEach } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import type { FlowNode, FlowEdge, FlowCanvasConfig } from '../../core/types';
import { getVisibleBounds, type Bounds, type SpatialGrid } from '../../core/geometry';
import { getAbsolutePosition } from '../../core/sub-flow';

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

function makeEdge(id: string, source: string, target: string): FlowEdge {
  return { id, source, target } as FlowEdge;
}

afterEach(() => {
  for (const el of mounted) {
    Alpine.destroyTree(el);
    el.remove();
  }
  mounted.length = 0;
});

/**
 * jsdom reports `clientWidth`/`clientHeight` as 0, which makes `_applyCulling`
 * early-return. Force real dimensions so the culling pass actually runs.
 * With viewport {x:0, y:0, zoom:1} and the default buffer (100), this
 * produces visible bounds `{minX:-100, minY:-100, maxX:900, maxY:700}`.
 */
function sizeContainer(canvas: any, width = 800, height = 600): void {
  Object.defineProperty(canvas._container, 'clientWidth', { value: width, configurable: true });
  Object.defineProperty(canvas._container, 'clientHeight', { value: height, configurable: true });
}

describe('_applyCulling — transition-only node display writes', () => {
  it('writes display only on visibility transitions, not on every call at an unchanged viewport', () => {
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [
        makeNode('a', { position: { x: 0, y: 0 } }),
        makeNode('b', { position: { x: 300, y: 0 } }),
      ],
    });
    sizeContainer(canvas);

    const elA = document.createElement('div');
    const elB = document.createElement('div');
    canvas._nodeElements.set('a', elA);
    canvas._nodeElements.set('b', elB);

    canvas._applyCulling(); // initial transition: both nodes become visible

    expect(elA.style.display).toBe('');
    expect(elB.style.display).toBe('');

    const spies = [elA, elB].map((el) => {
      let val = el.style.display;
      const spy = vi.fn((v: string) => {
        val = v;
      });
      Object.defineProperty(el.style, 'display', { get: () => val, set: spy, configurable: true });
      return spy;
    });

    canvas._applyCulling(); // same viewport — nothing changed

    for (const spy of spies) {
      expect(spy).not.toHaveBeenCalled();
    }
  });
});

describe('_applyCulling — hides nodes never in the visible/prev sets', () => {
  it('hides a node that is off-screen at the FIRST cull pass', () => {
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [
        makeNode('on', { position: { x: 0, y: 0 } }),
        makeNode('off', { position: { x: 5000, y: 5000 } }),
      ],
    });
    const onEl = document.createElement('div');
    const offEl = document.createElement('div');
    canvas._nodeElements.set('on', onEl);
    canvas._nodeElements.set('off', offEl);
    canvas._commitNodeGeometry();
    sizeContainer(canvas);

    // A SINGLE pass: 'off' is in neither `visible` nor the (empty) previous set,
    // so the old set-difference diff would leave it rendered (display:'').
    canvas._applyCulling();

    expect(offEl.style.display).toBe('none');
    expect(onEl.style.display).toBe('');
  });

  it('hides a node added off-screen while culling is already active', () => {
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [makeNode('on', { position: { x: 0, y: 0 } })],
    });
    const onEl = document.createElement('div');
    canvas._nodeElements.set('on', onEl);
    canvas._commitNodeGeometry();
    sizeContainer(canvas);

    canvas._applyCulling(); // 'on' is visible
    expect(onEl.style.display).toBe('');

    // Add an off-screen node AFTER culling first ran — it enters via neither
    // `visible` (off-screen) nor `prev` (didn't exist last frame).
    canvas.nodes = [...(canvas.nodes as FlowNode[]), makeNode('added', { position: { x: 5000, y: 5000 } })];
    const addedEl = document.createElement('div');
    canvas._nodeElements.set('added', addedEl);
    canvas._commitNodeGeometry();
    canvas._applyCulling();

    expect(addedEl.style.display).toBe('none');
    expect(onEl.style.display).toBe('');
  });
});

describe('_applyCulling — edge SVG culling', () => {
  it('culls an edge svg once both endpoints are off-screen; keeps an on-screen edge shown', () => {
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [
        makeNode('a', { position: { x: 0, y: 0 } }),
        makeNode('b', { position: { x: 300, y: 0 } }),
        makeNode('c', { position: { x: 5000, y: 0 } }),
        makeNode('d', { position: { x: 5300, y: 0 } }),
      ],
    });
    sizeContainer(canvas);

    for (const id of ['a', 'b', 'c', 'd']) {
      canvas._nodeElements.set(id, document.createElement('div'));
    }

    const onSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const offSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvas._edgeSvgElements.set('e-on', onSvg);
    canvas._edgeSvgElements.set('e-off', offSvg);

    canvas.edges = [makeEdge('e-on', 'a', 'b'), makeEdge('e-off', 'c', 'd')];
    canvas._rebuildEdgeMap();

    // The off-screen edge's recorded corridor also stays out of the visible
    // bounds — both the endpoint check and the corridor check agree it's culled.
    canvas._edgeCorridors.set('e-off', { minX: 5000, minY: -10, maxX: 5300, maxY: 60 });
    // 'e-on' intentionally has no recorded corridor — it has a visible
    // endpoint, so it must stay visible regardless.

    canvas._applyCulling();

    expect(offSvg.style.display).toBe('none');
    expect(onSvg.style.display).toBe('');
  });

  it('keeps an edge visible when its corridor reaches into the viewport, even with both endpoints off-screen', () => {
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [
        makeNode('c', { position: { x: 5000, y: 0 } }),
        makeNode('d', { position: { x: 5300, y: 0 } }),
      ],
    });
    sizeContainer(canvas);

    for (const id of ['c', 'd']) {
      canvas._nodeElements.set(id, document.createElement('div'));
    }

    const corridorSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvas._edgeSvgElements.set('e-corridor', corridorSvg);

    canvas.edges = [makeEdge('e-corridor', 'c', 'd')];
    canvas._rebuildEdgeMap();

    // First pass: corridor does NOT reach the viewport — both endpoints are
    // off-screen and the corridor doesn't intersect either, so it's culled.
    canvas._edgeCorridors.set('e-corridor', { minX: 5000, minY: -10, maxX: 5300, maxY: 60 });
    canvas._applyCulling();
    expect(corridorSvg.style.display).toBe('none');

    // The corridor is recomputed (e.g. the route changed) to now span into
    // the visible bounds (which extend to maxX:900) via minX:-50 — the edge
    // must become visible again even though both endpoints stay off-screen.
    canvas._edgeCorridors.set('e-corridor', { minX: -50, minY: -10, maxX: 5300, maxY: 60 });
    canvas._applyCulling();
    expect(corridorSvg.style.display).toBe('');
  });

  it('prunes a removed edge from _culledEdgeIds — no unbounded growth under add/remove churn', () => {
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [
        makeNode('c', { position: { x: 5000, y: 0 } }),
        makeNode('d', { position: { x: 5300, y: 0 } }),
      ],
    });
    sizeContainer(canvas);

    for (const id of ['c', 'd']) {
      canvas._nodeElements.set(id, document.createElement('div'));
    }

    const offSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvas._edgeSvgElements.set('e-off', offSvg);
    canvas.edges = [makeEdge('e-off', 'c', 'd')];
    canvas._rebuildEdgeMap();
    // Both endpoints off-screen and the corridor stays out of bounds → culled.
    canvas._edgeCorridors.set('e-off', { minX: 5000, minY: -10, maxX: 5300, maxY: 60 });

    canvas._applyCulling();
    expect(offSvg.style.display).toBe('none');
    expect(canvas._culledEdgeIds.has('e-off')).toBe(true); // entered the culled set

    // Remove the edge the way real removal does: drop its svg element and its
    // edge-map entry. Nothing else prunes _culledEdgeIds, so a leak would
    // leave 'e-off' in the set forever.
    canvas._edgeSvgElements.delete('e-off');
    canvas.edges = canvas.edges.filter((e: FlowEdge) => e.id !== 'e-off');
    canvas._rebuildEdgeMap();

    canvas._applyCulling();
    expect(canvas._culledEdgeIds.has('e-off')).toBe(false); // pruned, not leaked
  });
});

// ============================================================================
// SpatialGrid-backed visibility query (Workstream E, task E2)
//
// E2 replaces the node portion of `_applyCulling`'s all-nodes linear scan
// with a `SpatialGrid.query(bounds)` candidate lookup — the grid is
// maintained by C1 (`_commitNodeGeometry`) at discrete commit points, so
// culling now only QUERIES it per frame instead of rebuilding it. The grid
// query is a coarse (cell-granularity) superset; the same precise per-node
// AABB predicate C1/E1 already used still runs, but only over candidates,
// so the computed visible set stays byte-identical to the old linear scan
// for committed geometry — that's what the parity test below proves.
// ============================================================================

describe('SpatialGrid-backed visibility parity', () => {
  /** Deterministic scatter — no Math.random/Date.now, reproducible across runs. */
  function buildFixtureNodes(count: number): FlowNode[] {
    const nodes: FlowNode[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push(
        makeNode(`n${i}`, {
          position: { x: (i * 137) % 4000, y: (i * 89) % 3000 },
          dimensions: { width: 80 + ((i * 53) % 200), height: 30 + ((i * 31) % 150) },
        }),
      );
    }
    return nodes;
  }

  /** Oracle: the pre-E2 linear scan — identical predicate, no grid involved. */
  function linearScanVisible(canvas: any, bounds: Bounds): Set<string> {
    const visible = new Set<string>();
    for (const node of canvas.nodes as FlowNode[]) {
      if (node.hidden) continue;
      const w = node.dimensions?.width ?? 150;
      const h = node.dimensions?.height ?? 50;
      const pos = node.parentId
        ? getAbsolutePosition(node, canvas._nodeMap, canvas._config.nodeOrigin)
        : node.position;
      const isVisible = !(
        pos.x + w < bounds.minX ||
        pos.x > bounds.maxX ||
        pos.y + h < bounds.minY ||
        pos.y > bounds.maxY
      );
      if (isVisible) visible.add(node.id);
    }
    return visible;
  }

  // 20 deterministic viewports: everything visible, nothing visible (panned
  // far away), partial overlaps, and a spread of zoom levels/container sizes.
  const viewports: Array<{ x: number; y: number; zoom: number; width: number; height: number }> = [
    { x: 0, y: 0, zoom: 0.05, width: 800, height: 600 }, // everything visible
    { x: -100000, y: -100000, zoom: 1, width: 800, height: 600 }, // nothing visible
    { x: 0, y: 0, zoom: 1, width: 800, height: 600 }, // partial, default
    { x: -500, y: -300, zoom: 1, width: 800, height: 600 },
    { x: -1500, y: -1000, zoom: 1, width: 800, height: 600 },
    { x: -2500, y: -1500, zoom: 1, width: 800, height: 600 },
    { x: -3500, y: -2000, zoom: 1, width: 800, height: 600 },
    { x: 0, y: 0, zoom: 2, width: 800, height: 600 }, // zoomed in
    { x: -800, y: -600, zoom: 2, width: 800, height: 600 },
    { x: 0, y: 0, zoom: 0.5, width: 800, height: 600 }, // zoomed out
    { x: -1000, y: -800, zoom: 0.5, width: 1024, height: 768 },
    { x: -2000, y: -1200, zoom: 0.75, width: 1024, height: 768 },
    { x: -300, y: -1800, zoom: 1.5, width: 600, height: 400 },
    { x: -3000, y: -100, zoom: 1, width: 600, height: 400 },
    { x: -100, y: -2500, zoom: 1, width: 600, height: 400 },
    { x: -1800, y: -900, zoom: 0.3, width: 1200, height: 900 },
    { x: -2200, y: -1600, zoom: 1.2, width: 500, height: 500 },
    { x: -600, y: -2200, zoom: 0.9, width: 700, height: 550 },
    { x: -3900, y: -2900, zoom: 1, width: 800, height: 600 }, // corner far edge
    { x: 50, y: 50, zoom: 3, width: 800, height: 600 }, // very zoomed in near origin
  ];

  it('matches the linear-scan oracle across 20 viewports over a 200-node fixture', () => {
    const nodes = buildFixtureNodes(200);
    const canvas = mountCanvas({ viewportCulling: true, nodes });

    for (const node of nodes) {
      canvas._nodeElements.set(node.id, document.createElement('div'));
    }
    canvas._commitNodeGeometry(); // populate the grid with committed geometry

    for (const vp of viewports) {
      sizeContainer(canvas, vp.width, vp.height);
      canvas.viewport.x = vp.x;
      canvas.viewport.y = vp.y;
      canvas.viewport.zoom = vp.zoom;

      const buffer = 100; // default cullingBuffer (not overridden in this fixture)
      const bounds = getVisibleBounds(canvas.viewport, vp.width, vp.height, buffer);
      const oracle = linearScanVisible(canvas, bounds);

      canvas._applyCulling();
      const actual = canvas._getVisibleNodeIds() as Set<string>;

      expect([...actual].sort()).toEqual([...oracle].sort());
    }
  });

  it('_applyCulling queries the SpatialGrid instead of scanning all nodes', () => {
    const nodes = buildFixtureNodes(50);
    const canvas = mountCanvas({ viewportCulling: true, nodes });

    for (const node of nodes) {
      canvas._nodeElements.set(node.id, document.createElement('div'));
    }
    canvas._commitNodeGeometry();
    sizeContainer(canvas);

    const grid = Alpine.raw(canvas._spatialGrid) as SpatialGrid;
    const querySpy = vi.spyOn(grid, 'query');

    canvas._applyCulling();

    expect(querySpy).toHaveBeenCalledTimes(1);
    const expectedBounds = getVisibleBounds(canvas.viewport, 800, 600, 100);
    expect(querySpy).toHaveBeenCalledWith(expectedBounds);

    querySpy.mockRestore();
  });

  it('unions _draggingNodeIds so a node with a stale (off-screen) committed grid cell is never wrongly culled, and is inert when the field is absent', () => {
    const nodes = [
      makeNode('onscreen', { position: { x: 0, y: 0 } }),
      makeNode('dragged', { position: { x: 5000, y: 5000 } }), // committed off-screen
    ];
    const canvas = mountCanvas({ viewportCulling: true, nodes });

    for (const node of nodes) {
      canvas._nodeElements.set(node.id, document.createElement('div'));
    }
    canvas._commitNodeGeometry(); // grid now holds 'dragged' at its OLD, off-screen cell
    sizeContainer(canvas); // default viewport {x:0,y:0,zoom:1} → bounds ~[-100,900]x[-100,700]

    // Simulate a drag in progress: the reactive node position is already
    // on-screen, but geometry has NOT been re-committed, so the grid cell is
    // still the stale off-screen one.
    canvas.getNode('dragged').position.x = 200;
    canvas.getNode('dragged').position.y = 200;

    const grid = Alpine.raw(canvas._spatialGrid) as SpatialGrid;
    const bounds = getVisibleBounds(canvas.viewport, 800, 600, 100);
    expect(grid.query(bounds).has('dragged')).toBe(false); // sanity: grid alone misses it

    // `_draggingNodeIds` is a WS-D field, not declared on this branch — set
    // it defensively as `any`, mirroring how the implementation reads it.
    (canvas as any)._draggingNodeIds = new Set(['dragged']);
    canvas._applyCulling();
    expect(canvas._getVisibleNodeIds().has('dragged')).toBe(true); // union kept it testable; live position is on-screen

    // Alpine's merge-scope proxy (the same proxy `Alpine.$data()` returns —
    // see the nested-raw note on `_spatialGrid` above) does not propagate a
    // plain `delete`, so clear the field the same way "absent" is actually
    // observed at the read site: `undefined` is falsy there too.
    (canvas as any)._draggingNodeIds = undefined;
    canvas._applyCulling();
    expect(canvas._getVisibleNodeIds().has('dragged')).toBe(false); // without the union, the stale grid cell culls it (pure grid-query path)
  });

  it('re-shows a node un-hidden BETWEEN geometry commits (grid still holds hidden nodes for culling)', () => {
    // Regression: E2 sources candidates solely from grid.query(bounds). If the
    // grid dropped hidden nodes, a node hidden → committed-while-hidden →
    // un-hidden WITHOUT a fresh commit (collapse→expand, wire showNode) would
    // be absent from grid.query, so culling's stale inline `display:none`
    // would never be cleared and the node would stay invisible.
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [makeNode('a', { position: { x: 0, y: 0 } })],
    });
    const el = document.createElement('div');
    canvas._nodeElements.set('a', el);
    canvas._commitNodeGeometry();
    sizeContainer(canvas);

    // 1) On-screen and visible.
    canvas._applyCulling();
    expect(el.style.display).toBe('');
    expect(canvas._getVisibleNodeIds().has('a')).toBe(true);

    // 2) Hide it, then commit WHILE hidden (a drag/add/undo elsewhere). This
    //    is the step that, pre-fix, removed 'a' from the grid.
    canvas.getNode('a').hidden = true;
    canvas._commitNodeGeometry();
    canvas._applyCulling();
    expect(el.style.display).toBe('none');
    expect(canvas._getVisibleNodeIds().has('a')).toBe(false);

    // 3) Un-hide WITHOUT a fresh commit. The node must become visible again —
    //    this fails pre-fix (grid lacked 'a') and passes post-fix.
    canvas.getNode('a').hidden = false;
    canvas._applyCulling();
    expect(el.style.display).toBe('');
    expect(canvas._getVisibleNodeIds().has('a')).toBe(true);
  });
});

// ============================================================================
// viewportCulling 'auto' default (Workstream E, task E3)
//
// `viewportCulling` gains a third state, `'auto'` (also the new DEFAULT,
// replacing `false`): culling activates once `this.nodes.length` reaches
// `cullingAutoThreshold` (default 150). `true`/`false` keep forcing culling
// unconditionally on/off regardless of node count.
//
// Node display-write proof note: `_applyCulling`'s node loop (E1) only WRITES
// `display:'none'` on a visible -> invisible TRANSITION (it diffs against the
// previous frame's `_visibleNodeIds`). A node that starts off-screen and has
// NEVER been visible is therefore never explicitly written to 'none' — there
// is nothing to transition from. To observe an active gate via a real DOM
// write (rather than only inspecting `_getVisibleNodeIds()`), these tests
// first establish a visible baseline (all nodes on-screen, one `_applyCulling`
// call), then move a node off-screen and re-cull — exercising the same
// visible->invisible write path the SpatialGrid parity tests above rely on.
// This does not touch the E1/E2 loops themselves, only how the tests drive them.
// ============================================================================

describe('viewportCulling auto gate', () => {
  /** Build N nodes, all positioned on-screen (within the default visible bounds). */
  function buildNodes(count: number): FlowNode[] {
    const nodes: FlowNode[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push(makeNode(`n${i}`, { position: { x: 0, y: 0 } }));
    }
    return nodes;
  }

  /** Mount, register a DOM element per node, commit geometry, size the container. */
  function mountAndPrepare(config: FlowCanvasConfig, count: number): { canvas: any; nodes: FlowNode[] } {
    const nodes = buildNodes(count);
    const canvas = mountCanvas({ ...config, nodes });
    for (const node of nodes) {
      canvas._nodeElements.set(node.id, document.createElement('div'));
    }
    canvas._commitNodeGeometry();
    sizeContainer(canvas);
    return { canvas, nodes };
  }

  /** Move a node far off-screen and re-commit its geometry into the grid. */
  function moveOffscreen(canvas: any, id: string): void {
    const node = canvas.getNode(id);
    node.position.x = 5000;
    node.position.y = 5000;
    canvas._commitNodeGeometry();
  }

  it("'auto' + >=150 nodes -> culling active (visible node transitions to display:none off-screen)", () => {
    const { canvas } = mountAndPrepare({ viewportCulling: 'auto' }, 151);
    canvas._applyCulling(); // baseline: gate active, all 151 on-screen -> all visible
    expect(canvas._getVisibleNodeIds().size).toBe(151);

    moveOffscreen(canvas, 'n150');
    canvas._applyCulling();

    expect(canvas._nodeElements.get('n150').style.display).toBe('none');
    expect(canvas._getVisibleNodeIds().has('n150')).toBe(false);
  });

  it("'auto' + <150 nodes -> culling inactive (early return; node never marked visible or culled)", () => {
    const { canvas } = mountAndPrepare({ viewportCulling: 'auto' }, 50);
    canvas._applyCulling(); // early return: below threshold
    expect(canvas._getVisibleNodeIds().size).toBe(0);

    moveOffscreen(canvas, 'n49');
    canvas._applyCulling(); // still early return

    expect(canvas._nodeElements.get('n49').style.display).toBe('');
    expect(canvas._getVisibleNodeIds().size).toBe(0);
  });

  it("'auto' boundary is >= threshold: 150 active, 149 inactive", () => {
    // Exactly at the default threshold (150) -> active (the gate uses `>=`).
    const { canvas: at } = mountAndPrepare({ viewportCulling: 'auto' }, 150);
    at._applyCulling();
    expect(at._getVisibleNodeIds().size).toBe(150);
    moveOffscreen(at, 'n149');
    at._applyCulling();
    expect(at._nodeElements.get('n149').style.display).toBe('none');

    // One below the threshold (149) -> inactive (early return, nothing culled).
    const { canvas: below } = mountAndPrepare({ viewportCulling: 'auto' }, 149);
    below._applyCulling();
    expect(below._getVisibleNodeIds().size).toBe(0);
    moveOffscreen(below, 'n148');
    below._applyCulling();
    expect(below._nodeElements.get('n148').style.display).toBe('');
  });

  it("default (no viewportCulling key at all) is 'auto' -> active at 151 nodes", () => {
    const { canvas } = mountAndPrepare({}, 151);
    canvas._applyCulling();
    expect(canvas._getVisibleNodeIds().size).toBe(151);

    moveOffscreen(canvas, 'n150');
    canvas._applyCulling();

    expect(canvas._nodeElements.get('n150').style.display).toBe('none');
  });

  it("'true' forces culling on below the auto threshold", () => {
    const { canvas } = mountAndPrepare({ viewportCulling: true }, 3);
    canvas._applyCulling();
    expect(canvas._getVisibleNodeIds().size).toBe(3);

    moveOffscreen(canvas, 'n2');
    canvas._applyCulling();

    expect(canvas._nodeElements.get('n2').style.display).toBe('none');
  });

  it("'false' forces culling off above the auto threshold", () => {
    const { canvas } = mountAndPrepare({ viewportCulling: false }, 200);
    canvas._applyCulling();
    expect(canvas._getVisibleNodeIds().size).toBe(0);

    moveOffscreen(canvas, 'n199');
    canvas._applyCulling();

    expect(canvas._nodeElements.get('n199').style.display).toBe('');
    expect(canvas._getVisibleNodeIds().size).toBe(0);
  });

  it('cullingAutoThreshold overrides the 150 default', () => {
    const { canvas: active } = mountAndPrepare({ viewportCulling: 'auto', cullingAutoThreshold: 10 }, 12);
    active._applyCulling();
    expect(active._getVisibleNodeIds().size).toBe(12);
    moveOffscreen(active, 'n11');
    active._applyCulling();
    expect(active._nodeElements.get('n11').style.display).toBe('none');

    const { canvas: inactive } = mountAndPrepare({ viewportCulling: 'auto', cullingAutoThreshold: 10 }, 5);
    inactive._applyCulling();
    expect(inactive._getVisibleNodeIds().size).toBe(0);
    moveOffscreen(inactive, 'n4');
    inactive._applyCulling();
    expect(inactive._nodeElements.get('n4').style.display).toBe('');
  });

  it('_uncullEverything restores display and resets tracking sets', () => {
    const { canvas } = mountAndPrepare({ viewportCulling: 'auto' }, 151);
    canvas._applyCulling();
    moveOffscreen(canvas, 'n150');
    canvas._applyCulling();

    const offEl = canvas._nodeElements.get('n150');
    expect(offEl.style.display).toBe('none'); // culled
    expect(canvas._getVisibleNodeIds().size).toBeGreaterThan(0);

    canvas._uncullEverything();

    expect(offEl.style.display).toBe('');
    expect(canvas._getVisibleNodeIds().size).toBe(0);
    expect(canvas._culledEdgeIds.size).toBe(0);
    expect(canvas._cullingWasActive).toBe(false);
  });

  it('_applyCulling un-culls automatically when node count drops back below the auto threshold', () => {
    const { canvas } = mountAndPrepare({ viewportCulling: 'auto' }, 151);
    canvas._applyCulling();
    moveOffscreen(canvas, 'n150');
    canvas._applyCulling();

    const offEl = canvas._nodeElements.get('n150');
    expect(offEl.style.display).toBe('none'); // culling active
    expect(canvas._cullingWasActive).toBe(true);

    // Drop below threshold — `_applyCulling` must detect the deactivation and
    // restore display via `_uncullEverything()` rather than leaving stale
    // `display:none` on nodes culling no longer applies to.
    canvas.nodes = (canvas.nodes as FlowNode[]).slice(0, 50);
    canvas._applyCulling();

    expect(offEl.style.display).toBe('');
    expect(canvas._cullingWasActive).toBe(false);
    expect(canvas._getVisibleNodeIds().size).toBe(0);
  });
});

// ============================================================================
// Edge culling must not fight the hidden/collapse effect (Workstream E, fix 3)
//
// flow-viewport.ts owns the inline `display` of edges hidden via
// `edge.hidden` / `edge._hiddenByCollapse` / a hidden endpoint node. The
// culling loop (which writes `g.style.display` from endpoint/corridor
// visibility) must skip those edges entirely, and `_uncullEverything` must
// restore only edges CULLING hid — otherwise a hidden/collapsed edge that is
// culled and then panned into view (or deactivation) would be un-hidden.
// ============================================================================

describe('_applyCulling — does not fight the hidden/collapse effect over edge display', () => {
  function svgEl(): SVGSVGElement {
    return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  }

  it('does not un-hide a hidden edge when its corridor pans into view (culled -> visible transition)', () => {
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [
        makeNode('c', { position: { x: 5000, y: 0 } }),
        makeNode('d', { position: { x: 5300, y: 0 } }),
      ],
    });
    for (const id of ['c', 'd']) {
      canvas._nodeElements.set(id, document.createElement('div'));
    }
    canvas._commitNodeGeometry();
    sizeContainer(canvas);

    const hiddenSvg = svgEl();
    canvas._edgeSvgElements.set('e-hidden', hiddenSvg);

    // Edge marked hidden (as flow-viewport sees it) AND already rendered
    // display:none by flow-viewport's own writer.
    const hiddenEdge = makeEdge('e-hidden', 'c', 'd');
    hiddenEdge.hidden = true;
    canvas.edges = [hiddenEdge];
    canvas._rebuildEdgeMap();
    hiddenSvg.style.display = 'none'; // flow-viewport already hid it

    // First cull: endpoints + corridor off-screen. Culling must SKIP it (owned
    // by flow-viewport): no write.
    canvas._edgeCorridors.set('e-hidden', { minX: 5000, minY: -10, maxX: 5300, maxY: 60 });
    canvas._applyCulling();
    expect(hiddenSvg.style.display).toBe('none');

    // Corridor now reaches into the viewport (a culled -> visible transition
    // for a NON-hidden edge). Pre-fix, culling wrote display='' here and the
    // hidden edge REAPPEARED (this is the primary RED symptom). With the guard
    // it stays hidden.
    canvas._edgeCorridors.set('e-hidden', { minX: -50, minY: -10, maxX: 5300, maxY: 60 });
    canvas._applyCulling();
    expect(hiddenSvg.style.display).toBe('none'); // STILL hidden — culling deferred to flow-viewport

    // The hidden edge is never tracked as culling-owned either (it was skipped).
    expect(canvas._culledEdgeIds.has('e-hidden')).toBe(false);
  });

  it('_uncullEverything restores only culling-hidden edges, leaving flow-viewport-hidden edges hidden', () => {
    const canvas = mountCanvas({
      viewportCulling: true,
      nodes: [
        makeNode('c', { position: { x: 5000, y: 0 } }),
        makeNode('d', { position: { x: 5300, y: 0 } }),
        makeNode('g', { position: { x: 6000, y: 0 } }),
        makeNode('h', { position: { x: 6300, y: 0 } }),
      ],
    });
    for (const id of ['c', 'd', 'g', 'h']) {
      canvas._nodeElements.set(id, document.createElement('div'));
    }
    canvas._commitNodeGeometry();
    sizeContainer(canvas);

    // Normal off-screen edge — culling hides it and tracks it in _culledEdgeIds.
    const normalSvg = svgEl();
    canvas._edgeSvgElements.set('e-normal', normalSvg);
    // Hidden edge — flow-viewport already rendered it display:none; culling skips it.
    const hiddenSvg = svgEl();
    canvas._edgeSvgElements.set('e-hidden', hiddenSvg);
    hiddenSvg.style.display = 'none';

    const hiddenEdge = makeEdge('e-hidden', 'g', 'h');
    hiddenEdge.hidden = true;
    canvas.edges = [makeEdge('e-normal', 'c', 'd'), hiddenEdge];
    canvas._rebuildEdgeMap();
    canvas._edgeCorridors.set('e-normal', { minX: 5000, minY: -10, maxX: 5300, maxY: 60 });
    canvas._edgeCorridors.set('e-hidden', { minX: 6000, minY: -10, maxX: 6300, maxY: 60 });

    canvas._applyCulling();
    expect(normalSvg.style.display).toBe('none'); // culled
    expect(canvas._culledEdgeIds.has('e-normal')).toBe(true); // tracked by culling
    expect(canvas._culledEdgeIds.has('e-hidden')).toBe(false); // skipped by culling

    canvas._uncullEverything();

    expect(normalSvg.style.display).toBe(''); // culling-hidden edge restored
    expect(hiddenSvg.style.display).toBe('none'); // flow-viewport-hidden edge left alone
  });
});
