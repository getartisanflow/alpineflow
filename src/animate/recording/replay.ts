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
import { firstEventIndexAfter, firstEventIndexAtOrAfter } from './event-cursor';

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
    /**
     * Optional structural methods — when present, replay uses these to add or
     * remove nodes/edges during state reconciliation. Without them, a recording
     * that contains node-add/remove events only replays correctly on a canvas
     * that already has the same nodes present.
     */
    addNodes?(nodes: any | any[]): void;
    removeNodes?(ids: string | string[]): void;
    addEdges?(edges: any | any[]): void;
    removeEdges?(ids: string | string[]): void;
    /**
     * Optional particle emission methods — when present, replay dispatches
     * captured particle events back to the live canvas during forward playback
     * so recordings containing `sendParticle*` / `sendConverging` calls reproduce
     * their visual effects. Not called during scrubbing (particles are
     * momentary visuals; re-firing on every scrub frame would be disorienting).
     */
    sendParticle?(edgeId: string, options?: any): any;
    sendParticleAlongPath?(path: string, options?: any): any;
    sendParticleBetween?(source: string, target: string, options?: any): any;
    sendParticleBurst?(edgeId: string, options: any): any;
    sendConverging?(sources: string[], options: any): any;
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

        // If starting past t=0, walk the engine forward so it reflects the
        // correct state at _from (accounting for checkpoints). Without this,
        // events in [0, _from] are skipped and the first tick applies events
        // strictly after _from — causing the canvas to jump from initialState
        // to mid-recording state without reflecting anything in between.
        if (this._from > 0) {
            this._seekEngineTo(this._from);
        }

        if (!options.skipInitialState) {
            this._applyStateToCanvas(this._virtualEngine.getState());
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
            this._seekEngineTo(this._from);
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
        this._seekEngineTo(t);
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
        const events = this.recording.events;
        let vt = startT;
        const dtMs = REPLAY_DT * 1000;

        // Monotonic cursor — binary-search to the first event past startT.
        // When there's no checkpoint, include events exactly at startT so t=0
        // events aren't skipped.
        let cursor = cp
            ? firstEventIndexAfter(events, startT)
            : firstEventIndexAtOrAfter(events, startT);

        while (vt < t) {
            const nextVt = Math.min(vt + dtMs, t);
            while (cursor < events.length && events[cursor].t <= nextVt) {
                engine.applyEvent(events[cursor]);
                cursor++;
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
                // Fire particles for the remaining forward range so any events
                // sitting at the boundary still emit.
                this._walkTo(this._currentTime, boundary, true);
            } else {
                // Backward boundary: re-seek from nearest checkpoint.
                this._seekEngineTo(boundary);
            }
            this._currentTime = boundary;
            this._applyStateToCanvas(this._virtualEngine.getState());
            this._handleEnd();
            return;
        }

        if (virtualDtMs > 0) {
            // Forward playback — dispatch captured particle events live so
            // recordings that include sendParticle* calls visibly replay them.
            this._walkTo(this._currentTime, nextTime, true);
        } else if (virtualDtMs < 0) {
            // Backward step: re-seek via checkpoint. No particle dispatch —
            // particles are momentary; firing them during reverse would be
            // disorienting and doesn't match any real "undo" of the emission.
            this._seekEngineTo(nextTime);
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

    /**
     * Reset the virtual engine to reflect the canvas state at virtual time `t`
     * — either by restoring the nearest checkpoint and walking forward, or by
     * walking from the recording's initial state. Used when seeking discretely
     * (play-after-ended, loop restart, constructor with non-zero `from`);
     * scrubTo has its own inlined copy because it also updates `_currentTime`.
     */
    private _seekEngineTo(t: number): void {
        const cp = this._findNearestCheckpoint(t);
        if (cp) {
            this._virtualEngine.restoreCheckpoint(cp);
        } else {
            this._virtualEngine = new VirtualEngine(this.recording.initialState);
        }
        this._walkTo(cp?.t ?? 0, t);
    }

    private _walkTo(startT: number, endT: number, dispatchLiveParticles = false): void {
        if (endT <= startT) {
            return;
        }
        const events = this.recording.events;
        let vt = startT;
        const dtMs = REPLAY_DT * 1000;

        // Monotonic cursor — one binary search, then linear advance per step.
        // At t=0 we include events on the boundary (matching pre-refactor
        // behavior); otherwise the scan window is (vt, nextVt].
        let cursor = startT === 0
            ? firstEventIndexAtOrAfter(events, 0)
            : firstEventIndexAfter(events, startT);

        while (vt < endT) {
            const nextVt = Math.min(vt + dtMs, endT);
            while (cursor < events.length && events[cursor].t <= nextVt) {
                const event = events[cursor];
                this._virtualEngine.applyEvent(event);
                if (dispatchLiveParticles) {
                    this._dispatchLiveParticle(event);
                }
                cursor++;
            }
            const stepDt = (nextVt - vt) / 1000;
            if (stepDt > 0) {
                this._virtualEngine.advance(stepDt);
            }
            vt = nextVt;
        }
    }

    /**
     * Forward a captured particle event to the live canvas so its visual
     * effect replays. Non-particle events (animate, update, structural) are
     * already driven by `_applyStateToCanvas` via the virtual engine's state
     * — particles are the one event class that only exists as a visual and
     * therefore must be re-emitted on the real canvas.
     */
    private _dispatchLiveParticle(event: RecordingEvent): void {
        const c = this._canvas;
        switch (event.type) {
            case 'particle':
                c.sendParticle?.(event.args.edgeId, event.args.options);
                break;
            case 'particle-along-path':
                c.sendParticleAlongPath?.(event.args.path, event.args.options);
                break;
            case 'particle-between':
                c.sendParticleBetween?.(event.args.source, event.args.target, event.args.options);
                break;
            case 'particle-burst':
                c.sendParticleBurst?.(event.args.edgeId, event.args.options);
                break;
            case 'converging':
                c.sendConverging?.(event.args.sources, event.args.options);
                break;
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
                this._seekEngineTo(this._from);
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
        this._reconcileNodes(state);
        this._reconcileEdges(state);

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

    /**
     * Diff virtual vs. real node sets and apply structural changes. Prefers
     * the canvas's own addNodes/removeNodes when available so reactivity and
     * measurement hooks fire; falls back to direct array mutation otherwise.
     */
    private _reconcileNodes(state: CanvasSnapshot): void {
        const virtualIds = new Set(Object.keys(state.nodes));
        const realIds = new Set(this._canvas.nodes.map((n: any) => n?.id).filter(Boolean));

        const toAdd: any[] = [];
        for (const id of virtualIds) {
            if (!realIds.has(id)) {
                toAdd.push(state.nodes[id]);
            }
        }
        const toRemove: string[] = [];
        for (const id of realIds) {
            if (!virtualIds.has(id)) {
                toRemove.push(id);
            }
        }

        if (toAdd.length > 0) {
            if (typeof this._canvas.addNodes === 'function') {
                this._canvas.addNodes(toAdd);
            } else {
                this._canvas.nodes.push(...toAdd);
            }
        }
        if (toRemove.length > 0) {
            if (typeof this._canvas.removeNodes === 'function') {
                this._canvas.removeNodes(toRemove);
            } else {
                // Splice-by-index preserves the array reference (callers may
                // hold it). Safe here because reconciliation runs inside the
                // replay rAF tick — before Alpine's reactive re-render — so
                // no external iterator should be traversing `canvas.nodes`.
                for (const id of toRemove) {
                    const idx = this._canvas.nodes.findIndex((n: any) => n?.id === id);
                    if (idx !== -1) this._canvas.nodes.splice(idx, 1);
                }
            }
        }
    }

    private _reconcileEdges(state: CanvasSnapshot): void {
        const virtualIds = new Set(Object.keys(state.edges));
        const realIds = new Set(this._canvas.edges.map((e: any) => e?.id).filter(Boolean));

        const toAdd: any[] = [];
        for (const id of virtualIds) {
            if (!realIds.has(id)) {
                toAdd.push(state.edges[id]);
            }
        }
        const toRemove: string[] = [];
        for (const id of realIds) {
            if (!virtualIds.has(id)) {
                toRemove.push(id);
            }
        }

        if (toAdd.length > 0) {
            if (typeof this._canvas.addEdges === 'function') {
                this._canvas.addEdges(toAdd);
            } else {
                this._canvas.edges.push(...toAdd);
            }
        }
        if (toRemove.length > 0) {
            if (typeof this._canvas.removeEdges === 'function') {
                this._canvas.removeEdges(toRemove);
            } else {
                // See `_reconcileNodes` — splice-by-index is the least-bad
                // fallback when no structural method is available.
                for (const id of toRemove) {
                    const idx = this._canvas.edges.findIndex((e: any) => e?.id === id);
                    if (idx !== -1) this._canvas.edges.splice(idx, 1);
                }
            }
        }
    }
}

function now(): number {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        return performance.now();
    }
    return Date.now();
}
