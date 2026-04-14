import type { SpringMotion, DecayMotion, InertiaMotion, MotionConfig } from './types';

const SPRING_PRESETS: Record<string, SpringMotion> = {
    gentle:   { type: 'spring', stiffness: 120, damping: 14 },
    wobbly:   { type: 'spring', stiffness: 180, damping: 12 },
    stiff:    { type: 'spring', stiffness: 300, damping: 30 },
    slow:     { type: 'spring', stiffness: 60,  damping: 15 },
    molasses: { type: 'spring', stiffness: 40,  damping: 30 },
};

const DECAY_PRESETS: Record<string, DecayMotion> = {
    smooth: { type: 'decay', velocity: 0, power: 0.6, timeConstant: 400 },
    snappy: { type: 'decay', velocity: 0, power: 1.2, timeConstant: 200 },
};

const INERTIA_PRESETS: Record<string, InertiaMotion> = {
    momentum: { type: 'inertia', velocity: 0, power: 0.8, timeConstant: 700 },
    rails:    { type: 'inertia', velocity: 0, bounceStiffness: 500, bounceDamping: 40 },
};

export function resolveMotion(input: string | MotionConfig): MotionConfig | null {
    if (typeof input !== 'string') {
        return input;
    }

    const [category, name] = input.split('.');

    if (!name) {
        return null;
    }

    switch (category) {
        case 'spring':  return SPRING_PRESETS[name]  ? { ...SPRING_PRESETS[name] }  : null;
        case 'decay':   return DECAY_PRESETS[name]   ? { ...DECAY_PRESETS[name] }   : null;
        case 'inertia': return INERTIA_PRESETS[name] ? { ...INERTIA_PRESETS[name] } : null;
        default: return null;
    }
}
