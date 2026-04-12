// ============================================================================
// alpinejs-flow — Core Types
//
// These define the public data contracts for the plugin. Intentionally simpler
// than xyflow's heavily generic types — we use plain objects that play nicely
// with Alpine's reactive proxy model.
// ============================================================================

import type { EasingName } from '../animate/easing';
import type { PathFunction } from '../animate/paths';
import type { CollabConfig, CollabInstance } from '../collab/types';
import type { FlowGroup } from '../animate/flow-group';
import type { Transaction } from '../animate/transaction';
import type { MotionConfig } from '../animate/motion/types';

/** 2D coordinate */
export interface XYPosition {
  x: number;
  y: number;
}

/** Viewport state: pan offset + zoom level */
export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

/** Bounding box for nodes/viewport calculations */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Dimensions of a measured DOM element */
export interface Dimensions {
  width: number;
  height: number;
}

/** Coordinate extent: [[minX, minY], [maxX, maxY]] */
export type CoordinateExtent = [[number, number], [number, number]];

// ─── Nodes ──────────────────────────────────────────────────────────────────

/** Row filter: preset name or custom predicate. */
export type RowFilter = 'all' | 'connected' | 'unconnected' | ((row: any) => boolean);

export interface FlowNode<T = Record<string, any>> {
  id: string;
  position: XYPosition;
  data: T;

  /** Node type — maps to a rendering template. Default: 'default' */
  type?: string;

  /** Width/height, populated after DOM measurement */
  dimensions?: Dimensions;

  /** Minimum width/height constraints. Applied during layout and resize. */
  minDimensions?: Partial<Dimensions>;

  /** Maximum width/height constraints. Applied during layout and resize. */
  maxDimensions?: Partial<Dimensions>;

  /** Anchor point on the node that `position` refers to.
   *  [0,0] = top-left (default), [0.5, 0.5] = center, [1,1] = bottom-right. */
  nodeOrigin?: [number, number];

  /** Can this node be dragged? Default: true */
  draggable?: boolean;

  /** Can edges connect to this node? Default: true */
  connectable?: boolean;

  /** Handle visibility mode. Default: 'visible'.
   *  'hidden' hides all handles, 'hover' shows on node hover,
   *  'select' shows when node is selected. */
  handles?: 'visible' | 'hidden' | 'hover' | 'select';

  /** Can this node be selected? Default: true */
  selectable?: boolean;

  /** Can this node be resized via x-flow-resizer? Default: true */
  resizable?: boolean;

  /** Can this node receive keyboard focus? Default: follows `nodesFocusable` config (true). */
  focusable?: boolean;

  /** Override the ARIA role for this node. Default: 'group' */
  ariaRole?: string;

  /** Override the auto-generated aria-label for this node. */
  ariaLabel?: string;

  /** Arbitrary DOM attributes to apply to this node's element (e.g. data-*, aria-describedby). */
  domAttributes?: Record<string, string>;

  /** Hide this node from rendering. Connected edges are also hidden. Default: false */
  hidden?: boolean;

  /** Whether this node's connected nodes are collapsed (hidden). Default: false */
  collapsed?: boolean;

  /** Whether this node's internal rows are condensed (summary view). Default: false */
  condensed?: boolean;

  /** Filter which rows are visible. Preset: 'all' (default), 'connected', 'unconnected'.
   *  Custom: a predicate `(row) => boolean` — rows returning false are hidden. */
  rowFilter?: RowFilter;

  /** Whether this node is excluded by a node-level filter. CSS-driven visibility. */
  filtered?: boolean;

  /** Dimensions to use when this group node is collapsed.
   *  Only meaningful on group nodes. Default: { width: 150, height: 60 } */
  collapsedDimensions?: Dimensions;

  /** Can this node be deleted via keyboard (Delete/Backspace)? Default: true */
  deletable?: boolean;

  /** Fully freeze this node — prevents drag, delete, connect, reconnect,
   *  select, and resize. Shows dashed border (.flow-node-locked).
   *  Individual flags (draggable, deletable, etc.) override locked when
   *  set explicitly. Default: false */
  locked?: boolean;

  /** When reconnectOnDelete is enabled globally, set to false to skip
   *  reconnection for this node. Default: true (inherits canvas config). */
  reconnectOnDelete?: boolean;

  /** Is this node currently selected? */
  selected?: boolean;

  /** Optional CSS class(es) */
  class?: string;

  /** Optional inline styles */
  style?: string | Record<string, string>;

  /** Parent node ID — position becomes relative to parent's top-left corner */
  parentId?: string;

  /** Clamp child within parent bounds during drag, or provide coordinate boundaries.
   *  'parent' is only used when parentId is set. CoordinateExtent works for any node. */
  extent?: 'parent' | CoordinateExtent;

  /** Grow parent dimensions when child reaches edge. Only used when parentId is set. */
  expandParent?: boolean;

  /** Explicit z-index. For children: computed = parentZ + 1 + zIndex */
  zIndex?: number;

  /** Default position for source handles. Handles without a position modifier inherit this. */
  sourcePosition?: HandlePosition;

  /** Default position for target handles. Handles without a position modifier inherit this. */
  targetPosition?: HandlePosition;

  /** Node shape variant. Applies shape CSS class and shape-aware edge connections. */
  shape?: NodeShape | string;

  /** Rotation angle in degrees. CSS transform applied by x-flow-node. Default: 0 */
  rotation?: number;

  /** When true, this node accepts other nodes dropped onto it as children. */
  droppable?: boolean;

  /**
   * Optional predicate to filter which nodes may be dropped into this node.
   * Called with the dragged node during drop-target detection. If it returns
   * false the node is skipped as a target. Works with both `droppable` and
   * `childLayout` nodes.
   */
  acceptsDrop?: (node: FlowNode) => boolean;

  /** Opt-in layout for this node's children. Implies preventChildEscape: true.
   *  Children are auto-arranged and the parent auto-sizes to fit. */
  childLayout?: ChildLayout;

  /** Sort order within a layout parent. Lower = first. Auto-assigned on drop. */
  order?: number;

  /** Current child validation errors (populated by _recomputeChildValidation). */
  _validationErrors?: string[];
}

// ─── Child Layout ────────────────────────────────────────────────────────────

/** Configuration for automatic child arrangement within a parent node. */
export interface ChildLayout {
  /** Arrangement direction. */
  direction: 'vertical' | 'horizontal' | 'grid';

  /** How children stretch to fill the parent.
   *  Default: 'width' for vertical, 'height' for horizontal, 'both' for grid. */
  stretch?: 'none' | 'width' | 'height' | 'both';

  /** Space between children in px. Default: 8 */
  gap?: number;

  /** Inner padding of the parent in px. Default: 12 */
  padding?: number;

  /** Extra top offset for a parent label/header in px. Default: 0 (auto 30 when parent has data.label) */
  headerHeight?: number;

  /** Grid-only: number of columns. Default: 2 */
  columns?: number;

  /** Swap threshold for drag-to-reorder (0–1), inspired by SortableJS.
   *  Controls how far past a sibling the dragged node must move before
   *  swapping. Uses directional inversion so both up/down (or left/right)
   *  require the same penetration fraction. 0.5 = midpoint. Default: 0.5
   *  @see https://github.com/SortableJS/Sortable/wiki/Swap-Thresholds-and-Direction */
  swapThreshold?: number;
}

// ─── Child Validation ───────────────────────────────────────────────────────

/** Validation result from a child operation check. */
export interface ChildValidationResult {
  valid: boolean;
  rule?: string;
  message?: string;
}

/** Validation rules for parent nodes constraining their children. */
export interface ChildValidation {
  /** Minimum number of children. Parent is invalid below this count. */
  minChildren?: number;

