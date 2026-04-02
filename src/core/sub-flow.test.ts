import { describe, it, expect } from 'vitest';
import {
  buildNodeMap,
  getAbsolutePosition,
  toAbsoluteNode,
  toAbsoluteNodes,
  getDescendantIds,
  sortNodesTopological,
  computeZIndex,
  clampToExtent,
  clampToParent,
  expandParentToFitChild,
} from './sub-flow';
import type { FlowNode } from './types';
import {
  nodeA,
  nodeB,
  groupNode,
  childNode1,
  childNode2,
  grandchildNode,
  subFlowNodes,
  nodes,
} from './__fixtures__/nodes';

// ── buildNodeMap ────────────────────────────────────────────────────────────

describe('buildNodeMap', () => {
  it('creates a map keyed by node id', () => {
    const map = buildNodeMap(nodes);
    expect(map.size).toBe(4);
    expect(map.get('a')).toBe(nodeA);
    expect(map.get('b')).toBe(nodeB);
  });

  it('returns empty map for empty array', () => {
    expect(buildNodeMap([]).size).toBe(0);
  });

  it('overwrites duplicates with last occurrence', () => {
    const dup: FlowNode = { id: 'a', position: { x: 999, y: 999 }, data: {} };
    const map = buildNodeMap([nodeA, dup]);
    expect(map.get('a')).toBe(dup);
  });
});

// ── getAbsolutePosition ─────────────────────────────────────────────────────

describe('getAbsolutePosition', () => {
  const nodeMap = buildNodeMap(subFlowNodes);

  it('returns own position for root node', () => {
    const pos = getAbsolutePosition(groupNode, nodeMap);
    expect(pos).toEqual({ x: 50, y: 50 });
  });

  it('sums parent + child position', () => {
    const pos = getAbsolutePosition(childNode1, nodeMap);
    expect(pos).toEqual({ x: 70, y: 80 }); // 50+20, 50+30
  });

  it('sums grandparent + parent + child position', () => {
    const pos = getAbsolutePosition(grandchildNode, nodeMap);
    expect(pos).toEqual({ x: 80, y: 90 }); // 50+20+10, 50+30+10
  });

  it('handles missing parent gracefully', () => {
    const orphan: FlowNode = {
      id: 'orphan',
      parentId: 'nonexistent',
      position: { x: 10, y: 20 },
      data: {},
    };
    const map = buildNodeMap([orphan]);
    const pos = getAbsolutePosition(orphan, map);
    expect(pos).toEqual({ x: 10, y: 20 });
  });

  it('breaks on circular parentId references', () => {
    const cycleA: FlowNode = { id: 'ca', parentId: 'cb', position: { x: 1, y: 2 }, data: {} };
    const cycleB: FlowNode = { id: 'cb', parentId: 'ca', position: { x: 3, y: 4 }, data: {} };
    const map = buildNodeMap([cycleA, cycleB]);
    // Should not infinite loop
    const pos = getAbsolutePosition(cycleA, map);
    expect(pos).toEqual({ x: 4, y: 6 }); // 1+3, 2+4 (stops after visiting cb)
  });
});

// ── toAbsoluteNode ──────────────────────────────────────────────────────────

describe('toAbsoluteNode', () => {
  const nodeMap = buildNodeMap(subFlowNodes);

  it('returns same reference for root node (no parentId)', () => {
    const result = toAbsoluteNode(groupNode, nodeMap);
    expect(result).toBe(groupNode);
  });

  it('returns new object with absolute position for child', () => {
    const result = toAbsoluteNode(childNode1, nodeMap);
    expect(result).not.toBe(childNode1);
    expect(result.position).toEqual({ x: 70, y: 80 });
    expect(result.id).toBe('child-1');
  });
});

// ── toAbsoluteNodes ─────────────────────────────────────────────────────────

describe('toAbsoluteNodes', () => {
  it('converts all nodes to absolute positions', () => {
    const nodeMap = buildNodeMap(subFlowNodes);
    const absolute = toAbsoluteNodes(subFlowNodes, nodeMap);
    expect(absolute).toHaveLength(4);
    expect(absolute[0].position).toEqual({ x: 50, y: 50 }); // group (root)
    expect(absolute[1].position).toEqual({ x: 70, y: 80 }); // child1
    expect(absolute[3].position).toEqual({ x: 80, y: 90 }); // grandchild
  });
});

// ── getDescendantIds ────────────────────────────────────────────────────────

describe('getDescendantIds', () => {
  it('returns all descendants of a group node', () => {
    const ids = getDescendantIds('group-1', subFlowNodes);
    expect(ids).toEqual(new Set(['child-1', 'child-2', 'grandchild-1']));
  });

  it('returns only direct children + their children', () => {
    const ids = getDescendantIds('child-1', subFlowNodes);
    expect(ids).toEqual(new Set(['grandchild-1']));
  });

  it('returns empty set for leaf node', () => {
    const ids = getDescendantIds('grandchild-1', subFlowNodes);
    expect(ids.size).toBe(0);
  });

  it('returns empty set for nonexistent node', () => {
    const ids = getDescendantIds('nonexistent', subFlowNodes);
    expect(ids.size).toBe(0);
  });
});

// ── sortNodesTopological ────────────────────────────────────────────────────

