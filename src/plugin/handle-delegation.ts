// ============================================================================
// Handle pointer-event delegation
//
// WHY: every handle used to attach its own `pointerdown` listener at directive
// init. A Draftsman-scale schema graph has ~5,000 handles, so that was ~5,000
// listeners paid at mount and re-paid on every schema row re-stamp. This module
// installs ONE `pointerdown` listener per canvas that can start the same gesture
// for any handle, resolving it with `closest('[data-flow-handle-type]')`.
//
// SCOPE: pointerdown ONLY. `pointerenter` / `pointerleave` / `click` / `keydown`
// stay per-handle — the directive still runs, still stamps datasets, expandos
// and classes, and still owns keyboard/a11y. It just skips the pointerdown
// registration. Opt out with `delegatedHandleEvents: false`.
//
// ── WHERE THIS LISTENER SITS, AND WHY IT MATTERS ────────────────────────────
//
// It goes on `.flow-viewport` in the CAPTURE phase. Both halves of that are
// load-bearing; every other placement regresses something.
//
// CAPTURE, not bubble.
//   Two things sit on ANCESTORS of a handle and listen for pointerdown in the
//   BUBBLE phase: d3-drag's node drag (`core/drag.ts`, bound on the node) and
//   the schema row reorder (`schema/reorderable.ts:249`, bound on the row).
//   Neither excludes handles. The only reason pressing a handle doesn't also
//   drag the node or reorder the row is that the handle's own listener used to
//   sit DEEPER in the tree, fire first, and call `stopPropagation()`. A delegated
//   listener on an ancestor in the bubble phase would fire AFTER both of them and
//   that suppression would be gone. In the capture phase it fires BEFORE them, so
//   `stopPropagation()` lands exactly where it used to.
//
// `.flow-viewport`, not `.flow-container`.
//   Seven whiteboard tools (`flow-freehand`, `flow-eraser`, `flow-circle-draw`,
//   `flow-rectangle-draw`, `flow-arrow-draw`, `flow-highlighter`,
//   `flow-text-tool`) each do `containerEl.addEventListener('pointerdown', …,
//   true)` and call `stopImmediatePropagation()`, which is what makes handles
//   inert while a draw tool is active. They attach LAZILY, when the tool
//   activates — i.e. AFTER a listener we register at canvas init. Had we attached
//   on the container in capture too, ordering would degrade to registration order
//   and we would win, starting a connect-drag in draw mode. Attaching one level
//   down means the tools' listener is on a strict ANCESTOR in the same phase, so
//   it still runs first and its `stopImmediatePropagation()` keeps us from ever
//   firing. Same suppression chain as before, through the same DOM mechanism.
//
// Ordering against `flow-node.ts`'s easy-connect (node, capture) is harmless:
// that handler bails immediately on handle presses.
// ============================================================================

import { startHandlePointerInteraction } from './directives/flow-handle';

/**
 * Install the single delegated `pointerdown` listener for one canvas.
 *
 * @param rootEl  Element to attach to — `.flow-viewport` in production (see the
 *                block above). Also acts as the containment boundary: a press on
 *                a handle outside it is ignored.
 * @param canvas  The canvas that owns `rootEl`. Passed straight through to the
 *                gesture, replacing the directive's per-press `Alpine.$data()`
 *                lookup with a value we already hold.
 * @returns       Teardown that removes the listener.
 */
export function installHandleDelegation(
  rootEl: HTMLElement,
  canvas: any,
): () => void {
  // The canvas element this listener speaks for. A handle whose nearest [x-data]
  // is some OTHER scope (a nested canvas mounted inside our viewport) belongs to
  // that scope's listener, not ours — this reproduces the directive's own
  // `el.closest('[x-data]')` canvas resolution as an ownership check.
  const canvasEl = rootEl.closest('[x-data]');

  const onPointerDown = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    const handleEl = target?.closest?.('[data-flow-handle-type]') as HTMLElement | null;
    if (!handleEl) return;
    if (!rootEl.contains(handleEl)) return;
    if (canvasEl && handleEl.closest('[x-data]') !== canvasEl) return;

    startHandlePointerInteraction(handleEl, canvas, event as PointerEvent);
  };

  rootEl.addEventListener('pointerdown', onPointerDown, true);
  return () => rootEl.removeEventListener('pointerdown', onPointerDown, true);
}
