// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockCtx } from './__test-utils';
import { createViewportMixin } from './canvas-viewport';
import type { FlowNode } from '../../core/types';
import { ZOOM_STEP_FACTOR } from '../../core/constants';

function makeNode(id: string, overrides: Partial<FlowNode> = {}): FlowNode {
  return {
    id,
    type: 'default',
    position: { x: 0, y: 0 },
    data: {},
    dimensions: { width: 100, height: 50 },
    ...overrides,
  } as FlowNode;
}

// ── screenToFlowPosition / flowToScreenPosition ──────────────────────────────

describe('createViewportMixin — coordinate transforms', () => {
  it('screenToFlowPosition converts screen coords to flow coords', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 10, top: 20, width: 800, height: 600 }),
    });
    const ctx = mockCtx({
      _container: container,
      viewport: { x: 50, y: 100, zoom: 2 },
    });
    const mixin = createViewportMixin(ctx);

    // screenToFlowPosition: (screenX - left - vpX) / zoom
    // (210 - 10 - 50) / 2 = 75, (320 - 20 - 100) / 2 = 100
    const result = mixin.screenToFlowPosition(210, 320);
    expect(result.x).toBe(75);
    expect(result.y).toBe(100);
  });

  it('flowToScreenPosition converts flow coords to screen coords', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 10, top: 20, width: 800, height: 600 }),
    });
    const ctx = mockCtx({
      _container: container,
      viewport: { x: 50, y: 100, zoom: 2 },
    });
    const mixin = createViewportMixin(ctx);

    // flowToScreenPosition: flowX * zoom + vpX + left
    // 75 * 2 + 50 + 10 = 210, 100 * 2 + 100 + 20 = 320
    const result = mixin.flowToScreenPosition(75, 100);
    expect(result.x).toBe(210);
    expect(result.y).toBe(320);
  });

  it('round-trips correctly', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 5, top: 15, width: 800, height: 600 }),
    });
    const ctx = mockCtx({
      _container: container,
      viewport: { x: 30, y: 40, zoom: 1.5 },
    });
    const mixin = createViewportMixin(ctx);

    const screen = mixin.flowToScreenPosition(100, 200);
    const flow = mixin.screenToFlowPosition(screen.x, screen.y);
    expect(flow.x).toBeCloseTo(100);
    expect(flow.y).toBeCloseTo(200);
  });
});

// ── fitView ──────────────────────────────────────────────────────────────────

describe('createViewportMixin — fitView', () => {
  it('defers when nodes lack dimensions (retries via rAF)', () => {
    const ctx = mockCtx({
      nodes: [makeNode('n1', { dimensions: undefined })],
    });
    const mixin = createViewportMixin(ctx);

    // Spy on requestAnimationFrame
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(() => 0);

    mixin.fitView();
    expect(rafSpy).toHaveBeenCalledTimes(1);

    rafSpy.mockRestore();
  });

  it('stops retrying after 10 attempts', () => {
    const ctx = mockCtx({
      nodes: [makeNode('n1', { dimensions: undefined })],
    });
    const mixin = createViewportMixin(ctx);
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(() => 0);

    mixin.fitView({}, 10);
    // Should NOT schedule another rAF at retry 10
    expect(rafSpy).not.toHaveBeenCalled();

    rafSpy.mockRestore();
  });

  it('calls fitBounds and announcer when nodes have dimensions', () => {
    const mockAnnouncer = { handleEvent: vi.fn() };
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800 });
    Object.defineProperty(container, 'clientHeight', { value: 600 });

    const ctx = mockCtx({
      _container: container,
      _panZoom: panZoom as any,
      _announcer: mockAnnouncer as any,
      _config: { nodeOrigin: [0, 0], minZoom: 0.5, maxZoom: 2 } as any,
      nodes: [
        makeNode('n1', { position: { x: 0, y: 0 } }),
        makeNode('n2', { position: { x: 200, y: 150 } }),
      ],
    });
    // Populate nodeMap for toAbsoluteNodes
    for (const n of ctx.nodes) ctx._nodeMap.set(n.id, n);

    const mixin = createViewportMixin(ctx);
    mixin.fitView();

    // fitBounds should have triggered _panZoom.setViewport
    expect(panZoom.setViewport).toHaveBeenCalled();
    expect(mockAnnouncer.handleEvent).toHaveBeenCalledWith('fit-view', {});
  });

  it('skips hidden nodes', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800 });
    Object.defineProperty(container, 'clientHeight', { value: 600 });

    const ctx = mockCtx({
      _container: container,
      _panZoom: panZoom as any,
      _config: { nodeOrigin: [0, 0], minZoom: 0.5, maxZoom: 2 } as any,
      nodes: [
        makeNode('n1', { position: { x: 0, y: 0 } }),
        makeNode('n2', { position: { x: 500, y: 500 }, hidden: true }),
      ],
    });
    for (const n of ctx.nodes) ctx._nodeMap.set(n.id, n);

    const mixin = createViewportMixin(ctx);
    mixin.fitView();

    // Only n1 should be considered
    expect(panZoom.setViewport).toHaveBeenCalled();
  });
});

