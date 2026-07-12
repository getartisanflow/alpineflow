// ============================================================================
// Drag validation context
//
// Precomputes, ONCE per connect-drag gesture, everything the per-handle
// validation chain needs so that `applyValidationClasses` can validate every
// target handle in O(1) each — instead of running container-wide
// `querySelector` sweeps (`isValidConnection` + `checkHandleLimits` +
// `runHandleValidators`) per target on every pointer move.
//
// The context is derived purely from `canvas.edges` + the fixed drag source, so
// it stays valid for the whole gesture (edges don't change mid-drag).
// ============================================================================

import type { Connection, FlowEdge } from '../core/types';

/**
 * Precomputed lookups for the drag-time validation chain, keyed so the
 * per-handle apply loop can answer each check with a single map/set read.
 */
export interface DragValidationContext {
  /**
   * `${target}|${targetHandle}` for every edge already emanating from the exact
   * drag source handle. Built with STRICT raw handle values (no `?? 'target'`
   * defaulting) to mirror `isValidConnection`'s strict `===` duplicate check.
   */
  existingTargets: Set<string>;
  /** Node ids that would close a directed cycle (empty when preventCycles off). */
  cycleForbidden: Set<string>;
  /** `${source}|${sourceHandle ?? 'source'}` → edge count (matches checkHandleLimits). */
  sourceCounts: Map<string, number>;
  /** `${target}|${targetHandle ?? 'target'}` → edge count (matches checkHandleLimits). */
  targetCounts: Map<string, number>;
}

/**
 * Build the {@link DragValidationContext} for a drag originating at
 * `sourceNodeId` / `sourceHandleId`. `excludeEdgeId` drops a single edge from
 * consideration (used by reconnect, which must not treat the edge being
 * reconnected as a pre-existing duplicate or limit contributor).
 */
export function buildDragValidationContext(
  canvas: { edges: FlowEdge[]; _config?: { preventCycles?: boolean } },
  sourceNodeId: string,
  sourceHandleId: string,
  excludeEdgeId?: string,
): DragValidationContext {
  const edges = excludeEdgeId
    ? (canvas.edges as FlowEdge[]).filter((e) => e.id !== excludeEdgeId)
    : (canvas.edges as FlowEdge[]);

  const existingTargets = new Set<string>();
  const sourceCounts = new Map<string, number>();
  const targetCounts = new Map<string, number>();

  for (const e of edges) {
    const sKey = `${e.source}|${e.sourceHandle ?? 'source'}`;
    const tKey = `${e.target}|${e.targetHandle ?? 'target'}`;
    sourceCounts.set(sKey, (sourceCounts.get(sKey) ?? 0) + 1);
    targetCounts.set(tKey, (targetCounts.get(tKey) ?? 0) + 1);

    // Duplicate detection must mirror isValidConnection's STRICT `===` on raw
    // stored handles — NO `?? 'source'`/`?? 'target'` defaulting. An edge with
    // `sourceHandle: undefined` is NOT a duplicate of a drag from the literal
    // 'source' handle, and `${e.target}|undefined` can never match a concrete
    // target-handle id in the apply loop. (Counts above intentionally DO
    // normalize, because checkHandleLimits normalizes.)
    if (e.source === sourceNodeId && e.sourceHandle === sourceHandleId) {
      existingTargets.add(`${e.target}|${e.targetHandle}`);
    }
  }

  const cycleForbidden = new Set<string>();
  if (canvas._config?.preventCycles) {
    // Walk INCOMING edges from the source: the set of nodes that can reach the
    // source is exactly the set whose target would close a cycle
    // (wouldCreateCycle(source, t) === "t can reach source").
    const incoming = new Map<string, string[]>();
    for (const e of edges) {
      let list = incoming.get(e.target);
      if (!list) {
        list = [];
        incoming.set(e.target, list);
      }
      list.push(e.source);
    }

    const stack = [sourceNodeId];
    while (stack.length > 0) {
      const id = stack.pop()!;
      if (cycleForbidden.has(id)) {
        continue;
      }
      cycleForbidden.add(id);
      for (const parent of incoming.get(id) ?? []) {
        stack.push(parent);
      }
    }
  }

  return { existingTargets, cycleForbidden, sourceCounts, targetCounts };
}

/** Re-exported for callers threading connections through the context. */
export type { Connection };
