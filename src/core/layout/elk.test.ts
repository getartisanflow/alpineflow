import { describe, it, expect } from 'vitest';
import { computeElkLayout } from './elk';
import type { FlowNode, FlowEdge } from '../types';

/** Helper to create a minimal FlowNode with measured dimensions. */
function node(id: string, width = 100, height = 60): FlowNode {
  return { id, position: { x: 0, y: 0 }, data: {}, dimensions: { width, height } };
}

/** Helper to create a minimal FlowEdge. */
function edge(source: string, target: string): FlowEdge {
  return { id: `${source}-${target}`, source, target };
}

/** Bounding-box of a position map (positions are node top-left corners). */
function bounds(positions: Map<string, { x: number; y: number }>, w = 100, h = 60): { width: number; height: number } {
  const xs = [...positions.values()].map((p) => p.x);
  const ys = [...positions.values()].map((p) => p.y);
  return {
    width: Math.max(...xs) + w - Math.min(...xs),
    height: Math.max(...ys) + h - Math.min(...ys),
  };
}

describe('computeElkLayout rectpacking', () => {
  const boxes = Array.from({ length: 9 }, (_, i) => node(`n${i}`));

  it('returns a position for every node', async () => {
    const positions = await computeElkLayout(boxes, [], { algorithm: 'rectpacking' });
    expect(positions.size).toBe(9);
    for (const n of boxes) {
      expect(positions.has(n.id)).toBe(true);
    }
  });

  it('ignores edges (same layout with and without them)', async () => {
    // rectpacking is for unconnected boxes; edges are dropped before layout,
    // so a connected graph must pack identically to the same nodes bare.
    const withEdges = await computeElkLayout(boxes, [edge('n0', 'n1'), edge('n1', 'n2')], { algorithm: 'rectpacking' });
    const withoutEdges = await computeElkLayout(boxes, [], { algorithm: 'rectpacking' });
    expect(Object.fromEntries(withEdges)).toEqual(Object.fromEntries(withoutEdges));
  });

  it('aspectRatio shapes the packing (wide target → wider than tall)', async () => {
    const wide = bounds(await computeElkLayout(boxes, [], { algorithm: 'rectpacking', aspectRatio: 4 }));
    const tall = bounds(await computeElkLayout(boxes, [], { algorithm: 'rectpacking', aspectRatio: 0.25 }));
    expect(wide.width / wide.height).toBeGreaterThan(tall.width / tall.height);
  });
});

describe('computeElkLayout layoutOptions escape hatch', () => {
  const graph = {
    nodes: [node('a'), node('b'), node('c')],
    edges: [edge('a', 'b'), edge('a', 'c')],
  };

  it('raw elk.* options win over wrapper-derived options', async () => {
    // Same wrapper spacing, but the raw option overrides node-node spacing to a
    // much larger value — sibling separation must grow.
    const base = await computeElkLayout(graph.nodes, graph.edges, { nodeSpacing: 20 });
    const overridden = await computeElkLayout(graph.nodes, graph.edges, {
      nodeSpacing: 20,
      layoutOptions: { 'elk.spacing.nodeNode': '300' },
    });
    const gap = (p: Map<string, { x: number; y: number }>): number =>
      Math.abs(p.get('b')!.x - p.get('c')!.x);
    expect(gap(overridden)).toBeGreaterThan(gap(base));
  });
});
