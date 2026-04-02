// ============================================================================
// canvas-dom — DOM flush mixin for flow-canvas
//
// Five methods that directly manipulate DOM elements to synchronize visual
// state without waiting for Alpine's reactive update cycle. Used during
// animations, drag operations, and viewport transforms where low-latency
// updates are critical.
//
// Cross-mixin deps (optional chaining): ctx._applyBackground, ctx._applyCulling,
// ctx.getNode, ctx.getEdge, ctx.getEdgePathElement, ctx.getAbsolutePosition
// ============================================================================

import type { CanvasContext } from './canvas-context';
import type { FlowNode, FlowEdge } from '../../core/types';
import { parseStyle } from '../../animate/interpolators';
import { getHandleCoords, shortenEndpoint, getEdgePath } from '../../core/edge-utils';
import { getFloatingEdgeParams } from '../../core/floating-edge';
import { toAbsoluteNode } from '../../core/sub-flow';
import { isGradient, getGradientId, upsertGradientDef } from '../../core/gradients';
import { resolveHandlePosition } from '../directives/flow-edge';

export function createDomMixin(ctx: CanvasContext, Alpine: any) {
  return {
    /** Write node positions directly to DOM elements (bypassing Alpine effects). */
    _flushNodePositions(nodeIds: Set<string>) {
      for (const nodeId of nodeIds) {
        const node = ctx.getNode(nodeId) as FlowNode | undefined;
        if (!node) continue;
        const nodeEl = ctx._nodeElements.get(nodeId);
        if (!nodeEl) continue;
        const rawNode = Alpine.raw(node);
        const absPos = rawNode.parentId ? ctx.getAbsolutePosition(nodeId) : rawNode.position;
        const nodeOrig = rawNode.nodeOrigin ?? ctx._config.nodeOrigin ?? [0, 0];
        const nw = rawNode.dimensions?.width ?? 150;
        const nh = rawNode.dimensions?.height ?? 40;
        nodeEl.style.left = (absPos.x - nw * nodeOrig[0]) + 'px';
        nodeEl.style.top = (absPos.y - nh * nodeOrig[1]) + 'px';
      }
    },

    /** Write node styles directly to DOM elements (bypassing Alpine effects). */
    _flushNodeStyles(nodeIds: Set<string>) {
      for (const nodeId of nodeIds) {
        const node = ctx.getNode(nodeId) as FlowNode | undefined;
        if (!node) continue;
        const nodeEl = ctx._nodeElements.get(nodeId);
        if (!nodeEl) continue;
        const rawNode = Alpine.raw(node);
        const style = rawNode.style;
        if (!style) continue;
        const parsed = typeof style === 'string' ? parseStyle(style) : style as Record<string, string>;
        for (const [prop, value] of Object.entries(parsed)) {
          nodeEl.style.setProperty(prop, value);
        }
      }
    },

    /** Write edge color/strokeWidth directly to SVG elements (bypassing Alpine effects). */
    _flushEdgeStyles(edgeIds: Set<string>) {
      for (const edgeId of edgeIds) {
        const edge = ctx.getEdge(edgeId) as FlowEdge | undefined;
        if (!edge) continue;
        const rawEdge = Alpine.raw(edge);
        const pathEl = ctx.getEdgePathElement(edgeId);
        if (!pathEl) continue;

        if (typeof rawEdge.color === 'string') {
          pathEl.style.stroke = rawEdge.color;
        }

        if (rawEdge.strokeWidth !== undefined) {
          pathEl.style.strokeWidth = String(rawEdge.strokeWidth);
        }
      }
    },

    /** Push current viewport state to the DOM (transform, background, culling). */
    _flushViewport() {
      if (ctx._viewportEl) {
        const vp = ctx.viewport;
        ctx._viewportEl.style.transform = `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`;
      }
      ctx._applyBackground();
      ctx._applyCulling();
    },

    /** Recompute SVG paths, label positions, and gradients for edges connected to the given node IDs. */
    _refreshEdgePaths(movedNodeIds: Set<string>) {
      for (const edge of ctx.edges as FlowEdge[]) {
        if (!movedNodeIds.has(edge.source) && !movedNodeIds.has(edge.target)) continue;

        const rawSource = Alpine.raw(ctx.getNode(edge.source)) as FlowNode | undefined;
        const rawTarget = Alpine.raw(ctx.getNode(edge.target)) as FlowNode | undefined;
        if (!rawSource || !rawTarget) continue;

        const sourceNode = toAbsoluteNode(rawSource, ctx._nodeMap, ctx._config.nodeOrigin);
        const targetNode = toAbsoluteNode(rawTarget, ctx._nodeMap, ctx._config.nodeOrigin);

        let pathD: string;
        let labelPos: { x: number; y: number };
        let srcCoords: { x: number; y: number };
        let tgtCoords: { x: number; y: number };

        if (edge.type === 'floating') {
          const fp = getFloatingEdgeParams(sourceNode, targetNode);
          srcCoords = { x: fp.sx, y: fp.sy };
          tgtCoords = { x: fp.tx, y: fp.ty };
          const adjSrc = shortenEndpoint(srcCoords, fp.sourcePos, null, edge.markerStart);
          const adjTgt = shortenEndpoint(tgtCoords, fp.targetPos, null, edge.markerEnd);
          const result = getEdgePath(edge, sourceNode, targetNode, fp.sourcePos, fp.targetPos, adjSrc, adjTgt, undefined, undefined, ctx._shapeRegistry, ctx._config.nodeOrigin);
          pathD = result.path;
          labelPos = result.labelPosition;
        } else {
          const container = ctx._container as Element;
          const srcPos = container
            ? resolveHandlePosition(container, edge.source, edge.sourceHandle, 'source', rawSource)
            : (rawSource?.sourcePosition ?? 'bottom');
          const tgtPos = container
            ? resolveHandlePosition(container, edge.target, edge.targetHandle, 'target', rawTarget)
            : (rawTarget?.targetPosition ?? 'top');
          srcCoords = getHandleCoords(sourceNode, srcPos, ctx._shapeRegistry, ctx._config.nodeOrigin);
          tgtCoords = getHandleCoords(targetNode, tgtPos, ctx._shapeRegistry, ctx._config.nodeOrigin);
          const adjSrc = shortenEndpoint(srcCoords, srcPos, null, edge.markerStart);
          const adjTgt = shortenEndpoint(tgtCoords, tgtPos, null, edge.markerEnd);
          const result = getEdgePath(edge, sourceNode, targetNode, srcPos, tgtPos, adjSrc, adjTgt, undefined, undefined, ctx._shapeRegistry, ctx._config.nodeOrigin);
          pathD = result.path;
          labelPos = result.labelPosition;
        }

        const pathEl = ctx.getEdgePathElement(edge.id);
        if (pathEl) {
          pathEl.setAttribute('d', pathD);
          const gEl = pathEl.parentElement;
          const interactionPath = gEl?.querySelector('path:first-child') as SVGPathElement | null;
          if (interactionPath && interactionPath !== pathEl) {
            interactionPath.setAttribute('d', pathD);
          }
        }

        if (isGradient(edge.color)) {
          const defsEl = ctx._markerDefsEl?.querySelector('defs');
          if (defsEl) {
            const gradId = getGradientId(ctx._id, edge.id);
            const reversed = edge.gradientDirection === 'target-source';
            upsertGradientDef(
              defsEl,
              gradId,
              reversed ? { from: edge.color.to, to: edge.color.from } : edge.color,
              srcCoords.x, srcCoords.y, tgtCoords.x, tgtCoords.y,
            );
          }
        }

        if ((edge.label || edge.labelStart || edge.labelEnd) && ctx._viewportEl) {
          if (edge.label) {
            const lbl = ctx._viewportEl.querySelector(
              `[data-flow-edge-id="${edge.id}"].flow-edge-label:not(.flow-edge-label-start):not(.flow-edge-label-end)`,
            ) as HTMLElement | null;
            if (lbl) {
              lbl.style.left = `${labelPos.x}px`;
              lbl.style.top = `${labelPos.y}px`;
            }
          }

          if (edge.labelStart && pathEl) {
            const lbl = ctx._viewportEl.querySelector(
              `[data-flow-edge-id="${edge.id}"].flow-edge-label-start`,
            ) as HTMLElement | null;
            if (lbl) {
              const len = pathEl.getTotalLength();
              const offset = edge.labelStartOffset ?? 30;
              const pt = pathEl.getPointAtLength(Math.min(offset, len / 2));
              lbl.style.left = `${pt.x}px`;
              lbl.style.top = `${pt.y}px`;
            }
          }

          if (edge.labelEnd && pathEl) {
            const lbl = ctx._viewportEl.querySelector(
              `[data-flow-edge-id="${edge.id}"].flow-edge-label-end`,
            ) as HTMLElement | null;
            if (lbl) {
              const len = pathEl.getTotalLength();
              const offset = edge.labelEndOffset ?? 30;
              const pt = pathEl.getPointAtLength(Math.max(len - offset, len / 2));
              lbl.style.left = `${pt.x}px`;
              lbl.style.top = `${pt.y}px`;
            }
          }
        }
      }
    },
  };
}
