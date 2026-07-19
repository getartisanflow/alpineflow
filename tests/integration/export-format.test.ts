import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll } from './helpers/mount';

// Real geometry requires the shipped stylesheets (see export-edges.test.ts).
import '../../css/structural.css';
import '../../css/theme-default.css';

/**
 * `format` picks what toImage() hands back: the rasterized capture (png/jpeg) or the
 * vector capture itself (svg). The cases worth guarding are the ones where the formats
 * genuinely differ — SVG ignores `scale` and needs its background in the markup rather
 * than painted onto a canvas, and JPEG has no alpha so an unpainted export would encode
 * as solid black instead of staying transparent.
 */

/** Decode a data URL through an <img> so we measure the real encoded pixels. */
async function dimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  return { width: img.width, height: img.height };
}

/** Sample the pixel at (x, y) of an encoded data URL as [r, g, b, a]. */
async function pixelAt(dataUrl: string, x: number, y: number): Promise<number[]> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return Array.from(ctx.getImageData(x, y, 1, 1).data);
}

function decodeSvg(dataUrl: string): string {
  return decodeURIComponent(dataUrl.substring('data:image/svg+xml;charset=utf-8,'.length));
}

describe('toImage — format', () => {
  afterEach(() => unmountAll());

  const nodes = [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'b', position: { x: 400, y: 200 }, data: { label: 'B' } },
  ];
  const edges = [{ id: 'e1', source: 'a', target: 'b' }];
  const base = { scope: 'all' as const, background: '#ffffff', width: 300, height: 200 };

  it('defaults to PNG when no format is given', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    expect(await flow.toImage(base)).toMatch(/^data:image\/png[;,]/);
  });

  it('emits the requested mime type for each format', async () => {
    const { flow } = await mountCanvas({ nodes, edges });

    expect(await flow.toImage({ ...base, format: 'png' })).toMatch(/^data:image\/png[;,]/);
    expect(await flow.toImage({ ...base, format: 'jpeg' })).toMatch(/^data:image\/jpeg[;,]/);
    expect(await flow.toImage({ ...base, format: 'svg' })).toMatch(/^data:image\/svg\+xml[;,]/);
  });

  it('rasterizes png and jpeg at the requested dimensions', async () => {
    const { flow } = await mountCanvas({ nodes, edges });

    expect(await dimensions(await flow.toImage({ ...base, format: 'png' }))).toEqual({ width: 300, height: 200 });
    expect(await dimensions(await flow.toImage({ ...base, format: 'jpeg' }))).toEqual({ width: 300, height: 200 });
  });

  it('honours `scale` for jpeg, exactly as for png', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    expect(await dimensions(await flow.toImage({ ...base, format: 'jpeg', scale: 2 })))
      .toEqual({ width: 600, height: 400 });
  });

  it('ignores `scale` for svg — vector output has no raster resolution', async () => {
    const { flow } = await mountCanvas({ nodes, edges });

    const oneX = await flow.toImage({ ...base, format: 'svg' });
    const threeX = await flow.toImage({ ...base, format: 'svg', scale: 3 });

    // Identical markup, and the declared size stays the logical size.
    expect(decodeSvg(threeX)).toBe(decodeSvg(oneX));
    expect(await dimensions(oneX)).toEqual({ width: 300, height: 200 });
  });

  it('carries the background inside the svg markup, not a canvas fill', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    const svg = decodeSvg(await flow.toImage({ ...base, format: 'svg', background: '#ff0000' }));

    // The rect must precede the captured content, or it would paint over the graph.
    const rect = svg.indexOf('<rect');
    expect(rect).toBeGreaterThan(-1);
    expect(svg.slice(rect, rect + 120)).toContain('#ff0000');
    expect(rect).toBeLessThan(svg.indexOf('foreignObject'));
  });

  // The captured container paints its own (opaque) background, so `background` shows
  // through only where the capture is transparent — it is a backdrop, not an override.
  // That is equally true of the PNG path, whose fillRect also sits behind the drawn
  // image, so these assert cross-format parity rather than a hardcoded colour.

  it('renders the svg opaquely, matching the png backdrop', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    const opts = { ...base, background: '#ff0000' };

    const svgPixel = await pixelAt(await flow.toImage({ ...opts, format: 'svg' }), 2, 2);
    const pngPixel = await pixelAt(await flow.toImage({ ...opts, format: 'png' }), 2, 2);

    expect(svgPixel).toEqual(pngPixel);
    expect(svgPixel[3]).toBe(255); // opaque: the markup rect stands in for a canvas fill
  });

  it('shows the background through a transparent container, as the raster path does', async () => {
    // The case the markup rect actually exists for. With an opaque container theme the
    // capture covers the rect entirely, so this forces the container transparent —
    // without the rect the SVG exports see-through (alpha 0) while the PNG stays red.
    const { flow, canvas } = await mountCanvas({ nodes, edges });
    canvas.style.background = 'transparent';
    const opts = { ...base, background: '#ff0000' };

    const [sr, sg, sb, sa] = await pixelAt(await flow.toImage({ ...opts, format: 'svg' }), 2, 2);
    const pngPixel = await pixelAt(await flow.toImage({ ...opts, format: 'png' }), 2, 2);

    expect([sr, sg, sb]).toEqual([255, 0, 0]);
    expect(sa).toBe(255);
    expect([sr, sg, sb, sa]).toEqual(pngPixel);
  });

  it('fills the jpeg background instead of encoding transparency as black', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    const opts = { ...base, background: '#ffffff' };

    const [jr, jg, jb] = await pixelAt(await flow.toImage({ ...opts, format: 'jpeg' }), 2, 2);
    const [pr, pg, pb] = await pixelAt(await flow.toImage({ ...opts, format: 'png' }), 2, 2);

    // JPEG has no alpha: an unpainted canvas would come back [0,0,0] rather than
    // tracking the PNG. Tolerance covers lossy encoding, not a different colour.
    expect(Math.abs(jr - pr)).toBeLessThan(6);
    expect(Math.abs(jg - pg)).toBeLessThan(6);
    expect(Math.abs(jb - pb)).toBeLessThan(6);
    expect(jr + jg + jb).toBeGreaterThan(60); // guards the all-black failure mode
  });

  it('applies `quality` to jpeg — lower quality yields a smaller file', async () => {
    const { flow } = await mountCanvas({ nodes, edges });

    const high = await flow.toImage({ ...base, format: 'jpeg', quality: 1 });
    const low = await flow.toImage({ ...base, format: 'jpeg', quality: 0.1 });

    expect(low.length).toBeLessThan(high.length);
  });

  it('falls back to the default quality for out-of-range or invalid values', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    const expected = (await flow.toImage({ ...base, format: 'jpeg', quality: 0.92 })).length;

    // Clamped (2 → 1, -1 → 0) or rejected (NaN → default); none may throw or blank out.
    for (const bad of [NaN, Infinity, undefined]) {
      expect((await flow.toImage({ ...base, format: 'jpeg', quality: bad as number })).length).toBe(expected);
    }
    for (const clamped of [2, -1]) {
      const url = await flow.toImage({ ...base, format: 'jpeg', quality: clamped });
      expect(url).toMatch(/^data:image\/jpeg[;,]/);
      expect(await dimensions(url)).toEqual({ width: 300, height: 200 });
    }
  });

  it('ignores `quality` for png — it stays lossless', async () => {
    const { flow } = await mountCanvas({ nodes, edges });

    const a = await flow.toImage({ ...base, format: 'png', quality: 0.1 });
    const b = await flow.toImage({ ...base, format: 'png', quality: 1 });

    expect(a).toBe(b);
  });

  it('keeps edges in the svg export (the CSS-paint fix applies to all formats)', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    const svg = decodeSvg(await flow.toImage({ ...base, format: 'svg' }));

    // inlineSvgPaint() bakes computed stroke onto attributes before capture; without
    // it the edge path serializes unpainted and the export loses every edge.
    expect(svg).toMatch(/stroke="[^"]+"/);
  });
});
