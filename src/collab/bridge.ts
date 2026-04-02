import * as Y from 'yjs';
import type { FlowNode, FlowEdge } from '../core/types';
import type { CollabProvider } from './types';

/**
 * CollabBridge — Bidirectional sync between a Yjs Y.Doc and Alpine reactive state.
 *
 * Yjs document structure:
 *   Y.Map("nodes")    -> keyed by node.id -> Y.Map per node
 *   Y.Map("edges")    -> keyed by edge.id -> Y.Map per edge
 *
 * Viewport is intentionally NOT synced — each user maintains their own
 * independent pan/zoom, similar to Figma and other collaborative tools.
 *
 * Uses an origin flag to prevent echo loops:
 *   Local changes -> mark origin as ORIGIN_LOCAL -> push to Yjs
 *   Yjs observer -> if origin is ORIGIN_LOCAL, skip -> otherwise apply to Alpine
 */

const ORIGIN_LOCAL = 'collab-bridge-local';

interface ReactiveState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  _rebuildNodeMap?: () => void;
  _rebuildEdgeMap?: () => void;
}

function nodeToYMap(obj: Record<string, any>): Y.Map<any> {
  const yMap = new Y.Map();
  // Deep-clone via JSON to strip Alpine reactive proxies —
  // Yjs can't serialize proxy objects correctly.
  const plain = JSON.parse(JSON.stringify(obj));
  for (const [key, val] of Object.entries(plain)) {
    yMap.set(key, val);
  }
  return yMap;
}

export class CollabBridge {
  private doc: Y.Doc;
  private state: ReactiveState;
  private yNodes: Y.Map<Y.Map<any>>;
  private yEdges: Y.Map<Y.Map<any>>;
  private destroyed = false;
  private _initialSyncDone = false;
  /** Node IDs currently being dragged locally — skip overwriting their position during pull */
  private _draggingNodeIds = new Set<string>();

  private nodeObserver: (events: Y.YEvent<any>[], txn: Y.Transaction) => void;
  private edgeObserver: (events: Y.YEvent<any>[], txn: Y.Transaction) => void;

  constructor(doc: Y.Doc, state: ReactiveState, provider?: CollabProvider) {
    this.doc = doc;
    this.state = state;
    this.yNodes = doc.getMap('nodes') as Y.Map<Y.Map<any>>;
    this.yEdges = doc.getMap('edges') as Y.Map<Y.Map<any>>;

    if (provider) {
      const onSync = (synced: boolean) => {
        if (!synced || this._initialSyncDone || this.destroyed) return;
        this._initialSyncDone = true;
        provider.off('sync', onSync);
        this._resolveInitialState();
      };
      provider.on('sync', onSync);
    } else {
      this._resolveInitialState();
    }

    // Observe remote changes to nodes (deep — catches nested Y.Map property changes)
    this.nodeObserver = (_events, txn) => {
      if (this.destroyed || txn.origin === ORIGIN_LOCAL) {
        return;
      }
      this.pullNodesFromYjs();
      // After remote node changes, re-pull edges on next frame so that
      // edge paths recalculate once x-flow-node directives have measured
      // node dimensions (dimensions are needed for path calculation).
      const deferredPull = () => { if (!this.destroyed) this.pullEdgesFromYjs(); };
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(deferredPull);
      } else {
        deferredPull();
      }
    };
    this.yNodes.observeDeep(this.nodeObserver);

