import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('Tier B — .flow-node-dragging class', () => {
    afterEach(() => unmountAll());

    it('applies .flow-node-dragging during drag and removes it after', async () => {
        const { canvas, flow } = await mountCanvas({
            nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: {}, dimensions: { width: 100, height: 50 } }],
            edges: [],
        });
        await nextFrame();

        const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        const rect = el.getBoundingClientRect();

        // Track when the class is added/removed
        const classes: Array<{ action: string; className: string }> = [];
        const originalAdd = el.classList.add;
        const originalRemove = el.classList.remove;

        el.classList.add = function(...classNames: any[]) {
            for (const cls of classNames) {
                classes.push({ action: 'add', className: cls });
            }
            return originalAdd.apply(this, classNames);
        };

        el.classList.remove = function(...classNames: any[]) {
            for (const cls of classNames) {
                classes.push({ action: 'remove', className: cls });
            }
            return originalRemove.apply(this, classNames);
        };

        // Simulate mousedown on the node to start drag
        // Use coordinates within the element bounds
        const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: rect.left + 10,
            clientY: rect.top + 10,
            button: 0,
        });

        el.dispatchEvent(mousedownEvent);
        await nextFrame();

        // Simulate a small mouse move to trigger actual drag
        const mousemoveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: rect.left + 50,
            clientY: rect.top + 50,
            buttons: 1, // Left button is held
        });

        document.dispatchEvent(mousemoveEvent);
        await nextFrame();

        // Check if .flow-node-dragging was added
        const addedDuringDrag = classes.some(
            (c) => c.action === 'add' && c.className === 'flow-node-dragging',
        );
        expect(addedDuringDrag).toBe(true);

        // Simulate mouse up to end drag
        const mouseupEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: rect.left + 50,
            clientY: rect.top + 50,
        });

        document.dispatchEvent(mouseupEvent);
        await nextFrame();

        // Check if .flow-node-dragging was removed
        const removedAfterDrag = classes.some(
            (c) => c.action === 'remove' && c.className === 'flow-node-dragging',
        );
        expect(removedAfterDrag).toBe(true);

        // Verify final state: class should not be present
        expect(el.classList.contains('flow-node-dragging')).toBe(false);
    });
});
