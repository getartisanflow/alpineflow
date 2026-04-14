/**
 * Measures node position before and after calling handle.reverse()
 * mid-animation. If there's a visible jump, the delta should be > ~1px.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, wait } from './helpers/mount';

describe('reverse mid-flight — should not jump', () => {
    afterEach(() => unmountAll());

    it('position just before and just after reverse() should be within 2px', async () => {
        const { flow, canvas } = await mountCanvas({
            nodes: [{ id: 'm', position: { x: 0, y: 50 }, data: {} }],
            edges: [],
        });

        // Start a slow linear animation 0 → 400 over 3000ms.
        const handle = flow.animate(
            { nodes: { m: { position: { x: 400 } } } },
            { duration: 3000, easing: 'linear' },
        );

        // Let it run to roughly the halfway point.
        await wait(1500);

        // Sample current screen position from the DOM.
        const nodeEl = canvas.querySelector('.flow-node') as HTMLElement;
        const leftBefore = parseFloat(nodeEl.style.left);

        // Flip direction synchronously.
        handle.reverse();

        // Wait one frame, sample again.
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        const leftAfter = parseFloat(nodeEl.style.left);

        const delta = Math.abs(leftAfter - leftBefore);
        // A well-behaved reverse drifts a pixel or two per frame.
        expect(delta).toBeLessThan(3);
    });

    it('reverse at 1s — should not jump 30px (user report)', async () => {
        const { flow, canvas } = await mountCanvas({
            nodes: [{ id: 'm', position: { x: 0, y: 50 }, data: {} }],
            edges: [],
        });

        const handle = flow.animate(
            { nodes: { m: { position: { x: 400 } } } },
            { duration: 3000, easing: 'linear' },
        );
        await wait(1000);

        const nodeEl = canvas.querySelector('.flow-node') as HTMLElement;
        const leftBefore = parseFloat(nodeEl.style.left);
        handle.reverse();
        // Sample across several frames to catch any transient jump.
        const samples: number[] = [];
        for (let i = 0; i < 5; i++) {
            await new Promise((r) => requestAnimationFrame(() => r(null)));
            samples.push(parseFloat(nodeEl.style.left));
        }
        const maxDelta = Math.max(...samples.map((s) => Math.abs(s - leftBefore)));
        // Fail loudly with all samples so we see the trajectory
        expect({ leftBefore, samples, maxDelta, threshold: 10 }).toMatchObject({
            maxDelta: expect.any(Number),
            threshold: 10,
        });
        expect(maxDelta).toBeLessThan(10);
    });

    it('reverse adjusts correctly when startTime ended up negative from a prior reverse', async () => {
        // Regression: a reverse at low progress pushes startTime very negative.
        // If guard in _reverse requires startTime > 0, a SECOND reverse skips
        // the adjustment and the next tick jumps. Guard must allow any startTime.
        const { flow, canvas } = await mountCanvas({
            nodes: [{ id: 'm', position: { x: 0, y: 50 }, data: {} }],
            edges: [],
        });

        const handle = flow.animate(
            { nodes: { m: { position: { x: 400 } } } },
            { duration: 3000, easing: 'linear' },
        );

        // First reverse at low progress → startTime becomes very negative.
        await wait(300);
        handle.reverse();
        // Let it run backward for a bit.
        await wait(400);
        // Second reverse — direction back to forward. Before the fix, this
        // would skip the adjustment because startTime > 0 was false.
        const nodeEl = canvas.querySelector('.flow-node') as HTMLElement;
        const leftBefore = parseFloat(nodeEl.style.left);
        handle.reverse();
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        const leftAfter = parseFloat(nodeEl.style.left);
        const delta = Math.abs(leftAfter - leftBefore);
        expect(delta).toBeLessThan(5);
    });

    it('reverse IMMEDIATELY after start — no pre-first-tick jump', async () => {
        const { flow, canvas } = await mountCanvas({
            nodes: [{ id: 'm', position: { x: 0, y: 50 }, data: {} }],
            edges: [],
        });

        // Start and reverse within the same synchronous block — before the
        // first rAF tick has had a chance to run.
        const handle = flow.animate(
            { nodes: { m: { position: { x: 400 } } } },
            { duration: 3000, easing: 'linear' },
        );
        handle.reverse();

        // Let a few frames run and check the node doesn't jump far forward.
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        const nodeEl = canvas.querySelector('.flow-node') as HTMLElement;
        const leftAfter = parseFloat(nodeEl.style.left);

        // Reverse from start should keep the node near start, not jump to end.
        // If the pre-first-tick case has a jump-to-end bug, leftAfter would
        // be near 400 instead of near 0.
        expect({ leftAfter, shouldBeLessThan: 50 }).toMatchObject({
            leftAfter: expect.any(Number),
            shouldBeLessThan: 50,
        });
        expect(leftAfter).toBeLessThan(50);
    });
});
