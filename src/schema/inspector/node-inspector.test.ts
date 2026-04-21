// @vitest-environment jsdom
// ============================================================================
// x-schema-node-inspector — Scope exposure + optional default UI stamping
// ============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import Alpine from 'alpinejs';
import registerSchemaAddon from '../index';
import { registerNodeInspectorDirective } from './node-inspector';
import { _resetRegistry } from '../../core/registry';

function clearChildren(el: HTMLElement): void {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

interface MountOptions {
    /** Append a <template x-schema-default-ui> child before any custom children. */
    withDefaultUi?: boolean;
    /** HTMLElements (or Text nodes) to append into the inspector after any default-ui template. */
    children?: Array<Node>;
    /** Seed canvas.selectedNodes with this id. */
    selectedNodeId?: string | null;
}

/**
 * Build an Alpine root hosting a reactive flowCanvas-shaped object together
 * with the inspector element. Returns the inspector element and a live
 * reference to the reactive canvas scope via Alpine.$data.
 */
function mount(options: MountOptions = {}) {
    clearChildren(document.body);

    const host = document.createElement('div');
    host.setAttribute('x-data', 'canvas');

    const inspector = document.createElement('aside');
    inspector.setAttribute('x-schema-node-inspector', '');
    if (options.withDefaultUi) {
        inspector.appendChild(document.createElement('template'));
        inspector.lastElementChild!.setAttribute('x-schema-default-ui', '');
    }
    if (options.children) {
        for (const child of options.children) {
            inspector.appendChild(child);
        }
    }
    host.appendChild(inspector);

    const selectedNodeId = options.selectedNodeId ?? null;

    Alpine.data('canvas', () => ({
        nodes: [
            {
                id: 'user',
                position: { x: 0, y: 0 },
                data: {
                    label: 'User',
                    fields: [
                        { name: 'id', type: 'uuid' },
                        { name: 'email', type: 'text' },
                    ],
                },
            },
            {
                id: 'team',
                position: { x: 200, y: 0 },
                data: {
                    label: 'Team',
                    fields: [{ name: 'id', type: 'uuid' }],
                },
            },
        ] as any[],
        edges: [] as any[],
        selectedNodes: new Set<string>(selectedNodeId ? [selectedNodeId] : []),
        selectedEdges: new Set<string>(),
        selectedRows: new Set<string>(),
        init() {
            this.el = this.$el;
            const addon = (globalThis as any).__alpineflow_registry__?.get('schema');
            addon?.setup(this);
        },
    }));

    document.body.appendChild(host);
    Alpine.initTree(host);
    return { host, inspector, scope: () => Alpine.$data(host) as any };
}

function makeEl(tag: string, attrs: Record<string, string> = {}): HTMLElement {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v);
    }
    return el;
}

beforeEach(() => {
    _resetRegistry();
    registerSchemaAddon({} as any);
    registerNodeInspectorDirective(Alpine);
    if (!(Alpine as any).__started) {
        Alpine.start();
        (Alpine as any).__started = true;
    }
});

describe('x-schema-node-inspector directive', () => {
    it('registers without throwing', () => {
        expect(() => mount()).not.toThrow();
    });

    it('leaves host children untouched when no default-ui template is present', () => {
        const custom = makeEl('p', { 'data-custom': '' });
        custom.textContent = 'custom content';
        const { inspector } = mount({ children: [custom] });
        const found = inspector.querySelector('[data-custom]');
        expect(found).not.toBeNull();
        expect(found!.textContent).toBe('custom content');
    });

    it('exposes inspector scope with selectedNode for the last-selected node', () => {
        const { inspector, scope } = mount({ selectedNodeId: 'user' });
        const inspectorScope = Alpine.$data(inspector) as any;
        expect(inspectorScope.selectedNode).toBeTruthy();
        expect(inspectorScope.selectedNode.id).toBe('user');
        expect(scope().selectedNodes.has('user')).toBe(true);
    });

    it('stamps minimal default UI when <template x-schema-default-ui> is present', () => {
        const { inspector } = mount({ withDefaultUi: true, selectedNodeId: 'user' });
        const text = inspector.textContent ?? '';
        expect(text).toContain('User');
        expect(text).toContain('id');
        expect(text).toContain('email');
    });

    it('reactively updates selectedNode when canvas.selectedNodes changes', async () => {
        const { host, inspector } = mount({ withDefaultUi: true });
        expect(inspector.textContent ?? '').not.toContain('User');

        const canvas = Alpine.$data(host) as any;
        canvas.selectedNodes.add('user');
        await new Promise((resolve) => setTimeout(resolve, 0));

        const selectedNode = (Alpine.$data(inspector) as any).selectedNode;
        expect(selectedNode).toBeTruthy();
        expect(selectedNode.id).toBe('user');
    });

    it('addField helper on inspector scope appends a field to the selected node', () => {
        const { host, inspector } = mount({ selectedNodeId: 'user' });
        const inspectorScope = Alpine.$data(inspector) as any;
        const result = inspectorScope.inspector.addField({ name: 'avatar_url', type: 'text' });
        expect(result).toEqual({ applied: true });

        const canvas = Alpine.$data(host) as any;
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toContain('avatar_url');
    });

    it('renders an empty state message when nothing is selected (default-ui path)', () => {
        const { inspector } = mount({ withDefaultUi: true });
        expect((inspector.textContent ?? '').trim().length).toBeGreaterThan(0);
    });
});
