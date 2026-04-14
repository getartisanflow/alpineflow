import { describe, it, expect, vi } from 'vitest';
import { safeClone } from './clone';

describe('safeClone', () => {
    it('uses structuredClone for plain cloneable values', () => {
        const input = { a: 1, b: [2, 3], c: new Date('2026-01-01') };
        const out = safeClone(input);
        expect(out).toEqual(input);
        expect(out).not.toBe(input);
        expect(out.c).toBeInstanceOf(Date);
    });

    it('preserves Maps and Sets via structuredClone', () => {
        const input = { m: new Map([['k', 'v']]), s: new Set([1, 2]) };
        const out = safeClone(input);
        expect(out.m).toBeInstanceOf(Map);
        expect(out.m.get('k')).toBe('v');
        expect(out.s).toBeInstanceOf(Set);
        expect(out.s.has(2)).toBe(true);
    });

    it('falls back to JSON clone when input contains a function', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const input = { label: 'x', fn: () => 'not cloneable' };
        const out = safeClone(input);
        expect(out.label).toBe('x');
        // Functions are stripped by JSON fallback
        expect((out as any).fn).toBeUndefined();
        warnSpy.mockRestore();
    });

    it('falls back to JSON clone for Proxy that blocks structuredClone', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const source = { label: 'proxied', nested: { x: 1 } };
        // A Proxy with a function getter mimics frameworks that expose reactive
        // getters — structuredClone throws, fallback preserves the POJO shape.
        const proxy: any = new Proxy(source, {
            get(target, prop) {
                if (prop === '_reactive') return () => 'nope';
                return (target as any)[prop];
            },
        });
        const out = safeClone({ data: proxy });
        expect(out.data.label).toBe('proxied');
        expect(out.data.nested.x).toBe(1);
        warnSpy.mockRestore();
    });

    it('warns only once per session on fallback', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // First fallback already triggered by earlier tests — counting additional calls
        const before = warnSpy.mock.calls.length;
        safeClone({ fn: () => 1 });
        safeClone({ fn: () => 2 });
        safeClone({ fn: () => 3 });
        const after = warnSpy.mock.calls.length;
        // No new warnings (warn-once already latched)
        expect(after).toBe(before);
        warnSpy.mockRestore();
    });
});
