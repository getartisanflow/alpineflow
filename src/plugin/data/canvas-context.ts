// ============================================================================
// CanvasContext — Shared state & helpers for flow-canvas mixin modules
//
// Each mixin receives a CanvasContext and returns a plain object of methods.
// This interface captures ALL reactive state, caches, DOM references, and
// internal helper methods that mixins may need to read or invoke.
// ============================================================================

import type {
  FlowNode,
  FlowEdge,
  Viewport,
  XYPosition,
  Dimensions,
  FlowCanvasConfig,
  PendingReconnection,
  AnimateTargets,
  AnimateOptions,
  FlowAnimationHandle,
  FollowOptions,
  BurstOptions,
  ParticleBurstHandle,
  ConvergingOptions,
  ConvergingHandle,
  ParticleHandle,
  ParticleOptions,
  ParticleRenderer,
  PatchableConfig,
  ChildValidation,
  AutoLayoutConfig,
  RowFilter,
  ShapeDefinition,
  ToImageOptions,
  StopOptions,
} from '../../core/types';
import type { FlowGroup } from '../../animate/flow-group';
import type { Transaction } from '../../animate/transaction';
import type { Recording, RecordOptions, ReplayOptions, ReplayHandle } from '../../animate/recording';
import type { FlowHistory } from '../../core/history';
import type { FlowTimeline } from '../../animate/timeline';
import type { Animator } from '../../animate/animator';
import type { EngineHandle } from '../../animate/engine';
import type { PanZoomInstance } from '../../core/pan-zoom';
import type { MiniMapInstance } from '../../core/minimap';
import type { ControlsPanelInstance } from '../../core/controls-panel';
import type { SelectionBoxInstance } from '../../core/selection-box';
import type { LassoInstance } from '../../core/lasso';
import type { ColorModeHandle } from '../../core/color-mode';
import type { FlowAnnouncer } from '../../core/announcer';
import type { ComputeEngine } from '../../core/compute';
import type { CollapseState } from '../../core/collapse';
import type { KeyboardShortcuts } from '../../core/keyboard-shortcuts';

// ── Active particle entry (shared loop) ─────────────────────────────────────

export interface ActiveParticle {
  element: SVGElement;          // generic — could be circle, rect, g, etc.
  renderer: ParticleRenderer;   // the renderer that created it
  pathEl: SVGPathElement;
  startElapsed: number;       // engine-relative start time; -1 until first tick
  ms: number;
  onComplete?: () => void;
  currentPosition: { x: number; y: number };
}

// ── Context menu state ──────────────────────────────────────────────────────

export interface ContextMenuState {
  show: boolean;
  type: string | null;
  x: number;
  y: number;
  node: FlowNode | null;
  edge: FlowEdge | null;
  position: XYPosition | null;
  nodes: FlowNode[] | null;
}

// ── CanvasContext ────────────────────────────────────────────────────────────

export interface CanvasContext {
  // === Reactive state ===

  /** Unique instance ID for SVG marker dedup, etc. */
  _id: string;

  /** Reactive array of nodes */
  nodes: FlowNode[];

  /** Reactive array of edges */
  edges: FlowEdge[];

  /** Current viewport state (pan offset + zoom level) */
  viewport: Viewport;

  /** Whether the canvas has completed initialization and first node measurement */
  ready: boolean;

  /** User-controlled loading flag */
  _userLoading: boolean;

  /** Custom text for the default loading indicator */
  _loadingText: string;

  /** Auto-injected loading overlay element */
  _autoLoadingOverlay: HTMLElement | null;

  /** True when the canvas is still initializing OR the user has set loading */
  readonly isLoading: boolean;

  /** Whether interactivity (pan/zoom/drag) is enabled */
  isInteractive: boolean;

  /** Currently active connection drag, or null */
  pendingConnection: { source: string; sourceHandle?: string; position: XYPosition } | null;

  /** Currently active edge reconnection drag, or null */
  _pendingReconnection: PendingReconnection | null;

