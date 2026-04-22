// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { diffSchemas } from './diff';
import type { SchemaGraphJSON } from './types';

function snap(
    nodes: Array<{
        id: string;
        label?: string;
        fields?: Array<{ name: string; type: string; key?: 'primary' | 'foreign' }>;
        position?: { x: number; y: number };
    }> = [],
    edges: Array<{
        id: string;
        source: string;
        target: string;
        sourceHandle?: string;
        targetHandle?: string;
        label?: string;
    }> = [],
): SchemaGraphJSON {
    return {
        version: 1 as const,
        nodes: nodes.map((n) => ({
            id: n.id,
            label: n.label ?? n.id,
            fields: n.fields ?? [],
            position: n.position ?? { x: 0, y: 0 },
        })),
        edges,
    };
}

describe('diffSchemas', () => {
    it('no changes returns all-empty diff', () => {
        const s = snap();
        const d = diffSchemas(s, s);
        expect(d).toEqual({
            addedNodes: [],
            removedNodes: [],
            renamedNodes: [],
            addedFields: [],
            removedFields: [],
            renamedFields: [],
            changedFieldTypes: [],
            addedEdges: [],
            removedEdges: [],
        });
    });

    it('detects added nodes', () => {
        const before = snap();
        const after = snap([{ id: 'user', fields: [{ name: 'id', type: 'uuid' }] }]);
        const d = diffSchemas(before, after);
        expect(d.addedNodes).toEqual(['user']);
        expect(d.removedNodes).toEqual([]);
    });

    it('detects removed nodes', () => {
        const before = snap([{ id: 'user', fields: [{ name: 'id', type: 'uuid' }] }]);
        const after = snap();
        const d = diffSchemas(before, after);
        expect(d.removedNodes).toEqual(['user']);
        expect(d.addedNodes).toEqual([]);
    });

    it('detects added fields on a node present in both snapshots', () => {
        const before = snap([{ id: 'user', fields: [{ name: 'id', type: 'uuid' }] }]);
        const after = snap([
            {
                id: 'user',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        const d = diffSchemas(before, after);
        expect(d.addedFields).toEqual([{ nodeId: 'user', fieldName: 'email' }]);
        expect(d.removedFields).toEqual([]);
    });

    it('detects removed fields on a node present in both snapshots', () => {
        const before = snap([
            {
                id: 'user',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        const after = snap([{ id: 'user', fields: [{ name: 'id', type: 'uuid' }] }]);
        const d = diffSchemas(before, after);
        expect(d.removedFields).toEqual([{ nodeId: 'user', fieldName: 'email' }]);
        expect(d.addedFields).toEqual([]);
    });

    it('applies fieldRenames hints before computing added/removed', () => {
        const before = snap([
            {
                id: 'user',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'team_id', type: 'uuid' },
                ],
            },
        ]);
        const after = snap([
            {
                id: 'user',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'team_ref', type: 'uuid' },
                ],
            },
        ]);
        const d = diffSchemas(before, after, {
            fieldRenames: [{ nodeId: 'user', from: 'team_id', to: 'team_ref' }],
        });
        expect(d.renamedFields).toEqual([
            { nodeId: 'user', from: 'team_id', to: 'team_ref' },
        ]);
        expect(d.addedFields).toEqual([]);
        expect(d.removedFields).toEqual([]);
    });

    it('detects changedFieldTypes for fields present in both', () => {
        const before = snap([
            { id: 'user', fields: [{ name: 'age', type: 'int2' }] },
        ]);
        const after = snap([
            { id: 'user', fields: [{ name: 'age', type: 'int4' }] },
        ]);
        const d = diffSchemas(before, after);
        expect(d.changedFieldTypes).toEqual([
            { nodeId: 'user', fieldName: 'age', from: 'int2', to: 'int4' },
        ]);
        expect(d.addedFields).toEqual([]);
        expect(d.removedFields).toEqual([]);
    });

    it('detects changedFieldTypes across renames (via hint)', () => {
        const before = snap([
            { id: 'user', fields: [{ name: 'team_id', type: 'int4' }] },
        ]);
        const after = snap([
            { id: 'user', fields: [{ name: 'team_ref', type: 'uuid' }] },
        ]);
        const d = diffSchemas(before, after, {
            fieldRenames: [{ nodeId: 'user', from: 'team_id', to: 'team_ref' }],
        });
        expect(d.renamedFields).toEqual([
            { nodeId: 'user', from: 'team_id', to: 'team_ref' },
        ]);
        expect(d.changedFieldTypes).toEqual([
            { nodeId: 'user', fieldName: 'team_ref', from: 'int4', to: 'uuid' },
        ]);
        expect(d.addedFields).toEqual([]);
        expect(d.removedFields).toEqual([]);
    });

    it('detects added/removed edges', () => {
        const before = snap(
            [
                { id: 'a', fields: [] },
                { id: 'b', fields: [] },
            ],
            [{ id: 'e-old', source: 'a', target: 'b' }],
        );
        const after = snap(
            [
                { id: 'a', fields: [] },
                { id: 'b', fields: [] },
            ],
            [{ id: 'e-new', source: 'a', target: 'b' }],
        );
        const d = diffSchemas(before, after);
        expect(d.addedEdges).toEqual(['e-new']);
        expect(d.removedEdges).toEqual(['e-old']);
    });

    it('detectRenames: heuristic matches same-field-shape removal + addition as a node rename', () => {
        const before = snap([
            {
                id: 'user_old',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        const after = snap([
            {
                id: 'user_new',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        const d = diffSchemas(before, after, { detectRenames: true });
        expect(d.renamedNodes).toEqual([{ from: 'user_old', to: 'user_new' }]);
        expect(d.addedNodes).toEqual([]);
        expect(d.removedNodes).toEqual([]);
    });

    it('detectRenames: ambiguous match (multiple candidates) is not recorded', () => {
        const before = snap([
            {
                id: 'user_old',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        const after = snap([
            {
                id: 'user_new_1',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
            {
                id: 'user_new_2',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        const d = diffSchemas(before, after, { detectRenames: true });
        expect(d.renamedNodes).toEqual([]);
        expect(d.removedNodes).toEqual(['user_old']);
        expect(d.addedNodes.sort()).toEqual(['user_new_1', 'user_new_2']);
    });

    it('output arrays are deterministically ordered', () => {
        const before = snap();
        const after = snap([
            { id: 'zeta', fields: [] },
            { id: 'alpha', fields: [] },
            { id: 'mu', fields: [] },
        ]);
        const d = diffSchemas(before, after);
        expect(d.addedNodes).toEqual(['alpha', 'mu', 'zeta']);
    });

    it('handles malformed input gracefully (null-ish snapshots do not throw)', () => {
        const empty = { version: 1 as const, nodes: [], edges: [] };
        expect(() => diffSchemas(empty, null as any)).not.toThrow();
        expect(() => diffSchemas(undefined as any, empty)).not.toThrow();
        const d = diffSchemas(null as any, null as any);
        expect(d.addedNodes).toEqual([]);
        expect(d.removedNodes).toEqual([]);
    });

    it('handles nodes with missing fields array', () => {
        const before = { version: 1 as const, nodes: [{ id: 'user' } as any], edges: [] };
        const after = snap([{ id: 'user', fields: [{ name: 'id', type: 'uuid' }] }]);
        const d = diffSchemas(before as SchemaGraphJSON, after);
        expect(d.addedFields).toEqual([{ nodeId: 'user', fieldName: 'id' }]);
        expect(d.removedFields).toEqual([]);
    });

    it('ignores field-rename hints when target field is not in after snapshot', () => {
        const before = snap([
            { id: 'user', fields: [{ name: 'team_id', type: 'uuid' }] },
        ]);
        const after = snap([{ id: 'user', fields: [] }]);
        const d = diffSchemas(before, after, {
            fieldRenames: [{ nodeId: 'user', from: 'team_id', to: 'team_ref' }],
        });
        // No rename recorded — instead team_id is just removed.
        expect(d.renamedFields).toEqual([]);
        expect(d.removedFields).toEqual([{ nodeId: 'user', fieldName: 'team_id' }]);
    });

    it('does not mutate input snapshots', () => {
        const before = snap([{ id: 'user', fields: [{ name: 'id', type: 'uuid' }] }]);
        const after = snap([
            {
                id: 'user',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        const beforeFrozen = JSON.parse(JSON.stringify(before));
        const afterFrozen = JSON.parse(JSON.stringify(after));
        diffSchemas(before, after);
        expect(before).toEqual(beforeFrozen);
        expect(after).toEqual(afterFrozen);
    });

    it('detects added/removed fields + changed types alongside node renames', () => {
        const before = snap([
            {
                id: 'user_old',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        const after = snap([
            {
                id: 'user_new',
                fields: [
                    { name: 'id', type: 'uuid' },
                    { name: 'email', type: 'text' },
                ],
            },
        ]);
        // Same field-name-shape — detectRenames matches.
        const d = diffSchemas(before, after, { detectRenames: true });
        expect(d.renamedNodes).toEqual([{ from: 'user_old', to: 'user_new' }]);
        expect(d.addedFields).toEqual([]);
        expect(d.removedFields).toEqual([]);
        expect(d.changedFieldTypes).toEqual([]);
    });
});
