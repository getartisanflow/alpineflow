// ============================================================================
// alpineflow/schema — attachSchemaHistory()
//
// Opt-in undo/redo scaffolding. Listens for `schema:*` DOM events fired by
// field-ops helpers, snapshots the canvas via `schemaToJSON`, and restores via
// `schemaFromJSON` on undo/redo. Bounded stack with `limit` eviction and
// transactional `batch(fn)` semantics.
//
// Consumers must opt in — `registerSchemaAddon` does NOT auto-attach history.
// ============================================================================

import type { SchemaGraphJSON, SchemaHistoryHandle, SchemaHistoryOptions } from './types';
import { schemaFromJSON, schemaToJSON } from './serialization';

const TRACKED_EVENTS = [
    'schema:field-added',
    'schema:field-renamed',
    'schema:field-removed',
    'schema:edges-cascaded',
] as const;

/**
 * Attach a bounded undo/redo stack to a canvas. Returns a handle with
 * `undo()`, `redo()`, `batch(fn)`, `clear()`, and `dispose()`.
 *
 * Snapshots are pushed on each `schema:field-added`, `schema:field-renamed`,
 * `schema:field-removed`, and `schema:edges-cascaded` event. The apply path
 * (undo/redo/batch rollback) suspends snapshot pushes to avoid feedback loops.
 */
export function attachSchemaHistory(canvas: any, opts: SchemaHistoryOptions = {}): SchemaHistoryHandle {
    const limit = Math.max(1, opts.limit ?? 50);
    const undoStack: SchemaGraphJSON[] = [];
    const redoStack: SchemaGraphJSON[] = [];
    let suspendDepth = 0;
    let batchDepth = 0;
    let batchEntrySnapshot: SchemaGraphJSON | null = null;
    let disposed = false;

    const target: EventTarget | null = canvas?.el ?? canvas?._container ?? null;
    if (!target || typeof (target as any).addEventListener !== 'function') {
        return makeNoopHandle();
    }

    const evictOldest = (): void => {
        // Always keep at least 1 entry (the floor) so we never undo past the
        // initial snapshot.
        while (undoStack.length > limit && undoStack.length > 1) {
            undoStack.shift();
        }
    };

    const pushSnapshot = (): void => {
        if (disposed) {
            return;
        }
        if (suspendDepth > 0) {
            return;
        }
        if (batchDepth > 0) {
            // Inside a batch — individual events do not push. A single snapshot
            // is pushed when the outermost batch exits.
            return;
        }
        const snap = schemaToJSON(canvas);
        // Dedup identical states: a cascading op (renameField/removeField)
        // dispatches schema:field-* AND schema:edges-cascaded *after* all
        // mutations complete, yielding two byte-identical snapshots. Coalesce
        // them into a single undoable step by skipping a snapshot equal to the
        // current stack top, so the first undo is never a no-op.
        const top = undoStack[undoStack.length - 1];
        if (top !== undefined && JSON.stringify(top) === JSON.stringify(snap)) {
            return;
        }
        undoStack.push(snap);
        evictOldest();
        redoStack.length = 0;
    };

    // Initial floor snapshot — captures pre-mutation state so the first undo
    // after a field-add reverts cleanly.
    undoStack.push(schemaToJSON(canvas));

    const onEvent = (): void => {
        pushSnapshot();
    };
    for (const name of TRACKED_EVENTS) {
        target.addEventListener(name, onEvent);
    }

    const applySnapshot = (snap: SchemaGraphJSON): void => {
        // Suspend snapshot capture while we mutate via schemaFromJSON.
        suspendDepth++;
        try {
            schemaFromJSON(canvas, snap);
        } finally {
            suspendDepth--;
        }
    };

    const handle: SchemaHistoryHandle = {
        get canUndo(): boolean {
            // The floor snapshot always stays; only report true when there is
            // at least one mutation snapshot above it.
            return undoStack.length > 1;
        },
        get canRedo(): boolean {
            return redoStack.length > 0;
        },
        undo(): boolean {
            if (disposed) {
                return false;
            }
            if (undoStack.length <= 1) {
                return false;
            }
            const current = undoStack.pop() as SchemaGraphJSON;
            redoStack.push(current);
            const prev = undoStack[undoStack.length - 1];
            applySnapshot(prev);
            return true;
        },
        redo(): boolean {
            if (disposed) {
                return false;
            }
            if (redoStack.length === 0) {
                return false;
            }
            const snap = redoStack.pop() as SchemaGraphJSON;
            undoStack.push(snap);
            applySnapshot(snap);
            return true;
        },
        clear(): void {
            undoStack.length = 0;
            redoStack.length = 0;
            if (!disposed) {
                undoStack.push(schemaToJSON(canvas));
            }
        },
        batch<T>(fn: () => T): T {
            if (disposed) {
                return fn();
            }
            // Outermost batch captures the pre-batch state for rollback on
            // throw. Nested batches share the outer batch's entry snapshot.
            if (batchDepth === 0) {
                batchEntrySnapshot = schemaToJSON(canvas);
            }
            batchDepth++;
            try {
                const result = fn();
                batchDepth--;
                if (batchDepth === 0) {
                    // Outermost batch exiting — push one snapshot capturing
                    // the aggregate result of all mutations inside.
                    batchEntrySnapshot = null;
                    if (suspendDepth === 0 && !disposed) {
                        undoStack.push(schemaToJSON(canvas));
                        evictOldest();
                        redoStack.length = 0;
                    }
                }
                return result;
            } catch (err) {
                batchDepth--;
                if (batchDepth === 0) {
                    // Roll back to pre-batch state. suspendDepth increment in
                    // applySnapshot prevents the restoration from triggering
                    // its own snapshot via any events fired by schemaFromJSON.
                    const entry = batchEntrySnapshot;
                    batchEntrySnapshot = null;
                    if (entry && !disposed) {
                        applySnapshot(entry);
                    }
                }
                throw err;
            }
        },
        dispose(): void {
            if (disposed) {
                return;
            }
            disposed = true;
            for (const name of TRACKED_EVENTS) {
                target.removeEventListener(name, onEvent);
            }
            undoStack.length = 0;
            redoStack.length = 0;
            batchEntrySnapshot = null;
        },
    };

    return handle;
}

function makeNoopHandle(): SchemaHistoryHandle {
    return {
        get canUndo(): boolean {
            return false;
        },
        get canRedo(): boolean {
            return false;
        },
        undo: (): boolean => false,
        redo: (): boolean => false,
        clear: (): void => {},
        batch<T>(fn: () => T): T {
            return fn();
        },
        dispose: (): void => {},
    };
}