// ── fitBounds ────────────────────────────────────────────────────────────────

describe('createViewportMixin — fitBounds', () => {
  it('sets viewport directly when no duration', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800 });
    Object.defineProperty(container, 'clientHeight', { value: 600 });

    const ctx = mockCtx({
      _container: container,
      _panZoom: panZoom as any,
      _config: { minZoom: 0.5, maxZoom: 2 } as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.fitBounds({ x: 0, y: 0, width: 400, height: 300 });

    expect(panZoom.setViewport).toHaveBeenCalledTimes(1);
    const vp = panZoom.setViewport.mock.calls[0][0];
    expect(vp).toHaveProperty('x');
    expect(vp).toHaveProperty('y');
    expect(vp).toHaveProperty('zoom');
  });

  it('calls animate when duration > 0', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800 });
    Object.defineProperty(container, 'clientHeight', { value: 600 });

    const animateMock = vi.fn(() => ({
      pause: vi.fn(),
      resume: vi.fn(),
      stop: vi.fn(),
      reverse: vi.fn(),
      finished: Promise.resolve(),
    }));

    const ctx = mockCtx({
      _container: container,
      _config: { minZoom: 0.5, maxZoom: 2 } as any,
      animate: animateMock as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.fitBounds({ x: 0, y: 0, width: 400, height: 300 }, { duration: 500 });

    expect(animateMock).toHaveBeenCalledTimes(1);
    const [targets, options] = animateMock.mock.calls[0];
    expect(targets).toHaveProperty('viewport');
    expect(options).toEqual({ duration: 500 });
  });

  it('uses default container dimensions when no container', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _container: null,
      _panZoom: panZoom as any,
      _config: { minZoom: 0.5, maxZoom: 2 } as any,
    });
    const mixin = createViewportMixin(ctx);

    // Should not throw; uses fallback 800x600
    mixin.fitBounds({ x: 0, y: 0, width: 200, height: 200 });
    expect(panZoom.setViewport).toHaveBeenCalled();
  });
});

// ── getNodesBounds ───────────────────────────────────────────────────────────

describe('createViewportMixin — getNodesBounds', () => {
  it('returns bounds for specific node IDs', () => {
    const n1 = makeNode('n1', { position: { x: 10, y: 20 } });
    const n2 = makeNode('n2', { position: { x: 110, y: 120 } });
    const ctx = mockCtx({
      nodes: [n1, n2],
      _config: { nodeOrigin: [0, 0] } as any,
    });
    ctx._nodeMap.set('n1', n1);
    ctx._nodeMap.set('n2', n2);
    ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));

    const mixin = createViewportMixin(ctx);
    const bounds = mixin.getNodesBounds(['n1']);

    // Only n1: x=10, y=20, width=100, height=50
    expect(bounds.x).toBe(10);
    expect(bounds.y).toBe(20);
    expect(bounds.width).toBe(100);
    expect(bounds.height).toBe(50);
  });

  it('returns bounds for all visible nodes when no IDs given', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const n2 = makeNode('n2', { position: { x: 200, y: 100 } });
    const n3 = makeNode('n3', { position: { x: 50, y: 50 }, hidden: true });
    const ctx = mockCtx({
      nodes: [n1, n2, n3],
      _config: { nodeOrigin: [0, 0] } as any,
    });
    ctx._nodeMap.set('n1', n1);
    ctx._nodeMap.set('n2', n2);
    ctx._nodeMap.set('n3', n3);

    const mixin = createViewportMixin(ctx);
    const bounds = mixin.getNodesBounds();

    // n1 and n2 only (n3 is hidden)
    // min x=0, min y=0, max right=200+100=300, max bottom=100+50=150
    expect(bounds.x).toBe(0);
    expect(bounds.y).toBe(0);
    expect(bounds.width).toBe(300);
    expect(bounds.height).toBe(150);
  });

  it('filters out nonexistent IDs', () => {
    const n1 = makeNode('n1', { position: { x: 0, y: 0 } });
    const ctx = mockCtx({
      nodes: [n1],
      _config: { nodeOrigin: [0, 0] } as any,
    });
    ctx._nodeMap.set('n1', n1);
    ctx.getNode = vi.fn((id: string) => ctx._nodeMap.get(id));

    const mixin = createViewportMixin(ctx);
    const bounds = mixin.getNodesBounds(['n1', 'nonexistent']);

    expect(bounds.x).toBe(0);
    expect(bounds.y).toBe(0);
  });
});