  // === Selection state ===

  /** Set of selected node IDs */
  selectedNodes: Set<string>;

  /** Set of selected edge IDs */
  selectedEdges: Set<string>;

  /** Set of selected row IDs (format: nodeId.attrId) */
  selectedRows: Set<string>;

  /** Context menu state */
  contextMenu: ContextMenuState;

  // === Maps & caches ===

  /** Node lookup map (id -> node) */
  _nodeMap: Map<string, FlowNode>;

  /** Stores each node's originally configured dimensions (before layout stretch) */
  _initialDimensions: Map<string, Dimensions>;

  /** Edge lookup map (id -> edge) */
  _edgeMap: Map<string, FlowEdge>;

  /** Cached child validation errors per parent node ID */
  _validationErrorCache: Map<string, string[]>;

  /** Saved pre-collapse state per group node ID */
  _collapseState: Map<string, CollapseState>;

  // === Config & DOM elements ===

  /** Stored config (stripped of collab to avoid circular refs) */
  _config: FlowCanvasConfig;

  /** Resolved keyboard shortcuts */
  _shortcuts: Required<KeyboardShortcuts>;

  /** Shape registry (built-in + custom shapes) */
  _shapeRegistry: Record<string, ShapeDefinition>;

  /** Root container element */
  _container: HTMLElement | null;

  /** Viewport wrapper element (.flow-viewport) */
  _viewportEl: HTMLElement | null;

  /** SVG element holding marker <defs> */
  _markerDefsEl: SVGSVGElement | null;

  /** Cached CSSStyleDeclaration for the container */
  _containerStyles: CSSStyleDeclaration | null;

  /** Map of node DOM elements (id -> element) */
  _nodeElements: Map<string, HTMLElement>;

  /** Map of edge SVG elements (id -> svg) */
  _edgeSvgElements: Map<string, SVGSVGElement>;

  // === Subsystems ===

  /** Pan/zoom controller */
  _panZoom: PanZoomInstance | null;

  /** Undo/redo history stack */
  _history: FlowHistory | null;

  /** Screen reader announcer */
  _announcer: FlowAnnouncer | null;

  /** Node-to-node compute engine */
  _computeEngine: ComputeEngine;

  /** Debounce timer for auto-compute */
  _computeDebounceTimer: ReturnType<typeof setTimeout> | null;

  /** Animator for smooth property interpolation */
  _animator: Animator | null;

  /** Minimap instance */
  _minimap: MiniMapInstance | null;

  /** Controls panel instance */
  _controls: ControlsPanelInstance | null;

  /** Selection box instance */
  _selectionBox: SelectionBoxInstance | null;

  /** Lasso selection instance */
  _lasso: LassoInstance | null;

  /** Color mode controller */
  _colorModeHandle: ColorModeHandle | null;

  // === Animation state ===

  /** Whether the canvas is locked during a timeline animation */
  _animationLocked: boolean;

  /** Set of active FlowTimeline instances */
  _activeTimelines: Set<FlowTimeline>;

  /** Registry of named animations (x-flow-animate) */
  _animationRegistry: Map<string, Record<string, unknown>[]>;

  /** Engine handle for the active follow() viewport tracking */
  _followHandle: EngineHandle | null;

  // === Particle state ===

  /** Set of active particle entries for the shared animation loop */
  _activeParticles: Set<ActiveParticle>;

  /** Engine handle for the particle tick loop */
  _particleEngineHandle: EngineHandle | null;

  // === Selection tool state ===

  /** Current selection tool type */
  _selectionTool: 'box' | 'lasso';

  /** Pointer-down handler for selection drag */
  _onSelectionPointerDown: ((e: PointerEvent) => void) | null;

  /** Pointer-move handler for selection drag */
  _onSelectionPointerMove: ((e: PointerEvent) => void) | null;

  /** Pointer-up handler for selection drag */
  _onSelectionPointerUp: ((e: PointerEvent) => void) | null;

