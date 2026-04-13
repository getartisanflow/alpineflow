import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ReplayHandle, type ReplayCanvas } from './replay';
import { Recording } from './recording';
import type { RecordingData, CanvasSnapshot, RecordingEvent, Checkpoint } from './types';
import { RECORDING_VERSION } from './types';

function makeInitialState(): CanvasSnapshot {
    return {
        nodes: {
            n1: { id: 'n1', position: { x: 0, y: 0 }, data: {} },
            n2: { id: 'n2', position: { x: 100, y: 100 }, data: {} },
        },
        edges: {
            e1: { id: 'e1', source: 'n1', target: 'n2' },
        },
        viewport: { x: 0, y: 0, zoom: 1 },
    };
}

function makeCanvas(): ReplayCanvas {
    return {
        nodes: [
            { id: 'n1', position: { x: 0, y: 0 } },
            { id: 'n2', position: { x: 100, y: 100 } },
        ],
        edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
        viewport: { x: 0, y: 0, zoom: 1 },
    };
}

function makeRecording(overrides: Partial<RecordingData> = {}): Recording {
    const events: RecordingEvent[] = overrides.events ?? [
        {
            t: 0,
            type: 'animate',
            args: {
                handleId: 'h1',
                targets: { nodes: { n1: { position: { x: 1000, y: 500 } } } },
                options: { duration: 1000, easing: 'linear' },
            },
        },
    ];
    return new Recording({
        version: RECORDING_VERSION,
        duration: overrides.duration ?? 1000,
        initialState: overrides.initialState ?? makeInitialState(),
        events,
        checkpoints: overrides.checkpoints ?? [],
        metadata: overrides.metadata ?? {},
    });
}

