// ============================================================================
// x-flow-collapse Directive
//
// Marks an element as a collapse toggle for its nearest parent x-flow-node.
// Clicking toggles the node's collapsed state. Supports .instant modifier
// and batch modifiers .all, .expand, and .children.
//
// Usage:
//   <button x-flow-collapse="node.id">Toggle</button>
//   <button x-flow-collapse.instant="node.id">Toggle (no animation)</button>
//   <button x-flow-collapse.all>Collapse All</button>
//   <button x-flow-collapse.all.expand>Expand All</button>
//   <button x-flow-collapse.children="'parent-1'">Collapse Children</button>
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowCollapseDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-collapse',
    (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
      const isAll = modifiers.includes('all');
      const isExpand = modifiers.includes('expand');
      const isChildren = modifiers.includes('children');
      const isInstant = modifiers.includes('instant');

      const onClick = () => {
        const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
        if (!canvasEl) return;
        const canvas = Alpine.$data(canvasEl) as any;
        if (!canvas) return;

        if (isAll) {
          for (const node of canvas.nodes) {
            if (isExpand) {
              canvas.expandNode?.(node.id, { animate: !isInstant });
            } else {
              canvas.collapseNode?.(node.id, { animate: !isInstant });
            }
          }
          el.setAttribute('aria-expanded', String(isExpand));
          return;
        }

        if (isChildren && expression) {
          const parentId = evaluate(expression) as string;
          if (!parentId) return;
          for (const node of canvas.nodes) {
            if (node.parentId === parentId) {
              if (isExpand) {
                canvas.expandNode?.(node.id, { animate: !isInstant });
              } else {
                canvas.collapseNode?.(node.id, { animate: !isInstant });
              }
            }
          }
          el.setAttribute('aria-expanded', String(isExpand));
          return;
        }

        // Original single-node toggle behavior
        const nodeId = evaluate(expression) as string;
        if (!nodeId || !canvas?.toggleNode) return;
        canvas.toggleNode(nodeId, { animate: !isInstant });
      };

      el.addEventListener('click', onClick);
      el.setAttribute('data-flow-collapse', '');
      el.style.cursor = 'pointer';

      // Reactive ARIA attributes (only for single-node mode)
      if (!isAll && !isChildren) {
        effect(() => {
          const nodeId = evaluate(expression) as string;
          if (!nodeId) return;

          const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
          if (!canvasEl) return;

          const canvas = Alpine.$data(canvasEl) as any;
          if (!canvas?.isCollapsed) return;

          const collapsed = canvas.isCollapsed(nodeId);
          el.setAttribute('aria-expanded', String(!collapsed));

          const nodeEl = el.closest('[x-flow-node]');
          if (nodeEl) {
            el.setAttribute('aria-controls', nodeEl.id || nodeId);
          }
        });
      }

      cleanup(() => {
        el.removeEventListener('click', onClick);
      });
    },
  );
}
