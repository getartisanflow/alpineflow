import { describe, it, expect } from 'vitest';
import type { FlowNode, FlowEdge, Viewport, FlowCanvasConfig } from '../../core/types';

/**
 * Tests for $reset() and $clear() methods.
 * We replicate the logic used in flow-canvas.ts to unit-test without a full Alpine environment.
 * Both methods delegate to fromObject(), which deep-clones via JSON.parse(JSON.stringify(...)).
 */

interface MockCanvas {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: Viewport;
  fromObject(obj: { nodes?: FlowNode[]; edges?: FlowEdge[]; viewport?: Partial<Viewport> }): void;
  $reset(): void;
  $clear(): void;
}

function makeCanvas(config: FlowCanvasConfig): MockCanvas {
  return {
    nodes: JSON.parse(JSON.stringify(config.nodes ?? [])),
    edges: JSON.parse(JSON.stringify(config.edges ?? [])),
    viewport: {
      x: config.viewport?.x ?? 0,
      y: config.viewport?.y ?? 0,
      zoom: config.viewport?.zoom ?? 1,
    },

    fromObject(obj) {
      if (obj.nodes) {
        this.nodes = JSON.parse(JSON.stringify(obj.nodes));
      }
      if (obj.edges) {
        this.edges = JSON.parse(JSON.stringify(obj.edges));
      }
      if (obj.viewport) {
        this.viewport = { ...this.viewport, ...obj.viewport };
      }
    },

    $reset() {
      this.fromObject({
        nodes: config.nodes ?? [],
        edges: config.edges ?? [],
        viewport: config.viewport ?? { x: 0, y: 0, zoom: 1 },
      });
    },

    $clear() {
      this.fromObject({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      });
    },
  };
}

describe('$reset', () => {
  it('restores initial nodes and edges', () => {
    const initial: FlowCanvasConfig = {
      nodes: [
        { id: 'a', position: { x: 10, y: 20 }, data: { label: 'A' } },
        { id: 'b', position: { x: 100, y: 200 }, data: { label: 'B' } },
      ],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    };
    const canvas = makeCanvas(initial);

    // Mutate state
    canvas.nodes.push({ id: 'c', position: { x: 0, y: 0 }, data: {} });
    canvas.edges.push({ id: 'e2', source: 'a', target: 'c' });
    expect(canvas.nodes.length).toBe(3);
    expect(canvas.edges.length).toBe(2);

    canvas.$reset();
    expect(canvas.nodes.length).toBe(2);
    expect(canvas.edges.length).toBe(1);
    expect(canvas.nodes[0].id).toBe('a');
  });

  it('restores initial viewport', () => {
    const canvas = makeCanvas({
      nodes: [],
      edges: [],
      viewport: { x: 50, y: 100, zoom: 1.5 },
    });

    canvas.viewport = { x: 999, y: 999, zoom: 0.1 };
    canvas.$reset();

    expect(canvas.viewport.x).toBe(50);
    expect(canvas.viewport.y).toBe(100);
    expect(canvas.viewport.zoom).toBe(1.5);
  });

  it('does not mutate original config arrays', () => {
    const configNodes = [{ id: 'a', position: { x: 0, y: 0 }, data: {} }];
    const canvas = makeCanvas({ nodes: configNodes, edges: [] });

    canvas.$reset();
    canvas.nodes.push({ id: 'b', position: { x: 1, y: 1 }, data: {} });

    // Original config array unchanged
    expect(configNodes.length).toBe(1);
  });
});

describe('$clear', () => {
  it('removes all nodes and edges', () => {
    const canvas = makeCanvas({
      nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'b', position: { x: 100, y: 100 }, data: {} },
      ],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    });

    expect(canvas.nodes.length).toBe(2);
    expect(canvas.edges.length).toBe(1);

    canvas.$clear();
    expect(canvas.nodes.length).toBe(0);
    expect(canvas.edges.length).toBe(0);
  });

  it('resets viewport to origin', () => {
    const canvas = makeCanvas({
      nodes: [],
      edges: [],
      viewport: { x: 50, y: 100, zoom: 1.5 },
    });

    canvas.$clear();
    expect(canvas.viewport.x).toBe(0);
    expect(canvas.viewport.y).toBe(0);
    expect(canvas.viewport.zoom).toBe(1);
  });
});
