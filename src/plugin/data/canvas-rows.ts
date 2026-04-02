// ============================================================================
// canvas-rows — Row selection & row filtering mixin for flow-canvas
//
// Row selection: select/deselect/toggle rows, query selection state.
// Row filtering: per-node filter (all | connected | unconnected | predicate)
// that determines which schema rows are visible based on edge connectivity.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowEdge, RowFilter } from '../../core/types';
import { debug } from '../../core/debug';

export function createRowsMixin(ctx: CanvasContext) {
  return {
    // ── Row Selection ────────────────────────────────────────────────────

    selectRow(rowId: string): void {
      if (ctx.selectedRows.has(rowId)) return;
      ctx._captureHistory();
      ctx.selectedRows.add(rowId);
      const dotIdx = rowId.indexOf('.');
      const nodeId = dotIdx === -1 ? rowId : rowId.slice(0, dotIdx);
      const attrId = dotIdx === -1 ? '' : rowId.slice(dotIdx + 1);
      debug('selection', `Row "${rowId}" selected`);
      ctx._emit('row-select', { rowId, nodeId, attrId });
      ctx._emit('row-selection-change', { selectedRows: [...ctx.selectedRows] });
    },

    deselectRow(rowId: string): void {
      if (!ctx.selectedRows.has(rowId)) return;
      ctx._captureHistory();
      ctx.selectedRows.delete(rowId);
      const dotIdx = rowId.indexOf('.');
      const nodeId = dotIdx === -1 ? rowId : rowId.slice(0, dotIdx);
      const attrId = dotIdx === -1 ? '' : rowId.slice(dotIdx + 1);
      debug('selection', `Row "${rowId}" deselected`);
      ctx._emit('row-deselect', { rowId, nodeId, attrId });
      ctx._emit('row-selection-change', { selectedRows: [...ctx.selectedRows] });
    },

    toggleRowSelect(rowId: string): void {
      if (ctx.selectedRows.has(rowId)) {
        this.deselectRow(rowId);
      } else {
        this.selectRow(rowId);
      }
    },

    getSelectedRows(): string[] {
      return [...ctx.selectedRows];
    },

    isRowSelected(rowId: string): boolean {
      return ctx.selectedRows.has(rowId);
    },

    deselectAllRows(): void {
      if (ctx.selectedRows.size === 0) return;
      ctx._captureHistory();
      debug('selection', 'Deselecting all rows');
      ctx.selectedRows.clear();
      ctx._container?.querySelectorAll('.flow-row-selected').forEach((el: Element) => {
        el.classList.remove('flow-row-selected');
      });
      ctx._emit('row-selection-change', { selectedRows: [] });
    },

    // ── Row Filtering ────────────────────────────────────────────────────

    setRowFilter(nodeId: string, filter: RowFilter): void {
      const node = ctx._nodeMap.get(nodeId);
      if (!node) return;
      node.rowFilter = filter;
      debug('filter', `Node "${nodeId}" row filter set to "${typeof filter === 'function' ? 'predicate' : filter}"`);
    },

    getRowFilter(nodeId: string): RowFilter {
      return ctx._nodeMap.get(nodeId)?.rowFilter ?? 'all';
    },

    getVisibleRows(nodeId: string, schema: any[]): any[] {
      const node = ctx._nodeMap.get(nodeId);
      if (!node) return schema;
      const filter = node.rowFilter ?? 'all';
      if (filter === 'all') return schema;

      // Custom predicate — apply directly
      if (typeof filter === 'function') {
        return schema.filter(filter);
      }

      const connectedAttrIds = new Set<string>();
      for (const edge of ctx.edges as FlowEdge[]) {
        if (edge.sourceHandle?.startsWith(nodeId + '.')) {
          const attrId = edge.sourceHandle.slice(nodeId.length + 1).replace(/-[lr]$/, '');
          if (attrId) connectedAttrIds.add(attrId);
        }
        if (edge.targetHandle?.startsWith(nodeId + '.')) {
          const attrId = edge.targetHandle.slice(nodeId.length + 1).replace(/-[lr]$/, '');
          if (attrId) connectedAttrIds.add(attrId);
        }
      }

      if (filter === 'connected') {
        return schema.filter((attr: any) => connectedAttrIds.has(attr.id));
      }
      return schema.filter((attr: any) => !connectedAttrIds.has(attr.id));
    },
  };
}
