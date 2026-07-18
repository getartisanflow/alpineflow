import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll } from './helpers/mount';

// Real geometry requires the shipped stylesheets (see export-edges.test.ts).
import '../../css/structural.css';
import '../../css/theme-default.css';

/**
 * `scale` multiplies the raster resolution without touching the layout, so an export
 * stays crisp on retina / when pasted into a doc. The capture is vector, so a scaled
 * export should genuinely re-rasterize rather than upscale a smaller bitmap.
 */

async function dimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  return { width: img.width, height: img.height };
}

describe('toImage — scale', () => {
  afterEach(() => unmountAll());

  const nodes = [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'b', position: { x: 400, y: 200 }, data: { label: 'B' } },
  ];
  const edges = [{ id: 'e1', source: 'a', target: 'b' }];
  const base = { scope: 'all' as const, background: '#ffffff', width: 300, height: 200 };

  it('defaults to 1x — output matches the requested width/height', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    expect(await dimensions(await flow.toImage(base))).toEqual({ width: 300, height: 200 });
  });

  it('multiplies the output resolution by `scale`', async () => {
    const { flow } = await mountCanvas({ nodes, edges });

    expect(await dimensions(await flow.toImage({ ...base, scale: 2 }))).toEqual({ width: 600, height: 400 });
    expect(await dimensions(await flow.toImage({ ...base, scale: 3 }))).toEqual({ width: 900, height: 600 });
  });

  it('supports fractional scales', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    expect(await dimensions(await flow.toImage({ ...base, scale: 1.5 }))).toEqual({ width: 450, height: 300 });
  });

  it('falls back to 1x for invalid values instead of producing a broken canvas', async () => {
    const { flow } = await mountCanvas({ nodes, edges });
    const expected = { width: 300, height: 200 };

    for (const bad of [0, -2, NaN, Infinity, undefined]) {
      expect(await dimensions(await flow.toImage({ ...base, scale: bad as number }))).toEqual(expected);
    }
  });

  it('clamps absurd scales so the canvas stays renderable (not blank)', async () => {
    const { flow } = await mountCanvas({ nodes, edges });

    // 300 * 1000 would far exceed the browser canvas limit and silently yield a blank PNG.
    const dims = await dimensions(await flow.toImage({ ...base, scale: 1000 }));
    expect(dims.width).toBeLessThanOrEqual(16384);
    expect(dims.height).toBeLessThanOrEqual(16384);
    expect(dims.width).toBeGreaterThan(300); // still scaled up as far as it safely can
  });

  it('re-rasterizes at the higher resolution rather than upscaling a 1x bitmap', async () => {
    const { flow } = await mountCanvas({ nodes, edges });

    const oneX = await flow.toImage(base);
    const twoX = await flow.toImage({ ...base, scale: 2 });

    // A true 2x render resolves detail an upscaled 1x bitmap cannot, so it carries
    // materially more PNG data. (An upscale would compress to roughly the same size.)
    expect(twoX.length).toBeGreaterThan(oneX.length * 1.2);
  });
});
