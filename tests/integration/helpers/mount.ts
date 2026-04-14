/**
 * Canvas mount helper for browser-mode integration tests.
 *
 * Handles the bookkeeping that every integration test would otherwise repeat:
 *   - lazy-registering the AlpineFlow plugin on the shared Alpine singleton
 *     (once per session — `Alpine.plugin()` can't be called twice safely)
 *   - building the `<div x-data="flowCanvas(...)">` scope via safe DOM APIs
 *   - calling `Alpine.initTree` and waiting one rAF so effects flush
 *   - returning the `$flow` magic for direct API calls
 *   - tracking mounted containers so `unmountAll()` can tear down between tests
 *
 * Usage:
 *   import { mountCanvas, unmountAll } from './helpers/mount';
 *
 *   afterEach(() => unmountAll());
 *
 *   it('does a thing', async () => {
 *       const { flow } = await mountCanvas({ nodes: [...], edges: [...] });
 *       flow.animate({ nodes: { a: { position: { x: 100 } } } });
 *       // …assertions…
 *   });
 */
import Alpine from 'alpinejs';
import AlpineFlow from '../../../src';

let pluginRegistered = false;
const mounted: HTMLElement[] = [];

/** Register AlpineFlow on the shared Alpine singleton exactly once. */
function ensurePluginRegistered() {
    if (pluginRegistered) return;
    (window as any).Alpine = Alpine;
    Alpine.plugin(AlpineFlow);
    Alpine.start();
    pluginRegistered = true;
}

export interface MountResult {
    /** Outer wrapper element appended to `document.body`. */
    el: HTMLElement;
    /** The `.flow-container` element inside the wrapper. */
    canvas: HTMLElement;
    /** The `$flow` magic object — direct access to all canvas methods. */
    flow: any;
    /** Reactive Alpine scope of the canvas (use sparingly; prefer `flow`). */
    scope: any;
}

/** Minimal default Alpine template — one `x-flow-node` per entry in `nodes`. */
function buildDefaultTemplate(): HTMLElement {
    const viewport = document.createElement('div');
    viewport.setAttribute('x-flow-viewport', '');

    const template = document.createElement('template');
    template.setAttribute('x-for', 'node in nodes');
    template.setAttribute(':key', 'node.id');

    const node = document.createElement('div');
    node.setAttribute('x-flow-node', 'node');

    const targetHandle = document.createElement('div');
    targetHandle.setAttribute('x-flow-handle:target', '');
    node.appendChild(targetHandle);

    const label = document.createElement('span');
    label.setAttribute('x-text', 'node.data?.label ?? node.id');
    node.appendChild(label);

    const sourceHandle = document.createElement('div');
    sourceHandle.setAttribute('x-flow-handle:source', '');
    node.appendChild(sourceHandle);

    template.content.appendChild(node);
    viewport.appendChild(template);
    return viewport;
}

/**
 * Mount a `flowCanvas(config)` inside a fresh wrapper and return helpers.
 *
 * @param config   — first argument to `flowCanvas(...)` in the `x-data` expression
 * @param contents — optional child element to place inside the `.flow-container`.
 *                   Defaults to a minimal `x-flow-viewport` + node template.
 */
export async function mountCanvas(
    config: Record<string, any> = {},
    contents?: HTMLElement,
): Promise<MountResult> {
    ensurePluginRegistered();

    const wrapper = document.createElement('div');
    // Stash config on the wrapper so the x-data expression can reference it
    // without JSON.stringify gymnastics (which would strip functions).
    (wrapper as any).__config = config;

    const canvas = document.createElement('div');
    canvas.setAttribute('x-data', 'flowCanvas($root.parentElement.__config)');
    canvas.className = 'flow-container';
    canvas.style.width = '800px';
    canvas.style.height = '600px';
    canvas.style.position = 'relative';
    canvas.appendChild(contents ?? buildDefaultTemplate());

    wrapper.appendChild(canvas);
    document.body.appendChild(wrapper);
    mounted.push(wrapper);

    Alpine.initTree(wrapper);

    // Let reactive effects + mount hooks flush before the caller touches $flow.
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const scope = Alpine.$data(canvas);
    const flow = scope?.$flow;
    if (!flow) throw new Error('[mountCanvas] $flow magic not exposed on scope');

    return { el: wrapper, canvas, flow, scope };
}

/** Remove every mounted wrapper and destroy its Alpine tree. Call in `afterEach`. */
export function unmountAll(): void {
    for (const el of mounted) {
        Alpine.destroyTree(el);
        el.remove();
    }
    mounted.length = 0;
}

/** Resolve after `n` animation frames. Useful for asserting post-rAF state. */
export function nextFrame(n = 1): Promise<void> {
    return new Promise((resolve) => {
        const tick = (remaining: number) => {
            if (remaining <= 0) return resolve();
            requestAnimationFrame(() => tick(remaining - 1));
        };
        tick(n);
    });
}

/** Resolve after `ms` milliseconds. Useful for asserting during an animation. */
export function wait(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}
