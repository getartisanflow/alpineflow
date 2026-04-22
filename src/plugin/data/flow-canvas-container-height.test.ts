// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { FlowCanvasConfig } from '../../core/types';

/**
 * Focused tests for the `containerHeight` canvas config. Non-breaking
 * override for `--flow-container-height` (default `400px`).
 *
 * Since the real flowCanvas orchestrator can only run inside an Alpine.js
 * lifecycle, we replicate the exact resolve-and-apply logic from
 * `_initContainer()` here (see flow-canvas.ts). If that logic changes,
 * update this helper to match.
 */
function applyContainerHeight(
  container: HTMLElement,
  config: Pick<FlowCanvasConfig, 'containerHeight'>,
): void {
  const ch = config.containerHeight;
  if (ch !== undefined && ch !== 'auto') {
    let value: string | null = null;
    if (ch === 'fill') {
      value = '100%';
    } else if (typeof ch === 'number' && Number.isFinite(ch)) {
      value = `${ch}px`;
    } else if (typeof ch === 'string' && ch.trim()) {
      value = ch.trim();
    }
    if (value !== null) {
      container.style.setProperty('--flow-container-height', value);
    }
  }
}

describe('containerHeight canvas config', () => {
  it('applies no inline --flow-container-height when containerHeight is undefined', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, {});
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('');
  });

  it('applies no inline --flow-container-height when containerHeight is "auto"', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: 'auto' });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('');
  });

  it('sets --flow-container-height to 100% when containerHeight is "fill"', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: 'fill' });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('100%');
  });

  it('sets --flow-container-height to <n>px when containerHeight is a number', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: 600 });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('600px');
  });

  it('sets --flow-container-height for zero as 0px (finite number)', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: 0 });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('0px');
  });

  it('passes through --flow-container-height when containerHeight is a vh string', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: '80vh' });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('80vh');
  });

  it('passes through --flow-container-height when containerHeight is a calc() string', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: 'calc(100vh - 60px)' });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('calc(100vh - 60px)');
  });

  it('trims whitespace around string values', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: '  80vh  ' });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('80vh');
  });

  it('ignores empty string gracefully (falls back to default)', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: '' });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('');
  });

  it('ignores whitespace-only string gracefully', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: '   ' });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('');
  });

  it('ignores NaN numbers gracefully', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: Number.NaN });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('');
  });

  it('ignores Infinity numbers gracefully', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: Number.POSITIVE_INFINITY });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('');
  });

  it('ignores -Infinity numbers gracefully', () => {
    const el = document.createElement('div');
    applyContainerHeight(el, { containerHeight: Number.NEGATIVE_INFINITY });
    expect(el.style.getPropertyValue('--flow-container-height')).toBe('');
  });
});
