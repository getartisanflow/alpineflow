import { describe, it, expect } from 'vitest';
import { computeHelperLines, nodeToBox, type NodeBox } from './helper-lines';
import type { FlowNode } from './types';

function box(id: string, x: number, y: number, w = 150, h = 50): NodeBox {
  return { id, x, y, width: w, height: h };
}

describe('nodeToBox', () => {
  it('uses node dimensions when available', () => {
    const node: FlowNode = {
      id: 'a',
      position: { x: 10, y: 20 },
      data: {},
      dimensions: { width: 200, height: 100 },
    };
    const b = nodeToBox(node);
    expect(b).toEqual({ id: 'a', x: 10, y: 20, width: 200, height: 100 });
  });

  it('uses defaults when dimensions missing', () => {
    const node: FlowNode = { id: 'a', position: { x: 0, y: 0 }, data: {} };
    const b = nodeToBox(node);
    expect(b.width).toBe(150);
    expect(b.height).toBe(50);
  });
});

describe('computeHelperLines', () => {
  it('detects left-left alignment', () => {
    const dragged = box('a', 100, 0);
    const others = [box('b', 102, 100)];
    const result = computeHelperLines(dragged, others, 5);

    expect(result.vertical).toContain(102);
    expect(result.snapOffset.x).toBe(2);
  });

  it('detects top-top alignment', () => {
    const dragged = box('a', 0, 100);
    const others = [box('b', 200, 97)];
    const result = computeHelperLines(dragged, others, 5);

    expect(result.horizontal).toContain(97);
    expect(result.snapOffset.y).toBe(-3);
  });

  it('detects center-center vertical alignment', () => {
    const dragged = box('a', 100, 0, 150, 50);
    const others = [box('b', 101, 100, 150, 50)];
    const result = computeHelperLines(dragged, others, 5);

    expect(result.vertical).toContain(176);
    expect(result.snapOffset.x).toBe(1);
  });

  it('detects right-right alignment', () => {
    const dragged = box('a', 100, 0, 150, 50);
    const others = [box('b', 103, 100, 150, 50)];
    const result = computeHelperLines(dragged, others, 5);

    expect(result.vertical).toContain(253);
    expect(result.snapOffset.x).toBe(3);
  });

  it('returns no guides when outside threshold', () => {
    const dragged = box('a', 100, 0);
    const others = [box('b', 200, 200)];
    const result = computeHelperLines(dragged, others, 5);

    expect(result.horizontal).toHaveLength(0);
    expect(result.vertical).toHaveLength(0);
    expect(result.snapOffset).toEqual({ x: 0, y: 0 });
  });

  it('picks closest snap when multiple alignments exist', () => {
    const dragged = box('a', 100, 0, 150, 50);
    const others = [
      box('b', 102, 100, 150, 50),
      box('c', 96, 200, 150, 50),
    ];
    const result = computeHelperLines(dragged, others, 5);

    expect(result.snapOffset.x).toBe(2);
    expect(result.vertical).toContain(102);
    expect(result.vertical).toContain(96);
  });

  it('deduplicates guide positions', () => {
    const dragged = box('a', 100, 0, 150, 50);
    const others = [
      box('b', 100, 100, 150, 50),
      box('c', 100, 200, 150, 50),
    ];
    const result = computeHelperLines(dragged, others, 5);

    const count100 = result.vertical.filter(v => v === 100).length;
    expect(count100).toBe(1);
  });

  it('handles empty others array', () => {
    const dragged = box('a', 0, 0);
    const result = computeHelperLines(dragged, [], 5);

    expect(result.horizontal).toHaveLength(0);
    expect(result.vertical).toHaveLength(0);
    expect(result.snapOffset).toEqual({ x: 0, y: 0 });
  });

  it('detects cross alignments (left-right)', () => {
    const dragged = box('a', 100, 0, 150, 50);
    const others = [box('b', 0, 100, 102, 50)];
    const result = computeHelperLines(dragged, others, 5);

    expect(result.vertical).toContain(102);
    expect(result.snapOffset.x).toBe(2);
  });

  it('detects both horizontal and vertical simultaneously', () => {
    const dragged = box('a', 100, 100, 150, 50);
    const others = [box('b', 102, 103, 150, 50)];
    const result = computeHelperLines(dragged, others, 5);

    expect(result.vertical.length).toBeGreaterThan(0);
    expect(result.horizontal.length).toBeGreaterThan(0);
  });
});
