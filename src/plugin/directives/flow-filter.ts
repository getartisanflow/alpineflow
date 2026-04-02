// ============================================================================
// x-flow-filter Directive
//
// Declarative node and row filtering.
//
// Usage:
//   <button x-flow-filter:node="n => n.data.type === 'input'">Inputs Only</button>
//   <button x-flow-filter:node.clear>Show All</button>
//   <button x-flow-filter:row="{ node: 'node-1', predicate: (row) => row.connected }">Connected</button>
//   <button x-flow-filter:row.clear>Clear Row Filter</button>
// ============================================================================

import type { Alpine } from 'alpinejs';

type FilterArg = 'node' | 'row';

export interface FilterParseResult {
  type: FilterArg;
  isClear: boolean;
}

export function parseFilterDirective(
  arg: string,
  modifiers: string[],
): FilterParseResult | null {
  if (arg !== 'node' && arg !== 'row') return null;

  const isClear = modifiers.includes('clear');

  return { type: arg, isClear };
}

// Track which predicate function reference is active per canvas
const activeNodeFilterRefs = new WeakMap<HTMLElement, Function | null>();

export function registerFlowFilterDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-filter',
    (el, { value, expression, modifiers }, { evaluate, effect, cleanup }) => {
      const parsed = parseFilterDirective(value, modifiers);
      if (!parsed) return;

      const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
      if (!canvasEl) return;

      const canvas = Alpine.$data(canvasEl) as any;
      if (!canvas) return;

      let myPredicate: Function | null = null;

      const onClick = () => {
        if (parsed.isClear) {
          if (parsed.type === 'node') {
            canvas.clearNodeFilter();
            activeNodeFilterRefs.set(canvasEl, null);
          } else {
            for (const node of canvas.nodes) {
              if (node.rowFilter && node.rowFilter !== 'all') {
                canvas.setRowFilter(node.id, 'all');
              }
            }
          }
          return;
        }

        if (parsed.type === 'node' && expression) {
          // Wrap in array to prevent Alpine's evaluate() from auto-calling the function
          myPredicate = (evaluate(`[${expression}]`) as Function[])[0];
          canvas.setNodeFilter(myPredicate);
          activeNodeFilterRefs.set(canvasEl, myPredicate);
        } else if (parsed.type === 'row' && expression) {
          const config = evaluate(expression) as { node: string; predicate: (row: any) => boolean };
          canvas.setRowFilter(config.node, config.predicate);
        }
      };

      el.addEventListener('click', onClick);
      el.style.cursor = 'pointer';

      // Reactive active state for node filters
      if (parsed.type === 'node' && !parsed.isClear) {
        effect(() => {
          void canvas.nodes.length;
          const active = activeNodeFilterRefs.get(canvasEl) === myPredicate && myPredicate !== null;
          el.classList.toggle('flow-filter-active', active);
          el.setAttribute('aria-pressed', String(active));
        });
      }

      cleanup(() => {
        el.removeEventListener('click', onClick);
      });
    },
  );
}
