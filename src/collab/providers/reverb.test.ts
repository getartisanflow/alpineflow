import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { ReverbProvider, base64Encode, base64Decode } from './reverb';

// Mock global Echo (Laravel Echo)
function makeMockChannel() {
  const listeners: Record<string, Function[]> = {};
  return {
    whisper: vi.fn(),
    listenForWhisper(event: string, cb: Function) {
      (listeners[event] ??= []).push(cb);
      return this;
    },
    _fire(event: string, data: any) {
      (listeners[event] ?? []).forEach(cb => cb(data));
    },
    stopListeningForWhisper: vi.fn(),
    leave: vi.fn(),
  };
}

describe('base64 encode/decode', () => {
  it('round-trips a Uint8Array', () => {
    const original = new Uint8Array([1, 2, 3, 255, 0, 128]);
    const encoded = base64Encode(original);
    expect(typeof encoded).toBe('string');
    const decoded = base64Decode(encoded);
    expect(decoded).toEqual(original);
  });

  it('round-trips a Yjs update', () => {
    const doc = new Y.Doc();
    doc.getMap('test').set('key', 'value');
    const update = Y.encodeStateAsUpdate(doc);
    const encoded = base64Encode(update);
    const decoded = base64Decode(encoded);
    expect(decoded).toEqual(update);

    // Verify decoded update applies correctly
    const doc2 = new Y.Doc();
    Y.applyUpdate(doc2, decoded);
    expect(doc2.getMap('test').get('key')).toBe('value');
  });
});

describe('ReverbProvider', () => {
  let provider: ReverbProvider;
  let mockChannel: ReturnType<typeof makeMockChannel>;

  beforeEach(() => {
    mockChannel = makeMockChannel();
    (globalThis as any).Echo = {
      private: vi.fn().mockReturnValue(mockChannel),
    };

    provider = new ReverbProvider({
      roomId: 'test-room',
      channel: 'flow.{roomId}',
      user: { name: 'Alice', color: '#8b5cf6' },
    });
  });

  it('stores roomId from config', () => {
    expect(provider.roomId).toBe('test-room');
  });

  it('starts disconnected', () => {
    expect(provider.connected).toBe(false);
  });

  it('subscribes to the correct Echo channel on connect', () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    provider.connect(doc, awareness);

    expect((globalThis as any).Echo.private).toHaveBeenCalledWith('flow.test-room');
  });

  it('sends base64-encoded Yjs updates via whisper', () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    provider.connect(doc, awareness);

    // Trigger a local doc change
    doc.transact(() => {
      doc.getMap('nodes').set('n1', new Y.Map());
    });

    expect(mockChannel.whisper).toHaveBeenCalledWith(
      'yjs-update',
      expect.objectContaining({ data: expect.any(String) }),
    );
  });

  it('applies incoming whispered Yjs updates', () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    provider.connect(doc, awareness);

    // Create a remote update
    const remoteDoc = new Y.Doc();
    remoteDoc.getMap('nodes').set('remote-node', new Y.Map());
    const update = Y.encodeStateAsUpdate(remoteDoc);

    // Simulate receiving it via whisper
    mockChannel._fire('yjs-update', { data: base64Encode(update) });

    expect(doc.getMap('nodes').has('remote-node')).toBe(true);
  });

  it('cleans up on destroy', () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    provider.connect(doc, awareness);
    provider.destroy();

    expect(provider.connected).toBe(false);
  });
});
