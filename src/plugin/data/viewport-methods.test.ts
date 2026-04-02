import { describe, it, expect, vi } from 'vitest';
import type { Viewport } from '../../core/types';

/**
 * Tests for setCenter() and panBy() viewport methods.
 * We replicate the calculation logic to unit-test without a full Alpine environment.
 */

interface MockCanvas {
  viewport: Viewport;
  _container: { clientWidth: number; clientHeight: number } | null;
  _panZoom: { setViewport: ReturnType<typeof vi.fn> } | null;
  setCenter(x: number, y: number, zoom?: number, options?: { duration?: number }): void;
  panBy(dx: number, dy: number, options?: { duration?: number }): void;
}

function makeCanvas(
  viewport: Viewport = { x: 0, y: 0, zoom: 1 },
  containerSize = { width: 800, height: 600 },
): MockCanvas {
  const setViewport = vi.fn();

  return {
    viewport,
    _container: { clientWidth: containerSize.width, clientHeight: containerSize.height },
    _panZoom: { setViewport },

    setCenter(x: number, y: number, zoom?: number, options?: { duration?: number }) {
      const el = this._container;
      if (!el) return;
      const z = zoom ?? this.viewport.zoom;
      const vpX = x - el.clientWidth / (2 * z);
      const vpY = y - el.clientHeight / (2 * z);
      this._panZoom?.setViewport({ x: vpX, y: vpY, zoom: z }, options);
    },

    panBy(dx: number, dy: number, options?: { duration?: number }) {
      this._panZoom?.setViewport(
        { x: this.viewport.x + dx, y: this.viewport.y + dy, zoom: this.viewport.zoom },
        options,
      );
    },
  };
}

describe('setCenter', () => {
  it('calculates correct viewport coordinates for center point', () => {
    const canvas = makeCanvas({ x: 0, y: 0, zoom: 1 }, { width: 800, height: 600 });
    canvas.setCenter(200, 200);

    expect(canvas._panZoom!.setViewport).toHaveBeenCalledWith(
      { x: 200 - 400, y: 200 - 300, zoom: 1 },
      undefined,
    );
  });

  it('uses provided zoom level', () => {
    const canvas = makeCanvas({ x: 0, y: 0, zoom: 1 }, { width: 800, height: 600 });
    canvas.setCenter(200, 200, 2);

    // At zoom 2: vpX = 200 - 800/(2*2) = 200 - 200 = 0
    //            vpY = 200 - 600/(2*2) = 200 - 150 = 50
    expect(canvas._panZoom!.setViewport).toHaveBeenCalledWith(
      { x: 0, y: 50, zoom: 2 },
      undefined,
    );
  });

  it('preserves current zoom when none provided', () => {
    const canvas = makeCanvas({ x: 100, y: 100, zoom: 1.5 }, { width: 800, height: 600 });
    canvas.setCenter(300, 300);

    // At zoom 1.5: vpX = 300 - 800/(2*1.5) = 300 - 266.67
    //              vpY = 300 - 600/(2*1.5) = 300 - 200
    const call = canvas._panZoom!.setViewport.mock.calls[0];
    expect(call[0].zoom).toBe(1.5);
    expect(call[0].x).toBeCloseTo(300 - 800 / 3, 5);
    expect(call[0].y).toBeCloseTo(300 - 200, 5);
  });

  it('passes duration option through', () => {
    const canvas = makeCanvas();
    canvas.setCenter(0, 0, undefined, { duration: 500 });

    expect(canvas._panZoom!.setViewport).toHaveBeenCalledWith(
      expect.any(Object),
      { duration: 500 },
    );
  });

  it('does nothing when container is null', () => {
    const canvas = makeCanvas();
    canvas._container = null;
    canvas.setCenter(100, 100);

    expect(canvas._panZoom!.setViewport).not.toHaveBeenCalled();
  });
});

describe('panBy', () => {
  it('adds delta to current viewport position', () => {
    const canvas = makeCanvas({ x: 100, y: 200, zoom: 1 });
    canvas.panBy(50, -30);

    expect(canvas._panZoom!.setViewport).toHaveBeenCalledWith(
      { x: 150, y: 170, zoom: 1 },
      undefined,
    );
  });

  it('preserves current zoom level', () => {
    const canvas = makeCanvas({ x: 0, y: 0, zoom: 1.5 });
    canvas.panBy(100, 100);

    expect(canvas._panZoom!.setViewport).toHaveBeenCalledWith(
      { x: 100, y: 100, zoom: 1.5 },
      undefined,
    );
  });

  it('passes duration option through', () => {
    const canvas = makeCanvas({ x: 0, y: 0, zoom: 1 });
    canvas.panBy(10, 20, { duration: 300 });

    expect(canvas._panZoom!.setViewport).toHaveBeenCalledWith(
      expect.any(Object),
      { duration: 300 },
    );
  });

  it('handles negative deltas', () => {
    const canvas = makeCanvas({ x: 50, y: 50, zoom: 1 });
    canvas.panBy(-100, -100);

    expect(canvas._panZoom!.setViewport).toHaveBeenCalledWith(
      { x: -50, y: -50, zoom: 1 },
      undefined,
    );
  });
});
