import { describe, it, expect } from 'vitest';
import { resolveEasing, type EasingName } from './easing';

describe('resolveEasing', () => {
  // ── Named presets ──────────────────────────────────────────────────────

  it('resolves "linear" to a function returning t unchanged', () => {
    const fn = resolveEasing('linear');
    expect(fn(0)).toBe(0);
    expect(fn(0.5)).toBe(0.5);
    expect(fn(1)).toBe(1);
  });

  it('resolves "easeIn" to a non-linear function', () => {
    const fn = resolveEasing('easeIn');
    expect(fn(0)).toBe(0);
    expect(fn(1)).toBe(1);
    // easeIn should be slower at the start — value at 0.5 should be less than 0.5
    expect(fn(0.5)).toBeLessThan(0.5);
  });

  it('resolves "easeOut" to a non-linear function', () => {
    const fn = resolveEasing('easeOut');
    expect(fn(0)).toBe(0);
    expect(fn(1)).toBe(1);
    // easeOut should be faster at the start — value at 0.5 should be greater than 0.5
    expect(fn(0.5)).toBeGreaterThan(0.5);
  });

  it('resolves "easeInOut" to a non-linear function', () => {
    const fn = resolveEasing('easeInOut');
    expect(fn(0)).toBe(0);
    expect(fn(1)).toBe(1);
    // Symmetric: value at 0.5 should be exactly 0.5 for quad in-out
    expect(fn(0.5)).toBe(0.5);
  });

  it('resolves "easeBounce" to a function with bounce characteristics', () => {
    const fn = resolveEasing('easeBounce');
    expect(fn(0)).toBe(0);
    expect(fn(1)).toBe(1);
    expect(typeof fn(0.5)).toBe('number');
  });

  it('resolves "easeElastic" to a function that overshoots', () => {
    const fn = resolveEasing('easeElastic');
    expect(fn(1)).toBe(1);
    // Elastic easing typically overshoots before settling
    const values = Array.from({ length: 10 }, (_, i) => fn(i / 10));
    const hasOvershoot = values.some((v) => v > 1);
    expect(hasOvershoot).toBe(true);
  });

  it('resolves "easeBack" to a function', () => {
    const fn = resolveEasing('easeBack');
    expect(fn(0)).toBeCloseTo(0, 5);
    expect(fn(1)).toBeCloseTo(1, 5);
  });

  // ── Custom function passthrough ────────────────────────────────────────

  it('passes through a custom easing function unchanged', () => {
    const custom = (t: number): number => t * t * t;
    const fn = resolveEasing(custom);
    expect(fn).toBe(custom);
    expect(fn(0.5)).toBe(0.125);
  });

  // ── Default fallback ──────────────────────────────────────────────────

  it('falls back to easeInOut when no argument is provided', () => {
    const fn = resolveEasing();
    expect(fn(0)).toBe(0);
    expect(fn(1)).toBe(1);
    expect(fn(0.5)).toBe(0.5); // easeInOut quad
  });
});
