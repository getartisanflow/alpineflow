// ============================================================================
// alpineflow/schema — Field CRUD helpers
//
// Each helper mutates the live `canvas.nodes` / `canvas.edges` arrays through
// their Alpine reactive proxies — render updates propagate automatically.
// Helpers return a status object ({applied, reason, ...}) and dispatch
// schema:* DOM events on `canvas.el` so consumers can listen without having
// to wrap the calls.
//
// Validation failures (invalid name, duplicate, non-existent node/field, etc.)
// fail silently by returning {applied: false, reason: ...} — no throws.
// ============================================================================

import type { FlowSchemaField } from '../core/types';
import { cascadeEdgesOnRename, cascadeEdgesOnRemove } from './cascade';

/** `snake_case` identifier: starts lowercase, letters/digits/underscores only. */
const FIELD_NAME_RE = /^[a-z][a-z0-9_]*$/;
const MAX_FIELD_NAME_LENGTH = 40;

function isValidFieldName(name: string): boolean {
    return typeof name === 'string' && name.length <= MAX_FIELD_NAME_LENGTH && FIELD_NAME_RE.test(name);
}

function dispatchSchema(canvas: any, type: string, detail: Record<string, any>): void {
    const el: EventTarget | undefined = canvas?.el ?? canvas?._container;
    if (!el || typeof (el as any).dispatchEvent !== 'function') {
        return;
    }
    // Listener atomicity: a throwing listener must not abort this function
    // mid-mutation. State has already been updated; we intentionally do NOT
    // roll back, because a partial rollback would leave a different half-state.
    //
    // Per DOM spec, most environments catch listener exceptions inside
    // dispatchEvent and surface them via `window.onerror` (or ErrorEvent). We
    // install a one-shot capturing error listener so we see the throw, log it,
    // and prevent it from bubbling to a noisy default handler. We also wrap
    // dispatchEvent itself in try/catch for engines that propagate directly.
    const captured: unknown[] = [];
    const win: any = typeof window !== 'undefined' ? window : undefined;
    const onError = (event: ErrorEvent) => {
        captured.push(event.error ?? event.message);
        event.preventDefault();
    };
    if (win && typeof win.addEventListener === 'function') {
        win.addEventListener('error', onError, true);
    }
    try {
        el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }));
    } catch (err) {
        captured.push(err);
    } finally {
        if (win && typeof win.removeEventListener === 'function') {
            win.removeEventListener('error', onError, true);
        }
    }
    for (const err of captured) {
        console.error('[alpineflow/schema] listener threw while handling', type, err);
    }
}

function findNode(canvas: any, nodeId: string): any | null {
    return canvas?.nodes?.find((n: any) => n.id === nodeId) ?? null;
}

export interface AddFieldResult {
    applied: boolean;
    reason?: string;
}

export interface RenameFieldOpResult {
    applied: boolean;
    reason?: string;
    cascadedEdgeIds: string[];
}

export interface RemoveFieldOpResult {
    applied: boolean;
    reason?: string;
    droppedEdgeIds: string[];
}

export interface ReorderFieldsOpResult {
    applied: boolean;
    reason?: string;
}

/**
 * Append a new field to node.data.fields. Rejects invalid names, duplicates,
 * and missing nodes silently. Dispatches `schema:field-added` on success.
 */
export function addField(canvas: any, nodeId: string, field: FlowSchemaField & { [k: string]: any }): AddFieldResult {
    const node = findNode(canvas, nodeId);
    if (!node) {
        return { applied: false, reason: 'no-node' };
    }
    if (!isValidFieldName(field?.name)) {
        return { applied: false, reason: 'invalid-name' };
    }
    if (!node.data) {
        node.data = { label: nodeId, fields: [] };
    }
    const fields = node.data.fields ?? [];
    if (fields.some((f: any) => f.name === field.name)) {
        return { applied: false, reason: 'duplicate' };
    }

    // Push into the live reactive array so Alpine re-renders the node.
    if (!Array.isArray(node.data.fields)) {
        node.data.fields = [];
    }
    node.data.fields.push({ ...field });

    dispatchSchema(canvas, 'schema:field-added', { nodeId, field: { ...field } });
    return { applied: true };
}

/**
 * Rename a field. Cascades rewriting to every edge whose (source, sourceHandle)
 * or (target, targetHandle) touches (nodeId, oldName). Dispatches
 * `schema:field-renamed` and (if any edges changed) `schema:edges-cascaded`.
 */
