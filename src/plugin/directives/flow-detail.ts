// ============================================================================
// x-flow-detail Directive
//
// Shows/hides elements based on the canvas zoom level. Use modifiers to
// specify which level(s) the element should be visible at, or an expression
// with { min, max } for custom zoom thresholds.
//
// Usage:
//   <div x-flow-detail.close>Full content — visible at close zoom</div>
//   <div x-flow-detail.medium>Label only — visible at medium zoom</div>
//   <div x-flow-detail.far>Dot — visible when zoomed far out</div>
//   <div x-flow-detail.medium.close>Visible at medium AND close</div>
//   <div x-flow-detail="{ min: 0.8 }">Show above 0.8x zoom</div>
//   <div x-flow-detail="{ min: 0.5, max: 1.2 }">Show between 0.5x and 1.2x</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowDetailDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-detail',
    (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
      // Custom zoom thresholds via expression: { min?: number, max?: number }
      if (expression) {
        const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
        if (!canvasEl) return;

        const canvas = Alpine.$data(canvasEl) as any;
        if (!canvas?.viewport) return;

        const originalDisplay = el.style.display;

        effect(() => {
          const thresholds = evaluate(expression) as { min?: number; max?: number };
          const zoom = canvas.viewport.zoom;
          const aboveMin = thresholds.min === undefined || zoom >= thresholds.min;
          const belowMax = thresholds.max === undefined || zoom <= thresholds.max;
          el.style.display = (aboveMin && belowMax) ? originalDisplay : 'none';
        });

        cleanup(() => {
          el.style.display = originalDisplay;
        });

        return;
      }

      // Modifier-based preset levels
      const levels: Set<string> = new Set(modifiers.filter(m => m === 'far' || m === 'medium' || m === 'close'));
      if (levels.size === 0) return;

      const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
      if (!canvasEl) return;

      const canvas = Alpine.$data(canvasEl) as any;
      if (!canvas?._zoomLevel) return;

      const originalDisplay = el.style.display;

      effect(() => {
        const currentLevel = canvas._zoomLevel as string;
        if (levels.has(currentLevel)) {
          el.style.display = originalDisplay;
        } else {
          el.style.display = 'none';
        }
      });

      cleanup(() => {
        el.style.display = originalDisplay;
      });
    },
  );
}
