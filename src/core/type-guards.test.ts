import { describe, it, expect } from 'vitest';
import { isNode, isEdge } from './types';

describe('isNode', () => {
  it('returns true for a node-shaped object', () => {
    expect(isNode({ id: 'n1', position: { x: 0, y: 0 } })).toBe(true);
  });

  it('returns false for an edge-shaped object', () => {
    expect(isNode({ id: 'e1', source: 'n1', target: 'n2' })).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isNode(null)).toBe(false);
    expect(isNode(undefined)).toBe(false);
  });
});

describe('isEdge', () => {
  it('returns true for an edge-shaped object', () => {
    expect(isEdge({ id: 'e1', source: 'n1', target: 'n2' })).toBe(true);
  });

  it('returns false for a node-shaped object', () => {
    expect(isEdge({ id: 'n1', position: { x: 0, y: 0 } })).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isEdge(null)).toBe(false);
    expect(isEdge(undefined)).toBe(false);
  });
});
