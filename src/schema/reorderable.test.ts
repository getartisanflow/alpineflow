// @vitest-environment jsdom
// ============================================================================
// x-schema-reorderable — Drag-to-reorder directive
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import registerSchemaAddon from './index';
import { registerSchemaReorderableDirective } from './reorderable';
import { _resetRegistry } from '../core/registry';

// Some jsdom versions don't implement pointer capture methods. Stub them so
// the directive's capture attempt no-ops instead of throwing.
if (typeof (HTMLElement.prototype as any).setPointerCapture !== 'function') {
    (HTMLElement.prototype as any).setPointerCapture = function (): void {};
}
if (typeof (HTMLElement.prototype as any).releasePointerCapture !== 'function') {
    (HTMLElement.prototype as any).releasePointerCapture = function (): void {};
}
if (typeof (HTMLElement.prototype as any).hasPointerCapture !== 'function') {
    (HTMLElement.prototype as any).hasPointerCapture = function (): boolean { return false; };
}

function clearChildren(el: HTMLElement): void {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

interface MountOptions {
    /** Field names to render as rows. */
    fieldNames?: string[];
    /** When true, each row is stubbed with a fake x-flow-row-select click listener. */
    withRowSelect?: boolean;
}

/**
 * Build a .flow-container x-data scope with a node DOM element containing
 * `.flow-schema-row` children. Each row is stamped with `x-schema-reorderable`.
 * Returns the rows plus a reference to the canvas scope.
 *
 * Rather than rely on `x-flow-schema` (which would pull a lot of unrelated
 * reactive machinery), we hand-build the DOM so we can focus on the reorder
 * pointer interaction.
 */
function mount(options: MountOptions = {}) {
    clearChildren(document.body);
    const fieldNames = options.fieldNames ?? ['f0', 'f1', 'f2'];

    const host = document.createElement('div');
    host.classList.add('flow-container');
    host.setAttribute('x-data', 'canvas');

    const nodeEl = document.createElement('div');
    nodeEl.setAttribute('data-flow-node-id', 'user');

    const body = document.createElement('div');
    body.className = 'flow-schema-body';

    const rows: HTMLElement[] = [];
    for (let i = 0; i < fieldNames.length; i++) {
        const row = document.createElement('div');
        row.className = 'flow-schema-row';
        row.dataset.flowSchemaField = fieldNames[i];
        row.setAttribute('x-schema-reorderable', '');
        // Assign a predictable bounding rect via getBoundingClientRect stub.
        const top = i * 40;
        row.getBoundingClientRect = () => ({
            top,
            left: 0,
            right: 200,
            bottom: top + 40,
            width: 200,
            height: 40,
            x: 0,
            y: top,
            toJSON: () => ({}),
        });
        // If requested, wire a minimal row-click handler that calls
        // canvas.selectRow so we can observe whether drag suppresses it.
        if (options.withRowSelect) {
            row.addEventListener('click', () => {
                const canvasEl = row.closest('.flow-container') as HTMLElement | null;
                if (!canvasEl) return;
                const canvas = Alpine.$data(canvasEl) as any;
                canvas?.selectRow?.(`user.${fieldNames[i]}`);
            });
        }
        body.appendChild(row);
        rows.push(row);
    }

    nodeEl.appendChild(body);
    host.appendChild(nodeEl);

    const reorderFields = vi.fn();

    Alpine.data('canvas', () => ({
        _config: { rowsReorderable: true },
        nodes: [
            {
                id: 'user',
                position: { x: 0, y: 0 },
                data: {
                    label: 'User',
                    fields: fieldNames.map((name) => ({ name, type: 'text' })),
                },
            },
        ],
        edges: [],
        selectedNodes: new Set<string>(),
        selectedEdges: new Set<string>(),
        selectedRows: new Set<string>(),
        reorderFields,
        selectRow(rowId: string) {
            this.selectedRows.add(rowId);
        },
        init() {
            this.el = this.$el;
        },
    }));

    document.body.appendChild(host);
    Alpine.initTree(host);

    return {
        host,
        rows,
        reorderFields,
        scope: () => Alpine.$data(host) as any,
    };
}

/**
 * Dispatch a PointerEvent. Falls back to MouseEvent with the same shape if
 * PointerEvent isn't available in the current environment.
 */
function dispatchPointer(
    target: EventTarget,
    type: string,
    init: PointerEventInit,
): void {
    const Ctor = typeof PointerEvent === 'function' ? PointerEvent : (MouseEvent as any);
    const ev = new Ctor(type, { bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(ev);
}

beforeEach(() => {
    _resetRegistry();
    registerSchemaAddon({} as any);
    registerSchemaReorderableDirective(Alpine);
    if (!(Alpine as any).__started) {
        Alpine.start();
        (Alpine as any).__started = true;
    }
});

describe('x-schema-reorderable directive', () => {
    it('adds .flow-schema-reorderable class on init', () => {
        const { rows } = mount();
        for (const row of rows) {
            expect(row.classList.contains('flow-schema-reorderable')).toBe(true);
        }
    });

    it('dragging row 1 below row 2 calls reorderFields with new order', () => {
        const { rows, reorderFields } = mount({ fieldNames: ['f0', 'f1', 'f2'] });
        const draggingRow = rows[1]; // f1
        // Row midlines: f0=20, f1=60, f2=100.
        // Start at y=60 (middle of f1), move past f2's midline (y=100) to y=110.
        dispatchPointer(draggingRow, 'pointerdown', { clientX: 100, clientY: 60, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 110, pointerId: 1 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 110, pointerId: 1 });

        expect(reorderFields).toHaveBeenCalledOnce();
        expect(reorderFields).toHaveBeenCalledWith('user', ['f0', 'f2', 'f1']);
    });

    it('dragging row 2 above row 0 calls reorderFields with prefix-prepend order', () => {
        const { rows, reorderFields } = mount({ fieldNames: ['f0', 'f1', 'f2'] });
        const draggingRow = rows[2]; // f2
        // Start at y=100 (middle of f2), move above f0 midline (y=20) to y=5.
        dispatchPointer(draggingRow, 'pointerdown', { clientX: 100, clientY: 100, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 5, pointerId: 1 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 5, pointerId: 1 });

        expect(reorderFields).toHaveBeenCalledOnce();
        expect(reorderFields).toHaveBeenCalledWith('user', ['f2', 'f0', 'f1']);
    });

    it('dragging with dy below threshold (< 4px) does NOT call reorderFields', () => {
        const { rows, reorderFields } = mount();
        const draggingRow = rows[1];
        dispatchPointer(draggingRow, 'pointerdown', { clientX: 100, clientY: 60, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 62, pointerId: 1 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 62, pointerId: 1 });

        expect(reorderFields).not.toHaveBeenCalled();
    });

    it('clears .flow-schema-row-dragging on pointerup', () => {
        const { rows } = mount();
        const draggingRow = rows[1];
        dispatchPointer(draggingRow, 'pointerdown', { clientX: 100, clientY: 60, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 110, pointerId: 1 });
        expect(draggingRow.classList.contains('flow-schema-row-dragging')).toBe(true);
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 110, pointerId: 1 });
        expect(draggingRow.classList.contains('flow-schema-row-dragging')).toBe(false);
    });

    it('clears .flow-schema-row-drop-target on pointerup', () => {
        const { rows } = mount();
        const draggingRow = rows[1];
        dispatchPointer(draggingRow, 'pointerdown', { clientX: 100, clientY: 60, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 110, pointerId: 1 });
        // Either row 2 has the drop-target class (moving row 1 past row 2).
        expect(rows[2].classList.contains('flow-schema-row-drop-target')).toBe(true);
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 110, pointerId: 1 });
        for (const row of rows) {
            expect(row.classList.contains('flow-schema-row-drop-target')).toBe(false);
        }
    });

    it('does not select the row on a reorder drag (suppresses the click)', () => {
        const { rows, scope } = mount({ withRowSelect: true });
        const draggingRow = rows[1];
        dispatchPointer(draggingRow, 'pointerdown', { clientX: 100, clientY: 60, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 110, pointerId: 1 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 110, pointerId: 1 });
        // Browsers fire a click after pointerup on the same target.
        draggingRow.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        expect(scope().selectedRows.size).toBe(0);
    });

    it('still allows click-to-select on a row click with no drag', () => {
        const { rows, scope } = mount({ withRowSelect: true });
        const targetRow = rows[1];
        // Pointerdown + pointerup at the same Y — no drag threshold crossed.
        dispatchPointer(targetRow, 'pointerdown', { clientX: 100, clientY: 60, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 60, pointerId: 1 });
        // Browsers fire the follow-up click.
        targetRow.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        expect(scope().selectedRows.has('user.f1')).toBe(true);
    });

    it('no-ops when dropping on the same index', () => {
        const { rows, reorderFields } = mount();
        const draggingRow = rows[1];
        // Drag down 10px (past threshold) but not past row 2's midline (y=100).
        dispatchPointer(draggingRow, 'pointerdown', { clientX: 100, clientY: 60, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 70, pointerId: 1 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 70, pointerId: 1 });

        expect(reorderFields).not.toHaveBeenCalled();
    });

    it('reads canvas.reorderFields from closest .flow-container scope', () => {
        const { rows, reorderFields } = mount();
        // Sanity — the scope resolver found the canvas and called its method.
        dispatchPointer(rows[0], 'pointerdown', { clientX: 100, clientY: 20, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 110, pointerId: 1 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 110, pointerId: 1 });

        expect(reorderFields).toHaveBeenCalledOnce();
        const [nodeIdArg, orderArg] = reorderFields.mock.calls[0];
        expect(nodeIdArg).toBe('user');
        expect(Array.isArray(orderArg)).toBe(true);
        expect(orderArg).toHaveLength(3);
    });

    it('single-field row no-ops safely (no siblings to drop against)', () => {
        const { rows, reorderFields } = mount({ fieldNames: ['only'] });
        const draggingRow = rows[0];
        dispatchPointer(draggingRow, 'pointerdown', { clientX: 100, clientY: 20, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 60, pointerId: 1 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 60, pointerId: 1 });

        expect(reorderFields).not.toHaveBeenCalled();
    });

    it('cleanup removes listeners and classes', () => {
        const { host, rows, reorderFields } = mount();
        const row = rows[1];
        // Fire Alpine's cleanup callbacks by destroying the subtree.
        (Alpine as any).destroyTree(host);

        dispatchPointer(row, 'pointerdown', { clientX: 100, clientY: 60, pointerId: 1, button: 0 });
        dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 110, pointerId: 1 });
        dispatchPointer(document, 'pointerup', { clientX: 100, clientY: 110, pointerId: 1 });

        expect(reorderFields).not.toHaveBeenCalled();
        expect(row.classList.contains('flow-schema-reorderable')).toBe(false);
    });
});
