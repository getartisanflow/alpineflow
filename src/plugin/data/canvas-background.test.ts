// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { realCanvas } from './__real-canvas-harness';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('background gap cache', () => {
  it('resolves the CSS gap variable at most once across repeated backgroundStyle calls', () => {
    const canvas = realCanvas({ background: 'dots' });
    canvas._container = document.createElement('div');
    // jsdom returns '' for custom properties; return a parseable value so the
    // cache populates and the caching contract is what's under test.
    const spy = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '24px',
    } as unknown as CSSStyleDeclaration);

    canvas.backgroundStyle();
    canvas.backgroundStyle();
    canvas.backgroundStyle();

    expect(spy.mock.calls.length).toBeLessThanOrEqual(1);
  });

  it('re-reads the gap after the cache is invalidated', () => {
    const canvas = realCanvas({ background: 'dots' });
    canvas._container = document.createElement('div');
    const spy = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '24px',
    } as unknown as CSSStyleDeclaration);

    canvas.backgroundStyle(); // reads + caches (1)
    canvas._bgGapCache = null; // theme/colorMode change would invalidate here
    canvas.backgroundStyle(); // reads again (2)

    expect(spy.mock.calls.length).toBe(2);
  });

  it('does not read getComputedStyle when an explicit backgroundGap is configured', () => {
    const canvas = realCanvas({ background: 'dots', backgroundGap: 30 });
    canvas._container = document.createElement('div');
    const spy = vi.spyOn(window, 'getComputedStyle');

    canvas.backgroundStyle();
    canvas.backgroundStyle();

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('_applyBackground redundant-write skipping', () => {
  it('writes backgroundImage only when it actually changes', () => {
    const canvas = realCanvas({ background: 'dots' });
    const el = document.createElement('div');
    canvas._container = el;
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '20px',
    } as unknown as CSSStyleDeclaration);

    // Instrument the backgroundImage setter to count writes.
    let stored = '';
    let writes = 0;
    Object.defineProperty(el.style, 'backgroundImage', {
      configurable: true,
      get: () => stored,
      set: (v: string) => {
        stored = v;
        writes++;
      },
    });

    canvas._applyBackground(); // first apply → one write
    expect(writes).toBe(1);
    const firstImage = stored;
    expect(firstImage).not.toBe('');

    // Pan/zoom changes backgroundSize/position but not the gradient image itself.
    canvas.viewport.x = 100;
    canvas.viewport.zoom = 1.5;
    canvas._applyBackground(); // image identical → no second write

    expect(writes).toBe(1);
    expect(stored).toBe(firstImage);
  });
});
