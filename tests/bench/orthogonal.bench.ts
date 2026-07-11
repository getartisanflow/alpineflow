/**
 * Orthogonal / avoidant routing benchmark (Workstream 4, Tasks 24–26).
 *
 * The pre-refactor Dijkstra used a linear-scan priority queue plus an all-pairs
 * neighbour test on every pop, and rebuilt the full visibility graph from every
 * node on every route — O(P²·N) per edge, collapsing at schema scale. These
 * benches measure the realistic workloads the optimisations target:
 *
 *   - a single route across a dense obstacle field (raw pathfinding cost, T24)
 *   - a full-graph pass routing many edges across one field (T24 + T25 + the
 *     T26 memo cache, which makes repeated identical passes nearly free)
 *
 * Pure computation — no DOM/Alpine mount, so no teardown noise.
 */
import { bench, describe } from 'vitest';
import { findRoute } from '../../src/core/edge-paths/orthogonal';

interface Rect { x: number; y: number; width: number; height: number }

function denseField(cols: number, rows: number): Rect[] {
  return Array.from({ length: cols * rows }, (_, i) => ({
    x: (i % cols) * 150,
    y: Math.floor(i / cols) * 120,
    width: 100,
    height: 80,
  }));
}

describe('orthogonal findRoute — schema-scale routing', () => {
  const dense48 = denseField(8, 6);
  const field100 = denseField(10, 10);

  bench(
    'single route across a dense 48-obstacle field',
    () => {
      findRoute(-50, -50, 'right', 1250, 750, 'left', dense48);
    },
    { iterations: 30 },
  );

  bench(
    'full-graph pass: 60 edges across a 100-obstacle field',
    () => {
      for (let i = 0; i < 60; i++) {
        findRoute(-50, -60 + i * 4, 'right', 1550, 1200 - i * 3, 'left', field100);
      }
    },
    { iterations: 10 },
  );
});
