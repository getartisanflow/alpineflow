// ============================================================================
// alpineflow/schema — validateSchema
//
// Pure helper: inspects a canvas's nodes + edges and returns a structured list
// of issues. No canvas mutation, no events, no throws. Safe on malformed input.
//
// Severities:
//   error   — 'dangling-edge', 'duplicate-node-id', 'duplicate-field'
//   warning — 'missing-primary-key', 'disconnected-node', 'cycle'
//
// `valid` is true iff no error-severity issues are present.
// ============================================================================

import type { SchemaValidationIssue, SchemaValidationResult } from './types';

interface NodeLike {
    id: string;
    data?: {
        fields?: Array<{ name: string; key?: string }>;
    };
}

interface EdgeLike {
    id?: string;
    source: string;
    target: string;
}

/**
 * Iterative DFS cycle detection. Returns true as soon as any directed cycle is
 * found. Deterministic and terminating — handles self-loops, parallel edges,
 * and multi-component graphs without infinite loops.
 */
function hasCycle(nodes: NodeLike[], edges: EdgeLike[]): boolean {
    // Self-loop shortcut
    for (const e of edges) {
        if (e && typeof e.source === 'string' && e.source === e.target) {
            return true;
        }
    }

    // Build adjacency list (outgoing only). Include nodes that only appear in
    // edges (tolerate dangling edges — they can still participate in a cycle
    // logically, but we just walk what we have).
    const adj = new Map<string, string[]>();
    const ensure = (id: string): string[] => {
        let list = adj.get(id);
        if (!list) {
            list = [];
            adj.set(id, list);
        }
        return list;
    };

    for (const n of nodes) {
        if (n && typeof n.id === 'string') {
            ensure(n.id);
        }
    }
    for (const e of edges) {
        if (!e || typeof e.source !== 'string' || typeof e.target !== 'string') continue;
        ensure(e.source).push(e.target);
        ensure(e.target); // ensure target is a known key
    }

    // Tri-color DFS: WHITE (unseen), GRAY (in current stack), BLACK (done).
    const WHITE = 0;
    const GRAY = 1;
    const BLACK = 2;
    const color = new Map<string, number>();
    for (const id of adj.keys()) {
        color.set(id, WHITE);
    }

    // Iterative DFS using a frame stack. Each frame tracks its iterator index
    // so we can emulate recursive post-order coloring without blowing the stack.
    for (const start of adj.keys()) {
        if (color.get(start) !== WHITE) continue;

        const stack: Array<{ node: string; idx: number }> = [{ node: start, idx: 0 }];
        color.set(start, GRAY);

        while (stack.length > 0) {
            const frame = stack[stack.length - 1];
            const neighbors = adj.get(frame.node) ?? [];
            if (frame.idx < neighbors.length) {
                const next = neighbors[frame.idx++];
                const c = color.get(next);
                if (c === GRAY) {
                    return true; // back-edge → cycle
                }
                if (c === WHITE) {
                    color.set(next, GRAY);
                    stack.push({ node: next, idx: 0 });
                }
                // BLACK → already fully explored, skip
            } else {
                color.set(frame.node, BLACK);
                stack.pop();
            }
        }
    }

    return false;
}

/**
 * Inspect a canvas (nodes + edges) and produce a structured list of schema
 * issues. Pure — no mutation, no events, never throws.
 */
export function validateSchema(canvas: { nodes?: any[]; edges?: any[] }): SchemaValidationResult {
    const issues: SchemaValidationIssue[] = [];
    const nodes: NodeLike[] = Array.isArray(canvas?.nodes) ? canvas!.nodes! : [];
    const edges: EdgeLike[] = Array.isArray(canvas?.edges) ? canvas!.edges! : [];

    // --- duplicate-node-id ----------------------------------------------------
    const nodeIds = new Set<string>();
    const dupNodeIds = new Set<string>();
    for (const n of nodes) {
        if (!n || typeof n.id !== 'string') continue;
        if (nodeIds.has(n.id)) {
            dupNodeIds.add(n.id);
        }
        nodeIds.add(n.id);
    }
    for (const id of dupNodeIds) {
        issues.push({
            severity: 'error',
            code: 'duplicate-node-id',
            nodeId: id,
            message: `Duplicate node id "${id}".`,
        });
    }

    // --- per-node: duplicate-field + missing-primary-key ---------------------
    for (const n of nodes) {
        if (!n || typeof n.id !== 'string') continue;
        const fields = Array.isArray(n.data?.fields) ? n.data!.fields! : [];
        if (fields.length === 0) continue;

        const seen = new Set<string>();
        const dup = new Set<string>();
        for (const f of fields) {
            if (!f || typeof f.name !== 'string') continue;
            if (seen.has(f.name)) {
                dup.add(f.name);
            }
            seen.add(f.name);
        }
        for (const name of dup) {
            issues.push({
                severity: 'error',
                code: 'duplicate-field',
                nodeId: n.id,
                fieldName: name,
                message: `Duplicate field "${name}" on node "${n.id}".`,
            });
        }

        const hasPrimary = fields.some((f) => f && f.key === 'primary');
        if (!hasPrimary) {
            issues.push({
                severity: 'warning',
                code: 'missing-primary-key',
                nodeId: n.id,
                message: `Node "${n.id}" has no primary-key field.`,
            });
        }
    }

    // --- dangling-edge -------------------------------------------------------
    for (const e of edges) {
        if (!e) continue;
        const edgeId = typeof e.id === 'string' ? e.id : undefined;
        if (typeof e.source !== 'string' || !nodeIds.has(e.source)) {
            issues.push({
                severity: 'error',
                code: 'dangling-edge',
                edgeId,
                nodeId: typeof e.source === 'string' ? e.source : undefined,
                message: `Edge ${edgeId ? `"${edgeId}" ` : ''}references missing source node "${e.source}".`,
            });
        }
        if (typeof e.target !== 'string' || !nodeIds.has(e.target)) {
            issues.push({
                severity: 'error',
                code: 'dangling-edge',
                edgeId,
                nodeId: typeof e.target === 'string' ? e.target : undefined,
                message: `Edge ${edgeId ? `"${edgeId}" ` : ''}references missing target node "${e.target}".`,
            });
        }
    }

    // --- disconnected-node ---------------------------------------------------
    const touched = new Set<string>();
    for (const e of edges) {
        if (!e) continue;
        if (typeof e.source === 'string') touched.add(e.source);
        if (typeof e.target === 'string') touched.add(e.target);
    }
    for (const n of nodes) {
        if (!n || typeof n.id !== 'string') continue;
        if (!touched.has(n.id)) {
            issues.push({
                severity: 'warning',
                code: 'disconnected-node',
                nodeId: n.id,
                message: `Node "${n.id}" has no connected edges.`,
            });
        }
    }

    // --- cycle (emit once) ---------------------------------------------------
    if (hasCycle(nodes, edges)) {
        issues.push({
            severity: 'warning',
            code: 'cycle',
            message: 'Directed cycle detected in edge graph.',
        });
    }

    const valid = !issues.some((i) => i.severity === 'error');
    return { valid, issues };
}
