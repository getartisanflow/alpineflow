import { describe, it, expect, vi } from 'vitest';
import { mockCtx } from './__test-utils';
import { createValidationMixin } from './canvas-validation';
import type { FlowNode, ChildValidation } from '../../core/types';

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return { id, type: 'default', position: { x: 0, y: 0 }, data: {}, ...overrides };
}

// ── validateParent ───────────────────────────────────────────────────────────

describe('createValidationMixin — validateParent', () => {
  it('returns valid when node does not exist', () => {
    const ctx = mockCtx();
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
    const mixin = createValidationMixin(ctx);

    expect(mixin.validateParent('missing')).toEqual({ valid: true, errors: [] });
  });

  it('returns valid when node has no validation rules', () => {
    const parent = makeNode('p1', { type: 'group' });
    const ctx = mockCtx({ _config: { childValidationRules: {} } as any });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(parent);
    ctx.nodes = [parent];
    const mixin = createValidationMixin(ctx);

    expect(mixin.validateParent('p1')).toEqual({ valid: true, errors: [] });
  });

  it('returns errors when children violate rules', () => {
    const parent = makeNode('p1', { type: 'group' });
    const child1 = makeNode('c1', { parentId: 'p1' });
    const child2 = makeNode('c2', { parentId: 'p1' });
    const child3 = makeNode('c3', { parentId: 'p1' });
    const nodes = [parent, child1, child2, child3];

    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 2 },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    const result = mixin.validateParent('p1');

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('2');
  });

  it('returns valid when children satisfy rules', () => {
    const parent = makeNode('p1', { type: 'group' });
    const child1 = makeNode('c1', { parentId: 'p1' });
    const nodes = [parent, child1];

    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 3 },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    expect(mixin.validateParent('p1')).toEqual({ valid: true, errors: [] });
  });

  it('uses per-node data.childValidation override', () => {
    const parent = makeNode('p1', {
      type: 'group',
      data: { childValidation: { maxChildren: 1 } },
    });
    const child1 = makeNode('c1', { parentId: 'p1' });
    const child2 = makeNode('c2', { parentId: 'p1' });
    const nodes = [parent, child1, child2];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    const result = mixin.validateParent('p1');

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('1');
  });
});

// ── validateAll ──────────────────────────────────────────────────────────────

describe('createValidationMixin — validateAll', () => {
  it('returns empty map when no nodes have parents', () => {
    const ctx = mockCtx({ nodes: [makeNode('n1'), makeNode('n2')] });
    const mixin = createValidationMixin(ctx);

    const results = mixin.validateAll();

    expect(results.size).toBe(0);
  });

  it('returns validation results for each parent', () => {
    const parent1 = makeNode('p1', { type: 'group' });
    const parent2 = makeNode('p2', { type: 'group' });
    const child1 = makeNode('c1', { parentId: 'p1' });
    const child2 = makeNode('c2', { parentId: 'p2' });
    const nodes = [parent1, parent2, child1, child2];

    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 5 },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    const results = mixin.validateAll();

    expect(results.size).toBe(2);
    expect(results.get('p1')).toEqual({ valid: true, errors: [] });
    expect(results.get('p2')).toEqual({ valid: true, errors: [] });
  });

  it('reports errors for parents that violate rules', () => {
    const parent = makeNode('p1', { type: 'group' });
    const child1 = makeNode('c1', { parentId: 'p1' });
    const child2 = makeNode('c2', { parentId: 'p1' });
    const child3 = makeNode('c3', { parentId: 'p1' });
    const nodes = [parent, child1, child2, child3];

    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 2 },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    const results = mixin.validateAll();

    expect(results.get('p1')?.valid).toBe(false);
  });
});

// ── getValidationErrors ──────────────────────────────────────────────────────

describe('createValidationMixin — getValidationErrors', () => {
  it('returns cached errors for a node', () => {
    const ctx = mockCtx();
    ctx._validationErrorCache.set('p1', ['Too many children']);
    const mixin = createValidationMixin(ctx);

    expect(mixin.getValidationErrors('p1')).toEqual(['Too many children']);
  });

  it('returns empty array when no cached errors', () => {
    const ctx = mockCtx();
    const mixin = createValidationMixin(ctx);

    expect(mixin.getValidationErrors('p1')).toEqual([]);
  });
});

// ── _getChildValidation ──────────────────────────────────────────────────────

