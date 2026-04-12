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

describe('Recording — introspection APIs', () => {
    it('getSubjects returns unique subjects from events', () => {
        const recording = new Recording({
            version: 1,
            duration: 1000,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [
                { t: 0, type: 'animate', args: { targets: { nodes: { a: {} } }, options: {} } },
                { t: 500, type: 'animate', args: { targets: { nodes: { b: {} } }, options: {} } },
            ],
            checkpoints: [],
        });
        const subjects = recording.getSubjects();
        expect(subjects).toHaveLength(2);
        expect(subjects.find(s => s.id === 'a')).toBeDefined();
        expect(subjects.find(s => s.id === 'b')).toBeDefined();
    });

    it('getSubjects includes subjects from initialState', () => {
        const recording = new Recording({
            version: 1,
            duration: 1000,
            initialState: {
                nodes: { existing: { id: 'existing' } as any },
                edges: { e1: { id: 'e1' } as any },
                viewport: { x: 0, y: 0, zoom: 1 },
            },
            events: [],
            checkpoints: [],
        });
        const subjects = recording.getSubjects();
        expect(subjects).toHaveLength(2);
        const node = subjects.find(s => s.id === 'existing');
        expect(node).toBeDefined();
        expect(node?.kind).toBe('node');
        expect(node?.firstSeenT).toBe(0);
        const edge = subjects.find(s => s.id === 'e1');
        expect(edge).toBeDefined();
        expect(edge?.kind).toBe('edge');
    });

    it('getSubjects deduplicates subjects seen in multiple events', () => {
        const recording = new Recording({
            version: 1,
            duration: 1000,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [
                { t: 100, type: 'animate', args: { targets: { nodes: { n1: {} } }, options: {} } },
                { t: 800, type: 'animate', args: { targets: { nodes: { n1: {} } }, options: {} } },
            ],
            checkpoints: [],
        });
        const subjects = recording.getSubjects();
        expect(subjects).toHaveLength(1);
        const s = subjects[0];
        expect(s.id).toBe('n1');
        expect(s.firstSeenT).toBe(100);
        expect(s.lastSeenT).toBe(800);
    });

    it('getSubjects handles particle, converging, and structural events', () => {
        const recording = new Recording({
            version: 1,
            duration: 2000,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [
                { t: 100, type: 'particle', args: { edgeId: 'edge1' } },
                { t: 200, type: 'particle-between', args: { source: 'src', target: 'dst' } },
                { t: 300, type: 'particle-burst', args: { edgeId: 'edge2' } },
                { t: 400, type: 'converging', args: { sources: ['edgeA', 'edgeB'], options: { targetNodeId: 'hub' } } },
                { t: 500, type: 'node-add', args: { id: 'newNode' } },
                { t: 600, type: 'edge-add', args: { id: 'newEdge' } },
            ],
            checkpoints: [],
        });
        const subjects = recording.getSubjects();
        const ids = subjects.map(s => s.id);
        expect(ids).toContain('edge1');
        expect(ids).toContain('edge2');
        expect(ids).toContain('src');
        expect(ids).toContain('dst');
        expect(ids).toContain('edgeA');
        expect(ids).toContain('edgeB');
        expect(ids).toContain('hub');
        expect(ids).toContain('newNode');
        expect(ids).toContain('newEdge');
    });

    it('getActivityFor returns spans for a specific subject', () => {
        const recording = new Recording({
            version: 1,
            duration: 2000,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [
                { t: 100, type: 'animate', args: { targets: { nodes: { n1: {} } }, options: { duration: 400 } } },
                { t: 800, type: 'animate', args: { targets: { nodes: { n1: {} } }, options: { duration: 200 } } },
                { t: 500, type: 'animate', args: { targets: { nodes: { other: {} } }, options: { duration: 100 } } },
            ],
            checkpoints: [],
        });
        const spans = recording.getActivityFor('n1');
        expect(spans).toHaveLength(2);
        expect(spans[0]).toEqual({ startT: 100, endT: 500, reason: 'animate' });
        expect(spans[1]).toEqual({ startT: 800, endT: 1000, reason: 'animate' });
    });

    it('getActivityFor returns thin spans for instantaneous events', () => {
        const recording = new Recording({
            version: 1,
            duration: 1000,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [
                { t: 300, type: 'node-add', args: { id: 'newNode' } },
                { t: 700, type: 'node-remove', args: { id: 'newNode' } },
            ],
            checkpoints: [],
        });
        const spans = recording.getActivityFor('newNode');
        expect(spans).toHaveLength(2);
        expect(spans[0]).toEqual({ startT: 300, endT: 301, reason: 'node-add' });
        expect(spans[1]).toEqual({ startT: 700, endT: 701, reason: 'node-remove' });
    });

    it('getActivityFor returns empty array for unknown subject', () => {
        const recording = new Recording({
            version: 1,
            duration: 500,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [
                { t: 100, type: 'animate', args: { targets: { nodes: { a: {} } }, options: {} } },
            ],
            checkpoints: [],
        });
        expect(recording.getActivityFor('nonexistent')).toEqual([]);
    });

    it('getValueTrack samples property at checkpoints', () => {
        const recording = new Recording({
            version: 1,
            duration: 1000,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [],
            checkpoints: [
                { t: 0, canvas: { nodes: { n1: { position: { x: 0 } } }, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } } as any, inFlight: [], tagRegistry: {} },
                { t: 500, canvas: { nodes: { n1: { position: { x: 50 } } }, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } } as any, inFlight: [], tagRegistry: {} },
            ],
        });
        const track = recording.getValueTrack('nodes.n1.position.x');
        expect(track).toEqual([{ t: 0, v: 0 }, { t: 500, v: 50 }]);
    });

    it('getValueTrack returns empty array for nonexistent path', () => {
        const recording = new Recording({
            version: 1,
            duration: 500,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [],
            checkpoints: [
                { t: 0, canvas: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } }, inFlight: [], tagRegistry: {} },
            ],
        });
        expect(recording.getValueTrack('nodes.ghost.position.x')).toEqual([]);
    });

    it('getValueTrack handles multiple checkpoints and nested paths', () => {
        const recording = new Recording({
            version: 1,
            duration: 2000,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [],
            checkpoints: [
                { t: 0, canvas: { nodes: {}, edges: {}, viewport: { x: 10, y: 20, zoom: 1 } }, inFlight: [], tagRegistry: {} },
                { t: 1000, canvas: { nodes: {}, edges: {}, viewport: { x: 100, y: 200, zoom: 2 } }, inFlight: [], tagRegistry: {} },
            ],
        });
        expect(recording.getValueTrack('viewport.x')).toEqual([{ t: 0, v: 10 }, { t: 1000, v: 100 }]);
        expect(recording.getValueTrack('viewport.zoom')).toEqual([{ t: 0, v: 1 }, { t: 1000, v: 2 }]);
    });

    it('getStateAt at t=0 returns initial canvas state', () => {
        const recording = new Recording({
            version: 1,
            duration: 1000,
            initialState: {
                nodes: { n1: { id: 'n1', position: { x: 10, y: 20 } } as any },
                edges: {},
                viewport: { x: 0, y: 0, zoom: 1 },
            },
            events: [],
            checkpoints: [],
        });
        const state = recording.getStateAt(0);
        expect(state.nodes['n1']).toBeDefined();
        expect(state.nodes['n1'].position?.x).toBe(10);
    });

    it('getStateAt returns virtual state at target time', () => {
        const recording = new Recording({
            version: 1,
            duration: 1000,
            initialState: {
                nodes: { n1: { id: 'n1', position: { x: 0, y: 0 } } as any },
                edges: {},
                viewport: { x: 0, y: 0, zoom: 1 },
            },
            events: [
                {
                    t: 0,
                    type: 'animate',
                    args: {
                        targets: { nodes: { n1: { position: { x: 100, y: 0 } } } },
                        options: { duration: 1000 },
                    },
                },
            ],
            checkpoints: [],
        });
        // At t=500ms, should be approximately halfway through the animation
        const state = recording.getStateAt(500);
        const x = state.nodes['n1']?.position?.x ?? 0;
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(100);
    });

    it('getStateAt uses nearest checkpoint when available', () => {
        const recording = new Recording({
            version: 1,
            duration: 2000,
            initialState: { nodes: {}, edges: {}, viewport: { x: 0, y: 0, zoom: 1 } },
            events: [],
            checkpoints: [
                {
                    t: 1000,
                    canvas: {
                        nodes: { cp: { id: 'cp', position: { x: 99, y: 0 } } as any },
                        edges: {},
                        viewport: { x: 0, y: 0, zoom: 1 },
                    },
                    inFlight: [],
                    tagRegistry: {},
                },
            ],
        });
        // Should restore from checkpoint at t=1000 and return that state
        const state = recording.getStateAt(1000);
        expect(state.nodes['cp']).toBeDefined();
        expect(state.nodes['cp'].position?.x).toBe(99);
    });
});
