// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addField, renameField, removeField, reorderFields } from './field-ops';

function makeCanvas() {
    const el = document.createElement('div');
    el.setAttribute('data-flow-canvas', '');
    document.body.appendChild(el);
    return {
        el,
        nodes: [
            {
                id: 'user',
                position: { x: 0, y: 0 },
                data: {
                    label: 'User',
                    fields: [
                        { name: 'id', type: 'uuid' },
                        { name: 'team_id', type: 'uuid' },
                        { name: 'email', type: 'text' },
                    ],
                },
            },
            {
                id: 'team',
                position: { x: 200, y: 0 },
                data: {
                    label: 'Team',
                    fields: [
                        { name: 'id', type: 'uuid' },
                        { name: 'name', type: 'text' },
                    ],
                },
            },
        ] as any[],
        edges: [
            { id: 'e-user-team', source: 'user', sourceHandle: 'team_id', target: 'team', targetHandle: 'id' },
        ] as any[],
    };
}

beforeEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('addField', () => {
    it('appends the field and dispatches schema:field-added', () => {
        const canvas = makeCanvas();
        const events: any[] = [];
        canvas.el.addEventListener('schema:field-added', (e: any) => events.push(e.detail));

        const result = addField(canvas, 'user', { name: 'avatar_url', type: 'text' });

        expect(result).toEqual({ applied: true });
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toEqual(['id', 'team_id', 'email', 'avatar_url']);
        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({ nodeId: 'user', field: { name: 'avatar_url', type: 'text' } });
    });

    it('rejects duplicate field names silently', () => {
        const canvas = makeCanvas();
        const events: any[] = [];
        canvas.el.addEventListener('schema:field-added', (e: any) => events.push(e.detail));

        const result = addField(canvas, 'user', { name: 'email', type: 'text' });

        expect(result).toEqual({ applied: false, reason: 'duplicate' });
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields).toHaveLength(3);
        expect(events).toHaveLength(0);
    });

    it.each(['1field', '_field', 'Field', 'a-field', 'a'.repeat(45)])(
        'rejects invalid name %s',
        (badName) => {
            const canvas = makeCanvas();
            const result = addField(canvas, 'user', { name: badName, type: 'text' });
            expect(result).toEqual({ applied: false, reason: 'invalid-name' });
            const user = canvas.nodes.find((n: any) => n.id === 'user');
            expect(user.data.fields).toHaveLength(3);
        },
    );

    it('rejects when the target node does not exist', () => {
        const canvas = makeCanvas();
        const result = addField(canvas, 'missing', { name: 'avatar_url', type: 'text' });
        expect(result).toEqual({ applied: false, reason: 'no-node' });
    });
});

describe('renameField', () => {
    it('renames the field, cascades edges, and dispatches schema:field-renamed + schema:edges-cascaded', () => {
        const canvas = makeCanvas();
        const renamed: any[] = [];
        const cascaded: any[] = [];
        canvas.el.addEventListener('schema:field-renamed', (e: any) => renamed.push(e.detail));
        canvas.el.addEventListener('schema:edges-cascaded', (e: any) => cascaded.push(e.detail));

        const result = renameField(canvas, 'user', 'team_id', 'team_ref');

        expect(result.applied).toBe(true);
        expect(result.cascadedEdgeIds).toEqual(['e-user-team']);

        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toEqual(['id', 'team_ref', 'email']);
        expect(canvas.edges[0].sourceHandle).toBe('team_ref');

        expect(renamed).toHaveLength(1);
        expect(renamed[0]).toMatchObject({ nodeId: 'user', oldName: 'team_id', newName: 'team_ref' });
        expect(cascaded).toHaveLength(1);
        expect(cascaded[0]).toEqual({
            nodeId: 'user',
            fieldName: 'team_ref',
            edgeIds: ['e-user-team'],
            operation: 'rename',
        });
    });

    it('does not dispatch schema:edges-cascaded when nothing cascades', () => {
        const canvas = makeCanvas();
        const cascaded: any[] = [];
        canvas.el.addEventListener('schema:edges-cascaded', (e: any) => cascaded.push(e.detail));

        const result = renameField(canvas, 'user', 'email', 'email_address');

        expect(result.applied).toBe(true);
        expect(result.cascadedEdgeIds).toEqual([]);
        expect(cascaded).toHaveLength(0);
    });

    it('rejects duplicate new name silently', () => {
        const canvas = makeCanvas();
        const result = renameField(canvas, 'user', 'team_id', 'email');
        expect(result).toMatchObject({ applied: false, reason: 'duplicate' });
    });

    it('rejects invalid new names', () => {
        const canvas = makeCanvas();
        const result = renameField(canvas, 'user', 'team_id', '1bad');
        expect(result).toMatchObject({ applied: false, reason: 'invalid-name' });
    });

    it('no-ops when oldName equals newName', () => {
        const canvas = makeCanvas();
        const result = renameField(canvas, 'user', 'team_id', 'team_id');
        expect(result).toMatchObject({ applied: false, reason: 'unchanged' });
    });

    it('fails when the node does not exist', () => {
        const canvas = makeCanvas();
        const result = renameField(canvas, 'missing', 'team_id', 'team_ref');
        expect(result).toMatchObject({ applied: false, reason: 'no-node' });
    });

    it('fails when the field does not exist on the node', () => {
        const canvas = makeCanvas();
        const result = renameField(canvas, 'user', 'ghost', 'phantom');
        expect(result).toMatchObject({ applied: false, reason: 'no-field' });
    });
});

