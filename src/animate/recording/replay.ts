// ============================================================================
// ReplayHandle — drives a VirtualEngine to reproduce canvas state.
//
// Returned from `$flow.replay(recording, options)`. Walks virtual time through
// the recording's events (optionally using checkpoints for efficient scrubbing)
// and applies the resulting snapshot to the real canvas.
// ============================================================================

import type { RecordingEvent, CanvasSnapshot, Checkpoint } from './types';
import type { Recording } from './recording';
import { VirtualEngine, REPLAY_DT } from './virtual-engine';

export interface ReplayOptions {
    /** Playback speed multiplier. Negative plays backward. Default 1.0. */
    speed?: number;
    /** Virtual-ms start; default 0. */
    from?: number;
    /** Virtual-ms end; default recording.duration. */
    to?: number;
    /** Repeat forever (true) or N times. Default false. */
    loop?: boolean | number;
    /** Start paused. Default false. */
    paused?: boolean;
    /** Skip restoring `initialState` to the canvas on construction. */
    skipInitialState?: boolean;
}

export interface ReplayCanvas {
    nodes: any[];
    edges: any[];
    viewport: { x: number; y: number; zoom: number };
    update?(targets: any, options?: any): any;
}

export type ReplayState = 'idle' | 'playing' | 'paused' | 'ended';
export type ReplayDirection = 'forward' | 'backward';

/**
 * Drives a `VirtualEngine` through a recording, applying the virtual state to
 * a real canvas each tick. Exposes pause/play/scrub controls and a `finished`
 * promise that resolves when the replay reaches the end (and isn't looping).
 */
export class ReplayHandle {
    readonly recording: Recording;
    readonly finished: Promise<void>;

    private _canvas: ReplayCanvas;
    private _virtualEngine: VirtualEngine;
    private _currentTime = 0;
    private _state: ReplayState = 'idle';
    private _direction: ReplayDirection = 'forward';
    private _speed = 1.0;
    private _from: number;
    private _to: number;
    private _loop: boolean | number;
    private _rafHandle: number | null = null;
    private _lastWallTime = 0;
    private _resolveFinished: () => void = () => {};

    constructor(canvas: ReplayCanvas, recording: Recording, options: ReplayOptions = {}) {
        this.recording = recording;
        this._canvas = canvas;
        this._virtualEngine = new VirtualEngine(recording.initialState);

        this._speed = options.speed ?? 1.0;
        this._direction = this._speed < 0 ? 'backward' : 'forward';
        this._from = options.from ?? 0;
        this._to = options.to ?? recording.duration;
        this._loop = options.loop ?? false;
        this._currentTime = this._from;

        if (!options.skipInitialState) {
            this._applyStateToCanvas(recording.initialState as CanvasSnapshot);
        }

        this.finished = new Promise<void>((resolve) => {
            this._resolveFinished = resolve;
        });

        if (options.paused) {
            this._state = 'paused';
        } else if (this._speed !== 0) {
            this.play();
        }
    }

    get duration(): number {
        return this.recording.duration;
    }

    get currentTime(): number {
        return this._currentTime;
    }

    get state(): ReplayState {
        return this._state;
    }

    get direction(): ReplayDirection {
        return this._direction;
    }

    get speed(): number {
        return this._speed;
    }

    set speed(v: number) {
        this._speed = v;
        this._direction = v < 0 ? 'backward' : 'forward';
    }

    play(): void {
        if (this._state === 'playing') {
            return;
        }
        if (this._state === 'ended') {
            this._currentTime = this._from;
            this._virtualEngine = new VirtualEngine(this.recording.initialState);
            this._applyStateToCanvas(this._virtualEngine.getState());
        }
        this._state = 'playing';
        this._lastWallTime = now();
        this._scheduleTick();
    }

    pause(): void {
        if (this._state !== 'playing') {
            return;
        }
        this._state = 'paused';
        this._cancelTick();
    }

