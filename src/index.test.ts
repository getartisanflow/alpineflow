import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock alpinejs to avoid MutationObserver in Node
vi.mock('alpinejs', () => ({
  default: {},
  reactive: (v: any) => v,
}));

describe('AlpineFlow plugin idempotency', () => {
  beforeEach(() => {
    // Reset module registry so _registered resets between tests
    vi.resetModules();
  });

  it('only registers directives once even if called multiple times', async () => {
    const { default: AlpineFlow } = await import('./index');

    const directiveCalls: string[] = [];
    const fakeAlpine = {
      directive: vi.fn((name: string) => { directiveCalls.push(name); }),
      magic: vi.fn(),
      store: vi.fn(),
      data: vi.fn(),
    };

    AlpineFlow(fakeAlpine as any);
    const firstCallCount = fakeAlpine.directive.mock.calls.length;

    AlpineFlow(fakeAlpine as any);
    const secondCallCount = fakeAlpine.directive.mock.calls.length;

    // Second call should be a no-op — no new directive registrations
    expect(secondCallCount).toBe(firstCallCount);
  });
});
