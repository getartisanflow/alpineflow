import { describe, it, expect, vi } from 'vitest';
import type { FlowNode, FlowEdge, Connection } from '../../core/types';
import { isValidConnection } from '../../core/connections';

function makeNodes(): FlowNode[] {
  return [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'b', position: { x: 100, y: 0 }, data: { label: 'B' } },
    { id: 'c', position: { x: 200, y: 0 }, data: { label: 'C' }, connectable: false },
  ];
}

function makeEdges(): FlowEdge[] {
  return [
    { id: 'e1', source: 'a', target: 'b' },
  ];
}

function makeCanvas(opts?: {
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  connectOnClick?: boolean;
  isValidConnection?: (connection: Connection) => boolean;
}) {
  const _nodes = opts?.nodes ?? makeNodes();
  let _edges = opts?.edges ?? makeEdges();
  const emitted: { event: string; detail: any }[] = [];

  const canvas = {
    nodes: _nodes,
    get edges() { return _edges; },
    set edges(v) { _edges = v; },
    pendingConnection: null as { source: string; sourceHandle?: string } | null,
    _config: {
      connectOnClick: opts?.connectOnClick ?? true,
      isValidConnection: opts?.isValidConnection,
    },
    getNode(id: string) { return _nodes.find(n => n.id === id); },
    _emit(event: string, detail: any) { emitted.push({ event, detail }); },
    emitted,

    addEdges(edge: FlowEdge) {
      _edges = [..._edges, edge];
    },

    startClickConnect(sourceNodeId: string, sourceHandle?: string): boolean {
      if (!canvas._config.connectOnClick) return false;
      const sourceNode = canvas.getNode(sourceNodeId);
      if (sourceNode?.connectable === false) return false;
      canvas.pendingConnection = { source: sourceNodeId, sourceHandle };
      canvas._emit('connect-start', { source: sourceNodeId, sourceHandle });
      return true;
    },

    completeClickConnect(targetNodeId: string, targetHandle?: string): boolean {
      if (!canvas.pendingConnection) return false;

      const targetNode = canvas.getNode(targetNodeId);
      if (targetNode?.connectable === false) {
        canvas._emit('connect-end', { connection: null, source: canvas.pendingConnection.source, sourceHandle: canvas.pendingConnection.sourceHandle });
        canvas.pendingConnection = null;
        return false;
      }

      const connection: Connection = {
        source: canvas.pendingConnection.source,
        sourceHandle: canvas.pendingConnection.sourceHandle,
        target: targetNodeId,
        targetHandle,
      };

      if (!isValidConnection(connection, canvas.edges)) {
        canvas._emit('connect-end', { connection: null, source: canvas.pendingConnection.source, sourceHandle: canvas.pendingConnection.sourceHandle });
        canvas.pendingConnection = null;
        return false;
      }

      if (canvas._config.isValidConnection && !canvas._config.isValidConnection(connection)) {
        canvas._emit('connect-end', { connection: null, source: canvas.pendingConnection.source, sourceHandle: canvas.pendingConnection.sourceHandle });
        canvas.pendingConnection = null;
        return false;
      }

      const edgeId = `e-${connection.source}-${connection.target}-click`;
      canvas.addEdges({ id: edgeId, ...connection });
      canvas._emit('connect', { connection });
      canvas._emit('connect-end', { connection, source: canvas.pendingConnection.source, sourceHandle: canvas.pendingConnection.sourceHandle });
      canvas.pendingConnection = null;
      return true;
    },

    cancelClickConnect(): void {
      if (!canvas.pendingConnection) return;
      canvas._emit('connect-end', { connection: null, source: canvas.pendingConnection.source, sourceHandle: canvas.pendingConnection.sourceHandle });
      canvas.pendingConnection = null;
    },
  };

  return canvas;
}

