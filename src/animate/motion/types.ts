export interface SpringMotion {
    type: 'spring';
    stiffness?: number;        // default 180
    damping?: number;          // default 12
    mass?: number;             // default 1
    restVelocity?: number;     // default 0.01
    restDisplacement?: number; // default 0.01
}

export interface DecayMotion {
    type: 'decay';
    velocity: number | { x: number; y: number };
    /**
     * One-shot initial velocity multiplier, applied once at animate() entry
     * (not each frame). Higher values produce a larger initial impulse and
     * therefore longer/faster decay motion. Default: 0.8.
     * Matches the Framer Motion `power` convention.
     */
    power?: number;
    /** Exponential decay time constant in ms. Default: 350. */
    timeConstant?: number;
}

export interface InertiaMotion {
    type: 'inertia';
    velocity: number | { x: number; y: number };
    /**
     * Bounds per property key. Applies to whatever property name is being
     * animated (not restricted to 'x'/'y'). Example: `{ scrollTop: [0, 800] }`.
     */
    bounds?: Record<string, [number, number]>;
    /** Bounciness coefficient, normalized around 500. Default: 200. */
    bounceStiffness?: number;
    /** Velocity loss on bounce, as a percent (0-100). Default: 40. */
    bounceDamping?: number;
    /**
     * Snap targets, keyed by property name. Applied once the animation settles.
     * Example: `[{ scrollTop: 0 }, { scrollTop: 400 }]`.
     */
    snapTo?: Array<Record<string, number>>;
    /**
     * One-shot initial velocity multiplier, applied once at animate() entry
     * (not each frame). Default: 0.8.
     */
    power?: number;
    /** Exponential decay time constant in ms. Default: 350. */
    timeConstant?: number;
}

export interface KeyframesMotion {
    type: 'keyframes';
    values: Array<Record<string, number>>;
    offsets?: number[];
    between?: string | MotionConfig;
    duration?: number;
    loop?: boolean | number;
}

export type MotionConfig = SpringMotion | DecayMotion | InertiaMotion | KeyframesMotion;

export interface PhysicsState {
    value: number;
    velocity: number;
    target: number;
    settled: boolean;
}
