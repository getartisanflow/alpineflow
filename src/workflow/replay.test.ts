import { describe, it, expect, vi } from 'vitest';
import { createReplayExecutor } from './replay';

function mockCanvas() {
    return {
        setNodeState: vi.fn(),
        resetStates: vi.fn(),
        edges: [
            { id: 'e1', source: 'a', target: 'b', class: undefined },
        ],
        getEdge: vi.fn((id: string) => ({ id, class: undefined })),
    };
}

describe('replay', () => {
    it('replays node state transitions from a log', async () => {
        const canvas = mockCanvas();
        const replay = createReplayExecutor(canvas);
        const now = Date.now();
        const handle = await replay([
            { t: now, type: 'run:started' },
            { t: now + 10, type: 'node:enter', nodeId: 'a' },
            { t: now + 100, type: 'node:exit', nodeId: 'a' },
            { t: now + 110, type: 'node:enter', nodeId: 'b' },
            { t: now + 200, type: 'node:exit', nodeId: 'b' },
            { t: now + 210, type: 'run:complete' },
        ], { speed: 100 }); // 100x speed for fast test

        await handle.finished;

        expect(canvas.setNodeState).toHaveBeenCalledWith('a', 'running');
        expect(canvas.setNodeState).toHaveBeenCalledWith('a', 'completed');
        expect(canvas.setNodeState).toHaveBeenCalledWith('b', 'running');
        expect(canvas.setNodeState).toHaveBeenCalledWith('b', 'completed');
    });

    it('stop() halts replay', async () => {
        const canvas = mockCanvas();
        const replay = createReplayExecutor(canvas);
        const now = Date.now();
        const handle = await replay([
            { t: now, type: 'node:enter', nodeId: 'a' },
            { t: now + 1000, type: 'node:exit', nodeId: 'a' },
            { t: now + 1010, type: 'node:enter', nodeId: 'b' },
            { t: now + 2000, type: 'node:exit', nodeId: 'b' },
        ], { speed: 1 });

        handle.stop();
        await handle.finished;

        expect(canvas.setNodeState).toHaveBeenCalledWith('a', 'running');
        // b should not have been reached
        expect(canvas.setNodeState).not.toHaveBeenCalledWith('b', 'running');
    });

    it('replays failed state', async () => {
        const canvas = mockCanvas();
        const replay = createReplayExecutor(canvas);
        const now = Date.now();
        const handle = await replay([
            { t: now, type: 'node:enter', nodeId: 'a' },
            { t: now + 10, type: 'run:error', nodeId: 'a', payload: { error: 'boom' } },
        ], { speed: 100 });

        await handle.finished;

        expect(canvas.setNodeState).toHaveBeenCalledWith('a', 'running');
        expect(canvas.setNodeState).toHaveBeenCalledWith('a', 'failed');
    });

    it('mirrors _branchTaken on flow-condition source nodes during replay', async () => {
        const condNode = { id: 'cond', type: 'flow-condition', data: {} as any };
        const canvas = {
            setNodeState: vi.fn(),
            resetStates: vi.fn(),
            nodes: [condNode, { id: 'yes', data: {} }],
            edges: [
                { id: 'e-yes', source: 'cond', target: 'yes', sourceHandle: 'true', class: undefined },
            ],
            getEdge: vi.fn((id: string) => ({ id })),
        };
        const replay = createReplayExecutor(canvas);
        const now = Date.now();
        const handle = await replay([
            { t: now, type: 'run:started' },
            { t: now + 10, type: 'node:enter', nodeId: 'cond' },
            { t: now + 20, type: 'node:exit', nodeId: 'cond', runtimeMs: 10 },
            { t: now + 25, type: 'edge:taken', edgeId: 'e-yes' },
            { t: now + 30, type: 'node:enter', nodeId: 'yes' },
            { t: now + 40, type: 'run:complete' },
        ], { speed: 1000 });

        await handle.finished;
        expect(condNode.data._branchTaken).toBe('true');
    });

    it('does not set _branchTaken when edge.source is not a flow-condition', async () => {
        const aNode = { id: 'a', data: {} as any };
        const canvas = {
            setNodeState: vi.fn(),
            resetStates: vi.fn(),
            nodes: [aNode, { id: 'b', data: {} }],
            edges: [
                { id: 'e', source: 'a', target: 'b', sourceHandle: 'out', class: undefined },
            ],
            getEdge: vi.fn((id: string) => ({ id })),
        };
        const replay = createReplayExecutor(canvas);
        const now = Date.now();
        const handle = await replay([
            { t: now, type: 'run:started' },
            { t: now + 10, type: 'edge:taken', edgeId: 'e' },
            { t: now + 20, type: 'run:complete' },
        ], { speed: 1000 });

        await handle.finished;
        expect(aNode.data._branchTaken).toBeUndefined();
    });
});
