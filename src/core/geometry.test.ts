import { describe, it, expect } from 'vitest';
import {
  screenToFlowPosition,
  flowToScreenPosition,
  getNodesBounds,
  getNodesInRect,
  getNodesFullyInRect,
  getRotatedBounds,
  getViewportForBounds,
  getVisibleBounds,
  SpatialGrid,
  DEFAULT_NODE_WIDTH,
  DEFAULT_NODE_HEIGHT,
} from './geometry';
import type { FlowNode, Viewport, Rect } from './types';
import { nodeA, nodeB, nodeC, nodes, makeDOMRect } from './__fixtures__/nodes';

// ── screenToFlowPosition ────────────────────────────────────────────────────

describe('screenToFlowPosition', () => {
  const viewport: Viewport = { x: 100, y: 50, zoom: 1 };
  const rect = makeDOMRect(0, 0, 800, 600);

  it('converts at zoom 1 with no container offset', () => {
    const pos = screenToFlowPosition(200, 150, viewport, rect);
    expect(pos).toEqual({ x: 100, y: 100 });
  });

  it('accounts for container offset', () => {
    const offsetRect = makeDOMRect(50, 25, 800, 600);
    const pos = screenToFlowPosition(200, 150, viewport, offsetRect);
    expect(pos).toEqual({ x: 50, y: 75 });
  });

  it('accounts for zoom', () => {
    const zoomedViewport: Viewport = { x: 0, y: 0, zoom: 2 };
    const pos = screenToFlowPosition(200, 100, zoomedViewport, rect);
    expect(pos).toEqual({ x: 100, y: 50 });
  });

  it('handles fractional zoom', () => {
    const zoomVp: Viewport = { x: 0, y: 0, zoom: 0.5 };
    const pos = screenToFlowPosition(100, 50, zoomVp, rect);
    expect(pos).toEqual({ x: 200, y: 100 });
  });
});

// ── flowToScreenPosition ────────────────────────────────────────────────────

describe('flowToScreenPosition', () => {
  const viewport: Viewport = { x: 100, y: 50, zoom: 1 };
  const rect = makeDOMRect(0, 0, 800, 600);

  it('converts at zoom 1', () => {
    const pos = flowToScreenPosition(100, 100, viewport, rect);
    expect(pos).toEqual({ x: 200, y: 150 });
  });

  it('is inverse of screenToFlowPosition', () => {
    const screenX = 300;
    const screenY = 250;
    const flowPos = screenToFlowPosition(screenX, screenY, viewport, rect);
    const backToScreen = flowToScreenPosition(flowPos.x, flowPos.y, viewport, rect);
    expect(backToScreen.x).toBeCloseTo(screenX);
    expect(backToScreen.y).toBeCloseTo(screenY);
  });

  it('accounts for zoom', () => {
    const zoomedVp: Viewport = { x: 0, y: 0, zoom: 2 };
    const pos = flowToScreenPosition(100, 50, zoomedVp, rect);
    expect(pos).toEqual({ x: 200, y: 100 });
  });
});

// ── getNodesBounds ──────────────────────────────────────────────────────────

describe('getNodesBounds', () => {
  it('returns zero rect for empty array', () => {
    expect(getNodesBounds([])).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });

  it('returns bounds of single node', () => {
    const bounds = getNodesBounds([nodeA]);
    expect(bounds).toEqual({ x: 0, y: 0, width: 150, height: 50 });
  });

  it('encompasses multiple nodes', () => {
    const bounds = getNodesBounds([nodeA, nodeC]);
    // nodeA: (0,0)-(150,50), nodeC: (400,200)-(550,250)
    expect(bounds).toEqual({ x: 0, y: 0, width: 550, height: 250 });
  });

  it('uses default dimensions when not specified', () => {
    const noDims: FlowNode = { id: 'x', position: { x: 0, y: 0 }, data: {} };
    const bounds = getNodesBounds([noDims]);
    expect(bounds).toEqual({
      x: 0,
      y: 0,
      width: DEFAULT_NODE_WIDTH,
      height: DEFAULT_NODE_HEIGHT,
    });
  });
});

