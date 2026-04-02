// ============================================================================
// x-flow-node-toolbar Directive
//
// Floating toolbar that appears adjacent to a node. Positions itself outside
// the node boundary and counter-scales against viewport zoom so it stays at
// a fixed pixel size. Visibility is user-controlled via x-show / x-if.
//
// Usage:
//   <div x-flow-node-toolbar>...</div>                — top center (default)
//   <div x-flow-node-toolbar:bottom>...</div>         — bottom center
//   <div x-flow-node-toolbar:right.end>...</div>      — right side, aligned end
//   <div x-flow-node-toolbar:left.start data-offset="16">...</div>
// ============================================================================

import type { Alpine } from 'alpinejs';

type ToolbarPosition = 'top' | 'bottom' | 'left' | 'right';
type ToolbarAlign = 'start' | 'center' | 'end';

export function registerFlowNodeToolbarDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-node-toolbar',
    (
      el,
      { value, modifiers },
      { effect, cleanup },
    ) => {
      // ── Parse position and alignment from value ──────────────────────
      const position: ToolbarPosition = resolvePosition(value);
      const align: ToolbarAlign = resolveAlign(modifiers);

      // ── Base styling ─────────────────────────────────────────────────
      el.classList.add('flow-node-toolbar');
      el.style.position = 'absolute';

      // ── Prevent toolbar interactions from triggering node drag/select ─
      const stopPointerDown = (e: PointerEvent) => { e.stopPropagation(); };
      const stopClick = (e: MouseEvent) => { e.stopPropagation(); };
      el.addEventListener('pointerdown', stopPointerDown);
      el.addEventListener('click', stopClick);

      // ── Reactive positioning and inverse-scale ───────────────────────
      //
      // Position the toolbar at an anchor point on the node edge, then use
      // percentage-based CSS translate for centering. This avoids measuring
      // el.offsetWidth/Height (which returns 0 when hidden via x-show).
      effect(() => {
        const nodeEl = el.closest('[x-flow-node]') as HTMLElement | null;
        if (!nodeEl) return;

        const canvasEl = el.closest('[x-data]') as HTMLElement | null;
        if (!canvasEl) return;

        const canvas = Alpine.$data(canvasEl);
        if (!canvas?.viewport) return;

        const zoom: number = canvas.viewport.zoom || 1;
        const offset = parseInt(el.getAttribute('data-flow-offset') ?? '10', 10);

        // Measure node dimensions (from reactive state or DOM)
        const nodeId = nodeEl.dataset.flowNodeId;
        const node = nodeId ? canvas.getNode(nodeId) : null;
        const nodeWidth = node?.dimensions?.width ?? nodeEl.offsetWidth;
        const nodeHeight = node?.dimensions?.height ?? nodeEl.offsetHeight;

        const scaledOffset = offset / zoom;

        // Compute anchor point on the node edge
        let anchorX: number;
        let anchorY: number;
        let tx: string;
        let ty: string;

        if (position === 'top' || position === 'bottom') {
          anchorY = position === 'top' ? -scaledOffset : nodeHeight + scaledOffset;
          ty = position === 'top' ? '-100%' : '0%';

          if (align === 'start') {
            anchorX = 0;
            tx = '0%';
          } else if (align === 'end') {
            anchorX = nodeWidth;
            tx = '-100%';
          } else {
            anchorX = nodeWidth / 2;
            tx = '-50%';
          }
        } else {
          anchorX = position === 'left' ? -scaledOffset : nodeWidth + scaledOffset;
          tx = position === 'left' ? '-100%' : '0%';

          if (align === 'start') {
            anchorY = 0;
            ty = '0%';
          } else if (align === 'end') {
            anchorY = nodeHeight;
            ty = '-100%';
          } else {
            anchorY = nodeHeight / 2;
            ty = '-50%';
          }
        }

        el.style.left = `${anchorX}px`;
        el.style.top = `${anchorY}px`;
        el.style.transformOrigin = '0 0';
        el.style.transform = `scale(${1 / zoom}) translate(${tx}, ${ty})`;
      });

      // ── Cleanup ──────────────────────────────────────────────────────
      cleanup(() => {
        el.removeEventListener('pointerdown', stopPointerDown);
        el.removeEventListener('click', stopClick);
        el.classList.remove('flow-node-toolbar');
      });
    },
  );
}

function resolvePosition(value: string): ToolbarPosition {
  if (value === 'bottom') return 'bottom';
  if (value === 'left') return 'left';
  if (value === 'right') return 'right';
  return 'top';
}

function resolveAlign(modifiers: string[]): ToolbarAlign {
  if (modifiers.includes('start')) return 'start';
  if (modifiers.includes('end')) return 'end';
  return 'center';
}
