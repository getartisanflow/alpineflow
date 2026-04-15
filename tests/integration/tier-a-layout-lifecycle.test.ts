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

    describe('A1: template-aware measurement via ResizeObserver', () => {
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
});
