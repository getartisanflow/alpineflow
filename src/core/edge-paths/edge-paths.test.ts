import { describe, it, expect } from 'vitest';
import { getEdgeCenter } from './utils';
import { getBezierPath, getSimpleBezierPath } from './bezier';
import { getSmoothStepPath, getStepPath } from './smoothstep';
import { getStraightPath } from './straight';

// ── getEdgeCenter ───────────────────────────────────────────────────────────

describe('getEdgeCenter', () => {
  it('returns midpoint of two positions', () => {
    const result = getEdgeCenter({ sourceX: 0, sourceY: 0, targetX: 200, targetY: 100 });
    expect(result.x).toBe(100);
    expect(result.y).toBe(50);
  });

  it('returns correct offsets', () => {
    const result = getEdgeCenter({ sourceX: 0, sourceY: 0, targetX: 200, targetY: 100 });
    expect(result.offsetX).toBe(100);
    expect(result.offsetY).toBe(50);
  });

  it('handles target before source', () => {
    const result = getEdgeCenter({ sourceX: 200, sourceY: 100, targetX: 0, targetY: 0 });
    expect(result.x).toBe(100);
    expect(result.y).toBe(50);
  });

  it('handles same position', () => {
    const result = getEdgeCenter({ sourceX: 50, sourceY: 50, targetX: 50, targetY: 50 });
    expect(result.x).toBe(50);
    expect(result.y).toBe(50);
    expect(result.offsetX).toBe(0);
    expect(result.offsetY).toBe(0);
  });
});

// ── getStraightPath ─────────────────────────────────────────────────────────

describe('getStraightPath', () => {
  it('generates M...L path', () => {
    const result = getStraightPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 100 });
    expect(result.path).toBe('M0,0 L100,100');
  });

  it('returns correct label position', () => {
    const result = getStraightPath({ sourceX: 0, sourceY: 0, targetX: 200, targetY: 100 });
    expect(result.labelPosition).toEqual({ x: 100, y: 50 });
  });
});

// ── getBezierPath ───────────────────────────────────────────────────────────

describe('getBezierPath', () => {
  it('generates a cubic bezier path', () => {
    const result = getBezierPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: 'bottom',
      targetX: 200,
      targetY: 200,
      targetPosition: 'top',
    });
    expect(result.path).toMatch(/^M0,0 C/);
    expect(result.path).toContain('200,200');
  });

  it('returns label at midpoint', () => {
    const result = getBezierPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 200,
    });
    expect(result.labelPosition).toEqual({ x: 100, y: 100 });
  });

  it('uses default positions (bottom → top)', () => {
    const result = getBezierPath({ sourceX: 0, sourceY: 0, targetX: 0, targetY: 200 });
    expect(result.path).toMatch(/^M0,0 C/);
  });
});

// ── getSimpleBezierPath ─────────────────────────────────────────────────────

describe('getSimpleBezierPath', () => {
  it('uses midpoint as control points', () => {
    const result = getSimpleBezierPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 200,
    });
    // C midX,sourceY midX,targetY targetX,targetY
    expect(result.path).toBe('M0,0 C100,0 100,200 200,200');
  });

  it('returns correct label position', () => {
    const result = getSimpleBezierPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 200,
    });
    expect(result.labelPosition).toEqual({ x: 100, y: 100 });
  });
});

// ── getSmoothStepPath ───────────────────────────────────────────────────────

describe('getSmoothStepPath', () => {
  it('generates a path with rounded bends', () => {
    const result = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: 'bottom',
      targetX: 200,
      targetY: 200,
      targetPosition: 'top',
    });
    expect(result.path).toMatch(/^M0,0/);
    expect(result.path).toContain('Q'); // quadratic bend
  });

  it('returns label position at midpoint', () => {
    const result = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 200,
    });
    expect(result.labelPosition).toEqual({ x: 100, y: 100 });
  });
});

// ── getStepPath ─────────────────────────────────────────────────────────────

describe('getStepPath', () => {
  it('generates a path with sharp right-angle bends (no Q curves)', () => {
    const result = getStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: 'right',
      targetX: 200,
      targetY: 200,
      targetPosition: 'left',
    });
    expect(result.path).toMatch(/^M0,0/);
    expect(result.path).not.toContain('Q');
  });

  it('returns label at midpoint', () => {
    const result = getStepPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 200,
      targetY: 200,
    });
    expect(result.labelPosition).toEqual({ x: 100, y: 100 });
  });
});
