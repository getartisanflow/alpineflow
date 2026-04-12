import { describe, it, expect, vi } from 'vitest';
import { Recording } from './recording';
import { VirtualEngine, REPLAY_DT } from './virtual-engine';
import { Recorder } from './recorder';
import type { RecordingData, CanvasSnapshot } from './types';

const makeInitialState = (): CanvasSnapshot => ({
    nodes: {
        a: { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 40 } } as any,
        b: { id: 'b', position: { x: 200, y: 100 }, dimensions: { width: 100, height: 40 } } as any,
    },
    edges: {},
    viewport: { x: 0, y: 0, zoom: 1 },
});

describe('Recording determinism', () => {
    it('two VirtualEngines produce identical state from same events', () => {
        const data: RecordingData = {
            version: 1,
            duration: 1000,
            initialState: makeInitialState(),
            events: [
                { t: 100, type: 'animate', args: { handleId: 'h1', targets: { nodes: { a: { position: { x: 500 } } } }, options: { duration: 500 } } },
                { t: 600, type: 'animate', args: { handleId: 'h2', targets: { nodes: { b: { position: { x: 800 } } } }, options: { duration: 300 } } },
            ],
            checkpoints: [],
        };
        const recording = new Recording(data);

        const engine1 = new VirtualEngine(recording.initialState as CanvasSnapshot);
        const engine2 = new VirtualEngine(recording.initialState as CanvasSnapshot);

        const advanceBoth = (targetT: number) => {
            let vt = 0;
            const dtMs = REPLAY_DT * 1000;
            while (vt < targetT) {
                const nextVt = Math.min(vt + dtMs, targetT);
                for (const event of recording.events) {
                    if (event.t > vt && event.t <= nextVt) {
                        engine1.applyEvent(event);
                        engine2.applyEvent(event);
                    }
                }
                const stepDt = (nextVt - vt) / 1000;
                engine1.advance(stepDt);
                engine2.advance(stepDt);
                vt = nextVt;
            }
        };

        advanceBoth(1000);

        expect(engine1.getState()).toEqual(engine2.getState());
    });

    it('getStateAt produces same result for same t across multiple calls', () => {
        const data: RecordingData = {
            version: 1,
            duration: 2000,
            initialState: makeInitialState(),
            events: [
                { t: 0, type: 'animate', args: { handleId: 'h1', targets: { nodes: { a: { position: { x: 500 } } } }, options: { duration: 1000 } } },
            ],
            checkpoints: [],
        };
        const recording = new Recording(data);

        const state1 = recording.getStateAt(500);
        const state2 = recording.getStateAt(500);
        const state3 = recording.getStateAt(500);

        expect(state1).toEqual(state2);
        expect(state2).toEqual(state3);
    });

    it('physics integration is deterministic', () => {
        const data: RecordingData = {
            version: 1,
            duration: 2000,
            initialState: makeInitialState(),
            events: [
                { t: 0, type: 'animate', args: { handleId: 'spring1', targets: { nodes: { a: { position: { x: 500 } } } }, options: { motion: 'spring.stiff' } } },
            ],
            checkpoints: [],
        };
        const recording = new Recording(data);

        const state1 = recording.getStateAt(1500);
        const state2 = recording.getStateAt(1500);

        expect(state1.nodes.a).toEqual(state2.nodes.a);
    });

    it('checkpoint restoration produces identical state', () => {
        const initialState = makeInitialState();
        const data: RecordingData = {
            version: 1,
            duration: 1000,
            initialState,
            events: [
                { t: 100, type: 'animate', args: { handleId: 'h1', targets: { nodes: { a: { position: { x: 300 } } } }, options: { duration: 200 } } },
                { t: 500, type: 'animate', args: { handleId: 'h2', targets: { nodes: { a: { position: { x: 600 } } } }, options: { duration: 200 } } },
            ],
            checkpoints: [
                {
                    t: 400,
                    canvas: {
                        nodes: {
                            a: { id: 'a', position: { x: 300, y: 0 }, dimensions: { width: 100, height: 40 } } as any,
                            b: initialState.nodes.b,
                        },
                        edges: {},
                        viewport: { x: 0, y: 0, zoom: 1 },
                    },
                    inFlight: [],
                    tagRegistry: {},
                },
            ],
        };
        const recording = new Recording(data);

        const stateFromStart = recording.getStateAt(800);

        const noCheckpointRecording = new Recording({
            ...data,
            checkpoints: [],
        });
        const stateNoCheckpoint = noCheckpointRecording.getStateAt(800);

        expect(stateFromStart.nodes.a.position!.x).toBeCloseTo(stateNoCheckpoint.nodes.a.position!.x, 1);
    });

    it('recorder+replay round-trip produces consistent event list', async () => {
        const canvas = {
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 40 } },
            ],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 },
            animate: vi.fn(() => ({ finished: Promise.resolve() })),
            update: vi.fn(),
        };

        const recorder = new Recorder(canvas as any, { checkpointInterval: 10000 });
        const recording = await recorder.record(async () => {
            canvas.animate({ nodes: { a: { position: { x: 100 } } } }, { duration: 200 });
        });

        expect(recording.events.length).toBeGreaterThanOrEqual(1);
        expect(recording.events[0].type).toBe('animate');

        const engine = new VirtualEngine(recording.initialState as CanvasSnapshot);
        let vt = 0;
        const target = 500;
        const dtMs = REPLAY_DT * 1000;
        while (vt < target) {
            const nextVt = Math.min(vt + dtMs, target);
            for (const event of recording.events) {
                if (event.t >= vt && event.t < nextVt) {
                    engine.applyEvent(event);
                }
            }
            engine.advance((nextVt - vt) / 1000);
            vt = nextVt;
        }

        const state = engine.getState();
        expect(state.nodes.a.position!.x).toBeGreaterThan(0);
    });

    it('identical recordings produce identical stateAt results', () => {
        const data: RecordingData = {
            version: 1,
            duration: 1000,
            initialState: makeInitialState(),
            events: [
                { t: 50, type: 'animate', args: { handleId: 'h1', targets: { nodes: { a: { position: { x: 400 } } } }, options: { duration: 500 } } },
            ],
            checkpoints: [],
        };

        const rec1 = new Recording(data);
        const rec2 = new Recording(data);

        for (const t of [100, 250, 500, 750, 900]) {
            expect(rec1.getStateAt(t)).toEqual(rec2.getStateAt(t));
        }
    });
});
