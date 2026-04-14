// ============================================================================
// Easing — d3-ease name-to-function mapping
//
// Maps friendly preset names to d3-ease functions. Custom easing functions
// are passed through unchanged. Falls back to easeInOut when unspecified.
// ============================================================================

import {
  easeLinear,
  easeQuadIn,
  easeQuadOut,
  easeQuadInOut,
  easeCubicIn,
  easeCubicOut,
  easeCubicInOut,
  easeCircleIn,
  easeCircleOut,
  easeCircleInOut,
  easeSinIn,
  easeSinOut,
  easeSinInOut,
  easeExpIn,
  easeExpOut,
  easeExpInOut,
  easeBounceIn,
  easeBounceOut,
  easeBounceInOut,
  easeElasticIn,
  easeElasticOut,
  easeElasticInOut,
  easeBackIn,
  easeBackOut,
  easeBackInOut,
} from 'd3-ease';

export type EasingName =
  | 'linear'
  | 'easeIn' | 'easeOut' | 'easeInOut'
  | 'easeCubicIn' | 'easeCubicOut' | 'easeCubicInOut'
  | 'easeCircIn' | 'easeCircOut' | 'easeCircInOut'
  | 'easeSinIn' | 'easeSinOut' | 'easeSinInOut'
  | 'easeExpoIn' | 'easeExpoOut' | 'easeExpoInOut'
  | 'easeBounce' | 'easeBounceIn' | 'easeBounceInOut'
  | 'easeElastic' | 'easeElasticIn' | 'easeElasticInOut'
  | 'easeBack' | 'easeBackIn' | 'easeBackOut';

export type EasingFn = (t: number) => number;

// Abbreviated names (easeCirc*, easeExpo*) map to d3-ease's easeCircle*, easeExp*
// for conciseness. Kept short since these appear in user-facing config.
const EASING_MAP: Record<EasingName, EasingFn> = {
  linear: easeLinear,
  easeIn: easeQuadIn,
  easeOut: easeQuadOut,
  easeInOut: easeQuadInOut,
  easeCubicIn: easeCubicIn,
  easeCubicOut: easeCubicOut,
  easeCubicInOut: easeCubicInOut,
  easeCircIn: easeCircleIn,
  easeCircOut: easeCircleOut,
  easeCircInOut: easeCircleInOut,
  easeSinIn: easeSinIn,
  easeSinOut: easeSinOut,
  easeSinInOut: easeSinInOut,
  easeExpoIn: easeExpIn,
  easeExpoOut: easeExpOut,
  easeExpoInOut: easeExpInOut,
  easeBounce: easeBounceOut,
  easeBounceIn: easeBounceIn,
  easeBounceInOut: easeBounceInOut,
  easeElastic: easeElasticOut,
  easeElasticIn: easeElasticIn,
  easeElasticInOut: easeElasticInOut,
  easeBack: easeBackInOut,
  easeBackIn: easeBackIn,
  easeBackOut: easeBackOut,
};

/**
 * Check whether reduced motion should be applied given a user preference.
 *
 * - `false`     — always animate (ignore OS setting)
 * - `true`      — always skip animation
 * - `'auto'` / `undefined` — honour the OS `prefers-reduced-motion` media query
 *
 * Shared by FlowTimeline and the canvas-animation mixin so both follow
 * the same logic without diverging.
 */
export function checkReducedMotion(preference: boolean | 'auto' | undefined): boolean {
  const pref = preference ?? 'auto';
  if (pref === false) return false;
  if (pref === true) return true;
  return typeof globalThis !== 'undefined'
    && globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
}

/** Resolve an easing name or custom function to a callable (t: number) => number. */
export function resolveEasing(easing?: EasingName | EasingFn): EasingFn {
  if (typeof easing === 'function') {
    return easing;
  }
  return EASING_MAP[easing ?? 'easeInOut'];
}