// ── getNodesInRect ──────────────────────────────────────────────────────────

describe('getNodesInRect', () => {
  it('returns nodes intersecting the rectangle', () => {
    const rect: Rect = { x: 0, y: 0, width: 250, height: 200 };
    const result = getNodesInRect(nodes, rect);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    expect(ids).not.toContain('c');
  });

  it('returns empty array when no nodes intersect', () => {
    const rect: Rect = { x: 1000, y: 1000, width: 100, height: 100 };
    expect(getNodesInRect(nodes, rect)).toEqual([]);
  });

  it('includes nodes that partially overlap', () => {
    const rect: Rect = { x: 140, y: 40, width: 20, height: 20 };
    const result = getNodesInRect(nodes, rect);
    expect(result.map((n) => n.id)).toContain('a');
  });

  it('returns all nodes for a very large rect', () => {
    const rect: Rect = { x: -1000, y: -1000, width: 5000, height: 5000 };
    expect(getNodesInRect(nodes, rect)).toHaveLength(nodes.length);
  });
});

// ── getNodesFullyInRect ────────────────────────────────────────────────────

describe('getNodesFullyInRect', () => {
  it('returns nodes fully contained in the rectangle', () => {
    // nodeA: (0,0)-(150,50), nodeB: (200,100)-(350,150)
    // Rect covers nodeA fully but only partially overlaps nodeB
    const rect: Rect = { x: -10, y: -10, width: 200, height: 100 };
    const result = getNodesFullyInRect(nodes, rect);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('a');
    expect(ids).not.toContain('b');
    expect(ids).not.toContain('c');
    expect(ids).not.toContain('d');
  });

  it('returns empty array when no nodes are fully contained', () => {
    // Rect overlaps nodeA partially (right edge only)
    const rect: Rect = { x: 140, y: 40, width: 20, height: 20 };
    expect(getNodesFullyInRect(nodes, rect)).toEqual([]);
  });

  it('returns all nodes for a very large rect', () => {
    const rect: Rect = { x: -1000, y: -1000, width: 5000, height: 5000 };
    expect(getNodesFullyInRect(nodes, rect)).toHaveLength(nodes.length);
  });

  it('excludes nodes that only partially overlap', () => {
    // nodeB: (200,100)-(350,150). Rect (190,90) w=100 h=100 → right=290
    // nodeB right edge at 350 > 290, NOT fully contained
    const rect: Rect = { x: 190, y: 90, width: 100, height: 100 };
    const result = getNodesFullyInRect(nodes, rect);
    expect(result.map((n) => n.id)).not.toContain('b');
  });

  it('uses default dimensions for nodes without dimensions', () => {
    const noDims: FlowNode = { id: 'x', position: { x: 10, y: 10 }, data: {} };
    // Default: 150x50. Node spans (10,10)-(160,60).
    const contained: Rect = { x: 0, y: 0, width: 200, height: 100 };
    const notContained: Rect = { x: 0, y: 0, width: 100, height: 100 };
    expect(getNodesFullyInRect([noDims], contained).map(n => n.id)).toContain('x');
    expect(getNodesFullyInRect([noDims], notContained)).toEqual([]);
  });
});

// ── getViewportForBounds ────────────────────────────────────────────────────

