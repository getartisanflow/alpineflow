import { describe, it, expect, beforeEach } from 'vitest';
import { VirtualEngine, REPLAY_DT } from './virtual-engine';
import type { CanvasSnapshot, RecordingEvent, Checkpoint } from './types';

function makeSnapshot(): CanvasSnapshot {
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

describe('VirtualEngine', () => {
    let engine: VirtualEngine;

    beforeEach(() => {
        engine = new VirtualEngine(makeSnapshot());
    });

    it('exposes REPLAY_DT as 1/60', () => {
        expect(REPLAY_DT).toBeCloseTo(1 / 60, 6);
    });

    it('constructs from initial state and clones it', () => {
        const initial = makeSnapshot();
        const e = new VirtualEngine(initial);
        expect(e.virtualTime).toBe(0);
        expect(e.inFlightCount).toBe(0);
        const state = e.getState();
        expect(state.nodes.n1!.position!.x).toBe(0);

        // Mutating original should not affect engine
        initial.nodes.n1!.position!.x = 999;
        expect(e.getState().nodes.n1!.position!.x).toBe(0);
    });

    it('getState returns a deep clone (mutation does not leak back)', () => {
        const s1 = engine.getState();
        s1.nodes.n1!.position!.x = 500;
        const s2 = engine.getState();
        expect(s2.nodes.n1!.position!.x).toBe(0);
    });

    it('advance(0) is a no-op', () => {
        engine.advance(0);
        expect(engine.virtualTime).toBe(0);
    });

    it('advance with no events leaves state unchanged', () => {
        for (let i = 0; i < 10; i++) {
            engine.advance(REPLAY_DT);
        }
        const state = engine.getState();
        expect(state.nodes.n1!.position!.x).toBe(0);
        expect(state.nodes.n1!.position!.y).toBe(0);
        expect(engine.virtualTime).toBeGreaterThan(0);
    });

    it('virtualTime accumulates in milliseconds', () => {
        engine.advance(REPLAY_DT); // 1/60 s = ~16.67 ms
        expect(engine.virtualTime).toBeCloseTo(1000 / 60, 3);
    });

    describe('applyEvent — animate', () => {
        it('creates an in-flight entry for an eased animation', () => {
            const evt: RecordingEvent = {
                t: 0,
                type: 'animate',
                args: {
                    handleId: 'h1',
                    targets: { nodes: { n1: { position: { x: 100, y: 50 } } } },
                    options: { duration: 1000, easing: 'linear' },
                },
            };
            engine.applyEvent(evt);
            expect(engine.inFlightCount).toBe(1);
        });

        it('progresses eased animation linearly to target', () => {
            engine.applyEvent({
                t: 0,
                type: 'animate',
                args: {
                    handleId: 'h1',
                    targets: { nodes: { n1: { position: { x: 100, y: 0 } } } },
                    options: { duration: 1000, easing: 'linear' },
                },
            });

            // Advance half the duration (500ms)
            const stepsToHalf = Math.round(0.5 / REPLAY_DT);
            for (let i = 0; i < stepsToHalf; i++) {
                engine.advance(REPLAY_DT);
            }

            const x = engine.getState().nodes.n1!.position!.x;
            expect(x).toBeGreaterThan(40);
            expect(x).toBeLessThan(60);
        });

        it('eased animation settles and is removed from in-flight after duration', () => {
            engine.applyEvent({
                t: 0,
                type: 'animate',
                args: {
                    handleId: 'h1',
                    targets: { nodes: { n1: { position: { x: 100, y: 200 } } } },
                    options: { duration: 500, easing: 'linear' },
                },
            });

            // Advance past the duration
            const steps = Math.ceil(0.6 / REPLAY_DT);
            for (let i = 0; i < steps; i++) {
                engine.advance(REPLAY_DT);
            }

            expect(engine.inFlightCount).toBe(0);
            const state = engine.getState();
            expect(state.nodes.n1!.position!.x).toBeCloseTo(100, 1);
            expect(state.nodes.n1!.position!.y).toBeCloseTo(200, 1);
        });

        it('settles a spring animation after enough advance calls', () => {
            engine.applyEvent({
                t: 0,
                type: 'animate',
                args: {
                    handleId: 'spring1',
                    targets: { nodes: { n1: { position: { x: 50, y: 0 } } } },
                    options: {
                        motion: { type: 'spring', stiffness: 300, damping: 30 },
                    },
                },
            });

            expect(engine.inFlightCount).toBe(1);

            // Spring with these params should settle within a couple seconds
            let iterations = 0;
            while (engine.inFlightCount > 0 && iterations < 1000) {
                engine.advance(REPLAY_DT);
                iterations++;
            }

            expect(engine.inFlightCount).toBe(0);
            expect(engine.getState().nodes.n1!.position!.x).toBeCloseTo(50, 1);
        });

        it('animates viewport properties', () => {
            engine.applyEvent({
                t: 0,
                type: 'animate',
                args: {
                    handleId: 'vp',
                    targets: { viewport: { pan: { x: 200, y: 100 }, zoom: 2 } },
                    options: { duration: 500, easing: 'linear' },
                },
            });

            const steps = Math.ceil(0.6 / REPLAY_DT);
            for (let i = 0; i < steps; i++) {
                engine.advance(REPLAY_DT);
            }

            const vp = engine.getState().viewport;
            expect(vp.x).toBeCloseTo(200, 1);
            expect(vp.y).toBeCloseTo(100, 1);
            expect(vp.zoom).toBeCloseTo(2, 1);
        });
    });

    describe('applyEvent — structural mutations', () => {
        it('adds a node via node-add', () => {
            engine.applyEvent({
                t: 0,
                type: 'node-add',
                args: {
                    id: 'n3',
                    node: { id: 'n3', position: { x: 500, y: 500 }, data: {} },
                },
            });
            const state = engine.getState();
            expect(state.nodes.n3).toBeDefined();
            expect(state.nodes.n3!.position!.x).toBe(500);
        });

        it('removes a node via node-remove', () => {
            engine.applyEvent({
                t: 0,
                type: 'node-remove',
                args: { id: 'n1' },
            });
            expect(engine.getState().nodes.n1).toBeUndefined();
        });

        it('adds and removes edges', () => {
            engine.applyEvent({
                t: 0,
                type: 'edge-add',
                args: { id: 'e2', edge: { id: 'e2', source: 'n2', target: 'n1' } },
            });
            expect(engine.getState().edges.e2).toBeDefined();

            engine.applyEvent({ t: 0, type: 'edge-remove', args: { id: 'e1' } });
            expect(engine.getState().edges.e1).toBeUndefined();
        });

        it('updates the viewport via viewport-change', () => {
            engine.applyEvent({
                t: 0,
                type: 'viewport-change',
                args: { x: 50, y: 75, zoom: 1.5 },
            });
            const vp = engine.getState().viewport;
            expect(vp.x).toBe(50);
            expect(vp.y).toBe(75);
            expect(vp.zoom).toBe(1.5);
        });

        it('ignores particle events (no visual in headless)', () => {
            const before = engine.getState();
            engine.applyEvent({ t: 0, type: 'particle', args: { id: 'p1' } });
            engine.applyEvent({ t: 0, type: 'particle-along-path', args: {} });
            engine.applyEvent({ t: 0, type: 'particle-between', args: {} });
            engine.applyEvent({ t: 0, type: 'particle-burst', args: {} });
            engine.applyEvent({ t: 0, type: 'converging', args: {} });
            expect(engine.inFlightCount).toBe(0);
            expect(engine.getState()).toEqual(before);
        });

        it('ignores timeline marker events', () => {
            engine.applyEvent({ t: 0, type: 'timeline-play', args: {} });
            engine.applyEvent({ t: 0, type: 'timeline-step', args: {} });
            engine.applyEvent({ t: 0, type: 'timeline-complete', args: {} });
            expect(engine.inFlightCount).toBe(0);
        });
    });

    describe('checkpoints', () => {
        it('captureCheckpointData returns a serializable snapshot', () => {
            engine.applyEvent({
                t: 0,
                type: 'animate',
                args: {
                    handleId: 'h1',
                    targets: { nodes: { n1: { position: { x: 100, y: 0 } } } },
                    options: { duration: 1000, easing: 'linear' },
                },
            });
            engine.advance(REPLAY_DT);

            const data = engine.captureCheckpointData();
            expect(data.canvas).toBeDefined();
            expect(data.inFlight).toHaveLength(1);
            expect(data.tagRegistry).toEqual({});

            // Must be serializable to JSON without errors
            const json = JSON.stringify(data);
            expect(json.length).toBeGreaterThan(0);
        });

        it('restoreCheckpoint replaces state, time, and in-flight animations', () => {
            // Dirty the engine
            engine.applyEvent({
                t: 0,
                type: 'animate',
                args: {
                    handleId: 'hDirty',
                    targets: { nodes: { n1: { position: { x: 999, y: 999 } } } },
                    options: { duration: 100, easing: 'linear' },
                },
            });
            engine.advance(REPLAY_DT);
            engine.advance(REPLAY_DT);

            // Build a clean checkpoint manually
            const cp: Checkpoint = {
                t: 5000,
                canvas: {
                    nodes: { nX: { id: 'nX', position: { x: 42, y: 42 }, data: {} } },
                    edges: {},
                    viewport: { x: 10, y: 20, zoom: 0.5 },
                },
                inFlight: [],
                tagRegistry: {},
            };

            engine.restoreCheckpoint(cp);

            expect(engine.virtualTime).toBe(5000);
            expect(engine.inFlightCount).toBe(0);
            const state = engine.getState();
            expect(state.nodes.n1).toBeUndefined();
            expect(state.nodes.nX).toBeDefined();
            expect(state.viewport.zoom).toBe(0.5);
        });

        it('restoreCheckpoint rehydrates physics animations from integratorState', () => {
            const cp: Checkpoint = {
                t: 100,
                canvas: makeSnapshot(),
                inFlight: [
                    {
                        handleId: 'spring1',
                        type: 'spring',
                        targets: { nodes: { n1: { position: { x: 100, y: 0 } } } },
                        startTime: 0,
                        motion: { type: 'spring', stiffness: 300, damping: 30 },
                        direction: 'forward',
                        integratorState: {
                            'nodes.n1.position.x': {
                                value: 50, velocity: 10, target: 100, settled: false,
                            },
                        },
                        currentValues: { 'nodes.n1.position.x': 50 },
                    },
                ],
                tagRegistry: {},
            };

            engine.restoreCheckpoint(cp);
            expect(engine.inFlightCount).toBe(1);

            // Advance to let it settle
            let iterations = 0;
            while (engine.inFlightCount > 0 && iterations < 1000) {
                engine.advance(REPLAY_DT);
                iterations++;
            }

            expect(engine.inFlightCount).toBe(0);
            expect(engine.getState().nodes.n1!.position!.x).toBeCloseTo(100, 1);
        });

        it('round-trips physics animation through capture/restore', () => {
            engine.applyEvent({
                t: 0,
                type: 'animate',
                args: {
                    handleId: 'spring1',
                    targets: { nodes: { n1: { position: { x: 100, y: 0 } } } },
                    options: { motion: { type: 'spring', stiffness: 200, damping: 20 } },
                },
            });
            // Advance a few frames to get mid-flight state
            for (let i = 0; i < 5; i++) {
                engine.advance(REPLAY_DT);
            }

            const data = engine.captureCheckpointData();
            expect(data.inFlight).toHaveLength(1);
            expect(data.inFlight[0].integratorState).toBeDefined();
            expect(data.inFlight[0].integratorState!['nodes.n1.position.x']).toBeDefined();

            // Build a full checkpoint and restore into a fresh engine
            const cp: Checkpoint = { t: engine.virtualTime, ...data };
            const e2 = new VirtualEngine(makeSnapshot());
            e2.restoreCheckpoint(cp);

            expect(e2.virtualTime).toBe(engine.virtualTime);
            expect(e2.inFlightCount).toBe(1);
        });
    });

    describe('structural events (recorder output shape)', () => {
        it('applies node-add with nodes:[array]', () => {
            const event: RecordingEvent = {
                t: 10,
                type: 'node-add',
                args: { nodes: [{ id: 'n3', position: { x: 50, y: 50 } }] },
            };
            engine.applyEvent(event);
            expect(engine.getState().nodes.n3).toBeDefined();
            expect(engine.getState().nodes.n3!.position!.x).toBe(50);
        });

        it('applies node-add with a single node object', () => {
            const event: RecordingEvent = {
                t: 10,
                type: 'node-add',
                args: { nodes: { id: 'n4', position: { x: 9, y: 9 } } },
            };
            engine.applyEvent(event);
            expect(engine.getState().nodes.n4).toBeDefined();
        });

        it('applies node-remove with ids:[array]', () => {
            const event: RecordingEvent = {
                t: 10,
                type: 'node-remove',
                args: { ids: ['n1'] },
            };
            engine.applyEvent(event);
            expect(engine.getState().nodes.n1).toBeUndefined();
            expect(engine.getState().nodes.n2).toBeDefined();
        });

        it('applies node-remove with a single id string', () => {
            const event: RecordingEvent = {
                t: 10,
                type: 'node-remove',
                args: { ids: 'n2' },
            };
            engine.applyEvent(event);
            expect(engine.getState().nodes.n2).toBeUndefined();
        });

        it('applies edge-add with edges:[array]', () => {
            const event: RecordingEvent = {
                t: 10,
                type: 'edge-add',
                args: { edges: [{ id: 'e2', source: 'n1', target: 'n2' }] },
            };
            engine.applyEvent(event);
            expect(engine.getState().edges.e2).toBeDefined();
        });

        it('applies edge-remove with ids:[array]', () => {
            const event: RecordingEvent = {
                t: 10,
                type: 'edge-remove',
                args: { ids: ['e1'] },
            };
            engine.applyEvent(event);
            expect(engine.getState().edges.e1).toBeUndefined();
        });
    });
});
