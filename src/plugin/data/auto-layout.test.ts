import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { FlowNode, FlowEdge, AutoLayoutConfig } from '../../core/types';

/**
 * Minimal canvas mock that mirrors the auto-layout-relevant parts of flowCanvas.
 * Layout methods are spied so tests verify scheduling without real dagre/d3/elk deps.
 */
function makeCanvas(opts?: {
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  autoLayout?: AutoLayoutConfig;
}) {
  const _nodes: FlowNode[] = opts?.nodes ?? [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'b', position: { x: 100, y: 0 }, data: { label: 'B' } },
    { id: 'c', position: { x: 200, y: 0 }, data: { label: 'C' } },
  ];
  const _edges: FlowEdge[] = opts?.edges ?? [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'b', target: 'c' },
  ];
  const emitted: { event: string; detail: any }[] = [];
  const selectedNodes = new Set<string>();
  const selectedEdges = new Set<string>();

  const canvas = {
    nodes: _nodes as FlowNode[],
    edges: _edges as FlowEdge[],
    selectedNodes,
    selectedEdges,
    _config: {
      autoLayout: opts?.autoLayout,
    } as any,
    _autoLayoutTimer: null as ReturnType<typeof setTimeout> | null,
    _autoLayoutReady: !!opts?.autoLayout,
    _autoLayoutFailed: false,

    // Spied layout methods
    layout: vi.fn().mockResolvedValue(undefined),
    forceLayout: vi.fn().mockResolvedValue(undefined),
    treeLayout: vi.fn().mockResolvedValue(undefined),
    elkLayout: vi.fn().mockResolvedValue(undefined),

    getNode(id: string) { return (canvas.nodes as FlowNode[]).find(n => n.id === id); },
    _emit(event: string, detail?: any) { emitted.push({ event, detail }); },
    _captureHistory() {},
    _rebuildNodeMap() {},
    _rebuildEdgeMap() {},
    _recomputeChildValidation() {},

    _scheduleAutoLayout() {
      const alc = this._config.autoLayout;
      if (!alc || !this._autoLayoutReady || this._autoLayoutFailed) return;

      if (this._autoLayoutTimer) clearTimeout(this._autoLayoutTimer);

      this._autoLayoutTimer = setTimeout(() => {
        this._autoLayoutTimer = null;
        this._runAutoLayout();
      }, alc.debounce ?? 50);
    },

    async _runAutoLayout() {
      const alc = this._config.autoLayout;
      if (!alc) return;

      const baseOpts = {
        fitView: alc.fitView !== false,
        duration: alc.duration ?? 300,
      };

      try {
        switch (alc.algorithm) {
          case 'dagre':
            await this.layout({
              direction: alc.direction,
              nodesep: alc.nodesep,
              ranksep: alc.ranksep,
              adjustHandles: alc.adjustHandles,
              ...baseOpts,
            });
            break;
          case 'force':
            await this.forceLayout({
              strength: alc.strength,
              distance: alc.distance,
              charge: alc.charge,
              iterations: alc.iterations,
              ...baseOpts,
            });
            break;
          case 'hierarchy':
            await this.treeLayout({
              layoutType: alc.layoutType as any,
              nodeWidth: alc.nodeWidth,
              nodeHeight: alc.nodeHeight,
              adjustHandles: alc.adjustHandles,
              ...baseOpts,
            });
            break;
          case 'elk':
            await this.elkLayout({
              algorithm: alc.elkAlgorithm,
              nodeSpacing: alc.nodeSpacing,
              layerSpacing: alc.layerSpacing,
              adjustHandles: alc.adjustHandles,
              ...baseOpts,
            });
            break;
        }
      } catch (err: any) {
        if (!this._autoLayoutFailed) {
          this._autoLayoutFailed = true;
        }
      }
    },

    addNodes(newNodes: FlowNode | FlowNode[]) {
      const arr = Array.isArray(newNodes) ? newNodes : [newNodes];
      canvas.nodes.push(...arr);
      canvas._emit('nodes-change', { type: 'add', nodes: arr });
      canvas._scheduleAutoLayout();
    },

    removeNodes(ids: string | string[]) {
      const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
      const removed = (canvas.nodes as FlowNode[]).filter(n => idSet.has(n.id));
      canvas.edges = (canvas.edges as FlowEdge[]).filter(
        e => !idSet.has(e.source) && !idSet.has(e.target),
      );
      canvas.nodes = (canvas.nodes as FlowNode[]).filter(n => !idSet.has(n.id));
      for (const id of idSet) selectedNodes.delete(id);
      if (removed.length) canvas._emit('nodes-change', { type: 'remove', nodes: removed });
      canvas._scheduleAutoLayout();
    },

    addEdges(newEdges: FlowEdge | FlowEdge[]) {
      const arr = Array.isArray(newEdges) ? newEdges : [newEdges];
      canvas.edges.push(...arr);
      canvas._emit('edges-change', { type: 'add', edges: arr });
      canvas._scheduleAutoLayout();
    },

    removeEdges(ids: string | string[]) {
      const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
      const removed = (canvas.edges as FlowEdge[]).filter(e => idSet.has(e.id));
      canvas.edges = (canvas.edges as FlowEdge[]).filter(e => !idSet.has(e.id));
      for (const id of idSet) selectedEdges.delete(id);
      if (removed.length) canvas._emit('edges-change', { type: 'remove', edges: removed });
      canvas._scheduleAutoLayout();
    },

    fromObject(obj: { nodes?: FlowNode[]; edges?: FlowEdge[] }) {
      if (obj.nodes) canvas.nodes = [...obj.nodes];
      if (obj.edges) canvas.edges = [...obj.edges];
      canvas._emit('restore', obj);
      canvas._scheduleAutoLayout();
    },

    undo() {
      // Undo does NOT trigger _scheduleAutoLayout
      canvas._emit('undo', {});
    },

    redo() {
      // Redo does NOT trigger _scheduleAutoLayout
      canvas._emit('redo', {});
    },

    emitted,
  };

  return canvas;
}

