// ============================================================================
// Lasso Selection Overlay
//
// Renders an SVG polyline during freeform drag selection. Collects pointer
// positions, simplifies with a distance threshold, and converts to flow
// coordinates on completion. Mirrors the SelectionBoxInstance API pattern.
// ============================================================================

import type { Viewport } from './types';
import type { Point } from './lasso-hit-test';

/** Minimum distance (screen pixels) between consecutive lasso points. */
const MIN_POINT_DISTANCE = 3;

export interface LassoInstance {
  start(containerX: number, containerY: number, mode?: 'partial' | 'full'): void;
  update(containerX: number, containerY: number): void;
  end(viewport: Viewport): Point[] | null;
  isActive(): boolean;
  destroy(): void;
}

export function createLasso(container: HTMLElement): LassoInstance {
  // Create SVG overlay
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('flow-lasso-svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  container.appendChild(svg);

  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.classList.add('flow-lasso-path');
  svg.appendChild(polyline);

  let active = false;
  let points: { x: number; y: number }[] = [];

  function start(containerX: number, containerY: number, mode: 'partial' | 'full' = 'partial'): void {
    active = true;
    points = [{ x: containerX, y: containerY }];

    svg.classList.remove('flow-lasso-partial', 'flow-lasso-full');
    svg.classList.add('flow-lasso-active', `flow-lasso-${mode}`);
    polyline.setAttribute('points', `${containerX},${containerY}`);
  }

  function update(containerX: number, containerY: number): void {
    if (!active) {
      return;
    }

    // Deduplicate: skip if too close to last point
    const last = points[points.length - 1];
    const dx = containerX - last.x;
    const dy = containerY - last.y;
    if (dx * dx + dy * dy < MIN_POINT_DISTANCE * MIN_POINT_DISTANCE) {
      return;
    }

    points.push({ x: containerX, y: containerY });
    polyline.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
  }

  function end(viewport: Viewport): Point[] | null {
    if (!active) {
      return null;
    }

    active = false;
    svg.classList.remove('flow-lasso-active', 'flow-lasso-partial', 'flow-lasso-full');
    polyline.setAttribute('points', '');

    // Need at least 3 points for a polygon
    if (points.length < 3) {
      return null;
    }

    // Convert container-space points to flow-space
    const result = points.map(p => ({
      x: (p.x - viewport.x) / viewport.zoom,
      y: (p.y - viewport.y) / viewport.zoom,
    }));
    points = [];
    return result;
  }

  function isActive(): boolean {
    return active;
  }

  function destroy(): void {
    svg.remove();
  }

  return { start, update, end, isActive, destroy };
}
