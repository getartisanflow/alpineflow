// ============================================================================
// canvas-viewport — Viewport coordinate transforms, zoom, pan, fit, and
//                    intersection detection mixin for flow-canvas
//
// Public API: screenToFlowPosition, flowToScreenPosition, fitView, fitBounds,
//             getNodesBounds, getViewportForBounds, setViewport, zoomIn,
//             zoomOut, setCenter, panBy, toggleInteractive, colorMode,
//             getContainerDimensions, resetPanels.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowNode, Viewport, XYPosition } from '../../core/types';
import {
  getNodesBounds,
  getViewportForBounds,
  screenToFlowPosition,
  flowToScreenPosition,
} from '../../core/geometry';
import { toAbsoluteNodes } from '../../core/sub-flow';
import { ZOOM_STEP_FACTOR, DEFAULT_FIT_PADDING } from '../../core/constants';
import { debug } from '../../core/debug';

export function createViewportMixin(ctx: CanvasContext) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────

    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(x: number, y: number): XYPosition {
      if (!ctx._container) return { x, y };
      const rect = ctx._container.getBoundingClientRect();
      // Live viewport: reactive `viewport` lags a frame behind the transform.
      return screenToFlowPosition(x, y, ctx._viewportLive ?? ctx.viewport, rect);
    },

    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(x: number, y: number): XYPosition {
      if (!ctx._container) return { x, y };
      const rect = ctx._container.getBoundingClientRect();
      // Live viewport: reactive `viewport` lags a frame behind the transform.
      return flowToScreenPosition(x, y, ctx._viewportLive ?? ctx.viewport, rect);
    },

    // ── Fit & Bounds ──────────────────────────────────────────────────────

    /**
     * Fit all visible nodes into the viewport.
     *
     * Defers via `requestAnimationFrame` if any node lacks measured
     * dimensions (up to 10 retries) to give the DOM time to render.
     *
     * Returns a promise that resolves `true` once the fit runs, or `false`
     * if the retry budget is exhausted with nodes still unmeasured — so
     * callers can observe whether the fit actually happened. Callers that
     * ignore the return value are unaffected (the internal `fitViewOnInit`
     * path does exactly that).
     */
    fitView(options?: { padding?: number; duration?: number }, _retries = 0): Promise<boolean> {
      // Defer if any node lacks measured dimensions so the DOM has time to render
      if (ctx.nodes.some((n: FlowNode) => !n.dimensions)) {
        if (_retries < 10) {
          return new Promise<boolean>((resolve) => {
            requestAnimationFrame(() => resolve(this.fitView(options, _retries + 1)));
          });
        }
        // Retry budget exhausted with nodes still unmeasured — fit did not run.
        return Promise.resolve(false);
      }

      const visibleNodes = ctx.nodes.filter((n: FlowNode) => !n.hidden);
      const bounds = getNodesBounds(toAbsoluteNodes(visibleNodes, ctx._nodeMap, ctx._config.nodeOrigin), ctx._config.nodeOrigin);
      this.fitBounds(bounds, options);
      ctx._announcer?.handleEvent('fit-view', {});
      return Promise.resolve(true);
    },

    /**
     * Fit a specific rectangle into the viewport.
     *
     * If `duration` is specified, the transition is animated via
     * `ctx.animate()` (cross-mixin dependency). Otherwise the viewport
     * is set directly via `ctx._panZoom`.
     */
    fitBounds(rect: { x: number; y: number; width: number; height: number }, options?: { padding?: number; duration?: number }): void {
      const dims = ctx._container
        ? { width: ctx._container.clientWidth, height: ctx._container.clientHeight }
        : { width: 800, height: 600 };

      const vp = getViewportForBounds(
        rect,
        dims.width,
        dims.height,
        ctx._config.minZoom ?? 0.5,
        ctx._config.maxZoom ?? 2,
        options?.padding ?? DEFAULT_FIT_PADDING,
      );

      debug('viewport', 'fitBounds', { rect, viewport: vp });

      const duration = options?.duration ?? 0;
      if (duration > 0) {
        ctx.animate?.(
          { viewport: { pan: { x: vp.x, y: vp.y }, zoom: vp.zoom } },
          { duration },
        );
      } else {
        ctx._panZoom?.setViewport(vp);
      }
    },

    /**
     * Get the bounding rectangle of the specified nodes (or all visible
     * nodes if no IDs are provided).
     */
    getNodesBounds(nodeIds?: string[]): { x: number; y: number; width: number; height: number } {
      let nodes: FlowNode[];
      if (nodeIds) {
        nodes = nodeIds
          .map((id: string) => ctx.getNode(id))
          .filter((n: FlowNode | undefined): n is FlowNode => !!n);
      } else {
        nodes = ctx.nodes.filter((n: FlowNode) => !n.hidden);
      }
      return getNodesBounds(toAbsoluteNodes(nodes, ctx._nodeMap, ctx._config.nodeOrigin), ctx._config.nodeOrigin);
    },

    /**
     * Compute the viewport (pan + zoom) that frames the given bounds
     * within the container, respecting min/max zoom and padding.
     */
    getViewportForBounds(bounds: { x: number; y: number; width: number; height: number }, padding?: number): Viewport {
      const el = ctx._container;
      if (!el) return { x: 0, y: 0, zoom: 1 };
      return getViewportForBounds(
        bounds,
        el.clientWidth,
        el.clientHeight,
        ctx._config.minZoom ?? 0.5,
        ctx._config.maxZoom ?? 2,
        padding ?? DEFAULT_FIT_PADDING,
      );
    },

    // ── Viewport Mutation ─────────────────────────────────────────────────

    /**
     * Set the viewport programmatically (pan and/or zoom).
     */
    setViewport(viewport: Partial<Viewport>, options?: { duration?: number }): void {
      debug('viewport', 'setViewport', viewport);
      ctx._panZoom?.setViewport(viewport, options);
    },

    /**
     * Zoom in by `ZOOM_STEP_FACTOR`, clamped to `maxZoom`.
     */
    zoomIn(options?: { duration?: number }): void {
      // Base off the live viewport: reactive `viewport` settles a frame late, so
      // two relative ops in one tick would otherwise both read the same stale base.
      const vp = ctx._viewportLive ?? ctx.viewport;
      const maxZoom = ctx._config.maxZoom ?? 2;
      const newZoom = Math.min(vp.zoom * ZOOM_STEP_FACTOR, maxZoom);
      debug('viewport', 'zoomIn', { from: vp.zoom, to: newZoom });
      ctx._panZoom?.setViewport({ ...vp, zoom: newZoom }, options);
    },

    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(options?: { duration?: number }): void {
      const vp = ctx._viewportLive ?? ctx.viewport;
      const minZoom = ctx._config.minZoom ?? 0.5;
      const newZoom = Math.max(vp.zoom / ZOOM_STEP_FACTOR, minZoom);
      debug('viewport', 'zoomOut', { from: vp.zoom, to: newZoom });
      ctx._panZoom?.setViewport({ ...vp, zoom: newZoom }, options);
    },

    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(x: number, y: number, zoom?: number, options?: { duration?: number }): void {
      const el = ctx._container;
      if (!el) return;
      const z = zoom ?? (ctx._viewportLive ?? ctx.viewport).zoom;
      const vpX = el.clientWidth / 2 - x * z;
      const vpY = el.clientHeight / 2 - y * z;
      debug('viewport', 'setCenter', { x, y, zoom: z });
      ctx._panZoom?.setViewport({ x: vpX, y: vpY, zoom: z }, options);
    },

    /**
     * Pan the viewport by a delta `(dx, dy)`.
     */
    panBy(dx: number, dy: number, options?: { duration?: number }): void {
      const vp = ctx._viewportLive ?? ctx.viewport;
      debug('viewport', 'panBy', { dx, dy });
      ctx._panZoom?.setViewport(
        { x: vp.x + dx, y: vp.y + dy, zoom: vp.zoom },
        options,
      );
    },

    // ── Interactivity Toggle ──────────────────────────────────────────────

    /**
     * Toggle pan/zoom interactivity on and off.
     */
    toggleInteractive(): void {
      ctx.isInteractive = !ctx.isInteractive;
      debug('interactive', 'toggleInteractive', { isInteractive: ctx.isInteractive });
      // Interactive is the master overlay: off => both axes off; on => restore
      // the per-axis intent from config (an axis explicitly set false stays off).
      ctx._panZoom?.update({
        pannable: ctx.isInteractive && ctx._config?.pannable !== false,
        zoomable: ctx.isInteractive && ctx._config?.zoomable !== false,
      });
    },

    // ── Color Mode ────────────────────────────────────────────────────────

    /**
     * The current resolved color mode ('light' | 'dark' | undefined).
     */
    get colorMode(): 'light' | 'dark' | undefined {
      return ctx._colorModeHandle?.resolved;
    },

    // ── Container Dimensions ──────────────────────────────────────────────

    /**
     * Get the current width and height of the container element.
     */
    getContainerDimensions(): { width: number; height: number } {
      return {
        width: ctx._container?.clientWidth ?? 0,
        height: ctx._container?.clientHeight ?? 0,
      };
    },

    // ── Panel Operations ──────────────────────────────────────────────────

    /**
     * Reset all panels by dispatching a `flow-panel-reset` CustomEvent
     * on the container and emitting a `panel-reset` event.
     */
    resetPanels(): void {
      debug('panel', 'resetPanels');
      ctx._container?.dispatchEvent(new CustomEvent('flow-panel-reset'));
      ctx._emit('panel-reset');
    },
  };
}
