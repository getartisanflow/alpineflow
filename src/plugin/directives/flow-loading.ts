// ============================================================================
// x-flow-loading Directive
//
// Shows a loading overlay while the canvas is initializing or the user has
// set loading: true. If the element has no children, a default pulsing
// node indicator is injected.
//
// Usage:
//   <div x-flow-loading></div>                    <!-- default indicator -->
//   <div x-flow-loading>Custom spinner...</div>   <!-- custom content -->
//   <div x-flow-loading.fade></div>               <!-- fade out transition -->
// ============================================================================

import type { Alpine } from 'alpinejs';

function createDefaultIndicator(text?: string): HTMLElement {
  const indicator = document.createElement('div');
  indicator.className = 'flow-loading-indicator';

  const nodeEl = document.createElement('div');
  nodeEl.className = 'flow-loading-indicator-node';

  const textEl = document.createElement('div');
  textEl.className = 'flow-loading-indicator-text';
  textEl.textContent = text ?? 'Loading\u2026';

  indicator.appendChild(nodeEl);
  indicator.appendChild(textEl);
  return indicator;
}

export function registerFlowLoadingDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-loading',
    (el, { modifiers }, { effect, cleanup }) => {
      const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
      if (!canvasEl) return;

      const canvas = Alpine.$data(canvasEl) as any;
      if (!canvas) return;

      // Add overlay class
      el.classList.add('flow-loading-overlay');

      // Inject default indicator if no custom content
      const hasCustomContent = el.childElementCount > 0 || el.textContent!.trim().length > 0;
      if (!hasCustomContent) {
        el.appendChild(createDefaultIndicator(canvas._loadingText));
      }

      const useFade = modifiers.includes('fade');
      if (useFade) {
        el.classList.add('flow-loading-fade');
      }

      canvasEl.setAttribute('data-flow-loading-directive', '');

      let pendingTransitionEnd: ((e: Event) => void) | null = null;

      effect(() => {
        const loading = canvas.isLoading;

        if (loading) {
          el.style.display = 'flex';
          if (useFade) {
            el.classList.remove('flow-loading-fade-out');
            if (pendingTransitionEnd) {
              el.removeEventListener('transitionend', pendingTransitionEnd);
              pendingTransitionEnd = null;
            }
          }
        } else {
          if (useFade) {
            if (pendingTransitionEnd) {
              el.removeEventListener('transitionend', pendingTransitionEnd);
            }
            el.classList.add('flow-loading-fade-out');
            const onEnd = () => {
              el.style.display = 'none';
              el.removeEventListener('transitionend', onEnd);
              pendingTransitionEnd = null;
            };
            pendingTransitionEnd = onEnd;
            el.addEventListener('transitionend', onEnd);
          } else {
            el.style.display = 'none';
          }
        }
      });

      cleanup(() => {
        if (pendingTransitionEnd) {
          el.removeEventListener('transitionend', pendingTransitionEnd);
          pendingTransitionEnd = null;
        }
        canvasEl.removeAttribute('data-flow-loading-directive');
        el.style.display = '';
        el.classList.remove('flow-loading-overlay', 'flow-loading-fade', 'flow-loading-fade-out');
      });
    },
  );
}
