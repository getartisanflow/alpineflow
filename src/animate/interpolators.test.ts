import { describe, it, expect } from 'vitest';
import { lerpNumber, interpolateColor, parseStyle, interpolateStyle, lerpViewport } from './interpolators';

// ── lerpNumber ──────────────────────────────────────────────────────────────

describe('lerpNumber', () => {
  it('returns start value at t=0', () => {
    expect(lerpNumber(10, 50, 0)).toBe(10);
  });

  it('returns end value at t=1', () => {
    expect(lerpNumber(10, 50, 1)).toBe(50);
  });

  it('interpolates linearly at t=0.5', () => {
    expect(lerpNumber(0, 100, 0.5)).toBe(50);
  });

  it('interpolates at t=0.25', () => {
    expect(lerpNumber(0, 100, 0.25)).toBe(25);
  });

  it('works with negative values', () => {
    expect(lerpNumber(-100, 100, 0.5)).toBe(0);
  });

  it('works when start equals end', () => {
    expect(lerpNumber(42, 42, 0.5)).toBe(42);
  });
});

// ── interpolateColor ────────────────────────────────────────────────────────

describe('interpolateColor', () => {
  it('returns start color at t=0', () => {
    const result = interpolateColor('#000000', '#ffffff', 0);
    expect(result).toMatch(/rgb/);
    // Should be black
    expect(result).toMatch(/0.*0.*0/);
  });

  it('returns end color at t=1', () => {
    const result = interpolateColor('#000000', '#ffffff', 1);
    expect(result).toMatch(/rgb/);
    // Should be white
    expect(result).toMatch(/255.*255.*255/);
  });

  it('blends colors at t=0.5', () => {
    const result = interpolateColor('#000000', '#ffffff', 0.5);
    expect(result).toMatch(/rgb/);
  });

  it('handles named colors', () => {
    const result = interpolateColor('red', 'blue', 0);
    expect(result).toMatch(/rgb/);
  });
});

// ── parseStyle ──────────────────────────────────────────────────────────────

describe('parseStyle', () => {
  it('parses a style string into a Record', () => {
    const result = parseStyle('color: red; font-size: 16px');
    expect(result).toEqual({ color: 'red', 'font-size': '16px' });
  });

  it('returns an empty object for empty string', () => {
    expect(parseStyle('')).toEqual({});
  });

  it('passes through a Record unchanged', () => {
    const input = { color: 'red', opacity: '0.5' };
    expect(parseStyle(input)).toBe(input);
  });

  it('trims whitespace from keys and values', () => {
    const result = parseStyle('  color : red ;  opacity : 0.5  ');
    expect(result).toEqual({ color: 'red', opacity: '0.5' });
  });

  it('handles properties with colons in values (e.g. urls)', () => {
    const result = parseStyle('background: url(https://example.com)');
    expect(result).toEqual({ background: 'url(https://example.com)' });
  });
});

// ── interpolateStyle ────────────────────────────────────────────────────────

describe('interpolateStyle', () => {
  it('interpolates numeric pixel values', () => {
    const result = interpolateStyle(
      { 'font-size': '10px' },
      { 'font-size': '20px' },
      0.5,
    );
    expect(result['font-size']).toBe('15px');
  });

  it('interpolates plain numeric values', () => {
    const result = interpolateStyle(
      { opacity: '0' },
      { opacity: '1' },
      0.5,
    );
    expect(result.opacity).toBe('0.5');
  });

  it('interpolates color values', () => {
    const result = interpolateStyle(
      { color: '#000000' },
      { color: '#ffffff' },
      0.5,
    );
    expect(result.color).toMatch(/rgb/);
  });

  it('snaps non-numeric values instantly to end at t>=0.5', () => {
    const result = interpolateStyle(
      { display: 'none' },
      { display: 'block' },
      0.5,
    );
    expect(result.display).toBe('block');
  });

  it('keeps start value for non-numeric at t<0.5', () => {
    const result = interpolateStyle(
      { display: 'none' },
      { display: 'block' },
      0.3,
    );
    expect(result.display).toBe('none');
  });

  it('handles properties present only in end style', () => {
    const result = interpolateStyle(
      {},
      { opacity: '1' },
      0.5,
    );
    expect(result.opacity).toBe('1');
  });
});

// ── lerpViewport ───────────────────────────────────────────────────────────

describe('lerpViewport', () => {
  it('returns start viewport at t=0', () => {
    const result = lerpViewport(
      { x: 0, y: 0, zoom: 1 },
      { x: 100, y: 200, zoom: 2 },
      0,
    );
    expect(result).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('returns end viewport at t=1', () => {
    const result = lerpViewport(
      { x: 0, y: 0, zoom: 1 },
      { x: 100, y: 200, zoom: 2 },
      1,
    );
    expect(result).toEqual({ x: 100, y: 200, zoom: 2 });
  });

  it('interpolates all fields at t=0.5', () => {
    const result = lerpViewport(
      { x: 0, y: 0, zoom: 1 },
      { x: 100, y: 200, zoom: 2 },
      0.5,
    );
    expect(result).toEqual({ x: 50, y: 100, zoom: 1.5 });
  });

  it('clamps zoom to minZoom', () => {
    const result = lerpViewport(
      { x: 0, y: 0, zoom: 0.3 },
      { x: 0, y: 0, zoom: 0.1 },
      1,
      { minZoom: 0.5 },
    );
    expect(result.zoom).toBe(0.5);
  });

  it('clamps zoom to maxZoom', () => {
    const result = lerpViewport(
      { x: 0, y: 0, zoom: 1 },
      { x: 0, y: 0, zoom: 5 },
      1,
      { maxZoom: 3 },
    );
    expect(result.zoom).toBe(3);
  });

  it('works with negative coordinates', () => {
    const result = lerpViewport(
      { x: -100, y: -200, zoom: 1 },
      { x: 100, y: 200, zoom: 1 },
      0.5,
    );
    expect(result).toEqual({ x: 0, y: 0, zoom: 1 });
  });
});
