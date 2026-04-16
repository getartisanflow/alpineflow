import { describe, it, expect } from 'vitest';
import type { FlowEdge, EdgeType } from '../../core/types';

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

/**
 * Resolve edge type with fallback hierarchy:
 * edge.type ?? defaultEdgeType ?? 'bezier'
 */
function resolveEdgeType(
  edge: FlowEdge,
  defaultEdgeType?: EdgeType,
): EdgeType {
  return edge.type ?? defaultEdgeType ?? 'bezier';
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

// ── defaultEdgeType resolution ──────────────────────────────────────────────

describe('resolveEdgeType — canvas.defaultEdgeType fallback', () => {
  it('uses edge.type when present', () => {
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b', type: 'straight' };
    const result = resolveEdgeType(edge, 'smoothstep');
    expect(result).toBe('straight');
  });

  it('uses canvas.defaultEdgeType when edge.type is missing', () => {
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b' };
    const result = resolveEdgeType(edge, 'smoothstep');
    expect(result).toBe('smoothstep');
  });

  it('falls back to "bezier" when neither edge.type nor defaultEdgeType is set', () => {
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b' };
    const result = resolveEdgeType(edge, undefined);
    expect(result).toBe('bezier');
  });

  it('edge.type wins over canvas.defaultEdgeType', () => {
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b', type: 'bezier' };
    const result = resolveEdgeType(edge, 'smoothstep');
    expect(result).toBe('bezier');
  });

  it('resolves all supported edge types via defaultEdgeType', () => {
    const types: EdgeType[] = ['bezier', 'smoothstep', 'straight', 'floating', 'orthogonal', 'avoidant', 'editable'];
    const edge: FlowEdge = { id: 'e1', source: 'a', target: 'b' };

    types.forEach((edgeType) => {
      const result = resolveEdgeType(edge, edgeType);
      expect(result).toBe(edgeType);
    });
  });
});
