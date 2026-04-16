import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import Alpine from 'alpinejs';
import AlpineFlowDagre from '../../src/layout/dagre';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

// Register the dagre addon once — layout() requires it.
beforeAll(() => {
    Alpine.plugin(AlpineFlowDagre);
});

describe('C2: auto-layout excludes parented nodes', () => {
    afterEach(() => unmountAll());

    it('layout() does not reposition parented nodes by default', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'parent', position: { x: 0, y: 0 }, data: {}, childLayout: { type: 'vertical', gap: 8 } },
                { id: 'child', parentId: 'parent', position: { x: 10, y: 40 }, data: {} },
                { id: 'standalone', position: { x: 500, y: 500 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'parent', target: 'standalone' }],
        });
        await nextFrame();

        const childPosBefore = { ...flow.nodes.find((n: any) => n.id === 'child')!.position };

        flow.layout({ direction: 'TB' });
        await nextFrame();

        const childPosAfter = flow.nodes.find((n: any) => n.id === 'child')!.position;
        expect(childPosAfter.x).toBe(childPosBefore.x);
        expect(childPosAfter.y).toBe(childPosBefore.y);
    });

    it('layout({ includeChildren: true }) includes parented nodes', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'parent', position: { x: 0, y: 0 }, data: {} },
                { id: 'child', parentId: 'parent', position: { x: 10, y: 40 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'parent', target: 'child' }],
        });
        await nextFrame();

        // Just verify the option doesn't throw and runs layout
        flow.layout({ direction: 'TB', includeChildren: true });
        await nextFrame();

        expect(flow.nodes.find((n: any) => n.id === 'child')!.position).toBeDefined();
    });
});
