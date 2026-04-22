// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Focused tests for the toggleFullscreen() helper and fullscreenchange
 * wiring. Uses a lightweight stand-in for the canvas orchestrator that
 * mirrors the production code's structure — since the real flowCanvas
 * component can only run inside an Alpine.js lifecycle, we replicate the
 * exact logic under test here.
 */
function makeCanvasStub(container: HTMLElement) {
  const stub = {
    _container: container as HTMLElement | null,
    isFullscreen: false,
    _onFullscreenChange: null as (() => void) | null,

    _initFullscreen(): void {
      this._onFullscreenChange = () => {
        const nowFullscreen = document.fullscreenElement === this._container;
        if (nowFullscreen !== this.isFullscreen) {
          this.isFullscreen = nowFullscreen;
          this._container?.dispatchEvent(new CustomEvent('flow-fullscreen-change', {
            bubbles: true,
            detail: { isFullscreen: nowFullscreen },
          }));
        }
      };
      document.addEventListener('fullscreenchange', this._onFullscreenChange);
    },

    toggleFullscreen(): void {
      if (!this._container) return;
      if (document.fullscreenElement === this._container) {
        document.exitFullscreen?.();
        return;
      }
      const req = this._container.requestFullscreen;
      if (typeof req !== 'function') {
        console.warn('[AlpineFlow] requestFullscreen is not available in this context');
        return;
      }
      Promise.resolve(req.call(this._container)).catch((err: unknown) => {
        console.warn('[AlpineFlow] fullscreen request rejected:', err);
      });
    },

    destroy(): void {
      if (this._onFullscreenChange) {
        document.removeEventListener('fullscreenchange', this._onFullscreenChange);
      }
      this._onFullscreenChange = null;
    },
  };
  return stub;
}

describe('flow-canvas — fullscreen', () => {
  let container: HTMLElement;
  let requestFullscreenMock: ReturnType<typeof vi.fn>;
  let exitFullscreenMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    requestFullscreenMock = vi.fn(() => Promise.resolve());
    exitFullscreenMock = vi.fn(() => Promise.resolve());

    // Patch prototype so every element (incl. our container) has these methods
    (HTMLElement.prototype as any).requestFullscreen = requestFullscreenMock;
    (document as any).exitFullscreen = exitFullscreenMock;
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
      writable: true,
    });
  });

  afterEach(() => {
    container.remove();
    delete (HTMLElement.prototype as any).requestFullscreen;
    delete (document as any).exitFullscreen;
  });

  it('toggleFullscreen() calls requestFullscreen on the container when not fullscreen', () => {
    const canvas = makeCanvasStub(container);
    canvas.toggleFullscreen();
    expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    expect(exitFullscreenMock).not.toHaveBeenCalled();
  });

  it('toggleFullscreen() calls exitFullscreen when the container is the fullscreen element', () => {
    const canvas = makeCanvasStub(container);
    (document as any).fullscreenElement = container;
    canvas.toggleFullscreen();
    expect(exitFullscreenMock).toHaveBeenCalledTimes(1);
    expect(requestFullscreenMock).not.toHaveBeenCalled();
  });

  it('toggleFullscreen() warns and no-ops when requestFullscreen is not available', () => {
    delete (HTMLElement.prototype as any).requestFullscreen;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const canvas = makeCanvasStub(container);
    canvas.toggleFullscreen();
    expect(warnSpy).toHaveBeenCalledWith(
      '[AlpineFlow] requestFullscreen is not available in this context',
    );
    warnSpy.mockRestore();
  });

  it('toggleFullscreen() warns when requestFullscreen rejects', async () => {
    const rejection = new Error('denied');
    (HTMLElement.prototype as any).requestFullscreen = vi.fn(() => Promise.reject(rejection));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const canvas = makeCanvasStub(container);
    canvas.toggleFullscreen();
    await new Promise((r) => setTimeout(r, 0));
    expect(warnSpy).toHaveBeenCalledWith('[AlpineFlow] fullscreen request rejected:', rejection);
    warnSpy.mockRestore();
  });

  it('fullscreenchange listener updates isFullscreen and fires flow-fullscreen-change', () => {
    const canvas = makeCanvasStub(container);
    canvas._initFullscreen();

    const received: Array<{ isFullscreen: boolean }> = [];
    container.addEventListener('flow-fullscreen-change', (e: Event) => {
      received.push((e as CustomEvent).detail);
    });

    // Simulate browser making our container fullscreen
    (document as any).fullscreenElement = container;
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(canvas.isFullscreen).toBe(true);
    expect(received).toEqual([{ isFullscreen: true }]);

    // Simulate exit
    (document as any).fullscreenElement = null;
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(canvas.isFullscreen).toBe(false);
    expect(received).toEqual([{ isFullscreen: true }, { isFullscreen: false }]);

    canvas.destroy();
  });

  it('fullscreenchange listener ignores events when another element is fullscreen', () => {
    const canvas = makeCanvasStub(container);
    canvas._initFullscreen();

    const other = document.createElement('div');
    (document as any).fullscreenElement = other;
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(canvas.isFullscreen).toBe(false);

    canvas.destroy();
  });

  it('destroy() removes the fullscreenchange listener', () => {
    const canvas = makeCanvasStub(container);
    canvas._initFullscreen();
    canvas.destroy();

    (document as any).fullscreenElement = container;
    document.dispatchEvent(new Event('fullscreenchange'));
    // Listener is gone — flag should not update
    expect(canvas.isFullscreen).toBe(false);
  });
});
