// ============================================================================
// Pan/Zoom Controller
//
// Wraps d3-zoom for viewport panning and zooming. Reworked from @xyflow/system
// XYPanZoom (MIT License, Copyright 2019-2025 webkid GmbH) to use a callback
// API instead of store-getters.
// ============================================================================

import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { select, type Selection } from 'd3-selection';
import 'd3-transition'; // augments Selection with .transition()
import type { Viewport } from './types';

export interface PanZoomOptions {
  /** Called whenever the viewport transform changes */
  onTransformChange: (viewport: Viewport) => void;
  /** Called when a user gesture starts (d3-zoom 'start' event) */
  onMoveStart?: (viewport: Viewport) => void;
  /** Called each frame during a user gesture (d3-zoom 'zoom' event, user-only) */
  onMove?: (viewport: Viewport) => void;
  /** Called when a user gesture ends (d3-zoom 'end' event) */
  onMoveEnd?: (viewport: Viewport) => void;
  /** Minimum zoom level. Default: 0.5 */
  minZoom?: number;
  /** Maximum zoom level. Default: 2 */
  maxZoom?: number;
  /** Is panning enabled? Default: true */
  pannable?: boolean;
  /** Is zooming enabled? Default: true */
  zoomable?: boolean;
  /** Viewport pan boundaries [[minX, minY], [maxX, maxY]]. Limits how far the viewport can pan. */
  translateExtent?: [[number, number], [number, number]];
  /** Return true to block pan/zoom (e.g. during animation lock). */
  isLocked?: () => boolean;
  /** CSS class name that prevents pan/zoom when on or inside event target. */
  noPanClassName?: string;
  /** CSS class name that prevents wheel zoom when on or inside event target. */
  noWheelClassName?: string;
  /** Return true when touch selection mode is active (suppress single-finger pan). */
  isTouchSelectionMode?: () => boolean;
  /** Pan viewport on wheel instead of zooming. Ctrl/Cmd+wheel zooms. Default: false */
  panOnScroll?: boolean;
  /** Which axes scroll-panning applies to. Default: 'both' */
  panOnScrollDirection?: 'both' | 'vertical' | 'horizontal';
  /** Multiplier for scroll pan sensitivity. Default: 1 */
  panOnScrollSpeed?: number;
  /** Called when pan-on-scroll needs to pan the viewport. */
  onScrollPan?: (dx: number, dy: number) => void;
  /** Zoom in on double-click. Default: true */
  zoomOnDoubleClick?: boolean;
  /** Key code that temporarily enables panning when held. Default: 'Space' */
  panActivationKeyCode?: string | null;
  /** Key code that forces zoom (overrides panOnScroll) when held with wheel. Default: 'Control'.
   *  Note: Ctrl/Meta already force zoom when panOnScroll is enabled. Set to null to disable. */
  zoomActivationKeyCode?: string | null;
  /** Which mouse buttons trigger panning. true = left (0), array = specific buttons, false = none.
   *  Default: true (left button) */
  panOnDrag?: boolean | number[];
}

export interface PanZoomInstance {
  /** Set viewport programmatically */
  setViewport(viewport: Partial<Viewport>, options?: { duration?: number }): void;
  /** Get current d3 transform */
  getTransform(): ZoomTransform;
  /** Update options at runtime (e.g. toggle pannable/zoomable) */
  update(options: Partial<PanZoomOptions>): void;
  /** Clean up d3 listeners */
  destroy(): void;
}

/**
 * Attach pan/zoom behavior to a container element.
 *
 * @example
 * ```ts
 * const panZoom = createPanZoom(container, {
 *   onTransformChange: (vp) => { state.viewport = vp; },
 *   minZoom: 0.25,
 *   maxZoom: 3,
 * });
 *
 * // Later: clean up
 * panZoom.destroy();
 * ```
 */
interface PanZoomFilterOptions {
  pannable: boolean;
  zoomable: boolean;
  isLocked?: () => boolean;
  noPanClassName?: string;
  noWheelClassName?: string;
  isTouchSelectionMode?: () => boolean;
  isPanKeyHeld?: () => boolean;
  panOnDrag?: boolean | number[];
}

