import { describe, it, expect, vi } from 'vitest';
import { mockCtx } from './__test-utils';
import { createCollapseMixin } from './canvas-collapse';
import type { FlowNode } from '../../core/types';
import type { CollapseState } from '../../core/collapse';

// Mock core modules
vi.mock('../../core/collapse', () => ({
  getCollapseTargets: vi.fn(() => new Set()),
  captureCollapseState: vi.fn(() => ({
    targetPositions: new Map(),
    reroutedEdges: new Map(),
  })),
  applyCollapse: vi.fn(),
  applyExpand: vi.fn(),
  rerouteEdgesForCollapse: vi.fn(() => new Map()),
  restoreReroutedEdges: vi.fn(),
}));

vi.mock('../../core/sub-flow', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    getDescendantIds: vi.fn(() => new Set()),
  };
});

import {
  getCollapseTargets,
  captureCollapseState,
  applyCollapse,
  applyExpand,
  rerouteEdgesForCollapse,
  restoreReroutedEdges,
} from '../../core/collapse';
import { getDescendantIds } from '../../core/sub-flow';

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return { id, type: 'default', position: { x: 0, y: 0 }, data: {}, ...overrides };
}

describe('createCollapseMixin', () => {
  // ── collapseNode ──────────────────────────────────────────────────────

  describe('collapseNode', () => {
    it('skips if node is already collapsed', () => {
      const node = makeNode('n1', { collapsed: true });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCollapseMixin(ctx);

      mixin.collapseNode('n1');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });

    it('skips if node does not exist', () => {
      const ctx = mockCtx();
      const mixin = createCollapseMixin(ctx);

      mixin.collapseNode('missing');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
    });

    it('skips if no collapse targets', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      vi.mocked(getCollapseTargets).mockReturnValueOnce(new Set());
      const mixin = createCollapseMixin(ctx);

      mixin.collapseNode('n1');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });

    it('without animation calls applyCollapse, sets collapseState, and emits', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.nodes = [node];

      const targets = new Set(['n2', 'n3']);
      vi.mocked(getCollapseTargets).mockReturnValueOnce(targets);

      const fakeState: CollapseState = {
        targetPositions: new Map([['n2', { x: 10, y: 20 }]]),
        reroutedEdges: new Map(),
      };
      vi.mocked(captureCollapseState).mockReturnValueOnce(fakeState);
      vi.mocked(rerouteEdgesForCollapse).mockReturnValueOnce(new Map());

      const mixin = createCollapseMixin(ctx);
      mixin.collapseNode('n1', { animate: false });

      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(applyCollapse).toHaveBeenCalledWith(node, ctx.nodes, fakeState, undefined);
      expect(rerouteEdgesForCollapse).toHaveBeenCalledWith('n1', ctx.edges, targets);
      expect(ctx._collapseState.get('n1')).toBe(fakeState);
      expect(ctx._emit).toHaveBeenCalledWith('node-collapse', {
        node,
        descendants: [...targets],
      });
    });

    it('with animation calls ctx.animate and suspends history', () => {
      const node = makeNode('n1');
      const child = makeNode('n2', { parentId: 'n1' });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx._nodeMap.set('n2', child);
      ctx.nodes = [node, child];
      ctx.edges = [];

      const targets = new Set(['n2']);
      vi.mocked(getCollapseTargets).mockReturnValueOnce(targets);

      const fakeState: CollapseState = {
        targetPositions: new Map([['n2', { x: 5, y: 5 }]]),
        reroutedEdges: new Map(),
      };
      vi.mocked(captureCollapseState).mockReturnValueOnce(fakeState);

      const mixin = createCollapseMixin(ctx);
      mixin.collapseNode('n1', { animate: true });

      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(ctx._suspendHistory).toHaveBeenCalledOnce();
      expect(ctx.animate).toHaveBeenCalledOnce();

      // Verify animate was called with correct shape
      const animateCall = vi.mocked(ctx.animate).mock.calls[0];
      expect(animateCall[0]).toHaveProperty('nodes');
      expect(animateCall[1]).toMatchObject({ duration: 300, easing: 'easeInOut' });
    });
  });

  // ── expandNode ────────────────────────────────────────────────────────

  describe('expandNode', () => {
    it('skips if node is not collapsed', () => {
      const node = makeNode('n1', { collapsed: false });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCollapseMixin(ctx);

      mixin.expandNode('n1');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });

    it('skips if node does not exist', () => {
      const ctx = mockCtx();
      const mixin = createCollapseMixin(ctx);

      mixin.expandNode('missing');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
    });

    it('skips if no collapse state saved', () => {
      const node = makeNode('n1', { collapsed: true });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      // _collapseState is empty by default
      const mixin = createCollapseMixin(ctx);

      mixin.expandNode('n1');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });

    it('without animation calls applyExpand, deletes collapseState, and emits', () => {
      const node = makeNode('n1', { collapsed: true });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.nodes = [node];

      const fakeState: CollapseState = {
        targetPositions: new Map([['n2', { x: 10, y: 20 }]]),
        reroutedEdges: new Map(),
      };
      ctx._collapseState.set('n1', fakeState);

      const mixin = createCollapseMixin(ctx);
      mixin.expandNode('n1', { animate: false });

      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(applyExpand).toHaveBeenCalledWith(node, ctx.nodes, fakeState, false);
      expect(ctx._collapseState.has('n1')).toBe(false);
      expect(ctx._emit).toHaveBeenCalledWith('node-expand', {
        node,
        descendants: ['n2'],
      });
    });

    it('with animation calls ctx.animate and suspends history', () => {
      const node = makeNode('n1', { collapsed: true });
      const child = makeNode('n2');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx._nodeMap.set('n2', child);
      ctx.nodes = [node, child];
      ctx.edges = [];

      const fakeState: CollapseState = {
        targetPositions: new Map([['n2', { x: 10, y: 20 }]]),
        reroutedEdges: new Map(),
      };
      ctx._collapseState.set('n1', fakeState);

      const mixin = createCollapseMixin(ctx);
      mixin.expandNode('n1', { animate: true });

      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(ctx._suspendHistory).toHaveBeenCalledOnce();
      expect(ctx.animate).toHaveBeenCalledOnce();
      expect(ctx._flushNodeStyles).toHaveBeenCalled();

      const animateCall = vi.mocked(ctx.animate).mock.calls[0];
      expect(animateCall[1]).toMatchObject({ duration: 300, easing: 'easeOut' });
    });

    it('restores rerouted edges when they exist', () => {
      const node = makeNode('n1', { collapsed: true });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.nodes = [node];

      const reroutedEdges = new Map([['e1', { source: 'a', target: 'b' }]]);
      const fakeState: CollapseState = {
        targetPositions: new Map([['n2', { x: 0, y: 0 }]]),
        reroutedEdges,
      };
      ctx._collapseState.set('n1', fakeState);

      const mixin = createCollapseMixin(ctx);
      mixin.expandNode('n1', { animate: false });

      expect(restoreReroutedEdges).toHaveBeenCalledWith(ctx.edges, reroutedEdges);
    });
  });

  // ── toggleNode ────────────────────────────────────────────────────────

  describe('toggleNode', () => {
    it('calls expandNode when node is collapsed', () => {
      const node = makeNode('n1', { collapsed: true });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);

      const fakeState: CollapseState = {
        targetPositions: new Map([['n2', { x: 0, y: 0 }]]),
        reroutedEdges: new Map(),
      };
      ctx._collapseState.set('n1', fakeState);

      const mixin = createCollapseMixin(ctx);
      const expandSpy = vi.spyOn(mixin, 'expandNode');

      mixin.toggleNode('n1', { animate: false });

      expect(expandSpy).toHaveBeenCalledWith('n1', { animate: false });
    });

    it('calls collapseNode when node is not collapsed', () => {
      const node = makeNode('n1', { collapsed: false });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);

      const mixin = createCollapseMixin(ctx);
      const collapseSpy = vi.spyOn(mixin, 'collapseNode');

      mixin.toggleNode('n1', { animate: false });

      expect(collapseSpy).toHaveBeenCalledWith('n1', { animate: false });
    });

    it('skips if node not found', () => {
      const ctx = mockCtx();
      const mixin = createCollapseMixin(ctx);

      mixin.toggleNode('missing');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });
  });

  // ── isCollapsed ───────────────────────────────────────────────────────

  describe('isCollapsed', () => {
    it('returns true for collapsed node', () => {
      const node = makeNode('n1', { collapsed: true });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCollapseMixin(ctx);

      expect(mixin.isCollapsed('n1')).toBe(true);
    });

    it('returns false for non-collapsed node', () => {
      const node = makeNode('n1', { collapsed: false });
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCollapseMixin(ctx);

      expect(mixin.isCollapsed('n1')).toBe(false);
    });

    it('returns false for unknown node', () => {
      const ctx = mockCtx();
      const mixin = createCollapseMixin(ctx);

      expect(mixin.isCollapsed('missing')).toBe(false);
    });
  });

  // ── getCollapseTargetCount ────────────────────────────────────────────

  describe('getCollapseTargetCount', () => {
    it('returns count from getCollapseTargets', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.nodes = [node];

      vi.mocked(getCollapseTargets).mockReturnValueOnce(new Set(['n2', 'n3', 'n4']));
      const mixin = createCollapseMixin(ctx);

      expect(mixin.getCollapseTargetCount('n1')).toBe(3);
      expect(getCollapseTargets).toHaveBeenCalledWith('n1', ctx.nodes, ctx.edges);
    });
  });

  // ── getDescendantCount ────────────────────────────────────────────────

  describe('getDescendantCount', () => {
    it('returns count from getDescendantIds', () => {
      const node = makeNode('n1');
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      ctx.nodes = [node];

      vi.mocked(getDescendantIds).mockReturnValueOnce(new Set(['c1', 'c2']));
      const mixin = createCollapseMixin(ctx);

      expect(mixin.getDescendantCount('n1')).toBe(2);
      expect(getDescendantIds).toHaveBeenCalledWith('n1', ctx.nodes);
    });
  });
});
