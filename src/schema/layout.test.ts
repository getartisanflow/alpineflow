import { describe, it, expect, vi } from 'vitest';
import { schemaLayout } from './layout';

interface TestNode {
    id: string;
    position: { x: number; y: number };
    data?: { fields?: Array<{ name: string; key?: string }> };
}

interface TestEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}

function makeCanvas(overrides: Partial<{ nodes: TestNode[]; edges: TestEdge[] }> = {}): any {
    return {
        nodes: overrides.nodes ?? [
            { id: 'user', position: { x: 0, y: 0 }, data: { fields: [{ name: 'id', key: 'primary' }, { name: 'team_id' }] } },
            { id: 'team', position: { x: 0, y: 0 }, data: { fields: [{ name: 'id', key: 'primary' }] } },
        ],
        edges: overrides.edges ?? [],
    };
}

describe('schemaLayout', () => {
    it('prefers dagre (canvas.layout) when available', async () => {
        const canvas = makeCanvas();
        canvas.layout = vi.fn();
        canvas.treeLayout = vi.fn();

        await schemaLayout(canvas);

        expect(canvas.layout).toHaveBeenCalledTimes(1);
        expect(canvas.treeLayout).not.toHaveBeenCalled();
    });

    it('falls back to treeLayout when dagre is absent', async () => {
        const canvas = makeCanvas();
        canvas.layout = vi.fn(() => {
            throw new Error('layout() requires the dagre plugin');
        });
        canvas.treeLayout = vi.fn();

        await schemaLayout(canvas);

        expect(canvas.layout).toHaveBeenCalledTimes(1);
        expect(canvas.treeLayout).toHaveBeenCalledTimes(1);
    });

    it('falls back to grid when neither dagre nor tree is available', async () => {
        const canvas = makeCanvas();
        // No layout / treeLayout methods → grid path.

        await schemaLayout(canvas);

        // Two nodes → 2 columns (ceil(sqrt(2))). First node at origin, second
        // at column 1, row 0 → x > 0.
        expect(canvas.nodes[0].position).toEqual({ x: 0, y: 0 });
        expect(canvas.nodes[1].position.x).toBeGreaterThan(0);
        expect(canvas.nodes[1].position.y).toBe(0);
        expect(canvas.nodes[0].position).not.toEqual(canvas.nodes[1].position);
    });

    it('respects explicit algorithm: "grid" even when dagre is available', async () => {
        const canvas = makeCanvas();
        canvas.layout = vi.fn();
        canvas.treeLayout = vi.fn();

        await schemaLayout(canvas, { algorithm: 'grid' });

        expect(canvas.layout).not.toHaveBeenCalled();
        expect(canvas.treeLayout).not.toHaveBeenCalled();
        // Grid placed the second node at a positive x.
        expect(canvas.nodes[1].position.x).toBeGreaterThan(0);
    });

    it('passes direction/spacing options through to dagre (canvas.layout)', async () => {
        const canvas = makeCanvas();
        canvas.layout = vi.fn();

        await schemaLayout(canvas, { direction: 'TB', nodeSpacing: 120, rankSpacing: 240 });

        expect(canvas.layout).toHaveBeenCalledWith({
            direction: 'TB',
            nodesep: 120,
            ranksep: 240,
        });
    });

    it('temporarily swaps canvas.edges when deriveFromReferences is true, then restores', async () => {
        const originalEdges: TestEdge[] = [
            { id: 'existing', source: 'user', target: 'team' },
        ];
        const canvas = makeCanvas({ edges: originalEdges.slice() });

        let edgesDuringLayout: TestEdge[] | null = null;
        canvas.layout = vi.fn(() => {
            edgesDuringLayout = canvas.edges.slice();
        });

        await schemaLayout(canvas, { deriveFromReferences: true });

        // inferReferences(nodes) → [user.team_id → team.id]
        expect(edgesDuringLayout).toHaveLength(1);
        expect(edgesDuringLayout![0]).toMatchObject({
            source: 'user',
            target: 'team',
            sourceHandle: 'team_id',
            targetHandle: 'id',
        });
        // After the call, the original edges are restored.
        expect(canvas.edges).toEqual(originalEdges);
    });

    it('restores canvas.edges even when the underlying layout throws', async () => {
        const originalEdges: TestEdge[] = [
            { id: 'existing', source: 'user', target: 'team' },
        ];
        const canvas = makeCanvas({ edges: originalEdges.slice() });

        canvas.layout = vi.fn(() => {
            throw new Error('layout() requires the dagre plugin');
        });
        canvas.treeLayout = vi.fn(() => {
            throw new Error('treeLayout() requires the hierarchy plugin');
        });

        await schemaLayout(canvas, { deriveFromReferences: true });

        // Both engine calls threw → fell through to grid, which succeeds.
        // Either way, the original edges are back.
        expect(canvas.edges).toEqual(originalEdges);
    });

    it('warns and no-ops when algorithm is pinned but unavailable', async () => {
        const canvas = makeCanvas();
        canvas.layout = vi.fn(() => {
            throw new Error('layout() requires the dagre plugin');
        });
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await schemaLayout(canvas, { algorithm: 'dagre' });

        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toMatch(/schemaLayout/);
        // Node positions untouched — pinned dagre, refused to fall through.
        expect(canvas.nodes[0].position).toEqual({ x: 0, y: 0 });
        expect(canvas.nodes[1].position).toEqual({ x: 0, y: 0 });

        warnSpy.mockRestore();
    });

    it('handles an empty canvas gracefully', async () => {
        const canvas = makeCanvas({ nodes: [], edges: [] });

        await expect(schemaLayout(canvas)).resolves.toBeUndefined();
        expect(canvas.nodes).toEqual([]);
        expect(canvas.edges).toEqual([]);
    });

    it('is idempotent — calling twice with the same inputs produces the same positions', async () => {
        const canvas = makeCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 } },
                { id: 'b', position: { x: 0, y: 0 } },
                { id: 'c', position: { x: 0, y: 0 } },
                { id: 'd', position: { x: 0, y: 0 } },
            ],
        });

        await schemaLayout(canvas, { algorithm: 'grid' });
        const snapshotAfterFirst = canvas.nodes.map((n: TestNode) => ({ ...n.position }));

        await schemaLayout(canvas, { algorithm: 'grid' });
        const snapshotAfterSecond = canvas.nodes.map((n: TestNode) => ({ ...n.position }));

        expect(snapshotAfterSecond).toEqual(snapshotAfterFirst);
    });

    it('grid fallback arranges nodes in approximately sqrt(n) columns', async () => {
        const nodes: TestNode[] = [];
        for (let i = 0; i < 9; i++) {
            nodes.push({ id: `n${i}`, position: { x: 0, y: 0 } });
        }
        const canvas = makeCanvas({ nodes });

        await schemaLayout(canvas, { algorithm: 'grid' });

        // 9 nodes → 3 columns. Column x-values should have 3 distinct values.
        const xValues = new Set(canvas.nodes.map((n: TestNode) => n.position.x));
        expect(xValues.size).toBe(3);
        const yValues = new Set(canvas.nodes.map((n: TestNode) => n.position.y));
        expect(yValues.size).toBe(3);

        // Every position is unique.
        const keys = canvas.nodes.map((n: TestNode) => `${n.position.x}:${n.position.y}`);
        expect(new Set(keys).size).toBe(9);
    });

    it('RL direction mirrors the x-axis in the grid fallback', async () => {
        const canvas = makeCanvas({
            nodes: [
                { id: 'a', position: { x: 0, y: 0 } },
                { id: 'b', position: { x: 0, y: 0 } },
            ],
        });

        await schemaLayout(canvas, { algorithm: 'grid', direction: 'RL' });

        // With RL, first node sits at the rightmost column, second at x=0.
        expect(canvas.nodes[0].position.x).toBeGreaterThan(0);
        expect(canvas.nodes[1].position.x).toBe(0);
    });
});
