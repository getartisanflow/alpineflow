import type { RecordingEvent, RecordingEventType, Checkpoint, CanvasSnapshot, RecordingData } from './types';
import { Recording } from './recording';
import { RECORDING_VERSION } from './types';

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

        // Final checkpoint at recording end
        this._captureCheckpoint();

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

    private _captureSnapshot(): CanvasSnapshot {
        const nodes: Record<string, any> = {};
        for (const n of this._canvas.nodes ?? []) {
            if (n && typeof n === 'object' && 'id' in n) {
                nodes[n.id] = structuredClone(n);
            }
        }
        const edges: Record<string, any> = {};
        for (const e of this._canvas.edges ?? []) {
            if (e && typeof e === 'object' && 'id' in e) {
                edges[e.id] = structuredClone(e);
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
            // TODO: capture from animator's in-flight state — for alpha, leave empty
            inFlight: [],
            tagRegistry: {},
        });
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

        hook('animate', 'animate', (targets, options) => ({ targets, options }));
        hook('update', 'update', (targets, options) => ({ targets, options }));
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
