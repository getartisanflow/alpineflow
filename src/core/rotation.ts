// ============================================================================
// Rotation Utilities
//
// Pure math for rotating points around a center. Used by edge-utils and
// floating-edge for geometry-aware handle rotation.
// ============================================================================

/**
 * Rotate a point (px, py) around a center (cx, cy) by the given angle in degrees.
 * Returns the rotated coordinates.
 */
export function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  degrees: number,
): { x: number; y: number } {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dy = py - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}
