import { describe, it, expect } from 'vitest';
import { Recording } from './recording';
import type { RecordingData } from './types';

describe('Recording', () => {
    const minimalData: RecordingData = {
        version: 1,
        duration: 0,
        initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
        events: [],
        checkpoints: [],
    };

    it('constructs with minimal data', () => {
        const r = new Recording(minimalData);
        expect(r.version).toBe(1);
        expect(r.duration).toBe(0);
    });

    it('is immutable', () => {
        const r = new Recording(minimalData);
        expect(() => { (r as any).version = 99; }).toThrow();
    });

    it('initialState is frozen', () => {
        const r = new Recording({
            ...minimalData,
            initialState: { nodes: { a: { id: 'a' } } as any, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
        });
        expect(() => { (r.initialState as any).nodes.b = { id: 'b' }; }).toThrow();
    });

    it('roundtrips through toJSON/fromJSON', () => {
        const original = new Recording({
            ...minimalData,
            duration: 1500,
            events: [{ t: 100, type: 'animate', args: { target: 'a' } }],
        });
        const json = original.toJSON();
        const restored = Recording.fromJSON(json);
        expect(restored.duration).toBe(1500);
        expect(restored.events).toEqual(original.events);
    });

    it('preserves Date objects in metadata via structuredClone', () => {
        const date = new Date('2026-01-01');
        const r = new Recording({ ...minimalData, metadata: { createdAt: date } });
        expect(r.metadata.createdAt).toBeInstanceOf(Date);
    });

    it('throws when version is newer than supported', () => {
        expect(() => Recording.fromJSON({ ...minimalData, version: 999 })).toThrow(/newer than supported/);
    });
});
