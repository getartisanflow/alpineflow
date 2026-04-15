/**
 * Baseline benchmark — captures 500-node canvas mount/add/drag timings.
 * Task 10 reruns this file against the Tier A branch to verify no >10% regression.
 *
 * Noise note: running at bench speed surfaces unhandled `_x_dataStack` errors
 * from Alpine's teardown path (observers fire after Alpine.destroyTree). These
 * are not a bug in this file and do not affect timing. If Tier A resolves them
 * (via proper observer cleanup), great — otherwise they're acceptable noise
 * scoped to bench runs. See tests/bench/baseline.txt for the captured output.
 */
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
