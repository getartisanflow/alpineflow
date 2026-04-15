// ============================================================================
// flowCanvas — Alpine Data Component (Orchestrator)
//
// The primary data component that manages flow state: nodes, edges, viewport.
// Registers as Alpine.data('flowCanvas') and sets up pan/zoom on the container.
//
// Method implementations live in mixin modules (canvas-nodes, canvas-edges,
// canvas-viewport, canvas-selection, canvas-history, canvas-animation,
// canvas-collapse, canvas-condense, canvas-rows, canvas-layout,
// canvas-validation, canvas-compute, canvas-dom, canvas-config). This
// orchestrator file declares
// reactive state, shared helpers, lifecycle (init/destroy), and wires
// the mixin methods flat onto the Alpine data object via Object.defineProperties.
// ============================================================================

import type { Alpine } from 'alpinejs';
import type {
  FlowNode,
  FlowEdge,
  Viewport,
  XYPosition,
  Dimensions,
  FlowCanvasConfig,
  PendingReconnection,
  PatchableConfig,
} from '../../core/types';
import { createPanZoom, type PanZoomInstance } from '../../core/pan-zoom';
import { screenToFlowPosition, getVisibleBounds } from '../../core/geometry';
import { setDebugEnabled, debug } from '../../core/debug';
import { DEFAULT_FIT_PADDING } from '../../core/constants';
import { FlowHistory } from '../../core/history';
import type { FlowTimeline } from '../../animate/timeline';
import { engine, type EngineHandle } from '../../animate/engine';
import { Animator } from '../../animate/animator';
import { normalizeMarker, getMarkerId, getMarkerSvg, registerMarker } from '../../core/markers';
import type { CustomMarkerRenderer } from '../../core/markers';
import { createMiniMap, type MiniMapInstance } from '../../core/minimap';
import { createControlsPanel, type ControlsPanelInstance } from '../../core/controls-panel';
import { createSelectionBox, type SelectionBoxInstance } from '../../core/selection-box';
import { createLasso, type LassoInstance } from '../../core/lasso';
import { getNodesInPolygon, getNodesFullyInPolygon, pointInPolygon } from '../../core/lasso-hit-test';
import { clearValidationClasses } from '../directives/flow-handle';
import { resolveShortcuts, matchesKey, matchesModifier } from '../../core/keyboard-shortcuts';
import { isDraggable, isSelectable } from '../../core/node-flags';
import { attachLongPress } from '../../core/long-press';
import { getNodesInRect, getNodesFullyInRect } from '../../core/geometry';
import {
  buildNodeMap,
  getAbsolutePosition as getAbsolutePositionUtil,
  toAbsoluteNodes,
  sortNodesTopological,
} from '../../core/sub-flow';
import type { CollapseState } from '../../core/collapse';
import { builtinShapes } from '../../core/shapes';
import { createColorMode, type ColorModeHandle } from '../../core/color-mode';
import type { CollabConfig } from '../../collab/types';
import { collabStore } from '../../collab/store';
import { getAddon } from '../../core/registry';
import { FlowAnnouncer } from '../../core/announcer';
import { ComputeEngine } from '../../core/compute';
import { registerWireEvents, registerWireCommands, registerCustomWireCommands } from '../../core/wire-bridge';
import { createLayoutDedup, type LayoutDedup } from './canvas-layout-dedup';
import { createBatch } from './canvas-batch';

// ── Mixin factories ──────────────────────────────────────────────────────────
import { createNodesMixin } from './canvas-nodes';
import { createEdgesMixin } from './canvas-edges';
import { createViewportMixin } from './canvas-viewport';
import { createSelectionMixin } from './canvas-selection';
import { createHistoryMixin } from './canvas-history';
import { createAnimationMixin } from './canvas-animation';
import { createCollapseMixin } from './canvas-collapse';
import { createCondenseMixin } from './canvas-condense';
import { createRowsMixin } from './canvas-rows';
import { createLayoutMixin } from './canvas-layout';
import { createValidationMixin } from './canvas-validation';
import { createComputeMixin } from './canvas-compute';
import { createDomMixin } from './canvas-dom';
import { createConfigMixin } from './canvas-config';
import type { CanvasContext, ActiveParticle } from './canvas-context';

let instanceCounter = 0;

// ── Background layer helpers ───────────────────────────────────────────────
type BgVariant = 'dots' | 'lines' | 'cross';

interface ResolvedBgLayer {
  variant: BgVariant;
  gap: number;
  color: string;
}

