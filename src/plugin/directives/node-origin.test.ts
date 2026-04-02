import { describe, it, expect } from 'vitest';
import { getNodeVisualPosition, getNodesBounds } from '../../core/geometry';
import { getHandleCoords } from '../../core/edge-utils';
import { getNodeRect } from '../../core/intersection';
import { getAbsolutePosition } from '../../core/sub-flow';
import type { FlowNode } from '../../core/types';

function makeNode(overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id: 'n1',
    position: { x: 200, y: 200 },
    data: {},
    dimensions: { width: 100, height: 50 },
    ...overrides,
  };
}

describe('nodeOrigin integration', () => {
  it('getNodesBounds accounts for center origin', () => {
    const nodes = [
      makeNode({ id: 'a', position: { x: 100, y: 100 }, nodeOrigin: [0.5, 0.5] }),
    ];
    const bounds = getNodesBounds(nodes, [0, 0]);
    // Per-node origin [0.5, 0.5]: visual top-left = (100 - 50, 100 - 25) = (50, 75)
    expect(bounds).toEqual({ x: 50, y: 75, width: 100, height: 50 });
  });

  it('getNodesBounds uses global origin when node has none', () => {
    const nodes = [makeNode({ id: 'a', position: { x: 100, y: 100 } })];
    const bounds = getNodesBounds(nodes, [0.5, 0.5]);
    expect(bounds).toEqual({ x: 50, y: 75, width: 100, height: 50 });
  });

  it('getHandleCoords offsets by origin', () => {
    const node = makeNode({ nodeOrigin: [0.5, 0.5] });
    // Visual top-left = (200 - 50, 200 - 25) = (150, 175)
    // 'bottom' handle on 100x50 rect = local (50, 50)
    // Absolute = (150 + 50, 175 + 50) = (200, 225)
    const coords = getHandleCoords(node, 'bottom', undefined, [0, 0]);
    expect(coords).toEqual({ x: 200, y: 225 });
  });

  it('getNodeRect uses visual position', () => {
    const node = makeNode({ nodeOrigin: [0.5, 0.5] });
    const rect = getNodeRect(node, [0, 0]);
    expect(rect).toEqual({ x: 150, y: 175, width: 100, height: 50 });
  });

  it('sub-flow getAbsolutePosition accounts for parent origin', () => {
    const parent = makeNode({
      id: 'parent',
      position: { x: 100, y: 100 },
      dimensions: { width: 200, height: 100 },
      nodeOrigin: [0.5, 0.5],
    });
    const child = makeNode({
      id: 'child',
      position: { x: 10, y: 10 },
      parentId: 'parent',
    });
    const nodeMap = new Map<string, FlowNode>();
    nodeMap.set('parent', parent);
    nodeMap.set('child', child);

    // Parent visual top-left = (100 - 100, 100 - 50) = (0, 50)
    // Child absolute anchor = (0 + 10, 50 + 10) = (10, 60)
    const abs = getAbsolutePosition(child, nodeMap, [0, 0]);
    expect(abs).toEqual({ x: 10, y: 60 });
  });

  it('default origin [0, 0] preserves existing behavior', () => {
    const node = makeNode({ position: { x: 100, y: 100 } });
    const vp = getNodeVisualPosition(node);
    expect(vp).toEqual({ x: 100, y: 100 });

    const bounds = getNodesBounds([node]);
    expect(bounds).toEqual({ x: 100, y: 100, width: 100, height: 50 });

    const rect = getNodeRect(node);
    expect(rect).toEqual({ x: 100, y: 100, width: 100, height: 50 });
  });

  it('per-node origin overrides global in getNodesBounds', () => {
    const nodes = [
      makeNode({ id: 'a', position: { x: 100, y: 100 }, nodeOrigin: [0, 0] }),
    ];
    // Global is center but per-node is top-left — per-node wins
    const bounds = getNodesBounds(nodes, [0.5, 0.5]);
    expect(bounds).toEqual({ x: 100, y: 100, width: 100, height: 50 });
  });

  it('bottom-right origin [1, 1] shifts fully', () => {
    const node = makeNode({ position: { x: 200, y: 200 }, nodeOrigin: [1, 1] });
    const vp = getNodeVisualPosition(node);
    // visual top-left = (200 - 100, 200 - 50) = (100, 150)
    expect(vp).toEqual({ x: 100, y: 150 });
  });
});
