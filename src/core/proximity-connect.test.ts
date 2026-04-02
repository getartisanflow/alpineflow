import { describe, it, expect } from 'vitest';
import { findProximityCandidate, inferDirection } from './proximity-connect';

describe('inferDirection', () => {
  it('node further left is source', () => {
    const result = inferDirection(
      { x: 50, y: 100 },
      { x: 250, y: 100 },
      'a', 'b',
    );
    expect(result).toEqual({ source: 'a', target: 'b' });
  });

  it('node further right is target', () => {
    const result = inferDirection(
      { x: 300, y: 100 },
      { x: 100, y: 100 },
      'a', 'b',
    );
    expect(result).toEqual({ source: 'b', target: 'a' });
  });

  it('when X is similar, node further up is source', () => {
    const result = inferDirection(
      { x: 100, y: 50 },
      { x: 105, y: 250 },
      'a', 'b',
    );
    expect(result).toEqual({ source: 'a', target: 'b' });
  });

  it('when X is similar, node further down is target', () => {
    const result = inferDirection(
      { x: 100, y: 300 },
      { x: 102, y: 50 },
      'a', 'b',
    );
    expect(result).toEqual({ source: 'b', target: 'a' });
  });
});

describe('findProximityCandidate', () => {
  const nodes = [
    { id: 'a', center: { x: 100, y: 100 } },
    { id: 'b', center: { x: 200, y: 100 } },
    { id: 'c', center: { x: 500, y: 500 } },
  ];

  it('returns nearest node within distance', () => {
    const result = findProximityCandidate('a', { x: 100, y: 100 }, nodes, 150);
    expect(result).not.toBeNull();
    expect(result!.targetId).toBe('b');
  });

  it('returns null when no node within distance', () => {
    const result = findProximityCandidate('a', { x: 100, y: 100 }, nodes, 50);
    expect(result).toBeNull();
  });

  it('excludes the dragged node itself', () => {
    const result = findProximityCandidate('a', { x: 100, y: 100 }, nodes, 1);
    expect(result).toBeNull();
  });

  it('returns the closest node when multiple are in range', () => {
    const close = [
      { id: 'a', center: { x: 100, y: 100 } },
      { id: 'b', center: { x: 120, y: 100 } },
      { id: 'c', center: { x: 200, y: 100 } },
    ];
    const result = findProximityCandidate('a', { x: 100, y: 100 }, close, 150);
    expect(result!.targetId).toBe('b');
  });

  it('includes distance in result', () => {
    const result = findProximityCandidate('a', { x: 100, y: 100 }, nodes, 150);
    expect(result!.distance).toBeCloseTo(100, 0);
  });

  it('includes inferred source and target in result', () => {
    const result = findProximityCandidate('a', { x: 100, y: 100 }, nodes, 150);
    expect(result!.source).toBe('a');
    expect(result!.target).toBe('b');
  });
});
