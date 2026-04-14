/**
 * Extract the axis letter ("x", "y", or "zoom") from a PropertyEntry key
 * like "node:id:position.x" or "viewport:pan.x".
 *
 * This lets physics configs (decay velocity, inertia bounds, snap points)
 * be authored with natural axis keys { x: 400, y: 0 } instead of full
 * property paths.
 *
 * Returns null if the key doesn't end with a recognized axis segment.
 */
export function extractAxis(key: string): string | null {
    const dotIdx = key.lastIndexOf('.');
    const colonIdx = key.lastIndexOf(':');
    const sepIdx = Math.max(dotIdx, colonIdx);
    if (sepIdx < 0) return null;
    const tail = key.slice(sepIdx + 1);
    // Only treat short alphanumeric tails as axes — filters out things like
    // "position" or "dimensions" that shouldn't match.
    if (tail.length === 0 || tail.length > 6) return null;
    return tail;
}
