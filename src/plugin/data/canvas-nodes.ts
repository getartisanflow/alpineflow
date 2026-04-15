// ============================================================================
// canvas-nodes — Node CRUD, graph queries, filtering & intersection mixin
//
// Twelve methods covering the full node lifecycle: add/remove with child
// validation, graph traversal (outgoers/incomers/connected edges/connectivity),
// node filtering, and bounding-rect intersection queries.
//
// Cross-mixin deps (optional chaining): ctx.layoutChildren
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowNode, FlowEdge, XYPosition } from '../../core/types';
import { debug } from '../../core/debug';
import { sortNodesTopological, getDescendantIds } from '../../core/sub-flow';
import {
  computeReconnectionEdges,
  getConnectedEdges as graphGetConnectedEdges,
  getOutgoers as graphGetOutgoers,
  getIncomers as graphGetIncomers,
  areNodesConnected as graphAreNodesConnected,
} from '../../core/graph';
import {
  validateChildAdd,
  validateChildRemove,
} from '../../core/child-validation';
import {
  getIntersectingNodes as coreGetIntersectingNodes,
  isNodeIntersecting as coreIsNodeIntersecting,
} from '../../core/intersection';
import { collabStore } from '../../collab/store';

export function createNodesMixin(ctx: CanvasContext) {
  return {
    /**
     * Add one or more nodes to the canvas.
     *
     * - Normalizes single node or array input.
     * - When `options.center` is set, stashes intended positions off-screen
     *   so the directive can measure dimensions without a visible flash,
     *   then repositions after measurement via double-rAF.
     * - Validates child constraints before accepting each node.
     * - Captures history, sorts topologically, rebuilds node map.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Runs child layout for any layout parents that received new children.
     * - Schedules auto-layout after the mutation.
     */
    addNodes(newNodes: FlowNode | FlowNode[], options?: { center?: boolean }): void {
      ctx._captureHistory();
      let arr = Array.isArray(newNodes) ? newNodes : [newNodes];
      debug('init', `Adding ${arr.length} node(s)`, arr.map((n) => n.id));

      // When center is requested, stash intended positions and place off-screen
      // so the directive can measure dimensions without a visible flash.
      const intendedPositions = new Map<string, XYPosition>();
      if (options?.center) {
        for (const node of arr) {
          intendedPositions.set(node.id, { ...node.position });
        }
        arr = arr.map(n => ({ ...n, position: { x: -9999, y: -9999 } }));
      }

      // Child validation: check each batch node before adding
      const acceptedNodes: FlowNode[] = [];
      for (const node of arr) {
        if (node.parentId) {
          const rules = ctx._getChildValidation(node.parentId);
          if (rules) {
            const parent = ctx._nodeMap.get(node.parentId);
            if (parent) {
              // Count existing siblings + already-accepted batch siblings
              const siblings = [
                ...(ctx.nodes as FlowNode[]).filter(
                  (n: FlowNode) => n.parentId === node.parentId,
                ),
                ...acceptedNodes.filter(
                  (n: FlowNode) => n.parentId === node.parentId,
                ),
              ];
              const result = validateChildAdd(parent, node, siblings, rules);
              if (!result.valid) {
                if (ctx._config.onChildValidationFail) {
                  ctx._config.onChildValidationFail({
                    parent,
                    child: node,
                    operation: 'add',
                    rule: result.rule!,
                    message: result.message!,
                  });
                }
                continue;
              }
            }
          }
        }
        acceptedNodes.push(node);
      }
      arr = acceptedNodes;
      ctx.nodes.push(...arr);

      // Capture configured dimensions before layout stretch modifies them
      for (const node of arr) {
        if (node.dimensions) {
          ctx._initialDimensions.set(node.id, { ...node.dimensions });
        }
      }

      ctx.nodes = sortNodesTopological(ctx.nodes);
      ctx._rebuildNodeMap();

      // A3: Install childLayout watchers for any newly added container nodes so
      // that mutations to their layout properties trigger re-layout automatically.
      // Look up each node via _nodeMap to get the Alpine reactive proxy (not the
      // original plain object) — Alpine.watch must receive the reactive version so
      // mutations go through the proxy and trigger watchers correctly.
      for (const node of arr) {
        if (node.childLayout) {
          const reactiveNode = ctx._nodeMap.get(node.id);
          if (reactiveNode) {
            ctx._installChildLayoutWatchers(reactiveNode);
          }
        }
      }

      ctx._emit('nodes-change', { type: 'add', nodes: arr });

      const collab = ctx._container ? collabStore.get(ctx._container) : undefined;
      if (collab?.bridge) {
        for (const node of arr) {
          collab.bridge.pushLocalNodeAdd(node);
        }
      }

      // After measurement, center each node on its intended drop position
      if (options?.center) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            for (const [id, pos] of intendedPositions) {
              const node = ctx.nodes.find((n: FlowNode) => n.id === id);
              if (!node) continue;
              const w = node.dimensions?.width ?? 0;
              const h = node.dimensions?.height ?? 0;
              node.position.x = pos.x - w / 2;
              node.position.y = pos.y - h / 2;
            }
          });
        });
      }

      ctx._recomputeChildValidation();

      // Run child layout for any layout parents that received new children
      const layoutParents = new Set<string>();
      for (const node of arr) {
        if (node.parentId) {
          const parent = ctx._nodeMap.get(node.parentId);
          if (parent?.childLayout) {
            // Auto-assign order if not set
            if (node.order == null) {
              const siblings = ctx.nodes.filter(
                (n: FlowNode) => n.parentId === node.parentId && n.id !== node.id,
              );
              node.order = siblings.length > 0
                ? Math.max(...siblings.map((s: FlowNode) => s.order ?? 0)) + 1
                : 0;
            }
            layoutParents.add(node.parentId);
          }
        }
      }
      // Layout from the topmost layout ancestor so constraints
      // (maxDimensions, stretch) cascade all the way down.
      const addRoots = new Set<string>();
      for (const pid of layoutParents) {
        let topmost = pid;
        let walkId = ctx._nodeMap.get(pid)?.parentId;
        while (walkId) {
          const ancestor = ctx._nodeMap.get(walkId);
          if (ancestor?.childLayout) topmost = walkId;
          walkId = ancestor?.parentId;
        }
        addRoots.add(topmost);
      }
      // A4: route through dedup so multiple addNodes calls within the same
      // batch/frame collapse to a single layout pass per parent (consistent
      // with removeNodes behavior, which also calls layoutChildren per parent).
      for (const rid of addRoots) {
        if (ctx._layoutDedup) {
          ctx._layoutDedup.safeLayoutChildren(rid);
        } else {
          ctx.layoutChildren?.(rid);
        }
      }

      ctx._scheduleAutoLayout();
    },

    /**
     * Remove one or more nodes by ID.
     *
     * - Normalizes single ID or array input.
     * - Validates child constraints before allowing removal.
     * - Cascades removal to all descendants.
     * - Removes connected edges and optionally creates reconnection bridges.
     * - Cleans up selection state and initial dimensions.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Re-layouts any layout parents that lost children.
     * - Schedules auto-layout after the mutation.
     */
    removeNodes(ids: string | string[]): void {
      ctx._captureHistory();
      const idSet = new Set(Array.isArray(ids) ? ids : [ids]);

      // Child validation: check if removing would violate parent constraints
      const blockedIds = new Set<string>();
      for (const id of [...idSet]) {
        const node = ctx._nodeMap.get(id);
        if (!node?.parentId) continue;
        if (idSet.has(node.parentId)) continue;
        const rules = ctx._getChildValidation(node.parentId);
        if (!rules) continue;
        const parent = ctx._nodeMap.get(node.parentId);
        if (!parent) continue;
        const siblings = (ctx.nodes as FlowNode[]).filter(
          (n: FlowNode) => n.parentId === node.parentId,
        );
        const result = validateChildRemove(parent, node, siblings, rules);
        if (!result.valid) {
          blockedIds.add(id);
          if (ctx._config.onChildValidationFail) {
            ctx._config.onChildValidationFail({
              parent,
              child: node,
              operation: 'remove',
              rule: result.rule!,
              message: result.message!,
            });
          }
        }
      }
      for (const id of blockedIds) {
        idSet.delete(id);
      }
      if (idSet.size === 0) return;

      // Capture parent IDs before removal so we can re-layout them after
      const removedParentMap = new Map<string, string>();
      for (const id of idSet) {
        const node = ctx._nodeMap.get(id);
        if (node?.parentId) removedParentMap.set(id, node.parentId);
      }

      // Also remove all descendants of the targeted nodes
      for (const id of [...idSet]) {
        for (const descId of getDescendantIds(id, ctx.nodes)) {
          idSet.add(descId);
        }
      }
      debug('destroy', `Removing ${idSet.size} node(s)`, [...idSet]);
      const removed = ctx.nodes.filter((n: FlowNode) => idSet.has(n.id));

      // Compute reconnection edges BEFORE removing connected edges
      let reconnected: FlowEdge[] = [];
      if (ctx._config.reconnectOnDelete) {
        reconnected = computeReconnectionEdges(idSet, ctx.nodes as FlowNode[], ctx.edges as FlowEdge[]);
      }

      // Remove connected edges — track removed IDs for collab sync
      const removedEdgeIds: string[] = [];
      ctx.edges = ctx.edges.filter((e: FlowEdge) => {
        if (idSet.has(e.source) || idSet.has(e.target)) {
          removedEdgeIds.push(e.id);
          return false;
        }
        return true;
      });

      // Add reconnection bridge edges
      if (reconnected.length) {
        ctx.edges.push(...reconnected);
        debug('destroy', `Created ${reconnected.length} reconnection edge(s)`);
      }

      ctx._rebuildEdgeMap();
      ctx.nodes = ctx.nodes.filter((n: FlowNode) => !idSet.has(n.id));
      ctx._rebuildNodeMap();
      // Clean up selection and childLayout watchers
      for (const id of idSet) {
        ctx.selectedNodes.delete(id);
        ctx._initialDimensions.delete(id);
        ctx._uninstallChildLayoutWatchers(id);
      }
      if (removed.length) ctx._emit('nodes-change', { type: 'remove', nodes: removed });
      if (reconnected.length) ctx._emit('edges-change', { type: 'add', edges: reconnected });

      const collab = ctx._container ? collabStore.get(ctx._container) : undefined;
      if (collab?.bridge) {
        for (const id of idSet) {
          collab.bridge.pushLocalNodeRemove(id);
        }
        for (const edgeId of removedEdgeIds) {
          collab.bridge.pushLocalEdgeRemove(edgeId);
        }
        for (const edge of reconnected) {
          collab.bridge.pushLocalEdgeAdd(edge);
        }
      }

      ctx._recomputeChildValidation();

      // Re-layout from the topmost layout ancestor so constraints
      // (maxDimensions, stretch) cascade down after the removal.
      const removedLayoutParents = new Set<string>();
      for (const id of idSet) {
        const parentId = removedParentMap.get(id);
        if (parentId) {
          const parent = ctx._nodeMap.get(parentId);
          if (parent?.childLayout) removedLayoutParents.add(parentId);
        }
      }
      const removeRoots = new Set<string>();
      for (const pid of removedLayoutParents) {
        let topmost = pid;
        let walkId = ctx._nodeMap.get(pid)?.parentId;
        while (walkId) {
          const ancestor = ctx._nodeMap.get(walkId);
          if (ancestor?.childLayout) topmost = walkId;
          walkId = ancestor?.parentId;
        }
        removeRoots.add(topmost);
      }
      for (const rid of removeRoots) ctx.layoutChildren?.(rid);

      ctx._scheduleAutoLayout();
    },

    /**
     * Look up a node by ID.
     */
    getNode(id: string): FlowNode | undefined {
      return ctx._nodeMap.get(id);
    },

    /**
     * Get all nodes connected via outgoing edges from the given node.
     */
    getOutgoers(nodeId: string): FlowNode[] {
      return graphGetOutgoers(nodeId, ctx.nodes, ctx.edges);
    },

    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(nodeId: string): FlowNode[] {
      return graphGetIncomers(nodeId, ctx.nodes, ctx.edges);
    },

    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(nodeId: string): FlowEdge[] {
      return graphGetConnectedEdges(nodeId, ctx.edges);
    },

    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(nodeA: string, nodeB: string, directed: boolean = false): boolean {
      return graphAreNodesConnected(nodeA, nodeB, ctx.edges, directed);
    },

    /**
     * Apply a node-level filter predicate.
     * Nodes that fail the predicate get `filtered = true`.
     */
    setNodeFilter(predicate: (node: FlowNode) => boolean): void {
      const filtered: FlowNode[] = [];
      const visible: FlowNode[] = [];
      for (const node of ctx.nodes as FlowNode[]) {
        const shouldFilter = !predicate(node);
        node.filtered = shouldFilter;
        if (shouldFilter) {
          filtered.push(node);
        } else {
          visible.push(node);
        }
      }
      debug('filter', `Node filter applied: ${visible.length} visible, ${filtered.length} filtered`);
      ctx._emit('node-filter-change', { filtered, visible });
    },

    /**
     * Clear node filter — restore all nodes to visible.
     */
    clearNodeFilter(): void {
      let hadFiltered = false;
      for (const node of ctx.nodes as FlowNode[]) {
        if (node.filtered) {
          node.filtered = false;
          hadFiltered = true;
        }
      }
      if (hadFiltered) {
        debug('filter', 'Node filter cleared');
        ctx._emit('node-filter-change', { filtered: [], visible: [...ctx.nodes] });
      }
    },

    /**
     * Get nodes whose bounding rect overlaps the given node.
     * Accepts either a FlowNode object or a node ID string.
     */
    getIntersectingNodes(nodeOrId: FlowNode | string, partially?: boolean): FlowNode[] {
      const node = typeof nodeOrId === 'string' ? ctx.nodes.find((n: FlowNode) => n.id === nodeOrId) : nodeOrId;
      if (!node) return [];
      return coreGetIntersectingNodes(node, ctx.nodes, partially);
    },

    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(nodeOrId: FlowNode | string, targetOrId: FlowNode | string, partially?: boolean): boolean {
      const node = typeof nodeOrId === 'string' ? ctx.nodes.find((n: FlowNode) => n.id === nodeOrId) : nodeOrId;
      const target = typeof targetOrId === 'string' ? ctx.nodes.find((n: FlowNode) => n.id === targetOrId) : targetOrId;
      if (!node || !target) return false;
      return coreIsNodeIntersecting(node, target, partially);
    },
  };
}
