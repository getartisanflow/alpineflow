import type { SpringMotion, PhysicsState } from './types';

export const SPRING_DEFAULTS = {
    stiffness: 180,
    damping: 12,
    mass: 1,
    restVelocity: 0.01,
    restDisplacement: 0.01,
};

export function stepSpring(state: PhysicsState, config: SpringMotion, dt: number): void {
    if (dt <= 0) {
        return;
    }

    const s = config.stiffness ?? SPRING_DEFAULTS.stiffness;
    const d = config.damping ?? SPRING_DEFAULTS.damping;
    const m = config.mass ?? SPRING_DEFAULTS.mass;

    const displacement = state.value - state.target;
    const acceleration = (-s * displacement - d * state.velocity) / m;

    state.velocity += acceleration * dt;
    state.value += state.velocity * dt;

    if (
        Math.abs(state.velocity) < (config.restVelocity ?? SPRING_DEFAULTS.restVelocity) &&
        Math.abs(state.value - state.target) < (config.restDisplacement ?? SPRING_DEFAULTS.restDisplacement)
    ) {
        state.value = state.target;
        state.velocity = 0;
        state.settled = true;
    }
}
