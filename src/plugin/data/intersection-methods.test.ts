import { describe, it, expect } from 'vitest';
import {
  getIntersectingNodes,
  isNodeIntersecting,
  clampToAvoidOverlap,
  getNodeRect,
} from '../../core/intersection';
import type { FlowNode } from '../../core/types';

/**
 * Tests for intersection detection functions as exposed on FlowInstance.
 * The FlowInstance methods delegate to these core functions — we test them directly.
 */

function makeNode(id: string, x: number, y: number, w?: number, h?: number): FlowNode {
  return {
    id,
    position: { x, y },
    data: {},
    dimensions: w != null && h != null ? { width: w, height: h } : undefined,
  };
}

describe('FlowInstance intersection methods', () => {
  const nodeA = makeNode('a', 0, 0, 100, 100);
  const nodeB = makeNode('b', 80, 80, 100, 100);
  const nodeC = makeNode('c', 500, 500, 50, 50);
  const all = [nodeA, nodeB, nodeC];

  it('getIntersectingNodes finds overlapping nodes', () => {
    const result = getIntersectingNodes(nodeA, all);
    expect(result.map((n) => n.id)).toEqual(['b']);
  });

  it('getIntersectingNodes returns empty for isolated node', () => {
    const result = getIntersectingNodes(nodeC, all);
    expect(result).toEqual([]);
  });

  it('isNodeIntersecting returns true for overlapping pair', () => {
    expect(isNodeIntersecting(nodeA, nodeB)).toBe(true);
  });

  it('isNodeIntersecting returns false for distant pair', () => {
    expect(isNodeIntersecting(nodeA, nodeC)).toBe(false);
  });

  it('clampToAvoidOverlap pushes out of overlap', () => {
    const rects = [getNodeRect(nodeA)];
    // Place a node directly on top of nodeA
    const result = clampToAvoidOverlap({ x: 10, y: 10 }, 50, 50, rects, 5);
    // Should be pushed out so it no longer overlaps
    const nodeRight = result.x + 50;
    const nodeBottom = result.y + 50;
    const aRight = 0 + 100;
    const aBottom = 0 + 100;
    const stillOverlaps =
      result.x < aRight + 5 && nodeRight > 0 - 5 && result.y < aBottom + 5 && nodeBottom > 0 - 5;
    expect(stillOverlaps).toBe(false);
  });

  it('getNodeRect uses default dimensions for unmeasured nodes', () => {
    const node = makeNode('x', 0, 0);
    const rect = getNodeRect(node);
    expect(rect.width).toBe(150);
    expect(rect.height).toBe(50);
  });
});
