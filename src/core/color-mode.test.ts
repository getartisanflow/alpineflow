// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createColorMode } from './color-mode';

function makeContainer(): HTMLElement {
  const el = document.createElement('div');
  return el;
}

describe('createColorMode', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to light mode', () => {
    const el = makeContainer();
    const handle = createColorMode(el);
    expect(handle.resolved).toBe('light');
    expect(el.classList.contains('dark')).toBe(false);
    handle.destroy();
  });

  it('applies dark class for dark mode', () => {
    const el = makeContainer();
    const handle = createColorMode(el, 'dark');
    expect(handle.resolved).toBe('dark');
    expect(el.classList.contains('dark')).toBe(true);
    handle.destroy();
  });

  it('applies light mode — no dark class', () => {
    const el = makeContainer();
    const handle = createColorMode(el, 'light');
    expect(handle.resolved).toBe('light');
    expect(el.classList.contains('dark')).toBe(false);
    handle.destroy();
  });

  it('update() switches from light to dark', () => {
    const el = makeContainer();
    const handle = createColorMode(el, 'light');
    handle.update('dark');
    expect(handle.resolved).toBe('dark');
    expect(el.classList.contains('dark')).toBe(true);
    handle.destroy();
  });

  it('update() switches from dark to light', () => {
    const el = makeContainer();
    const handle = createColorMode(el, 'dark');
    handle.update('light');
    expect(handle.resolved).toBe('light');
    expect(el.classList.contains('dark')).toBe(false);
    handle.destroy();
  });

  it('destroy() removes dark class', () => {
    const el = makeContainer();
    const handle = createColorMode(el, 'dark');
    expect(el.classList.contains('dark')).toBe(true);
    handle.destroy();
    expect(el.classList.contains('dark')).toBe(false);
  });

  it('system mode reads matchMedia and registers listener', () => {
    const el = makeContainer();
    const addListener = vi.fn();
    const removeListener = vi.fn();

    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: addListener,
      removeEventListener: removeListener,
    });

    const handle = createColorMode(el, 'system');
    expect(handle.resolved).toBe('dark');
    expect(el.classList.contains('dark')).toBe(true);
    expect(addListener).toHaveBeenCalledWith('change', expect.any(Function));

    handle.destroy();
    expect(removeListener).toHaveBeenCalled();
  });

  it('system mode responds to matchMedia changes', () => {
    const el = makeContainer();
    let changeCallback: ((e: MediaQueryListEvent) => void) | null = null;

    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: (_event: string, cb: any) => {
        changeCallback = cb;
      },
      removeEventListener: vi.fn(),
    });

    const handle = createColorMode(el, 'system');
    expect(handle.resolved).toBe('light');

    // Simulate OS preference change
    changeCallback!({ matches: true } as MediaQueryListEvent);
    expect(handle.resolved).toBe('dark');
    expect(el.classList.contains('dark')).toBe(true);

    changeCallback!({ matches: false } as MediaQueryListEvent);
    expect(handle.resolved).toBe('light');
    expect(el.classList.contains('dark')).toBe(false);

    handle.destroy();
  });
});
