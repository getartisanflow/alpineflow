import { describe, it, expect } from 'vitest';
import { stepSpring, SPRING_DEFAULTS } from './spring';
import type { PhysicsState, SpringMotion } from './types';

function makeState(value: number, target: number, velocity = 0): PhysicsState {
    return { value, target, velocity, settled: false };
}

describe('stepSpring', () => {
    it('settles at target value after enough steps', () => {
        const state = makeState(0, 100);
        const config: SpringMotion = { type: 'spring' };
        const dt = 1 / 60;

        for (let i = 0; i < 600; i++) {
            stepSpring(state, config, dt);
            if (state.settled) {
                break;
            }
        }

        expect(state.settled).toBe(true);
        expect(state.value).toBe(100);
    });

    it('underdamped spring oscillates before settling', () => {
        const state = makeState(0, 100);
        const config: SpringMotion = { type: 'spring', stiffness: 300, damping: 5 };
        const dt = 1 / 60;

        const values: number[] = [];
        for (let i = 0; i < 600; i++) {
            stepSpring(state, config, dt);
            values.push(state.value);
            if (state.settled) {
                break;
            }
        }

        // Underdamped should overshoot the target at some point
        const hasOvershoot = values.some((v) => v > 100);
        expect(hasOvershoot).toBe(true);
        expect(state.settled).toBe(true);
    });

    it('overdamped spring settles without oscillation', () => {
        const state = makeState(0, 100);
        const config: SpringMotion = { type: 'spring', stiffness: 60, damping: 30 };
        const dt = 1 / 60;

        let crossedTarget = false;
        for (let i = 0; i < 600; i++) {
            stepSpring(state, config, dt);
            if (state.value > 100) {
                crossedTarget = true;
                break;
            }
            if (state.settled) {
                break;
            }
        }

        expect(crossedTarget).toBe(false);
        expect(state.settled).toBe(true);
    });

    it('respects custom restVelocity and restDisplacement thresholds', () => {
        const state = makeState(0, 100);
        // Tight thresholds: should take longer to settle
        const tightConfig: SpringMotion = {
            type: 'spring',
            restVelocity: 0.001,
            restDisplacement: 0.001,
        };
        const looseConfig: SpringMotion = {
            type: 'spring',
            restVelocity: 5,
            restDisplacement: 5,
        };

        const stateLoose = makeState(0, 100);
        const dt = 1 / 60;

        let looseSteps = 0;
        for (let i = 0; i < 600; i++) {
            stepSpring(stateLoose, looseConfig, dt);
            looseSteps++;
            if (stateLoose.settled) {
                break;
            }
        }

        let tightSteps = 0;
        for (let i = 0; i < 600; i++) {
            stepSpring(state, tightConfig, dt);
            tightSteps++;
            if (state.settled) {
                break;
            }
        }

        // Loose thresholds should settle faster (fewer steps)
        expect(looseSteps).toBeLessThan(tightSteps);
        expect(stateLoose.settled).toBe(true);
        expect(state.settled).toBe(true);
    });

    it('dt=0 does not modify state', () => {
        const state = makeState(50, 100, 10);
        const config: SpringMotion = { type: 'spring' };

        stepSpring(state, config, 0);

        expect(state.value).toBe(50);
        expect(state.velocity).toBe(10);
        expect(state.settled).toBe(false);
    });

    it('uses SPRING_DEFAULTS when config values are omitted', () => {
        const stateWithDefaults = makeState(0, 100);
        const stateExplicit = makeState(0, 100);

        const configDefault: SpringMotion = { type: 'spring' };
        const configExplicit: SpringMotion = {
            type: 'spring',
            stiffness: SPRING_DEFAULTS.stiffness,
            damping: SPRING_DEFAULTS.damping,
            mass: SPRING_DEFAULTS.mass,
            restVelocity: SPRING_DEFAULTS.restVelocity,
            restDisplacement: SPRING_DEFAULTS.restDisplacement,
        };

        const dt = 1 / 60;
        stepSpring(stateWithDefaults, configDefault, dt);
        stepSpring(stateExplicit, configExplicit, dt);

        expect(stateWithDefaults.value).toBe(stateExplicit.value);
        expect(stateWithDefaults.velocity).toBe(stateExplicit.velocity);
    });
});
