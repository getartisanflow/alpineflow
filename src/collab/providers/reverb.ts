import { applyUpdate as yjsApplyUpdate, encodeStateAsUpdate, encodeStateVector } from 'yjs';
import { encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';
import type { Doc as YDoc } from 'yjs';
import type { Awareness } from 'y-protocols/awareness';
import type { CollabProvider, CollabStatus, CollabUser } from '../types';

// Shared applyUpdate reference set by the collab addon's init function.
let _sharedApplyUpdate: ((doc: YDoc, update: Uint8Array, origin?: any) => void) = yjsApplyUpdate;
let _sharedEncodeStateAsUpdate: ((doc: YDoc, sv?: Uint8Array) => Uint8Array) = encodeStateAsUpdate;
let _sharedEncodeStateVector: ((doc: YDoc) => Uint8Array) = encodeStateVector;

/** @internal Called by AlpineFlowCollab to share yjs function references. */
export function setYjsFunctions(fns: {
  applyUpdate: typeof yjsApplyUpdate;
  encodeStateAsUpdate: typeof encodeStateAsUpdate;
  encodeStateVector: typeof encodeStateVector;
}): void {
  _sharedApplyUpdate = fns.applyUpdate;
  _sharedEncodeStateAsUpdate = fns.encodeStateAsUpdate;
  _sharedEncodeStateVector = fns.encodeStateVector;
}

// -- Base64 helpers (Reverb/Pusher only supports text frames) --

export function base64Encode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64Decode(str: string): Uint8Array {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// -- Provider --

interface ReverbProviderConfig {
  roomId: string;
  /** Echo channel pattern. `{roomId}` is replaced with the actual room ID. */
  channel: string;
  user: CollabUser;
  /** URL for initial state fetch. `{roomId}` is replaced. Optional. */
  stateUrl?: string;
}

type EventMap = {
  status: CollabStatus;
  sync: boolean;
};

const ORIGIN_REVERB = 'reverb-provider';

/**
 * ReverbProvider — Sends base64-encoded Yjs updates through Laravel Echo
 * private channels (Reverb/Pusher protocol). Uses whisper events for
 * low-latency peer-to-peer communication.
 */
export class ReverbProvider implements CollabProvider {
  readonly roomId: string;
  private channelPattern: string;
  private user: CollabUser;
  private stateUrl?: string;
  private channel: any = null;
  private doc: YDoc | null = null;
  private awareness: Awareness | null = null;
  private listeners: { [K in keyof EventMap]?: Set<(val: EventMap[K]) => void> } = {};
  private _connected = false;
  private updateHandler: ((update: Uint8Array, origin: any) => void) | null = null;
  private awarenessHandler: ((changes: any) => void) | null = null;
  private _saveTimer: ReturnType<typeof setTimeout> | null = null;
  private _saveDirty = false;

  constructor(config: ReverbProviderConfig) {
    this.roomId = config.roomId;
    this.channelPattern = config.channel;
    this.user = config.user;
    this.stateUrl = config.stateUrl;
  }

  get connected(): boolean {
    return this._connected;
  }

  connect(doc: YDoc, awareness: Awareness): void {
    this.doc = doc;
    this.awareness = awareness;

    const channelName = this.channelPattern.replace('{roomId}', this.roomId);
    const Echo = (globalThis as any).Echo;
    if (!Echo) {
      console.warn('[alpineflow-collab] Laravel Echo not found. ReverbProvider requires Echo.');
      return;
    }

    this.channel = Echo.private(channelName);

    // Listen for remote Yjs updates
    this.channel.listenForWhisper('yjs-update', (e: { data: string }) => {
      if (!this.doc) return;
      const update = base64Decode(e.data);

      _sharedApplyUpdate(this.doc, update, ORIGIN_REVERB);
    });

    // Listen for sync request — a new peer is asking for our full state
    this.channel.listenForWhisper('yjs-sync-request', (e: { sv: string }) => {
      if (!this.doc) return;
      const remoteStateVector = base64Decode(e.sv);
      const update = _sharedEncodeStateAsUpdate(this.doc, remoteStateVector);

      if (update.length > 2) {
        this.channel?.whisper('yjs-sync-response', { data: base64Encode(update) });
      }
    });

    // Listen for sync response — a peer is sending us their full state
    this.channel.listenForWhisper('yjs-sync-response', (e: { data: string }) => {
      if (!this.doc) return;
      const update = base64Decode(e.data);

      _sharedApplyUpdate(this.doc, update, ORIGIN_REVERB);

    });

    // Listen for remote awareness updates
    this.channel.listenForWhisper('yjs-awareness', (e: { data: string }) => {
      if (!this.awareness) return;
      const update = base64Decode(e.data);
      applyAwarenessUpdate(this.awareness, update, ORIGIN_REVERB);
    });

    // Broadcast local Yjs changes and mark state as dirty for periodic save
    this.updateHandler = (update: Uint8Array, origin: any) => {
      if (origin === ORIGIN_REVERB) return;
      this.channel?.whisper('yjs-update', { data: base64Encode(update) });
      this._markDirty();
    };
    doc.on('update', this.updateHandler);

    // Broadcast local awareness changes
    this.awarenessHandler = ({ added, updated }: { added: number[]; updated: number[] }) => {
      const changed = [...added, ...updated];
      if (changed.length === 0) return;
      const update = encodeAwarenessUpdate(awareness, changed);
      this.channel?.whisper('yjs-awareness', { data: base64Encode(update) });
    };
    awareness.on('update', this.awarenessHandler);

    this._connected = true;
    this.emit('status', 'connected');

    // Fetch initial state: either from a server URL, or by requesting
    // state from existing peers via whisper sync.
    if (this.stateUrl) {
      this.fetchInitialState();
    } else {
      // Request state from any existing peers by sending our state vector.
      // If no peers respond (we're the first), we emit sync immediately
      // so the bridge initializes from local state.
      const sv = _sharedEncodeStateVector(doc);

      this.channel.whisper('yjs-sync-request', { sv: base64Encode(sv) });
      // Emit sync after a short delay — if a peer responds with
      // yjs-sync-response, the update will be applied before the
      // bridge resolves initial state. If no peer responds, the
      // bridge initializes from its own local state.
      setTimeout(() => {

        this.emit('sync', true);
      }, 1500);
    }
  }

  disconnect(): void {
    this.cleanupListeners();
    this._connected = false;
    this.emit('status', 'disconnected');
  }

  destroy(): void {
    this.cleanupListeners();
    this.channel = null;
    this.doc = null;
    this.awareness = null;
    this._connected = false;
    this.listeners = {};
  }

  on<K extends keyof EventMap>(event: K, cb: (val: EventMap[K]) => void): void {
    (this.listeners[event] ??= new Set() as any).add(cb);
  }

  off(event: string, cb: (...args: any[]) => void): void {
    (this.listeners as any)[event]?.delete(cb);
  }

  private emit<K extends keyof EventMap>(event: K, val: EventMap[K]): void {
    this.listeners[event]?.forEach((cb: any) => cb(val));
  }

  private cleanupListeners(): void {
    if (this.doc && this.updateHandler) {
      this.doc.off('update', this.updateHandler);
      this.updateHandler = null;
    }
    if (this.awareness && this.awarenessHandler) {
      this.awareness.off('update', this.awarenessHandler);
      this.awarenessHandler = null;
    }
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    // Final save on cleanup
    if (this._saveDirty) {
      this._saveStateNow();
    }
  }

  /** Mark doc as dirty — will save to stateUrl within 5 seconds. */
  private _markDirty(): void {
    if (!this.stateUrl) return;
    this._saveDirty = true;
    if (!this._saveTimer) {
      this._saveTimer = setTimeout(() => {
        this._saveTimer = null;
        this._saveStateNow();
      }, 5000);
    }
  }

  /** Save current doc state to stateUrl. */
  private _saveStateNow(): void {
    if (!this.stateUrl || !this.doc || !this._saveDirty) return;
    this._saveDirty = false;
    try {
      const fullState = _sharedEncodeStateAsUpdate(this.doc);
      const url = this.stateUrl.replace('{roomId}', this.roomId);
      const csrfMeta = typeof document !== 'undefined'
        ? document.querySelector('meta[name="csrf-token"]')
        : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (csrfMeta) {
        headers['X-CSRF-TOKEN'] = csrfMeta.getAttribute('content') || '';
      }
      fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ state: base64Encode(fullState) }),
      }).catch(() => { /* silent — state save is best-effort */ });
    } catch {
      // Encoding failed — skip this save
    }
  }

  private async fetchInitialState(): Promise<void> {
    if (!this.stateUrl || !this.doc) return;
    try {
      const url = this.stateUrl.replace('{roomId}', this.roomId);
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      if (json.state && this.doc) {
        const update = base64Decode(json.state);
        _sharedApplyUpdate(this.doc, update, ORIGIN_REVERB);
      }
      this.emit('sync', true);
    } catch {
      // Initial sync failed — will receive state from peers
    }
  }
}
