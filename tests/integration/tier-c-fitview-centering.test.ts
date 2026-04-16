import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('C3: fitView vertical centering', () => {
    afterEach(() => unmountAll());

    it('centers vertically when nodes have varying heights', async () => {
        const { flow, canvas } = await mountCanvas({
            nodes: [
                { id: 'short', position: { x: 0, y: 0 }, data: {}, dimensions: { width: 100, height: 40 }, fixedDimensions: true },
                { id: 'tall', position: { x: 200, y: 0 }, data: {}, dimensions: { width: 100, height: 200 }, fixedDimensions: true },
            ],
            edges: [],
            fitViewOnInit: true,
        });
        await nextFrame();
        await nextFrame();
        await nextFrame();

        // Content bounding box: x [0, 300], y [0, 200]
        // Container should center this.
        const viewport = canvas.querySelector('[x-flow-viewport]') as HTMLElement;
        const containerRect = canvas.getBoundingClientRect();
        const containerMidY = containerRect.height / 2;

        const match = viewport.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+)\)/);
        if (!match) {
            // If transform doesn't match, report what we have and skip
            expect(match).not.toBeNull();
            return;
        }
        const ty = parseFloat(match[2]);
        const scale = parseFloat(match[3]);

        // Content midY in screen space = ty + (contentMidY * scale)
        const contentMidY = 100; // (0 + 200) / 2
        const screenMidY = ty + contentMidY * scale;

        // Should be within 15px of the container's midpoint
        expect(Math.abs(screenMidY - containerMidY)).toBeLessThan(15);
    });
});
