// ============================================================================
// x-flow-rotate Directive
//
// Adds a drag-to-rotate handle to a flow node. Drag the handle to rotate
// the node interactively. Updates node.rotation in degrees.
//
// Usage:
//   <div x-flow-rotate></div>              — free rotation
//   <div x-flow-rotate.snap></div>         — snap to 15° increments
//   <div x-flow-rotate.snap="45"></div>    — snap to 45° increments
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { FlowNode } from '../../core/types';

/**
 * Compute the rotation angle (0-360) from a pointer position relative to a center point.
 * 0° = directly above center (12 o'clock), clockwise.
 */
export function computeRotationAngle(
  pointerX: number,
  pointerY: number,
  centerX: number,
  centerY: number,
): number {
  const rad = Math.atan2(pointerX - centerX, -(pointerY - centerY));
  const deg = (rad * 180) / Math.PI;
  return ((deg % 360) + 360) % 360;
}

/**
 * Snap an angle to the nearest increment.
 */
export function snapAngle(angle: number, increment: number): number {
  const snapped = Math.round(angle / increment) * increment;
  return ((snapped % 360) + 360) % 360;
}

export function registerFlowRotateDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-rotate',
    (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
      const shouldSnap = modifiers.includes('snap');
      const snapIncrement = shouldSnap && expression ? Number(evaluate(expression)) || 15 : 15;

      // Style the handle
      el.classList.add('flow-rotate-handle');
      el.style.cursor = 'grab';

      const onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const nodeEl = el.closest('[x-flow-node]') as HTMLElement | null;
        if (!nodeEl) return;

        const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement | null;
        if (!canvasEl) return;

        const canvas = Alpine.$data(canvasEl) as any;
        const nodeId = nodeEl.dataset.flowNodeId;
        if (!nodeId || !canvas) return;

        const node = canvas.getNode(nodeId) as FlowNode | undefined;
        if (!node) return;

        const nodeRect = nodeEl.getBoundingClientRect();
        const centerX = nodeRect.left + nodeRect.width / 2;
        const centerY = nodeRect.top + nodeRect.height / 2;

        canvas._captureHistory();
        el.style.cursor = 'grabbing';

        const onPointerMove = (moveEvent: PointerEvent) => {
          let angle = computeRotationAngle(
            moveEvent.clientX,
            moveEvent.clientY,
            centerX,
            centerY,
          );

          if (shouldSnap) {
            angle = snapAngle(angle, snapIncrement);
          }

          node.rotation = angle;
        };

        const onPointerUp = () => {
          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', onPointerUp);
          el.style.cursor = 'grab';
          canvas._emit('node-rotate-end', { node, rotation: node.rotation });
        };

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
      };

      el.addEventListener('pointerdown', onPointerDown);

      cleanup(() => {
        el.removeEventListener('pointerdown', onPointerDown);
        el.classList.remove('flow-rotate-handle');
      });
    },
  );
}
