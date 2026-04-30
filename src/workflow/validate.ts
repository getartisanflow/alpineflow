// ============================================================================
// alpineflow/workflow — validateWorkflow
//
// Pure helper: inspects a canvas's nodes + edges and returns a structured list
// of workflow issues. No mutation, no events, never throws. Safe on malformed
// input. Mirrors the shape of validateSchema in src/schema/validate.ts.
//
// Severities:
//   error   — 'dangling-edge', 'duplicate-node-id', 'missing-condition',
//             'condition-missing-branch', 'unhandled-source-handle',
//             'wait-missing-duration'
//   warning — 'unreachable-node', 'cycle'
//
// `valid` is true iff no error-severity issues are present.
// ============================================================================

export type WorkflowIssueCode =
    | 'dangling-edge'
    | 'duplicate-node-id'
    | 'missing-condition'
    | 'condition-missing-branch'
    | 'unhandled-source-handle'
    | 'wait-missing-duration'
    | 'unreachable-node'
    | 'cycle';

export interface WorkflowValidationIssue {
    severity: 'error' | 'warning';
    code: WorkflowIssueCode;
    nodeId?: string;
    edgeId?: string;
    message: string;
}

export interface WorkflowValidationResult {
    valid: boolean;
    issues: WorkflowValidationIssue[];
}

interface NodeLike {
    id: string;
    type?: string;
    data?: Record<string, any>;
}

interface EdgeLike {
    id?: string;
    source: string;
    target: string;
    sourceHandle?: string;
}

/**
 * Iterative tri-color DFS — terminates on the first directed back-edge it sees.
 * Mirrors the schema-side cycle detector so behaviour is consistent.
 */
function hasCycle(nodes: NodeLike[], edges: EdgeLike[]): boolean {
    for (const e of edges) {
        if (e && typeof e.source === 'string' && e.source === e.target) {
            return true;
        }
    }

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
        if (n && typeof n.id === 'string') ensure(n.id);
    }
    for (const e of edges) {
        if (!e || typeof e.source !== 'string' || typeof e.target !== 'string') continue;
        ensure(e.source).push(e.target);
        ensure(e.target);
    }

    const WHITE = 0;
    const GRAY = 1;
    const BLACK = 2;
    const color = new Map<string, number>();
    for (const id of adj.keys()) color.set(id, WHITE);

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
                if (c === GRAY) return true;
                if (c === WHITE) {
                    color.set(next, GRAY);
                    stack.push({ node: next, idx: 0 });
                }
            } else {
                color.set(frame.node, BLACK);
                stack.pop();
            }
        }
    }

    return false;
}

/**
 * Inspect a workflow canvas (nodes + edges) and return a structured issue list.
 * Pure — no mutation, no events, never throws.
 */
export function validateWorkflow(canvas: { nodes?: any[]; edges?: any[] }): WorkflowValidationResult {
    const issues: WorkflowValidationIssue[] = [];
    const nodes: NodeLike[] = Array.isArray(canvas?.nodes) ? canvas!.nodes! : [];
    const edges: EdgeLike[] = Array.isArray(canvas?.edges) ? canvas!.edges! : [];

    // --- duplicate-node-id ---------------------------------------------------
    const nodeIds = new Set<string>();
    const dupNodeIds = new Set<string>();
    for (const n of nodes) {
        if (!n || typeof n.id !== 'string') continue;
        if (nodeIds.has(n.id)) dupNodeIds.add(n.id);
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

    // --- per-node condition + wait checks ------------------------------------
    for (const n of nodes) {
        if (!n || typeof n.id !== 'string') continue;
        const data = (n.data ?? {}) as Record<string, any>;

        if (n.type === 'flow-condition') {
            const hasCondition = data.condition !== undefined && data.condition !== null;
            const hasEvaluate = typeof data.evaluate === 'function';
            if (!hasCondition && !hasEvaluate) {
                issues.push({
                    severity: 'error',
                    code: 'missing-condition',
                    nodeId: n.id,
                    message: `Condition node "${n.id}" has neither a "condition" object nor an "evaluate" function.`,
                });
            }
        }

        if (n.type === 'flow-wait') {
            const dur = data.durationMs;
            if (typeof dur !== 'number' || !Number.isFinite(dur)) {
                issues.push({
                    severity: 'error',
                    code: 'wait-missing-duration',
                    nodeId: n.id,
                    message: `Wait node "${n.id}" is missing numeric data.durationMs.`,
                });
            }
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

    // --- condition-missing-branch + unhandled-source-handle ------------------
    // Only inspected for known flow-condition nodes whose outgoing edges are
    // present in the canvas. Branches on sourceHandle of 'true' / 'false'.
    const conditionNodes = nodes.filter((n) => n && n.type === 'flow-condition' && typeof n.id === 'string');
    for (const cond of conditionNodes) {
        const outgoing = edges.filter((e) => e && e.source === cond.id);
        const handles = new Set<string>();
        for (const e of outgoing) {
            if (typeof e.sourceHandle === 'string') {
                handles.add(e.sourceHandle);
                if (e.sourceHandle !== 'true' && e.sourceHandle !== 'false') {
                    issues.push({
                        severity: 'error',
                        code: 'unhandled-source-handle',
                        edgeId: typeof e.id === 'string' ? e.id : undefined,
                        nodeId: cond.id,
                        message: `Condition node "${cond.id}" has an outgoing edge with sourceHandle "${e.sourceHandle}" — only "true" / "false" are recognised.`,
                    });
                }
            }
        }
        if (!handles.has('true')) {
            issues.push({
                severity: 'error',
                code: 'condition-missing-branch',
                nodeId: cond.id,
                message: `Condition node "${cond.id}" is missing the "true" branch.`,
            });
        }
        if (!handles.has('false')) {
            issues.push({
                severity: 'error',
                code: 'condition-missing-branch',
                nodeId: cond.id,
                message: `Condition node "${cond.id}" is missing the "false" branch.`,
            });
        }
    }

    // --- unreachable-node (warning) ------------------------------------------
    // A node is "unreachable" here when it has no incoming AND no outgoing
    // edges — fully isolated. Nodes with outgoing edges but no incoming are
    // potential entry points (the helper has no notion of an explicit entry),
    // so they are not flagged.
    const incoming = new Set<string>();
    const outgoing = new Set<string>();
    for (const e of edges) {
        if (!e) continue;
        if (typeof e.target === 'string') incoming.add(e.target);
        if (typeof e.source === 'string') outgoing.add(e.source);
    }
    for (const n of nodes) {
        if (!n || typeof n.id !== 'string') continue;
        if (!incoming.has(n.id) && !outgoing.has(n.id)) {
            issues.push({
                severity: 'warning',
                code: 'unreachable-node',
                nodeId: n.id,
                message: `Node "${n.id}" has no connected edges.`,
            });
        }
    }

    // --- cycle ---------------------------------------------------------------
    if (hasCycle(nodes, edges)) {
        issues.push({
            severity: 'warning',
            code: 'cycle',
            message: 'Directed cycle detected in workflow graph.',
        });
    }

    const valid = !issues.some((i) => i.severity === 'error');
    return { valid, issues };
}
