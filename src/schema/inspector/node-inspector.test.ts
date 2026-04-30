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
    /** Seed canvas._config.fieldTypeRegistry on the mounted canvas scope. */
    fieldTypeRegistry?: string[];
}

/**
 * Build an Alpine root hosting a reactive flowCanvas-shaped object together
 * with the inspector element. Returns the inspector element and a live
 * reference to the reactive canvas scope via Alpine.$data.
 */
function mount(options: MountOptions = {}) {
    clearChildren(document.body);

    const host = document.createElement('div');
    host.classList.add('flow-container');
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
    const fieldTypeRegistry = options.fieldTypeRegistry;

    Alpine.data('canvas', () => ({
        _config: fieldTypeRegistry !== undefined ? { fieldTypeRegistry } : {},
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

    it('renders free-text type input when fieldTypeRegistry is unset', () => {
        const { inspector } = mount({ withDefaultUi: true, selectedNodeId: 'user' });
        const typeControl = inspector.querySelector(
            '[data-schema-inspector-add-field] [data-field="type"]',
        );
        expect(typeControl).not.toBeNull();
        expect(typeControl!.tagName).toBe('INPUT');
        expect((typeControl as HTMLInputElement).type).toBe('text');
    });

    it('renders a <select> of registry values when fieldTypeRegistry is set', () => {
        const { inspector } = mount({
            withDefaultUi: true,
            selectedNodeId: 'user',
            fieldTypeRegistry: ['text', 'uuid', 'int4'],
        });
        const typeControl = inspector.querySelector(
            '[data-schema-inspector-add-field] [data-field="type"]',
        );
        expect(typeControl).not.toBeNull();
        expect(typeControl!.tagName).toBe('SELECT');

        const options = (typeControl as HTMLSelectElement).querySelectorAll('option');
        expect(options.length).toBe(3);
        expect(options[0].value).toBe('text');
        expect(options[1].value).toBe('uuid');
        expect(options[2].value).toBe('int4');

        expect((typeControl as HTMLSelectElement).value).toBe('text');
    });

    it('renders free-text input when fieldTypeRegistry is an empty array', () => {
        const { inspector } = mount({
            withDefaultUi: true,
            selectedNodeId: 'user',
            fieldTypeRegistry: [],
        });
        const typeControl = inspector.querySelector(
            '[data-schema-inspector-add-field] [data-field="type"]',
        );
        expect(typeControl).not.toBeNull();
        expect(typeControl!.tagName).toBe('INPUT');
    });

    it('preserves focus on the add-field name input across a reactive re-stamp', async () => {
        const { host, inspector } = mount({ withDefaultUi: true, selectedNodeId: 'user' });

        const nameInput = inspector.querySelector(
            '[data-schema-inspector-add-field] [data-field="name"]',
        ) as HTMLInputElement;
        expect(nameInput).not.toBeNull();

        nameInput.focus();
        expect(document.activeElement).toBe(nameInput);

        // Trigger a reactive re-stamp: mutate the selected node's label. The
        // stamp reads node.data.label, so the effect re-runs and the whole
        // managed root gets rebuilt.
        const canvas = Alpine.$data(host) as any;
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        user.data.label = 'User (edited)';
        await new Promise((resolve) => setTimeout(resolve, 0));

        const newNameInput = inspector.querySelector(
            '[data-schema-inspector-add-field] [data-field="name"]',
        ) as HTMLInputElement;
        // Different DOM node than before (re-stamp really did rebuild).
        expect(newNameInput).not.toBe(nameInput);
        // But focus is restored onto the fresh input.
        expect(document.activeElement).toBe(newNameInput);
    });

    it('uses registry value on Add field submission', () => {
        const { host, inspector } = mount({
            withDefaultUi: true,
            selectedNodeId: 'user',
            fieldTypeRegistry: ['text', 'uuid'],
        });
        const form = inspector.querySelector(
            '[data-schema-inspector-add-field]',
        ) as HTMLFormElement;
        const nameInput = form.querySelector(
            '[data-field="name"]',
        ) as HTMLInputElement;
        const typeSelect = form.querySelector(
            '[data-field="type"]',
        ) as HTMLSelectElement;

        nameInput.value = 'org_id';
        typeSelect.value = 'uuid';
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

        const canvas = Alpine.$data(host) as any;
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        const added = user.data.fields.find((f: any) => f.name === 'org_id');
        expect(added).toBeTruthy();
        expect(added.type).toBe('uuid');
    });
});
