// ============================================================================
// Bezier Edge Paths
//
// Forked from @xyflow/system (MIT License, Copyright 2019-2025 webkid GmbH)
// Generates cubic bezier SVG paths between two points with handle-aware
// control point calculation.
// ============================================================================

import type { HandlePosition } from '../types';
import { getEdgeCenter, type EdgePathResult } from './utils';

interface BezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: HandlePosition;
  targetX: number;
  targetY: number;
  targetPosition?: HandlePosition;
  curvature?: number;
}

/**
 * Calculate control point offsets based on handle positions and curvature.
 */
function calculateControlOffset(distance: number, curvature: number): number {
  if (distance >= 0) {
    return 0.5 * distance;
  }
  return curvature * 25 * Math.sqrt(-distance);
}

function getControlPoints({
  sourceX,
  sourceY,
  sourcePosition = 'bottom',
  targetX,
  targetY,
  targetPosition = 'top',
  curvature = 0.25,
}: BezierPathParams): [number, number, number, number] {
  const isHorizontalSource = sourcePosition === 'left' || sourcePosition === 'right';
  const isHorizontalTarget = targetPosition === 'left' || targetPosition === 'right';

  const sourceControlX = isHorizontalSource
    ? sourceX + (sourcePosition === 'right' ? 1 : -1) * calculateControlOffset(
        sourcePosition === 'right' ? targetX - sourceX : sourceX - targetX,
        curvature,
      )
    : sourceX;

  const sourceControlY = isHorizontalSource
    ? sourceY
    : sourceY + (sourcePosition === 'bottom' ? 1 : -1) * calculateControlOffset(
        sourcePosition === 'bottom' ? targetY - sourceY : sourceY - targetY,
        curvature,
      );

  const targetControlX = isHorizontalTarget
    ? targetX + (targetPosition === 'right' ? 1 : -1) * calculateControlOffset(
        targetPosition === 'right' ? sourceX - targetX : targetX - sourceX,
        curvature,
      )
    : targetX;

  const targetControlY = isHorizontalTarget
    ? targetY
    : targetY + (targetPosition === 'bottom' ? 1 : -1) * calculateControlOffset(
        targetPosition === 'bottom' ? sourceY - targetY : targetY - sourceY,
        curvature,
      );

  return [sourceControlX, sourceControlY, targetControlX, targetControlY];
}

/**
 * Generate a cubic bezier edge path with handle-aware control points.
 */
export function getBezierPath(params: BezierPathParams): EdgePathResult {
  const { sourceX, sourceY, targetX, targetY } = params;
  const [sControlX, sControlY, tControlX, tControlY] = getControlPoints(params);

  const path = `M${sourceX},${sourceY} C${sControlX},${sControlY} ${tControlX},${tControlY} ${targetX},${targetY}`;
  const { x, y, offsetX, offsetY } = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

  return {
    path,
    labelPosition: { x, y },
    labelOffsetX: offsetX,
    labelOffsetY: offsetY,
  };
}

/**
 * Generate a simple cubic bezier where control points are always at the
 * midpoint between source and target (no handle-position awareness).
 */
export function getSimpleBezierPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}): EdgePathResult {
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  const path = `M${sourceX},${sourceY} C${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
  const { x, y, offsetX, offsetY } = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

  return {
    path,
    labelPosition: { x, y },
    labelOffsetX: offsetX,
    labelOffsetY: offsetY,
  };
}
