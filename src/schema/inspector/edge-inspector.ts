// ============================================================================
// x-schema-edge-inspector Directive
//
// Attach to any container to expose the currently-selected edge + helpers to
// the subtree. Optionally stamps a minimal label/delete UI when a child
// `<template x-schema-default-ui>` is present.
//
// Exposed scope:
//   selectedEdge              — reactive FlowEdge | null
//   inspector.updateEdge(patch) — patch arbitrary props (label, style, …) in place
//   inspector.setLabel(text)    — convenience for updating the edge label
//   inspector.removeEdge()      — drop the selected edge (delegates to removeEdges)
//
// Default UI (opt-in):
//   <div data-schema-default-ui-root>
//     <div data-schema-inspector-empty>No edge selected.</div>
//     — OR —
//     <label>label <input data-field="label"></label>
//     <button data-action="delete">delete</button>
//   </div>
// ============================================================================

import type { Alpine } from 'alpinejs';
import {
    lastInSet,
    findCanvasScope,
    findDefaultUiTemplate,
    clearStampedUi,
    createStampRoot,
    captureStampFocus,
    restoreStampFocus,
} from './shared';

export function registerEdgeInspectorDirective(Alpine: Alpine): void {
    Alpine.directive(
        'schema-edge-inspector',
        (el, _spec, { effect, cleanup }) => {
            const host = el as HTMLElement;
            const canvas = findCanvasScope(Alpine, host);
            if (!canvas) {
                return;
            }

            const template = findDefaultUiTemplate(host);

            const currentEdge = () => {
                const id = lastInSet(canvas.selectedEdges);
                if (!id) {
                    return null;
                }
                return canvas.edges?.find((e: any) => e.id === id) ?? null;
            };

            const inspector = {
                updateEdge(patch: Record<string, unknown>) {
                    const edge = currentEdge();
                    if (!edge) {
                        return { applied: false, reason: 'no-selection' };
                    }
                    for (const [k, v] of Object.entries(patch)) {
                        edge[k] = v;
                    }
                    return { applied: true };
                },
                setLabel(label: string) {
                    return this.updateEdge({ label });
                },
                removeEdge() {
                    const edge = currentEdge();
                    if (!edge) {
                        return { applied: false, reason: 'no-selection' };
                    }
                    if (typeof canvas.removeEdges === 'function') {
                        canvas.removeEdges([edge.id]);
                        return { applied: true };
                    }
                    // Fallback: splice out of the reactive array directly.
                    const idx = canvas.edges?.findIndex((e: any) => e.id === edge.id) ?? -1;
                    if (idx === -1) {
                        return { applied: false, reason: 'no-helper' };
                    }
                    canvas.edges.splice(idx, 1);
                    return { applied: true };
                },
            };

            const removeScope = Alpine.addScopeToNode(host, {
                inspector,
                get selectedEdge() {
                    return currentEdge();
                },
            });

            if (template) {
                effect(() => {
                    stampEdgeDefaultUi(host, canvas, currentEdge());
                });
            }

            cleanup(() => {
                clearStampedUi(host);
                removeScope?.();
            });
        },
    );
}

function stampEdgeDefaultUi(host: HTMLElement, canvas: any, edge: any | null): void {
    // Capture focus on the previous managed root BEFORE tearing it down, so a
    // reactive re-stamp triggered while the user is typing doesn't blur the
    // focused input.
    const previousRoot = host.querySelector<HTMLElement>(
        ':scope > [data-schema-default-ui-root]',
    );
    const captured = captureStampFocus(previousRoot);

    clearStampedUi(host);
    const root = createStampRoot(host);

    if (!edge) {
        const empty = document.createElement('div');
        empty.setAttribute('data-schema-inspector-empty', '');
        empty.textContent = 'No edge selected.';
        root.appendChild(empty);
        restoreStampFocus(root, captured);
        return;
    }

    const labelWrap = document.createElement('label');
    labelWrap.textContent = 'label ';
    const labelInput = document.createElement('input');
    labelInput.setAttribute('data-field', 'label');
    labelInput.value = String(edge.label ?? '');
    labelInput.addEventListener('input', () => {
        edge.label = labelInput.value;
    });
    labelWrap.appendChild(labelInput);
    root.appendChild(labelWrap);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click', () => {
        if (typeof canvas.removeEdges === 'function') {
            canvas.removeEdges([edge.id]);
        } else {
            const idx = canvas.edges?.findIndex((e: any) => e.id === edge.id) ?? -1;
            if (idx !== -1) {
                canvas.edges.splice(idx, 1);
            }
        }
    });
    root.appendChild(deleteBtn);

    restoreStampFocus(root, captured);
}
