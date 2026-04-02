import { describe, it, expect, vi } from 'vitest';
import { computeHierarchyLayout } from './hierarchy';
import type { FlowNode, FlowEdge } from '../types';

/** Helper to create a minimal FlowNode. */
function node(id: string, x = 0, y = 0): FlowNode {
  return { id, position: { x, y }, data: {} };
}

/** Helper to create a minimal FlowEdge. */
function edge(source: string, target: string): FlowEdge {
  return { id: `${source}-${target}`, source, target };
}

describe('computeHierarchyLayout', () => {
  // ------------------------------------------------------------------
  // Single root (existing behaviour)
  // ------------------------------------------------------------------
  it('returns positions for a single-root tree', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('a', 'b'), edge('a', 'c')];

    const positions = computeHierarchyLayout(nodes, edges);

    expect(positions.size).toBe(3);
    expect(positions.has('a')).toBe(true);
    expect(positions.has('b')).toBe(true);
    expect(positions.has('c')).toBe(true);
  });

  it('root is positioned above its children in TB direction', () => {
    const nodes = [node('root'), node('child')];
    const edges = [edge('root', 'child')];

    const positions = computeHierarchyLayout(nodes, edges, { direction: 'TB' });

    expect(positions.get('root')!.y).toBeLessThan(positions.get('child')!.y);
  });

  it('root is positioned left of its children in LR direction', () => {
    const nodes = [node('root'), node('child')];
    const edges = [edge('root', 'child')];

    const positions = computeHierarchyLayout(nodes, edges, { direction: 'LR' });

    expect(positions.get('root')!.x).toBeLessThan(positions.get('child')!.x);
  });

  // ------------------------------------------------------------------
  // Multiple roots — the bug fix
  // ------------------------------------------------------------------
  it('handles multiple roots without throwing', () => {
    const nodes = [node('r1'), node('r2'), node('c1'), node('c2')];
    const edges = [edge('r1', 'c1'), edge('r2', 'c2')];

    expect(() => computeHierarchyLayout(nodes, edges)).not.toThrow();
  });

  it('returns positions for every real node when there are multiple roots', () => {
    const nodes = [node('r1'), node('r2'), node('c1'), node('c2')];
    const edges = [edge('r1', 'c1'), edge('r2', 'c2')];

    const positions = computeHierarchyLayout(nodes, edges);

    expect(positions.size).toBe(4);
    expect(positions.has('r1')).toBe(true);
    expect(positions.has('r2')).toBe(true);
    expect(positions.has('c1')).toBe(true);
    expect(positions.has('c2')).toBe(true);
  });

  it('does not include __virtual_root in output positions', () => {
    const nodes = [node('r1'), node('r2')];
    const edges: FlowEdge[] = [];

    const positions = computeHierarchyLayout(nodes, edges);

    expect(positions.has('__virtual_root')).toBe(false);
    expect(positions.size).toBe(2);
  });

  it('multiple roots are at the same depth level (TB)', () => {
    const nodes = [node('r1'), node('r2'), node('r3')];
    const edges: FlowEdge[] = [];

    const positions = computeHierarchyLayout(nodes, edges, { direction: 'TB' });

    // All roots should share the same y coordinate (same depth)
    const yValues = [
      positions.get('r1')!.y,
      positions.get('r2')!.y,
      positions.get('r3')!.y,
    ];
    expect(yValues[0]).toBe(yValues[1]);
    expect(yValues[1]).toBe(yValues[2]);
  });

  it('multiple roots children are below their parents (TB)', () => {
    const nodes = [node('r1'), node('r2'), node('c1'), node('c2')];
    const edges = [edge('r1', 'c1'), edge('r2', 'c2')];

    const positions = computeHierarchyLayout(nodes, edges, { direction: 'TB' });

    expect(positions.get('r1')!.y).toBeLessThan(positions.get('c1')!.y);
    expect(positions.get('r2')!.y).toBeLessThan(positions.get('c2')!.y);
  });

  it('multiple roots children are to the right of their parents (LR)', () => {
    const nodes = [node('r1'), node('r2'), node('c1'), node('c2')];
    const edges = [edge('r1', 'c1'), edge('r2', 'c2')];

    const positions = computeHierarchyLayout(nodes, edges, { direction: 'LR' });

    expect(positions.get('r1')!.x).toBeLessThan(positions.get('c1')!.x);
    expect(positions.get('r2')!.x).toBeLessThan(positions.get('c2')!.x);
  });

  it('works with cluster layout type and multiple roots', () => {
    const nodes = [node('r1'), node('r2'), node('c1')];
    const edges = [edge('r1', 'c1')];

    const positions = computeHierarchyLayout(nodes, edges, {
      layoutType: 'cluster',
    });

    expect(positions.size).toBe(3);
    expect(positions.has('__virtual_root')).toBe(false);
  });

  // ------------------------------------------------------------------
  // Edge cases
  // ------------------------------------------------------------------
  it('returns empty map for empty nodes array', () => {
    const positions = computeHierarchyLayout([], []);
    expect(positions.size).toBe(0);
  });

  it('returns empty map and warns when there are no roots (cycle)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Every node has an incoming edge — forms a cycle, no roots
    const nodes = [node('a'), node('b')];
    const edges = [edge('a', 'b'), edge('b', 'a')];

    const positions = computeHierarchyLayout(nodes, edges);

    expect(positions.size).toBe(0);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('no root nodes found'),
    );

    warnSpy.mockRestore();
  });

  it('single node with no edges returns a position', () => {
    const nodes = [node('solo')];
    const edges: FlowEdge[] = [];

    const positions = computeHierarchyLayout(nodes, edges);

    expect(positions.size).toBe(1);
    expect(positions.has('solo')).toBe(true);
  });

  it('does not mutate original nodes', () => {
    const nodes = [node('a'), node('b')];
    const edges = [edge('a', 'b')];
    const originalA = { ...nodes[0].position };
    const originalB = { ...nodes[1].position };

    computeHierarchyLayout(nodes, edges);

    expect(nodes[0].position).toEqual(originalA);
    expect(nodes[1].position).toEqual(originalB);
  });
});
