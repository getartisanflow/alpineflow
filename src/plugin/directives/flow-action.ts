// ============================================================================
// x-flow-action Directive
//
// Declarative canvas action buttons. Replaces repetitive @click + :disabled +
// aria-* boilerplate for common canvas operations.
//
// Usage:
//   <button x-flow-action:undo>Undo</button>
//   <button x-flow-action:redo>Redo</button>
//   <button x-flow-action:fit-view>Fit View</button>
//   <button x-flow-action:zoom-in>+</button>
//   <button x-flow-action:zoom-out>-</button>
//   <button x-flow-action:toggle-interactive>Lock</button>
//   <button x-flow-action:export="{ filename: 'flow.png' }">Export</button>
//   <button x-flow-action:clear>Clear</button>
//   <button x-flow-action:reset>Reset</button>
// ============================================================================

import type { Alpine } from 'alpinejs';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ActionDef {
  method: string;
  disabledWhen?: (canvas: any) => boolean;
  aria?: 'disabled' | 'pressed';
  passExpression?: boolean;
}

// ── Action Map ───────────────────────────────────────────────────────────────

export const ACTION_MAP: Record<string, ActionDef> = {
  'undo': { method: 'undo', disabledWhen: (c) => !c.canUndo, aria: 'disabled' },
  'redo': { method: 'redo', disabledWhen: (c) => !c.canRedo, aria: 'disabled' },
  'fit-view': { method: 'fitView', passExpression: true },
  'zoom-in': {
    method: 'zoomIn',
    disabledWhen: (c) => c.viewport.zoom >= (c._config?.maxZoom ?? 2),
    aria: 'disabled',
  },
  'zoom-out': {
    method: 'zoomOut',
    disabledWhen: (c) => c.viewport.zoom <= (c._config?.minZoom ?? 0.5),
    aria: 'disabled',
  },
  'toggle-interactive': { method: 'toggleInteractive', aria: 'pressed' },
  'clear': { method: '$clear', disabledWhen: (c) => c.nodes.length === 0, aria: 'disabled' },
  'reset': { method: '$reset' },
  'export': { method: 'toImage', passExpression: true },
};

// ── Pure Functions (exported for testing) ────────────────────────────────────

export function getActionDef(actionName: string): ActionDef | null {
  return ACTION_MAP[actionName] ?? null;
}

export function isActionDisabled(actionName: string, canvas: any): boolean {
  const def = ACTION_MAP[actionName];
  if (!def?.disabledWhen) {
    return false;
  }
  return def.disabledWhen(canvas);
}

export function getAriaAttr(actionName: string): 'disabled' | 'pressed' | null {
  return ACTION_MAP[actionName]?.aria ?? null;
}

// ── Directive Registration ───────────────────────────────────────────────────

export function registerFlowActionDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-action',
    (el, { value, expression }, { evaluate, effect, cleanup }) => {
      const actionName = value;
      const def = getActionDef(actionName);
      if (!def) {
        return;
      }

      const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
      if (!canvasEl) {
        return;
      }

      const canvas = Alpine.$data(canvasEl) as any;
      if (!canvas) {
        return;
      }

      const onClick = () => {
        const method = canvas[def.method];
        if (typeof method !== 'function') {
          return;
        }

        if (def.passExpression && expression) {
          method.call(canvas, evaluate(expression));
        } else {
          method.call(canvas);
        }
      };

      el.addEventListener('click', onClick);

      if (def.disabledWhen || def.aria) {
        effect(() => {
          if (def.disabledWhen) {
            const disabled = def.disabledWhen(canvas);
            (el as HTMLButtonElement).disabled = disabled;
            if (def.aria === 'disabled') {
              el.setAttribute('aria-disabled', String(disabled));
            }
          }

          if (def.aria === 'pressed') {
            el.setAttribute('aria-pressed', String(!canvas.isInteractive));
          }
        });
      }

      cleanup(() => {
        el.removeEventListener('click', onClick);
      });
    },
  );
}
