import { describe, it, expect } from 'vitest';
import { detectBidirectionalPairs, collapseBidirectionalPairs } from './bidirectional-edges';

describe('detectBidirectionalPairs', () => {
  it('detects reciprocal edge pairs', () => {
    const edges = [
      { id: 'a', source: 'n1', target: 'n2' },
      { id: 'b', source: 'n2', target: 'n1' },
      { id: 'c', source: 'n1', target: 'n3' },
    ];
    const pairs = detectBidirectionalPairs(edges);
    expect(pairs).toHaveLength(1);
    expect(pairs[0]).toMatchObject({ primaryId: 'a', mirrorId: 'b' });
  });

  it('does not treat the same edge twice', () => {
    const edges = [{ id: 'a', source: 'n1', target: 'n1' }];
    expect(detectBidirectionalPairs(edges)).toHaveLength(0);
  });

  it('handles triangles without miscounting', () => {
    const edges = [
      { id: 'a', source: 'n1', target: 'n2' },
      { id: 'b', source: 'n2', target: 'n3' },
      { id: 'c', source: 'n3', target: 'n1' },
    ];
    expect(detectBidirectionalPairs(edges)).toHaveLength(0);
  });

  it('ignores already-paired edges on subsequent matches', () => {
    const edges = [
      { id: 'a', source: 'n1', target: 'n2' },
      { id: 'b', source: 'n2', target: 'n1' },
      { id: 'c', source: 'n2', target: 'n1' }, // same shape as b — should NOT form new pair with a
    ];
    const pairs = detectBidirectionalPairs(edges);
    expect(pairs).toHaveLength(1);
    expect(pairs[0].mirrorId).toBe('b'); // first match wins
  });
});

describe('collapseBidirectionalPairs', () => {
  it('marks mirror edges as hidden and primary edges as dual-marker', () => {
    const edges = [
      { id: 'a', source: 'n1', target: 'n2' },
      { id: 'b', source: 'n2', target: 'n1' },
    ];
    const decorated = collapseBidirectionalPairs(edges);
    expect(decorated.find((e) => e.id === 'a')!._renderDualMarker).toBe(true);
    expect(decorated.find((e) => e.id === 'b')!._hiddenByCollapse).toBe(true);
  });

  it('leaves non-paired edges untouched', () => {
    const edges = [{ id: 'a', source: 'n1', target: 'n2' }];
    const decorated = collapseBidirectionalPairs(edges);
    expect(decorated[0]._renderDualMarker).toBeUndefined();
    expect(decorated[0]._hiddenByCollapse).toBeUndefined();
  });
});
