// @vitest-environment jsdom
// ============================================================================
// replaceNodes / setNodes + _whenMeasured (WS7).
//
// First-class whole-graph replace built on the identity-preserving fromObject
// path (no parallel hard-clear). replaceNodes/setNodes resolve once the new
// nodes are measured — so an immediate fitView() actually fits — via the shared
// _whenMeasured() helper extracted from fitView's rAF-retry.
// ============================================================================

import { describe, it, expect, vi } from 'vitest';
import { mockCtx } from './__test-utils';
import { createViewportMixin } from './canvas-viewport';
import { createHistoryMixin } from './canvas-history';
import type { FlowNode, FlowEdge } from '../../core/types';

function node(id: string, dimensions: any = { width: 100, height: 50 }): FlowNode {
  return { id, type: 'default', position: { x: 0, y: 0 }, data: {}, dimensions } as FlowNode;
}
function edge(id: string, source: string, target: string): FlowEdge {
  return { id, source, target } as FlowEdge;
}

/** Assemble a ctx with the real viewport + history mixins merged on.
 *  defineProperties (not Object.assign) so accessor props like `colorMode`
 *  copy as getters instead of being invoked and re-set. */
function wire(overrides: Parameters<typeof mockCtx>[0] = {}) {
  const ctx = mockCtx(overrides);
  Object.defineProperties(ctx, {
    ...Object.getOwnPropertyDescriptors(createViewportMixin(ctx)),
    ...Object.getOwnPropertyDescriptors(createHistoryMixin(ctx)),
  });
  return ctx;
}

describe('_whenMeasured', () => {
  it('resolves true when all nodes have dimensions', async () => {
    const ctx = mockCtx({ nodes: [node('n1')] });
    const vp = createViewportMixin(ctx);
    expect(await vp._whenMeasured()).toBe(true);
  });

  it('resolves false when nodes never measure within the retry budget', async () => {
    // A genuinely unmeasured node (no `dimensions`).
    const unmeasured = { id: 'n1', type: 'default', position: { x: 0, y: 0 }, data: {} } as FlowNode;
    const ctx = mockCtx({ nodes: [unmeasured] });
    const vp = createViewportMixin(ctx);
    const raf = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
    expect(await vp._whenMeasured()).toBe(false);
    raf.mockRestore();
  });
});

describe('replaceNodes / setNodes', () => {
  it('replaceNodes swaps the whole graph (nodes + edges)', async () => {
    const ctx = wire();
    ctx.edges.push(edge('old', 'a', 'b'));

    await ctx.replaceNodes([node('n1'), node('n2')], [edge('e1', 'n1', 'n2')]);

    expect(ctx.nodes.map((n: FlowNode) => n.id)).toEqual(['n1', 'n2']);
    expect(ctx.edges.map((e: FlowEdge) => e.id)).toEqual(['e1']);
  });

  it('replaceNodes without edges clears edges (whole-graph replace)', async () => {
    const ctx = wire();
    ctx.edges.push(edge('old', 'a', 'b'));

    await ctx.replaceNodes([node('n1')]);

    expect(ctx.nodes.map((n: FlowNode) => n.id)).toEqual(['n1']);
    expect(ctx.edges).toHaveLength(0);
  });

  it('replaceNodes emits a restore event tagged origin "load"', async () => {
    const ctx = wire();
    await ctx.replaceNodes([node('n1')]);
    expect(ctx._emit).toHaveBeenCalledWith('restore', expect.objectContaining({ origin: 'load' }));
  });

  it('setNodes replaces the nodes but keeps existing edges', async () => {
    const ctx = wire();
    ctx.edges.push(edge('keep', 'a', 'b'));

    await ctx.setNodes([node('n1')]);

    expect(ctx.nodes.map((n: FlowNode) => n.id)).toEqual(['n1']);
    expect(ctx.edges.map((e: FlowEdge) => e.id)).toEqual(['keep']);
  });

  it('replaceNodes then an immediate fitView fits (nodes are measured)', async () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = wire({
      _panZoom: panZoom as any,
      _config: { nodeOrigin: [0, 0], minZoom: 0.5, maxZoom: 2 } as any,
    });

    await ctx.replaceNodes([node('n1'), node('n2')]);
    for (const n of ctx.nodes) ctx._nodeMap.set(n.id, n);

    const fitted = await ctx.fitView();

    expect(fitted).toBe(true);
    expect(panZoom.setViewport).toHaveBeenCalled();
  });
});