describe('removeField', () => {
    it('drops the field, cascades edges, and dispatches schema:field-removed + schema:edges-cascaded', () => {
        const canvas = makeCanvas();
        const removed: any[] = [];
        const cascaded: any[] = [];
        canvas.el.addEventListener('schema:field-removed', (e: any) => removed.push(e.detail));
        canvas.el.addEventListener('schema:edges-cascaded', (e: any) => cascaded.push(e.detail));

        const result = removeField(canvas, 'user', 'team_id');

        expect(result.applied).toBe(true);
        expect(result.droppedEdgeIds).toEqual(['e-user-team']);

        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toEqual(['id', 'email']);
        expect(canvas.edges).toHaveLength(0);

        expect(removed).toHaveLength(1);
        expect(removed[0]).toMatchObject({ nodeId: 'user', fieldName: 'team_id' });
        expect(cascaded).toHaveLength(1);
        expect(cascaded[0]).toEqual({
            nodeId: 'user',
            fieldName: 'team_id',
            edgeIds: ['e-user-team'],
            operation: 'remove',
        });
    });

    it('does not dispatch schema:edges-cascaded when no edges touch the field', () => {
        const canvas = makeCanvas();
        const cascaded: any[] = [];
        canvas.el.addEventListener('schema:edges-cascaded', (e: any) => cascaded.push(e.detail));

        const result = removeField(canvas, 'user', 'email');

        expect(result.applied).toBe(true);
        expect(result.droppedEdgeIds).toEqual([]);
        expect(cascaded).toHaveLength(0);
    });

    it('fails when the field does not exist', () => {
        const canvas = makeCanvas();
        const result = removeField(canvas, 'user', 'ghost');
        expect(result).toMatchObject({ applied: false, reason: 'no-field' });
    });

    it('fails when the node does not exist', () => {
        const canvas = makeCanvas();
        const result = removeField(canvas, 'missing', 'team_id');
        expect(result).toMatchObject({ applied: false, reason: 'no-node' });
    });
});

describe('reorderFields', () => {
    it('reorders fields by the supplied name array', () => {
        const canvas = makeCanvas();
        const result = reorderFields(canvas, 'user', ['email', 'id', 'team_id']);
        expect(result).toEqual({ applied: true });
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toEqual(['email', 'id', 'team_id']);
    });

    it('rejects when supplied array does not match existing field names', () => {
        const canvas = makeCanvas();
        const result = reorderFields(canvas, 'user', ['email', 'id']);
        expect(result).toMatchObject({ applied: false, reason: 'mismatch' });
    });

    it('rejects when supplied array has a name that does not exist on the node', () => {
        const canvas = makeCanvas();
        const result = reorderFields(canvas, 'user', ['email', 'id', 'ghost']);
        expect(result).toMatchObject({ applied: false, reason: 'mismatch' });
    });

    it('fails when the node does not exist', () => {
        const canvas = makeCanvas();
        const result = reorderFields(canvas, 'missing', []);
        expect(result).toMatchObject({ applied: false, reason: 'no-node' });
    });

    it('rejects explicit duplicate names in the supplied order array', () => {
        const canvas = makeCanvas();
        const result = reorderFields(canvas, 'user', ['id', 'email', 'id']);
        expect(result).toEqual({ applied: false, reason: 'mismatch' });
        // Original field order stays intact.
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toEqual(['id', 'team_id', 'email']);
    });
});

describe('listener atomicity — exceptions in listeners do not corrupt return values', () => {
    it('renameField: throwing listener logs error, state still mutated, result still returned', () => {
        const canvas = makeCanvas();
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const boom = new Error('listener exploded');
        canvas.el.addEventListener('schema:field-renamed', () => {
            throw boom;
        });

        const result = renameField(canvas, 'user', 'team_id', 'team_ref');

        // (a) state was updated
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toEqual(['id', 'team_ref', 'email']);
        expect(canvas.edges[0].sourceHandle).toBe('team_ref');

        // (b) result was returned normally
        expect(result).toEqual({ applied: true, cascadedEdgeIds: ['e-user-team'] });

        // (c) console.error saw the listener exception
        expect(errorSpy).toHaveBeenCalled();
        const sawBoom = errorSpy.mock.calls.some((args) => args.includes(boom));
        expect(sawBoom).toBe(true);

        errorSpy.mockRestore();
    });

    it('addField: throwing listener does not break return value', () => {
        const canvas = makeCanvas();
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        canvas.el.addEventListener('schema:field-added', () => {
            throw new Error('bad listener');
        });

        const result = addField(canvas, 'user', { name: 'avatar_url', type: 'text' });

        expect(result).toEqual({ applied: true });
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toEqual(['id', 'team_id', 'email', 'avatar_url']);
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });

    it('removeField: throwing listener does not break return value', () => {
        const canvas = makeCanvas();
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        canvas.el.addEventListener('schema:field-removed', () => {
            throw new Error('bad listener');
        });

        const result = removeField(canvas, 'user', 'team_id');

        expect(result).toEqual({ applied: true, droppedEdgeIds: ['e-user-team'] });
        expect(canvas.edges).toHaveLength(0);
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
