// ============================================================================
// canvas-condense — Condense/uncondense mixin for flow-canvas
//
// Toggles a node's condensed flag (summary view vs full row view).
// Four methods, zero dependencies on other mixins.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import { debug } from '../../core/debug';

export function createCondenseMixin(ctx: CanvasContext) {
  return {
    /**
     * Condense a node — switch to summary view hiding internal rows.
     */
    condenseNode(id: string): void {
      const node = ctx._nodeMap.get(id);
      if (!node || node.condensed) return;

      ctx._captureHistory();
      node.condensed = true;
      debug('condense', `Node "${id}" condensed`);
      ctx._emit('node-condense', { node });
    },

    /**
     * Uncondense a node — restore full row view.
     */
    uncondenseNode(id: string): void {
      const node = ctx._nodeMap.get(id);
      if (!node || !node.condensed) return;

      ctx._captureHistory();
      node.condensed = false;
      debug('condense', `Node "${id}" uncondensed`);
      ctx._emit('node-uncondense', { node });
    },

    /**
     * Toggle condensed state of a node.
     */
    toggleCondense(id: string): void {
      const node = ctx._nodeMap.get(id);
      if (!node) return;
      if (node.condensed) {
        this.uncondenseNode(id);
      } else {
        this.condenseNode(id);
      }
    },

    /**
     * Check if a node is condensed.
     */
    isCondensed(id: string): boolean {
      return ctx._nodeMap.get(id)?.condensed === true;
    },
  };
}
