// @vitest-environment jsdom
// ============================================================================
// Change-event origin discriminator (WS5).
//
// nodes-change / edges-change carry an `origin` ∈ {'drop','paste','api','load'}
// so consumers can react only to user intent (e.g. "user dropped a node → POST")
// instead of every bulk/api/undo mutation. The mutators thread a `source` option
// (default 'api'); call sites stamp 'drop' (drop handler) and 'paste' (paste).
// ============================================================================

import { describe, it, expect, vi, afterEach } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlow from '../../index';
import { mockCtx } from './__test-utils';
import { createNodesMixin } from './canvas-nodes';
import { createEdgesMixin } from './canvas-edges';
import { createSelectionMixin } from './canvas-selection';
import * as clipboard from '../../core/clipboard';
import type { FlowNode, FlowEdge, FlowCanvasConfig } from '../../core/types';

function makeNode(id: string): FlowNode {
  return { id, type: 'default', position: { x: 0, y: 0 }, data: {}, dimensions: { width: 100, height: 50 } } as FlowNode;
}
function makeEdge(id: string): FlowEdge {
  return { id, source: 'a', target: 'b' } as FlowEdge;
}

describe('change-event origin — mutators', () => {
  it('addNodes emits nodes-change with origin "api" by default', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    mixin.addNodes([makeNode('n1')]);
    expect(ctx._emit).toHaveBeenCalledWith(
      'nodes-change',
      expect.objectContaining({ type: 'add', origin: 'api' }),
    );
  });

  it('addNodes threads a source override into origin', () => {
    const ctx = mockCtx();
    const mixin = createNodesMixin(ctx);
    mixin.addNodes([makeNode('n1')], { source: 'drop' });
    expect(ctx._emit).toHaveBeenCalledWith(
      'nodes-change',
      expect.objectContaining({ origin: 'drop' }),
    );
  });

  it('removeNodes emits nodes-change with origin', () => {
    const n = makeNode('n1');
    const ctx = mockCtx({ nodes: [n] });
    ctx._nodeMap.set('n1', n);
    const mixin = createNodesMixin(ctx);
    mixin.removeNodes('n1');
    expect(ctx._emit).toHaveBeenCalledWith(
      'nodes-change',
      expect.objectContaining({ type: 'remove', origin: 'api' }),
    );
  });

  it('addEdges emits edges-change with origin', () => {
    const ctx = mockCtx();
    const mixin = createEdgesMixin(ctx);
    mixin.addEdges([makeEdge('e1')]);
    expect(ctx._emit).toHaveBeenCalledWith(
      'edges-change',
      expect.objectContaining({ type: 'add', origin: 'api' }),
    );
  });

  it('removeEdges emits edges-change with origin', () => {
    const e = makeEdge('e1');
    const ctx = mockCtx({ edges: [e] });
    ctx._edgeMap.set('e1', e);
    const mixin = createEdgesMixin(ctx);
    mixin.removeEdges('e1');
    expect(ctx._emit).toHaveBeenCalledWith(
      'edges-change',
      expect.objectContaining({ type: 'remove', origin: 'api' }),
    );
  });
});

describe('change-event origin — paste', () => {
  afterEach(() => vi.restoreAllMocks());

  it('paste stamps origin "paste" on both change events', () => {
    vi.spyOn(clipboard, 'pasteClipboard').mockReturnValue({
      nodes: [makeNode('p1')],
      edges: [makeEdge('pe1')],
    });
    const ctx = mockCtx();
    const mixin = createSelectionMixin(ctx);
    mixin.paste();
    expect(ctx._emit).toHaveBeenCalledWith('nodes-change', expect.objectContaining({ origin: 'paste' }));
    expect(ctx._emit).toHaveBeenCalledWith('edges-change', expect.objectContaining({ origin: 'paste' }));
  });
});

describe('change-event origin — drop call site', () => {
  let pluginRegistered = false;
  const mounted: HTMLElement[] = [];

  function mountCanvas(config: FlowCanvasConfig = {}): any {
    if (!pluginRegistered) {
      (window as any).Alpine = Alpine;
      Alpine.plugin(AlpineFlow);
      Alpine.start();
      pluginRegistered = true;
    }
    const wrapper = document.createElement('div');
    (wrapper as any).__config = config;
    const canvas = document.createElement('div');
    canvas.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
    canvas.className = 'flow-container';
    wrapper.appendChild(canvas);
    document.body.appendChild(wrapper);
    mounted.push(wrapper);
    Alpine.initTree(wrapper);
    return Alpine.$data(canvas);
  }

  afterEach(() => {
    while (mounted.length) mounted.pop()?.remove();
  });

  it('a drop stamps origin "drop" on the nodes-change event', () => {
    const canvas = mountCanvas({
      onDrop: (detail: any) => ({ id: 'dropped', position: detail.position, data: {} }),
    });
    const container = canvas._container as HTMLElement;
    (document as any).elementsFromPoint = () => [];

    let captured: any;
    container.addEventListener('flow-nodes-change', (e: any) => {
      captured = e.detail;
    });

    canvas._onDropZoneDrop({
      preventDefault: () => {},
      target: container,
      clientX: 20,
      clientY: 20,
      dataTransfer: {
        types: ['application/alpineflow'],
        getData: (m: string) => (m === 'application/alpineflow' ? JSON.stringify({ label: 'X' }) : ''),
      },
    });

    expect(captured).toBeDefined();
    expect(captured.origin).toBe('drop');
  });
});
