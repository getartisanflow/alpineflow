// ============================================================================
// x-flow-drag-handle Directive
//
// Marks an element as the drag handle for its parent x-flow-node. When present,
// only pointerdown events originating from within this element will initiate
// a node drag gesture. Without it, the entire node body is draggable.
//
// Usage: <div x-flow-drag-handle class="node-header">Drag here</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowDragHandleDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-drag-handle',
    (el) => {
      el.setAttribute('data-flow-drag-handle', '');
      el.classList.add('flow-drag-handle');

      // Apply the has-handle class to the parent node element immediately.
      // The x-flow-node effect also does this, but it runs before child
      // directives initialize so it misses the handle on the first pass.
      const nodeEl = el.closest('[x-flow-node]');
      if (nodeEl) {
        nodeEl.classList.add('flow-node-has-handle');
      }
    },
  );
}