  /** Maximum number of children. Adding beyond this count is rejected. */
  maxChildren?: number;

  /** Shorthand for minChildren: 1. Parent is invalid when empty. */
  requiredChildren?: boolean;

  /** Whitelist of allowed child node types. Unlisted types are rejected. */
  allowedChildTypes?: string[];

  /** Prevent children from being dragged out of this parent. */
  preventChildEscape?: boolean;

  /** Per-type min/max constraints. Keys are node type strings. */
  childTypeConstraints?: Record<string, { min?: number; max?: number }>;

  /** Custom validator. Return true to allow, or a string error message to reject. */
  validateChild?: (child: FlowNode, siblings: FlowNode[]) => boolean | string;
}

/** Detail passed to onChildValidationFail callback. */
export interface ChildValidationFailDetail {
  parent: FlowNode;
  child: FlowNode;
  operation: 'add' | 'remove' | 'move-in' | 'move-out';
  rule: string;
  message: string;
}

// ─── Edges ──────────────────────────────────────────────────────────────────

export type EdgeType = 'bezier' | 'smoothstep' | 'straight' | 'floating' | 'orthogonal' | 'avoidant' | 'editable';

/** Edge animation mode */
export type EdgeAnimationMode = 'none' | 'dash' | 'pulse' | 'dot';

import type { MarkerType, MarkerConfig } from './markers';

/** Two-color linear gradient for edge strokes. */
export interface EdgeGradient {
  from: string;
  to: string;
}

export interface FlowEdge<T = Record<string, any>> {
  id: string;
  source: string;
  target: string;

  /** Which handle on the source node (default: 'source') */
  sourceHandle?: string;

  /** Which handle on the target node (default: 'target') */
  targetHandle?: string;

  /** Edge path type. Default: 'bezier'. Custom strings are looked up in edgeTypes registry. */
  type?: EdgeType | (string & {});

  /** Path rendering style for floating edges. Only used when type is 'floating'. Default: 'bezier' */
  pathType?: 'bezier' | 'smoothstep' | 'straight';

  /** Whether/how this edge is animated. true or 'dash' for scrolling dashes,
   *  'pulse' for opacity breathing, 'dot' for traveling circle. Default: false */
  animated?: boolean | EdgeAnimationMode;

  /** Animation cycle duration (CSS time value, e.g. '1s', '300ms').
   *  Overrides the CSS variable for this edge. */
  animationDuration?: string;

  /** Is this edge currently selected? */
  selected?: boolean;

  /** Can this edge be reconnected by dragging its endpoints? Default: true.
   *  Set to 'source' or 'target' to allow only one end to be dragged. */
  reconnectable?: boolean | 'source' | 'target';

  /** Hide this edge from rendering. Default: false */
  hidden?: boolean;

  /** Can this edge be deleted via keyboard (Delete/Backspace)? Default: true */
  deletable?: boolean;

  /** Can this edge receive keyboard focus? Default: follows `edgesFocusable` config (true). */
  focusable?: boolean;

  /** Override the ARIA role for this edge. Default: 'group' */
  ariaRole?: string;

  /** Override the auto-generated aria-label for this edge. */
  ariaLabel?: string;

  /** Arbitrary DOM attributes to apply to this edge's element (e.g. data-*, aria-describedby). */
  domAttributes?: Record<string, string>;

  /** Arbitrary data attached to the edge */
  data?: T;

  /** When labels become visible. 'always' (default) = always shown, 'hover' = on hover or
   *  when selected, 'selected' = only when selected. Applies to all labels (center, start, end). */
  labelVisibility?: 'always' | 'hover' | 'selected';

  /** Optional label displayed on the edge */
  label?: string;

  /** Position of the center label along the path (0 = source, 1 = target). Default: 0.5 */
  labelPosition?: number;

  /** Optional label displayed near the source end of the edge */
  labelStart?: string;

  /** Offset along edge path in flow coordinates (scales with zoom). Default: 30 */
  labelStartOffset?: number;

  /** Optional label displayed near the target end of the edge */
  labelEnd?: string;

  /** Offset along edge path in flow coordinates (scales with zoom). Default: 30 */
  labelEndOffset?: number;

  /** SVG marker at the start of the edge (arrowhead, etc.) */
  markerStart?: MarkerType | MarkerConfig;

  /** SVG marker at the end of the edge (arrowhead, etc.) */
  markerEnd?: MarkerType | MarkerConfig;

  /**
   * Stroke color. Accepts a solid color string or a gradient object.
   * When omitted, CSS rules apply (default via --flow-edge-stroke).
   *
   * @example
   * color: '#ef4444'                          // solid red
   * color: { from: '#22c55e', to: '#ef4444' } // green-to-red gradient
   *
   * // TODO(future): Radial gradients — { type: 'radial', from, to }
   * // TODO(future): Multi-stop gradients — array of { offset, color }
   * // TODO(future): Path-following gradients — gradient curves along edge path
   */
  color?: string | EdgeGradient;

  /** Direction of gradient color flow. Only applies when `color` is an EdgeGradient object. Default: 'source-target'. */
  gradientDirection?: 'source-target' | 'target-source';

  /** Visible stroke width in SVG units. Default: 1.5 */
  strokeWidth?: number;

  /** Invisible hit area width for click/hover detection (SVG units). Default: 20 */
  interactionWidth?: number;

  /** Optional CSS class(es) */
  class?: string;

  /** Optional inline styles */
  style?: string | Record<string, string>;

  /** Particle/dot fill color. Overrides --flow-edge-dot-fill for this edge.
   *  Also used as the default color for particles sent along this edge. */
  particleColor?: string;

  /** Particle/dot radius (unitless SVG). Overrides --flow-edge-dot-size for this edge. */
  particleSize?: number;

  /** User-placed waypoints for editable edges. Array of {x, y} in flow coordinates. */
  controlPoints?: { x: number; y: number }[];

  /** How to render the path between control points. Only used with type: 'editable'.
   *  Default: 'bezier' */
  pathStyle?: 'linear' | 'step' | 'smoothstep' | 'catmull-rom' | 'bezier';

  /** Whether to always show control point handles (vs only when selected). Default: false */
  showControlPoints?: boolean;
}

/** Runtime check: does `obj` look like a FlowNode? */
export function isNode(obj: unknown): obj is FlowNode {
  return obj != null && typeof obj === 'object' && 'position' in obj && !('source' in obj);
}

/** Runtime check: does `obj` look like a FlowEdge? */
export function isEdge(obj: unknown): obj is FlowEdge {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'source' in obj &&
    typeof (obj as any).source === 'string' &&
    'target' in obj &&
    typeof (obj as any).target === 'string'
  );
}

// ─── Handles ────────────────────────────────────────────────────────────────

export type HandleType = 'source' | 'target';

export type HandlePosition =
  | 'top' | 'right' | 'bottom' | 'left'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface HandleConfig {
  type: HandleType;
  position: HandlePosition;
  id?: string;
}

// ─── Connection (in-progress edge) ──────────────────────────────────────────

export interface Connection {
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
}

export interface PendingConnection {
  source: string;
  sourceHandle?: string;
  /** Current mouse/pointer position in flow coordinates */
  position: XYPosition;
}

export interface PendingReconnection {
  edge: FlowEdge;
  draggedEnd: HandleType;
  anchorPosition: XYPosition;
  position: XYPosition;
}

/** Props passed to the custom connection line renderer. */
export interface ConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  source: string;
  sourceHandle?: string;
  connectionLineType: string;
  connectionLineStyle: { stroke: string; strokeWidth: number; strokeDasharray: string };
}

// ─── Events ─────────────────────────────────────────────────────────────────

