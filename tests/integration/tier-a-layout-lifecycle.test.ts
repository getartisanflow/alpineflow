import { describe, it, expect, afterEach, vi } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('Tier A — layout lifecycle', () => {
    afterEach(() => unmountAll());

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
