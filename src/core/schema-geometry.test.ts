import { describe, it, expect } from 'vitest';
import { computeSchemaHandlePoint, schemaFieldIndex } from './schema-geometry';
import type { SchemaMetrics } from './types';

// Realistic metrics fixture, hand-computed against in each test.
const metrics: SchemaMetrics = {
  headerHeight: 30,
  rowHeight: 24,
  insetLeft: 1,
  insetRight: 1,
  insetTop: 1,
  insetBottom: 1,
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

describe('schemaFieldIndex', () => {
  it('resolves the row index of the field a handle id names', () => {
    expect(schemaFieldIndex(node.data.fields, 'id')).toBe(0);
    expect(schemaFieldIndex(node.data.fields, 'created_at')).toBe(3);
  });

  it('resolves an EXACT match only — a `-l`/`-r` suffix is never stripped', () => {
    // The DOM oracle does not strip suffixes: on a rendered schema node no handle
    // with id `user_id-l` exists, so `measureHandleCoords` falls through to
    // `inferSideFromHandleId` and lands on the node's FIRST left handle (row 0) —
    // NOT the stripped field's row. Stripping here would silently disagree with it.
    expect(schemaFieldIndex([{ name: 'user_id' }], 'user_id-l')).toBe(-1);
    // And a field genuinely named `email-r` must still resolve to itself.
    expect(schemaFieldIndex([{ name: 'email-r' }, { name: 'email' }], 'email-r')).toBe(0);
  });

  it('returns -1 when no field matches', () => {
    expect(schemaFieldIndex(node.data.fields, 'nonexistent')).toBe(-1);
  });

  it('returns -1 when fields is missing or not an array', () => {
    expect(schemaFieldIndex(undefined, 'id')).toBe(-1);
    expect(schemaFieldIndex('not-an-array' as unknown as Array<{ name: string }>, 'id')).toBe(-1);
  });
});

describe('computeSchemaHandlePoint', () => {
  it('computes the left handle point for field index 0', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 0, 'left', metrics);
    expect(point).toEqual({ x: 101, y: 93, position: 'left' });
  });

  it('computes the right handle point for field index 0', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 0, 'right', metrics);
    expect(point).toEqual({ x: 299, y: 93, position: 'right' });
  });

  it('computes the left handle point for field index 3', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 3, 'left', metrics);
    expect(point).toEqual({ x: 101, y: 165, position: 'left' });
  });

  it('computes the right handle point for field index 3', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 3, 'right', metrics);
    expect(point).toEqual({ x: 299, y: 165, position: 'right' });
  });

  it('sets position to the requested side', () => {
    const left = computeSchemaHandlePoint(node, absolutePosition, 1, 'left', metrics);
    const right = computeSchemaHandlePoint(node, absolutePosition, 1, 'right', metrics);
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
    const point = computeSchemaHandlePoint(groupChildNode, absolutePosition, 0, 'left', metrics);
    expect(point).toEqual({ x: 101, y: 93, position: 'left' });
  });

  it('returns null when node.data.fields is missing', () => {
    const noFieldsNode = { dimensions: { width: 200, height: 200 }, data: {} };
    expect(computeSchemaHandlePoint(noFieldsNode, absolutePosition, 0, 'left', metrics)).toBeNull();
  });

  it('returns null when node.data.fields is not an array', () => {
    const badFieldsNode = {
      dimensions: { width: 200, height: 200 },
      data: { fields: 'not-an-array' as unknown as Array<{ name: string }> },
    };
    expect(computeSchemaHandlePoint(badFieldsNode, absolutePosition, 0, 'left', metrics)).toBeNull();
  });

  it('returns null when the field index is out of range or unresolved', () => {
    expect(computeSchemaHandlePoint(node, absolutePosition, -1, 'left', metrics)).toBeNull();
    expect(computeSchemaHandlePoint(node, absolutePosition, 4, 'left', metrics)).toBeNull();
  });

  it('returns null when node.dimensions is missing', () => {
    const noDimsNode = { data: { fields: [{ name: 'id' }] } };
    expect(computeSchemaHandlePoint(noDimsNode, absolutePosition, 0, 'left', metrics)).toBeNull();
  });

  it('returns null when node.dimensions.width is not finite', () => {
    const badDimsNode = {
      dimensions: { width: NaN, height: 200 },
      data: { fields: [{ name: 'id' }] },
    };
    expect(computeSchemaHandlePoint(badDimsNode, absolutePosition, 0, 'left', metrics)).toBeNull();
  });

  it('returns null when node.dimensions.height is not finite', () => {
    const badDimsNode = {
      dimensions: { width: 200, height: Infinity },
      data: { fields: [{ name: 'id' }] },
    };
    expect(computeSchemaHandlePoint(badDimsNode, absolutePosition, 0, 'left', metrics)).toBeNull();
  });

  it('returns null when a required metric is not finite', () => {
    const badMetrics: SchemaMetrics = { ...metrics, rowHeight: NaN };
    expect(computeSchemaHandlePoint(node, absolutePosition, 0, 'left', badMetrics)).toBeNull();
  });
});
