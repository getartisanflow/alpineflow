// ============================================================================
// Edge Transitions — Draw (dashoffset) and Fade (opacity)
//
// Pure calculation functions for offset/opacity values plus DOM helpers
// that apply the inline styles to SVG edge elements during animation.
// ============================================================================

// ── Pure calculations ───────────────────────────────────────────────────────

/** Stroke-dashoffset for draw-in: totalLength → 0 as progress goes 0 → 1. */
export function drawInOffset(totalLength: number, progress: number): number {
  return totalLength * (1 - progress);
}

/** Stroke-dashoffset for draw-out: 0 → totalLength as progress goes 0 → 1. */
export function drawOutOffset(totalLength: number, progress: number): number {
  return totalLength * progress;
}

/** Opacity value for fade transitions. */
export function fadeOpacity(progress: number, direction: 'in' | 'out'): number {
  return direction === 'in' ? progress : 1 - progress;
}

// ── DOM helpers ─────────────────────────────────────────────────────────────

/**
 * Apply draw transition styles to an SVG path element.
 * Re-reads getTotalLength() on each call so dynamic paths stay synchronized.
 *
 * Markers are hidden via inline CSS `marker-start/end: none` during draw-in
 * (until progress reaches 1) and during draw-out. Inline styles override the
 * SVG presentation attributes that Alpine's reactive effect may re-set at
 * any time, so this is race-condition-free.
 */
export function applyDrawTransition(
  pathEl: SVGPathElement,
  progress: number,
  direction: 'in' | 'out',
): void {
  const totalLength = pathEl.getTotalLength();
  pathEl.style.strokeDasharray = String(totalLength);
  const offset = direction === 'in'
    ? drawInOffset(totalLength, progress)
    : drawOutOffset(totalLength, progress);
  pathEl.style.strokeDashoffset = String(offset);

  // Hide markers while the stroke is still drawing so arrowheads don't
  // appear before the line reaches the endpoint. Using inline style
  // `marker-*: none` overrides the SVG attribute without removing it.
  if (direction === 'in' && progress < 1) {
    pathEl.style.setProperty('marker-start', 'none');
    pathEl.style.setProperty('marker-end', 'none');
  } else if (direction === 'out') {
    pathEl.style.setProperty('marker-start', 'none');
    pathEl.style.setProperty('marker-end', 'none');
  }
}

/** Remove draw transition inline styles so the edge renders normally. */
export function cleanupDrawTransition(pathEl: SVGPathElement): void {
  pathEl.style.removeProperty('stroke-dasharray');
  pathEl.style.removeProperty('stroke-dashoffset');
  pathEl.style.removeProperty('marker-start');
  pathEl.style.removeProperty('marker-end');
}

/** Apply fade transition opacity to an element. */
export function applyFadeTransition(
  el: SVGElement | HTMLElement,
  progress: number,
  direction: 'in' | 'out',
): void {
  el.style.opacity = String(fadeOpacity(progress, direction));
}

/** Remove fade transition inline styles. */
export function cleanupFadeTransition(el: SVGElement | HTMLElement): void {
  el.style.removeProperty('opacity');
}
