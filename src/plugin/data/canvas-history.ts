// ============================================================================
// canvas-history — Undo/redo & serialization mixin for flow-canvas
//
// Public API: undo, redo, canUndo, canRedo, toObject, fromObject, $reset, $clear.
//
// Eight methods handling history operations and state serialization.
// undo/redo apply snapshots from the FlowHistory stack, then rebuild maps.
// toObject/fromObject deep-clone state for save/restore workflows.
// $reset/$clear are convenience wrappers around fromObject.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowNode, FlowEdge, Viewport } from '../../core/types';
import { sortNodesTopological } from '../../core/sub-flow';
import { debug } from '../../core/debug';

export function createHistoryMixin(ctx: CanvasContext) {
  return {
    // ── Save / Restore ────────────────────────────────────────────

    /**
     * Serialize the current canvas state (nodes, edges, viewport) as a
     * deep-cloned plain object. Emits a `save` event with the snapshot.
     */
    toObject(): { nodes: FlowNode[]; edges: FlowEdge[]; viewport: Viewport } {
      const obj = {
        nodes: JSON.parse(JSON.stringify(ctx.nodes)) as FlowNode[],
        edges: JSON.parse(JSON.stringify(ctx.edges)) as FlowEdge[],
        viewport: { ...ctx.viewport },
      };
      ctx._emit('save', obj);
      return obj;
    },

    /**
     * Restore canvas state from a saved object.
     *
     * - Deep-clones incoming nodes/edges to avoid shared references.
     * - Sorts nodes topologically for correct parent-before-child ordering.
     * - Rebuilds node and edge lookup maps.
     * - Applies viewport if provided.
     * - Deselects all, emits `restore`, and schedules auto-layout.
     */
    fromObject(obj: { nodes?: FlowNode[]; edges?: FlowEdge[]; viewport?: Partial<Viewport> }): void {
      debug('store', `fromObject: restoring state`, {
        nodes: obj.nodes?.length ?? 0,
        edges: obj.edges?.length ?? 0,
        viewport: !!obj.viewport,
      });
      if (obj.nodes) {
        ctx.nodes = sortNodesTopological(JSON.parse(JSON.stringify(obj.nodes)));
      }
      if (obj.edges) {
        // Merge into existing reactive edge objects so that Alpine scopes
        // bound via addScopeToNode (in flow-viewport) keep working.
        // A wholesale array replacement would orphan the old proxy refs
        // that flow-edge effects are watching.
        const incoming: FlowEdge[] = JSON.parse(JSON.stringify(obj.edges));
        const existingById = new Map(ctx.edges.map((e: FlowEdge) => [e.id, e]));
        const merged: FlowEdge[] = [];
        for (const newEdge of incoming) {
          const existing = existingById.get(newEdge.id);
          if (existing) {
            // Remove stale properties
            for (const key of Object.keys(existing)) {
              if (key !== 'id' && !(key in newEdge)) delete (existing as any)[key];
            }
            Object.assign(existing, newEdge);
            merged.push(existing);
          } else {
            merged.push(newEdge);
          }
        }
        ctx.edges = merged;
      }
      ctx._rebuildNodeMap();
      ctx._rebuildEdgeMap();
      if (obj.viewport) {
        const vp = { ...ctx.viewport, ...obj.viewport };
        ctx._panZoom?.setViewport(vp);
      }
      ctx.deselectAll();
      ctx._emit('restore', obj);
      ctx._scheduleAutoLayout();
      // Ensure edges re-measure DOM handle positions after node effects
      // have repositioned elements (edges use getBoundingClientRect).
      requestAnimationFrame(() => { ctx._layoutAnimTick++; });
    },

    /**
     * Reset the canvas to its initial configuration state.
     */
    $reset(): void {
      debug('store', '$reset: restoring initial config');
      this.fromObject({
        nodes: ctx._config.nodes ?? [],
        edges: ctx._config.edges ?? [],
        viewport: ctx._config.viewport ?? { x: 0, y: 0, zoom: 1 },
      });
    },

    /**
     * Clear all nodes and edges, resetting the viewport to origin.
     */
    $clear(): void {
      debug('store', '$clear: emptying canvas');
      this.fromObject({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      });
    },

    // ── Undo / Redo ────────────────────────────────────────────

    /**
     * Undo the last structural change by popping a snapshot from the
     * history past stack. Rebuilds maps and deselects all after applying.
     */
    undo(): void {
      if (!ctx._history) return;
      const snapshot = ctx._history.undo({ nodes: ctx.nodes, edges: ctx.edges });
      if (snapshot) {
        ctx.nodes = sortNodesTopological(snapshot.nodes);
        ctx.edges = snapshot.edges;
        ctx._rebuildNodeMap();
        ctx._rebuildEdgeMap();
        ctx.deselectAll();
        // Bump _layoutAnimTick in a rAF so edge effects re-run after
        // node effects have repositioned DOM elements (edges measure
        // handle positions from the DOM via getBoundingClientRect).
        requestAnimationFrame(() => { ctx._layoutAnimTick++; });
        debug('history', 'Undo applied', { nodes: snapshot.nodes.length, edges: snapshot.edges.length });
      }
    },

    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Rebuilds maps and deselects all after applying.
     */
    redo(): void {
      if (!ctx._history) return;
      const snapshot = ctx._history.redo({ nodes: ctx.nodes, edges: ctx.edges });
      if (snapshot) {
        ctx.nodes = sortNodesTopological(snapshot.nodes);
        ctx.edges = snapshot.edges;
        ctx._rebuildNodeMap();
        ctx._rebuildEdgeMap();
        ctx.deselectAll();
        requestAnimationFrame(() => { ctx._layoutAnimTick++; });
        debug('history', 'Redo applied', { nodes: snapshot.nodes.length, edges: snapshot.edges.length });
      }
    },

    /**
     * Whether an undo operation is available.
     */
    get canUndo(): boolean {
      return ctx._history?.canUndo ?? false;
    },

    /**
     * Whether a redo operation is available.
     */
    get canRedo(): boolean {
      return ctx._history?.canRedo ?? false;
    },
  };
}