function bgLayerGradient(variant: BgVariant, color: string): string {
  switch (variant) {
    case 'lines':
    case 'cross':
      return `linear-gradient(0deg, ${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;
    case 'dots':
    default:
      return `radial-gradient(circle, ${color} 1px, transparent 1px)`;
  }
}

export function registerFlowCanvas(Alpine: Alpine) {
  Alpine.data('flowCanvas', (config: FlowCanvasConfig = {}) => {
    const self: Record<string, any> = {
    // ── Reactive State ────────────────────────────────────────────────
    /** Unique instance ID for SVG marker dedup, etc. */
    _id: `flow-${++instanceCounter}`,

    nodes: config.nodes ?? [] as FlowNode[],
    edges: config.edges ?? [] as FlowEdge[],
    viewport: {
      x: config.viewport?.x ?? 0,
      y: config.viewport?.y ?? 0,
      zoom: config.viewport?.zoom ?? 1,
    } as Viewport,

    /** Whether the canvas has completed initialization and first node measurement */
    ready: false,

    /** User-controlled loading flag, initialized from config.loading */
    _userLoading: (config.loading ?? false) as boolean,

    /** Custom text for the default loading indicator */
    _loadingText: (config.loadingText ?? 'Loading\u2026') as string,

    /** Auto-injected loading overlay element (when config.loading: true and no directive) */
    _autoLoadingOverlay: null as HTMLElement | null,

    /** True when the canvas is still initializing OR the user has set loading */
    get isLoading(): boolean {
      return !this.ready || this._userLoading;
    },

    /** Whether interactivity (pan/zoom/drag) is enabled */
    isInteractive: true,

    /** Currently active connection drag, or null */
    pendingConnection: null as { source: string; sourceHandle?: string; position: XYPosition } | null,

    /** Currently active edge reconnection drag, or null */
    _pendingReconnection: null as PendingReconnection | null,

    /** Set of selected node IDs */
    selectedNodes: new Set<string>(),

    /** Set of selected edge IDs */
    selectedEdges: new Set<string>(),

    /** Set of selected row IDs (format: nodeId.attrId) */
    selectedRows: new Set<string>(),

    /** Context menu state — populated automatically by context menu events */
    contextMenu: {
      show: false,
      type: null as string | null,
      x: 0,
      y: 0,
      node: null as FlowNode | null,
      edge: null as FlowEdge | null,
      position: null as XYPosition | null,
      nodes: null as FlowNode[] | null,
      event: null as MouseEvent | null,
    },

    // ── Shape Registry ─────────────────────────────────────────────────
    _shapeRegistry: { ...builtinShapes, ...config.shapeTypes } as Record<string, import('../../core/types').ShapeDefinition>,

    // ── Background ────────────────────────────────────────────────────
    _background: config.background ?? 'dots' as FlowCanvasConfig['background'],
    _backgroundGap: config.backgroundGap ?? null as number | null,
    _patternColorOverride: config.patternColor ?? null as string | null,

    _getBackgroundGap(): number {
      if (this._backgroundGap !== null) {
        return this._backgroundGap;
      }
      if (this._container) {
        const raw = getComputedStyle(this._container).getPropertyValue('--flow-bg-pattern-gap').trim();
        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      return 20;
    },

    _resolveBackgroundLayers(): ResolvedBgLayer[] {
      const bg = this._background;
      if (!bg || bg === 'none') return [];

      const defaultGap = this._getBackgroundGap();
      const defaultColor = this._patternColorOverride ?? 'var(--flow-bg-pattern-color)';

      if (Array.isArray(bg)) {
        return bg.map((layer: any) => ({
          variant: layer.variant ?? 'dots',
          gap: layer.gap ?? defaultGap,
          color: layer.color ?? defaultColor,
        }));
      }

      return [{ variant: bg as BgVariant, gap: defaultGap, color: defaultColor }];
    },

    backgroundStyle(): { backgroundImage: string; backgroundSize: string; backgroundPosition: string } {
      const layers = this._resolveBackgroundLayers();
      if (layers.length === 0) return { backgroundImage: '', backgroundSize: '', backgroundPosition: '' };

      const z = this.viewport.zoom;
      const posX = this.viewport.x;
      const posY = this.viewport.y;

      const images: string[] = [];
      const sizes: string[] = [];
      const positions: string[] = [];

      for (const layer of layers) {
        const gap = layer.gap * z;
        const effectiveGap = layer.variant === 'cross' ? gap / 2 : gap;
        images.push(bgLayerGradient(layer.variant, layer.color));
        if (layer.variant === 'lines' || layer.variant === 'cross') {
          sizes.push(`${effectiveGap}px ${effectiveGap}px, ${effectiveGap}px ${effectiveGap}px`);
          positions.push(`${posX}px ${posY}px, ${posX}px ${posY}px`);
        } else {
          sizes.push(`${gap}px ${gap}px`);
          positions.push(`${posX}px ${posY}px`);
        }
      }

      return {
        backgroundImage: images.join(', '),
        backgroundSize: sizes.join(', '),
        backgroundPosition: positions.join(', '),
      };
    },

    // ── Internal ──────────────────────────────────────────────────────
    // Strip collab from stored config — provider objects may contain
    // circular references (e.g. InMemoryProvider.peer) that crash
    // Alpine's deep-reactive proxy walker.
    _config: (() => { const { collab: _, ...rest } = config; return rest; })() as FlowCanvasConfig,
    _shortcuts: resolveShortcuts(config.keyboardShortcuts),
    _container: null as HTMLElement | null,
    _panZoom: null as PanZoomInstance | null,
    _onKeyDown: null as ((e: KeyboardEvent) => void) | null,
    _active: false,
    _zoomLevel: 'close' as 'far' | 'medium' | 'close',
    _onContainerPointerDown: null as ((e: PointerEvent) => void) | null,
    _onCanvasClick: null as ((e: MouseEvent) => void) | null,
    _onCanvasContextMenu: null as ((e: MouseEvent) => void) | null,
    _contextMenuBackdrop: null as HTMLElement | null,
    _markerDefsEl: null as SVGSVGElement | null,
    _minimap: null as MiniMapInstance | null,
    _controls: null as ControlsPanelInstance | null,
    _selectionBox: null as SelectionBoxInstance | null,
    _lasso: null as LassoInstance | null,
    _selectionTool: 'box' as 'box' | 'lasso',
    _onSelectionPointerDown: null as ((e: PointerEvent) => void) | null,
    _onSelectionPointerMove: null as ((e: PointerEvent) => void) | null,
    _onSelectionPointerUp: null as ((e: PointerEvent) => void) | null,
    _selectionShiftHeld: false,
    _selectionEffectiveMode: 'partial' as 'partial' | 'full',
    _suppressNextCanvasClick: false,
    /** Cleanup function for long-press listener */
    _longPressCleanup: null as (() => void) | null,
    /** Whether touch selection mode is currently active */
    _touchSelectionMode: false,
    /** Cleanup function for touch selection mode listeners */
    _touchSelectionCleanup: null as (() => void) | null,
    _nodeMap: new Map<string, FlowNode>(),
    /** Stores each node's originally configured dimensions (before layout stretch). */
    _initialDimensions: new Map<string, Dimensions>(),
    _edgeMap: new Map<string, FlowEdge>(),
    _viewportEl: null as HTMLElement | null,
    _history: null as FlowHistory | null,
    _announcer: null as FlowAnnouncer | null,
    _computeEngine: new ComputeEngine(),
    _computeDebounceTimer: null as ReturnType<typeof setTimeout> | null,
    _animationLocked: false,
    _activeTimelines: new Set<FlowTimeline>(),
    _animationRegistry: new Map<string, Record<string, unknown>[]>(),
    _followHandle: null as EngineHandle | null,
    _animator: null as Animator | null,
    /** Saved pre-collapse state per group node ID */
    _collapseState: new Map<string, CollapseState>(),
    /** Whether this canvas was hydrated from a pre-rendered static diagram */
    _hydratedFromStatic: false,

    // ── Layout Dedup ─────────────────────────────────────────────────────
    _layoutDedup: null as LayoutDedup | null,

    // ── Shared Particle Loop ────────────────────────────────────────────
    _activeParticles: new Set<ActiveParticle>(),
    _particleEngineHandle: null as EngineHandle | null,
    /** Live CSSStyleDeclaration for the container — cached to avoid per-particle getComputedStyle calls. */
    _containerStyles: null as CSSStyleDeclaration | null,

    // ── Color Mode ────────────────────────────────────────────────────
    _colorModeHandle: null as ColorModeHandle | null,

    // ── Child Validation ─────────────────────────────────────────────
    _validationErrorCache: new Map() as Map<string, string[]>,

    // ── Layout animation edge refresh ─────────────────────────────────
    /** Reactive tick bumped each frame during layout animation so edges re-measure DOM. */
    _layoutAnimTick: 0,
    _layoutAnimFrame: 0,

    // ── Auto-Layout ──────────────────────────────────────────────────
    _autoLayoutTimer: null as ReturnType<typeof setTimeout> | null,
    _autoLayoutReady: false,
    _autoLayoutFailed: false,

    // ── Viewport Culling (CSS-only, outside Alpine reactive system) ────
    _nodeElements: new Map<string, HTMLElement>(),
    _edgeSvgElements: new Map<string, SVGSVGElement>(),
    _visibleNodeIds: new Set<string>(),

    // ── Context Menu Auto-Populate ─────────────────────────────────────
    _contextMenuListeners: [] as Array<{ event: string; handler: EventListener }>,

    // ── Drop Zone ───────────────────────────────────────────────────────
    _onDropZoneDragOver: null as ((e: DragEvent) => void) | null,
    _onDropZoneDrop: null as ((e: DragEvent) => void) | null,

    // ── Event Dispatch ────────────────────────────────────────────────
    /**
     * Emit an event: debug log it, invoke the config callback, and
     * dispatch a DOM CustomEvent (flow-xxx) for Alpine @flow-xxx listeners.
     */
    _emit(event: string, detail?: any) {
      debug('event', event, detail);

      // Config callback: 'node-click' → 'onNodeClick'
      const callbackName = 'on' + event.split('-').map(
        (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
      ).join('');
      const callback = (config as any)[callbackName];
      if (typeof callback === 'function') {
        callback(detail);
      }

      // DOM event: catchable via @flow-node-click, @flow-connect, etc.
      this._container?.dispatchEvent(new CustomEvent(`flow-${event}`, {
        bubbles: true,
        detail,
      }));

      // Screen reader announcement
      this._announcer?.handleEvent(event, detail ?? {});

      // Auto-compute propagation
      if (config.computeMode === 'auto' && (event === 'nodes-change' || event === 'edges-change')) {
        if (this._computeDebounceTimer) clearTimeout(this._computeDebounceTimer);
        this._computeDebounceTimer = setTimeout(() => {
          this._computeDebounceTimer = null;
          this.compute();
        }, 16);
      }
    },

    /** Route a warning through the onError callback (if set) and console.warn. */
    _warn(code: string, message: string) {
      if (typeof config.onError === 'function') {
        config.onError(code, message);
      }
      console.warn(`[AlpineFlow] ${message}`);
    },

    _emitSelectionChange() {
      this._emit('selection-change', {
        nodes: [...this.selectedNodes],
        edges: [...this.selectedEdges],
        rows: [...this.selectedRows],
      });
    },

    _rebuildNodeMap() {
      this._nodeMap = buildNodeMap(this.nodes);
    },

    _rebuildEdgeMap() {
      this._edgeMap = new Map(this.edges.map((e: FlowEdge) => [e.id, e]));
    },

    /**
     * Hydrate from a pre-rendered static diagram.
     * Reads the render plan from data-flow-plan, populates node dimensions and
     * viewport from it, then strips the static markers so normal reactivity takes over.
     */
    _hydrateFromStatic() {
      const planAttr = this._container.getAttribute('data-flow-plan');
      if (!planAttr) return;

      let plan: any;
      try {
        plan = JSON.parse(planAttr);
      } catch {
        return;
      }

      // Populate node dimensions from the render plan
      const planNodeMap = new Map<string, { width: number; height: number }>();
      for (const pn of plan.nodes ?? []) {
        planNodeMap.set(pn.id, { width: pn.width, height: pn.height });
      }

      for (const node of this.nodes as FlowNode[]) {
        const dims = planNodeMap.get(node.id);
        if (dims && !node.dimensions) {
          node.dimensions = { width: dims.width, height: dims.height };
          this._initialDimensions.set(node.id, { ...dims });
        }
      }

      // Set viewport from plan
      if (plan.viewport) {
        this.viewport.x = plan.viewport.x;
        this.viewport.y = plan.viewport.y;
        this.viewport.zoom = plan.viewport.zoom;
      }

      this._hydratedFromStatic = true;

      // Clean up static attributes
      this._container.removeAttribute('data-flow-static');
      this._container.removeAttribute('data-flow-plan');
      this._container.classList.remove('flow-static');
    },

    _captureHistory() {
      this._history?.capture({ nodes: this.nodes, edges: this.edges });
    },

    _suspendHistory() {
      this._history?.suspend();
    },

    _resumeHistory() {
      this._history?.resume();
    },

    _applyBackground() {
      const el = this._container;
      if (!el) return;
      const style = this.backgroundStyle();
      Object.assign(el.style, {
        backgroundImage: style.backgroundImage,
        backgroundSize: style.backgroundSize,
        backgroundPosition: style.backgroundPosition,
      });
    },

    /**
     * Toggle CSS display on off-screen nodes and edges.
     * Called from onTransformChange — entirely outside Alpine's reactive system.
     */
    _applyCulling() {
      if (config.viewportCulling !== true) return;
      if (!this._container) return;

      const cw = this._container.clientWidth;
      const ch = this._container.clientHeight;
      if (cw === 0 || ch === 0) return;

      const buffer = config.cullingBuffer ?? 100;
      const bounds = getVisibleBounds(this.viewport, cw, ch, buffer);

      const visible = new Set<string>();

      for (const node of this.nodes as FlowNode[]) {
        if (node.hidden) continue;
        const w = node.dimensions?.width ?? 150;
        const h = node.dimensions?.height ?? 50;
        const pos = node.parentId
          ? getAbsolutePositionUtil(node, this._nodeMap, this._config.nodeOrigin)
          : node.position;
        const isVisible = !(
          pos.x + w < bounds.minX ||
          pos.x > bounds.maxX ||
          pos.y + h < bounds.minY ||
          pos.y > bounds.maxY
        );

        if (isVisible) visible.add(node.id);

        const el = this._nodeElements.get(node.id);
        if (el) {
          el.style.display = isVisible ? '' : 'none';
        }
      }

      this._visibleNodeIds = visible;
    },

    _getVisibleNodeIds(): Set<string> {
      return this._visibleNodeIds;
    },

    _applyZoomLevel(zoom: number) {
      if (config.zoomLevels === false) return;
      const farThreshold = config.zoomLevels?.far ?? 0.4;
      const medThreshold = config.zoomLevels?.medium ?? 0.75;
      const newLevel: 'far' | 'medium' | 'close' =
        zoom < farThreshold ? 'far' : zoom < medThreshold ? 'medium' : 'close';
      if (newLevel !== this._zoomLevel) {
        this._zoomLevel = newLevel;
        this._container?.setAttribute('data-zoom-level', newLevel);
      }
    },

    getAbsolutePosition(nodeId: string): XYPosition {
      const node = this._nodeMap.get(nodeId);
      if (!node) {
        return { x: 0, y: 0 };
      }
      return getAbsolutePositionUtil(node, this._nodeMap, this._config.nodeOrigin);
    },

    // ── Init Helpers ─────────────────────────────────────────────────

    /** Enable debug logging if configured. */
    _initDebug() {
      if (config.debug) {
        setDebugEnabled(true);
      }
    },

    /** Set up container element, attributes, CSS custom properties, animator. */
    _initContainer() {
      this._container = this.$el as HTMLElement;
      this._container.setAttribute('data-flow-canvas', '');
      if (config.fitViewOnInit) {
        this._container.setAttribute('data-fit-view', '');
      }
      this._container.setAttribute('role', 'application');
      this._container.setAttribute('aria-label', config.ariaLabel ?? 'Flow diagram');
      this._containerStyles = getComputedStyle(this._container);
      this._animator = new Animator(engine);

      // Apply explicit background config as CSS custom properties
      if (config.patternColor) {
        this._container.style.setProperty('--flow-bg-pattern-color', config.patternColor);
      }
      if (config.backgroundGap) {
        this._container.style.setProperty('--flow-bg-pattern-gap', String(config.backgroundGap));
      }

      // Set initial zoom level attribute
      this._applyZoomLevel(this.viewport.zoom);
    },

    /** Create color mode handle if configured. */
    _initColorMode() {
      if (config.colorMode) {
        this._colorModeHandle = createColorMode(this._container, config.colorMode);
      }
    },

    /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
    _initHydration() {
      // Hydrate from pre-rendered static HTML if present
      if (this._container.hasAttribute('data-flow-static')) {
        this._hydrateFromStatic();
      }

      // Sort nodes parent-first and build lookup maps
      this.nodes = sortNodesTopological(this.nodes);
      this._rebuildNodeMap();
      this._rebuildEdgeMap();

      // Capture configured dimensions before layout stretch modifies them
      for (const node of this.nodes as FlowNode[]) {
        if (node.dimensions) {
          this._initialDimensions.set(node.id, { ...node.dimensions });
        }
      }
    },

    /** Create FlowHistory if configured. */
    _initHistory() {
      if (config.history) {
        this._history = new FlowHistory(config.historyMaxSize ?? 50);
      }
    },

    /** Create screen reader announcer. */
    _initAnnouncer() {
      if (config.announcements !== false && this._container) {
        const formatFn = typeof config.announcements === 'object'
          ? config.announcements.formatMessage
          : undefined;
        this._announcer = new FlowAnnouncer(this._container, formatFn);
      }
    },

    /** Set up collaboration bridge via collab addon plugin. */
    _initCollab() {
      if (config.collab && this._container) {
        const collabFactory = getAddon('collab');
        if (!collabFactory) {
          console.error('[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)');
          return;
        }

        const container = this._container;
        const { Doc, Awareness, CollabBridge, CollabAwareness } = collabFactory;

        const collabConfig = config.collab as CollabConfig;
        const doc = new Doc();
        const awareness = new Awareness(doc);

        const bridge = new CollabBridge(doc, this, collabConfig.provider);
        const collabAwareness = new CollabAwareness(awareness, collabConfig.user);
        collabStore.set(container, { bridge, awareness: collabAwareness, doc });

        collabConfig.provider.connect(doc, awareness);

        if (collabConfig.cursors !== false) {
          let cursorThrottled = false;
          const throttleMs = collabConfig.throttle ?? 20;
          const onMouseMove = (e: MouseEvent) => {
            if (cursorThrottled) return;
            cursorThrottled = true;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.viewport.x) / this.viewport.zoom;
            const y = (e.clientY - rect.top - this.viewport.y) / this.viewport.zoom;
            collabAwareness.updateCursor({ x, y });
            setTimeout(() => { cursorThrottled = false; }, throttleMs);
          };
          const onMouseLeave = () => {
            collabAwareness.updateCursor(null);
          };
          container.addEventListener('mousemove', onMouseMove);
          container.addEventListener('mouseleave', onMouseLeave);
          const entry = collabStore.get(container)!;
          entry.cursorCleanup = () => {
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseLeave);
          };
        }
      }
    },

    /** Create panZoom instance, viewport element fallback, apply background, register with store, setup marker defs. */
    _initPanZoom() {
      debug('init', `flowCanvas "${this._id}" initializing`, {
        nodes: this.nodes.map((n: FlowNode) => ({ id: n.id, type: n.type ?? 'default', position: n.position, parentId: n.parentId })),
        edges: this.edges.map((e: FlowEdge) => ({ id: e.id, source: e.source, target: e.target, type: e.type ?? 'default' })),
        config: { minZoom: config.minZoom, maxZoom: config.maxZoom, pannable: config.pannable, zoomable: config.zoomable, debug: config.debug },
      });

      this._panZoom = createPanZoom(this._container, {
        onTransformChange: (vp: Viewport) => {
          this.viewport.x = vp.x;
          this.viewport.y = vp.y;
          this.viewport.zoom = vp.zoom;
          if (this._viewportEl) {
            this._viewportEl.style.transform = `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`;
          }
          this._applyBackground();
          this._applyCulling();
          this._applyZoomLevel(vp.zoom);
          if (this.contextMenu.show) { this.closeContextMenu(); }
          this._emit('viewport-change', { viewport: { ...vp } });
        },
        onMoveStart: (vp: Viewport) => {
          this._emit('viewport-move-start', { viewport: { ...vp } });
        },
        onMove: (vp: Viewport) => {
          this._emit('viewport-move', { viewport: { ...vp } });
        },
        onMoveEnd: (vp: Viewport) => {
          this._emit('viewport-move-end', { viewport: { ...vp } });
        },
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,
        pannable: config.pannable,
        zoomable: config.zoomable,
        translateExtent: config.translateExtent,
        isLocked: () => this._animationLocked,
        noPanClassName: config.noPanClassName ?? 'nopan',
        noWheelClassName: config.noWheelClassName,
        zoomOnDoubleClick: config.zoomOnDoubleClick,
        panOnDrag: config.panOnDrag,
        panActivationKeyCode: config.panActivationKeyCode,
        zoomActivationKeyCode: config.zoomActivationKeyCode,
        isTouchSelectionMode: () => this._touchSelectionMode,
        panOnScroll: config.panOnScroll,
        panOnScrollDirection: config.panOnScrollDirection,
        panOnScrollSpeed: config.panOnScrollSpeed,
        onScrollPan: (dx: number, dy: number) => {
          this.panBy(dx, dy);
        },
      });

      // If the user provided a custom initial viewport, sync d3-zoom to it.
      // createPanZoom initializes d3 with an identity transform which fires
      // onTransformChange({0,0,1}) and overwrites the user's viewport.
      if (config.viewport) {
        const vp = {
          x: config.viewport.x ?? 0,
          y: config.viewport.y ?? 0,
          zoom: config.viewport.zoom ?? 1,
        };
        this.viewport.x = vp.x;
        this.viewport.y = vp.y;
        this.viewport.zoom = vp.zoom;
        this._panZoom.setViewport(vp);
      }

      // The x-flow-viewport directive registers _viewportEl when it runs.
      // Defer a fallback query in case init() fires before the directive.
      this.$nextTick(() => {
        if (!this._viewportEl) {
          this._viewportEl = this._container?.querySelector('.flow-viewport') as HTMLElement | null;
        }
        if (this._viewportEl) {
          const vp = this.viewport;
          this._viewportEl.style.transform = `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`;
        }
      });
      this._applyBackground();

      // Register with global store so other components can access this instance
      (this as any).$store.flow.register(this._id, this);

      // Click-to-focus: activate this canvas on pointerdown
      this._onContainerPointerDown = () => {
        (this as any).$store.flow.activate(this._id);
      };
      this._container.addEventListener('pointerdown', this._onContainerPointerDown);

      // Auto-activate if this is the only instance (or first to register)
      if (Object.keys((this as any).$store.flow.instances).length === 1) {
        (this as any).$store.flow.activate(this._id);
      }

      // Set up SVG <defs> for edge markers (arrowheads etc.)
      this._setupMarkerDefs();
    },

    /** Canvas click handler, context menu handler, long press, touch selection mode, context menu event listeners. */
    _initClickHandlers() {
      // Click on canvas background → deselect all + emit pane-click
      this._onCanvasClick = (e: MouseEvent) => {
        if (this._suppressNextCanvasClick) {
          this._suppressNextCanvasClick = false;
          return;
        }

        if (this.pendingConnection) {
          this._emit('connect-end', {
            connection: null,
            source: this.pendingConnection.source,
            sourceHandle: this.pendingConnection.sourceHandle,
            position: this.screenToFlowPosition(e.clientX, e.clientY),
          });
          this.pendingConnection = null;
          this._container?.classList.remove('flow-connecting');
          if (this._container) clearValidationClasses(this._container);
        }

        const target = e.target as HTMLElement;
        if (target === this._container || target.classList.contains('flow-viewport')) {
          const position = this.screenToFlowPosition(e.clientX, e.clientY);
          this._emit('pane-click', { event: e, position });
          this.deselectAll();
        }
      };
      this._container.addEventListener('click', this._onCanvasClick);

      // Canvas right-click → pane or selection context menu
      this._onCanvasContextMenu = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target === this._container || target.classList.contains('flow-viewport')) {
          e.preventDefault();

          if (this.selectedNodes.size > 1) {
            const nodes = this.nodes.filter((n: FlowNode) => this.selectedNodes.has(n.id));
            this._emit('selection-context-menu', { nodes, event: e });
          } else {
            const position = this.screenToFlowPosition(e.clientX, e.clientY);
            this._emit('pane-context-menu', { event: e, position });
          }
        }
      };
      this._container.addEventListener('contextmenu', this._onCanvasContextMenu);

      // Long-press handler for touch devices
      const longPressAction = config.longPressAction ?? 'context-menu';
      if (longPressAction) {
        this._longPressCleanup = attachLongPress(
          this._container,
          (e: PointerEvent) => {
            const target = e.target as HTMLElement;

            if (longPressAction === 'context-menu') {
              const nodeEl = target.closest('[data-flow-node-id]') as HTMLElement;
              if (nodeEl) {
                const nodeId = nodeEl.getAttribute('data-flow-node-id')!;
                const node = this._nodeMap.get(nodeId);
                if (node) {
                  this._emit('node-context-menu', { node, event: e });
                  return;
                }
              }

              const edgeEl = target.closest('.flow-edge-svg') as HTMLElement;
              if (edgeEl) {
                const edgeId = edgeEl.getAttribute('data-edge-id');
                const edge = edgeId ? this._edgeMap.get(edgeId) : undefined;
                if (edge) {
                  this._emit('edge-context-menu', { edge, event: e });
                  return;
                }
              }

              if (this.selectedNodes.size > 1) {
                const nodes = this.nodes.filter((n: FlowNode) => this.selectedNodes.has(n.id));
                this._emit('selection-context-menu', { nodes, event: e });
              } else {
                const position = this.screenToFlowPosition(e.clientX, e.clientY);
                this._emit('pane-context-menu', { event: e, position });
              }
            } else if (longPressAction === 'select') {
              const nodeEl = target.closest('[data-flow-node-id]') as HTMLElement;
              if (nodeEl) {
                const nodeId = nodeEl.getAttribute('data-flow-node-id')!;
                if (this.selectedNodes.has(nodeId)) {
                  this.selectedNodes.delete(nodeId);
                } else {
                  this.selectedNodes.add(nodeId);
                }
              }
            }
          },
          { duration: config.longPressDuration ?? 500 },
        );
      }

      // Two-finger-tap toggles touch selection mode
      if (config.touchSelectionMode !== false) {
        let lastPointerDown = 0;
        let pointerCount = 0;

        const onTouchPointerDown = (e: PointerEvent) => {
          if (e.pointerType !== 'touch') return;
          pointerCount++;
          if (pointerCount === 2) {
            const now = Date.now();
            if (now - lastPointerDown < 300) {
              this._touchSelectionMode = !this._touchSelectionMode;
              this._container?.classList.toggle('flow-touch-selection-mode', this._touchSelectionMode);
            }
          }
          lastPointerDown = Date.now();
        };

        const onTouchPointerUp = (e: PointerEvent) => {
          if (e.pointerType !== 'touch') return;
          pointerCount = Math.max(0, pointerCount - 1);
          if (pointerCount === 0) lastPointerDown = 0;
        };

        const container = this._container;
        if (!container) return;
        container.addEventListener('pointerdown', onTouchPointerDown);
        container.addEventListener('pointerup', onTouchPointerUp);
        container.addEventListener('pointercancel', onTouchPointerUp);

        const onVisibilityChange = () => {
          if (document.hidden) {
            pointerCount = 0;
          }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        const indicator = document.createElement('div');
        indicator.className = 'flow-touch-selection-mode-indicator';
        indicator.textContent = 'Selection Mode \u2014 tap with two fingers to exit';
        container.appendChild(indicator);

        this._touchSelectionCleanup = () => {
          container.removeEventListener('pointerdown', onTouchPointerDown);
          container.removeEventListener('pointerup', onTouchPointerUp);
          container.removeEventListener('pointercancel', onTouchPointerUp);
          document.removeEventListener('visibilitychange', onVisibilityChange);
          indicator.remove();
        };
      }

      // Auto-populate contextMenu state from context menu events
      const ctxEvents: Array<{ event: string; handler: EventListener }> = [
        { event: 'flow-node-context-menu', handler: ((e: CustomEvent) => {
          Object.assign(this.contextMenu, { show: true, type: 'node', x: e.detail.event.clientX, y: e.detail.event.clientY, node: e.detail.node, edge: null, position: null, nodes: null, event: e.detail.event });
        }) as EventListener },
        { event: 'flow-edge-context-menu', handler: ((e: CustomEvent) => {
          Object.assign(this.contextMenu, { show: true, type: 'edge', x: e.detail.event.clientX, y: e.detail.event.clientY, node: null, edge: e.detail.edge, position: null, nodes: null, event: e.detail.event });
        }) as EventListener },
        { event: 'flow-pane-context-menu', handler: ((e: CustomEvent) => {
          Object.assign(this.contextMenu, { show: true, type: 'pane', x: e.detail.event.clientX, y: e.detail.event.clientY, node: null, edge: null, position: e.detail.position, nodes: null, event: e.detail.event });
        }) as EventListener },
        { event: 'flow-selection-context-menu', handler: ((e: CustomEvent) => {
          Object.assign(this.contextMenu, { show: true, type: 'selection', x: e.detail.event.clientX, y: e.detail.event.clientY, node: null, edge: null, position: null, nodes: e.detail.nodes, event: e.detail.event });
        }) as EventListener },
      ];
      for (const entry of ctxEvents) {
        this._container.addEventListener(entry.event, entry.handler);
      }
      this._contextMenuListeners = ctxEvents;
    },

    /** Keyboard shortcut handler (delete, arrows, undo/redo, copy/paste/cut, selection tool toggle, escape). */
    _initKeyboard() {
      this._onKeyDown = (e: KeyboardEvent) => {
        if (!this._active) return;
        if (this._animationLocked) return;

        const tag = (e.target as HTMLElement).tagName;
        const shortcuts = this._shortcuts;

        // Escape → close context menu
        if (matchesKey(e.key, shortcuts.escape) && this.contextMenu.show) {
          this.closeContextMenu();
          return;
        }

        // Escape → cancel click-to-connect
        if (matchesKey(e.key, shortcuts.escape) && this.pendingConnection) {
          this._emit('connect-end', {
            connection: null,
            source: this.pendingConnection.source,
            sourceHandle: this.pendingConnection.sourceHandle,
            position: { x: 0, y: 0 },
          });
          this.pendingConnection = null;
          this._container?.classList.remove('flow-connecting');
          if (this._container) clearValidationClasses(this._container);
          return;
        }

        // Delete selected
        if (matchesKey(e.key, shortcuts.delete)) {
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
          this._deleteSelected();
        }

        // Toggle selection tool (box <-> lasso)
        if (matchesKey(e.key, this._shortcuts.selectionToolToggle) && !e.ctrlKey && !e.metaKey) {
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
          this._selectionTool = this._selectionTool === 'box' ? 'lasso' : 'box';
          return;
        }

        // Arrow keys → move selected nodes
        if (matchesKey(e.key, shortcuts.moveNodes)) {
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
          if (this._config?.disableKeyboardA11y) return;
          if (this.selectedNodes.size === 0) return;

          e.preventDefault();
          const step = matchesModifier(e, shortcuts.moveStepModifier)
            ? shortcuts.moveStep * shortcuts.moveStepMultiplier
            : shortcuts.moveStep;
          let dx = 0, dy = 0;

          switch (e.key) {
            case 'ArrowUp':    dy = -step; break;
            case 'ArrowDown':  dy = step; break;
            case 'ArrowLeft':  dx = -step; break;
            case 'ArrowRight': dx = step; break;
            default: {
              const keys = Array.isArray(shortcuts.moveNodes) ? shortcuts.moveNodes : [shortcuts.moveNodes];
              const lk = e.key.length === 1 ? e.key.toLowerCase() : e.key;
              const idx = keys.findIndex((k: string) => (k.length === 1 ? k.toLowerCase() : k) === lk);
              if (idx === 0) dy = -step;
              else if (idx === 1) dy = step;
              else if (idx === 2) dx = -step;
              else if (idx === 3) dx = step;
            }
          }

          this._captureHistory();

          for (const nodeId of this.selectedNodes) {
            const node = this.getNode(nodeId);
            if (node && isDraggable(node)) {
              node.position.x += dx;
              node.position.y += dy;
              const kbCollab = this._container ? collabStore.get(this._container) : undefined;
              if (kbCollab?.bridge) {
                kbCollab.bridge.pushLocalNodeUpdate(node.id, { position: node.position });
              }
            }
          }
        }

        // Undo: Ctrl/Cmd + undo key (without Shift)
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && matchesKey(e.key, shortcuts.undo)) {
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
          e.preventDefault();
          this.undo();
        }

        // Redo: Ctrl/Cmd + Shift + redo key
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && matchesKey(e.key, shortcuts.redo)) {
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
          e.preventDefault();
          this.redo();
        }

        // Copy/Paste/Cut: Ctrl/Cmd + key (without Shift)
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
          if (matchesKey(e.key, shortcuts.copy)) {
            e.preventDefault();
            this.copy();
          } else if (matchesKey(e.key, shortcuts.paste)) {
            e.preventDefault();
            this.paste();
          } else if (matchesKey(e.key, shortcuts.cut)) {
            e.preventDefault();
            this.cut();
          }
        }
      };
      document.addEventListener('keydown', this._onKeyDown);
    },

    /** Create minimap if configured. */
    _initMinimap() {
      if (config.minimap) {
        this._minimap = createMiniMap(this._container, {
          getState: () => ({
            nodes: toAbsoluteNodes(this.nodes, this._nodeMap, this._config.nodeOrigin),
            viewport: this.viewport,
            containerWidth: this._container?.clientWidth ?? 0,
            containerHeight: this._container?.clientHeight ?? 0,
          }),
          setViewport: (vp) => this._panZoom?.setViewport(vp),
          config,
        });
        this._minimap.render();
        this.$watch('nodes', () => this._minimap?.render());
        this.$watch('viewport', () => this._minimap?.updateViewport());
      }
    },

    /** Create controls panel if configured. */
    _initControls() {
      if (config.controls) {
        const controlsContainer = config.controlsContainer
          ? document.querySelector<HTMLElement>(config.controlsContainer) ?? this._container
          : this._container;

        const isExternal = controlsContainer !== this._container;
        this._controls = createControlsPanel(controlsContainer!, {
          position: config.controlsPosition ?? 'bottom-left',
          orientation: config.controlsOrientation ?? 'vertical',
          external: isExternal,
          showZoom: config.controlsShowZoom ?? true,
          showFitView: config.controlsShowFitView ?? true,
          showInteractive: config.controlsShowInteractive ?? true,
          showResetPanels: config.controlsShowResetPanels ?? false,
          onZoomIn: () => this.zoomIn(),
          onZoomOut: () => this.zoomOut(),
          onFitView: () => this.fitView({ padding: DEFAULT_FIT_PADDING }),
          onToggleInteractive: () => this.toggleInteractive(),
          onResetPanels: () => this.resetPanels(),
        });

        this.$watch('isInteractive', (val: boolean) => {
          this._controls?.update({ isInteractive: val });
        });
      }
    },

    /** Selection box/lasso setup (pointerdown/pointermove/pointerup handlers). */
    _initSelection() {
      this._selectionBox = createSelectionBox(this._container);
      this._lasso = createLasso(this._container);
      this._selectionTool = config.selectionTool ?? 'box';

      this._onSelectionPointerDown = (e: PointerEvent) => {
        if (!this._config.selectionOnDrag && !this._touchSelectionMode && !matchesModifier(e, this._shortcuts.selectionBox)) {
          return;
        }

        const target = e.target as HTMLElement;
        if (target !== this._container && !target.classList.contains('flow-viewport')) {
          return;
        }

        e.stopPropagation();
        e.preventDefault();
        this._selectionShiftHeld = true;

        const configMode = this._config.selectionMode ?? 'partial';
        const toggleHeld = matchesModifier(e, this._shortcuts.selectionModeToggle);
        this._selectionEffectiveMode = toggleHeld
          ? (configMode === 'partial' ? 'full' : 'partial')
          : configMode;

        if (!this._container) return;
        const rect = this._container.getBoundingClientRect();
        const containerX = e.clientX - rect.left;
        const containerY = e.clientY - rect.top;

        if (this._selectionTool === 'lasso') {
          this._lasso!.start(containerX, containerY, this._selectionEffectiveMode);
        } else {
          this._selectionBox!.start(containerX, containerY, this._selectionEffectiveMode);
        }
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      };

      this._onSelectionPointerMove = (e: PointerEvent) => {
        const toolActive = this._selectionTool === 'lasso'
          ? this._lasso?.isActive()
          : this._selectionBox?.isActive();
        if (!toolActive) return;

        if (!this._container) return;
        const rect = this._container.getBoundingClientRect();
        const containerX = e.clientX - rect.left;
        const containerY = e.clientY - rect.top;

        if (this._selectionTool === 'lasso') {
          this._lasso!.update(containerX, containerY);
        } else {
          this._selectionBox!.update(containerX, containerY);
        }
      };

      this._onSelectionPointerUp = (e: PointerEvent) => {
        const toolActive = this._selectionTool === 'lasso'
          ? this._lasso?.isActive()
          : this._selectionBox?.isActive();
        if (!toolActive) return;

        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        this._suppressNextCanvasClick = true;

        const absNodes = toAbsoluteNodes(this.nodes, this._nodeMap, this._config.nodeOrigin);
        let hitNodes: FlowNode[];
        let hitEdgeIds: string[] = [];

        if (this._selectionTool === 'lasso') {
          const polygon = this._lasso!.end(this.viewport);
          if (!polygon) return;

          const hitAbsNodes = this._selectionEffectiveMode === 'full'
            ? getNodesFullyInPolygon(absNodes, polygon)
            : getNodesInPolygon(absNodes, polygon);
          const hitIds = new Set(hitAbsNodes.map((n: FlowNode) => n.id));
          hitNodes = this.nodes.filter((n: FlowNode) => hitIds.has(n.id));

          if (this._config.lassoSelectsEdges) {
            for (const edge of this.edges) {
              if (edge.hidden) continue;
              const pathEl = this._container?.querySelector(
                `[data-flow-edge-id="${CSS.escape(edge.id)}"] path`
              ) as SVGPathElement | null;
              if (!pathEl) continue;
              const len = pathEl.getTotalLength();
              const samples = Math.max(10, Math.ceil(len / 20));
              let inside = 0;
              for (let s = 0; s <= samples; s++) {
                const pt = pathEl.getPointAtLength((s / samples) * len);
                if (pointInPolygon(pt.x, pt.y, polygon)) inside++;
              }
              const select = this._selectionEffectiveMode === 'full'
                ? inside === samples + 1
                : inside > 0;
              if (select) hitEdgeIds.push(edge.id);
            }
          }
        } else {
          const flowRect = this._selectionBox!.end(this.viewport);
          if (!flowRect) return;

          const hitAbsNodes = this._selectionEffectiveMode === 'full'
            ? getNodesFullyInRect(absNodes, flowRect, this._config.nodeOrigin)
            : getNodesInRect(absNodes, flowRect, this._config.nodeOrigin);
          const hitIds = new Set(hitAbsNodes.map((n: FlowNode) => n.id));
          hitNodes = this.nodes.filter((n: FlowNode) => hitIds.has(n.id));
        }

        if (!this._selectionShiftHeld) {
          this.deselectAll();
        }

        for (const node of hitNodes) {
          if (!isSelectable(node)) continue;
          if (node.hidden) continue;

          node.selected = true;
          this.selectedNodes.add(node.id);

          const nodeEl = this._container?.querySelector(`[data-flow-node-id="${CSS.escape(node.id)}"]`);
          if (nodeEl) {
            nodeEl.classList.add('flow-node-selected');
          }
        }

        for (const edgeId of hitEdgeIds) {
          const edge = this.getEdge(edgeId);
          if (edge) {
            edge.selected = true;
            this.selectedEdges.add(edge.id);
          }
        }

        if (hitNodes.length > 0 || hitEdgeIds.length > 0) {
          this._emitSelectionChange();
        }

        this._selectionShiftHeld = false;
      };

      this._container.addEventListener('pointerdown', this._onSelectionPointerDown);
      this._container.addEventListener('pointermove', this._onSelectionPointerMove);
      this._container.addEventListener('pointerup', this._onSelectionPointerUp);
    },

    /** Drop zone drag/drop handlers if onDrop configured. */
    _initDropZone() {
      if (config.onDrop) {
        this._onDropZoneDragOver = (e: DragEvent) => {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        };
        this._onDropZoneDrop = (e: DragEvent) => {
          e.preventDefault();
          const raw = e.dataTransfer?.getData('application/alpineflow');
          if (!raw || !config.onDrop) return;

          let data: any;
          try { data = JSON.parse(raw); } catch { data = raw; }

          if (!this._container) return;
          const position = screenToFlowPosition(
            e.clientX,
            e.clientY,
            this.viewport,
            this._container.getBoundingClientRect(),
          );
          const dropEl = document.elementFromPoint(e.clientX, e.clientY);
          const nodeEl = dropEl?.closest('[x-flow-node]') as HTMLElement | null;
          const targetNode = nodeEl?.dataset.flowNodeId
            ? this.getNode(nodeEl.dataset.flowNodeId) ?? null
            : null;
          const node = config.onDrop({ data, position, targetNode });
          if (node) this.addNodes(node, { center: true });
        };
        this._container.addEventListener('dragover', this._onDropZoneDragOver);
        this._container.addEventListener('drop', this._onDropZoneDrop);
      }
    },

    /** Run initial child layouts for all layout parents. */
    _initChildLayout() {
      // Instantiate the layout dedup now that Alpine is ready and _container is set.
      this._layoutDedup = createLayoutDedup((parentId: string) => {
        this.layoutChildren(parentId);
      });

      // Wire bridge: detect $wire (Livewire) and activate bidirectional bridge
      if ((this as any).$wire) {
        const $wire = (this as any).$wire;
        if (config.wireEvents) {
          registerWireEvents(config, $wire, config.wireEvents);
        }
        const cleanupCommands = registerWireCommands(this, $wire);
        const cleanupCustom = registerCustomWireCommands(this, $wire);
        (this as any)._wireCleanup = () => { cleanupCommands(); cleanupCustom(); };
        debug('init', `wire bridge activated for "${this._id}"`);
      }

      debug('init', `flowCanvas "${this._id}" ready`);
      this._emit('init');
      this._recomputeChildValidation();

      // Run initial child layout for all layout parents (bottom-up via recursion)
      for (const node of this.nodes) {
        if (node.childLayout && !node.parentId) {
          this.layoutChildren(node.id);
        }
      }
      // Also handle layout parents that are themselves children of non-layout parents
      for (const node of this.nodes) {
        if (node.childLayout && node.parentId) {
          const parent = this._nodeMap.get(node.parentId);
          if (!parent?.childLayout) {
            this.layoutChildren(node.id);
          }
        }
      }

      if (config.fitViewOnInit) {
        requestAnimationFrame(() => {
          this.fitView();
        });
      }
    },

    /** Validate auto-layout dependency and start initial layout. */
    _initAutoLayout() {
      if (config.autoLayout) {
        const alg = config.autoLayout.algorithm;
        const registryKeys: Record<string, string> = {
          dagre: 'layout:dagre',
          force: 'layout:force',
          hierarchy: 'layout:hierarchy',
          elk: 'layout:elk',
        };
        const pluginNames: Record<string, string> = {
          dagre: 'AlpineFlowDagre',
          force: 'AlpineFlowForce',
          hierarchy: 'AlpineFlowHierarchy',
          elk: 'AlpineFlowElk',
        };
        const key = registryKeys[alg];
        if (key && getAddon(key)) {
          this._autoLayoutReady = true;
          this.$nextTick(() => this._runAutoLayout());
        } else if (key) {
          this._warn('AUTO_LAYOUT_MISSING_DEP', `autoLayout requires the ${alg} plugin. Register it with: Alpine.plugin(${pluginNames[alg]})`);
        }
      }
    },

    /** requestAnimationFrame ready flip, loading watch, loading overlay injection. */
    _initReady() {
      // Flip `ready` after the first paint so node dimensions are measured
      // and edges have accurate handle positions. When fitViewOnInit is set,
      // delay an extra frame so fitView completes before the viewport reveals.
      const frameCount = config.fitViewOnInit ? 2 : 1;
      let frame = 0;
      const tick = () => {
        frame++;
        if (frame < frameCount) {
          requestAnimationFrame(tick);
          return;
        }
        this.$nextTick(() => {
          this.ready = true;
        });
      };
      requestAnimationFrame(tick);

      // Toggle .flow-loading / .flow-ready CSS classes reactively
      this.$watch('isLoading', (loading: boolean) => {
        if (!this._container) return;
        this._container.classList.toggle('flow-loading', loading);
        this._container.classList.toggle('flow-ready', !loading);

        if (!loading && this._autoLoadingOverlay) {
          this._autoLoadingOverlay.remove();
          this._autoLoadingOverlay = null;
        }
      });
      if (this._container) {
        this._container.classList.add('flow-loading');
      }

      // Auto-inject loading overlay when loading: true and no x-flow-loading directive present
      if (config.loading && this._container && !this._container.querySelector('[data-flow-loading-directive]')) {
        const overlay = document.createElement('div');
        overlay.className = 'flow-loading-overlay';

        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'flow-loading-indicator';

        const nodeEl = document.createElement('div');
        nodeEl.className = 'flow-loading-indicator-node';

        const textEl = document.createElement('div');
        textEl.className = 'flow-loading-indicator-text';
        textEl.textContent = this._loadingText;

        loadingIndicator.appendChild(nodeEl);
        loadingIndicator.appendChild(textEl);
        overlay.appendChild(loadingIndicator);
        this._container.appendChild(overlay);
        this._autoLoadingOverlay = overlay;
      }
    },

    // ── Lifecycle ─────────────────────────────────────────────────────
    init() {
      // Rebind ctx to the actual Alpine reactive proxy. In normal usage
      // (x-data="flowCanvas(...)") this is the same object, but when users
      // spread ({...flowCanvas(...), extra}) Alpine wraps a different merged
      // object. Rebinding here ensures mixin closures mutate the correct
      // reactive proxy so Alpine detects changes.
      ctxTarget = this;

      this._initDebug();
      this._initContainer();
      this._initColorMode();
      this._initHydration();
      this._initHistory();
      this._initAnnouncer();
      this._initCollab();
      this._initPanZoom();
      this._initClickHandlers();
      this._initKeyboard();
      this._initMinimap();
      this._initControls();
      this._initSelection();
      this._initChildLayout();
      this._initDropZone();
      this._initAutoLayout();
      this._initReady();
    },

    _setupMarkerDefs() {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
      const defsEl = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(defsEl);
      this._container?.appendChild(svg);
      this._markerDefsEl = svg;
      this._updateMarkerDefs();

      this.$watch('edges', () => {
        this._updateMarkerDefs();
      });
    },

    _updateMarkerDefs() {
      if (!this._markerDefsEl) return;
      const defs = this._markerDefsEl.querySelector('defs')!;
      const seen = new Map<string, string>();

      for (const edge of this.edges as FlowEdge[]) {
        for (const marker of [edge.markerStart, edge.markerEnd]) {
          if (!marker) continue;
          const cfg = normalizeMarker(marker);
          const id = getMarkerId(cfg, this._id);
          if (!seen.has(id)) {
            seen.set(id, getMarkerSvg(cfg, id));
          }
        }
      }

      // Remove stale markers, preserving non-marker children (gradients etc.)
      const existingMarkers = defs.querySelectorAll('marker');
      const existingIds = new Set<string>();
      existingMarkers.forEach((m: SVGMarkerElement) => {
        if (!seen.has(m.id)) {
          m.remove();
        } else {
          existingIds.add(m.id);
        }
      });

      for (const [id, svgStr] of seen) {
        if (!existingIds.has(id)) {
          const parsed = new DOMParser().parseFromString(
            `<svg xmlns="http://www.w3.org/2000/svg">${svgStr}</svg>`,
            'image/svg+xml',
          );
          const marker = parsed.querySelector('marker');
          if (marker) defs.appendChild(document.importNode(marker, true));
        }
      }
    },

    destroy() {
      // Wire bridge cleanup
      (this as any)._wireCleanup?.();
      (this as any)._wireCleanup = null;

      this._longPressCleanup?.();
      this._longPressCleanup = null;
      this._touchSelectionCleanup?.();
      this._touchSelectionCleanup = null;
      this._emit('destroy');
      debug('destroy', `flowCanvas "${this._id}" destroying`);
      if (this._onCanvasClick && this._container) {
        this._container.removeEventListener('click', this._onCanvasClick);
      }
      if (this._onCanvasContextMenu && this._container) {
        this._container.removeEventListener('contextmenu', this._onCanvasContextMenu);
      }
      if (this._container) {
        for (const entry of this._contextMenuListeners) {
          this._container.removeEventListener(entry.event, entry.handler);
        }
      }
      this._contextMenuListeners = [];
      if (this._onKeyDown) {
        document.removeEventListener('keydown', this._onKeyDown);
      }
      if (this._onContainerPointerDown && this._container) {
        this._container.removeEventListener('pointerdown', this._onContainerPointerDown);
      }
      this._markerDefsEl?.remove();
      this._markerDefsEl = null;
      this._minimap?.destroy();
      this._minimap = null;
      this._controls?.destroy();
      this._controls = null;
      if (this._onSelectionPointerDown && this._container) {
        this._container.removeEventListener('pointerdown', this._onSelectionPointerDown);
      }
      if (this._onSelectionPointerMove && this._container) {
        this._container.removeEventListener('pointermove', this._onSelectionPointerMove);
      }
      if (this._onSelectionPointerUp && this._container) {
        this._container.removeEventListener('pointerup', this._onSelectionPointerUp);
      }
      this._selectionBox?.destroy();
      this._selectionBox = null;
      this._lasso?.destroy();
      this._lasso = null;
      this._viewportEl = null;
      if (this._container) {
        this._container.removeEventListener('dragover', this._onDropZoneDragOver);
        this._container.removeEventListener('drop', this._onDropZoneDrop);
      }
      // Clean up follow tracking
      this._followHandle?.stop();
      this._followHandle = null;

      // Stop all active timelines
      for (const tl of this._activeTimelines) { tl.stop(); }
      this._activeTimelines.clear();

      // Stop animator
      if (this._animator) {
        Alpine.raw(this._animator).stopAll();
        this._animator = null;
      }

      // Cancel pending layout animation frame
      if (this._layoutAnimFrame) {
        cancelAnimationFrame(this._layoutAnimFrame);
        this._layoutAnimFrame = 0;
      }

      // Clean up auto-layout timer
      if (this._autoLayoutTimer) {
        clearTimeout(this._autoLayoutTimer);
        this._autoLayoutTimer = null;
      }

      // Clean up color mode
      if (this._colorModeHandle) {
        this._colorModeHandle.destroy();
        this._colorModeHandle = null;
      }

      // Collab cleanup — objects live in the module-scoped collabStore WeakMap
      if (this._container) {
        const collabEntry = collabStore.get(this._container);
        if (collabEntry) {
          collabEntry.bridge.destroy();
          collabEntry.awareness.destroy();
          if (collabEntry.cursorCleanup) collabEntry.cursorCleanup();
          collabStore.delete(this._container);
        }
      }
      if (config.collab) {
        (config.collab as CollabConfig).provider.destroy();
      }

      if (this._container) {
        this._container.removeAttribute('data-flow-canvas');
      }
      (this as any).$store.flow.unregister(this._id);
      this._panZoom?.destroy();
      this._panZoom = null;
      this._announcer?.destroy();
      this._announcer = null;
      if (this._computeDebounceTimer) { clearTimeout(this._computeDebounceTimer); this._computeDebounceTimer = null; }

      // Dispose layout dedup RAF handle
      this._layoutDedup?.dispose();
      this._layoutDedup = null;
    },

    // ── Remaining Flat Methods ────────────────────────────────────────

    /**
     * Set a node's rotation angle in degrees.
     */
    rotateNode(id: string, angle: number) {
      const node = this.nodes.find((n: FlowNode) => n.id === id);
      if (!node) return;
      this._captureHistory();
      node.rotation = angle;
    },

    /** Set the user-controlled loading state. */
    setLoading(value: boolean) {
      this._userLoading = value;
    },

    /** Update runtime config options. */
    patchConfig(changes: Partial<PatchableConfig>) {
      this._applyConfigPatch(changes as Record<string, any>);
    },

    // ── Context Menu ──────────────────────────────────────────────────
    closeContextMenu() {
      this.contextMenu.show = false;
      this.contextMenu.type = null;
      this.contextMenu.node = null;
      this.contextMenu.edge = null;
      this.contextMenu.position = null;
      this.contextMenu.nodes = null;
      this.contextMenu.event = null;
    },

    /**
     * Batch multiple canvas mutations so that layout reconciliation runs once
     * after the whole block rather than once per mutation. Nested calls join
     * the outermost batch. fn's return value is forwarded; layout still runs
     * even if fn throws.
     */
    batch<T>(fn: () => T): T {
      if (!this._layoutDedup) return fn();
      return createBatch(this._layoutDedup)<T>(fn);
    },

    get collab() {
      return this._container ? collabStore.get(this._container)?.awareness : undefined;
    },

    async toImage(options?: import('../../core/types').ToImageOptions): Promise<string> {
      let captureFlowImage;
      try {
        ({ captureFlowImage } = await import('../../core/export'));
      } catch {
        throw new Error('toImage() requires html-to-image. Install it with: npm install html-to-image');
      }
      return captureFlowImage(
        this._container,
        this._viewportEl,
        this.nodes,
        this.viewport,
        options,
      );
    },
    };

    // ── Wire mixin methods flat onto the data object ──────────────────────
    // Object.defineProperties preserves getter/setter descriptors (e.g.
    // canUndo, canRedo, colorMode) that Object.assign would evaluate eagerly.
    //
    // ctx is a thin Proxy that delegates to ctxTarget. During construction
    // ctxTarget is `self`. In init(), it's rebound to `this` — the actual
    // Alpine reactive proxy. This handles the spread pattern
    // ({...flowCanvas(...), extra}) where Alpine wraps a different merged
    // object: mixin closures all share the same ctx Proxy, so rebinding
    // ctxTarget in init() makes every mixin method transparently use the
    // correct reactive proxy.
    let ctxTarget: any = self;
    const ctx = new Proxy(Object.create(null), {
      get(_: any, prop: string | symbol) { return ctxTarget[prop]; },
      set(_: any, prop: string | symbol, value: any) { ctxTarget[prop] = value; return true; },
    }) as unknown as CanvasContext;
    const mixins = [
      createNodesMixin(ctx),
      createEdgesMixin(ctx),
      createViewportMixin(ctx),
      createSelectionMixin(ctx),
      createHistoryMixin(ctx),
      createAnimationMixin(ctx),
      createCollapseMixin(ctx),
      createCondenseMixin(ctx),
      createRowsMixin(ctx),
      createLayoutMixin(ctx),
      createValidationMixin(ctx),
      createComputeMixin(ctx),
      createDomMixin(ctx, Alpine),
      createConfigMixin(ctx),
    ];
    for (const mixin of mixins) {
      Object.defineProperties(self, Object.getOwnPropertyDescriptors(mixin));
    }

    // Expose registerMarker on the instance so it's available via $flow
    (self as any).registerMarker = (type: string, renderer: CustomMarkerRenderer) => {
      registerMarker(type, renderer);
    };

    return self;
  });
}
