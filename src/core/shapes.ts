// ============================================================================
// Built-in Shape Registry
//
// Each shape provides a perimeterPoint(w, h, position) function that returns
// the { x, y } coordinate (relative to the node's top-left origin) where an
// edge handle should connect for the given HandlePosition.
//
// Custom shapes registered via shapeTypes config use the same interface.
// ============================================================================

import type { HandlePosition, ShapeDefinition } from './types';

// ── Helpers ─────────────────────────────────────────────────────────

/** Rectangular fallback — same as the default getHandleCoords logic. */
function rectPerimeter(w: number, h: number, position: HandlePosition): { x: number; y: number } {
  switch (position) {
    case 'top':          return { x: w / 2, y: 0 };
    case 'right':        return { x: w,     y: h / 2 };
    case 'bottom':       return { x: w / 2, y: h };
    case 'left':         return { x: 0,     y: h / 2 };
    case 'top-left':     return { x: 0,     y: 0 };
    case 'top-right':    return { x: w,     y: 0 };
    case 'bottom-left':  return { x: 0,     y: h };
    case 'bottom-right': return { x: w,     y: h };
  }
}

// ── Circle / Ellipse ────────────────────────────────────────────────

function circlePerimeter(w: number, h: number, position: HandlePosition): { x: number; y: number } {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;

  switch (position) {
    case 'top':          return { x: cx,          y: 0 };
    case 'right':        return { x: w,           y: cy };
    case 'bottom':       return { x: cx,          y: h };
    case 'left':         return { x: 0,           y: cy };
    case 'top-right': {
      const a = -Math.PI / 4;
      return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
    }
    case 'top-left': {
      const a = -3 * Math.PI / 4;
      return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
    }
    case 'bottom-right': {
      const a = Math.PI / 4;
      return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
    }
    case 'bottom-left': {
      const a = 3 * Math.PI / 4;
      return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
    }
  }
}

// ── Diamond ─────────────────────────────────────────────────────────

function diamondPerimeter(w: number, h: number, position: HandlePosition): { x: number; y: number } {
  switch (position) {
    case 'top':          return { x: w / 2, y: 0 };
    case 'right':        return { x: w,     y: h / 2 };
    case 'bottom':       return { x: w / 2, y: h };
    case 'left':         return { x: 0,     y: h / 2 };
    case 'top-right':    return { x: w * 0.75, y: h * 0.25 };
    case 'top-left':     return { x: w * 0.25, y: h * 0.25 };
    case 'bottom-right': return { x: w * 0.75, y: h * 0.75 };
    case 'bottom-left':  return { x: w * 0.25, y: h * 0.75 };
  }
}

// ── Hexagon ─────────────────────────────────────────────────────────

function hexagonPerimeter(w: number, h: number, position: HandlePosition): { x: number; y: number } {
  switch (position) {
    case 'top':          return { x: w / 2,     y: 0 };
    case 'right':        return { x: w,         y: h / 2 };
    case 'bottom':       return { x: w / 2,     y: h };
    case 'left':         return { x: 0,         y: h / 2 };
    case 'top-right':    return { x: w * 0.75,  y: 0 };
    case 'top-left':     return { x: w * 0.25,  y: 0 };
    case 'bottom-right': return { x: w * 0.75,  y: h };
    case 'bottom-left':  return { x: w * 0.25,  y: h };
  }
}

// ── Parallelogram ───────────────────────────────────────────────────

function parallelogramPerimeter(w: number, h: number, position: HandlePosition): { x: number; y: number } {
  const skew = w * 0.15;
  switch (position) {
    case 'top':          return { x: w * 0.575,  y: 0 };
    case 'right':        return { x: w * 0.925,  y: h / 2 };
    case 'bottom':       return { x: w * 0.425,  y: h };
    case 'left':         return { x: w * 0.075,  y: h / 2 };
    case 'top-right':    return { x: w,          y: 0 };
    case 'top-left':     return { x: skew,       y: 0 };
    case 'bottom-right': return { x: w - skew,   y: h };
    case 'bottom-left':  return { x: 0,          y: h };
  }
}

// ── Triangle ────────────────────────────────────────────────────────

function trianglePerimeter(w: number, h: number, position: HandlePosition): { x: number; y: number } {
  switch (position) {
    case 'top':          return { x: w / 2,     y: 0 };
    case 'right':        return { x: w * 0.75,  y: h / 2 };
    case 'bottom':       return { x: w / 2,     y: h };
    case 'left':         return { x: w * 0.25,  y: h / 2 };
    case 'top-right':    return { x: w * 0.625, y: h * 0.25 };
    case 'top-left':     return { x: w * 0.375, y: h * 0.25 };
    case 'bottom-right': return { x: w,         y: h };
    case 'bottom-left':  return { x: 0,         y: h };
  }
}

// ── Cylinder ────────────────────────────────────────────────────────

function cylinderPerimeter(w: number, h: number, position: HandlePosition): { x: number; y: number } {
  const capH = h * 0.12;
  switch (position) {
    case 'top':          return { x: w / 2, y: capH };
    case 'right':        return { x: w,     y: h / 2 };
    case 'bottom':       return { x: w / 2, y: h - capH };
    case 'left':         return { x: 0,     y: h / 2 };
    case 'top-right':    return { x: w,     y: capH };
    case 'top-left':     return { x: 0,     y: capH };
    case 'bottom-right': return { x: w,     y: h - capH };
    case 'bottom-left':  return { x: 0,     y: h - capH };
  }
}

// ── Stadium (Pill) ──────────────────────────────────────────────────

function stadiumPerimeter(w: number, h: number, position: HandlePosition): { x: number; y: number } {
  const r = Math.min(w, h) / 2;
  const cx = w / 2;
  const cy = h / 2;

  switch (position) {
    case 'top':          return { x: cx, y: 0 };
    case 'right':        return { x: w,  y: cy };
    case 'bottom':       return { x: cx, y: h };
    case 'left':         return { x: 0,  y: cy };
    case 'top-right': {
      const capCx = w - r;
      const a = -Math.PI / 4;
      return { x: capCx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }
    case 'top-left': {
      const capCx = r;
      const a = -3 * Math.PI / 4;
      return { x: capCx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }
    case 'bottom-right': {
      const capCx = w - r;
      const a = Math.PI / 4;
      return { x: capCx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }
    case 'bottom-left': {
      const capCx = r;
      const a = 3 * Math.PI / 4;
      return { x: capCx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }
  }
}

// ── Registry ────────────────────────────────────────────────────────

/** Built-in shape definitions, keyed by NodeShape name. */
export const builtinShapes: Record<string, ShapeDefinition> = {
  circle:        { perimeterPoint: circlePerimeter },
  diamond:       { perimeterPoint: diamondPerimeter },
  hexagon:       { perimeterPoint: hexagonPerimeter },
  parallelogram: { perimeterPoint: parallelogramPerimeter },
  triangle:      { perimeterPoint: trianglePerimeter },
  cylinder:      { perimeterPoint: cylinderPerimeter },
  stadium:       { perimeterPoint: stadiumPerimeter },
};

/** Rectangular fallback for nodes without a shape or unknown shapes. */
export { rectPerimeter };
