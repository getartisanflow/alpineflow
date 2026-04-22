// ============================================================================
// alpineflow/schema — diffSchemas
//
// Pure helper: computes a structured delta between two `SchemaGraphJSON`
// snapshots. No canvas coupling, no mutation, never throws on malformed input.
//
// Useful for migration generation, PR-review diffs, and undo/redo inspection.
//
// All output arrays are deterministically ordered for stability.
// ============================================================================

import type { FlowSchemaField } from '../core/types';
import type { DiffOptions, SchemaDiff, SchemaGraphJSON } from './types';

interface NodeShape {
    id: string;
    label: string;
    fields: FlowSchemaField[];
    position: { x: number; y: number };
}

interface EdgeShape {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    label?: string;
}

function safeNodes(snap: Partial<SchemaGraphJSON> | null | undefined): NodeShape[] {
    if (!snap || !Array.isArray(snap.nodes)) return [];
    return snap.nodes.filter((n): n is NodeShape => !!n && typeof n.id === 'string');
}

function safeEdges(snap: Partial<SchemaGraphJSON> | null | undefined): EdgeShape[] {
    if (!snap || !Array.isArray(snap.edges)) return [];
    return snap.edges.filter((e): e is EdgeShape => !!e && typeof e.id === 'string');
}

function fieldsByName(node: NodeShape): Map<string, FlowSchemaField> {
    const map = new Map<string, FlowSchemaField>();
    const fields = Array.isArray(node.fields) ? node.fields : [];
    for (const f of fields) {
        if (f && typeof f.name === 'string') {
            map.set(f.name, f);
        }
    }
    return map;
}

/**
 * Compute a structured delta between two schema snapshots. Pure, deterministic,
 * tolerant of malformed input (missing `version`, null snapshots, nodes without
 * fields, etc.).
 */
