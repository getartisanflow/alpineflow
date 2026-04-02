// ============================================================================
// canvas-validation — Child validation & reparenting mixin for flow-canvas
//
// Public API: validateParent, validateAll, getValidationErrors, reparentNode.
// Internal helpers: _getChildValidation, _recomputeChildValidation.
//
// This is the first mixin with cross-mixin dependencies — reparentNode calls
// layoutChildren (from the layout mixin) via ctx with optional chaining.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowNode, ChildValidation } from '../../core/types';
import {
  resolveChildValidation,
  computeValidationErrors,
  validateChildAdd,
  validateChildRemove,
} from '../../core/child-validation';
import { getDescendantIds, sortNodesTopological } from '../../core/sub-flow';

export function createValidationMixin(ctx: CanvasContext) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────

    _getChildValidation(parentId: string): ChildValidation | undefined {
      const parent = ctx.getNode(parentId);
      if (!parent) return undefined;
      return resolveChildValidation(parent, ctx._config.childValidationRules ?? {});
    },

    _recomputeChildValidation(): void {
      const parentIds = new Set<string>();
      const typeRules = ctx._config.childValidationRules ?? {};
      for (const node of ctx.nodes as FlowNode[]) {
        if (node.parentId) parentIds.add(node.parentId);
        // Also include nodes that have validation rules (even with 0 children)
        if (node.data?.childValidation || typeRules[node.type ?? 'default']) {
          parentIds.add(node.id);
        }
      }
      for (const [id] of ctx._validationErrorCache) {
        parentIds.add(id);
      }

      for (const parentId of parentIds) {
        const parent = ctx.getNode(parentId);
        if (!parent) {
          ctx._validationErrorCache.delete(parentId);
          continue;
        }
        const rules = resolveChildValidation(parent, ctx._config.childValidationRules ?? {});
        if (!rules) {
          ctx._validationErrorCache.delete(parentId);
          continue;
        }
        const children = (ctx.nodes as FlowNode[]).filter((n: FlowNode) => n.parentId === parentId);
        const errors = computeValidationErrors(parent, children, rules);
        if (errors.length > 0) {
          ctx._validationErrorCache.set(parentId, errors);
        } else {
          ctx._validationErrorCache.delete(parentId);
        }
        parent._validationErrors = errors;
      }
    },

    // ── Child Validation API ─────────────────────────────────────────────

    validateParent(nodeId: string): { valid: boolean; errors: string[] } {
      const parent = ctx.getNode(nodeId);
      if (!parent) return { valid: true, errors: [] };
      const rules = resolveChildValidation(parent, ctx._config.childValidationRules ?? {});
      if (!rules) return { valid: true, errors: [] };
      const children = (ctx.nodes as FlowNode[]).filter((n: FlowNode) => n.parentId === nodeId);
      const errors = computeValidationErrors(parent, children, rules);
      return { valid: errors.length === 0, errors };
    },

    validateAll(): Map<string, { valid: boolean; errors: string[] }> {
      const results = new Map<string, { valid: boolean; errors: string[] }>();
      const parentIds = new Set<string>();
      for (const node of ctx.nodes as FlowNode[]) {
        if (node.parentId) parentIds.add(node.parentId);
      }
      for (const parentId of parentIds) {
        results.set(parentId, this.validateParent(parentId));
      }
      return results;
    },

    getValidationErrors(nodeId: string): string[] {
      return ctx._validationErrorCache.get(nodeId) ?? [];
    },

    // ── Reparent ─────────────────────────────────────────────────────────

    /**
     * Reparent a node into a new parent (or detach from current parent).
     * Handles position conversion and child validation.
     * Returns true on success, false if validation rejects the operation.
     */
    reparentNode(nodeId: string, newParentId: string | null): boolean {
      const node = ctx.getNode(nodeId);
      if (!node) return false;

      const oldParentId = node.parentId ?? null;

      // No-op if already in the target parent
      if (oldParentId === newParentId) return true;

      // ── Detach: child → root ───────────────────────────────────
      if (newParentId === null) {
        // Check if removal is allowed by child validation
        if (oldParentId) {
          const rules = this._getChildValidation(oldParentId);
          if (rules) {
            const parent = ctx.getNode(oldParentId);
            if (parent) {
              const siblings = (ctx.nodes as FlowNode[]).filter(
                (n: FlowNode) => n.parentId === oldParentId,
              );
              const result = validateChildRemove(parent, node, siblings, rules);
              if (!result.valid) {
                if (ctx._config.onChildValidationFail) {
                  ctx._config.onChildValidationFail({
                    parent,
                    child: node,
                    operation: 'remove',
                    rule: result.rule!,
                    message: result.message!,
                  });
                }
                return false;
              }
            }
          }
        }

        // Convert relative position to absolute
        ctx._captureHistory();
        const absPos = ctx.getAbsolutePosition(nodeId);
        node.position.x = absPos.x;
        node.position.y = absPos.y;
        node.parentId = undefined;
        node.extent = undefined;

        ctx.nodes = sortNodesTopological(ctx.nodes);
        ctx._rebuildNodeMap();
        this._recomputeChildValidation();

        // Re-layout from topmost ancestor layout parent so size changes propagate
        if (oldParentId) {
          let topmost: string | undefined;
          let walkId: string | undefined = oldParentId;
          while (walkId) {
            const walkNode = ctx._nodeMap.get(walkId);
            if (!walkNode) break;
            if (walkNode.childLayout) topmost = walkId;
            walkId = walkNode.parentId;
          }
          if (topmost) ctx.layoutChildren?.(topmost);
        }

        ctx._emit('node-reparent', { node, oldParentId, newParentId: null });
        return true;
      }

      // ── Reparent: root → group or group → different group ──────
      const newParent = ctx.getNode(newParentId);
      if (!newParent) return false;

      // Guard against circular reparenting (dropping a node into its own descendant)
      if (getDescendantIds(nodeId, ctx.nodes).has(newParentId)) return false;

      // Validate child add on the new parent
      const rules = this._getChildValidation(newParentId);
      if (rules) {
        const siblings = (ctx.nodes as FlowNode[]).filter(
          (n: FlowNode) => n.parentId === newParentId && n.id !== nodeId,
        );
        const result = validateChildAdd(newParent, node, siblings, rules);
        if (!result.valid) {
          if (ctx._config.onChildValidationFail) {
            ctx._config.onChildValidationFail({
              parent: newParent,
              child: node,
              operation: 'add',
              rule: result.rule!,
              message: result.message!,
            });
          }
          return false;
        }
      }

      // If currently a child, validate removal from old parent first
      if (oldParentId) {
        const oldRules = this._getChildValidation(oldParentId);
        if (oldRules) {
          const oldParent = ctx.getNode(oldParentId);
          if (oldParent) {
            const oldSiblings = (ctx.nodes as FlowNode[]).filter(
              (n: FlowNode) => n.parentId === oldParentId,
            );
            const removeResult = validateChildRemove(oldParent, node, oldSiblings, oldRules);
            if (!removeResult.valid) {
              if (ctx._config.onChildValidationFail) {
                ctx._config.onChildValidationFail({
                  parent: oldParent,
                  child: node,
                  operation: 'remove',
                  rule: removeResult.rule!,
                  message: removeResult.message!,
                });
              }
              return false;
            }
          }
        }
      }

      // Convert position: get current absolute position, then make relative to new parent
      ctx._captureHistory();
      const absPos = oldParentId
        ? ctx.getAbsolutePosition(nodeId)
        : { x: node.position.x, y: node.position.y };
      const newParentAbs = ctx.getAbsolutePosition(newParentId);
      node.position.x = absPos.x - newParentAbs.x;
      node.position.y = absPos.y - newParentAbs.y;
      node.parentId = newParentId;

      ctx.nodes = sortNodesTopological(ctx.nodes);
      ctx._rebuildNodeMap();
      this._recomputeChildValidation();

      // Re-layout the new parent if it has childLayout
      if (newParentId) {
        const reparentNewParent = ctx._nodeMap.get(newParentId);
        if (reparentNewParent?.childLayout) {
          // Restore the node's originally configured dimensions so layout-
          // stretched values from the old parent don't carry over. Nodes
          // without initial dimensions get cleared so the new parent's
          // layout determines size from defaults.
          if (!node.childLayout) {
            const initial = ctx._initialDimensions.get(nodeId);
            node.dimensions = initial ? { ...initial } : undefined;
          }
          // Auto-assign order
          if (node.order == null) {
            const siblings = ctx.nodes.filter(
              (n: FlowNode) => n.parentId === newParentId && n.id !== node.id,
            );
            node.order = siblings.length > 0
              ? Math.max(...siblings.map((s: FlowNode) => s.order ?? 0)) + 1
              : 0;
          }
        }
      }

      // Re-layout from the topmost ancestor layout parents so size changes
      // propagate up (e.g. Columns grows → Step 1 repositions siblings).
      // layoutChildren recurses bottom-up, so calling it on the topmost
      // ancestor handles all descendants.
      const topmostAncestors = new Set<string>();
      for (const pid of [newParentId, oldParentId]) {
        if (!pid) continue;
        let topmost: string | undefined;
        let walkId: string | undefined = pid;
        while (walkId) {
          const walkNode = ctx._nodeMap.get(walkId);
          if (!walkNode) break;
          if (walkNode.childLayout) topmost = walkId;
          walkId = walkNode.parentId;
        }
        if (topmost) topmostAncestors.add(topmost);
      }
      for (const aid of topmostAncestors) {
        ctx.layoutChildren?.(aid);
      }

      ctx._emit('node-reparent', { node, oldParentId, newParentId });
      return true;
    },
  };
}
