import { describe, it, expect, vi } from 'vitest';
import { mockCtx } from './__test-utils';
import { createCondenseMixin } from './canvas-condense';
import type { FlowNode } from '../../core/types';

function makeNode(id: string, condensed = false): FlowNode {
  return { id, type: 'default', position: { x: 0, y: 0 }, data: {}, condensed };
}

describe('createCondenseMixin', () => {
  describe('condenseNode', () => {
    it('sets condensed to true and captures history', () => {
      const node = makeNode('n1', false);
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCondenseMixin(ctx);

      mixin.condenseNode('n1');

      expect(node.condensed).toBe(true);
      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(ctx._emit).toHaveBeenCalledWith('node-condense', { node });
    });

    it('returns early for nonexistent node', () => {
      const ctx = mockCtx();
      const mixin = createCondenseMixin(ctx);

      mixin.condenseNode('missing');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });

    it('returns early if node is already condensed', () => {
      const node = makeNode('n1', true);
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCondenseMixin(ctx);

      mixin.condenseNode('n1');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });
  });

  describe('uncondenseNode', () => {
    it('sets condensed to false and captures history', () => {
      const node = makeNode('n1', true);
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCondenseMixin(ctx);

      mixin.uncondenseNode('n1');

      expect(node.condensed).toBe(false);
      expect(ctx._captureHistory).toHaveBeenCalledOnce();
      expect(ctx._emit).toHaveBeenCalledWith('node-uncondense', { node });
    });

    it('returns early for nonexistent node', () => {
      const ctx = mockCtx();
      const mixin = createCondenseMixin(ctx);

      mixin.uncondenseNode('missing');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });

    it('returns early if node is not condensed', () => {
      const node = makeNode('n1', false);
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCondenseMixin(ctx);

      mixin.uncondenseNode('n1');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });
  });

  describe('toggleCondense', () => {
    it('condenses a node that is not condensed', () => {
      const node = makeNode('n1', false);
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCondenseMixin(ctx);

      mixin.toggleCondense('n1');

      expect(node.condensed).toBe(true);
      expect(ctx._emit).toHaveBeenCalledWith('node-condense', { node });
    });

    it('uncondenses a node that is condensed', () => {
      const node = makeNode('n1', true);
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCondenseMixin(ctx);

      mixin.toggleCondense('n1');

      expect(node.condensed).toBe(false);
      expect(ctx._emit).toHaveBeenCalledWith('node-uncondense', { node });
    });

    it('returns early for nonexistent node', () => {
      const ctx = mockCtx();
      const mixin = createCondenseMixin(ctx);

      mixin.toggleCondense('missing');

      expect(ctx._captureHistory).not.toHaveBeenCalled();
      expect(ctx._emit).not.toHaveBeenCalled();
    });
  });

  describe('isCondensed', () => {
    it('returns true when node is condensed', () => {
      const node = makeNode('n1', true);
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCondenseMixin(ctx);

      expect(mixin.isCondensed('n1')).toBe(true);
    });

    it('returns false when node is not condensed', () => {
      const node = makeNode('n1', false);
      const ctx = mockCtx();
      ctx._nodeMap.set('n1', node);
      const mixin = createCondenseMixin(ctx);

      expect(mixin.isCondensed('n1')).toBe(false);
    });

    it('returns false for nonexistent node', () => {
      const ctx = mockCtx();
      const mixin = createCondenseMixin(ctx);

      expect(mixin.isCondensed('missing')).toBe(false);
    });
  });
});