  /** Whether shift was held at selection box start */
  _selectionShiftHeld: boolean;

  /** Effective selection containment mode (partial or full) */
  _selectionEffectiveMode: 'partial' | 'full';

  /** Suppress the next canvas click after a selection box drag */
  _suppressNextCanvasClick: boolean;

  // === Touch state ===

  /** Cleanup function for long-press listener */
  _longPressCleanup: (() => void) | null;

  /** Whether touch selection mode is currently active */
  _touchSelectionMode: boolean;

  /** Cleanup function for touch selection mode listeners */
  _touchSelectionCleanup: (() => void) | null;

  // === Event handler references (for cleanup) ===

  /** Keydown handler reference */
  _onKeyDown: ((e: KeyboardEvent) => void) | null;

  /** Container pointerdown handler reference */
  _onContainerPointerDown: ((e: PointerEvent) => void) | null;

  /** Canvas click handler reference */
  _onCanvasClick: ((e: MouseEvent) => void) | null;

  /** Canvas context menu handler reference */
  _onCanvasContextMenu: ((e: MouseEvent) => void) | null;

  /** Context menu backdrop element */
  _contextMenuBackdrop: HTMLElement | null;

  /** Registered context menu event listeners */
  _contextMenuListeners: Array<{ event: string; handler: EventListener }>;

  // === Drop zone ===

  /** Dragover handler for drop zone */
  _onDropZoneDragOver: ((e: DragEvent) => void) | null;

  /** Drop handler for drop zone */
  _onDropZoneDrop: ((e: DragEvent) => void) | null;

  // === Canvas focus state ===

  /** Whether this canvas instance is the currently active/focused one */
  _active: boolean;

  // === Zoom level ===

  /** Current semantic zoom level */
  _zoomLevel: 'far' | 'medium' | 'close';

  // === Viewport culling ===

  /** Set of node IDs currently visible in the viewport */
  _visibleNodeIds: Set<string>;

  // === Background ===

  /** Background config (variant or layer array) */
  _background: FlowCanvasConfig['background'];

  /** Background gap override */
  _backgroundGap: number | null;

  /** Pattern color override */
  _patternColorOverride: string | null;

  /** Compute background style for the container */
  backgroundStyle(): { backgroundImage: string; backgroundSize: string; backgroundPosition: string };

  // === Hydration ===

  /** Whether this canvas was hydrated from a pre-rendered static diagram */
  _hydratedFromStatic: boolean;

  // === Layout dedup ===

  /** Frame-aligned layout dedup — created in _initChildLayout, disposed in destroy(). */
  _layoutDedup: import('./canvas-layout-dedup').LayoutDedup | null;

  /** Cleanup functions for per-node childLayout watchers, keyed by node id. */
  _childLayoutCleanups: Map<string, Array<() => void>>;

  /**
   * Install per-property Alpine watchers on a container node's childLayout.
   *
   * Called once during _initChildLayout for each initial container node,
   * and again from addNodes for any container node added at runtime.
   * No-op when the node has no childLayout.
   * Stores cleanup fns in _childLayoutCleanups for later disposal.
   */
  _installChildLayoutWatchers(node: import('../../core/types').FlowNode): void;

  /**
   * Stop and remove childLayout watchers for the given node id.
   *
   * Called from removeNodes and destroy(). No-op if no watchers are
   * registered for the id.
   */
  _uninstallChildLayoutWatchers(nodeId: string): void;

  // === Layout animation edge refresh ===

  /** Reactive tick bumped each frame during layout animation so edges re-measure DOM */
  _layoutAnimTick: number;

  /** rAF handle for layout animation tick */
  _layoutAnimFrame: number;

  // === Auto-Layout state ===

  /** Debounce timer for auto-layout */
  _autoLayoutTimer: ReturnType<typeof setTimeout> | null;

  /** Whether auto-layout has completed dependency loading */
  _autoLayoutReady: boolean;

