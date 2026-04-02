// ============================================================================
// x-flow-circle-draw Directive
//
// Click-and-drag to draw a circle/ellipse on the canvas. Emits a
// `flow-circle-draw` custom event with center and radii when the user
// finishes drawing. Hold Shift to constrain to a perfect circle.
// Place on the .flow-container element.
//
// Usage:
//   <div class="flow-container" x-flow-circle-draw="drawActive">...</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

/** Minimum radius (px in flow coords) — smaller draws are ignored. */
const MIN_RADIUS = 5;

const SVG_NS = 'http://www.w3.org/2000/svg';

interface Point {
  x: number;
  y: number;
}

export function registerFlowCircleDrawDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-circle-draw',
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
      let centerFlow: Point = { x: 0, y: 0 };
      let currentFlow: Point = { x: 0, y: 0 };
      let previewSvg: SVGSVGElement | null = null;
      let ellipseEl: SVGEllipseElement | null = null;

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

        const settings = getToolSettings();

        previewSvg = document.createElementNS(SVG_NS, 'svg');
        previewSvg.style.cssText =
          'position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:1000;';

        ellipseEl = document.createElementNS(SVG_NS, 'ellipse');
        ellipseEl.style.fill = 'var(--flow-circle-draw-fill, rgba(148,163,184,0.08))';
        ellipseEl.setAttribute('stroke', settings.strokeColor);
        ellipseEl.setAttribute('stroke-width', String(settings.strokeWidth));
        ellipseEl.setAttribute('stroke-dasharray', '6 3');
        previewSvg.appendChild(ellipseEl);

        viewport.appendChild(previewSvg);
      }

      function updatePreview(shiftKey: boolean): void {
        if (!ellipseEl) return;
        let rx = Math.abs(currentFlow.x - centerFlow.x);
        let ry = Math.abs(currentFlow.y - centerFlow.y);
        if (shiftKey) {
          const r = Math.max(rx, ry);
          rx = r;
          ry = r;
        }
        ellipseEl.setAttribute('cx', String(centerFlow.x));
        ellipseEl.setAttribute('cy', String(centerFlow.y));
        ellipseEl.setAttribute('rx', String(rx));
        ellipseEl.setAttribute('ry', String(ry));
      }

      function removePreview(): void {
        if (previewSvg) {
          previewSvg.remove();
          previewSvg = null;
          ellipseEl = null;
        }
      }

      // ── Pointer handlers ─────────────────────────────────────────────

      /**
       * Capture-phase handler: suppress d3-zoom (which listens on
       * mousedown/touchstart) and start circle drag.
       */
      function onPointerDownCapture(e: PointerEvent): void {
        const target = e.target as HTMLElement;
        if (target.closest('.flow-panel') || target.closest('.canvas-overlay')) {
          return;
        }
        if (e.button !== 0) return;

        e.stopImmediatePropagation();

        dragging = true;
        centerFlow = canvas.screenToFlowPosition(e.clientX, e.clientY);
        currentFlow = { ...centerFlow };

        createPreview();
        updatePreview(e.shiftKey);

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
        updatePreview(e.shiftKey);
      }

      function onPointerUp(e: PointerEvent): void {
        if (!dragging) return;
        dragging = false;

        currentFlow = canvas.screenToFlowPosition(e.clientX, e.clientY);

        const settings = getToolSettings();
        let rx = Math.abs(currentFlow.x - centerFlow.x);
        let ry = Math.abs(currentFlow.y - centerFlow.y);
        if (e.shiftKey) {
          const r = Math.max(rx, ry);
          rx = r;
          ry = r;
        }

        removePreview();

        // Ignore accidental clicks (too small)
        if (rx < MIN_RADIUS && ry < MIN_RADIUS) {
          containerEl.releasePointerCapture(e.pointerId);
          return;
        }

        containerEl.dispatchEvent(
          new CustomEvent('flow-circle-draw', {
            detail: {
              cx: centerFlow.x,
              cy: centerFlow.y,
              rx,
              ry,
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
          containerEl.classList.add('flow-tool-circle');
          attachListeners();
        } else {
          containerEl.classList.remove('flow-tool-circle');
          detachListeners();
        }
      });

      cleanup(() => {
        containerEl.classList.remove('flow-tool-circle');
        detachListeners();
      });
    },
  );
}
