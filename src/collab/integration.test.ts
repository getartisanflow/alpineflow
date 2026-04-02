import { describe, it, expect } from 'vitest';
import * as Y from 'yjs';
import { CollabBridge } from './bridge';

function makeState() {
  return {
    nodes: [
      { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    ],
    edges: [] as any[],
    viewport: { x: 0, y: 0, zoom: 1 },
  };
}

describe('CollabBridge integration — two peers', () => {
  it('converges to same state after bidirectional sync', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const stateA = makeState();
    const stateB = { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };

    new CollabBridge(docA, stateA);
    new CollabBridge(docB, stateB as any);

    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    Y.applyUpdate(docA, Y.encodeStateAsUpdate(docB));

    expect(stateB.nodes.length).toBe(1);
    expect(stateB.nodes[0].id).toBe('n1');
  });

  it('handles concurrent node adds', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const stateA = makeState();
    const stateB = makeState();

    const bridgeA = new CollabBridge(docA, stateA);
    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    const bridgeB = new CollabBridge(docB, stateB);

    bridgeA.pushLocalNodeAdd({ id: 'fromA', position: { x: 10, y: 10 }, data: { label: 'From A' } } as any);
    bridgeB.pushLocalNodeAdd({ id: 'fromB', position: { x: 20, y: 20 }, data: { label: 'From B' } } as any);

    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    Y.applyUpdate(docA, Y.encodeStateAsUpdate(docB));

    const idsA = stateA.nodes.map(n => n.id).sort();
    const idsB = stateB.nodes.map(n => n.id).sort();
    expect(idsA).toEqual(['fromA', 'fromB', 'n1']);
    expect(idsB).toEqual(['fromA', 'fromB', 'n1']);
  });

  it('handles concurrent position changes on same node', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const stateA = makeState();
    const stateB = makeState();

    const bridgeA = new CollabBridge(docA, stateA);
    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    const bridgeB = new CollabBridge(docB, stateB);

    bridgeA.pushLocalNodeUpdate('n1', { position: { x: 100, y: 100 } });
    bridgeB.pushLocalNodeUpdate('n1', { position: { x: 200, y: 200 } });

    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    Y.applyUpdate(docA, Y.encodeStateAsUpdate(docB));

    const posA = stateA.nodes.find(n => n.id === 'n1')?.position;
    const posB = stateB.nodes.find(n => n.id === 'n1')?.position;
    expect(posA).toEqual(posB); // Both converge to same value
  });

  it('handles node removal during concurrent edit', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const stateA = makeState();
    const stateB = makeState();

    const bridgeA = new CollabBridge(docA, stateA);
    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    const bridgeB = new CollabBridge(docB, stateB);

    bridgeA.pushLocalNodeRemove('n1');
    bridgeB.pushLocalNodeUpdate('n1', { position: { x: 999, y: 999 } });

    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    Y.applyUpdate(docA, Y.encodeStateAsUpdate(docB));

    // Yjs documents converge: delete wins over concurrent update
    const yNodesA = docA.getMap('nodes');
    const yNodesB = docB.getMap('nodes');
    expect(yNodesA.has('n1')).toBe(false);
    expect(yNodesB.has('n1')).toBe(false);

    // Remote peer (B) sees the removal reflected in Alpine state
    expect(stateB.nodes.find(n => n.id === 'n1')).toBeUndefined();
  });
});
