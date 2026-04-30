import { describe, it, expect } from 'vitest';
import { cascadeEdgesOnRename, cascadeEdgesOnRemove } from './cascade';

describe('cascadeEdgesOnRename', () => {
    it('rewrites sourceHandle when the edge source matches nodeId + oldName', () => {
        const edges = [
            { id: 'e1', source: 'user', sourceHandle: 'team_id', target: 'team', targetHandle: 'id' },
        ];
        const { edges: updated, cascadedIds } = cascadeEdgesOnRename(edges, 'user', 'team_id', 'team_ref');
        expect(updated[0].sourceHandle).toBe('team_ref');
        expect(cascadedIds).toEqual(['e1']);
    });

    it('rewrites targetHandle when the edge target matches nodeId + oldName', () => {
        const edges = [
            { id: 'e1', source: 'user', sourceHandle: 'team_id', target: 'team', targetHandle: 'id' },
        ];
        const { edges: updated, cascadedIds } = cascadeEdgesOnRename(edges, 'team', 'id', 'uuid');
        expect(updated[0].targetHandle).toBe('uuid');
        expect(cascadedIds).toEqual(['e1']);
    });

    it('does not touch edges whose handle does not match', () => {
        const edges = [
            { id: 'e1', source: 'user', sourceHandle: 'name', target: 'team', targetHandle: 'id' },
        ];
        const { cascadedIds } = cascadeEdgesOnRename(edges, 'user', 'team_id', 'team_ref');
        expect(cascadedIds).toEqual([]);
    });

    it('does not touch edges on a different node with the same handle name', () => {
        const edges = [
            { id: 'e1', source: 'project', sourceHandle: 'team_id', target: 'team', targetHandle: 'id' },
        ];
        const { cascadedIds } = cascadeEdgesOnRename(edges, 'user', 'team_id', 'team_ref');
        expect(cascadedIds).toEqual([]);
    });

    it('handles an edge that touches the same node on both ends (self-ref) correctly', () => {
        const edges = [
            { id: 'e1', source: 'user', sourceHandle: 'parent_id', target: 'user', targetHandle: 'id' },
        ];
        const { edges: updated, cascadedIds } = cascadeEdgesOnRename(edges, 'user', 'parent_id', 'parent_ref');
        expect(updated[0].sourceHandle).toBe('parent_ref');
        expect(updated[0].targetHandle).toBe('id');
        expect(cascadedIds).toEqual(['e1']);
    });
});

describe('cascadeEdgesOnRemove', () => {
    it('drops an edge whose source+sourceHandle matches', () => {
        const edges = [
            { id: 'e1', source: 'user', sourceHandle: 'team_id', target: 'team', targetHandle: 'id' },
            { id: 'e2', source: 'user', sourceHandle: 'name', target: 'team', targetHandle: 'slug' },
        ];
        const { edges: kept, droppedIds } = cascadeEdgesOnRemove(edges, 'user', 'team_id');
        expect(kept.map(e => e.id)).toEqual(['e2']);
        expect(droppedIds).toEqual(['e1']);
    });

    it('drops an edge whose target+targetHandle matches', () => {
        const edges = [
            { id: 'e1', source: 'user', sourceHandle: 'team_id', target: 'team', targetHandle: 'id' },
        ];
        const { droppedIds } = cascadeEdgesOnRemove(edges, 'team', 'id');
        expect(droppedIds).toEqual(['e1']);
    });

    it('drops an edge that matches on both ends (self-ref)', () => {
        const edges = [
            { id: 'e1', source: 'user', sourceHandle: 'parent_id', target: 'user', targetHandle: 'id' },
        ];
        const { droppedIds } = cascadeEdgesOnRemove(edges, 'user', 'parent_id');
        expect(droppedIds).toEqual(['e1']);
    });
});
