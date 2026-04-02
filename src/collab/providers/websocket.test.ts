import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { WebSocketProvider } from './websocket';
import { WebsocketProvider as MockWS } from 'y-websocket';

// Mock y-websocket since we can't start a real server in unit tests
vi.mock('y-websocket', () => {
  return {
    WebsocketProvider: vi.fn().mockImplementation(function (
      this: any,
      _url: string,
      _room: string,
      doc: any,
      opts: any,
    ) {
      const listeners: Record<string, Function[]> = {};
      this.awareness = opts?.awareness ?? new Awareness(doc);
      this.wsconnected = false;
      this.synced = false;
      this.on = function (event: string, cb: Function) {
        (listeners[event] ??= []).push(cb);
      };
      this.off = function (event: string, cb: Function) {
        listeners[event] = (listeners[event] ?? []).filter((f: Function) => f !== cb);
      };
      this.disconnect = vi.fn();
      this.destroy = vi.fn();
      this.connect = vi.fn();
      this._listeners = listeners;
      this._simulateStatus = function (status: string) {
        (listeners['status'] ?? []).forEach(cb => cb({ status }));
      };
      this._simulateSync = function (synced: boolean) {
        (listeners['sync'] ?? []).forEach(cb => cb(synced));
      };
    }),
  };
});

const MockWSFn = vi.mocked(MockWS);

describe('WebSocketProvider', () => {
  let provider: WebSocketProvider;

  beforeEach(() => {
    MockWSFn.mockClear();
    provider = new WebSocketProvider({
      roomId: 'test-room',
      url: 'ws://localhost:1234',
      user: { name: 'Alice', color: '#8b5cf6' },
    });
  });

  it('stores roomId from config', () => {
    expect(provider.roomId).toBe('test-room');
  });

  it('starts disconnected before connect()', () => {
    expect(provider.connected).toBe(false);
  });

  it('connects to y-websocket with correct params', () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    provider.connect(doc, awareness);

    expect(MockWSFn).toHaveBeenCalledWith(
      'ws://localhost:1234',
      'test-room',
      doc,
      expect.objectContaining({ awareness }),
    );
  });

  it('emits status events', () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const statusCb = vi.fn();
    provider.on('status', statusCb);
    provider.connect(doc, awareness);

    const instance = MockWSFn.mock.instances[0] as any;
    instance._simulateStatus('connected');
    expect(statusCb).toHaveBeenCalledWith('connected');
  });

  it('emits sync events', () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const syncCb = vi.fn();
    provider.on('sync', syncCb);
    provider.connect(doc, awareness);

    const instance = MockWSFn.mock.instances[0] as any;
    instance._simulateSync(true);
    expect(syncCb).toHaveBeenCalledWith(true);
  });

  it('cleans up on destroy', () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    provider.connect(doc, awareness);
    provider.destroy();
    expect(provider.connected).toBe(false);
  });
});
