// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAddon, unregisterAddon, _resetRegistry } from '../core/registry';
import AlpineFlowWire from './index';

afterEach(() => { _resetRegistry(); vi.restoreAllMocks(); });

function fakeCanvas(overrides: any = {}) {
  return {
    $wire: { on: vi.fn((_e: string, _cb: any) => vi.fn()) },
    _config: { wireEvents: {} },
    animate: vi.fn(), sendParticle: vi.fn(), update: vi.fn(),
    selectNodes: vi.fn(), selectEdges: vi.fn(), setNodeLocked: vi.fn(), setNodeHidden: vi.fn(),
    getNode: vi.fn(), getEdge: vi.fn(), edges: [], deselectAll: vi.fn(),
    ...overrides,
  };
}

describe('AlpineFlowWire addon', () => {
  it('registers under the "wire" key', () => {
    AlpineFlowWire({ magic: vi.fn(), data: vi.fn() } as any);
    expect(getAddon('wire')).toBeTruthy();
    expect(typeof (getAddon('wire') as any).setup).toBe('function');
  });

  it('setup wires $wire.on command listeners and returns a cleanup', () => {
    AlpineFlowWire({ magic: vi.fn(), data: vi.fn() } as any);
    const canvas = fakeCanvas();
    const cleanup = (getAddon('wire') as any).setup(canvas);
    expect(canvas.$wire.on).toHaveBeenCalled();       // server->client commands registered
    expect(typeof cleanup).toBe('function');
  });

  it('setup is a no-op (no throw, no cleanup work) when $wire is absent', () => {
    AlpineFlowWire({ magic: vi.fn(), data: vi.fn() } as any);
    const canvas = fakeCanvas({ $wire: undefined });
    expect(() => (getAddon('wire') as any).setup(canvas)).not.toThrow();
  });
});
