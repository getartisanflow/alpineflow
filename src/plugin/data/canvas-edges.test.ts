// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { mockCtx } from './__test-utils';
import { createEdgesMixin } from './canvas-edges';
import type { FlowEdge } from '../../core/types';

// jsdom doesn't implement CSS.escape — polyfill it (W3C spec algorithm)
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string): string => {
      const str = String(value);
      const len = str.length;
      let result = '';
      for (let i = 0; i < len; i++) {
        const ch = str.charCodeAt(i);
        if (ch === 0x0000) { result += '\uFFFD'; continue; }
        if (
          (ch >= 0x0001 && ch <= 0x001F) || ch === 0x007F ||
          (i === 0 && ch >= 0x0030 && ch <= 0x0039) ||
          (i === 1 && ch >= 0x0030 && ch <= 0x0039 && str.charCodeAt(0) === 0x002D)
        ) {
          result += '\\' + ch.toString(16) + ' ';
          continue;
        }
        if (i === 0 && len === 1 && ch === 0x002D) { result += '\\' + str.charAt(i); continue; }
        if (
          ch >= 0x0080 ||
          ch === 0x002D || ch === 0x005F ||
          (ch >= 0x0030 && ch <= 0x0039) ||
          (ch >= 0x0041 && ch <= 0x005A) ||
          (ch >= 0x0061 && ch <= 0x007A)
        ) {
          result += str.charAt(i);
          continue;
        }
        result += '\\' + str.charAt(i);
      }
      return result;
    };
  }
});

function makeEdge(id: string, overrides: Partial<FlowEdge> = {}): FlowEdge {
  return { id, source: 'a', target: 'b', ...overrides };
}

// ── addEdges ─────────────────────────────────────────────────────────────────

describe('createEdgesMixin — addEdges', () => {
  it('adds a single edge', () => {
    const ctx = mockCtx();
    const mixin = createEdgesMixin(ctx);
    const edge = makeEdge('e1');

    mixin.addEdges(edge);

    expect(ctx.edges).toHaveLength(1);
    expect(ctx.edges[0].id).toBe('e1');
  });

  it('adds an array of edges', () => {
    const ctx = mockCtx();
    const mixin = createEdgesMixin(ctx);
    const edges = [makeEdge('e1'), makeEdge('e2'), makeEdge('e3')];

    mixin.addEdges(edges);

    expect(ctx.edges).toHaveLength(3);
    expect(ctx.edges.map((e: FlowEdge) => e.id)).toEqual(['e1', 'e2', 'e3']);
  });

  it('merges defaultEdgeOptions from config (edge-specific props override defaults)', () => {
    const ctx = mockCtx({
      _config: {
        defaultEdgeOptions: { type: 'smoothstep', animated: true },
      } as any,
    });
    const mixin = createEdgesMixin(ctx);
    const edge = makeEdge('e1', { type: 'bezier' });

    mixin.addEdges(edge);

    // Edge-specific type should override default
    expect(ctx.edges[0].type).toBe('bezier');
    // Default animated should be merged in
    expect(ctx.edges[0].animated).toBe(true);
  });

  it('does not mutate edges when no defaultEdgeOptions configured', () => {
    const ctx = mockCtx({ _config: {} as any });
    const mixin = createEdgesMixin(ctx);
    const edge = makeEdge('e1', { type: 'straight' });

    mixin.addEdges(edge);

    expect(ctx.edges[0].type).toBe('straight');
    expect(ctx.edges[0]).toEqual(edge);
  });

  it('captures history before mutation', () => {
    const ctx = mockCtx();
    const mixin = createEdgesMixin(ctx);

    mixin.addEdges(makeEdge('e1'));

    expect(ctx._captureHistory).toHaveBeenCalledOnce();
  });

  it('rebuilds edge map after adding', () => {
    const ctx = mockCtx();
    const mixin = createEdgesMixin(ctx);

    mixin.addEdges(makeEdge('e1'));

    expect(ctx._rebuildEdgeMap).toHaveBeenCalledOnce();
  });

  it('emits edges-change event with type "add"', () => {
    const ctx = mockCtx();
    const mixin = createEdgesMixin(ctx);
    const edge = makeEdge('e1');

    mixin.addEdges(edge);

    expect(ctx._emit).toHaveBeenCalledWith('edges-change', {
      type: 'add',
      edges: [edge],
    });
  });

  it('schedules auto-layout after adding', () => {
    const ctx = mockCtx();
    const mixin = createEdgesMixin(ctx);

    mixin.addEdges(makeEdge('e1'));

    expect(ctx._scheduleAutoLayout).toHaveBeenCalledOnce();
  });

  it('merges defaultEdgeOptions with defaults spread first (edge wins)', () => {
    const ctx = mockCtx({
      _config: {
        defaultEdgeOptions: { type: 'smoothstep', animated: true, label: 'default' },
      } as any,
    });
    const mixin = createEdgesMixin(ctx);
    const edge = makeEdge('e1', { label: 'custom' } as any);

    mixin.addEdges(edge);

    expect(ctx.edges[0].label).toBe('custom');
    expect(ctx.edges[0].animated).toBe(true);
    expect(ctx.edges[0].type).toBe('smoothstep');
  });
});

