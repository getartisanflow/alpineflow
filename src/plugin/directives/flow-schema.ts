// ============================================================================
// x-flow-schema Directive
//
// Renders a schema node: header + one row per field + per-row labelled handles.
// Reads `node.data.label` and `node.data.fields` from the bound scope.
//
// Usage:
//   <div x-flow-node="node" x-flow-schema></div>
//
// The directive fully owns the element's children. Users who want custom
// rendering should skip this directive and write x-for + handles manually.
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { FlowSchemaField } from '../../core/types';

type SchemaData = { label?: string; fields?: FlowSchemaField[]; [k: string]: unknown };
type NodeRef = { data?: SchemaData } | undefined | null;

/**
 * Remove every child from an element without using innerHTML.
 * Matches the XSS-safe clear pattern the security hook prefers.
 */
function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function registerFlowSchemaDirective(Alpine: Alpine) {
  Alpine.directive('flow-schema', (el, _spec, { evaluate, effect, cleanup }) => {
    const host = el as HTMLElement;

    const readNode = (): NodeRef => {
      try {
        return evaluate('node') as NodeRef;
      } catch {
        return null;
      }
    };

    host.classList.add('flow-schema-node');

    const render = (): void => {
      const data = readNode()?.data;
      if (!data) {
        clearChildren(host);
        return;
      }

      const label = typeof data.label === 'string' ? data.label : '';
      const fields = Array.isArray(data.fields) ? data.fields : [];

      clearChildren(host);

      // Header
      const header = document.createElement('div');
      header.className = 'flow-schema-header';
      header.textContent = label;
      host.appendChild(header);

      // Body
      const body = document.createElement('div');
      body.className = 'flow-schema-body';
      for (const field of fields) {
        body.appendChild(renderRow(field));
      }
      host.appendChild(body);
    };

    const renderRow = (field: FlowSchemaField): HTMLElement => {
      const row = document.createElement('div');
      row.className = 'flow-schema-row';
      row.dataset.flowSchemaField = field.name;
      if (field.key === 'primary') row.classList.add('flow-schema-row--pk');
      if (field.key === 'foreign') row.classList.add('flow-schema-row--fk');
      if (field.required) row.classList.add('flow-schema-row--required');

      // Target handle (left)
      const target = document.createElement('div');
      target.className = 'flow-handle flow-handle-target flow-schema-handle flow-schema-handle--target';
      target.setAttribute('data-flow-handle-id', field.name);
      target.setAttribute('data-flow-handle-type', 'target');
      target.setAttribute('data-flow-handle-position', 'left');
      row.appendChild(target);

      if (field.icon) {
        const icon = document.createElement('span');
        icon.className = 'flow-schema-row-icon';
        icon.textContent = field.icon;
        row.appendChild(icon);
      }

      const name = document.createElement('span');
      name.className = 'flow-schema-row-name';
      name.textContent = field.name;
      row.appendChild(name);

      const type = document.createElement('span');
      type.className = 'flow-schema-row-type';
      type.textContent = field.type;
      row.appendChild(type);

      // Source handle (right)
      const source = document.createElement('div');
      source.className = 'flow-handle flow-handle-source flow-schema-handle flow-schema-handle--source';
      source.setAttribute('data-flow-handle-id', field.name);
      source.setAttribute('data-flow-handle-type', 'source');
      source.setAttribute('data-flow-handle-position', 'right');
      row.appendChild(source);

      return row;
    };

    // Reactive: effect() fires on init and on any reactive read touched inside.
    effect(() => {
      // Touch label + field properties so Alpine subscribes to mutations.
      const data = readNode()?.data;
      void data?.label;
      const fields = data?.fields;
      if (Array.isArray(fields)) {
        for (const f of fields) {
          void f.name;
          void f.type;
          void f.key;
          void f.required;
          void f.icon;
        }
      }
      render();
    });

    cleanup(() => {
      clearChildren(host);
      host.classList.remove('flow-schema-node');
    });
  });
}