describe('createValidationMixin — _getChildValidation', () => {
  it('returns undefined when parent does not exist', () => {
    const ctx = mockCtx({ _config: { childValidationRules: {} } as any });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
    const mixin = createValidationMixin(ctx);

    expect(mixin._getChildValidation('missing')).toBeUndefined();
  });

  it('returns rules from type registry', () => {
    const parent = makeNode('p1', { type: 'group' });
    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 5 },
    };
    const ctx = mockCtx({ _config: { childValidationRules: rules } as any });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(parent);
    const mixin = createValidationMixin(ctx);

    expect(mixin._getChildValidation('p1')).toEqual({ maxChildren: 5 });
  });

  it('returns undefined when no rules match', () => {
    const parent = makeNode('p1', { type: 'custom' });
    const ctx = mockCtx({ _config: { childValidationRules: {} } as any });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(parent);
    const mixin = createValidationMixin(ctx);

    expect(mixin._getChildValidation('p1')).toBeUndefined();
  });
});

// ── _recomputeChildValidation ────────────────────────────────────────────────

describe('createValidationMixin — _recomputeChildValidation', () => {
  it('populates validation error cache for parents with errors', () => {
    const parent = makeNode('p1', { type: 'group' });
    const child1 = makeNode('c1', { parentId: 'p1' });
    const child2 = makeNode('c2', { parentId: 'p1' });
    const child3 = makeNode('c3', { parentId: 'p1' });
    const nodes = [parent, child1, child2, child3];

    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 2 },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    mixin._recomputeChildValidation();

    expect(ctx._validationErrorCache.get('p1')?.length).toBeGreaterThan(0);
    expect(parent._validationErrors?.length).toBeGreaterThan(0);
  });

  it('clears validation error cache for valid parents', () => {
    const parent = makeNode('p1', { type: 'group' });
    const child1 = makeNode('c1', { parentId: 'p1' });
    const nodes = [parent, child1];

    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 5 },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    ctx._validationErrorCache.set('p1', ['old error']);
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    mixin._recomputeChildValidation();

    expect(ctx._validationErrorCache.has('p1')).toBe(false);
    expect(parent._validationErrors).toEqual([]);
  });

  it('cleans up cache entries for deleted parents', () => {
    const ctx = mockCtx({
      nodes: [],
      _config: { childValidationRules: {} } as any,
    });
    ctx._validationErrorCache.set('deleted', ['stale error']);
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
    const mixin = createValidationMixin(ctx);

    mixin._recomputeChildValidation();

    expect(ctx._validationErrorCache.has('deleted')).toBe(false);
  });

  it('includes nodes with data.childValidation even with 0 children', () => {
    const parent = makeNode('p1', {
      type: 'custom',
      data: { childValidation: { minChildren: 1 } },
    });
    const nodes = [parent];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    mixin._recomputeChildValidation();

    expect(ctx._validationErrorCache.get('p1')?.length).toBeGreaterThan(0);
  });
});

// ── reparentNode ─────────────────────────────────────────────────────────────

