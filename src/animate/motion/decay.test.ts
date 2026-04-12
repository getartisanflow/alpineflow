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

    it('power affects deceleration rate', () => {
        const stateHigh = makeState(0, 500);
        const stateLow = makeState(0, 500);

        const configHigh: DecayMotion = { type: 'decay', velocity: 500, power: 0.95 };
        const configLow: DecayMotion = { type: 'decay', velocity: 500, power: 0.5 };
        const dt = 1 / 60;

        // Step both a few times
        for (let i = 0; i < 10; i++) {
            stepDecay(stateHigh, configHigh, dt);
            stepDecay(stateLow, configLow, dt);
        }

        // Higher power retains more velocity
        expect(Math.abs(stateHigh.velocity)).toBeGreaterThan(Math.abs(stateLow.velocity));
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
