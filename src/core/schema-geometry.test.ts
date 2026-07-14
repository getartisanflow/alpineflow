import { describe, it, expect } from 'vitest';
import { computeSchemaHandlePoint, schemaFieldIndex } from './schema-geometry';
import type { SchemaMetrics } from './types';

// Realistic metrics fixture, hand-computed against in each test. Modelled on the SHIPPED
// stylesheet, whose row rules are the reason these numbers aren't all round:
//   - rows carry a 1px border-bottom, dropped on `:last-child` ⇒ the last row's border box
//     is one border shorter than the stride (rowHeight 24, rowHeightLast 23)
//   - a handle is `top: 50%` of its row's PADDING box, which that border shrinks ⇒ the
//     handle center is 11.5 into the row, NOT rowHeight/2 = 12
// Keeping these distinct is what stops a regression from re-introducing a uniform-row
// model — which is what disabled the fast path outright in a real browser.
const metrics: SchemaMetrics = {
  headerHeight: 30,
  rowHeight: 24,
  rowHeightLast: 23,
  handleOffsetY: 11.5,
  handleOffsetYLast: 11.5,
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

// y = absolutePosition.y + insetTop + headerHeight + idx * rowHeight + offsetY,
// where offsetY is `handleOffsetYLast` on the FINAL row and `handleOffsetY` on every other.
// idx 0 → 50 + 1 + 30 +  0 + 11.5 = 92.5
// idx 3 → 50 + 1 + 30 + 72 + 11.5 = 164.5

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
    expect(point).toEqual({ x: 101, y: 92.5, position: 'left' });
  });

  it('computes the right handle point for field index 0', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 0, 'right', metrics);
    expect(point).toEqual({ x: 299, y: 92.5, position: 'right' });
  });

  it('computes the left handle point for field index 3 (the LAST row — shorter)', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 3, 'left', metrics);
    expect(point).toEqual({ x: 101, y: 164.5, position: 'left' });
  });

  it('computes the right handle point for field index 3', () => {
    const point = computeSchemaHandlePoint(node, absolutePosition, 3, 'right', metrics);
    expect(point).toEqual({ x: 299, y: 164.5, position: 'right' });
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
    // y = 50 + 1 + 30 + 0 + handleOffsetYLast(11.5) = 92.5 — one field, so row 0 is last.
    expect(point).toEqual({ x: 101, y: 92.5, position: 'left' });
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

  it('returns null when handleOffsetY is not finite', () => {
    const badMetrics: SchemaMetrics = { ...metrics, handleOffsetY: NaN };
    expect(computeSchemaHandlePoint(node, absolutePosition, 0, 'left', badMetrics)).toBeNull();
  });

  it('returns null when handleOffsetYLast is not finite', () => {
    const badMetrics: SchemaMetrics = { ...metrics, handleOffsetYLast: NaN };
    expect(computeSchemaHandlePoint(node, absolutePosition, 0, 'left', badMetrics)).toBeNull();
  });

  it('applies handleOffsetYLast ONLY to the final row, and never to the stride', () => {
    // The stride between rows is always `rowHeight` — the last row being shorter moves its
    // own handle, not the rows above it. A model that folded the last row's height into the
    // stride would drift EVERY row; one that ignored the distinction would put the final
    // handle half a border low. Drive the two offsets far apart so either mistake shows.
    const skewed: SchemaMetrics = { ...metrics, handleOffsetY: 11.5, handleOffsetYLast: 4 };
    // rows 0–2: top = 81 + idx*24, handle 11.5 in
    expect(computeSchemaHandlePoint(node, absolutePosition, 0, 'left', skewed)!.y).toBe(92.5);
    expect(computeSchemaHandlePoint(node, absolutePosition, 1, 'left', skewed)!.y).toBe(116.5);
    expect(computeSchemaHandlePoint(node, absolutePosition, 2, 'left', skewed)!.y).toBe(140.5);
    // row 3 (last): top is still 81 + 72 = 153 — the stride did NOT change — but the handle
    // sits only 4 into it.
    expect(computeSchemaHandlePoint(node, absolutePosition, 3, 'left', skewed)!.y).toBe(157);
  });
});
