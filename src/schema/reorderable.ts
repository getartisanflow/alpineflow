// ============================================================================
// x-schema-reorderable Directive
//
// Makes a `.flow-schema-row` draggable within its parent `.flow-schema-body`
// to reorder fields. On drop, commits via `canvas.reorderFields(nodeId,
// newOrder)`.
//
// Opt-in: auto-stamped on rows by `x-flow-schema` when
// `canvas.rowsReorderable: true`, or manually stamped by consumers writing
// custom node templates.
//
// Conflict with row-select: both directives listen for pointerdown-derived
// events. This directive only COMMITS a reorder when the cursor moves more
// than `DRAG_THRESHOLD_PX` vertically; below that it behaves as a click and
// row-select wins. On a successful drag, the following click event is
// swallowed (capture-phase listener) so the row isn't selected.
// ============================================================================

import type { Alpine } from 'alpinejs';

/** Pixels of vertical movement before we consider the interaction a drag. */
const DRAG_THRESHOLD_PX = 4;

export function registerSchemaReorderableDirective(Alpine: Alpine): void {
    Alpine.directive(
        'schema-reorderable',
        (el, _spec, { cleanup }) => {
            const row = el as HTMLElement;
            row.classList.add('flow-schema-reorderable');
            // Prevent browsers from stealing the pointer stream for scroll/zoom
            // gestures during a drag.
            row.style.touchAction = 'none';

            // Live drag state — kept in closure so listeners share state.
            let dragging = false;
            let dragged = false;
            let startY = 0;
            let startIndex = 0;
            let currentDropIndex = 0;
            let activePointerId: number | null = null;

            /** All sibling rows that participate in the reorder (includes self). */
            const siblingRows = (): HTMLElement[] => {
                const parent = row.parentElement;
                if (!parent) return [];
                return Array.from(
                    parent.querySelectorAll(':scope > .flow-schema-row'),
                ) as HTMLElement[];
            };

            /** Remove all drop-target classes from sibling rows. */
            const clearDropTargets = (): void => {
                for (const r of siblingRows()) {
                    r.classList.remove('flow-schema-row-drop-target');
                }
            };

            /**
             * Determine the drop-target index given the current pointer Y.
             *
             * Semantics: the returned index is an insertion index in the
             * "already-removed" array — i.e. after splicing the dragging row
             * out of the field list, `newOrder.splice(dropIndex, 0, moved)`
             * yields the final order. It equals the number of OTHER rows
             * whose midline sits above the cursor.
             *
             * This produces intuitive no-op behaviour: a small nudge within
             * the dragging row's original bounds leaves dropIndex equal to
             * startIndex.
             */
            const computeDropIndex = (clientY: number): number => {
                const parent = row.parentElement;
                if (!parent) return startIndex;
                const others = Array.from(
                    parent.querySelectorAll(':scope > .flow-schema-row'),
                ).filter((r) => r !== row) as HTMLElement[];
                if (others.length === 0) return startIndex;

                let aboveCount = 0;
                for (const sib of others) {
                    const rect = sib.getBoundingClientRect();
                    const mid = rect.top + rect.height / 2;
                    if (mid < clientY) aboveCount++;
                }
                return aboveCount;
            };

            const updateDropTargetClass = (dropIndex: number): void => {
                clearDropTargets();
                const all = siblingRows();
                // Visual hint: highlight the neighbour the dragging row
                // would swap with at the current drop slot. We map the
                // remove-then-insert index back to the nearest sibling.
                let targetIdx = dropIndex;
                if (dropIndex >= startIndex) targetIdx = dropIndex + 1;
                const target = all[targetIdx] ?? all[dropIndex];
                if (target && target !== row) {
                    target.classList.add('flow-schema-row-drop-target');
                }
            };

            const resetRow = (): void => {
                row.style.transform = '';
                row.classList.remove('flow-schema-row-dragging');
                clearDropTargets();
            };

            const onPointerDown = (e: PointerEvent): void => {
                if (dragging) return;
                // Only primary button / pen / touch.
                if (e.button !== undefined && e.button !== 0) return;

                dragging = true;
                dragged = false;
                startY = e.clientY;
                activePointerId = e.pointerId ?? null;

                const all = siblingRows();
                startIndex = all.indexOf(row);
                currentDropIndex = startIndex;

                row.classList.add('flow-schema-row-dragging');

                // Try to capture the pointer so subsequent pointermove/up fire
                // on the row even if the cursor leaves it. In jsdom this may
                // not be supported — fall back to document-level listeners in
                // that case.
                try {
                    if (activePointerId !== null && typeof row.setPointerCapture === 'function') {
                        row.setPointerCapture(activePointerId);
                    }
                } catch {
                    /* capture not supported — rely on document listeners */
                }

                document.addEventListener('pointermove', onPointerMove);
                document.addEventListener('pointerup', onPointerUp);
                document.addEventListener('pointercancel', onPointerUp);
            };

            const onPointerMove = (e: PointerEvent): void => {
                if (!dragging) return;
                const deltaY = e.clientY - startY;

                if (!dragged && Math.abs(deltaY) > DRAG_THRESHOLD_PX) {
                    dragged = true;
                }

                row.style.transform = `translateY(${deltaY}px)`;

                if (dragged) {
                    currentDropIndex = computeDropIndex(e.clientY);
                    updateDropTargetClass(currentDropIndex);
                }
            };

            const onPointerUp = (e: PointerEvent): void => {
                if (!dragging) return;
                const wasDragged = dragged;
                const dropIndex = currentDropIndex;
                const startIdx = startIndex;

                // Release pointer capture if we took it.
                try {
                    if (
                        activePointerId !== null
                        && typeof row.releasePointerCapture === 'function'
                        && typeof row.hasPointerCapture === 'function'
                        && row.hasPointerCapture(activePointerId)
                    ) {
                        row.releasePointerCapture(activePointerId);
                    }
                } catch {
                    /* ignore */
                }

                document.removeEventListener('pointermove', onPointerMove);
                document.removeEventListener('pointerup', onPointerUp);
                document.removeEventListener('pointercancel', onPointerUp);

                dragging = false;
                activePointerId = null;
                resetRow();

                if (!wasDragged) {
                    // A click — let row-select handle it.
                    return;
                }

                // Suppress the click that browsers fire after pointerup. We
                // add a capture-phase listener that swallows the next click
                // event on this row (or its descendants). Self-removes after
                // one tick in case no click arrives.
                const suppressClick = (ev: Event): void => {
                    ev.stopImmediatePropagation();
                    ev.stopPropagation();
                    ev.preventDefault();
                };
                row.addEventListener('click', suppressClick, { capture: true, once: true });
                // Belt-and-suspenders cleanup in case no click fires.
                setTimeout(() => {
                    row.removeEventListener('click', suppressClick, { capture: true } as any);
                }, 0);

                // Resolve nodeId + canvas from the DOM tree.
                const nodeEl = row.closest('[data-flow-node-id]') as HTMLElement | null;
                const nodeId = nodeEl?.getAttribute('data-flow-node-id') ?? null;
                if (!nodeId) return;

                const canvasEl = row.closest('.flow-container') as HTMLElement | null;
                if (!canvasEl) return;

                let canvas: any;
                try {
                    canvas = Alpine.$data(canvasEl);
                } catch {
                    return;
                }
                if (!canvas || typeof canvas.reorderFields !== 'function') return;

                // Read the current field order off the canvas node.
                const node = (canvas.nodes ?? []).find((n: any) => n?.id === nodeId);
                const fields: any[] = node?.data?.fields ?? [];
                if (!Array.isArray(fields) || fields.length < 2) return;

                const names = fields.map((f: any) => f.name);
                if (startIdx < 0 || startIdx >= names.length) return;

                const [moved] = names.splice(startIdx, 1);
                // Clamp dropIndex into the post-removal array's valid range.
                const target = Math.max(0, Math.min(dropIndex, names.length));
                names.splice(target, 0, moved);

                // If the order is unchanged, skip the commit — lets
                // canvas.reorderFields stay a pure "real change" event.
                const unchanged = names.every(
                    (name, i) => fields[i]?.name === name,
                );
                if (unchanged) return;

                canvas.reorderFields(nodeId, names);

                // `e` (pointerup) isn't a click; we've already installed a
                // capture-phase one-shot click listener above to swallow the
                // synthetic click that browsers fire after pointerup.
                void e;
            };

            row.addEventListener('pointerdown', onPointerDown);

            cleanup(() => {
                try {
                    row.removeEventListener('pointerdown', onPointerDown);
                    if (typeof document !== 'undefined') {
                        document.removeEventListener('pointermove', onPointerMove);
                        document.removeEventListener('pointerup', onPointerUp);
                        document.removeEventListener('pointercancel', onPointerUp);
                    }
                    row.classList.remove('flow-schema-reorderable');
                    row.classList.remove('flow-schema-row-dragging');
                    clearDropTargets();
                    row.style.transform = '';
                    row.style.touchAction = '';
                } catch {
                    /* environment may be torn down (jsdom) */
                }
            });
        },
    );
}
