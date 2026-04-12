// ============================================================================
// VirtualEngine — headless animation replay
//
// A pure, headless animation engine that reproduces canvas state
// deterministically from a Recording. It mirrors the real Animator/Engine
// but operates on virtual time, has no DOM bindings, and no rAF loop.
//
// The replay driver advances the engine by calling `advance(dt)` per virtual
// frame and `applyEvent(event)` when recorded events need to be replayed.
// ============================================================================

import type { AnimateTargets } from '../../core/types';
import type {
    CanvasSnapshot, RecordingEvent, Checkpoint, InFlightAnimation,
} from './types';
import type {
    MotionConfig, SpringMotion, DecayMotion, InertiaMotion,
    KeyframesMotion, PhysicsState,
} from '../motion';
import {
    stepSpring, stepDecay, stepInertia, stepKeyframes, resolveMotion,
} from '../motion';
import { resolveEasing, type EasingFn } from '../easing';
import { lerpNumber } from '../interpolators';
import { safeClone } from '../clone';

/** Fixed virtual time step for deterministic replay (60 fps). */
export const REPLAY_DT = 1 / 60;

/** Runtime-extended in-flight animation with resolved physics/easing state. */
interface ActiveVirtualAnim extends InFlightAnimation {
    /** Per-key physics state (only for physics types). */
    _physicsStates?: Map<string, PhysicsState>;
    /** Resolved easing function (eased type only). */
    _easingFn?: EasingFn;
    /** Snapshot of from-values at animation start (eased only). */
    _from?: Record<string, number>;
    /** Resolved motion config (physics only). */
    _motion?: MotionConfig;
}

/**
 * Headless replay engine. Constructed from an initial `CanvasSnapshot` and
 * driven by the replay layer through `advance()` and `applyEvent()`.
 */
export class VirtualEngine {
    private _state: CanvasSnapshot;
    private _virtualTime = 0;
    private _inFlight = new Map<string, ActiveVirtualAnim>();

    constructor(initialState: CanvasSnapshot) {
        this._state = safeClone(initialState);
    }

    /** Current virtual time in milliseconds. */
    get virtualTime(): number {
        return this._virtualTime;
    }

    /** Number of currently in-flight animations. */
    get inFlightCount(): number {
        return this._inFlight.size;
    }

    /** Return a deep-cloned copy of the current virtual canvas state. */
    getState(): CanvasSnapshot {
        return safeClone(this._state);
    }

    /** Advance virtual clock by `dt` seconds and step all in-flight animations. */
    advance(dt: number): void {
        if (dt <= 0) {
            return;
        }
        this._virtualTime += dt * 1000;

        for (const [handleId, anim] of this._inFlight) {
            this._stepAnimation(anim, dt);
            if (this._isSettled(anim)) {
                this._inFlight.delete(handleId);
            }
        }
    }

    /** Apply a recorded event to the virtual state. */
    applyEvent(event: RecordingEvent): void {
        switch (event.type) {
            case 'animate':
            case 'update':
                this._applyAnimate(event);
                break;
            case 'node-add': {
                const nodes = event.args.nodes;
                if (Array.isArray(nodes)) {
                    for (const n of nodes) {
                        if (n?.id) {
                            this._state.nodes[n.id] = safeClone(n);
                        }
                    }
                } else if (nodes?.id) {
                    this._state.nodes[nodes.id] = safeClone(nodes);
                } else if (event.args.id && event.args.node) {
                    // Legacy shape support
                    this._state.nodes[event.args.id] = safeClone(event.args.node);
                }
                break;
            }
            case 'node-remove': {
                const ids = event.args.ids;
                if (Array.isArray(ids)) {
                    for (const id of ids) {
                        delete this._state.nodes[id];
                    }
                } else if (typeof ids === 'string') {
                    delete this._state.nodes[ids];
                } else if (event.args.id) {
                    // Legacy shape support
                    delete this._state.nodes[event.args.id];
                }
                break;
            }
            case 'edge-add': {
                const edges = event.args.edges;
                if (Array.isArray(edges)) {
                    for (const e of edges) {
                        if (e?.id) {
                            this._state.edges[e.id] = safeClone(e);
                        }
                    }
                } else if (edges?.id) {
                    this._state.edges[edges.id] = safeClone(edges);
                } else if (event.args.id && event.args.edge) {
                    // Legacy shape support
                    this._state.edges[event.args.id] = safeClone(event.args.edge);
                }
                break;
            }
            case 'edge-remove': {
                const ids = event.args.ids;
                if (Array.isArray(ids)) {
                    for (const id of ids) {
                        delete this._state.edges[id];
                    }
                } else if (typeof ids === 'string') {
                    delete this._state.edges[ids];
                } else if (event.args.id) {
                    // Legacy shape support
                    delete this._state.edges[event.args.id];
                }
                break;
            }
            case 'viewport-change':
                Object.assign(this._state.viewport, event.args);
                break;
            // Particle events are visual-only and have no effect on headless state.
            case 'particle':
            case 'particle-along-path':
            case 'particle-between':
            case 'particle-burst':
            case 'converging':
                break;
            // Timeline events are structural markers; no virtual state change here.
            case 'timeline-play':
            case 'timeline-step':
            case 'timeline-complete':
                break;
        }
    }