describe('ReplayHandle', () => {
    let canvas: ReplayCanvas;
    let recording: Recording;

    beforeEach(() => {
        canvas = makeCanvas();
        recording = makeRecording();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('initializes with recording', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        expect(handle.recording).toBe(recording);
        expect(handle.duration).toBe(1000);
        expect(handle.currentTime).toBe(0);
        expect(handle.state).toBe('paused');
        expect(handle.direction).toBe('forward');
        expect(handle.speed).toBe(1);
    });

    it('restores initialState on construction', () => {
        canvas.nodes[0].position.x = 9999;
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        expect(canvas.nodes[0].position.x).toBe(0);
        expect(handle.state).toBe('paused');
    });

    it('skipInitialState leaves canvas untouched on construction', () => {
        canvas.nodes[0].position.x = 9999;
        new ReplayHandle(canvas, recording, { paused: true, skipInitialState: true });
        expect(canvas.nodes[0].position.x).toBe(9999);
    });

    it('construction with from > 0 walks engine forward so canvas reflects mid-recording state', () => {
        // Recording animates n1.position.x from 0 to 1000 over 1000ms, linear.
        // Starting at from=500 should show x ≈ 500, not 0 (initialState).
        const handle = new ReplayHandle(canvas, recording, { paused: true, from: 500 });
        expect(handle.currentTime).toBe(500);
        expect(canvas.nodes[0].position.x).toBeCloseTo(500, 0);
    });

    it('scrubTo jumps to specified time', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        handle.scrubTo(500);
        expect(handle.currentTime).toBe(500);
        // Linear interpolation halfway through: x should be ~500
        expect(canvas.nodes[0].position.x).toBeCloseTo(500, 0);
    });

    it('scrubTo with percentage resolves correctly', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        handle.scrubTo('50%');
        expect(handle.currentTime).toBe(500);
    });

    it('scrubTo with "end" jumps to duration', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        handle.scrubTo('end');
        expect(handle.currentTime).toBe(1000);
        expect(canvas.nodes[0].position.x).toBeCloseTo(1000, 0);
    });

    it('scrubTo with "start" returns to from', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        handle.scrubTo(800);
        handle.scrubTo('start');
        expect(handle.currentTime).toBe(0);
    });

    it('scrubTo clamps out-of-range values', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        handle.scrubTo(-100);
        expect(handle.currentTime).toBe(0);
        handle.scrubTo(9999);
        expect(handle.currentTime).toBe(1000);
    });

    it('seek is an alias for scrubTo', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        handle.seek('50%');
        expect(handle.currentTime).toBe(500);
    });

    it('pause stops advancement', () => {
        vi.useFakeTimers();
        const handle = new ReplayHandle(canvas, recording);
        expect(handle.state).toBe('playing');
        handle.pause();
        expect(handle.state).toBe('paused');
        const before = handle.currentTime;
        vi.advanceTimersByTime(500);
        expect(handle.currentTime).toBe(before);
    });

    it('play advances currentTime over wall-clock time', () => {
        vi.useFakeTimers();
        vi.setSystemTime(0);
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        expect(handle.currentTime).toBe(0);
        handle.play();
        // Advance 100ms wall-clock; with speed=1 virtual time should advance ~100ms
        vi.advanceTimersByTime(100);
        expect(handle.currentTime).toBeGreaterThan(0);
        expect(handle.currentTime).toBeLessThanOrEqual(120);
    });

    it('stop resets to start', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        handle.scrubTo(750);
        expect(handle.currentTime).toBe(750);
        handle.stop();
        expect(handle.currentTime).toBe(0);
        expect(handle.state).toBe('idle');
        expect(canvas.nodes[0].position.x).toBe(0);
    });

    it('eventsUpTo filters events by timestamp', () => {
        const events: RecordingEvent[] = [
            { t: 0, type: 'animate', args: {} },
            { t: 250, type: 'viewport-change', args: { x: 10 } },
            { t: 750, type: 'node-remove', args: { id: 'n1' } },
            { t: 1000, type: 'timeline-complete', args: {} },
        ];
        const r = makeRecording({ events });
        const handle = new ReplayHandle(canvas, r, { paused: true });

        expect(handle.eventsUpTo(0)).toHaveLength(1);
        expect(handle.eventsUpTo(500)).toHaveLength(2);
        expect(handle.eventsUpTo(1000)).toHaveLength(4);
    });

    it('getStateAt returns state without affecting replay', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        const before = handle.currentTime;
        const state = handle.getStateAt(500);
        expect(state.nodes.n1!.position!.x).toBeCloseTo(500, 0);
        expect(handle.currentTime).toBe(before);
        // Canvas not mutated by getStateAt
        expect(canvas.nodes[0].position.x).toBe(0);
    });

    it('ended state triggers finished promise', async () => {
        vi.useFakeTimers();
        const handle = new ReplayHandle(canvas, recording);

        // Drive wall-clock past duration
        for (let i = 0; i < 100; i++) {
            vi.advanceTimersByTime(50);
        }

        expect(handle.state).toBe('ended');
        // `finished` should already be resolved
        let resolved = false;
        handle.finished.then(() => { resolved = true; });
        await Promise.resolve();
        await Promise.resolve();
        expect(resolved).toBe(true);
    });

    it('loop: true restarts after ended', () => {
        vi.useFakeTimers();
        const handle = new ReplayHandle(canvas, recording, { loop: true });

        // Drive past the duration
        for (let i = 0; i < 50; i++) {
            vi.advanceTimersByTime(50);
        }

        // With loop, should still be playing (restarted)
        expect(handle.state).toBe('playing');
        // currentTime should have reset (not ended at 1000 forever)
        expect(handle.currentTime).toBeLessThanOrEqual(handle.duration);
    });

    it('loop: 3 plays 3 times then ends', async () => {
        vi.useFakeTimers();
        const handle = new ReplayHandle(canvas, recording, { loop: 3 });

        // Drive wall-clock far past 3x duration
        for (let i = 0; i < 200; i++) {
            vi.advanceTimersByTime(50);
        }

        expect(handle.state).toBe('ended');
    });

    it('speed setter updates direction', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        expect(handle.direction).toBe('forward');
        handle.speed = -1;
        expect(handle.direction).toBe('backward');
        expect(handle.speed).toBe(-1);
        handle.speed = 2;
        expect(handle.direction).toBe('forward');
    });

    it('negative speed sets backward direction on construction', () => {
        const handle = new ReplayHandle(canvas, recording, { speed: -1, paused: true });
        expect(handle.direction).toBe('backward');
    });

    it('scrubTo uses checkpoints when available', () => {
        const cp: Checkpoint = {
            t: 500,
            canvas: {
                nodes: {
                    n1: { id: 'n1', position: { x: 500, y: 250 }, data: {} },
                    n2: { id: 'n2', position: { x: 100, y: 100 }, data: {} },
                },
                edges: { e1: { id: 'e1', source: 'n1', target: 'n2' } },
                viewport: { x: 0, y: 0, zoom: 1 },
            },
            inFlight: [],
            tagRegistry: {},
        };
        const r = makeRecording({ checkpoints: [cp] });
        const handle = new ReplayHandle(canvas, r, { paused: true });
        handle.scrubTo(500);
        expect(canvas.nodes[0].position.x).toBeCloseTo(500, 0);
    });

    it('applies viewport changes to canvas', () => {
        const events: RecordingEvent[] = [
            { t: 100, type: 'viewport-change', args: { x: 50, y: 25, zoom: 2 } },
        ];
        const r = makeRecording({ events });
        const handle = new ReplayHandle(canvas, r, { paused: true });
        handle.scrubTo(500);
        expect(canvas.viewport.x).toBe(50);
        expect(canvas.viewport.y).toBe(25);
        expect(canvas.viewport.zoom).toBe(2);
    });

    it('constructs paused when options.paused is true', () => {
        const handle = new ReplayHandle(canvas, recording, { paused: true });
        expect(handle.state).toBe('paused');
    });

    it('play after ended restarts from start', () => {
        vi.useFakeTimers();
        const handle = new ReplayHandle(canvas, recording);
        for (let i = 0; i < 100; i++) {
            vi.advanceTimersByTime(50);
        }
        expect(handle.state).toBe('ended');
        handle.play();
        expect(handle.state).toBe('playing');
        expect(handle.currentTime).toBeLessThan(handle.duration);
    });

    describe('getStateAt window-boundary parity', () => {
        it('recording.getStateAt(t) matches handle.getStateAt(t) for representative t', () => {
            const recordingData = makeRecording({
                duration: 1000,
                events: [
                    {
                        t: 0,
                        type: 'animate',
                        args: {
                            handleId: 'h-start',
                            targets: { nodes: { n1: { position: { x: 500 } } } },
                            options: { duration: 400, easing: 'linear' },
                        },
                    },
                    {
                        t: 500,
                        type: 'animate',
                        args: {
                            handleId: 'h-mid',
                            targets: { nodes: { n2: { position: { x: 900 } } } },
                            options: { duration: 300, easing: 'linear' },
                        },
                    },
                ],
            });

            const canvas2 = makeCanvas();
            const handle = new ReplayHandle(canvas2, recordingData, { paused: true });

            for (const t of [0, 100, 250, 500, 750, 1000]) {
                const fromRecording = recordingData.getStateAt(t);
                const fromHandle = handle.getStateAt(t);
                expect(fromHandle.nodes.n1!.position!.x).toBeCloseTo(
                    fromRecording.nodes.n1!.position!.x ?? 0,
                    3,
                );
                expect(fromHandle.nodes.n2!.position!.x).toBeCloseTo(
                    fromRecording.nodes.n2!.position!.x ?? 0,
                    3,
                );
            }
        });
    });

    describe('structural reconciliation', () => {
        function recordingWithStructural(): Recording {
            return new Recording({
                version: RECORDING_VERSION,
                duration: 1000,
                initialState: makeInitialState(),
                events: [
                    {
                        t: 100,
                        type: 'node-add',
                        args: { nodes: [{ id: 'n3', position: { x: 50, y: 50 }, data: {} }] },
                    },
                    {
                        t: 200,
                        type: 'edge-add',
                        args: { edges: [{ id: 'e2', source: 'n2', target: 'n3' }] },
                    },
                    {
                        t: 500,
                        type: 'node-remove',
                        args: { ids: ['n1'] },
                    },
                    {
                        t: 500,
                        type: 'edge-remove',
                        args: { ids: ['e1'] },
                    },
                ],
                checkpoints: [],
                metadata: {},
            });
        }

        it('adds nodes via addNodes method when present', () => {
            const addNodes = vi.fn((nodes: any) => {
                const arr = Array.isArray(nodes) ? nodes : [nodes];
                canvas.nodes.push(...arr);
            });
            const removeNodes = vi.fn();
            canvas.addNodes = addNodes;
            canvas.removeNodes = removeNodes;

            const handle = new ReplayHandle(canvas, recordingWithStructural(), { paused: true });
            handle.scrubTo(300);

            expect(addNodes).toHaveBeenCalled();
            expect(canvas.nodes.some((n) => n.id === 'n3')).toBe(true);
        });

        it('removes nodes via removeNodes method when present', () => {
            const addNodes = vi.fn((nodes: any) => {
                const arr = Array.isArray(nodes) ? nodes : [nodes];
                canvas.nodes.push(...arr);
            });
            const removeNodes = vi.fn((ids: any) => {
                const idList = Array.isArray(ids) ? ids : [ids];
                for (const id of idList) {
                    const idx = canvas.nodes.findIndex((n) => n.id === id);
                    if (idx !== -1) canvas.nodes.splice(idx, 1);
                }
            });
            canvas.addNodes = addNodes;
            canvas.removeNodes = removeNodes;

            const handle = new ReplayHandle(canvas, recordingWithStructural(), { paused: true });
            handle.scrubTo(800);

            expect(removeNodes).toHaveBeenCalled();
            expect(canvas.nodes.some((n) => n.id === 'n1')).toBe(false);
            expect(canvas.nodes.some((n) => n.id === 'n3')).toBe(true);
        });

        it('falls back to direct array mutation when structural methods missing', () => {
            const handle = new ReplayHandle(canvas, recordingWithStructural(), { paused: true });
            handle.scrubTo(300);
            expect(canvas.nodes.some((n) => n.id === 'n3')).toBe(true);

            handle.scrubTo(800);
            expect(canvas.nodes.some((n) => n.id === 'n1')).toBe(false);
            expect(canvas.edges.some((e) => e.id === 'e1')).toBe(false);
            expect(canvas.edges.some((e) => e.id === 'e2')).toBe(true);
        });

        it('reconciles edges the same way as nodes', () => {
            const addEdges = vi.fn((edges: any) => {
                const arr = Array.isArray(edges) ? edges : [edges];
                canvas.edges.push(...arr);
            });
            const removeEdges = vi.fn((ids: any) => {
                const idList = Array.isArray(ids) ? ids : [ids];
                for (const id of idList) {
                    const idx = canvas.edges.findIndex((e) => e.id === id);
                    if (idx !== -1) canvas.edges.splice(idx, 1);
                }
            });
            canvas.addEdges = addEdges;
            canvas.removeEdges = removeEdges;

            const handle = new ReplayHandle(canvas, recordingWithStructural(), { paused: true });
            handle.scrubTo(300);
            expect(addEdges).toHaveBeenCalled();
            expect(canvas.edges.some((e) => e.id === 'e2')).toBe(true);

            handle.scrubTo(800);
            expect(removeEdges).toHaveBeenCalled();
            expect(canvas.edges.some((e) => e.id === 'e1')).toBe(false);
        });

        it('is idempotent when canvas already matches virtual state', () => {
            const addNodes = vi.fn();
            const removeNodes = vi.fn();
            canvas.addNodes = addNodes;
            canvas.removeNodes = removeNodes;

            // Initial state already matches — no structural changes needed.
            new ReplayHandle(canvas, makeRecording(), { paused: true });

            expect(addNodes).not.toHaveBeenCalled();
            expect(removeNodes).not.toHaveBeenCalled();
        });
    });
});
