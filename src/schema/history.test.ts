// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attachSchemaHistory } from './history';
import { addField, removeField, renameField } from './field-ops';

function makeCanvas() {
    const el = document.createElement('div');
    el.setAttribute('data-flow-canvas', '');
    document.body.appendChild(el);
    return {
        el,
        _container: el,
        nodes: [
            {
                id: 'user',
                position: { x: 0, y: 0 },
                data: {
                    label: 'User',
                    fields: [
                        { name: 'id', type: 'uuid', key: 'primary' as const },
                    ],
                },
            },
            {
                id: 'team',
                position: { x: 200, y: 0 },
                data: {
                    label: 'Team',
                    fields: [
                        { name: 'id', type: 'uuid', key: 'primary' as const },
                    ],
                },
            },
        ] as any[],
        edges: [] as any[],
    };
}

beforeEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('attachSchemaHistory', () => {
    it('initial state: canUndo=false, canRedo=false', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        expect(h.canUndo).toBe(false);
        expect(h.canRedo).toBe(false);
        h.dispose();
    });

    it('pushes a snapshot on schema:field-added; undo restores pre-add state', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        addField(canvas as any, 'user', { name: 'email', type: 'text' } as any);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'email']);
        expect(h.canUndo).toBe(true);
        expect(h.undo()).toBe(true);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);
        expect(h.canUndo).toBe(false);
        expect(h.canRedo).toBe(true);
        h.dispose();
    });

    it('undo + redo round-trip returns to the post-mutation state', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        addField(canvas as any, 'user', { name: 'email', type: 'text' } as any);
        renameField(canvas as any, 'user', 'email', 'primary_email');
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'primary_email']);

        expect(h.undo()).toBe(true); // undo rename
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'email']);

        expect(h.undo()).toBe(true); // undo add
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);

        expect(h.redo()).toBe(true); // redo add
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'email']);

        expect(h.redo()).toBe(true); // redo rename
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'primary_email']);

        expect(h.canRedo).toBe(false);
        h.dispose();
    });

    it('new mutation clears the redo stack', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        addField(canvas as any, 'user', { name: 'email', type: 'text' } as any);
        h.undo();
        expect(h.canRedo).toBe(true);
        addField(canvas as any, 'user', { name: 'created_at', type: 'timestamp' } as any);
        expect(h.canRedo).toBe(false);
        h.dispose();
    });

    it('batch groups multiple events into one undo step', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        h.batch(() => {
            addField(canvas as any, 'user', { name: 'a', type: 'text' } as any);
            addField(canvas as any, 'user', { name: 'b', type: 'text' } as any);
            addField(canvas as any, 'user', { name: 'c', type: 'text' } as any);
        });
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'a', 'b', 'c']);
        // Single undo should revert all three at once.
        expect(h.undo()).toBe(true);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);
        expect(h.canUndo).toBe(false);
        h.dispose();
    });

    it('nested batches collapse to the outermost', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        h.batch(() => {
            addField(canvas as any, 'user', { name: 'a', type: 'text' } as any);
            h.batch(() => {
                addField(canvas as any, 'user', { name: 'b', type: 'text' } as any);
                h.batch(() => {
                    addField(canvas as any, 'user', { name: 'c', type: 'text' } as any);
                });
            });
        });
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'a', 'b', 'c']);
        // Exactly one undo step should roll back the whole nested batch.
        expect(h.undo()).toBe(true);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);
        expect(h.canUndo).toBe(false);
        h.dispose();
    });

    it('batch rolls back to pre-batch state on throw and rethrows', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        const err = new Error('boom');
        expect(() =>
            h.batch(() => {
                addField(canvas as any, 'user', { name: 'email', type: 'text' } as any);
                addField(canvas as any, 'user', { name: 'age', type: 'number' } as any);
                throw err;
            }),
        ).toThrow(err);
        // Pre-batch state restored.
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);
        // No new undo step recorded for the failed batch.
        expect(h.canUndo).toBe(false);
        h.dispose();
    });

    it('limit evicts oldest snapshots; cannot undo past the floor', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas, { limit: 3 });
        for (let i = 0; i < 5; i++) {
            addField(canvas as any, 'user', { name: `f${i}`, type: 'text' } as any);
        }
        // limit=3 means at most 3 entries on the undo stack including the floor.
        let undoCount = 0;
        while (h.undo()) {
            undoCount++;
            if (undoCount > 10) {
                break; // safety
            }
        }
        expect(undoCount).toBeLessThanOrEqual(3);
        expect(undoCount).toBeGreaterThan(0);
        h.dispose();
    });

    it('clear() resets stacks and pushes a fresh floor', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        addField(canvas as any, 'user', { name: 'email', type: 'text' } as any);
        expect(h.canUndo).toBe(true);
        h.undo();
        expect(h.canRedo).toBe(true);
        h.clear();
        expect(h.canUndo).toBe(false);
        expect(h.canRedo).toBe(false);
        // After clear, new mutations should still record snapshots.
        addField(canvas as any, 'user', { name: 'first_name', type: 'text' } as any);
        expect(h.canUndo).toBe(true);
        h.dispose();
    });

    it('dispose() unbinds listeners — subsequent events do not push', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        h.dispose();
        addField(canvas as any, 'user', { name: 'email', type: 'text' } as any);
        // Disposed stacks are empty; undo/redo return false.
        expect(h.canUndo).toBe(false);
        expect(h.canRedo).toBe(false);
        expect(h.undo()).toBe(false);
        expect(h.redo()).toBe(false);
    });

    it('does not push during apply path (no feedback loop on undo)', () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);
        // Spy the event target's dispatchEvent to observe any events fired
        // during undo — schemaFromJSON uses splice and does not dispatch
        // schema:* events itself, but this guards against future regressions
        // if that changes.
        addField(canvas as any, 'user', { name: 'a', type: 'text' } as any);
        addField(canvas as any, 'user', { name: 'b', type: 'text' } as any);
        expect(h.canUndo).toBe(true);
        // Two undos should each go one step backward — if suspend were broken
        // and undo re-captured a snapshot, the second undo would become a
        // no-op or loop.
        expect(h.undo()).toBe(true);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'a']);
        expect(h.undo()).toBe(true);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);
        expect(h.canUndo).toBe(false);
        h.dispose();
    });

    it('returns a functional no-op handle when canvas has no event target', () => {
        const canvas = { nodes: [], edges: [] } as any;
        const h = attachSchemaHistory(canvas);
        expect(h.canUndo).toBe(false);
        expect(h.canRedo).toBe(false);
        expect(h.undo()).toBe(false);
        expect(h.redo()).toBe(false);
        // batch still invokes fn() and returns its result.
        const result = h.batch(() => 42);
        expect(result).toBe(42);
        // clear + dispose should not throw.
        expect(() => h.clear()).not.toThrow();
        expect(() => h.dispose()).not.toThrow();
    });

    it('a rename that cascades edges pushes exactly one snapshot (dedup)', async () => {
        const canvas = makeCanvas();
        // Edge whose source handle references user.id, so the rename cascades.
        canvas.edges.push({
            id: 'e1',
            source: 'user',
            sourceHandle: 'id',
            target: 'team',
            targetHandle: 'name',
        } as any);
        const h = attachSchemaHistory(canvas);

        renameField(canvas as any, 'user', 'id', 'uuid');
        await Promise.resolve(); // flush any deferred work

        // renameField dispatches schema:field-renamed AND schema:edges-cascaded
        // after all mutations complete, producing two byte-identical snapshots.
        // Dedup collapses them into a single undoable step above the floor.
        expect(h.canUndo).toBe(true);
        expect(h.undo()).toBe(true);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);
        expect(h.canUndo).toBe(false); // one snapshot, not two
        h.dispose();
    });

    it('a batch leaves no duplicate deferred snapshot', async () => {
        const canvas = makeCanvas();
        const h = attachSchemaHistory(canvas);

        h.batch(() => {
            addField(canvas as any, 'user', { name: 'a', type: 'text' } as any);
            addField(canvas as any, 'user', { name: 'b', type: 'text' } as any);
        });
        await Promise.resolve(); // flush any deferred microtask

        // Exactly one undo step for the whole batch — no trailing duplicate.
        expect(h.undo()).toBe(true);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);
        expect(h.canUndo).toBe(false);
        h.dispose();
    });

    it('captures removals and restores fields with their original order on undo', () => {
        const canvas = makeCanvas();
        // Seed a second field first (pre-attach) so removal + undo restores it.
        canvas.nodes[0].data.fields.push({ name: 'email', type: 'text' } as any);
        const h = attachSchemaHistory(canvas);
        removeField(canvas as any, 'user', 'email');
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id']);
        expect(h.undo()).toBe(true);
        expect(canvas.nodes[0].data.fields.map((f: any) => f.name)).toEqual(['id', 'email']);
        h.dispose();
    });
});