function createPanZoomFilter(opts: PanZoomFilterOptions) {
  const { pannable, zoomable, isLocked, noPanClassName, noWheelClassName, isTouchSelectionMode, isPanKeyHeld, panOnDrag } = opts;
  return (event: any) => {
    if (isLocked?.()) return false;
    if (noPanClassName && (event.target as HTMLElement)?.closest?.('.' + noPanClassName)) return false;
    if (event.type === 'wheel' && noWheelClassName && (event.target as HTMLElement)?.closest?.('.' + noWheelClassName)) return false;
    if (!zoomable && event.type === 'wheel') return false;
    if (event.type === 'touchstart') {
      const isSingleTouch = !event.touches || event.touches.length < 2;
      if (isTouchSelectionMode?.() && isSingleTouch) return false;
      if (!pannable && !isPanKeyHeld?.() && isSingleTouch) return false;
      if (!zoomable && !isSingleTouch) return false;
    }
    if (event.type === 'mousedown') {
      // Pan activation key overrides all mouse button / pannable checks
      if (isPanKeyHeld?.()) return true;
      if (!pannable) return false;
      // Check panOnDrag mouse button filter
      if (Array.isArray(panOnDrag)) {
        return panOnDrag.includes(event.button);
      }
      if (panOnDrag === false) return false;
    }
    return true;
  };
}

