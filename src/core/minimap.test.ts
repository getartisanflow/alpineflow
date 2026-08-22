// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createMiniMap } from './minimap';
import type { MiniMapState } from './minimap';
import type { FlowNode } from './types';

function fullState(): MiniMapState {
  return {
    nodes: [
      { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 40 }, data: {} } as unknown as FlowNode,
      { id: 'b', position: { x: 300, y: 200 }, dimensions: { width: 100, height: 40 }, data: {} } as unknown as FlowNode,
    ],
    viewport: { x: 0, y: 0, zoom: 1 },
    containerWidth: 800,
    containerHeight: 600,
  };
}

function viewportState() {
  return { viewport: { x: 0, y: 0, zoom: 1 }, containerWidth: 800, containerHeight: 600 };
}

describe('minimap lean viewport getter', () => {
  it('updateViewport uses getViewportState and does not invoke the full node-mapping getState', () => {
    const container = document.createElement('div');
    let stateCalls = 0;
    let vpStateCalls = 0;
    const mm = createMiniMap(container, {
      getState: () => {
        stateCalls++;
        return fullState();
      },
      getViewportState: () => {
        vpStateCalls++;
        return viewportState();
      },
      setViewport: () => {},
      config: {},
    });

    mm.render(); // render legitimately maps nodes via getState
    const before = stateCalls;

    mm.updateViewport();
    mm.updateViewport();

    expect(stateCalls).toBe(before); // no full node remap per viewport change
    expect(vpStateCalls).toBeGreaterThanOrEqual(2); // lean getter used instead
  });

  it('falls back to getState when no getViewportState is provided', () => {
    const container = document.createElement('div');
    let stateCalls = 0;
    const mm = createMiniMap(container, {
      getState: () => {
        stateCalls++;
        return fullState();
      },
      setViewport: () => {},
      config: {},
    });

    mm.render();
    const before = stateCalls;

    mm.updateViewport();

    expect(stateCalls).toBe(before + 1); // fallback path preserves old behaviour
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// The rects survive a render.
//
// `render()` used to empty `nodesGroup` and build a new <rect> per node. That is a
// structural change inside an SVG, and Blink invalidates the layout of the whole
// SVG root for one — so a drag, which renders once per pointer move, spent ~120ms
// a frame resolving layout it had just thrown away. These hold the tree stable
// across renders, which is the property that fixes it.
// ─────────────────────────────────────────────────────────────────────────────
function movableState(nodes: FlowNode[]) {
  return {
    nodes,
    viewport: { x: 0, y: 0, zoom: 1 },
    containerWidth: 800,
    containerHeight: 600,
  } as MiniMapState;
}

function nodeAt(id: string, x: number, y: number, hidden = false): FlowNode {
  return {
    id,
    position: { x, y },
    dimensions: { width: 100, height: 40 },
    hidden,
    data: {},
  } as unknown as FlowNode;
}

function rectsIn(container: HTMLElement): SVGRectElement[] {
  return Array.from(container.querySelectorAll('.flow-minimap-nodes rect'));
}

describe('minimap keeps its rects', () => {
  it('draws the same elements again rather than new ones', () => {
    const container = document.createElement('div');
    const nodes = [nodeAt('a', 0, 0), nodeAt('b', 300, 200)];
    const mm = createMiniMap(container, {
      getState: () => movableState(nodes),
      setViewport: () => {},
      config: {},
    });

    mm.render();
    const first = rectsIn(container);

    mm.render();
    mm.render();

    // Identity, element by element. A rebuild passes a length check and it passes a
    // deep-equality check too — two <rect> built from the same numbers compare equal.
    // Only `toBe` can tell "the same rect again" from "another rect just like it".
    const again = rectsIn(container);
    expect(again).toHaveLength(first.length);
    first.forEach((rect, i) => expect(again[i]).toBe(rect));
  });

  it('moves the rect it already drew when a node moves', () => {
    const container = document.createElement('div');
    const nodes = [nodeAt('a', 0, 0), nodeAt('b', 300, 200)];
    const mm = createMiniMap(container, {
      getState: () => movableState(nodes),
      setViewport: () => {},
      config: {},
    });

    mm.render();
    const [first] = rectsIn(container);
    const before = first.getAttribute('x');

    nodes[0] = nodeAt('a', 260, 0);
    mm.render();

    expect(rectsIn(container)[0]).toBe(first);
    expect(first.getAttribute('x')).not.toBe(before);
  });

  it('gives back the rects it stops needing', () => {
    const container = document.createElement('div');
    const nodes = [nodeAt('a', 0, 0), nodeAt('b', 300, 200), nodeAt('c', 600, 400)];
    const mm = createMiniMap(container, {
      getState: () => movableState(nodes),
      setViewport: () => {},
      config: {},
    });

    mm.render();
    expect(rectsIn(container)).toHaveLength(3);

    nodes.pop();
    mm.render();
    expect(rectsIn(container)).toHaveLength(2);

    nodes[1] = nodeAt('b', 300, 200, true);
    mm.render();
    expect(rectsIn(container)).toHaveLength(1);
  });

  it('does not leave one node wearing the colour of another', () => {
    // The pool hands a rect that drew node `a` to whatever is at that index next.
    // An inline fill left behind would be a node painted as its neighbour.
    const container = document.createElement('div');
    const nodes = [nodeAt('a', 0, 0), nodeAt('b', 300, 200)];
    let colour: ((node: FlowNode) => string | undefined) | undefined = (node) =>
      node.id === 'a' ? 'rebeccapurple' : undefined;

    const mm = createMiniMap(container, {
      getState: () => movableState(nodes),
      setViewport: () => {},
      config: { minimapNodeColor: (node: FlowNode) => colour?.(node) } as never,
    });

    mm.render();
    expect(rectsIn(container)[0].style.fill).toBe('rebeccapurple');
    expect(rectsIn(container)[1].style.fill).toBe('');

    colour = () => undefined;
    mm.render();

    expect(rectsIn(container)[0].style.fill).toBe('');
  });

  it('draws again for a consumer that emptied the group behind its back', () => {
    // Rather than a minimap that has silently stopped moving.
    const container = document.createElement('div');
    const nodes = [nodeAt('a', 0, 0), nodeAt('b', 300, 200)];
    const mm = createMiniMap(container, {
      getState: () => movableState(nodes),
      setViewport: () => {},
      config: {},
    });

    mm.render();
    container.querySelector('.flow-minimap-nodes')!.innerHTML = '';
    expect(rectsIn(container)).toHaveLength(0);

    mm.render();
    expect(rectsIn(container)).toHaveLength(2);
  });
});
