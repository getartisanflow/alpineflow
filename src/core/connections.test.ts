import { describe, it, expect } from 'vitest';
import {
  isPointInHandle,
  findClosestHandle,
  isValidConnection,
  type HandleBounds,
} from './connections';
import type { Connection } from './types';

// ── Test Fixtures ───────────────────────────────────────────────────────────

const handle1: HandleBounds = {
  nodeId: 'a',
  handleId: 'source',
  type: 'source',
  position: 'right',
  absolutePosition: { x: 150, y: 25 },
  width: 10,
  height: 10,
};

const handle2: HandleBounds = {
  nodeId: 'b',
  handleId: 'target',
  type: 'target',
  position: 'left',
  absolutePosition: { x: 200, y: 125 },
  width: 10,
  height: 10,
};

const handle3: HandleBounds = {
  nodeId: 'c',
  handleId: 'target',
  type: 'target',
  position: 'left',
  absolutePosition: { x: 400, y: 225 },
  width: 10,
  height: 10,
};

// ── isPointInHandle ─────────────────────────────────────────────────────────

describe('isPointInHandle', () => {
  it('returns true when point is at handle center', () => {
    expect(isPointInHandle({ x: 150, y: 25 }, handle1)).toBe(true);
  });

  it('returns true when point is within tolerance', () => {
    expect(isPointInHandle({ x: 160, y: 30 }, handle1, 10)).toBe(true);
  });

  it('returns false when point is outside tolerance', () => {
    expect(isPointInHandle({ x: 200, y: 100 }, handle1, 10)).toBe(false);
  });

  it('respects custom tolerance', () => {
    expect(isPointInHandle({ x: 180, y: 25 }, handle1, 5)).toBe(false);
    expect(isPointInHandle({ x: 180, y: 25 }, handle1, 30)).toBe(true);
  });

  it('accounts for handle dimensions', () => {
    const wideHandle: HandleBounds = {
      ...handle1,
      width: 40,
      height: 40,
    };
    // halfW = 20 + 10 = 30
    expect(isPointInHandle({ x: 175, y: 25 }, wideHandle, 10)).toBe(true);
  });
});

// ── findClosestHandle ───────────────────────────────────────────────────────

describe('findClosestHandle', () => {
  const handles = [handle1, handle2, handle3];

  it('finds the closest handle within tolerance', () => {
    const result = findClosestHandle({ x: 155, y: 30 }, handles, 20);
    expect(result).toBe(handle1);
  });

  it('returns null when no handle is within tolerance', () => {
    const result = findClosestHandle({ x: 0, y: 0 }, handles, 20);
    expect(result).toBeNull();
  });

  it('picks closer handle when two are within tolerance', () => {
    const closeHandles: HandleBounds[] = [
      { ...handle1, absolutePosition: { x: 100, y: 100 } },
      { ...handle2, absolutePosition: { x: 105, y: 100 } },
    ];
    const result = findClosestHandle({ x: 103, y: 100 }, closeHandles, 20);
    expect(result?.absolutePosition.x).toBe(105);
  });

  it('returns null for empty handles array', () => {
    expect(findClosestHandle({ x: 0, y: 0 }, [], 20)).toBeNull();
  });
});

// ── isValidConnection ───────────────────────────────────────────────────────

describe('isValidConnection', () => {
  const existingEdges = [
    { source: 'a', target: 'b', sourceHandle: 'source', targetHandle: 'target' },
  ];

  it('allows valid new connection', () => {
    const conn: Connection = { source: 'a', target: 'c' };
    expect(isValidConnection(conn, existingEdges)).toBe(true);
  });

  it('rejects self-connection', () => {
    const conn: Connection = { source: 'a', target: 'a' };
    expect(isValidConnection(conn, existingEdges)).toBe(false);
  });

  it('rejects duplicate edge', () => {
    const conn: Connection = {
      source: 'a',
      target: 'b',
      sourceHandle: 'source',
      targetHandle: 'target',
    };
    expect(isValidConnection(conn, existingEdges)).toBe(false);
  });

  it('allows same source-target with different handles', () => {
    const conn: Connection = {
      source: 'a',
      target: 'b',
      sourceHandle: 'output-2',
      targetHandle: 'input-2',
    };
    expect(isValidConnection(conn, existingEdges)).toBe(true);
  });

  it('allows connection with empty existing edges', () => {
    const conn: Connection = { source: 'a', target: 'b' };
    expect(isValidConnection(conn, [])).toBe(true);
  });

  it('allows acyclic connection when preventCycles is true', () => {
    const edges = [{ source: 'a', target: 'b' }];
    const conn: Connection = { source: 'b', target: 'c' };
    expect(isValidConnection(conn, edges, { preventCycles: true })).toBe(true);
  });

  it('rejects cycle-creating connection when preventCycles is true', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ];
    const conn: Connection = { source: 'c', target: 'a' };
    expect(isValidConnection(conn, edges, { preventCycles: true })).toBe(false);
  });

  it('allows cycle when preventCycles is false', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ];
    const conn: Connection = { source: 'c', target: 'a' };
    expect(isValidConnection(conn, edges, { preventCycles: false })).toBe(true);
  });

  it('does not check cycles when options omitted', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ];
    const conn: Connection = { source: 'c', target: 'a' };
    expect(isValidConnection(conn, edges)).toBe(true);
  });
});
