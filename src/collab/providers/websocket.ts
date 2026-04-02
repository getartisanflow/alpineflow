import type { Doc as YDoc } from 'yjs';
import type { Awareness } from 'y-protocols/awareness';
import { WebsocketProvider as WsProvider } from 'y-websocket';
import type { CollabProvider, CollabStatus, CollabUser } from '../types';

interface WebSocketProviderConfig {
  roomId: string;
  url: string;
  user: CollabUser;
}

type EventMap = {
  status: CollabStatus;
  sync: boolean;
};

/**
 * WebSocketProvider — Wraps y-websocket for direct WebSocket transport.
 * Binary frames, most efficient. Requires a y-websocket server.
 */
export class WebSocketProvider implements CollabProvider {
  readonly roomId: string;
  private url: string;
  private user: CollabUser;
  private wsProvider: any = null;
  private listeners: { [K in keyof EventMap]?: Set<(val: EventMap[K]) => void> } = {};
  private _connected = false;

  constructor(config: WebSocketProviderConfig) {
    this.roomId = config.roomId;
    this.url = config.url;
    this.user = config.user;
  }

  get connected(): boolean {
    return this._connected;
  }

  connect(doc: YDoc, awareness: Awareness): void {
    this.wsProvider = new WsProvider(this.url, this.roomId, doc, {
      awareness,
    });

    this.wsProvider.on('status', (evt: { status: string }) => {
      const status = evt.status as CollabStatus;
      this._connected = status === 'connected';
      this.emit('status', status);
    });

    this.wsProvider.on('sync', (synced: boolean) => {
      this.emit('sync', synced);
    });
  }

  disconnect(): void {
    this.wsProvider?.disconnect();
    this._connected = false;
  }

  destroy(): void {
    this.wsProvider?.destroy();
    this.wsProvider = null;
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
}
