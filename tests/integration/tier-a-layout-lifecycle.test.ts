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
});
