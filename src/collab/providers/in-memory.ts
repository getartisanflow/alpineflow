/**
 * In-memory collaboration provider for demo/testing purposes.
 *
 * Connects two Yjs documents directly in the same browser tab,
 * simulating two users without any network transport.
 * In production, use WebSocketProvider or ReverbProvider instead.
 */
import * as Y from 'yjs';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';
import type { CollabProvider, CollabStatus } from '../types';

interface InMemoryProviderConfig {
  roomId: string;
}

type StatusListener = (status: CollabStatus) => void;
type SyncListener = (synced: boolean) => void;
type Listener = StatusListener | SyncListener;

export class InMemoryProvider implements CollabProvider {
  readonly roomId: string;
  connected = false;
  doc: Y.Doc | null = null;
  awareness: Awareness | null = null;
  peer: InMemoryProvider | null = null;

  private _listeners: Record<string, Listener[]> = {};
  private _synced = false;
  private _docUpdateHandler: ((update: Uint8Array, origin: unknown) => void) | null = null;
  private _peerDocUpdateHandler: ((update: Uint8Array, origin: unknown) => void) | null = null;
  private _awarenessUpdateHandler: ((changes: { added: number[]; updated: number[]; removed: number[] }) => void) | null = null;
  private _peerAwarenessUpdateHandler: ((changes: { added: number[]; updated: number[]; removed: number[] }) => void) | null = null;

  constructor(config: InMemoryProviderConfig) {
    this.roomId = config.roomId;
  }

  connect(doc: Y.Doc, awareness: Awareness): void {
    this.doc = doc;
    this.awareness = awareness;
    this.connected = true;
    this._emit('status', 'connected');

    if (this.peer?.doc) {
      this._setupSync();
    }
  }

  disconnect(): void {
    this.connected = false;
    this._emit('status', 'disconnected');
  }

  destroy(): void {
    if (this.doc && this._docUpdateHandler) {
      this.doc.off('update', this._docUpdateHandler);
      this._docUpdateHandler = null;
    }
    if (this.peer?.doc && this._peerDocUpdateHandler) {
      this.peer.doc.off('update', this._peerDocUpdateHandler);
      this._peerDocUpdateHandler = null;
    }
    if (this.awareness && this._awarenessUpdateHandler) {
      this.awareness.off('update', this._awarenessUpdateHandler);
      this._awarenessUpdateHandler = null;
    }
    if (this.peer?.awareness && this._peerAwarenessUpdateHandler) {
      this.peer.awareness.off('update', this._peerAwarenessUpdateHandler);
      this._peerAwarenessUpdateHandler = null;
    }
    this.connected = false;
    this._listeners = {};
  }

  on(event: 'status', cb: (status: CollabStatus) => void): void;
  on(event: 'sync', cb: (synced: boolean) => void): void;
  on(event: string, cb: Listener): void {
    (this._listeners[event] = this._listeners[event] || []).push(cb);
  }

  off(event: string, cb: Listener): void {
    this._listeners[event] = (this._listeners[event] || []).filter((f) => f !== cb);
  }

  private _emit(event: string, data: unknown): void {
    (this._listeners[event] || []).forEach((cb) => (cb as (d: unknown) => void)(data));
  }

  private _setupSync(): void {
    const peer = this.peer;
    if (!this.doc || !peer?.doc) return;
    if (this._synced) return;
    this._synced = true;
    peer._synced = true;

    // Initial sync: copy state between docs
    const updateA = Y.encodeStateAsUpdate(this.doc);
    const updateB = Y.encodeStateAsUpdate(peer.doc);
    Y.applyUpdate(peer.doc, updateA, 'remote');
    Y.applyUpdate(this.doc, updateB, 'remote');

    // Forward incremental updates between docs
    this._docUpdateHandler = (update: Uint8Array, origin: unknown) => {
      if (origin === 'remote') return;
      Y.applyUpdate(peer.doc!, update, 'remote');
    };
    this.doc.on('update', this._docUpdateHandler);
    this._peerDocUpdateHandler = (update: Uint8Array, origin: unknown) => {
      if (origin === 'remote') return;
      Y.applyUpdate(this.doc!, update, 'remote');
    };
    peer.doc.on('update', this._peerDocUpdateHandler);

    // Cross-sync awareness (cursors, selections)
    if (this.awareness && peer.awareness) {
      const selfAwareness = this.awareness;
      const peerAwareness = peer.awareness;

      this._awarenessUpdateHandler = (changes: { added: number[]; updated: number[]; removed: number[] }) => {
        const changed = [...changes.added, ...changes.updated];
        if (changed.length === 0) return;
        const encoded = encodeAwarenessUpdate(selfAwareness, changed);
        applyAwarenessUpdate(peerAwareness, encoded, 'remote');
      };
      selfAwareness.on('update', this._awarenessUpdateHandler);

      this._peerAwarenessUpdateHandler = (changes: { added: number[]; updated: number[]; removed: number[] }) => {
        const changed = [...changes.added, ...changes.updated];
        if (changed.length === 0) return;
        const encoded = encodeAwarenessUpdate(peerAwareness, changed);
        applyAwarenessUpdate(selfAwareness, encoded, 'remote');
      };
      peerAwareness.on('update', this._peerAwarenessUpdateHandler);
    }

    this._emit('sync', true);
    peer._emit('sync', true);
  }
}

/** Link two InMemoryProviders so they sync when both connect. */
export function linkProviders(a: InMemoryProvider, b: InMemoryProvider): void {
  a.peer = b;
  b.peer = a;
}
