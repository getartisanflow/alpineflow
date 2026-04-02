import { describe, it, expect, vi } from 'vitest';
import { mockCtx } from './__test-utils';
import { createRowsMixin } from './canvas-rows';
import type { FlowNode, FlowEdge } from '../../core/types';

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return { id, type: 'default', position: { x: 0, y: 0 }, data: {}, ...overrides };
}

function makeEdge(id: string, source: string, target: string, overrides: Partial<FlowEdge> = {}): FlowEdge {
  return { id, source, target, ...overrides };
}

// ── Row Selection ────────────────────────────────────────────────────────────

describe('createRowsMixin — Row Selection', () => {
  describe('selectRow', () => {
    it('adds rowId to selectedRows, captures history, emits events', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      mixin.selectRow('n1.attr1');

      expect(ctx.selectedRows.has('n1.attr1')).toBe(true);
      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(ctx._emit).toHaveBeenCalledWith('row-select', {
        rowId: 'n1.attr1',
        nodeId: 'n1',
        attrId: 'attr1',
      });
      expect(ctx._emit).toHaveBeenCalledWith('row-selection-change', {
        selectedRows: ['n1.attr1'],
      });
    });

    it('returns early if row is already selected', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);
      ctx.selectedRows.add('n1.attr1');

      mixin.selectRow('n1.attr1');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });

    it('can select multiple rows', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      mixin.selectRow('n1.attr1');
      mixin.selectRow('n1.attr2');

      expect(ctx.selectedRows.size).toBe(2);
      expect(ctx.selectedRows.has('n1.attr1')).toBe(true);
      expect(ctx.selectedRows.has('n1.attr2')).toBe(true);
    });
  });

  describe('deselectRow', () => {
    it('removes rowId from selectedRows, captures history, emits events', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);
      ctx.selectedRows.add('n1.attr1');

      mixin.deselectRow('n1.attr1');

      expect(ctx.selectedRows.has('n1.attr1')).toBe(false);
      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(ctx._emit).toHaveBeenCalledWith('row-deselect', {
        rowId: 'n1.attr1',
        nodeId: 'n1',
        attrId: 'attr1',
      });
      expect(ctx._emit).toHaveBeenCalledWith('row-selection-change', {
        selectedRows: [],
      });
    });

    it('returns early if row is not selected', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      mixin.deselectRow('n1.attr1');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });
  });

  describe('toggleRowSelect', () => {
    it('selects a row that is not selected', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      mixin.toggleRowSelect('n1.attr1');

      expect(ctx.selectedRows.has('n1.attr1')).toBe(true);
      expect(ctx._emit).toHaveBeenCalledWith('row-select', expect.any(Object));
    });

    it('deselects a row that is already selected', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);
      ctx.selectedRows.add('n1.attr1');

      mixin.toggleRowSelect('n1.attr1');

      expect(ctx.selectedRows.has('n1.attr1')).toBe(false);
      expect(ctx._emit).toHaveBeenCalledWith('row-deselect', expect.any(Object));
    });
  });

  describe('getSelectedRows', () => {
    it('returns an empty array when nothing is selected', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      expect(mixin.getSelectedRows()).toEqual([]);
    });

    it('returns a copy of selected row IDs', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);
      ctx.selectedRows.add('n1.attr1');
      ctx.selectedRows.add('n2.attr2');

      const result = mixin.getSelectedRows();

      expect(result).toHaveLength(2);
      expect(result).toContain('n1.attr1');
      expect(result).toContain('n2.attr2');
      // Ensure it's a copy, not the Set itself
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('isRowSelected', () => {
    it('returns true for a selected row', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);
      ctx.selectedRows.add('n1.attr1');

      expect(mixin.isRowSelected('n1.attr1')).toBe(true);
    });

    it('returns false for an unselected row', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      expect(mixin.isRowSelected('n1.attr1')).toBe(false);
    });
  });

  describe('deselectAllRows', () => {
    it('clears all selected rows, captures history, emits event', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);
      ctx.selectedRows.add('n1.attr1');
      ctx.selectedRows.add('n2.attr2');

      mixin.deselectAllRows();

      expect(ctx.selectedRows.size).toBe(0);
      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(ctx._emit).toHaveBeenCalledWith('row-selection-change', {
        selectedRows: [],
      });
    });

    it('returns early when no rows are selected', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      mixin.deselectAllRows();

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });

    it('removes flow-row-selected CSS class from DOM elements', () => {
      const mockEl = { classList: { remove: vi.fn() } };
      const container = {
        querySelectorAll: vi.fn(() => [mockEl]),
      } as unknown as HTMLElement;
      const ctx = mockCtx({ _container: container });
      const mixin = createRowsMixin(ctx);
      ctx.selectedRows.add('n1.attr1');

      mixin.deselectAllRows();

      expect(container.querySelectorAll).toHaveBeenCalledWith('.flow-row-selected');
      expect(mockEl.classList.remove).toHaveBeenCalledWith('flow-row-selected');
    });
  });
});

// ── Row Filtering ────────────────────────────────────────────────────────────