// ── getViewportForBounds ─────────────────────────────────────────────────────

describe('createViewportMixin — getViewportForBounds', () => {
  it('returns default viewport when no container', () => {
    const ctx = mockCtx({
      _container: null,
      _config: { minZoom: 0.5, maxZoom: 2 } as any,
    });
    const mixin = createViewportMixin(ctx);

    const vp = mixin.getViewportForBounds({ x: 0, y: 0, width: 100, height: 100 });
    expect(vp).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('computes a valid viewport when container is available', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800 });
    Object.defineProperty(container, 'clientHeight', { value: 600 });

    const ctx = mockCtx({
      _container: container,
      _config: { minZoom: 0.5, maxZoom: 2 } as any,
    });
    const mixin = createViewportMixin(ctx);

    const vp = mixin.getViewportForBounds({ x: 0, y: 0, width: 400, height: 300 });
    expect(vp).toHaveProperty('x');
    expect(vp).toHaveProperty('y');
    expect(vp).toHaveProperty('zoom');
    expect(vp.zoom).toBeGreaterThanOrEqual(0.5);
    expect(vp.zoom).toBeLessThanOrEqual(2);
  });
});

// ── setViewport ──────────────────────────────────────────────────────────────

describe('createViewportMixin — setViewport', () => {
  it('delegates to _panZoom.setViewport', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({ _panZoom: panZoom as any });
    const mixin = createViewportMixin(ctx);

    mixin.setViewport({ x: 10, y: 20, zoom: 1.5 });

    expect(panZoom.setViewport).toHaveBeenCalledWith(
      { x: 10, y: 20, zoom: 1.5 },
      undefined,
    );
  });

  it('passes options through to _panZoom', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({ _panZoom: panZoom as any });
    const mixin = createViewportMixin(ctx);

    mixin.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 });

    expect(panZoom.setViewport).toHaveBeenCalledWith(
      { x: 0, y: 0, zoom: 1 },
      { duration: 300 },
    );
  });

  it('does nothing when _panZoom is null', () => {
    const ctx = mockCtx({ _panZoom: null });
    const mixin = createViewportMixin(ctx);

    // Should not throw
    expect(() => mixin.setViewport({ x: 0, y: 0, zoom: 1 })).not.toThrow();
  });
});

// ── zoomIn / zoomOut ─────────────────────────────────────────────────────────

describe('createViewportMixin — zoomIn / zoomOut', () => {
  it('zoomIn multiplies zoom by ZOOM_STEP_FACTOR', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 1 },
      _config: { maxZoom: 5 } as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.zoomIn();

    const call = panZoom.setViewport.mock.calls[0][0];
    expect(call.zoom).toBeCloseTo(1 * ZOOM_STEP_FACTOR);
  });

  it('zoomIn clamps to maxZoom', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 1.9 },
      _config: { maxZoom: 2 } as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.zoomIn();

    const call = panZoom.setViewport.mock.calls[0][0];
    expect(call.zoom).toBe(2);
  });

  it('zoomOut divides zoom by ZOOM_STEP_FACTOR', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 1 },
      _config: { minZoom: 0.1 } as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.zoomOut();

    const call = panZoom.setViewport.mock.calls[0][0];
    expect(call.zoom).toBeCloseTo(1 / ZOOM_STEP_FACTOR);
  });

  it('zoomOut clamps to minZoom', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 0.55 },
      _config: { minZoom: 0.5 } as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.zoomOut();

    const call = panZoom.setViewport.mock.calls[0][0];
    expect(call.zoom).toBe(0.5);
  });

  it('uses default maxZoom 2 when not configured', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 1.9 },
      _config: {} as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.zoomIn();

    const call = panZoom.setViewport.mock.calls[0][0];
    expect(call.zoom).toBe(2); // clamped to default maxZoom
  });

  it('uses default minZoom 0.5 when not configured', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 0.55 },
      _config: {} as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.zoomOut();

    const call = panZoom.setViewport.mock.calls[0][0];
    expect(call.zoom).toBe(0.5); // clamped to default minZoom
  });
});

// ── setCenter ────────────────────────────────────────────────────────────────