// ── removeEdges ──────────────────────────────────────────────────────────────

describe('createEdgesMixin — removeEdges', () => {
  it('removes a single edge by ID', () => {
    const e1 = makeEdge('e1');
    const e2 = makeEdge('e2');
    const ctx = mockCtx({ edges: [e1, e2] });
    const mixin = createEdgesMixin(ctx);

    mixin.removeEdges('e1');

    expect(ctx.edges).toHaveLength(1);
    expect(ctx.edges[0].id).toBe('e2');
  });

  it('removes multiple edges by ID array', () => {
    const e1 = makeEdge('e1');
    const e2 = makeEdge('e2');
    const e3 = makeEdge('e3');
    const ctx = mockCtx({ edges: [e1, e2, e3] });
    const mixin = createEdgesMixin(ctx);

    mixin.removeEdges(['e1', 'e3']);

    expect(ctx.edges).toHaveLength(1);
    expect(ctx.edges[0].id).toBe('e2');
  });

  it('handles nonexistent ID gracefully (no emit)', () => {
    const e1 = makeEdge('e1');
    const ctx = mockCtx({ edges: [e1] });
    const mixin = createEdgesMixin(ctx);

    mixin.removeEdges('nonexistent');

    expect(ctx.edges).toHaveLength(1);
    // Should not emit edges-change when nothing was actually removed
    expect(ctx._emit).not.toHaveBeenCalledWith(
      'edges-change',
      expect.objectContaining({ type: 'remove' }),
    );
  });

  it('captures history before mutation', () => {
    const ctx = mockCtx({ edges: [makeEdge('e1')] });
    const mixin = createEdgesMixin(ctx);

    mixin.removeEdges('e1');

    expect(ctx._captureHistory).toHaveBeenCalledOnce();
  });

  it('rebuilds edge map after removing', () => {
    const ctx = mockCtx({ edges: [makeEdge('e1')] });
    const mixin = createEdgesMixin(ctx);

    mixin.removeEdges('e1');

    expect(ctx._rebuildEdgeMap).toHaveBeenCalledOnce();
  });

  it('deselects removed edges', () => {
    const ctx = mockCtx({ edges: [makeEdge('e1'), makeEdge('e2')] });
    ctx.selectedEdges.add('e1');
    ctx.selectedEdges.add('e2');
    const mixin = createEdgesMixin(ctx);

    mixin.removeEdges('e1');

    expect(ctx.selectedEdges.has('e1')).toBe(false);
    expect(ctx.selectedEdges.has('e2')).toBe(true);
  });

  it('emits edges-change event with type "remove" and removed edges', () => {
    const e1 = makeEdge('e1');
    const e2 = makeEdge('e2');
    const ctx = mockCtx({ edges: [e1, e2] });
    const mixin = createEdgesMixin(ctx);

    mixin.removeEdges('e1');

    expect(ctx._emit).toHaveBeenCalledWith('edges-change', {
      type: 'remove',
      edges: [e1],
    });
  });

  it('schedules auto-layout after removing', () => {
    const ctx = mockCtx({ edges: [makeEdge('e1')] });
    const mixin = createEdgesMixin(ctx);

    mixin.removeEdges('e1');

    expect(ctx._scheduleAutoLayout).toHaveBeenCalledOnce();
  });
});

