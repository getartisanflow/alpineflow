import type { RecordingEvent, RecordingEventType, Checkpoint, CanvasSnapshot, RecordingData, InFlightAnimation } from './types';
import { Recording } from './recording';
import { RECORDING_VERSION } from './types';
import { safeClone } from '../clone';

/**
 * Live record for an animation that's still in flight at the current virtual
 * time. The Recorder stores these as each `animate`/`update` hook fires and
 * drops them when the handle's `finished` promise resolves.
 */
interface ActiveAnim {
    handleId: string;
    eventT: number;           // virtual ms when the animate event was recorded
    targets: any;             // AnimateTargets passed to animate()
    options: any;             // AnimateOptions passed to animate()
    handle: any;              // FlowAnimationHandle — exposes direction, currentValue, isFinished
    fromValues: Record<string, number>;  // baseline values snapshotted at call time
}

export interface RecordOptions {
    /** How often (in ms) to snapshot canvas state during recording. Default: 500ms. */
    checkpointInterval?: number;
    /** Optional metadata attached to the resulting Recording. */
    captureMetadata?: Record<string, any>;
    /** Safety cap — throws if recording exceeds this duration (ms). Default: 60000ms. */
    maxDuration?: number;
}

/** Minimal canvas interface the recorder hooks into. */
export interface RecorderCanvas {
    // State access
    nodes: any[];
    edges: any[];
    viewport: { x: number; y: number; zoom: number };

    // Methods to hook (all optional — the recorder only hooks what exists)
    animate?(targets: any, options?: any): any;
    update?(targets: any, options?: any): any;
    sendParticle?(edgeId: string, options?: any): any;
    sendParticleAlongPath?(path: string, options?: any): any;
    sendParticleBetween?(source: string, target: string, options?: any): any;
    sendParticleBurst?(edgeId: string, options: any): any;
    sendConverging?(sources: string[], options: any): any;
    addNodes?(nodes: any | any[]): void;
    removeNodes?(ids: string | string[]): void;
    addEdges?(edges: any | any[]): void;
    removeEdges?(ids: string | string[]): void;

    // Engine for checkpoint scheduling (reserved for future use)
    _engine?: any;
}

/**
 * Records animation events and canvas state during fn() execution.
 * Installs method hooks on a canvas, captures each API call as a RecordingEvent
 * with a virtual timestamp, and periodically snapshots canvas state.
 */
export class Recorder {
    private _canvas: RecorderCanvas;
    private _events: RecordingEvent[] = [];
    private _checkpoints: Checkpoint[] = [];
    private _startTime = 0;
    private _originalMethods: Record<string, Function> = {};
    private _checkpointInterval: number;
    private _maxDuration: number;
    private _checkpointTimer: ReturnType<typeof setInterval> | null = null;
    private _eventCounter = 0;
    /** In-flight animations indexed by handleId — populated by animate/update hooks, pruned by handle.finished. */
    private _activeAnims = new Map<string, ActiveAnim>();

    constructor(canvas: RecorderCanvas, options: RecordOptions = {}) {
        this._canvas = canvas;
        this._checkpointInterval = options.checkpointInterval ?? 500;
        this._maxDuration = options.maxDuration ?? 60000;
    }

    async record(fn: () => Promise<void> | void, metadata?: Record<string, any>): Promise<Recording> {
        this._startTime = performance.now();
        const initialState = this._captureSnapshot();

        this._installHooks();
        this._scheduleCheckpoints();

        try {
            const result = fn();
            if (result instanceof Promise) {
                await result;
            }

            if (this._virtualNow() > this._maxDuration) {
                throw new Error(`[AlpineFlow] Recording exceeded maxDuration (${this._maxDuration}ms)`);
            }
        } finally {
            this._uninstallHooks();
            if (this._checkpointTimer !== null) {
                clearInterval(this._checkpointTimer);
                this._checkpointTimer = null;
            }
        }

        // Final checkpoint at recording end — before clearing _activeAnims so
        // any animations still in flight get captured into the final checkpoint.
        this._captureCheckpoint();
        this._activeAnims.clear();

        const data: RecordingData = {
            version: RECORDING_VERSION,
            duration: this._virtualNow(),
            initialState,
            events: this._events,
            checkpoints: this._checkpoints,
            metadata,
        };

        return new Recording(data);
    }

    private _virtualNow(): number {
        return performance.now() - this._startTime;
    }

