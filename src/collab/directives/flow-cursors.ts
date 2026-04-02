import type { Alpine } from 'alpinejs';
import type { CollabAwarenessState } from '../types';
import { collabStore } from '../store';

export const CURSOR_CLASS = 'flow-collab-cursor';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CURSOR_PATH = 'M0.5 0.5L15.5 11.5L8 12.5L5 21.5L0.5 0.5Z';

function createCursorElement(clientId: string, user: { name: string; color: string }): HTMLElement {
  const el = document.createElement('div');
  el.className = CURSOR_CLASS;
  el.dataset.clientId = clientId;
  el.style.position = 'absolute';
  el.style.left = '0';
  el.style.top = '0';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '10000';
  el.style.transition = 'transform 0.1s ease-out';
  el.style.willChange = 'transform';

  // Cursor arrow as inline SVG so fill color works (img + currentColor doesn't)
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '22');
  svg.setAttribute('viewBox', '0 0 16 22');
  svg.setAttribute('fill', 'none');
  svg.style.display = 'block';
  svg.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))';

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CURSOR_PATH);
  path.setAttribute('fill', user.color);
  path.setAttribute('stroke', 'white');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linejoin', 'round');
  path.classList.add('flow-collab-cursor-arrow');
  svg.appendChild(path);
  el.appendChild(svg);

  // Name label
  const label = document.createElement('span');
  label.className = 'flow-collab-cursor-label';
  label.textContent = user.name;
  label.style.position = 'absolute';
  label.style.left = '14px';
  label.style.top = '16px';
  label.style.background = user.color;
  label.style.color = 'white';
  label.style.padding = '2px 8px';
  label.style.borderRadius = '4px';
  label.style.fontSize = '11px';
  label.style.fontWeight = '500';
  label.style.whiteSpace = 'nowrap';
  label.style.lineHeight = '1.4';
  label.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
  el.appendChild(label);

  return el;
}

/**
 * Update cursor element colors when the user's color changes.
 */
function updateCursorColor(el: HTMLElement, color: string): void {
  const arrow = el.querySelector('.flow-collab-cursor-arrow');
  if (arrow) arrow.setAttribute('fill', color);
  const label = el.querySelector('.flow-collab-cursor-label') as HTMLElement | null;
  if (label) label.style.background = color;
}

/**
 * Render remote user cursors into a container element.
 * Reuses existing DOM elements when possible to avoid layout thrash.
 */
export function renderCursors(
  container: HTMLElement,
  remoteStates: Map<number, CollabAwarenessState>,
  localZoom: number,
): void {
  const existingEls = new Map<string, HTMLElement>();
  container.querySelectorAll(`.${CURSOR_CLASS}`).forEach(el => {
    existingEls.set((el as HTMLElement).dataset.clientId!, el as HTMLElement);
  });

  const activeIds = new Set<string>();

  remoteStates.forEach((state, clientId) => {
    if (!state.cursor) {
      return;
    }

    const id = String(clientId);
    activeIds.add(id);
    let el = existingEls.get(id);

    if (!el) {
      el = createCursorElement(id, state.user);
      container.appendChild(el);
    } else {
      updateCursorColor(el, state.user.color);
    }

    el.style.transform = `translate(${state.cursor.x}px, ${state.cursor.y}px)`;
  });

  // Remove cursors for disconnected users
  existingEls.forEach((el, id) => {
    if (!activeIds.has(id)) {
      el.remove();
    }
  });
}

/**
 * Register the x-flow-cursors directive.
 * Place inside x-flow-viewport to render remote user cursors.
 *
 * Handles async collab init — polls until collabStore entry is available,
 * then subscribes to awareness changes for direct DOM cursor rendering.
 */
export function registerFlowCursorsDirective(Alpine: Alpine): void {
  Alpine.directive('flow-cursors', (el, {}, { cleanup }) => {
    const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
    if (!canvasEl) return;

    const canvas = Alpine.$data(canvasEl) as any;
    let unsubscribe: (() => void) | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;
    let destroyed = false;

    function startRendering(): boolean {
      const entry = collabStore.get(canvasEl);
      if (!entry?.awareness) return false;

      const awareness = entry.awareness;

      function render(): void {
        const states = awareness.getRemoteStates();
        const zoom = canvas.viewport?.zoom ?? 1;
        renderCursors(el as HTMLElement, states, zoom);
      }

      // Render once immediately, then on every awareness change
      render();
      unsubscribe = awareness.onChange(render);
      return true;
    }

    // Collab objects are stored asynchronously (after dynamic import).
    // Try immediately, then poll until available.
    if (!startRendering()) {
      pollId = setInterval(() => {
        if (destroyed || startRendering()) {
          clearInterval(pollId!);
          pollId = null;
        }
      }, 50);
    }

    cleanup(() => {
      destroyed = true;
      if (pollId) clearInterval(pollId);
      if (unsubscribe) unsubscribe();
      el.querySelectorAll(`.${CURSOR_CLASS}`).forEach(c => c.remove());
    });
  });
}
