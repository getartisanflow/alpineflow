// ============================================================================
// Test Utilities — mockCtx() for per-mixin unit tests
//
// Creates a CanvasContext with sensible defaults and vi.fn() stubs for all
// helper methods. Accepts Partial<CanvasContext> overrides.
// ============================================================================

import { vi } from 'vitest';
import type { CanvasContext, ActiveParticle, ContextMenuState } from './canvas-context';
import type { FlowNode, FlowEdge, Viewport, Dimensions, XYPosition } from '../../core/types';
import type { CollapseState } from '../../core/collapse';

/**
 * Create a mock CanvasContext with sensible defaults for unit tests.
 *
 * All internal helper methods are stubbed with `vi.fn()`.
 * Pass `overrides` to customize specific properties or provide
 * pre-populated nodes/edges/maps.
 */
export function mockCtx(overrides: Partial<CanvasContext> = {}): CanvasContext {
  const ctx: CanvasContext = {
    // === Reactive state ===
    _id: 'flow-test',
    nodes: [] as FlowNode[],
    edges: [] as FlowEdge[],
    viewport: { x: 0, y: 0, zoom: 1 } as Viewport,
    ready: true,
    _userLoading: false,
    _loadingText: 'Loading\u2026',
    _autoLoadingOverlay: null,
    get isLoading() { return !this.ready || this._userLoading; },
    isInteractive: true,
    pendingConnection: null,
    _pendingReconnection: null,

    // === Selection state ===
    selectedNodes: new Set<string>(),
    selectedEdges: new Set<string>(),
    selectedRows: new Set<string>(),
    contextMenu: {
      show: false,
      type: null,
      x: 0,
      y: 0,
      node: null,
      edge: null,
      position: null,
      nodes: null,
    } as ContextMenuState,

    // === Maps & caches ===
    _nodeMap: new Map<string, FlowNode>(),
    _initialDimensions: new Map<string, Dimensions>(),
    _edgeMap: new Map<string, FlowEdge>(),
    _validationErrorCache: new Map<string, string[]>(),
    _collapseState: new Map<string, CollapseState>(),

    // === Config & DOM elements ===
    _config: {} as any,
    _shortcuts: {
      delete: ['Delete', 'Backspace'],
      selectionBox: 'Shift',
      multiSelect: 'Shift',
      moveNodes: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
      moveStep: 5,
      moveStepModifier: 'Shift',
      moveStepMultiplier: 4,
      copy: 'c',
      paste: 'v',
      cut: 'x',
      undo: 'z',
      redo: 'z',
      escape: 'Escape',
      selectionModeToggle: 'Alt',
      selectionToolToggle: 'l',
    },
    _shapeRegistry: {},
    _container: null,
    _viewportEl: null,
    _markerDefsEl: null,
    _containerStyles: null,
    _nodeElements: new Map<string, HTMLElement>(),
    _edgeSvgElements: new Map<string, SVGSVGElement>(),

    // === Subsystems ===
    _panZoom: null,
    _history: null,
    _announcer: null,
    _computeEngine: {
      registerCompute: vi.fn(),
      compute: vi.fn(() => new Map()),
      hasCompute: vi.fn(() => false),
    } as any,
    _computeDebounceTimer: null,
    _animator: null,
    _minimap: null,
    _controls: null,
    _selectionBox: null,
    _lasso: null,
    _colorModeHandle: null,

    // === Animation state ===
    _animationLocked: false,
    _activeTimelines: new Set(),
    _animationRegistry: new Map<string, Record<string, unknown>[]>(),
    _followHandle: null,

    // === Particle state ===
    _activeParticles: new Set<ActiveParticle>(),
    _particleEngineHandle: null,

    // === Selection tool state ===
    _selectionTool: 'box',
    _onSelectionPointerDown: null,
    _onSelectionPointerMove: null,
    _onSelectionPointerUp: null,
    _selectionShiftHeld: false,
    _selectionEffectiveMode: 'partial',
    _suppressNextCanvasClick: false,

    // === Touch state ===
    _longPressCleanup: null,
    _touchSelectionMode: false,
    _touchSelectionCleanup: null,

    // === Event handler references ===
    _onKeyDown: null,
    _onContainerPointerDown: null,
    _onCanvasClick: null,
    _onCanvasContextMenu: null,
    _contextMenuBackdrop: null,
    _contextMenuListeners: [],

    // === Drop zone ===
    _onDropZoneDragOver: null,
    _onDropZoneDrop: null,

    // === Canvas focus state ===
    _active: false,

    // === Zoom level ===
    _zoomLevel: 'close',

    // === Viewport culling ===
    _visibleNodeIds: new Set<string>(),

    // === Background ===
    _background: 'dots',
    _backgroundGap: null,
    _patternColorOverride: null,
    backgroundStyle() {
      return { backgroundImage: '', backgroundSize: '', backgroundPosition: '' };
    },

    // === Hydration ===
    _hydratedFromStatic: false,

    // === Layout animation ===
    _layoutAnimTick: 0,
    _layoutAnimFrame: 0,

    // === Auto-Layout state ===
    _autoLayoutTimer: null,
    _autoLayoutReady: false,
    _autoLayoutFailed: false,

    // === Internal helpers (all vi.fn() stubs) ===
    _emit: vi.fn(),
    _warn: vi.fn(),
    _emitSelectionChange: vi.fn(),
    _rebuildNodeMap: vi.fn(),
    _rebuildEdgeMap: vi.fn(),
    _captureHistory: vi.fn(),
    _suspendHistory: vi.fn(),
    _resumeHistory: vi.fn(),
    _getChildValidation: vi.fn(() => undefined),
    _recomputeChildValidation: vi.fn(),
    _syncAnimationState: vi.fn(),
    _applyBackground: vi.fn(),
    _applyCulling: vi.fn(),
    _getVisibleNodeIds: vi.fn(() => new Set<string>()),
    _applyZoomLevel: vi.fn(),
    getAbsolutePosition: vi.fn((nodeId: string) => ({ x: 0, y: 0 })),
    _setupMarkerDefs: vi.fn(),
    _updateMarkerDefs: vi.fn(),
    _flushNodePositions: vi.fn(),
    _flushNodeStyles: vi.fn(),
    _flushEdgeStyles: vi.fn(),
    _flushViewport: vi.fn(),
    _refreshEdgePaths: vi.fn(),
    _hydrateFromStatic: vi.fn(),
    _scheduleAutoLayout: vi.fn(),
    _runAutoLayout: vi.fn(async () => {}),
    _getBackgroundGap: vi.fn(() => 20),
    _resolveBackgroundLayers: vi.fn(() => []),
    _applyLayout: vi.fn(),
    _adjustHandlePositions: vi.fn(),
    _deleteSelected: vi.fn(async () => {}),
    _tickParticles: vi.fn(() => true),
    _applyConfigPatch: vi.fn(),

    // === Public methods (vi.fn() stubs) ===
    getNode: vi.fn((id: string) => undefined),
    getEdge: vi.fn((id: string) => {
      // Look up edge in _edgeMap, fallback to edges array for backwards compatibility
      return (ctx as any)._edgeMap?.get(id) ?? ctx.edges.find((e: FlowEdge) => e.id === id);
    }),
    getEdgePathElement: vi.fn(() => null),
    getEdgeElement: vi.fn(() => null),
    addNodes: vi.fn(),
    removeNodes: vi.fn(),
    addEdges: vi.fn(),
    removeEdges: vi.fn(),
    getOutgoers: vi.fn(() => []),
    getIncomers: vi.fn(() => []),
    getConnectedEdges: vi.fn(() => []),
    areNodesConnected: vi.fn(() => false),
    registerCompute: vi.fn(),
    compute: vi.fn(() => new Map()),
    validateParent: vi.fn(() => ({ valid: true, errors: [] })),
    validateAll: vi.fn(() => new Map()),
    getValidationErrors: vi.fn(() => []),
    reparentNode: vi.fn(() => true),
    layoutChildren: vi.fn(),
    propagateLayoutUp: vi.fn(),
    reorderChild: vi.fn(),
    rotateNode: vi.fn(),
    collapseNode: vi.fn(),
    expandNode: vi.fn(),
    toggleNode: vi.fn(),
    isCollapsed: vi.fn(() => false),
    getCollapseTargetCount: vi.fn(() => 0),
    getDescendantCount: vi.fn(() => 0),
    condenseNode: vi.fn(),
    uncondenseNode: vi.fn(),
    toggleCondense: vi.fn(),
    isCondensed: vi.fn(() => false),
    selectRow: vi.fn(),
    deselectRow: vi.fn(),
    toggleRowSelect: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    isRowSelected: vi.fn(() => false),
    deselectAllRows: vi.fn(),
    setRowFilter: vi.fn(),
    getRowFilter: vi.fn(() => 'all' as const),
    getVisibleRows: vi.fn((nodeId: string, schema: any[]) => schema),
    setNodeFilter: vi.fn(),
    clearNodeFilter: vi.fn(),
    deselectAll: vi.fn(),
    screenToFlowPosition: vi.fn(() => ({ x: 0, y: 0 })),
    flowToScreenPosition: vi.fn(() => ({ x: 0, y: 0 })),
    fitView: vi.fn(),
    fitBounds: vi.fn(),
    getNodesBounds: vi.fn(() => ({ x: 0, y: 0, width: 0, height: 0 })),
    getViewportForBounds: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
    getContainerDimensions: vi.fn(() => ({ width: 800, height: 600 })),
    get colorMode() { return undefined; },
    getIntersectingNodes: vi.fn(() => []),
    isNodeIntersecting: vi.fn(() => false),
    setViewport: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    setCenter: vi.fn(),
    panBy: vi.fn(),
    toggleInteractive: vi.fn(),
    closeContextMenu: vi.fn(),
    resetPanels: vi.fn(),
    copy: vi.fn(),
    paste: vi.fn(),
    cut: vi.fn(async () => {}),
    undo: vi.fn(),
    redo: vi.fn(),
    get canUndo() { return false; },
    get canRedo() { return false; },
    get collab() { return undefined; },
    setLoading: vi.fn(),
    patchConfig: vi.fn(),
    update: vi.fn(() => ({
      pause: vi.fn(),
      resume: vi.fn(),
      stop: vi.fn(),
      reverse: vi.fn(),
      finished: Promise.resolve(),
    })),
    animate: vi.fn(() => ({
      pause: vi.fn(),
      resume: vi.fn(),
      stop: vi.fn(),
      reverse: vi.fn(),
      finished: Promise.resolve(),
    })),
    timeline: vi.fn(() => ({
      step: vi.fn(),
      parallel: vi.fn(),
      play: vi.fn(() => Promise.resolve()),
      on: vi.fn(),
      locked: false,
    })) as any,
    registerAnimation: vi.fn(),
    unregisterAnimation: vi.fn(),
    playAnimation: vi.fn(async () => {}),
    follow: vi.fn(() => ({
      pause: vi.fn(),
      resume: vi.fn(),
      stop: vi.fn(),
      reverse: vi.fn(),
      finished: Promise.resolve(),
    })),
    sendParticle: vi.fn(() => undefined),
    layout: vi.fn(async () => {}),
    forceLayout: vi.fn(async () => {}),
    treeLayout: vi.fn(async () => {}),
    elkLayout: vi.fn(async () => {}),
    toObject: vi.fn(() => ({ nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } })),
    fromObject: vi.fn(),
    $reset: vi.fn(),
    $clear: vi.fn(),
    toImage: vi.fn(async () => ''),

    // === Alpine magic properties ===
    $el: null as any,
    $nextTick: vi.fn((cb: () => void) => cb()),
    $watch: vi.fn(),
    $store: { flow: { register: vi.fn(), unregister: vi.fn(), activate: vi.fn(), instances: {} } },

    // Spread overrides last to allow customization
    ...overrides,
  };

  return ctx;
}
