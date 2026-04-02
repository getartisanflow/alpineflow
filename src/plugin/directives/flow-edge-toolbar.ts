// ============================================================================
// x-flow-edge-toolbar Directive
//
// Floating toolbar positioned at a point along an edge path. Counter-scales
// against viewport zoom like x-flow-node-toolbar. Rendered as an HTML
// overlay in .flow-viewport.
//
// Usage:
//   <div x-flow-edge-toolbar x-show="edge.selected">...</div>        — midpoint, above
//   <div x-flow-edge-toolbar.below x-show="edge.selected">...</div>  — midpoint, below
//   <div x-flow-edge-toolbar="0.3">...</div>                         — 30% along path
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowEdgeToolbarDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-edge-toolbar',
    (
      el,
      { expression, modifiers },
      { evaluate, effect, cleanup },
    ) => {
      // ── Find parent edge and canvas ────────────────────────────────
      const edgeGroupEl = el.closest('[data-flow-edge-id]') as SVGGElement | null;
      if (!edgeGroupEl) return;

      const edgeId = edgeGroupEl.dataset.flowEdgeId!;

      const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement | null;
      if (!canvasEl) return;

      const canvas = Alpine.$data(canvasEl);
      if (!canvas) return;

      // ── Relocate to viewport as HTML overlay ───────────────────────
      const viewport = canvasEl.querySelector('.flow-viewport') as HTMLElement | null;
      if (!viewport) return;

      // Preserve the x-for loop variable (`edge`) before moving the element
      // out of its original parent hierarchy. Canvas methods (removeEdges, etc.)
      // remain accessible since .flow-viewport is inside the canvas x-data scope.
      try {
        const edge = evaluate('edge');
        if (edge) Alpine.addScopeToNode(el as HTMLElement, { edge });
      } catch { /* edge not in scope — toolbar used outside x-for */ }

      viewport.appendChild(el);

      // ── Base styling ───────────────────────────────────────────────
      el.classList.add('flow-edge-toolbar');
      el.style.position = 'absolute';

      // ── Prevent interactions from triggering edge actions ──────────
      const stopPointerDown = (e: PointerEvent) => { e.stopPropagation(); };
      const stopClick = (e: MouseEvent) => { e.stopPropagation(); };
      el.addEventListener('pointerdown', stopPointerDown);
      el.addEventListener('click', stopClick);

      // ── Parse options ──────────────────────────────────────────────
      const below = modifiers.includes('below');
      const defaultOffset = 20;

      // ── Reactive positioning ───────────────────────────────────────
      effect(() => {
        // Self-cleanup: toolbar was moved out of x-for's DOM tree, so Alpine's
        // template cleanup won't reach it when the edge is removed.
        // Read canvas.edges (reactive array) to ensure this effect re-runs on removal.
        if (!canvas.edges.some((e: any) => e.id === edgeId)) {
          el.removeEventListener('pointerdown', stopPointerDown);
          el.removeEventListener('click', stopClick);
          el.classList.remove('flow-edge-toolbar');
          el.remove();
          return;
        }

        const zoom: number = canvas.viewport?.zoom || 1;
        const offset = parseInt(el.getAttribute('data-flow-offset') ?? String(defaultOffset), 10);

        // Evaluate position expression (0-1 along path), default 0.5
        let t = 0.5;
        if (expression) {
          const evaluated = evaluate(expression);
          if (typeof evaluated === 'number') t = evaluated;
        }

        // Find the visible path element (second <path> in the edge group)
        const paths = edgeGroupEl.querySelectorAll('path');
        const pathEl = paths.length > 1 ? (paths[1] as SVGPathElement) : (paths[0] as SVGPathElement | undefined);
        if (!pathEl) return;

        const totalLength = pathEl.getTotalLength?.();
        if (!totalLength) return;

        const pt = pathEl.getPointAtLength(totalLength * Math.max(0, Math.min(1, t)));

        // Apply perpendicular offset (above or below)
        const scaledOffset = offset / zoom;
        const yOffset = below ? scaledOffset : -scaledOffset;

        el.style.left = `${pt.x}px`;
        el.style.top = `${pt.y + yOffset}px`;
        el.style.transformOrigin = '0 0';
        el.style.transform = `scale(${1 / zoom}) translate(-50%, ${below ? '0%' : '-100%'})`;
      });

      // ── Cleanup ────────────────────────────────────────────────────
      cleanup(() => {
        el.removeEventListener('pointerdown', stopPointerDown);
        el.removeEventListener('click', stopClick);
        el.classList.remove('flow-edge-toolbar');
        el.remove();
      });
    },
  );
}
