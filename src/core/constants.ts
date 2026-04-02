// ============================================================================
// Shared Constants
//
// Centralizes magic values used across multiple files so they stay consistent
// and can be tuned from a single location.
// ============================================================================

/** Stroke color applied to selected edges and active connection lines. */
export const CONNECTION_ACTIVE_COLOR = '#64748b';

/** Default stroke color for edge paths. */
export const DEFAULT_STROKE_COLOR = '#d4d4d8';

/** Stroke color applied to invalid connection lines. */
export const CONNECTION_INVALID_COLOR = '#ef4444';

/** Stroke width for temporary connection drag lines. */
export const TEMP_LINE_STROKE_WIDTH = '2';

/** Dash pattern for temporary connection drag lines. */
export const TEMP_LINE_DASH_PATTERN = '6 3';

/** Multiplier for zoom-in / zoom-out steps. */
export const ZOOM_STEP_FACTOR = 1.2;

/** Default padding ratio for fitView and layout operations. */
export const DEFAULT_FIT_PADDING = 0.2;

/** Minimum pointer movement (in px) before a click is treated as a drag. */
export const DRAG_THRESHOLD = 5;

/** Default snap radius (in flow-space px) for edge reconnection hit-detection. */
export const DEFAULT_RECONNECT_SNAP_RADIUS = 25;
