import type { RecordingData, RecordingEvent, Checkpoint, CanvasSnapshot } from './types';
import { RECORDING_VERSION } from './types';
import { VirtualEngine, REPLAY_DT } from './virtual-engine';
import { getThumbnailRenderer } from './thumbnail';
import { firstEventIndexAfter, firstEventIndexAtOrAfter } from './event-cursor';
import { safeClone } from '../clone';

function getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
}

function deepFreeze<T>(value: T): T {
    if (value !== null && typeof value === 'object') {
        Object.freeze(value);
        for (const key of Object.keys(value as object)) {
            deepFreeze((value as Record<string, unknown>)[key]);
        }
    }
    return value;
}

export class Recording {
    readonly version: number;
    readonly duration: number;
    readonly initialState: Readonly<CanvasSnapshot>;
    readonly events: ReadonlyArray<RecordingEvent>;
    readonly checkpoints: ReadonlyArray<Checkpoint>;
    readonly metadata: Readonly<Record<string, any>>;

    constructor(data: RecordingData) {
        this.version = data.version;
        this.duration = data.duration;
        this.initialState = deepFreeze(safeClone(data.initialState));
        this.events = Object.freeze(safeClone(data.events));
        this.checkpoints = Object.freeze(safeClone(data.checkpoints));
        this.metadata = Object.freeze({ ...(data.metadata ?? {}) });
        Object.freeze(this);
    }

    toJSON(): RecordingData {
        return {
            version: this.version,
            duration: this.duration,
            initialState: safeClone(this.initialState as CanvasSnapshot),
            events: safeClone(this.events as RecordingEvent[]),
            checkpoints: safeClone(this.checkpoints as Checkpoint[]),
            metadata: { ...this.metadata },
        };
    }

    static fromJSON(data: RecordingData): Recording {
        if (data.version > RECORDING_VERSION) {
            throw new Error(
                `[AlpineFlow] Recording version ${data.version} is newer than supported (${RECORDING_VERSION}). ` +
                `Please update AlpineFlow to replay this recording.`
            );
        }
        // Future: migrate older versions here
        return new Recording(data);
    }

    /**
     * Returns unique subjects (nodes, edges, timelines, particles) that appeared
     * during the recording, with their first-seen and last-seen timestamps.
     */
    getSubjects(): Array<{
        kind: 'node' | 'edge' | 'timeline' | 'particle';
        id: string;
        firstSeenT: number;
        lastSeenT: number;
    }> {
        const map = new Map<string, { kind: 'node' | 'edge' | 'timeline' | 'particle'; id: string; firstSeenT: number; lastSeenT: number }>();

        const track = (kind: 'node' | 'edge' | 'timeline' | 'particle', id: string, t: number) => {
            const key = `${kind}:${id}`;
            const existing = map.get(key);
            if (existing) {
                if (t < existing.firstSeenT) { existing.firstSeenT = t; }
                if (t > existing.lastSeenT) { existing.lastSeenT = t; }
            } else {
                map.set(key, { kind, id, firstSeenT: t, lastSeenT: t });
            }
        };

        // Seed from initialState (t = 0)
        for (const id of Object.keys(this.initialState.nodes)) {
            track('node', id, 0);
        }
        for (const id of Object.keys(this.initialState.edges)) {
            track('edge', id, 0);
        }

        // Walk events
        for (const event of this.events) {
            const { t, type, args } = event;
            switch (type) {
                case 'animate':
                case 'update':
                    for (const id of Object.keys(args.targets?.nodes ?? {})) {
                        track('node', id, t);
                    }
                    for (const id of Object.keys(args.targets?.edges ?? {})) {
                        track('edge', id, t);
                    }
                    break;
                case 'particle':
                case 'particle-burst':
                    if (args.edgeId) { track('edge', args.edgeId, t); }
                    break;
                case 'particle-between':
                    if (args.source) { track('node', args.source, t); }
                    if (args.target) { track('node', args.target, t); }
                    break;
                case 'converging':
                    if (Array.isArray(args.sources)) {
                        for (const id of args.sources) { track('edge', id, t); }
                    }
                    if (args.options?.targetNodeId) { track('node', args.options.targetNodeId, t); }
                    break;
                case 'node-add':
                case 'node-remove':
                    if (args.id) { track('node', args.id, t); }
                    if (Array.isArray(args.nodes)) {
                        for (const n of args.nodes) {
                            if (n.id) { track('node', n.id, t); }
                        }
                    }
                    break;
                case 'edge-add':
                case 'edge-remove':
                    if (args.id) { track('edge', args.id, t); }
                    if (Array.isArray(args.edges)) {
                        for (const e of args.edges) {
                            if (e.id) { track('edge', e.id, t); }
                        }
                    }
                    break;
            }
        }

        return Array.from(map.values());
    }