export function diffSchemas(
    before: SchemaGraphJSON,
    after: SchemaGraphJSON,
    opts: DiffOptions = {},
): SchemaDiff {
    const beforeNodes = safeNodes(before);
    const afterNodes = safeNodes(after);
    const beforeEdges = safeEdges(before);
    const afterEdges = safeEdges(after);

    const beforeNodeMap = new Map<string, NodeShape>();
    for (const n of beforeNodes) {
        beforeNodeMap.set(n.id, n);
    }
    const afterNodeMap = new Map<string, NodeShape>();
    for (const n of afterNodes) {
        afterNodeMap.set(n.id, n);
    }

    // --- Node add/remove detection ------------------------------------------
    const rawAddedNodes: string[] = [];
    const rawRemovedNodes: string[] = [];
    for (const id of afterNodeMap.keys()) {
        if (!beforeNodeMap.has(id)) rawAddedNodes.push(id);
    }
    for (const id of beforeNodeMap.keys()) {
        if (!afterNodeMap.has(id)) rawRemovedNodes.push(id);
    }

    // --- Node rename heuristic ----------------------------------------------
    // For each removed node, find exactly-one added node with the same set of
    // field names (ignoring types). If exactly one match, record as rename and
    // remove from added/removed. Ambiguous (multi-match) pairs are skipped.
    const renamedNodes: Array<{ from: string; to: string }> = [];
    const consumedAddedNodes = new Set<string>();
    const consumedRemovedNodes = new Set<string>();

    if (opts.detectRenames) {
        // Precompute field-name-set signatures.
        const sigFor = (node: NodeShape): string => {
            const names = (Array.isArray(node.fields) ? node.fields : [])
                .filter((f) => f && typeof f.name === 'string')
                .map((f) => f.name)
                .sort();
            return names.join('\u0000');
        };

        for (const removedId of rawRemovedNodes) {
            const removedNode = beforeNodeMap.get(removedId);
            if (!removedNode) continue;
            const sig = sigFor(removedNode);

            const candidates: string[] = [];
            for (const addedId of rawAddedNodes) {
                if (consumedAddedNodes.has(addedId)) continue;
                const addedNode = afterNodeMap.get(addedId);
                if (!addedNode) continue;
                if (sigFor(addedNode) === sig) {
                    candidates.push(addedId);
                }
            }

            if (candidates.length === 1) {
                const toId = candidates[0];
                renamedNodes.push({ from: removedId, to: toId });
                consumedAddedNodes.add(toId);
                consumedRemovedNodes.add(removedId);
            }
            // 0 or 2+ candidates → not recorded as rename
        }
    }

    const addedNodes = rawAddedNodes.filter((id) => !consumedAddedNodes.has(id));
    const removedNodes = rawRemovedNodes.filter((id) => !consumedRemovedNodes.has(id));

    // --- Field diff ----------------------------------------------------------
    // Build the set of (beforeId, afterId) pairs for nodes present in both —
    // either by matching id, or via a detected rename.
    const pairs: Array<{ beforeId: string; afterId: string }> = [];
    for (const id of beforeNodeMap.keys()) {
        if (afterNodeMap.has(id)) {
            pairs.push({ beforeId: id, afterId: id });
        }
    }
    for (const r of renamedNodes) {
        pairs.push({ beforeId: r.from, afterId: r.to });
    }

    // Collect field rename hints, keyed by the AFTER nodeId. This lets a
    // consumer supply hints after renaming a node: e.g., if a node was renamed
    // from 'user_old' → 'user_new' and a field was renamed from 'email' →
    // 'email_addr', the hint should target `nodeId: 'user_new'`.
    const fieldRenamesByAfterNodeId = new Map<
        string,
        Array<{ from: string; to: string }>
    >();
    for (const hint of opts.fieldRenames ?? []) {
        if (!hint || typeof hint.nodeId !== 'string') continue;
        if (typeof hint.from !== 'string' || typeof hint.to !== 'string') continue;
        let list = fieldRenamesByAfterNodeId.get(hint.nodeId);
        if (!list) {
            list = [];
            fieldRenamesByAfterNodeId.set(hint.nodeId, list);
        }
        list.push({ from: hint.from, to: hint.to });
    }
    // Also accept hints keyed by the BEFORE nodeId when the node itself was
    // renamed — map them across so renamedFields detection still fires.
    const renameFromToTo = new Map<string, string>();
    for (const r of renamedNodes) {
        renameFromToTo.set(r.from, r.to);
    }
    for (const hint of opts.fieldRenames ?? []) {
        if (!hint || typeof hint.nodeId !== 'string') continue;
        const mapped = renameFromToTo.get(hint.nodeId);
        if (mapped && !fieldRenamesByAfterNodeId.has(mapped)) {
            // Already added above under its original id; also expose under the
            // renamed key so downstream lookups find it whichever key is used.
            const list = fieldRenamesByAfterNodeId.get(hint.nodeId) ?? [];
            fieldRenamesByAfterNodeId.set(mapped, list);
        }
    }

    const renamedFields: Array<{ nodeId: string; from: string; to: string }> = [];
    const addedFields: Array<{ nodeId: string; fieldName: string }> = [];
    const removedFields: Array<{ nodeId: string; fieldName: string }> = [];
    const changedFieldTypes: Array<{
        nodeId: string;
        fieldName: string;
        from: string;
        to: string;
    }> = [];

    for (const { beforeId, afterId } of pairs) {
        const beforeNode = beforeNodeMap.get(beforeId);
        const afterNode = afterNodeMap.get(afterId);
        if (!beforeNode || !afterNode) continue;

        const beforeFields = fieldsByName(beforeNode);
        const afterFields = fieldsByName(afterNode);

        // Apply field-rename hints. The hint's nodeId is matched against the
        // AFTER node's id (most common case) — if the node was renamed, the
        // hint may target either id thanks to the dual keying above.
        const hints =
            fieldRenamesByAfterNodeId.get(afterId) ??
            fieldRenamesByAfterNodeId.get(beforeId) ??
            [];
        const consumedBefore = new Set<string>();
        const consumedAfter = new Set<string>();

        for (const hint of hints) {
            const oldField = beforeFields.get(hint.from);
            const newField = afterFields.get(hint.to);
            if (!oldField || !newField) continue;
            if (consumedBefore.has(hint.from) || consumedAfter.has(hint.to)) continue;
            renamedFields.push({ nodeId: afterId, from: hint.from, to: hint.to });
            consumedBefore.add(hint.from);
            consumedAfter.add(hint.to);

            // Type change across the rename
            const oldType = typeof oldField.type === 'string' ? oldField.type : '';
            const newType = typeof newField.type === 'string' ? newField.type : '';
            if (oldType !== newType) {
                changedFieldTypes.push({
                    nodeId: afterId,
                    fieldName: hint.to,
                    from: oldType,
                    to: newType,
                });
            }
        }

        // Field added / removed (after applying hints)
        for (const [name] of afterFields) {
            if (consumedAfter.has(name)) continue;
            if (!beforeFields.has(name)) {
                addedFields.push({ nodeId: afterId, fieldName: name });
            }
        }
        for (const [name] of beforeFields) {
            if (consumedBefore.has(name)) continue;
            if (!afterFields.has(name)) {
                removedFields.push({ nodeId: afterId, fieldName: name });
            }
        }

        // Changed field types for fields present in both (by name, no rename)
        for (const [name, beforeField] of beforeFields) {
            if (consumedBefore.has(name)) continue;
            const afterField = afterFields.get(name);
            if (!afterField) continue;
            const oldType = typeof beforeField.type === 'string' ? beforeField.type : '';
            const newType = typeof afterField.type === 'string' ? afterField.type : '';
            if (oldType !== newType) {
                changedFieldTypes.push({
                    nodeId: afterId,
                    fieldName: name,
                    from: oldType,
                    to: newType,
                });
            }
        }
    }

    // --- Edge diff (by id) ---------------------------------------------------
    const beforeEdgeIds = new Set<string>();
    for (const e of beforeEdges) beforeEdgeIds.add(e.id);
    const afterEdgeIds = new Set<string>();
    for (const e of afterEdges) afterEdgeIds.add(e.id);

    const addedEdges: string[] = [];
    const removedEdges: string[] = [];
    for (const id of afterEdgeIds) {
        if (!beforeEdgeIds.has(id)) addedEdges.push(id);
    }
    for (const id of beforeEdgeIds) {
        if (!afterEdgeIds.has(id)) removedEdges.push(id);
    }

    // --- Deterministic ordering ---------------------------------------------
    addedNodes.sort();
    removedNodes.sort();
    renamedNodes.sort((a, b) => a.from.localeCompare(b.from));
    const fieldKey = (f: { nodeId: string; fieldName: string }) =>
        `${f.nodeId}\u0000${f.fieldName}`;
    addedFields.sort((a, b) => fieldKey(a).localeCompare(fieldKey(b)));
    removedFields.sort((a, b) => fieldKey(a).localeCompare(fieldKey(b)));
    renamedFields.sort((a, b) => {
        const k = a.nodeId.localeCompare(b.nodeId);
        return k !== 0 ? k : a.from.localeCompare(b.from);
    });
    changedFieldTypes.sort((a, b) => fieldKey(a).localeCompare(fieldKey(b)));
    addedEdges.sort();
    removedEdges.sort();

    return {
        addedNodes,
        removedNodes,
        renamedNodes,
        addedFields,
        removedFields,
        renamedFields,
        changedFieldTypes,
        addedEdges,
        removedEdges,
    };
}
