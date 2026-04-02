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
  easeBounceOut,
  easeElasticOut,
  easeBackInOut,
} from 'd3-ease';

export type EasingName =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeBounce'
  | 'easeElastic'
  | 'easeBack';

export type EasingFn = (t: number) => number;

const EASING_MAP: Record<EasingName, EasingFn> = {
  linear: easeLinear,
  easeIn: easeQuadIn,
  easeOut: easeQuadOut,
  easeInOut: easeQuadInOut,
  easeBounce: easeBounceOut,
  easeElastic: easeElasticOut,
  easeBack: easeBackInOut,
};

/** Resolve an easing name or custom function to a callable (t: number) => number. */
export function resolveEasing(easing?: EasingName | EasingFn): EasingFn {
  if (typeof easing === 'function') {
    return easing;
  }
  return EASING_MAP[easing ?? 'easeInOut'];
}
