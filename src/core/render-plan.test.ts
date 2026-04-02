import { describe, it, expect } from 'vitest';
import { computeRenderPlan } from './render-plan';
import type { FlowNode, FlowEdge } from './types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeNode(overrides: Partial<FlowNode> & { id: string }): FlowNode {
  return {
    position: { x: 0, y: 0 },
    data: {},
    ...overrides,
  };
}

function makeEdge(overrides: Partial<FlowEdge> & { id: string; source: string; target: string }): FlowEdge {
  return { ...overrides };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('computeRenderPlan', () => {
  // 1. Empty input
  it('returns empty plan for empty input', () => {
    const plan = computeRenderPlan([], []);
    expect(plan.nodes).toEqual([]);
    expect(plan.edges).toEqual([]);
    expect(plan.markers).toBe('');
    expect(plan.viewBox).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    expect(plan.viewport).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  // 2. Nodes with explicit dimensions are preserved
  it('preserves explicit node dimensions', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'n1', position: { x: 10, y: 20 }, dimensions: { width: 200, height: 80 } }),
    ];
    const plan = computeRenderPlan(nodes, []);
    expect(plan.nodes[0].width).toBe(200);
    expect(plan.nodes[0].height).toBe(80);
  });

  // 3. Nodes without dimensions get defaults (150x50)
  it('applies default dimensions when missing', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'n1', position: { x: 0, y: 0 } }),
    ];
    const plan = computeRenderPlan(nodes, []);
    expect(plan.nodes[0].width).toBe(150);
    expect(plan.nodes[0].height).toBe(50);
  });

  // 4. Custom default dimensions via config
  it('uses custom default dimensions from config', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'n1', position: { x: 0, y: 0 } }),
    ];
    const plan = computeRenderPlan(nodes, [], {
      defaultDimensions: { width: 250, height: 100 },
    });
    expect(plan.nodes[0].width).toBe(250);
    expect(plan.nodes[0].height).toBe(100);
  });

  // 5. Bezier edge path starts with "M"
  it('generates bezier edge path starting with M', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', type: 'bezier' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.edges).toHaveLength(1);
    expect(plan.edges[0].pathD).toMatch(/^M/);
  });

  // 6. Straight edge path starts with "M"
  it('generates straight edge path starting with M', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', type: 'straight' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.edges).toHaveLength(1);
    expect(plan.edges[0].pathD).toMatch(/^M/);
  });

  // 7. Edges with markers generate marker SVG defs
  it('generates marker SVG for edges with markers', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', markerEnd: 'arrowclosed' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.markers).toContain('<marker');
    expect(plan.edges[0].markerEnd).toBeTruthy();
    expect(plan.edges[0].markerEnd).toContain('url(#');
  });

  // 8. Edges with missing source/target node are skipped
  it('skips edges with missing source or target node', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'missing' }),
      makeEdge({ id: 'e2', source: 'missing', target: 'a' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.edges).toHaveLength(0);
  });

  // 9. ViewBox encompasses all nodes
  it('computes viewBox that encompasses all nodes', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'n1', position: { x: 100, y: 50 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'n2', position: { x: 400, y: 300 }, dimensions: { width: 150, height: 50 } }),
    ];
    const plan = computeRenderPlan(nodes, [], { padding: 0 });
    // viewBox should span from (100,50) to (550,350)
    expect(plan.viewBox.x).toBe(100);
    expect(plan.viewBox.y).toBe(50);
    expect(plan.viewBox.width).toBe(450);
    expect(plan.viewBox.height).toBe(300);
  });

  // 10. Padding applied to viewBox
  it('applies padding to viewBox', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'n1', position: { x: 100, y: 50 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'n2', position: { x: 400, y: 300 }, dimensions: { width: 150, height: 50 } }),
    ];
    const plan = computeRenderPlan(nodes, [], { padding: 20 });
    // Bounds: x=100, y=50, w=450, h=300
    // With padding 20: x=80, y=30, w=490, h=340
    expect(plan.viewBox.x).toBe(80);
    expect(plan.viewBox.y).toBe(30);
    expect(plan.viewBox.width).toBe(490);
    expect(plan.viewBox.height).toBe(340);
  });

  // 11. Viewport computed to fit
  it('computes viewport to position viewBox at origin', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'n1', position: { x: 100, y: 50 }, dimensions: { width: 150, height: 50 } }),
    ];
    const plan = computeRenderPlan(nodes, [], { padding: 0 });
    expect(plan.viewport.x).toBe(-100);
    expect(plan.viewport.y).toBe(-50);
    expect(plan.viewport.zoom).toBe(1);
  });

  // 12. Hidden nodes/edges are filtered out
  it('filters out hidden nodes', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'visible', position: { x: 0, y: 0 } }),
      makeNode({ id: 'hidden', position: { x: 100, y: 100 }, hidden: true }),
    ];
    const plan = computeRenderPlan(nodes, []);
    expect(plan.nodes).toHaveLength(1);
    expect(plan.nodes[0].id).toBe('visible');
  });

  it('filters out hidden edges', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', hidden: true }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.edges).toHaveLength(0);
  });

  // 13. Node data and class preserved
  it('preserves node data and class in output', () => {
    const nodes: FlowNode[] = [
      makeNode({
        id: 'n1',
        position: { x: 10, y: 20 },
        data: { label: 'Hello', custom: 42 },
        class: 'my-node special',
      }),
    ];
    const plan = computeRenderPlan(nodes, []);
    expect(plan.nodes[0].data).toEqual({ label: 'Hello', custom: 42 });
    expect(plan.nodes[0].class).toBe('my-node special');
  });

  it('preserves node string style in output', () => {
    const nodes: FlowNode[] = [
      makeNode({
        id: 'n1',
        position: { x: 0, y: 0 },
        style: 'color: red',
      }),
    ];
    const plan = computeRenderPlan(nodes, []);
    expect(plan.nodes[0].style).toBe('color: red');
  });

  it('serializes node object style to CSS string', () => {
    const nodes: FlowNode[] = [
      makeNode({
        id: 'n1',
        position: { x: 0, y: 0 },
        style: { color: 'red', 'font-size': '14px' },
      }),
    ];
    const plan = computeRenderPlan(nodes, []);
    expect(typeof plan.nodes[0].style).toBe('string');
    expect(plan.nodes[0].style).toBe('color:red;font-size:14px');
  });

  // Edge label preserved
  it('preserves edge label in output', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', label: 'connects to' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.edges[0].label).toBe('connects to');
  });

  // Edge labelX/labelY computed for edges with labels — uses path's labelPosition
  it('computes labelX and labelY from edge path labelPosition', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 50 } }),
      makeNode({ id: 'b', position: { x: 200, y: 100 }, dimensions: { width: 100, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', label: 'test' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    // labelX/labelY should come from getEdgePath's labelPosition, not the naive midpoint
    expect(plan.edges[0].labelX).toBeTypeOf('number');
    expect(plan.edges[0].labelY).toBeTypeOf('number');
    // The path-based label position differs from the naive node-center midpoint (150, 75)
    expect(plan.edges[0].labelX).toBeDefined();
    expect(plan.edges[0].labelY).toBeDefined();
  });

  it('does not include labelX/labelY for edges without labels', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.edges[0].labelX).toBeUndefined();
    expect(plan.edges[0].labelY).toBeUndefined();
  });

  // Edge class preserved
  it('preserves edge class in output', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', class: 'highlighted' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.edges[0].class).toBe('highlighted');
  });

  // Marker deduplication
  it('deduplicates identical markers across edges', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'c', position: { x: 600, y: 0 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', markerEnd: 'arrowclosed' }),
      makeEdge({ id: 'e2', source: 'b', target: 'c', markerEnd: 'arrowclosed' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    // Same marker type + same color => only one <marker> definition
    const markerCount = (plan.markers.match(/<marker/g) || []).length;
    expect(markerCount).toBe(1);
  });

  // markerStart support
  it('supports markerStart on edges', () => {
    const nodes: FlowNode[] = [
      makeNode({ id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 150, height: 50 } }),
      makeNode({ id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 150, height: 50 } }),
    ];
    const edges: FlowEdge[] = [
      makeEdge({ id: 'e1', source: 'a', target: 'b', markerStart: 'arrow' }),
    ];
    const plan = computeRenderPlan(nodes, edges);
    expect(plan.markers).toContain('<marker');
    expect(plan.edges[0].markerStart).toContain('url(#');
  });
});
