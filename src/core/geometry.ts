// ============================================================================
// Geometry Utilities
//
// Coordinate transforms between screen space and flow space, bounding box
// calculations for fitView, and DOM measurement helpers.
// ============================================================================

import type { XYPosition, Viewport, Rect, Dimensions, FlowNode } from './types';

/**
 * Convert screen (client) coordinates to flow coordinates.
 */
export function screenToFlowPosition(
  screenX: number,
  screenY: number,
  viewport: Viewport,
  containerRect: DOMRect,
): XYPosition {
  return {
    x: (screenX - containerRect.left - viewport.x) / viewport.zoom,
    y: (screenY - containerRect.top - viewport.y) / viewport.zoom,
  };
}

/**
 * Convert flow coordinates to screen (client) coordinates.
 */
export function flowToScreenPosition(
  flowX: number,
  flowY: number,
  viewport: Viewport,
  containerRect: DOMRect,
): XYPosition {
  return {
    x: flowX * viewport.zoom + viewport.x + containerRect.left,
    y: flowY * viewport.zoom + viewport.y + containerRect.top,
  };
}

/**
 * Calculate the bounding box that contains all given nodes.
 */
export const DEFAULT_NODE_WIDTH = 150;
export const DEFAULT_NODE_HEIGHT = 50;

/**
 * Compute the axis-aligned bounding box of a rectangle rotated around its center.
 * Returns the expanded AABB in the same coordinate space as the input.
 */
export function getRotatedBounds(
  x: number,
  y: number,
  w: number,
  h: number,
  rotation: number,
): Rect {
  if (rotation % 360 === 0) return { x, y, width: w, height: h };

  const rad = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const newW = w * cos + h * sin;
  const newH = w * sin + h * cos;
  const cx = x + w / 2;
  const cy = y + h / 2;

  return { x: cx - newW / 2, y: cy - newH / 2, width: newW, height: newH };
}

