// ============================================================================
// Auto-Pan Module
//
// Automatically pans the viewport when the pointer is near the edge of the
// canvas container during a drag operation (node drag or connection drag).
// Uses requestAnimationFrame for smooth, continuous panning.
// ============================================================================

/** Distance in pixels from the container edge where auto-pan activates */
const EDGE_THRESHOLD = 40;

/**
 * Compute the auto-pan delta for a single frame based on pointer proximity
 * to container edges. Returns { dx, dy } where each value is 0 when the
 * pointer is outside the detection zone, and scales linearly as the pointer
 * moves closer to the edge.
 */
export function getAutoPanDelta(
  pointerX: number,
  pointerY: number,
  containerRect: DOMRect,
  speed: number,
): { dx: number; dy: number } {
  let dx = 0;
  let dy = 0;

  const distLeft = pointerX - containerRect.left;
  const distRight = containerRect.right - pointerX;
  const distTop = pointerY - containerRect.top;
  const distBottom = containerRect.bottom - pointerY;

  if (distLeft < EDGE_THRESHOLD && distLeft >= 0) {
    dx = -speed * (1 - distLeft / EDGE_THRESHOLD);
  } else if (distRight < EDGE_THRESHOLD && distRight >= 0) {
    dx = speed * (1 - distRight / EDGE_THRESHOLD);
  }

  if (distTop < EDGE_THRESHOLD && distTop >= 0) {
    dy = -speed * (1 - distTop / EDGE_THRESHOLD);
  } else if (distBottom < EDGE_THRESHOLD && distBottom >= 0) {
    dy = speed * (1 - distBottom / EDGE_THRESHOLD);
  }

  return { dx, dy };
}

export interface AutoPanInstance {
  /** Start the rAF pan loop */
  start(): void;
  /** Stop the rAF pan loop */
  stop(): void;
  /** Feed the latest pointer position (client coordinates) */
  updatePointer(clientX: number, clientY: number): void;
  /** Stop and clean up */
  destroy(): void;
}

export interface AutoPanOptions {
  /** The container element to read bounds from each frame */
  container: HTMLElement;
  /** Speed multiplier (default 15) */
  speed: number;
  /** Called each frame with the pixel delta to apply.
   *  Return `true` to signal that a boundary was hit and auto-pan should stop. */
  onPan: (dx: number, dy: number) => void | boolean;
  /** Return true to prevent auto-pan from activating (e.g. during animation lock). */
  isLocked?: () => boolean;
}

/**
 * Create an auto-pan instance that drives a rAF loop. Call `updatePointer()`
 * on every pointermove/drag event; the loop reads the latest position each
 * frame and invokes `onPan` when the pointer is inside the edge zone.
 */
export function createAutoPan(options: AutoPanOptions): AutoPanInstance {
  const { container, speed, onPan } = options;

  let rafId: number | null = null;
  let pointerX = 0;
  let pointerY = 0;
  let running = false;

  function loop() {
    if (!running) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const { dx, dy } = getAutoPanDelta(pointerX, pointerY, rect, speed);

    if (dx !== 0 || dy !== 0) {
      const hitBoundary = onPan(dx, dy);
      if (hitBoundary === true) {
        running = false;
        rafId = null;
        return;
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  return {
    start() {
      if (running || options.isLocked?.()) {
        return;
      }
      running = true;
      rafId = requestAnimationFrame(loop);
    },

    stop() {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },

    updatePointer(clientX: number, clientY: number) {
      pointerX = clientX;
      pointerY = clientY;
    },

    destroy() {
      this.stop();
    },
  };
}
