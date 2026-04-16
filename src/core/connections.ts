// ============================================================================
// Connection Controller
//
// Handles drag-to-connect interactions between source and target handles.
// Reworked from @xyflow/system XYHandle (MIT License, Copyright 2019-2025
// webkid GmbH). Split into pure utilities + interaction controller.
//
// Phase 4 implementation.
// ============================================================================

import type { XYPosition, HandlePosition, Connection, ConnectionRules, FlowNode, PendingConnection } from './types';
import { wouldCreateCycle } from './graph';

export interface HandleBounds {
  nodeId: string;
  handleId: string;
  type: 'source' | 'target';
  position: HandlePosition;
  /** Absolute position of the handle center in flow coordinates */
  absolutePosition: XYPosition;
  width: number;
  height: number;
}

/**
 * Check if a point is within the hit area of a handle.
 */
export function isPointInHandle(
  point: XYPosition,
  handle: HandleBounds,
  tolerance: number = 10,
): boolean {
  const halfW = handle.width / 2 + tolerance;
  const halfH = handle.height / 2 + tolerance;

  return (
    Math.abs(point.x - handle.absolutePosition.x) <= halfW &&
    Math.abs(point.y - handle.absolutePosition.y) <= halfH
  );
}

/**
 * Find the closest target handle to a given point.
 */
export function findClosestHandle(
  point: XYPosition,
  handles: HandleBounds[],
  tolerance: number = 20,
): HandleBounds | null {
  let closest: HandleBounds | null = null;
  let closestDist = Infinity;

  for (const handle of handles) {
    const dx = point.x - handle.absolutePosition.x;
    const dy = point.y - handle.absolutePosition.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < tolerance && dist < closestDist) {
      closest = handle;
      closestDist = dist;
    }
  }

  return closest;
}

/**
 * Check canvas-level `connectionRules` against a proposed connection.
 *
 * Evaluation:
 *   1. `byType` map — if source type has an entry, target type must be listed.
 *      Source types with no entry are unrestricted.
 *   2. `validate` function — if present, must return true.
 *
 * Returns true when no rules are configured or all configured rules pass.
 * Returns false as soon as any rule rejects.
 */
export function checkConnectionRules(
  connection: Connection,
  rules: ConnectionRules | undefined,
  nodeMap: Map<string, FlowNode>,
): boolean {
  if (!rules) return true;

  const source = nodeMap.get(connection.source);
  const target = nodeMap.get(connection.target);

  // If either node is unknown let downstream handle it
  if (!source || !target) return true;

  // Map-based type check
  const { byType } = rules;
  if (byType) {
    const sourceType = source.type ?? '';
    if (Object.prototype.hasOwnProperty.call(byType, sourceType)) {
      const allowed = byType[sourceType];
      if (!allowed.includes(target.type ?? '')) return false;
    }
  }

  // Function-based check
  if (typeof rules.validate === 'function') {
    if (!rules.validate(connection, source, target)) return false;
  }

  return true;
}

/**
 * Validate whether a connection is allowed.
 * Basic rules: no self-connections, no duplicate edges.
 * Optional: reject connections that would create a directed cycle.
 */
export function isValidConnection(
  connection: Connection,
  existingEdges: { source: string; target: string; sourceHandle?: string; targetHandle?: string }[],
  options?: { preventCycles?: boolean },
): boolean {
  // No self-connections
  if (connection.source === connection.target) {
    return false;
  }

  // No duplicate edges (same source+target+handles)
  const isDuplicate = existingEdges.some(
    (e) =>
      e.source === connection.source &&
      e.target === connection.target &&
      e.sourceHandle === connection.sourceHandle &&
      e.targetHandle === connection.targetHandle,
  );
  if (isDuplicate) return false;

  // Cycle detection
  if (options?.preventCycles && wouldCreateCycle(connection.source, connection.target, existingEdges)) {
    return false;
  }

  return true;
}
