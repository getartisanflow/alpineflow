// ============================================================================
// x-flow-resizer Directive
//
// Adds resize handles to a flow node. Handles are absolutely positioned
// squares (corners) or rectangles (edges) that the user can drag to resize
// the node. Respects per-node `resizable` flag and min/max constraints.
//
// Usage:
//   <div x-flow-resizer></div>            — all 8 handles
//   <div x-flow-resizer.corners></div>    — 4 corner handles only
//   <div x-flow-resizer.edges></div>      — 4 edge handles only
//   <div x-flow-resizer.bottom.right></div> — single handle
//   <div x-flow-resizer="{ minWidth: 80, maxWidth: 400 }"></div>
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { FlowNode, Dimensions } from '../../core/types';
import {
  computeResize,
  DEFAULT_RESIZE_CONSTRAINTS,
  type ResizeDirection,
  type ResizeConstraints,
} from '../../core/resize';
import { debug } from '../../core/debug';
import { isResizable } from '../../core/node-flags';

const ALL_CORNERS: ResizeDirection[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const ALL_EDGES: ResizeDirection[] = ['top', 'right', 'bottom', 'left'];
const ALL_HANDLES: ResizeDirection[] = [...ALL_CORNERS, ...ALL_EDGES];

const CURSOR_MAP: Record<ResizeDirection, string> = {
  'top-left': 'nwse-resize',
  'top-right': 'nesw-resize',
  'bottom-left': 'nesw-resize',
  'bottom-right': 'nwse-resize',
  'top': 'ns-resize',
  'bottom': 'ns-resize',
  'left': 'ew-resize',
  'right': 'ew-resize',
};

export function registerFlowResizerDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-resizer',
    (
      el,
      { expression, modifiers },
      { evaluate, effect, cleanup },
    ) => {
      // ── Determine which handles to show ──────────────────────────────
      const directions = resolveDirections(modifiers);

      // ── Parse constraints from expression ────────────────────────────
      let constraints: ResizeConstraints = { ...DEFAULT_RESIZE_CONSTRAINTS };
      if (expression) {
        try {
          const parsed = evaluate(expression) as Partial<ResizeConstraints>;
          constraints = { ...DEFAULT_RESIZE_CONSTRAINTS, ...parsed };
        } catch {
          // Expression might not be valid — use defaults
        }
      }

      // ── Create handle elements ───────────────────────────────────────
      const handleEls: HTMLDivElement[] = [];

      for (const dir of directions) {
        const handle = document.createElement('div');
        handle.className = `flow-resizer-handle flow-resizer-handle-${dir}`;
        handle.style.cursor = CURSOR_MAP[dir];
        handle.dataset.flowResizeDirection = dir;
        el.appendChild(handle);
        handleEls.push(handle);

        // ── Pointer event: start resize ────────────────────────────────
        handle.addEventListener('pointerdown', (e: PointerEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const nodeEl = el.closest('[x-flow-node]') as HTMLElement | null;
          if (!nodeEl) return;

          const canvasEl = el.closest('[x-data]') as HTMLElement | null;
          if (!canvasEl) return;

          const canvas = Alpine.$data(canvasEl);
          const nodeId = nodeEl.dataset.flowNodeId;
          if (!nodeId || !canvas) return;

          const node = canvas.getNode(nodeId) as FlowNode | undefined;
          if (!node) return;
          if (!isResizable(node)) return;

          // Merge node-level min/maxDimensions with directive constraints.
          // Node properties serve as base; directive expression overrides.
          const effectiveConstraints: ResizeConstraints = { ...constraints };
          if (node.minDimensions?.width != null && constraints.minWidth === DEFAULT_RESIZE_CONSTRAINTS.minWidth) {
            effectiveConstraints.minWidth = node.minDimensions.width;
          }
          if (node.minDimensions?.height != null && constraints.minHeight === DEFAULT_RESIZE_CONSTRAINTS.minHeight) {
            effectiveConstraints.minHeight = node.minDimensions.height;
          }
          if (node.maxDimensions?.width != null && constraints.maxWidth === DEFAULT_RESIZE_CONSTRAINTS.maxWidth) {
            effectiveConstraints.maxWidth = node.maxDimensions.width;
          }
          if (node.maxDimensions?.height != null && constraints.maxHeight === DEFAULT_RESIZE_CONSTRAINTS.maxHeight) {
            effectiveConstraints.maxHeight = node.maxDimensions.height;
          }

          // Ensure dimensions exist
          if (!node.dimensions) {
            const zoom = canvas.viewport?.zoom || 1;
            const rect = nodeEl.getBoundingClientRect();
            node.dimensions = { width: rect.width / zoom, height: rect.height / zoom };
          }

          const startPosition = { x: node.position.x, y: node.position.y };
          const startDimensions = { width: node.dimensions.width, height: node.dimensions.height };
          const zoom = canvas.viewport?.zoom || 1;
          const startClientX = e.clientX;
          const startClientY = e.clientY;

          canvas._captureHistory?.();
          debug('resize', `Resize start on "${nodeId}" (${dir})`, startDimensions);
          canvas._emit('node-resize-start', { node, dimensions: { ...startDimensions } });

          const onPointerMove = (moveEvent: PointerEvent) => {
            const delta = {
              x: (moveEvent.clientX - startClientX) / zoom,
              y: (moveEvent.clientY - startClientY) / zoom,
            };

            const result = computeResize(
              dir,
              delta,
              startPosition,
              startDimensions,
              effectiveConstraints,
              canvas._config?.snapToGrid ?? false,
            );

            // Update node state
            node.position.x = result.position.x;
            node.position.y = result.position.y;
            node.dimensions!.width = result.dimensions.width;
            node.dimensions!.height = result.dimensions.height;

            // Update DOM directly for smooth visual feedback
            // For child nodes, result.position is relative — compute absolute for DOM
            if (node.parentId) {
              const abs = canvas.getAbsolutePosition(node.id);
              nodeEl.style.left = `${abs.x}px`;
              nodeEl.style.top = `${abs.y}px`;
            } else {
              nodeEl.style.left = `${result.position.x}px`;
              nodeEl.style.top = `${result.position.y}px`;
            }
            nodeEl.style.width = `${result.dimensions.width}px`;
            nodeEl.style.height = `${result.dimensions.height}px`;

            canvas._emit('node-resize', { node, dimensions: { ...result.dimensions } });
          };

          const onPointerUp = () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('pointercancel', onPointerUp);

            debug('resize', `Resize end on "${nodeId}"`, node.dimensions);
            canvas._emit('node-resize-end', { node, dimensions: { ...node.dimensions! } });
          };

          document.addEventListener('pointermove', onPointerMove);
          document.addEventListener('pointerup', onPointerUp);
          document.addEventListener('pointercancel', onPointerUp);
        });
      }

      // ── Reactively hide handles when resizable === false ─────────────
      effect(() => {
        const nodeEl = el.closest('[x-flow-node]') as HTMLElement | null;
        if (!nodeEl) return;

        const canvasEl = el.closest('[x-data]') as HTMLElement | null;
        if (!canvasEl) return;

        const canvas = Alpine.$data(canvasEl);
        const nodeId = nodeEl.dataset.flowNodeId;
        if (!nodeId || !canvas) return;

        const node = canvas.getNode(nodeId) as FlowNode | undefined;
        if (!node) return;

        const hidden = !isResizable(node);
        for (const h of handleEls) {
          h.style.display = hidden ? 'none' : '';
        }
      });

      // ── Cleanup ──────────────────────────────────────────────────────
      cleanup(() => {
        for (const h of handleEls) {
          h.remove();
        }
      });
    },
  );
}

/**
 * Determine which resize directions are active based on modifiers.
 *
 * - No position modifiers → all 8 handles
 * - `.corners` → 4 corner handles
 * - `.edges` → 4 edge handles
 * - Specific directions like `.bottom.right` → single handle
 */
function resolveDirections(modifiers: string[]): ResizeDirection[] {
  if (modifiers.includes('corners')) {
    return ALL_CORNERS;
  }

  if (modifiers.includes('edges')) {
    return ALL_EDGES;
  }

  const hasTop = modifiers.includes('top');
  const hasBottom = modifiers.includes('bottom');
  const hasLeft = modifiers.includes('left');
  const hasRight = modifiers.includes('right');

  // If specific directions are specified, build the single handle
  if (hasTop || hasBottom || hasLeft || hasRight) {
    if (hasTop && hasLeft) return ['top-left'];
    if (hasTop && hasRight) return ['top-right'];
    if (hasBottom && hasLeft) return ['bottom-left'];
    if (hasBottom && hasRight) return ['bottom-right'];
    if (hasTop) return ['top'];
    if (hasBottom) return ['bottom'];
    if (hasLeft) return ['left'];
    if (hasRight) return ['right'];
  }

  // Default: all 8 handles
  return ALL_HANDLES;
}
