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
 * Split a handle id into its field name and an optional PINNED side. A trailing
 * `-l`/`-r` names a side explicitly — schema rows stamp a real source+target
 * handle on BOTH sides, so `team_id-r` means "team_id's right-side handle".
 *
 * This is only a fallback: callers must try an EXACT field match on the whole id
 * FIRST, so a field genuinely named `foo-r` still resolves to itself and never
 * gets read as a side pin.
 */
export function splitHandleSide(handleId: string): { field: string; side: 'left' | 'right' | null } {
  if (handleId.endsWith('-l')) return { field: handleId.slice(0, -2), side: 'left' };
  if (handleId.endsWith('-r')) return { field: handleId.slice(0, -2), side: 'right' };
  return { field: handleId, side: null };
}

/**
 * Row index of the field a handle id names, or `-1` when it names none.
 *
 * EXACT match wins first — a field literally named `email-r` resolves to itself.
 * Only when nothing matches the whole id AND it carries a `-l`/`-r` suffix does the
 * suffix get stripped and the bare field looked up: `team_id-r` → the `team_id`
 * row. The suffix pins the SIDE (see `schemaSidePin`); the ROW is that same field's,
 * NOT the node's row 0. The DOM path (`resolveHandlePosition`/`measureHandleCoords`)
 * resolves the identical row + side, so the two oracles agree.
 */
export function schemaFieldIndex(
  fields: ReadonlyArray<{ name: string }> | undefined,
  handleId: string,
): number {
  if (!Array.isArray(fields)) return -1;
  const exact = fields.findIndex((f) => f?.name === handleId);
  if (exact >= 0) return exact;
  const { field, side } = splitHandleSide(handleId);
  if (side === null) return -1;
  return fields.findIndex((f) => f?.name === field);
}

/**
 * The side a handle id pins via its `-l`/`-r` suffix, or `null` when it pins none
 * — meaning the caller should fall back to the geometric side pick. Returns null
 * when the whole id names a field exactly (that's a normal handle, not a pin) or
 * when the stripped field doesn't exist.
 */
export function schemaSidePin(
  fields: ReadonlyArray<{ name: string }> | undefined,
  handleId: string | undefined,
): 'left' | 'right' | null {
  if (!Array.isArray(fields) || !handleId) return null;
  if (fields.some((f) => f?.name === handleId)) return null;
  const { field, side } = splitHandleSide(handleId);
  if (side === null) return null;
  return fields.some((f) => f?.name === field) ? side : null;
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
