import { describe, it, expect } from 'vitest';
import { computeChildLayout } from './child-layout';
import type { FlowNode, ChildLayout, Dimensions } from './types';

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    position: { x: 0, y: 0 },
    data: {},
    dimensions: { width: 100, height: 40 },
    ...overrides,
  };
}

describe('computeChildLayout', () => {
  // ── Vertical ───────────────────────────────────────────────────

  it('vertical: stacks children top-to-bottom with gap and padding', () => {
    const config: ChildLayout = { direction: 'vertical', gap: 10, padding: 16 };
    const children = [makeNode('a'), makeNode('b'), makeNode('c')];
    const result = computeChildLayout(children, config);

    expect(result.positions.get('a')).toEqual({ x: 16, y: 16 });
    expect(result.positions.get('b')).toEqual({ x: 16, y: 66 }); // 16 + 40 + 10
    expect(result.positions.get('c')).toEqual({ x: 16, y: 116 }); // 66 + 40 + 10
  });

  it('vertical: stretches children to fill width', () => {
    const config: ChildLayout = { direction: 'vertical', stretch: 'width', gap: 8, padding: 12 };
    const children = [
      makeNode('a', { dimensions: { width: 80, height: 40 } }),
      makeNode('b', { dimensions: { width: 120, height: 40 } }),
    ];
    const result = computeChildLayout(children, config);

    expect(result.dimensions.get('a')!.width).toBe(120);
    expect(result.dimensions.get('b')!.width).toBe(120);
    expect(result.dimensions.get('a')!.height).toBe(40);
  });

  it('vertical: computes parent dimensions', () => {
    const config: ChildLayout = { direction: 'vertical', gap: 10, padding: 16 };
    const children = [
      makeNode('a', { dimensions: { width: 100, height: 40 } }),
      makeNode('b', { dimensions: { width: 120, height: 30 } }),
    ];
    const result = computeChildLayout(children, config);

    // width = max(100, 120) + 2*16 = 152
    // height = 40 + 10 + 30 + 2*16 = 112
    expect(result.parentDimensions).toEqual({ width: 152, height: 112 });
  });

  it('vertical: uses defaults (gap=8, padding=12, stretch=width)', () => {
    const config: ChildLayout = { direction: 'vertical' };
    const children = [makeNode('a'), makeNode('b')];
    const result = computeChildLayout(children, config);

    expect(result.positions.get('a')).toEqual({ x: 12, y: 12 });
    expect(result.positions.get('b')).toEqual({ x: 12, y: 60 }); // 12 + 40 + 8
    expect(result.dimensions.get('a')!.width).toBe(100);
    expect(result.dimensions.get('b')!.width).toBe(100);
  });

  it('vertical: no stretch when stretch=none', () => {
    const config: ChildLayout = { direction: 'vertical', stretch: 'none' };
    const children = [
      makeNode('a', { dimensions: { width: 80, height: 40 } }),
      makeNode('b', { dimensions: { width: 120, height: 40 } }),
    ];
    const result = computeChildLayout(children, config);

    expect(result.dimensions.size).toBe(0);
  });

  it('vertical: handles empty children', () => {
    const config: ChildLayout = { direction: 'vertical', padding: 12 };
    const result = computeChildLayout([], config);

    expect(result.positions.size).toBe(0);
    expect(result.parentDimensions).toEqual({ width: 24, height: 24 });
  });

  it('vertical: single child', () => {
    const config: ChildLayout = { direction: 'vertical', gap: 10, padding: 16 };
    const children = [makeNode('a')];
    const result = computeChildLayout(children, config);

    expect(result.positions.get('a')).toEqual({ x: 16, y: 16 });
    expect(result.parentDimensions).toEqual({ width: 132, height: 72 });
  });

  // ── Horizontal ─────────────────────────────────────────────────

  it('horizontal: stacks children left-to-right', () => {
    const config: ChildLayout = { direction: 'horizontal', gap: 10, padding: 16 };
    const children = [makeNode('a'), makeNode('b'), makeNode('c')];
    const result = computeChildLayout(children, config);

    expect(result.positions.get('a')).toEqual({ x: 16, y: 16 });
    expect(result.positions.get('b')).toEqual({ x: 126, y: 16 }); // 16 + 100 + 10
    expect(result.positions.get('c')).toEqual({ x: 236, y: 16 }); // 126 + 100 + 10
  });

  it('horizontal: stretches children to fill height', () => {
    const config: ChildLayout = { direction: 'horizontal', stretch: 'height', gap: 8, padding: 12 };
    const children = [
      makeNode('a', { dimensions: { width: 100, height: 30 } }),
      makeNode('b', { dimensions: { width: 100, height: 60 } }),
    ];
    const result = computeChildLayout(children, config);

    expect(result.dimensions.get('a')!.height).toBe(60);
    expect(result.dimensions.get('b')!.height).toBe(60);
  });

  it('horizontal: computes parent dimensions', () => {
    const config: ChildLayout = { direction: 'horizontal', gap: 10, padding: 16 };
    const children = [
      makeNode('a', { dimensions: { width: 80, height: 40 } }),
      makeNode('b', { dimensions: { width: 120, height: 50 } }),
    ];
    const result = computeChildLayout(children, config);

    // width = 80 + 10 + 120 + 2*16 = 242
    // height = max(40, 50) + 2*16 = 82
    expect(result.parentDimensions).toEqual({ width: 242, height: 82 });
  });

  // ── Grid ───────────────────────────────────────────────────────

  it('grid: arranges in columns (default 2)', () => {
    const config: ChildLayout = { direction: 'grid', gap: 10, padding: 16 };
    const children = [makeNode('a'), makeNode('b'), makeNode('c'), makeNode('d')];
    const result = computeChildLayout(children, config);

    expect(result.positions.get('a')).toEqual({ x: 16, y: 16 });
    expect(result.positions.get('b')).toEqual({ x: 126, y: 16 });
    expect(result.positions.get('c')).toEqual({ x: 16, y: 66 });
    expect(result.positions.get('d')).toEqual({ x: 126, y: 66 });
  });

  it('grid: custom column count', () => {
    const config: ChildLayout = { direction: 'grid', columns: 3, gap: 10, padding: 16 };
    const children = [makeNode('a'), makeNode('b'), makeNode('c'), makeNode('d')];
    const result = computeChildLayout(children, config);

    expect(result.positions.get('d')).toEqual({ x: 16, y: 66 });
  });

  it('grid: stretches children to fill cells when stretch=both', () => {
    const config: ChildLayout = { direction: 'grid', stretch: 'both', gap: 10, padding: 16 };
    const children = [
      makeNode('a', { dimensions: { width: 80, height: 30 } }),
      makeNode('b', { dimensions: { width: 120, height: 50 } }),
    ];
    const result = computeChildLayout(children, config);

    expect(result.dimensions.get('a')!.width).toBe(120);
    expect(result.dimensions.get('a')!.height).toBe(50);
  });

  // ── Sort order ─────────────────────────────────────────────────

  it('respects order property for arrangement', () => {
    const config: ChildLayout = { direction: 'vertical', gap: 10, padding: 16 };
    const children = [
      makeNode('a', { order: 2 }),
      makeNode('b', { order: 0 }),
      makeNode('c', { order: 1 }),
    ];
    const result = computeChildLayout(children, config);

    expect(result.positions.get('b')).toEqual({ x: 16, y: 16 });
    expect(result.positions.get('c')).toEqual({ x: 16, y: 66 });
    expect(result.positions.get('a')).toEqual({ x: 16, y: 116 });
  });

  it('uses insertion order as tiebreaker when order is equal', () => {
    const config: ChildLayout = { direction: 'vertical', gap: 10, padding: 16 };
    const children = [makeNode('a'), makeNode('b'), makeNode('c')];
    const result = computeChildLayout(children, config);

    expect(result.positions.get('a')).toEqual({ x: 16, y: 16 });
    expect(result.positions.get('b')).toEqual({ x: 16, y: 66 });
    expect(result.positions.get('c')).toEqual({ x: 16, y: 116 });
  });

  // ── Stretch modes ──────────────────────────────────────────────

  it('vertical with stretch=both stretches width and height', () => {
    const config: ChildLayout = { direction: 'vertical', stretch: 'both', gap: 0, padding: 0 };
    const children = [
      makeNode('a', { dimensions: { width: 80, height: 30 } }),
      makeNode('b', { dimensions: { width: 120, height: 50 } }),
    ];
    const result = computeChildLayout(children, config);

    expect(result.dimensions.get('a')!.width).toBe(120);
    expect(result.dimensions.get('a')!.height).toBe(30);
  });

  it('horizontal with stretch=both stretches width and height', () => {
    const config: ChildLayout = { direction: 'horizontal', stretch: 'both', gap: 0, padding: 0 };
    const children = [
      makeNode('a', { dimensions: { width: 80, height: 30 } }),
      makeNode('b', { dimensions: { width: 120, height: 50 } }),
    ];
    const result = computeChildLayout(children, config);

    expect(result.dimensions.get('b')!.height).toBe(50);
    expect(result.dimensions.get('a')!.width).toBe(80);
  });
});