    /**
     * Returns activity spans for a specific subject identified by `id`.
     */
    getActivityFor(id: string): Array<{ startT: number; endT: number; reason: string }> {
        const spans: Array<{ startT: number; endT: number; reason: string }> = [];

        for (const event of this.events) {
            const { t, type, args } = event;
            const involvesSubject = (() => {
                switch (type) {
                    case 'animate':
                    case 'update':
                        return id in (args.targets?.nodes ?? {}) || id in (args.targets?.edges ?? {});
                    case 'particle':
                    case 'particle-burst':
                        return args.edgeId === id;
                    case 'particle-between':
                        return args.source === id || args.target === id;
                    case 'converging':
                        return (Array.isArray(args.sources) && args.sources.includes(id))
                            || args.options?.targetNodeId === id;
                    case 'node-add':
                    case 'node-remove':
                        if (args.id === id) { return true; }
                        if (Array.isArray(args.nodes) && args.nodes.some((n: any) => n.id === id)) { return true; }
                        return false;
                    case 'edge-add':
                    case 'edge-remove':
                        if (args.id === id) { return true; }
                        if (Array.isArray(args.edges) && args.edges.some((e: any) => e.id === id)) { return true; }
                        return false;
                    default:
                        return false;
                }
            })();

            if (!involvesSubject) { continue; }

            switch (type) {
                case 'animate': {
                    const duration = args.options?.duration ?? 0;
                    spans.push({ startT: t, endT: t + duration, reason: 'animate' });
                    break;
                }
                case 'particle':
                case 'particle-burst':
                case 'particle-between': {
                    const duration = args.options?.duration ?? args.duration ?? 1;
                    spans.push({ startT: t, endT: t + duration, reason: type });
                    break;
                }
                case 'converging': {
                    const duration = args.options?.duration ?? 1;
                    spans.push({ startT: t, endT: t + duration, reason: 'converging' });
                    break;
                }
                default:
                    spans.push({ startT: t, endT: t + 1, reason: type });
                    break;
            }
        }

        return spans;
    }

    /**
     * Returns sample points for a property's value over time, sampled from checkpoints.
     * `path` uses dot notation, e.g. `'nodes.trigger.position.x'`.
     */
    getValueTrack(path: string): Array<{ t: number; v: any }> {
        const result: Array<{ t: number; v: any }> = [];
        for (const cp of this.checkpoints) {
            const v = getNestedProperty(cp.canvas, path);
            if (v !== undefined) {
                result.push({ t: cp.t, v });
            }
        }
        return result;
    }

    /**
     * Returns the canvas state at virtual time `t` by running the VirtualEngine
     * up to that point from the nearest prior checkpoint.
     */
    getStateAt(t: number): CanvasSnapshot {
        const engine = new VirtualEngine(this.initialState as CanvasSnapshot);

        // Find nearest checkpoint ≤ t
        let nearest: Checkpoint | null = null;
        for (const cp of this.checkpoints) {
            if (cp.t <= t && (!nearest || cp.t > nearest.t)) {
                nearest = cp as Checkpoint;
            }
        }

        if (nearest) { engine.restoreCheckpoint(nearest); }

        // Walk forward to t
        const startVt = nearest?.t ?? 0;
        const events = this.events;
        let vt = startVt;
        const dtMs = REPLAY_DT * 1000;

        // Monotonic cursor. If a checkpoint was restored, the checkpoint
        // already reflects the canvas state AFTER events at startVt ran, so
        // skip them (strictly-after). Without a checkpoint, include events at
        // startVt so t=0 events are picked up by the main loop on its first
        // iteration (where nextVt = min(dtMs, t) covers them via `<= nextVt`).
        // Matches ReplayHandle.getStateAt exactly — no pre-loop needed.
        let cursor = nearest
            ? firstEventIndexAfter(events, startVt)
            : firstEventIndexAtOrAfter(events, startVt);

        while (vt < t) {
            const nextVt = Math.min(vt + dtMs, t);
            while (cursor < events.length && events[cursor].t <= nextVt) {
                engine.applyEvent(events[cursor] as RecordingEvent);
                cursor++;
            }
            const stepDt = (nextVt - vt) / 1000;
            engine.advance(stepDt);
            vt = nextVt;
        }

        return engine.getState();
    }

    /**
     * Renders a thumbnail SVG snapshot of the canvas state at virtual time `t`.
     */
    renderThumbnailAt(t: number, options: { width: number; height: number; renderer?: string }): string {
        const state = this.getStateAt(t);
        const rendererName = options.renderer ?? 'faithful';
        const renderer = getThumbnailRenderer(rendererName);

        if (!renderer) {
            throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${rendererName}"`);
        }

        return renderer.render(state, { width: options.width, height: options.height });
    }
}
