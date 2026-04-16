// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockCtx } from './__test-utils';
import { createDomMixin } from './canvas-dom';
import type { FlowNode, FlowEdge } from '../../core/types';

// ── Mock Alpine ──────────────────────────────────────────────────────────────

const Alpine = { raw: (x: any) => x };

// ── Mock edge-utils ──────────────────────────────────────────────────────────

vi.mock('../../core/edge-utils', () => ({
  getHandleCoords: vi.fn(() => ({ x: 0, y: 0 })),
  shortenEndpoint: vi.fn((pt: any) => pt),
  getEdgePath: vi.fn(() => ({ path: 'M0,0 L100,100', labelPosition: { x: 50, y: 50 } })),
}));

// ── Mock floating-edge ──────────────────────────────────────────────────────

vi.mock('../../core/floating-edge', () => ({
  getFloatingEdgeParams: vi.fn(() => ({
    sx: 10, sy: 20, tx: 90, ty: 80,
    sourcePos: 'bottom', targetPos: 'top',
  })),
}));

// ── Mock sub-flow ────────────────────────────────────────────────────────────

vi.mock('../../core/sub-flow', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    toAbsoluteNode: vi.fn((node: any) => node),
  };
});

// ── Mock gradients ───────────────────────────────────────────────────────────

vi.mock('../../core/gradients', () => ({
  isGradient: vi.fn((c: any) => typeof c === 'object' && c !== null && 'from' in c && 'to' in c),
  getGradientId: vi.fn((flowId: string, edgeId: string) => `${flowId}__grad__${edgeId}`),
  upsertGradientDef: vi.fn(),
}));

// ── Mock interpolators ───────────────────────────────────────────────────────

vi.mock('../../animate/interpolators', () => ({
  parseStyle: vi.fn((s: string) => {
    const result: Record<string, string> = {};
    for (const part of s.split(';')) {
      const [k, v] = part.split(':').map((p: string) => p.trim());
      if (k && v) result[k] = v;
    }
    return result;
  }),
}));

import { getEdgePath } from '../../core/edge-utils';
import { getFloatingEdgeParams } from '../../core/floating-edge';
import { upsertGradientDef } from '../../core/gradients';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    type: 'default',
    position: { x: 100, y: 200 },
    data: {},
    dimensions: { width: 150, height: 40 },
    ...overrides,
  };
}

function makeEdge(id: string, source: string, target: string, overrides: Partial<FlowEdge> = {}): FlowEdge {
  return { id, source, target, ...overrides } as FlowEdge;
}

function createNodeEl(): HTMLElement {
  const el = document.createElement('div');
  return el;
}

