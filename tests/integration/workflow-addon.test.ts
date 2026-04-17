/**
 * W6 — End-to-end integration tests for the workflow addon.
 *
 * Exercises the complete path:
 *   addon registered → canvas init calls setup → $flow.run() walks a real
 *   graph → runState classes applied on DOM elements → execution log populated.
 *
 * The workflow addon registers itself via registerAddon('workflow', ...) in the
 * global registry. Calling AlpineFlowWorkflow(Alpine) once in beforeAll is
 * sufficient — the registry is a globalThis singleton shared across all module
 * instances, so the addon is available to every mountCanvas() call in this file.
 *
 * We do NOT unregisterAddon('workflow') in afterEach because the addon was
 * registered once intentionally and remains valid for the entire suite.
 */
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';
import AlpineFlowWorkflow from '../../src/workflow/index';

describe('workflow addon — end-to-end', () => {
    beforeAll(() => {
        // AlpineFlowWorkflow only calls registerAddon('workflow', {...}) —
        // the Alpine argument is accepted but not used. Calling it here ensures
        // the workflow setup callback is in the global registry before the first
        // mountCanvas() runs.
        AlpineFlowWorkflow(undefined as any);
    });

    afterEach(() => unmountAll());

    it('$flow.run exists after addon registration', async () => {
        const { flow } = await mountCanvas({ nodes: [], edges: [] });
        await nextFrame();

        expect(typeof flow.run).toBe('function');
        expect(Array.isArray(flow.executionLog)).toBe(true);
        expect(typeof flow.resetExecutionLog).toBe('function');
    });

    it('runs a linear 3-node workflow with runState transitions', async () => {
        const { flow, canvas } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 100, y: 0 }, data: {} },
                { id: 'c', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [
                { id: 'e1', source: 'a', target: 'b' },
                { id: 'e2', source: 'b', target: 'c' },
            ],
        });
        await nextFrame();

        const handle = await flow.run('a', {});
        await handle.finished;
        // Wait for Alpine's reactive effects to flush the DOM class bindings
        await nextFrame(3);

        // All nodes should be completed
        for (const id of ['a', 'b', 'c']) {
            expect(flow.nodes.find((n: any) => n.id === id)!.runState).toBe('completed');
        }

        // DOM should have the completed class applied reactively
        const cEl = canvas.querySelector('[data-flow-node-id="c"]') as HTMLElement;
        expect(cEl.classList.contains('flow-node-completed')).toBe(true);
    });

    it('evaluates a flow-condition node and picks the correct branch', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'trigger', position: { x: 0, y: 0 }, data: {} },
                {
                    id: 'cond',
                    type: 'flow-condition',
                    position: { x: 100, y: 0 },
                    data: { condition: { field: 'plan', op: 'equals', value: 'annual' } },
                },
                { id: 'annual', position: { x: 200, y: 0 }, data: {} },
                { id: 'monthly', position: { x: 200, y: 100 }, data: {} },
            ],
            edges: [
                { id: 'e1', source: 'trigger', target: 'cond' },
                { id: 'e2', source: 'cond', target: 'annual', sourceHandle: 'true' },
                { id: 'e3', source: 'cond', target: 'monthly', sourceHandle: 'false' },
            ],
        });
        await nextFrame();

        const handle = await flow.run('trigger', {}, { payload: { plan: 'annual' } });
        await handle.finished;

        expect(flow.nodes.find((n: any) => n.id === 'annual')!.runState).toBe('completed');
        // The 'monthly' branch was not taken — its runState remains unset
        expect(flow.nodes.find((n: any) => n.id === 'monthly')!.runState).toBeUndefined();
    });

    it('fires sendParticle on traversed edges when particleOnEdges is true', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [
                { id: 'e1', source: 'a', target: 'b' },
            ],
        });
        await nextFrame();

        // Install spy before calling run so the internal canvas.sendParticle
        // reference is captured after our replacement.
        const spy = vi.fn();
        const origSendParticle = flow.sendParticle;
        flow.sendParticle = (...args: any[]) => {
            spy(...args);
            return origSendParticle?.apply(flow, args);
        };

        const handle = await flow.run('a', {}, { particleOnEdges: true });
        await handle.finished;

        expect(spy).toHaveBeenCalledWith('e1', expect.any(Object));
    });

    it('pauses and resumes via the run handle', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 100, y: 0 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'a', target: 'b' }],
        });
        await nextFrame();

        // onExit fires after node 'a' completes — we pause there so 'b' never runs
        let handle: any;
        handle = await flow.run('a', {
            onExit: (node: any) => {
                if (node.id === 'a') { handle.pause(); }
            },
        });

        // Give execution time to reach and act on the pause
        await new Promise<void>(r => setTimeout(r, 50));
        expect(handle.isPaused).toBe(true);
        expect(flow.nodes.find((n: any) => n.id === 'b')!.runState).toBeUndefined();

        handle.resume();
        await handle.finished;

        expect(flow.nodes.find((n: any) => n.id === 'b')!.runState).toBe('completed');
    });

    it('stops execution via the run handle', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 100, y: 0 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'a', target: 'b' }],
        });
        await nextFrame();

        let handle: any;
        handle = await flow.run('a', {
            onExit: (node: any) => {
                if (node.id === 'a') { handle.stop(); }
            },
        });
        await handle.finished;

        // Execution stopped after 'a' — 'b' was never entered
        expect(flow.nodes.find((n: any) => n.id === 'b')!.runState).toBeUndefined();
    });

    it('marks node failed and calls onError when handler throws', async () => {
        const onError = vi.fn();
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 100, y: 0 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'a', target: 'b' }],
        });
        await nextFrame();

        const handle = await flow.run('a', {
            onEnter: async (node: any) => {
                if (node.id === 'b') { throw new Error('boom'); }
            },
            onError,
        });

        // finished rejects because the error was re-thrown
        try { await handle.finished; } catch {}

        expect(flow.nodes.find((n: any) => n.id === 'b')!.runState).toBe('failed');
        expect(onError).toHaveBeenCalledOnce();
    });

    it('execution log contains all events in order', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 100, y: 0 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'a', target: 'b' }],
        });
        await nextFrame();

        flow.resetExecutionLog();
        const handle = await flow.run('a', {});
        await handle.finished;

        const types = flow.executionLog.map((e: any) => e.type);
        expect(types[0]).toBe('run:started');
        expect(types).toContain('node:enter');
        expect(types).toContain('node:exit');
        expect(types).toContain('edge:taken');
        expect(types[types.length - 1]).toBe('run:complete');
    });
});
