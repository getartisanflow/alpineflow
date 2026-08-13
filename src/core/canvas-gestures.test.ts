// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isolateCanvasGestures, CANVAS_GESTURES } from './canvas-gestures';

/**
 * The list the canvas chrome swallows, in one place.
 *
 * It was hand-copied into four files — controls, minimap, panel, devtools — and `dblclick` was
 * missing from three of them, which is the bug this closes and the reason the list moved here.
 */
describe('isolateCanvasGestures', () => {
  let container: HTMLElement;
  let overlay: HTMLElement;
  let target: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    overlay = document.createElement('div');
    target = document.createElement('button');
    overlay.appendChild(target);
    container.appendChild(overlay);
    document.body.appendChild(container);
  });

  function fire(type: string): void {
    const event = type === 'wheel'
      ? new WheelEvent(type, { bubbles: true, cancelable: true })
      : new MouseEvent(type, { bubbles: true, cancelable: true });
    target.dispatchEvent(event);
  }

  it.each([...CANVAS_GESTURES])('keeps %s from reaching the canvas underneath', (gesture) => {
    isolateCanvasGestures(overlay);
    const reachedCanvas = vi.fn();
    container.addEventListener(gesture, reachedCanvas);

    fire(gesture);

    expect(reachedCanvas).not.toHaveBeenCalled();
  });

  it('names the double-click that used to be left out', () => {
    // The whole point of collecting the list: the three overlays that hand-copied it kept
    // mousedown, pointerdown and wheel, and let the one bound to the zoom toggle through.
    expect(CANVAS_GESTURES).toContain('dblclick');
  });

  it('leaves the controls inside the overlay working', () => {
    // Stopped on the way OUT, not on the way in — a swallow-everything would disarm the button
    // the gesture landed on, which is the thing these overlays exist to offer.
    isolateCanvasGestures(overlay);
    const onButton = vi.fn();
    const onOverlay = vi.fn();
    target.addEventListener('mousedown', onButton);
    overlay.addEventListener('mousedown', onOverlay);

    fire('mousedown');

    expect(onButton).toHaveBeenCalledTimes(1);
    // Other listeners on the isolating element itself still run: this is stopPropagation, not
    // stopImmediatePropagation.
    expect(onOverlay).toHaveBeenCalledTimes(1);
  });

  it('takes a subset for an overlay that means to let the rest through', () => {
    // The minimap: a drag on it is its own to interpret, and only the double-click zoom is
    // unwanted. Stated as a subset rather than left as a gap in a copied list.
    isolateCanvasGestures(overlay, ['dblclick']);
    const dbl = vi.fn();
    const down = vi.fn();
    container.addEventListener('dblclick', dbl);
    container.addEventListener('mousedown', down);

    fire('dblclick');
    fire('mousedown');

    expect(dbl).not.toHaveBeenCalled();
    expect(down).toHaveBeenCalledTimes(1);
  });

  it('lets go again when the overlay does', () => {
    const release = isolateCanvasGestures(overlay);
    const reachedCanvas = vi.fn();
    container.addEventListener('dblclick', reachedCanvas);

    release();
    fire('dblclick');

    expect(reachedCanvas).toHaveBeenCalledTimes(1);
  });

  it('registers wheel as non-passive, so the overlay may still preventDefault', () => {
    const spy = vi.spyOn(overlay, 'addEventListener');

    isolateCanvasGestures(overlay, ['wheel']);

    expect(spy).toHaveBeenCalledWith('wheel', expect.any(Function), { passive: false });
  });
});
