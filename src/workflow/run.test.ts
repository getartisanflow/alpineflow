import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRunExecutor } from './run';

function mockCanvas(nodes: any[], edges: any[]) {
    const nodeMap = new Map(nodes.map(n => [n.id, { ...n }]));
    // Use mutable edge objects so edge-state mutations are observable in tests
    const mutableEdges = edges.map(e => ({ ...e }));
    const edgeMap = new Map(mutableEdges.map(e => [e.id, e]));
    return {
        getNode: (id: string) => nodeMap.get(id),
        getEdge: (id: string) => edgeMap.get(id),
        getOutgoers: (id: string) => {
            return mutableEdges
                .filter(e => e.source === id)
                .map(e => nodeMap.get(e.target))
                .filter(Boolean);
        },
        getConnectedEdges: (id: string) => mutableEdges.filter(e => e.source === id || e.target === id),
        edges: mutableEdges,
        setNodeState: vi.fn(),
        toggleInteractive: vi.fn(),
        sendParticle: vi.fn(),
        executionLog: [] as any[],
    };
}

describe('workflow run helper', () => {
    it('walks a linear 3-node graph and sets runState on each', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }, { id: 'c', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }, { id: 'e2', source: 'b', target: 'c' }],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {});
        await handle.finished;

        // Each node: running then completed = 6 calls
        expect(canvas.setNodeState).toHaveBeenCalledTimes(6);
        expect(canvas.setNodeState).toHaveBeenCalledWith('a', 'running');
        expect(canvas.setNodeState).toHaveBeenCalledWith('a', 'completed');
        expect(canvas.setNodeState).toHaveBeenCalledWith('b', 'running');
        expect(canvas.setNodeState).toHaveBeenCalledWith('b', 'completed');
        expect(canvas.setNodeState).toHaveBeenCalledWith('c', 'running');
        expect(canvas.setNodeState).toHaveBeenCalledWith('c', 'completed');
    });

    it('calls onEnter and onExit in correct order', async () => {
        const order: string[] = [];
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {
            onEnter: async (node) => { order.push(`enter:${node.id}`); },
            onExit: async (node) => { order.push(`exit:${node.id}`); },
        });
        await handle.finished;

        expect(order).toEqual(['enter:a', 'exit:a', 'enter:b', 'exit:b']);
    });

    it('merges onEnter return into payload AND nodeResults (Option C)', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const run = createRunExecutor(canvas);
        let capturedContext: any;
        const handle = await run('a', {
            onEnter: async (node, ctx) => {
                if (node.id === 'a') { return { plan: 'annual' }; }
                capturedContext = { ...ctx, payload: { ...ctx.payload }, nodeResults: { ...ctx.nodeResults } };
            },
        });
        await handle.finished;

        // b's onEnter should have seen plan in payload
        expect(capturedContext.payload.plan).toBe('annual');
        // nodeResults stores per-node outputs
        expect(capturedContext.nodeResults['a']).toEqual({ plan: 'annual' });
    });

    it('marks node failed and calls onError when onEnter throws', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const onError = vi.fn();
        const run = createRunExecutor(canvas);
        const handle = await run('a', {
            onEnter: async () => { throw new Error('boom'); },
            onError,
        });

        await expect(handle.finished).rejects.toThrow('boom');
        expect(canvas.setNodeState).toHaveBeenCalledWith('a', 'failed');
        expect(onError).toHaveBeenCalledOnce();
        expect(onError.mock.calls[0][0].message).toBe('boom');
    });

    it('calls onComplete when graph walk finishes', async () => {
        const canvas = mockCanvas([{ id: 'a', data: {} }], []);
        const onComplete = vi.fn();
        const run = createRunExecutor(canvas);
        const handle = await run('a', { onComplete });
        await handle.finished;

        expect(onComplete).toHaveBeenCalledOnce();
        expect(onComplete.mock.calls[0][0].payload).toBeDefined();
    });

    it('stops at leaf nodes (no outgoing edges)', async () => {
        const canvas = mockCanvas([{ id: 'a', data: {} }], []);
        const run = createRunExecutor(canvas);
        const handle = await run('a', {});
        const ctx = await handle.finished;

        expect(canvas.setNodeState).toHaveBeenCalledTimes(2); // running + completed for 'a' only
        expect(ctx.currentNodeId).toBeNull();
    });

    it('pause() blocks traversal, resume() continues', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {
            onExit: async (node) => {
                if (node.id === 'a') { handle.pause(); }
            },
        });

        // After a's onExit, pause was called. Give event loop a tick.
        await new Promise(r => setTimeout(r, 10));
        // b should not have started yet
        expect(canvas.setNodeState).not.toHaveBeenCalledWith('b', 'running');

        handle.resume();
        await handle.finished;
        expect(canvas.setNodeState).toHaveBeenCalledWith('b', 'completed');
    });

    it('stop() halts traversal and does not call onComplete', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const onComplete = vi.fn();
        const run = createRunExecutor(canvas);
        const handle = await run('a', {
            onExit: async (node) => {
                if (node.id === 'a') { handle.stop(); }
            },
            onComplete,
        });
        await handle.finished;

        expect(canvas.setNodeState).not.toHaveBeenCalledWith('b', 'running');
        expect(onComplete).not.toHaveBeenCalled();
    });

    it('evaluates flow-condition node and picks the correct branch', async () => {
        const canvas = mockCanvas(
            [
                { id: 'trigger', data: {} },
                { id: 'condition', type: 'flow-condition', data: { condition: { field: 'plan', op: 'equals', value: 'annual' } } },
                { id: 'annual', data: {} },
                { id: 'monthly', data: {} },
            ],
            [
                { id: 'e1', source: 'trigger', target: 'condition' },
                { id: 'e2', source: 'condition', target: 'annual', sourceHandle: 'true' },
                { id: 'e3', source: 'condition', target: 'monthly', sourceHandle: 'false' },
            ],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('trigger', {}, { payload: { plan: 'annual' } });
        await handle.finished;

        // Should visit: trigger → condition → annual (not monthly)
        expect(canvas.setNodeState).toHaveBeenCalledWith('annual', 'completed');
        expect(canvas.setNodeState).not.toHaveBeenCalledWith('monthly', 'running');
    });

    it('uses custom pickBranch handler when provided', async () => {
        const canvas = mockCanvas(
            [
                { id: 'a', data: {} },
                { id: 'b', data: {} },
                { id: 'c', data: {} },
            ],
            [
                { id: 'e1', source: 'a', target: 'b' },
                { id: 'e2', source: 'a', target: 'c' },
            ],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {
            pickBranch: async (_node, edges) => edges[1].id, // pick the second edge (→ c)
        });
        await handle.finished;

        expect(canvas.setNodeState).toHaveBeenCalledWith('c', 'completed');
        expect(canvas.setNodeState).not.toHaveBeenCalledWith('b', 'running');
    });

    it('uses node.data.evaluate function for complex conditions', async () => {
        const canvas = mockCanvas(
            [
                { id: 'cond', type: 'flow-condition', data: { evaluate: (payload: any) => payload.amount > 1000 } },
                { id: 'high', data: {} },
                { id: 'low', data: {} },
            ],
            [
                { id: 'e1', source: 'cond', target: 'high', sourceHandle: 'true' },
                { id: 'e2', source: 'cond', target: 'low', sourceHandle: 'false' },
            ],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('cond', {}, { payload: { amount: 5000 } });
        await handle.finished;

        expect(canvas.setNodeState).toHaveBeenCalledWith('high', 'completed');
        expect(canvas.setNodeState).not.toHaveBeenCalledWith('low', 'running');
    });

    it('marks incoming edges as entering then completed during traversal', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {});
        await handle.finished;

        const e1 = canvas.edges.find((e: any) => e.id === 'e1');
        expect(e1.class).toContain('flow-edge-completed');
        expect(e1.class).not.toContain('flow-edge-entering');
    });

    it('marks taken/untaken edges on condition branch', async () => {
        const canvas = mockCanvas(
            [
                { id: 'cond', type: 'flow-condition', data: { condition: { field: 'x', op: 'equals', value: 1 } } },
                { id: 'yes', data: {} },
                { id: 'no', data: {} },
            ],
            [
                { id: 'e-yes', source: 'cond', target: 'yes', sourceHandle: 'true' },
                { id: 'e-no', source: 'cond', target: 'no', sourceHandle: 'false' },
            ],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('cond', {}, { payload: { x: 1 }, muteUntakenBranches: true });
        await handle.finished;

        const eYes = canvas.edges.find((e: any) => e.id === 'e-yes');
        const eNo = canvas.edges.find((e: any) => e.id === 'e-no');
        expect(eYes.class).toContain('flow-edge-taken');
        expect(eNo.class).toContain('flow-edge-untaken');
    });

    it('fires particles on traversed edges when particleOnEdges is true', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {}, { particleOnEdges: true });
        await handle.finished;

        expect(canvas.sendParticle).toHaveBeenCalledWith('e1', expect.any(Object));
    });

    it('handles flow-wait nodes by sleeping without calling handlers', async () => {
        const enterSpy = vi.fn();
        const canvas = mockCanvas(
            [
                { id: 'a', data: {} },
                { id: 'wait', type: 'flow-wait', data: { durationMs: 10 } },
                { id: 'b', data: {} },
            ],
            [
                { id: 'e1', source: 'a', target: 'wait' },
                { id: 'e2', source: 'wait', target: 'b' },
            ],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', { onEnter: enterSpy });
        await handle.finished;

        // onEnter should be called for a and b, but NOT for the wait node
        const enterNodeIds = enterSpy.mock.calls.map((c: any) => c[0].id);
        expect(enterNodeIds).toContain('a');
        expect(enterNodeIds).toContain('b');
        expect(enterNodeIds).not.toContain('wait');

        // Wait node should still get running → completed
        expect(canvas.setNodeState).toHaveBeenCalledWith('wait', 'running');
        expect(canvas.setNodeState).toHaveBeenCalledWith('wait', 'completed');
    });

    it('populates executionLog with events during run', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {});
        await handle.finished;

        const log = canvas.executionLog;
        const types = log.map((e: any) => e.type);
        expect(types[0]).toBe('run:started');
        expect(types).toContain('node:enter');
        expect(types).toContain('node:exit');
        expect(types).toContain('edge:taken');
        expect(types[types.length - 1]).toBe('run:complete');
    });

    it('node:exit entries include runtimeMs', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }],
            [],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {}, { defaultDurationMs: 10 });
        await handle.finished;

        const exitEntry = canvas.executionLog.find((e: any) => e.type === 'node:exit');
        expect(exitEntry).toBeDefined();
        expect(exitEntry.runtimeMs).toBeGreaterThanOrEqual(10);
    });

    it('logs run:error on handler failure', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }],
            [],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {
            onEnter: async () => { throw new Error('boom'); },
            onError: () => {},
        });
        try { await handle.finished; } catch {}

        const errorEntry = canvas.executionLog.find((e: any) => e.type === 'run:error');
        expect(errorEntry).toBeDefined();
        expect(errorEntry.payload.error).toBe('boom');
    });

    it('respects logLimit with FIFO eviction', async () => {
        // Create a long chain that would exceed a tiny limit
        const nodes = Array.from({ length: 20 }, (_, i) => ({ id: `n${i}`, data: {} }));
        const edges = Array.from({ length: 19 }, (_, i) => ({ id: `e${i}`, source: `n${i}`, target: `n${i + 1}` }));
        const canvas = mockCanvas(nodes, edges);
        const run = createRunExecutor(canvas);
        const handle = await run('n0', {}, { logLimit: 10 });
        await handle.finished;

        expect(canvas.executionLog.length).toBeLessThanOrEqual(10);
        // The last entry should be run:complete (most recent)
        expect(canvas.executionLog[canvas.executionLog.length - 1].type).toBe('run:complete');
    });

    it('logs run:stopped when stop() is called', async () => {
        const canvas = mockCanvas(
            [{ id: 'a', data: {} }, { id: 'b', data: {} }],
            [{ id: 'e1', source: 'a', target: 'b' }],
        );
        const run = createRunExecutor(canvas);
        const handle = await run('a', {
            onExit: (node) => { if (node.id === 'a') { handle.stop(); } },
        });
        await handle.finished;

        const stoppedEntry = canvas.executionLog.find((e: any) => e.type === 'run:stopped');
        expect(stoppedEntry).toBeDefined();
    });
});
