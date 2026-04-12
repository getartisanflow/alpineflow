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

/** Resolve an easing name or custom function to a callable (t: number) => number. */
export function resolveEasing(easing?: EasingName | EasingFn): EasingFn {
  if (typeof easing === 'function') {
    return easing;
  }
  return EASING_MAP[easing ?? 'easeInOut'];
}
