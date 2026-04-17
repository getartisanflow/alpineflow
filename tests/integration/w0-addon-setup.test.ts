/**
 * W0 — addon setup callback mechanism
 *
 * registerAddon('name', { setup(canvas) { ... } }) lets addons inject
 * methods and state onto the $flow scope during canvas init. This is
 * the generic mechanism that the workflow addon (W1) will use first.
 *
 * Plain-value addons (layout engines, collab factories) are unaffected —
 * they have no setup property and are silently skipped.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';
import { registerAddon, unregisterAddon } from '../../src/core/registry';

// Unique keys — avoids collisions with real addons (layout:dagre, collab, etc.)
const KEY_SETUP = 'test:w0-setup';
const KEY_METHOD = 'test:w0-method';
const KEY_PLAIN = 'test:w0-plain';

describe('W0: addon setup callback', () => {
    afterEach(() => {
        unmountAll();
        // Remove only the test keys registered in this suite so we don't
        // wipe real addons (layout engines, collab factory) that were
        // registered once by Alpine.plugin() during mountCanvas bootstrap.
        unregisterAddon(KEY_SETUP);
        unregisterAddon(KEY_METHOD);
        unregisterAddon(KEY_PLAIN);
    });

    it('calls addon setup(canvas) during canvas init', async () => {
        const setupFn = vi.fn();
        registerAddon(KEY_SETUP, { setup: setupFn });

        const { flow } = await mountCanvas({ nodes: [], edges: [] });
        await nextFrame();

        expect(setupFn).toHaveBeenCalledOnce();
        // Verify the argument is the canvas data object
        const canvas = setupFn.mock.calls[0][0];
        expect(typeof canvas.addNodes).toBe('function');
        expect(typeof canvas.setNodeState).toBe('function');
    });

    it('addon setup can inject a method onto the canvas', async () => {
        registerAddon(KEY_METHOD, {
            setup(canvas: any) {
                canvas.myCustomMethod = () => 'hello from addon';
            },
        });

        const { flow } = await mountCanvas({ nodes: [], edges: [] });
        await nextFrame();

        expect((flow as any).myCustomMethod()).toBe('hello from addon');
    });

    it('existing plain-value addons still work (no setup property)', async () => {
        const computeFn = vi.fn();
        registerAddon(KEY_PLAIN, computeFn);

        // Should not throw during init — plain values are skipped by the setup loop
        const { flow } = await mountCanvas({ nodes: [], edges: [] });
        await nextFrame();

        expect(flow).toBeDefined();
    });
});