export interface FlowEvents {
  'node-click': { node: FlowNode; event: MouseEvent };
  'node-drag-start': { node: FlowNode };
  'node-drag': { node: FlowNode; position: XYPosition };
  'node-drag-end': { node: FlowNode; position: XYPosition };
  'node-resize-start': { node: FlowNode; dimensions: Dimensions };
  'node-resize': { node: FlowNode; dimensions: Dimensions };
  'node-resize-end': { node: FlowNode; dimensions: Dimensions };
  'edge-click': { edge: FlowEdge; event: MouseEvent };
  'connect-start': { source: string; sourceHandle?: string };
  'connect': { connection: Connection };
  'multi-connect': { connections: Connection[] };
  'connect-end': { connection: Connection | null; source: string; sourceHandle?: string; position: XYPosition };
  'reconnect-start': { edge: FlowEdge; handleType: HandleType };
  'reconnect': { oldEdge: FlowEdge; newConnection: Connection };
  'reconnect-end': { edge: FlowEdge; successful: boolean };
  'viewport-change': { viewport: Viewport };
  'viewport-move-start': { viewport: Viewport };
  'viewport-move': { viewport: Viewport };
  'viewport-move-end': { viewport: Viewport };
  'pane-click': { event: MouseEvent; position: XYPosition };
  'node-context-menu': { node: FlowNode; event: MouseEvent };
  'edge-context-menu': { edge: FlowEdge; event: MouseEvent };
  'pane-context-menu': { event: MouseEvent; position: XYPosition };
  'selection-context-menu': { nodes: FlowNode[]; event: MouseEvent };
  'selection-change': { nodes: string[]; edges: string[]; rows: string[] };
  'nodes-change': { type: 'add' | 'remove'; nodes: FlowNode[] };
  'edges-change': { type: 'add' | 'remove'; edges: FlowEdge[] };
  'node-collapse': { node: FlowNode; descendants: string[] };
  'node-expand': { node: FlowNode; descendants: string[] };
  'node-condense': { node: FlowNode };
  'node-uncondense': { node: FlowNode };
  'row-select': { rowId: string; nodeId: string; attrId: string };
  'row-deselect': { rowId: string; nodeId: string; attrId: string };
  'row-selection-change': { selectedRows: string[] };
  'node-filter-change': { filtered: FlowNode[]; visible: FlowNode[] };
  'helper-lines-change': { horizontal: number[]; vertical: number[] };
  'nodes-patch': { patches: Record<string, DeepPartial<FlowNode>> };
  'edges-patch': { patches: Record<string, DeepPartial<FlowEdge>> };
  'init': undefined;
  'destroy': undefined;
}

// ─── Export ──────────────────────────────────────────────────────────────────

/** Per-overlay visibility options for toImage(). All default to false (excluded). */
export interface ToImageOverlays {
  /** Include toolbar and other .canvas-overlay elements. Default: false */
  toolbar?: boolean;

  /** Include minimap (.flow-minimap). Default: false */
  minimap?: boolean;

  /** Include controls panel (.flow-controls). Default: false */
  controls?: boolean;

  /** Include flow panels (.flow-panel). Default: false */
  panels?: boolean;
}

export interface ToImageOptions {
  /** Image width in pixels. Default: 1920 */
  width?: number;

  /** Image height in pixels. Default: 1080 */
  height?: number;

  /** Padding as fraction of bounds. Default: 0.1 */
  padding?: number;

  /** Background color. Default: computed --flow-bg-color */
  background?: string;

  /** Export scope. 'all' fits every non-hidden node; 'viewport' captures current view. Default: 'all' */
  scope?: 'all' | 'viewport';

  /** When provided, triggers a browser download with this filename. */
  filename?: string;

  /** Include UI overlays in the image. `true` includes all overlays; an object enables
   *  specific overlays individually. Selection box is always excluded. Default: false */
  includeOverlays?: boolean | ToImageOverlays;
}

// ─── Patch API ───────────────────────────────────────────────────────────────

/** Recursive partial — every nested object key becomes optional. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? U[]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

/** Configuration for automatic layout on structural changes. */
export interface AutoLayoutConfig {
  /** Which layout algorithm to use. */
  algorithm: 'dagre' | 'force' | 'hierarchy' | 'elk';
  /** Debounce delay in ms before re-layout triggers. Default: 50 */
  debounce?: number;
  /** Animation duration in ms. Default: 300 */
  duration?: number;
  /** Auto-fit viewport after layout. Default: true */
  fitView?: boolean;

  // Dagre options
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  nodesep?: number;
  ranksep?: number;
  adjustHandles?: boolean;

  // Force options
  strength?: number;
  distance?: number;
  charge?: number;
  iterations?: number;

  // Hierarchy options
  layoutType?: 'tree' | 'cluster';
  nodeWidth?: number;
  nodeHeight?: number;

  // ELK options
  elkAlgorithm?: 'layered' | 'force' | 'mrtree' | 'radial' | 'stress';
  nodeSpacing?: number;
  layerSpacing?: number;
}

/** Subset of FlowCanvasConfig that is safe to update at runtime. */
export interface PatchableConfig {
  minZoom?: number;
  maxZoom?: number;
  pannable?: boolean;
  zoomable?: boolean;
  snapToGrid?: false | [number, number];
  nodeExtent?: CoordinateExtent;
  background?: 'dots' | 'lines' | 'cross' | 'none' | BackgroundLayer[];
  backgroundGap?: number;
  patternColor?: string;
  panOnScroll?: boolean;
  panOnScrollDirection?: 'both' | 'vertical' | 'horizontal';
  panOnScrollSpeed?: number;
  debug?: boolean;
  autoPanOnNodeDrag?: boolean;
  autoPanOnConnect?: boolean;
  autoPanSpeed?: number;
  connectionSnapRadius?: number;
  edgesReconnectable?: boolean;
  reconnectSnapRadius?: number;
  minimapNodeColor?: string | ((node: FlowNode) => string);
  minimapMaskColor?: string;
  minimapPannable?: boolean;
  minimapZoomable?: boolean;
  defaultInteractionWidth?: number;
  preventOverlap?: boolean | number;
  reconnectOnDelete?: boolean;
  preventCycles?: boolean;
  colorMode?: 'light' | 'dark' | 'system';
  selectionMode?: 'partial' | 'full';
  selectionTool?: 'box' | 'lasso';
  lassoSelectsEdges?: boolean;
  loading?: boolean;
  loadingText?: string;
  childValidationRules?: Record<string, ChildValidation>;
  autoLayout?: AutoLayoutConfig | false;
  nodeOrigin?: [number, number];
}

/** A single background pattern layer. */
export interface BackgroundLayer {
  /** Pattern type: 'dots' (radial), 'lines' (grid), or 'cross' (plus signs). */
  variant: 'dots' | 'lines' | 'cross';
  /** Grid spacing in pixels. Default: uses --flow-bg-pattern-gap or 20. */
  gap?: number;
  /** Pattern color. Default: uses --flow-bg-pattern-color. */
  color?: string;
}

/** Built-in node shape names. */
export type NodeShape = 'circle' | 'diamond' | 'hexagon' | 'parallelogram' | 'triangle' | 'cylinder' | 'stadium';

/** Definition for a custom (or built-in) node shape. */
export interface ShapeDefinition {
  /** CSS clip-path value applied to the node element. Not needed for built-in shapes. */
  clipPath?: string;
  /**
   * Compute the edge connection point for a handle position on this shape.
   * Returns { x, y } relative to the node's top-left origin.
   * Falls back to rectangular bounding box if not provided.
   */
  perimeterPoint: (width: number, height: number, position: HandlePosition) => { x: number; y: number };
}

