import { describe, it, expect } from 'vitest';
import { computeSchemaHandlePoint } from './schema-geometry';
import type { SchemaMetrics } from '../plugin/data/canvas-context';

// Realistic metrics fixture, hand-computed against in each test.
const metrics: SchemaMetrics = {
  headerHeight: 30,
  rowHeight: 24,
  insetLeft: 1,
  insetRight: 1,
  insetTop: 1,
  handleWidth: 10,
  handleHeight: 10,
};

const node = {
  dimensions: { width: 200, height: 200 },
  data: { fields: [{ name: 'id' }, { name: 'name' }, { name: 'email' }, { name: 'created_at' }] },
};

const absolutePosition = { x: 100, y: 50 };

// y = absolutePosition.y + insetTop + headerHeight + idx * rowHeight + rowHeight / 2
// idx 0 → 50 + 1 + 30 + 0 + 12 = 93
// idx 3 → 50 + 1 + 30 + 72 + 12 = 165

describe('computeSchemaHandlePoint', () => {
  it('computes the left handle point for field index 0', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 'id', 'left', metrics);
    expect(point).toEqual({ x: 101, y: 93, position: 'left' });
  });

  it('computes the right handle point for field index 0', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 'id', 'right', metrics);
    expect(point).toEqual({ x: 299, y: 93, position: 'right' });
  });

  it('computes the left handle point for field index 3', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 'created_at', 'left', metrics);
    expect(point).toEqual({ x: 101, y: 165, position: 'left' });
  });

  it('computes the right handle point for field index 3', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 'created_at', 'right', metrics);
    expect(point).toEqual({ x: 299, y: 165, position: 'right' });
  });

  it('sets position to the requested side', () => {
    const left = computeSchemaHandlePoint(node, absolutePosition, 'name', 'left', metrics);
    const right = computeSchemaHandlePoint(node, absolutePosition, 'name', 'right', metrics);
    expect(left?.position).toBe('left');
    expect(right?.position).toBe('right');
  });

  it('uses absolutePosition, not any position on node, for group-child nodes', () => {
    // A child node inside a group carries a group-local `position` on the
    // FlowNode, but the caller resolves the true flow-space position via
    // toAbsoluteNode and passes it as `absolutePosition`. The function must
    // never read node.position — it doesn't even accept it in its signature.
    const groupChildNode = {
      dimensions: { width: 200, height: 200 },
      data: { fields: [{ name: 'id' }] },
      // No `position` field at all — proves the function can't be reading one.
    };
    const point = computeSchemaHandlePoint(groupChildNode, absolutePosition, 'id', 'left', metrics);
    expect(point).toEqual({ x: 101, y: 93, position: 'left' });
  });

  it('resolves an exact match over a stripped match', () => {
    const collidingNode = {
      dimensions: { width: 200, height: 200 },
      data: { fields: [{ name: 'email-r' }, { name: 'email' }] },
    };
    // handleId 'email-r' exactly matches index 0. If exact match were skipped
    // in favor of stripping first, this would incorrectly resolve to index 1
    // ('email', after stripping the trailing '-r').
    const point = computeSchemaHandlePoint(collidingNode, absolutePosition, 'email-r', 'left', metrics);
    expect(point).toEqual({ x: 101, y: 93, position: 'left' });
  });

  it('falls back to a stripped match when no exact match exists', () => {
    const strippedNode = {
      dimensions: { width: 200, height: 200 },
      data: { fields: [{ name: 'user_id' }] },
    };
    const point = computeSchemaHandlePoint(strippedNode, absolutePosition, 'user_id-l', 'left', metrics);
    expect(point).toEqual({ x: 101, y: 93, position: 'left' });
  });

  it('returns null when node.data.fields is missing', () => {
    const noFieldsNode = { dimensions: { width: 200, height: 200 }, data: {} };
    expect(computeSchemaHandlePoint(noFieldsNode, absolutePosition, 'id', 'left', metrics)).toBeNull();
  });

  it('returns null when node.data.fields is not an array', () => {
    const badFieldsNode = {
      dimensions: { width: 200, height: 200 },
      data: { fields: 'not-an-array' as unknown as Array<{ name: string }> },
    };
    expect(computeSchemaHandlePoint(badFieldsNode, absolutePosition, 'id', 'left', metrics)).toBeNull();
  });

  it('returns null when no field matches (even after stripping)', () => {
    expect(computeSchemaHandlePoint(node, absolutePosition, 'nonexistent', 'left', metrics)).toBeNull();
  });

  it('returns null when node.dimensions is missing', () => {
    const noDimsNode = { data: { fields: [{ name: 'id' }] } };
    expect(computeSchemaHandlePoint(noDimsNode, absolutePosition, 'id', 'left', metrics)).toBeNull();
  });

  it('returns null when node.dimensions.width is not finite', () => {
    const badDimsNode = {
      dimensions: { width: NaN, height: 200 },
      data: { fields: [{ name: 'id' }] },
    };
    expect(computeSchemaHandlePoint(badDimsNode, absolutePosition, 'id', 'left', metrics)).toBeNull();
  });

  it('returns null when node.dimensions.height is not finite', () => {
    const badDimsNode = {
      dimensions: { width: 200, height: Infinity },
      data: { fields: [{ name: 'id' }] },
    };
    expect(computeSchemaHandlePoint(badDimsNode, absolutePosition, 'id', 'left', metrics)).toBeNull();
  });

  it('returns null when a required metric is not finite', () => {
    const badMetrics: SchemaMetrics = { ...metrics, rowHeight: NaN };
    expect(computeSchemaHandlePoint(node, absolutePosition, 'id', 'left', badMetrics)).toBeNull();
  });
});
