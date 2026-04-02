// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { attachLongPress } from './long-press';

describe('attachLongPress', () => {
  let el: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    vi.useRealTimers();
    el.remove();
  });

  it('fires callback after duration', () => {
    const callback = vi.fn();
    attachLongPress(el, callback);

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 50, clientY: 50 }));
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledOnce();
  });

  it('cancels if pointer moves beyond threshold', () => {
    const callback = vi.fn();
    attachLongPress(el, callback);

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 50, clientY: 50 }));
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 65, clientY: 50 }));
    vi.advanceTimersByTime(500);

    expect(callback).not.toHaveBeenCalled();
  });

  it('cancels on pointerup before duration', () => {
    const callback = vi.fn();
    attachLongPress(el, callback);

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 50, clientY: 50 }));
    vi.advanceTimersByTime(200);
    document.dispatchEvent(new PointerEvent('pointerup'));
    vi.advanceTimersByTime(300);

    expect(callback).not.toHaveBeenCalled();
  });

  it('cancels on pointercancel', () => {
    const callback = vi.fn();
    attachLongPress(el, callback);

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 50, clientY: 50 }));
    document.dispatchEvent(new PointerEvent('pointercancel'));
    vi.advanceTimersByTime(500);

    expect(callback).not.toHaveBeenCalled();
  });

  it('returns cleanup function that removes listeners', () => {
    const callback = vi.fn();
    const cleanup = attachLongPress(el, callback);

    cleanup();

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 50, clientY: 50 }));
    vi.advanceTimersByTime(500);

    expect(callback).not.toHaveBeenCalled();
  });

  it('passes the original event to callback', () => {
    const callback = vi.fn();
    attachLongPress(el, callback);

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 42, clientY: 99 }));
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledOnce();
    const event = callback.mock.calls[0][0] as PointerEvent;
    expect(event.clientX).toBe(42);
    expect(event.clientY).toBe(99);
  });
});
