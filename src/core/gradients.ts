import type { EdgeGradient } from './types';

/**
 * Type guard: is this color value a gradient object?
 */
export function isGradient(color: string | EdgeGradient | undefined): color is EdgeGradient {
  return typeof color === 'object' && color !== null && 'from' in color && 'to' in color;
}

/**
 * Generate a unique gradient def ID for an edge.
 * Format: {flowId}__grad__{edgeId}
 */
export function getGradientId(flowId: string, edgeId: string): string {
  return `${flowId}__grad__${edgeId}`;
}

/**
 * Extract a single solid color from any color value.
 * For gradients, returns the `from` color (used as fallback for selection highlight, etc.).
 */
export function resolveStrokeColor(color: string | EdgeGradient | undefined): string | null {
  if (!color) return null;
  if (isGradient(color)) return color.from;
  return color;
}

/**
 * Create or update an SVG <linearGradient> element in a <defs> container.
 * Uses gradientUnits="userSpaceOnUse" so coordinates are in SVG canvas space.
 *
 * @returns The gradient element.
 *
 * // TODO(future): Support radial gradients via <radialGradient>
 * // TODO(future): Support multi-stop gradients (3+ color stops)
 * // TODO(future): Support path-following gradients via <pattern>
 */
export function upsertGradientDef(
  defsEl: Element,
  id: string,
  gradient: EdgeGradient,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): SVGLinearGradientElement {
  let gradEl = defsEl.querySelector(`#${CSS.escape(id)}`) as SVGLinearGradientElement | null;

  if (!gradEl) {
    gradEl = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradEl.id = id;
    gradEl.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradEl.classList.add('flow-edge-gradient');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    gradEl.appendChild(stop1);

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    gradEl.appendChild(stop2);

    defsEl.appendChild(gradEl);
  }

  // Update coordinates
  gradEl.setAttribute('x1', String(x1));
  gradEl.setAttribute('y1', String(y1));
  gradEl.setAttribute('x2', String(x2));
  gradEl.setAttribute('y2', String(y2));

  // Update stop colors
  const stops = gradEl.querySelectorAll('stop');
  stops[0]?.setAttribute('stop-color', gradient.from);
  stops[1]?.setAttribute('stop-color', gradient.to);

  return gradEl;
}

/**
 * Remove a gradient def by ID from a <defs> container.
 */
export function removeGradientDef(defsEl: Element, id: string): void {
  defsEl.querySelector(`#${CSS.escape(id)}`)?.remove();
}
