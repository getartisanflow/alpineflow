import { describe, it, expect } from 'vitest';
import {
  isGradient,
  getGradientId,
  resolveStrokeColor,
} from './gradients';

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
