// ============================================================================
// x-flow-row-select Directive
//
// Marks a row element as selectable. Clicking selects the row, shift-clicking
// toggles without clearing other selections (multi-select).
//
// Usage:
//   <div x-flow-row-select="node.id + '.' + attr.id">Row content</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowRowSelectDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-row-select',
    (el, { expression }, { evaluate, effect, cleanup }) => {
      el.classList.add('nodrag');
      el.style.cursor = 'pointer';
      el.setAttribute('data-flow-row-select', '');

      const onClick = (e: MouseEvent) => {
        e.stopPropagation();

        const rowId = evaluate(expression) as string;
        if (!rowId) return;

        const canvasEl = el.closest('[x-data]') as HTMLElement;
        if (!canvasEl) return;

        const canvas = Alpine.$data(canvasEl) as any;
        if (!canvas?.toggleRowSelect) return;

        if (e.shiftKey) {
          // Shift+click: toggle this row without clearing others
          canvas.toggleRowSelect(rowId);
        } else {
          // Normal click: select only this row
          canvas.deselectAllRows();
          canvas.selectRow(rowId);
        }
      };

      el.addEventListener('click', onClick);

      // Reactive CSS class and ARIA
      effect(() => {
        const rowId = evaluate(expression) as string;
        if (!rowId) return;

        const canvasEl = el.closest('[x-data]') as HTMLElement;
        if (!canvasEl) return;

        const canvas = Alpine.$data(canvasEl) as any;
        if (!canvas?.isRowSelected) return;

        const selected = canvas.isRowSelected(rowId);
        el.classList.toggle('flow-row-selected', selected);
        el.setAttribute('aria-selected', String(selected));
      });

      cleanup(() => {
        el.removeEventListener('click', onClick);
      });
    },
  );
}
