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
import { mergeEntitiesById } from '../../core/deep-merge';
import type { HistorySnapshot } from '../../core/history';
import { debug } from '../../core/debug';

/**
 * Apply an undo/redo snapshot by MERGING it into the existing reactive node
 * and edge objects instead of wholesale-replacing them. Surviving ids keep
 * their original object identity, so live Alpine edge/node scopes (and the
 * child-layout watchers bound to node proxies) stay attached — a wholesale
 * `ctx.edges = snapshot.edges` would orphan every edge scope. Array identity is
 * preserved via `splice`, and a `restore` event is emitted so the wire addon and
 * collaboration observers are notified of the change.
 */
function applyHistorySnapshot(
  ctx: CanvasContext,
  snapshot: HistorySnapshot,
  origin: 'undo' | 'redo',
): void {
  const mergedNodes = mergeEntitiesById(ctx.nodes, sortNodesTopological(snapshot.nodes));
  ctx.nodes.splice(0, ctx.nodes.length, ...mergedNodes);
  const mergedEdges = mergeEntitiesById(ctx.edges, snapshot.edges);
  ctx.edges.splice(0, ctx.edges.length, ...mergedEdges);
  ctx._rebuildNodeMap();
  ctx._rebuildEdgeMap();
  ctx.deselectAll();
  // Snapshots may carry selected: true from capture time; deselectAll only
  // clears ids present in the (already-cleared) selection sets, so clear the
  // restored flags on the surviving objects directly.
  for (const n of ctx.nodes) {
    if (n.selected) n.selected = false;
  }
  for (const e of ctx.edges) {
    if (e.selected) e.selected = false;
  }
  // Carry the restored nodes/edges (parity with fromObject's `restore` payload)
  // plus an `origin` tag, so the wire addon / collaboration observers can react to
  // undo/redo the same way they react to fromObject.
  ctx._emit('restore', { nodes: ctx.nodes, edges: ctx.edges, origin });
  // Bump _layoutAnimTick in a rAF so edge effects re-run after node effects
  // have repositioned DOM elements (edges measure handle positions from the
  // DOM via getBoundingClientRect).
  requestAnimationFrame(() => {
    ctx._layoutAnimTick++;
    ctx._commitNodeGeometry?.();
  });
  debug('history', `${origin} applied`, { nodes: snapshot.nodes.length, edges: snapshot.edges.length });
}

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
        // Merge into existing reactive node objects (preserving identity for
        // surviving ids) instead of wholesale replacement. Keep array identity
        // via splice so Alpine's x-for and the child-layout watchers stay bound.
        const incomingNodes = sortNodesTopological(
          JSON.parse(JSON.stringify(obj.nodes)) as FlowNode[],
        );
        const mergedNodes = mergeEntitiesById(ctx.nodes, incomingNodes);
        ctx.nodes.splice(0, ctx.nodes.length, ...mergedNodes);
      }
      if (obj.edges) {
        // Merge into existing reactive edge objects so that Alpine scopes
        // bound via addScopeToNode (in flow-viewport) keep working.
        // A wholesale array replacement would orphan the old proxy refs
        // that flow-edge effects are watching.
        const incomingEdges: FlowEdge[] = JSON.parse(JSON.stringify(obj.edges));
        const mergedEdges = mergeEntitiesById(ctx.edges, incomingEdges);
        ctx.edges.splice(0, ctx.edges.length, ...mergedEdges);
      }
      ctx._rebuildNodeMap();
      ctx._rebuildEdgeMap();
      if (obj.viewport) {
        const vp = { ...ctx.viewport, ...obj.viewport };
        ctx._panZoom?.setViewport(vp);
      }
      ctx.deselectAll();
      ctx._emit('restore', { ...obj, origin: 'load' });
      ctx._scheduleAutoLayout();
      // Ensure edges re-measure DOM handle positions after node effects
      // have repositioned elements (edges use getBoundingClientRect).
      requestAnimationFrame(() => {
        ctx._layoutAnimTick++;
        ctx._commitNodeGeometry?.();
      });
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

    /**
     * Replace the whole graph atomically — the first-class alternative to the
     * `$clear()` + `addNodes()` workaround. Built on the identity-preserving
     * `fromObject` path: surviving ids keep their live objects, new ids mount
     * fresh and measure, so an immediate `fitView()` actually fits (no manual
     * `await nextFrame()`). `edges` defaults to empty, so `replaceNodes(nodes)`
     * is a genuine whole-graph replace. Emits `restore` with `origin: 'load'`.
     * The returned promise resolves once the new nodes have measured dimensions.
     */
    replaceNodes(nodes: FlowNode[], edges?: FlowEdge[]): Promise<void> {
      this.fromObject({ nodes, edges: edges ?? [] });
      return ctx._whenMeasured().then(() => undefined);
    },

    /**
     * Replace just the nodes, leaving the current edges in place (the
     * react-flow-style `setNodes`). For a whole-graph swap use `replaceNodes`.
     * Resolves once the new nodes have measured dimensions.
     */
    setNodes(nodes: FlowNode[]): Promise<void> {
      this.fromObject({ nodes });
      return ctx._whenMeasured().then(() => undefined);
    },

    // ── Undo / Redo ────────────────────────────────────────────

    /**
     * Undo the last structural change by popping a snapshot from the
     * history past stack. Rebuilds maps and deselects all after applying.
     */
    undo(): void {
      if (!ctx._history) return;
      const snapshot = ctx._history.undo({ nodes: ctx.nodes, edges: ctx.edges });
      if (snapshot) applyHistorySnapshot(ctx, snapshot, 'undo');
    },

    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo(): void {
      if (!ctx._history) return;
      const snapshot = ctx._history.redo({ nodes: ctx.nodes, edges: ctx.edges });
      if (snapshot) applyHistorySnapshot(ctx, snapshot, 'redo');
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
