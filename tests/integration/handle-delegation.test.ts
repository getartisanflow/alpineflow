/**
 * Delegated handle pointerdown — the regressions jsdom CANNOT catch.
 *
 * Node dragging is d3-drag, which binds `mousedown`, not `pointerdown`. Pressing
 * a handle only avoids dragging the node because the handle's pointerdown is
 * `preventDefault()`ed, which stops the browser synthesising the compatibility
 * `mousedown` from the same raw input. That synthesis only happens for TRUSTED
 * events, so it exists in Chromium and does not exist in jsdom: a unit test that
 * `dispatchEvent`s a PointerEvent can never observe this coupling.
 *
 * These tests therefore drive a REAL mouse (Playwright) and assert on node
 * position — the one signal that proves the suppression still works after the
 * per-handle listeners were replaced by one delegated listener per canvas.
 */
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { userEvent } from 'vitest/browser';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';
import structuralCss from '../../css/structural.css?raw';
import themeCss from '../../css/theme-default.css?raw';

describe('delegated handle pointerdown — real-input node-drag suppression', () => {
    // Real hit-testing needs the real cascade: without AlpineFlow's CSS the
    // handles are zero-height divs and Playwright refuses to press them.
    beforeAll(() => {
        const style = document.createElement('style');
        style.textContent = `${themeCss}\n${structuralCss}`;
        document.head.appendChild(style);
    });

    afterEach(() => unmountAll());

    async function mountTwoNodes(config: Record<string, unknown> = {}) {
        const mounted = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 100, y: 100 }, data: { label: 'A' } },
                { id: 'b', position: { x: 420, y: 100 }, data: { label: 'B' } },
            ],
            edges: [],
            ...config,
        });
        await nextFrame(2);
        return mounted;
    }

    const handleOf = (canvas: HTMLElement, nodeId: string, type: 'source' | 'target') =>
        canvas.querySelector(
            `[data-flow-node-id="${nodeId}"] [data-flow-handle-type="${type}"]`,
        ) as HTMLElement;

    it('CONTROL: dragging the node BODY still moves the node', async () => {
        const { flow, canvas } = await mountTwoNodes();
        const nodeEl = canvas.querySelector('[data-flow-node-id="a"]') as HTMLElement;
        const label = nodeEl.querySelector('span') as HTMLElement;
        const before = { ...flow.getNode('a').position };

        await userEvent.dragAndDrop(label, handleOf(canvas, 'b', 'target'));
        await nextFrame(2);

        // If this fails, the harness cannot detect a node drag at all and the two
        // assertions below would be vacuous.
        const after = flow.getNode('a').position;
        expect(after.x !== before.x || after.y !== before.y).toBe(true);
    });

    it('dragging from a SOURCE handle does not move the node', async () => {
        const { flow, canvas } = await mountTwoNodes();
        const before = { ...flow.getNode('a').position };

        await userEvent.dragAndDrop(
            handleOf(canvas, 'a', 'source'),
            handleOf(canvas, 'b', 'target'),
        );
        await nextFrame(2);

        expect(flow.getNode('a').position).toEqual(before);
    });

    it('dragging from a source handle onto a target handle still creates the edge', async () => {
        const { flow, canvas } = await mountTwoNodes();

        await userEvent.dragAndDrop(
            handleOf(canvas, 'a', 'source'),
            handleOf(canvas, 'b', 'target'),
        );
        await nextFrame(2);

        expect(flow.edges).toHaveLength(1);
        expect(flow.edges[0]).toMatchObject({ source: 'a', target: 'b' });
    });

    it('a target handle with no reconnectable edge falls through to the node drag', async () => {
        // The source/target asymmetry: the target handler only stops propagation
        // after all its guards pass, so an unconnected target pip is still a
        // legitimate place to grab the node by.
        const { flow, canvas } = await mountTwoNodes();
        const before = { ...flow.getNode('a').position };

        await userEvent.dragAndDrop(
            handleOf(canvas, 'a', 'target'),
            handleOf(canvas, 'b', 'source'),
        );
        await nextFrame(2);

        const after = flow.getNode('a').position;
        expect(after.x !== before.x || after.y !== before.y).toBe(true);
    });

    it('delegatedHandleEvents:false keeps every one of those behaviours', async () => {
        const { flow, canvas } = await mountTwoNodes({ delegatedHandleEvents: false });
        const before = { ...flow.getNode('a').position };

        await userEvent.dragAndDrop(
            handleOf(canvas, 'a', 'source'),
            handleOf(canvas, 'b', 'target'),
        );
        await nextFrame(2);

        expect(flow.getNode('a').position).toEqual(before); // node not dragged
        expect(flow.edges).toHaveLength(1); // edge still created
    });
});
