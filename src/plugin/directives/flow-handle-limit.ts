// ============================================================================
// x-flow-handle-limit Directive
//
// Stores a per-handle connection limit on the handle element.
// The limit is checked during connection validation — if the handle already
// has >= limit connections, new connections are rejected.
//
// Usage:
//   <div x-flow-handle:target="'input'" x-flow-handle-limit="1"></div>
//   <div x-flow-handle:source="'output'" x-flow-handle-limit="3"></div>
// ============================================================================

import type { Alpine } from 'alpinejs';

/** Expando property name for the connection limit on handle elements. */
export const HANDLE_LIMIT_KEY = '_flowHandleLimit';

declare global {
  interface HTMLElement {
    [HANDLE_LIMIT_KEY]?: number;
  }
}

export function registerFlowHandleLimitDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-handle-limit',
    (
      el,
      { expression },
      { evaluate, effect, cleanup },
    ) => {
      effect(() => {
        const limit = Number(evaluate(expression));
        if (limit > 0) {
          el[HANDLE_LIMIT_KEY] = limit;
        } else {
          delete el[HANDLE_LIMIT_KEY];
        }
      });

      cleanup(() => {
        delete el[HANDLE_LIMIT_KEY];
      });
    },
  );
}
