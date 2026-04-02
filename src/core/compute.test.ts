import { describe, it, expect, vi } from 'vitest';
import { ComputeEngine } from './compute';
import type { FlowNode, FlowEdge } from './types';

function makeNode(id: string, type: string = 'default', data: Record<string, any> = {}): FlowNode {
  return { id, type, position: { x: 0, y: 0 }, data };
}

function makeEdge(id: string, source: string, target: string, sourceHandle?: string, targetHandle?: string): FlowEdge {
  return { id, source, target, sourceHandle, targetHandle };
}

describe('ComputeEngine', () => {
  describe('registerCompute / hasCompute', () => {
    it('registers a compute definition for a node type', () => {
      const engine = new ComputeEngine();
      engine.registerCompute('adder', { compute: (inputs) => ({ sum: (inputs.a ?? 0) + (inputs.b ?? 0) }) });
      expect(engine.hasCompute('adder')).toBe(true);
    });

    it('returns false for unregistered types', () => {
      const engine = new ComputeEngine();
      expect(engine.hasCompute('unknown')).toBe(false);
    });
  });

  describe('topologicalSort', () => {
    it('sorts a linear chain', () => {
      const engine = new ComputeEngine();
      const nodes = [makeNode('c'), makeNode('a'), makeNode('b')];
      const edges = [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'b', 'c')];
      const sorted = engine.topologicalSort(nodes, edges);
      const ids = sorted.map(n => n.id);
      expect(ids.indexOf('a')).toBeLessThan(ids.indexOf('b'));
      expect(ids.indexOf('b')).toBeLessThan(ids.indexOf('c'));
    });

    it('handles a diamond DAG', () => {
      const engine = new ComputeEngine();
      const nodes = [makeNode('d'), makeNode('a'), makeNode('b'), makeNode('c')];
      const edges = [
        makeEdge('e1', 'a', 'b'), makeEdge('e2', 'a', 'c'),
        makeEdge('e3', 'b', 'd'), makeEdge('e4', 'c', 'd'),
      ];
      const sorted = engine.topologicalSort(nodes, edges);
      const ids = sorted.map(n => n.id);
      expect(ids.indexOf('a')).toBeLessThan(ids.indexOf('b'));
      expect(ids.indexOf('a')).toBeLessThan(ids.indexOf('c'));
      expect(ids.indexOf('b')).toBeLessThan(ids.indexOf('d'));
      expect(ids.indexOf('c')).toBeLessThan(ids.indexOf('d'));
    });

    it('skips back-edges in cycles (does not hang)', () => {
      const engine = new ComputeEngine();
      const nodes = [makeNode('a'), makeNode('b')];
      const edges = [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'b', 'a')];
      const sorted = engine.topologicalSort(nodes, edges);
      expect(sorted).toHaveLength(2);
    });

    it('handles disconnected nodes', () => {
      const engine = new ComputeEngine();
      const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
      const edges = [makeEdge('e1', 'a', 'b')];
      const sorted = engine.topologicalSort(nodes, edges);
      expect(sorted).toHaveLength(3);
    });
  });

  describe('compute', () => {
    it('propagates data through a linear chain via handle ports', () => {
      const engine = new ComputeEngine();
      engine.registerCompute('source', { compute: () => ({ out: 10 }) });
      engine.registerCompute('double', { compute: (inputs) => ({ out: (inputs.val ?? 0) * 2 }) });

      const nodes = [
        makeNode('n1', 'source'),
        makeNode('n2', 'double'),
      ];
      const edges = [makeEdge('e1', 'n1', 'n2', 'out', 'val')];

      const results = engine.compute(nodes, edges);
      expect(results.get('n1')).toEqual({ out: 10 });
      expect(results.get('n2')).toEqual({ out: 20 });
    });

    it('gathers multiple inputs from different sources', () => {
      const engine = new ComputeEngine();
      engine.registerCompute('const', { compute: (inputs, nodeData) => ({ value: nodeData._init ?? 0 }) });
      engine.registerCompute('adder', { compute: (inputs) => ({ sum: (inputs.a ?? 0) + (inputs.b ?? 0) }) });

      const nodes = [
        makeNode('n1', 'const', { _init: 3 }),
        makeNode('n2', 'const', { _init: 7 }),
        makeNode('n3', 'adder'),
      ];
      const edges = [
        makeEdge('e1', 'n1', 'n3', 'value', 'a'),
        makeEdge('e2', 'n2', 'n3', 'value', 'b'),
      ];

      const results = engine.compute(nodes, edges);
      expect(results.get('n3')).toEqual({ sum: 10 });
    });

    it('skips nodes without registered compute', () => {
      const engine = new ComputeEngine();
      engine.registerCompute('source', { compute: () => ({ out: 5 }) });

      const nodes = [makeNode('n1', 'source'), makeNode('n2', 'unknown')];
      const edges = [makeEdge('e1', 'n1', 'n2', 'out', 'in')];

      const results = engine.compute(nodes, edges);
      expect(results.get('n1')).toEqual({ out: 5 });
      expect(results.has('n2')).toBe(false);
    });

    it('passes node data to compute function', () => {
      const engine = new ComputeEngine();
      engine.registerCompute('init', {
        compute: (_inputs, nodeData) => ({ value: nodeData.initial ?? 0 }),
      });

      const nodes = [makeNode('n1', 'init', { initial: 42 })];
      const results = engine.compute(nodes, []);
      expect(results.get('n1')).toEqual({ value: 42 });
    });

    it('uses default handle names when handles are unnamed', () => {
      const engine = new ComputeEngine();
      engine.registerCompute('source', { compute: () => ({ default: 99 }) });
      engine.registerCompute('sink', { compute: (inputs) => ({ got: inputs.default ?? 0 }) });

      const nodes = [makeNode('n1', 'source'), makeNode('n2', 'sink')];
      const edges = [makeEdge('e1', 'n1', 'n2')];

      const results = engine.compute(nodes, edges);
      expect(results.get('n2')).toEqual({ got: 99 });
    });

    it('computes only downstream from startNodeId', () => {
      const engine = new ComputeEngine();
      let callCount = 0;
      engine.registerCompute('counter', {
        compute: (inputs) => { callCount++; return { out: (inputs.in ?? 0) + 1 }; },
      });

      const nodes = [
        makeNode('n1', 'counter'),
        makeNode('n2', 'counter'),
        makeNode('n3', 'counter'),
      ];
      const edges = [
        makeEdge('e1', 'n1', 'n2', 'out', 'in'),
        makeEdge('e2', 'n2', 'n3', 'out', 'in'),
      ];

      callCount = 0;
      engine.compute(nodes, edges, 'n2');
      expect(callCount).toBe(2);
    });

    it('writes $inputs and $outputs to node data', () => {
      const engine = new ComputeEngine();
      engine.registerCompute('source', { compute: () => ({ out: 10 }) });
      engine.registerCompute('sink', { compute: (inputs) => ({ doubled: (inputs.val ?? 0) * 2 }) });

      const nodes = [makeNode('n1', 'source'), makeNode('n2', 'sink')];
      const edges = [makeEdge('e1', 'n1', 'n2', 'out', 'val')];

      engine.compute(nodes, edges);
      expect(nodes[0].data.$outputs).toEqual({ out: 10 });
      expect(nodes[0].data.$inputs).toEqual({});
      expect(nodes[1].data.$inputs).toEqual({ val: 10 });
      expect(nodes[1].data.$outputs).toEqual({ doubled: 20 });
    });
  });
});
