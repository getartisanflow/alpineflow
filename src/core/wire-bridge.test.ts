// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { WIRE_PAYLOAD_MAP, WIRE_COMMAND_MAP, registerWireCommands, registerWireEvents, registerCustomWireCommands } from './wire-bridge';

// ── WIRE_PAYLOAD_MAP ──────────────────────────────────────────────────

describe('WIRE_PAYLOAD_MAP', () => {
  it('extracts connect args from connection-style detail', () => {
    const detail = { connection: { source: 'a', target: 'b', sourceHandle: 'h1', targetHandle: 'h2' } };
    expect(WIRE_PAYLOAD_MAP['connect'](detail)).toEqual(['a', 'b', 'h1', 'h2']);
  });

  it('extracts connect args from flat detail (flow-node emit style)', () => {
    const detail = { source: 'a', target: 'b', sourceHandle: null, targetHandle: null };
    expect(WIRE_PAYLOAD_MAP['connect'](detail)).toEqual(['a', 'b', null, null]);
  });

  it('extracts node-click args', () => {
    const detail = { node: { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Test' } }, event: {} };
    expect(WIRE_PAYLOAD_MAP['node-click'](detail)).toEqual(['n1', detail.node]);
  });

  it('extracts node-drag-end args', () => {
    const detail = { node: { id: 'n1', position: { x: 10, y: 20 }, data: {} }, position: { x: 10, y: 20 } };
    expect(WIRE_PAYLOAD_MAP['node-drag-end'](detail)).toEqual(['n1', { x: 10, y: 20 }]);
  });

  it('extracts edge-click args', () => {
    const detail = { edge: { id: 'e1' }, event: {} };
    expect(WIRE_PAYLOAD_MAP['edge-click'](detail)).toEqual(['e1']);
  });

  it('extracts reconnect args', () => {
    const detail = { oldEdge: { id: 'e1' }, newConnection: { source: 'a', target: 'b' } };
    expect(WIRE_PAYLOAD_MAP['reconnect'](detail)).toEqual(['e1', { source: 'a', target: 'b' }]);
  });

  it('extracts pane-click args', () => {
    const detail = { position: { x: 100, y: 200 }, event: {} };
    expect(WIRE_PAYLOAD_MAP['pane-click'](detail)).toEqual([{ x: 100, y: 200 }]);
  });

  it('extracts viewport-change args', () => {
    const detail = { viewport: { x: 0, y: 0, zoom: 1 } };
    expect(WIRE_PAYLOAD_MAP['viewport-change'](detail)).toEqual([{ x: 0, y: 0, zoom: 1 }]);
  });

  it('extracts selection-change args', () => {
    const detail = { nodes: [{ id: 'n1' }], edges: [{ id: 'e1' }], rows: [] };
    expect(WIRE_PAYLOAD_MAP['selection-change'](detail)).toEqual([[{ id: 'n1' }], [{ id: 'e1' }]]);
  });

  it('extracts init args (empty)', () => {
    expect(WIRE_PAYLOAD_MAP['init']({})).toEqual([]);
  });

  it('extracts node-resize-end args', () => {
    const detail = { node: { id: 'n1' }, dimensions: { width: 200, height: 100 } };
    expect(WIRE_PAYLOAD_MAP['node-resize-end'](detail)).toEqual(['n1', { width: 200, height: 100 }]);
  });

  it('extracts node-reparent args', () => {
    const detail = { node: { id: 'n1' }, oldParentId: 'p1', newParentId: 'p2' };
    expect(WIRE_PAYLOAD_MAP['node-reparent'](detail)).toEqual(['n1', 'p1', 'p2']);
  });

  it('extracts context-menu args with screen position', () => {
    const detail = { node: { id: 'n1' }, event: { clientX: 100, clientY: 200 } };
    expect(WIRE_PAYLOAD_MAP['node-context-menu'](detail)).toEqual(['n1', { x: 100, y: 200 }]);
  });

  it('extracts connect-start args', () => {
    const detail = { source: 'n1', sourceHandle: 'h1' };
    expect(WIRE_PAYLOAD_MAP['connect-start'](detail)).toEqual(['n1', 'h1']);
  });

  it('extracts reconnect-end args', () => {
    const detail = { edge: { id: 'e1' }, successful: true };
    expect(WIRE_PAYLOAD_MAP['reconnect-end'](detail)).toEqual(['e1', true]);
  });

  it('extracts node-drag-start args', () => {
    const detail = { node: { id: 'n1' } };
    expect(WIRE_PAYLOAD_MAP['node-drag-start'](detail)).toEqual(['n1']);
  });

  it('extracts node-resize-start args', () => {
    const detail = { node: { id: 'n1' }, dimensions: { width: 100, height: 50 } };
    expect(WIRE_PAYLOAD_MAP['node-resize-start'](detail)).toEqual(['n1', { width: 100, height: 50 }]);
  });

  it('extracts node-collapse args', () => {
    const detail = { node: { id: 'n1' }, descendants: [{ id: 'n2' }] };
    expect(WIRE_PAYLOAD_MAP['node-collapse'](detail)).toEqual(['n1', [{ id: 'n2' }]]);
  });

  it('extracts node-expand args', () => {
    const detail = { node: { id: 'n1' }, descendants: [{ id: 'n2' }] };
    expect(WIRE_PAYLOAD_MAP['node-expand'](detail)).toEqual(['n1', [{ id: 'n2' }]]);
  });

  it('extracts nodes-change args', () => {
    const detail = { type: 'add', nodes: [{ id: 'n1' }] };
    expect(WIRE_PAYLOAD_MAP['nodes-change'](detail)).toEqual([detail]);
  });

  it('extracts edges-change args', () => {
    const detail = { type: 'remove', edges: [{ id: 'e1' }] };
    expect(WIRE_PAYLOAD_MAP['edges-change'](detail)).toEqual([detail]);
  });

  it('extracts reconnect-start args', () => {
    const detail = { edge: { id: 'e1' }, handleType: 'source' };
    expect(WIRE_PAYLOAD_MAP['reconnect-start'](detail)).toEqual(['e1', 'source']);
  });

  it('extracts edge-context-menu args', () => {
    const detail = { edge: { id: 'e1' }, event: { clientX: 50, clientY: 75 } };
    expect(WIRE_PAYLOAD_MAP['edge-context-menu'](detail)).toEqual(['e1', { x: 50, y: 75 }]);
  });

  it('extracts pane-context-menu args', () => {
    const detail = { position: { x: 300, y: 400 }, event: {} };
    expect(WIRE_PAYLOAD_MAP['pane-context-menu'](detail)).toEqual([{ x: 300, y: 400 }]);
  });

  it('extracts selection-context-menu args', () => {
    const detail = { nodes: [{ id: 'n1' }], edges: [], event: { clientX: 10, clientY: 20 } };
    expect(WIRE_PAYLOAD_MAP['selection-context-menu'](detail)).toEqual([[{ id: 'n1' }], [], { x: 10, y: 20 }]);
  });

  it('extracts drop args', () => {
    const detail = { data: 'endpoint', position: { x: 150, y: 250 } };
    expect(WIRE_PAYLOAD_MAP['drop'](detail)).toEqual(['endpoint', { x: 150, y: 250 }]);
  });

  it('extracts connect-end args', () => {
    const detail = { connection: { source: 'a', target: 'b' }, source: 'a', sourceHandle: 'h1', position: { x: 0, y: 0 } };
    expect(WIRE_PAYLOAD_MAP['connect-end'](detail)).toEqual([{ source: 'a', target: 'b' }, 'a', 'h1', { x: 0, y: 0 }]);
  });
});

// ── WIRE_COMMAND_MAP ──────────────────────────────────────────────────

describe('WIRE_COMMAND_MAP', () => {
  it('maps all flow: dispatches to canvas method names', () => {
    expect(WIRE_COMMAND_MAP['flow:addNodes']).toBe('addNodes');
    expect(WIRE_COMMAND_MAP['flow:removeNodes']).toBe('removeNodes');
    expect(WIRE_COMMAND_MAP['flow:addEdges']).toBe('addEdges');
    expect(WIRE_COMMAND_MAP['flow:removeEdges']).toBe('removeEdges');
    expect(WIRE_COMMAND_MAP['flow:animate']).toBe('animate');
    expect(WIRE_COMMAND_MAP['flow:sendParticle']).toBe('sendParticle');
    expect(WIRE_COMMAND_MAP['flow:fitView']).toBe('fitView');
    expect(WIRE_COMMAND_MAP['flow:zoomIn']).toBe('zoomIn');
    expect(WIRE_COMMAND_MAP['flow:zoomOut']).toBe('zoomOut');
    expect(WIRE_COMMAND_MAP['flow:setCenter']).toBe('setCenter');
    expect(WIRE_COMMAND_MAP['flow:setViewport']).toBe('setViewport');
    expect(WIRE_COMMAND_MAP['flow:follow']).toBe('follow');
    expect(WIRE_COMMAND_MAP['flow:unfollow']).toBe('unfollow');
    expect(WIRE_COMMAND_MAP['flow:undo']).toBe('undo');
    expect(WIRE_COMMAND_MAP['flow:redo']).toBe('redo');
    expect(WIRE_COMMAND_MAP['flow:layout']).toBe('layout');
    expect(WIRE_COMMAND_MAP['flow:fromObject']).toBe('fromObject');
    expect(WIRE_COMMAND_MAP['flow:setLoading']).toBe('setLoading');
    expect(WIRE_COMMAND_MAP['flow:clear']).toBe('$clear');
    expect(WIRE_COMMAND_MAP['flow:toggleInteractive']).toBe('toggleInteractive');
    expect(WIRE_COMMAND_MAP['flow:panBy']).toBe('panBy');
    expect(WIRE_COMMAND_MAP['flow:fitBounds']).toBe('fitBounds');
    expect(WIRE_COMMAND_MAP['flow:patchConfig']).toBe('patchConfig');
    expect(WIRE_COMMAND_MAP['flow:deselectAll']).toBe('deselectAll');
    expect(WIRE_COMMAND_MAP['flow:collapseNode']).toBe('collapseNode');
    expect(WIRE_COMMAND_MAP['flow:expandNode']).toBe('expandNode');
  });
});

// ── registerWireCommands ──────────────────────────────────────────────

describe('registerWireCommands', () => {
  it('registers $wire.on listeners for all commands', () => {
    const listeners: Record<string, Function> = {};
    const mockWire = { on: (event: string, cb: Function) => { listeners[event] = cb; } };
    const mockCanvas = { addNodes: vi.fn(), fitView: vi.fn(), setCenter: vi.fn() };

    registerWireCommands(mockCanvas as any, mockWire);

    expect(listeners['flow:addNodes']).toBeDefined();
    expect(listeners['flow:fitView']).toBeDefined();
    expect(listeners['flow:setCenter']).toBeDefined();
  });

  it('routes dispatches to canvas methods with correct args', () => {
    const listeners: Record<string, Function> = {};
    const mockWire = { on: (event: string, cb: Function) => { listeners[event] = cb; } };
    const mockCanvas = {
      addNodes: vi.fn(), removeNodes: vi.fn(), addEdges: vi.fn(), removeEdges: vi.fn(),
      animate: vi.fn(), sendParticle: vi.fn(), fitView: vi.fn(), zoomIn: vi.fn(),
      zoomOut: vi.fn(), setCenter: vi.fn(), setViewport: vi.fn(), follow: vi.fn(),
      unfollow: vi.fn(), undo: vi.fn(), redo: vi.fn(), layout: vi.fn(), fromObject: vi.fn(),
    };

    registerWireCommands(mockCanvas as any, mockWire);

    listeners['flow:addNodes']({ nodes: [{ id: 'n1' }] });
    expect(mockCanvas.addNodes).toHaveBeenCalledWith([{ id: 'n1' }]);

    listeners['flow:fitView']({});
    expect(mockCanvas.fitView).toHaveBeenCalled();

    listeners['flow:setCenter']({ x: 100, y: 200, zoom: 1.5 });
    expect(mockCanvas.setCenter).toHaveBeenCalledWith(100, 200, 1.5);
  });

  it('returns a cleanup function that deregisters listeners', () => {
    const cleanups: Function[] = [];
    const mockWire = {
      on: (_event: string, _cb: Function) => {
        const cleanup = vi.fn();
        cleanups.push(cleanup);
        return cleanup;
      },
    };

    const cleanup = registerWireCommands({} as any, mockWire);
    cleanup();

    for (const fn of cleanups) {
      expect(fn).toHaveBeenCalled();
    }
  });

  it('routes new command dispatches to canvas methods with correct args', () => {
    const listeners: Record<string, Function> = {};
    const mockWire = { on: (event: string, cb: Function) => { listeners[event] = cb; } };
    const mockCanvas = {
      setLoading: vi.fn(),
      $clear: vi.fn(),
      toggleInteractive: vi.fn(),
      panBy: vi.fn(),
      fitBounds: vi.fn(),
      patchConfig: vi.fn(),
      deselectAll: vi.fn(),
      collapseNode: vi.fn(),
      expandNode: vi.fn(),
    };

    registerWireCommands(mockCanvas as any, mockWire);

    listeners['flow:setLoading']({ loading: true });
    expect(mockCanvas.setLoading).toHaveBeenCalledWith(true);

    listeners['flow:clear']({});
    expect(mockCanvas.$clear).toHaveBeenCalled();

    listeners['flow:toggleInteractive']({});
    expect(mockCanvas.toggleInteractive).toHaveBeenCalled();

    listeners['flow:panBy']({ dx: 50, dy: -30 });
    expect(mockCanvas.panBy).toHaveBeenCalledWith(50, -30);

    listeners['flow:fitBounds']({ rect: { x: 0, y: 0, width: 500, height: 300 }, options: { padding: 20 } });
    expect(mockCanvas.fitBounds).toHaveBeenCalledWith({ x: 0, y: 0, width: 500, height: 300 }, { padding: 20 });

    listeners['flow:patchConfig']({ changes: { panOnDrag: false } });
    expect(mockCanvas.patchConfig).toHaveBeenCalledWith({ panOnDrag: false });

    listeners['flow:deselectAll']({});
    expect(mockCanvas.deselectAll).toHaveBeenCalled();

    listeners['flow:collapseNode']({ id: 'group-1' });
    expect(mockCanvas.collapseNode).toHaveBeenCalledWith('group-1');

    listeners['flow:expandNode']({ id: 'group-1' });
    expect(mockCanvas.expandNode).toHaveBeenCalledWith('group-1');
  });

  it('ignores commands for methods not on canvas', () => {
    const listeners: Record<string, Function> = {};
    const mockWire = { on: (event: string, cb: Function) => { listeners[event] = cb; } };

    registerWireCommands({} as any, mockWire);

    expect(() => listeners['flow:addNodes']({ nodes: [] })).not.toThrow();
  });

  it('routes v0.2.0-alpha particle firing methods with correct args', () => {
    const listeners: Record<string, Function> = {};
    const mockWire = { on: (event: string, cb: Function) => { listeners[event] = cb; } };
    const mockCanvas = {
      sendParticleAlongPath: vi.fn(),
      sendParticleBetween: vi.fn(),
      sendParticleBurst: vi.fn(),
      sendConverging: vi.fn(),
    };

    registerWireCommands(mockCanvas as any, mockWire);

    listeners['flow:sendParticleAlongPath']({ path: 'M 0 0 L 100 100', options: { renderer: 'beam' } });
    expect(mockCanvas.sendParticleAlongPath).toHaveBeenCalledWith('M 0 0 L 100 100', { renderer: 'beam' });

    listeners['flow:sendParticleBetween']({ source: 'a', target: 'b', options: { color: 'red' } });
    expect(mockCanvas.sendParticleBetween).toHaveBeenCalledWith('a', 'b', { color: 'red' });

    listeners['flow:sendParticleBurst']({ edgeId: 'e1', options: { count: 5, stagger: 100 } });
    expect(mockCanvas.sendParticleBurst).toHaveBeenCalledWith('e1', { count: 5, stagger: 100 });

    listeners['flow:sendConverging']({ sources: ['e1', 'e2'], options: { targetNodeId: 'sink' } });
    expect(mockCanvas.sendConverging).toHaveBeenCalledWith(['e1', 'e2'], { targetNodeId: 'sink' });
  });

  it('routes v0.2.0-alpha bulk animation controls with tag filters', () => {
    const listeners: Record<string, Function> = {};
    const mockWire = { on: (event: string, cb: Function) => { listeners[event] = cb; } };
    const mockCanvas = {
      cancelAll: vi.fn(),
      pauseAll: vi.fn(),
      resumeAll: vi.fn(),
    };

    registerWireCommands(mockCanvas as any, mockWire);

    listeners['flow:cancelAll']({ filter: { tag: 'ambient' }, options: { mode: 'rollback' } });
    expect(mockCanvas.cancelAll).toHaveBeenCalledWith({ tag: 'ambient' }, { mode: 'rollback' });

    listeners['flow:pauseAll']({ filter: { tag: 'ambient' } });
    expect(mockCanvas.pauseAll).toHaveBeenCalledWith({ tag: 'ambient' });

    listeners['flow:resumeAll']({ filter: { tags: ['ambient', 'background'] } });
    expect(mockCanvas.resumeAll).toHaveBeenCalledWith({ tags: ['ambient', 'background'] });
  });

  it('defaults cancelAll/pauseAll/resumeAll filter to empty object when omitted', () => {
    const listeners: Record<string, Function> = {};
    const mockWire = { on: (event: string, cb: Function) => { listeners[event] = cb; } };
    const mockCanvas = { cancelAll: vi.fn(), pauseAll: vi.fn(), resumeAll: vi.fn() };

    registerWireCommands(mockCanvas as any, mockWire);

    // Missing filter — should default to {} (cancel/pause/resume all, no filter)
    listeners['flow:cancelAll']({});
    expect(mockCanvas.cancelAll).toHaveBeenCalledWith({}, {});

    listeners['flow:pauseAll']({});
    expect(mockCanvas.pauseAll).toHaveBeenCalledWith({});
  });
});

describe('flow:highlightPath — option pass-through (v0.2.0-alpha fix)', () => {
  it('forwards every particle option (renderer, gradient, followThrough) through to sendParticle', () => {
    vi.useFakeTimers();
    try {
      const listeners: Record<string, Function> = {};
      const mockWire = { on: (event: string, cb: Function) => { listeners[event] = cb; } };
      const sendParticle = vi.fn();
      const mockCanvas = {
        edges: [{ id: 'e1', source: 'a', target: 'b' }],
        sendParticle,
      };

      registerCustomWireCommands(mockCanvas as any, mockWire);

      listeners['flow:highlightPath']({
        nodeIds: ['a', 'b'],
        options: {
          renderer: 'beam',
          length: 60,
          width: 4,
          gradient: [
            { offset: 0, color: '#000', opacity: 0 },
            { offset: 1, color: '#fff', opacity: 1 },
          ],
          followThrough: false,
        },
      });

      vi.runAllTimers();

      expect(sendParticle).toHaveBeenCalledTimes(1);
      const [edgeId, opts] = sendParticle.mock.calls[0];
      expect(edgeId).toBe('e1');
      // All user-provided options should reach sendParticle, not just color/size/duration
      expect(opts.renderer).toBe('beam');
      expect(opts.length).toBe(60);
      expect(opts.width).toBe(4);
      expect(opts.gradient).toHaveLength(2);
      expect(opts.followThrough).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});

// ── registerWireEvents ────────────────────────────────────────────────

describe('registerWireEvents', () => {
  it('registers config callbacks for each wireEvent entry', () => {
    const config: any = {};
    const $wire = { onConnect: vi.fn(), onNodeDragEnd: vi.fn() };

    registerWireEvents(config, $wire, { 'connect': 'onConnect', 'node-drag-end': 'onNodeDragEnd' });

    expect(typeof config.onConnect).toBe('function');
    expect(typeof config.onNodeDragEnd).toBe('function');
  });

  it('calls $wire.method with extracted args when callback fires', () => {
    const wireMethods: Record<string, any> = { onConnect: vi.fn(), onNodeDragEnd: vi.fn() };
    const $wire = new Proxy(wireMethods, { get: (t, p) => t[p as string] });
    const config: any = {};

    registerWireEvents(config, $wire, { 'connect': 'onConnect', 'node-drag-end': 'onNodeDragEnd' });

    config.onConnect({ connection: { source: 'a', target: 'b', sourceHandle: 'h1', targetHandle: 'h2' } });
    expect(wireMethods.onConnect).toHaveBeenCalledWith('a', 'b', 'h1', 'h2');

    config.onNodeDragEnd({ node: { id: 'n1', position: { x: 5, y: 10 }, data: {} }, position: { x: 5, y: 10 } });
    expect(wireMethods.onNodeDragEnd).toHaveBeenCalledWith('n1', { x: 5, y: 10 });
  });

  it('falls back to passing full detail when event has no payload map', () => {
    const wireMethods: Record<string, any> = { onCustom: vi.fn() };
    const $wire = new Proxy(wireMethods, { get: (t, p) => t[p as string] });
    const config: any = {};

    registerWireEvents(config, $wire, { 'some-unknown-event': 'onCustom' });

    config.onSomeUnknownEvent({ foo: 'bar' });
    expect(wireMethods.onCustom).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('preserves and calls existing config callbacks', () => {
    const existingCallback = vi.fn();
    const config: any = { onConnect: existingCallback };
    const wireMethods: Record<string, any> = { onConnect: vi.fn() };
    const $wire = new Proxy(wireMethods, { get: (t, p) => t[p as string] });

    registerWireEvents(config, $wire, { 'connect': 'onConnect' });

    config.onConnect({ source: 'a', target: 'b', sourceHandle: null, targetHandle: null });
    expect(existingCallback).toHaveBeenCalled();
    expect(wireMethods.onConnect).toHaveBeenCalledWith('a', 'b', null, null);
  });

  it('preserves return value from existing callback', () => {
    const returnNode = { id: 'new', position: { x: 0, y: 0 }, data: { label: 'Test' } };
    const existingOnDrop = vi.fn().mockReturnValue(returnNode);
    const config: any = { onDrop: existingOnDrop };
    const wireMethods: Record<string, any> = { onDrop: vi.fn() };
    const $wire = new Proxy(wireMethods, { get: (t, p) => t[p as string] });

    registerWireEvents(config, $wire, { 'drop': 'onDrop' });

    const result = config.onDrop({ data: 'test', position: { x: 100, y: 200 } });
    expect(existingOnDrop).toHaveBeenCalled();
    expect(wireMethods.onDrop).toHaveBeenCalledWith('test', { x: 100, y: 200 });
    expect(result).toBe(returnNode);
  });
});
