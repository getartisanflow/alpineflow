import { expectTypeOf, it } from 'vitest';
import type { FlowNode, Dimensions } from './types';

it('FlowNode accepts optional fixedDimensions', () => {
    const node: FlowNode = { id: 'a', position: { x: 0, y: 0 }, data: {}, fixedDimensions: true };
    expectTypeOf(node.fixedDimensions).toEqualTypeOf<boolean | undefined>();
});

it('FlowNode accepts optional resizeObserver', () => {
    const node: FlowNode = { id: 'a', position: { x: 0, y: 0 }, data: {}, resizeObserver: false };
    expectTypeOf(node.resizeObserver).toEqualTypeOf<boolean | undefined>();
});

it('FlowNode accepts optional min/maxDimensions (Partial<Dimensions>)', () => {
    // Pre-existing on FlowNode — both bounds are Partial, so consumers may
    // specify only width OR only height.
    const nodeBoth: FlowNode = {
        id: 'a', position: { x: 0, y: 0 }, data: {},
        minDimensions: { width: 100, height: 40 },
        maxDimensions: { width: 600, height: Infinity },
    };
    const nodeWidthOnly: FlowNode = {
        id: 'a', position: { x: 0, y: 0 }, data: {},
        minDimensions: { width: 100 },  // height optional by design
    };
    expectTypeOf(nodeBoth.minDimensions).toEqualTypeOf<Partial<Dimensions> | undefined>();
    expectTypeOf(nodeBoth.maxDimensions).toEqualTypeOf<Partial<Dimensions> | undefined>();
    expectTypeOf(nodeWidthOnly.minDimensions).toEqualTypeOf<Partial<Dimensions> | undefined>();
});

it('existing FlowNode literals still compile', () => {
    const node: FlowNode = { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } };
    expectTypeOf(node).toMatchTypeOf<FlowNode>();
});
