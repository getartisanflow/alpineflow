import type { FlowNode, FlowEdge, Viewport, AnimateTargets, EasingName } from '../../core/types';
import type { MotionConfig } from '../motion';

export interface CanvasSnapshot {
    nodes: Record<string, Partial<FlowNode>>;
    edges: Record<string, Partial<FlowEdge>>;
    viewport: Viewport;
}

export type RecordingEventType =
    | 'animate' | 'update'
    | 'particle' | 'particle-along-path' | 'particle-between'
    | 'particle-burst' | 'converging'
    | 'timeline-play' | 'timeline-step' | 'timeline-complete'
    | 'node-add' | 'node-remove'
    | 'edge-add' | 'edge-remove'
    | 'viewport-change';

export interface RecordingEvent {
    t: number;
    type: RecordingEventType;
    args: Record<string, any>;
    source?: string;
}

export interface InFlightAnimation {
    handleId: string;
    type: 'eased' | 'spring' | 'decay' | 'inertia' | 'keyframes';
    targets: AnimateTargets;
    startTime: number;
    duration?: number;
    easing?: EasingName;
    motion?: MotionConfig;
    direction: 'forward' | 'backward';
    integratorState?: Record<string, {
        velocity?: number;
        value?: number;
        target?: number;
        settled?: boolean;
    }>;
    currentValues: Record<string, any>;
}

export interface Checkpoint {
    t: number;
    canvas: CanvasSnapshot;
    inFlight: InFlightAnimation[];
    tagRegistry: Record<string, string[]>;
}

export interface RecordingData {
    version: number;
    duration: number;
    initialState: CanvasSnapshot;
    events: RecordingEvent[];
    checkpoints: Checkpoint[];
    metadata?: Record<string, any>;
}

export const RECORDING_VERSION = 1;
