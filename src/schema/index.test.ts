import { describe, it, expect } from 'vitest';
import registerSchemaAddon from './index';
import { getAddon, _resetRegistry } from '../core/registry';

describe('schema addon scaffold', () => {
    it('exports a plugin function', () => {
        expect(typeof registerSchemaAddon).toBe('function');
    });

    it('plugin function does not throw when called with a stub Alpine', () => {
        expect(() => registerSchemaAddon({} as any)).not.toThrow();
    });

    it('addon setup wires canvas.inferReferences onto the canvas', () => {
        _resetRegistry();
        registerSchemaAddon({} as any);
        const addon = getAddon<{ setup: (canvas: any) => void }>('schema');
        expect(addon).toBeDefined();

        const canvas: any = {
            nodes: [
                { id: 'user', data: { fields: [{ name: 'team_id' }] } },
                { id: 'team', data: { fields: [{ name: 'id', key: 'primary' }] } },
            ],
            edges: [],
        };
        addon!.setup(canvas);

        expect(typeof canvas.inferReferences).toBe('function');
        const refs = canvas.inferReferences();
        expect(refs).toEqual([
            { fromNodeId: 'user', fromFieldName: 'team_id', toNodeId: 'team', toFieldName: 'id', confidence: 'exact' },
        ]);
    });

    it('addon setup wires canvas.schemaToJSON and canvas.schemaFromJSON onto the canvas', () => {
        _resetRegistry();
        registerSchemaAddon({} as any);
        const addon = getAddon<{ setup: (canvas: any) => void }>('schema');
        expect(addon).toBeDefined();

        const canvas: any = {
            nodes: [
                {
                    id: 'user',
                    position: { x: 10, y: 20 },
                    data: { label: 'User', fields: [{ name: 'id', type: 'uuid' }] },
                },
            ],
            edges: [],
        };
        addon!.setup(canvas);

        expect(typeof canvas.schemaToJSON).toBe('function');
        expect(typeof canvas.schemaFromJSON).toBe('function');

        const json = canvas.schemaToJSON();
        expect(json.version).toBe(1);
        expect(json.nodes).toHaveLength(1);
        expect(json.nodes[0]).toEqual({
            id: 'user',
            label: 'User',
            fields: [{ name: 'id', type: 'uuid' }],
            position: { x: 10, y: 20 },
        });

        const originalNodesRef = canvas.nodes;
        canvas.schemaFromJSON({
            version: 1,
            nodes: [{ id: 'team', label: 'Team', fields: [], position: { x: 0, y: 0 } }],
            edges: [],
        });
        expect(canvas.nodes).toBe(originalNodesRef);
        expect(canvas.nodes).toHaveLength(1);
        expect(canvas.nodes[0].id).toBe('team');
    });
});
