import { describe, it, expect } from 'vitest';
import type { FlowNode, FlowEdge, RowFilter } from '../../core/types';

function makeNodes(): FlowNode[] {
  return [
    { id: 'user', position: { x: 50, y: 50 }, data: { label: 'User', schema: [{ id: 'id' }, { id: 'name' }, { id: 'email' }] } },
    { id: 'post', position: { x: 340, y: 50 }, data: { label: 'Post', schema: [{ id: 'id' }, { id: 'title' }, { id: 'user_id' }] } },
    { id: 'comment', position: { x: 640, y: 50 }, data: { label: 'Comment', schema: [{ id: 'id' }, { id: 'body' }, { id: 'post_id' }] } },
  ];
}

function makeEdges(): FlowEdge[] {
  return [
    { id: 'e1', source: 'user', target: 'post', sourceHandle: 'user.id-r', targetHandle: 'post.user_id-l' },
    { id: 'e2', source: 'post', target: 'comment', sourceHandle: 'post.id-r', targetHandle: 'comment.post_id-l' },
  ];
}

function makeCanvas(nodes?: FlowNode[], edges?: FlowEdge[]) {
  const _nodes = nodes ?? makeNodes();
  const _edges = edges ?? makeEdges();
  const emitted: { event: string; detail: any }[] = [];
  const historyCaptures: number[] = [];
  const selectedRows = new Set<string>();

  return {
    nodes: _nodes,
    edges: _edges,
    selectedRows,
    getNode(id: string) { return _nodes.find(n => n.id === id); },
    getEdge(id: string) { return _edges.find(e => e.id === id); },
    _captureHistory() { historyCaptures.push(Date.now()); },
    _emit(event: string, detail: any) { emitted.push({ event, detail }); },
    emitted,
    historyCaptures,

    selectRow(rowId: string): void {
      if (selectedRows.has(rowId)) return;
      this._captureHistory();
      selectedRows.add(rowId);
      const [nodeId, attrId] = rowId.split('.');
      this._emit('row-select', { rowId, nodeId, attrId });
      this._emit('row-selection-change', { selectedRows: [...selectedRows] });
    },

    deselectRow(rowId: string): void {
      if (!selectedRows.has(rowId)) return;
      this._captureHistory();
      selectedRows.delete(rowId);
      const [nodeId, attrId] = rowId.split('.');
      this._emit('row-deselect', { rowId, nodeId, attrId });
      this._emit('row-selection-change', { selectedRows: [...selectedRows] });
    },

    toggleRowSelect(rowId: string): void {
      if (selectedRows.has(rowId)) {
        this.deselectRow(rowId);
      } else {
        this.selectRow(rowId);
      }
    },

    getSelectedRows(): string[] {
      return [...selectedRows];
    },

    isRowSelected(rowId: string): boolean {
      return selectedRows.has(rowId);
    },

    deselectAllRows(): void {
      if (selectedRows.size === 0) return;
      this._captureHistory();
      selectedRows.clear();
      this._emit('row-selection-change', { selectedRows: [] });
    },

    setRowFilter(nodeId: string, filter: RowFilter): void {
      const node = this.getNode(nodeId);
      if (!node) return;
      node.rowFilter = filter;
    },

    getRowFilter(nodeId: string): RowFilter {
      return this.getNode(nodeId)?.rowFilter ?? 'all';
    },

    getVisibleRows(nodeId: string, schema: any[]): any[] {
      const node = this.getNode(nodeId);
      if (!node) return schema;
      const filter = node.rowFilter ?? 'all';
      if (filter === 'all') return schema;

      if (typeof filter === 'function') {
        return schema.filter(filter);
      }

      const connectedAttrIds = new Set<string>();
      for (const edge of _edges) {
        if (edge.sourceHandle?.startsWith(nodeId + '.')) {
          const attrId = edge.sourceHandle.split('.')[1]?.replace(/-[lr]$/, '');
          if (attrId) connectedAttrIds.add(attrId);
        }
        if (edge.targetHandle?.startsWith(nodeId + '.')) {
          const attrId = edge.targetHandle.split('.')[1]?.replace(/-[lr]$/, '');
          if (attrId) connectedAttrIds.add(attrId);
        }
      }

      if (filter === 'connected') {
        return schema.filter(attr => connectedAttrIds.has(attr.id));
      }
      return schema.filter(attr => !connectedAttrIds.has(attr.id));
    },
  };
}

