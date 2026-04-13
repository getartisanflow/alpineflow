/**
 * Smoke tests — prove the browser-mode integration pipeline works end-to-end.
 *
 * These are the handful of tests that validate the test infrastructure
 * itself, plus regression-pin one bug from each class that slipped past
 * the unit suite. If these pass, the pipeline is alive and ready for the
 * full per-tier integration tests to be filled in.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('flowCanvas integration — smoke', () => {
    afterEach(() => unmountAll());

    it('mounts via Alpine and exposes $flow magic in scope', async () => {
        const { flow } = await mountCanvas({
            nodes: [{ id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } }],
            edges: [],
        });

        expect(flow).toBeDefined();
        expect(typeof flow.animate).toBe('function');
        expect(typeof flow.update).toBe('function');
        expect(typeof flow.sendParticle).toBe('function');
        expect(typeof flow.record).toBe('function');
    });

    it('renders a node into the DOM with the correct class', async () => {
        const { canvas } = await mountCanvas({
            nodes: [{ id: 'a', position: { x: 50, y: 50 }, data: { label: 'A' } }],
            edges: [],
        });

        const nodeEl = canvas.querySelector('.flow-node');
        expect(nodeEl).not.toBeNull();
    });

    it('animate() moves a node to its target position (regression: Alpine proxy survives)', async () => {
        // Regression for: structuredClone choking on Alpine reactive proxies
        // during animation setup — would throw silently and leave the handle
        // broken. If this test passes, the raw() unwrap path is intact.
        const { flow, scope } = await mountCanvas({
            nodes: [{ id: 'a', position: { x: 0, y: 0 }, data: {} }],
            edges: [],
        });

        const handle = flow.animate(
            { nodes: { a: { position: { x: 300, y: 0 } } } },
            { duration: 100, easing: 'linear' },
        );
        await handle.finished;
        await nextFrame();

        expect(scope.nodes[0].position.x).toBeCloseTo(300, 0);
    });

    it('sendParticleAlongPath works on a zero-edge canvas (regression for #887df57)', async () => {
        // Regression for: `.flow-edge-svg` missing on canvases with no edges
        // broke every particle-along-path emission. Lazy-creating the fallback
        // SVG element fixed it. If this test fails, that regression is back.
        const { flow } = await mountCanvas({ nodes: [], edges: [] });

        const handle = flow.sendParticleAlongPath('M 0 0 L 100 100', { duration: 100 });
        expect(handle).toBeDefined();
        await handle!.finished;
    });
});