/** Options for fire-and-forget edge particles. */
export interface ParticleOptions {
  /** Particle fill color. Falls back to edge.particleColor → --flow-edge-dot-fill. */
  color?: string;
  /** Particle radius in SVG user units (scales with zoom). Falls back to edge.particleSize → --flow-edge-dot-size. */
  size?: number;
  /** Travel duration — CSS time value (e.g. '2s', '300ms') or numeric milliseconds (e.g. 800).
   *  Falls back to edge.animationDuration → --flow-edge-dot-duration.
   *  If `speed` is also provided, `speed` takes precedence. */
  duration?: string | number;
  /** CSS class(es) to add to the circle element. */
  class?: string;
  /** Called when the particle reaches the target and is removed. */
  onComplete?: () => void;
  /** Named renderer to use. Defaults to 'circle'. */
  renderer?: string;
  /** Travel speed in SVG units per second (alternative to duration). */
  speed?: number;
  /** Length of the beam renderer rectangle in SVG user units. */
  length?: number;
  /** Width (thickness) of the beam renderer rectangle in SVG user units. */
  width?: number;
  /** URL or SVG symbol href (e.g. '#my-symbol') for the image renderer. */
  href?: string;
}

/** State passed to particle renderers each frame. */
export interface ParticleRenderState {
  x: number;
  y: number;
  progress: number;      // 0-1
  /**
   * Position delta (SVG user units) since the previous frame — not a per-second velocity.
   * Direction is correct for angle computation (e.g. `Math.atan2(velocity.y, velocity.x)`);
   * magnitude varies with frame rate and is not suitable for speed calculations.
   */
  velocity: { x: number; y: number };
  pathLength: number;
  elapsed: number;       // ms since particle start
}

/** Pluggable particle renderer — create/update/destroy lifecycle. */
export interface ParticleRenderer {
  create: (svgLayer: SVGElement, options: ParticleOptions) => SVGElement;
  update: (el: SVGElement, state: ParticleRenderState) => void;
  destroy: (el: SVGElement) => void;
}

/** Handle returned by sendParticle() for tracking a particle's position. */
export interface ParticleHandle {
  /** Get the particle's current SVG position, or null if it has completed. */
  getCurrentPosition(): XYPosition | null;
  /** Stop and remove the particle immediately. */
  stop(): void;
  /** Resolves when the particle finishes (naturally or via stop()). */
  readonly finished: Promise<void>;
}

/** Options for sendParticleBurst — sequenced multi-particle emission. */
export interface BurstOptions extends ParticleOptions {
  /** Number of particles to fire. */
  count: number;
  /** Milliseconds between each particle start. Default: 100. */
  stagger?: number;
  /** Per-particle customization function. Receives index and total count. */
  variant?: (i: number, total: number) => Partial<ParticleOptions>;
}

/** Handle returned by sendParticleBurst() for controlling the burst. */
export interface ParticleBurstHandle {
  /** Individual particle handles (grows as staggered particles fire). */
  readonly handles: ParticleHandle[];
  /** Resolves when all particles in the burst have completed. */
  readonly finished: Promise<void>;
  /** Cancel all pending timers and stop all active particles. */
  stopAll(): void;
}

/** Options for sendConverging — fan-in particle visualization. */
export interface ConvergingOptions extends ParticleOptions {
  /** ID of the target node where all particles converge. */
  targetNodeId: string;
  /** Whether to synchronize particle arrival or departure. Default: 'arrival'. */
  synchronize?: 'arrival' | 'departure';
  /** Called when all particles have arrived at the target. */
  onAllArrived?: () => void;
}

/** Handle returned by sendConverging() for controlling the fan-in. */
export interface ConvergingHandle {
  /** Individual particle handles. */
  readonly handles: ParticleHandle[];
  /** Resolves when all converging particles have completed. */
  readonly finished: Promise<void>;
  /** Stop all particles and cancel pending timers. */
  stopAll(): void;
}

// ─── Flow Canvas Config ─────────────────────────────────────────────────────

export interface FlowCanvasConfig {
  nodes?: FlowNode[];
  edges?: FlowEdge[];

  /** Initial viewport state */
  viewport?: Partial<Viewport>;

  /** ARIA label for the flow container. Default: 'Flow diagram' */
  ariaLabel?: string;

  /** Minimum zoom level. Default: 0.5 */
  minZoom?: number;

  /** Maximum zoom level. Default: 2 */
  maxZoom?: number;

  /** Enable panning. Default: true */
  pannable?: boolean;

  /** Enable zooming. Default: true */
  zoomable?: boolean;

  /** Only render nodes/edges visible in the viewport. Default: false */
  viewportCulling?: boolean;

  /** Buffer in flow-coordinate pixels around viewport for culling. Default: 100 */
  cullingBuffer?: number;

  /** Default anchor point for all nodes. [0,0] = top-left (default), [0.5,0.5] = center.
   *  Per-node `nodeOrigin` overrides this. */
  nodeOrigin?: [number, number];

  /** Default properties merged into edges created at runtime (drag-connect, click-to-connect, edge-drop).
   *  Edge-specific properties override these defaults. Does not affect initial config edges. */
  defaultEdgeOptions?: Partial<FlowEdge>;

  /** Default invisible hit area width for edges. Default: 20 */
  defaultInteractionWidth?: number;

  /** Snap node positions to grid. false or [gridX, gridY] */
  snapToGrid?: false | [number, number];

  /** Alignment guides during drag. true for defaults, object to configure, false/omitted to disable. */
  helperLines?: boolean | {
    /** Snap dragged node to alignment. Default: true */
    snap?: boolean;
    /** Distance threshold in flow pixels to trigger alignment. Default: 5 */
    threshold?: number;
  };

  /** Viewport pan boundaries [[minX, minY], [maxX, maxY]]. Default: unbounded */
  translateExtent?: CoordinateExtent;

  /** Global node position boundaries [[minX, minY], [maxX, maxY]]. Default: unbounded */
  nodeExtent?: CoordinateExtent;

  /** Enable debug logging to console. Default: false */
  debug?: boolean;

  /** Background pattern. A string shorthand, array of layers, or 'none'. Default: 'dots' */
  background?: 'dots' | 'lines' | 'cross' | 'none' | BackgroundLayer[];

  /** Grid spacing in pixels. Overrides --flow-bg-pattern-gap. Default: 20 */
  backgroundGap?: number;

  /** Pattern color (dot or line stroke). Overrides --flow-bg-pattern-color. Supports rgba for opacity. */
  patternColor?: string;

  /** Pan viewport on mouse wheel instead of zooming. Ctrl/Cmd+wheel zooms. Default: false */
  panOnScroll?: boolean;

  /** Which axes scroll-panning applies to. Default: 'both' */
  panOnScrollDirection?: 'both' | 'vertical' | 'horizontal';

  /** Multiplier for scroll pan sensitivity. Default: 1 */
  panOnScrollSpeed?: number;

  /** Custom connection validator. Return false to reject. Called after built-in checks. */
  isValidConnection?: (connection: Connection) => boolean;

  // ── Minimap ──────────────────────────────────────────────────────
  /** Show a minimap panel. Default: false */
  minimap?: boolean;

  /** Allow panning by clicking/dragging the minimap. Default: false */
  minimapPannable?: boolean;

  /** Allow zooming by scrolling on the minimap. Default: false */
  minimapZoomable?: boolean;

  /** Position on canvas. Default: 'bottom-right' */
  minimapPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Fill color for minimap node rects. Can be per-node function. */
  minimapNodeColor?: string | ((node: FlowNode) => string);

  /** Mask color for area outside viewport. Default: 'rgba(0,0,0,0.3)' */
  minimapMaskColor?: string;

  // ── Controls Panel ─────────────────────────────────────────────────
  /** Show a controls panel. Default: false */
  controls?: boolean;

  /** Position on canvas. Default: 'bottom-left' */
  controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Layout direction. Default: 'vertical' */
  controlsOrientation?: 'vertical' | 'horizontal';

