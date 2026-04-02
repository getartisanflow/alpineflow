// ============================================================================
// Interpolators — Property-specific value interpolation
//
// Provides numeric lerp, color interpolation (via d3-interpolateRgb), and
// style string parsing/interpolation for animated property transitions.
// ============================================================================

import { interpolateRgb } from 'd3-interpolate';
import type { Viewport } from '../core/types';

/** Linear interpolation between two numbers. */
export function lerpNumber(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Interpolate between two CSS color strings using d3-interpolateRgb. */
export function interpolateColor(a: string, b: string, t: number): string {
  return interpolateRgb(a, b)(t);
}

/** Parse a style string ("key: value; ...") into a Record, or pass through a Record. */
export function parseStyle(style: string | Record<string, string>): Record<string, string> {
  if (typeof style !== 'string') {
    return style;
  }
  if (!style.trim()) {
    return {};
  }
  const result: Record<string, string> = {};
  for (const part of style.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    result[key] = value;
  }
  return result;
}

/** Regex matching a number optionally followed by a CSS unit (px, em, rem, %, etc.) */
const NUMERIC_RE = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/;

/** Regex to detect CSS color values. */
const COLOR_RE = /^(#|rgb|hsl)/;

/** Interpolate between two parsed style records, per-property. */
export function interpolateStyle(
  from: Record<string, string>,
  to: Record<string, string>,
  t: number,
): Record<string, string> {
  const result: Record<string, string> = {};
  const allKeys = new Set([...Object.keys(from), ...Object.keys(to)]);

  for (const key of allKeys) {
    const a = from[key];
    const b = to[key];

    // Property only in one side — snap to target
    if (a === undefined) {
      result[key] = b;
      continue;
    }
    if (b === undefined) {
      result[key] = a;
      continue;
    }

    // Try numeric interpolation
    const matchA = NUMERIC_RE.exec(a);
    const matchB = NUMERIC_RE.exec(b);
    if (matchA && matchB) {
      const numA = parseFloat(matchA[1]);
      const numB = parseFloat(matchB[1]);
      const unit = matchB[2] ?? '';
      const lerped = lerpNumber(numA, numB, t);
      result[key] = unit ? `${lerped}${unit}` : String(lerped);
      continue;
    }

    // Try color interpolation
    if (COLOR_RE.test(a) && COLOR_RE.test(b)) {
      result[key] = interpolateColor(a, b, t);
      continue;
    }

    // Non-interpolatable: instant swap at t >= 0.5
    result[key] = t < 0.5 ? a : b;
  }

  return result;
}

/** Interpolate between two viewports (x, y, zoom) with optional zoom clamping. */
export function lerpViewport(
  from: Viewport,
  to: Viewport,
  t: number,
  clamp?: { minZoom?: number; maxZoom?: number },
): Viewport {
  let zoom = lerpNumber(from.zoom, to.zoom, t);
  if (clamp?.minZoom !== undefined) zoom = Math.max(zoom, clamp.minZoom);
  if (clamp?.maxZoom !== undefined) zoom = Math.min(zoom, clamp.maxZoom);
  return {
    x: lerpNumber(from.x, to.x, t),
    y: lerpNumber(from.y, to.y, t),
    zoom,
  };
}