  /** Whether auto-layout has permanently failed (dependency missing) */
  _autoLayoutFailed: boolean;

  // === Internal helpers ===

  /** Emit an event: debug log, config callback, DOM CustomEvent, announcer */
  _emit(event: string, detail?: any): void;

  /** Route a warning through onError callback and console.warn */
  _warn(code: string, message: string): void;

  /** Emit a selection-change event with current selected node/edge/row IDs */
  _emitSelectionChange(): void;

  /** Rebuild node lookup map from current nodes array */
  _rebuildNodeMap(): void;

  /** Rebuild edge lookup map from current edges array */
  _rebuildEdgeMap(): void;

  /** Capture a history snapshot before a mutation */
  _captureHistory(): void;

  /** Suspend history capture (e.g. during animation) */
  _suspendHistory(): void;

  /** Resume history capture after suspension */
  _resumeHistory(): void;

  /** Resolve child validation rules for a parent node */
  _getChildValidation(parentId: string): ChildValidation | undefined;

  /** Recompute child validation errors for all parent nodes */
  _recomputeChildValidation(): void;

  /** Sync animation lock state from active timelines */
  _syncAnimationState(): void;

  /** Apply background CSS to the container element */
  _applyBackground(): void;

  /** Toggle CSS display on off-screen nodes/edges (viewport culling) */
  _applyCulling(): void;

  /** Get set of currently visible node IDs */
  _getVisibleNodeIds(): Set<string>;

  /** Apply zoom level attribute to container */
  _applyZoomLevel(zoom: number): void;

  /** Get absolute position of a node (resolves parentId chain) */
  getAbsolutePosition(nodeId: string): XYPosition;

  /** Set up SVG <defs> for edge markers */
  _setupMarkerDefs(): void;

  /** Update SVG marker definitions based on current edges */
  _updateMarkerDefs(): void;

  /** Write node positions directly to DOM elements (bypassing Alpine effects) */
  _flushNodePositions(nodeIds: Set<string>): void;

  /** Write node styles directly to DOM elements (bypassing Alpine effects) */
  _flushNodeStyles(nodeIds: Set<string>): void;

  /** Write edge color/strokeWidth directly to SVG elements (bypassing Alpine effects) */
  _flushEdgeStyles(edgeIds: Set<string>): void;

  /** Push current viewport state to the DOM (transform, background, culling) */
  _flushViewport(): void;

  /** Recompute SVG paths, label positions, and gradients for affected edges */
  _refreshEdgePaths(movedNodeIds: Set<string>): void;

  /** Hydrate from a pre-rendered static diagram */
  _hydrateFromStatic(): void;

  /** Debounced trigger for automatic layout */
  _scheduleAutoLayout(): void;

  /** Execute the configured auto-layout algorithm */
  _runAutoLayout(): Promise<void>;

  /** Get effective background gap (from config, CSS variable, or default) */
  _getBackgroundGap(): number;

  /** Resolve background config to array of layer definitions */
  _resolveBackgroundLayers(): Array<{ variant: 'dots' | 'lines' | 'cross'; gap: number; color: string }>;

  /** Apply computed layout positions to nodes with optional animation */
  _applyLayout(
    positions: Map<string, { x: number; y: number }>,
    options?: {
      adjustHandles?: boolean;
      handleDirection?: string;
      fitView?: boolean;
      duration?: number;
    },
  ): void;

  /** Update handle positions to match layout direction */
  _adjustHandlePositions(direction: string): void;

  /** Delete currently selected nodes/edges (keyboard-initiated) */
  _deleteSelected(): Promise<void>;

  /** Engine tick callback for processing active particles */
  _tickParticles(elapsed: number): boolean;

  /** Stop particle engine and remove all active particles from the DOM */
  destroyParticles(): void;

  /** Internal implementation for config patching */
  _applyConfigPatch(changes: Record<string, any>): void;

