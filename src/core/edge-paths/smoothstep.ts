// ============================================================================
// Smoothstep Edge Path
//
// Forked from @xyflow/system (MIT License, Copyright 2019-2025 webkid GmbH)
// Generates paths with rounded right-angle bends, routing edges around nodes
// based on handle positions.
// ============================================================================

import type { HandlePosition } from '../types';
import { getBend, getEdgeCenter, type EdgePathResult } from './utils';

interface SmoothStepPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: HandlePosition;
  targetX: number;
  targetY: number;
  targetPosition?: HandlePosition;
  borderRadius?: number;
  /** Minimum offset from node before the first bend */
  offset?: number;
}

function getDirection(position: HandlePosition): { x: number; y: number } {
  switch (position) {
    case 'top':
    case 'top-left':
    case 'top-right':
      return { x: 0, y: -1 };
    case 'bottom':
    case 'bottom-left':
    case 'bottom-right':
      return { x: 0, y: 1 };
    case 'left':
      return { x: -1, y: 0 };
    case 'right':
      return { x: 1, y: 0 };
  }
}

function getPoints(
  sourceX: number,
  sourceY: number,
  sourcePosition: HandlePosition,
  targetX: number,
  targetY: number,
  targetPosition: HandlePosition,
  offset: number,
): [number, number][] {
  const sourceDir = getDirection(sourcePosition);
  const targetDir = getDirection(targetPosition);

  const sourceOffsetX = sourceX + sourceDir.x * offset;
  const sourceOffsetY = sourceY + sourceDir.y * offset;
  const targetOffsetX = targetX + targetDir.x * offset;
  const targetOffsetY = targetY + targetDir.y * offset;

  const isSourceHorizontal = sourcePosition === 'left' || sourcePosition === 'right';
  const isTargetHorizontal = targetPosition === 'left' || targetPosition === 'right';

  // Both handles on same axis → simple L-bend or straight with one midpoint
  if (isSourceHorizontal === isTargetHorizontal) {
    const midX = (sourceOffsetX + targetOffsetX) / 2;
    const midY = (sourceOffsetY + targetOffsetY) / 2;

    if (isSourceHorizontal) {
      return [
        [sourceOffsetX, sourceY],
        [midX, sourceY],
        [midX, targetY],
        [targetOffsetX, targetY],
      ];
    }

    return [
      [sourceX, sourceOffsetY],
      [sourceX, midY],
      [targetX, midY],
      [targetX, targetOffsetY],
    ];
  }

  // Different axes → L-bend through intersection
  if (isSourceHorizontal) {
    return [
      [sourceOffsetX, sourceY],
      [targetX, sourceY],
      [targetX, targetOffsetY],
    ];
  }

  return [
    [sourceX, sourceOffsetY],
    [sourceX, targetY],
    [targetOffsetX, targetY],
  ];
}

/**
 * Generate a smoothstep (rounded right-angle) edge path.
 */
export function getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = 'bottom',
  targetX,
  targetY,
  targetPosition = 'top',
  borderRadius = 5,
  offset = 10,
}: SmoothStepPathParams): EdgePathResult {
  const points = getPoints(
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    offset,
  );

  let path = `M${sourceX},${sourceY}`;

  for (let i = 0; i < points.length; i++) {
    const [px, py] = points[i];

    if (borderRadius > 0 && i > 0 && i < points.length - 1) {
      const [prevX, prevY] = i === 1 ? [sourceX, sourceY] : points[i - 1];
      const [nextX, nextY] = points[i + 1];
      path += ` ${getBend(prevX, prevY, px, py, nextX, nextY, borderRadius)}`;
    } else {
      path += ` L${px},${py}`;
    }
  }

  path += ` L${targetX},${targetY}`;

  const { x, y, offsetX, offsetY } = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

  return {
    path,
    labelPosition: { x, y },
    labelOffsetX: offsetX,
    labelOffsetY: offsetY,
  };
}

/**
 * Generate a step (non-rounded right-angle) edge path.
 */
export function getStepPath(params: Omit<SmoothStepPathParams, 'borderRadius'>): EdgePathResult {
  return getSmoothStepPath({ ...params, borderRadius: 0 });
}
