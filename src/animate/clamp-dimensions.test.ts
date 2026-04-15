import { describe, it, expect } from 'vitest';
import { clampDimensions } from './clamp-dimensions';

describe('clampDimensions', () => {
    it('returns observed dims unchanged when no bounds set', () => {
        const result = clampDimensions({ width: 300, height: 80 }, undefined, undefined);
        expect(result).toEqual({ width: 300, height: 80 });
    });

    it('clamps width to minDimensions lower bound', () => {
        const result = clampDimensions({ width: 50, height: 80 }, { width: 200, height: 40 }, undefined);
        expect(result).toEqual({ width: 200, height: 80 });
    });

    it('clamps height to maxDimensions upper bound', () => {
        const result = clampDimensions({ width: 300, height: 2000 }, undefined, { width: 600, height: 500 });
        expect(result).toEqual({ width: 300, height: 500 });
    });

    it('handles Infinity as upper bound (no clamp)', () => {
        const result = clampDimensions({ width: 300, height: 9999 }, undefined, { width: 600, height: Infinity });
        expect(result).toEqual({ width: 300, height: 9999 });
    });

    it('applies both min and max together', () => {
        const result = clampDimensions(
            { width: 10, height: 10000 },
            { width: 100, height: 40 },
            { width: 600, height: 500 },
        );
        expect(result).toEqual({ width: 100, height: 500 });
    });

    it('honors partial bounds — width floor without height floor', () => {
        const result = clampDimensions({ width: 50, height: 80 }, { width: 200 }, undefined);
        expect(result).toEqual({ width: 200, height: 80 });
    });

    it('honors partial bounds — height ceiling without width ceiling', () => {
        const result = clampDimensions({ width: 300, height: 1000 }, undefined, { height: 500 });
        expect(result).toEqual({ width: 300, height: 500 });
    });

    it('empty bounds objects are a no-op', () => {
        const result = clampDimensions({ width: 300, height: 80 }, {}, {});
        expect(result).toEqual({ width: 300, height: 80 });
    });
});