describe('selectRow', () => {
  it('adds row to selectedRows and emits events', () => {
    const canvas = makeCanvas();
    canvas.selectRow('user.id');

    expect(canvas.isRowSelected('user.id')).toBe(true);
    expect(canvas.emitted).toHaveLength(2);
    expect(canvas.emitted[0].event).toBe('row-select');
    expect(canvas.emitted[0].detail).toEqual({ rowId: 'user.id', nodeId: 'user', attrId: 'id' });
    expect(canvas.emitted[1].event).toBe('row-selection-change');
  });

  it('captures history', () => {
    const canvas = makeCanvas();
    canvas.selectRow('user.id');
    expect(canvas.historyCaptures).toHaveLength(1);
  });

  it('is a no-op if already selected', () => {
    const canvas = makeCanvas();
    canvas.selectRow('user.id');
    canvas.selectRow('user.id');
    expect(canvas.emitted).toHaveLength(2); // only first select
  });

  it('allows multi-select across nodes', () => {
    const canvas = makeCanvas();
    canvas.selectRow('user.id');
    canvas.selectRow('post.title');

    expect(canvas.getSelectedRows()).toEqual(['user.id', 'post.title']);
  });
});

describe('deselectRow', () => {
  it('removes row from selectedRows and emits events', () => {
    const canvas = makeCanvas();
    canvas.selectRow('user.id');
    canvas.deselectRow('user.id');

    expect(canvas.isRowSelected('user.id')).toBe(false);
    expect(canvas.emitted[2].event).toBe('row-deselect');
    expect(canvas.emitted[3].event).toBe('row-selection-change');
  });

  it('is a no-op if not selected', () => {
    const canvas = makeCanvas();
    canvas.deselectRow('user.id');
    expect(canvas.emitted).toHaveLength(0);
  });
});

describe('toggleRowSelect', () => {
  it('selects when not selected', () => {
    const canvas = makeCanvas();
    canvas.toggleRowSelect('user.id');
    expect(canvas.isRowSelected('user.id')).toBe(true);
  });

  it('deselects when selected', () => {
    const canvas = makeCanvas();
    canvas.selectRow('user.id');
    canvas.toggleRowSelect('user.id');
    expect(canvas.isRowSelected('user.id')).toBe(false);
  });
});

describe('deselectAllRows', () => {
  it('clears all selected rows', () => {
    const canvas = makeCanvas();
    canvas.selectRow('user.id');
    canvas.selectRow('post.title');
    canvas.deselectAllRows();

    expect(canvas.getSelectedRows()).toEqual([]);
  });

  it('is a no-op when empty', () => {
    const canvas = makeCanvas();
    canvas.deselectAllRows();
    expect(canvas.emitted).toHaveLength(0);
  });
});

describe('setRowFilter / getRowFilter', () => {
  it('defaults to all', () => {
    const canvas = makeCanvas();
    expect(canvas.getRowFilter('user')).toBe('all');
  });

  it('sets and gets filter', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', 'connected');
    expect(canvas.getRowFilter('user')).toBe('connected');
  });

  it('is a no-op for unknown node', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('nonexistent', 'connected');
    expect(canvas.getRowFilter('nonexistent')).toBe('all');
  });
});

