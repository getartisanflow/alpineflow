/**
 * Workstream C — shared obstacle snapshot benchmark.
 *
 * Before C, every avoidant/orthogonal edge rebuilt its own obstacle array from
 * the full node list on every effect run: a full-graph pass at schema scale
 * (~100 edges, ~50 nodes) did 100 × (rebuild parent-lookup map + iterate all
 * nodes + toAbsoluteNode + filter). C builds the obstacle array ONCE per
 * geometry commit into `_obstacleSnapshot`; each edge then just filters that
 * shared array (removing its own two endpoints). These benches isolate that
 * construction cost — the routing itself (findRoute) is unchanged and cached,
 * so this is the part of a full-graph pass that C actually removes.
 *
 * Pure computation — no DOM/Alpine mount, so no teardown noise. Mirrors the
 * exact rect shape the real code feeds the router.
 */
import { bench, describe } from 'vitest';
import { toAbsoluteNode } from '../../src/core/sub-flow';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../../src/core/geometry';
import type { FlowNode } from '../../src/core/types';

interface ObstacleRect { id: string; x: number; y: number; width: number; height: number }

const NODE_COUNT = 50;
const EDGE_COUNT = 100;

const nodes: FlowNode[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
  id: `n${i}`,
  position: { x: (i % 10) * 300, y: Math.floor(i / 10) * 300 },
  dimensions: { width: 150, height: 80 },
  data: {},
}));
const nodeMap = new Map<string, FlowNode>(nodes.map((n) => [n.id, n]));
const edges = Array.from({ length: EDGE_COUNT }, (_, i) => ({
  source: `n${i % NODE_COUNT}`,
  target: `n${(i + 7) % NODE_COUNT}`,
}));

/** Pre-C: each edge rebuilds the parent-lookup map + obstacle array from all nodes. */
function legacyPerEdgeRebuild(): void {
  for (const e of edges) {
    const rawNodeMap = new Map<string, FlowNode>(nodes.map((n): [string, FlowNode] => [n.id, n]));
    const obstacles: ObstacleRect[] = nodes
      .filter((n) => n.id !== e.source && n.id !== e.target)
      .map((n) => {
        const abs = toAbsoluteNode(n, rawNodeMap);
        return {
          id: n.id,
          x: abs.position.x,
          y: abs.position.y,
          width: abs.dimensions?.width ?? DEFAULT_NODE_WIDTH,
          height: abs.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
        };
      });
    void obstacles.length;
  }
}

/** C: build the snapshot once per commit, then each edge just filters it. */
function sharedSnapshotThenFilter(): void {
  const snapshot: ObstacleRect[] = nodes.map((n) => {
    const abs = toAbsoluteNode(n, nodeMap);
    return {
      id: n.id,
      x: abs.position.x,
      y: abs.position.y,
      width: abs.dimensions?.width ?? DEFAULT_NODE_WIDTH,
      height: abs.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
    };
  });
  for (const e of edges) {
    const obstacles = snapshot.filter((r) => r.id !== e.source && r.id !== e.target);
    void obstacles.length;
  }
}

describe(`Workstream C — obstacle construction, full-graph pass (${NODE_COUNT} nodes × ${EDGE_COUNT} edges)`, () => {
  bench('legacy: per-edge obstacle rebuild', legacyPerEdgeRebuild, { iterations: 200 });
  bench('shared: build snapshot once + filter per edge', sharedSnapshotThenFilter, { iterations: 200 });
});
