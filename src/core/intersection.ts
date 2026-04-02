// ============================================================================
// Intersection Detection & Collision Avoidance
//
// Pure geometry functions for node overlap detection and collision prevention.
// ============================================================================

import type { FlowNode, Rect } from './types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT, getNodeVisualPosition } from './geometry';

/** Get the bounding rect of a node (uses measured or default dimensions). */
export function getNodeRect(
  node: FlowNode,
  globalOrigin?: [number, number],
): Rect {
  const vp = getNodeVisualPosition(node, globalOrigin);
  return {
    x: vp.x,
    y: vp.y,
    width: node.dimensions?.width ?? DEFAULT_NODE_WIDTH,
    height: node.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
  };
}

/** AABB overlap test between two rectangles. */
export function rectsIntersect(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Return all nodes whose bounding rect overlaps the given node.
 * `partially` (default true) — any overlap counts. If false, only full containment.
 */
export function getIntersectingNodes(
  node: FlowNode,
  candidates: FlowNode[],
  partially: boolean = true,
): FlowNode[] {
  const rect = getNodeRect(node);
  return candidates.filter((c) => {
    if (c.id === node.id) return false;
    const cr = getNodeRect(c);
    if (partially) return rectsIntersect(rect, cr);
    // Full containment: rect fully contains cr
    return (
      rect.x <= cr.x &&
      rect.y <= cr.y &&
      rect.x + rect.width >= cr.x + cr.width &&
      rect.y + rect.height >= cr.y + cr.height
    );
  });
}

/**
 * Check if a specific node intersects with the given node.
 * `partially` (default true) — any overlap counts. If false, only full containment.
 */
export function isNodeIntersecting(
  node: FlowNode,
  target: FlowNode,
  partially: boolean = true,
): boolean {
  if (node.id === target.id) return false;
  const rect = getNodeRect(node);
  const tr = getNodeRect(target);
  if (partially) return rectsIntersect(rect, tr);
  return (
    rect.x <= tr.x &&
    rect.y <= tr.y &&
    rect.x + rect.width >= tr.x + tr.width &&
    rect.y + rect.height >= tr.y + tr.height
  );
}

/**
 * Clamp a position to avoid overlap with other node rects.
 * Returns the nearest non-overlapping position (pushes out along shortest axis).
 *
 * Note: Uses a single pass — chain overlaps (A pushed into B pushed into C)
 * may not be fully resolved. This is intentional: a single pass is fast enough
 * for real-time drag interactions where the user repositions continuously.
 */
export function clampToAvoidOverlap(
  position: { x: number; y: number },
  nodeWidth: number,
  nodeHeight: number,
  otherRects: Rect[],
  gap: number = 5,
): { x: number; y: number } {
  let { x, y } = position;

  for (const r of otherRects) {
    const nodeRight = x + nodeWidth;
    const nodeBottom = y + nodeHeight;
    const rRight = r.x + r.width;
    const rBottom = r.y + r.height;

    if (x < rRight + gap && nodeRight > r.x - gap && y < rBottom + gap && nodeBottom > r.y - gap) {
      // Overlapping — find shortest escape direction
      const pushLeft = nodeRight - (r.x - gap);
      const pushRight = rRight + gap - x;
      const pushUp = nodeBottom - (r.y - gap);
      const pushDown = rBottom + gap - y;
      const min = Math.min(pushLeft, pushRight, pushUp, pushDown);

      if (min === pushLeft) x -= pushLeft;
      else if (min === pushRight) x += pushRight;
      else if (min === pushUp) y -= pushUp;
      else y += pushDown;
    }
  }

  return { x, y };
}
