// @vitest-environment jsdom
// ============================================================================
// _commitNodeGeometry — shared obstacle cache (Workstream C, task C1)
//
// Verifies the SpatialGrid + obstacle snapshot maintained on the canvas data
// object at geometry commit points. Mounts a REAL flowCanvas (not mockCtx)
// because _commitNodeGeometry reads through Alpine.raw(this) and must
// observe genuine reactive node/map state, not a hand-rolled fake.
// ============================================================================

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import type { FlowNode, FlowEdge, FlowCanvasConfig } from '../../core/types';
import { toAbsoluteNode } from '../../core/sub-flow';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../../core/geometry';

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

describe('_commitNodeGeometry — obstacle snapshot + SpatialGrid', () => {
  it('refreshes the obstacle snapshot once per epoch', () => {
    const canvas = mountCanvas({
      nodes: [
        makeNode('n1', { position: { x: 0, y: 0 } }),
        makeNode('n2', { position: { x: 400, y: 0 } }),
      ],
    });

    canvas._commitNodeGeometry(['n1']);
    const snapA = canvas._obstacleSnapshot;
    const snapB = canvas._obstacleSnapshot;
    expect(snapA).toBe(snapB); // stable between reads, no re-commit

    canvas.getNode('n1').position.x = 300;
    canvas._commitNodeGeometry(['n1']);

    // Same array REFERENCE across commits (mutated in place), not a fresh
    // array — this is deliberate (task C2): edges read this snapshot via
    // `Alpine.raw(canvas._obstacleSnapshot)`, and even wrapped in
    // Alpine.raw(), that property GET still tracks the reactive scope's
    // `_obstacleSnapshot` key. Reassigning a new array every commit would
    // re-run EVERY orthogonal/avoidant edge's effect on every commit
    // (Vue's reactive `set` trap always triggers on a changed reference),
    // which would defeat dirty-corridor invalidation. The CONTENTS are
    // still rebuilt every commit — verified via the grid query below.
    expect(canvas._obstacleSnapshot).toBe(snapA);
    expect(
      canvas._spatialGrid.query({ minX: 290, minY: -10, maxX: 500, maxY: 100 }).has('n1'),
    ).toBe(true);
    expect(
      (canvas._obstacleSnapshot as Array<{ id: string; x: number }>).find((r) => r.id === 'n1')?.x,
    ).toBe(300); // contents rebuilt even though the array reference is stable
  });

  it('excludes hidden nodes from the snapshot and grid', () => {
    const canvas = mountCanvas({
      nodes: [
        makeNode('n1', { position: { x: 0, y: 0 } }),
        makeNode('n2', { position: { x: 400, y: 0 }, hidden: true }),
      ],
    });

    canvas._commitNodeGeometry(['n1', 'n2']);

    expect(canvas._obstacleSnapshot?.some((r: { id: string }) => r.id === 'n2')).toBe(false);
    expect(
      canvas._spatialGrid.query({ minX: -50, minY: -50, maxX: 600, maxY: 200 }).has('n2'),
    ).toBe(false);
    expect(
      canvas._spatialGrid.query({ minX: -50, minY: -50, maxX: 600, maxY: 200 }).has('n1'),
    ).toBe(true);
  });

  it('prunes removed nodes from the grid on the next commit', () => {
    const canvas = mountCanvas({
      nodes: [
        makeNode('n1', { position: { x: 0, y: 0 } }),
        makeNode('n2', { position: { x: 400, y: 0 } }),
      ],
    });

    canvas._commitNodeGeometry(['n1', 'n2']);
    const wideBounds = { minX: -50, minY: -50, maxX: 600, maxY: 200 };
    expect(canvas._spatialGrid.query(wideBounds).has('n1')).toBe(true);
    expect(canvas._spatialGrid.query(wideBounds).has('n2')).toBe(true);

    canvas.nodes = canvas.nodes.filter((n: FlowNode) => n.id !== 'n2');
    canvas._commitNodeGeometry(['n2']);

    expect(canvas._spatialGrid.query(wideBounds).has('n2')).toBe(false);
    expect(canvas._spatialGrid.query(wideBounds).has('n1')).toBe(true);
  });
});

// ============================================================================
// _markDirtyEdges — dirty-corridor edge invalidation (Workstream C, task C2)
//
// Unit tests exercise _markDirtyEdges directly against a real flowCanvas
// mount: seed `_obstacleSnapshot` / `_edgeCorridors`, set `canvas.edges`,
// call `_markDirtyEdges`, and assert which `_edgeDirtyTicks` entries bump.
// ============================================================================

function makeEdge(id: string, source: string, target: string): FlowEdge {
  return { id, source, target } as FlowEdge;
}

