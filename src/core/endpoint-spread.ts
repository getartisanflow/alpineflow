// ============================================================================
// Endpoint Spread (WS-2)
//
// Pure geometry for fanning edges that share an endpoint handle across that
// handle's row extent. Never grows the extent — a fan wider than `extent`
// condenses to fit. No DOM, no Alpine: the lane INDEX comes from the canvas
// grouping pass; this file only turns (index, count, extent, spacing) into a
// perpendicular offset and applies it on the correct axis.
// ============================================================================

import type { HandlePosition } from './types';

/** Default px gap between adjacent lanes when spacing isn't specified. */
export const DEFAULT_SPREAD_SPACING = 5;

/** Resolve the desired lane spacing from the config value; null = disabled. */
export function resolveSpreadSpacing(
  value: boolean | { spacing?: number } | undefined,
): number | null {
  if (!value) return null;
  if (value === true) return DEFAULT_SPREAD_SPACING;
  return value.spacing ?? DEFAULT_SPREAD_SPACING;
}

/**
 * Signed perpendicular offset for lane `index` of a `count`-edge fan, centred on
 * 0 and clamped so the whole fan spans at most `extent`. `count <= 1` → 0, so a
 * handle with a single edge is never moved.
 */
export function laneOffset(index: number, count: number, extent: number, spacing: number): number {
  if (count <= 1) return 0;
  const span = Math.min((count - 1) * spacing, Math.max(0, extent));
  const effSpacing = span / (count - 1);
  return (index - (count - 1) / 2) * effSpacing;
}

/** Apply a lane offset perpendicular to the handle side (L/R fan vertically, T/B horizontally). */
export function applyLaneOffset(
  coords: { x: number; y: number },
  side: HandlePosition,
  offset: number,
): { x: number; y: number } {
  return side === 'left' || side === 'right'
    ? { x: coords.x, y: coords.y + offset }
    : { x: coords.x + offset, y: coords.y };
}
