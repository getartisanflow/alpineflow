import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createBatch } from './canvas-batch';
import { createLayoutDedup } from './canvas-layout-dedup';

describe('createBatch', () => {
    let originalRAF: typeof requestAnimationFrame;
    let originalCAF: typeof cancelAnimationFrame;

    beforeEach(() => {
        originalRAF = globalThis.requestAnimationFrame;
        originalCAF = globalThis.cancelAnimationFrame;
        globalThis.requestAnimationFrame = ((cb: () => void) => 1) as any;
        globalThis.cancelAnimationFrame = ((_handle: number) => {}) as any;
    });

    afterEach(() => {
        globalThis.requestAnimationFrame = originalRAF;
        globalThis.cancelAnimationFrame = originalCAF;
    });

    it('returns fn return value', () => {
        const dedup = createLayoutDedup(vi.fn());
        const batch = createBatch(dedup);
        const result = batch(() => 'hello');
        expect(result).toBe('hello');
    });

    it('returns typed values', () => {
        const dedup = createLayoutDedup(vi.fn());
        const batch = createBatch(dedup);
        const num: number = batch(() => 42);
        const arr: number[] = batch(() => [1, 2, 3]);
        expect(num).toBe(42);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('suspends layouts during fn and runs once after', () => {
        const layoutFn = vi.fn();
        const dedup = createLayoutDedup(layoutFn);
        const batch = createBatch(dedup);

        batch(() => {
            dedup.safeLayoutChildren('parent-1');
            dedup.safeLayoutChildren('parent-1');
            dedup.safeLayoutChildren('parent-1');
        });

        expect(layoutFn).toHaveBeenCalledTimes(1);
        expect(layoutFn).toHaveBeenCalledWith('parent-1');
    });

    it('runs reconciliation even if fn throws', () => {
        const layoutFn = vi.fn();
        const dedup = createLayoutDedup(layoutFn);
        const batch = createBatch(dedup);

        expect(() => batch(() => {
            dedup.safeLayoutChildren('parent-1');
            throw new Error('boom');
        })).toThrow('boom');

        expect(layoutFn).toHaveBeenCalledTimes(1);
    });

    it('nested batches — only outer triggers reconciliation', () => {
        const layoutFn = vi.fn();
        const dedup = createLayoutDedup(layoutFn);
        const batch = createBatch(dedup);

        batch(() => {
            dedup.safeLayoutChildren('parent-1');
            batch(() => {
                dedup.safeLayoutChildren('parent-2');
            });
            // Inner batch exited, but outer still suspended — no layouts yet.
            expect(layoutFn).not.toHaveBeenCalled();
        });

        expect(layoutFn).toHaveBeenCalledTimes(2);
    });
});