    stop(): void {
        this._cancelTick();
        this._currentTime = this._from;
        this._virtualEngine = new VirtualEngine(this.recording.initialState);
        this._applyStateToCanvas(this._virtualEngine.getState());
        this._state = 'idle';
    }

    scrubTo(target: number | string): void {
        const t = this._resolveTarget(target);
        this._currentTime = t;

        const cp = this._findNearestCheckpoint(t);
        if (cp) {
            this._virtualEngine.restoreCheckpoint(cp);
        } else {
            this._virtualEngine = new VirtualEngine(this.recording.initialState);
        }

        const startT = cp?.t ?? 0;
        this._walkTo(startT, t);

        this._applyStateToCanvas(this._virtualEngine.getState());
    }

    seek(target: number | string): void {
        this.scrubTo(target);
    }

    eventsUpTo(t: number): RecordingEvent[] {
        return this.recording.events.filter((e) => e.t <= t);
    }

    getStateAt(t: number): CanvasSnapshot {
        const cp = this._findNearestCheckpoint(t);
        const engine = new VirtualEngine(this.recording.initialState);
        if (cp) {
            engine.restoreCheckpoint(cp);
        }

        const startT = cp?.t ?? 0;
        let vt = startT;
        const dtMs = REPLAY_DT * 1000;

        // Apply any events sitting exactly at startT (boundary: inclusive at start
        // so events emitted at t=0 are not skipped when there's no prior checkpoint).
        if (!cp) {
            for (const event of this.recording.events) {
                if (event.t === startT) {
                    engine.applyEvent(event);
                }
            }
        }

        while (vt < t) {
            const nextVt = Math.min(vt + dtMs, t);
            for (const event of this.recording.events) {
                if (event.t > vt && event.t <= nextVt) {
                    engine.applyEvent(event);
                }
            }
            const stepDt = (nextVt - vt) / 1000;
            if (stepDt > 0) {
                engine.advance(stepDt);
            }
            vt = nextVt;
        }

        return engine.getState();
    }

    // ── Private ─────────────────────────────────────────────────────────────

    private _tick(): void {
        if (this._state !== 'playing') {
            return;
        }

        const current = now();
        const wallDt = (current - this._lastWallTime) / 1000;
        this._lastWallTime = current;

        const virtualDtMs = wallDt * this._speed * 1000;
        const nextTime = this._currentTime + virtualDtMs;

        const hitEnd = this._direction === 'forward'
            ? nextTime >= this._to
            : nextTime <= this._from;

        if (hitEnd) {
            const boundary = this._direction === 'forward' ? this._to : this._from;
            if (this._direction === 'forward') {
                this._walkTo(this._currentTime, boundary);
            } else {
                // Backward: re-seek to boundary from nearest checkpoint.
                const cp = this._findNearestCheckpoint(boundary);
                this._virtualEngine = cp
                    ? (this._virtualEngine.restoreCheckpoint(cp), this._virtualEngine)
                    : new VirtualEngine(this.recording.initialState);
                this._walkTo(cp?.t ?? 0, boundary);
            }
            this._currentTime = boundary;
            this._applyStateToCanvas(this._virtualEngine.getState());
            this._handleEnd();
            return;
        }

        if (virtualDtMs > 0) {
            this._walkTo(this._currentTime, nextTime);
        } else if (virtualDtMs < 0) {
            // Backward step: re-seek via checkpoint.
            const cp = this._findNearestCheckpoint(nextTime);
            if (cp) {
                this._virtualEngine.restoreCheckpoint(cp);
            } else {
                this._virtualEngine = new VirtualEngine(this.recording.initialState);
            }
            this._walkTo(cp?.t ?? 0, nextTime);
        }

        this._currentTime = nextTime;
        this._applyStateToCanvas(this._virtualEngine.getState());

        this._scheduleTick();
    }