function createPathEl(): SVGPathElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  // Stub getTotalLength and getPointAtLength for jsdom
  (el as any).getTotalLength = vi.fn(() => 200);
  (el as any).getPointAtLength = vi.fn((len: number) => ({ x: len, y: len / 2 }));
  return el;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('createDomMixin', () => {
  // ── _flushNodePositions ─────────────────────────────────────────────────

  describe('_flushNodePositions', () => {
    it('sets left/top on node elements from position', () => {
      const node = makeNode('n1', { position: { x: 50, y: 80 } });
      const nodeEl = createNodeEl();
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.nodes = [node];
      ctx._nodeElements.set('n1', nodeEl);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushNodePositions(new Set(['n1']));

      expect(nodeEl.style.left).toBe('50px');
      expect(nodeEl.style.top).toBe('80px');
    });

    it('applies nodeOrigin offset', () => {
      const node = makeNode('n1', {
        position: { x: 100, y: 200 },
        dimensions: { width: 200, height: 100 },
        nodeOrigin: [0.5, 0.5] as [number, number],
      });
      const nodeEl = createNodeEl();
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.nodes = [node];
      ctx._nodeElements.set('n1', nodeEl);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushNodePositions(new Set(['n1']));

      // x: 100 - 200*0.5 = 0, y: 200 - 100*0.5 = 150
      expect(nodeEl.style.left).toBe('0px');
      expect(nodeEl.style.top).toBe('150px');
    });

    it('uses getAbsolutePosition for child nodes with parentId', () => {
      const node = makeNode('n1', { parentId: 'parent1', position: { x: 10, y: 20 } });
      const nodeEl = createNodeEl();
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.nodes = [node];
      ctx._nodeElements.set('n1', nodeEl);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getAbsolutePosition = vi.fn(() => ({ x: 300, y: 400 }));

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushNodePositions(new Set(['n1']));

      expect(ctx.getAbsolutePosition).toHaveBeenCalledWith('n1');
      expect(nodeEl.style.left).toBe('300px');
      expect(nodeEl.style.top).toBe('400px');
    });

    it('skips missing nodes gracefully', () => {
      const ctx = mockCtx();
      ctx.getNode = vi.fn(() => undefined);

      const mixin = createDomMixin(ctx, Alpine);
      // Should not throw
      mixin._flushNodePositions(new Set(['nonexistent']));
    });

    it('skips nodes without DOM elements', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      // Do NOT set _nodeElements entry

      const mixin = createDomMixin(ctx, Alpine);
      // Should not throw
      mixin._flushNodePositions(new Set(['n1']));
    });
  });

  // ── _flushNodeStyles ────────────────────────────────────────────────────

  describe('_flushNodeStyles', () => {
    it('applies string styles to node elements', () => {
      const node = makeNode('n1', { style: 'background: red; color: blue' } as any);
      const nodeEl = createNodeEl();
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx._nodeElements.set('n1', nodeEl);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushNodeStyles(new Set(['n1']));

      expect(nodeEl.style.getPropertyValue('background')).toBe('red');
      expect(nodeEl.style.getPropertyValue('color')).toBe('blue');
    });

    it('applies record-style objects to node elements', () => {
      const node = makeNode('n1', { style: { opacity: '0.5', 'font-size': '14px' } } as any);
      const nodeEl = createNodeEl();
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx._nodeElements.set('n1', nodeEl);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushNodeStyles(new Set(['n1']));

      expect(nodeEl.style.getPropertyValue('opacity')).toBe('0.5');
      expect(nodeEl.style.getPropertyValue('font-size')).toBe('14px');
    });

    it('skips nodes without style property', () => {
      const node = makeNode('n1');
      const nodeEl = createNodeEl();
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx._nodeElements.set('n1', nodeEl);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));

      const mixin = createDomMixin(ctx, Alpine);
      // Should not throw
      mixin._flushNodeStyles(new Set(['n1']));
    });
  });

  // ── _flushEdgeStyles ────────────────────────────────────────────────────

  describe('_flushEdgeStyles', () => {
    it('applies stroke color to edge path element', () => {
      const edge = makeEdge('e1', 'n1', 'n2', { color: '#ff0000' });
      const pathEl = createPathEl();
      const ctx = mockCtx();
      ctx._edgeMap.set('e1', edge);
      ctx.getEdge = vi.fn((id: string) => ctx._edgeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => pathEl as any);

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushEdgeStyles(new Set(['e1']));

      // jsdom normalizes hex to rgb
      expect(pathEl.style.stroke).toBe('rgb(255, 0, 0)');
    });

    it('applies strokeWidth to edge path element', () => {
      const edge = makeEdge('e1', 'n1', 'n2', { strokeWidth: 3 });
      const pathEl = createPathEl();
      const ctx = mockCtx();
      ctx._edgeMap.set('e1', edge);
      ctx.getEdge = vi.fn((id: string) => ctx._edgeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => pathEl as any);

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushEdgeStyles(new Set(['e1']));

      expect(pathEl.style.strokeWidth).toBe('3');
    });

    it('skips missing edges', () => {
      const ctx = mockCtx();
      ctx.getEdge = vi.fn(() => undefined);

      const mixin = createDomMixin(ctx, Alpine);
      // Should not throw
      mixin._flushEdgeStyles(new Set(['nonexistent']));
    });

    it('skips edges without path element', () => {
      const edge = makeEdge('e1', 'n1', 'n2', { color: '#ff0000' });
      const ctx = mockCtx();
      ctx._edgeMap.set('e1', edge);
      ctx.getEdge = vi.fn((id: string) => ctx._edgeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => null);

      const mixin = createDomMixin(ctx, Alpine);
      // Should not throw
      mixin._flushEdgeStyles(new Set(['e1']));
    });
  });

  // ── _flushViewport ─────────────────────────────────────────────────────

  describe('_flushViewport', () => {
    it('sets transform on viewport element', () => {
      const viewportEl = document.createElement('div');
      const ctx = mockCtx();
      ctx._viewportEl = viewportEl;
      ctx.viewport = { x: 10, y: 20, zoom: 1.5 };

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushViewport();

      expect(viewportEl.style.transform).toBe('translate(10px, 20px) scale(1.5)');
    });

    it('calls _applyBackground and _applyCulling', () => {
      const ctx = mockCtx();
      ctx._viewportEl = document.createElement('div');

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushViewport();

      expect(ctx._applyBackground).toHaveBeenCalled();
      expect(ctx._applyCulling).toHaveBeenCalled();
    });

    it('still calls background/culling when viewportEl is null', () => {
      const ctx = mockCtx();
      ctx._viewportEl = null;

      const mixin = createDomMixin(ctx, Alpine);
      mixin._flushViewport();

      expect(ctx._applyBackground).toHaveBeenCalled();
      expect(ctx._applyCulling).toHaveBeenCalled();
    });
  });

  // ── _refreshEdgePaths ──────────────────────────────────────────────────

  describe('_refreshEdgePaths', () => {
    it('skips edges not connected to moved nodes', () => {
      const edge = makeEdge('e1', 'n1', 'n2');
      const sourceNode = makeNode('n1');
      const targetNode = makeNode('n2');
      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx._nodeMap.set('n1', sourceNode);
      ctx._nodeMap.set('n2', targetNode);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => null);

      const mixin = createDomMixin(ctx, Alpine);
      mixin._refreshEdgePaths(new Set(['n3']));

      // getEdgePath should not have been called since n3 is not connected
      expect(getEdgePath).not.toHaveBeenCalled();
    });

    it('updates path d attribute for connected edges', () => {
      const edge = makeEdge('e1', 'n1', 'n2');
      const sourceNode = makeNode('n1');
      const targetNode = makeNode('n2');
      const pathEl = createPathEl();

      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx._nodeMap.set('n1', sourceNode);
      ctx._nodeMap.set('n2', targetNode);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => pathEl as any);

      const mixin = createDomMixin(ctx, Alpine);
      mixin._refreshEdgePaths(new Set(['n1']));

      expect(pathEl.getAttribute('d')).toBe('M0,0 L100,100');
    });

    it('uses getFloatingEdgeParams for floating edges', () => {
      const edge = makeEdge('e1', 'n1', 'n2', { type: 'floating' });
      const sourceNode = makeNode('n1');
      const targetNode = makeNode('n2');
      const pathEl = createPathEl();

      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx._nodeMap.set('n1', sourceNode);
      ctx._nodeMap.set('n2', targetNode);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => pathEl as any);

      const mixin = createDomMixin(ctx, Alpine);
      mixin._refreshEdgePaths(new Set(['n1']));

      expect(getFloatingEdgeParams).toHaveBeenCalled();
    });

    it('updates interaction path sibling if present', () => {
      const edge = makeEdge('e1', 'n1', 'n2');
      const sourceNode = makeNode('n1');
      const targetNode = makeNode('n2');

      // Build a DOM structure: <g><path class="interaction"/><path class="visible"/></g>
      const gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const interactionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const visiblePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      (visiblePath as any).getTotalLength = vi.fn(() => 200);
      (visiblePath as any).getPointAtLength = vi.fn((len: number) => ({ x: len, y: len / 2 }));
      gEl.appendChild(interactionPath);
      gEl.appendChild(visiblePath);

      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx._nodeMap.set('n1', sourceNode);
      ctx._nodeMap.set('n2', targetNode);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => visiblePath as any);

      const mixin = createDomMixin(ctx, Alpine);
      mixin._refreshEdgePaths(new Set(['n1']));

      expect(interactionPath.getAttribute('d')).toBe('M0,0 L100,100');
    });

    it('calls upsertGradientDef for gradient-colored edges', () => {
      const gradColor = { from: '#ff0000', to: '#0000ff' };
      const edge = makeEdge('e1', 'n1', 'n2', { color: gradColor as any });
      const sourceNode = makeNode('n1');
      const targetNode = makeNode('n2');
      const pathEl = createPathEl();

      // Create a marker defs SVG with <defs> inside
      const markerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      markerSvg.appendChild(defs);

      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx._nodeMap.set('n1', sourceNode);
      ctx._nodeMap.set('n2', targetNode);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => pathEl as any);
      ctx._markerDefsEl = markerSvg as any;

      const mixin = createDomMixin(ctx, Alpine);
      mixin._refreshEdgePaths(new Set(['n1']));

      expect(upsertGradientDef).toHaveBeenCalled();
    });

    it('positions edge labels at computed label position', () => {
      const edge = makeEdge('e1', 'n1', 'n2', { label: 'Hello' });
      const sourceNode = makeNode('n1');
      const targetNode = makeNode('n2');
      const pathEl = createPathEl();

      // Build viewport with label element
      const viewportEl = document.createElement('div');
      const labelEl = document.createElement('div');
      labelEl.setAttribute('data-flow-edge-id', 'e1');
      labelEl.classList.add('flow-edge-label');
      viewportEl.appendChild(labelEl);

      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx._nodeMap.set('n1', sourceNode);
      ctx._nodeMap.set('n2', targetNode);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => pathEl as any);
      ctx._viewportEl = viewportEl;

      const mixin = createDomMixin(ctx, Alpine);
      mixin._refreshEdgePaths(new Set(['n1']));

      expect(labelEl.style.left).toBe('50px');
      expect(labelEl.style.top).toBe('50px');
    });

    it('positions labelStart using getPointAtLength', () => {
      const edge = makeEdge('e1', 'n1', 'n2', { labelStart: 'Start' });
      const sourceNode = makeNode('n1');
      const targetNode = makeNode('n2');
      const pathEl = createPathEl();

      const viewportEl = document.createElement('div');
      const labelEl = document.createElement('div');
      labelEl.setAttribute('data-flow-edge-id', 'e1');
      labelEl.classList.add('flow-edge-label-start');
      viewportEl.appendChild(labelEl);

      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx._nodeMap.set('n1', sourceNode);
      ctx._nodeMap.set('n2', targetNode);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => pathEl as any);
      ctx._viewportEl = viewportEl;

      const mixin = createDomMixin(ctx, Alpine);
      mixin._refreshEdgePaths(new Set(['n1']));

      // labelStartOffset defaults to 30; min(30, 200/2=100) = 30
      // getPointAtLength(30) returns { x: 30, y: 15 }
      expect(labelEl.style.left).toBe('30px');
      expect(labelEl.style.top).toBe('15px');
    });

    it('positions labelEnd using getPointAtLength', () => {
      const edge = makeEdge('e1', 'n1', 'n2', { labelEnd: 'End' });
      const sourceNode = makeNode('n1');
      const targetNode = makeNode('n2');
      const pathEl = createPathEl();

      const viewportEl = document.createElement('div');
      const labelEl = document.createElement('div');
      labelEl.setAttribute('data-flow-edge-id', 'e1');
      labelEl.classList.add('flow-edge-label-end');
      viewportEl.appendChild(labelEl);

      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx._nodeMap.set('n1', sourceNode);
      ctx._nodeMap.set('n2', targetNode);
      ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));
      ctx.getEdgePathElement = vi.fn(() => pathEl as any);
      ctx._viewportEl = viewportEl;

      const mixin = createDomMixin(ctx, Alpine);
      mixin._refreshEdgePaths(new Set(['n2']));

      // labelEndOffset defaults to 30; max(200-30=170, 200/2=100) = 170
      // getPointAtLength(170) returns { x: 170, y: 85 }
      expect(labelEl.style.left).toBe('170px');
      expect(labelEl.style.top).toBe('85px');
    });

    it('skips edges whose source/target nodes are missing', () => {
      vi.mocked(getEdgePath).mockClear();

      const edge = makeEdge('e1', 'n1', 'n2');
      const ctx = mockCtx();
      ctx.edges = [edge];
      ctx.getNode = vi.fn(() => undefined);

      const mixin = createDomMixin(ctx, Alpine);
      // Should not throw
      mixin._refreshEdgePaths(new Set(['n1']));

      expect(getEdgePath).not.toHaveBeenCalled();
    });
  });

  // ── getNodeElement ──────────────────────────────────────────────────────────

  describe('getNodeElement', () => {
    it('returns the registered element for a known id', () => {
      const el = document.createElement('div');
      const ctx = mockCtx();
      ctx._nodeElements.set('node-1', el);

      const mixin = createDomMixin(ctx, Alpine);
      expect(mixin.getNodeElement('node-1')).toBe(el);
    });

    it('returns undefined for an unknown id', () => {
      const ctx = mockCtx();

      const mixin = createDomMixin(ctx, Alpine);
      expect(mixin.getNodeElement('nonexistent')).toBeUndefined();
    });
  });

  // ── getNodeIdFromElement ────────────────────────────────────────────────────

  describe('getNodeIdFromElement', () => {
    it('returns the id when the element itself has the data-flow-node-id attribute', () => {
      const outer = document.createElement('div');
      outer.dataset.flowNodeId = 'node-1';

      const ctx = mockCtx();
      const mixin = createDomMixin(ctx, Alpine);
      expect(mixin.getNodeIdFromElement(outer)).toBe('node-1');
    });

    it('walks up and returns the id from an ancestor with data-flow-node-id', () => {
      const outer = document.createElement('div');
      outer.dataset.flowNodeId = 'node-1';
      const inner = document.createElement('span');
      outer.appendChild(inner);

      const ctx = mockCtx();
      const mixin = createDomMixin(ctx, Alpine);
      expect(mixin.getNodeIdFromElement(inner)).toBe('node-1');
    });

    it('returns null when no ancestor has the data-flow-node-id attribute', () => {
      const isolated = document.createElement('div');

      const ctx = mockCtx();
      const mixin = createDomMixin(ctx, Alpine);
      expect(mixin.getNodeIdFromElement(isolated)).toBeNull();
    });
  });
});
