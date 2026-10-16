// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import {
  isGradient,
  getGradientId,
  resolveStrokeColor,
  restyleGradientDef,
  upsertGradientDef,
} from './gradients';

// jsdom doesn't implement CSS.escape, which the gradient def helpers call. The ids used in this
// suite contain no characters that need escaping, so a passthrough is sufficient here.
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string): string => String(value);
  }
});

describe('isGradient', () => {
  it('returns false for undefined', () => {
    expect(isGradient(undefined)).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isGradient('#ef4444')).toBe(false);
  });

  it('returns true for a gradient object', () => {
    expect(isGradient({ from: '#22c55e', to: '#ef4444' })).toBe(true);
  });
});

describe('getGradientId', () => {
  it('generates a consistent ID from flow ID and edge ID', () => {
    expect(getGradientId('flow-1', 'e-lb-1')).toBe('flow-1__grad__e-lb-1');
  });
});

describe('resolveStrokeColor', () => {
  it('returns the string for solid colors', () => {
    expect(resolveStrokeColor('#ef4444')).toBe('#ef4444');
  });

  it('returns the from color for gradient objects', () => {
    expect(resolveStrokeColor({ from: '#22c55e', to: '#ef4444' })).toBe('#22c55e');
  });

  it('returns null for undefined', () => {
    expect(resolveStrokeColor(undefined)).toBeNull();
  });
});

describe('restyleGradientDef', () => {
  const makeDefs = (): Element =>
    document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  it('repaints both stop-colors in place and reports true', () => {
    const defs = makeDefs();
    upsertGradientDef(defs, 'grad-e1', { from: '#111111', to: '#222222' }, 0, 0, 100, 0);

    const changed = restyleGradientDef(defs, 'grad-e1', { from: '#abcdef', to: '#fedcba' });

    expect(changed).toBe(true);
    const stops = defs.querySelectorAll('stop');
    expect(stops[0].getAttribute('stop-color')).toBe('#abcdef');
    expect(stops[1].getAttribute('stop-color')).toBe('#fedcba');
  });

  it('reports false (nothing to repaint) when the def does not exist yet', () => {
    const defs = makeDefs();
    expect(restyleGradientDef(defs, 'missing', { from: '#000', to: '#fff' })).toBe(false);
  });

  it('reports false when the gradient has fewer than two stops', () => {
    const defs = makeDefs();
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.id = 'grad-partial';
    grad.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'stop'));
    defs.appendChild(grad);

    expect(restyleGradientDef(defs, 'grad-partial', { from: '#000', to: '#fff' })).toBe(false);
  });
});