    /** Restore the engine from a Checkpoint. */
    restoreCheckpoint(cp: Checkpoint): void {
        this._state = safeClone(cp.canvas);
        this._virtualTime = cp.t;
        this._inFlight.clear();
        for (const anim of cp.inFlight) {
            const active: ActiveVirtualAnim = safeClone(anim) as ActiveVirtualAnim;
            this._rehydrateAnim(active);
            this._inFlight.set(active.handleId, active);
        }
    }

    /** Capture the current engine state as a serializable Checkpoint payload. */
    captureCheckpointData(): Omit<Checkpoint, 't'> {
        return {
            canvas: safeClone(this._state),
            inFlight: [...this._inFlight.values()].map((anim) => this._serializeAnim(anim)),
            tagRegistry: {},
        };
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private _applyAnimate(event: RecordingEvent): void {
        const handleId: string = event.args.handleId
            ?? `virt-${this._virtualTime.toFixed(3)}-${this._inFlight.size}`;
        if (!event.args.handleId) {
            console.warn('[AlpineFlow VirtualEngine] animate event missing handleId — determinism not guaranteed for this event');
        }
        const targets: AnimateTargets = event.args.targets ?? {};
        const options = event.args.options ?? {};

        const motion = options.motion;
        const resolvedMotion = motion ? resolveMotion(motion) ?? undefined : undefined;

        const anim: ActiveVirtualAnim = {
            handleId,
            type: resolvedMotion ? resolvedMotion.type : 'eased',
            targets: safeClone(targets),
            startTime: this._virtualTime,
            duration: options.duration,
            easing: options.easing,
            motion: resolvedMotion,
            direction: 'forward',
            currentValues: {},
            _motion: resolvedMotion,
        };

        this._initAnim(anim);
        this._inFlight.set(handleId, anim);
    }

    private _initAnim(anim: ActiveVirtualAnim): void {
        const from: Record<string, number> = {};
        const to: Record<string, number> = {};
        this._collectNumericProperties(anim.targets, from, to, this._state);

        anim._from = from;

        if (anim.type === 'eased') {
            anim._easingFn = resolveEasing(anim.easing);
        } else {
            anim._physicsStates = new Map();
            for (const key of Object.keys(from)) {
                anim._physicsStates.set(key, {
                    value: from[key],
                    velocity: 0,
                    target: to[key] ?? from[key],
                    settled: false,
                });
            }
        }
    }

    private _collectNumericProperties(
        targets: AnimateTargets,
        from: Record<string, number>,
        to: Record<string, number>,
        state: CanvasSnapshot,
    ): void {
        for (const [nodeId, target] of Object.entries(targets.nodes ?? {})) {
            const node = state.nodes[nodeId];
            if (!node) {
                continue;
            }
            const position = (target as { position?: { x?: number; y?: number } }).position;
            if (position?.x !== undefined) {
                from[`nodes.${nodeId}.position.x`] = node.position?.x ?? 0;
                to[`nodes.${nodeId}.position.x`] = position.x;
            }
            if (position?.y !== undefined) {
                from[`nodes.${nodeId}.position.y`] = node.position?.y ?? 0;
                to[`nodes.${nodeId}.position.y`] = position.y;
            }
        }

        const viewport = targets.viewport;
        if (viewport?.pan?.x !== undefined) {
            from['viewport.x'] = state.viewport.x;
            to['viewport.x'] = viewport.pan.x;
        }
        if (viewport?.pan?.y !== undefined) {
            from['viewport.y'] = state.viewport.y;
            to['viewport.y'] = viewport.pan.y;
        }
        if (viewport?.zoom !== undefined) {
            from['viewport.zoom'] = state.viewport.zoom;
            to['viewport.zoom'] = viewport.zoom;
        }
    }

    private _rehydrateAnim(anim: ActiveVirtualAnim): void {
        anim._motion = anim.motion;

        if (anim.type === 'eased') {
            anim._easingFn = resolveEasing(anim.easing);
            // For alpha: reconstructing exact from-values mid-flight is complex.
            // Use currentValues as the baseline so the animation finishes from here.
            anim._from = { ...(anim.currentValues ?? {}) };
            return;
        }

        if (anim.integratorState) {
            anim._physicsStates = new Map();
            for (const [key, is] of Object.entries(anim.integratorState)) {
                anim._physicsStates.set(key, {
                    value: is.value ?? 0,
                    velocity: is.velocity ?? 0,
                    target: is.target ?? 0,
                    settled: is.settled ?? false,
                });
            }
        }
    }

    private _serializeAnim(anim: ActiveVirtualAnim): InFlightAnimation {
        const integratorState: InFlightAnimation['integratorState'] = {};
        if (anim._physicsStates) {
            for (const [key, state] of anim._physicsStates) {
                integratorState[key] = {
                    velocity: state.velocity,
                    value: state.value,
                    target: state.target,
                    settled: state.settled,
                };
            }
        }

        return safeClone({
            handleId: anim.handleId,
            type: anim.type,
            targets: anim.targets,
            startTime: anim.startTime,
            duration: anim.duration,
            easing: anim.easing,
            motion: anim.motion,
            direction: anim.direction,
            integratorState: anim._physicsStates ? integratorState : anim.integratorState,
            currentValues: anim.currentValues,
        });
    }

    private _stepAnimation(anim: ActiveVirtualAnim, dt: number): void {
        if (anim.type === 'eased') {
            this._stepEased(anim, dt);
        } else if (anim._physicsStates) {
            this._stepPhysics(anim, dt);
        }
    }

    private _stepEased(anim: ActiveVirtualAnim, _dt: number): void {
        if (!anim.duration || !anim._easingFn || !anim._from) {
            return;
        }
        const elapsed = this._virtualTime - anim.startTime;
        const rawProgress = anim.duration > 0
            ? Math.min(elapsed / anim.duration, 1)
            : 1;
        const easedProgress = anim._easingFn(rawProgress);

        for (const key of Object.keys(anim._from)) {
            const from = anim._from[key];
            const to = this._getTargetValue(key, anim.targets) ?? from;
            const value = lerpNumber(from, to, easedProgress);
            anim.currentValues[key] = value;
            this._applyValueToState(key, value);
        }
    }

    private _stepPhysics(anim: ActiveVirtualAnim, dt: number): void {
        if (!anim._physicsStates || !anim._motion) {
            return;
        }

        const motion = anim._motion;
        for (const [key, state] of anim._physicsStates) {
            if (state.settled) {
                continue;
            }

            switch (motion.type) {
                case 'spring':
                    stepSpring(state, motion as SpringMotion, dt);
                    break;
                case 'decay':
                    stepDecay(state, motion as DecayMotion, dt);
                    break;
                case 'inertia':
                    stepInertia(state, motion as InertiaMotion, dt, key);
                    break;
                case 'keyframes': {
                    const kf = motion as KeyframesMotion;
                    const kfDuration = kf.duration ?? 5000;
                    const progress = kfDuration > 0
                        ? Math.min((this._virtualTime - anim.startTime) / kfDuration, 1)
                        : 1;
                    stepKeyframes(state, kf, progress, key);
                    if (progress >= 1) {
                        state.settled = true;
                    }
                    break;
                }
            }

            anim.currentValues[key] = state.value;
            this._applyValueToState(key, state.value);
        }
    }

    private _getTargetValue(key: string, targets: AnimateTargets): number | undefined {
        const parts = key.split('.');
        if (parts[0] === 'nodes' && parts.length >= 4) {
            const nodeId = parts[1];
            const nodeTarget = targets.nodes?.[nodeId] as { position?: { x?: number; y?: number } } | undefined;
            if (!nodeTarget) {
                return undefined;
            }
            if (parts[2] === 'position' && parts[3] === 'x') {
                return nodeTarget.position?.x;
            }
            if (parts[2] === 'position' && parts[3] === 'y') {
                return nodeTarget.position?.y;
            }
        }
        if (parts[0] === 'viewport') {
            const vp = targets.viewport;
            if (parts[1] === 'x') return vp?.pan?.x;
            if (parts[1] === 'y') return vp?.pan?.y;
            if (parts[1] === 'zoom') return vp?.zoom;
        }
        return undefined;
    }

    private _applyValueToState(key: string, value: number): void {
        const parts = key.split('.');
        if (parts[0] === 'nodes' && parts.length >= 4) {
            const nodeId = parts[1];
            const node = this._state.nodes[nodeId];
            if (!node) {
                return;
            }
            if (!node.position) {
                node.position = { x: 0, y: 0 };
            }
            if (parts[2] === 'position') {
                if (parts[3] === 'x') node.position.x = value;
                if (parts[3] === 'y') node.position.y = value;
            }
            return;
        }
        if (parts[0] === 'viewport') {
            if (parts[1] === 'x') this._state.viewport.x = value;
            if (parts[1] === 'y') this._state.viewport.y = value;
            if (parts[1] === 'zoom') this._state.viewport.zoom = value;
        }
    }

    private _isSettled(anim: ActiveVirtualAnim): boolean {
        if (anim.type === 'eased') {
            const elapsed = this._virtualTime - anim.startTime;
            return elapsed >= (anim.duration ?? 0);
        }
        if (anim._physicsStates) {
            for (const state of anim._physicsStates.values()) {
                if (!state.settled) {
                    return false;
                }
            }
            return true;
        }
        return true;
    }
}
