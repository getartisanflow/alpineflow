import { describe, it, expect } from 'vitest';
import {
    faithfulRenderer,
    outlineRenderer,
    activityRenderer,
    registerThumbnailRenderer,
    getThumbnailRenderer,
    hasThumbnailRenderer,
} from './thumbnail';
import type { ThumbnailRenderer } from './thumbnail';
import { Recording } from './recording';
import type { CanvasSnapshot, InFlightAnimation } from './types';

const simpleState: CanvasSnapshot = {
    nodes: {
        a: { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 40 } } as any,
        b: { id: 'b', position: { x: 200, y: 100 }, dimensions: { width: 100, height: 40 } } as any,
    },
    edges: {
        e1: { id: 'e1', source: 'a', target: 'b' } as any,
    },
    viewport: { x: 0, y: 0, zoom: 1 },
};

const emptyState: CanvasSnapshot = {
    nodes: {},
    edges: {},
    viewport: { x: 0, y: 0, zoom: 1 },
};

describe('Thumbnail renderers', () => {
    it('registers built-in faithful/outline/activity renderers', () => {
        expect(hasThumbnailRenderer('faithful')).toBe(true);
        expect(hasThumbnailRenderer('outline')).toBe(true);
        expect(hasThumbnailRenderer('activity')).toBe(true);
        expect(getThumbnailRenderer('faithful')).toBe(faithfulRenderer);
        expect(getThumbnailRenderer('outline')).toBe(outlineRenderer);
        expect(getThumbnailRenderer('activity')).toBe(activityRenderer);
    });

    it('faithful renderer produces SVG with node rects', () => {
        const svg = faithfulRenderer.render(simpleState, { width: 100, height: 80 });
        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
        expect(svg).toContain('<rect');
        expect(svg).toContain('width="100"');
        expect(svg).toContain('height="80"');
    });

    it('faithful renderer produces edges as lines', () => {
        const svg = faithfulRenderer.render(simpleState, { width: 100, height: 80 });
        expect(svg).toContain('<line');
    });

    it('faithful renderer uses fill-opacity for node fill', () => {
        const svg = faithfulRenderer.render(simpleState, { width: 100, height: 80 });
        expect(svg).toContain('fill-opacity="0.2"');
    });

    it('outline renderer produces SVG without fill on rects', () => {
        const svg = outlineRenderer.render(simpleState, { width: 100, height: 80 });
        expect(svg).toContain('<svg');
        expect(svg).toContain('<rect');
        expect(svg).toContain('fill="none"');
        expect(svg).not.toContain('fill-opacity');
    });

    it('outline renderer uses slightly stronger strokes than faithful', () => {
        const svg = outlineRenderer.render(simpleState, { width: 100, height: 80 });
        expect(svg).toContain('stroke-width="1.5"');
    });

    it('activity renderer highlights inFlight nodes with higher opacity', () => {
        const inFlight: InFlightAnimation[] = [
            {
                handleId: 'h1',
                type: 'eased',
                targets: { nodes: { a: {} } as any },
                startTime: 0,
                direction: 'forward',
                currentValues: {},
            },
        ];
        const svg = activityRenderer.render(simpleState, { width: 100, height: 80, inFlight });
        // Active node 'a' should have high fill-opacity
        expect(svg).toContain('fill-opacity="0.8"');
        // Inactive node 'b' should be greyed out
        expect(svg).toContain('opacity="0.3"');
    });

    it('activity renderer with no inFlight greys out all nodes', () => {
        const svg = activityRenderer.render(simpleState, { width: 100, height: 80 });
        expect(svg).toContain('opacity="0.3"');
        expect(svg).not.toContain('fill-opacity="0.8"');
    });

    it('activity renderer with empty inFlight array greys out all nodes', () => {
        const svg = activityRenderer.render(simpleState, { width: 100, height: 80, inFlight: [] });
        expect(svg).not.toContain('fill-opacity="0.8"');
    });

    it('empty canvas returns valid SVG from faithful', () => {
        const svg = faithfulRenderer.render(emptyState, { width: 50, height: 50 });
        expect(svg).toContain('<svg');
        expect(svg).toContain('width="50"');
        expect(svg).toContain('height="50"');
        expect(svg).toContain('</svg>');
        expect(svg).not.toContain('<rect');
    });

    it('empty canvas returns valid SVG from outline', () => {
        const svg = outlineRenderer.render(emptyState, { width: 50, height: 50 });
        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
        expect(svg).not.toContain('<rect');
    });

    it('empty canvas returns valid SVG from activity', () => {
        const svg = activityRenderer.render(emptyState, { width: 50, height: 50 });
        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
        expect(svg).not.toContain('<rect');
    });

    it('faithful renderer sets viewBox based on node bounding box with padding', () => {
        const svg = faithfulRenderer.render(simpleState, { width: 100, height: 80 });
        expect(svg).toContain('viewBox=');
        // Bounding box: x from 0 to 300, y from 0 to 140, with 20px pad each side
        // minX = -20, minY = -20
        expect(svg).toContain('viewBox="-20 -20');
    });

    it('custom renderer can be registered and retrieved', () => {
        const customRenderer: ThumbnailRenderer = {
            render(_state, { width, height }) {
                return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><text>custom</text></svg>`;
            },
        };

        registerThumbnailRenderer('custom-test', customRenderer);
        expect(hasThumbnailRenderer('custom-test')).toBe(true);

        const retrieved = getThumbnailRenderer('custom-test');
        expect(retrieved).toBe(customRenderer);

        const svg = retrieved!.render(simpleState, { width: 40, height: 30 });
        expect(svg).toContain('custom');
    });

    it('getThumbnailRenderer returns undefined for unknown name', () => {
        expect(getThumbnailRenderer('nonexistent-renderer-xyz')).toBeUndefined();
    });

    it('hasThumbnailRenderer returns false for unknown name', () => {
        expect(hasThumbnailRenderer('nonexistent-renderer-xyz')).toBe(false);
    });
});

describe('Recording.renderThumbnailAt', () => {
    const recordingData = {
        version: 1 as const,
        duration: 1000,
        initialState: {
            nodes: {
                n1: { id: 'n1', position: { x: 10, y: 20 }, dimensions: { width: 120, height: 40 } } as any,
                n2: { id: 'n2', position: { x: 200, y: 20 }, dimensions: { width: 120, height: 40 } } as any,
            },
            edges: {
                e1: { id: 'e1', source: 'n1', target: 'n2' } as any,
            },
            viewport: { x: 0, y: 0, zoom: 1 },
        },
        events: [],
        checkpoints: [],
    };

    it('returns an SVG string at t=0 using default faithful renderer', () => {
        const recording = new Recording(recordingData);
        const svg = recording.renderThumbnailAt(0, { width: 200, height: 150 });
        expect(typeof svg).toBe('string');
        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
        expect(svg).toContain('<rect');
    });

    it('accepts explicit renderer name', () => {
        const recording = new Recording(recordingData);
        const svg = recording.renderThumbnailAt(0, { width: 100, height: 80, renderer: 'outline' });
        expect(svg).toContain('fill="none"');
    });

    it('throws on unknown renderer name', () => {
        const recording = new Recording(recordingData);
        expect(() =>
            recording.renderThumbnailAt(0, { width: 100, height: 80, renderer: 'does-not-exist' }),
        ).toThrow(/Unknown thumbnail renderer/);
    });

    it('works at non-zero t values', () => {
        const recording = new Recording(recordingData);
        const svg = recording.renderThumbnailAt(500, { width: 100, height: 80 });
        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
    });
});
