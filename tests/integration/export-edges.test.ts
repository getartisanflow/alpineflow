import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { mountCanvas, unmountAll } from './helpers/mount';

// The canvas only has real geometry (positioned nodes, a sized edge layer) with the
// shipped stylesheets loaded — without them the export is legitimately blank.
import '../../css/structural.css';
import '../../css/theme-default.css';

/**
 * Regression: edges exported invisible.
 *
 * html-to-image serializes the DOM into an SVG `foreignObject`. It preserves SVG
 * paint expressed as presentation ATTRIBUTES, but drops paint that comes from a
 * stylesheet. AlpineFlow's edge paths carry no `stroke` attribute — their paint is
 * pure CSS — so every edge used to rasterize with no stroke while the nodes came
 * through fine. `inlineSvgPaint()` in core/export.ts fixes this by baking computed
 * paint onto the elements for the duration of the capture.
 *
 * These tests force a distinctive CSS-ONLY stroke (the exact failing shape) and
 * assert those pixels actually land in the PNG.
 */

const STROKE = 'rgb(255, 0, 0)';

beforeAll(() => {
  // Paint edges red via a stylesheet only — no stroke attribute anywhere.
  const style = document.createElement('style');
  style.id = 'export-edge-test-style';
  style.textContent = `.flow-edge-svg path { stroke: ${STROKE} !important; stroke-width: 6px !important; }`;
  document.head.appendChild(style);
});

/** Decode a PNG data URL and count pixels matching the test stroke colour. */
async function countStrokePixels(dataUrl: string): Promise<{ width: number; height: number; stroke: number }> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let stroke = 0;
  for (let i = 0; i < data.length; i += 4) {
    // generous threshold — antialiasing softens the line
    if (data[i] > 180 && data[i + 1] < 90 && data[i + 2] < 90) stroke++;
  }
  return { width: img.width, height: img.height, stroke };
}

describe('toImage — edge rendering', () => {
  afterEach(() => unmountAll());

  const nodes = [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'b', position: { x: 400, y: 200 }, data: { label: 'B' } },
  ];
  const exportOpts = { scope: 'all' as const, background: '#ffffff', width: 600, height: 400 };

  it('paints CSS-styled edge strokes into the exported image', async () => {
    const { flow } = await mountCanvas({ nodes, edges: [{ id: 'e1', source: 'a', target: 'b' }] });

    const stats = await countStrokePixels(await flow.toImage(exportOpts));

    expect(stats.width).toBe(600);
    expect(stats.height).toBe(400);
    // Before inlineSvgPaint() this was 0 — the edge rasterized with no stroke.
    expect(stats.stroke).toBeGreaterThan(100);
  });

  it('produces no edge pixels when the graph has no edges (control)', async () => {
    const { flow } = await mountCanvas({ nodes, edges: [] });

    const stats = await countStrokePixels(await flow.toImage(exportOpts));

    // Proves the assertion above is actually detecting the edge, not node chrome.
    expect(stats.stroke).toBe(0);
  });

  it('still exports the nodes themselves (guards against a blank capture)', async () => {
    const { flow } = await mountCanvas({ nodes, edges: [{ id: 'e1', source: 'a', target: 'b' }] });

    const dataUrl = await flow.toImage(exportOpts);
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let nonBackground = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) nonBackground++;
    }
    expect(nonBackground).toBeGreaterThan(500);
  });
});
