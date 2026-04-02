import type { FlowNode } from './types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT, getNodeVisualPosition } from './geometry';

export interface NodeBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HelperLineResult {
  /** Horizontal guide Y positions */
  horizontal: number[];
  /** Vertical guide X positions */
  vertical: number[];
  /** Snap offset to apply to dragged position */
  snapOffset: { x: number; y: number };
}

/**
 * Get bounding box for a node.
 */
export function nodeToBox(
  node: FlowNode,
  globalOrigin?: [number, number],
): NodeBox {
  const vp = getNodeVisualPosition(node, globalOrigin);
  return {
    id: node.id,
    x: vp.x,
    y: vp.y,
    width: node.dimensions?.width ?? DEFAULT_NODE_WIDTH,
    height: node.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
  };
}

/**
 * Compute alignment guides between a dragged box and other boxes.
 *
 * Checks 5 horizontal alignments (top-top, bottom-bottom, center-center, top-bottom, bottom-top)
 * and 5 vertical alignments (left-left, right-right, center-center, left-right, right-left).
 *
 * Returns deduplicated guide positions and the snap offset for the closest alignment per axis.
 */
export function computeHelperLines(
  dragged: NodeBox,
  others: NodeBox[],
  threshold: number,
): HelperLineResult {
  const horizontal: Set<number> = new Set();
  const vertical: Set<number> = new Set();
  let snapX = 0;
  let snapY = 0;
  let closestDx = Infinity;
  let closestDy = Infinity;

  const dragCenterX = dragged.x + dragged.width / 2;
  const dragCenterY = dragged.y + dragged.height / 2;
  const dragRight = dragged.x + dragged.width;
  const dragBottom = dragged.y + dragged.height;

  for (const other of others) {
    const otherCenterX = other.x + other.width / 2;
    const otherCenterY = other.y + other.height / 2;
    const otherRight = other.x + other.width;
    const otherBottom = other.y + other.height;

    // ── Vertical alignments (X axis) ────────────────────────────
    const vChecks: [number, number][] = [
      [dragged.x, other.x],           // left-left
      [dragRight, otherRight],         // right-right
      [dragCenterX, otherCenterX],     // center-center
      [dragged.x, otherRight],         // left-right
      [dragRight, other.x],            // right-left
    ];

    for (const [dragVal, otherVal] of vChecks) {
      const dx = otherVal - dragVal;
      if (Math.abs(dx) <= threshold) {
        vertical.add(otherVal);
        if (Math.abs(dx) < Math.abs(closestDx)) {
          closestDx = dx;
          snapX = dx;
        }
      }
    }

    // ── Horizontal alignments (Y axis) ──────────────────────────
    const hChecks: [number, number][] = [
      [dragged.y, other.y],            // top-top
      [dragBottom, otherBottom],        // bottom-bottom
      [dragCenterY, otherCenterY],     // center-center
      [dragged.y, otherBottom],        // top-bottom
      [dragBottom, other.y],           // bottom-top
    ];

    for (const [dragVal, otherVal] of hChecks) {
      const dy = otherVal - dragVal;
      if (Math.abs(dy) <= threshold) {
        horizontal.add(otherVal);
        if (Math.abs(dy) < Math.abs(closestDy)) {
          closestDy = dy;
          snapY = dy;
        }
      }
    }
  }

  return {
    horizontal: [...horizontal],
    vertical: [...vertical],
    snapOffset: { x: snapX, y: snapY },
  };
}
