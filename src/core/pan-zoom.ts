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
  /** Double-click zoom behaviour. Default: `true` (identical to `'step'`).
   *
   *  - `true` / `'step'` — d3-zoom's native handler: ×2 in per double-click,
   *    `shift`+double-click to step out, repeatable.
   *  - `'toggle'` — jump to {@link PanZoomOptions.dblClickZoomLevel} about the
   *    cursor; a second double-click restores the exact viewport you came from.
   *  - `false` — disabled. */
  zoomOnDoubleClick?: boolean | 'step' | 'toggle';
  /** Zoom level the first double-click animates to (the "readable" level). A second
   *  double-click at or above that level restores the viewport from before the
   *  zoom-in. Clamped to [minZoom, maxZoom]. Only consulted when
   *  `zoomOnDoubleClick: 'toggle'`. Default: 1.5 */
  dblClickZoomLevel?: number;
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

/** How long the double-click zoom transition runs, in ms. */
export const DBLCLICK_ZOOM_DURATION = 300;

/** Default zoom level the first double-click animates to. */
export const DEFAULT_DBLCLICK_ZOOM_LEVEL = 1.5;

/** A viewport transform: translation plus scale. */
interface ViewportTransform {
  x: number;
  y: number;
  zoom: number;
}

/**
 * Scale a viewport about a fixed point, keeping whatever is under `px`/`py`
 * (container-relative coordinates) pinned in place.
 */
function scaleAbout(current: ViewportTransform, px: number, py: number, k: number): ViewportTransform {
  return {
    x: px - ((px - current.x) / current.zoom) * k,
    y: py - ((py - current.y) / current.zoom) * k,
    zoom: k,
  };
}

/**
 * Decide what a double-click does to the viewport in `zoomOnDoubleClick: 'toggle'`
 * mode. The default `'step'` mode never reaches here — d3-zoom's own handler stays
 * bound and handles the gesture.
 *
 * d3's handler only ever zooms *in*, so once the canvas is at `maxZoom` a
 * double-click is a no-op and there is no gesture back out. Toggle mode trades that
 * for a round trip:
 *
 * - below `level` → zoom in to `level` about the cursor, remembering the viewport
 *   so the next double-click can put it back exactly;
 * - at or above `level` with a remembered viewport → restore it;
 * - at or above `level` with nothing remembered (the user got here by wheel or
 *   `setViewport`) → zoom out to `minZoom` about the cursor, so the gesture always
 *   does something rather than stalling.
 *
 * Pure so the decision can be tested without driving d3-zoom through a real DOM.
 *
 * Precondition: `level` must sit strictly above `minZoom`. A toggle needs somewhere
 * to go — when the two coincide, "at or above the level" is also "already at the
 * floor", so the zoom-out branch has no room and the gesture cannot move the
 * viewport. That configuration is rejected at wiring time (createPanZoom keeps
 * d3's native stepped handler instead of installing a toggle that would stall);
 * should it reach here anyway, the current viewport is returned unchanged rather
 * than a transform that merely looks new.
 */
