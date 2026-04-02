import { describe, it, expect } from 'vitest';
import type { FlowNode } from '../../core/types';

function makeNodes(): FlowNode[] {
  return [
    { id: 'user', position: { x: 50, y: 50 }, data: { label: 'User' } },
    { id: 'post', position: { x: 340, y: 50 }, data: { label: 'Post' } },
    { id: 'comment', position: { x: 640, y: 50 }, data: { label: 'Comment' } },
  ];
}

function makeCanvas(nodes?: FlowNode[]) {
  const _nodes = nodes ?? makeNodes();
  const emitted: { event: string; detail: any }[] = [];

  return {
    nodes: _nodes,
    getNode(id: string) { return _nodes.find(n => n.id === id); },
    _emit(event: string, detail: any) { emitted.push({ event, detail }); },
    emitted,

    setNodeFilter(predicate: (node: FlowNode) => boolean): void {
      const filtered: FlowNode[] = [];
      const visible: FlowNode[] = [];
      for (const node of this.nodes as FlowNode[]) {
        const shouldFilter = !predicate(node);
        node.filtered = shouldFilter;
        if (shouldFilter) {
          filtered.push(node);
        } else {
          visible.push(node);
        }
      }
      this._emit('node-filter-change', { filtered, visible });
    },

    clearNodeFilter(): void {
      let hadFiltered = false;
      for (const node of this.nodes as FlowNode[]) {
        if (node.filtered) {
          node.filtered = false;
          hadFiltered = true;
        }
      }
      if (hadFiltered) {
        this._emit('node-filter-change', { filtered: [], visible: [...this.nodes] });
      }
    },
  };
}

describe('setNodeFilter', () => {
  it('sets filtered on nodes failing predicate', () => {
    const canvas = makeCanvas();
    canvas.setNodeFilter(n => n.id === 'user');

    expect(canvas.getNode('user')!.filtered).toBe(false);
    expect(canvas.getNode('post')!.filtered).toBe(true);
    expect(canvas.getNode('comment')!.filtered).toBe(true);
  });

  it('emits node-filter-change with filtered and visible arrays', () => {
    const canvas = makeCanvas();
    canvas.setNodeFilter(n => n.id === 'user');

    expect(canvas.emitted).toHaveLength(1);
    expect(canvas.emitted[0].event).toBe('node-filter-change');
    expect(canvas.emitted[0].detail.visible).toHaveLength(1);
    expect(canvas.emitted[0].detail.visible[0].id).toBe('user');
    expect(canvas.emitted[0].detail.filtered).toHaveLength(2);
  });

  it('predicate returning true for all — no nodes filtered', () => {
    const canvas = makeCanvas();
    canvas.setNodeFilter(() => true);

    for (const node of canvas.nodes) {
      expect(node.filtered).toBe(false);
    }
    expect(canvas.emitted[0].detail.filtered).toHaveLength(0);
    expect(canvas.emitted[0].detail.visible).toHaveLength(3);
  });

  it('predicate returning false for all — all nodes filtered', () => {
    const canvas = makeCanvas();
    canvas.setNodeFilter(() => false);

    for (const node of canvas.nodes) {
      expect(node.filtered).toBe(true);
    }
    expect(canvas.emitted[0].detail.filtered).toHaveLength(3);
    expect(canvas.emitted[0].detail.visible).toHaveLength(0);
  });

  it('replacing a filter overwrites the previous one', () => {
    const canvas = makeCanvas();
    canvas.setNodeFilter(n => n.id === 'user');
    canvas.setNodeFilter(n => n.id === 'post');

    expect(canvas.getNode('user')!.filtered).toBe(true);
    expect(canvas.getNode('post')!.filtered).toBe(false);
    expect(canvas.getNode('comment')!.filtered).toBe(true);
    expect(canvas.emitted).toHaveLength(2);
  });
});

describe('clearNodeFilter', () => {
  it('sets filtered to false on all nodes', () => {
    const canvas = makeCanvas();
    canvas.setNodeFilter(n => n.id === 'user');
    canvas.clearNodeFilter();

    for (const node of canvas.nodes) {
      expect(node.filtered).toBe(false);
    }
  });

  it('emits with empty filtered array', () => {
    const canvas = makeCanvas();
    canvas.setNodeFilter(n => n.id === 'user');
    canvas.clearNodeFilter();

    expect(canvas.emitted).toHaveLength(2);
    expect(canvas.emitted[1].event).toBe('node-filter-change');
    expect(canvas.emitted[1].detail.filtered).toHaveLength(0);
    expect(canvas.emitted[1].detail.visible).toHaveLength(3);
  });

  it('is a no-op when no nodes are filtered', () => {
    const canvas = makeCanvas();
    canvas.clearNodeFilter();

    expect(canvas.emitted).toHaveLength(0);
  });

  it('is a no-op on second call', () => {
    const canvas = makeCanvas();
    canvas.setNodeFilter(n => n.id === 'user');
    canvas.clearNodeFilter();
    canvas.clearNodeFilter();

    expect(canvas.emitted).toHaveLength(2);
  });
});
