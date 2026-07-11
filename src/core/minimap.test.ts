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
