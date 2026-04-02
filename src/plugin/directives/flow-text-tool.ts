// ============================================================================
// x-flow-text-tool Directive
//
// Click to place a text annotation. Emits a flow-text-draw event with
// position and style info. Text editing is handled in the user's template
// (e.g. via contenteditable). Place on the .flow-container element.
//
// Usage:
//   <div class="flow-container" x-flow-text-tool="tool === 'text'">...</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowTextToolDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-text-tool',
    (
      el,
      { expression },
      { evaluate, effect, cleanup },
    ) => {
      const containerEl = el as HTMLElement;
      const canvas = Alpine.$data(containerEl) as any;
      if (!canvas) return;

      function getToolSettings() {
        const data = Alpine.$data(containerEl) as any;
        const settings = data?.toolSettings;
        const strokeWidth = settings?.strokeWidth ?? 2;
        return {
          strokeColor: settings?.strokeColor ?? (getComputedStyle(containerEl).getPropertyValue('--flow-tool-stroke-color').trim() || '#52525b'),
          // Map strokeWidth to fontSize: 1->14, 2->18, 4->24, 8->32
          fontSize: strokeWidth <= 1 ? 14 : strokeWidth <= 2 ? 18 : strokeWidth <= 4 ? 24 : 32,
          opacity: settings?.opacity ?? 1,
        };
      }

      // ── Pointer handlers ─────────────────────────────────────────

      /**
       * Capture-phase: suppress d3-zoom and handle the click.
       */
      function onPointerDownCapture(e: PointerEvent): void {
        const target = e.target as HTMLElement;
        if (target.closest('.flow-panel') || target.closest('.canvas-overlay')) {
          return;
        }
        if (e.button !== 0) return;

        e.stopImmediatePropagation();

        const flowPos = canvas.screenToFlowPosition(e.clientX, e.clientY);
        const settings = getToolSettings();

        containerEl.dispatchEvent(
          new CustomEvent('flow-text-draw', {
            detail: {
              position: { x: flowPos.x, y: flowPos.y },
              strokeColor: settings.strokeColor,
              fontSize: settings.fontSize,
              opacity: settings.opacity,
            },
            bubbles: true,
          }),
        );
      }

      /** Block mousedown/touchstart so d3-zoom doesn't start panning. */
      function onMouseDownCapture(e: Event): void {
        const target = e.target as HTMLElement;
        if (target.closest('.flow-panel') || target.closest('.canvas-overlay')) {
          return;
        }
        e.stopImmediatePropagation();
      }

      // ── Activation / deactivation ────────────────────────────────

      let listenersAttached = false;

      function attachListeners(): void {
        if (listenersAttached) return;
        listenersAttached = true;
        containerEl.addEventListener('pointerdown', onPointerDownCapture, true);
        containerEl.addEventListener('mousedown', onMouseDownCapture, true);
        containerEl.addEventListener('touchstart', onMouseDownCapture, true);
      }

      function detachListeners(): void {
        if (!listenersAttached) return;
        listenersAttached = false;
        containerEl.removeEventListener('pointerdown', onPointerDownCapture, true);
        containerEl.removeEventListener('mousedown', onMouseDownCapture, true);
        containerEl.removeEventListener('touchstart', onMouseDownCapture, true);
      }

      effect(() => {
        const active = !!evaluate(expression);

        if (active) {
          containerEl.classList.add('flow-tool-text');
          attachListeners();
        } else {
          containerEl.classList.remove('flow-tool-text');
          detachListeners();
        }
      });

      cleanup(() => {
        containerEl.classList.remove('flow-tool-text');
        detachListeners();
      });
    },
  );
}
