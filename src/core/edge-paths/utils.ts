// ============================================================================
// Edge Path Utilities
//
// Forked from @xyflow/system (MIT License, Copyright 2019-2025 webkid GmbH)
// Pure functions: positions in → SVG path data + label position out.
// ============================================================================

import type { XYPosition } from '../types';

export interface EdgePathResult {
  /** SVG path `d` attribute */
  path: string;
  /** Suggested position for a label at the midpoint */
  labelPosition: XYPosition;
  /** X offset for centering a label */
  labelOffsetX: number;
  /** Y offset for centering a label */
  labelOffsetY: number;
}

/**
 * Build a rounded SVG bend through three consecutive waypoints.
 * Returns an `L…Q…` fragment (or just `L` if the points are collinear).
 */
export function getBend(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  radius: number,
): string {
  const dx1 = bx - ax;
  const dy1 = by - ay;
  const dx2 = cx - bx;
  const dy2 = cy - by;

  // If points are collinear, just draw a line
  if ((dx1 === 0 && dx2 === 0) || (dy1 === 0 && dy2 === 0)) {
    return `L${bx},${by}`;
  }

  // Clamp radius to half the minimum segment length
  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  const r = Math.min(radius, len1 / 2, len2 / 2);

  // Points on the two segments where the arc begins/ends
  const p1x = bx - (dx1 / len1) * r;
  const p1y = by - (dy1 / len1) * r;
  const p2x = bx + (dx2 / len2) * r;
  const p2y = by + (dy2 / len2) * r;

  return `L${p1x},${p1y} Q${bx},${by} ${p2x},${p2y}`;
}

/**
 * Calculate the center point of an edge for label placement.
 */
export function getEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}): { x: number; y: number; offsetX: number; offsetY: number } {
  const offsetX = Math.abs(targetX - sourceX) / 2;
  const offsetY = Math.abs(targetY - sourceY) / 2;

  return {
    x: (sourceX + targetX) / 2,
    y: (sourceY + targetY) / 2,
    offsetX,
    offsetY,
  };
}