export function createPanZoom(
  container: HTMLElement,
  options: PanZoomOptions,
): PanZoomInstance {
  const {
    onTransformChange,
    minZoom = 0.5,
    maxZoom = 2,
    pannable = true,
    zoomable = true,
  } = options;

  const sel: Selection<HTMLElement, unknown, null, undefined> = select(container);

  // ── Activation key state ──────────────────────────────────────
  let panKeyHeld = false;
  const panActivationKeyCode = options.panActivationKeyCode !== undefined ? options.panActivationKeyCode : 'Space';

  const onKeyDown = (e: KeyboardEvent) => {
    if (panActivationKeyCode && e.code === panActivationKeyCode) {
      panKeyHeld = true;
      container.style.cursor = 'grab';
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (panActivationKeyCode && e.code === panActivationKeyCode) {
      panKeyHeld = false;
      container.style.cursor = '';
    }
  };
  const onBlur = () => {
    panKeyHeld = false;
    container.style.cursor = '';
  };

  if (panActivationKeyCode) {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
  }

  const zoomBehavior: ZoomBehavior<HTMLElement, unknown> = zoom<HTMLElement, unknown>()
    .scaleExtent([minZoom, maxZoom])
    .on('start', (event) => {
      if (!event.sourceEvent) return;
      if (panKeyHeld) container.style.cursor = 'grabbing';
      const { x, y, k } = event.transform;
      options.onMoveStart?.({ x, y, zoom: k });
    })
    .on('zoom', (event) => {
      const { x, y, k } = event.transform;
      onTransformChange({ x, y, zoom: k });
      if (event.sourceEvent) {
        options.onMove?.({ x, y, zoom: k });
      }
    })
    .on('end', (event) => {
      if (!event.sourceEvent) return;
      if (panKeyHeld) container.style.cursor = 'grab';
      const { x, y, k } = event.transform;
      options.onMoveEnd?.({ x, y, zoom: k });
    });

  if (options.translateExtent) {
    zoomBehavior.translateExtent(options.translateExtent);
  }

  // Always apply filter — noPanClassName must be checked even when pan/zoom are globally enabled
  zoomBehavior.filter(createPanZoomFilter({
    pannable, zoomable,
    isLocked: options.isLocked,
    noPanClassName: options.noPanClassName,
    noWheelClassName: options.noWheelClassName,
    isTouchSelectionMode: options.isTouchSelectionMode,
    isPanKeyHeld: () => panKeyHeld,
    panOnDrag: options.panOnDrag,
  }));

  // Apply zoom behavior to the container
  sel.call(zoomBehavior);

  // Disable d3-zoom's built-in double-click zoom if configured
  if (options.zoomOnDoubleClick === false) {
    sel.on('dblclick.zoom', null);
  }

  // ── Pan-on-scroll wheel interceptor ──────────────────────────
  let panOnScroll = options.panOnScroll ?? false;
  let panOnScrollDirection = options.panOnScrollDirection ?? 'both';
  let panOnScrollSpeed = options.panOnScrollSpeed ?? 1;

  // Zoom activation key state (for overriding panOnScroll)
  let zoomKeyHeld = false;
  const zoomActivationKeyCode = options.zoomActivationKeyCode !== undefined ? options.zoomActivationKeyCode : null;

  const onZoomKeyDown = (e: KeyboardEvent) => {
    if (zoomActivationKeyCode && e.code === zoomActivationKeyCode) zoomKeyHeld = true;
  };
  const onZoomKeyUp = (e: KeyboardEvent) => {
    if (zoomActivationKeyCode && e.code === zoomActivationKeyCode) zoomKeyHeld = false;
  };
  const onZoomBlur = () => { zoomKeyHeld = false; };

  if (zoomActivationKeyCode) {
    window.addEventListener('keydown', onZoomKeyDown);
    window.addEventListener('keyup', onZoomKeyUp);
    window.addEventListener('blur', onZoomBlur);
  }

  const wheelHandler = (event: WheelEvent) => {
    if (options.isLocked?.()) return;

    const isModifier = event.ctrlKey || event.metaKey || zoomKeyHeld;
    const shouldPan = panOnScroll ? !isModifier : event.shiftKey;

    if (!shouldPan) return;

    event.preventDefault();
    event.stopPropagation();

    const speed = panOnScrollSpeed;
    let dx = 0;
    let dy = 0;

    if (panOnScrollDirection !== 'horizontal') {
      dy = -event.deltaY * speed;
    }
    if (panOnScrollDirection !== 'vertical') {
      dx = -event.deltaX * speed;
      // When shift is held and deltaX is 0, browsers put the value in deltaY
      if (event.shiftKey && event.deltaX === 0 && panOnScrollDirection === 'both') {
        dx = -event.deltaY * speed;
        dy = 0;
      }
    }

    options.onScrollPan?.(dx, dy);
  };

  container.addEventListener('wheel', wheelHandler, { passive: false, capture: true });

  return {
    setViewport(viewport, opts) {
      const duration = opts?.duration ?? 0;

      const transform = zoomIdentity
        .translate(viewport.x ?? 0, viewport.y ?? 0)
        .scale(viewport.zoom ?? 1);

      if (duration > 0) {
        sel.transition().duration(duration).call(zoomBehavior.transform, transform);
      } else {
        sel.call(zoomBehavior.transform, transform);
      }
    },

    getTransform() {
      // d3-zoom stores the current transform on the element
      const el = container as any;
      return el.__zoom ?? zoomIdentity;
    },

    update(newOptions) {
      if (newOptions.minZoom !== undefined || newOptions.maxZoom !== undefined) {
        zoomBehavior.scaleExtent([
          newOptions.minZoom ?? minZoom,
          newOptions.maxZoom ?? maxZoom,
        ]);
      }

      if (newOptions.pannable !== undefined || newOptions.zoomable !== undefined) {
        const pan = newOptions.pannable ?? pannable;
        const zm = newOptions.zoomable ?? zoomable;
        zoomBehavior.filter(createPanZoomFilter({
          pannable: pan, zoomable: zm,
          isLocked: options.isLocked,
          noPanClassName: options.noPanClassName,
          noWheelClassName: options.noWheelClassName,
          isTouchSelectionMode: options.isTouchSelectionMode,
          isPanKeyHeld: () => panKeyHeld,
          panOnDrag: options.panOnDrag,
        }));
      }

      if (newOptions.panOnScroll !== undefined) {
        panOnScroll = newOptions.panOnScroll;
      }
      if (newOptions.panOnScrollDirection !== undefined) {
        panOnScrollDirection = newOptions.panOnScrollDirection;
      }
      if (newOptions.panOnScrollSpeed !== undefined) {
        panOnScrollSpeed = newOptions.panOnScrollSpeed;
      }
    },

    destroy() {
      container.removeEventListener('wheel', wheelHandler, { capture: true } as EventListenerOptions);
      if (panActivationKeyCode) {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('blur', onBlur);
      }
      if (zoomActivationKeyCode) {
        window.removeEventListener('keydown', onZoomKeyDown);
        window.removeEventListener('keyup', onZoomKeyUp);
        window.removeEventListener('blur', onZoomBlur);
      }
      sel.on('.zoom', null);
    },
  };
}
