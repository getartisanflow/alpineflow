import type { XYPosition } from './types';

interface NodeCenter {
  id: string;
  center: XYPosition;
}

export interface ProximityCandidate {
  source: string;
  target: string;
  targetId: string;
  distance: number;
  targetCenter: XYPosition;
}

/**
 * Infer source/target direction from two node positions.
 * Node further left = source. If X is similar (within 30px), node further up = source.
 */
export function inferDirection(
  centerA: XYPosition,
  centerB: XYPosition,
  idA: string,
  idB: string,
): { source: string; target: string } {
  const dx = Math.abs(centerA.x - centerB.x);
  if (dx > 30) {
    return centerA.x < centerB.x
      ? { source: idA, target: idB }
      : { source: idB, target: idA };
  }
  return centerA.y < centerB.y
    ? { source: idA, target: idB }
    : { source: idB, target: idA };
}

/**
 * Find the closest node to the dragged node within the proximity threshold.
 */
export function findProximityCandidate(
  draggedId: string,
  draggedCenter: XYPosition,
  allNodes: NodeCenter[],
  threshold: number,
): ProximityCandidate | null {
  let closest: ProximityCandidate | null = null;
  let minDist = threshold;

  for (const node of allNodes) {
    if (node.id === draggedId) continue;
    const dist = Math.sqrt(
      (draggedCenter.x - node.center.x) ** 2 + (draggedCenter.y - node.center.y) ** 2,
    );
    if (dist < minDist) {
      minDist = dist;
      const { source, target } = inferDirection(draggedCenter, node.center, draggedId, node.id);
      closest = { source, target, targetId: node.id, distance: dist, targetCenter: node.center };
    }
  }

  return closest;
}
