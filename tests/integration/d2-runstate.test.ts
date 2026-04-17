/**
 * D2 — node.runState first-class property
 *
 * node.runState is a reserved top-level property (like node.id, node.type,
 * node.class). When set, auto-applies `.flow-node-{state}` CSS classes.
 * State transitions cleanly remove the previous class and add the new one.
 * 'pending' is the default / no-class state.
 *
 * $flow.setNodeState(ids, state) and $flow.resetStates() are the helper APIs.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('D2 — node.runState', () => {
    afterEach(() => unmountAll());

    it('applies .flow-node-running when runState is "running"', async () => {
        const { canvas } = await mountCanvas({
            nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: {}, runState: 'running' }],
            edges: [],
        });
        await nextFrame();

        const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        expect(el).not.toBeNull();
        expect(el.classList.contains('flow-node-running')).toBe(true);
    });

    it('applies the correct class for each non-pending state', async () => {
        const states = ['running', 'completed', 'failed', 'skipped'] as const;

        for (const state of states) {
            const { el, canvas } = await mountCanvas({
                nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: {}, runState: state }],
                edges: [],
            });
            await nextFrame();

            const nodeEl = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
            expect(nodeEl.classList.contains(`flow-node-${state}`), `Expected .flow-node-${state}`).toBe(true);

            // Clean up this canvas before next iteration
            const Alpine = (window as any).Alpine;
            Alpine.destroyTree(el);
            el.remove();
        }
    });

    it('removes previous state class when state changes (running → completed)', async () => {
        const { canvas, scope } = await mountCanvas({
            nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: {}, runState: 'running' }],
            edges: [],
        });
        await nextFrame();

        const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        expect(el.classList.contains('flow-node-running')).toBe(true);
        expect(el.classList.contains('flow-node-completed')).toBe(false);

        // Change the state
        const node = scope.nodes.find((n: any) => n.id === 'n1');
        node.runState = 'completed';
        await nextFrame();

        expect(el.classList.contains('flow-node-running')).toBe(false);
        expect(el.classList.contains('flow-node-completed')).toBe(true);
    });

    it('$flow.setNodeState(id, state) sets runState on a single node', async () => {
        const { canvas, flow } = await mountCanvas({
            nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: {} }],
            edges: [],
        });
        await nextFrame();

        const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        expect(el.classList.contains('flow-node-running')).toBe(false);

        flow.setNodeState('n1', 'running');
        await nextFrame();

        expect(el.classList.contains('flow-node-running')).toBe(true);
    });

    it('$flow.setNodeState([ids], state) sets runState on multiple nodes', async () => {
        const { canvas, flow } = await mountCanvas({
            nodes: [
                { id: 'n1', position: { x: 0, y: 0 }, data: {} },
                { id: 'n2', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
        });
        await nextFrame();

        flow.setNodeState(['n1', 'n2'], 'failed');
        await nextFrame();

        const el1 = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        const el2 = canvas.querySelector('[data-flow-node-id="n2"]') as HTMLElement;
        expect(el1.classList.contains('flow-node-failed')).toBe(true);
        expect(el2.classList.contains('flow-node-failed')).toBe(true);
    });

    it('$flow.resetStates() clears all runState values', async () => {
        const { canvas, flow } = await mountCanvas({
            nodes: [
                { id: 'n1', position: { x: 0, y: 0 }, data: {}, runState: 'running' },
                { id: 'n2', position: { x: 200, y: 0 }, data: {}, runState: 'completed' },
            ],
            edges: [],
        });
        await nextFrame();

        const el1 = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        const el2 = canvas.querySelector('[data-flow-node-id="n2"]') as HTMLElement;
        expect(el1.classList.contains('flow-node-running')).toBe(true);
        expect(el2.classList.contains('flow-node-completed')).toBe(true);

        flow.resetStates();
        await nextFrame();

        expect(el1.classList.contains('flow-node-running')).toBe(false);
        expect(el2.classList.contains('flow-node-completed')).toBe(false);
    });

    it('nodes without runState have no state classes', async () => {
        const { canvas } = await mountCanvas({
            nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: {} }],
            edges: [],
        });
        await nextFrame();

        const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        const stateClasses = ['flow-node-running', 'flow-node-completed', 'flow-node-failed', 'flow-node-skipped'];
        for (const cls of stateClasses) {
            expect(el.classList.contains(cls), `Should not have ${cls}`).toBe(false);
        }
    });
});
