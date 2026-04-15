import { bench, describe } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from '../integration/helpers/mount';

function makeNodes(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: `n${i}`,
        position: { x: (i % 25) * 120, y: Math.floor(i / 25) * 80 },
        data: { label: `Node ${i}` },
    }));
}

describe('500-node canvas baseline', () => {
    bench('initial mount', async () => {
        const { flow } = await mountCanvas({ nodes: makeNodes(500), edges: [] });
        await nextFrame();
        unmountAll();
    }, { iterations: 5 });

    bench('add 50 nodes to existing 500', async () => {
        const { flow } = await mountCanvas({ nodes: makeNodes(500), edges: [] });
        await nextFrame();
        flow.addNodes(makeNodes(50).map((n, i) => ({ ...n, id: `new-${i}` })));
        await nextFrame();
        unmountAll();
    }, { iterations: 5 });

    bench('drag one node 100 steps', async () => {
        const { flow } = await mountCanvas({ nodes: makeNodes(500), edges: [] });
        await nextFrame();
        const node = flow.nodes[0];
        for (let i = 0; i < 100; i++) {
            node.position = { x: node.position.x + 1, y: node.position.y };
        }
        await nextFrame();
        unmountAll();
    }, { iterations: 3 });
});