describe('click-to-connect: startClickConnect', () => {
  it('sets pendingConnection and emits connect-start', () => {
    const canvas = makeCanvas();
    const result = canvas.startClickConnect('a', 'source');

    expect(result).toBe(true);
    expect(canvas.pendingConnection).toEqual({ source: 'a', sourceHandle: 'source' });
    expect(canvas.emitted).toEqual([
      { event: 'connect-start', detail: { source: 'a', sourceHandle: 'source' } },
    ]);
  });

  it('returns false when connectOnClick is disabled', () => {
    const canvas = makeCanvas({ connectOnClick: false });
    const result = canvas.startClickConnect('a');

    expect(result).toBe(false);
    expect(canvas.pendingConnection).toBeNull();
    expect(canvas.emitted).toHaveLength(0);
  });

  it('returns false when source node is not connectable', () => {
    const canvas = makeCanvas();
    const result = canvas.startClickConnect('c');

    expect(result).toBe(false);
    expect(canvas.pendingConnection).toBeNull();
  });
});

describe('click-to-connect: completeClickConnect', () => {
  it('creates edge and emits connect + connect-end', () => {
    const canvas = makeCanvas();
    canvas.startClickConnect('a', 'source');
    canvas.emitted.length = 0;

    const result = canvas.completeClickConnect('b', 'target');

    expect(result).toBe(true);
    expect(canvas.pendingConnection).toBeNull();
    expect(canvas.edges).toHaveLength(2);
    expect(canvas.emitted[0].event).toBe('connect');
    expect(canvas.emitted[0].detail.connection).toMatchObject({
      source: 'a', target: 'b', sourceHandle: 'source', targetHandle: 'target',
    });
    expect(canvas.emitted[1].event).toBe('connect-end');
    expect(canvas.emitted[1].detail.connection).toBeTruthy();
  });

  it('rejects self-connection', () => {
    const canvas = makeCanvas();
    canvas.startClickConnect('a');
    canvas.emitted.length = 0;

    const result = canvas.completeClickConnect('a');

    expect(result).toBe(false);
    expect(canvas.pendingConnection).toBeNull();
    expect(canvas.emitted[0]).toMatchObject({ event: 'connect-end', detail: { connection: null } });
  });

  it('rejects when target node is not connectable', () => {
    const canvas = makeCanvas();
    canvas.startClickConnect('a');
    canvas.emitted.length = 0;

    const result = canvas.completeClickConnect('c');

    expect(result).toBe(false);
    expect(canvas.pendingConnection).toBeNull();
  });

  it('rejects duplicate connection', () => {
    const canvas = makeCanvas();
    canvas.startClickConnect('a');
    canvas.emitted.length = 0;

    const result = canvas.completeClickConnect('b');

    expect(result).toBe(false);
    expect(canvas.edges).toHaveLength(1);
  });

  it('respects custom isValidConnection', () => {
    const canvas = makeCanvas({
      isValidConnection: () => false,
    });
    canvas.startClickConnect('b');
    canvas.emitted.length = 0;

    const result = canvas.completeClickConnect('a');

    expect(result).toBe(false);
    expect(canvas.edges).toHaveLength(1);
  });

  it('returns false when no pendingConnection', () => {
    const canvas = makeCanvas();
    const result = canvas.completeClickConnect('b');

    expect(result).toBe(false);
    expect(canvas.emitted).toHaveLength(0);
  });
});

describe('click-to-connect: cancelClickConnect', () => {
  it('clears pendingConnection and emits connect-end with null', () => {
    const canvas = makeCanvas();
    canvas.startClickConnect('a', 'source');
    canvas.emitted.length = 0;

    canvas.cancelClickConnect();

    expect(canvas.pendingConnection).toBeNull();
    expect(canvas.emitted).toEqual([
      { event: 'connect-end', detail: { connection: null, source: 'a', sourceHandle: 'source' } },
    ]);
  });

  it('is a no-op when no pendingConnection', () => {
    const canvas = makeCanvas();
    canvas.cancelClickConnect();

    expect(canvas.emitted).toHaveLength(0);
  });
});
