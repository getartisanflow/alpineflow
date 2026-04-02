import { describe, it, expect, vi, beforeAll } from 'vitest';
import { mockCtx } from './__test-utils';
import { createComputeMixin } from './canvas-compute';
import type { FlowNode, FlowEdge } from '../../core/types';

beforeAll(() => {
  if (typeof globalThis.requestAnimationFrame === 'undefined') {
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => { cb(0); return 0; };
  }
});

describe('createComputeMixin', () => {
  describe('registerCompute', () => {
    it('delegates to ctx._computeEngine.registerCompute', () => {
      const ctx = mockCtx();
      const mixin = createComputeMixin(ctx);

      const definition = { compute: (inputs: Record<string, any>, nodeData: Record<string, any>) => ({ out: 1 }) };
      mixin.registerCompute('adder', definition);

      expect(ctx._computeEngine.registerCompute).toHaveBeenCalledOnce();
      expect(ctx._computeEngine.registerCompute).toHaveBeenCalledWith('adder', definition);
    });
  });

  describe('compute', () => {
    it('calls engine.compute with ctx.nodes and ctx.edges', () => {
      const nodes: FlowNode[] = [
        { id: 'n1', type: 'input', position: { x: 0, y: 0 }, data: {} },
        { id: 'n2', type: 'output', position: { x: 100, y: 0 }, data: {} },
      ];
      const edges: FlowEdge[] = [
        { id: 'e1', source: 'n1', target: 'n2' },
      ];
      const ctx = mockCtx({ nodes, edges });
      const mixin = createComputeMixin(ctx);

      mixin.compute();

      expect(ctx._computeEngine.compute).toHaveBeenCalledOnce();
      expect(ctx._computeEngine.compute).toHaveBeenCalledWith(nodes, edges, undefined);
    });

    it('passes startNodeId to engine.compute when provided', () => {
      const ctx = mockCtx();
      const mixin = createComputeMixin(ctx);

      mixin.compute('n1');

      expect(ctx._computeEngine.compute).toHaveBeenCalledWith(ctx.nodes, ctx.edges, 'n1');
    });

    it('emits compute-complete event with results', () => {
      const fakeResults = new Map([['n1', { out: 42 }]]);
      const ctx = mockCtx();
      (ctx._computeEngine.compute as ReturnType<typeof vi.fn>).mockReturnValue(fakeResults);
      const mixin = createComputeMixin(ctx);

      mixin.compute();

      expect(ctx._emit).toHaveBeenCalledOnce();
      expect(ctx._emit).toHaveBeenCalledWith('compute-complete', { results: fakeResults });
    });

    it('returns the results from engine.compute', () => {
      const fakeResults = new Map([['n1', { value: 10 }], ['n2', { value: 20 }]]);
      const ctx = mockCtx();
      (ctx._computeEngine.compute as ReturnType<typeof vi.fn>).mockReturnValue(fakeResults);
      const mixin = createComputeMixin(ctx);

      const result = mixin.compute();

      expect(result).toBe(fakeResults);
    });
  });
});
