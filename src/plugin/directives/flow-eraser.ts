// ============================================================================
// x-flow-eraser Directive
//
// Collect-then-delete eraser tool. Place on the .flow-container element.
// When the directive's expression evaluates to truthy the tool is active:
// drag to paint over nodes/edges, release to delete everything touched.
//
// Usage:
//   <div class="flow-container" x-flow-eraser="eraserActive">...</div>
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { FlowNode, FlowEdge } from '../../core/types';

/** Minimum pixel distance between consecutive trail points. */
const MIN_POINT_DISTANCE = 3;

const SVG_NS = 'http://www.w3.org/2000/svg';

// ── Geometry helpers ─────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Test whether the line segment (p1 -> p2) intersects the axis-aligned
 * rectangle defined by `rect`. Uses the Liang-Barsky algorithm.
 */
function segmentIntersectsRect(p1: Point, p2: Point, rect: Rect): boolean {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const p = [-dx, dx, -dy, dy];
  const q = [
    p1.x - rect.x,
    rect.x + rect.w - p1.x,
    p1.y - rect.y,
    rect.y + rect.h - p1.y,
  ];

  let tMin = 0;
  let tMax = 1;

  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return false;
    } else {
      const t = q[i] / p[i];
      if (p[i] < 0) {
        tMin = Math.max(tMin, t);
      } else {
        tMax = Math.min(tMax, t);
      }
      if (tMin > tMax) return false;
    }
  }

  return true;
}

// ── Directive ────────────────────────────────────────────────────────────

