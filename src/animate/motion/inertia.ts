import type { InertiaMotion, PhysicsState } from './types';
import { stepDecay } from './decay';

export function stepInertia(state: PhysicsState, config: InertiaMotion, dt: number, key?: string): void {
    if (dt <= 0) {
        return;
    }

    // Apply base decay
    stepDecay(state, {
        type: 'decay',
        velocity: state.velocity,
        power: config.power,
        timeConstant: config.timeConstant,
    }, dt);

    // Bounce off bounds
    if (config.bounds && key) {
        const axisBounds = config.bounds[key as 'x' | 'y'];
        if (axisBounds) {
            const [min, max] = axisBounds;
            const bounceFactor = (config.bounceDamping ?? 40) / 100;

            if (state.value < min) {
                state.value = min;
                state.velocity = Math.abs(state.velocity) * bounceFactor;
                state.settled = false; // un-settle — still bouncing
            } else if (state.value > max) {
                state.value = max;
                state.velocity = -Math.abs(state.velocity) * bounceFactor;
                state.settled = false;
            }
        }
    }

    // Snap to nearest point when settled
    if (state.settled && config.snapTo?.length && key) {
        let nearest = state.value;
        let minDist = Infinity;
        for (const point of config.snapTo) {
            const val = (point as Record<string, number>)[key];
            if (val !== undefined) {
                const dist = Math.abs(state.value - val);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = val;
                }
            }
        }
        state.value = nearest;
    }
}
