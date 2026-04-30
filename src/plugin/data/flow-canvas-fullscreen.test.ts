// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Focused tests for the toggleFullscreen() helper and fullscreenchange
 * wiring. Uses a lightweight stand-in for the canvas orchestrator that
 * mirrors the production code's structure — since the real flowCanvas
 * component can only run inside an Alpine.js lifecycle, we replicate the
 * exact logic under test here.
 */
type FullscreenCfg = string | HTMLElement | ((container: HTMLElement) => HTMLElement | null) | undefined;

function makeCanvasStub(container: HTMLElement, cfg: { fullscreenTarget?: FullscreenCfg } = {}) {
  const stub = {
    _container: container as HTMLElement | null,
    _config: cfg as { fullscreenTarget?: FullscreenCfg },
    _fullscreenTarget: null as HTMLElement | null,
    isFullscreen: false,
    _onFullscreenChange: null as (() => void) | null,

    _initFullscreen(): void {
      this._onFullscreenChange = () => {
        const expected = this._fullscreenTarget ?? this._container;
        const nowFullscreen = document.fullscreenElement === expected;
        if (nowFullscreen !== this.isFullscreen) {
          this.isFullscreen = nowFullscreen;
          this._container?.dispatchEvent(new CustomEvent('flow-fullscreen-change', {
            bubbles: true,
            detail: { isFullscreen: nowFullscreen },
          }));
        }
        if (!nowFullscreen) {
          this._fullscreenTarget = null;
        }
      };
      document.addEventListener('fullscreenchange', this._onFullscreenChange);
    },

    _resolveFullscreenTarget(): HTMLElement | null {
      if (!this._container) return null;
      const target = this._config?.fullscreenTarget;
      if (!target) return this._container;
      if (typeof target === 'string') {
        const ancestor = this._container.closest(target) as HTMLElement | null;
        if (ancestor) return ancestor;
        const first = document.querySelector(target) as HTMLElement | null;
        if (first) return first;
        console.warn(`[AlpineFlow] fullscreenTarget selector "${target}" did not match; falling back to canvas container.`);
        return this._container;
      }
      if (target instanceof HTMLElement) return target;
      if (typeof target === 'function') {
        try {
          const resolved = target(this._container);
          if (resolved instanceof HTMLElement) return resolved;
        } catch (err) {
          console.warn('[AlpineFlow] fullscreenTarget resolver threw:', err);
        }
      }
      return this._container;
    },

    toggleFullscreen(): void {
      if (!this._container) return;
      const target = this._resolveFullscreenTarget();
      if (!target) return;
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
        return;
      }
      const req = target.requestFullscreen;
      if (typeof req !== 'function') {
        console.warn('[AlpineFlow] requestFullscreen is not available in this context');
        return;
      }
      this._fullscreenTarget = target;
      Promise.resolve(req.call(target)).catch((err: unknown) => {
        console.warn('[AlpineFlow] fullscreen request rejected:', err);
        this._fullscreenTarget = null;
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

  // ────────────────────────────────────────────────────────────────────────
  // Configurable fullscreenTarget
  // ────────────────────────────────────────────────────────────────────────

  it('uses _container by default when fullscreenTarget is not configured', () => {
    const canvas = makeCanvasStub(container);
    canvas.toggleFullscreen();
    expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    // `this` at call-time = the resolved target — here, the container.
    expect(requestFullscreenMock.mock.contexts[0]).toBe(container);
  });

  it('resolves fullscreenTarget: string via closest() to an ancestor', () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    wrapper.appendChild(container.parentNode!.removeChild(container));
    document.body.appendChild(wrapper);

    const canvas = makeCanvasStub(container, { fullscreenTarget: '.wrapper' });
    canvas.toggleFullscreen();

    expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    expect(requestFullscreenMock.mock.contexts[0]).toBe(wrapper);
    wrapper.remove();
  });

  it('resolves fullscreenTarget: string via querySelector fallback when no ancestor matches', () => {
    const sibling = document.createElement('div');
    sibling.className = 'target';
    document.body.appendChild(sibling);

    const canvas = makeCanvasStub(container, { fullscreenTarget: '.target' });
    canvas.toggleFullscreen();

    expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    expect(requestFullscreenMock.mock.contexts[0]).toBe(sibling);
    sibling.remove();
  });

  it('accepts fullscreenTarget: HTMLElement directly', () => {
    const custom = document.createElement('section');
    document.body.appendChild(custom);

    const canvas = makeCanvasStub(container, { fullscreenTarget: custom });
    canvas.toggleFullscreen();

    expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    expect(requestFullscreenMock.mock.contexts[0]).toBe(custom);
    custom.remove();
  });

  it('accepts fullscreenTarget: (container) => HTMLElement function', () => {
    const custom = document.createElement('section');
    document.body.appendChild(custom);
    const resolver = vi.fn(() => custom);

    const canvas = makeCanvasStub(container, { fullscreenTarget: resolver });
    canvas.toggleFullscreen();

    expect(resolver).toHaveBeenCalledWith(container);
    expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    expect(requestFullscreenMock.mock.contexts[0]).toBe(custom);
    custom.remove();
  });

  it('falls back to _container with console.warn when selector does not match anywhere', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const canvas = makeCanvasStub(container, { fullscreenTarget: '.no-such-thing' });
    canvas.toggleFullscreen();

    expect(warnSpy).toHaveBeenCalledWith(
      '[AlpineFlow] fullscreenTarget selector ".no-such-thing" did not match; falling back to canvas container.',
    );
    expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    expect(requestFullscreenMock.mock.contexts[0]).toBe(container);
    warnSpy.mockRestore();
  });

  it('fullscreenchange listener tracks the resolved target (not container) when fullscreenTarget is set', () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    wrapper.appendChild(container.parentNode!.removeChild(container));
    document.body.appendChild(wrapper);

    const canvas = makeCanvasStub(container, { fullscreenTarget: '.wrapper' });
    canvas._initFullscreen();
    canvas.toggleFullscreen();

    // Browser makes the wrapper fullscreen — canvas.isFullscreen should flip.
    (document as any).fullscreenElement = wrapper;
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(canvas.isFullscreen).toBe(true);

    // Exit fullscreen — flag should flip back and resolved target should clear.
    (document as any).fullscreenElement = null;
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(canvas.isFullscreen).toBe(false);
    expect(canvas._fullscreenTarget).toBe(null);

    canvas.destroy();
    wrapper.remove();
  });
});
