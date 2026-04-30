// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { validateSchema } from './validate';

function makeCanvas(nodes: any[], edges: any[]) {
    return { nodes, edges };
}

describe('validateSchema', () => {
    it('returns valid:true with no issues for a well-formed canvas', () => {
        const c = makeCanvas(
            [
                { id: 'user', data: { label: 'User', fields: [{ name: 'id', type: 'uuid', key: 'primary' }] } },
                { id: 'team', data: { label: 'Team', fields: [{ name: 'id', type: 'uuid', key: 'primary' }] } },
            ],
            [{ id: 'e1', source: 'user', target: 'team' }],
        );
        const r = validateSchema(c);
        expect(r.valid).toBe(true);
        expect(r.issues).toEqual([]);
    });

    it('flags dangling-edge when source is missing', () => {
        const c = makeCanvas(
            [{ id: 'team', data: { fields: [{ name: 'id', key: 'primary' }] } }],
            [{ id: 'e1', source: 'ghost', target: 'team' }],
        );
        const r = validateSchema(c);
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

    it('flags dangling-edge when target is missing', () => {
        const c = makeCanvas(
            [{ id: 'user', data: { fields: [{ name: 'id', key: 'primary' }] } }],
            [{ id: 'e1', source: 'user', target: 'nowhere' }],
        );
        const r = validateSchema(c);
        const dangling = r.issues.filter((i) => i.code === 'dangling-edge');
        expect(dangling).toHaveLength(1);
        expect(dangling[0]).toMatchObject({
            severity: 'error',
            code: 'dangling-edge',
            edgeId: 'e1',
            nodeId: 'nowhere',
        });
        expect(r.valid).toBe(false);
    });

    it('fires dangling-edge once per bad endpoint (source AND target missing)', () => {
        const c = makeCanvas(
            [],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const r = validateSchema(c);
        const dangling = r.issues.filter((i) => i.code === 'dangling-edge');
        expect(dangling).toHaveLength(2);
    });

    it('flags duplicate-node-id once per duplicate id', () => {
        const c = makeCanvas(
            [
                { id: 'user', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'user', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'user', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'team', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'team', data: { fields: [{ name: 'id', key: 'primary' }] } },
            ],
            [{ id: 'e1', source: 'user', target: 'team' }],
        );
        const r = validateSchema(c);
        const dups = r.issues.filter((i) => i.code === 'duplicate-node-id');
        expect(dups).toHaveLength(2);
        expect(new Set(dups.map((d) => d.nodeId))).toEqual(new Set(['user', 'team']));
        expect(dups.every((d) => d.severity === 'error')).toBe(true);
        expect(r.valid).toBe(false);
    });

    it('flags duplicate-field once per duplicate name per node', () => {
        const c = makeCanvas(
            [
                {
                    id: 'user',
                    data: {
                        fields: [
                            { name: 'id', key: 'primary' },
                            { name: 'email' },
                            { name: 'email' },
                            { name: 'email' },
                            { name: 'name' },
                            { name: 'name' },
                        ],
                    },
                },
            ],
            [],
        );
        const r = validateSchema(c);
        const dupFields = r.issues.filter((i) => i.code === 'duplicate-field');
        expect(dupFields).toHaveLength(2);
        expect(new Set(dupFields.map((d) => d.fieldName))).toEqual(new Set(['email', 'name']));
        expect(dupFields.every((d) => d.nodeId === 'user' && d.severity === 'error')).toBe(true);
        expect(r.valid).toBe(false);
    });

    it('flags missing-primary-key warning when no field has key:primary', () => {
        const c = makeCanvas(
            [{ id: 'user', data: { fields: [{ name: 'email' }, { name: 'name' }] } }],
            [],
        );
        const r = validateSchema(c);
        const mpk = r.issues.filter((i) => i.code === 'missing-primary-key');
        expect(mpk).toHaveLength(1);
        expect(mpk[0]).toMatchObject({
            severity: 'warning',
            code: 'missing-primary-key',
            nodeId: 'user',
        });
    });

    it('skips missing-primary-key when node.data.fields is empty', () => {
        const c = makeCanvas(
            [{ id: 'user', data: { fields: [] } }, { id: 'team', data: {} }],
            [{ id: 'e1', source: 'user', target: 'team' }],
        );
        const r = validateSchema(c);
        const mpk = r.issues.filter((i) => i.code === 'missing-primary-key');
        expect(mpk).toHaveLength(0);
    });

    it('flags disconnected-node warning when a node has no edges touching it', () => {
        const c = makeCanvas(
            [
                { id: 'user', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'team', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'orphan', data: { fields: [{ name: 'id', key: 'primary' }] } },
            ],
            [{ id: 'e1', source: 'user', target: 'team' }],
        );
        const r = validateSchema(c);
        const disc = r.issues.filter((i) => i.code === 'disconnected-node');
        expect(disc).toHaveLength(1);
        expect(disc[0]).toMatchObject({
            severity: 'warning',
            code: 'disconnected-node',
            nodeId: 'orphan',
        });
    });

    it('does not flag disconnected-node for nodes in a single-edge graph', () => {
        const c = makeCanvas(
            [
                { id: 'user', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'team', data: { fields: [{ name: 'id', key: 'primary' }] } },
            ],
            [{ id: 'e1', source: 'user', target: 'team' }],
        );
        const r = validateSchema(c);
        const disc = r.issues.filter((i) => i.code === 'disconnected-node');
        expect(disc).toHaveLength(0);
    });

    it('flags cycle warning once for a cyclic graph (3-node cycle)', () => {
        const c = makeCanvas(
            [
                { id: 'a', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'b', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'c', data: { fields: [{ name: 'id', key: 'primary' }] } },
            ],
            [
                { id: 'e1', source: 'a', target: 'b' },
                { id: 'e2', source: 'b', target: 'c' },
                { id: 'e3', source: 'c', target: 'a' },
            ],
        );
        const r = validateSchema(c);
        const cycles = r.issues.filter((i) => i.code === 'cycle');
        expect(cycles).toHaveLength(1);
        expect(cycles[0]).toMatchObject({
            severity: 'warning',
            code: 'cycle',
        });
    });

    it('flags cycle only once even when multiple cycles exist', () => {
        const c = makeCanvas(
            [
                { id: 'a', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'b', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'c', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'd', data: { fields: [{ name: 'id', key: 'primary' }] } },
            ],
            [
                // cycle 1: a → b → a
                { id: 'e1', source: 'a', target: 'b' },
                { id: 'e2', source: 'b', target: 'a' },
                // cycle 2: c → d → c
                { id: 'e3', source: 'c', target: 'd' },
                { id: 'e4', source: 'd', target: 'c' },
            ],
        );
        const r = validateSchema(c);
        const cycles = r.issues.filter((i) => i.code === 'cycle');
        expect(cycles).toHaveLength(1);
    });

    it('detects self-edge as a cycle without infinite looping', () => {
        const c = makeCanvas(
            [{ id: 'a', data: { fields: [{ name: 'id', key: 'primary' }] } }],
            [{ id: 'e1', source: 'a', target: 'a' }],
        );
        const r = validateSchema(c);
        const cycles = r.issues.filter((i) => i.code === 'cycle');
        expect(cycles).toHaveLength(1);
    });

    it('does not flag cycle for a DAG', () => {
        const c = makeCanvas(
            [
                { id: 'a', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'b', data: { fields: [{ name: 'id', key: 'primary' }] } },
                { id: 'c', data: { fields: [{ name: 'id', key: 'primary' }] } },
            ],
            [
                { id: 'e1', source: 'a', target: 'b' },
                { id: 'e2', source: 'b', target: 'c' },
                { id: 'e3', source: 'a', target: 'c' },
            ],
        );
        const r = validateSchema(c);
        const cycles = r.issues.filter((i) => i.code === 'cycle');
        expect(cycles).toHaveLength(0);
    });

    it('valid:false when any error is present', () => {
        const c = makeCanvas(
            [{ id: 'user', data: { fields: [{ name: 'id', key: 'primary' }] } }],
            [{ id: 'e1', source: 'user', target: 'ghost' }],
        );
        const r = validateSchema(c);
        expect(r.valid).toBe(false);
        expect(r.issues.some((i) => i.severity === 'error')).toBe(true);
    });

    it('valid:true when only warnings are present', () => {
        const c = makeCanvas(
            [
                { id: 'user', data: { fields: [{ name: 'email' }] } }, // missing primary
                { id: 'orphan', data: { fields: [{ name: 'id', key: 'primary' }] } }, // disconnected
            ],
            [],
        );
        const r = validateSchema(c);
        expect(r.issues.length).toBeGreaterThan(0);
        expect(r.issues.every((i) => i.severity === 'warning')).toBe(true);
        expect(r.valid).toBe(true);
    });

    it('handles empty canvas (no nodes, no edges) gracefully', () => {
        const r = validateSchema(makeCanvas([], []));
        expect(r.valid).toBe(true);
        expect(r.issues).toEqual([]);
    });

    it('handles malformed input without throwing', () => {
        expect(() => validateSchema({} as any)).not.toThrow();
        expect(() => validateSchema({ nodes: null, edges: null } as any)).not.toThrow();
        expect(() => validateSchema({ nodes: [null, undefined], edges: [null] } as any)).not.toThrow();
        const r = validateSchema({ nodes: [null, undefined] as any, edges: [null] as any });
        expect(r.valid).toBe(true);
        expect(r.issues).toEqual([]);
    });
});
