// ============================================================================
// MiniMap
//
// A bird's-eye view overlay showing all nodes as simplified SVG rectangles
// with a viewport indicator mask. Optionally supports click-to-pan and
// scroll-to-zoom interaction.
// ============================================================================

import type { FlowNode, Viewport, FlowCanvasConfig } from './types';
import { isolateCanvasGestures } from './canvas-gestures';
import { getNodesBounds, DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from './geometry';

/* The box a minimap gets when nobody says otherwise. A consumer that wants another shape passes
 * `minimapWidth`/`minimapHeight`, or calls `resize()` when the window changes under it — the
 * numbers are per instance rather than per module for exactly that reason: a minimap whose ratio
 * does not match the canvas draws a viewport rectangle that is not the shape of the viewport. */
export const MINIMAP_DEFAULT_WIDTH = 200;
export const MINIMAP_DEFAULT_HEIGHT = 150;
const BOUNDS_PADDING = 1.2;
const SVG_NS = 'http://www.w3.org/2000/svg';

export interface MiniMapState {
  nodes: FlowNode[];
  viewport: Viewport;
  containerWidth: number;
  containerHeight: number;
}

/** Subset of state that `updateViewport` needs — no node mapping. */
export interface MiniMapViewportState {
  viewport: Viewport;
  containerWidth: number;
  containerHeight: number;
}

export interface MiniMapOptions {
  getState: () => MiniMapState;
  /**
   * Lean getter used by `updateViewport` — resolves only the viewport and
   * container size, skipping the full `toAbsoluteNodes` remap `getState` does.
   * Falls back to `getState` when omitted.
   */
  getViewportState?: () => MiniMapViewportState;
  setViewport: (vp: Partial<Viewport>) => void;
  config: FlowCanvasConfig;
}

export interface MiniMapInstance {
  render(): void;
  updateViewport(): void;
  /**
   * Give it another box. Redraws at the new size; ignores a width or height that is not positive.
   * Returns whether the box actually changed, so a caller can keep config and events in step with
   * what was drawn rather than with what was asked for.
   */
  resize(width: number, height: number): boolean;
  destroy(): void;
}

export function createMiniMap(
  container: HTMLElement,
  options: MiniMapOptions,
): MiniMapInstance {
  const { getState, setViewport, config } = options;
  const position = config.minimapPosition ?? 'bottom-right';
  const maskColor = config.minimapMaskColor;
  const nodeColor = config.minimapNodeColor;

  let width = config.minimapWidth ?? MINIMAP_DEFAULT_WIDTH;
  let height = config.minimapHeight ?? MINIMAP_DEFAULT_HEIGHT;

  // ── Build DOM ──────────────────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.className = `flow-minimap flow-minimap-${position}`;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));

  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.classList.add('flow-minimap-bg');
  bg.setAttribute('width', String(width));
  bg.setAttribute('height', String(height));
  // Fill controlled via CSS --flow-minimap-bg; no inline attribute needed

  const nodesGroup = document.createElementNS(SVG_NS, 'g');
  nodesGroup.classList.add('flow-minimap-nodes');

  const maskPath = document.createElementNS(SVG_NS, 'path');
  maskPath.classList.add('flow-minimap-mask');
  // Fill controlled via CSS --flow-minimap-mask-color; override only if user configured explicitly
  if (maskColor) {
    maskPath.setAttribute('fill', maskColor);
  }
  maskPath.setAttribute('fill-rule', 'evenodd');

  svg.appendChild(bg);
  svg.appendChild(nodesGroup);
  svg.appendChild(maskPath);
  wrapper.appendChild(svg);
  container.appendChild(wrapper);

  // ── Cached bounds for viewport-only updates ────────────────────────
  let cachedBounds = { x: 0, y: 0, width: 0, height: 0 };
  let cachedScale = 1;

  function computeScale(): void {
    const state = getState();
    cachedBounds = getNodesBounds(state.nodes.filter((n) => !n.hidden), config.nodeOrigin);

    if (cachedBounds.width === 0 && cachedBounds.height === 0) {
      cachedScale = 1;
      return;
    }

    cachedScale = Math.max(
      cachedBounds.width / width,
      cachedBounds.height / height,
    ) * BOUNDS_PADDING;
  }

  function getNodeFill(node: FlowNode): string | undefined {
    if (typeof nodeColor === 'function') {
      return nodeColor(node);
    }
    return nodeColor;
  }

  // ── Render ─────────────────────────────────────────────────────────
  //
  // The rects are kept and updated, never thrown away and rebuilt.
  //
  // `render()` runs on every state change, which during a node drag is once per
  // pointer move. Clearing `nodesGroup` and creating a fresh <rect> per node is a
  // STRUCTURAL change inside the SVG, and Blink answers one of those by
  // invalidating the layout of the whole SVG root — which then has to be resolved
  // again before the next geometry read the frame makes, and a canvas frame makes
  // a great many of those resolving edge endpoints.
  //
  // Measured on a ten-node graph in Chrome 150: ~120ms per frame, so a drag ran at
  // 7fps and the pointer reported 50 moves a second while the page could answer 5.
  // WebKit and Gecko charge almost nothing for the identical rebuild and hold 60fps,
  // which is what made this look like a rendering bug rather than a DOM one.
  //
  // Writing attributes onto rects that are already in the tree leaves the structure
  // alone, so there is nothing for that invalidation to fire on. The pool grows to
  // the high-water mark of visible nodes and gives back whatever it stops needing.
  const nodeRects: SVGRectElement[] = [];

  function setIfChanged(el: Element, name: string, value: string): void {
    if (el.getAttribute(name) !== value) {
      el.setAttribute(name, value);
    }
  }

  function render(): void {
    const state = getState();

    computeScale();

    // Offset to center the bounds in the minimap
    const offsetX = (width - cachedBounds.width / cachedScale) / 2;
    const offsetY = (height - cachedBounds.height / cachedScale) / 2;

    let used = 0;

    for (const node of state.nodes) {
      if (node.hidden) continue;

      let rect = nodeRects[used];

      if (!rect) {
        rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('rx', '2');
        nodeRects[used] = rect;
      }

      // A consumer that emptied the group behind our back gets its rects back
      // rather than a minimap that has quietly stopped moving.
      if (rect.parentNode !== nodesGroup) {
        nodesGroup.appendChild(rect);
      }

      const w = (node.dimensions?.width ?? DEFAULT_NODE_WIDTH) / cachedScale;
      const h = (node.dimensions?.height ?? DEFAULT_NODE_HEIGHT) / cachedScale;
      const x = (node.position.x - cachedBounds.x) / cachedScale + offsetX;
      const y = (node.position.y - cachedBounds.y) / cachedScale + offsetY;

      setIfChanged(rect, 'x', String(x));
      setIfChanged(rect, 'y', String(y));
      setIfChanged(rect, 'width', String(w));
      setIfChanged(rect, 'height', String(h));

      // Fill controlled via CSS --flow-minimap-node-color; override with inline style
      // when user configured minimapNodeColor (inline style beats CSS property).
      // Cleared when it stops being configured, because this rect may have been
      // drawn for a different node last time.
      const fill = getNodeFill(node);
      if (fill) {
        if (rect.style.fill !== fill) {
          rect.style.fill = fill;
        }
      } else if (rect.style.fill) {
        rect.style.removeProperty('fill');
      }

      used++;
    }

    // What this pass did not need: a node deleted, or hidden since the last one.
    for (let i = nodeRects.length - 1; i >= used; i--) {
      nodeRects[i].remove();
    }
    nodeRects.length = used;

    updateViewport();
  }

  // ── Viewport mask ──────────────────────────────────────────────────
  function updateViewport(): void {
    // Lean path: only viewport + container size are read below, so skip the
    // per-frame full-node remap that getState performs.
    const state = options.getViewportState ? options.getViewportState() : getState();

    if (cachedBounds.width === 0 && cachedBounds.height === 0) {
      maskPath.setAttribute('d', '');
      return;
    }

    const offsetX = (width - cachedBounds.width / cachedScale) / 2;
    const offsetY = (height - cachedBounds.height / cachedScale) / 2;

    // Viewport rect in flow coordinates → minimap coordinates
    const vpX = (-state.viewport.x / state.viewport.zoom - cachedBounds.x) / cachedScale + offsetX;
    const vpY = (-state.viewport.y / state.viewport.zoom - cachedBounds.y) / cachedScale + offsetY;
    const vpW = (state.containerWidth / state.viewport.zoom) / cachedScale;
    const vpH = (state.containerHeight / state.viewport.zoom) / cachedScale;

    // Evenodd path: outer rect minus inner viewport rect
    const outer = `M0,0 H${width} V${height} H0 Z`;
    const inner = `M${vpX},${vpY} h${vpW} v${vpH} h${-vpW} Z`;
    maskPath.setAttribute('d', `${outer} ${inner}`);
  }

  // ── Pan interaction ────────────────────────────────────────────────
  let isPanning = false;

  function minimapToFlowPosition(mmX: number, mmY: number): { x: number; y: number } {
    const offsetX = (width - cachedBounds.width / cachedScale) / 2;
    const offsetY = (height - cachedBounds.height / cachedScale) / 2;

    const flowX = (mmX - offsetX) * cachedScale + cachedBounds.x;
    const flowY = (mmY - offsetY) * cachedScale + cachedBounds.y;

    return { x: flowX, y: flowY };
  }

  function handlePan(e: PointerEvent): void {
    const rect = svg.getBoundingClientRect();
    const mmX = e.clientX - rect.left;
    const mmY = e.clientY - rect.top;

    const state = getState();
    const flow = minimapToFlowPosition(mmX, mmY);

    // Center the viewport on the clicked flow position
    const newX = -flow.x * state.viewport.zoom + state.containerWidth / 2;
    const newY = -flow.y * state.viewport.zoom + state.containerHeight / 2;

    setViewport({ x: newX, y: newY, zoom: state.viewport.zoom });
  }

  function onPointerDown(e: PointerEvent): void {
    if (!config.minimapPannable) {
      return;
    }
    isPanning = true;
    svg.setPointerCapture(e.pointerId);
    handlePan(e);
  }

  function onPointerMove(e: PointerEvent): void {
    if (!isPanning) {
      return;
    }
    handlePan(e);
  }

  function onPointerUp(e: PointerEvent): void {
    if (!isPanning) {
      return;
    }
    isPanning = false;
    svg.releasePointerCapture(e.pointerId);
  }

  svg.addEventListener('pointerdown', onPointerDown);
  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);

  // The minimap owns a double-click on itself: two clicks in it are two pans, and the canvas's
  // double-click zoom sits on the container, so without this the second one also toggled the
  // zoom — a click meant to move the view jumped it to another scale as well.
  //
  // Only that one. A drag on the minimap is the minimap's to interpret, and what the container
  // does with the same press is a separate question from this fix — so the subset is stated
  // rather than left as an omission from a list copied by hand.
  const releaseGestures = isolateCanvasGestures(wrapper, ['dblclick']);

  // ── Zoom interaction ───────────────────────────────────────────────
  function onWheel(e: WheelEvent): void {
    if (!config.minimapZoomable) {
      return;
    }
    e.preventDefault();

    const state = getState();
    const minZoom = config.minZoom ?? 0.5;
    const maxZoom = config.maxZoom ?? 2;
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(state.viewport.zoom * zoomFactor, minZoom), maxZoom);

    setViewport({ zoom: newZoom });
  }

  svg.addEventListener('wheel', onWheel, { passive: false });

  // ── Destroy ────────────────────────────────────────────────────────
  function destroy(): void {
    svg.removeEventListener('pointerdown', onPointerDown);
    svg.removeEventListener('pointermove', onPointerMove);
    svg.removeEventListener('pointerup', onPointerUp);
    svg.removeEventListener('wheel', onWheel);
    releaseGestures();
    nodeRects.length = 0;
    wrapper.remove();
  }

  /**
   * Another box, without rebuilding anything.
   *
   * The size is not only how big the picture is: the scale that fits the graph into it and the
   * rectangle that marks the viewport are both computed against it, so a minimap that keeps its
   * shape while the canvas changes shape draws a viewport marker that is not the shape of the
   * viewport. A consumer watching its container calls this and everything follows.
   *
   * Returns whether anything changed: false for a box that is not a box, and false for the box it
   * already has. Callers use that to avoid announcing a resize that did not happen.
   */
  function resize(nextWidth: number, nextHeight: number): boolean {
    if (! (nextWidth > 0) || ! (nextHeight > 0) || (nextWidth === width && nextHeight === height)) {
      return false;
    }

    width = nextWidth;
    height = nextHeight;

    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    bg.setAttribute('width', String(width));
    bg.setAttribute('height', String(height));

    render();
    return true;
  }

  return { render, updateViewport, resize, destroy };
}