describe('auto-layout on change', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('addNodes triggers layout after debounce', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });
    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: { label: 'D' } });

    // Not yet — debounce hasn't fired
    expect(c.layout).not.toHaveBeenCalled();

    // Advance past debounce (50ms default)
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledTimes(1);
    expect(c.layout).toHaveBeenCalledWith(expect.objectContaining({
      fitView: true,
      duration: 300,
    }));
  });

  it('removeNodes triggers layout', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });
    c.removeNodes('b');

    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledTimes(1);
  });

  it('addEdges triggers layout', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });
    c.addEdges({ id: 'e3', source: 'a', target: 'c' });

    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledTimes(1);
  });

  it('removeEdges triggers layout', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });
    c.removeEdges('e1');

    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledTimes(1);
  });

  it('fromObject triggers layout', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });
    c.fromObject({ nodes: [{ id: 'x', position: { x: 0, y: 0 }, data: {} }], edges: [] });

    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledTimes(1);
  });

  it('debounce batches rapid changes into single layout call', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre', debounce: 100 } });

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });
    c.addNodes({ id: 'e', position: { x: 0, y: 0 }, data: {} });
    c.addEdges({ id: 'e4', source: 'd', target: 'e' });

    vi.advanceTimersByTime(110);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledTimes(1);
  });

  it('no autoLayout config → no layout triggered', async () => {
    const c = makeCanvas(); // No autoLayout
    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });

    vi.advanceTimersByTime(200);
    await vi.runAllTimersAsync();

    expect(c.layout).not.toHaveBeenCalled();
    expect(c.forceLayout).not.toHaveBeenCalled();
    expect(c.treeLayout).not.toHaveBeenCalled();
    expect(c.elkLayout).not.toHaveBeenCalled();
  });

  it('patchConfig autoLayout: false disables auto-layout', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });

    // Disable via config patch
    c._config.autoLayout = undefined;
    c._autoLayoutReady = false;
    if (c._autoLayoutTimer) {
      clearTimeout(c._autoLayoutTimer);
      c._autoLayoutTimer = null;
    }

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });

    vi.advanceTimersByTime(200);
    await vi.runAllTimersAsync();

    expect(c.layout).not.toHaveBeenCalled();
  });

  it('does not trigger before _autoLayoutReady is set', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });
    c._autoLayoutReady = false; // Simulate init not yet complete

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });

    vi.advanceTimersByTime(200);
    await vi.runAllTimersAsync();

    expect(c.layout).not.toHaveBeenCalled();
  });

  it('undo/redo does NOT trigger auto-layout', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });

    c.undo();
    c.redo();

    vi.advanceTimersByTime(200);
    await vi.runAllTimersAsync();

    expect(c.layout).not.toHaveBeenCalled();
  });

  it('graceful skip + sets _autoLayoutFailed when dependency is missing', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });

    // Simulate layout throwing (missing dependency)
    c.layout.mockRejectedValueOnce(new Error('layout() requires @dagrejs/dagre'));

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c._autoLayoutFailed).toBe(true);

    // Subsequent adds should NOT call layout again
    c.addNodes({ id: 'e', position: { x: 0, y: 0 }, data: {} });
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledTimes(1);
  });

  it('uses force algorithm when configured', async () => {
    const c = makeCanvas({
      autoLayout: { algorithm: 'force', charge: -500, distance: 200 },
    });

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.forceLayout).toHaveBeenCalledTimes(1);
    expect(c.forceLayout).toHaveBeenCalledWith(expect.objectContaining({
      charge: -500,
      distance: 200,
    }));
    expect(c.layout).not.toHaveBeenCalled();
  });

  it('uses hierarchy algorithm when configured', async () => {
    const c = makeCanvas({
      autoLayout: { algorithm: 'hierarchy', layoutType: 'cluster' },
    });

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.treeLayout).toHaveBeenCalledTimes(1);
    expect(c.treeLayout).toHaveBeenCalledWith(expect.objectContaining({
      layoutType: 'cluster',
    }));
  });

  it('uses elk algorithm when configured', async () => {
    const c = makeCanvas({
      autoLayout: { algorithm: 'elk', elkAlgorithm: 'mrtree' },
    });

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.elkLayout).toHaveBeenCalledTimes(1);
    expect(c.elkLayout).toHaveBeenCalledWith(expect.objectContaining({
      algorithm: 'mrtree',
    }));
  });

  it('respects custom debounce and duration', async () => {
    const c = makeCanvas({
      autoLayout: { algorithm: 'dagre', debounce: 200, duration: 500 },
    });

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });

    // At 100ms — should not have fired yet (debounce is 200ms)
    vi.advanceTimersByTime(100);
    expect(c.layout).not.toHaveBeenCalled();

    // At 210ms — debounce should have fired
    vi.advanceTimersByTime(110);
    await vi.runAllTimersAsync();
    expect(c.layout).toHaveBeenCalledTimes(1);
    expect(c.layout).toHaveBeenCalledWith(expect.objectContaining({
      duration: 500,
    }));
  });

  it('fitView: false is passed through', async () => {
    const c = makeCanvas({
      autoLayout: { algorithm: 'dagre', fitView: false },
    });

    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledWith(expect.objectContaining({
      fitView: false,
    }));
  });

  it('reset _autoLayoutFailed allows retry after reconfig', async () => {
    const c = makeCanvas({ autoLayout: { algorithm: 'dagre' } });

    // First failure
    c.layout.mockRejectedValueOnce(new Error('missing dep'));
    c.addNodes({ id: 'd', position: { x: 0, y: 0 }, data: {} });
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();
    expect(c._autoLayoutFailed).toBe(true);

    // Simulate patchConfig re-enabling
    c._autoLayoutFailed = false;
    c._config.autoLayout = { algorithm: 'dagre' };
    c._autoLayoutReady = true;

    c.addNodes({ id: 'f', position: { x: 0, y: 0 }, data: {} });
    vi.advanceTimersByTime(60);
    await vi.runAllTimersAsync();

    expect(c.layout).toHaveBeenCalledTimes(2);
  });
});
