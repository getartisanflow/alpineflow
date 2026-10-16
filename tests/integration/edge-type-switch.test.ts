/**
 * update() switching an edge's type recomputes its rendered path.
 *
 * The unit tests assert `edge.type` is assigned, but their mock has no Alpine
 * reactivity, so the point of the feature — the path generator actually changing
 * and the SVG `d` being redrawn — is only observable against a real render.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('update() — switching an edge type redraws its path', () => {
  afterEach(() => unmountAll());

  it('recomputes the rendered path `d` when the edge type changes', async () => {
    const { canvas, flow } = await mountCanvas({
      nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'b', position: { x: 300, y: 200 }, data: {} },
      ],
      edges: [{ id: 'e1', source: 'a', target: 'b', type: 'bezier' }],
    });
    await nextFrame(2); // one frame to render the nodes, one to measure + route the edge

    const pathD = (): string => {
      const g = canvas.querySelector('[data-flow-edge-id="e1"]') as SVGGElement | null;
      const paths = g ? Array.from(g.querySelectorAll('path')) : [];
      // The visible path is the last <path> in the group (the first is the invisible hit area).
      return paths.length ? paths[paths.length - 1].getAttribute('d') ?? '' : '';
    };

    const before = pathD();
    expect(before, 'the edge did not render a path').not.toBe('');

    flow.update({ edges: { e1: { type: 'straight' } } });
    await nextFrame(2);

    const after = pathD();
    expect(after, 'the edge lost its path after the type switch').not.toBe('');
    expect(after, 'the path `d` did not change when the edge type switched').not.toBe(before);
  });
});
