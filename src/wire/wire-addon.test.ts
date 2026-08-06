// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAddon, unregisterAddon, _resetRegistry } from '../core/registry';
import AlpineFlowWire from './index';

afterEach(() => { _resetRegistry(); vi.restoreAllMocks(); });

function fakeCanvas(overrides: any = {}) {
  const config: any = { wireEvents: {} };
  return {
    $wire: { on: vi.fn((_e: string, _cb: any) => vi.fn()) },
    _config: config,
    _liveConfig: () => config,
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

  it('warns and does NOT write to _config when core lacks _liveConfig (no silent dead-forward)', () => {
    AlpineFlowWire({ magic: vi.fn(), data: vi.fn() } as any);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Simulate an older core: no _liveConfig, only the stripped _config copy,
    // which carries a real wireEvents mapping.
    const staleConfig: any = { wireEvents: { 'node-click': 'handleNodeClick' } };
    const canvas = fakeCanvas({ _liveConfig: undefined, _config: staleConfig });

    (getAddon('wire') as any).setup(canvas);

    // Must NOT resurrect the dead-forward bug by writing a wrapper onto the copy.
    expect(staleConfig.onNodeClick).toBeUndefined();
    // Must fail loudly, not silently.
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[wire]'));
    // Server->client commands don't depend on config; they still register.
    expect(canvas.$wire.on).toHaveBeenCalled();
  });
});
