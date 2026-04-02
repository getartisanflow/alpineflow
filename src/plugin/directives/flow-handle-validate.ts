// ============================================================================
// x-flow-handle-validate Directive
//
// Stores a per-handle connection validator on the handle element.
// The validator is called during connection completion with a Connection object
// and must return a boolean.
//
// Usage:
//   <div x-flow-handle:source="'output'" x-flow-handle-validate="myValidator"></div>
//   <div x-flow-handle:target="'input'" x-flow-handle-validate="validateInput"></div>
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { Connection } from '../../core/types';

/** Expando property name for the validator function on handle elements. */
export const HANDLE_VALIDATE_KEY = '_flowHandleValidate';

declare global {
  interface HTMLElement {
    [HANDLE_VALIDATE_KEY]?: (connection: Connection) => boolean;
  }
}

export function registerFlowHandleValidateDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-handle-validate',
    (
      el,
      { expression },
      { evaluate, effect, cleanup },
    ) => {
      function resolve(): void {
        // First try Alpine evaluate (works for inline expressions)
        let validator: unknown;
        try {
          validator = evaluate(expression);
        } catch {
          // Expression may reference a name on $data — look it up directly
          const data = (Alpine as any).$data(el);
          if (data && typeof data[expression] === 'function') {
            validator = data[expression];
          }
        }

        if (typeof validator === 'function') {
          el[HANDLE_VALIDATE_KEY] = validator as (connection: Connection) => boolean;
        } else {
          delete el[HANDLE_VALIDATE_KEY];
          // Retry once after next frame to allow x-init to define the function
          requestAnimationFrame(() => {
            const data = (Alpine as any).$data(el);
            if (data && typeof data[expression] === 'function') {
              el[HANDLE_VALIDATE_KEY] = data[expression];
            }
          });
        }
      }

      effect(() => {
        resolve();
      });

      cleanup(() => {
        delete el[HANDLE_VALIDATE_KEY];
      });
    },
  );
}
