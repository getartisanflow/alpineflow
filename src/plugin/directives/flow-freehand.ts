// ============================================================================
// x-flow-freehand Directive
//
// Freehand drawing tool. Uses perfect-freehand for natural variable-width
// strokes. Draws a lightweight polyline preview during drag, then produces
// a filled outline path on pointer-up via getStroke().
//
// Usage:
//   <div class="flow-container" x-flow-freehand="drawActive">...</div>
// ============================================================================

import type { Alpine } from 'alpinejs';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke } from '../../core/svg-path';

/** Minimum distance (flow coords) between consecutive points. */
const MIN_POINT_DISTANCE = 3;

const SVG_NS = 'http://www.w3.org/2000/svg';

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


export function registerFlowFreehandDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-freehand',
    (
      el,
      { expression, modifiers },
      { evaluate, effect, cleanup },
    ) => {
      const containerEl = el as HTMLElement;

      // Support .filled modifier: x-flow-freehand.filled="active"
      const filledViaModifier = modifiers.includes('filled');
      let isFilled = filledViaModifier;

      const canvas = Alpine.$data(containerEl) as any;
      if (!canvas) return;

      // ── Drag state ───────────────────────────────────────────────────
      let dragging = false;
      let activePointerId: number | null = null;
      /** Points collected as [x, y, pressure] tuples for perfect-freehand. */
      let points: number[][] = [];
      let lastPt: Point = { x: 0, y: 0 };
      let liveSvg: SVGSVGElement | null = null;
      let polylineEl: SVGPolylineElement | null = null;

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

      function createLiveSvg(): void {
        const viewport = getViewportEl();
        if (!viewport) return;

        const { strokeColor, opacity } = getToolSettings();

        liveSvg = document.createElementNS(SVG_NS, 'svg');
        liveSvg.style.cssText =
          'position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:1000;';
        polylineEl = document.createElementNS(SVG_NS, 'polyline');
        polylineEl.classList.add('flow-freehand-path');
        polylineEl.setAttribute('fill', 'none');
        polylineEl.setAttribute('stroke', strokeColor);
        polylineEl.setAttribute('stroke-width', '2');
        polylineEl.setAttribute('stroke-linecap', 'round');
        polylineEl.setAttribute('stroke-linejoin', 'round');
        polylineEl.setAttribute('opacity', String(opacity));
        liveSvg.appendChild(polylineEl);
        viewport.appendChild(liveSvg);
      }

      function removeLiveSvg(): void {
        if (liveSvg) {
          liveSvg.remove();
          liveSvg = null;
          polylineEl = null;
        }
      }

      function updatePolyline(): void {
        if (!polylineEl || points.length === 0) return;
        const pointsStr = points.map(([x, y]) => `${x},${y}`).join(' ');
        polylineEl.setAttribute('points', pointsStr);
      }

      function computeBounds(pts: number[][]): Bounds {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const [x, y] of pts) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }

        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        };
      }

      // ── Pointer handlers ─────────────────────────────────────────────

      /**
       * Capture-phase handler: suppress d3-zoom (which listens on
       * mousedown/touchstart) and start freehand draw.
       */
      function onPointerDownCapture(e: PointerEvent): void {
        const target = e.target as HTMLElement;
        if (target.closest('.flow-panel') || target.closest('.canvas-overlay')) {
          return;
        }
        if (e.button !== 0) return;

        e.stopImmediatePropagation();

        dragging = true;
        points = [];

        const flowPt = canvas.screenToFlowPosition(e.clientX, e.clientY);
        const pressure = e.pressure > 0 ? e.pressure : 0.5;
        points.push([flowPt.x, flowPt.y, pressure]);
        lastPt = flowPt;

        createLiveSvg();
        updatePolyline();

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

        const flowPt = canvas.screenToFlowPosition(e.clientX, e.clientY);
        const dx = flowPt.x - lastPt.x;
        const dy = flowPt.y - lastPt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MIN_POINT_DISTANCE) return;

        const pressure = e.pressure > 0 ? e.pressure : 0.5;
        points.push([flowPt.x, flowPt.y, pressure]);
        lastPt = flowPt;
        updatePolyline();
      }

      function onPointerUp(e: PointerEvent): void {
        if (!dragging) return;
        dragging = false;

        const capturedPoints = [...points];

        removeLiveSvg();

        // Ignore drawings with fewer than 3 points
        if (capturedPoints.length < 3) {
          containerEl.releasePointerCapture(e.pointerId);
          return;
        }

        const { strokeColor, strokeWidth, opacity } = getToolSettings();
        const bounds = computeBounds(capturedPoints);

        // Generate filled outline path via perfect-freehand
        const outlinePoints = getStroke(capturedPoints, {
          size: strokeWidth * 4,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        });
        const pathData = getSvgPathFromStroke(outlinePoints);

        containerEl.dispatchEvent(
          new CustomEvent('flow-freehand-end', {
            detail: {
              points: capturedPoints,
              pathData,
              bounds,
              strokeColor,
              strokeWidth,
              opacity,
              filled: isFilled,
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
          removeLiveSvg();
          points = [];
          if (activePointerId !== null) {
            containerEl.releasePointerCapture(activePointerId);
            activePointerId = null;
          }
        }
      }

      function cancelDrag(): void {
        if (dragging) {
          dragging = false;
          removeLiveSvg();
          points = [];
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
        isFilled = filledViaModifier;

        if (active) {
          containerEl.classList.add('flow-tool-freehand');
          if (isFilled) {
            containerEl.classList.add('flow-tool-freehand-filled');
          } else {
            containerEl.classList.remove('flow-tool-freehand-filled');
          }
          attachListeners();
        } else {
          containerEl.classList.remove('flow-tool-freehand');
          containerEl.classList.remove('flow-tool-freehand-filled');
          detachListeners();
        }
      });

      cleanup(() => {
        containerEl.classList.remove('flow-tool-freehand');
        containerEl.classList.remove('flow-tool-freehand-filled');
        detachListeners();
      });
    },
  );
}
