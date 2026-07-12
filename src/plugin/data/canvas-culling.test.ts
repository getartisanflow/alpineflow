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
