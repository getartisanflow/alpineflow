// ============================================================================
// Lasso Hit Testing
//
// Point-in-polygon (ray-casting) and polygon-AABB intersection utilities
// for freeform lasso selection.
// ============================================================================

import type { FlowNode, Rect } from './types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT, getRotatedBounds } from './geometry';

export interface Point {
  x: number;
  y: number;
}

/**
 * Ray-casting algorithm: cast a horizontal ray from (px, py) to the right
 * and count how many polygon edges it crosses. Odd = inside, even = outside.
 */
export function pointInPolygon(px: number, py: number, polygon: Point[]): boolean {
  if (polygon.length < 3) return false;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    if ((yi > py) !== (yj > py) &&
        px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Test whether two line segments (p1->p2) and (p3->p4) intersect.
 */
function segmentsIntersect(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number,
): boolean {
  const d1x = x2 - x1, d1y = y2 - y1;
  const d2x = x4 - x3, d2y = y4 - y3;
  const cross = d1x * d2y - d1y * d2x;
  if (Math.abs(cross) < 1e-10) return false; // parallel

  const dx = x3 - x1, dy = y3 - y1;
  const t = (dx * d2y - dy * d2x) / cross;
  const u = (dx * d1y - dy * d1x) / cross;

  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

/**
 * Test whether any edge of the polygon intersects the AABB, or if the AABB
 * center lies inside the polygon.
 */
export function polygonIntersectsAABB(polygon: Point[], rect: Rect): boolean {
  const rx = rect.x;
  const ry = rect.y;
  const rr = rect.x + rect.width;
  const rb = rect.y + rect.height;

  // Quick check: is the AABB center inside the polygon?
  const cx = rx + rect.width / 2;
  const cy = ry + rect.height / 2;
  if (pointInPolygon(cx, cy, polygon)) return true;

  // Check if any polygon vertex is inside the AABB
  for (const p of polygon) {
    if (p.x >= rx && p.x <= rr && p.y >= ry && p.y <= rb) return true;
  }

  // Check if any polygon edge intersects any AABB edge
  const aabbEdges: [number, number, number, number][] = [
    [rx, ry, rr, ry],   // top
    [rr, ry, rr, rb],   // right
    [rr, rb, rx, rb],   // bottom
    [rx, rb, rx, ry],   // left
  ];

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    for (const [ax, ay, bx, by] of aabbEdges) {
      if (segmentsIntersect(polygon[j].x, polygon[j].y, polygon[i].x, polygon[i].y, ax, ay, bx, by)) {
        return true;
      }
    }
  }

  return false;
}

/** Get the AABB for a node, accounting for rotation. */
function getNodeAABB(node: FlowNode): Rect {
  const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
  if (node.rotation) {
    return getRotatedBounds(node.position.x, node.position.y, w, h, node.rotation);
  }
  return { x: node.position.x, y: node.position.y, width: w, height: h };
}

/**
 * Return nodes that partially overlap the lasso polygon (center inside OR
 * AABB edges intersect polygon edges). Skips hidden and non-selectable nodes.
 */
export function getNodesInPolygon(nodes: FlowNode[], polygon: Point[]): FlowNode[] {
  if (polygon.length < 3) return [];
  return nodes.filter(node => {
    if (node.hidden || node.selectable === false) return false;
    const aabb = getNodeAABB(node);
    return polygonIntersectsAABB(polygon, aabb);
  });
}

/**
 * Return nodes fully enclosed by the lasso polygon (all four AABB corners
 * inside). Skips hidden and non-selectable nodes.
 */
export function getNodesFullyInPolygon(nodes: FlowNode[], polygon: Point[]): FlowNode[] {
  if (polygon.length < 3) return [];
  return nodes.filter(node => {
    if (node.hidden || node.selectable === false) return false;
    const aabb = getNodeAABB(node);
    const corners = [
      { x: aabb.x, y: aabb.y },
      { x: aabb.x + aabb.width, y: aabb.y },
      { x: aabb.x + aabb.width, y: aabb.y + aabb.height },
      { x: aabb.x, y: aabb.y + aabb.height },
    ];
    return corners.every(c => pointInPolygon(c.x, c.y, polygon));
  });
}
