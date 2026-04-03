// ============================================================================
// alpinejs-flow — Alpine.js Plugin
//
// An Alpine.js plugin for building interactive node-based flowcharts and
// diagrams. Wraps d3-zoom/d3-drag for canvas interactions and provides
// declarative directives for nodes, edges, and connection handles.
//
// License: MIT
// Portions forked from @xyflow/system (MIT, Copyright 2019-2025 webkid GmbH)
// ============================================================================

import type { Alpine } from 'alpinejs';
import { setAlpine } from './plugin/alpine-ref';

// Plugin registrations
import { registerFlowCanvas } from './plugin/data/flow-canvas';
import { registerFlowNodeDirective } from './plugin/directives/flow-node';
import { registerFlowHandleDirective } from './plugin/directives/flow-handle';
import { registerFlowHandleValidateDirective } from './plugin/directives/flow-handle-validate';
import { registerFlowHandleLimitDirective } from './plugin/directives/flow-handle-limit';
import { registerFlowHandleConnectableDirective } from './plugin/directives/flow-handle-connectable';
import { registerFlowEdgeDirective } from './plugin/directives/flow-edge';
import { registerFlowResizerDirective } from './plugin/directives/flow-resizer';
import { registerFlowRotateDirective } from './plugin/directives/flow-rotate';
import { registerFlowDragHandleDirective } from './plugin/directives/flow-drag-handle';
import { registerFlowDraggableDirective } from './plugin/directives/flow-draggable';
import { registerFlowViewportDirective } from './plugin/directives/flow-viewport';
import { registerFlowPanelDirective } from './plugin/directives/flow-panel';
import { registerFlowNodeToolbarDirective } from './plugin/directives/flow-node-toolbar';
import { registerFlowContextMenuDirective } from './plugin/directives/flow-context-menu';
import { registerFlowAnimateDirective } from './plugin/directives/flow-animate';
import { registerFlowTimelineDirective } from './plugin/directives/flow-timeline';
import { registerFlowCollapseDirective } from './plugin/directives/flow-collapse';
import { registerFlowCondenseDirective } from './plugin/directives/flow-condense';
import { registerFlowRowSelectDirective } from './plugin/directives/flow-row-select';
import { registerFlowDetailDirective } from './plugin/directives/flow-detail';
import { registerFlowDevtoolsDirective } from './plugin/directives/flow-devtools';
import { registerFlowActionDirective } from './plugin/directives/flow-action';
import { registerFlowFilterDirective } from './plugin/directives/flow-filter';
import { registerFlowFollowDirective } from './plugin/directives/flow-follow';
import { registerFlowSnapshotDirective } from './plugin/directives/flow-snapshot';
import { registerFlowLoadingDirective } from './plugin/directives/flow-loading';
import { registerFlowEdgeToolbarDirective } from './plugin/directives/flow-edge-toolbar';
import { registerFlowMagic } from './plugin/magics/flow';
import { registerFlowStore } from './plugin/store';

const _registeredInstances = new WeakSet<object>();

/**
 * The Alpine.js plugin function.
 *
 * @example
 * ```ts
 * import Alpine from 'alpinejs';
 * import AlpineFlow from 'alpinejs-flow';
 *
 * Alpine.plugin(AlpineFlow);
 * Alpine.start();
 * ```
 */
