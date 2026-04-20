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
});
