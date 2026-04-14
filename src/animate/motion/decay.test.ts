import { describe, it, expect } from 'vitest';
import { stepDecay, DECAY_DEFAULTS } from './decay';
import type { PhysicsState, DecayMotion } from './types';

function makeState(value: number, velocity: number): PhysicsState {
    return { value, target: 0, velocity, settled: false };
}

describe('stepDecay', () => {
    it('velocity decreases each step', () => {
        const state = makeState(0, 500);
        const config: DecayMotion = { type: 'decay', velocity: 500 };
        const dt = 1 / 60;

        const initialVelocity = state.velocity;
        stepDecay(state, config, dt);

        expect(Math.abs(state.velocity)).toBeLessThan(Math.abs(initialVelocity));
    });

    it('value changes in velocity direction (positive)', () => {
        const state = makeState(0, 500);
        const config: DecayMotion = { type: 'decay', velocity: 500 };
        const dt = 1 / 60;

        stepDecay(state, config, dt);

        expect(state.value).toBeGreaterThan(0);
    });

    it('value changes in velocity direction (negative)', () => {
        const state = makeState(100, -500);
        const config: DecayMotion = { type: 'decay', velocity: -500 };
        const dt = 1 / 60;

        stepDecay(state, config, dt);

        expect(state.value).toBeLessThan(100);
    });

    it('settles when velocity near zero', () => {
        const state = makeState(0, 500);
        const config: DecayMotion = { type: 'decay', velocity: 500 };
        const dt = 1 / 60;

        for (let i = 0; i < 600; i++) {
            stepDecay(state, config, dt);
            if (state.settled) {
                break;
            }
        }

        expect(state.settled).toBe(true);
        expect(state.velocity).toBe(0);
        // Target should be wherever it landed
        expect(state.target).toBe(state.value);
    });

    it('power does not affect per-frame decay (one-shot at animate() entry)', () => {
        // `power` is deliberately ignored by the integrator — it is applied
        // once as an initial velocity multiplier in Animator.animate(). Passing
        // different `power` values to stepDecay with identical initial state
        // must therefore produce identical trajectories.
        const stateHigh = makeState(0, 500);
        const stateLow = makeState(0, 500);

        const configHigh: DecayMotion = { type: 'decay', velocity: 500, power: 0.95 };
        const configLow: DecayMotion = { type: 'decay', velocity: 500, power: 0.5 };
        const dt = 1 / 60;

        for (let i = 0; i < 10; i++) {
            stepDecay(stateHigh, configHigh, dt);
            stepDecay(stateLow, configLow, dt);
        }

        expect(stateHigh.velocity).toBe(stateLow.velocity);
        expect(stateHigh.value).toBe(stateLow.value);
    });

    it('does not diverge when power > 1 (regression: decay.snappy stability)', () => {
        // The snappy preset ships with power: 1.2, timeConstant: 200. Before the
        // fix, the per-frame `* power` term pushed the multiplier above 1.0 and
        // velocity grew without bound. Now power is ignored here, and velocity
        // must monotonically decay and settle.
        const state = makeState(0, 500);
        const config: DecayMotion = { type: 'decay', velocity: 500, power: 1.2, timeConstant: 200 };
        const dt = 1 / 60;

        let maxVelocitySeen = Math.abs(state.velocity);
        for (let i = 0; i < 300; i++) {
            stepDecay(state, config, dt);
            maxVelocitySeen = Math.max(maxVelocitySeen, Math.abs(state.velocity));
            if (state.settled) {
                break;
            }
        }

        // Velocity must never exceed its initial magnitude (pure decay).
        expect(maxVelocitySeen).toBeLessThanOrEqual(500);
        expect(state.settled).toBe(true);
        expect(Number.isFinite(state.value)).toBe(true);
        // The travelled distance is bounded — certainly not millions of units.
        expect(Math.abs(state.value)).toBeLessThan(1000);
    });

    it('dt=0 does not modify state', () => {
        const state = makeState(50, 200);
        const config: DecayMotion = { type: 'decay', velocity: 200 };

        stepDecay(state, config, 0);

        expect(state.value).toBe(50);
        expect(state.velocity).toBe(200);
        expect(state.settled).toBe(false);
    });

    it('negative dt does not modify state', () => {
        const state = makeState(50, 200);
        const config: DecayMotion = { type: 'decay', velocity: 200 };

        stepDecay(state, config, -1);

        expect(state.value).toBe(50);
        expect(state.velocity).toBe(200);
        expect(state.settled).toBe(false);
    });

    it('uses DECAY_DEFAULTS when config values are omitted', () => {
        const stateDefault = makeState(0, 500);
        const stateExplicit = makeState(0, 500);

        const configDefault: DecayMotion = { type: 'decay', velocity: 500 };
        const configExplicit: DecayMotion = {
            type: 'decay',
            velocity: 500,
            power: DECAY_DEFAULTS.power,
            timeConstant: DECAY_DEFAULTS.timeConstant,
        };

        const dt = 1 / 60;
        stepDecay(stateDefault, configDefault, dt);
        stepDecay(stateExplicit, configExplicit, dt);

        expect(stateDefault.value).toBe(stateExplicit.value);
        expect(stateDefault.velocity).toBe(stateExplicit.velocity);
    });

    it('timeConstant affects decay rate', () => {
        const stateFast = makeState(0, 500);
        const stateSlow = makeState(0, 500);

        const configFast: DecayMotion = { type: 'decay', velocity: 500, timeConstant: 100 };
        const configSlow: DecayMotion = { type: 'decay', velocity: 500, timeConstant: 800 };
        const dt = 1 / 60;

        for (let i = 0; i < 10; i++) {
            stepDecay(stateFast, configFast, dt);
            stepDecay(stateSlow, configSlow, dt);
        }

        // Shorter timeConstant decays faster — lower velocity
        expect(Math.abs(stateFast.velocity)).toBeLessThan(Math.abs(stateSlow.velocity));
    });
});