describe('getVisibleRows', () => {
  it('returns all rows when filter is all', () => {
    const canvas = makeCanvas();
    const schema = canvas.getNode('user')!.data.schema;
    expect(canvas.getVisibleRows('user', schema)).toHaveLength(3);
  });

  it('returns only connected rows when filter is connected', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', 'connected');
    const schema = canvas.getNode('user')!.data.schema;
    const visible = canvas.getVisibleRows('user', schema);
    // user.id is connected via edge e1 (sourceHandle: 'user.id-r')
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe('id');
  });

  it('returns only unconnected rows when filter is unconnected', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', 'unconnected');
    const schema = canvas.getNode('user')!.data.schema;
    const visible = canvas.getVisibleRows('user', schema);
    // name and email are not connected
    expect(visible).toHaveLength(2);
    expect(visible.map((v: any) => v.id)).toEqual(['name', 'email']);
  });

  it('returns all rows for unknown node', () => {
    const canvas = makeCanvas();
    const schema = [{ id: 'a' }];
    expect(canvas.getVisibleRows('nonexistent', schema)).toEqual(schema);
  });
});

describe('row set computation for filter transitions', () => {
  it('all→connected: unconnected rows are filtered out', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', 'connected');
    const schema = canvas.getNode('user')!.data.schema;
    const visible = canvas.getVisibleRows('user', schema);
    expect(visible.map((v: any) => v.id)).toEqual(['id']);
  });

  it('all→unconnected: connected rows are filtered out', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', 'unconnected');
    const schema = canvas.getNode('user')!.data.schema;
    const visible = canvas.getVisibleRows('user', schema);
    expect(visible.map((v: any) => v.id)).toEqual(['name', 'email']);
  });

  it('connected→unconnected: connected exit, unconnected enter', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', 'connected');
    let schema = canvas.getNode('user')!.data.schema;
    expect(canvas.getVisibleRows('user', schema).map((v: any) => v.id)).toEqual(['id']);

    canvas.setRowFilter('user', 'unconnected');
    schema = canvas.getNode('user')!.data.schema;
    const visible = canvas.getVisibleRows('user', schema);
    expect(visible.map((v: any) => v.id)).toEqual(['name', 'email']);
  });

  it('connected→all: all rows visible', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', 'connected');
    canvas.setRowFilter('user', 'all');
    const schema = canvas.getNode('user')!.data.schema;
    expect(canvas.getVisibleRows('user', schema)).toHaveLength(3);
  });
});

describe('setRowFilter with predicate', () => {
  it('filters rows by custom predicate', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', (row: any) => row.id !== 'email');
    const schema = canvas.getNode('user')!.data.schema;
    const visible = canvas.getVisibleRows('user', schema);
    expect(visible.map((v: any) => v.id)).toEqual(['id', 'name']);
  });

  it('getRowFilter returns the predicate function', () => {
    const canvas = makeCanvas();
    const predicate = (row: any) => row.id === 'id';
    canvas.setRowFilter('user', predicate);
    expect(canvas.getRowFilter('user')).toBe(predicate);
  });

  it('predicate accepting all rows returns all', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', () => true);
    const schema = canvas.getNode('user')!.data.schema;
    expect(canvas.getVisibleRows('user', schema)).toHaveLength(3);
  });

  it('predicate rejecting all rows returns empty', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', () => false);
    const schema = canvas.getNode('user')!.data.schema;
    expect(canvas.getVisibleRows('user', schema)).toHaveLength(0);
  });

  it('switching from predicate to preset works', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', (row: any) => row.id === 'id');
    canvas.setRowFilter('user', 'all');
    const schema = canvas.getNode('user')!.data.schema;
    expect(canvas.getVisibleRows('user', schema)).toHaveLength(3);
  });

  it('switching from preset to predicate works', () => {
    const canvas = makeCanvas();
    canvas.setRowFilter('user', 'connected');
    canvas.setRowFilter('user', (row: any) => row.id === 'name');
    const schema = canvas.getNode('user')!.data.schema;
    const visible = canvas.getVisibleRows('user', schema);
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe('name');
  });
});
