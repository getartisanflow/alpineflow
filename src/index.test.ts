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

  // Generous timeout: this test dynamically imports the ENTIRE ./index graph
  // (after vi.resetModules(), so nothing is cached). Under full-suite worker
  // contention that import alone can exceed vitest's 5s default — it is an
  // import-cost ceiling, not a logic test, so give it room.
  it('only registers directives once even if called multiple times', { timeout: 20_000 }, async () => {
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
