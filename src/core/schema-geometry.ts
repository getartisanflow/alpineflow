// ============================================================================
// Schema Handle Geometry
//
// Pure math for locating a schema field row's handle center from state alone
// — no DOM measurement. Schema rows are uniform, so once header/row/inset
// metrics are known (see SchemaMetrics), every handle's position is
// arithmetic. Consumed by edge code in place of getBoundingClientRect calls.
// ============================================================================

import type { XYPosition, SchemaMetrics } from './types';

/** Resolved center of a schema field row's handle, in flow space. */
export interface SchemaHandlePoint {
  x: number;
  y: number;
  position: 'left' | 'right';
}

/**
 * Row index of the field a handle id names, or `-1` when it names none.
 *
 * The match is EXACT — a trailing `-l`/`-r` is never stripped. That suffix is the
 * CONDENSED-node convention: on a rendered schema node no handle carries it, so the
 * DOM path (`measureHandleCoords`) finds no matching handle, falls through to
 * `inferSideFromHandleId`, and lands on the node's FIRST left/right handle — row 0,
 * not the stripped field's row. Stripping here would silently disagree with that
 * oracle, so an inexact id resolves to nothing and the caller falls back to the DOM.
 */
export function schemaFieldIndex(
  fields: ReadonlyArray<{ name: string }> | undefined,
  handleId: string,
): number {
  if (!Array.isArray(fields)) return -1;
  return fields.findIndex((f) => f?.name === handleId);
}

/**
 * Handle center for a schema field row, derived purely from state.
 *
 * `fieldIndex` is the row, already resolved by `schemaFieldIndex` — the caller
 * needs the index for its own eligibility checks anyway, so threading it in keeps
 * each endpoint to a single scan of `fields`.
 *
 * Returns `null` when the fast path does not apply — the caller MUST then
 * fall back to DOM measurement. Correctness is never traded for speed.
 */
export function computeSchemaHandlePoint(
  node: {
    dimensions?: { width: number; height: number };
    data?: { fields?: Array<{ name: string }> };
  },
  absolutePosition: XYPosition,
  fieldIndex: number,
  side: 'left' | 'right',
  metrics: SchemaMetrics,
): SchemaHandlePoint | null {
  const fields = node.data?.fields;
  if (!Array.isArray(fields)) return null;
  if (!Number.isInteger(fieldIndex) || fieldIndex < 0 || fieldIndex >= fields.length) return null;

  const { width, height } = node.dimensions ?? {};
  if (typeof width !== 'number' || !Number.isFinite(width)) return null;
  if (typeof height !== 'number' || !Number.isFinite(height)) return null;

  const { headerHeight, rowHeight, handleOffsetY, handleOffsetYLast, insetLeft, insetRight, insetTop } =
    metrics;
  if (
    !Number.isFinite(headerHeight) ||
    !Number.isFinite(rowHeight) ||
    !Number.isFinite(handleOffsetY) ||
    !Number.isFinite(handleOffsetYLast) ||
    !Number.isFinite(insetLeft) ||
    !Number.isFinite(insetRight) ||
    !Number.isFinite(insetTop)
  ) {
    return null;
  }

  // Row top = header + `fieldIndex` strides. The handle then sits `handleOffsetY` into
  // its row — a MEASURED offset, not `rowHeight / 2`: the theme's row border-bottom
  // shrinks the padding box that the handle's `top: 50%` resolves against, so the handle
  // center sits half a border above the row's box center. The last row lost that border,
  // so it gets its own measured offset. See SchemaMetrics.handleOffsetY.
  const offsetY = fieldIndex === fields.length - 1 ? handleOffsetYLast : handleOffsetY;
  const y = absolutePosition.y + insetTop + headerHeight + fieldIndex * rowHeight + offsetY;
  const x =
    side === 'left'
      ? absolutePosition.x + insetLeft
      : absolutePosition.x + width - insetRight;

  return { x, y, position: side };
}
