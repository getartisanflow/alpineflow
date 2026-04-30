// ============================================================================
// x-schema-keyboard-nav Directive
//
// Makes a `.flow-schema-row` focusable and keyboard-navigable:
//   - Arrow Up / Down  : move focus to previous / next row within the same node
//   - Tab / Shift+Tab  : move focus to the first / last row of the next /
//                        previous node. When at the outermost row with no
//                        neighbor, default tab behaviour is preserved so focus
//                        can exit the canvas naturally.
//   - Enter / Space    : trigger row selection (reuses the row's own click
//                        handler so `x-flow-row-select` remains the single
//                        authoritative selection path).
//   - Escape           : blur the focused row.
//
// The directive also stamps `tabindex="0"`, `role="row"`, and a reactive
// `aria-label` so screen readers can announce the field name and type.
//
// Opt-in: auto-stamped on rows by `x-flow-schema` when
// `canvas._config.keyboardConnect: true`. The keyboard-connect flag is reused
// intentionally — consumers that opt into keyboard-driven connect almost
// always also want keyboard-driven field focus, so bundling them keeps the
// opt-in surface small.
// ============================================================================

import type { Alpine } from 'alpinejs';

/**
 * Sibling rows within the same `.flow-schema-body` — used for ArrowUp /
 * ArrowDown. Uses `:scope > .flow-schema-row` so nested schema tables (a
 * future-proofing concern) do not leak their rows into the iteration.
 */
function siblingRowsOf(row: HTMLElement): HTMLElement[] {
    const body = row.parentElement;
    if (!body) return [];
    return Array.from(
        body.querySelectorAll(':scope > .flow-schema-row'),
    ) as HTMLElement[];
}

/**
 * Move focus to the row `direction` slots away (±1) within the same node.
 * No-op when the target slot is out of range — we deliberately do not wrap
 * so the focus indicator stays predictable during rapid arrow presses.
 */
function moveWithinNode(row: HTMLElement, direction: 1 | -1): void {
    const rows = siblingRowsOf(row);
    const idx = rows.indexOf(row);
    if (idx === -1) return;
    const next = rows[idx + direction];
    if (next) next.focus();
}

/**
 * Move focus to the first (direction=1) or last (direction=-1) row of the
 * sibling node. Returns true when focus moved — the caller then calls
 * preventDefault on the Tab event. When false, we let the browser handle Tab
 * naturally so focus can leave the canvas.
 *
 * Node discovery walks up to the closest `.flow-container` (the canvas root)
 * and collects every `[data-flow-node-id]` descendant in document order. This
 * mirrors the selector used by `x-schema-reorderable` for nodeId resolution.
 */
function moveBetweenNodes(row: HTMLElement, direction: 1 | -1): boolean {
    const currentNode = row.closest('[data-flow-node-id]') as HTMLElement | null;
    if (!currentNode) return false;
    const container = row.closest('.flow-container') as HTMLElement | null;
    if (!container) return false;
    const allNodes = Array.from(
        container.querySelectorAll('[data-flow-node-id]'),
    ) as HTMLElement[];
    const idx = allNodes.indexOf(currentNode);
    if (idx === -1) return false;
    const next = allNodes[idx + direction];
    if (!next) return false;
    const targetRow = (
        direction === 1
            ? next.querySelector('.flow-schema-row')
            : (() => {
                  const rows = next.querySelectorAll('.flow-schema-row');
                  return rows.length > 0 ? rows[rows.length - 1] : null;
              })()
    ) as HTMLElement | null;
    if (!targetRow) return false;
    targetRow.focus();
    return true;
}

/**
 * Trigger selection by dispatching a click on the row. `x-flow-row-select`
 * already listens for clicks and encapsulates single-vs-shift selection logic
 * — reusing its handler keeps this directive a thin a11y shell with no
 * duplicate selection logic to drift out of sync.
 */
function selectRow(row: HTMLElement): void {
    row.click();
}

export function registerSchemaKeyboardNavDirective(Alpine: Alpine): void {
    Alpine.directive(
        'schema-keyboard-nav',
        (el, _spec, { effect, cleanup }) => {
            const row = el as HTMLElement;
            row.setAttribute('tabindex', '0');
            row.setAttribute('role', 'row');

            // Reactive aria-label. We read the field name from the row's
            // data-flow-schema-field attribute (stamped by x-flow-schema) and
            // the type from the rendered `.flow-schema-row-type` span. Running
            // this inside `effect` means Alpine re-invokes it on any reactive
            // mutation that touched these reads — but since these are DOM
            // reads, not reactive state reads, the effect fires once at init.
            // That's fine: x-flow-schema owns the row contents and re-stamps
            // them on field changes, which re-binds this directive and gives
            // us a fresh aria-label read.
            effect(() => {
                const fieldName = row.dataset.flowSchemaField ?? '';
                const typeEl = row.querySelector('.flow-schema-row-type');
                const fieldType = typeEl?.textContent ?? '';
                row.setAttribute(
                    'aria-label',
                    `${fieldName}${fieldType ? ' (' + fieldType + ')' : ''}`,
                );
            });

            const onKey = (e: KeyboardEvent): void => {
                const key = e.key;
                if (key === 'ArrowDown' || key === 'ArrowUp') {
                    e.preventDefault();
                    e.stopPropagation();
                    moveWithinNode(row, key === 'ArrowDown' ? 1 : -1);
                    return;
                }
                if (key === 'Tab') {
                    // Intercept Tab so focus jumps between sibling schema
                    // nodes instead of walking through every focusable child
                    // (handles, inputs, etc.). preventDefault only when we
                    // actually moved focus — otherwise the browser's default
                    // tab-out lets the user escape the canvas.
                    if (moveBetweenNodes(row, e.shiftKey ? -1 : 1)) {
                        e.preventDefault();
                    }
                    return;
                }
                if (key === 'Enter' || key === ' ') {
                    e.preventDefault();
                    selectRow(row);
                    return;
                }
                if (key === 'Escape') {
                    row.blur();
                    return;
                }
            };

            row.addEventListener('keydown', onKey);

            cleanup(() => {
                try {
                    row.removeEventListener('keydown', onKey);
                    row.removeAttribute('tabindex');
                    row.removeAttribute('role');
                    row.removeAttribute('aria-label');
                } catch {
                    /* environment may be torn down (jsdom) */
                }
            });
        },
    );
}
