import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Recorder, type RecorderCanvas } from './recorder';

function makeMockCanvas(overrides: Partial<RecorderCanvas> = {}): RecorderCanvas {
    return {
        nodes: [
            { id: 'n1', position: { x: 0, y: 0 }, data: {} },
            { id: 'n2', position: { x: 100, y: 100 }, data: {} },
        ],
        edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
        viewport: { x: 0, y: 0, zoom: 1 },
        animate: vi.fn(),
        update: vi.fn(),
        sendParticle: vi.fn(),
        sendParticleAlongPath: vi.fn(),
        sendParticleBetween: vi.fn(),
        sendParticleBurst: vi.fn(),
        sendConverging: vi.fn(),
        addNodes: vi.fn(),
        removeNodes: vi.fn(),
        addEdges: vi.fn(),
        removeEdges: vi.fn(),
        ...overrides,
    };
}

describe('Recorder', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('captures animate events with virtual timestamps', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);

        const recording = await recorder.record(() => {
            canvas.animate!({ nodes: { a: { position: { x: 100 } } } }, { duration: 500 });
        });

        expect(recording.events).toHaveLength(1);
        expect(recording.events[0].type).toBe('animate');
        expect(recording.events[0].t).toBeGreaterThanOrEqual(0);
        expect(recording.events[0].args.targets).toEqual({ nodes: { a: { position: { x: 100 } } } });
        expect(recording.events[0].args.options).toEqual({ duration: 500 });
    });

    it('delegates to the original method after recording the call', async () => {
        const canvas = makeMockCanvas();
        const animateSpy = canvas.animate as ReturnType<typeof vi.fn>;
        const recorder = new Recorder(canvas);

        await recorder.record(() => {
            canvas.animate!({ foo: 'bar' }, { duration: 100 });
        });

        expect(animateSpy).toHaveBeenCalledTimes(1);
        expect(animateSpy).toHaveBeenCalledWith({ foo: 'bar' }, { duration: 100 });
    });

    it('captures initialState at entry', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);

        const recording = await recorder.record(() => {
            // Mutate nodes during recording — initialState should be the pre-state
            canvas.nodes.push({ id: 'n3', position: { x: 999, y: 999 }, data: {} });
        });

        expect(recording.initialState.nodes.n1).toBeDefined();
        expect(recording.initialState.nodes.n2).toBeDefined();
        expect(recording.initialState.nodes.n3).toBeUndefined();
        expect(recording.initialState.edges.e1).toBeDefined();
        expect(recording.initialState.viewport).toEqual({ x: 0, y: 0, zoom: 1 });
    });

    it('strips function args with warning', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);

        const recording = await recorder.record(() => {
            canvas.animate!({ nodes: {} }, { duration: 100, onComplete: () => { /* noop */ } });
        });

        expect(warnSpy).toHaveBeenCalled();
        const evt = recording.events[0];
        expect(evt.args.options.duration).toBe(100);
        expect('onComplete' in evt.args.options).toBe(false);
    });

    it('strips nested functions inside args', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);

        const recording = await recorder.record(() => {
            canvas.animate!(
                { nodes: {} },
                { nested: { callback: () => { /* noop */ }, value: 42 } },
            );
        });

        const nested = recording.events[0].args.options.nested;
        expect(nested.value).toBe(42);
        expect('callback' in nested).toBe(false);
    });

    it('captures checkpoints periodically', async () => {
        vi.useFakeTimers();
        try {
            const canvas = makeMockCanvas();
            const recorder = new Recorder(canvas, { checkpointInterval: 100 });

            const promise = recorder.record(async () => {
                // Advance time past multiple checkpoint intervals
                await vi.advanceTimersByTimeAsync(350);
            });

            const recording = await promise;

            // Expect at least a few interval checkpoints + the final one
            expect(recording.checkpoints.length).toBeGreaterThanOrEqual(3);
        } finally {
            vi.useRealTimers();
        }
    });

    it('always captures a final checkpoint on completion', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas, { checkpointInterval: 999_999 });

        const recording = await recorder.record(() => {});

        expect(recording.checkpoints.length).toBe(1);
        expect(recording.checkpoints[0].canvas.nodes.n1).toBeDefined();
    });

    it('restores original methods after recording', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);
        const originalAnimate = canvas.animate;
        const originalUpdate = canvas.update;

        await recorder.record(() => {
            expect(canvas.animate).not.toBe(originalAnimate);
            expect(canvas.update).not.toBe(originalUpdate);
        });

        expect(canvas.animate).toBe(originalAnimate);
        expect(canvas.update).toBe(originalUpdate);
    });

    it('restores methods even if fn throws', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);
        const originalAnimate = canvas.animate;

        await expect(
            recorder.record(() => {
                throw new Error('boom');
            }),
        ).rejects.toThrow('boom');

        expect(canvas.animate).toBe(originalAnimate);
    });

    it('restores methods even if an async fn rejects', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);
        const originalAnimate = canvas.animate;

        await expect(
            recorder.record(async () => {
                throw new Error('async boom');
            }),
        ).rejects.toThrow('async boom');

        expect(canvas.animate).toBe(originalAnimate);
    });

    it('records duration correctly', async () => {
        vi.useFakeTimers();
        try {
            const canvas = makeMockCanvas();
            const recorder = new Recorder(canvas);

            const promise = recorder.record(async () => {
                await vi.advanceTimersByTimeAsync(250);
            });

            const recording = await promise;
            expect(recording.duration).toBeGreaterThanOrEqual(240);
        } finally {
            vi.useRealTimers();
        }
    });

    it('metadata is attached to the recording', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);

        const recording = await recorder.record(() => {}, { title: 'demo', version: 2 });

        expect(recording.metadata).toEqual({ title: 'demo', version: 2 });
    });

    it('throws when maxDuration exceeded', async () => {
        vi.useFakeTimers();
        try {
            const canvas = makeMockCanvas();
            const recorder = new Recorder(canvas, { maxDuration: 100 });

            const promise = recorder.record(async () => {
                await vi.advanceTimersByTimeAsync(500);
            });

            await expect(promise).rejects.toThrow(/maxDuration/);
        } finally {
            vi.useRealTimers();
        }
    });

    it('captures all hooked method types', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);

        const recording = await recorder.record(() => {
            canvas.animate!({ nodes: {} });
            canvas.update!({ nodes: {} });
            canvas.sendParticle!('e1');
            canvas.sendParticleAlongPath!('M0 0 L100 100');
            canvas.sendParticleBetween!('n1', 'n2');
            canvas.sendParticleBurst!('e1', { count: 5 });
            canvas.sendConverging!(['n1', 'n2'], { target: 'n3' });
            canvas.addNodes!([{ id: 'n3' }]);
            canvas.removeNodes!('n3');
            canvas.addEdges!([{ id: 'e2', source: 'n1', target: 'n2' }]);
            canvas.removeEdges!('e2');
        });

        const types = recording.events.map((e) => e.type);
        expect(types).toEqual([
            'animate',
            'update',
            'particle',
            'particle-along-path',
            'particle-between',
            'particle-burst',
            'converging',
            'node-add',
            'node-remove',
            'edge-add',
            'edge-remove',
        ]);
    });

    it('skips hooks for methods the canvas does not implement', async () => {
        // Canvas missing sendConverging and particle methods entirely
        const canvas: RecorderCanvas = {
            nodes: [],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 },
            animate: vi.fn(),
        };
        const recorder = new Recorder(canvas);

        const recording = await recorder.record(() => {
            canvas.animate!({ nodes: {} });
        });

        expect(recording.events).toHaveLength(1);
        expect((canvas as any).sendParticle).toBeUndefined();
    });

    it('timestamps are monotonic non-decreasing', async () => {
        const canvas = makeMockCanvas();
        const recorder = new Recorder(canvas);

        const recording = await recorder.record(() => {
            canvas.animate!({ nodes: {} });
            canvas.animate!({ nodes: {} });
            canvas.animate!({ nodes: {} });
        });

        for (let i = 1; i < recording.events.length; i++) {
            expect(recording.events[i].t).toBeGreaterThanOrEqual(recording.events[i - 1].t);
        }
    });
});
