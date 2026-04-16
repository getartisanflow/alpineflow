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
import { checkConnectionRules } from '../../core/connections';

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
      const defaults = ctx._config.defaultEdgeOptions;
      const connectionRules = ctx._config.connectionRules;
      const arr = (Array.isArray(newEdges) ? newEdges : [newEdges])
        .map((e) => (defaults ? { ...defaults, ...e } : e))
        .filter((e) => {
          if (!connectionRules) return true;
          const connection = { source: e.source, sourceHandle: e.sourceHandle, target: e.target, targetHandle: e.targetHandle };
          return checkConnectionRules(connection, connectionRules, ctx._nodeMap);
        });
      if (arr.length === 0) return;
      ctx._captureHistory();
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
     * Returns the first `.flow-edge-svg` element inside the viewport if any edges
     * exist. When the canvas has zero edges (e.g., a particle-only canvas using
     * sendParticleAlongPath or sendParticleBetween), lazily creates and caches a
     * dedicated `.flow-particle-svg` element inside the edges container so
     * particle emission methods have a place to inject temporary paths.
     */
    getEdgeSvgElement(): SVGSVGElement | null {
      if (!ctx._viewportEl) return null;
      const existing = ctx._viewportEl.querySelector('.flow-edge-svg') as SVGSVGElement | null;
      if (existing) return existing;

      const edgesDiv = ctx._viewportEl.querySelector('.flow-edges');
      if (!edgesDiv) return null;

      let fallback = edgesDiv.querySelector('.flow-particle-svg') as SVGSVGElement | null;
      if (!fallback) {
        fallback = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
        // Match the structural.css .flow-edge-svg sizing pattern exactly:
        // 1px × 1px with overflow:visible so children render at their absolute
        // SVG user-space coordinates. 100% width/height would resolve to 0×0
        // because .flow-edges has no explicit dimensions.
        fallback.setAttribute('class', 'flow-particle-svg');
        fallback.style.position = 'absolute';
        fallback.style.top = '0';
        fallback.style.left = '0';
        fallback.style.width = '1px';
        fallback.style.height = '1px';
        fallback.style.overflow = 'visible';
        fallback.style.pointerEvents = 'none';
        edgesDiv.appendChild(fallback);
      }
      return fallback;
    },
  };
}
