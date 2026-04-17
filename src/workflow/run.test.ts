import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRunExecutor } from './run';

function mockCanvas(nodes: any[], edges: any[]) {
    const nodeMap = new Map(nodes.map(n => [n.id, { ...n }]));
    return {
        getNode: (id: string) => nodeMap.get(id),
        getOutgoers: (id: string) => {
            return edges
                .filter(e => e.source === id)
                .map(e => nodeMap.get(e.target))
                .filter(Boolean);
        },
        getConnectedEdges: (id: string) => edges.filter(e => e.source === id || e.target === id),
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
});
