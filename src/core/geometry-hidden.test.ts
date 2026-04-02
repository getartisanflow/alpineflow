import { describe, it, expect } from 'vitest';
import { getNodesBounds, getNodesInRect } from './geometry';
import type { FlowNode, Rect } from './types';
import { nodeA, nodeB, nodeC, hiddenNode } from './__fixtures__/nodes';

describe('hidden node filtering', () => {
  const allNodes = [nodeA, nodeB, nodeC, hiddenNode];
  const visibleNodes = allNodes.filter((n) => !n.hidden);

  it('getNodesBounds excludes hidden nodes when pre-filtered', () => {
    const withHidden = getNodesBounds(allNodes);
    const withoutHidden = getNodesBounds(visibleNodes);
    // hiddenNode is at x:600, so including it makes bounds wider
    expect(withHidden.width).toBeGreaterThan(withoutHidden.width);
    // Verify the filtered result matches the 3 visible nodes
    expect(withoutHidden).toEqual(getNodesBounds([nodeA, nodeB, nodeC]));
  });

  it('getNodesInRect excludes hidden nodes when pre-filtered', () => {
    const bigRect: Rect = { x: -1000, y: -1000, width: 5000, height: 5000 };
    const all = getNodesInRect(allNodes, bigRect);
    const visible = getNodesInRect(visibleNodes, bigRect);
    expect(all).toHaveLength(4);
    expect(visible).toHaveLength(3);
    expect(visible.find((n) => n.id === 'hidden')).toBeUndefined();
  });
});