  // === Public methods (shared across mixins) ===

  /** Get a node by ID */
  getNode(id: string): FlowNode | undefined;

  /** Get an edge by ID */
  getEdge(id: string): FlowEdge | undefined;

  /** Get the visible <path> element for an edge */
  getEdgePathElement(id: string): SVGPathElement | null;

  /** Get the container element for an edge (SVG group or parent) */
  getEdgeElement(id: string): SVGElement | HTMLElement | null;

  /** Add one or more nodes */
  addNodes(newNodes: FlowNode | FlowNode[], options?: { center?: boolean }): void;

  /** Remove nodes by ID */
  removeNodes(ids: string | string[]): void;

  /** Add one or more edges */
  addEdges(newEdges: FlowEdge | FlowEdge[]): void;

  /** Remove edges by ID */
  removeEdges(ids: string | string[]): void;

  /** Get outgoing connected nodes */
  getOutgoers(nodeId: string): FlowNode[];

  /** Get incoming connected nodes */
  getIncomers(nodeId: string): FlowNode[];

  /** Get all edges connected to a node */
  getConnectedEdges(nodeId: string): FlowEdge[];

  /** Check if two nodes are connected */
  areNodesConnected(nodeA: string, nodeB: string, directed?: boolean): boolean;

  /** Register a compute function for a node type */
  registerCompute(nodeType: string, definition: { compute: (inputs: Record<string, any>, nodeData: Record<string, any>) => Record<string, any> }): void;

  /** Run compute propagation through the graph */
  compute(startNodeId?: string): Map<string, Record<string, any>>;

  /** Validate a single parent node */
  validateParent(nodeId: string): { valid: boolean; errors: string[] };

  /** Validate all parent nodes */
  validateAll(): Map<string, { valid: boolean; errors: string[] }>;

  /** Get cached validation errors for a node */
  getValidationErrors(nodeId: string): string[];

  /** Reparent a node into a new parent (or detach) */
  reparentNode(nodeId: string, newParentId: string | null): boolean;

  /** Run child layout for a parent node */
  layoutChildren(parentId: string, optsOrExcludeId?: string | {
    excludeId?: string;
    omitFromComputation?: string;
    includeNode?: FlowNode;
    shallow?: boolean;
    stretchedSize?: Dimensions;
  }, shallow?: boolean, stretchedSize?: Dimensions): void;

  /** Walk up ancestor layout parents, calling layoutChildren(shallow) at each level */
  propagateLayoutUp(startParentId: string, opts?: {
    excludeId?: string;
    omitFromComputation?: string;
    includeNode?: FlowNode;
  }): void;

  /** Reorder a child within its layout parent */
  reorderChild(nodeId: string, newOrder: number): void;

  /** Set a node's rotation angle in degrees */
  rotateNode(id: string, angle: number): void;

  /** Collapse a node */
  collapseNode(id: string, options?: { animate?: boolean; recursive?: boolean }): void;

  /** Expand a collapsed node */
  expandNode(id: string, options?: { animate?: boolean }): void;

  /** Toggle collapse state */
  toggleNode(id: string, options?: { animate?: boolean; recursive?: boolean }): void;

  /** Check if a node is collapsed */
  isCollapsed(id: string): boolean;

  /** Get count of collapse targets */
  getCollapseTargetCount(id: string): number;

  /** Get descendant count for a node */
  getDescendantCount(id: string): number;

  /** Condense a node (summary view) */
  condenseNode(id: string): void;

  /** Uncondense a node (full row view) */
  uncondenseNode(id: string): void;

  /** Toggle condensed state */
  toggleCondense(id: string): void;

  /** Check if a node is condensed */
  isCondensed(id: string): boolean;

  /** Select a row by ID */
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

  /** Set row filter for a node */
  setRowFilter(nodeId: string, filter: RowFilter): void;

  /** Get row filter for a node */
  getRowFilter(nodeId: string): RowFilter;

