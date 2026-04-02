// ============================================================================
// Straight Edge Path
//
// Forked from @xyflow/system (MIT License, Copyright 2019-2025 webkid GmbH)
// A simple straight line between source and target.
// ============================================================================

import { getEdgeCenter, type EdgePathResult } from './utils';

interface StraightPathParams {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

/**
 * Generate a straight line edge path.
 */
export function getStraightPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: StraightPathParams): EdgePathResult {
  const path = `M${sourceX},${sourceY} L${targetX},${targetY}`;
  const { x, y, offsetX, offsetY } = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

  return {
    path,
    labelPosition: { x, y },
    labelOffsetX: offsetX,
    labelOffsetY: offsetY,
  };
}
