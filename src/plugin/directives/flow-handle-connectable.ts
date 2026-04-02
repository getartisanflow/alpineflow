// ============================================================================
// x-flow-handle-connectable Directive
//
// Controls whether a handle can initiate connections (start) or receive
// connections (end). By default both are true. Use this directive to disable
// one or both directions per handle.
//
// Usage:
//   <div x-flow-handle:source x-flow-handle-connectable.start="false"></div>
//   <div x-flow-handle:target x-flow-handle-connectable.end="false"></div>
//   <div x-flow-handle:source x-flow-handle-connectable="false"></div>  (both)
//   <div x-flow-handle:target x-flow-handle-connectable.end="node.data.acceptsInput"></div>
// ============================================================================

import type { Alpine } from 'alpinejs';

/** Expando property: can this handle initiate a connection drag? */
export const HANDLE_CONNECTABLE_START_KEY = '_flowHandleConnectableStart';

/** Expando property: can this handle receive a connection? */
export const HANDLE_CONNECTABLE_END_KEY = '_flowHandleConnectableEnd';

declare global {
  interface HTMLElement {
    [HANDLE_CONNECTABLE_START_KEY]?: boolean;
    [HANDLE_CONNECTABLE_END_KEY]?: boolean;
  }
}

export function registerFlowHandleConnectableDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-handle-connectable',
    (
      el,
      { expression, modifiers },
      { evaluate, effect, cleanup },
    ) => {
      const hasStart = modifiers.includes('start');
      const hasEnd = modifiers.includes('end');
      // No modifier → applies to both
      const applyStart = hasStart || (!hasStart && !hasEnd);
      const applyEnd = hasEnd || (!hasStart && !hasEnd);

      effect(() => {
        const value = expression ? Boolean(evaluate(expression)) : true;

        if (applyStart) {
          el[HANDLE_CONNECTABLE_START_KEY] = value;
        }
        if (applyEnd) {
          el[HANDLE_CONNECTABLE_END_KEY] = value;
        }
      });

      cleanup(() => {
        delete el[HANDLE_CONNECTABLE_START_KEY];
        delete el[HANDLE_CONNECTABLE_END_KEY];
      });
    },
  );
}
