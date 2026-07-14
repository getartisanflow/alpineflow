// ============================================================================
// Schema Handle Geometry
//
// Pure math for locating a schema field row's handle center from state alone
// — no DOM measurement. Schema rows are uniform, so once header/row/inset
// metrics are known (see SchemaMetrics), every handle's position is
// arithmetic. Consumed by edge code in place of getBoundingClientRect calls.
// ============================================================================

import type { XYPosition } from './types';
import type { SchemaMetrics } from '../plugin/data/canvas-context';

/** Resolved center of a schema field row's handle, in flow space. */
export interface SchemaHandlePoint {
  x: number;
  y: number;
  position: 'left' | 'right';
}

/**
 * Handle center for a schema field row, derived purely from state.
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
  handleId: string,
  side: 'left' | 'right',
  metrics: SchemaMetrics,
): SchemaHandlePoint | null {
  const fields = node.data?.fields;
  if (!Array.isArray(fields)) return null;

  // Exact match first — a field genuinely named e.g. `email-r` must still
  // resolve. Only retry with a stripped `-l`/`-r` suffix if that misses.
  let idx = fields.findIndex((f) => f.name === handleId);
  if (idx === -1) {
    const stripped = handleId.replace(/-[lr]$/, '');
    idx = fields.findIndex((f) => f.name === stripped);
  }
  if (idx === -1) return null;

  const { width, height } = node.dimensions ?? {};
  if (typeof width !== 'number' || !Number.isFinite(width)) return null;
  if (typeof height !== 'number' || !Number.isFinite(height)) return null;

  const { headerHeight, rowHeight, insetLeft, insetRight, insetTop } = metrics;
  if (
    !Number.isFinite(headerHeight) ||
    !Number.isFinite(rowHeight) ||
    !Number.isFinite(insetLeft) ||
    !Number.isFinite(insetRight) ||
    !Number.isFinite(insetTop)
  ) {
    return null;
  }

  const y = absolutePosition.y + insetTop + headerHeight + idx * rowHeight + rowHeight / 2;
  const x =
    side === 'left'
      ? absolutePosition.x + insetLeft
      : absolutePosition.x + width - insetRight;

  return { x, y, position: side };
}
