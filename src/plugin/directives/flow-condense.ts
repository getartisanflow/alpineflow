// ============================================================================
// x-flow-condense Directive
//
// Marks an element as a condense toggle for its nearest parent x-flow-node.
// Clicking toggles the node's condensed state (summary view).
//
// Usage:
//   <button x-flow-condense="node.id">Toggle</button>
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowCondenseDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-condense',
    (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
      const onClick = () => {
        const nodeId = evaluate(expression) as string;
        if (!nodeId) return;

        const canvasEl = el.closest('[x-data]') as HTMLElement;
        if (!canvasEl) return;

        const canvas = Alpine.$data(canvasEl) as any;
        if (!canvas?.toggleCondense) return;

        canvas.toggleCondense(nodeId);
      };

      el.addEventListener('click', onClick);
      el.setAttribute('data-flow-condense', '');
      el.style.cursor = 'pointer';

      // Reactive ARIA attributes
      effect(() => {
        const nodeId = evaluate(expression) as string;
        if (!nodeId) return;

        const canvasEl = el.closest('[x-data]') as HTMLElement;
        if (!canvasEl) return;

        const canvas = Alpine.$data(canvasEl) as any;
        if (!canvas?.isCondensed) return;

        const condensed = canvas.isCondensed(nodeId);
        el.setAttribute('aria-expanded', String(!condensed));
      });

      cleanup(() => {
        el.removeEventListener('click', onClick);
      });
    },
  );
}
