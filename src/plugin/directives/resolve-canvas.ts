// ============================================================================
// resolveCanvasEl — shared canvas resolver for flow directives (WS2)
//
// Directives like x-flow-snapshot / x-flow-action / x-flow-edge-toolbar used to
// resolve their canvas with a bare `el.closest('[data-flow-canvas]')`, so they
// silently no-op when placed OUTSIDE the canvas element — exactly the
// toolbar/sidebar layout. This resolver adds an escape hatch and a single-canvas
// fallback while keeping `closest()` as the middle path (so in-canvas usage is
// unchanged).
//
// Resolution order:
//   1. `data-flow-target="<selector>"` on the host or any ancestor (so a toolbar
//      wrapper can set it once) → `document.querySelector(selector)`.
//   2. else `el.closest('[data-flow-canvas]')` (host is inside a canvas).
//   3. else if EXACTLY ONE `[data-flow-canvas]` exists in the document, use it;
//      0 or >1 → return null and `console.warn` once (dev aid).
// ============================================================================

let warned = false;

/** Reset the warn-once latch. Exported for tests only. */
export function _resetResolveCanvasWarned(): void {
  warned = false;
}

/**
 * Resolve the canvas element (`[data-flow-canvas]`) for a directive host `el`,
 * or `null` when it cannot be determined unambiguously.
 */
export function resolveCanvasEl(el: HTMLElement): HTMLElement | null {
  // 1. Explicit target — nearest ancestor (including `el`) carrying it.
  const targetHost = el.closest('[data-flow-target]') as HTMLElement | null;
  if (targetHost) {
    const selector = targetHost.getAttribute('data-flow-target');
    if (selector) {
      const target = document.querySelector(selector) as HTMLElement | null;
      if (target) {
        return target;
      }
    }
  }

  // 2. Host lives inside a canvas — the original behaviour.
  const inside = el.closest('[data-flow-canvas]') as HTMLElement | null;
  if (inside) {
    return inside;
  }

  // 3. Single-canvas fallback.
  const all = document.querySelectorAll('[data-flow-canvas]');
  if (all.length === 1) {
    return all[0] as HTMLElement;
  }

  if (!warned) {
    warned = true;
    console.warn(
      '[alpineflow] Could not resolve a canvas for a flow directive placed outside the canvas element. ' +
        'Add `data-flow-target="<selector>"` pointing at the canvas, or ensure exactly one canvas is present in the document.',
    );
  }
  return null;
}
