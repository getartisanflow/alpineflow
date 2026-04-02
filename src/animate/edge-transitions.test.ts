import { describe, it, expect, vi } from 'vitest';
import {
  drawInOffset,
  drawOutOffset,
  fadeOpacity,
  applyDrawTransition,
  cleanupDrawTransition,
  applyFadeTransition,
  cleanupFadeTransition,
} from './edge-transitions';

// ── Mock helpers ────────────────────────────────────────────────────────────

function mockPathElement(totalLength: number) {
  const styles: Record<string, string> = {};
  const attrs: Record<string, string> = {};
  return {
    getTotalLength: vi.fn(() => totalLength),
    getAttribute: vi.fn((name: string) => attrs[name] ?? null),
    setAttribute: vi.fn((name: string, value: string) => { attrs[name] = value; }),
    removeAttribute: vi.fn((name: string) => { delete attrs[name]; }),
    style: {
      get strokeDasharray() { return styles['stroke-dasharray'] ?? ''; },
      set strokeDasharray(v: string) { styles['stroke-dasharray'] = v; },
      get strokeDashoffset() { return styles['stroke-dashoffset'] ?? ''; },
      set strokeDashoffset(v: string) { styles['stroke-dashoffset'] = v; },
      get opacity() { return styles.opacity ?? ''; },
      set opacity(v: string) { styles.opacity = v; },
      setProperty(name: string, value: string) { styles[name] = value; },
      removeProperty(name: string) { delete styles[name]; },
    },
    _styles: styles,
    _attrs: attrs,
  } as unknown as SVGPathElement & { _styles: Record<string, string>; _attrs: Record<string, string> };
}

function mockElement() {
  const styles: Record<string, string> = {};
  return {
    style: {
      get opacity() { return styles.opacity ?? ''; },
      set opacity(v: string) { styles.opacity = v; },
      removeProperty(name: string) { delete styles[name]; },
    },
    _styles: styles,
  } as unknown as SVGElement & { _styles: Record<string, string> };
}

// ── Pure calculations ───────────────────────────────────────────────────────

describe('drawInOffset', () => {
  it('returns totalLength at progress 0 (fully hidden)', () => {
    expect(drawInOffset(200, 0)).toBe(200);
  });

  it('returns 0 at progress 1 (fully revealed)', () => {
    expect(drawInOffset(200, 1)).toBe(0);
  });

  it('returns half at progress 0.5', () => {
    expect(drawInOffset(200, 0.5)).toBe(100);
  });

  it('handles zero-length paths', () => {
    expect(drawInOffset(0, 0.5)).toBe(0);
  });
});

describe('drawOutOffset', () => {
  it('returns 0 at progress 0 (fully visible)', () => {
    expect(drawOutOffset(200, 0)).toBe(0);
  });

  it('returns totalLength at progress 1 (fully erased)', () => {
    expect(drawOutOffset(200, 1)).toBe(200);
  });

  it('returns half at progress 0.5', () => {
    expect(drawOutOffset(200, 0.5)).toBe(100);
  });
});

describe('fadeOpacity', () => {
  it('returns 0 at progress 0 for fade-in', () => {
    expect(fadeOpacity(0, 'in')).toBe(0);
  });

  it('returns 1 at progress 1 for fade-in', () => {
    expect(fadeOpacity(1, 'in')).toBe(1);
  });

  it('returns 0.5 at progress 0.5 for fade-in', () => {
    expect(fadeOpacity(0.5, 'in')).toBe(0.5);
  });

  it('returns 1 at progress 0 for fade-out', () => {
    expect(fadeOpacity(0, 'out')).toBe(1);
  });

  it('returns 0 at progress 1 for fade-out', () => {
    expect(fadeOpacity(1, 'out')).toBe(0);
  });

  it('returns 0.5 at progress 0.5 for fade-out', () => {
    expect(fadeOpacity(0.5, 'out')).toBe(0.5);
  });
});

// ── DOM helpers ─────────────────────────────────────────────────────────────

describe('applyDrawTransition', () => {
  it('sets strokeDasharray to total path length', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'in');
    expect(path._styles['stroke-dasharray']).toBe('300');
  });

  it('sets strokeDashoffset for draw-in', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'in');
    expect(path._styles['stroke-dashoffset']).toBe('150');
  });

  it('sets strokeDashoffset for draw-out', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'out');
    expect(path._styles['stroke-dashoffset']).toBe('150');
  });

  it('reads totalLength from the path element each call', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'in');
    applyDrawTransition(path, 0.8, 'in');
    expect(path.getTotalLength).toHaveBeenCalledTimes(2);
  });

  it('fully hides path at progress 0 draw-in', () => {
    const path = mockPathElement(400);
    applyDrawTransition(path, 0, 'in');
    expect(path._styles['stroke-dashoffset']).toBe('400');
  });

  it('fully reveals path at progress 1 draw-in', () => {
    const path = mockPathElement(400);
    applyDrawTransition(path, 1, 'in');
    expect(path._styles['stroke-dashoffset']).toBe('0');
  });

  it('hides marker-end via inline style during draw-in before completion', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'in');
    expect(path._styles['marker-end']).toBe('none');
  });

  it('hides marker-start via inline style during draw-in before completion', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'in');
    expect(path._styles['marker-start']).toBe('none');
  });

  it('does not hide markers at progress 1 draw-in (fully drawn)', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 1, 'in');
    // At progress 1 the path is fully revealed — markers should not be hidden
    expect(path._styles['marker-end']).toBeUndefined();
  });

  it('hides markers during draw-out', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.3, 'out');
    expect(path._styles['marker-end']).toBe('none');
  });
});

describe('cleanupDrawTransition', () => {
  it('removes strokeDasharray and strokeDashoffset', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'in');
    expect(path._styles['stroke-dasharray']).toBeTruthy();

    cleanupDrawTransition(path);
    expect(path._styles['stroke-dasharray']).toBeUndefined();
    expect(path._styles['stroke-dashoffset']).toBeUndefined();
  });

  it('removes marker-end inline style override on cleanup', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'in');
    expect(path._styles['marker-end']).toBe('none');

    cleanupDrawTransition(path);
    expect(path._styles['marker-end']).toBeUndefined();
  });

  it('removes marker-start inline style override on cleanup', () => {
    const path = mockPathElement(300);
    applyDrawTransition(path, 0.5, 'in');
    expect(path._styles['marker-start']).toBe('none');

    cleanupDrawTransition(path);
    expect(path._styles['marker-start']).toBeUndefined();
  });
});

describe('applyFadeTransition', () => {
  it('sets opacity for fade-in', () => {
    const el = mockElement();
    applyFadeTransition(el, 0.3, 'in');
    expect(el._styles.opacity).toBe('0.3');
  });

  it('sets opacity for fade-out', () => {
    const el = mockElement();
    applyFadeTransition(el, 0.3, 'out');
    expect(el._styles.opacity).toBe('0.7');
  });

  it('full opacity at progress 1 fade-in', () => {
    const el = mockElement();
    applyFadeTransition(el, 1, 'in');
    expect(el._styles.opacity).toBe('1');
  });

  it('zero opacity at progress 1 fade-out', () => {
    const el = mockElement();
    applyFadeTransition(el, 1, 'out');
    expect(el._styles.opacity).toBe('0');
  });
});

describe('cleanupFadeTransition', () => {
  it('removes opacity style', () => {
    const el = mockElement();
    applyFadeTransition(el, 0.5, 'in');
    expect(el._styles.opacity).toBeTruthy();

    cleanupFadeTransition(el);
    expect(el._styles.opacity).toBeUndefined();
  });
});
