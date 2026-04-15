import type { Dimensions } from '../core/types';

/**
 * Clamp observed dimensions to min/max bounds.
 *
 * Bounds are `Partial<Dimensions>` — either field may be undefined, meaning
 * "no constraint on that axis." Either bound object may itself be undefined.
 * Infinity is valid for unbounded upper.
 */
export function clampDimensions(
    observed: Dimensions,
    min: Partial<Dimensions> | undefined,
    max: Partial<Dimensions> | undefined,
): Dimensions {
    let { width, height } = observed;
    if (min?.width !== undefined) width = Math.max(width, min.width);
    if (min?.height !== undefined) height = Math.max(height, min.height);
    if (max?.width !== undefined) width = Math.min(width, max.width);
    if (max?.height !== undefined) height = Math.min(height, max.height);
    return { width, height };
}
