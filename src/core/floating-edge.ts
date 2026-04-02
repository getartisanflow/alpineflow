// ============================================================================
// Floating Edge Utilities
//
// Pure math functions for computing edge endpoints that connect to the closest
// point on a node's rectangular border. No DOM or Alpine dependencies.
// ============================================================================

import type { XYPosition, FlowNode, HandlePosition } from './types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from './geometry';
import { rotatePoint } from './rotation';

/**
 * Compute the intersection point where a line from a node's center toward
 * a target point crosses the node's rectangular boundary.
 *
 * Uses L1-norm (Manhattan) scaling to find exact border intersection.
 */
export function getNodeIntersection(node: FlowNode, targetCenter: XYPosition): XYPosition {
  const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;

  const nodeCenter: XYPosition = {
    x: node.position.x + w / 2,
    y: node.position.y + h / 2,
  };

  // When rotated, transform the target into the node's local (unrotated)
  // coordinate space so the L1-norm intersection works against the actual
  // rectangle, then rotate the result back to world space.
  const effectiveTarget = node.rotation
    ? rotatePoint(targetCenter.x, targetCenter.y, nodeCenter.x, nodeCenter.y, -node.rotation)
    : targetCenter;

  const dx = effectiveTarget.x - nodeCenter.x;
  const dy = effectiveTarget.y - nodeCenter.y;

  // Guard against zero direction vector (nodes stacked exactly)
  if (dx === 0 && dy === 0) {
    const fallback = { x: nodeCenter.x, y: nodeCenter.y - h / 2 };
    return node.rotation
      ? rotatePoint(fallback.x, fallback.y, nodeCenter.x, nodeCenter.y, node.rotation)
      : fallback;
  }

  const halfW = w / 2;
  const halfH = h / 2;

  // L1-norm intersection: scale direction to hit the rectangle boundary
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let t: number;
  if (absDx / halfW > absDy / halfH) {
    // Hits vertical edge (left or right)
    t = halfW / absDx;
  } else {
    // Hits horizontal edge (top or bottom)
    t = halfH / absDy;
  }

  const localIntersection = {
    x: nodeCenter.x + dx * t,
    y: nodeCenter.y + dy * t,
  };

  // Rotate back to world space
  return node.rotation
    ? rotatePoint(localIntersection.x, localIntersection.y, nodeCenter.x, nodeCenter.y, node.rotation)
    : localIntersection;
}

/**
 * Classify an intersection point on a node's border to a cardinal HandlePosition.
 * Uses 1px tolerance for corner cases.
 */
export function getEdgePosition(node: FlowNode, intersectionPoint: XYPosition): HandlePosition {
  const w = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const h = node.dimensions?.height ?? DEFAULT_NODE_HEIGHT;

  const cx = node.position.x + w / 2;
  const cy = node.position.y + h / 2;

  // For rotated nodes, classify by world-space displacement from center.
  // The intersection point is already in world space, and path generators
  // use world-space tangent directions, so world-space classification
  // produces the correct edge curvature.
  if (node.rotation) {
    const dx = intersectionPoint.x - cx;
    const dy = intersectionPoint.y - cy;
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'bottom' : 'top';
  }

  const tolerance = 1;
  const left = node.position.x;
  const right = node.position.x + w;
  const top = node.position.y;
  const bottom = node.position.y + h;

  if (Math.abs(intersectionPoint.x - left) <= tolerance) return 'left';
  if (Math.abs(intersectionPoint.x - right) <= tolerance) return 'right';
  if (Math.abs(intersectionPoint.y - top) <= tolerance) return 'top';
  if (Math.abs(intersectionPoint.y - bottom) <= tolerance) return 'bottom';

  // Fallback: determine by largest displacement from center
  const dx = intersectionPoint.x - cx;
  const dy = intersectionPoint.y - cy;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }

  return dy > 0 ? 'bottom' : 'top';
}

/**
 * Compute floating edge parameters for both source and target nodes.
 * Returns the intersection points and their cardinal positions.
 */
export function getFloatingEdgeParams(
  sourceNode: FlowNode,
  targetNode: FlowNode,
): { sx: number; sy: number; tx: number; ty: number; sourcePos: HandlePosition; targetPos: HandlePosition } {
  const sw = sourceNode.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const sh = sourceNode.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
  const tw = targetNode.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const th = targetNode.dimensions?.height ?? DEFAULT_NODE_HEIGHT;

  const sourceCenter: XYPosition = {
    x: sourceNode.position.x + sw / 2,
    y: sourceNode.position.y + sh / 2,
  };
  const targetCenter: XYPosition = {
    x: targetNode.position.x + tw / 2,
    y: targetNode.position.y + th / 2,
  };

  const sourceIntersection = getNodeIntersection(sourceNode, targetCenter);
  const targetIntersection = getNodeIntersection(targetNode, sourceCenter);

  const sourcePos = getEdgePosition(sourceNode, sourceIntersection);
  const targetPos = getEdgePosition(targetNode, targetIntersection);

  return {
    sx: sourceIntersection.x,
    sy: sourceIntersection.y,
    tx: targetIntersection.x,
    ty: targetIntersection.y,
    sourcePos,
    targetPos,
  };
}

/**
 * Simpler alternative that returns cardinal positions based on center-to-center direction.
 * Useful for advanced users who compute their own intersection points.
 */
export function getSimpleFloatingPosition(
  sourceCenter: XYPosition,
  targetCenter: XYPosition,
): { sourcePos: HandlePosition; targetPos: HandlePosition } {
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;

  let sourcePos: HandlePosition;
  let targetPos: HandlePosition;

  if (Math.abs(dx) > Math.abs(dy)) {
    sourcePos = dx > 0 ? 'right' : 'left';
    targetPos = dx > 0 ? 'left' : 'right';
  } else {
    sourcePos = dy > 0 ? 'bottom' : 'top';
    targetPos = dy > 0 ? 'top' : 'bottom';
  }

  return { sourcePos, targetPos };
}