    // Observe remote changes to edges (deep — catches nested Y.Map property changes)
    this.edgeObserver = (_events, txn) => {
      if (this.destroyed || txn.origin === ORIGIN_LOCAL) {
        return;
      }
      this.pullEdgesFromYjs();
    };
    this.yEdges.observeDeep(this.edgeObserver);
  }

  private _resolveInitialState(): void {
    if (this.yNodes.size > 0) {
      this.pullAllFromYjs();
    } else {
      this._pushInitialState();
    }
  }

  private _pushInitialState(): void {
    this.doc.transact(() => {
      for (const node of this.state.nodes) {
        // Only create if it doesn't already exist — never create duplicates
        if (!this.yNodes.has(node.id)) {
          this.yNodes.set(node.id, nodeToYMap(node as any));
        }
      }
      for (const edge of this.state.edges) {
        if (!this.yEdges.has(edge.id)) {
          this.yEdges.set(edge.id, nodeToYMap(edge as any));
        }
      }
    }, ORIGIN_LOCAL);
  }

  // -- Push local to Yjs --

  pushLocalNodeUpdate(nodeId: string, changes: Record<string, any>): void {
    this.doc.transact(() => {
      const yNode = this.yNodes.get(nodeId);
      if (!yNode) {
        return;
      }
      // Deep-clone values to strip Alpine reactive proxies
      const plain = JSON.parse(JSON.stringify(changes));
      for (const [key, val] of Object.entries(plain)) {
        yNode.set(key, val);
      }
    }, ORIGIN_LOCAL);
  }

  pushLocalNodeAdd(node: FlowNode): void {
    this.doc.transact(() => {
      this.yNodes.set(node.id, nodeToYMap(node as any));
    }, ORIGIN_LOCAL);
  }

  pushLocalNodeRemove(nodeId: string): void {
    this.doc.transact(() => {
      this.yNodes.delete(nodeId);
    }, ORIGIN_LOCAL);
  }

  pushLocalEdgeAdd(edge: FlowEdge): void {
    this.doc.transact(() => {
      this.yEdges.set(edge.id, nodeToYMap(edge as any));
    }, ORIGIN_LOCAL);
  }

  pushLocalEdgeRemove(edgeId: string): void {
    this.doc.transact(() => {
      this.yEdges.delete(edgeId);
    }, ORIGIN_LOCAL);
  }

  // -- Pull Yjs to Alpine --

  /** Mark a node as being dragged locally — its position won't be overwritten by remote pulls. */
  setDragging(nodeId: string, dragging: boolean): void {
    if (dragging) {
      this._draggingNodeIds.add(nodeId);
    } else {
      this._draggingNodeIds.delete(nodeId);
    }
  }

  private pullAllFromYjs(): void {
    this.pullNodesFromYjs();
    this.pullEdgesFromYjs();
  }

  private pullNodesFromYjs(): void {
    const remoteNodes = new Map<string, FlowNode>();
    this.yNodes.forEach((yNode, id) => {
      const node = yNode.toJSON() as FlowNode;
      if (!node.position || typeof node.position !== 'object') {
        node.position = { x: 0, y: 0 };
      }
      remoteNodes.set(id, node);
    });

    // Update existing nodes in place via the reactive array
    const localIds = new Set<string>();
    for (let i = 0; i < this.state.nodes.length; i++) {
      const local = this.state.nodes[i];
      localIds.add(local.id);
      const remote = remoteNodes.get(local.id);
      if (remote) {
        // Update position on existing reactive object
        if (remote.position && !this._draggingNodeIds.has(local.id)) {
          local.position.x = remote.position.x;
          local.position.y = remote.position.y;
        }
        // Update data
        if (remote.data) local.data = remote.data;
      }
    }

    // Add new nodes
    remoteNodes.forEach((node, id) => {
      if (!localIds.has(id)) {
        this.state.nodes.push(node);
      }
    });

    // Remove deleted nodes
    for (let i = this.state.nodes.length - 1; i >= 0; i--) {
      if (!remoteNodes.has(this.state.nodes[i].id)) {
        this.state.nodes.splice(i, 1);
      }
    }

    this.state._rebuildNodeMap?.();
  }

  private pullEdgesFromYjs(): void {
    const edges: FlowEdge[] = [];
    this.yEdges.forEach((yEdge) => {
      edges.push(yEdge.toJSON() as FlowEdge);
    });
    this.state.edges.splice(0, this.state.edges.length, ...edges);
    this.state._rebuildEdgeMap?.();
  }

  // -- Lifecycle --

  destroy(): void {
    this.destroyed = true;
    this.yNodes.unobserveDeep(this.nodeObserver);
    this.yEdges.unobserveDeep(this.edgeObserver);
  }
}
