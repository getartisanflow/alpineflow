// ============================================================================
// x-schema-node-inspector Directive
//
// Attach to any container (e.g. `<aside x-schema-node-inspector>`) to expose
// the currently-selected node + schema helpers to the subtree. Optionally
// stamps a minimal default field-list UI when a child
// `<template x-schema-default-ui>` is present.
//
// Exposed scope (via `Alpine.addScopeToNode`):
//   selectedNode              — reactive FlowNode | null
//   inspector.addField(f)     — append field to selected node
//   inspector.renameField(o,n) — rename field on selected node
//   inspector.removeField(name) — remove field from selected node
//   inspector.reorderFields(names) — reorder fields on selected node
//
// The default UI (when opted in) is structural HTML only:
//   <div data-schema-default-ui-root>
//     <div data-schema-inspector-empty>No node selected.</div>  ← empty state
//     — OR —
//     <header data-schema-inspector-label>User</header>
//     <ul data-schema-inspector-fields>
//       <li data-schema-inspector-field>
//         <span>id</span><button data-action="remove">remove</button>
//       </li>
//       ...
//     </ul>
//     <form data-schema-inspector-add-field>
//       <input data-field="name"><input data-field="type"><button>add</button>
//     </form>
//   </div>
//
// Consumer themes style via CSS. This directive writes no styles of its own.
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

export function registerNodeInspectorDirective(Alpine: Alpine): void {
    Alpine.directive(
        'schema-node-inspector',
        (el, _spec, { effect, cleanup }) => {
            const host = el as HTMLElement;
            const canvas = findCanvasScope(Alpine, host);
            if (!canvas) {
                return;
            }

            const template = findDefaultUiTemplate(host);

            // Build the inspector helper object. These thin wrappers close over
            // the current selection so consumers don't have to thread nodeId
            // through every call.
            const inspector = {
                addField(field: any) {
                    const id = lastInSet(canvas.selectedNodes);
                    if (!id) {
                        return { applied: false, reason: 'no-selection' };
                    }
                    return canvas.addField?.(id, field) ?? { applied: false, reason: 'no-helper' };
                },
                renameField(oldName: string, newName: string) {
                    const id = lastInSet(canvas.selectedNodes);
                    if (!id) {
                        return { applied: false, reason: 'no-selection', cascadedEdgeIds: [] };
                    }
                    return (
                        canvas.renameField?.(id, oldName, newName) ?? {
                            applied: false,
                            reason: 'no-helper',
                            cascadedEdgeIds: [],
                        }
                    );
                },
                removeField(fieldName: string) {
                    const id = lastInSet(canvas.selectedNodes);
                    if (!id) {
                        return { applied: false, reason: 'no-selection', droppedEdgeIds: [] };
                    }
                    return (
                        canvas.removeField?.(id, fieldName) ?? {
                            applied: false,
                            reason: 'no-helper',
                            droppedEdgeIds: [],
                        }
                    );
                },
                reorderFields(order: string[]) {
                    const id = lastInSet(canvas.selectedNodes);
                    if (!id) {
                        return { applied: false, reason: 'no-selection' };
                    }
                    return (
                        canvas.reorderFields?.(id, order) ?? {
                            applied: false,
                            reason: 'no-helper',
                        }
                    );
                },
            };

            // Inject reactive scope onto the inspector element. The `get` on
            // `selectedNode` reads `canvas.selectedNodes` + `canvas.nodes`, so
            // Alpine rewires dependents whenever either changes.
            const removeScope = Alpine.addScopeToNode(host, {
                inspector,
                get selectedNode() {
                    const id = lastInSet(canvas.selectedNodes);
                    if (!id) {
                        return null;
                    }
                    return canvas.nodes?.find((n: any) => n.id === id) ?? null;
                },
            });

            // Default-UI stamping. If no template is present, we do nothing
            // and the host's own children render through Alpine as normal.
            if (template) {
                effect(() => {
                    stampNodeDefaultUi(host, canvas);
                });
            }

            cleanup(() => {
                clearStampedUi(host);
                removeScope?.();
            });
        },
    );
}

function stampNodeDefaultUi(host: HTMLElement, canvas: any): void {
    // Capture focus on the previous managed root BEFORE tearing it down, so a
    // reactive re-stamp triggered while the user is typing doesn't blur the
    // focused input.
    const previousRoot = host.querySelector<HTMLElement>(
        ':scope > [data-schema-default-ui-root]',
    );
    const captured = captureStampFocus(previousRoot);

    clearStampedUi(host);
    const root = createStampRoot(host);

    const id = lastInSet(canvas.selectedNodes);
    const node = id ? canvas.nodes?.find((n: any) => n.id === id) : null;

    if (!node) {
        const empty = document.createElement('div');
        empty.setAttribute('data-schema-inspector-empty', '');
        empty.textContent = 'No node selected.';
        root.appendChild(empty);
        restoreStampFocus(root, captured);
        return;
    }

    const header = document.createElement('header');
    header.setAttribute('data-schema-inspector-label', '');
    header.textContent = String(node.data?.label ?? node.id);
    root.appendChild(header);

    const list = document.createElement('ul');
    list.setAttribute('data-schema-inspector-fields', '');
    const fields: any[] = Array.isArray(node.data?.fields) ? node.data.fields : [];
    for (const f of fields) {
        const li = document.createElement('li');
        li.setAttribute('data-schema-inspector-field', '');
        li.dataset.fieldName = String(f?.name ?? '');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = String(f?.name ?? '');
        li.appendChild(nameSpan);

        if (f?.type) {
            const typeSpan = document.createElement('span');
            typeSpan.setAttribute('data-field-type', '');
            typeSpan.textContent = String(f.type);
            li.appendChild(typeSpan);
        }

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.setAttribute('data-action', 'remove');
        removeBtn.textContent = 'remove';
        removeBtn.addEventListener('click', () => {
            canvas.removeField?.(node.id, f.name);
        });
        li.appendChild(removeBtn);

        list.appendChild(li);
    }
    root.appendChild(list);

    const form = document.createElement('form');
    form.setAttribute('data-schema-inspector-add-field', '');

    const nameInput = document.createElement('input');
    nameInput.setAttribute('data-field', 'name');
    nameInput.placeholder = 'field name';
    form.appendChild(nameInput);

    const registry = Array.isArray(canvas._config?.fieldTypeRegistry)
        ? (canvas._config.fieldTypeRegistry as string[])
        : null;

    let typeInput: HTMLInputElement | HTMLSelectElement;
    if (registry && registry.length > 0) {
        const select = document.createElement('select');
        select.setAttribute('data-field', 'type');
        for (const type of registry) {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            select.appendChild(option);
        }
        select.value = registry[0];
        typeInput = select;
    } else {
        const input = document.createElement('input');
        input.setAttribute('data-field', 'type');
        input.placeholder = 'type';
        input.value = 'text';
        typeInput = input;
    }
    form.appendChild(typeInput);

    const addBtn = document.createElement('button');
    addBtn.type = 'submit';
    addBtn.textContent = 'add';
    form.appendChild(addBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fieldName = nameInput.value.trim();
        if (!fieldName) {
            return;
        }
        const rawType = typeInput.value;
        const type = (typeof rawType === 'string' ? rawType.trim() : '') || 'text';
        const result = canvas.addField?.(node.id, { name: fieldName, type });
        if (result?.applied) {
            nameInput.value = '';
        }
    });

    root.appendChild(form);

    restoreStampFocus(root, captured);
}
