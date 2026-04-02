// ============================================================================
// x-flow-panel Directive
//
// Floating overlay panel that sits above the canvas. Anchors to one of 8
// positions, is draggable and resizable by default.
//
// Modifiers:
//   Position:      top, bottom, left, right, top-left, top-right (default),
//                  bottom-left, bottom-right
//   .locked        — not draggable (resizable unless .no-resize/.static)
//   .static        — no drag, no resize
//   .no-resize     — draggable but not resizable
//   .constrained   — prevent dragging outside the container bounds
//   .fill-width    — spans full container width, implies fixed + no-resize
//   .fill-height   — spans full container height, implies fixed + no-resize
//   .fill          — spans both width and height, implies fixed + no-resize
//
// Events (dispatched on the flow-container element):
//   flow-panel-drag-start  { panel, position }
//   flow-panel-drag        { panel, position }
//   flow-panel-drag-end    { panel, position }
//   flow-panel-resize-start { panel, dimensions }
//   flow-panel-resize       { panel, dimensions }
//   flow-panel-resize-end   { panel, dimensions }
//
// Reset:
//   Listens for a 'flow-panel-reset' CustomEvent on the container to restore
//   the panel to its original state. The flowCanvas component exposes a
//   resetPanels() method for this.
//
// Usage:
//   <div x-flow-panel:bottom-left.constrained>Content</div>
//   <div x-flow-panel:top.locked>Locked, resizable</div>
//   <div x-flow-panel:top.fill-width>Full-width header</div>
//   <div x-flow-panel:left.fill-height>Sidebar</div>
//   <div x-flow-panel:top.static>Static overlay</div>
//   <div x-flow-panel>Defaults to top-right</div>
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { HandlePosition } from '../../core/types';

const VALID_POSITIONS: HandlePosition[] = [
  'top', 'bottom', 'left', 'right',
  'top-left', 'top-right', 'bottom-left', 'bottom-right',
];

const INTERACTIVE_SELECTORS = 'a, button, input, textarea, select, [contenteditable]';

const MIN_WIDTH = 100;
const MIN_HEIGHT = 60;

const TOP_POSITIONS = new Set(['top', 'top-left', 'top-right']);
const BOTTOM_POSITIONS = new Set(['bottom', 'bottom-left', 'bottom-right']);
const LEFT_POSITIONS = new Set(['left', 'top-left', 'bottom-left']);
const RIGHT_POSITIONS = new Set(['right', 'top-right', 'bottom-right']);

interface PanelModifiers {
  position: HandlePosition;
  isStatic: boolean;
  isFixed: boolean;
  noResize: boolean;
  constrained: boolean;
  fillWidth: boolean;
  fillHeight: boolean;
}

/**
 * Parse position and behavior flags from Alpine directive modifiers.
 */
function parseModifiers(value: string, modifiers: string[]): PanelModifiers {
  const modSet = new Set(modifiers);

  const isStatic = modSet.has('static');
  const noResize = modSet.has('no-resize') || modSet.has('noresize');
  const isFixed = modSet.has('locked');
  const constrained = modSet.has('constrained');

  // .fill = both, .fill-width = width only, .fill-height = height only
  let fillWidth = modSet.has('fill-width') || modSet.has('fill');
  let fillHeight = modSet.has('fill-height') || modSet.has('fill');

  // Position from colon value (e.g. x-flow-panel:bottom-left)
  const position: HandlePosition = value && VALID_POSITIONS.includes(value as HandlePosition)
    ? (value as HandlePosition)
    : 'top-right';

  return { position, isStatic, isFixed, noResize, constrained, fillWidth, fillHeight };
}

/**
 * Dispatch a panel event on the container element, following the flow-* convention.
 */
function emitPanelEvent(container: HTMLElement, event: string, detail: Record<string, unknown>): void {
  container.dispatchEvent(new CustomEvent(`flow-${event}`, {
    bubbles: true,
    detail,
  }));
}

/**
 * Clamp a position so the panel stays fully inside the container.
 */
function clampPosition(
  left: number,
  top: number,
  panelWidth: number,
  panelHeight: number,
  containerWidth: number,
  containerHeight: number,
): { left: number; top: number } {
  return {
    left: Math.max(0, Math.min(left, containerWidth - panelWidth)),
    top: Math.max(0, Math.min(top, containerHeight - panelHeight)),
  };
}

/**
 * Apply fill inline styles based on which dimensions should be filled
 * and which anchor position is set. Fill overrides the CSS class positioning
 * so the panel stretches edge-to-edge within the container.
 */
