import { describe, it, expect } from 'vitest';
import { pointInPolygon, polygonIntersectsAABB, getNodesInPolygon, getNodesFullyInPolygon } from './lasso-hit-test';
import type { FlowNode } from './types';

// ── pointInPolygon ──────────────────────────────────────────────────

describe('pointInPolygon', () => {
  const square = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];

  it('returns true for a point inside', () => {
    expect(pointInPolygon(50, 50, square)).toBe(true);
  });

  it('returns false for a point outside', () => {
    expect(pointInPolygon(150, 50, square)).toBe(false);
  });

  it('returns false for a point above', () => {
    expect(pointInPolygon(50, -10, square)).toBe(false);
  });

  // L-shaped polygon: concave shape
  const lShape = [
    { x: 0, y: 0 },
    { x: 60, y: 0 },
    { x: 60, y: 40 },
    { x: 20, y: 40 },
    { x: 20, y: 100 },
    { x: 0, y: 100 },
  ];

  it('returns true for point inside L arm', () => {
    expect(pointInPolygon(10, 10, lShape)).toBe(true);
  });

  it('returns true for point inside L leg', () => {
    expect(pointInPolygon(10, 80, lShape)).toBe(true);
  });

  it('returns false for point in concave notch', () => {
    expect(pointInPolygon(40, 70, lShape)).toBe(false);
  });

  it('handles triangle polygon', () => {
    const triangle = [
      { x: 50, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ];
    expect(pointInPolygon(50, 50, triangle)).toBe(true);
    expect(pointInPolygon(5, 5, triangle)).toBe(false);
  });

  it('returns false for fewer than 3 points', () => {
    expect(pointInPolygon(0, 0, [{ x: 0, y: 0 }, { x: 1, y: 1 }])).toBe(false);
  });
});

// ── polygonIntersectsAABB ───────────────────────────────────────────

describe('polygonIntersectsAABB', () => {
  const square = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];

  it('returns true when AABB is fully inside polygon', () => {
    expect(polygonIntersectsAABB(square, { x: 20, y: 20, width: 30, height: 30 })).toBe(true);
  });

  it('returns true when AABB partially overlaps polygon', () => {
    expect(polygonIntersectsAABB(square, { x: 80, y: 80, width: 40, height: 40 })).toBe(true);
  });

  it('returns false when AABB is completely outside', () => {
    expect(polygonIntersectsAABB(square, { x: 200, y: 200, width: 50, height: 50 })).toBe(false);
  });

  it('returns true when polygon edge crosses AABB', () => {
    const triangle = [
      { x: -10, y: 50 },
      { x: 110, y: 50 },
      { x: 50, y: -10 },
    ];
    expect(polygonIntersectsAABB(triangle, { x: 40, y: 40, width: 20, height: 20 })).toBe(true);
  });
});

// ── getNodesInPolygon / getNodesFullyInPolygon ──────────────────────

describe('getNodesInPolygon', () => {
  const nodes: FlowNode[] = [
    { id: 'a', position: { x: 10, y: 10 }, data: {}, dimensions: { width: 50, height: 30 } },
    { id: 'b', position: { x: 200, y: 200 }, data: {}, dimensions: { width: 50, height: 30 } },
    { id: 'c', position: { x: 80, y: 80 }, data: {}, dimensions: { width: 50, height: 30 } },
  ];

  const polygon = [
    { x: 0, y: 0 },
    { x: 120, y: 0 },
    { x: 120, y: 120 },
    { x: 0, y: 120 },
  ];

  it('returns nodes whose center is inside or AABB intersects polygon', () => {
    const result = getNodesInPolygon(nodes, polygon);
    const ids = result.map(n => n.id);
    expect(ids).toContain('a');
    expect(ids).toContain('c');
    expect(ids).not.toContain('b');
  });

  it('skips hidden and non-selectable nodes', () => {
    const withHidden: FlowNode[] = [
      { id: 'a', position: { x: 10, y: 10 }, data: {}, dimensions: { width: 50, height: 30 } },
      { id: 'h', position: { x: 20, y: 20 }, data: {}, dimensions: { width: 50, height: 30 }, hidden: true },
      { id: 's', position: { x: 30, y: 30 }, data: {}, dimensions: { width: 50, height: 30 }, selectable: false },
    ];
    const result = getNodesInPolygon(withHidden, polygon);
    expect(result.map(n => n.id)).toEqual(['a']);
  });
});

describe('getNodesFullyInPolygon', () => {
  const nodes: FlowNode[] = [
    { id: 'inside', position: { x: 10, y: 10 }, data: {}, dimensions: { width: 30, height: 20 } },
    { id: 'partial', position: { x: 90, y: 90 }, data: {}, dimensions: { width: 50, height: 50 } },
    { id: 'outside', position: { x: 200, y: 200 }, data: {}, dimensions: { width: 50, height: 30 } },
  ];

  const polygon = [
    { x: 0, y: 0 },
    { x: 120, y: 0 },
    { x: 120, y: 120 },
    { x: 0, y: 120 },
  ];

  it('returns only nodes fully enclosed by polygon', () => {
    const result = getNodesFullyInPolygon(nodes, polygon);
    const ids = result.map(n => n.id);
    expect(ids).toContain('inside');
    expect(ids).not.toContain('partial');
    expect(ids).not.toContain('outside');
  });
});
