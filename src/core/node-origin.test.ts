import { describe, it, expect } from 'vitest';
import { getNodeVisualPosition, getOriginOffset } from './geometry';
import type { FlowNode } from './types';

function makeNode(overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id: 'n1',
    position: { x: 100, y: 100 },
    data: {},
    dimensions: { width: 200, height: 100 },
    ...overrides,
  };
}

describe('getOriginOffset', () => {
  it('returns zero for [0, 0] (top-left)', () => {
    expect(getOriginOffset([0, 0], 200, 100)).toEqual({ x: 0, y: 0 });
  });

  it('returns half-dimensions for [0.5, 0.5] (center)', () => {
    expect(getOriginOffset([0.5, 0.5], 200, 100)).toEqual({ x: -100, y: -50 });
  });

  it('returns full dimensions for [1, 1] (bottom-right)', () => {
    expect(getOriginOffset([1, 1], 200, 100)).toEqual({ x: -200, y: -100 });
  });

  it('returns zero for undefined origin', () => {
    expect(getOriginOffset(undefined, 200, 100)).toEqual({ x: 0, y: 0 });
  });
});

describe('getNodeVisualPosition', () => {
  it('returns position unchanged for default origin [0, 0]', () => {
    const node = makeNode();
    expect(getNodeVisualPosition(node)).toEqual({ x: 100, y: 100 });
  });

  it('offsets position for center origin [0.5, 0.5]', () => {
    const node = makeNode({ nodeOrigin: [0.5, 0.5] });
    expect(getNodeVisualPosition(node)).toEqual({ x: 0, y: 50 });
  });

  it('uses global origin when node has none', () => {
    const node = makeNode();
    expect(getNodeVisualPosition(node, [0.5, 0.5])).toEqual({ x: 0, y: 50 });
  });

  it('per-node origin overrides global', () => {
    const node = makeNode({ nodeOrigin: [0, 0] });
    expect(getNodeVisualPosition(node, [0.5, 0.5])).toEqual({ x: 100, y: 100 });
  });

  it('falls back to DEFAULT_NODE_WIDTH/HEIGHT when no dimensions', () => {
    const node = makeNode({ dimensions: undefined });
    // DEFAULT_NODE_WIDTH = 150, DEFAULT_NODE_HEIGHT = 50
    expect(getNodeVisualPosition(node, [0.5, 0.5])).toEqual({ x: 25, y: 75 });
  });
});