  /** Show zoom in/out buttons. Default: true */
  controlsShowZoom?: boolean;

  /** Show fit view button. Default: true */
  controlsShowFitView?: boolean;

  /** Show interactivity toggle. Default: true */
  controlsShowInteractive?: boolean;

  /** Show reset-panels button. Default: false */
  controlsShowResetPanels?: boolean;

  /** CSS selector for external container. When set, panel renders there instead of inside the canvas. */
  controlsContainer?: string;

  // ── Auto-Pan ───────────────────────────────────────────────────────
  /** Auto-pan when dragging nodes near canvas edge. Default: true */
  autoPanOnNodeDrag?: boolean;

  /** Auto-pan when drawing connections near canvas edge. Default: true */
  autoPanOnConnect?: boolean;

  /** Auto-pan speed multiplier. Default: 15 */
  autoPanSpeed?: number;

  // ── Keyboard Accessibility ──────────────────────────────────────────
  /** Allow nodes to receive keyboard focus via Tab. Default: true */
  nodesFocusable?: boolean;

  /** Allow edges to receive keyboard focus via Tab. Default: true */
  edgesFocusable?: boolean;

  /** Disable arrow-key movement for selected nodes (Tab/Enter still work). Default: false */
  disableKeyboardA11y?: boolean;

  /** Screen reader announcements. true (default) = on, false = off,
   *  or object with formatMessage callback for custom messages. */
  announcements?: boolean | {
    formatMessage?: (event: string, detail: Record<string, any>) => string | null;
  };

  /** Compute mode. 'manual' (default) = explicit $flow.compute() calls,
   *  'auto' = re-propagate on node/edge changes (debounced). */
  computeMode?: 'auto' | 'manual';

  /** Customize keyboard shortcuts. Omit a key for default, set to null to disable. */
  keyboardShortcuts?: import('./keyboard-shortcuts').KeyboardShortcuts;

  /** Selection containment mode. 'partial' selects on any overlap (default), 'full' requires entire node inside box. */
  selectionMode?: 'partial' | 'full';

  /** Start selection box on plain left-click drag (no modifier needed). Pair with panOnDrag: [2] for whiteboard UX. Default: false */
  selectionOnDrag?: boolean;

  /** Selection tool: 'box' for rectangular, 'lasso' for freeform. Default: 'box' */
  selectionTool?: 'box' | 'lasso';

  /** Whether lasso selection also selects edges. Default: false */
  lassoSelectsEdges?: boolean;

  /** Bump z-index of selected nodes so they render above unselected nodes. Default: true */
  elevateNodesOnSelect?: boolean;

  // ── Touch ───────────────────────────────────────────────────────
  /** Action triggered by long-press on touch devices. Default: 'context-menu' */
  longPressAction?: 'context-menu' | 'select' | null;

  /** Duration in ms before long-press triggers. Default: 500 */
  longPressDuration?: number;

  /** Enable two-finger-tap to toggle touch selection mode. Default: true */
  touchSelectionMode?: boolean;

  /** Zoom-level thresholds for contextual zoom / level-of-detail rendering.
   *  Sets `data-zoom-level` attribute on the container (`'far'`, `'medium'`, `'close'`).
   *  Provide custom thresholds or `false` to disable. Default: `{ far: 0.4, medium: 0.75 }` */
  zoomLevels?: false | { far?: number; medium?: number };

  // ── Edge Reconnection ─────────────────────────────────────────────
  /** Allow edge endpoints to be dragged to different handles. Default: true */
  edgesReconnectable?: boolean;

  /** Proximity radius (in flow pixels) for snapping to endpoints. Default: 10 */
  reconnectSnapRadius?: number;

  /** Pixel radius for snapping connections to nearby handles. 0 disables. Default: 20 */
  connectionSnapRadius?: number;

  /** Enable click-to-connect: click source handle, then click target handle. Default: true */
  connectOnClick?: boolean;

  // ── Connection Line Customization ──────────────────────────────────
  /** Type of path used for the temporary connection drag line.
   *  Default: 'straight' */
  connectionLineType?: 'bezier' | 'smoothstep' | 'straight' | 'step';

  /** Style overrides for the temporary connection drag line. */
  connectionLineStyle?: {
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };

  /** Full custom renderer for the temp connection line.
   *  When set, overrides connectionLineType. Must return an SVG element. */
  connectionLine?: (props: ConnectionLineProps) => SVGElement;

  // ── Multi Connect ──────────────────────────────────────────────────
  /** When enabled, dragging from a selected node's source handle creates
   *  connection lines from ALL selected nodes' source handles to the cursor.
   *  On drop, valid connections are created in a single batch. Default: false */
  multiConnect?: boolean;

  // ── Easy Connect ──────────────────────────────────────────────────
  /** Enable connecting by holding a modifier key and dragging from node body. Default: false */
  easyConnect?: boolean;

  /** Modifier key for easy connect. Default: 'alt' */
  easyConnectKey?: 'alt' | 'meta' | 'shift';

  // ── Proximity Connect ─────────────────────────────────────────────
  /** Auto-create edges when dragging nodes near each other. Default: false */
  proximityConnect?: boolean;

  /** Distance threshold in flow pixels for proximity connect. Default: 150 */
  proximityConnectDistance?: number;

  /** Show visual confirmation before creating proximity edge. Default: false */
  proximityConnectConfirm?: boolean;

  /** Callback to validate or reject a proximity connection.
   *  Return false to prevent the edge from being created. */
  onProximityConnect?: (detail: {
    source: string;
    target: string;
    distance: number;
  }) => boolean | void;

  // ── Interaction Escape Hatches ──────────────────────────────────────
  /** CSS class that prevents node dragging when on or inside the event target. Default: 'nodrag' */
  noDragClassName?: string;

  /** CSS class that prevents canvas pan/zoom when on or inside the event target. Default: 'nopan' */
  noPanClassName?: string;

  /** CSS class that prevents wheel zoom when on or inside the event target. Default: undefined (disabled) */
  noWheelClassName?: string;

  /** Which mouse buttons trigger panning. true = left button (default), false = disabled,
   *  array of button indices (0=left, 1=middle, 2=right). */
  panOnDrag?: boolean | number[];

  /** Key code that temporarily enables panning when held (e.g. 'Space'). Default: 'Space'.
   *  Set to null to disable. Shows grab cursor while held. */
  panActivationKeyCode?: string | null;

  /** Key code that forces zoom-on-wheel when held, overriding panOnScroll. Default: null.
   *  Ctrl/Meta always force zoom when panOnScroll is active. */
  zoomActivationKeyCode?: string | null;

  /** Connection mode. 'strict' (default) = source handles only connect to target handles.
   *  'loose' = source handles can connect to any handle type. */
  connectionMode?: 'strict' | 'loose';

  /** Auto-pan viewport when a node receives keyboard focus. Default: false */
  autoPanOnNodeFocus?: boolean;

  // ── Type Registries ────────────────────────────────────────────────
  /** Map node type strings to template selectors or render functions.
   *  String values are CSS selectors for <template> elements.
   *  Function values receive (node, el) and should populate el's content. */
  nodeTypes?: Record<string, string | ((node: FlowNode, el: HTMLElement) => void)>;

  /** Per-type child validation rules. Keys are node type strings (e.g. 'group').
   *  Merged with node.data.childValidation per-instance overrides (shallow). */
  childValidationRules?: Record<string, ChildValidation>;

  /** Called when an automatic child validation check rejects an operation. */
  onChildValidationFail?: (detail: ChildValidationFailDetail) => void;

  /** Custom shape definitions. Merged with built-in shapes (circle, diamond, hexagon, etc.).
   *  Each entry provides a perimeterPoint function and optional clipPath CSS. */
  shapeTypes?: Record<string, ShapeDefinition>;

