// ============================================================================
// Path Functions — Factories that produce (t: number) => { x, y } functions
//
// Used by FlowTimeline's followPath feature to drive node positions along
// arbitrary curves instead of linear interpolation.
// ============================================================================

/** Full circle in radians. */
export const TAU = Math.PI * 2;

/** A function that maps normalised progress (0-1) to flow-space coordinates. */
export type PathFunction = (t: number) => { x: number; y: number };

// ── SVG Path ────────────────────────────────────────────────────────────────

/**
 * Convert an SVG path `d` attribute string into a PathFunction.
 * Creates an off-screen <path> element for geometry calculations.
 * Returns null in environments without SVG DOM support (e.g. Node/vitest).
 */
export function svgPathToFunction(d: string): PathFunction | null {
  if (typeof document === 'undefined' || typeof document.createElementNS !== 'function') {
    return null;
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  const totalLength = path.getTotalLength();

  return (t: number) => {
    const pt = path.getPointAtLength(t * totalLength);
    return { x: pt.x, y: pt.y };
  };
}

// ── Orbit ───────────────────────────────────────────────────────────────────

export interface OrbitConfig {
  cx: number;
  cy: number;
  radius?: number;
  rx?: number;
  ry?: number;
  offset?: number;
  clockwise?: boolean;
}

/** Circular/elliptical motion around a center point. */
export function orbit(config: OrbitConfig): PathFunction {
  const { cx, cy, offset = 0, clockwise = true } = config;
  const rx = config.rx ?? config.radius ?? 100;
  const ry = config.ry ?? config.radius ?? 100;
  const dir = clockwise ? 1 : -1;

  return (t: number) => ({
    x: cx + rx * Math.cos(TAU * t * dir + offset * TAU),
    y: cy + ry * Math.sin(TAU * t * dir + offset * TAU),
  });
}

// ── Wave ────────────────────────────────────────────────────────────────────

export interface WaveConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  amplitude?: number;
  frequency?: number;
  offset?: number;
}

/** Sinusoidal oscillation along a start-end axis with perpendicular displacement. */
export function wave(config: WaveConfig): PathFunction {
  const { startX, startY, endX, endY, amplitude = 30, frequency = 1, offset = 0 } = config;
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = length > 0 ? dx / length : 1;
  const uy = length > 0 ? dy / length : 0;
  const px = -uy; // perpendicular
  const py = ux;

  return (t: number) => {
    const baseX = startX + dx * t;
    const baseY = startY + dy * t;
    const w = amplitude * Math.sin(TAU * frequency * t + offset * TAU);
    return { x: baseX + px * w, y: baseY + py * w };
  };
}

// ── Along ───────────────────────────────────────────────────────────────────

export interface AlongConfig {
  reverse?: boolean;
  startAt?: number;
  endAt?: number;
}

/** Convenience wrapper around svgPathToFunction with reverse/startAt/endAt. */
export function along(path: string, config?: AlongConfig): PathFunction | null {
  const baseFn = svgPathToFunction(path);
  if (!baseFn) return null;
  const { reverse = false, startAt = 0, endAt = 1 } = config ?? {};
  const range = endAt - startAt;
  return (t: number) => {
    let mapped = startAt + t * range;
    if (reverse) mapped = endAt - t * range;
    return baseFn(mapped);
  };
}

// ── Pendulum ────────────────────────────────────────────────────────────────

export interface PendulumConfig {
  cx: number;
  cy: number;
  radius: number;
  angle?: number;
  offset?: number;
}

/** Swinging arc around a pivot. Node hangs down (positive y) from the pivot. */
export function pendulum(config: PendulumConfig): PathFunction {
  const { cx, cy, radius, angle = 60, offset = 0 } = config;
  const maxRadians = (angle * Math.PI) / 180;
  return (t: number) => {
    const theta = maxRadians * Math.sin(TAU * t + offset * TAU);
    return {
      x: cx + radius * Math.sin(theta),
      y: cy + radius * Math.cos(theta),
    };
  };
}

// ── Drift ───────────────────────────────────────────────────────────────────

export interface DriftConfig {
  originX: number;
  originY: number;
  range?: number;
  speed?: number;
  seed?: number;
}

/** Smooth pseudo-random wandering using sine-sum noise. */
export function drift(config: DriftConfig): PathFunction {
  const { originX, originY, range = 20, speed = 1, seed = 0 } = config;
  const a1 = 1.0 + (seed % 7) * 0.3;
  const a2 = 1.3 + (seed % 11) * 0.2;
  const b1 = 0.7 + (seed % 13) * 0.25;
  const b2 = 1.1 + (seed % 17) * 0.15;
  return (t: number) => {
    const s = t * speed * TAU;
    const nx = (Math.sin(a1 * s) + Math.sin(a2 * s * 1.3)) / 2;
    const ny = (Math.sin(b1 * s * 0.9) + Math.sin(b2 * s * 1.1)) / 2;
    return { x: originX + nx * range, y: originY + ny * range };
  };
}

// ── Stagger ─────────────────────────────────────────────────────────────────

/** Distributes offset values across items. */
export function stagger(
  amount: number,
  options?: { from?: number },
): (index: number, total: number) => number {
  const from = options?.from ?? 0;
  return (index: number, _total: number) => from + index * amount;
}
