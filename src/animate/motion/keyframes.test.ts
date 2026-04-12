import { describe, it, expect } from 'vitest';
import { stepKeyframes } from './keyframes';
import type { PhysicsState, KeyframesMotion } from './types';

function makeState(value = 0): PhysicsState {
    return { value, target: 0, velocity: 0, settled: false };
}

describe('stepKeyframes', () => {
    it('interpolates between waypoints', () => {
        const state = makeState();
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ x: 0 }, { x: 50 }, { x: 100 }],
        };

        // At progress 0 — first value
        stepKeyframes(state, config, 0, 'x');
        expect(state.value).toBe(0);
        expect(state.settled).toBe(false);

        // At progress 0.25 — halfway through first segment
        stepKeyframes(state, config, 0.25, 'x');
        expect(state.value).toBe(25);

        // At progress 0.5 — at second waypoint
        stepKeyframes(state, config, 0.5, 'x');
        expect(state.value).toBe(50);

        // At progress 0.75 — halfway through second segment
        stepKeyframes(state, config, 0.75, 'x');
        expect(state.value).toBe(75);
    });

    it('custom offsets', () => {
        const state = makeState();
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ x: 0 }, { x: 100 }, { x: 50 }],
            offsets: [0, 0.2, 1],
        };

        // At progress 0.1 — halfway through first segment (0 -> 0.2)
        stepKeyframes(state, config, 0.1, 'x');
        expect(state.value).toBe(50);

        // At progress 0.2 — at second waypoint
        stepKeyframes(state, config, 0.2, 'x');
        expect(state.value).toBe(100);

        // At progress 0.6 — halfway through second segment (0.2 -> 1.0)
        stepKeyframes(state, config, 0.6, 'x');
        expect(state.value).toBe(75);
    });

    it('reaches final value at progress=1', () => {
        const state = makeState();
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ x: 0 }, { x: 50 }, { x: 200 }],
        };

        stepKeyframes(state, config, 1, 'x');
        expect(state.value).toBe(200);
        expect(state.settled).toBe(true);
    });

    it('handles single value — settles immediately and sets value to that waypoint', () => {
        const state = makeState(42);
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ x: 100 }],
        };

        stepKeyframes(state, config, 0.5, 'x');
        expect(state.settled).toBe(true);
        expect(state.value).toBe(100);
    });

    it('single waypoint with missing key falls back to existing state.value', () => {
        const state = makeState(42);
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ y: 7 }], // missing key 'x'
        };

        stepKeyframes(state, config, 0.5, 'x');
        expect(state.settled).toBe(true);
        expect(state.value).toBe(42);
    });

    it('progress clamping — below 0', () => {
        const state = makeState();
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ x: 0 }, { x: 100 }],
        };

        stepKeyframes(state, config, -0.5, 'x');
        expect(state.value).toBe(0); // clamped to 0
    });

    it('progress clamping — above 1', () => {
        const state = makeState();
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ x: 0 }, { x: 100 }],
        };

        stepKeyframes(state, config, 1.5, 'x');
        expect(state.value).toBe(100); // clamped to 1 and settled
        expect(state.settled).toBe(true);
    });

    it('missing key uses state.value as fallback', () => {
        const state = makeState(25);
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ y: 0 }, { y: 100 }], // only y, no x
        };

        stepKeyframes(state, config, 0.5, 'x');
        // Both waypoints fall back to state.value (25), so interpolation is 25
        expect(state.value).toBe(25);
    });

    it('handles two waypoints (single segment)', () => {
        const state = makeState();
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ x: 10 }, { x: 90 }],
        };

        stepKeyframes(state, config, 0.5, 'x');
        expect(state.value).toBe(50);

        stepKeyframes(state, config, 0, 'x');
        expect(state.value).toBe(10);
    });

    it('handles many waypoints', () => {
        const state = makeState();
        const config: KeyframesMotion = {
            type: 'keyframes',
            values: [{ x: 0 }, { x: 25 }, { x: 50 }, { x: 75 }, { x: 100 }],
        };

        // At 0 — first value
        stepKeyframes(state, config, 0, 'x');
        expect(state.value).toBe(0);

        // At 0.5 — should be at the middle waypoint (50)
        stepKeyframes(state, config, 0.5, 'x');
        expect(state.value).toBe(50);

        // At 1 — final value
        stepKeyframes(state, config, 1, 'x');
        expect(state.value).toBe(100);
        expect(state.settled).toBe(true);
    });
});
