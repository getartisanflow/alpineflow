import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('C4: node-type connection validation', () => {
    afterEach(() => unmountAll());

    it('rejects connections between disallowed types via byType rules', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'page1', type: 'page', position: { x: 0, y: 0 }, data: {} },
                { id: 'field1', type: 'field', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
            connectionRules: { byType: { page: ['page'] } },
        });
        await nextFrame();

        flow.addEdges([{ id: 'e1', source: 'page1', target: 'field1' }]);
        await nextFrame();

        expect(flow.edges.find((e: any) => e.id === 'e1')).toBeUndefined();
    });

    it('allows connections between allowed types', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'p1', type: 'page', position: { x: 0, y: 0 }, data: {} },
                { id: 'p2', type: 'page', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
            connectionRules: { byType: { page: ['page'] } },
        });
        await nextFrame();

        flow.addEdges([{ id: 'e1', source: 'p1', target: 'p2' }]);
        await nextFrame();

        expect(flow.edges.find((e: any) => e.id === 'e1')).toBeDefined();
    });

    it('supports validate function for complex rules', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', type: 'output', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
            connectionRules: {
                validate: (_conn: any, src: any, tgt: any) => src.type === 'input' && tgt.type === 'output',
            },
        });
        await nextFrame();

        flow.addEdges([{ id: 'e1', source: 'a', target: 'b' }]);
        await nextFrame();
        expect(flow.edges.find((e: any) => e.id === 'e1')).toBeDefined();

        flow.addEdges([{ id: 'e2', source: 'b', target: 'a' }]);
        await nextFrame();
        expect(flow.edges.find((e: any) => e.id === 'e2')).toBeUndefined();
    });

    it('allows all connections when type has no entry in byType map', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', type: 'page', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', type: 'widget', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
            connectionRules: { byType: { page: ['page'] } },
        });
        await nextFrame();

        // 'widget' has no entry in byType → allow all targets
        flow.addEdges([{ id: 'e1', source: 'b', target: 'a' }]);
        await nextFrame();
        expect(flow.edges.find((e: any) => e.id === 'e1')).toBeDefined();
    });

    it('passes when no connectionRules configured', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', type: 'page', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', type: 'field', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
        });
        await nextFrame();

        flow.addEdges([{ id: 'e1', source: 'a', target: 'b' }]);
        await nextFrame();
        expect(flow.edges.find((e: any) => e.id === 'e1')).toBeDefined();
    });

    it('filters partial arrays — allows valid edges and rejects invalid ones', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'p1', type: 'page', position: { x: 0, y: 0 }, data: {} },
                { id: 'p2', type: 'page', position: { x: 200, y: 0 }, data: {} },
                { id: 'f1', type: 'field', position: { x: 400, y: 0 }, data: {} },
            ],
            edges: [],
            connectionRules: { byType: { page: ['page'] } },
        });
        await nextFrame();

        flow.addEdges([
            { id: 'ok', source: 'p1', target: 'p2' },
            { id: 'bad', source: 'p1', target: 'f1' },
        ]);
        await nextFrame();

        expect(flow.edges.find((e: any) => e.id === 'ok')).toBeDefined();
        expect(flow.edges.find((e: any) => e.id === 'bad')).toBeUndefined();
    });

    it('rejects when validate function returns false', async () => {
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'x', type: 'leaf', position: { x: 0, y: 0 }, data: {} },
                { id: 'y', type: 'leaf', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
            connectionRules: {
                validate: (_conn: any, src: any) => src.type !== 'leaf',
            },
        });
        await nextFrame();

        flow.addEdges([{ id: 'e1', source: 'x', target: 'y' }]);
        await nextFrame();
        expect(flow.edges.find((e: any) => e.id === 'e1')).toBeUndefined();
    });

    it('both byType and validate must pass', async () => {
        let validateCalled = false;
        const { flow } = await mountCanvas({
            nodes: [
                { id: 'a', type: 'page', position: { x: 0, y: 0 }, data: {} },
                { id: 'b', type: 'field', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [],
            connectionRules: {
                byType: { page: ['page'] },
                validate: () => { validateCalled = true; return true; },
            },
        });
        await nextFrame();

        // byType rejects first → validate should never be called
        flow.addEdges([{ id: 'e1', source: 'a', target: 'b' }]);
        await nextFrame();

        expect(flow.edges.find((e: any) => e.id === 'e1')).toBeUndefined();
        expect(validateCalled).toBe(false);
    });
});
