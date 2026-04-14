import { describe, it, expect } from 'vitest';
import type { RecordingEvent } from './types';
import { firstEventIndexAfter, firstEventIndexAtOrAfter } from './event-cursor';

function mkEvents(timestamps: number[]): RecordingEvent[] {
    return timestamps.map((t) => ({ t, type: 'animate', args: {} }));
}

describe('event cursor binary search', () => {
    describe('firstEventIndexAfter', () => {
        it('returns 0 for boundary < first event', () => {
            const events = mkEvents([10, 20, 30]);
            expect(firstEventIndexAfter(events, -1)).toBe(0);
            expect(firstEventIndexAfter(events, 5)).toBe(0);
        });

        it('returns events.length when all events are <= boundary', () => {
            const events = mkEvents([10, 20, 30]);
            expect(firstEventIndexAfter(events, 30)).toBe(3);
            expect(firstEventIndexAfter(events, 100)).toBe(3);
        });

        it('returns index past the last event equal to boundary', () => {
            const events = mkEvents([10, 20, 20, 30]);
            expect(firstEventIndexAfter(events, 20)).toBe(3);
        });

        it('handles empty events', () => {
            expect(firstEventIndexAfter([], 0)).toBe(0);
        });

        it('binary-searches correctly across mid points', () => {
            const events = mkEvents([0, 100, 200, 300, 400, 500, 600, 700, 800, 900]);
            expect(firstEventIndexAfter(events, 250)).toBe(3);
            expect(firstEventIndexAfter(events, 500)).toBe(6);
            expect(firstEventIndexAfter(events, 0)).toBe(1);
        });
    });

    describe('firstEventIndexAtOrAfter', () => {
        it('returns index of exact match when present', () => {
            const events = mkEvents([10, 20, 30]);
            expect(firstEventIndexAtOrAfter(events, 20)).toBe(1);
        });

        it('returns first event > boundary when no exact match', () => {
            const events = mkEvents([10, 20, 30]);
            expect(firstEventIndexAtOrAfter(events, 15)).toBe(1);
            expect(firstEventIndexAtOrAfter(events, 25)).toBe(2);
        });

        it('returns 0 for events at t=0 when boundary is 0', () => {
            const events = mkEvents([0, 0, 100]);
            expect(firstEventIndexAtOrAfter(events, 0)).toBe(0);
        });

        it('returns events.length for boundary past all events', () => {
            const events = mkEvents([10, 20, 30]);
            expect(firstEventIndexAtOrAfter(events, 100)).toBe(3);
        });

        it('handles empty events', () => {
            expect(firstEventIndexAtOrAfter([], 0)).toBe(0);
        });
    });
});