  /** Map edge type strings to custom path generator functions.
   *  Receives the same params as built-in generators, returns { path, labelPosition }. */
  edgeTypes?: Record<string, (params: {
    sourceX: number; sourceY: number; sourcePosition: string;
    targetX: number; targetY: number; targetPosition: string;
  }) => { path: string; labelPosition: { x: number; y: number } }>;

  // ── History (Undo/Redo) ─────────────────────────────────────────
  /** Enable undo/redo history tracking. Default: false */
  history?: boolean;

  /** Max snapshots to retain. Default: 50 */
  historyMaxSize?: number;

  // ── Animation ──────────────────────────────────────────────────
  /** Respect prefers-reduced-motion media query for $flow.animate().
   *  'auto' (default): check media query. true: always reduce. false: never reduce. */
  respectReducedMotion?: boolean | 'auto';

  // ── Event callbacks ────────────────────────────────────────────────

  /** Called when a node is clicked */
  onNodeClick?: (detail: FlowEvents['node-click']) => void;

  /** Called when node drag starts */
  onNodeDragStart?: (detail: FlowEvents['node-drag-start']) => void;

  /** Called continuously during node drag */
  onNodeDrag?: (detail: FlowEvents['node-drag']) => void;

  /** Called when node drag ends */
  onNodeDragEnd?: (detail: FlowEvents['node-drag-end']) => void;

  /** Called when node resize starts */
  onNodeResizeStart?: (detail: FlowEvents['node-resize-start']) => void;

  /** Called continuously during node resize */
  onNodeResize?: (detail: FlowEvents['node-resize']) => void;

  /** Called when node resize ends */
  onNodeResizeEnd?: (detail: FlowEvents['node-resize-end']) => void;

  /** Called when an edge is clicked */
  onEdgeClick?: (detail: FlowEvents['edge-click']) => void;

  /** Called when an edge reconnection drag starts */
  onReconnectStart?: (detail: FlowEvents['reconnect-start']) => void;

  /** Called when an edge is successfully reconnected */
  onReconnect?: (detail: FlowEvents['reconnect']) => void;

  /** Called when an edge reconnection drag ends (success or cancel) */
  onReconnectEnd?: (detail: FlowEvents['reconnect-end']) => void;

  /** Called when a connection drag starts */
  onConnectStart?: (detail: FlowEvents['connect-start']) => void;

  /** Called when a connection is successfully created */
  onConnect?: (detail: FlowEvents['connect']) => void;

  /** Called when multiple connections are created in a single multi-connect drag */
  onMultiConnect?: (detail: FlowEvents['multi-connect']) => void;

  /** Called when a connection drag ends (success or cancel) */
  onConnectEnd?: (detail: FlowEvents['connect-end']) => void;

  /** Called when the viewport changes (pan/zoom) */
  onViewportChange?: (detail: FlowEvents['viewport-change']) => void;

  /** Called when a user gesture (pan/zoom) starts */
  onViewportMoveStart?: (detail: FlowEvents['viewport-move-start']) => void;

  /** Called each frame during a user gesture (pan/zoom) */
  onViewportMove?: (detail: FlowEvents['viewport-move']) => void;

  /** Called when a user gesture (pan/zoom) ends */
  onViewportMoveEnd?: (detail: FlowEvents['viewport-move-end']) => void;

  /** Called when the canvas background is clicked */
  onPaneClick?: (detail: FlowEvents['pane-click']) => void;

  /** Called when a node is right-clicked */
  onNodeContextMenu?: (detail: FlowEvents['node-context-menu']) => void;

  /** Called when an edge is right-clicked */
  onEdgeContextMenu?: (detail: FlowEvents['edge-context-menu']) => void;

  /** Called when the pane background is right-clicked */
  onPaneContextMenu?: (detail: FlowEvents['pane-context-menu']) => void;

  /** Called when right-clicking with multiple nodes selected */
  onSelectionContextMenu?: (detail: FlowEvents['selection-context-menu']) => void;

  /** Called when node or edge selection changes */
  onSelectionChange?: (detail: FlowEvents['selection-change']) => void;

  /** Called when nodes are added or removed */
  onNodesChange?: (detail: FlowEvents['nodes-change']) => void;

  /** Called when edges are added or removed */
  onEdgesChange?: (detail: FlowEvents['edges-change']) => void;

  /** Called when nodes are patched */
  onNodesPatch?: (detail: FlowEvents['nodes-patch']) => void;

  /** Called when edges are patched */
  onEdgesPatch?: (detail: FlowEvents['edges-patch']) => void;

  /** Called after the canvas is fully initialized */
  onInit?: () => void;

  /** Called when the canvas is being destroyed */
  onDestroy?: () => void;

  /** Called when a node is collapsed */
  onNodeCollapse?: (detail: FlowEvents['node-collapse']) => void;

  /** Called when a node is expanded */
  onNodeExpand?: (detail: FlowEvents['node-expand']) => void;

  /** Called when a node is condensed */
  onNodeCondense?: (detail: FlowEvents['node-condense']) => void;

  /** Called when a node is uncondensed */
  onNodeUncondense?: (detail: FlowEvents['node-uncondense']) => void;

  /** Called before user-initiated deletion (keyboard Delete/Backspace or cut).
   *  Receives the nodes and edges about to be deleted (already filtered by `deletable`).
   *  Cascaded edges (connected to deleted nodes) are included.
   *  Return the subset to actually delete, or `false` to cancel entirely.
   *  Async — supports confirm dialogs, server validation, etc.
   *  Does NOT intercept programmatic `removeNodes()`/`removeEdges()` calls. */
  onBeforeDelete?: (detail: { nodes: FlowNode[]; edges: FlowEdge[] }) => Promise<{ nodes: FlowNode[]; edges: FlowEdge[] } | false>;

  /** Prevent dragged nodes from overlapping others. Default: false.
   *  Pass a number for custom gap in pixels. */
  preventOverlap?: boolean | number;

  /** Auto-bridge predecessors to successors when deleting middle nodes. Default: false */
  reconnectOnDelete?: boolean;

  /** Reject interactive connections that would create a directed cycle. Default: false */
  preventCycles?: boolean;

  /** Auto-layout on structural changes. Pass config to enable. Default: undefined (disabled) */
  autoLayout?: AutoLayoutConfig;

  /** Color mode for this flow instance. Default: undefined (no color mode management).
   *  'system' tracks OS preference via matchMedia. Adds/removes `.dark` class on the container. */
  colorMode?: 'light' | 'dark' | 'system';

  /** Automatically call fitView() after init. Default: false */
  fitViewOnInit?: boolean;

  /** Show loading overlay until setLoading(false) is called. Default: false */
  loading?: boolean;

  /** Custom text for the default loading indicator. Default: 'Loading…' */
  loadingText?: string;

  /** Enable real-time collaboration. Requires yjs peer dependency. */
  collab?: CollabConfig;

  // ── Wire Bridge (Livewire) ──────────────────────────────────────────
  /** Map of AlpineFlow event names to Livewire method names.
   *  When $wire is available, these events auto-call $wire.methodName()
   *  with extracted payload arguments. Set by WireFlow Blade component. */
  wireEvents?: Record<string, string>;

  // ── Drop Zone ───────────────────────────────────────────────────────
  /** Enable drag-and-drop onto canvas. When set, the container accepts drops from
   *  `x-flow-draggable` elements (or any source using `application/alpineflow` MIME).
   *  Return a FlowNode to add it, or falsy to cancel.
   *
   *  @param detail.data - The value set by x-flow-draggable (string or parsed object)
   *  @param detail.position - Drop coordinates already converted via screenToFlowPosition
   *  @param detail.targetNode - The FlowNode under the cursor at drop time, or null if dropped on empty space */
  onDrop?: (detail: { data: any; position: XYPosition; targetNode: FlowNode | null }) => FlowNode | null | undefined | false;