describe('getViewportForBounds', () => {
  it('centers a small bounds in a large container', () => {
    const bounds: Rect = { x: 0, y: 0, width: 100, height: 100 };
    const vp = getViewportForBounds(bounds, 800, 600, 0.5, 2, 0.1);
    expect(vp.zoom).toBeGreaterThanOrEqual(0.5);
    expect(vp.zoom).toBeLessThanOrEqual(2);
  });

  it('clamps zoom to maxZoom', () => {
    const bounds: Rect = { x: 0, y: 0, width: 10, height: 10 };
    const vp = getViewportForBounds(bounds, 800, 600, 0.5, 2, 0.1);
    expect(vp.zoom).toBe(2);
  });

  it('clamps zoom to minZoom', () => {
    const bounds: Rect = { x: 0, y: 0, width: 10000, height: 10000 };
    const vp = getViewportForBounds(bounds, 800, 600, 0.5, 2, 0.1);
    expect(vp.zoom).toBe(0.5);
  });

  it('handles zero-size bounds without NaN', () => {
    const bounds: Rect = { x: 50, y: 50, width: 0, height: 0 };
    const vp = getViewportForBounds(bounds, 800, 600, 0.5, 2);
    expect(Number.isFinite(vp.x)).toBe(true);
    expect(Number.isFinite(vp.y)).toBe(true);
    expect(Number.isFinite(vp.zoom)).toBe(true);
  });
});

// ── getVisibleBounds ──────────────────────────────────────────────────────

describe('getVisibleBounds', () => {
  it('computes bounds at zoom 1 with no pan', () => {
    const bounds = getVisibleBounds({ x: 0, y: 0, zoom: 1 }, 800, 600, 0);
    expect(bounds).toEqual({ minX: 0, minY: 0, maxX: 800, maxY: 600 });
  });

  it('applies buffer', () => {
    const bounds = getVisibleBounds({ x: 0, y: 0, zoom: 1 }, 800, 600, 100);
    expect(bounds).toEqual({ minX: -100, minY: -100, maxX: 900, maxY: 700 });
  });

  it('accounts for viewport pan', () => {
    const bounds = getVisibleBounds({ x: 200, y: 100, zoom: 1 }, 800, 600, 0);
    expect(bounds).toEqual({ minX: -200, minY: -100, maxX: 600, maxY: 500 });
  });

  it('accounts for zoom', () => {
    const bounds = getVisibleBounds({ x: 0, y: 0, zoom: 2 }, 800, 600, 0);
    expect(bounds).toEqual({ minX: 0, minY: 0, maxX: 400, maxY: 300 });
  });

  it('accounts for zoom with buffer', () => {
    const bounds = getVisibleBounds({ x: 0, y: 0, zoom: 2 }, 800, 600, 50);
    expect(bounds).toEqual({ minX: -50, minY: -50, maxX: 450, maxY: 350 });
  });
});

// ── getRotatedBounds ──────────────────────────────────────────────────────

describe('getRotatedBounds', () => {
  it('returns unchanged bounds for 0 rotation', () => {
    const result = getRotatedBounds(10, 20, 100, 50, 0);
    expect(result).toEqual({ x: 10, y: 20, width: 100, height: 50 });
  });

  it('returns unchanged bounds for 360 rotation', () => {
    const result = getRotatedBounds(10, 20, 100, 50, 360);
    expect(result).toEqual({ x: 10, y: 20, width: 100, height: 50 });
  });

  it('swaps width/height for 90 degree rotation', () => {
    const result = getRotatedBounds(0, 0, 100, 50, 90);
    // Rotated AABB: centered at (50,25), new size 50x100
    expect(result.width).toBeCloseTo(50);
    expect(result.height).toBeCloseTo(100);
    expect(result.x).toBeCloseTo(25);
    expect(result.y).toBeCloseTo(-25);
  });

  it('expands bounds for 45 degree rotation', () => {
    const result = getRotatedBounds(0, 0, 100, 100, 45);
    // Square rotated 45°: diagonal = 100*sqrt(2) ≈ 141.42
    const diag = 100 * Math.SQRT2;
    expect(result.width).toBeCloseTo(diag);
    expect(result.height).toBeCloseTo(diag);
  });

  it('returns unchanged bounds for -360 rotation', () => {
    const result = getRotatedBounds(10, 20, 100, 50, -360);
    expect(result).toEqual({ x: 10, y: 20, width: 100, height: 50 });
  });

  it('returns unchanged bounds for 720 rotation', () => {
    const result = getRotatedBounds(10, 20, 100, 50, 720);
    expect(result).toEqual({ x: 10, y: 20, width: 100, height: 50 });
  });

  it('returns unchanged bounds for -720 rotation', () => {
    const result = getRotatedBounds(10, 20, 100, 50, -720);
    expect(result).toEqual({ x: 10, y: 20, width: 100, height: 50 });
  });
});