export function registerFlowEraserDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-eraser',
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
      let trailSvg: SVGSVGElement | null = null;
      let polyline: SVGPolylineElement | null = null;
      let points: string[] = [];
      let lastPt: Point = { x: 0, y: 0 };
      const markedNodes = new Set<string>();
      const markedEdges = new Set<string>();

      // ── Helpers ──────────────────────────────────────────────────────

      function containerCoords(e: PointerEvent): Point {
        const rect = containerEl.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }

      function toFlowCoords(cx: number, cy: number): Point {
        const vp = canvas.viewport;
        return {
          x: (cx - vp.x) / vp.zoom,
          y: (cy - vp.y) / vp.zoom,
        };
      }

      function getNodeRect(node: FlowNode): Rect {
        // For annotation nodes with SVG content (freehand paths, arrows,
        // circles), use the SVG element's bounding box since the node
        // wrapper is typically a tiny 1×1 overflow:visible container.
        const nodeEl = containerEl.querySelector(
          `[data-flow-node-id="${CSS.escape(node.id)}"]`,
        );
        if (nodeEl) {
          // Try any SVG graphics element — path, line, ellipse, circle, rect, polyline.
          // Exclude elements inside <defs> (e.g. marker paths) which have tiny bounding boxes.
          const svgEl = nodeEl.querySelector('svg > path, svg > line, svg > ellipse, svg > circle, svg > rect, svg > polyline') as SVGGraphicsElement | null;
          if (svgEl) {
            try {
              const bbox = svgEl.getBBox();
              if (bbox.width > 0 && bbox.height > 0) {
                const absPos = canvas.getAbsolutePosition(node.id);
                return { x: absPos.x + bbox.x, y: absPos.y + bbox.y, w: bbox.width, h: bbox.height };
              }
            } catch { /* getBBox may throw if element not rendered */ }
          }
          // Also check for HTML annotation content (rectangles rendered as divs)
          const divContent = nodeEl.querySelector('[style*="width"]') as HTMLElement | null;
          if (divContent && nodeEl.classList.contains('flow-node-annotation')) {
            const absPos = canvas.getAbsolutePosition(node.id);
            return { x: absPos.x, y: absPos.y, w: divContent.offsetWidth || 150, h: divContent.offsetHeight || 40 };
          }
        }
        const absPos = canvas.getAbsolutePosition(node.id);
        const w = node.dimensions?.width ?? 150;
        const h = node.dimensions?.height ?? 40;
        return { x: absPos.x, y: absPos.y, w, h };
      }

      function getEdgeRect(edge: FlowEdge): Rect | null {
        const edgeEl = containerEl.querySelector(
          `[data-flow-edge-id="${CSS.escape(edge.id)}"]`,
        );
        if (!edgeEl) return null;
        const path = edgeEl.querySelector('path') as SVGPathElement | null;
        if (!path) return null;
        const bbox = path.getBBox();
        return { x: bbox.x, y: bbox.y, w: bbox.width, h: bbox.height };
      }

      function markElement(id: string, type: 'node' | 'edge'): void {
        const selector =
          type === 'node'
            ? `[data-flow-node-id="${CSS.escape(id)}"]`
            : `[data-flow-edge-id="${CSS.escape(id)}"]`;
        const domEl = containerEl.querySelector(selector);
        domEl?.classList.add('flow-eraser-marked');
      }

      function unmarkAll(): void {
        containerEl
          .querySelectorAll('.flow-eraser-marked')
          .forEach((domEl) => domEl.classList.remove('flow-eraser-marked'));
        markedNodes.clear();
        markedEdges.clear();
      }

      function createTrail(): void {
        trailSvg = document.createElementNS(SVG_NS, 'svg');
        trailSvg.style.cssText =
          'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1000;overflow:visible;';
        polyline = document.createElementNS(SVG_NS, 'polyline');
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', 'var(--flow-eraser-trail, rgba(239,68,68,0.6))');
        polyline.setAttribute('stroke-width', '3');
        polyline.setAttribute('stroke-linecap', 'round');
        polyline.setAttribute('stroke-linejoin', 'round');
        trailSvg.appendChild(polyline);
        containerEl.appendChild(trailSvg);
        points = [];
      }

      function clearTrail(): void {
        if (trailSvg) {
          trailSvg.remove();
          trailSvg = null;
          polyline = null;
          points = [];
        }
      }

      function addTrailPoint(pt: Point): void {
        points.push(`${pt.x},${pt.y}`);
        polyline?.setAttribute('points', points.join(' '));
      }

      function hitTestAnnotationPath(nodeEl: Element, flowPt: Point, absPos: Point): boolean {
        const svgEl = nodeEl.querySelector('svg > path') as SVGPathElement | null;
        if (!svgEl) return false;
        // Convert flow coordinates to SVG-local coordinates
        const localPt = svgEl.ownerSVGElement!.createSVGPoint();
        localPt.x = flowPt.x - absPos.x;
        localPt.y = flowPt.y - absPos.y;
        // Check fill hit with a generous tolerance via stroke test
        if (svgEl.isPointInFill(localPt)) return true;
        // For thin strokes, also check a wider stroke area
        const origWidth = svgEl.style.strokeWidth;
        svgEl.style.strokeWidth = '20';
        const inStroke = svgEl.isPointInStroke(localPt);
        svgEl.style.strokeWidth = origWidth;
        return inStroke;
      }

      function hitTest(flowA: Point, flowB: Point): void {
        // Test nodes
        for (const node of canvas.nodes as FlowNode[]) {
          if (node.hidden || markedNodes.has(node.id)) continue;
          const rect = getNodeRect(node);
          if (segmentIntersectsRect(flowA, flowB, rect)) {
            // For annotation nodes with SVG paths, do precise hit testing
            // instead of relying on the loose bounding box
            const nodeEl = containerEl.querySelector(
              `[data-flow-node-id="${CSS.escape(node.id)}"]`,
            );
            if (nodeEl?.classList.contains('flow-node-annotation') && nodeEl.querySelector('svg > path')) {
              const absPos = canvas.getAbsolutePosition(node.id);
              if (!hitTestAnnotationPath(nodeEl, flowA, absPos) && !hitTestAnnotationPath(nodeEl, flowB, absPos)) {
                continue; // Bounding box hit but path didn't — skip
              }
            }
            markedNodes.add(node.id);
            markElement(node.id, 'node');
          }
        }

        // Test edges
        for (const edge of canvas.edges as FlowEdge[]) {
          if (markedEdges.has(edge.id)) continue;
          const rect = getEdgeRect(edge);
          if (!rect) continue;
          if (segmentIntersectsRect(flowA, flowB, rect)) {
            markedEdges.add(edge.id);
            markElement(edge.id, 'edge');
          }
        }
      }

      // ── Pointer handlers ─────────────────────────────────────────────

      /**
       * Capture-phase handler: suppress d3-zoom (which listens on
       * mousedown/touchstart) and start erase drag.
       */
      function onPointerDownCapture(e: PointerEvent): void {
        const target = e.target as HTMLElement;
        if (target.closest('.flow-panel') || target.closest('.canvas-overlay')) {
          return;
        }
        if (e.button !== 0) return;

        e.stopImmediatePropagation();

        dragging = true;
        const pt = containerCoords(e);
        lastPt = pt;
        createTrail();
        addTrailPoint(pt);

        // Perform initial hit test at the click point
        const flowPt = toFlowCoords(pt.x, pt.y);
        hitTest(flowPt, flowPt);

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

        const pt = containerCoords(e);
        const dx = pt.x - lastPt.x;
        const dy = pt.y - lastPt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MIN_POINT_DISTANCE) return;

        addTrailPoint(pt);

        // Convert both endpoints of this segment to flow coordinates
        const flowA = toFlowCoords(lastPt.x, lastPt.y);
        const flowB = toFlowCoords(pt.x, pt.y);
        hitTest(flowA, flowB);

        lastPt = pt;
      }

      function onPointerUp(e: PointerEvent): void {
        if (!dragging) return;
        dragging = false;
        clearTrail();

        // Delete marked items
        if (markedNodes.size > 0) {
          canvas.removeNodes([...markedNodes]);
        }
        if (markedEdges.size > 0) {
          canvas.removeEdges([...markedEdges]);
        }

        unmarkAll();
        containerEl.releasePointerCapture(e.pointerId);
      }

      function onKeyDown(e: KeyboardEvent): void {
        if (!dragging) return;
        if (e.key === 'Escape') {
          dragging = false;
          clearTrail();
          unmarkAll();
        }
      }

      function cancelDrag(): void {
        if (dragging) {
          dragging = false;
          clearTrail();
          unmarkAll();
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
          containerEl.classList.add('flow-tool-eraser');
          attachListeners();
        } else {
          containerEl.classList.remove('flow-tool-eraser');
          detachListeners();
        }
      });

      cleanup(() => {
        containerEl.classList.remove('flow-tool-eraser');
        detachListeners();
      });
    },
  );
}