export default function AlpineFlow(Alpine: Alpine) {
  if (_registeredInstances.has(Alpine)) return;
  _registeredInstances.add(Alpine);
  setAlpine(Alpine);

  // Store (global instance registry)
  registerFlowStore(Alpine);

  // Data components
  registerFlowCanvas(Alpine);

  // Directives
  registerFlowNodeDirective(Alpine);
  registerFlowHandleDirective(Alpine);
  registerFlowHandleValidateDirective(Alpine);
  registerFlowHandleLimitDirective(Alpine);
  registerFlowHandleConnectableDirective(Alpine);
  registerFlowEdgeDirective(Alpine);
  registerFlowResizerDirective(Alpine);
  registerFlowRotateDirective(Alpine);
  registerFlowDragHandleDirective(Alpine);
  registerFlowDraggableDirective(Alpine);
  registerFlowViewportDirective(Alpine);
  registerFlowPanelDirective(Alpine);
  registerFlowNodeToolbarDirective(Alpine);
  registerFlowContextMenuDirective(Alpine);
  registerFlowAnimateDirective(Alpine);
  registerFlowTimelineDirective(Alpine);
  registerFlowCollapseDirective(Alpine);
  registerFlowCondenseDirective(Alpine);
  registerFlowRowSelectDirective(Alpine);
  registerFlowDetailDirective(Alpine);
  registerFlowDevtoolsDirective(Alpine);
  registerFlowActionDirective(Alpine);
  registerFlowFilterDirective(Alpine);
  registerFlowFollowDirective(Alpine);
  registerFlowSnapshotDirective(Alpine);
  registerFlowLoadingDirective(Alpine);
  registerFlowEdgeToolbarDirective(Alpine);

  // Magics
  registerFlowMagic(Alpine);
}

// Re-export core utilities for advanced usage
export type {
  FlowNode,
  FlowEdge,
  Viewport,
  XYPosition,
  CoordinateExtent,
  FlowCanvasConfig,
  FlowInstance,
  Connection,
  ConnectionLineProps,
  HandlePosition,
  HandleType,
  EdgeType,
} from './core/types';

export type { MarkerType, MarkerConfig, CustomMarkerRenderer } from './core/markers';
export { registerMarker } from './core/markers';

export {
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStepPath,
  getStraightPath,
} from './core/edge-paths';

export { getNodesBounds, getViewportForBounds, getNodesInRect, getNodesFullyInRect } from './core/geometry';
export { getConnectedEdges, getOutgoers, getIncomers, areNodesConnected } from './core/graph';
export { ComputeEngine, type ComputeDefinition } from './core/compute';

export {
  getNodeIntersection,
  getEdgePosition,
  getFloatingEdgeParams,
  getSimpleFloatingPosition,
} from './core/floating-edge';

// Layout engines are exposed as type re-exports only — import the layout
// modules directly (e.g. `import { computeDagreLayout } from 'alpinejs-flow/core/layout/dagre'`)
// or use the canvas `layout()`, `forceLayout()`, `treeLayout()`, `elkLayout()` methods
// which lazy-load the engines automatically.
export type { DagreDirection, DagreLayoutOptions } from './core/layout/dagre';
export type { ForceLayoutOptions } from './core/layout/force';
export type { ElkAlgorithm, ElkDirection, ElkLayoutOptions } from './core/layout/elk';
export type { HierarchyLayoutType, HierarchyDirection, HierarchyLayoutOptions } from './core/layout/hierarchy';

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
} from './core/sub-flow';

// Path functions for curved node motion (followPath)
export type { PathFunction, OrbitConfig, WaveConfig, AlongConfig, PendulumConfig, DriftConfig } from './animate/paths';
export { orbit, wave, along, pendulum, drift, stagger } from './animate/paths';

export { FlowHistory, type HistorySnapshot } from './core/history';
export type { ResizeDirection, ResizeConstraints } from './core/resize';
export type { ControlsPanelInstance } from './core/controls-panel';
export type { SelectionBoxInstance } from './core/selection-box';
export type { LassoInstance } from './core/lasso';
export { pointInPolygon, polygonIntersectsAABB, getNodesInPolygon, getNodesFullyInPolygon } from './core/lasso-hit-test';
export type { AutoPanInstance } from './core/auto-pan';
export { getAutoPanDelta } from './core/auto-pan';
export { computeRenderPlan, type RenderPlan, type RenderPlanConfig, type RenderPlanNode, type RenderPlanEdge } from './core/render-plan';

export type { KeyboardShortcuts, KeyCode } from './core/keyboard-shortcuts';
export { SHORTCUT_DEFAULTS, resolveShortcuts, matchesKey, matchesModifier } from './core/keyboard-shortcuts';

export type { ChildValidation, ChildValidationResult, ChildValidationFailDetail } from './core/types';
export { resolveChildValidation, validateChildAdd, validateChildRemove, computeValidationErrors } from './core/child-validation';

export { isDraggable, isDeletable, isConnectable, isSelectable, isResizable } from './core/node-flags';

