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

// ── The box it is drawn in ──────────────────────────────────────────────────

describe('minimap — the size it is given', () => {
  function mount(config: Record<string, unknown> = {}) {
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 300, configurable: true });
    document.body.appendChild(container);

    const minimap = createMiniMap(container, {
      getState: () => ({
        nodes: [{ id: 'a', position: { x: 0, y: 0 }, data: {}, dimensions: { width: 100, height: 50 } }] as any,
        viewport: { x: 0, y: 0, zoom: 1 },
        containerWidth: 800,
        containerHeight: 300,
      }),
      setViewport: () => {},
      config: config as any,
    });

    return { container, minimap, svg: container.querySelector('svg')! };
  }

  it('is two hundred by a hundred and fifty when nobody says otherwise', () => {
    const { svg } = mount();

    expect(svg.getAttribute('width')).toBe('200');
    expect(svg.getAttribute('height')).toBe('150');
  });

  it('takes the box it was configured with', () => {
    const { svg, container } = mount({ minimapWidth: 160, minimapHeight: 60 });

    expect(svg.getAttribute('width')).toBe('160');
    expect(svg.getAttribute('height')).toBe('60');
    expect(container.querySelector('.flow-minimap-bg')!.getAttribute('width')).toBe('160');
  });

  it('marks the viewport against the box, not against a remembered one', () => {
    // The reason the size is per instance: the scale that fits the graph in and the rectangle that
    // marks the viewport are both computed from it. A minimap that keeps its shape while the canvas
    // changes shape draws a marker that is not the shape of the viewport.
    const { minimap, container } = mount({ minimapWidth: 200, minimapHeight: 150 });
    minimap.render();

    const wide = container.querySelector('.flow-minimap-mask')!.getAttribute('d');

    minimap.resize(120, 90);

    const narrow = container.querySelector('.flow-minimap-mask')!.getAttribute('d');

    expect(wide).toContain('H200 V150');
    expect(narrow).toContain('H120 V90');
    expect(narrow).not.toBe(wide);
  });

  it('ignores a box that is not a box', () => {
    const { minimap, svg } = mount();

    minimap.resize(0, 100);
    minimap.resize(-5, -5);
    minimap.resize(NaN, 10);

    expect(svg.getAttribute('width')).toBe('200');
    expect(svg.getAttribute('height')).toBe('150');
  });

  it('says whether the box actually changed', () => {
    // The caller writes the size back into the config and announces it — both of which should
    // describe what was drawn, not what was asked for.
    const { minimap } = mount();

    expect(minimap.resize(160, 60)).toBe(true);
    expect(minimap.resize(160, 60)).toBe(false);  // already that shape
    expect(minimap.resize(0, 60)).toBe(false);    // not a box
    expect(minimap.resize(NaN, 60)).toBe(false);
  });
});
