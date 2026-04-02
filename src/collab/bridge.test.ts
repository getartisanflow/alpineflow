import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Y from 'yjs';
import { CollabBridge } from './bridge';

function makeReactiveState() {
  return {
    nodes: [
      { id: 'a', position: { x: 10, y: 20 }, data: { label: 'A' } },
      { id: 'b', position: { x: 100, y: 200 }, data: { label: 'B' } },
    ],
    edges: [
      { id: 'e1', source: 'a', target: 'b' },
    ],
  };
}

describe('CollabBridge', () => {
  let doc: Y.Doc;
  let bridge: CollabBridge;
  let state: ReturnType<typeof makeReactiveState>;

  beforeEach(() => {
    doc = new Y.Doc();
    state = makeReactiveState();
    bridge = new CollabBridge(doc, state);
  });

  it('populates Y.Maps from initial Alpine state', () => {
    const yNodes = doc.getMap('nodes');
    expect(yNodes.size).toBe(2);
    const nodeA = (yNodes.get('a') as Y.Map<any>).toJSON();
    expect(nodeA.id).toBe('a');
    expect(nodeA.position).toEqual({ x: 10, y: 20 });
  });

  it('populates edges Y.Map from initial state', () => {
    const yEdges = doc.getMap('edges');
    expect(yEdges.size).toBe(1);
    const edge = (yEdges.get('e1') as Y.Map<any>).toJSON();
    expect(edge.source).toBe('a');
  });

  it('pushes local node position change to Yjs', () => {
    bridge.pushLocalNodeUpdate('a', { position: { x: 50, y: 60 } });
    const yNodes = doc.getMap('nodes');
    const nodeA = (yNodes.get('a') as Y.Map<any>).toJSON();
    expect(nodeA.position).toEqual({ x: 50, y: 60 });
  });

  it('pushes local node add to Yjs', () => {
    const newNode = { id: 'c', position: { x: 0, y: 0 }, data: { label: 'C' } };
    bridge.pushLocalNodeAdd(newNode);
    const yNodes = doc.getMap('nodes');
    expect(yNodes.size).toBe(3);
    expect((yNodes.get('c') as Y.Map<any>).toJSON().data.label).toBe('C');
  });

  it('pushes local node remove to Yjs', () => {
    bridge.pushLocalNodeRemove('b');
    const yNodes = doc.getMap('nodes');
    expect(yNodes.size).toBe(1);
    expect(yNodes.has('b')).toBe(false);
  });

  it('pushes local edge add to Yjs', () => {
    const newEdge = { id: 'e2', source: 'b', target: 'a' };
    bridge.pushLocalEdgeAdd(newEdge);
    const yEdges = doc.getMap('edges');
    expect(yEdges.size).toBe(2);
  });

  it('pushes local edge remove to Yjs', () => {
    bridge.pushLocalEdgeRemove('e1');
    const yEdges = doc.getMap('edges');
    expect(yEdges.size).toBe(0);
  });

  it('applies remote node add to Alpine state', () => {
    const remoteDoc = new Y.Doc();
    const remoteBridge = new CollabBridge(remoteDoc, makeReactiveState());

    // Connect the two docs
    Y.applyUpdate(doc, Y.encodeStateAsUpdate(remoteDoc));
    Y.applyUpdate(remoteDoc, Y.encodeStateAsUpdate(doc));

    // Remote adds a node
    const remoteNodes = remoteDoc.getMap('nodes');
    const newNode = new Y.Map();
    newNode.set('id', 'remote-1');
    newNode.set('position', { x: 300, y: 300 });
    newNode.set('data', { label: 'Remote' });
    remoteDoc.transact(() => {
      remoteNodes.set('remote-1', newNode);
    });

    // Sync remote to local
    Y.applyUpdate(doc, Y.encodeStateAsUpdate(remoteDoc));

    // Bridge should have notified state
    const addedIds = state.nodes.map(n => n.id);
    expect(addedIds).toContain('remote-1');
  });

  it('applies remote node position change to Alpine state', () => {
    const remoteDoc = new Y.Doc();
    Y.applyUpdate(remoteDoc, Y.encodeStateAsUpdate(doc));

    const remoteNodes = remoteDoc.getMap('nodes');
    const remoteNodeA = remoteNodes.get('a') as Y.Map<any>;
    remoteDoc.transact(() => {
      remoteNodeA.set('position', { x: 999, y: 888 });
    });

    Y.applyUpdate(doc, Y.encodeStateAsUpdate(remoteDoc));

    const localA = state.nodes.find(n => n.id === 'a');
    expect(localA?.position).toEqual({ x: 999, y: 888 });
  });

  it('applies remote node remove to Alpine state', () => {
    const remoteDoc = new Y.Doc();
    Y.applyUpdate(remoteDoc, Y.encodeStateAsUpdate(doc));

    const remoteNodes = remoteDoc.getMap('nodes');
    remoteDoc.transact(() => {
      remoteNodes.delete('b');
    });

    Y.applyUpdate(doc, Y.encodeStateAsUpdate(remoteDoc));

    expect(state.nodes.find(n => n.id === 'b')).toBeUndefined();
  });

  it('does not echo local changes back to Alpine state', () => {
    const nodesBefore = [...state.nodes];
    bridge.pushLocalNodeUpdate('a', { position: { x: 50, y: 60 } });
    // The state should NOT have been modified by the Yjs observer
    // (only by the caller who made the local change)
    expect(state.nodes).toEqual(nodesBefore);
  });

  it('cleans up observers on destroy', () => {
    bridge.destroy();
    // After destroy, remote changes should not modify state
    const remoteDoc = new Y.Doc();
    Y.applyUpdate(remoteDoc, Y.encodeStateAsUpdate(doc));
    const remoteNodes = remoteDoc.getMap('nodes');
    const newNode = new Y.Map();
    newNode.set('id', 'after-destroy');
    newNode.set('position', { x: 0, y: 0 });
    newNode.set('data', {});
    remoteDoc.transact(() => {
      remoteNodes.set('after-destroy', newNode);
    });
    Y.applyUpdate(doc, Y.encodeStateAsUpdate(remoteDoc));

    expect(state.nodes.find(n => n.id === 'after-destroy')).toBeUndefined();
  });
});
