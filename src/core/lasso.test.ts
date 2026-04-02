// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createLasso } from './lasso';
import type { Viewport } from './types';

// Minimal container mock
function makeContainer(): HTMLElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

describe('createLasso', () => {
  let container: HTMLElement;
  const viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  beforeEach(() => {
    container = makeContainer();
  });

  it('creates an SVG element in the container', () => {
    const lasso = createLasso(container);
    expect(container.querySelector('.flow-lasso-svg')).toBeTruthy();
    lasso.destroy();
  });

  it('is not active initially', () => {
    const lasso = createLasso(container);
    expect(lasso.isActive()).toBe(false);
    lasso.destroy();
  });

  it('becomes active after start', () => {
    const lasso = createLasso(container);
    lasso.start(100, 100, 'partial');
    expect(lasso.isActive()).toBe(true);
    lasso.destroy();
  });

  it('collects points during update', () => {
    const lasso = createLasso(container);
    lasso.start(10, 10, 'partial');
    lasso.update(50, 10);
    lasso.update(50, 50);
    lasso.update(10, 50);
    const points = lasso.end(viewport);
    expect(points).not.toBeNull();
    expect(points!.length).toBeGreaterThanOrEqual(3);
    lasso.destroy();
  });

  it('returns null on end if not active', () => {
    const lasso = createLasso(container);
    expect(lasso.end(viewport)).toBeNull();
    lasso.destroy();
  });

  it('returns null if fewer than 3 points', () => {
    const lasso = createLasso(container);
    lasso.start(10, 10, 'partial');
    // Only origin point, no meaningful shape
    const points = lasso.end(viewport);
    expect(points).toBeNull();
    lasso.destroy();
  });

  it('converts points from container space to flow space', () => {
    const zoomedViewport: Viewport = { x: 100, y: 50, zoom: 2 };
    const lasso = createLasso(container);
    lasso.start(200, 100, 'partial');
    lasso.update(300, 100);
    lasso.update(300, 200);
    lasso.update(200, 200);
    const points = lasso.end(zoomedViewport);
    expect(points).not.toBeNull();
    // First point: (200 - 100) / 2 = 50, (100 - 50) / 2 = 25
    expect(points![0].x).toBeCloseTo(50);
    expect(points![0].y).toBeCloseTo(25);
    lasso.destroy();
  });

  it('deduplicates points closer than threshold', () => {
    const lasso = createLasso(container);
    lasso.start(10, 10, 'partial');
    lasso.update(11, 10); // too close, should be skipped
    lasso.update(12, 10); // too close, should be skipped
    lasso.update(50, 50); // far enough
    lasso.update(10, 50); // far enough
    const points = lasso.end(viewport);
    // Should have ~3 points (start, 50/50, 10/50), not 5
    expect(points!.length).toBeLessThanOrEqual(4);
    lasso.destroy();
  });

  it('is not active after end', () => {
    const lasso = createLasso(container);
    lasso.start(10, 10, 'partial');
    lasso.update(50, 50);
    lasso.update(10, 50);
    lasso.end(viewport);
    expect(lasso.isActive()).toBe(false);
    lasso.destroy();
  });

  it('removes SVG on destroy', () => {
    const lasso = createLasso(container);
    lasso.destroy();
    expect(container.querySelector('.flow-lasso-svg')).toBeNull();
  });

  it('applies mode CSS class on start', () => {
    const lasso = createLasso(container);
    lasso.start(10, 10, 'full');
    const svgEl = container.querySelector('.flow-lasso-svg')!;
    expect(svgEl.classList.contains('flow-lasso-full')).toBe(true);
    expect(svgEl.classList.contains('flow-lasso-active')).toBe(true);
    lasso.end(viewport);
    expect(svgEl.classList.contains('flow-lasso-active')).toBe(false);
    lasso.destroy();
  });
});
