// ============================================================================
// Long-Press Detection Utility
//
// Attaches pointer event listeners to detect a long-press gesture.
// Fires a callback after a configurable delay. Cancels if the finger
// moves beyond a threshold or lifts early.
// ============================================================================

export interface LongPressOptions {
  /** Delay before firing in milliseconds. Default: 500 */
  duration?: number;
  /** Max movement in pixels before cancel. Default: 10 */
  moveThreshold?: number;
}

/**
 * Attach long-press detection to an element.
 * Returns a cleanup function that removes all listeners.
 */
export function attachLongPress(
  el: HTMLElement,
  callback: (event: PointerEvent) => void,
  options: LongPressOptions = {},
): () => void {
  const duration = options.duration ?? 500;
  const moveThreshold = options.moveThreshold ?? 10;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let startX = 0;
  let startY = 0;
  let startEvent: PointerEvent | null = null;

  function cancel(): void {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    startEvent = null;
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', cancel);
    document.removeEventListener('pointercancel', cancel);
  }

  function onMove(e: PointerEvent): void {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (dx * dx + dy * dy > moveThreshold * moveThreshold) {
      cancel();
    }
  }

  function onDown(e: PointerEvent): void {
    cancel();
    startX = e.clientX;
    startY = e.clientY;
    startEvent = e;

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', cancel);
    document.addEventListener('pointercancel', cancel);

    timer = setTimeout(() => {
      const evt = startEvent;
      cancel();
      if (evt) {
        callback(evt);
      }
    }, duration);
  }

  el.addEventListener('pointerdown', onDown);

  return () => {
    cancel();
    el.removeEventListener('pointerdown', onDown);
  };
}
