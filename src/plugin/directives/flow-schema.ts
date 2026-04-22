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

    /**
     * Resolve whether this canvas has opted into drag-to-reorder on rows.
     * Read once per directive bind — the flag is not expected to change
     * between mounts. Walks to the closest `.flow-container` and reads
     * `canvas._config.rowsReorderable`.
     */
    const readRowsReorderable = (): boolean => {
      try {
        const canvasEl = host.closest('.flow-container') as HTMLElement | null;
        if (!canvasEl) return false;
        const canvas = (Alpine as any).$data?.(canvasEl);
        return !!canvas?._config?.rowsReorderable;
      } catch {
        return false;
      }
    };

    host.classList.add('flow-schema-node');

    const render = (): void => {
      const node = readNode() as (NodeRef & { id?: unknown }) | null;
      const data = node?.data;
      if (!data) {
        clearChildren(host);
        return;
      }

      const label = typeof data.label === 'string' ? data.label : '';
      const fields = Array.isArray(data.fields) ? data.fields : [];
      const nodeId = typeof node?.id === 'string' ? node.id : '';

      if (typeof data.kind === 'string' && data.kind) {
        host.setAttribute('data-flow-schema-kind', data.kind);
      } else {
        host.removeAttribute('data-flow-schema-kind');
      }

      clearChildren(host);

      const rowsReorderable = readRowsReorderable();

      // Header
      const header = document.createElement('div');
      header.className = 'flow-schema-header';
      header.textContent = label;
      host.appendChild(header);

      // Body
      const body = document.createElement('div');
      body.className = 'flow-schema-body';
      for (const field of fields) {
        body.appendChild(renderRow(field, nodeId, rowsReorderable));
      }
      host.appendChild(body);

      // Activate x-flow-handle + x-flow-row-select directives on the newly
      // stamped rows. Without this call, rows have the right classes +
      // attributes but no pointer listeners — drag-to-connect and
      // row-click selection would be dead.
      Alpine.initTree(body);
    };

    const renderRow = (
      field: FlowSchemaField,
      nodeId: string,
      rowsReorderable: boolean,
    ): HTMLElement => {
      const row = document.createElement('div');
      row.className = 'flow-schema-row';
      row.dataset.flowSchemaField = field.name;
      if (field.key === 'primary') row.classList.add('flow-schema-row--pk');
      if (field.key === 'foreign') row.classList.add('flow-schema-row--fk');
      if (field.required) row.classList.add('flow-schema-row--required');

      // Row-select wiring. Stamps the x-flow-row-select directive with
      // the `nodeId.fieldName` convention the schema inspector scaffolding
      // expects. Without this, clicking a row would never populate
      // canvas.selectedRows and the row-scope inspector slot stays empty.
      if (nodeId) {
        row.setAttribute(
          'x-flow-row-select',
          JSON.stringify(`${nodeId}.${field.name}`),
        );
      }

      // Drag-to-reorder opt-in. When `canvas._config.rowsReorderable` is
      // truthy, stamp `x-schema-reorderable` on each row — the directive is
      // registered by the schema addon and activated via Alpine.initTree(body)
      // below.
      if (rowsReorderable) {
        row.setAttribute('x-schema-reorderable', '');
      }

      // Target handle (left). We set the x-flow-handle directive attribute
      // so that after Alpine.initTree(host) runs below, the handle's
      // pointerdown → drag-to-connect pipeline activates on this element.
      // Without the directive, the div has the right classes + data-attrs
      // but no pointer handlers — clicks fall through to the node drag.
      const target = document.createElement('div');
      target.className = 'flow-schema-handle flow-schema-handle--target';
      target.setAttribute('x-flow-handle:target.left', JSON.stringify(field.name));
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

      // Source handle (right) — same directive pattern as target.
      const source = document.createElement('div');
      source.className = 'flow-schema-handle flow-schema-handle--source';
      source.setAttribute('x-flow-handle:source.right', JSON.stringify(field.name));
      row.appendChild(source);

      // Mirror handles — invisible, non-interactive copies of the real
      // target/source on the OPPOSITE side of the row. They share the same
      // (id, type) with their real counterparts so the edge-geometry picker
      // (see flow-edge.ts `pickClosestHandle`) can route an edge to whichever
      // side is physically closer to the other endpoint. CSS gives them
      // `visibility: hidden; pointer-events: none`, but they remain in the
      // layout so `getBoundingClientRect` returns a measurable position.
      const mirrorTarget = document.createElement('div');
      mirrorTarget.className =
        'flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror';
      mirrorTarget.setAttribute('x-flow-handle:target.right', JSON.stringify(field.name));
      row.appendChild(mirrorTarget);

      const mirrorSource = document.createElement('div');
      mirrorSource.className =
        'flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror';
      mirrorSource.setAttribute('x-flow-handle:source.left', JSON.stringify(field.name));
      row.appendChild(mirrorSource);

      return row;
    };

    // Reactive: effect() fires on init and on any reactive read touched inside.
    effect(() => {
      // Touch label + field properties so Alpine subscribes to mutations.
      const data = readNode()?.data;
      void data?.label;
      void data?.kind;
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
