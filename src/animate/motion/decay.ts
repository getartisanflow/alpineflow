import type { DecayMotion, PhysicsState } from './types';

export const DECAY_DEFAULTS = {
    power: 0.8,
    timeConstant: 350,
    restVelocity: 0.5,
};

export function stepDecay(state: PhysicsState, config: DecayMotion, dt: number): void {
    if (dt <= 0) {
        return;
    }

    const timeConstant = config.timeConstant ?? DECAY_DEFAULTS.timeConstant;

    // Pure exponential decay: v *= e^(-dt * 1000 / timeConstant)
    // Note: `power` is NOT applied here — it is a one-shot initial velocity
    // multiplier applied at Animator setup time (matches Framer Motion convention).
    // Using `power` per-frame with values > 1 causes velocity to diverge.
    const decayFactor = Math.exp((-dt * 1000) / timeConstant);
    state.velocity *= decayFactor;
    state.value += state.velocity * dt;

    if (Math.abs(state.velocity) < DECAY_DEFAULTS.restVelocity) {
        state.velocity = 0;
        state.settled = true;
        state.target = state.value; // target is wherever it landed
    }
}