describe('createRowsMixin — Row Filtering', () => {
  describe('setRowFilter', () => {
    it('sets the rowFilter on a node', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createRowsMixin(ctx);

      mixin.setRowFilter('n1', 'connected');

      expect(node.rowFilter).toBe('connected');
    });

    it('accepts a predicate function', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createRowsMixin(ctx);
      const pred = (row: any) => row.active;

      mixin.setRowFilter('n1', pred);

      expect(node.rowFilter).toBe(pred);
    });

    it('does nothing for nonexistent node', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      // Should not throw
      mixin.setRowFilter('missing', 'connected');
    });
  });

  describe('getRowFilter', () => {
    it('returns the node rowFilter', () => {
      const node = makeNode('n1', { rowFilter: 'unconnected' });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createRowsMixin(ctx);

      expect(mixin.getRowFilter('n1')).toBe('unconnected');
    });

    it('defaults to "all" when no filter is set', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createRowsMixin(ctx);

      expect(mixin.getRowFilter('n1')).toBe('all');
    });

    it('defaults to "all" for nonexistent node', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      expect(mixin.getRowFilter('missing')).toBe('all');
    });
  });

  describe('getVisibleRows', () => {
    const schema = [
      { id: 'name', label: 'Name' },
      { id: 'email', label: 'Email' },
      { id: 'age', label: 'Age' },
    ];

    it('returns all rows when filter is "all"', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createRowsMixin(ctx);

      expect(mixin.getVisibleRows('n1', schema)).toBe(schema);
    });

    it('returns all rows when node has no rowFilter set', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createRowsMixin(ctx);

      expect(mixin.getVisibleRows('n1', schema)).toBe(schema);
    });

    it('returns the schema as-is when node does not exist', () => {
      const ctx = mockCtx();
      const mixin = createRowsMixin(ctx);

      expect(mixin.getVisibleRows('missing', schema)).toBe(schema);
    });

    it('filters using custom predicate function', () => {
      const pred = (row: any) => row.id !== 'email';
      const node = makeNode('n1', { rowFilter: pred });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createRowsMixin(ctx);

      const result = mixin.getVisibleRows('n1', schema);

      expect(result).toEqual([
        { id: 'name', label: 'Name' },
        { id: 'age', label: 'Age' },
      ]);
    });

    it('returns only connected rows when filter is "connected"', () => {
      const node = makeNode('n1', { rowFilter: 'connected' });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.edges = [
        makeEdge('e1', 'n1', 'n2', { sourceHandle: 'n1.name-r' }),
        makeEdge('e2', 'n3', 'n1', { targetHandle: 'n1.age-l' }),
      ] as FlowEdge[];
      const mixin = createRowsMixin(ctx);

      const result = mixin.getVisibleRows('n1', schema);

      expect(result).toEqual([
        { id: 'name', label: 'Name' },
        { id: 'age', label: 'Age' },
      ]);
    });

    it('returns only unconnected rows when filter is "unconnected"', () => {
      const node = makeNode('n1', { rowFilter: 'unconnected' });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.edges = [
        makeEdge('e1', 'n1', 'n2', { sourceHandle: 'n1.name-r' }),
        makeEdge('e2', 'n3', 'n1', { targetHandle: 'n1.age-l' }),
      ] as FlowEdge[];
      const mixin = createRowsMixin(ctx);

      const result = mixin.getVisibleRows('n1', schema);

      expect(result).toEqual([{ id: 'email', label: 'Email' }]);
    });

    it('handles sourceHandle and targetHandle without -l/-r suffix', () => {
      const node = makeNode('n1', { rowFilter: 'connected' });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.edges = [
        makeEdge('e1', 'n1', 'n2', { sourceHandle: 'n1.email' }),
      ] as FlowEdge[];
      const mixin = createRowsMixin(ctx);

      const result = mixin.getVisibleRows('n1', schema);

      expect(result).toEqual([{ id: 'email', label: 'Email' }]);
    });

    it('ignores edges that do not reference the target node', () => {
      const node = makeNode('n1', { rowFilter: 'connected' });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.edges = [
        makeEdge('e1', 'n2', 'n3', { sourceHandle: 'n2.name-r', targetHandle: 'n3.email-l' }),
      ] as FlowEdge[];
      const mixin = createRowsMixin(ctx);

      const result = mixin.getVisibleRows('n1', schema);

      expect(result).toEqual([]);
    });

    it('handles edges without sourceHandle or targetHandle', () => {
      const node = makeNode('n1', { rowFilter: 'connected' });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.edges = [
        makeEdge('e1', 'n1', 'n2'),
      ] as FlowEdge[];
      const mixin = createRowsMixin(ctx);

      const result = mixin.getVisibleRows('n1', schema);

      // No handle means no attribute connectivity detected
      expect(result).toEqual([]);
    });

    it('deduplicates connected attributes across multiple edges', () => {
      const node = makeNode('n1', { rowFilter: 'connected' });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.edges = [
        makeEdge('e1', 'n1', 'n2', { sourceHandle: 'n1.name-r' }),
        makeEdge('e2', 'n1', 'n3', { sourceHandle: 'n1.name-r' }),
      ] as FlowEdge[];
      const mixin = createRowsMixin(ctx);

      const result = mixin.getVisibleRows('n1', schema);

      // 'name' appears once even though two edges reference it
      expect(result).toEqual([{ id: 'name', label: 'Name' }]);
    });
  });
});