describe('sortNodesTopological', () => {
  it('parents appear before children', () => {
    const reversed = [...subFlowNodes].reverse();
    const sorted = sortNodesTopological(reversed);
    const ids = sorted.map((n) => n.id);
    expect(ids.indexOf('group-1')).toBeLessThan(ids.indexOf('child-1'));
    expect(ids.indexOf('group-1')).toBeLessThan(ids.indexOf('child-2'));
    expect(ids.indexOf('child-1')).toBeLessThan(ids.indexOf('grandchild-1'));
  });

  it('preserves order for flat nodes', () => {
    const sorted = sortNodesTopological(nodes);
    expect(sorted.map((n) => n.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});

// ── computeZIndex ───────────────────────────────────────────────────────────

describe('computeZIndex', () => {
  const nodeMap = buildNodeMap(subFlowNodes);

  it('returns 0 for group nodes', () => {
    expect(computeZIndex(groupNode, nodeMap)).toBe(0);
  });

  it('returns 2 for regular root nodes', () => {
    const regularMap = buildNodeMap(nodes);
    expect(computeZIndex(nodeA, regularMap)).toBe(2);
  });

  it('returns parentZ + 2 for child nodes', () => {
    // group = 0 (group type), child = 0 + 2 = 2
    expect(computeZIndex(childNode1, nodeMap)).toBe(2);
  });

  it('stacks grandchild above child', () => {
    // group = 0, child = 2, grandchild = 2 + 2 = 4
    expect(computeZIndex(grandchildNode, nodeMap)).toBe(4);
  });

  it('respects explicit zIndex on root', () => {
    const custom: FlowNode = { id: 'z', position: { x: 0, y: 0 }, data: {}, zIndex: 10 };
    const map = buildNodeMap([custom]);
    expect(computeZIndex(custom, map)).toBe(10);
  });

  it('adds explicit zIndex for child', () => {
    const child: FlowNode = {
      id: 'zchild',
      parentId: 'group-1',
      position: { x: 0, y: 0 },
      data: {},
      zIndex: 5,
    };
    const map = buildNodeMap([...subFlowNodes, child]);
    // group(0) + 2 + 5 = 7
    expect(computeZIndex(child, map)).toBe(7);
  });

  it('does not stack-overflow on circular parentId references', () => {
    const cycleA: FlowNode = { id: 'ca', parentId: 'cb', position: { x: 0, y: 0 }, data: {} };
    const cycleB: FlowNode = { id: 'cb', parentId: 'ca', position: { x: 0, y: 0 }, data: {} };
    const map = buildNodeMap([cycleA, cycleB]);
    // Should return a finite number, not throw RangeError
    const z = computeZIndex(cycleA, map);
    expect(Number.isFinite(z)).toBe(true);
  });
});

// ── clampToExtent ───────────────────────────────────────────────────────────

describe('clampToExtent', () => {
  const extent: [[number, number], [number, number]] = [[0, 0], [500, 400]];

  it('returns position unchanged when inside extent', () => {
    expect(clampToExtent({ x: 100, y: 100 }, extent)).toEqual({ x: 100, y: 100 });
  });

  it('clamps to minimum', () => {
    expect(clampToExtent({ x: -50, y: -30 }, extent)).toEqual({ x: 0, y: 0 });
  });

  it('clamps to maximum', () => {
    expect(clampToExtent({ x: 600, y: 500 }, extent)).toEqual({ x: 500, y: 400 });
  });

  it('accounts for node dimensions in max bound', () => {
    const dims = { width: 150, height: 50 };
    expect(clampToExtent({ x: 400, y: 380 }, extent, dims)).toEqual({ x: 350, y: 350 });
  });

  it('works without dimensions', () => {
    expect(clampToExtent({ x: 600, y: 500 }, extent)).toEqual({ x: 500, y: 400 });
  });
});

// ── clampToParent ───────────────────────────────────────────────────────────

describe('clampToParent', () => {
  const parentDims = { width: 400, height: 300 };
  const childDims = { width: 100, height: 40 };

  it('returns position unchanged when inside parent', () => {
    expect(clampToParent({ x: 50, y: 50 }, childDims, parentDims)).toEqual({ x: 50, y: 50 });
  });

  it('clamps negative position to 0', () => {
    expect(clampToParent({ x: -10, y: -5 }, childDims, parentDims)).toEqual({ x: 0, y: 0 });
  });

  it('clamps to max position so child fits', () => {
    expect(clampToParent({ x: 350, y: 280 }, childDims, parentDims)).toEqual({ x: 300, y: 260 });
  });
});

// ── expandParentToFitChild ──────────────────────────────────────────────────

describe('expandParentToFitChild', () => {
  const parentDims = { width: 400, height: 300 };
  const childDims = { width: 100, height: 40 };

  it('returns null when child fits within parent', () => {
    expect(expandParentToFitChild({ x: 50, y: 50 }, childDims, parentDims)).toBeNull();
  });

  it('expands width when child exceeds right edge', () => {
    const result = expandParentToFitChild({ x: 350, y: 50 }, childDims, parentDims);
    // needed = 350 + 100 + 20 = 470 > 400
    expect(result).toEqual({ width: 470, height: 300 });
  });

  it('expands height when child exceeds bottom edge', () => {
    const result = expandParentToFitChild({ x: 50, y: 270 }, childDims, parentDims);
    // needed = 270 + 40 + 20 = 330 > 300
    expect(result).toEqual({ width: 400, height: 330 });
  });

  it('expands both dimensions', () => {
    const result = expandParentToFitChild({ x: 350, y: 270 }, childDims, parentDims);
    expect(result).toEqual({ width: 470, height: 330 });
  });
});
