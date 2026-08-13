// ============================================================================
// Canvas Gesture Isolation
//
// Chrome drawn inside the flow container — the controls, the minimap, a panel,
// the devtools overlay — sits in the bubble path of the container's own pan and
// zoom handlers. A gesture aimed at a button therefore reaches the canvas
// underneath it as well, and the canvas answers a gesture nobody aimed at it.
//
// The list of gestures lives here rather than in each overlay. It was
// hand-copied into four files, and `dblclick` was missing from three of them:
// the copy that names the events once is the one that cannot drift.
// ============================================================================

/**
 * The events the container listens to for pan and zoom.
 *
 * `wheel` and `mousedown`/`pointerdown` reach the pan/zoom behaviour; `dblclick`
 * reaches the double-click zoom, which is bound separately (d3's stepped handler
 * in the default mode, AlpineFlow's own in `'toggle'`) and is the one that used
 * to be left out.
 */
export const CANVAS_GESTURES = ['mousedown', 'pointerdown', 'wheel', 'dblclick'] as const;

export type CanvasGesture = (typeof CANVAS_GESTURES)[number];

/**
 * Keep canvas gestures inside the element they landed on.
 *
 * Stopped on the way OUT of the overlay rather than on the way in, so the
 * buttons inside it keep working: `stopPropagation` ends the bubble, and every
 * listener already reached — including others on this same element — still runs.
 *
 * Pass a subset for an overlay that deliberately lets some gestures through; the
 * minimap does, since a drag on it is its own to interpret and only the
 * double-click zoom is unwanted.
 *
 * Returns a cleanup function that removes the listeners again.
 */
export function isolateCanvasGestures(
  el: HTMLElement,
  gestures: readonly CanvasGesture[] = CANVAS_GESTURES,
): () => void {
  const stop = (e: Event): void => e.stopPropagation();

  // `passive: false` because one of these is `wheel`: a passive listener is a
  // promise not to call preventDefault, and the browser holds callers to it.
  const options: AddEventListenerOptions = { passive: false };

  for (const gesture of gestures) {
    el.addEventListener(gesture, stop, options);
  }

  return () => {
    for (const gesture of gestures) {
      el.removeEventListener(gesture, stop, options);
    }
  };
}
