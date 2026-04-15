import type { LayoutDedup } from './canvas-layout-dedup';

/**
 * Returns a `batch(fn)` function that suspends layout reconciliation
 * during `fn` and runs it once after. Nested batches join the outermost —
 * inner `batch()` calls increment a depth counter and only the outermost
 * decrements to 0 and reconciles. Reconciliation runs via try/finally so
 * a thrown `fn` still reconciles before the error propagates. `fn`'s
 * return value is forwarded.
 */
export function createBatch(dedup: LayoutDedup): <T>(fn: () => T) => T {
    return function batch<T>(fn: () => T): T {
        dedup.suspend();
        try {
            return fn();
        } finally {
            dedup.resume();
        }
    };
}
