import { describe, it, expect } from 'vitest';
import { normalizeMarker, getMarkerId, getMarkerSvg, type MarkerConfig } from './markers';

// ── normalizeMarker ─────────────────────────────────────────────────────────

describe('normalizeMarker', () => {
  it('converts string shorthand to MarkerConfig', () => {
    expect(normalizeMarker('arrow')).toEqual({ type: 'arrow' });
    expect(normalizeMarker('arrowclosed')).toEqual({ type: 'arrowclosed' });
  });

  it('passes through MarkerConfig objects unchanged', () => {
    const config: MarkerConfig = { type: 'arrow', color: '#ff0000', width: 20 };
    expect(normalizeMarker(config)).toBe(config);
  });
});

// ── getMarkerId ─────────────────────────────────────────────────────────────

describe('getMarkerId', () => {
  it('generates id from flowId, type, and color', () => {
    const id = getMarkerId({ type: 'arrow' }, 'flow-1');
    expect(id).toBe('flow-1__arrow___d4d4d8'); // default color (#d4d4d8 → _d4d4d8)
  });

  it('sanitizes non-alphanumeric chars from color', () => {
    const id = getMarkerId({ type: 'arrowclosed', color: '#ff0000' }, 'flow-1');
    expect(id).toBe('flow-1__arrowclosed___ff0000');
  });

  it('uses default color when none specified', () => {
    const id = getMarkerId({ type: 'arrow' }, 'myflow');
    expect(id).toContain('_d4d4d8');
  });
});

// ── getMarkerSvg ────────────────────────────────────────────────────────────

describe('getMarkerSvg', () => {
  it('generates open arrow marker SVG', () => {
    const svg = getMarkerSvg({ type: 'arrow' }, 'test-id');
    expect(svg).toContain('id="test-id"');
    expect(svg).toContain('<polyline');
    expect(svg).toContain('fill="none"');
    expect(svg).toContain('<marker');
  });

  it('generates closed arrow marker SVG', () => {
    const svg = getMarkerSvg({ type: 'arrowclosed' }, 'test-id');
    expect(svg).toContain('id="test-id"');
    expect(svg).toContain('<polyline');
    expect(svg).not.toContain('fill="none"');
  });

  it('uses custom color', () => {
    const svg = getMarkerSvg({ type: 'arrow', color: '#ff0000' }, 'id');
    expect(svg).toContain('stroke="#ff0000"');
  });

  it('uses custom dimensions', () => {
    const svg = getMarkerSvg({ type: 'arrow', width: 20, height: 15 }, 'id');
    expect(svg).toContain('markerWidth="20"');
    expect(svg).toContain('markerHeight="15"');
  });

  it('uses default dimensions when not specified', () => {
    const svg = getMarkerSvg({ type: 'arrow' }, 'id');
    expect(svg).toContain('markerWidth="12.5"');
    expect(svg).toContain('markerHeight="12.5"');
  });

  it('closed arrow fills with the marker color', () => {
    const svg = getMarkerSvg({ type: 'arrowclosed', color: '#333' }, 'id');
    expect(svg).toContain('fill="#333"');
  });

  it('escapes XSS payloads in color attribute', () => {
    const xssColor = '"><script>alert("xss")</script>';
    const svg = getMarkerSvg({ type: 'arrow', color: xssColor }, 'test-id');

    // The raw XSS string must not appear unescaped in the output
    expect(svg).not.toContain(xssColor);
    // Angle brackets and quotes should be escaped
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
    expect(svg).toContain('&quot;');
  });

  it('escapes XSS payloads in id attribute', () => {
    const xssId = '"><img onerror=alert(1) src=x>';
    const svg = getMarkerSvg({ type: 'arrow' }, xssId);

    // The raw payload must not appear unescaped — quotes and angle brackets are escaped
    expect(svg).not.toContain(xssId);
    // The closing quote and opening tag bracket are escaped, preventing attribute breakout
    expect(svg).toContain('&quot;&gt;&lt;img');
    expect(svg).toContain('&quot;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });

  it('escapes XSS payloads in orient attribute', () => {
    const xssOrient = '" onload="alert(1)';
    const svg = getMarkerSvg({ type: 'arrow', orient: xssOrient }, 'id');

    expect(svg).not.toContain(xssOrient);
    expect(svg).toContain('&quot;');
  });

  it('clamps non-numeric width/height to defaults', () => {
    const svg = getMarkerSvg({ type: 'arrow', width: 'abc' as any, height: null as any }, 'id');
    expect(svg).toContain('markerWidth="12.5"');
    expect(svg).toContain('markerHeight="12.5"');
    expect(svg).not.toContain('NaN');
  });

  it('casts width and height to numbers to prevent injection', () => {
    const svg = getMarkerSvg(
      { type: 'arrow', width: '20" onclick="alert(1)' as any, height: 'bad' as any },
      'id',
    );

    // Non-numeric strings are clamped to defaults (no executable content)
    expect(svg).not.toContain('onclick');
    expect(svg).toContain('markerWidth="12.5"');
    expect(svg).toContain('markerHeight="12.5"');
    expect(svg).not.toContain('NaN');
  });
});
