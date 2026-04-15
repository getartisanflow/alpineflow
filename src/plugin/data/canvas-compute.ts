// ============================================================================
// canvas-compute — Compute engine mixin for flow-canvas
//
// Delegates to the ComputeEngine for node-type registration and topological
// data propagation. Two methods, zero dependencies on other mixins.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { ComputeDefinition } from '../../core/compute';

export function createComputeMixin(ctx: CanvasContext) {
  return {
    registerCompute(nodeType: string, definition: ComputeDefinition): void {
      ctx._computeEngine.registerCompute(nodeType, definition);
    },

    compute(startNodeId?: string): Map<string, Record<string, any>> {
      const results = ctx._computeEngine.compute(ctx.nodes, ctx.edges, startNodeId);
      ctx._emit('compute-complete', { results });

      // Remeasure node dimensions after the DOM updates from $outputs changes.
      // $nextTick waits for Alpine to flush reactive DOM updates, then rAF
      // waits for the browser to layout, then we measure.
      ctx.$nextTick(() => {
        requestAnimationFrame(() => {
          const changed = new Set<string>();
          for (const [nodeId] of results) {
            const el = ctx._nodeElements.get(nodeId);
            const node = ctx._nodeMap.get(nodeId);
            if (el && node) {
              // Clear inline dimensions so the element can grow to fit new content
              el.style.width = '';
              el.style.height = '';
              const w = el.offsetWidth;
              const h = el.offsetHeight;
              if (!node.dimensions || w !== node.dimensions.width || h !== node.dimensions.height) {
                node.dimensions = { width: w, height: h };
                changed.add(nodeId);
              }
              // A2: height control requires fixedDimensions to prevent the Alpine effect
              // from clearing inline height on leaf nodes. Compute is authoritative here.
              node.fixedDimensions = true;
              // Re-apply so the effect doesn't fight us
              el.style.width = w + 'px';
              el.style.height = h + 'px';
            }
          }
          // Refresh edge paths for nodes whose dimensions changed
          if (changed.size > 0) {
            ctx._refreshEdgePaths(changed);
          }
        });
      });

      return results;
    },
  };
}