describe('createValidationMixin — reparentNode', () => {
  it('returns false when node does not exist', () => {
    const ctx = mockCtx();
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
    const mixin = createValidationMixin(ctx);

    expect(mixin.reparentNode('missing', 'p1')).toBe(false);
  });

  it('returns true (no-op) when already in the target parent', () => {
    const node = makeNode('c1', { parentId: 'p1' });
    const ctx = mockCtx();
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(node);
    const mixin = createValidationMixin(ctx);

    expect(mixin.reparentNode('c1', 'p1')).toBe(true);
    expect(ctx._captureHistory).not.toHaveBeenCalled();
  });

  it('returns true (no-op) when root node reparented to null', () => {
    const node = makeNode('n1'); // no parentId
    const ctx = mockCtx();
    (ctx.getNode as ReturnType<typeof vi.fn>).mockReturnValue(node);
    const mixin = createValidationMixin(ctx);

    expect(mixin.reparentNode('n1', null)).toBe(true);
    expect(ctx._captureHistory).not.toHaveBeenCalled();
  });

  // ── Detach (child → root) ─────────────────────────────────────────

  it('detaches a child to root: converts position to absolute', () => {
    const child = makeNode('c1', { parentId: 'p1', position: { x: 10, y: 20 } });
    const parent = makeNode('p1', { position: { x: 100, y: 200 } });
    const nodes = [parent, child];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    (ctx.getAbsolutePosition as ReturnType<typeof vi.fn>).mockReturnValue({ x: 110, y: 220 });
    const mixin = createValidationMixin(ctx);

    const result = mixin.reparentNode('c1', null);

    expect(result).toBe(true);
    expect(child.position.x).toBe(110);
    expect(child.position.y).toBe(220);
    expect(child.parentId).toBeUndefined();
    expect(child.extent).toBeUndefined();
    expect(ctx._captureHistory).toHaveBeenCalledOnce();
    expect(ctx._rebuildNodeMap).toHaveBeenCalled();
    expect(ctx._emit).toHaveBeenCalledWith('node-reparent', {
      node: child,
      oldParentId: 'p1',
      newParentId: null,
    });
  });

  it('detach: rejects when child validation blocks removal', () => {
    const child = makeNode('c1', { parentId: 'p1' });
    const parent = makeNode('p1', { type: 'group' });
    const nodes = [parent, child];

    const rules: Record<string, ChildValidation> = {
      group: { preventChildEscape: true },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    const result = mixin.reparentNode('c1', null);

    expect(result).toBe(false);
    expect(ctx._captureHistory).not.toHaveBeenCalled();
  });

  it('detach: calls onChildValidationFail callback when removal rejected', () => {
    const child = makeNode('c1', { parentId: 'p1' });
    const parent = makeNode('p1', { type: 'group' });
    const nodes = [parent, child];
    const onFail = vi.fn();

    const rules: Record<string, ChildValidation> = {
      group: { preventChildEscape: true },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules, onChildValidationFail: onFail } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    mixin.reparentNode('c1', null);

    expect(onFail).toHaveBeenCalledOnce();
    expect(onFail).toHaveBeenCalledWith(expect.objectContaining({
      parent,
      child,
      operation: 'remove',
    }));
  });

  it('detach: triggers layoutChildren on topmost ancestor with childLayout', () => {
    const grandparent = makeNode('gp', { childLayout: { type: 'vertical' } as any });
    const parent = makeNode('p1', { parentId: 'gp', childLayout: { type: 'vertical' } as any });
    const child = makeNode('c1', { parentId: 'p1' });
    const nodes = [grandparent, parent, child];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    (ctx.getAbsolutePosition as ReturnType<typeof vi.fn>).mockReturnValue({ x: 50, y: 50 });
    // _nodeMap needs to be populated for the walk
    ctx._nodeMap.set('p1', parent);
    ctx._nodeMap.set('gp', grandparent);
    const mixin = createValidationMixin(ctx);

    mixin.reparentNode('c1', null);

    expect(ctx.layoutChildren).toHaveBeenCalledWith('gp');
  });

  // ── Reparent (root → group or group → group) ─────────────────────

  it('reparents root node into a group: converts position to relative', () => {
    const node = makeNode('n1', { position: { x: 200, y: 300 } });
    const newParent = makeNode('p1', { position: { x: 50, y: 100 } });
    const nodes = [newParent, node];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    (ctx.getAbsolutePosition as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => {
        if (id === 'p1') return { x: 50, y: 100 };
        return { x: 200, y: 300 };
      },
    );
    const mixin = createValidationMixin(ctx);

    const result = mixin.reparentNode('n1', 'p1');

    expect(result).toBe(true);
    // Position should be 200 - 50 = 150 for x, 300 - 100 = 200 for y
    expect(node.position.x).toBe(150);
    expect(node.position.y).toBe(200);
    expect(node.parentId).toBe('p1');
    expect(ctx._captureHistory).toHaveBeenCalledOnce();
    expect(ctx._emit).toHaveBeenCalledWith('node-reparent', {
      node,
      oldParentId: null,
      newParentId: 'p1',
    });
  });

  it('rejects circular reparenting (node into own descendant)', () => {
    const parent = makeNode('p1');
    const child = makeNode('c1', { parentId: 'p1' });
    const grandchild = makeNode('gc1', { parentId: 'c1' });
    const nodes = [parent, child, grandchild];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    // Trying to parent p1 into its own grandchild gc1
    const result = mixin.reparentNode('p1', 'gc1');

    expect(result).toBe(false);
    expect(ctx._captureHistory).not.toHaveBeenCalled();
  });

  it('returns false when new parent does not exist', () => {
    const node = makeNode('n1');
    const ctx = mockCtx({ _config: { childValidationRules: {} } as any });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => (id === 'n1' ? node : undefined),
    );
    const mixin = createValidationMixin(ctx);

    expect(mixin.reparentNode('n1', 'nonexistent')).toBe(false);
  });

  it('rejects when child add validation fails on new parent', () => {
    const node = makeNode('n1', { type: 'task' });
    const newParent = makeNode('p1', { type: 'group' });
    const existing1 = makeNode('e1', { parentId: 'p1' });
    const existing2 = makeNode('e2', { parentId: 'p1' });
    const nodes = [newParent, existing1, existing2, node];

    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 2 },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    const result = mixin.reparentNode('n1', 'p1');

    expect(result).toBe(false);
    expect(ctx._captureHistory).not.toHaveBeenCalled();
  });

  it('rejects when child remove validation fails on old parent', () => {
    const node = makeNode('c1', { parentId: 'oldP' });
    const oldParent = makeNode('oldP', { type: 'strict' });
    const newParent = makeNode('newP', { type: 'group' });
    const nodes = [oldParent, newParent, node];

    const rules: Record<string, ChildValidation> = {
      strict: { preventChildEscape: true },
      group: {},
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    const result = mixin.reparentNode('c1', 'newP');

    expect(result).toBe(false);
    expect(ctx._captureHistory).not.toHaveBeenCalled();
  });

  it('calls onChildValidationFail on add failure', () => {
    const node = makeNode('n1', { type: 'task' });
    const newParent = makeNode('p1', { type: 'group' });
    const existing = makeNode('e1', { parentId: 'p1' });
    const nodes = [newParent, existing, node];
    const onFail = vi.fn();

    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 1 },
    };
    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: rules, onChildValidationFail: onFail } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    const mixin = createValidationMixin(ctx);

    mixin.reparentNode('n1', 'p1');

    expect(onFail).toHaveBeenCalledOnce();
    expect(onFail).toHaveBeenCalledWith(expect.objectContaining({
      parent: newParent,
      child: node,
      operation: 'add',
    }));
  });

  it('restores initial dimensions when reparenting into a childLayout parent', () => {
    const node = makeNode('n1', {
      dimensions: { width: 999, height: 888 },
    });
    const newParent = makeNode('p1', {
      childLayout: { type: 'vertical' } as any,
    });
    const nodes = [newParent, node];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    (ctx.getAbsolutePosition as ReturnType<typeof vi.fn>).mockReturnValue({ x: 0, y: 0 });
    ctx._initialDimensions.set('n1', { width: 200, height: 100 });
    ctx._nodeMap.set('p1', newParent);
    const mixin = createValidationMixin(ctx);

    mixin.reparentNode('n1', 'p1');

    expect(node.dimensions).toEqual({ width: 200, height: 100 });
  });

  it('clears dimensions when no initial dimensions stored and reparenting into childLayout parent', () => {
    const node = makeNode('n1', {
      dimensions: { width: 999, height: 888 },
    });
    const newParent = makeNode('p1', {
      childLayout: { type: 'vertical' } as any,
    });
    const nodes = [newParent, node];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    (ctx.getAbsolutePosition as ReturnType<typeof vi.fn>).mockReturnValue({ x: 0, y: 0 });
    ctx._nodeMap.set('p1', newParent);
    const mixin = createValidationMixin(ctx);

    mixin.reparentNode('n1', 'p1');

    expect(node.dimensions).toBeUndefined();
  });

  it('auto-assigns order when reparenting into a childLayout parent', () => {
    const node = makeNode('n1');
    const sibling = makeNode('s1', { parentId: 'p1', order: 2 });
    const newParent = makeNode('p1', {
      childLayout: { type: 'vertical' } as any,
    });
    const nodes = [newParent, sibling, node];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    (ctx.getAbsolutePosition as ReturnType<typeof vi.fn>).mockReturnValue({ x: 0, y: 0 });
    ctx._nodeMap.set('p1', newParent);
    const mixin = createValidationMixin(ctx);

    mixin.reparentNode('n1', 'p1');

    expect(node.order).toBe(3);
  });

  it('triggers layoutChildren on topmost ancestors for both old and new parent', () => {
    const topAncestor = makeNode('top', { childLayout: { type: 'vertical' } as any });
    const oldParent = makeNode('oldP', { parentId: 'top' });
    const newParent = makeNode('newP');
    const child = makeNode('c1', { parentId: 'oldP' });
    const nodes = [topAncestor, oldParent, newParent, child];

    const ctx = mockCtx({
      nodes,
      _config: { childValidationRules: {} } as any,
    });
    (ctx.getNode as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => nodes.find((n) => n.id === id),
    );
    (ctx.getAbsolutePosition as ReturnType<typeof vi.fn>).mockReturnValue({ x: 0, y: 0 });
    ctx._nodeMap.set('top', topAncestor);
    ctx._nodeMap.set('oldP', oldParent);
    ctx._nodeMap.set('newP', newParent);
    const mixin = createValidationMixin(ctx);

    mixin.reparentNode('c1', 'newP');

    expect(ctx.layoutChildren).toHaveBeenCalledWith('top');
  });
});
