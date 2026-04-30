// ============================================================================
// Easy-connect + async connectValidator wiring
// ============================================================================
// Verifies that the easy-connect path (alt + drag from node body) awaits the
// async `connectValidator` before committing a new edge — matching the
// behavior of drag-to-connect, click-to-connect, keyboard-connect, and edge-
// endpoint reconnect. Before the fix, easy-connect ran only the sync
// validator chain, so consumers configured with `connectValidator` had a
// silent bypass on that one gesture.
//
// Exercised through the real mount path (Alpine + flowCanvas) so the test
// also covers the directive wiring — not just the helper it delegates to.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

/**
 * Fire an easy-connect gesture: alt+pointerdown on the source node body,
 * pointermove to the target node's target handle, pointerup there.
 *
 * The source pointerdown must NOT land on a handle — the directive skips
 * if `data-flow-handle-type` is in the event path so the normal handle
 * logic can run instead.
 */
function easyConnect(
    sourceNodeEl: HTMLElement,
    targetHandleEl: HTMLElement,
    { clientX = 500, clientY = 500 } = {},
): void {
    // The source node body has no handle at its center by default — the
    // `x-flow-handle` elements are in the node template's flow. But the
    // default template does place handles as children of the node, so we
    // need to dispatch from an element that is NOT inside a handle. Walk
    // the node and find a child that isn't a handle (the label span works).
    const nonHandleTarget =
        (sourceNodeEl.querySelector('span') as HTMLElement | null) ??
        sourceNodeEl;

    nonHandleTarget.dispatchEvent(
        new PointerEvent('pointerdown', {
            bubbles: true,
            cancelable: true,
            altKey: true,
            clientX: 100,
            clientY: 100,
            pointerType: 'mouse',
            button: 0,
        }),
    );

    // pointermove + pointerup listeners are attached to `document`, so the
    // events must target `document` (or something that bubbles to it).
    document.dispatchEvent(
        new PointerEvent('pointermove', {
            bubbles: true,
            clientX,
            clientY,
            pointerType: 'mouse',
        }),
    );

    // The drop-target lookup uses `document.elementFromPoint(clientX, clientY)`,
    // so we need that call to return the target handle. Stub it for the
    // duration of this pointerup.
    const originalElementFromPoint = document.elementFromPoint.bind(document);
    document.elementFromPoint = (() => targetHandleEl) as any;
    try {
        document.dispatchEvent(
            new PointerEvent('pointerup', {
                bubbles: true,
                clientX,
                clientY,
                pointerType: 'mouse',
            }),
        );
    } finally {
        document.elementFromPoint = originalElementFromPoint;
    }
}

describe('easy-connect + connectValidator', () => {
    afterEach(() => unmountAll());

    it('awaits connectValidator and rejects when it returns false', async () => {
        const validatorCalls: any[] = [];
        const { canvas, flow } = await mountCanvas({
            nodes: [
                { id: 'n1', position: { x: 0, y: 0 }, data: {} },
                { id: 'n2', position: { x: 400, y: 0 }, data: {} },
            ],
            edges: [],
            easyConnect: true,
            connectValidator: (c: any) => {
                validatorCalls.push(c);
                return Promise.resolve(false);
            },
        });
        await nextFrame();

        const rejected: any[] = [];
        canvas.addEventListener('flow-connect-rejected', (e: any) =>
            rejected.push(e.detail),
        );

        const sourceEl = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        const targetHandleEl = canvas.querySelector(
            '[data-flow-node-id="n2"] [data-flow-handle-type="target"]',
        ) as HTMLElement;
        expect(sourceEl).not.toBeNull();
        expect(targetHandleEl).not.toBeNull();

        easyConnect(sourceEl, targetHandleEl);
        // Wait for the async validator promise to resolve and the rejection
        // to flush through applyConnectValidation.
        await nextFrame(2);

        expect(validatorCalls).toHaveLength(1);
        expect(validatorCalls[0].source).toBe('n1');
        expect(validatorCalls[0].target).toBe('n2');
        expect(flow.edges).toHaveLength(0);
        expect(rejected).toHaveLength(1);
    });

    it('commits the edge when connectValidator resolves true', async () => {
        const { canvas, flow } = await mountCanvas({
            nodes: [
                { id: 'n1', position: { x: 0, y: 0 }, data: {} },
                { id: 'n2', position: { x: 400, y: 0 }, data: {} },
            ],
            edges: [],
            easyConnect: true,
            connectValidator: () => Promise.resolve(true),
        });
        await nextFrame();

        const sourceEl = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        const targetHandleEl = canvas.querySelector(
            '[data-flow-node-id="n2"] [data-flow-handle-type="target"]',
        ) as HTMLElement;

        easyConnect(sourceEl, targetHandleEl);
        await nextFrame(2);

        expect(flow.edges).toHaveLength(1);
        expect(flow.edges[0].source).toBe('n1');
        expect(flow.edges[0].target).toBe('n2');
    });

    it('surfaces the rejection reason on flow-connect-rejected', async () => {
        const { canvas, flow } = await mountCanvas({
            nodes: [
                { id: 'n1', position: { x: 0, y: 0 }, data: {} },
                { id: 'n2', position: { x: 400, y: 0 }, data: {} },
            ],
            edges: [],
            easyConnect: true,
            connectValidator: () => Promise.resolve({ allowed: false, reason: 'policy' }),
        });
        await nextFrame();

        const rejections: any[] = [];
        canvas.addEventListener('flow-connect-rejected', (e: any) =>
            rejections.push(e.detail),
        );

        const sourceEl = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        const targetHandleEl = canvas.querySelector(
            '[data-flow-node-id="n2"] [data-flow-handle-type="target"]',
        ) as HTMLElement;

        easyConnect(sourceEl, targetHandleEl);
        await nextFrame(2);

        expect(flow.edges).toHaveLength(0);
        expect(rejections).toHaveLength(1);
        expect(rejections[0].reason).toBe('policy');
        expect(rejections[0].source).toBe('n1');
        expect(rejections[0].target).toBe('n2');
    });

    it('overlap guard: a second easy-connect while the first validator is pending is ignored', async () => {
        let resolveValidator: (v: boolean) => void = () => {};
        let calls = 0;
        const { canvas, flow } = await mountCanvas({
            nodes: [
                { id: 'n1', position: { x: 0, y: 0 }, data: {} },
                { id: 'n2', position: { x: 400, y: 0 }, data: {} },
            ],
            edges: [],
            easyConnect: true,
            connectValidator: () => {
                calls += 1;
                return new Promise<boolean>((r) => {
                    resolveValidator = r;
                });
            },
        });
        await nextFrame();

        const sourceEl = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;
        const targetHandleEl = canvas.querySelector(
            '[data-flow-node-id="n2"] [data-flow-handle-type="target"]',
        ) as HTMLElement;

        // First drop — validator stays pending (no resolve yet).
        easyConnect(sourceEl, targetHandleEl);
        await nextFrame();
        expect(calls).toBe(1);

        // Second drop during the pending validator — the overlap guard on
        // `currentCanvas._connectValidating` should short-circuit the new
        // pointerdown, so no second validator call is made.
        easyConnect(sourceEl, targetHandleEl);
        await nextFrame();
        expect(calls).toBe(1);

        // Resolve the first one as allowed — single edge should land.
        resolveValidator(true);
        await nextFrame(2);
        expect(flow.edges).toHaveLength(1);
    });
});
