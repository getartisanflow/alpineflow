import type { InertiaMotion, PhysicsState } from './types';
import { stepDecay } from './decay';
import { extractAxis } from './axis';

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

    // Resolve axis-based config lookup. Bounds/snap authored as { x: [...], y: [...] }
    // need to be matched against the entry's axis letter, not the full property key.
    const axis = key ? extractAxis(key) : null;

    // Bounce off bounds
    if (config.bounds && key) {
        const axisBounds = config.bounds[key] ?? (axis ? config.bounds[axis] : undefined);
        if (axisBounds) {
            const [min, max] = axisBounds;
            // bounceStiffness acts as a bounciness coefficient (higher = stronger
            // rebound). Normalize around 500 so the default (200) matches the
            // prior softer-bounce feel; values >500 produce a stronger rebound.
            const bounciness = (config.bounceStiffness ?? 200) / 500;
            const damping = (config.bounceDamping ?? 40) / 100;
            const bounceFactor = bounciness * (1 - damping);

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
            const val = point[key] ?? (axis ? point[axis] : undefined);
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