    private _recordEvent(type: RecordingEventType, args: Record<string, any>): void {
        this._events.push({
            t: this._virtualNow(),
            type,
            args: this._sanitizeArgs(args),
        });
    }

    /** Strip non-serializable values (functions, etc.) and log warnings. */
    private _sanitizeArgs(args: Record<string, any>): Record<string, any> {
        const result: Record<string, any> = {};
        for (const [key, value] of Object.entries(args)) {
            if (typeof value === 'function') {
                console.warn(`[AlpineFlow recorder] Stripped non-serializable option "${key}" (function)`);
                continue;
            }
            if (value && typeof value === 'object') {
                result[key] = this._sanitizeNested(value);
            } else {
                result[key] = value;
            }
        }
        return result;
    }

    private _sanitizeNested(value: any): any {
        if (value === null || typeof value !== 'object') {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map((v) => this._sanitizeNested(v));
        }

        const result: Record<string, any> = {};
        for (const [key, v] of Object.entries(value)) {
            if (typeof v === 'function') {
                console.warn(`[AlpineFlow recorder] Stripped nested function at key "${key}"`);
                continue;
            }
            result[key] = this._sanitizeNested(v);
        }
        return result;
    }

    /**
     * Capture the live canvas values that an animate()/update() call is about
     * to transition FROM. Keys are the same flat form VirtualEngine uses
     * (e.g. `nodes.n.position.x`) so rehydration can lerp correctly.
     */
    private _snapshotFromValues(targets: any): Record<string, number> {
        const out: Record<string, number> = {};
        const nodeTargets = targets?.nodes ?? {};
        const nodesById = new Map<string, any>();
        for (const n of this._canvas.nodes ?? []) {
            if (n && typeof n === 'object' && 'id' in n) {
                nodesById.set(n.id, n);
            }
        }
        for (const [nodeId, target] of Object.entries(nodeTargets)) {
            const node = nodesById.get(nodeId);
            if (!node) continue;
            const position = (target as { position?: { x?: number; y?: number } }).position;
            if (position?.x !== undefined) {
                out[`nodes.${nodeId}.position.x`] = node.position?.x ?? 0;
            }
            if (position?.y !== undefined) {
                out[`nodes.${nodeId}.position.y`] = node.position?.y ?? 0;
            }
        }
        const viewport = targets?.viewport;
        if (viewport?.pan?.x !== undefined) out['viewport.x'] = this._canvas.viewport.x;
        if (viewport?.pan?.y !== undefined) out['viewport.y'] = this._canvas.viewport.y;
        if (viewport?.zoom !== undefined) out['viewport.zoom'] = this._canvas.viewport.zoom;
        return out;
    }

    private _captureSnapshot(): CanvasSnapshot {
        const nodes: Record<string, any> = {};
        for (const n of this._canvas.nodes ?? []) {
            if (n && typeof n === 'object' && 'id' in n) {
                nodes[n.id] = safeClone(n);
            }
        }
        const edges: Record<string, any> = {};
        for (const e of this._canvas.edges ?? []) {
            if (e && typeof e === 'object' && 'id' in e) {
                edges[e.id] = safeClone(e);
            }
        }
        return {
            nodes,
            edges,
            viewport: { ...this._canvas.viewport },
        };
    }

    private _captureCheckpoint(): void {
        this._checkpoints.push({
            t: this._virtualNow(),
            canvas: this._captureSnapshot(),
            inFlight: this._captureInFlight(),
            tagRegistry: {},
        });
    }

