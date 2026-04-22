// @vitest-environment jsdom
// ============================================================================
// x-schema-edge-inspector — Selected-edge scope exposure + default UI
// ============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import Alpine from 'alpinejs';
import registerSchemaAddon from '../index';
import { registerEdgeInspectorDirective } from './edge-inspector';
import { _resetRegistry } from '../../core/registry';

function clearChildren(el: HTMLElement): void {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

interface MountOptions {
    withDefaultUi?: boolean;
    children?: Array<Node>;
    selectedEdgeId?: string | null;
}

function mount(options: MountOptions = {}) {
    clearChildren(document.body);

    const host = document.createElement('div');
    host.classList.add('flow-container');
    host.setAttribute('x-data', 'canvas');

    const inspector = document.createElement('aside');
    inspector.setAttribute('x-schema-edge-inspector', '');
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

    const selectedEdgeId = options.selectedEdgeId ?? null;

    Alpine.data('canvas', () => ({
        nodes: [
            { id: 'user', position: { x: 0, y: 0 }, data: { label: 'User', fields: [] } },
            { id: 'team', position: { x: 200, y: 0 }, data: { label: 'Team', fields: [] } },
        ] as any[],
        edges: [
            { id: 'e1', source: 'user', target: 'team', label: 'belongs to' },
            { id: 'e2', source: 'team', target: 'user' },
        ] as any[],
        selectedNodes: new Set<string>(),
        selectedEdges: new Set<string>(selectedEdgeId ? [selectedEdgeId] : []),
        selectedRows: new Set<string>(),
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
    registerEdgeInspectorDirective(Alpine);
    if (!(Alpine as any).__started) {
        Alpine.start();
        (Alpine as any).__started = true;
    }
});

describe('x-schema-edge-inspector directive', () => {
    it('registers without throwing', () => {
        expect(() => mount()).not.toThrow();
    });

    it('leaves host children untouched when no default-ui template is present', () => {
        const custom = makeEl('p', { 'data-custom': '' });
        custom.textContent = 'my edge ui';
        const { inspector } = mount({ children: [custom] });
        expect(inspector.querySelector('[data-custom]')!.textContent).toBe('my edge ui');
    });

    it('exposes inspector scope with the selected edge', () => {
        const { inspector } = mount({ selectedEdgeId: 'e1' });
        const scope = Alpine.$data(inspector) as any;
        expect(scope.selectedEdge).toBeTruthy();
        expect(scope.selectedEdge.id).toBe('e1');
        expect(scope.selectedEdge.label).toBe('belongs to');
    });

    it('stamps minimal default UI with label + delete button when an edge is selected', () => {
        const { inspector } = mount({ withDefaultUi: true, selectedEdgeId: 'e1' });
        const text = inspector.textContent ?? '';
        // The default UI includes a label input (or label display) and a delete control
        expect(text.toLowerCase()).toContain('label');
        expect(text.toLowerCase()).toMatch(/delete|remove/);
    });

    it('reactively updates selectedEdge when canvas.selectedEdges changes', async () => {
        const { host, inspector } = mount({ withDefaultUi: true });
        const canvas = Alpine.$data(host) as any;
        canvas.selectedEdges.add('e2');
        await new Promise((resolve) => setTimeout(resolve, 0));
        const scope = Alpine.$data(inspector) as any;
        expect(scope.selectedEdge).toBeTruthy();
        expect(scope.selectedEdge.id).toBe('e2');
    });

    it('renders an empty state message when no edge is selected (default-ui path)', () => {
        const { inspector } = mount({ withDefaultUi: true });
        expect((inspector.textContent ?? '').trim().length).toBeGreaterThan(0);
    });

    it('preserves focus and selection on the label input across a reactive re-stamp', async () => {
        const { host, inspector } = mount({ withDefaultUi: true, selectedEdgeId: 'e1' });

        const labelInput = inspector.querySelector('[data-field="label"]') as HTMLInputElement;
        expect(labelInput).not.toBeNull();
        // 'belongs to' — 10 chars; caret in the middle so selection is non-trivial.
        expect(labelInput.value).toBe('belongs to');

        labelInput.focus();
        labelInput.setSelectionRange(4, 7);
        expect(document.activeElement).toBe(labelInput);

        // Trigger a reactive re-stamp on the SAME edge by mutating a property
        // the stamp reads. The new input is rebuilt with the updated value, so
        // we can still assert selection restoration across the re-stamp.
        const canvas = Alpine.$data(host) as any;
        const edge = canvas.edges.find((e: any) => e.id === 'e1');
        edge.label = 'belongs to (edited)';
        await new Promise((resolve) => setTimeout(resolve, 0));

        const newLabelInput = inspector.querySelector('[data-field="label"]') as HTMLInputElement;
        expect(newLabelInput).not.toBe(labelInput);
        expect(newLabelInput.value).toBe('belongs to (edited)');
        expect(document.activeElement).toBe(newLabelInput);
        expect(newLabelInput.selectionStart).toBe(4);
        expect(newLabelInput.selectionEnd).toBe(7);
    });
});
