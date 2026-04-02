// ============================================================================
// x-flow-arrow-draw Directive
//
// Click-and-drag to draw an arrow on the canvas. Emits a
// `flow-arrow-draw` custom event with start/end points when the user
// finishes drawing. Place on the .flow-container element.
//
// Usage:
//   <div class="flow-container" x-flow-arrow-draw="drawActive">...</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

/** Minimum distance (px in flow coords) — shorter draws are ignored. */
const MIN_DISTANCE = 15;

const SVG_NS = 'http://www.w3.org/2000/svg';

interface Point {
  x: number;
  y: number;
}

export function registerFlowArrowDrawDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-arrow-draw',
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
      let previewSvg: SVGSVGElement | null = null;
      let lineEl: SVGLineElement | null = null;
      const markerId = `flow-arrow-preview-${crypto.randomUUID()}`;

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

        // Arrowhead marker definition
        const defs = document.createElementNS(SVG_NS, 'defs');
        const marker = document.createElementNS(SVG_NS, 'marker');
        marker.setAttribute('id', markerId);
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '10');
        marker.setAttribute('refY', '5');
        marker.setAttribute('markerWidth', '6');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('orient', 'auto-start-reverse');
        const markerPath = document.createElementNS(SVG_NS, 'path');
        markerPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        markerPath.setAttribute('fill', settings.strokeColor);
        marker.appendChild(markerPath);
        defs.appendChild(marker);
        previewSvg.appendChild(defs);

        // Line element
        lineEl = document.createElementNS(SVG_NS, 'line');
        lineEl.setAttribute('stroke', settings.strokeColor);
        lineEl.setAttribute('stroke-width', String(settings.strokeWidth));
        lineEl.setAttribute('marker-end', `url(#${markerId})`);
        previewSvg.appendChild(lineEl);

        viewport.appendChild(previewSvg);
      }

      function updatePreview(): void {
        if (!lineEl) return;
        lineEl.setAttribute('x1', String(startFlow.x));
        lineEl.setAttribute('y1', String(startFlow.y));
        lineEl.setAttribute('x2', String(currentFlow.x));
        lineEl.setAttribute('y2', String(currentFlow.y));
      }

      function removePreview(): void {
        if (previewSvg) {
          previewSvg.remove();
          previewSvg = null;
          lineEl = null;
        }
      }

      // ── Pointer handlers ─────────────────────────────────────────────

      /**
       * Capture-phase handler: suppress d3-zoom (which listens on
       * mousedown/touchstart) and start arrow drag.
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

        const settings = getToolSettings();
        const dx = currentFlow.x - startFlow.x;
        const dy = currentFlow.y - startFlow.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        removePreview();

        // Ignore accidental clicks (too short)
        if (dist < MIN_DISTANCE) {
          containerEl.releasePointerCapture(e.pointerId);
          return;
        }

        containerEl.dispatchEvent(
          new CustomEvent('flow-arrow-draw', {
            detail: {
              start: { x: startFlow.x, y: startFlow.y },
              end: { x: currentFlow.x, y: currentFlow.y },
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
          containerEl.classList.add('flow-tool-arrow');
          attachListeners();
        } else {
          containerEl.classList.remove('flow-tool-arrow');
          detachListeners();
        }
      });

      cleanup(() => {
        containerEl.classList.remove('flow-tool-arrow');
        detachListeners();
      });
    },
  );
}
