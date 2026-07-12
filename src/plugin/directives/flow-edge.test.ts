// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowEdgeDirective } from './flow-edge';

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
function mountEdges(nodes: MockNode[], edges: MockEdge[], opts: { nodeElements?: boolean } = {}) {
  const host = document.createElement('div');
  const canvas = {
    nodes,
    edges,
    selectedRows: new Set<string>(),
    selectedEdges: new Set<string>(),
    selectedNodes: new Set<string>(),
    _layoutAnimTick: 0,
    viewport: { x: 0, y: 0, zoom: 1 },
    _config: {} as Record<string, unknown>,
    _shapeRegistry: undefined as unknown,
    // toAbsoluteNode returns parentless nodes untouched, so an empty map is fine
    // for these flat fixtures.
    _nodeMap: new Map<string, MockNode>(),
    _nodeElements: new Map<string, HTMLElement>(),
    _id: 'test-canvas',
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
