// ============================================================================
// Resize Utilities
//
// Pure functions for computing node resize operations. Handles direction-aware
// delta application, constraint clamping, and position adjustment for
// top/left handles where position shifts inversely with dimension growth.
// ============================================================================

import type { XYPosition, Dimensions } from './types';

/** Which edge or corner is being dragged */
export type ResizeDirection =
  | 'top-left' | 'top' | 'top-right'
  | 'left' | 'right'
  | 'bottom-left' | 'bottom' | 'bottom-right';

/** Min/max size constraints for resizable nodes */
export interface ResizeConstraints {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

export const DEFAULT_RESIZE_CONSTRAINTS: ResizeConstraints = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: Infinity,
  maxHeight: Infinity,
};

/** Result of a resize computation */
export interface ResizeResult {
  position: XYPosition;
  dimensions: Dimensions;
}

/**
 * Compute the new position and dimensions after a resize drag.
 *
 * For left/top handles, position decreases by the same amount dimensions
 * increase. The actual delta is derived after clamping to prevent position
 * drift when hitting constraint boundaries.
 *
 * @param direction - Which handle is being dragged
 * @param delta - Mouse movement in flow coordinates since drag start
 * @param startPosition - Node position at drag start
 * @param startDimensions - Node dimensions at drag start
 * @param constraints - Min/max size constraints
 * @param snapToGrid - Optional grid snapping [gridX, gridY]
 */
export function computeResize(
  direction: ResizeDirection,
  delta: XYPosition,
  startPosition: XYPosition,
  startDimensions: Dimensions,
  constraints: ResizeConstraints,
  snapToGrid?: false | [number, number],
): ResizeResult {
  const { minWidth, minHeight, maxWidth, maxHeight } = constraints;

  const affectsLeft = direction.includes('left');
  const affectsRight = direction.includes('right');
  const affectsTop = direction.includes('top');
  const affectsBottom = direction.includes('bottom');

  // Compute raw new width
  let newWidth = startDimensions.width;
  if (affectsRight) {
    newWidth = startDimensions.width + delta.x;
  } else if (affectsLeft) {
    newWidth = startDimensions.width - delta.x;
  }

  // Compute raw new height
  let newHeight = startDimensions.height;
  if (affectsBottom) {
    newHeight = startDimensions.height + delta.y;
  } else if (affectsTop) {
    newHeight = startDimensions.height - delta.y;
  }

  // Clamp to constraints
  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
  newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

  // Snap dimensions to grid if configured
  if (snapToGrid) {
    newWidth = snapToGrid[0] * Math.round(newWidth / snapToGrid[0]);
    newHeight = snapToGrid[1] * Math.round(newHeight / snapToGrid[1]);
    // Re-clamp after snapping
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
  }

  // Compute actual deltas (after clamping) to derive position shift
  const actualDeltaW = newWidth - startDimensions.width;
  const actualDeltaH = newHeight - startDimensions.height;

  // Position only shifts for left/top handles
  const newX = affectsLeft ? startPosition.x - actualDeltaW : startPosition.x;
  const newY = affectsTop ? startPosition.y - actualDeltaH : startPosition.y;

  return {
    position: { x: newX, y: newY },
    dimensions: { width: newWidth, height: newHeight },
  };
}
