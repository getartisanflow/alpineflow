// @vitest-environment jsdom
// ============================================================================
// x-schema-row-inspector — Selected-row scope exposure + default UI
// ============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import Alpine from 'alpinejs';
import registerSchemaAddon from '../index';
import { registerRowInspectorDirective } from './row-inspector';
import { _resetRegistry } from '../../core/registry';

function clearChildren(el: HTMLElement): void {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

interface MountOptions {
    withDefaultUi?: boolean;
    children?: Array<Node>;
    /** Seed canvas.selectedRows with this id (format: "<nodeId>.<fieldName>"). */
    selectedRowId?: string | null;
}

function mount(options: MountOptions = {}) {
    clearChildren(document.body);

    const host = document.createElement('div');
    host.classList.add('flow-container');
    host.setAttribute('x-data', 'canvas');

    const inspector = document.createElement('aside');
    inspector.setAttribute('x-schema-row-inspector', '');
    if (options.withDefaultUi) {
        const tpl = document.createElement('template');
        tpl.setAttribute('x-schema-default-ui', '');
        inspector.appendChild(tpl);
    }
    if (options.children) {
        for (const child of options.children) {
            inspector.appendChild(child);
        }
    }
    host.appendChild(inspector);

    const selectedRowId = options.selectedRowId ?? null;

    Alpine.data('canvas', () => ({
        nodes: [
            {
                id: 'user',
                position: { x: 0, y: 0 },
                data: {
                    label: 'User',
                    fields: [
                        { name: 'id', type: 'uuid' },
                        { name: 'email', type: 'text', required: true },
                    ],
                },
            },
        ] as any[],
        edges: [] as any[],
        selectedNodes: new Set<string>(),
        selectedEdges: new Set<string>(),
        selectedRows: new Set<string>(selectedRowId ? [selectedRowId] : []),
        init() {
            this.el = this.$el;
            const addon = (globalThis as any).__alpineflow_registry__?.get('schema');
            addon?.setup(this);
        },
    }));

    document.body.appendChild(host);
    Alpine.initTree(host);
    return { host, inspector };
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
    registerRowInspectorDirective(Alpine);
    if (!(Alpine as any).__started) {
        Alpine.start();
        (Alpine as any).__started = true;
    }
});

describe('x-schema-row-inspector directive', () => {
    it('registers without throwing', () => {
        expect(() => mount()).not.toThrow();
    });

    it('leaves host children untouched when no default-ui template is present', () => {
        const custom = makeEl('p', { 'data-custom': '' });
        custom.textContent = 'my row ui';
        const { inspector } = mount({ children: [custom] });
        expect(inspector.querySelector('[data-custom]')!.textContent).toBe('my row ui');
    });

    it('exposes inspector scope with parsed selectedRow {nodeId, fieldName}', () => {
        const { inspector } = mount({ selectedRowId: 'user.email' });
        const scope = Alpine.$data(inspector) as any;
        expect(scope.selectedRow).toEqual({ nodeId: 'user', fieldName: 'email' });
    });

    it('stamps minimal default UI with name/type/required when a row is selected', () => {
        const { inspector } = mount({ withDefaultUi: true, selectedRowId: 'user.email' });
        const nameInput = inspector.querySelector('[data-field="name"]') as HTMLInputElement;
        const typeInput = inspector.querySelector('[data-field="type"]') as HTMLInputElement;
        const requiredInput = inspector.querySelector('[data-field="required"]') as HTMLInputElement;
        expect(nameInput?.value).toBe('email');
        expect(typeInput?.value).toBe('text');
        expect(requiredInput?.checked).toBe(true);
        expect((inspector.textContent ?? '').toLowerCase()).toContain('required');
    });

    it('reactively updates selectedRow when canvas.selectedRows changes', async () => {
        const { host, inspector } = mount({ withDefaultUi: true });
        const canvas = Alpine.$data(host) as any;
        canvas.selectedRows.add('user.id');
        await new Promise((resolve) => setTimeout(resolve, 0));
        const scope = Alpine.$data(inspector) as any;
        expect(scope.selectedRow).toEqual({ nodeId: 'user', fieldName: 'id' });
    });

    it('removeField helper removes the selected row\'s field via the canvas helper', () => {
        const { host, inspector } = mount({ selectedRowId: 'user.email' });
        const scope = Alpine.$data(inspector) as any;
        const result = scope.inspector.removeField();
        expect(result.applied).toBe(true);

        const canvas = Alpine.$data(host) as any;
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        expect(user.data.fields.map((f: any) => f.name)).toEqual(['id']);
    });

    it('renders an empty state message when no row is selected (default-ui path)', () => {
        const { inspector } = mount({ withDefaultUi: true });
        expect((inspector.textContent ?? '').trim().length).toBeGreaterThan(0);
    });

    it('preserves focus and selection on the rename input across a reactive re-stamp', async () => {
        const { host, inspector } = mount({ withDefaultUi: true, selectedRowId: 'user.email' });

        const nameInput = inspector.querySelector('[data-field="name"]') as HTMLInputElement;
        expect(nameInput).not.toBeNull();

        nameInput.focus();
        nameInput.setSelectionRange(2, 5);
        expect(document.activeElement).toBe(nameInput);

        // Trigger a reactive re-stamp by mutating a field property read during stamping.
        const canvas = Alpine.$data(host) as any;
        const user = canvas.nodes.find((n: any) => n.id === 'user');
        const email = user.data.fields.find((f: any) => f.name === 'email');
        email.type = 'citext';
        await new Promise((resolve) => setTimeout(resolve, 0));

        const newNameInput = inspector.querySelector('[data-field="name"]') as HTMLInputElement;
        expect(newNameInput).not.toBe(nameInput);
        expect(document.activeElement).toBe(newNameInput);
        expect(newNameInput.selectionStart).toBe(2);
        expect(newNameInput.selectionEnd).toBe(5);
    });
});
