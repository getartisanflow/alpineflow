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
import type { FlowNode, FlowCanvasConfig } from '../../core/types';

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

    expect(canvas._obstacleSnapshot).not.toBe(snapA); // rebuilt on commit
    expect(
      canvas._spatialGrid.query({ minX: 290, minY: -10, maxX: 500, maxY: 100 }).has('n1'),
    ).toBe(true);
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
