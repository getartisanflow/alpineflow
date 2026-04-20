import { describe, it, expect } from 'vitest';
import registerSchemaAddon from './index';

describe('schema addon scaffold', () => {
    it('exports a plugin function', () => {
        expect(typeof registerSchemaAddon).toBe('function');
    });

    it('plugin function does not throw when called with a stub Alpine', () => {
        expect(() => registerSchemaAddon({} as any)).not.toThrow();
    });
});
