import { describe, it, expect, vi } from 'vitest';
import type { FlowNode, ChildValidation } from './types';
import {
  resolveChildValidation,
  validateChildAdd,
  validateChildRemove,
  computeValidationErrors,
} from './child-validation';

function makeNode(overrides: Partial<FlowNode> & { id: string }): FlowNode {
  return { position: { x: 0, y: 0 }, data: {}, ...overrides };
}

describe('resolveChildValidation', () => {
  it('returns undefined when no rules exist', () => {
    const node = makeNode({ id: 'p', type: 'group' });
    expect(resolveChildValidation(node, {})).toBeUndefined();
  });

  it('returns type-registry rules when no per-node override', () => {
    const node = makeNode({ id: 'p', type: 'group' });
    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 3 },
    };
    expect(resolveChildValidation(node, rules)).toEqual({ maxChildren: 3 });
  });

  it('merges per-node override over type-registry (shallow)', () => {
    const node = makeNode({
      id: 'p',
      type: 'group',
      data: { childValidation: { maxChildren: 10, requiredChildren: true } },
    });
    const rules: Record<string, ChildValidation> = {
      group: { maxChildren: 3, minChildren: 1 },
    };
    const result = resolveChildValidation(node, rules);
    expect(result).toEqual({ maxChildren: 10, minChildren: 1, requiredChildren: true });
  });

  it('returns per-node override when no type-registry entry', () => {
    const node = makeNode({
      id: 'p',
      type: 'custom',
      data: { childValidation: { requiredChildren: true } },
    });
    expect(resolveChildValidation(node, {})).toEqual({ requiredChildren: true });
  });
});