  /** Get visible rows based on filter and edges */
  getVisibleRows(nodeId: string, schema: any[]): any[];

  /** Apply a node-level filter predicate */
  setNodeFilter(predicate: (node: FlowNode) => boolean): void;

  /** Clear node filter */
  clearNodeFilter(): void;

  /** Deselect all nodes, edges, and rows */
  deselectAll(): void;

  /** Convert screen coordinates to flow coordinates */
  screenToFlowPosition(x: number, y: number): XYPosition;

  /** Convert flow coordinates to screen coordinates */
  flowToScreenPosition(x: number, y: number): XYPosition;

  /** Fit all nodes into the viewport */
  fitView(options?: { padding?: number; duration?: number }, _retries?: number): void;

  /** Fit a specific rectangle into the viewport */
  fitBounds(rect: { x: number; y: number; width: number; height: number }, options?: { padding?: number; duration?: number }): void;

  /** Get bounding rectangle of nodes */
  getNodesBounds(nodeIds?: string[]): { x: number; y: number; width: number; height: number };

  /** Compute viewport that frames given bounds */
  getViewportForBounds(bounds: { x: number; y: number; width: number; height: number }, padding?: number): Viewport;

  /** Get container dimensions */
  getContainerDimensions(): { width: number; height: number };

  /** Current resolved color mode */
  readonly colorMode: 'light' | 'dark' | undefined;

  /** Get nodes whose bounding rect overlaps the given node */
  getIntersectingNodes(nodeOrId: FlowNode | string, partially?: boolean): FlowNode[];

  /** Check if two nodes' bounding rects overlap */
  isNodeIntersecting(nodeOrId: FlowNode | string, targetOrId: FlowNode | string, partially?: boolean): boolean;

  /** Set viewport programmatically */
  setViewport(viewport: Partial<Viewport>, options?: { duration?: number }): void;

  /** Zoom in by a step factor */
  zoomIn(options?: { duration?: number }): void;

  /** Zoom out by a step factor */
  zoomOut(options?: { duration?: number }): void;

  /** Center the viewport on a coordinate */
  setCenter(x: number, y: number, zoom?: number, options?: { duration?: number }): void;

  /** Pan by a delta */
  panBy(dx: number, dy: number, options?: { duration?: number }): void;

  /** Toggle interactivity */
  toggleInteractive(): void;

  /** Close the context menu */
  closeContextMenu(): void;

  /** Reset panels */
  resetPanels(): void;

  /** Copy selection to clipboard */
  copy(): void;

  /** Paste from clipboard */
  paste(): void;

  /** Cut selection */
  cut(): Promise<void>;

  /** Undo the last structural change */
  undo(): void;

  /** Redo the last undone change */
  redo(): void;

  /** Whether an undo operation is available */
  readonly canUndo: boolean;

  /** Whether a redo operation is available */
  readonly canRedo: boolean;

  /** Collaboration instance */
  readonly collab: any;

  /** Set the user-controlled loading state */
  setLoading(value: boolean): void;

  /** Update runtime config options */
  patchConfig(changes: Partial<PatchableConfig>): void;

