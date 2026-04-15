/**
 * Tier B6: edge.class forwards to label element.
 *
 * When an edge has `class: 'foo'`, the class is applied to both the SVG `<g>`
 * and the edge label `<div>` so label styling can track edge state (running,
 * error, disabled, etc.) without parallel class management.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('Tier B6 — edge.class forwards to label', () => {
    afterEach(() => unmountAll());

    it('forwards edge.class to the label element in addition to the SVG group', async () => {
        const { canvas } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'a', target: 'b', label: 'Hello', class: 'my-edge' }],
        });
        await nextFrame();

        // Assert the SVG group has the class
        const g = canvas.querySelector('[data-flow-edge-id="e1"]') as SVGGElement | null;
        expect(g).not.toBeNull();
        expect(g!.classList.contains('my-edge')).toBe(true);

        // Assert the label has it too — selector: [data-flow-edge-id="e1"].flow-edge-label
        const labelEl = canvas.querySelector('[data-flow-edge-id="e1"].flow-edge-label') as HTMLElement | null;
        expect(labelEl).not.toBeNull();
        expect(labelEl!.classList.contains('my-edge')).toBe(true);
    });

    it('applies custom class to start and end labels as well', async () => {
        const { canvas } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [{
                id: 'e2',
                source: 'a',
                target: 'b',
                labelStart: 'Start',
                labelEnd: 'End',
                class: 'edge-custom',
            }],
        });
        await nextFrame();

        // Check start label
        const labelStartEl = canvas.querySelector('[data-flow-edge-id="e2"].flow-edge-label-start') as HTMLElement | null;
        expect(labelStartEl).not.toBeNull();
        expect(labelStartEl!.classList.contains('edge-custom')).toBe(true);

        // Check end label
        const labelEndEl = canvas.querySelector('[data-flow-edge-id="e2"].flow-edge-label-end') as HTMLElement | null;
        expect(labelEndEl).not.toBeNull();
        expect(labelEndEl!.classList.contains('edge-custom')).toBe(true);
    });

    it('preserves existing label classes alongside custom class', async () => {
        const { canvas } = await mountCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [{ id: 'e3', source: 'a', target: 'b', label: 'Test', class: 'state-running' }],
        });
        await nextFrame();

        const labelEl = canvas.querySelector('[data-flow-edge-id="e3"].flow-edge-label') as HTMLElement | null;
        expect(labelEl).not.toBeNull();
        // Label should have both the base class 'flow-edge-label' and the custom class
        expect(labelEl!.classList.contains('flow-edge-label')).toBe(true);
        expect(labelEl!.classList.contains('state-running')).toBe(true);
    });
});
