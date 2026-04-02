// ============================================================================
// x-flow-context-menu Directive
//
// Renders a positioned context menu overlay when a right-click event of the
// matching type fires on the parent flow canvas. The directive manages its own
// visibility, fixed-position placement, dismiss backdrop, scroll dismiss,
// viewport overflow prevention, keyboard navigation, and ARIA roles.
//
// Modifiers:
//   .node       — show on node right-click
//   .edge       — show on edge right-click
//   .pane       — show on pane (background) right-click
//   .selection  — show on multi-selection right-click
//
// Expression (optional):
//   Evaluates to a config object with positioning offsets:
//   { offsetX: number, offsetY: number }
//
// The parent flowCanvas data exposes:
//   contextMenu.node      — the right-clicked FlowNode  (type 'node')
//   contextMenu.edge      — the right-clicked FlowEdge  (type 'edge')
//   contextMenu.position  — flow-space XYPosition        (type 'pane')
//   contextMenu.nodes     — selected FlowNode[]          (type 'selection')
//   closeContextMenu()    — dismiss and reset
//
// Submenu classes (optional, enables keyboard navigation):
//   .flow-context-submenu          — wrapper for a nested submenu
//   .flow-context-submenu-trigger  — parent element that contains the submenu
//
// Usage:
//   <div x-flow-context-menu.node="{ offsetX: 5, offsetY: 5 }" class="demo-context-menu">
//     <button @click="removeNodes([contextMenu.node.id]); closeContextMenu()">
//       Delete
//     </button>
//   </div>
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowContextMenuDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-context-menu',
    (
      el,
      { modifiers, expression },
      { effect, evaluate, cleanup },
    ) => {
      const type = modifiers[0]; // 'node', 'edge', 'pane', 'selection'
      if (!type) {
        console.warn('[AlpineFlow] x-flow-context-menu requires a type modifier: .node, .edge, .pane, or .selection');
        return;
      }

      const htmlEl = el as HTMLElement;
      const canvasEl = htmlEl.closest('[x-data]') as HTMLElement;
      if (!canvasEl) return;

      const canvas = Alpine.$data(canvasEl) as any;

      // Evaluate expression for offset config
      let offsetX = 0;
      let offsetY = 0;
      if (expression) {
        const config = evaluate(expression) as any;
        offsetX = config?.offsetX ?? 0;
        offsetY = config?.offsetY ?? 0;
      }

      // Set ARIA role on the menu element and make it focusable
      // so keyboard events are captured without highlighting a child item
      htmlEl.setAttribute('role', 'menu');
      htmlEl.setAttribute('tabindex', '-1');

      // Hide initially
      htmlEl.style.display = 'none';

      // Create shared dismiss backdrop (one per directive instance)
      const backdrop = document.createElement('div');
      backdrop.style.cssText = 'position:fixed;inset:0;z-index:4999;display:none;';
      canvasEl.appendChild(backdrop);

      /** Tracks the element that had focus before the menu opened */
      let previousFocus: HTMLElement | null = null;

      /** Viewport edge padding (px) */
      const EDGE_PAD = 4;

      const show = () => {
        previousFocus = document.activeElement as HTMLElement | null;
        const rawX = canvas.contextMenu.x + offsetX;
        const rawY = canvas.contextMenu.y + offsetY;

        // Make visible at initial position so we can measure
        htmlEl.style.display = '';
        htmlEl.style.position = 'fixed';
        htmlEl.style.left = rawX + 'px';
        htmlEl.style.top = rawY + 'px';
        htmlEl.style.zIndex = '5000';

        // Set ARIA roles on direct child interactive elements
        htmlEl.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((child) => {
          child.setAttribute('role', 'menuitem');
          if (!child.hasAttribute('tabindex')) {
            child.setAttribute('tabindex', '-1');
          }
        });

        // Measure and clamp to viewport
        const rect = htmlEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let clampedX = rawX;
        let clampedY = rawY;

        if (rect.right > vw - EDGE_PAD) {
          clampedX = vw - rect.width - EDGE_PAD;
        }
        if (rect.bottom > vh - EDGE_PAD) {
          clampedY = vh - rect.height - EDGE_PAD;
        }
        if (clampedX < EDGE_PAD) {
          clampedX = EDGE_PAD;
        }
        if (clampedY < EDGE_PAD) {
          clampedY = EDGE_PAD;
        }

        htmlEl.style.left = clampedX + 'px';
        htmlEl.style.top = clampedY + 'px';

        backdrop.style.display = '';

        // Focus the menu container so keyboard events are captured
        htmlEl.focus();
      };

      const hide = () => {
        htmlEl.style.display = 'none';
        backdrop.style.display = 'none';
        if (previousFocus && document.contains(previousFocus)) {
          previousFocus.focus();
          previousFocus = null;
        }
      };

      // React to contextMenu state changes
      effect(() => {
        const cm = canvas.contextMenu;
        if (cm.show && cm.type === type) {
          show();
        } else {
          hide();
        }
      });

      // Dismiss on backdrop click or right-click
      backdrop.addEventListener('click', () => canvas.closeContextMenu());
      backdrop.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        canvas.closeContextMenu();
      });

      // Dismiss on page scroll (capture phase to catch all scroll events)
      const onScroll = () => {
        if (canvas.contextMenu.show && canvas.contextMenu.type === type) {
          canvas.closeContextMenu();
        }
      };
      window.addEventListener('scroll', onScroll, true);

      // Keyboard navigation
      const getTopLevelItems = (): HTMLElement[] => {
        return Array.from(htmlEl.querySelectorAll<HTMLElement>(
          ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])',
        ));
      };

      const getSubmenuItems = (submenu: HTMLElement): HTMLElement[] => {
        return Array.from(submenu.querySelectorAll<HTMLElement>(
          'button:not([disabled])',
        ));
      };

      const onMenuKeyDown = (e: KeyboardEvent) => {
        if (!canvas.contextMenu.show || canvas.contextMenu.type !== type) return;
        if (htmlEl.style.display === 'none') return;

        const active = document.activeElement as HTMLElement;

        // Determine if focus is inside a submenu
        const activeSubmenu = active?.closest('.flow-context-submenu') as HTMLElement | null;
        const items = activeSubmenu ? getSubmenuItems(activeSubmenu) : getTopLevelItems();
        if (items.length === 0) return;

        const currentIndex = items.indexOf(active);

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault();
            const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            items[next].focus();
            break;
          }
          case 'ArrowUp': {
            e.preventDefault();
            const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            items[prev].focus();
            break;
          }
          case 'Tab': {
            e.preventDefault();
            if (e.shiftKey) {
              const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
              items[prev].focus();
            } else {
              const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
              items[next].focus();
            }
            break;
          }
          case 'Enter':
          case ' ': {
            e.preventDefault();
            active?.click();
            break;
          }
          case 'ArrowRight': {
            // Open submenu if the active element has one
            if (!activeSubmenu) {
              const submenu = active?.querySelector<HTMLElement>('.flow-context-submenu');
              if (submenu) {
                e.preventDefault();
                const firstBtn = submenu.querySelector<HTMLElement>('button:not([disabled])');
                firstBtn?.focus();
              }
            }
            break;
          }
          case 'ArrowLeft': {
            // Navigate back from submenu to parent trigger
            if (activeSubmenu) {
              e.preventDefault();
              const trigger = activeSubmenu.closest<HTMLElement>('.flow-context-submenu-trigger');
              trigger?.focus();
            }
            break;
          }
        }
      };

      htmlEl.addEventListener('keydown', onMenuKeyDown);

      cleanup(() => {
        backdrop.remove();
        window.removeEventListener('scroll', onScroll, true);
        htmlEl.removeEventListener('keydown', onMenuKeyDown);
      });
    },
  );
}
