// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { schemaToJSON, schemaFromJSON } from './serialization';
import { renameField } from './field-ops';

/**
 * A canvas with live lookup maps + getNode/getEdge, mirroring the real canvas
 * enough to prove schemaFromJSON preserves object identity and rebuilds maps.
 */
function makeLiveCanvas() {
    const el = document.createElement('div');
    el.setAttribute('data-flow-canvas', '');
    document.body.appendChild(el);
    const canvas: any = {
        el,
        nodes: [
            {
                id: 'users',
                position: { x: 0, y: 0 },
                data: {
                    label: 'Users',
                    fields: [
                        { name: 'id', type: 'uuid' },
                        { name: 'email', type: 'text' },
                    ],
                },
            },
            {
                id: 'posts',
                position: { x: 200, y: 0 },
                data: {
                    label: 'Posts',
                    fields: [
                        { name: 'id', type: 'uuid' },
                        { name: 'user_id', type: 'uuid' },
                    ],
                },
            },
        ] as any[],
        edges: [
            { id: 'e1', source: 'posts', sourceHandle: 'user_id', target: 'users', targetHandle: 'id' },
        ] as any[],
        _nodeMap: new Map<string, any>(),
        _edgeMap: new Map<string, any>(),
        _layoutAnimTick: 0,
        _rebuildNodeMap() {
            canvas._nodeMap = new Map(canvas.nodes.map((n: any) => [n.id, n]));
        },
        _rebuildEdgeMap() {
            canvas._edgeMap = new Map(canvas.edges.map((e: any) => [e.id, e]));
        },
        getNode(id: string) {
            return canvas._nodeMap.get(id);
        },
        getEdge(id: string) {
            return canvas._edgeMap.get(id);
        },
    };
    canvas._rebuildNodeMap();
    canvas._rebuildEdgeMap();
    return canvas;
}

function makeCanvas() {
    const el = document.createElement('div');
    el.setAttribute('data-flow-canvas', '');
    document.body.appendChild(el);
    return {
        el,
        nodes: [
            {
                id: 'user',
                position: { x: 40, y: 40 },
                data: {
                    label: 'User',
                    fields: [
                        { name: 'id', type: 'uuid', key: 'primary' },
                        { name: 'team_id', type: 'uuid', key: 'foreign' },
                    ],
                },
            },
            {
                id: 'team',
                position: { x: 240, y: 40 },
                data: {
                    label: 'Team',
                    fields: [{ name: 'id', type: 'uuid', key: 'primary' }],
                },
            },
        ],
        edges: [
            {
                id: 'rel-user-team',
                source: 'user',
                sourceHandle: 'team_id',
                target: 'team',
                targetHandle: 'id',
                label: 'belongs to',
            },
        ],
    };
}

describe('schemaToJSON', () => {
    it('emits stable shape with version:1, nodes, edges', () => {
        const canvas = makeCanvas();
        const json = schemaToJSON(canvas);
        expect(json.version).toBe(1);
        expect(json.nodes).toHaveLength(2);
        expect(json.edges).toHaveLength(1);
    });

    it('node shape: id, label, fields, position — nothing else', () => {
        const canvas = makeCanvas();
        const json = schemaToJSON(canvas);
        const user = json.nodes.find((n) => n.id === 'user')!;
        expect(Object.keys(user).sort()).toEqual(['fields', 'id', 'label', 'position']);
        expect(user.label).toBe('User');
        expect(user.fields).toHaveLength(2);
        expect(user.position).toEqual({ x: 40, y: 40 });
    });

    it('edge shape: id, source, sourceHandle?, target, targetHandle?, label? — nothing else', () => {
        const canvas = makeCanvas();
        const json = schemaToJSON(canvas);
        const edge = json.edges[0];
        expect(Object.keys(edge).sort()).toEqual(
            ['id', 'label', 'source', 'sourceHandle', 'target', 'targetHandle'],
        );
    });

    it('strips internal underscore-prefixed flags from nodes and edges', () => {
        const canvas = makeCanvas();
        (canvas.nodes[0] as any)._hidden = true;
        (canvas.edges[0] as any)._renderDualMarker = true;
        const json = schemaToJSON(canvas);
        const user = json.nodes.find((n) => n.id === 'user') as any;
        expect(user._hidden).toBeUndefined();
        expect((json.edges[0] as any)._renderDualMarker).toBeUndefined();
    });

    it('handles empty nodes/edges arrays', () => {
        const canvas = { el: document.createElement('div'), nodes: [], edges: [] };
        expect(schemaToJSON(canvas)).toEqual({ version: 1, nodes: [], edges: [] });
    });

    it('omits undefined optional edge fields (sourceHandle / targetHandle / label)', () => {
        const canvas = makeCanvas();
        canvas.edges = [{ id: 'e1', source: 'user', target: 'team' } as any];
        const json = schemaToJSON(canvas);
        expect(Object.keys(json.edges[0]).sort()).toEqual(['id', 'source', 'target']);
    });
});

