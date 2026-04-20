// ============================================================================
// x-schema-row-inspector Directive
//
// Attach to any container to expose the currently-selected row
// (`{nodeId, fieldName}`) + helpers to the subtree. Optionally stamps a
// minimal default "edit this field" UI when a child
// `<template x-schema-default-ui>` is present.
//
// Exposed scope:
//   selectedRow              — reactive {nodeId, fieldName} | null
//   inspector.renameField(newName)      — rename the selected field
//   inspector.removeField()             — remove the selected field
//   inspector.updateField(patch)        — mutate arbitrary field props
//                                         (e.g. type, required) in place
//
// Default UI (opt-in):
//   <div data-schema-default-ui-root>
//     <div data-schema-inspector-empty>No row selected.</div>
//     — OR —
//     <label>name <input data-field="name"></label>
//     <label>type <input data-field="type"></label>
//     <label>required <input type="checkbox" data-field="required"></label>
//     <button data-action="remove">remove</button>
//   </div>
// ============================================================================

import type { Alpine } from 'alpinejs';
import {
    lastInSet,
    parseRowId,
    findCanvasScope,
    findDefaultUiTemplate,
    clearStampedUi,
    createStampRoot,
} from './shared';

export function registerRowInspectorDirective(Alpine: Alpine): void {
    Alpine.directive(
        'schema-row-inspector',
        (el, _spec, { effect, cleanup }) => {
            const host = el as HTMLElement;
            const canvas = findCanvasScope(Alpine, host);
            if (!canvas) {
                return;
            }

            const template = findDefaultUiTemplate(host);

            const currentRow = () => parseRowId(lastInSet(canvas.selectedRows));

            const currentField = () => {
                const row = currentRow();
                if (!row) {
                    return null;
                }
                const node = canvas.nodes?.find((n: any) => n.id === row.nodeId);
                if (!node) {
                    return null;
                }
                const fields: any[] = node.data?.fields ?? [];
                return fields.find((f: any) => f?.name === row.fieldName) ?? null;
            };

            const inspector = {
                renameField(newName: string) {
                    const row = currentRow();
                    if (!row) {
                        return { applied: false, reason: 'no-selection', cascadedEdgeIds: [] };
                    }
                    return (
                        canvas.renameField?.(row.nodeId, row.fieldName, newName) ?? {
                            applied: false,
                            reason: 'no-helper',
                            cascadedEdgeIds: [],
                        }
                    );
                },
                removeField() {
                    const row = currentRow();
                    if (!row) {
                        return { applied: false, reason: 'no-selection', droppedEdgeIds: [] };
                    }
                    return (
                        canvas.removeField?.(row.nodeId, row.fieldName) ?? {
                            applied: false,
                            reason: 'no-helper',
                            droppedEdgeIds: [],
                        }
                    );
                },
                /**
                 * Patch non-name properties (type, required, …) of the selected
                 * field in place. For name changes, use `renameField` so edges
                 * cascade correctly.
                 */
                updateField(patch: Record<string, unknown>) {
                    const field = currentField();
                    if (!field) {
                        return { applied: false, reason: 'no-selection' };
                    }
                    for (const [k, v] of Object.entries(patch)) {
                        if (k === 'name') {
                            continue; // use renameField
                        }
                        field[k] = v;
                    }
                    return { applied: true };
                },
            };

            const removeScope = Alpine.addScopeToNode(host, {
                inspector,
                get selectedRow() {
                    return currentRow();
                },
            });

            if (template) {
                effect(() => {
                    stampRowDefaultUi(host, canvas, currentRow());
                });
            }

            cleanup(() => {
                clearStampedUi(host);
                removeScope?.();
            });
        },
    );
}

function stampRowDefaultUi(
    host: HTMLElement,
    canvas: any,
    row: { nodeId: string; fieldName: string } | null,
): void {
    clearStampedUi(host);
    const root = createStampRoot(host);

    if (!row) {
        const empty = document.createElement('div');
        empty.setAttribute('data-schema-inspector-empty', '');
        empty.textContent = 'No row selected.';
        root.appendChild(empty);
        return;
    }

    const node = canvas.nodes?.find((n: any) => n.id === row.nodeId);
    const field = node?.data?.fields?.find((f: any) => f?.name === row.fieldName) ?? null;

    if (!field) {
        const missing = document.createElement('div');
        missing.setAttribute('data-schema-inspector-empty', '');
        missing.textContent = 'Selected row no longer exists.';
        root.appendChild(missing);
        return;
    }

    // Name
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'name ';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('data-field', 'name');
    nameInput.value = String(field.name ?? '');
    nameInput.addEventListener('change', () => {
        const next = nameInput.value.trim();
        if (!next || next === field.name) {
            return;
        }
        canvas.renameField?.(row.nodeId, row.fieldName, next);
    });
    nameLabel.appendChild(nameInput);
    root.appendChild(nameLabel);

    // Type
    const typeLabel = document.createElement('label');
    typeLabel.textContent = 'type ';
    const typeInput = document.createElement('input');
    typeInput.setAttribute('data-field', 'type');
    typeInput.value = String(field.type ?? '');
    typeInput.addEventListener('change', () => {
        field.type = typeInput.value;
    });
    typeLabel.appendChild(typeInput);
    root.appendChild(typeLabel);

    // Required
    const requiredLabel = document.createElement('label');
    requiredLabel.textContent = 'required ';
    const requiredInput = document.createElement('input');
    requiredInput.type = 'checkbox';
    requiredInput.setAttribute('data-field', 'required');
    requiredInput.checked = Boolean(field.required);
    requiredInput.addEventListener('change', () => {
        field.required = requiredInput.checked;
    });
    requiredLabel.appendChild(requiredInput);
    root.appendChild(requiredLabel);

    // Remove
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.setAttribute('data-action', 'remove');
    removeBtn.textContent = 'remove';
    removeBtn.addEventListener('click', () => {
        canvas.removeField?.(row.nodeId, row.fieldName);
    });
    root.appendChild(removeBtn);
}
