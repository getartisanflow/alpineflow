// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { validateWorkflow } from './validate';

function makeCanvas(nodes: any[], edges: any[]) {
    return { nodes, edges };
}

describe('validateWorkflow', () => {
    it('returns valid:true with no issues for a well-formed workflow', () => {
        const c = makeCanvas(
            [
                { id: 'trigger' },
                { id: 'cond', type: 'flow-condition', data: { condition: { field: 'x', op: 'equals', value: 1 } } },
                { id: 'yes' },
                { id: 'no' },
                { id: 'wait', type: 'flow-wait', data: { durationMs: 500 } },
            ],
            [
                { id: 'e1', source: 'trigger', target: 'cond' },
                { id: 'e2', source: 'cond', target: 'yes', sourceHandle: 'true' },
                { id: 'e3', source: 'cond', target: 'no', sourceHandle: 'false' },
                { id: 'e4', source: 'yes', target: 'wait' },
            ],
        );
        const r = validateWorkflow(c);
        expect(r.valid).toBe(true);
        expect(r.issues).toEqual([]);
    });

    it('flags dangling-edge when source or target is missing', () => {
        const c = makeCanvas(
            [{ id: 'a' }],
            [{ id: 'e1', source: 'a', target: 'ghost' }],
        );
        const r = validateWorkflow(c);
        const dangling = r.issues.filter((i) => i.code === 'dangling-edge');
        expect(dangling).toHaveLength(1);
        expect(dangling[0]).toMatchObject({
            severity: 'error',
            code: 'dangling-edge',
            edgeId: 'e1',
            nodeId: 'ghost',
        });
        expect(r.valid).toBe(false);
    });

    it('flags duplicate-node-id as error', () => {
        const c = makeCanvas(
            [{ id: 'a' }, { id: 'a' }],
            [],
        );
        const r = validateWorkflow(c);
        const dupes = r.issues.filter((i) => i.code === 'duplicate-node-id');
        expect(dupes).toHaveLength(1);
        expect(dupes[0]).toMatchObject({
            severity: 'error',
            code: 'duplicate-node-id',
            nodeId: 'a',
        });
        expect(r.valid).toBe(false);
    });

    it('flags missing-condition when flow-condition has neither condition nor evaluate', () => {
        const c = makeCanvas(
            [
                { id: 'cond', type: 'flow-condition', data: {} },
                { id: 'yes' }, { id: 'no' },
            ],
            [
                { id: 'e1', source: 'cond', target: 'yes', sourceHandle: 'true' },
                { id: 'e2', source: 'cond', target: 'no', sourceHandle: 'false' },
            ],
        );
        const r = validateWorkflow(c);
        const issues = r.issues.filter((i) => i.code === 'missing-condition');
        expect(issues).toHaveLength(1);
        expect(issues[0]).toMatchObject({
            severity: 'error',
            code: 'missing-condition',
            nodeId: 'cond',
        });
        expect(r.valid).toBe(false);
    });

    it('passes missing-condition check when evaluate function is provided', () => {
        const c = makeCanvas(
            [
                { id: 'cond', type: 'flow-condition', data: { evaluate: () => true } },
                { id: 'yes' }, { id: 'no' },
            ],
            [
                { id: 'e1', source: 'cond', target: 'yes', sourceHandle: 'true' },
                { id: 'e2', source: 'cond', target: 'no', sourceHandle: 'false' },
            ],
        );
        const r = validateWorkflow(c);
        expect(r.issues.find((i) => i.code === 'missing-condition')).toBeUndefined();
    });

    it('flags condition-missing-branch when a flow-condition lacks the true branch', () => {
        const c = makeCanvas(
            [
                { id: 'cond', type: 'flow-condition', data: { condition: { field: 'x', op: 'equals', value: 1 } } },
                { id: 'no' },
            ],
            [
                { id: 'e1', source: 'cond', target: 'no', sourceHandle: 'false' },
            ],
        );
        const r = validateWorkflow(c);
        const issues = r.issues.filter((i) => i.code === 'condition-missing-branch');
        expect(issues.some((i) => i.message.includes('true'))).toBe(true);
        expect(r.valid).toBe(false);
    });

    it('flags condition-missing-branch when a flow-condition lacks the false branch', () => {
        const c = makeCanvas(
            [
                { id: 'cond', type: 'flow-condition', data: { condition: { field: 'x', op: 'equals', value: 1 } } },
                { id: 'yes' },
            ],
            [
                { id: 'e1', source: 'cond', target: 'yes', sourceHandle: 'true' },
            ],
        );
        const r = validateWorkflow(c);
        const issues = r.issues.filter((i) => i.code === 'condition-missing-branch');
        expect(issues.some((i) => i.message.includes('false'))).toBe(true);
        expect(r.valid).toBe(false);
    });

    it('flags unhandled-source-handle for flow-condition outgoing edges that are not true/false', () => {
        const c = makeCanvas(
            [
                { id: 'cond', type: 'flow-condition', data: { condition: { field: 'x', op: 'equals', value: 1 } } },
                { id: 'yes' }, { id: 'no' }, { id: 'maybe' },
            ],
            [
                { id: 'e1', source: 'cond', target: 'yes', sourceHandle: 'true' },
                { id: 'e2', source: 'cond', target: 'no', sourceHandle: 'false' },
                { id: 'e3', source: 'cond', target: 'maybe', sourceHandle: 'unknown' },
            ],
        );
        const r = validateWorkflow(c);
        const issues = r.issues.filter((i) => i.code === 'unhandled-source-handle');
        expect(issues).toHaveLength(1);
        expect(issues[0]).toMatchObject({
            severity: 'error',
            code: 'unhandled-source-handle',
            edgeId: 'e3',
            nodeId: 'cond',
        });
        expect(r.valid).toBe(false);
    });

    it('flags wait-missing-duration when flow-wait lacks numeric durationMs', () => {
        const c = makeCanvas(
            [
                { id: 'trigger' },
                { id: 'wait', type: 'flow-wait', data: {} },
            ],
            [
                { id: 'e1', source: 'trigger', target: 'wait' },
            ],
        );
        const r = validateWorkflow(c);
        const issues = r.issues.filter((i) => i.code === 'wait-missing-duration');
        expect(issues).toHaveLength(1);
        expect(issues[0]).toMatchObject({
            severity: 'error',
            code: 'wait-missing-duration',
            nodeId: 'wait',
        });
        expect(r.valid).toBe(false);
    });

    it('flags wait-missing-duration when durationMs is non-numeric', () => {
        const c = makeCanvas(
            [
                { id: 'trigger' },
                { id: 'wait', type: 'flow-wait', data: { durationMs: 'soon' } },
            ],
            [
                { id: 'e1', source: 'trigger', target: 'wait' },
            ],
        );
        const r = validateWorkflow(c);
        const issues = r.issues.filter((i) => i.code === 'wait-missing-duration');
        expect(issues).toHaveLength(1);
        expect(r.valid).toBe(false);
    });

    it('flags unreachable-node as warning (no incoming edges, not a recognized entry)', () => {
        const c = makeCanvas(
            [
                { id: 'trigger' },
                { id: 'orphan' },
            ],
            [],
        );
        const r = validateWorkflow(c);
        const issues = r.issues.filter((i) => i.code === 'unreachable-node');
        expect(issues.some((i) => i.nodeId === 'orphan')).toBe(true);
        // 'trigger' (no incoming) is also unreachable since it isn't connected by edges
        expect(issues.some((i) => i.severity === 'warning')).toBe(true);
        // unreachable is a warning — does not invalidate
        const onlyWarnings = issues.every((i) => i.severity === 'warning');
        expect(onlyWarnings).toBe(true);
    });

    it('flags cycle as a warning when the graph has a directed cycle', () => {
        const c = makeCanvas(
            [{ id: 'a' }, { id: 'b' }],
            [
                { id: 'e1', source: 'a', target: 'b' },
                { id: 'e2', source: 'b', target: 'a' },
            ],
        );
        const r = validateWorkflow(c);
        const cycle = r.issues.find((i) => i.code === 'cycle');
        expect(cycle).toBeDefined();
        expect(cycle?.severity).toBe('warning');
        // cycle alone does not break valid:true — only error-severity issues do
        const errorOnly = r.issues.filter((i) => i.severity === 'error');
        expect(errorOnly).toEqual([]);
        expect(r.valid).toBe(true);
    });

    it('tolerates missing canvas.nodes or canvas.edges gracefully', () => {
        const r1 = validateWorkflow({} as any);
        expect(r1.valid).toBe(true);
        expect(r1.issues).toEqual([]);

        const r2 = validateWorkflow({ nodes: undefined, edges: null } as any);
        expect(r2.valid).toBe(true);
    });

    it('attaches validateWorkflow onto a canvas after the workflow addon setup runs', async () => {
        const { default: AlpineFlowWorkflow } = await import('./index');
        const { getAddon } = await import('../core/registry');
        AlpineFlowWorkflow({ magic: () => {}, data: () => {}, $data: () => null } as any);
        const workflow = getAddon<{ setup(c: any): void }>('workflow');
        expect(workflow).toBeDefined();
        const canvas: any = { nodes: [], edges: [] };
        workflow!.setup(canvas);
        expect(typeof canvas.validateWorkflow).toBe('function');
        expect(canvas.validateWorkflow()).toMatchObject({ valid: true, issues: [] });
    });
});
