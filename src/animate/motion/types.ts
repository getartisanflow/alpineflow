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
    power?: number;       // default 0.8
    timeConstant?: number; // default 350
}

export interface InertiaMotion {
    type: 'inertia';
    velocity: number | { x: number; y: number };
    bounds?: { x?: [number, number]; y?: [number, number] };
    bounceStiffness?: number; // default 200
    bounceDamping?: number;   // default 40
    snapTo?: Array<{ x?: number; y?: number }>;
    power?: number;
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