  /** Update nodes, edges, and/or viewport. Duration 0 = instant (default). */
  update(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle;

  /** Animate nodes, edges, and/or viewport. Defaults to 300ms smooth transition. */
  animate(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle;

  /** Create a new timeline wired to this canvas */
  timeline(): FlowTimeline;

  /** Register a named animation */
  registerAnimation(name: string, steps: any[]): void;

  /** Unregister a named animation */
  unregisterAnimation(name: string): void;

  /** Play a named animation */
  playAnimation(name: string): Promise<void>;

  /** Track a target with the viewport camera */
  follow(target: string | FlowAnimationHandle | ParticleHandle | XYPosition, options?: FollowOptions): FlowAnimationHandle;

  /** Fire a particle along an edge path */
  sendParticle(edgeId: string, options?: Record<string, any>): ParticleHandle | undefined;

  /** Fire a particle along an arbitrary SVG path string */
  sendParticleAlongPath(svgPath: string, options?: ParticleOptions): ParticleHandle | undefined;

  /** Fire a particle along a straight line between two node centers */
  sendParticleBetween(sourceNodeId: string, targetNodeId: string, options?: ParticleOptions): ParticleHandle | undefined;

  /** Fire a burst of staggered particles along an edge */
  sendParticleBurst(edgeId: string, options: BurstOptions): ParticleBurstHandle;

  /** Fire particles from multiple edges converging on a target node */
  sendConverging(sourceEdgeIds: string[], options: ConvergingOptions): ConvergingHandle;

  /** Register a custom particle renderer by name */
  registerParticleRenderer(name: string, renderer: ParticleRenderer): void;

  /** Get the SVG element that hosts edge paths (for injecting temp paths) */
  getEdgeSvgElement(): SVGSVGElement | null;

  /** Get all tracked animation handles, optionally filtered by tag */
  getHandles(filter?: { tag?: string; tags?: string[] }): FlowAnimationHandle[];

  /** Cancel all animations matching a tag filter */
  cancelAll(filter: { tag?: string; tags?: string[] }, options?: StopOptions): void;

  /** Pause all animations matching a tag filter */
  pauseAll(filter: { tag?: string; tags?: string[] }): void;

  /** Resume all animations matching a tag filter */
  resumeAll(filter: { tag?: string; tags?: string[] }): void;

  /** Create a named group that auto-tags all animations made through it */
  group(name: string): FlowGroup;

  /** Create a transaction for grouped rollback of multiple animations */
  transaction(fn: () => Promise<void> | void): Transaction;

  /** Capture current canvas state. Call restore() to revert */
  snapshot(): { restore: () => void };

  /** Record canvas animation events during fn() execution. Returns a Recording */
  record(fn: () => Promise<void> | void, options?: RecordOptions): Promise<Recording>;

  /** Replay a previously recorded Recording on this canvas. Returns a ReplayHandle */
  replay(recording: Recording, options?: ReplayOptions): ReplayHandle;

  /** Dagre layout */
  layout(options?: { direction?: 'TB' | 'LR' | 'BT' | 'RL'; nodesep?: number; ranksep?: number; adjustHandles?: boolean; fitView?: boolean; duration?: number }): Promise<void>;

  /** Force-directed layout */
  forceLayout(options?: { strength?: number; distance?: number; charge?: number; iterations?: number; center?: { x: number; y: number }; fitView?: boolean; duration?: number }): Promise<void>;

  /** Hierarchy/tree layout */
  treeLayout(options?: { layoutType?: string; direction?: string; nodeWidth?: number; nodeHeight?: number; adjustHandles?: boolean; fitView?: boolean; duration?: number }): Promise<void>;

  /** ELK layout */
  elkLayout(options?: { algorithm?: string; direction?: string; nodeSpacing?: number; layerSpacing?: number; adjustHandles?: boolean; fitView?: boolean; duration?: number }): Promise<void>;

  /** Serialize flow state */
  toObject(): { nodes: FlowNode[]; edges: FlowEdge[]; viewport: Viewport };

  /** Restore flow state from a saved object */
  fromObject(obj: { nodes?: FlowNode[]; edges?: FlowEdge[]; viewport?: Partial<Viewport> }): void;

  /** Reset to initial config state */
  $reset(): void;

  /** Clear all nodes and edges */
  $clear(): void;

  /** Export as image */
  toImage(options?: ToImageOptions): Promise<string>;

  // === Alpine magic properties (available at runtime) ===

  /** Alpine reactive $el — captured as _container during init */
  $el: HTMLElement;

  /** Alpine $nextTick */
  $nextTick(callback: () => void): void;

  /** Alpine $watch */
  $watch(property: string, callback: (value: any) => void): void;

  /** Alpine $store */
  $store: Record<string, any>;
}

