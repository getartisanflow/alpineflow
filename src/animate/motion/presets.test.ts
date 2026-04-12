import { describe, it, expect } from 'vitest';
import { resolveMotion } from './presets';
import type { MotionConfig, SpringMotion } from './types';

describe('resolveMotion', () => {
    it("resolves 'spring.wobbly' to the correct config", () => {
        const result = resolveMotion('spring.wobbly');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('spring');
        const spring = result as SpringMotion;
        expect(spring.stiffness).toBe(180);
        expect(spring.damping).toBe(12);
    });

    it("returns null for 'spring.nonexistent'", () => {
        expect(resolveMotion('spring.nonexistent')).toBeNull();
    });

    it('passes through an object config unchanged', () => {
        const config: MotionConfig = { type: 'spring', stiffness: 999, damping: 7 };
        const result = resolveMotion(config);
        expect(result).toBe(config);
    });

    it('returns null for a string with no dot separator', () => {
        expect(resolveMotion('spring')).toBeNull();
    });

    it('returns null for an unknown category', () => {
        expect(resolveMotion('unknown.preset')).toBeNull();
    });

    describe('all spring presets resolve', () => {
        const springPresets = ['gentle', 'wobbly', 'stiff', 'slow', 'molasses'];

        for (const name of springPresets) {
            it(`resolves 'spring.${name}'`, () => {
                const result = resolveMotion(`spring.${name}`);
                expect(result).not.toBeNull();
                expect(result?.type).toBe('spring');
            });
        }
    });

    describe('decay presets resolve', () => {
        it("resolves 'decay.smooth'", () => {
            const result = resolveMotion('decay.smooth');
            expect(result).not.toBeNull();
            expect(result?.type).toBe('decay');
        });

        it("resolves 'decay.snappy'", () => {
            const result = resolveMotion('decay.snappy');
            expect(result).not.toBeNull();
            expect(result?.type).toBe('decay');
        });

        it("returns null for 'decay.nonexistent'", () => {
            expect(resolveMotion('decay.nonexistent')).toBeNull();
        });
    });

    describe('inertia presets resolve', () => {
        it("resolves 'inertia.momentum'", () => {
            const result = resolveMotion('inertia.momentum');
            expect(result).not.toBeNull();
            expect(result?.type).toBe('inertia');
        });

        it("resolves 'inertia.rails'", () => {
            const result = resolveMotion('inertia.rails');
            expect(result).not.toBeNull();
            expect(result?.type).toBe('inertia');
        });

        it("returns null for 'inertia.nonexistent'", () => {
            expect(resolveMotion('inertia.nonexistent')).toBeNull();
        });
    });

    it('returns a copy of the preset (not the original reference)', () => {
        const result1 = resolveMotion('spring.wobbly');
        const result2 = resolveMotion('spring.wobbly');
        expect(result1).not.toBeNull();
        expect(result2).not.toBeNull();
        expect(result1).not.toBe(result2);
        expect(result1).toEqual(result2);
    });
});
