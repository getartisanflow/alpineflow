// ============================================================================
// alpineflow/schema — Edge cascade walker (internal helper)
//
// Pure functions that return NEW arrays. They do not mutate canvas state —
// `field-ops.ts` is the only module that touches the live reactive arrays.
// ============================================================================

export interface CascadeRenameResult<E> {
    edges: E[];
    cascadedIds: string[];
}

export interface CascadeRemoveResult<E> {
    edges: E[];
    droppedIds: string[];
}

type EdgeLike = {
    id: string;
    source: string;
    sourceHandle?: string | null;
    target: string;
    targetHandle?: string | null;
};

/**
 * Returns a new edge array where any edge touching (nodeId, oldName) has its
 * matching handle rewritten to newName. cascadedIds lists the edges that changed.
 */
export function cascadeEdgesOnRename<E extends EdgeLike>(
    edges: E[],
    nodeId: string,
    oldName: string,
    newName: string,
): CascadeRenameResult<E> {
    const cascadedIds: string[] = [];
    const updated = edges.map((e) => {
        let next: E = e;
        if (e.source === nodeId && e.sourceHandle === oldName) {
            next = { ...next, sourceHandle: newName };
        }
        if (e.target === nodeId && e.targetHandle === oldName) {
            next = { ...next, targetHandle: newName };
        }
        if (next !== e) {
            cascadedIds.push(e.id);
        }
        return next;
    });
    return { edges: updated, cascadedIds };
}

/**
 * Returns a new edge array with every edge touching (nodeId, fieldName) removed.
 * droppedIds lists the edges that were filtered out.
 */
export function cascadeEdgesOnRemove<E extends EdgeLike>(
    edges: E[],
    nodeId: string,
    fieldName: string,
): CascadeRemoveResult<E> {
    const droppedIds: string[] = [];
    const kept = edges.filter((e) => {
        const touches =
            (e.source === nodeId && e.sourceHandle === fieldName) ||
            (e.target === nodeId && e.targetHandle === fieldName);
        if (touches) {
            droppedIds.push(e.id);
        }
        return !touches;
    });
    return { edges: kept, droppedIds };
}
