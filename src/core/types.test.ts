import { expectTypeOf, it } from 'vitest';
import type { FlowNode } from './types';

it('FlowNode accepts optional fixedDimensions', () => {
    const node: FlowNode = { id: 'a', position: { x: 0, y: 0 }, data: {}, fixedDimensions: true };
    expectTypeOf(node.fixedDimensions).toEqualTypeOf<boolean | undefined>();
});

it('FlowNode accepts optional resizeObserver', () => {
    const node: FlowNode = { id: 'a', position: { x: 0, y: 0 }, data: {}, resizeObserver: false };
    expectTypeOf(node.resizeObserver).toEqualTypeOf<boolean | undefined>();
});

it('FlowNode accepts optional min/maxDimensions', () => {
    const node: FlowNode = {
        id: 'a', position: { x: 0, y: 0 }, data: {},
        minDimensions: { width: 100, height: 40 },
        maxDimensions: { width: 600, height: Infinity },
    };
    expectTypeOf(node.minDimensions).toMatchTypeOf<{ width: number; height: number } | undefined>();
    expectTypeOf(node.maxDimensions).toMatchTypeOf<{ width: number; height: number } | undefined>();
});

it('existing FlowNode literals still compile', () => {
    const node: FlowNode = { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } };
    expectTypeOf(node).toMatchTypeOf<FlowNode>();
});