  /** Called when a connection is dropped on empty canvas space. Return a FlowNode to auto-create
   *  it and connect it to the source. Return null to cancel. The auto-created edge uses defaults
   *  and respects `isValidConnection`. For custom edges, use `onConnectEnd` instead. */
  onEdgeDrop?: (detail: { source: string; sourceHandle?: string; position: XYPosition }) => FlowNode | null;

  /** Customize the ghost node preview shown during connection drag (requires `onEdgeDrop`).
   *  Return a string for label text, an HTMLElement for custom content, or null to hide.
   *  When not set, a default "New Node" placeholder is shown. */
  edgeDropPreview?: (detail: { source: string; sourceHandle?: string }) => string | HTMLElement | null;

  // ── Error Handling ──────────────────────────────────────────────────
  /** Global error/warning handler. When set, internal warnings are routed through
   *  this callback instead of (or in addition to) console.warn. */
  onError?: (code: string, message: string) => void;

  // ── Drag Threshold ──────────────────────────────────────────────────
  /** Minimum pixel distance before a node drag starts. Default: 0 (immediate) */
  nodeDragThreshold?: number;

  // ── Double-Click Zoom ─────────────────────────────────────────────
  /** Zoom in on double-click. Default: true */
  zoomOnDoubleClick?: boolean;

  // ── Select on Drag ────────────────────────────────────────────────
  /** Automatically select nodes when they start being dragged. Default: true */
  selectNodesOnDrag?: boolean;
}

// ─── Animation API Types ─────────────────────────────────────────────────────

/** Per-element timing override (prefixed with _ to avoid collision with data properties). */
export interface ElementTimingOverrides {
  _duration?: number;
  _easing?: EasingName | ((t: number) => number);
  _motion?: MotionConfig | string;
}

/** Node animation targets. */
export type AnimateNodeTarget = {
  position?: Partial<XYPosition>;
  /** Path function or SVG path string for curved motion. Overrides `position`. */
  followPath?: PathFunction | string;
  /** Optional visible guide path overlay for string-based followPath. */
  guidePath?: { visible?: boolean; class?: string; autoRemove?: boolean };
  data?: Record<string, any>;
  class?: string;
  style?: string | Record<string, string>;
  dimensions?: Partial<Dimensions>;
  selected?: boolean;
  zIndex?: number;
} & ElementTimingOverrides;

/** Edge animation targets. */
export type AnimateEdgeTarget = {
  color?: string | { from: string; to: string };
  label?: string;
  strokeWidth?: number;
  animated?: boolean;
  class?: string;
} & ElementTimingOverrides;

/** Viewport animation target. */
export type AnimateViewportTarget = {
  pan?: Partial<XYPosition>;
  zoom?: number;
} & ElementTimingOverrides;

/** Targets for update() and animate(). */
export interface AnimateTargets {
  nodes?: Record<string, AnimateNodeTarget>;
  edges?: Record<string, AnimateEdgeTarget>;
  viewport?: AnimateViewportTarget;
}

/** Options for update() and animate(). */
export interface AnimateOptions {
  /** Duration in ms. 0 = instant snap. Default: 300. */
  duration?: number;
  /** Easing preset or custom function. Default: 'easeInOut'. */
  easing?: EasingName | ((t: number) => number);
  /** Physics-based motion config or preset string (e.g. 'spring.wobbly'). */
  motion?: MotionConfig | string;
  /** Maximum duration in ms when using physics-based motion. Default: 10000. */
  maxDuration?: number;
  /** Delay before starting in ms. Default: 0. */
  delay?: number;
  /** true = loop forever, 'reverse' | 'ping-pong' = ping-pong. Default: false. */
  loop?: boolean | 'reverse' | 'ping-pong';
  /** Start position. 'end' snaps to target and plays backward. Default: 'start'. */
  startAt?: 'start' | 'end';
  /** Called once on the first tick after delay elapses. */
  onStart?: () => void;
  /** Called each frame with progress 0–1. */
  onProgress?: (progress: number) => void;
  /** Called when animation completes. */
  onComplete?: () => void;
  /** Single tag for grouping animations by identity. */
  tag?: string;
  /** Multiple tags for grouping animations. Merged with `tag` when both are provided. */
  tags?: string[];
  /**
   * Predicate evaluated once per frame. When it returns `false`, the animation
   * auto-cancels using the mode defined by `whileStopMode`.
   */
  while?: () => boolean;
  /**
   * Declarative binding that is compiled into a `while` predicate by the canvas
   * integration layer (Task 8). The Animator itself only handles `while`.
   */
  boundTo?: { node: string; property: string; equals: any } | { edge: string; property: string; equals: any };
  /**
   * Controls how the animation stops when `while` returns false.
   * - 'jump-end'  — snap to target values (default)
   * - 'rollback'  — revert to snapshot values
   * - 'freeze'    — leave at current interpolated value
   */
  whileStopMode?: 'jump-end' | 'rollback' | 'freeze';
}

/** Options for handle.stop() / stopAll(). */
export interface StopOptions {
  mode?: 'jump-end' | 'rollback' | 'freeze';
}

/** Handle returned by animate(). */
export interface FlowAnimationHandle {
  pause(): void;
  resume(): void;
  stop(options?: StopOptions): void;
  reverse(): void;
  play(): void;
  playForward(): void;
  playBackward(): void;
  restart(options?: { direction?: 'forward' | 'backward' }): void;
  readonly direction: 'forward' | 'backward';
  readonly isFinished: boolean;
  readonly currentValue: Map<string, number | string>;
  readonly finished: Promise<void>;
  /** @internal Node IDs targeted by this animation (used by follow()). */
  _targetNodeIds?: string[];
}

/** Options for follow(). */
export interface FollowOptions {
  zoom?: number;
  padding?: number;
  easing?: EasingName | ((t: number) => number);
}

// ─── Flow Instance (public API surface) ─────────────────────────────────────

export interface FlowInstance {
  /** Reactive array of nodes */
  nodes: FlowNode[];

  /** Reactive array of edges */
  edges: FlowEdge[];

  /** Current viewport state */
  viewport: Viewport;

  /** Add one or more nodes */
  addNodes(nodes: FlowNode | FlowNode[]): void;

  /** Remove nodes by ID */
  removeNodes(ids: string | string[]): void;

  /** Add one or more edges */
  addEdges(edges: FlowEdge | FlowEdge[]): void;

  /** Remove edges by ID */
  removeEdges(ids: string | string[]): void;

  /** Get a node by ID */
  getNode(id: string): FlowNode | undefined;

  /** Get an edge by ID */
  getEdge(id: string): FlowEdge | undefined;

  /** Convert screen coordinates to flow coordinates */
  screenToFlowPosition(x: number, y: number): XYPosition;

  /** Convert flow coordinates to screen coordinates */
  flowToScreenPosition(x: number, y: number): XYPosition;

  /** Fit all nodes into the viewport */
  fitView(options?: { padding?: number; duration?: number }): void;

  /** Zoom/pan the viewport to frame a specific rectangle in flow coordinates. */
  fitBounds(rect: Rect, options?: { padding?: number; duration?: number }): void;

  /** Get the bounding rectangle of specific nodes, or all visible nodes if omitted. */
  getNodesBounds(nodeIds?: string[]): Rect;

  /** Compute a viewport that frames the given bounds rectangle. Does not apply it.
   *  Uses config's minZoom/maxZoom and the container dimensions. */
  getViewportForBounds(bounds: Rect, padding?: number): Viewport;

  /** Set viewport programmatically */
  setViewport(viewport: Partial<Viewport>, options?: { duration?: number }): void;