// ── getEdge ──────────────────────────────────────────────────────────────────

describe('createEdgesMixin — getEdge', () => {
  it('returns edge when found in map', () => {
    const e1 = makeEdge('e1');
    const ctx = mockCtx();
    ctx._edgeMap.set('e1', e1);
    const mixin = createEdgesMixin(ctx);

    expect(mixin.getEdge('e1')).toBe(e1);
  });

  it('returns undefined when edge not found', () => {
    const ctx = mockCtx();
    const mixin = createEdgesMixin(ctx);

    expect(mixin.getEdge('nonexistent')).toBeUndefined();
  });
});

// ── getEdgePathElement ───────────────────────────────────────────────────────

describe('createEdgesMixin — getEdgePathElement', () => {
  it('returns the second path child element', () => {
    const hitAreaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const visiblePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-flow-edge-id', 'e1');
    g.appendChild(hitAreaPath);
    g.appendChild(visiblePath);

    const container = document.createElement('div');
    container.appendChild(g);

    const ctx = mockCtx({ _container: container });
    const mixin = createEdgesMixin(ctx);

    const result = mixin.getEdgePathElement('e1');

    expect(result).toBe(visiblePath);
  });

  it('returns falsy when edge element not found', () => {
    const container = document.createElement('div');
    const ctx = mockCtx({ _container: container });
    const mixin = createEdgesMixin(ctx);

    // querySelector returns null for g, then g?.querySelector returns undefined
    expect(mixin.getEdgePathElement('nonexistent')).toBeFalsy();
  });

  it('returns null/undefined when container is null', () => {
    const ctx = mockCtx({ _container: null });
    const mixin = createEdgesMixin(ctx);

    // Optional chaining on null container returns undefined
    expect(mixin.getEdgePathElement('e1')).toBeFalsy();
  });
});

// ── getEdgeElement ───────────────────────────────────────────────────────────

describe('createEdgesMixin — getEdgeElement', () => {
  it('returns the edge group element', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-flow-edge-id', 'e1');

    const container = document.createElement('div');
    container.appendChild(g);

    const ctx = mockCtx({ _container: container });
    const mixin = createEdgesMixin(ctx);

    const result = mixin.getEdgeElement('e1');

    expect(result).toBe(g);
  });

  it('returns null when edge element not found', () => {
    const container = document.createElement('div');
    const ctx = mockCtx({ _container: container });
    const mixin = createEdgesMixin(ctx);

    expect(mixin.getEdgeElement('nonexistent')).toBeNull();
  });

  it('returns null/undefined when container is null', () => {
    const ctx = mockCtx({ _container: null });
    const mixin = createEdgesMixin(ctx);

    // Optional chaining on null container returns undefined
    expect(mixin.getEdgeElement('e1')).toBeFalsy();
  });

  it('handles edge IDs with special characters via CSS.escape', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-flow-edge-id', 'edge:1.2');

    const container = document.createElement('div');
    container.appendChild(g);

    const ctx = mockCtx({ _container: container });
    const mixin = createEdgesMixin(ctx);

    const result = mixin.getEdgeElement('edge:1.2');

    expect(result).toBe(g);
  });
});
