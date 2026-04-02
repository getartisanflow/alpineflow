// ============================================================================
// Child Validation
//
// Pure validation functions for parent-child node constraints. No DOM or
// Alpine dependencies — operates on FlowNode objects and ChildValidation rules.
//
// Rule resolution: type-registry defaults (childValidationRules config) are
// shallow-merged with per-node overrides (node.data.childValidation).
// ============================================================================

import type { FlowNode, ChildValidation, ChildValidationResult } from './types';

/**
 * Resolve the effective ChildValidation rules for a parent node.
 * Shallow-merges type-registry defaults with per-node overrides.
 * Returns undefined if no rules apply.
 */
export function resolveChildValidation(
  parent: FlowNode,
  typeRules: Record<string, ChildValidation>,
): ChildValidation | undefined {
  const nodeType = parent.type ?? 'default';
  const typeRule = typeRules[nodeType];
  const nodeRule = parent.data?.childValidation as ChildValidation | undefined;

  if (!typeRule && !nodeRule) return undefined;
  if (!typeRule) return nodeRule;
  if (!nodeRule) return typeRule;

  return { ...typeRule, ...nodeRule };
}

/**
 * Validate whether a child can be added to a parent.
 * `currentChildren` is the list of existing children (before adding).
 */
export function validateChildAdd(
  parent: FlowNode,
  child: FlowNode,
  currentChildren: FlowNode[],
  rules: ChildValidation | undefined,
): ChildValidationResult {
  if (!rules) return { valid: true };

  // maxChildren
  if (rules.maxChildren !== undefined && currentChildren.length >= rules.maxChildren) {
    return {
      valid: false,
      rule: 'maxChildren',
      message: `Maximum ${rules.maxChildren} child node(s) allowed`,
    };
  }

  // allowedChildTypes
  if (rules.allowedChildTypes) {
    const childType = child.type ?? 'default';
    if (!rules.allowedChildTypes.includes(childType)) {
      return {
        valid: false,
        rule: 'allowedChildTypes',
        message: `Node type "${childType}" is not allowed in this group`,
      };
    }
  }

  // childTypeConstraints — per-type max
  if (rules.childTypeConstraints) {
    const childType = child.type ?? 'default';
    const constraint = rules.childTypeConstraints[childType];
    if (constraint?.max !== undefined) {
      const currentCount = currentChildren.filter(
        (n) => (n.type ?? 'default') === childType,
      ).length;
      if (currentCount >= constraint.max) {
        return {
          valid: false,
          rule: 'childTypeConstraints',
          message: `Maximum ${constraint.max} "${childType}" node(s) allowed`,
        };
      }
    }
  }

  // validateChild callback
  if (rules.validateChild) {
    const result = rules.validateChild(child, currentChildren);
    if (result !== true) {
      return {
        valid: false,
        rule: 'validateChild',
        message: typeof result === 'string' ? result : 'Custom validation rejected',
      };
    }
  }

  return { valid: true };
}

/**
 * Validate whether a child can be removed from a parent.
 * `currentChildren` includes the child being removed.
 */
export function validateChildRemove(
  _parent: FlowNode,
  child: FlowNode,
  currentChildren: FlowNode[],
  rules: ChildValidation | undefined,
): ChildValidationResult {
  if (!rules) return { valid: true };

  // preventChildEscape — always blocks removal via drag-out
  if (rules.preventChildEscape) {
    return {
      valid: false,
      rule: 'preventChildEscape',
      message: 'Children cannot be moved out of this group',
    };
  }

  const countAfter = currentChildren.length - 1;

  // minChildren / requiredChildren
  const effectiveMin = Math.max(
    rules.minChildren ?? 0,
    rules.requiredChildren ? 1 : 0,
  );
  if (effectiveMin > 0 && countAfter < effectiveMin) {
    return {
      valid: false,
      rule: 'minChildren',
      message: `Requires at least ${effectiveMin} child node(s)`,
    };
  }

  // childTypeConstraints — per-type min
  if (rules.childTypeConstraints) {
    const childType = child.type ?? 'default';
    const constraint = rules.childTypeConstraints[childType];
    if (constraint?.min !== undefined) {
      const currentTypeCount = currentChildren.filter(
        (n) => (n.type ?? 'default') === childType,
      ).length;
      if (currentTypeCount - 1 < constraint.min) {
        return {
          valid: false,
          rule: 'childTypeConstraints',
          message: `Requires at least ${constraint.min} "${childType}" node(s)`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Compute the current validation errors for a parent node.
 * Returns an empty array when the parent is valid.
 * Used for reactive state (not for blocking operations).
 */
export function computeValidationErrors(
  _parent: FlowNode,
  currentChildren: FlowNode[],
  rules: ChildValidation | undefined,
): string[] {
  if (!rules) return [];

  const errors: string[] = [];

  // minChildren / requiredChildren
  const effectiveMin = Math.max(
    rules.minChildren ?? 0,
    rules.requiredChildren ? 1 : 0,
  );
  if (effectiveMin > 0 && currentChildren.length < effectiveMin) {
    errors.push(`Requires at least ${effectiveMin} child node(s)`);
  }

  // maxChildren
  if (rules.maxChildren !== undefined && currentChildren.length > rules.maxChildren) {
    errors.push(`Maximum ${rules.maxChildren} child node(s) allowed`);
  }

  // childTypeConstraints
  if (rules.childTypeConstraints) {
    for (const [type, constraint] of Object.entries(rules.childTypeConstraints)) {
      const count = currentChildren.filter(
        (n) => (n.type ?? 'default') === type,
      ).length;
      if (constraint.min !== undefined && count < constraint.min) {
        errors.push(`Requires at least ${constraint.min} "${type}" node(s)`);
      }
      if (constraint.max !== undefined && count > constraint.max) {
        errors.push(`Maximum ${constraint.max} "${type}" node(s) allowed`);
      }
    }
  }

  return errors;
}
