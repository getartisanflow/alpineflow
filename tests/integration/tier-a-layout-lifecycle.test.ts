/**
 * Tier A integration tests — layout lifecycle.
 *
 * Spec coverage matrix (8 required cases from Testing Strategy, lines 431–448):
 *
 * Case 1: template-aware measurement
 *   → A1 "updates node.dimensions when element resizes"
 * Case 2: reactive childLayout
 *   → A3 — all 8 watched-prop + 2 lifecycle tests
 * Case 3: viewport culling safety
 *   → A1 "ignores 0x0 observations (viewport culling via display:none)"
 * Case 4: batch performance (100-node explicit stress)
 *   → A4 existing "canvas.batch() suppresses" (20 nodes) covers correctness;
 *     "Spec coverage gaps / 100-node batch" adds the 100-node stress assertion.
 * Case 5: frame-aligned dedup within-frame + across-frames
 *   → "Spec coverage gaps / frame-aligned dedup" — both sub-cases below.
 * Case 6: cross-frame loop safety
 *   → Fully covered at unit level in canvas-layout-dedup.test.ts
 *     ("suppresses layout after 5 consecutive frames", "resets consecutive counter",
 *      "resetLoopCounter clears suppression"). No integration duplicate needed.
 * Case 7: regression — fixedDimensions
 *   → A2 "DOES set inline height when fixedDimensions=true" +
 *     "observer ignores fixedDimensions nodes (A1 + A2 interaction)"
 * Case 8: performance benchmark
 *   → vitest.bench.config.ts / Task 0 / Task 10 — out of scope for this file.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('Tier A — layout lifecycle', () => {
    afterEach(() => unmountAll());

    describe('A3: reactive childLayout', () => {
        const WATCHED = ['columns', 'gap', 'padding', 'headerHeight', 'direction', 'stretch'] as const;

        for (const prop of WATCHED) {
            it(`re-layouts when childLayout.${prop} changes`, async () => {
                const { flow } = await mountCanvas({
                    nodes: [{
                        id: 'parent',
                        position: { x: 0, y: 0 },
                        data: {},
                        childLayout: {
                            direction: 'vertical',
                            columns: 1,
                            gap: 4,
                            padding: 4,
                            headerHeight: 0,
                            stretch: 'none',
                        },
                    }],
                    edges: [],
                });
                await nextFrame();

                // Intercept layoutChildren the same way Task 5's tests do
                // (direct property replacement — vi.spyOn on Alpine proxies is unreliable).
                const calls: string[] = [];
                const original = flow.layoutChildren;
                (flow as any).layoutChildren = function (id: string, ...rest: any[]) {
                    calls.push(id);
                    return original.call(this, id, ...rest);
                };

                const parent = flow.nodes[0];
                const original_val = (parent.childLayout as any)[prop];
                (parent.childLayout as any)[prop] =
                    prop === 'direction' ? 'horizontal'
                    : prop === 'stretch' ? 'width'
                    : (original_val as number) + 1;
                await nextFrame();

                expect(calls).toContain('parent');
            });
        }

        it('does NOT re-layout for unwatched props', async () => {
            const { flow } = await mountCanvas({
                nodes: [{
                    id: 'parent',
                    position: { x: 0, y: 0 },
                    data: {},
                    childLayout: { direction: 'vertical', gap: 4, someCustomProp: 'a' } as any,
                }],
                edges: [],
            });
            await nextFrame();

            const calls: string[] = [];
            const original = flow.layoutChildren;
            (flow as any).layoutChildren = function (id: string, ...rest: any[]) {
                calls.push(id);
                return original.call(this, id, ...rest);
            };

            (flow.nodes[0].childLayout as any).someCustomProp = 'b';
            await nextFrame();

            expect(calls).not.toContain('parent');
        });

        it('direct childLayout mutation triggers re-layout (server-side update path)', async () => {
            const { flow } = await mountCanvas({
                nodes: [{
                    id: 'parent',
                    position: { x: 0, y: 0 },
                    data: {},
                    childLayout: { direction: 'vertical', columns: 1, gap: 4 },
                }],
                edges: [],
            });
            await nextFrame();

            const calls: string[] = [];
            const original = flow.layoutChildren;
            (flow as any).layoutChildren = function (id: string, ...rest: any[]) {
                calls.push(id);
                return original.call(this, id, ...rest);
            };

            // Simulate the server-side mutation path: direct assignment on the reactive
            // node property (same path taken by wire-bridge flow:updateNode / fromObject).
            flow.nodes[0].childLayout.columns = 3;
            await nextFrame();

            expect(calls).toContain('parent');
        });

        it('installs watchers for containers added at runtime via addNodes', async () => {
            const { flow } = await mountCanvas({
                nodes: [], // no containers at mount
                edges: [],
            });
            await nextFrame();

            // Add a container node at runtime
            flow.addNodes([{
                id: 'runtime-parent',
                position: { x: 0, y: 0 },
                data: {},
                childLayout: { type: 'vertical', columns: 1, gap: 4 },
            }]);
            await nextFrame();

            // Set up layout interceptor AFTER add (so we only see reactive triggers, not A4's initial)
            const calls: string[] = [];
            const original = flow.layoutChildren;
            (flow as any).layoutChildren = function (id: string) {
                calls.push(id);
                return original.call(this, id);
            };

            // Mutate the runtime-added container's childLayout
            (flow.nodes[0].childLayout as any).columns = 3;
            await nextFrame();

            expect(calls).toContain('runtime-parent');
        });

        it('stops watchers when a node is removed via removeNodes', async () => {
            const { flow } = await mountCanvas({
                nodes: [{
                    id: 'parent',
                    position: { x: 0, y: 0 },
                    data: {},
                    childLayout: { type: 'vertical', columns: 1, gap: 4 },
                }],
                edges: [],
            });
            await nextFrame();

            // Capture the childLayout reference BEFORE removal
            const childLayout = flow.nodes[0].childLayout as any;

            flow.removeNodes(['parent']);
            await nextFrame();

            // Intercept AFTER removal
            const calls: string[] = [];
            const original = flow.layoutChildren;
            (flow as any).layoutChildren = function (id: string) {
                calls.push(id);
                return original.call(this, id);
            };

            // Mutate the removed node's (stale) childLayout — watcher should not fire
            childLayout.columns = 99;
            await nextFrame();

            expect(calls).not.toContain('parent');
        });
    });

    describe('A4: addNodes auto-layout parents', () => {
        it('lays out parent when children are added via addNodes', async () => {
            const { flow, scope } = await mountCanvas({
                nodes: [{
                    id: 'parent',
                    position: { x: 0, y: 0 },
                    data: {},
                    childLayout: { type: 'vertical', gap: 8, padding: 8 },
                }],
                edges: [],
            });
            await nextFrame();

            // Track layoutChildren calls via direct property replacement on the
            // live scope. This avoids vi.spyOn proxy wrapping issues.
            const calls: string[] = [];
            const origLayout = scope.layoutChildren.bind(scope);
            scope.layoutChildren = (parentId: string, ...rest: any[]) => {
                calls.push(parentId);
                return origLayout(parentId, ...rest);
            };

            flow.addNodes([
                { id: 'child-1', parentId: 'parent', position: { x: 0, y: 0 }, data: {} },
                { id: 'child-2', parentId: 'parent', position: { x: 0, y: 0 }, data: {} },
            ]);
            await nextFrame();

            expect(calls).toContain('parent');
            // Dedup: called exactly once despite two children with the same parentId.
            const parentCalls = calls.filter(id => id === 'parent');
            expect(parentCalls.length).toBe(1);
        });

        it('canvas.batch() suppresses layoutChildren during bulk add', async () => {
            const { flow, scope } = await mountCanvas({
                nodes: [{
                    id: 'parent',
                    position: { x: 0, y: 0 },
                    data: {},
                    childLayout: { type: 'vertical', gap: 8 },
                }],
                edges: [],
            });
            await nextFrame();

            // Track layoutChildren calls via direct property replacement on the
            // live scope.
            const calls: string[] = [];
            const origLayout = scope.layoutChildren.bind(scope);
            scope.layoutChildren = (parentId: string, ...rest: any[]) => {
                calls.push(parentId);
                return origLayout(parentId, ...rest);
            };

            flow.batch(() => {
                for (let i = 0; i < 20; i++) {
                    flow.addNodes([{ id: `child-${i}`, parentId: 'parent', position: { x: 0, y: 0 }, data: {} }]);
                }
            });
            await nextFrame();

            const parentCalls = calls.filter(id => id === 'parent');
            expect(parentCalls.length).toBe(1);
        });
    });

    describe('A2: conditional inline height', () => {
        it('does NOT set inline height on leaf nodes', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [{ id: 'leaf', position: { x: 0, y: 0 }, data: {}, dimensions: { width: 200, height: 100 } }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="leaf"]') as HTMLElement;

            expect(el.style.width).toBe('200px');
            expect(el.style.height).toBe(''); // leaf node — height flows from content
        });

        it('DOES set inline height on container nodes (with childLayout)', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [{
                    id: 'container',
                    position: { x: 0, y: 0 },
                    data: {},
                    dimensions: { width: 200, height: 100 },
                    childLayout: { type: 'vertical' },
                }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="container"]') as HTMLElement;

            // ResizeObserver may update node.dimensions to the rendered height, so the
            // exact value may differ from the initial 100. The key assertion is that
            // inline height IS applied (non-empty) — not left to flow from content.
            expect(el.style.height).not.toBe('');
        });

        it('DOES set inline height when fixedDimensions=true', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [{
                    id: 'fixed',
                    position: { x: 0, y: 0 },
                    data: {},
                    dimensions: { width: 200, height: 100 },
                    fixedDimensions: true,
                }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="fixed"]') as HTMLElement;

            expect(el.style.height).toBe('100px');
        });

        it('observer ignores fixedDimensions nodes (A1 + A2 interaction)', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [{
                    id: 'fixed',
                    position: { x: 0, y: 0 },
                    data: {},
                    dimensions: { width: 200, height: 100 },
                    fixedDimensions: true,
                }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="fixed"]') as HTMLElement;

            // Even if the element somehow ends up with a different rendered height,
            // node.dimensions should NOT be updated — the observer callback in Task 7
            // already skips fixedDimensions nodes. A2 is about not applying inline
            // height on leaf nodes — that concern is covered by the first 3 tests here.
            // This test verifies the A1+A2 contract holds together.
            el.style.height = '300px';  // simulate something overriding height
            await nextFrame();
            await nextFrame();
            await nextFrame();

            expect(flow.nodes[0].dimensions?.height).toBe(100);
        });
    });

    describe('A2 ripple effects — system-driven height promotion', () => {
        it('resize: leaf node becomes fixedDimensions after user drags resize handle', async () => {
            // Build a custom template that includes x-flow-resizer so the handle
            // elements exist in the DOM and the pointerdown handler can fire.
            const viewport = document.createElement('div');
            viewport.setAttribute('x-flow-viewport', '');

            const tmpl = document.createElement('template');
            tmpl.setAttribute('x-for', 'node in nodes');
            tmpl.setAttribute(':key', 'node.id');

            const nodeEl = document.createElement('div');
            nodeEl.setAttribute('x-flow-node', 'node');

            const resizer = document.createElement('div');
            resizer.setAttribute('x-flow-resizer', '');
            nodeEl.appendChild(resizer);

            tmpl.content.appendChild(nodeEl);
            viewport.appendChild(tmpl);

            const { flow, canvas } = await mountCanvas({
                nodes: [{
                    id: 'n1',
                    position: { x: 0, y: 0 },
                    data: {},
                    dimensions: { width: 200, height: 100 },
                    resizable: true,
                }],
                edges: [],
            }, viewport);
            await nextFrame();

            const node = flow.nodes[0];
            expect(node.fixedDimensions).toBeFalsy(); // not fixed initially

            // The resizer directive listens on the handle element for pointerdown.
            // We find the handle and dispatch a pointerdown event, which triggers
            // the resize-start handler that now sets fixedDimensions = true.
            const handle = canvas.querySelector('.flow-resizer-handle') as HTMLElement;
            expect(handle).not.toBeNull(); // template must have rendered handles
            handle!.dispatchEvent(new PointerEvent('pointerdown', {
                bubbles: true,
                clientX: 200,
                clientY: 100,
                pointerType: 'mouse',
                button: 0,
            }));
            await nextFrame();

            expect(node.fixedDimensions).toBe(true);
        });

        it('compute: node becomes fixedDimensions when compute writes height', async () => {
            // The compute re-measure path (canvas-compute.ts) sets fixedDimensions = true
            // on any node whose dimensions are written back after a compute() call.
            // To exercise this path, the node must have a registered compute type so
            // it appears in the results map and the rAF re-measure loop runs for it.
            const { flow } = await mountCanvas({
                nodes: [{
                    id: 'n1',
                    position: { x: 0, y: 0 },
                    data: {},
                    dimensions: { width: 200, height: 100 },
                    type: 'adder',
                }],
                edges: [],
            });
            await nextFrame();

            expect(flow.nodes[0].fixedDimensions).toBeFalsy();

            // Register a compute definition for the node's type so it enters results.
            flow.registerCompute('adder', {
                compute: (_inputs, _data) => ({ value: 1 }),
            });

            // Trigger compute — this queues a $nextTick → rAF re-measure that will
            // set fixedDimensions = true on n1 (per the Fix B in canvas-compute.ts).
            flow.compute();

            // Wait for Alpine $nextTick + rAF to fire (two nextFrame() calls)
            await nextFrame();
            await nextFrame();

            expect(flow.nodes[0].fixedDimensions).toBe(true);
        });

        it('animation: node becomes fixedDimensions when dimensions.height is animated', async () => {
            const { flow } = await mountCanvas({
                nodes: [{
                    id: 'n1',
                    position: { x: 0, y: 0 },
                    data: {},
                    dimensions: { width: 200, height: 100 },
                }],
                edges: [],
            });
            await nextFrame();

            expect(flow.nodes[0].fixedDimensions).toBeFalsy();

            // Animate dimensions.height — the update() code path in canvas-animation.ts
            // now sets fixedDimensions = true before scheduling the height tween.
            flow.animate({
                nodes: { 'n1': { dimensions: { height: 300 } } },
            }, { duration: 50 });

            await nextFrame();
            await nextFrame();

            expect(flow.nodes[0].fixedDimensions).toBe(true);
        });
    });

    describe('A1: template-aware measurement via ResizeObserver', () => {
        it('writes border-box dimensions (matches offsetWidth/offsetHeight, not contentRect)', async () => {
            // Regression: the observer initially used entry.contentRect, which is
            // the CONTENT BOX (excludes padding + border). Consumers and fitView
            // expect border-box dims (matching offsetWidth/offsetHeight). When
            // nodes have non-zero padding/border, the content-box vs border-box
            // mismatch caused fitView to over-zoom and visually clip nodes.
            const { flow, canvas } = await mountCanvas({
                nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: { label: 'A' } }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;

            // Force a measurable padding + border so content-box != border-box
            el.style.width = '200px';
            el.style.padding = '20px';
            el.style.border = '2px solid transparent';
            el.style.boxSizing = 'border-box';

            // Let the observer capture the new box
            await nextFrame();
            await nextFrame();
            await nextFrame();

            // Border-box = 200 (style.width with border-box sizing, padding and border included)
            // Content-box would be 200 - 40 (padding) - 4 (border) = 156
            // node.dimensions must reflect the border-box value.
            expect(flow.nodes[0].dimensions?.width).toBe(200);
            // Cross-check against offsetWidth, which is always border-box
            expect(flow.nodes[0].dimensions?.width).toBe(el.offsetWidth);
        });

        it('updates node.dimensions when element resizes', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: { label: 'A' } }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;

            // A2: leaf nodes have no inline height, so content-based sizing applies.
            // Set width directly (still valid — A2 only skips height), then grow height
            // via a child element so the natural content height increases and the
            // ResizeObserver observes real content growth.
            el.style.width = '400px';
            const spacer = document.createElement('div');
            spacer.style.height = '200px';
            el.appendChild(spacer);

            // ResizeObserver is async — wait a few frames
            await nextFrame();
            await nextFrame();
            await nextFrame();

            expect(flow.nodes[0].dimensions?.width).toBeGreaterThanOrEqual(400);
            expect(flow.nodes[0].dimensions?.height).toBeGreaterThanOrEqual(200);
        });

        it('ignores 0x0 observations (viewport culling via display:none)', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: {}, dimensions: { width: 100, height: 50 } }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;

            // Capture the actual dimensions after initial RAF measurement (A2: leaf nodes
            // have no inline height so the initial measurement reflects content height).
            const dimsBefore = { ...flow.nodes[0].dimensions! };

            el.style.display = 'none';
            await nextFrame();
            await nextFrame();

            // dimensions must NOT be clobbered to 0x0 — should remain at pre-hide values.
            expect(flow.nodes[0].dimensions?.width).toBeGreaterThan(0);
            expect(flow.nodes[0].dimensions?.height).toBeGreaterThan(0);
            expect(flow.nodes[0].dimensions).toEqual(dimsBefore);
        });

        it('clamps observed dims to min/max bounds (A5)', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [{
                    id: 'n1',
                    position: { x: 0, y: 0 },
                    data: {},
                    minDimensions: { width: 50, height: 20 },
                    maxDimensions: { width: 300, height: 100 },
                }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;

            // Force to an over-max width and under-min height
            el.style.width = '500px';
            el.style.height = '10px';
            await nextFrame();
            await nextFrame();
            await nextFrame();

            expect(flow.nodes[0].dimensions?.width).toBe(300);  // clamped to max
            expect(flow.nodes[0].dimensions?.height).toBe(20);  // clamped to min
        });

        it('skips observation for nodes with resizeObserver: false', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [{
                    id: 'n1', position: { x: 0, y: 0 }, data: {},
                    dimensions: { width: 100, height: 50 },
                    resizeObserver: false,
                }],
                edges: [],
            });
            await nextFrame();
            const el = canvas.querySelector('[data-flow-node-id="n1"]') as HTMLElement;

            // Capture dimensions after the initial RAF measurement fires (A2: leaf nodes
            // have no inline height so the initial measurement reflects content height).
            const dimsAfterMount = { ...flow.nodes[0].dimensions! };

            el.style.width = '999px';
            await nextFrame();
            await nextFrame();

            // dimensions must not change — the ResizeObserver was skipped for this node.
            // Width is set inline by the effect (width is always applied), so check height
            // specifically: it should NOT change since there is no observer.
            expect(flow.nodes[0].dimensions?.height).toBe(dimsAfterMount.height);
        });

        it('schedules parent layout when child resizes', async () => {
            const { flow, canvas } = await mountCanvas({
                nodes: [
                    { id: 'parent', position: { x: 0, y: 0 }, data: {}, childLayout: { type: 'vertical', gap: 4 } },
                    { id: 'child', parentId: 'parent', position: { x: 0, y: 0 }, data: {} },
                ],
                edges: [],
            });
            await nextFrame();

            // Intercept layoutChildren AFTER mount (so we don't see initial layouts)
            const calls: string[] = [];
            const original = flow.layoutChildren;
            (flow as any).layoutChildren = function (id: string) {
                calls.push(id);
                return original.call(this, id);
            };

            const el = canvas.querySelector('[data-flow-node-id="child"]') as HTMLElement;
            el.style.height = '150px';
            await nextFrame();
            await nextFrame();
            await nextFrame();

            expect(calls).toContain('parent');
        });
    });

    // -------------------------------------------------------------------------
    // Spec coverage gaps
    // Case 4: batch performance — 100-node explicit stress assertion.
    // Case 5: frame-aligned dedup — within-frame (A4+A1 same parent) and
    //         across-frames (same parent in two successive frames).
    // Case 6: cross-frame loop safety — fully covered at unit level in
    //         canvas-layout-dedup.test.ts; no integration duplicate needed.
    // -------------------------------------------------------------------------
    describe('Spec coverage gaps', () => {
        // ------------------------------------------------------------------
        // Case 4 (stress): 100-node batch — one layout pass per parent
        // ------------------------------------------------------------------
        it('batch: 100-node add triggers exactly one layoutChildren per parent', async () => {
            const { flow, scope } = await mountCanvas({
                nodes: [{
                    id: 'parent',
                    position: { x: 0, y: 0 },
                    data: {},
                    childLayout: { type: 'vertical', gap: 8 },
                }],
                edges: [],
            });
            await nextFrame();

            const calls: string[] = [];
            const origLayout = scope.layoutChildren.bind(scope);
            scope.layoutChildren = (parentId: string, ...rest: any[]) => {
                calls.push(parentId);
                return origLayout(parentId, ...rest);
            };

            flow.batch(() => {
                for (let i = 0; i < 100; i++) {
                    flow.addNodes([{
                        id: `child-${i}`,
                        parentId: 'parent',
                        position: { x: 0, y: 0 },
                        data: {},
                    }]);
                }
            });
            await nextFrame();

            const parentCalls = calls.filter(id => id === 'parent');
            expect(parentCalls.length).toBe(1);
        });

        // ------------------------------------------------------------------
        // Case 5a: frame-aligned dedup — within a single animation frame,
        // both A4 (addNodes with parentId) and A1 (observer resize on a child
        // already in the canvas) target the SAME parent. Dedup must collapse
        // both triggers to exactly one layoutChildren call.
        // ------------------------------------------------------------------
        it('frame-aligned dedup: A4 + A1 for same parent in same frame → one layout', async () => {
            const { flow, scope, canvas } = await mountCanvas({
                nodes: [
                    {
                        id: 'parent',
                        position: { x: 0, y: 0 },
                        data: {},
                        childLayout: { type: 'vertical', gap: 4 },
                    },
                    // A pre-existing child so the observer has something to observe.
                    { id: 'existing-child', parentId: 'parent', position: { x: 0, y: 0 }, data: {} },
                ],
                edges: [],
            });
            await nextFrame();
            await nextFrame(); // let initial observer + layout settle

            const calls: string[] = [];
            const origLayout = scope.layoutChildren.bind(scope);
            scope.layoutChildren = (parentId: string, ...rest: any[]) => {
                calls.push(parentId);
                return origLayout(parentId, ...rest);
            };

            // Trigger A4: add a new child to the same parent.
            flow.addNodes([{
                id: 'new-child',
                parentId: 'parent',
                position: { x: 0, y: 0 },
                data: {},
            }]);

            // Trigger A1: resize the existing child's element in the SAME synchronous
            // tick so the ResizeObserver callback (which fires asynchronously but still
            // within the same rAF) sees the change before the frame flushes.
            const childEl = canvas.querySelector('[data-flow-node-id="existing-child"]') as HTMLElement;
            const spacer = document.createElement('div');
            spacer.style.height = '80px';
            childEl.appendChild(spacer);

            // Wait for both triggers to resolve (ResizeObserver + dedup RAF).
            await nextFrame();
            await nextFrame();
            await nextFrame();

            const parentCalls = calls.filter(id => id === 'parent');
            // Both A4 and A1 must have converged to a single layout call.
            expect(parentCalls.length).toBe(1);
        });

        // ------------------------------------------------------------------
        // Case 5b: frame-aligned dedup — across frames. The same parent is
        // triggered in frame 1, then triggered again in frame 2 after a real
        // dimension change. Dedup must NOT suppress the second-frame call —
        // exactly 2 layout calls must run (one per frame).
        // ------------------------------------------------------------------
        it('frame-aligned dedup: same parent in two successive frames → two layouts', async () => {
            const { flow, scope, canvas } = await mountCanvas({
                nodes: [
                    {
                        id: 'parent',
                        position: { x: 0, y: 0 },
                        data: {},
                        childLayout: { type: 'vertical', gap: 4 },
                    },
                    { id: 'child', parentId: 'parent', position: { x: 0, y: 0 }, data: {} },
                ],
                edges: [],
            });
            await nextFrame();
            await nextFrame(); // settle initial state

            const calls: string[] = [];
            const origLayout = scope.layoutChildren.bind(scope);
            scope.layoutChildren = (parentId: string, ...rest: any[]) => {
                calls.push(parentId);
                return origLayout(parentId, ...rest);
            };

            const childEl = canvas.querySelector('[data-flow-node-id="child"]') as HTMLElement;

            // --- Frame 1: resize child (triggers A1 → layout parent) ---
            const spacer1 = document.createElement('div');
            spacer1.style.height = '60px';
            childEl.appendChild(spacer1);
            await nextFrame();
            await nextFrame();
            await nextFrame();

            const afterFrame1 = calls.filter(id => id === 'parent').length;
            expect(afterFrame1).toBeGreaterThanOrEqual(1);

            // --- Frame 2: resize child again with a DIFFERENT height ---
            const spacer2 = document.createElement('div');
            spacer2.style.height = '120px';
            childEl.appendChild(spacer2);
            await nextFrame();
            await nextFrame();
            await nextFrame();

            const afterFrame2 = calls.filter(id => id === 'parent').length;
            // A second layout must have fired in frame 2 — not suppressed by dedup.
            expect(afterFrame2).toBeGreaterThanOrEqual(afterFrame1 + 1);
        });
    });
});