export function getNodesBounds(
  nodes: FlowNode[],
  globalOrigin?: [number, number],
): Rect {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
    const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;

    const vp = getNodeVisualPosition(node, globalOrigin);
    const bounds = node.rotation
      ? getRotatedBounds(vp.x, vp.y, w, h, node.rotation)
      : { x: vp.x, y: vp.y, width: w, height: h };

    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Return all nodes whose bounding box intersects the given rectangle.
 * Uses AABB intersection with DEFAULT_NODE_WIDTH/HEIGHT fallback.
 */
export function getNodesInRect(
  nodes: FlowNode[],
  rect: Rect,
  globalOrigin?: [number, number],
): FlowNode[] {
  const rectRight = rect.x + rect.width;
  const rectBottom = rect.y + rect.height;

  return nodes.filter((node) => {
    const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
    const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;

    const vp = getNodeVisualPosition(node, globalOrigin);
    const bounds = node.rotation
      ? getRotatedBounds(vp.x, vp.y, w, h, node.rotation)
      : { x: vp.x, y: vp.y, width: w, height: h };

    const nodeRight = bounds.x + bounds.width;
    const nodeBottom = bounds.y + bounds.height;

    return !(
      nodeRight < rect.x ||
      bounds.x > rectRight ||
      nodeBottom < rect.y ||
      bounds.y > rectBottom
    );
  });
}

/**
 * Return all nodes whose bounding box is fully contained within the given rectangle.
 * Uses DEFAULT_NODE_WIDTH/HEIGHT fallback for nodes without measured dimensions.
 */
export function getNodesFullyInRect(
  nodes: FlowNode[],
  rect: Rect,
  globalOrigin?: [number, number],
): FlowNode[] {
  const rectRight = rect.x + rect.width;
  const rectBottom = rect.y + rect.height;

  return nodes.filter((node) => {
    const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
    const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;

    const vp = getNodeVisualPosition(node, globalOrigin);
    const bounds = node.rotation
      ? getRotatedBounds(vp.x, vp.y, w, h, node.rotation)
      : { x: vp.x, y: vp.y, width: w, height: h };

    return (
      bounds.x >= rect.x &&
      bounds.y >= rect.y &&
      bounds.x + bounds.width <= rectRight &&
      bounds.y + bounds.height <= rectBottom
    );
  });
}

/**
 * Calculate the viewport transform needed to fit a rect into a container.
 */
export function getViewportForBounds(
  bounds: Rect,
  containerWidth: number,
  containerHeight: number,
  minZoom: number,
  maxZoom: number,
  padding: number = 0.1,
): Viewport {
  const effectiveWidth = Math.max(bounds.width, 1);
  const effectiveHeight = Math.max(bounds.height, 1);

  const paddedWidth = effectiveWidth * (1 + padding);
  const paddedHeight = effectiveHeight * (1 + padding);

  const zoomX = containerWidth / paddedWidth;
  const zoomY = containerHeight / paddedHeight;
  const zoom = Math.min(Math.max(Math.min(zoomX, zoomY), minZoom), maxZoom);

  const boundsCenter = { x: bounds.x + effectiveWidth / 2, y: bounds.y + effectiveHeight / 2 };
  const x = containerWidth / 2 - boundsCenter.x * zoom;
  const y = containerHeight / 2 - boundsCenter.y * zoom;

  return { x, y, zoom };
}

// ─── Viewport Culling Utilities ─────────────────────────────────────────────

/** Axis-aligned bounds (min/max form, not x/y/width/height) */
export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Compute the visible bounds in flow coordinates given viewport state,
 * container dimensions, and a buffer margin.
 */
export function getVisibleBounds(
  viewport: Viewport,
  containerWidth: number,
  containerHeight: number,
  buffer: number,
): Bounds {
  const invZoom = 1 / viewport.zoom;

  return {
    minX: (0 - viewport.x) * invZoom - buffer,
    minY: (0 - viewport.y) * invZoom - buffer,
    maxX: (containerWidth - viewport.x) * invZoom + buffer,
    maxY: (containerHeight - viewport.y) * invZoom + buffer,
  };
}

/**
 * Grid-based spatial index for fast viewport queries.
 *
 * Flow space is divided into cells of `cellSize` pixels.
 * Each cell holds a Set of node IDs whose bounding boxes overlap that cell.
 * Viewport queries find all cells overlapping the query bounds, then
 * union their node sets — O(cells) instead of O(nodes).
 */
export class SpatialGrid {
  private _cellSize: number;
  private _cells = new Map<string, Set<string>>();
  private _nodeCells = new Map<string, string[]>();

  constructor(cellSize: number = 300) {
    this._cellSize = cellSize;
  }

  private _cellKey(cx: number, cy: number): string {
    return `${cx},${cy}`;
  }

  private _getCellRange(
    x: number,
    y: number,
    w: number,
    h: number,
  ): { minCX: number; minCY: number; maxCX: number; maxCY: number } {
    return {
      minCX: Math.floor(x / this._cellSize),
      minCY: Math.floor(y / this._cellSize),
      maxCX: Math.floor((x + w) / this._cellSize),
      maxCY: Math.floor((y + h) / this._cellSize),
    };
  }

  insert(id: string, x: number, y: number, w: number, h: number): void {
    this.remove(id);
    const { minCX, minCY, maxCX, maxCY } = this._getCellRange(x, y, w, h);
    const keys: string[] = [];
    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cy = minCY; cy <= maxCY; cy++) {
        const key = this._cellKey(cx, cy);
        keys.push(key);
        let cell = this._cells.get(key);
        if (!cell) {
          cell = new Set();
          this._cells.set(key, cell);
        }
        cell.add(id);
      }
    }
    this._nodeCells.set(id, keys);
  }

  remove(id: string): void {
    const keys = this._nodeCells.get(id);
    if (!keys) {
      return;
    }
    for (const key of keys) {
      const cell = this._cells.get(key);
      if (cell) {
        cell.delete(id);
        if (cell.size === 0) {
          this._cells.delete(key);
        }
      }
    }
    this._nodeCells.delete(id);
  }

  update(id: string, x: number, y: number, w: number, h: number): void {
    this.insert(id, x, y, w, h);
  }

  query(bounds: Bounds): Set<string> {
    const { minCX, minCY, maxCX, maxCY } = this._getCellRange(
      bounds.minX,
      bounds.minY,
      bounds.maxX - bounds.minX,
      bounds.maxY - bounds.minY,
    );
    const result = new Set<string>();
    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cy = minCY; cy <= maxCY; cy++) {
        const cell = this._cells.get(this._cellKey(cx, cy));
        if (cell) {
          for (const id of cell) {
            result.add(id);
          }
        }
      }
    }
    return result;
  }

  clear(): void {
    this._cells.clear();
    this._nodeCells.clear();
  }

  get size(): number {
    return this._nodeCells.size;
  }
}

// ─── Node Origin Utilities ──────────────────────────────────────────────────

/**
 * Compute the pixel offset from a node's anchor point to its visual top-left corner.
 * Returns {x: 0, y: 0} for the default [0, 0] origin.
 */
export function getOriginOffset(
  origin: [number, number] | undefined,
  width: number,
  height: number,
): XYPosition {
  if (!origin || (origin[0] === 0 && origin[1] === 0)) return { x: 0, y: 0 };
  return { x: -width * origin[0], y: -height * origin[1] };
}

/**
 * Get the visual top-left position of a node, accounting for nodeOrigin.
 * The node's `position` is its anchor point; this returns where the DOM
 * element's top-left corner should be placed.
 */
export function getNodeVisualPosition(
  node: FlowNode,
  globalOrigin?: [number, number],
): XYPosition {
  if (!node.position) return { x: 0, y: 0 };
  const origin = node.nodeOrigin ?? globalOrigin ?? [0, 0];
  const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
  return {
    x: node.position.x - w * origin[0],
    y: node.position.y - h * origin[1],
  };
}
