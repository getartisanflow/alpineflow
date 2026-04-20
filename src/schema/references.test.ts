import { describe, it, expect } from 'vitest';
import { inferReferences } from './references';

describe('inferReferences', () => {
    it('suggests a reference when field ends in <nodeId>_id', () => {
        const nodes = [
            { id: 'user', data: { fields: [{ name: 'id' }, { name: 'team_id' }] } },
            { id: 'team', data: { fields: [{ name: 'id' }] } },
        ];
        expect(inferReferences(nodes)).toEqual([
            { fromNodeId: 'user', fromFieldName: 'team_id', toNodeId: 'team', toFieldName: 'id', confidence: 'exact' },
        ]);
    });

    it('returns no suggestions when field stem does not match any node id', () => {
        const nodes = [
            { id: 'user', data: { fields: [{ name: 'unknown_id' }] } },
        ];
        expect(inferReferences(nodes)).toEqual([]);
    });

    it('targets the primary key field if one is marked', () => {
        const nodes = [
            { id: 'user', data: { fields: [{ name: 'team_id' }] } },
            { id: 'team', data: { fields: [{ name: 'uuid' }, { name: 'id', key: 'primary' }] } },
        ];
        const refs = inferReferences(nodes);
        expect(refs).toHaveLength(1);
        expect(refs[0].toFieldName).toBe('id');
    });

    it('falls back to first field when no primary key marked', () => {
        const nodes = [
            { id: 'user', data: { fields: [{ name: 'team_id' }] } },
            { id: 'team', data: { fields: [{ name: 'uuid' }, { name: 'slug' }] } },
        ];
        const refs = inferReferences(nodes);
        expect(refs).toHaveLength(1);
        expect(refs[0].toFieldName).toBe('uuid');
    });

    it('handles multiple references from one node', () => {
        const nodes = [
            { id: 'task', data: { fields: [{ name: 'project_id' }, { name: 'assignee_id' }] } },
            { id: 'project', data: { fields: [{ name: 'id', key: 'primary' }] } },
            { id: 'assignee', data: { fields: [{ name: 'id', key: 'primary' }] } },
        ];
        expect(inferReferences(nodes)).toHaveLength(2);
    });

    it('does not suggest self-references even if field name matches node id', () => {
        const nodes = [
            { id: 'user', data: { fields: [{ name: 'user_id' }] } },
        ];
        expect(inferReferences(nodes)).toEqual([]);
    });

    it('handles nodes with missing data.fields gracefully', () => {
        const nodes = [
            { id: 'user', data: {} },
            { id: 'team', data: { fields: [{ name: 'id' }] } },
        ];
        expect(() => inferReferences(nodes)).not.toThrow();
        expect(inferReferences(nodes)).toEqual([]);
    });

    it('ignores fields that are not strings ending in _id', () => {
        const nodes = [
            { id: 'user', data: { fields: [{ name: 'id' }, { name: 'team' }, { name: 'email' }] } },
            { id: 'team', data: { fields: [{ name: 'id' }] } },
        ];
        expect(inferReferences(nodes)).toEqual([]);
    });

    it('target field defaults to "id" when target node has no fields array', () => {
        // Edge case: node has data but no fields array at all (older stub).
        // Helper should still emit a suggestion with a reasonable default
        // rather than crashing.
        const nodes = [
            { id: 'user', data: { fields: [{ name: 'team_id' }] } },
            { id: 'team', data: {} as any },
        ];
        const refs = inferReferences(nodes);
        expect(refs).toHaveLength(1);
        expect(refs[0].toFieldName).toBe('id');
    });
});