    private _scheduleTick(): void {
        if (typeof requestAnimationFrame === 'function') {
            this._rafHandle = requestAnimationFrame(() => this._tick()) as unknown as number;
        } else {
            this._rafHandle = setTimeout(() => this._tick(), 16) as unknown as number;
        }
    }

    private _cancelTick(): void {
        if (this._rafHandle === null) {
            return;
        }
        if (typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(this._rafHandle);
        } else {
            clearTimeout(this._rafHandle as unknown as ReturnType<typeof setTimeout>);
        }
        this._rafHandle = null;
    }

    private _walkTo(startT: number, endT: number): void {
        if (endT <= startT) {
            return;
        }
        let vt = startT;
        const dtMs = REPLAY_DT * 1000;

        // If walking from the very beginning, apply any events at t=0 first.
        // The default window is (vt, nextVt] so events at t=startT are otherwise skipped.
        if (startT === 0) {
            for (const event of this.recording.events) {
                if (event.t === 0) {
                    this._virtualEngine.applyEvent(event);
                }
            }
        }

        while (vt < endT) {
            const nextVt = Math.min(vt + dtMs, endT);

            for (const event of this.recording.events) {
                if (event.t > vt && event.t <= nextVt) {
                    this._virtualEngine.applyEvent(event);
                }
            }

            const stepDt = (nextVt - vt) / 1000;
            if (stepDt > 0) {
                this._virtualEngine.advance(stepDt);
            }
            vt = nextVt;
        }
    }

    private _findNearestCheckpoint(t: number): Checkpoint | null {
        let nearest: Checkpoint | null = null;
        for (const cp of this.recording.checkpoints) {
            if (cp.t <= t && (!nearest || cp.t > nearest.t)) {
                nearest = cp;
            }
        }
        return nearest;
    }

    private _resolveTarget(target: number | string): number {
        const lo = Math.min(this._from, this._to);
        const hi = Math.max(this._from, this._to);
        if (typeof target === 'number') {
            return Math.max(lo, Math.min(hi, target));
        }
        if (target === 'start') {
            return this._from;
        }
        if (target === 'end') {
            return this._to;
        }
        if (target.endsWith('%')) {
            const pct = parseFloat(target) / 100;
            return this._from + pct * (this._to - this._from);
        }
        const parsed = parseFloat(target);
        if (!Number.isNaN(parsed)) {
            return Math.max(lo, Math.min(hi, parsed));
        }
        return this._from;
    }

    private _handleEnd(): void {
        if (this._loop) {
            const remaining = typeof this._loop === 'number' ? this._loop - 1 : Infinity;
            if (remaining > 0) {
                this._loop = typeof this._loop === 'number' ? remaining : true;
                this._currentTime = this._from;
                this._virtualEngine = new VirtualEngine(this.recording.initialState);
                this._applyStateToCanvas(this._virtualEngine.getState());
                this._state = 'playing';
                this._lastWallTime = now();
                this._scheduleTick();
                return;
            }
        }

        this._state = 'ended';
        this._rafHandle = null;
        this._resolveFinished();
    }

    private _applyStateToCanvas(state: CanvasSnapshot): void {
        for (const [id, node] of Object.entries(state.nodes)) {
            const realNode = this._canvas.nodes.find((n: any) => n.id === id);
            if (!realNode) {
                continue;
            }
            if (node.position) {
                if (!realNode.position) {
                    realNode.position = { x: 0, y: 0 };
                }
                if (node.position.x !== undefined) {
                    realNode.position.x = node.position.x;
                }
                if (node.position.y !== undefined) {
                    realNode.position.y = node.position.y;
                }
            }
        }

        if (state.viewport) {
            this._canvas.viewport.x = state.viewport.x;
            this._canvas.viewport.y = state.viewport.y;
            this._canvas.viewport.zoom = state.viewport.zoom;
        }
    }
}

function now(): number {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        return performance.now();
    }
    return Date.now();
}
