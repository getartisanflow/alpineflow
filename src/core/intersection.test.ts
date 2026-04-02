import { describe, it, expect } from 'vitest';
import type { FlowNode, Rect } from './types';
import {
  getNodeRect,
  rectsIntersect,
  getIntersectingNodes,
  isNodeIntersecting,
  clampToAvoidOverlap,
} from './intersection';

function makeNode(id: string, x: number, y: number, w?: number, h?: number): FlowNode {
  return {
    id,
    position: { x, y },
    data: {},
    dimensions: w != null && h != null ? { width: w, height: h } : undefined,
  };
}

// ── getNodeRect ──────────────────────────────────────────────────────────────

describe('getNodeRect', () => {
  it('uses dimensions when available', () => {
    const node = makeNode('a', 10, 20, 200, 100);
    expect(getNodeRect(node)).toEqual({ x: 10, y: 20, width: 200, height: 100 });
  });

  it('falls back to defaults when dimensions are missing', () => {
    const node = makeNode('a', 5, 15);
    const rect = getNodeRect(node);
    expect(rect).toEqual({ x: 5, y: 15, width: 150, height: 50 });
  });
});

// ── rectsIntersect ───────────────────────────────────────────────────────────

describe('rectsIntersect', () => {
  it('returns true for overlapping rects', () => {
    const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
    const b: Rect = { x: 50, y: 50, width: 100, height: 100 };
    expect(rectsIntersect(a, b)).toBe(true);
  });

  it('returns false for non-overlapping rects', () => {
    const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
    const b: Rect = { x: 200, y: 200, width: 100, height: 100 };
    expect(rectsIntersect(a, b)).toBe(false);
  });

  it('returns false for touching edges (exclusive boundary)', () => {
    const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
    const b: Rect = { x: 100, y: 0, width: 100, height: 100 };
    expect(rectsIntersect(a, b)).toBe(false);
  });

  it('detects partial overlap on one axis', () => {
    const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
    const b: Rect = { x: 99, y: 0, width: 100, height: 100 };
    expect(rectsIntersect(a, b)).toBe(true);
  });
});

// ── getIntersectingNodes ─────────────────────────────────────────────────────

describe('getIntersectingNodes', () => {
  const nodeA = makeNode('a', 0, 0, 100, 100);
  const nodeB = makeNode('b', 50, 50, 100, 100);
  const nodeC = makeNode('c', 300, 300, 100, 100);
  const nodeD = makeNode('d', 10, 10, 30, 30); // fully inside A
  const all = [nodeA, nodeB, nodeC, nodeD];

  it('returns partially overlapping nodes by default', () => {
    const result = getIntersectingNodes(nodeA, all);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('b');
    expect(ids).toContain('d');
    expect(ids).not.toContain('c');
  });

  it('excludes the source node itself', () => {
    const result = getIntersectingNodes(nodeA, all);
    expect(result.map((n) => n.id)).not.toContain('a');
  });

  it('returns only fully contained nodes when partially=false', () => {
    const result = getIntersectingNodes(nodeA, all, false);
    const ids = result.map((n) => n.id);
    expect(ids).toContain('d');
    expect(ids).not.toContain('b'); // partially overlaps, not fully contained
  });

  it('returns empty array when no intersections', () => {
    const result = getIntersectingNodes(nodeC, all);
    expect(result).toEqual([]);
  });
});

// ── isNodeIntersecting ───────────────────────────────────────────────────────

describe('isNodeIntersecting', () => {
  const nodeA = makeNode('a', 0, 0, 100, 100);
  const nodeB = makeNode('b', 50, 50, 100, 100);
  const nodeC = makeNode('c', 300, 300, 100, 100);

  it('returns true for overlapping nodes', () => {
    expect(isNodeIntersecting(nodeA, nodeB)).toBe(true);
  });

  it('returns false for non-overlapping nodes', () => {
    expect(isNodeIntersecting(nodeA, nodeC)).toBe(false);
  });

  it('returns false when comparing a node with itself', () => {
    expect(isNodeIntersecting(nodeA, nodeA)).toBe(false);
  });

  it('checks full containment when partially=false', () => {
    const inner = makeNode('inner', 10, 10, 30, 30);
    expect(isNodeIntersecting(nodeA, inner, false)).toBe(true);
    expect(isNodeIntersecting(nodeA, nodeB, false)).toBe(false);
  });
});

// ── clampToAvoidOverlap ──────────────────────────────────────────────────────

describe('clampToAvoidOverlap', () => {
  it('returns position unchanged when no overlap', () => {
    const rects: Rect[] = [{ x: 200, y: 200, width: 100, height: 100 }];
    const result = clampToAvoidOverlap({ x: 0, y: 0 }, 50, 50, rects);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('pushes node out along shortest axis', () => {
    // Node at (0,0) 50x50, obstacle at (40,0) 100x100
    // Overlap on x = 50 - (40-5) = 15, push right = 100+0+5 - 0 = 145
    // Overlap on y-up = 50 - (0-5) = 55, push down = 100+0+5-0 = 105
    // Shortest is pushLeft (15), so x shifts left by 15
    const rects: Rect[] = [{ x: 40, y: 0, width: 100, height: 100 }];
    const result = clampToAvoidOverlap({ x: 0, y: 0 }, 50, 50, rects, 5);
    expect(result.x).toBeLessThan(0);
  });

  it('respects custom gap parameter', () => {
    const rects: Rect[] = [{ x: 100, y: 0, width: 100, height: 100 }];
    // Node at (50,0) 50x50 with gap=10: right edge 100, obstacle left 100-10=90
    // 100 > 90 so it overlaps with gap
    const result = clampToAvoidOverlap({ x: 50, y: 0 }, 50, 50, rects, 10);
    expect(result.x).not.toBe(50);
  });

  it('handles no obstacles', () => {
    const result = clampToAvoidOverlap({ x: 10, y: 20 }, 50, 50, []);
    expect(result).toEqual({ x: 10, y: 20 });
  });
});
