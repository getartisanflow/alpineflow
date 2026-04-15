import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLayoutDedup } from './canvas-layout-dedup';

describe('canvas layout dedup', () => {
    let rafCallbacks: (() => void)[];
    let originalRAF: typeof requestAnimationFrame;
    let originalCAF: typeof cancelAnimationFrame;

    beforeEach(() => {
        rafCallbacks = [];
        originalRAF = globalThis.requestAnimationFrame;
        originalCAF = globalThis.cancelAnimationFrame;
        globalThis.requestAnimationFrame = ((cb: () => void) => {
            rafCallbacks.push(cb);
            return rafCallbacks.length;
        }) as any;
        globalThis.cancelAnimationFrame = ((handle: number) => {
            // No-op in mock; tests don't rely on cancel.
        }) as any;
    });

    afterEach(() => {
        globalThis.requestAnimationFrame = originalRAF;
        globalThis.cancelAnimationFrame = originalCAF;
    });

    function tickFrame() {
        const callbacks = rafCallbacks;
        rafCallbacks = [];
        callbacks.forEach(cb => cb());
    }

    it('runs layoutFn exactly once per parent per frame', () => {
        const layoutFn = vi.fn();
        const { safeLayoutChildren } = createLayoutDedup(layoutFn);

        safeLayoutChildren('parent-1');
        safeLayoutChildren('parent-1');
        safeLayoutChildren('parent-1');

        expect(layoutFn).toHaveBeenCalledTimes(1);
        expect(layoutFn).toHaveBeenCalledWith('parent-1');
    });

    it('allows different parents in the same frame', () => {
        const layoutFn = vi.fn();
        const { safeLayoutChildren } = createLayoutDedup(layoutFn);

        safeLayoutChildren('parent-1');
        safeLayoutChildren('parent-2');

        expect(layoutFn).toHaveBeenCalledTimes(2);
    });

    it('allows the same parent again in the next frame', () => {
        const layoutFn = vi.fn();
        const { safeLayoutChildren } = createLayoutDedup(layoutFn);

        safeLayoutChildren('parent-1');
        tickFrame();
        safeLayoutChildren('parent-1');

        expect(layoutFn).toHaveBeenCalledTimes(2);
    });

    it('runs layoutFn synchronously on first call', () => {
        const layoutFn = vi.fn();
        const { safeLayoutChildren } = createLayoutDedup(layoutFn);

        safeLayoutChildren('parent-1');
        // Don't tick frame — verify call already happened
        expect(layoutFn).toHaveBeenCalledTimes(1);
    });

    it('suppresses layout after 5 consecutive frames', () => {
        const layoutFn = vi.fn();
        const { safeLayoutChildren } = createLayoutDedup(layoutFn);
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        for (let i = 0; i < 7; i++) {
            safeLayoutChildren('parent-1');
            tickFrame();
        }

        // First 6 calls pass the suppression check (frame 1–6 increment count 1..6).
        // Only on frame 6's RAF does count reach 6 > cap 5 → suppression kicks in.
        // Frame 7's call hits suppressed guard → no-op. So layoutFn runs 6 times.
        expect(layoutFn).toHaveBeenCalledTimes(6);
        expect(warnSpy).toHaveBeenCalledOnce();
        expect(warnSpy.mock.calls[0][0]).toContain('parent-1');
        warnSpy.mockRestore();
    });

    it('resets consecutive counter when parent skips a frame', () => {
        const layoutFn = vi.fn();
        const { safeLayoutChildren } = createLayoutDedup(layoutFn);

        for (let i = 0; i < 3; i++) {
            safeLayoutChildren('parent-1');
            tickFrame();
        }
        // Skip two frames (no layout calls → no RAFs scheduled from this dedup
        // instance, but we need to advance frame state. Force it by calling an
        // unrelated parent that just ticks the frame cleanup).
        safeLayoutChildren('unrelated');
        tickFrame();
        safeLayoutChildren('unrelated');
        tickFrame();

        for (let i = 0; i < 3; i++) {
            safeLayoutChildren('parent-1');
            tickFrame();
        }

        // parent-1 called 6 times across 6 frames, with a 2-frame gap resetting
        // its consecutive counter. Never hit cap, so all 6 ran.
        const parent1Calls = layoutFn.mock.calls.filter(c => c[0] === 'parent-1');
        expect(parent1Calls.length).toBe(6);
    });

    it('resetLoopCounter clears suppression', () => {
        const layoutFn = vi.fn();
        const { safeLayoutChildren, resetLoopCounter } = createLayoutDedup(layoutFn);
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        for (let i = 0; i < 7; i++) {
            safeLayoutChildren('parent-1');
            tickFrame();
        }
        resetLoopCounter('parent-1');
        safeLayoutChildren('parent-1');
        tickFrame();

        // 6 ran before suppression + 1 after reset = 7 total.
        expect(layoutFn).toHaveBeenCalledTimes(7);
        warnSpy.mockRestore();
    });
});
