// ============================================================================
// x-flow-rectangle-draw Directive
//
// Click-and-drag to draw a rectangle on the canvas. Emits a
// `flow-rectangle-draw` custom event with the bounds when the user
// finishes drawing. Place on the .flow-container element.
//
// Usage:
//   <div class="flow-container" x-flow-rectangle-draw="drawActive">...</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

/** Minimum dimension (px in flow coords) — smaller draws are ignored. */
const MIN_SIZE = 10;

interface Point {
  x: number;
  y: number;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function registerFlowRectangleDrawDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-rectangle-draw',
    (
      el,
      { expression },
      { evaluate, effect, cleanup },
    ) => {
      const containerEl = el as HTMLElement;
      const canvas = Alpine.$data(containerEl) as any;
      if (!canvas) return;

      // ── Drag state ───────────────────────────────────────────────────
      let dragging = false;
      let activePointerId: number | null = null;
      let startFlow: Point = { x: 0, y: 0 };
      let currentFlow: Point = { x: 0, y: 0 };
      let previewEl: HTMLDivElement | null = null;

      // ── Tool settings helpers ──────────────────────────────────────

      function getToolSettings(): {
        strokeColor: string;
        strokeWidth: number;
        opacity: number;
      } {
        const data = Alpine.$data(containerEl) as any;
        const settings = data?.toolSettings;
        const strokeColor = settings?.strokeColor ?? (getComputedStyle(containerEl).getPropertyValue('--flow-tool-stroke-color').trim() || '#52525b');
        const strokeWidth = settings?.strokeWidth ?? 2;
        const opacity = settings?.opacity ?? 1;
        return { strokeColor, strokeWidth, opacity };
      }

      // ── Helpers ──────────────────────────────────────────────────────

      function getViewportEl(): HTMLElement | null {
        return containerEl.querySelector('.flow-viewport') as HTMLElement | null;
      }

      function createPreview(): void {
        const viewport = getViewportEl();
        if (!viewport) return;

        const { strokeColor } = getToolSettings();

        previewEl = document.createElement('div');
        previewEl.className = 'flow-rectangle-draw-preview';
        previewEl.style.cssText =
          'position:absolute;pointer-events:none;' +
          `border:2px dashed ${strokeColor};` +
          'background:var(--flow-rectangle-draw-bg, rgba(59,130,246,0.08));' +
          'z-index:1000;';
        viewport.appendChild(previewEl);
      }

      function updatePreview(): void {
        if (!previewEl) return;

        const x = Math.min(startFlow.x, currentFlow.x);
        const y = Math.min(startFlow.y, currentFlow.y);
        const width = Math.abs(currentFlow.x - startFlow.x);
        const height = Math.abs(currentFlow.y - startFlow.y);

        previewEl.style.left = `${x}px`;
        previewEl.style.top = `${y}px`;
        previewEl.style.width = `${width}px`;
        previewEl.style.height = `${height}px`;
      }

      function removePreview(): void {
        if (previewEl) {
          previewEl.remove();
          previewEl = null;
        }
      }

      function computeBounds(): Bounds {
        const x = Math.min(startFlow.x, currentFlow.x);
        const y = Math.min(startFlow.y, currentFlow.y);
        const width = Math.abs(currentFlow.x - startFlow.x);
        const height = Math.abs(currentFlow.y - startFlow.y);
        return { x, y, width, height };
      }

      // ── Pointer handlers ─────────────────────────────────────────────

      /**
       * Capture-phase handler: suppress d3-zoom (which listens on
       * mousedown/touchstart) and start rectangle drag.
       */
      function onPointerDownCapture(e: PointerEvent): void {
        const target = e.target as HTMLElement;
        if (target.closest('.flow-panel') || target.closest('.canvas-overlay')) {
          return;
        }
        if (e.button !== 0) return;

        e.stopImmediatePropagation();

        dragging = true;
        startFlow = canvas.screenToFlowPosition(e.clientX, e.clientY);
        currentFlow = { ...startFlow };

        createPreview();
        updatePreview();

        activePointerId = e.pointerId;
        containerEl.setPointerCapture(e.pointerId);
      }

      /** Block mousedown/touchstart so d3-zoom doesn't start panning. */
      function onMouseDownCapture(e: Event): void {
        const target = e.target as HTMLElement;
        if (target.closest('.flow-panel') || target.closest('.canvas-overlay')) {
          return;
        }
        e.stopImmediatePropagation();
      }

      function onPointerMove(e: PointerEvent): void {
        if (!dragging) return;

        currentFlow = canvas.screenToFlowPosition(e.clientX, e.clientY);
        updatePreview();
      }

      function onPointerUp(e: PointerEvent): void {
        if (!dragging) return;
        dragging = false;

        currentFlow = canvas.screenToFlowPosition(e.clientX, e.clientY);
        const bounds = computeBounds();
        removePreview();

        // Ignore accidental clicks (too small)
        if (bounds.width < MIN_SIZE && bounds.height < MIN_SIZE) {
          containerEl.releasePointerCapture(e.pointerId);
          return;
        }

        const settings = getToolSettings();
        containerEl.dispatchEvent(
          new CustomEvent('flow-rectangle-draw', {
            detail: {
              bounds,
              strokeColor: settings.strokeColor,
              strokeWidth: settings.strokeWidth,
              opacity: settings.opacity,
            },
            bubbles: true,
          }),
        );

        activePointerId = null;
        containerEl.releasePointerCapture(e.pointerId);
      }

      function onKeyDown(e: KeyboardEvent): void {
        if (!dragging) return;
        if (e.key === 'Escape') {
          dragging = false;
          removePreview();
          if (activePointerId !== null) {
            containerEl.releasePointerCapture(activePointerId);
            activePointerId = null;
          }
        }
      }

      function cancelDrag(): void {
        if (dragging) {
          dragging = false;
          removePreview();
          if (activePointerId !== null) {
            try { containerEl.releasePointerCapture(activePointerId); } catch {}
          }
          activePointerId = null;
        }
      }

      // ── Activation / deactivation ────────────────────────────────────

      let listenersAttached = false;

      function attachListeners(): void {
        if (listenersAttached) return;
        listenersAttached = true;
        containerEl.addEventListener('pointerdown', onPointerDownCapture, true);
        containerEl.addEventListener('mousedown', onMouseDownCapture, true);
        containerEl.addEventListener('touchstart', onMouseDownCapture, true);
        containerEl.addEventListener('pointermove', onPointerMove);
        containerEl.addEventListener('pointerup', onPointerUp);
        document.addEventListener('keydown', onKeyDown);
      }

      function detachListeners(): void {
        if (!listenersAttached) return;
        listenersAttached = false;
        cancelDrag();
        containerEl.removeEventListener('pointerdown', onPointerDownCapture, true);
        containerEl.removeEventListener('mousedown', onMouseDownCapture, true);
        containerEl.removeEventListener('touchstart', onMouseDownCapture, true);
        containerEl.removeEventListener('pointermove', onPointerMove);
        containerEl.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('keydown', onKeyDown);
      }

      effect(() => {
        const active = !!evaluate(expression);

        if (active) {
          containerEl.classList.add('flow-tool-rectangle');
          attachListeners();
        } else {
          containerEl.classList.remove('flow-tool-rectangle');
          detachListeners();
        }
      });

      cleanup(() => {
        containerEl.classList.remove('flow-tool-rectangle');
        detachListeners();
      });
    },
  );
}