function applyFillStyles(
  el: HTMLElement,
  position: HandlePosition,
  fillWidth: boolean,
  fillHeight: boolean,
): void {
  el.style.transform = 'none';
  el.style.borderRadius = '0';

  if (fillWidth) {
    el.style.left = '0';
    el.style.right = '0';
    el.style.width = 'auto';
  }

  if (fillHeight) {
    el.style.top = '0';
    el.style.bottom = '0';
    el.style.height = 'auto';
  }

  // Flush the perpendicular edge to 0 for a clean full-span look.
  // e.g. top.fill-width → top: 0 (no 12px gap)
  if (fillWidth && !fillHeight) {
    if (TOP_POSITIONS.has(position)) el.style.top = '0';
    if (BOTTOM_POSITIONS.has(position)) el.style.bottom = '0';
  }
  if (fillHeight && !fillWidth) {
    if (LEFT_POSITIONS.has(position)) el.style.left = '0';
    if (RIGHT_POSITIONS.has(position)) el.style.right = '0';
  }
}

export function registerFlowPanelDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-panel',
    (el: HTMLElement, { value, modifiers }: { value: string; modifiers: string[] }, { cleanup }: { cleanup: (fn: () => void) => void }) => {
      const {
        position, isStatic, isFixed, noResize, constrained,
        fillWidth, fillHeight,
      } = parseModifiers(value, modifiers);

      const isFill = fillWidth || fillHeight;
      const canDrag = !isStatic && !isFixed && !isFill;
      const canResize = !isStatic && !noResize && !isFill;

      // --- CSS classes ---
      el.classList.add('flow-panel', `flow-panel-${position}`);
      if (isStatic) el.classList.add('flow-panel-static');
      if (isFixed || isFill) el.classList.add('flow-panel-locked');
      if (noResize || isFill) el.classList.add('flow-panel-no-resize');
      if (fillWidth) el.classList.add('flow-panel-fill-width');
      if (fillHeight) el.classList.add('flow-panel-fill-height');

      // --- Fill positioning (inline styles override CSS class positioning) ---
      if (isFill) {
        applyFillStyles(el, position, fillWidth, fillHeight);
      }

      // --- Event isolation: prevent canvas pan/zoom ---
      const stopProp = (e: Event) => e.stopPropagation();
      el.addEventListener('mousedown', stopProp);
      el.addEventListener('pointerdown', stopProp);
      el.addEventListener('wheel', stopProp);

      // --- Container reference ---
      const container = el.parentElement!;

      // --- Reset support ---
      // Snapshot the initial inline styles AFTER fill setup so reset
      // restores fill panels to their fill state, not to empty styles.
      const initialStyles = {
        left: el.style.left,
        top: el.style.top,
        right: el.style.right,
        bottom: el.style.bottom,
        transform: el.style.transform,
        width: el.style.width,
        height: el.style.height,
        borderRadius: el.style.borderRadius,
      };

      const originalPositionClass = `flow-panel-${position}`;

      const onReset = () => {
        el.style.left = initialStyles.left;
        el.style.top = initialStyles.top;
        el.style.right = initialStyles.right;
        el.style.bottom = initialStyles.bottom;
        el.style.transform = initialStyles.transform;
        el.style.width = initialStyles.width;
        el.style.height = initialStyles.height;
        el.style.borderRadius = initialStyles.borderRadius;
        if (!el.classList.contains(originalPositionClass)) {
          el.classList.add(originalPositionClass);
        }
      };

      container.addEventListener('flow-panel-reset', onReset);

      // --- Register panel on container for discovery ---
      if (!(container as any).__flowPanels) {
        (container as any).__flowPanels = new Set<HTMLElement>();
      }
      (container as any).__flowPanels.add(el);

      let resizeHandle: HTMLElement | null = null;

      if (canDrag) {
        // --- Draggable ---
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let elStartLeft = 0;
        let elStartTop = 0;

        const getPanelPosition = (): { x: number; y: number } => {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          return {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
          };
        };

        const onDragPointerMove = (e: PointerEvent) => {
          if (!isDragging) return;
          let newLeft = elStartLeft + (e.clientX - dragStartX);
          let newTop = elStartTop + (e.clientY - dragStartY);

          if (constrained) {
            const clamped = clampPosition(
              newLeft, newTop,
              el.offsetWidth, el.offsetHeight,
              container.clientWidth, container.clientHeight,
            );
            newLeft = clamped.left;
            newTop = clamped.top;
          }

          el.style.left = `${newLeft}px`;
          el.style.top = `${newTop}px`;

          emitPanelEvent(container, 'panel-drag', {
            panel: el,
            position: { x: newLeft, y: newTop },
          });
        };

        const onDragPointerUp = () => {
          if (!isDragging) return;
          isDragging = false;
          document.removeEventListener('pointermove', onDragPointerMove);
          document.removeEventListener('pointerup', onDragPointerUp);
          document.removeEventListener('pointercancel', onDragPointerUp);

          const pos = getPanelPosition();
          emitPanelEvent(container, 'panel-drag-end', {
            panel: el,
            position: pos,
          });
        };

        const onDragPointerDown = (e: PointerEvent) => {
          const target = e.target as HTMLElement;
          if (target.closest(INTERACTIVE_SELECTORS) || target.closest('.flow-panel-resize-handle')) {
            return;
          }

          isDragging = true;
          dragStartX = e.clientX;
          dragStartY = e.clientY;

          // Switch from CSS anchor positioning to explicit top/left
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          elStartLeft = rect.left - containerRect.left;
          elStartTop = rect.top - containerRect.top;

          // Clear anchor positioning
          el.style.bottom = 'auto';
          el.style.right = 'auto';
          el.style.transform = 'none';
          el.style.left = `${elStartLeft}px`;
          el.style.top = `${elStartTop}px`;

          document.addEventListener('pointermove', onDragPointerMove);
          document.addEventListener('pointerup', onDragPointerUp);
          document.addEventListener('pointercancel', onDragPointerUp);

          emitPanelEvent(container, 'panel-drag-start', {
            panel: el,
            position: { x: elStartLeft, y: elStartTop },
          });
        };

        el.addEventListener('pointerdown', onDragPointerDown);

        // --- Resizable (bottom-right grip) ---
        if (canResize) {
          resizeHandle = document.createElement('div');
          resizeHandle.classList.add('flow-panel-resize-handle');
          el.appendChild(resizeHandle);

          let isResizing = false;
          let resizeStartX = 0;
          let resizeStartY = 0;
          let startWidth = 0;
          let startHeight = 0;

          const onResizePointerMove = (e: PointerEvent) => {
            if (!isResizing) return;
            const newWidth = Math.max(MIN_WIDTH, startWidth + (e.clientX - resizeStartX));
            const newHeight = Math.max(MIN_HEIGHT, startHeight + (e.clientY - resizeStartY));
            el.style.width = `${newWidth}px`;
            el.style.height = `${newHeight}px`;

            emitPanelEvent(container, 'panel-resize', {
              panel: el,
              dimensions: { width: newWidth, height: newHeight },
            });
          };

          const onResizePointerUp = () => {
            if (!isResizing) return;
            isResizing = false;
            document.removeEventListener('pointermove', onResizePointerMove);
            document.removeEventListener('pointerup', onResizePointerUp);
            document.removeEventListener('pointercancel', onResizePointerUp);

            emitPanelEvent(container, 'panel-resize-end', {
              panel: el,
              dimensions: { width: el.offsetWidth, height: el.offsetHeight },
            });
          };

          const onResizePointerDown = (e: PointerEvent) => {
            e.stopPropagation();
            isResizing = true;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            startWidth = el.offsetWidth;
            startHeight = el.offsetHeight;

            document.addEventListener('pointermove', onResizePointerMove);
            document.addEventListener('pointerup', onResizePointerUp);
            document.addEventListener('pointercancel', onResizePointerUp);

            emitPanelEvent(container, 'panel-resize-start', {
              panel: el,
              dimensions: { width: startWidth, height: startHeight },
            });
          };

          resizeHandle.addEventListener('pointerdown', onResizePointerDown);

          cleanup(() => {
            el.removeEventListener('pointerdown', onDragPointerDown);
            resizeHandle?.removeEventListener('pointerdown', onResizePointerDown);
            document.removeEventListener('pointermove', onDragPointerMove);
            document.removeEventListener('pointerup', onDragPointerUp);
            document.removeEventListener('pointercancel', onDragPointerUp);
            document.removeEventListener('pointermove', onResizePointerMove);
            document.removeEventListener('pointerup', onResizePointerUp);
            document.removeEventListener('pointercancel', onResizePointerUp);
            resizeHandle?.remove();
            el.removeEventListener('mousedown', stopProp);
            el.removeEventListener('pointerdown', stopProp);
            el.removeEventListener('wheel', stopProp);
            container.removeEventListener('flow-panel-reset', onReset);
            (container as any).__flowPanels?.delete(el);
          });
        } else {
          // Draggable but no resize
          cleanup(() => {
            el.removeEventListener('pointerdown', onDragPointerDown);
            document.removeEventListener('pointermove', onDragPointerMove);
            document.removeEventListener('pointerup', onDragPointerUp);
            document.removeEventListener('pointercancel', onDragPointerUp);
            el.removeEventListener('mousedown', stopProp);
            el.removeEventListener('pointerdown', stopProp);
            el.removeEventListener('wheel', stopProp);
            container.removeEventListener('flow-panel-reset', onReset);
            (container as any).__flowPanels?.delete(el);
          });
        }
      } else {
        // Fixed / static / fill — no drag
        cleanup(() => {
          el.removeEventListener('mousedown', stopProp);
          el.removeEventListener('pointerdown', stopProp);
          el.removeEventListener('wheel', stopProp);
          container.removeEventListener('flow-panel-reset', onReset);
          (container as any).__flowPanels?.delete(el);
        });
      }
    },
  );
}
