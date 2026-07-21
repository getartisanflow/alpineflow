import { describe, it, expect } from 'vitest';
import { getEdgePath } from './edge-utils';
import type { FlowEdge, FlowNode } from './types';

// Minimal nodes — getEdgePath skips getHandleCoords when explicit endpoint coords
// are supplied, so the node bodies are unused here.
const node = (id: string) => ({ id, position: { x: 0, y: 0 }, data: {} }) as unknown as FlowNode;
const at = { x: 0, y: 0 };

describe('getEdgePath — custom edge types', () => {
  it('hands the edge to a custom generator so it can read per-edge routing data', () => {
    // The point of the edge-passing change: a generator no longer needs a closure
    // per edge — it reads route data straight off the edge (which, living on the
    // edge, survives toObject()/fromObject()).
    let received: FlowEdge | undefined;
    const edge = {
      id: 'e1',
      source: 'a',
      target: 'b',
      type: 'gutter',
      data: { gutter: { srcOffset: 7 } },
    } as unknown as FlowEdge;

    const edgeTypes = {
      gutter: (_params: unknown, e?: FlowEdge) => {
        received = e;
        const off = (e?.data as { gutter?: { srcOffset?: number } })?.gutter?.srcOffset ?? 0;
        return { path: `M0 0 L${off} 0`, labelPosition: { x: 0, y: 0 } };
      },
    };

    const result = getEdgePath(edge, node('a'), node('b'), 'bottom', 'top', at, at, edgeTypes);

    expect(received).toBe(edge); // the exact edge object is threaded through
    expect(result.path).toBe('M0 0 L7 0'); // and its per-edge data drives the path
  });

  it('still calls a one-arg generator that ignores the edge (backward compatible)', () => {
    const edge = { id: 'e2', source: 'a', target: 'b', type: 'custom' } as unknown as FlowEdge;
    const edgeTypes = {
      custom: (params: { sourceX: number }) => ({
        path: `M${params.sourceX} 0`,
        labelPosition: { x: 0, y: 0 },
      }),
    };

    const result = getEdgePath(edge, node('a'), node('b'), 'bottom', 'top', { x: 5, y: 0 }, at, edgeTypes);

    expect(result.path).toBe('M5 0');
  });
});