    /**
     * Serialize the current in-flight animations tracked by this recorder into
     * the InFlightAnimation shape the VirtualEngine can restore from.
     * Draws data from each ActiveAnim entry's original event args + the handle's
     * live state. Finished handles are skipped (the finished promise cleanup
     * typically runs before this, but we defend anyway).
     */
    private _captureInFlight(): InFlightAnimation[] {
        const out: InFlightAnimation[] = [];
        for (const active of this._activeAnims.values()) {
            if (active.handle?.isFinished) continue;

            const options = active.options ?? {};
            const hasMotion = !!options.motion;

            // Derive the inflight type from the options.motion if present.
            let type: InFlightAnimation['type'] = 'eased';
            if (hasMotion) {
                const m = options.motion;
                if (typeof m === 'string') {
                    // 'spring.wobbly' → 'spring'
                    const cat = m.split('.')[0];
                    type = (cat as InFlightAnimation['type']);
                } else if (m && typeof m === 'object' && m.type) {
                    type = m.type as InFlightAnimation['type'];
                }
            }

            // Serialize currentValues (a Map on the live handle) to a plain
            // Record that can be structured-cloned and restored later.
            let currentValues: Record<string, any> = {};
            const cv = active.handle?.currentValue;
            if (cv && typeof cv.forEach === 'function') {
                cv.forEach((v: any, k: string) => {
                    currentValues[k] = v;
                });
            }

            out.push({
                handleId: active.handleId,
                type,
                targets: safeClone(active.targets),
                startTime: active.eventT,
                duration: hasMotion ? undefined : (options.duration ?? 300),
                easing: hasMotion ? undefined : options.easing,
                motion: hasMotion ? safeClone(options.motion) : undefined,
                direction: active.handle?.direction ?? 'forward',
                currentValues,
                fromValues: { ...active.fromValues },
                // integratorState populated if/when handles expose physics state.
                // For now, scrubbing into mid-physics relies on rehydration via
                // walk-forward from the nearest event; direct physics state
                // capture is a planned follow-up for perfect fidelity.
                integratorState: undefined,
            });
        }
        return out;
    }

    private _scheduleCheckpoints(): void {
        this._checkpointTimer = setInterval(() => {
            this._captureCheckpoint();
        }, this._checkpointInterval);
    }

    private _installHooks(): void {
        const hook = (
            methodName: string,
            eventType: RecordingEventType,
            argsMapper?: (...args: any[]) => Record<string, any>,
        ): void => {
            const original = (this._canvas as any)[methodName];
            if (typeof original !== 'function') {
                return;
            }

            this._originalMethods[methodName] = original;
            (this._canvas as any)[methodName] = (...args: any[]) => {
                const mappedArgs = argsMapper ? argsMapper(...args) : { args };
                this._recordEvent(eventType, mappedArgs);
                return original.apply(this._canvas, args);
            };
        };

        // animate/update are tracked for in-flight checkpoint capture — the
        // hook wraps the real call, records the event, AND registers the
        // returned handle so _captureCheckpoint can serialize active animations.
        const animHook = (methodName: 'animate' | 'update', eventType: RecordingEventType): void => {
            const original = (this._canvas as any)[methodName];
            if (typeof original !== 'function') return;

            this._originalMethods[methodName] = original;
            (this._canvas as any)[methodName] = (targets: any, options: any) => {
                const handleId = `rec-${++this._eventCounter}`;
                const eventT = this._virtualNow();
                // Snapshot baseline values BEFORE the call — any other in-flight
                // animations on the same keys will update the canvas via rAF,
                // so reading now captures the true pre-animation baseline for
                // mid-flight checkpoint rehydration.
                const fromValues = this._snapshotFromValues(targets);
                this._recordEvent(eventType, { targets, options, handleId });

                const handle = original.apply(this._canvas, [targets, options]);

                // Track the handle only if it has the shape we need to serialize.
                // `update()` with duration 0 returns a noop-like handle whose
                // `finished` resolves immediately — skip those.
                if (handle && typeof handle === 'object' && handle.finished && !handle.isFinished) {
                    const active: ActiveAnim = { handleId, eventT, targets, options, handle, fromValues };
                    this._activeAnims.set(handleId, active);
                    handle.finished.then(() => {
                        this._activeAnims.delete(handleId);
                    }).catch(() => {
                        this._activeAnims.delete(handleId);
                    });
                }

                return handle;
            };
        };

        animHook('animate', 'animate');
        animHook('update', 'update');
        hook('sendParticle', 'particle', (edgeId, options) => ({ edgeId, options }));
        hook('sendParticleAlongPath', 'particle-along-path', (path, options) => ({ path, options }));
        hook('sendParticleBetween', 'particle-between', (source, target, options) => ({ source, target, options }));
        hook('sendParticleBurst', 'particle-burst', (edgeId, options) => ({ edgeId, options }));
        hook('sendConverging', 'converging', (sources, options) => ({ sources, options }));
        hook('addNodes', 'node-add', (nodes) => ({ nodes }));
        hook('removeNodes', 'node-remove', (ids) => ({ ids }));
        hook('addEdges', 'edge-add', (edges) => ({ edges }));
        hook('removeEdges', 'edge-remove', (ids) => ({ ids }));
    }

    private _uninstallHooks(): void {
        for (const [methodName, original] of Object.entries(this._originalMethods)) {
            (this._canvas as any)[methodName] = original;
        }
        this._originalMethods = {};
    }
}
