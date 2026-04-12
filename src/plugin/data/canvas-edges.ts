// ============================================================================
// canvas-edges — Edge CRUD & DOM element access mixin for flow-canvas
//
// Public API: addEdges, removeEdges, getEdge, getEdgePathElement,
//             getEdgeElement, getEdgeSvgElement.
//
// Six methods handling edge lifecycle operations. addEdges merges
// defaultEdgeOptions from config onto new edges.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowEdge } from '../../core/types';
import { debug } from '../../core/debug';
import { collabStore } from '../../collab/store';

export function createEdgesMixin(ctx: CanvasContext) {
  return {
    /**
     * Add one or more edges to the canvas.
     *
     * - Normalizes single edge or array input.
     * - Merges `defaultEdgeOptions` from config (edge-specific props override defaults).
     * - Captures history before mutation.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Schedules auto-layout after the mutation.
     */
    addEdges(newEdges: FlowEdge | FlowEdge[]): void {
      ctx._captureHistory();
      const defaults = ctx._config.defaultEdgeOptions;
      const arr = (Array.isArray(newEdges) ? newEdges : [newEdges]).map((e) =>
        defaults ? { ...defaults, ...e } : e,
      );
      debug('edge', `Adding ${arr.length} edge(s)`, arr.map((e) => e.id));
      ctx.edges.push(...arr);
      ctx._rebuildEdgeMap();
      ctx._emit('edges-change', { type: 'add', edges: arr });

      const collab = ctx._container ? collabStore.get(ctx._container) : undefined;
      if (collab?.bridge) {
        for (const edge of arr) {
          collab.bridge.pushLocalEdgeAdd(edge);
        }
      }

      ctx._scheduleAutoLayout();
    },

    /**
     * Remove one or more edges by ID.
     *
     * - Normalizes single ID or array input.
     * - Filters edges, rebuilds edge map, deselects removed edges.
     * - Captures history before mutation.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Schedules auto-layout after the mutation.
     */
    removeEdges(ids: string | string[]): void {
      ctx._captureHistory();
      const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
      debug('edge', `Removing ${idSet.size} edge(s)`, [...idSet]);
      const removed = ctx.edges.filter((e: FlowEdge) => idSet.has(e.id));
      ctx.edges = ctx.edges.filter((e: FlowEdge) => !idSet.has(e.id));
      ctx._rebuildEdgeMap();
      for (const id of idSet) {
        ctx.selectedEdges.delete(id);
      }
      if (removed.length) ctx._emit('edges-change', { type: 'remove', edges: removed });

      const collab = ctx._container ? collabStore.get(ctx._container) : undefined;
      if (collab?.bridge) {
        for (const id of idSet) {
          collab.bridge.pushLocalEdgeRemove(id);
        }
      }

      ctx._scheduleAutoLayout();
    },

    /**
     * Look up an edge by ID.
     */
    getEdge(id: string): FlowEdge | undefined {
      return ctx._edgeMap.get(id);
    },

    /**
     * Get the visible SVG `<path>` element for an edge.
     * The visible path is the second `<path>` child (the first is the interaction hit area).
     */
    getEdgePathElement(id: string): SVGPathElement | null {
      const g = ctx._container?.querySelector(`[data-flow-edge-id="${CSS.escape(id)}"]`);
      // The visible path is the second <path> child (first is the interaction hit area)
      return g?.querySelector('path:nth-child(2)') as SVGPathElement | null;
    },

    /**
     * Get the container element (SVG group) for an edge.
     */
    getEdgeElement(id: string): SVGElement | HTMLElement | null {
      return ctx._container?.querySelector(`[data-flow-edge-id="${CSS.escape(id)}"]`) as SVGElement | null;
    },

    /**
     * Get the SVG element that hosts edge paths.
     * Returns the first `.flow-edge-svg` element inside the viewport,
     * used for injecting temporary paths (guide paths, particle paths).
     */
    getEdgeSvgElement(): SVGSVGElement | null {
      return ctx._viewportEl?.querySelector('.flow-edge-svg') as SVGSVGElement | null;
    },
  };
}
