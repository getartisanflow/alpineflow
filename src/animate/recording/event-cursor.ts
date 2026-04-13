import type { RecordingEvent } from './types';

/**
 * Binary-search the first event index whose `t` is strictly greater than `t`.
 * Events are assumed to be sorted by `t` ascending (guaranteed by the Recorder).
 * Returns `events.length` if all events have `t <= boundary`.
 */
export function firstEventIndexAfter(
    events: ReadonlyArray<RecordingEvent>,
    boundary: number,
): number {
    let lo = 0;
    let hi = events.length;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (events[mid].t > boundary) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return lo;
}

/**
 * Binary-search the first event index whose `t` is >= `t`. Used when we need
 * to include events exactly at the boundary (e.g. "apply events at startT").
 */
export function firstEventIndexAtOrAfter(
    events: ReadonlyArray<RecordingEvent>,
    boundary: number,
): number {
    let lo = 0;
    let hi = events.length;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (events[mid].t >= boundary) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return lo;
}
