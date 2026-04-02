// resources/js/alpineflow/core/registry.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { registerAddon, getAddon, _resetRegistry } from './registry';

describe('addon registry', () => {
  beforeEach(() => _resetRegistry());

  it('registers and retrieves an addon', () => {
    const fn = () => 'hello';
    registerAddon('test:thing', fn);
    expect(getAddon('test:thing')).toBe(fn);
  });

  it('returns undefined for unregistered addon', () => {
    expect(getAddon('nonexistent')).toBeUndefined();
  });

  it('overwrites an addon with the same name', () => {
    registerAddon('test:a', () => 1);
    registerAddon('test:a', () => 2);
    expect(getAddon('test:a')!()).toBe(2);
  });
});