  /** Zoom in by a step factor (default 1.2) */
  zoomIn(options?: { duration?: number }): void;

  /** Zoom out by a step factor (default 1.2) */
  zoomOut(options?: { duration?: number }): void;

  /** Center the viewport on a flow coordinate, optionally setting zoom. */
  setCenter(x: number, y: number, zoom?: number, options?: { duration?: number }): void;

  /** Pan the viewport by a delta in flow coordinates. */
  panBy(dx: number, dy: number, options?: { duration?: number }): void;

  /** Toggle interactivity (pannable + zoomable + node dragging) */
  toggleInteractive(): void;

  /** Whether interactivity is currently enabled */
  isInteractive: boolean;

  /** Get the absolute position of a node (resolves parentId chain) */
  getAbsolutePosition(nodeId: string): XYPosition;

  /** Serialize entire flow state to a plain JSON-serializable object. */
  toObject(): { nodes: FlowNode[]; edges: FlowEdge[]; viewport: Viewport };

  /** Restore flow state from a previously saved object. */
  fromObject(obj: { nodes?: FlowNode[]; edges?: FlowEdge[]; viewport?: Partial<Viewport> }): void;

  /** Reset the canvas to the initial config state (nodes, edges, viewport). */
  $reset(): void;

  /** Clear all nodes and edges, reset viewport to origin. */
  $clear(): void;

  /** Undo the last structural change (requires history: true) */
  undo(): void;

  /** Redo the last undone change (requires history: true) */
  redo(): void;

  /** Whether an undo operation is available */
  canUndo: boolean;

  /** Whether a redo operation is available */
  canRedo: boolean;

  /** Export the canvas as a PNG image. Returns a data URL. */
  toImage(options?: ToImageOptions): Promise<string>;

  /** Animate nodes, edges, and/or viewport with smooth interpolation.
   *  Duration 0 = instant snap (replaces old patch()).
   *
   * @example
   * // Instant update (default duration: 0)
   * $flow.update({ nodes: { n1: { position: { x: 500, y: 200 } } } })
   *
   * // Update with custom transition
   * $flow.update({ nodes: { n1: { data: { label: 'Updated' } } } }, { duration: 500 })
   */
  update(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle;

  /** Animate nodes, edges, and/or viewport with smooth transitions.
   *  Convenience wrapper around `update()` that defaults to 300ms duration.
   *
   * @example
   * // Smooth transition (default 300ms)
   * $flow.animate({ nodes: { n1: { position: { x: 500, y: 200 } } } })
   */
  animate(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle;

  /** Track a target with the viewport camera. Returns a handle to stop tracking.
   *  Only affects viewport — all node/edge animations continue independently.
   */
  follow(target: string | FlowAnimationHandle | ParticleHandle | XYPosition, options?: FollowOptions): FlowAnimationHandle;

  /** Fire a particle along an edge path. Returns a handle for tracking, or undefined if the particle couldn't be created. */
  sendParticle(edgeId: string, options?: ParticleOptions): ParticleHandle | undefined;

  /** Fire a particle along an arbitrary SVG path string. A temporary invisible path element is injected and cleaned up on completion. */
  sendParticleAlongPath(svgPath: string, options?: ParticleOptions): ParticleHandle | undefined;

  /** Fire a particle along a straight line between two node centers. */
  sendParticleBetween(sourceNodeId: string, targetNodeId: string, options?: ParticleOptions): ParticleHandle | undefined;

  /** Fire a burst of staggered particles along an edge. */
  sendParticleBurst(edgeId: string, options: BurstOptions): ParticleBurstHandle;

  /** Fire particles from multiple edges converging on a target node. */
  sendConverging(sourceEdgeIds: string[], options: ConvergingOptions): ConvergingHandle;

  /** Register a custom particle renderer by name so it can be used via `renderer: 'name'` in sendParticle* options. */
  registerParticleRenderer(name: string, renderer: ParticleRenderer): void;

  /** Get all tracked animation handles, optionally filtered by tag. */
  getHandles(filter?: { tag?: string; tags?: string[] }): FlowAnimationHandle[];

  /** Cancel all animations matching a tag filter. */
  cancelAll(filter: { tag?: string; tags?: string[] }, options?: StopOptions): void;

  /** Pause all animations matching a tag filter. */
  pauseAll(filter: { tag?: string; tags?: string[] }): void;

  /** Resume all animations matching a tag filter. */
  resumeAll(filter: { tag?: string; tags?: string[] }): void;

  /** Create a named group that auto-tags all animations made through it. */
  group(name: string): FlowGroup;

  /** Create a transaction for grouped rollback of multiple animations. */
  transaction(fn: () => Promise<void> | void): Transaction;

  /** Capture current canvas state. Call restore() to revert. */
  snapshot(): { restore: () => void };

  /** Condense a node — switch to summary view hiding internal rows */
  condenseNode(id: string): void;

  /** Uncondense a node — restore full row view */
  uncondenseNode(id: string): void;

  /** Toggle condensed state of a node */
  toggleCondense(id: string): void;

  /** Check if a node is condensed */
  isCondensed(id: string): boolean;

  /** Select a row by ID (nodeId.attrId format) */
  selectRow(rowId: string): void;

  /** Deselect a row by ID */
  deselectRow(rowId: string): void;

  /** Toggle row selection */
  toggleRowSelect(rowId: string): void;

  /** Get all selected row IDs */
  getSelectedRows(): string[];

  /** Check if a row is selected */
  isRowSelected(rowId: string): boolean;

  /** Deselect all rows */
  deselectAllRows(): void;

  /** Set row filter for a node. Accepts a preset or a custom predicate. */
  setRowFilter(nodeId: string, filter: RowFilter): void;

  /** Get row filter for a node */
  getRowFilter(nodeId: string): RowFilter;

  /** Get visible rows for a node based on its rowFilter and current edges */
  getVisibleRows(nodeId: string, schema: any[]): any[];

  /** Apply a filter predicate to all nodes. Nodes failing the predicate get `filtered: true`. */
  setNodeFilter(predicate: (node: FlowNode) => boolean): void;

  /** Clear node filter — sets `filtered: false` on all nodes. */
  clearNodeFilter(): void;

  /** Update runtime config options (zoom limits, background, colorMode, etc.). */
  patchConfig(changes: Partial<PatchableConfig>): void;

  /** Current resolved color mode, or undefined if not managed. */
  readonly colorMode?: 'light' | 'dark';

  /** Return all nodes whose bounding rect overlaps the given node.
   *  `partially` (default true) — any overlap counts. If false, only full containment. */
  getIntersectingNodes(nodeOrId: FlowNode | string, partially?: boolean): FlowNode[];

  /** Check if two nodes' bounding rects overlap. */
  isNodeIntersecting(nodeOrId: FlowNode | string, targetOrId: FlowNode | string, partially?: boolean): boolean;

  /** Get nodes connected via outgoing edges from this node. */
  getOutgoers(nodeId: string): FlowNode[];

  /** Get nodes connected via incoming edges to this node. */
  getIncomers(nodeId: string): FlowNode[];

  /** Get all edges connected to a node (incoming and outgoing). */
  getConnectedEdges(nodeId: string): FlowEdge[];

  /** Check if two nodes are directly connected by an edge. */
  areNodesConnected(nodeA: string, nodeB: string, directed?: boolean): boolean;

  /** Register a compute function for a node type. */
  registerCompute(nodeType: string, definition: { compute: (inputs: Record<string, any>, nodeData: Record<string, any>) => Record<string, any> }): void;

  /** Run compute propagation through the graph. If startNodeId is given, only recompute downstream from that node. */
  compute(startNodeId?: string): Map<string, Record<string, any>>;

  /** Collaboration instance. Only present when collab config is provided. */
  readonly collab?: CollabInstance;
}
