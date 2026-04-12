import { describe, it, expect } from 'vitest';
import { stepInertia } from './inertia';
import type { PhysicsState, InertiaMotion } from './types';

function makeState(value: number, velocity: number): PhysicsState {
    return { value, target: 0, velocity, settled: false };
}

describe('stepInertia', () => {
    it('bounds bounce — reverses velocity at lower bound', () => {
        // Moving left fast, should hit lower bound
        const state = makeState(-5, -500);
        const config: InertiaMotion = {
            type: 'inertia',
            velocity: -500,
            bounds: { x: [0, 100] },
            bounceDamping: 50,
        };
        const dt = 1 / 60;

        stepInertia(state, config, dt, 'x');

        // Should bounce off the lower bound
        expect(state.value).toBe(0);
        expect(state.velocity).toBeGreaterThan(0); // reversed direction
        expect(state.settled).toBe(false);
    });

    it('bounds bounce — reverses velocity at upper bound', () => {
        // Moving right fast, should hit upper bound
        const state = makeState(105, 500);
        const config: InertiaMotion = {
            type: 'inertia',
            velocity: 500,
            bounds: { x: [0, 100] },
            bounceDamping: 50,
        };
        const dt = 1 / 60;

        stepInertia(state, config, dt, 'x');

        // Should bounce off the upper bound
        expect(state.value).toBe(100);
        expect(state.velocity).toBeLessThan(0); // reversed direction
        expect(state.settled).toBe(false);
    });

    it('snap points — snaps to nearest point on settle', () => {
        // Already near-settled with low velocity
        const state = makeState(47, 0.1);
        state.settled = false;
        const config: InertiaMotion = {
            type: 'inertia',
            velocity: 0.1,
            snapTo: [{ x: 0 }, { x: 50 }, { x: 100 }],
        };
        const dt = 1 / 60;

        // Run until settled
        for (let i = 0; i < 600; i++) {
            stepInertia(state, config, dt, 'x');
            if (state.settled) {
                break;
            }
        }

        expect(state.settled).toBe(true);
        expect(state.value).toBe(50); // nearest snap point
    });

    it('settles within bounds', () => {
        const state = makeState(50, 200);
        const config: InertiaMotion = {
            type: 'inertia',
            velocity: 200,
            bounds: { x: [0, 100] },
        };
        const dt = 1 / 60;

        for (let i = 0; i < 600; i++) {
            stepInertia(state, config, dt, 'x');
            if (state.settled) {
                break;
            }
        }

        expect(state.settled).toBe(true);
        expect(state.value).toBeGreaterThanOrEqual(0);
        expect(state.value).toBeLessThanOrEqual(100);
    });

    it('no bounds = pure decay', () => {
        const state = makeState(0, 500);
        const config: InertiaMotion = {
            type: 'inertia',
            velocity: 500,
        };
        const dt = 1 / 60;

        for (let i = 0; i < 600; i++) {
            stepInertia(state, config, dt, 'x');
            if (state.settled) {
                break;
            }
        }

        expect(state.settled).toBe(true);
        // Should have moved in the positive direction and settled
        expect(state.value).toBeGreaterThan(0);
    });

    it('bounceDamping affects bounce strength', () => {
        // Same scenario, different damping
        const stateHigh = makeState(-5, -500);
        const stateLow = makeState(-5, -500);

        const configHigh: InertiaMotion = {
            type: 'inertia',
            velocity: -500,
            bounds: { x: [0, 100] },
            bounceDamping: 80, // 80% of velocity preserved
        };
        const configLow: InertiaMotion = {
            type: 'inertia',
            velocity: -500,
            bounds: { x: [0, 100] },
            bounceDamping: 20, // 20% of velocity preserved
        };
        const dt = 1 / 60;

        stepInertia(stateHigh, configHigh, dt, 'x');
        stepInertia(stateLow, configLow, dt, 'x');

        // Higher damping preserves more velocity on bounce
        expect(Math.abs(stateHigh.velocity)).toBeGreaterThan(Math.abs(stateLow.velocity));
    });

    it('dt=0 does not modify state', () => {
        const state = makeState(50, 200);
        const config: InertiaMotion = {
            type: 'inertia',
            velocity: 200,
            bounds: { x: [0, 100] },
        };

        stepInertia(state, config, 0, 'x');

        expect(state.value).toBe(50);
        expect(state.velocity).toBe(200);
        expect(state.settled).toBe(false);
    });

    it('ignores bounds for keys without axis bounds', () => {
        const state = makeState(150, 100);
        const config: InertiaMotion = {
            type: 'inertia',
            velocity: 100,
            bounds: { x: [0, 100] }, // only x is bounded
        };
        const dt = 1 / 60;

        // Applying for 'y' key — no y bounds, so no bounce
        stepInertia(state, config, dt, 'y');

        // Value should have moved (decay applied) but not bounced
        expect(state.value).toBeGreaterThan(150);
    });

    it('snap points work with multiple axes', () => {
        const state = makeState(73, 0.1);
        state.settled = false;
        const config: InertiaMotion = {
            type: 'inertia',
            velocity: 0.1,
            snapTo: [{ x: 0, y: 25 }, { x: 50, y: 75 }, { x: 100, y: 100 }],
        };
        const dt = 1 / 60;

        for (let i = 0; i < 600; i++) {
            stepInertia(state, config, dt, 'y');
            if (state.settled) {
                break;
            }
        }

        expect(state.settled).toBe(true);
        expect(state.value).toBe(75); // nearest y snap point
    });
});