describe('schemaFromJSON', () => {
    it('round-trips into canvas state', () => {
        const src = makeCanvas();
        const json = schemaToJSON(src);

        const dest = { el: document.createElement('div'), nodes: [] as any[], edges: [] as any[] };
        schemaFromJSON(dest, json);
        expect(dest.nodes).toHaveLength(2);
        expect(dest.edges).toHaveLength(1);
        expect(dest.nodes[0].data.label).toBe('User');
        expect(dest.edges[0].sourceHandle).toBe('team_id');
    });

    it('throws on unsupported version', () => {
        const dest = { el: document.createElement('div'), nodes: [], edges: [] };
        expect(() => schemaFromJSON(dest, { version: 99, nodes: [], edges: [] } as any))
            .toThrow(/unsupported version/i);
    });

    it('throws on missing version', () => {
        const dest = { el: document.createElement('div'), nodes: [], edges: [] };
        expect(() => schemaFromJSON(dest, { nodes: [], edges: [] } as any)).toThrow();
    });

    it('replaces existing canvas state (does not merge)', () => {
        const dest = {
            el: document.createElement('div'),
            nodes: [{ id: 'old', position: { x: 0, y: 0 }, data: { label: 'Old', fields: [] } }],
            edges: [{ id: 'old-edge', source: 'a', target: 'b' }],
        };
        const json = { version: 1 as const, nodes: [{ id: 'new', label: 'New', fields: [], position: { x: 1, y: 1 } }], edges: [] };
        schemaFromJSON(dest, json);
        expect(dest.nodes).toHaveLength(1);
        expect(dest.nodes[0].id).toBe('new');
        expect(dest.edges).toHaveLength(0);
    });

    it('mutates arrays in place so Alpine reactivity picks up changes', () => {
        const dest = {
            el: document.createElement('div'),
            nodes: [] as any[],
            edges: [] as any[],
        };
        const originalNodesRef = dest.nodes;
        const originalEdgesRef = dest.edges;
        const json = { version: 1 as const, nodes: [{ id: 'a', label: 'A', fields: [], position: { x: 0, y: 0 } }], edges: [] };
        schemaFromJSON(dest, json);
        expect(dest.nodes).toBe(originalNodesRef);
        expect(dest.edges).toBe(originalEdgesRef);
    });

    it('keeps node identity, preserves non-schema props, and getNode stays live', () => {
        const canvas = makeLiveCanvas();
        const ref = canvas.getNode('users');
        ref.dimensions = { width: 220, height: 180 };
        const json = schemaToJSON(canvas);
        renameField(canvas, 'users', 'id', 'uuid'); // mutate the live graph away from json
        schemaFromJSON(canvas, json);
        expect(canvas.getNode('users')).toBe(ref); // map rebuilt + identity kept
        expect(ref.dimensions).toEqual({ width: 220, height: 180 }); // not dropped
        expect(ref.data.fields.map((f: any) => f.name)).toContain('id');
    });

    it('rebuilds the edge map so getEdge returns the live merged edge', () => {
        const canvas = makeLiveCanvas();
        const edgeRef = canvas.getEdge('e1');
        const json = schemaToJSON(canvas);
        edgeRef.targetHandle = 'uuid'; // mutate the live edge away from json
        schemaFromJSON(canvas, json); // restores targetHandle back to 'id'
        expect(canvas.getEdge('e1')).toBe(edgeRef); // identity kept + map rebuilt
        expect(edgeRef.targetHandle).toBe('id');
    });
});
