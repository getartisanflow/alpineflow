// ============================================================================
// canvas-collapse — Collapse/expand mixin for flow-canvas
//
// Six methods that manage collapsing and expanding nodes, including animated
// transitions. Group nodes shrink to collapsed dimensions and hide children;
// regular nodes hide downstream outgoers via edge rerouting.
//
// Cross-mixin deps (optional chaining): ctx.animate, ctx.getEdgeElement
// ============================================================================

import type { CanvasContext } from './canvas-context';
import { debug } from '../../core/debug';
import {
  getCollapseTargets,
  captureCollapseState,
  applyCollapse,
  applyExpand,
  rerouteEdgesForCollapse,
  restoreReroutedEdges,
} from '../../core/collapse';
import { getDescendantIds } from '../../core/sub-flow';

/** Fallback dimensions when a node has no measured dimensions yet. */
const DEFAULT_NODE_DIMS = { width: 150, height: 50 };

export function createCollapseMixin(ctx: CanvasContext) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(id: string, options?: { animate?: boolean; recursive?: boolean }): void {
      const node = ctx._nodeMap.get(id);
      if (!node || node.collapsed) return;

      const targets = getCollapseTargets(id, ctx.nodes, ctx.edges, { recursive: options?.recursive });
      if (targets.size === 0) return;

      debug('collapse', `Collapsing node "${id}"`, {
        type: node.type ?? 'default',
        descendants: [...targets],
        animate: options?.animate !== false,
        recursive: options?.recursive ?? false,
      });

      ctx._captureHistory();

      const isGroup = node.type === 'group';
      const collapsedDims = isGroup
        ? (node.collapsedDimensions ?? { width: 150, height: 60 })
        : undefined;
      const shouldAnimate = options?.animate !== false;
      const state = captureCollapseState(node, ctx.nodes, targets);

      if (shouldAnimate) {
        ctx._suspendHistory();

        const nodeDims = node.dimensions ?? DEFAULT_NODE_DIMS;
        const refDims = isGroup && collapsedDims ? collapsedDims : nodeDims;

        const nodeTargets: Record<string, any> = {};
        for (const [targetId] of state.targetPositions) {
          const targetNode = ctx._nodeMap.get(targetId);
          if (!targetNode) continue;
          const targetDims = targetNode.dimensions ?? DEFAULT_NODE_DIMS;

          let targetX: number;
          let targetY: number;
          if (targetNode.parentId === id) {
            targetX = (refDims.width - targetDims.width) / 2;
            targetY = (refDims.height - targetDims.height) / 2;
          } else {
            targetX = node.position.x + (refDims.width - targetDims.width) / 2;
            targetY = node.position.y + (refDims.height - targetDims.height) / 2;
          }

          nodeTargets[targetId] = {
            position: { x: targetX, y: targetY },
            style: { opacity: '0' },
          };
        }

        if (isGroup && collapsedDims) {
          nodeTargets[id] = { dimensions: collapsedDims };
        }

        const edgeSvgs: SVGElement[] = [];
        for (const edge of ctx.edges) {
          if (targets.has(edge.source) || targets.has(edge.target)) {
            const svg = ctx.getEdgeElement?.(edge.id)?.closest('svg');
            if (svg) edgeSvgs.push(svg as SVGElement);
          }
        }

        if (ctx.animate) {
          ctx.animate({ nodes: nodeTargets }, {
            duration: 300,
            easing: 'easeInOut',
            onProgress: (progress: number) => {
              const opacity = String(1 - progress);
              for (const svg of edgeSvgs) svg.style.opacity = opacity;
            },
            onComplete: () => {
              for (const svg of edgeSvgs) svg.style.opacity = '';
              applyCollapse(node, ctx.nodes, state, collapsedDims);
              state.reroutedEdges = rerouteEdgesForCollapse(id, ctx.edges, targets);
              ctx._collapseState.set(id, state);
              ctx._resumeHistory();
              ctx._emit('node-collapse', { node, descendants: [...targets] });
            },
          });
        } else {
          applyCollapse(node, ctx.nodes, state, collapsedDims);
          state.reroutedEdges = rerouteEdgesForCollapse(id, ctx.edges, targets);
          ctx._collapseState.set(id, state);
          ctx._resumeHistory();
          ctx._emit('node-collapse', { node, descendants: [...targets] });
        }
      } else {
        applyCollapse(node, ctx.nodes, state, collapsedDims);
        state.reroutedEdges = rerouteEdgesForCollapse(id, ctx.edges, targets);
        ctx._collapseState.set(id, state);
        ctx._emit('node-collapse', { node, descendants: [...targets] });
      }
    },

    /**
     * Expand a previously collapsed node — restore descendants/outgoers.
     */
    expandNode(id: string, options?: { animate?: boolean }): void {
      const node = ctx._nodeMap.get(id);
      if (!node || !node.collapsed) return;

      const state = ctx._collapseState.get(id);
      if (!state) return;

      debug('collapse', `Expanding node "${id}"`, {
        type: node.type ?? 'default',
        descendants: [...state.targetPositions.keys()],
        animate: options?.animate !== false,
        reroutedEdges: state.reroutedEdges.size,
      });

      ctx._captureHistory();

      const isGroup = node.type === 'group';
      const shouldAnimate = options?.animate !== false;

      if (state.reroutedEdges.size > 0) {
        restoreReroutedEdges(ctx.edges, state.reroutedEdges);
      }

      if (shouldAnimate) {
        ctx._suspendHistory();

        if (isGroup && state.originalDimensions) {
          node.dimensions = { ...state.originalDimensions };
        }

        const nodeDims = node.dimensions ?? DEFAULT_NODE_DIMS;

        applyExpand(node, ctx.nodes, state, isGroup);

        const nodeTargets: Record<string, any> = {};
        for (const [targetId, savedPos] of state.targetPositions) {
          const targetNode = ctx._nodeMap.get(targetId);
          if (targetNode && !targetNode.hidden) {
            const targetDims = targetNode.dimensions ?? DEFAULT_NODE_DIMS;

            let startX: number;
            let startY: number;
            if (targetNode.parentId === id) {
              startX = (nodeDims.width - targetDims.width) / 2;
              startY = (nodeDims.height - targetDims.height) / 2;
            } else {
              startX = node.position.x + (nodeDims.width - targetDims.width) / 2;
              startY = node.position.y + (nodeDims.height - targetDims.height) / 2;
            }

            targetNode.position = { x: startX, y: startY };
            targetNode.style = { ...(targetNode.style as Record<string, string> || {}), opacity: '0' };
            nodeTargets[targetId] = {
              position: savedPos,
              style: { opacity: '1' },
            };
          }
        }

        const expandTargetIds = new Set(state.targetPositions.keys());
        ctx._flushNodeStyles(expandTargetIds);

        const edgeSvgs: SVGElement[] = [];
        for (const edge of ctx.edges) {
          if (expandTargetIds.has(edge.source) || expandTargetIds.has(edge.target)) {
            const svg = ctx.getEdgeElement?.(edge.id)?.closest('svg');
            if (svg) {
              (svg as SVGElement).style.opacity = '0';
              edgeSvgs.push(svg as SVGElement);
            }
          }
        }

        if (ctx.animate) {
          ctx.animate({ nodes: nodeTargets }, {
            duration: 300,
            easing: 'easeOut',
            onProgress: (progress: number) => {
              const opacity = String(progress);
              for (const svg of edgeSvgs) svg.style.opacity = opacity;
            },
            onComplete: () => {
              for (const svg of edgeSvgs) svg.style.opacity = '';
              for (const targetId of expandTargetIds) {
                const targetNode = ctx._nodeMap.get(targetId);
                if (targetNode && typeof targetNode.style === 'object') {
                  delete (targetNode.style as Record<string, string>).opacity;
                }
              }
              ctx._resumeHistory();
            },
          });
        } else {
          ctx._resumeHistory();
        }

        ctx._collapseState.delete(id);
        ctx._emit('node-expand', { node, descendants: [...state.targetPositions.keys()] });
      } else {
        applyExpand(node, ctx.nodes, state, isGroup);
        ctx._collapseState.delete(id);
        ctx._emit('node-expand', { node, descendants: [...state.targetPositions.keys()] });
      }
    },

    /**
     * Toggle collapse/expand state of a node.
     */
    toggleNode(id: string, options?: { animate?: boolean; recursive?: boolean }): void {
      const node = ctx._nodeMap.get(id);
      if (!node) return;
      debug('collapse', `Toggle node "${id}" → ${node.collapsed ? 'expand' : 'collapse'}`);
      if (node.collapsed) {
        this.expandNode(id, options);
      } else {
        this.collapseNode(id, options);
      }
    },

    /**
     * Check if a node is collapsed.
     */
    isCollapsed(id: string): boolean {
      return ctx._nodeMap.get(id)?.collapsed === true;
    },

    /**
     * Get the number of nodes that would be hidden when collapsing this node.
     */
    getCollapseTargetCount(id: string): number {
      return getCollapseTargets(id, ctx.nodes, ctx.edges).size;
    },

    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(id: string): number {
      return getDescendantIds(id, ctx.nodes).size;
    },
  };
}
