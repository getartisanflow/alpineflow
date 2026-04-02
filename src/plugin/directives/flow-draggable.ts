// ============================================================================
// x-flow-draggable directive
//
// Makes any element draggable onto a flowCanvas drop zone. Sets up HTML5
// drag-and-drop with the `application/alpineflow` MIME type.
//
// Usage:
//   <div x-flow-draggable="'Input'">Input</div>
//   <div x-flow-draggable="{ label: 'Process', color: '#3b82f6' }">Process</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

const MIME_TYPE = 'application/alpineflow';

export function registerFlowDraggableDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-draggable',
    (el, { expression }, { evaluate }) => {
      el.setAttribute('draggable', 'true');
      el.style.cursor = 'grab';

      el.addEventListener('dragstart', (event: DragEvent) => {
        if (!event.dataTransfer) return;
        const value = evaluate(expression);
        const payload = typeof value === 'string' ? value : JSON.stringify(value);
        event.dataTransfer.setData(MIME_TYPE, payload);
        event.dataTransfer.effectAllowed = 'move';
      });
    },
  );
}