export function resolveDblClickZoom(
  current: ViewportTransform,
  pointer: { x: number; y: number },
  opts: { level: number; minZoom: number; remembered: ViewportTransform | null },
): { next: ViewportTransform; remember: ViewportTransform | null } {
  // Tolerance so floating-point drift at exactly `level` still counts as "at" it.
  const atOrAboveLevel = current.zoom >= opts.level - 1e-3;

  if (!atOrAboveLevel) {
    return { next: scaleAbout(current, pointer.x, pointer.y, opts.level), remember: current };
  }
  if (opts.remembered) {
    return { next: opts.remembered, remember: null };
  }
  // Degenerate `level <= minZoom`: no headroom below, so zooming out would resolve
  // to the identity of `current`. Say so explicitly instead of returning a no-op
  // dressed up as a transition.
  if (current.zoom <= opts.minZoom + 1e-3) {
    return { next: current, remember: null };
  }
  return { next: scaleAbout(current, pointer.x, pointer.y, opts.minZoom), remember: null };
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

  // Viewport a 'toggle' double-click zoomed away from, restored by the next one.
  // Declared here so a user-driven gesture can invalidate it (see 'start' below).
  let rememberedViewport: ViewportTransform | null = null;

  // Live `zoomable`, kept in step with runtime update(). The toggle dblclick handler
  // reads this rather than the set-up-time value so update({ zoomable: false })
  // disables the gesture too — not just d3's own filter. (minZoom / dblClickZoomLevel
  // stay set-up-time: they feed the attach/detach headroom decision below, so making
  // them live would mean re-running that wiring, which is out of scope here.)
  let currentZoomable = zoomable;

  const zoomBehavior: ZoomBehavior<HTMLElement, unknown> = zoom<HTMLElement, unknown>()
    .scaleExtent([minZoom, maxZoom])
    .on('start', (event) => {
      if (!event.sourceEvent) return;
      // The user has moved the viewport themselves, so the remembered one is stale —
      // without this, a later toggle-out jumps back to a view they have since left.
      // Programmatic transitions (our own dblclick animation included) carry no
      // sourceEvent, so they leave it intact.
      rememberedViewport = null;
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

  // ── Double-click zoom ────────────────────────────────────────
  // `'step'` (the default) leaves d3-zoom's native handler bound, so the gesture —
  // including shift+double-click to step out — is byte-for-byte what it always was.
  // Only `'toggle'` swaps in our handler; see resolveDblClickZoom for its decision.
  const dblClickMode: 'step' | 'toggle' | 'off' =
    options.zoomOnDoubleClick === 'toggle' ? 'toggle'
      : options.zoomOnDoubleClick === false ? 'off'
        : 'step';

  const dblClickZoomLevel = Math.max(
    minZoom,
    Math.min(maxZoom, options.dblClickZoomLevel ?? DEFAULT_DBLCLICK_ZOOM_LEVEL),
  );

  const dblClickHandler = (event: MouseEvent) => {
    // Unlike the old zoom-in-only handler, toggle can animate a zoom-*out* and
    // re-centre, so it honours `zoomable: false` rather than staying live.
    if (!currentZoomable) return;
    // Mirror the guards createPanZoomFilter applies to a mouse event.
    if (options.isLocked?.()) return;
    const target = event.target as HTMLElement | null;
    if (options.noPanClassName && target?.closest?.('.' + options.noPanClassName)) return;

    event.preventDefault();

    const t = ((container as any).__zoom ?? zoomIdentity) as ZoomTransform;
    const rect = container.getBoundingClientRect();
    const { next, remember } = resolveDblClickZoom(
      { x: t.x, y: t.y, zoom: t.k },
      { x: event.clientX - rect.left, y: event.clientY - rect.top },
      { level: dblClickZoomLevel, minZoom, remembered: rememberedViewport },
    );
    rememberedViewport = remember;

    sel.transition().duration(DBLCLICK_ZOOM_DURATION)
      .call(zoomBehavior.transform, zoomIdentity.translate(next.x, next.y).scale(next.zoom));
  };

  // A toggle with `level <= minZoom` has no headroom to zoom back out into, so it
  // would stall on the second double-click. Keep d3's stepped handler instead —
  // it still zooms in and out — rather than installing a dead gesture.
  const toggleAttached = dblClickMode === 'toggle' && dblClickZoomLevel > minZoom + 1e-3;

  if (toggleAttached) {
    sel.on('dblclick.zoom', null);
    container.addEventListener('dblclick', dblClickHandler);
  } else if (dblClickMode === 'off') {
    sel.on('dblclick.zoom', null);
  }
  // 'step' → leave d3's native dblclick.zoom bound and attach nothing.

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
      // A programmatic viewport change makes any 'toggle' double-click memory stale:
      // the viewport we would otherwise return to no longer reflects where the user
      // is, so a later toggle-out must start fresh rather than jump back to it. The
      // toggle-out restore path does not route through setViewport, so clearing here
      // never wipes a value mid-restore.
      rememberedViewport = null;

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
        const zm = newOptions.zoomable ?? currentZoomable;
        currentZoomable = zm;
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
      if (toggleAttached) {
        container.removeEventListener('dblclick', dblClickHandler);
      }
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
