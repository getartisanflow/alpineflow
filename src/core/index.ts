// Core types
export type {
  XYPosition,
  Viewport,
  Rect,
  Dimensions,
  CoordinateExtent,
  FlowNode,
  FlowEdge,
  EdgeType,
  HandleType,
  HandlePosition,
  HandleConfig,
  Connection,
  PendingConnection,
  FlowEvents,
  FlowCanvasConfig,
  FlowInstance,
} from './types';

// Type guard functions (runtime values, not type-only)
export { isNode, isEdge } from './types';

// Edge path generators
export {
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStepPath,
  getStraightPath,
  getEdgeCenter,
  type EdgePathResult,
} from './edge-paths';

// Pan/zoom
export { createPanZoom, type PanZoomOptions, type PanZoomInstance } from './pan-zoom';

// Drag
export { createDrag, type DragOptions, type DragInstance } from './drag';

// Connections
export { isPointInHandle, findClosestHandle, isValidConnection, type HandleBounds } from './connections';

// Graph utilities
export {
  getConnectedEdges,
  getConnectedEdgesForNodes,
  getOutgoers,
  getIncomers,
  areNodesConnected,
  wouldCreateCycle,
} from './graph';

// Geometry
export {
  screenToFlowPosition,
  flowToScreenPosition,
  getNodesBounds,
  getViewportForBounds,
} from './geometry';

// Resize
export {
  computeResize,
  DEFAULT_RESIZE_CONSTRAINTS,
  type ResizeDirection,
  type ResizeConstraints,
  type ResizeResult,
} from './resize';

// Floating edges
export {
  getNodeIntersection,
  getEdgePosition,
  getFloatingEdgeParams,
  getSimpleFloatingPosition,
} from './floating-edge';

// Sub-flow utilities
export {
  buildNodeMap,
  getAbsolutePosition,
  toAbsoluteNode,
  toAbsoluteNodes,
  getDescendantIds,
  sortNodesTopological,
  computeZIndex,
  clampToExtent,
  clampToParent,
  expandParentToFitChild,
} from './sub-flow';

// History
export { FlowHistory, type HistorySnapshot } from './history';

// Intersection detection
export {
  getNodeRect,
  rectsIntersect,
  getIntersectingNodes,
  isNodeIntersecting,
  clampToAvoidOverlap,
} from './intersection';

// Color mode
export { createColorMode } from './color-mode';
export type { ColorMode, ColorModeHandle } from './color-mode';

// Debug
export { debug, setDebugEnabled, isDebugEnabled } from './debug';

// Markers
export {
  normalizeMarker,
  getMarkerId,
  getMarkerSvg,
  registerMarker,
  type MarkerType,
  type MarkerConfig,
  type CustomMarkerRenderer,
} from './markers';
