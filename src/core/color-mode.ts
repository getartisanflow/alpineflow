// ============================================================================
// Color Mode Utility
//
// Per-instance light/dark/system color mode management. Adds/removes the
// `.dark` class on the flow container element, working with the existing
// dark-mode CSS selectors in theme-default.css.
// ============================================================================

export type ColorMode = 'light' | 'dark' | 'system';

export interface ColorModeHandle {
  /** Current resolved mode ('light' | 'dark'). */
  readonly resolved: 'light' | 'dark';
  /** Update the color mode. */
  update(mode: ColorMode): void;
  /** Clean up matchMedia listener. */
  destroy(): void;
}

/** Create a color mode controller for a flow container element. */
export function createColorMode(
  container: HTMLElement,
  initial: ColorMode = 'light',
): ColorModeHandle {
  let resolved: 'light' | 'dark' = initial === 'dark' ? 'dark' : 'light';
  let mediaQuery: MediaQueryList | null = null;
  let listener: ((e: MediaQueryListEvent) => void) | null = null;

  function apply(isDark: boolean): void {
    resolved = isDark ? 'dark' : 'light';
    container.classList.toggle('dark', isDark);
  }

  function update(mode: ColorMode): void {
    // Clean up previous system listener
    if (mediaQuery && listener) {
      mediaQuery.removeEventListener('change', listener);
      mediaQuery = null;
      listener = null;
    }

    if (mode === 'system') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mediaQuery.matches);
      listener = (e) => apply(e.matches);
      mediaQuery.addEventListener('change', listener);
    } else {
      apply(mode === 'dark');
    }
  }

  // Initialize
  update(initial);

  return {
    get resolved() {
      return resolved;
    },
    update,
    destroy() {
      if (mediaQuery && listener) {
        mediaQuery.removeEventListener('change', listener);
      }
      container.classList.remove('dark');
    },
  };
}
