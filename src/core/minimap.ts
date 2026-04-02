// ============================================================================
// MiniMap
//
// A bird's-eye view overlay showing all nodes as simplified SVG rectangles
// with a viewport indicator mask. Optionally supports click-to-pan and
// scroll-to-zoom interaction.
// ============================================================================

import type { FlowNode, Viewport, FlowCanvasConfig } from './types';
import { getNodesBounds, DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from './geometry';

const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = 150;
const BOUNDS_PADDING = 1.2;
const SVG_NS = 'http://www.w3.org/2000/svg';

export interface MiniMapState {
  nodes: FlowNode[];
  viewport: Viewport;
  containerWidth: number;
  containerHeight: number;
}

export interface MiniMapOptions {
  getState: () => MiniMapState;
  setViewport: (vp: Partial<Viewport>) => void;
  config: FlowCanvasConfig;
}

export interface MiniMapInstance {
  render(): void;
  updateViewport(): void;
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

  // ── Build DOM ──────────────────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.className = `flow-minimap flow-minimap-${position}`;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(MINIMAP_WIDTH));
  svg.setAttribute('height', String(MINIMAP_HEIGHT));

  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.classList.add('flow-minimap-bg');
  bg.setAttribute('width', String(MINIMAP_WIDTH));
  bg.setAttribute('height', String(MINIMAP_HEIGHT));
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
      cachedBounds.width / MINIMAP_WIDTH,
      cachedBounds.height / MINIMAP_HEIGHT,
    ) * BOUNDS_PADDING;
  }

  function getNodeFill(node: FlowNode): string | undefined {
    if (typeof nodeColor === 'function') {
      return nodeColor(node);
    }
    return nodeColor;
  }

  // ── Render ─────────────────────────────────────────────────────────
  function render(): void {
    const state = getState();

    computeScale();

    // Clear existing node rects
    nodesGroup.innerHTML = '';

    // Offset to center the bounds in the minimap
    const offsetX = (MINIMAP_WIDTH - cachedBounds.width / cachedScale) / 2;
    const offsetY = (MINIMAP_HEIGHT - cachedBounds.height / cachedScale) / 2;

    for (const node of state.nodes) {
      if (node.hidden) continue;
      const rect = document.createElementNS(SVG_NS, 'rect');
      const w = (node.dimensions?.width ?? DEFAULT_NODE_WIDTH) / cachedScale;
      const h = (node.dimensions?.height ?? DEFAULT_NODE_HEIGHT) / cachedScale;
      const x = (node.position.x - cachedBounds.x) / cachedScale + offsetX;
      const y = (node.position.y - cachedBounds.y) / cachedScale + offsetY;

      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', String(w));
      rect.setAttribute('height', String(h));
      rect.setAttribute('rx', '2');
      // Fill controlled via CSS --flow-minimap-node-color; override with inline style
      // when user configured minimapNodeColor (inline style beats CSS property).
      const fill = getNodeFill(node);
      if (fill) {
        rect.style.fill = fill;
      }
      nodesGroup.appendChild(rect);
    }

    updateViewport();
  }

  // ── Viewport mask ──────────────────────────────────────────────────
  function updateViewport(): void {
    const state = getState();

    if (cachedBounds.width === 0 && cachedBounds.height === 0) {
      maskPath.setAttribute('d', '');
      return;
    }

    const offsetX = (MINIMAP_WIDTH - cachedBounds.width / cachedScale) / 2;
    const offsetY = (MINIMAP_HEIGHT - cachedBounds.height / cachedScale) / 2;

    // Viewport rect in flow coordinates → minimap coordinates
    const vpX = (-state.viewport.x / state.viewport.zoom - cachedBounds.x) / cachedScale + offsetX;
    const vpY = (-state.viewport.y / state.viewport.zoom - cachedBounds.y) / cachedScale + offsetY;
    const vpW = (state.containerWidth / state.viewport.zoom) / cachedScale;
    const vpH = (state.containerHeight / state.viewport.zoom) / cachedScale;

    // Evenodd path: outer rect minus inner viewport rect
    const outer = `M0,0 H${MINIMAP_WIDTH} V${MINIMAP_HEIGHT} H0 Z`;
    const inner = `M${vpX},${vpY} h${vpW} v${vpH} h${-vpW} Z`;
    maskPath.setAttribute('d', `${outer} ${inner}`);
  }

  // ── Pan interaction ────────────────────────────────────────────────
  let isPanning = false;

  function minimapToFlowPosition(mmX: number, mmY: number): { x: number; y: number } {
    const offsetX = (MINIMAP_WIDTH - cachedBounds.width / cachedScale) / 2;
    const offsetY = (MINIMAP_HEIGHT - cachedBounds.height / cachedScale) / 2;

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
    wrapper.remove();
  }

  return { render, updateViewport, destroy };
}
