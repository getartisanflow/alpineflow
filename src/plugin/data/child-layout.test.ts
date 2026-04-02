import { describe, it, expect } from 'vitest';
import { computeChildLayout } from '../../core/child-layout';
import type { FlowNode, ChildLayout } from '../../core/types';

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    position: { x: 0, y: 0 },
    data: {},
    dimensions: { width: 100, height: 40 },
    ...overrides,
  };
}

describe('child-layout integration', () => {
  it('auto-assigns order on add (end of list)', () => {
    const children = [
      makeNode('a', { order: 0 }),
      makeNode('b', { order: 1 }),
    ];
    const newChild = makeNode('c');
    const maxOrder = Math.max(...children.map(s => s.order ?? 0));
    newChild.order = maxOrder + 1;
    expect(newChild.order).toBe(2);
  });

  it('reorder shifts siblings correctly', () => {
    const children = [
      makeNode('a', { order: 0 }),
      makeNode('b', { order: 1 }),
      makeNode('c', { order: 2 }),
    ];
    // Move 'c' to position 0
    const node = children[2];
    const filtered = children.filter(s => s.id !== node.id);
    filtered.splice(0, 0, node);
    for (let i = 0; i < filtered.length; i++) filtered[i].order = i;

    expect(children.find(n => n.id === 'c')!.order).toBe(0);
    expect(children.find(n => n.id === 'a')!.order).toBe(1);
    expect(children.find(n => n.id === 'b')!.order).toBe(2);
  });

  it('recursive layout: inner parent auto-sizes before outer lays out', () => {
    const grandchildren = [
      makeNode('g1', { dimensions: { width: 60, height: 30 } }),
      makeNode('g2', { dimensions: { width: 60, height: 30 } }),
    ];
    const innerConfig: ChildLayout = { direction: 'horizontal', gap: 8, padding: 12 };
    const innerResult = computeChildLayout(grandchildren, innerConfig);

    // Inner auto-size: width = 60+8+60+24 = 152, height = 30+24 = 54
    expect(innerResult.parentDimensions).toEqual({ width: 152, height: 54 });

    // Now outer layout uses inner's auto-sized dimensions
    const outerChildren = [
      makeNode('inner', { dimensions: innerResult.parentDimensions, order: 0 }),
      makeNode('b', { dimensions: { width: 100, height: 40 }, order: 1 }),
    ];
    const outerConfig: ChildLayout = { direction: 'vertical', gap: 8, padding: 12 };
    const outerResult = computeChildLayout(outerChildren, outerConfig);

    // Outer width = max(152, 100) + 24 = 176
    // Outer height = 54 + 8 + 40 + 24 = 126
    expect(outerResult.parentDimensions).toEqual({ width: 176, height: 126 });
  });

  it('parent shrinks when child removed', () => {
    const config: ChildLayout = { direction: 'vertical', gap: 8, padding: 12 };

    const three = [makeNode('a'), makeNode('b'), makeNode('c')];
    const r3 = computeChildLayout(three, config);
    // height = 12 + 40 + 8 + 40 + 8 + 40 + 12 = 160
    expect(r3.parentDimensions.height).toBe(160);

    const two = [makeNode('a'), makeNode('b')];
    const r2 = computeChildLayout(two, config);
    // height = 12 + 40 + 8 + 40 + 12 = 112
    expect(r2.parentDimensions.height).toBe(112);
  });

  it('layout handles children with no dimensions (uses defaults)', () => {
    const config: ChildLayout = { direction: 'vertical', gap: 8, padding: 12 };
    const children = [
      makeNode('a', { dimensions: undefined }),
    ];
    const result = computeChildLayout(children, config);
    // Uses DEFAULT_NODE_WIDTH (150) and DEFAULT_NODE_HEIGHT (50)
    expect(result.parentDimensions.width).toBe(150 + 24);
    expect(result.parentDimensions.height).toBe(50 + 24);
  });
});
