import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('C1: data-flow-node-type attribute', () => {
    afterEach(() => unmountAll());

    it('sets data-flow-node-type from node.type on mount', async () => {
        const { canvas } = await mountCanvas({
            nodes: [
                { id: 'a', type: 'page', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', type: 'field', position: { x: 100, y: 0 }, data: {} },
                { id: 'c', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
        });
        await nextFrame();

        expect(canvas.querySelector('[data-flow-node-id="a"]')?.getAttribute('data-flow-node-type')).toBe('page');
        expect(canvas.querySelector('[data-flow-node-id="b"]')?.getAttribute('data-flow-node-type')).toBe('field');
        const cType = canvas.querySelector('[data-flow-node-id="c"]')?.getAttribute('data-flow-node-type');
        expect(cType === null || cType === '').toBe(true);
    });

    it('enables CSS selector [data-flow-node-type="page"] targeting', async () => {
        const { canvas } = await mountCanvas({
            nodes: [{ id: 'a', type: 'page', position: { x: 0, y: 0 }, data: {} }],
            edges: [],
        });
        await nextFrame();

        const match = canvas.querySelector('[data-flow-node-type="page"]');
        expect(match).not.toBeNull();
        expect(match?.getAttribute('data-flow-node-id')).toBe('a');
    });
});
