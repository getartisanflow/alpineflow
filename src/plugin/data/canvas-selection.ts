// ============================================================================
// canvas-selection — Selection, clipboard, and deletion mixin for flow-canvas
//
// Public API: deselectAll, _deleteSelected, copy, paste, cut.
//
// Selection state (selectedNodes, selectedEdges Sets) is declared in the
// orchestrator. This mixin provides deselection clearing, user-initiated
// deletion with child validation and onBeforeDelete callback, and clipboard
// operations delegating to core/clipboard pure functions.
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowNode, FlowEdge } from '../../core/types';
import { copySelection, pasteClipboard, cutSelection } from '../../core/clipboard';
import { validateChildRemove } from '../../core/child-validation';
import { isDeletable } from '../../core/node-flags';
import { sortNodesTopological } from '../../core/sub-flow';
import { debug } from '../../core/debug';

export function createSelectionMixin(ctx: CanvasContext) {
  return {
    // ── Deselect ─────────────────────────────────────────────────────────

    /**
     * Clear all node, edge, and row selections.
     *
     * - Sets `selected = false` on each selected node/edge data object.
     * - Clears `selectedNodes`, `selectedEdges`, and `selectedRows` Sets.
     * - Removes `.flow-node-selected`, `.flow-edge-selected`, and
     *   `.flow-row-selected` CSS classes from the DOM.
     * - Emits a `selection-change` event.
     */
    deselectAll(): void {
      if (ctx.selectedNodes.size === 0 && ctx.selectedEdges.size === 0 && ctx.selectedRows.size === 0) return;
      debug('selection', 'Deselecting all');
      for (const id of ctx.selectedNodes) {
        const n = ctx.getNode(id);
        if (n) n.selected = false;
      }
      for (const id of ctx.selectedEdges) {
        const e = ctx.getEdge(id);
        if (e) e.selected = false;
      }
      ctx.selectedNodes.clear();
      ctx.selectedEdges.clear();
      ctx.selectedRows.clear();
      // Remove selection class from all node/edge/row elements
      ctx._container?.querySelectorAll('.flow-node-selected, .flow-edge-selected, .flow-row-selected').forEach((el: Element) => {
        el.classList.remove('flow-node-selected', 'flow-edge-selected', 'flow-row-selected');
      });
      ctx._emitSelectionChange();
    },

    // ── Deletion ─────────────────────────────────────────────────────────

    /**
     * Delete currently selected nodes and edges.
     *
     * - Filters out non-deletable nodes/edges (where `deletable === false`).
     * - Cascades edge deletion for edges connected to deleted nodes.
     * - Validates child removal constraints before deleting child nodes.
     * - Supports an async `onBeforeDelete` callback that can cancel or
     *   modify the set of items to delete.
     * - Wraps the entire operation in a single history step.
     */
    async _deleteSelected(): Promise<void> {
      // Collect deletable selected nodes
      const nodeIds = [...ctx.selectedNodes].filter((id: string) => {
        const n = ctx.getNode(id);
        return n ? isDeletable(n) : false;
      });
      // Collect deletable selected edges
      const edgeIds = [...ctx.selectedEdges].filter((id: string) => {
        const edge = ctx.getEdge(id);
        return edge?.deletable !== false;
      });

      let nodesToDelete = nodeIds.map((id: string) => ctx.getNode(id)!).filter(Boolean);
      // Compute cascaded edges (connected to deleted nodes)
      const nodeIdSet = new Set(nodeIds);
      const cascadedEdges = (ctx.edges as FlowEdge[]).filter(
        (e: FlowEdge) => nodeIdSet.has(e.source) || nodeIdSet.has(e.target),
      );
      // Merge explicitly selected edges with cascaded (dedupe)
      const allEdgeMap = new Map<string, FlowEdge>();
      for (const e of cascadedEdges) allEdgeMap.set(e.id, e);
      for (const id of edgeIds) {
        const e = ctx.getEdge(id);
        if (e) allEdgeMap.set(e.id, e);
      }
      const edgesToDelete = [...allEdgeMap.values()];

      // Child validation: filter out nodes whose deletion would violate parent constraints
      nodesToDelete = nodesToDelete.filter((node: FlowNode) => {
        if (!node.parentId) return true;
        // Parent is also being deleted — no constraint to check
        if (nodesToDelete.some((n: FlowNode) => n.id === node.parentId)) return true;
        const rules = ctx._getChildValidation(node.parentId);
        if (!rules) return true;
        const parent = ctx.getNode(node.parentId);
        if (!parent) return true;
        const siblings = (ctx.nodes as FlowNode[]).filter(
          (n: FlowNode) => n.parentId === node.parentId,
        );
        const result = validateChildRemove(parent, node, siblings, rules);
        if (!result.valid && ctx._config.onChildValidationFail) {
          ctx._config.onChildValidationFail({
            parent,
            child: node,
            operation: 'remove',
            rule: result.rule!,
            message: result.message!,
          });
        }
        return result.valid;
      });

      if (nodesToDelete.length === 0 && edgesToDelete.length === 0) return;

      if (ctx._config?.onBeforeDelete) {
        const result = await ctx._config.onBeforeDelete({
          nodes: nodesToDelete,
          edges: edgesToDelete,
        });
        if (result === false) {
          debug('delete', 'onBeforeDelete cancelled deletion');
          return;
        }
        ctx._captureHistory();
        ctx._suspendHistory();
        try {
          if (result.nodes.length > 0) {
            debug('delete', `onBeforeDelete approved ${result.nodes.length} node(s)`);
            ctx.removeNodes(result.nodes.map((n: FlowNode) => n.id));
          }
          if (result.edges.length > 0) {
            const remainingEdgeIds = result.edges
              .map((e: FlowEdge) => e.id)
              .filter((id: string) => (ctx.edges as FlowEdge[]).some((e: FlowEdge) => e.id === id));
            if (remainingEdgeIds.length > 0) {
              debug('delete', `onBeforeDelete approved ${remainingEdgeIds.length} edge(s)`);
              ctx.removeEdges(remainingEdgeIds);
            }
          }
          ctx._recomputeChildValidation();
          for (const id of ctx.selectedNodes) {
            if (!(ctx.nodes as FlowNode[]).some((n: FlowNode) => n.id === id)) {
              ctx.selectedNodes.delete(id);
            }
          }
          for (const id of ctx.selectedEdges) {
            if (!(ctx.edges as FlowEdge[]).some((e: FlowEdge) => e.id === id)) {
              ctx.selectedEdges.delete(id);
            }
          }
        } finally {
          ctx._resumeHistory();
        }
        return;
      }

      ctx._captureHistory();
      ctx._suspendHistory();
      try {
        if (nodesToDelete.length > 0) {
          debug('delete', `Deleting ${nodesToDelete.length} selected node(s)`);
          ctx.removeNodes(nodesToDelete.map((n: FlowNode) => n.id));
        }
        if (edgeIds.length > 0) {
          const remainingEdgeIds = edgeIds.filter((id: string) =>
            (ctx.edges as FlowEdge[]).some((e: FlowEdge) => e.id === id),
          );
          if (remainingEdgeIds.length > 0) {
            debug('delete', `Deleting ${remainingEdgeIds.length} selected edge(s)`);
            ctx.removeEdges(remainingEdgeIds);
          }
        }
        ctx._recomputeChildValidation();
        for (const id of ctx.selectedNodes) {
          if (!(ctx.nodes as FlowNode[]).some((n: FlowNode) => n.id === id)) {
            ctx.selectedNodes.delete(id);
          }
        }
        for (const id of ctx.selectedEdges) {
          if (!(ctx.edges as FlowEdge[]).some((e: FlowEdge) => e.id === id)) {
            ctx.selectedEdges.delete(id);
          }
        }
      } finally {
        ctx._resumeHistory();
      }
    },

    // ── Clipboard Operations ─────────────────────────────────────────────

    /**
     * Copy currently selected nodes and their internal edges to the
     * module-level clipboard. Emits a `copy` event.
     */
    copy(): void {
      const result = copySelection(ctx.nodes, ctx.edges);
      if (result.nodeCount > 0) {
        debug('clipboard', `Copied ${result.nodeCount} node(s) and ${result.edgeCount} edge(s)`);
        ctx._emit('copy', result);
      }
    },

    /**
     * Paste nodes/edges from the clipboard with new IDs and an
     * accumulating 20 px offset.
     *
     * - Deselects all current selection first.
     * - Pushes new nodes (topologically sorted) and edges directly.
     * - Selects all pasted items.
     * - Applies `.flow-node-selected` / `.flow-edge-selected` CSS classes
     *   after Alpine renders the new DOM elements.
     */
    paste(): void {
      const result = pasteClipboard();
      if (!result) return;
      ctx._captureHistory();
      ctx.deselectAll();
      // Add pasted items directly to avoid double history capture from addNodes/addEdges
      ctx.nodes.push(...result.nodes);
      ctx.nodes = sortNodesTopological(ctx.nodes);
      ctx._rebuildNodeMap();
      ctx.edges.push(...result.edges);
      ctx._rebuildEdgeMap();
      // Update selection sets
      for (const n of result.nodes) {
        ctx.selectedNodes.add(n.id);
      }
      for (const e of result.edges) {
        ctx.selectedEdges.add(e.id);
      }
      ctx._emitSelectionChange();
      ctx._emit('nodes-change', { type: 'add', nodes: result.nodes });
      ctx._emit('edges-change', { type: 'add', edges: result.edges });
      ctx._emit('paste', { nodes: result.nodes, edges: result.edges });
      debug('clipboard', `Pasted ${result.nodes.length} node(s) and ${result.edges.length} edge(s)`);
      // Apply selected CSS class after Alpine renders the new DOM elements
      ctx.$nextTick(() => {
        for (const n of result.nodes) {
          const el = ctx._container?.querySelector(`[data-flow-node-id="${CSS.escape(n.id)}"]`);
          el?.classList.add('flow-node-selected');
        }
        for (const e of result.edges) {
          const el = ctx._container?.querySelector(`[data-flow-edge-id="${CSS.escape(e.id)}"]`);
          el?.classList.add('flow-edge-selected');
        }
      });
    },

    /**
     * Copy selected nodes to the clipboard, then delete them.
     * Emits a `cut` event.
     */
    async cut(): Promise<void> {
      if (ctx.selectedNodes.size === 0) return;
      const result = cutSelection(ctx.nodes, ctx.edges);
      if (result.nodeCount === 0) return;
      await ctx._deleteSelected();
      ctx._emit('cut', { nodeCount: result.nodeCount, edgeCount: result.edgeCount });
      debug('clipboard', `Cut ${result.nodeCount} node(s)`);
    },
  };
}