describe('_markDirtyEdges — selective edge invalidation', () => {
  it('endpoint move dirties edges touching that node AND edges cornering it, but not far edges', () => {
    const canvas = mountCanvas({ nodes: [] });

    // a, b: endpoint pair for e1. c, d: far away, corridor recorded for e2.
    canvas._obstacleSnapshot = [
      { id: 'a', x: 0, y: 0, width: 150, height: 50 },
      { id: 'b', x: 400, y: 0, width: 150, height: 50 },
      { id: 'c', x: 2000, y: 2000, width: 150, height: 50 },
      { id: 'd', x: 2400, y: 2000, width: 150, height: 50 },
    ];
    canvas.edges = [
      makeEdge('e1', 'a', 'b'), // touches 'a' directly
      makeEdge('e2', 'c', 'd'), // far away — must stay clean
      makeEdge('e3', 'x', 'y'), // does not touch 'a', but its recorded corridor corners it
    ];
    // e2's corridor sits far from 'a' — outside CORRIDOR_MARGIN (200).
    canvas._edgeCorridors.set('e2', { minX: 2000, minY: 2000, maxX: 2400, maxY: 2050 });
    // e3's corridor sits close to (but not overlapping) 'a' — within CORRIDOR_MARGIN.
    canvas._edgeCorridors.set('e3', { minX: 200, minY: 0, maxX: 250, maxY: 50 });

    canvas._markDirtyEdges(['a']);

    expect(canvas._edgeDirtyTicks.get('e1')).toBe(1); // endpoint match
    expect(canvas._edgeDirtyTicks.get('e2')).toBeUndefined(); // far corridor — clean
    expect(canvas._edgeDirtyTicks.get('e3')).toBe(1); // cornered via corridor proximity
  });

  it('a node moving OUT of a corridor still dirties that edge (old-rect via prevSnapshot)', () => {
    const canvas = mountCanvas({ nodes: [] });

    // e2's corridor sits near 'a's OLD position but 'a' has since moved far away.
    canvas._obstacleSnapshot = [
      { id: 'a', x: 5000, y: 5000, width: 150, height: 50 }, // new rect — far from corridor
      { id: 'c', x: 900, y: 900, width: 150, height: 50 },
      { id: 'd', x: 1200, y: 900, width: 150, height: 50 },
    ];
    const prevSnapshot = [
      { id: 'a', x: 0, y: 0, width: 150, height: 50 }, // old rect — overlaps corridor
      { id: 'c', x: 900, y: 900, width: 150, height: 50 },
      { id: 'd', x: 1200, y: 900, width: 150, height: 50 },
    ];
    canvas.edges = [makeEdge('e2', 'c', 'd')];
    canvas._edgeCorridors.set('e2', { minX: 200, minY: 0, maxX: 250, maxY: 50 });

    canvas._markDirtyEdges(['a'], prevSnapshot);

    expect(canvas._edgeDirtyTicks.get('e2')).toBe(1);
  });

  it('full invalidation (no changed ids) dirties every edge', () => {
    const canvas = mountCanvas({ nodes: [] });
    canvas.edges = [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'c', 'd'), makeEdge('e3', 'x', 'y')];

    canvas._markDirtyEdges();

    expect(canvas._edgeDirtyTicks.get('e1')).toBe(1);
    expect(canvas._edgeDirtyTicks.get('e2')).toBe(1);
    expect(canvas._edgeDirtyTicks.get('e3')).toBe(1);
  });

  it('WIN: moving 1 corner node among 100 spread-out edges dirties far fewer than 100', () => {
    const canvas = mountCanvas({ nodes: [] });

    const edges: FlowEdge[] = [];
    for (let i = 0; i < 100; i++) {
      const id = `e${i}`;
      edges.push(makeEdge(id, `s${i}`, `t${i}`));
      // Spread corridors 1000 units apart — far beyond the 200 margin, so a
      // single moved node can corner at most a couple of neighbours.
      canvas._edgeCorridors.set(id, { minX: i * 1000, minY: 0, maxX: i * 1000 + 100, maxY: 50 });
    }
    canvas.edges = edges;

    // 'z' is a corner obstacle whose rect overlaps only e0's corridor.
    canvas._obstacleSnapshot = [{ id: 'z', x: 50, y: 0, width: 10, height: 10 }];

    canvas._markDirtyEdges(['z']);

    let dirtiedCount = 0;
    for (const e of edges) {
      if (canvas._edgeDirtyTicks.get(e.id)) dirtiedCount++;
    }

    expect(dirtiedCount).toBeGreaterThan(0); // sanity: the win test isn't a no-op
    expect(dirtiedCount).toBeLessThanOrEqual(5); // << 100 — the headline win
  });

  it('prunes _edgeDirtyTicks/_edgeCorridors for edges removed via fromObject on the next full commit', () => {
    const canvas = mountCanvas({ nodes: [] });

    canvas.edges = [makeEdge('e-live', 'a', 'b'), makeEdge('e-stale', 'x', 'y')];
    canvas._edgeDirtyTicks.set('e-live', 1);
    canvas._edgeDirtyTicks.set('e-stale', 3);
    canvas._edgeCorridors.set('e-live', { minX: 0, minY: 0, maxX: 10, maxY: 10 });
    canvas._edgeCorridors.set('e-stale', { minX: 100, minY: 100, maxX: 110, maxY: 110 });

    // Simulate undo/redo/fromObject dropping 'e-stale' by replacing ctx.edges
    // directly (bypassing removeEdges, which would have pruned the maps
    // itself) — 'e-stale' now has stale entries in both maps but no edge.
    canvas.edges = canvas.edges.filter((e: FlowEdge) => e.id !== 'e-stale');

    canvas._commitNodeGeometry(); // full invalidation (no changed ids) → prune

    expect(Alpine.raw(canvas._edgeDirtyTicks).has('e-stale')).toBe(false);
    expect(Alpine.raw(canvas._edgeCorridors).has('e-stale')).toBe(false);
    expect(Alpine.raw(canvas._edgeDirtyTicks).get('e-live')).toBe(2); // bumped by full invalidation, not deleted
    expect(Alpine.raw(canvas._edgeCorridors).has('e-live')).toBe(true);
  });
});