describe('createViewportMixin — setCenter', () => {
  it('computes viewport to center on given coordinates', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800 });
    Object.defineProperty(container, 'clientHeight', { value: 600 });

    const ctx = mockCtx({
      _container: container,
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 1 },
    });
    const mixin = createViewportMixin(ctx);

    mixin.setCenter(100, 200);

    const call = panZoom.setViewport.mock.calls[0][0];
    // vpX = 800/2 - 100*1 = 300, vpY = 600/2 - 200*1 = 100
    expect(call.x).toBe(300);
    expect(call.y).toBe(100);
    expect(call.zoom).toBe(1);
  });

  it('uses provided zoom level', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800 });
    Object.defineProperty(container, 'clientHeight', { value: 600 });

    const ctx = mockCtx({
      _container: container,
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 1 },
    });
    const mixin = createViewportMixin(ctx);

    mixin.setCenter(100, 200, 2);

    const call = panZoom.setViewport.mock.calls[0][0];
    // vpX = 800/2 - 100*2 = 200, vpY = 600/2 - 200*2 = -100
    expect(call.x).toBe(200);
    expect(call.y).toBe(-100);
    expect(call.zoom).toBe(2);
  });

  it('does nothing when container is null', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _container: null,
      _panZoom: panZoom as any,
    });
    const mixin = createViewportMixin(ctx);

    mixin.setCenter(100, 200);
    expect(panZoom.setViewport).not.toHaveBeenCalled();
  });
});

// ── panBy ────────────────────────────────────────────────────────────────────

describe('createViewportMixin — panBy', () => {
  it('adds delta to current viewport position', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      viewport: { x: 100, y: 200, zoom: 1.5 },
    });
    const mixin = createViewportMixin(ctx);

    mixin.panBy(50, -30);

    const call = panZoom.setViewport.mock.calls[0][0];
    expect(call.x).toBe(150);
    expect(call.y).toBe(170);
    expect(call.zoom).toBe(1.5);
  });

  it('passes options through', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      viewport: { x: 0, y: 0, zoom: 1 },
    });
    const mixin = createViewportMixin(ctx);

    mixin.panBy(10, 20, { duration: 200 });

    expect(panZoom.setViewport.mock.calls[0][1]).toEqual({ duration: 200 });
  });
});

// ── toggleInteractive ────────────────────────────────────────────────────────

describe('createViewportMixin — toggleInteractive', () => {
  it('toggles isInteractive and updates _panZoom', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      isInteractive: true,
    });
    const mixin = createViewportMixin(ctx);

    mixin.toggleInteractive();

    expect(ctx.isInteractive).toBe(false);
    expect(panZoom.update).toHaveBeenCalledWith({
      pannable: false,
      zoomable: false,
    });
  });

  it('toggles back to interactive', () => {
    const panZoom = { setViewport: vi.fn(), update: vi.fn() };
    const ctx = mockCtx({
      _panZoom: panZoom as any,
      isInteractive: false,
    });
    const mixin = createViewportMixin(ctx);

    mixin.toggleInteractive();

    expect(ctx.isInteractive).toBe(true);
    expect(panZoom.update).toHaveBeenCalledWith({
      pannable: true,
      zoomable: true,
    });
  });
});

// ── colorMode ────────────────────────────────────────────────────────────────

describe('createViewportMixin — colorMode', () => {
  it('returns undefined when no color mode handle', () => {
    const ctx = mockCtx({ _colorModeHandle: null });
    const mixin = createViewportMixin(ctx);
    expect(mixin.colorMode).toBeUndefined();
  });

  it('returns resolved color mode from handle', () => {
    const ctx = mockCtx({
      _colorModeHandle: { resolved: 'dark' } as any,
    });
    const mixin = createViewportMixin(ctx);
    expect(mixin.colorMode).toBe('dark');
  });
});

// ── getContainerDimensions ───────────────────────────────────────────────────

describe('createViewportMixin — getContainerDimensions', () => {
  it('returns container dimensions', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 1024 });
    Object.defineProperty(container, 'clientHeight', { value: 768 });

    const ctx = mockCtx({ _container: container });
    const mixin = createViewportMixin(ctx);

    expect(mixin.getContainerDimensions()).toEqual({ width: 1024, height: 768 });
  });

  it('returns zero dimensions when no container', () => {
    const ctx = mockCtx({ _container: null });
    const mixin = createViewportMixin(ctx);

    expect(mixin.getContainerDimensions()).toEqual({ width: 0, height: 0 });
  });
});

// ── resetPanels ──────────────────────────────────────────────────────────────

describe('createViewportMixin — resetPanels', () => {
  it('dispatches flow-panel-reset event and emits panel-reset', () => {
    const container = document.createElement('div');
    const dispatchSpy = vi.spyOn(container, 'dispatchEvent');

    const ctx = mockCtx({ _container: container });
    const mixin = createViewportMixin(ctx);

    mixin.resetPanels();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('flow-panel-reset');
    expect(ctx._emit).toHaveBeenCalledWith('panel-reset');
  });

  it('handles null container gracefully', () => {
    const ctx = mockCtx({ _container: null });
    const mixin = createViewportMixin(ctx);

    expect(() => mixin.resetPanels()).not.toThrow();
    expect(ctx._emit).toHaveBeenCalledWith('panel-reset');
  });
});
