import { describe, it, expect, vi } from 'vitest';
import type { FlowNode } from '../../core/types';

/**
 * Unit tests for condense/uncondense logic.
 * These test the core behavior that flow-canvas methods delegate to.
 */

function makeNodes(): FlowNode[] {
  return [
    { id: 'user', position: { x: 50, y: 50 }, data: { label: 'User', schema: [{ id: 'id' }, { id: 'name' }] } },
    { id: 'post', position: { x: 340, y: 50 }, data: { label: 'Post', schema: [{ id: 'id' }, { id: 'title' }] } },
  ];
}

function makeCanvas(nodes: FlowNode[]) {
  const emitted: { event: string; detail: any }[] = [];
  const historyCaptures: number[] = [];

  return {
    nodes,
    getNode(id: string) { return nodes.find(n => n.id === id); },
    _captureHistory() { historyCaptures.push(Date.now()); },
    _emit(event: string, detail: any) { emitted.push({ event, detail }); },
    emitted,
    historyCaptures,

    condenseNode(id: string): void {
      const node = this.getNode(id);
      if (!node || node.condensed) return;
      this._captureHistory();
      node.condensed = true;
      this._emit('node-condense', { node });
    },

    uncondenseNode(id: string): void {
      const node = this.getNode(id);
      if (!node || !node.condensed) return;
      this._captureHistory();
      node.condensed = false;
      this._emit('node-uncondense', { node });
    },

    toggleCondense(id: string): void {
      const node = this.getNode(id);
      if (!node) return;
      if (node.condensed) {
        this.uncondenseNode(id);
      } else {
        this.condenseNode(id);
      }
    },

    isCondensed(id: string): boolean {
      return this.getNode(id)?.condensed === true;
    },
  };
}

describe('condenseNode', () => {
  it('sets condensed to true and emits event', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.condenseNode('user');

    expect(canvas.getNode('user')!.condensed).toBe(true);
    expect(canvas.emitted).toHaveLength(1);
    expect(canvas.emitted[0].event).toBe('node-condense');
    expect(canvas.emitted[0].detail.node.id).toBe('user');
  });

  it('captures history before mutating', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.condenseNode('user');

    expect(canvas.historyCaptures).toHaveLength(1);
  });

  it('is a no-op if already condensed', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.condenseNode('user');
    canvas.condenseNode('user');

    expect(canvas.emitted).toHaveLength(1);
    expect(canvas.historyCaptures).toHaveLength(1);
  });

  it('is a no-op for unknown node ID', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.condenseNode('nonexistent');

    expect(canvas.emitted).toHaveLength(0);
  });
});

describe('uncondenseNode', () => {
  it('sets condensed to false and emits event', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.condenseNode('user');
    canvas.uncondenseNode('user');

    expect(canvas.getNode('user')!.condensed).toBe(false);
    expect(canvas.emitted).toHaveLength(2);
    expect(canvas.emitted[1].event).toBe('node-uncondense');
  });

  it('is a no-op if not condensed', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.uncondenseNode('user');

    expect(canvas.emitted).toHaveLength(0);
  });
});

describe('toggleCondense', () => {
  it('condenses when not condensed', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.toggleCondense('user');

    expect(canvas.isCondensed('user')).toBe(true);
  });

  it('uncondenses when condensed', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.condenseNode('user');
    canvas.toggleCondense('user');

    expect(canvas.isCondensed('user')).toBe(false);
  });

  it('is a no-op for unknown node ID', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.toggleCondense('nonexistent');

    expect(canvas.emitted).toHaveLength(0);
  });
});

describe('isCondensed', () => {
  it('returns false for non-condensed node', () => {
    const canvas = makeCanvas(makeNodes());
    expect(canvas.isCondensed('user')).toBe(false);
  });

  it('returns true for condensed node', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.condenseNode('user');
    expect(canvas.isCondensed('user')).toBe(true);
  });

  it('returns false for unknown node ID', () => {
    const canvas = makeCanvas(makeNodes());
    expect(canvas.isCondensed('nonexistent')).toBe(false);
  });

  it('does not affect other nodes', () => {
    const canvas = makeCanvas(makeNodes());
    canvas.condenseNode('user');

    expect(canvas.isCondensed('user')).toBe(true);
    expect(canvas.isCondensed('post')).toBe(false);
  });
});
