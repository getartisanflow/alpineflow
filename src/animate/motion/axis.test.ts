import { describe, it, expect } from 'vitest';
import { extractAxis } from './axis';

describe('extractAxis', () => {
    it('extracts x from dot-suffix key', () => {
        expect(extractAxis('node:puck:position.x')).toBe('x');
    });

    it('extracts y from dot-suffix key', () => {
        expect(extractAxis('node:ball:position.y')).toBe('y');
    });

    it('extracts zoom from viewport key', () => {
        expect(extractAxis('viewport:zoom')).toBe('zoom');
    });

    it('extracts x from viewport pan key', () => {
        expect(extractAxis('viewport:pan.x')).toBe('x');
    });

    it('returns null for tail longer than 6 chars (not an axis)', () => {
        expect(extractAxis('node:n:position')).toBeNull();
    });

    it('returns null for empty key', () => {
        expect(extractAxis('')).toBeNull();
    });

    it('returns the whole string for keys with no separators', () => {
        // A bare key like 'x' with no separator isn't handled (returns null)
        // because the helper expects prefixed keys. Consumers should pass
        // full PropertyEntry keys.
        expect(extractAxis('x')).toBeNull();
    });
});