// ── getNodesBounds with rotation ──────────────────────────────────────────

describe('getNodesBounds with rotation', () => {
  it('uses expanded bounds for rotated nodes', () => {
    const nodes = [
      { id: 'a', position: { x: 0, y: 0 }, data: {}, dimensions: { width: 100, height: 50 }, rotation: 90 },
    ];
    const bounds = getNodesBounds(nodes as any);
    // 90° rotation: AABB is 50 wide, 100 tall, centered at (50, 25)
    expect(bounds.width).toBeCloseTo(50);
    expect(bounds.height).toBeCloseTo(100);
  });
});

// ── SpatialGrid ──────────────────────────────────────────────────────────

describe('SpatialGrid', () => {
  it('inserts and queries a node', () => {
    const grid = new SpatialGrid(100);
    grid.insert('a', 50, 50, 100, 50);
    const result = grid.query({ minX: 0, minY: 0, maxX: 200, maxY: 200 });
    expect(result.has('a')).toBe(true);
  });

  it('does not return nodes outside query bounds', () => {
    const grid = new SpatialGrid(100);
    grid.insert('a', 500, 500, 100, 50);
    const result = grid.query({ minX: 0, minY: 0, maxX: 200, maxY: 200 });
    expect(result.has('a')).toBe(false);
  });

  it('handles nodes spanning multiple cells', () => {
    const grid = new SpatialGrid(100);
    grid.insert('big', 50, 50, 250, 250);
    const result = grid.query({ minX: 250, minY: 250, maxX: 350, maxY: 350 });
    expect(result.has('big')).toBe(true);
  });

  it('removes a node', () => {
    const grid = new SpatialGrid(100);
    grid.insert('a', 50, 50, 100, 50);
    grid.remove('a');
    const result = grid.query({ minX: 0, minY: 0, maxX: 200, maxY: 200 });
    expect(result.has('a')).toBe(false);
    expect(grid.size).toBe(0);
  });

  it('updates a node position', () => {
    const grid = new SpatialGrid(100);
    grid.insert('a', 50, 50, 100, 50);
    grid.update('a', 500, 500, 100, 50);
    const oldResult = grid.query({ minX: 0, minY: 0, maxX: 200, maxY: 200 });
    const newResult = grid.query({ minX: 400, minY: 400, maxX: 700, maxY: 700 });
    expect(oldResult.has('a')).toBe(false);
    expect(newResult.has('a')).toBe(true);
  });

  it('clears all data', () => {
    const grid = new SpatialGrid(100);
    grid.insert('a', 0, 0, 100, 50);
    grid.insert('b', 200, 200, 100, 50);
    grid.clear();
    expect(grid.size).toBe(0);
    const result = grid.query({ minX: -1000, minY: -1000, maxX: 1000, maxY: 1000 });
    expect(result.size).toBe(0);
  });

  it('returns multiple nodes from overlapping cells', () => {
    const grid = new SpatialGrid(100);
    grid.insert('a', 10, 10, 50, 50);
    grid.insert('b', 20, 20, 50, 50);
    grid.insert('far', 900, 900, 50, 50);
    const result = grid.query({ minX: 0, minY: 0, maxX: 100, maxY: 100 });
    expect(result.has('a')).toBe(true);
    expect(result.has('b')).toBe(true);
    expect(result.has('far')).toBe(false);
  });
});
