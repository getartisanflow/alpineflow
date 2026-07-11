import { describe, it, expect } from 'vitest';
import { deepMerge, mergeEntitiesById } from './deep-merge';

describe('deepMerge', () => {
  it('merges top-level keys', () => {
    const target = { a: 1, b: 2 };
    deepMerge(target, { b: 3, c: 4 });
    expect(target).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('deep merges nested objects', () => {
    const target = { data: { label: 'Server', load: 50, status: 'ok' } };
    deepMerge(target, { data: { load: 85 } });
    expect(target).toEqual({ data: { label: 'Server', load: 85, status: 'ok' } });
  });

  it('deep merges three levels deep', () => {
    const target = { a: { b: { c: 1, d: 2 }, e: 3 } };
    deepMerge(target, { a: { b: { c: 99 } } });
    expect(target).toEqual({ a: { b: { c: 99, d: 2 }, e: 3 } });
  });

  it('replaces arrays (does not merge them)', () => {
    const target = { tags: ['prod', 'us-east'] };
    deepMerge(target, { tags: ['staging'] });
    expect(target).toEqual({ tags: ['staging'] });
  });

  it('replaces array with empty array', () => {
    const target = { items: [1, 2, 3] };
    deepMerge(target, { items: [] });
    expect(target).toEqual({ items: [] });
  });

  it('removes key when value is null', () => {
    const target = { a: 1, b: 2, c: 3 };
    deepMerge(target, { b: null });
    expect(target).toEqual({ a: 1, c: 3 });
    expect('b' in target).toBe(false);
  });

  it('removes nested key when value is null', () => {
    const target = { data: { label: 'Server', class: 'highlight' } };
    deepMerge(target, { data: { class: null } });
    expect(target).toEqual({ data: { label: 'Server' } });
  });

  it('ignores undefined values', () => {
    const target = { a: 1, b: 2 };
    deepMerge(target, { a: undefined, b: 3 });
    expect(target).toEqual({ a: 1, b: 3 });
  });

  it('overwrites primitive with object', () => {
    const target = { a: 'string' } as any;
    deepMerge(target, { a: { nested: true } });
    expect(target).toEqual({ a: { nested: true } });
  });

  it('overwrites object with primitive', () => {
    const target = { a: { nested: true } } as any;
    deepMerge(target, { a: 'string' });
    expect(target).toEqual({ a: 'string' });
  });

  it('handles empty source', () => {
    const target = { a: 1 };
    deepMerge(target, {});
    expect(target).toEqual({ a: 1 });
  });

  it('does not modify the source object', () => {
    const target = { a: 1 };
    const source = { b: { c: 2 } };
    deepMerge(target, source);
    source.b.c = 999;
    expect((target as any).b.c).toBe(2);
  });

  it('ignores __proto__ key to prevent prototype pollution', () => {
    const target = { a: 1 };
    const malicious = JSON.parse('{"__proto__":{"polluted":true}}');
    deepMerge(target, malicious);
    expect(({} as any).polluted).toBeUndefined();
    expect((target as any).__proto__).toBe(Object.prototype);
  });

  it('ignores constructor key to prevent prototype pollution', () => {
    const target = { a: 1 };
    deepMerge(target, { constructor: { prototype: { polluted: true } } });
    expect(({} as any).polluted).toBeUndefined();
  });

  describe('color type switching', () => {
    it('replaces a string with an object', () => {
      const target = { color: '#ef4444' };
      const result = deepMerge(target, { color: { from: '#22c55e', to: '#ef4444' } });
      expect(result.color).toEqual({ from: '#22c55e', to: '#ef4444' });
    });

    it('replaces an object with a string', () => {
      const target = { color: { from: '#22c55e', to: '#ef4444' } };
      const result = deepMerge(target, { color: '#374151' });
      expect(result.color).toBe('#374151');
    });
  });
});

describe('mergeEntitiesById', () => {
  it('preserves object identity for surviving ids', () => {
    const a = { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } };
    const existing = [a];
    const merged = mergeEntitiesById(existing, [
      { id: 'a', position: { x: 9, y: 0 }, data: { label: 'A' } },
    ]);
    expect(merged[0]).toBe(a); // same reference
    expect(a.position).toEqual({ x: 9, y: 0 });
  });

  it('does not reassign properties that are deep-equal (no spurious reactive writes)', () => {
    const data = { label: 'A' };
    const a = { id: 'a', data };
    mergeEntitiesById([a], [{ id: 'a', data: { label: 'A' } }]);
    expect(a.data).toBe(data); // untouched — deep-equal skipped
  });

  it('removes stale keys when deleteMissing is true (default)', () => {
    const a: any = { id: 'a', selected: true };
    mergeEntitiesById([a], [{ id: 'a' } as any]);
    expect('selected' in a).toBe(false);
  });

  it('keeps missing keys when deleteMissing is false', () => {
    const a: any = { id: 'a', dimensions: { width: 100, height: 40 } };
    mergeEntitiesById([a], [{ id: 'a' } as any], { deleteMissing: false });
    expect(a.dimensions).toEqual({ width: 100, height: 40 });
  });

  it('adds new ids and drops removed ids', () => {
    const merged = mergeEntitiesById([{ id: 'a' } as any], [{ id: 'b' } as any]);
    expect(merged.map((e) => e.id)).toEqual(['b']);
  });
});
