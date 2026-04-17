// ============================================================================
// alpinejs-flow/workflow — Edge State Helpers
//
// Utilities for adding/removing CSS class tokens on edge objects.
// Alpine reactively tracks mutations to edge.class, so these mutations
// automatically reflect on rendered edges and their forwarded labels.
// ============================================================================

/**
 * Add a CSS class to an edge's class string (space-separated).
 * If the class is already present, no-op.
 */
function addEdgeClass(canvas: any, edgeId: string, cls: string): void {
    const edge = canvas.getEdge?.(edgeId) ?? canvas.edges?.find((e: any) => e.id === edgeId);
    if (!edge) { return; }
    const current = edge.class ?? '';
    if (!current.split(' ').includes(cls)) {
        edge.class = current ? `${current} ${cls}` : cls;
    }
}

/**
 * Remove a CSS class from an edge's class string.
 */
function removeEdgeClass(canvas: any, edgeId: string, cls: string): void {
    const edge = canvas.getEdge?.(edgeId) ?? canvas.edges?.find((e: any) => e.id === edgeId);
    if (!edge) { return; }
    const updated = (edge.class ?? '').split(' ').filter((c: string) => c !== cls).join(' ');
    edge.class = updated || undefined;
}

export function setEdgeEntering(canvas: any, edgeId: string): void {
    addEdgeClass(canvas, edgeId, 'flow-edge-entering');
}

export function setEdgeCompleted(canvas: any, edgeId: string): void {
    removeEdgeClass(canvas, edgeId, 'flow-edge-entering');
    addEdgeClass(canvas, edgeId, 'flow-edge-completed');
}

export function setEdgeTaken(canvas: any, edgeId: string): void {
    addEdgeClass(canvas, edgeId, 'flow-edge-taken');
}

export function setEdgeUntaken(canvas: any, edgeId: string): void {
    addEdgeClass(canvas, edgeId, 'flow-edge-untaken');
}
