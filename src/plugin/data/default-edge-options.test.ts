import { describe, it, expect } from 'vitest';
import type { FlowEdge } from '../../core/types';

/**
 * Tests for defaultEdgeOptions merging in addEdges().
 * We replicate the merge logic to unit-test without a full Alpine environment.
 */

function mergeDefaults(
  newEdges: FlowEdge | FlowEdge[],
  defaults: Partial<FlowEdge> | undefined,
): FlowEdge[] {
  return (Array.isArray(newEdges) ? newEdges : [newEdges]).map((e) =>
    defaults ? { ...defaults, ...e } : e,
  );
}

describe('defaultEdgeOptions merging', () => {
  it('passes through edges unchanged when no defaults', () => {
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b' };
    const result = mergeDefaults(edge, undefined);
    expect(result).toEqual([{ id: 'e1', source: 'a', target: 'b' }]);
  });

  it('merges defaults into edges', () => {
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b' };
    const defaults: Partial<FlowEdge> = { type: 'smoothstep', animated: true };
    const result = mergeDefaults(edge, defaults);

    expect(result[0].type).toBe('smoothstep');
    expect(result[0].animated).toBe(true);
    expect(result[0].id).toBe('e1');
    expect(result[0].source).toBe('a');
  });

  it('edge-specific properties override defaults', () => {
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b', type: 'straight' };
    const defaults: Partial<FlowEdge> = { type: 'smoothstep', animated: true };
    const result = mergeDefaults(edge, defaults);

    expect(result[0].type).toBe('straight');
    expect(result[0].animated).toBe(true);
  });

  it('handles arrays of edges', () => {
    const edges: FlowEdge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'b', target: 'c', type: 'bezier' },
    ];
    const defaults: Partial<FlowEdge> = { type: 'smoothstep', markerEnd: 'arrowclosed' };
    const result = mergeDefaults(edges, defaults);

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('smoothstep');
    expect(result[0].markerEnd).toBe('arrowclosed');
    expect(result[1].type).toBe('bezier'); // edge overrides
    expect(result[1].markerEnd).toBe('arrowclosed');
  });

  it('does not mutate the original edge objects', () => {
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b' };
    const defaults: Partial<FlowEdge> = { type: 'smoothstep' };
    const result = mergeDefaults(edge, defaults);

    expect(result[0]).not.toBe(edge);
    expect(edge.type).toBeUndefined();
  });
});