describe('validateChildAdd', () => {
  it('allows when no rules', () => {
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    expect(validateChildAdd(parent, child, [], undefined)).toEqual({ valid: true });
  });

  it('rejects when maxChildren reached', () => {
    const rules: ChildValidation = { maxChildren: 2 };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const siblings = [makeNode({ id: 's1' }), makeNode({ id: 's2' })];
    const result = validateChildAdd(parent, child, siblings, rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('maxChildren');
  });

  it('rejects when child type not in allowedChildTypes', () => {
    const rules: ChildValidation = { allowedChildTypes: ['worker', 'database'] };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'gateway' });
    const result = validateChildAdd(parent, child, [], rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('allowedChildTypes');
  });

  it('allows when child type is in allowedChildTypes', () => {
    const rules: ChildValidation = { allowedChildTypes: ['worker', 'database'] };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    expect(validateChildAdd(parent, child, [], rules)).toEqual({ valid: true });
  });

  it('rejects when per-type max reached', () => {
    const rules: ChildValidation = {
      childTypeConstraints: { worker: { max: 2 } },
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const siblings = [
      makeNode({ id: 's1', type: 'worker' }),
      makeNode({ id: 's2', type: 'worker' }),
    ];
    const result = validateChildAdd(parent, child, siblings, rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('childTypeConstraints');
  });

  it('allows per-type when under max', () => {
    const rules: ChildValidation = {
      childTypeConstraints: { worker: { max: 3 } },
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const siblings = [makeNode({ id: 's1', type: 'worker' })];
    expect(validateChildAdd(parent, child, siblings, rules)).toEqual({ valid: true });
  });

  it('rejects when custom validateChild returns string', () => {
    const rules: ChildValidation = {
      validateChild: (_child, siblings) =>
        siblings.length === 0 ? 'Need at least one sibling first' : true,
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const result = validateChildAdd(parent, child, [], rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('validateChild');
    expect(result.message).toBe('Need at least one sibling first');
  });

  it('rejects when custom validateChild returns false', () => {
    const rules: ChildValidation = { validateChild: () => false };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const result = validateChildAdd(parent, child, [], rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('validateChild');
  });

  it('allows when custom validateChild returns true', () => {
    const rules: ChildValidation = { validateChild: () => true };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    expect(validateChildAdd(parent, child, [], rules)).toEqual({ valid: true });
  });
});

describe('validateChildRemove', () => {
  it('allows when no rules', () => {
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    expect(validateChildRemove(parent, child, [child], undefined)).toEqual({ valid: true });
  });

  it('rejects when removing would go below minChildren', () => {
    const rules: ChildValidation = { minChildren: 1 };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const result = validateChildRemove(parent, child, [child], rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('minChildren');
  });

  it('allows removal when above minChildren', () => {
    const rules: ChildValidation = { minChildren: 1 };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const siblings = [child, makeNode({ id: 's1', type: 'worker' })];
    expect(validateChildRemove(parent, child, siblings, rules)).toEqual({ valid: true });
  });

  it('rejects when requiredChildren and last child', () => {
    const rules: ChildValidation = { requiredChildren: true };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const result = validateChildRemove(parent, child, [child], rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('minChildren');
  });

  it('rejects when removing would violate per-type min', () => {
    const rules: ChildValidation = {
      childTypeConstraints: { database: { min: 1 } },
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'database' });
    const result = validateChildRemove(parent, child, [child], rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('childTypeConstraints');
  });

  it('allows per-type removal when above min', () => {
    const rules: ChildValidation = {
      childTypeConstraints: { database: { min: 1 } },
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'database' });
    const siblings = [child, makeNode({ id: 'd2', type: 'database' })];
    expect(validateChildRemove(parent, child, siblings, rules)).toEqual({ valid: true });
  });

  it('rejects when preventChildEscape is true', () => {
    const rules: ChildValidation = { preventChildEscape: true };
    const parent = makeNode({ id: 'p', type: 'group' });
    const child = makeNode({ id: 'c', type: 'worker' });
    const result = validateChildRemove(parent, child, [child, makeNode({ id: 's1' })], rules);
    expect(result.valid).toBe(false);
    expect(result.rule).toBe('preventChildEscape');
  });
});

describe('computeValidationErrors', () => {
  it('returns empty array when no rules', () => {
    const parent = makeNode({ id: 'p', type: 'group' });
    expect(computeValidationErrors(parent, [], undefined)).toEqual([]);
  });

  it('returns error when requiredChildren and no children', () => {
    const rules: ChildValidation = { requiredChildren: true };
    const parent = makeNode({ id: 'p', type: 'group' });
    const errors = computeValidationErrors(parent, [], rules);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('at least 1');
  });

  it('returns error when below minChildren', () => {
    const rules: ChildValidation = { minChildren: 2 };
    const parent = makeNode({ id: 'p', type: 'group' });
    const children = [makeNode({ id: 'c1' })];
    const errors = computeValidationErrors(parent, children, rules);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('2');
  });

  it('returns error when above maxChildren', () => {
    const rules: ChildValidation = { maxChildren: 1 };
    const parent = makeNode({ id: 'p', type: 'group' });
    const children = [makeNode({ id: 'c1' }), makeNode({ id: 'c2' })];
    const errors = computeValidationErrors(parent, children, rules);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('1');
  });

  it('returns error when per-type min not met', () => {
    const rules: ChildValidation = {
      childTypeConstraints: { database: { min: 1 } },
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const errors = computeValidationErrors(parent, [], rules);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('database');
  });

  it('returns error when per-type max exceeded', () => {
    const rules: ChildValidation = {
      childTypeConstraints: { worker: { max: 1 } },
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const children = [
      makeNode({ id: 'w1', type: 'worker' }),
      makeNode({ id: 'w2', type: 'worker' }),
    ];
    const errors = computeValidationErrors(parent, children, rules);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('worker');
  });

  it('returns multiple errors', () => {
    const rules: ChildValidation = {
      minChildren: 3,
      childTypeConstraints: { database: { min: 1 } },
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const children = [makeNode({ id: 'w1', type: 'worker' })];
    const errors = computeValidationErrors(parent, children, rules);
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it('returns empty when all constraints satisfied', () => {
    const rules: ChildValidation = {
      minChildren: 1,
      maxChildren: 5,
      childTypeConstraints: { database: { min: 1, max: 2 } },
    };
    const parent = makeNode({ id: 'p', type: 'group' });
    const children = [
      makeNode({ id: 'd1', type: 'database' }),
      makeNode({ id: 'w1', type: 'worker' }),
    ];
    expect(computeValidationErrors(parent, children, rules)).toEqual([]);
  });
});