// ============================================================================
// Scope-guard characterization — shared snapshot obstacle SET is identical to
// the legacy per-edge build, so the router's VALUE-keyed route cache still
// hits (same rects, same order) and routes come out visually identical.
// ============================================================================

describe('shared obstacle snapshot — scope-guard characterization', () => {
  it('shared-snapshot obstacle set equals the legacy per-edge build (no-hidden fixture) → identical route key', () => {
    const canvas = mountCanvas({
      nodes: [
        makeNode('s', { position: { x: 0, y: 0 } }),
        makeNode('t', { position: { x: 500, y: 0 } }),
        makeNode('o1', { position: { x: 200, y: 200 } }),
        makeNode('o2', { position: { x: 300, y: -200 } }),
      ],
    });

    canvas._commitNodeGeometry(['s', 't', 'o1', 'o2']);

    const fromSnapshot = (canvas._obstacleSnapshot as Array<{ id: string; x: number; y: number; width: number; height: number }>)
      .filter((r) => r.id !== 's' && r.id !== 't')
      .map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }));

    const rawNodes = canvas.nodes as FlowNode[];
    const rawNodeMap = new Map<string, FlowNode>(rawNodes.map((n): [string, FlowNode] => [n.id, n]));
    const nodeOrigin = canvas._config?.nodeOrigin;
    const legacy = rawNodes
      .filter((n) => n.id !== 's' && n.id !== 't')
      .map((n) => {
        const abs = toAbsoluteNode(n, rawNodeMap, nodeOrigin);
        return {
          x: abs.position.x,
          y: abs.position.y,
          width: abs.dimensions?.width ?? DEFAULT_NODE_WIDTH,
          height: abs.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
        };
      });

    expect(fromSnapshot.length).toBe(legacy.length);
    expect(fromSnapshot).toEqual(legacy); // same order, same values → identical routeKey
  });

  it('hidden nodes are excluded from the obstacle snapshot (documented behavior change vs legacy)', () => {
    const canvas = mountCanvas({
      nodes: [
        makeNode('s', { position: { x: 0, y: 0 } }),
        makeNode('t', { position: { x: 500, y: 0 } }),
        makeNode('hiddenObstacle', { position: { x: 200, y: 200 }, hidden: true }),
      ],
    });

    canvas._commitNodeGeometry(['s', 't', 'hiddenObstacle']);

    const fromSnapshot = canvas._obstacleSnapshot as Array<{ id: string }>;
    expect(fromSnapshot.some((r) => r.id === 'hiddenObstacle')).toBe(false);

    // The legacy per-edge build (rawNodes.filter(id !== source/target), no
    // hidden check) DID include hidden nodes as obstacles — this is a
    // deliberate, documented behavior change: hidden nodes are no longer
    // obstacles under the shared snapshot.
    const rawNodes = canvas.nodes as FlowNode[];
    const legacyIncludesHidden = rawNodes.some((n) => n.id === 'hiddenObstacle' && n.id !== 's' && n.id !== 't');
    expect(legacyIncludesHidden).toBe(true);
  });
});