export function renameField(canvas: any, nodeId: string, oldName: string, newName: string): RenameFieldOpResult {
    if (oldName === newName) {
        return { applied: false, reason: 'unchanged', cascadedEdgeIds: [] };
    }
    if (!isValidFieldName(newName)) {
        return { applied: false, reason: 'invalid-name', cascadedEdgeIds: [] };
    }

    const node = findNode(canvas, nodeId);
    if (!node) {
        return { applied: false, reason: 'no-node', cascadedEdgeIds: [] };
    }
    const fields: any[] = node.data?.fields ?? [];
    const target = fields.find((f: any) => f.name === oldName);
    if (!target) {
        return { applied: false, reason: 'no-field', cascadedEdgeIds: [] };
    }
    if (fields.some((f: any) => f.name === newName)) {
        return { applied: false, reason: 'duplicate', cascadedEdgeIds: [] };
    }

    // Rename in place — mutating the reactive object keeps any bindings alive.
    target.name = newName;

    // Cascade: mutate the affected edge objects IN PLACE so their live Alpine
    // scopes stay attached. cascadeEdgesOnRename returns NEW objects for
    // cascaded edges; splicing those into the array would orphan every cascaded
    // edge's scope and touch every reactive index. Copy just the changed handles
    // onto the existing objects instead.
    const currentEdges = canvas.edges ?? [];
    const { edges: updatedEdges, cascadedIds } = cascadeEdgesOnRename(currentEdges, nodeId, oldName, newName);
    if (cascadedIds.length > 0) {
        const updatedById = new Map(updatedEdges.map((e: any) => [e.id, e]));
        for (const edge of canvas.edges) {
            const upd = updatedById.get(edge.id);
            if (!upd || upd === edge) continue;
            if (edge.sourceHandle !== upd.sourceHandle) edge.sourceHandle = upd.sourceHandle;
            if (edge.targetHandle !== upd.targetHandle) edge.targetHandle = upd.targetHandle;
        }
    }

    dispatchSchema(canvas, 'schema:field-renamed', {
        nodeId,
        oldName,
        newName,
        cascadedEdgeIds: cascadedIds,
    });
    if (cascadedIds.length > 0) {
        dispatchSchema(canvas, 'schema:edges-cascaded', {
            nodeId,
            fieldName: newName,
            edgeIds: cascadedIds,
            operation: 'rename',
        });
    }

    return { applied: true, cascadedEdgeIds: cascadedIds };
}

/**
 * Remove a field from a node. Cascade-drops every edge whose handle references
 * it. Dispatches `schema:field-removed` and (if any edges dropped)
 * `schema:edges-cascaded`.
 */
export function removeField(canvas: any, nodeId: string, fieldName: string): RemoveFieldOpResult {
    const node = findNode(canvas, nodeId);
    if (!node) {
        return { applied: false, reason: 'no-node', droppedEdgeIds: [] };
    }
    const fields: any[] = node.data?.fields ?? [];
    const idx = fields.findIndex((f: any) => f.name === fieldName);
    if (idx === -1) {
        return { applied: false, reason: 'no-field', droppedEdgeIds: [] };
    }

    // Splice the reactive fields array in place.
    node.data.fields.splice(idx, 1);

    // Drop only the affected edges in place (rather than replacing the whole
    // array), and rebuild the edge map so getEdge no longer returns the dropped
    // edges — the previous full-array splice left _edgeMap stale.
    const currentEdges = canvas.edges ?? [];
    const { droppedIds } = cascadeEdgesOnRemove(currentEdges, nodeId, fieldName);
    if (droppedIds.length > 0) {
        const dropSet = new Set(droppedIds);
        for (let i = canvas.edges.length - 1; i >= 0; i--) {
            if (dropSet.has(canvas.edges[i].id)) canvas.edges.splice(i, 1);
        }
        canvas._rebuildEdgeMap?.();
    }

    dispatchSchema(canvas, 'schema:field-removed', {
        nodeId,
        fieldName,
        droppedEdgeIds: droppedIds,
    });
    if (droppedIds.length > 0) {
        dispatchSchema(canvas, 'schema:edges-cascaded', {
            nodeId,
            fieldName,
            edgeIds: droppedIds,
            operation: 'remove',
        });
    }

    return { applied: true, droppedEdgeIds: droppedIds };
}

/**
 * Reorder fields on a node to match the supplied name array. The array must
 * be a permutation of the existing field names — otherwise `mismatch`.
 */
export function reorderFields(canvas: any, nodeId: string, order: string[]): ReorderFieldsOpResult {
    if (!Array.isArray(order)) {
        return { applied: false, reason: 'mismatch' };
    }
    // Reject duplicate names in the supplied order explicitly — don't rely on
    // set-size comparison below, which fails open if node.data.fields somehow
    // already contains duplicates.
    if (new Set(order).size !== order.length) {
        return { applied: false, reason: 'mismatch' };
    }

    const node = findNode(canvas, nodeId);
    if (!node) {
        return { applied: false, reason: 'no-node' };
    }
    const fields: any[] = node.data?.fields ?? [];

    if (order.length !== fields.length) {
        return { applied: false, reason: 'mismatch' };
    }
    const existingNames = new Set(fields.map((f: any) => f.name));
    const orderNames = new Set(order);
    if (existingNames.size !== orderNames.size) {
        return { applied: false, reason: 'mismatch' };
    }
    for (const name of order) {
        if (!existingNames.has(name)) {
            return { applied: false, reason: 'mismatch' };
        }
    }

    const byName: Record<string, any> = Object.create(null);
    for (const f of fields) {
        byName[f.name] = f;
    }
    const reordered = order.map((name) => byName[name]);
    node.data.fields.splice(0, node.data.fields.length, ...reordered);

    return { applied: true };
}
