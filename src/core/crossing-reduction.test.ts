import { describe, it, expect } from 'vitest';
import type { RoutePoint } from './edge-paths/orthogonal';
import {
  resolveChannelGap, DEFAULT_CHANNEL_GAP, segmentsCross, countCrossings,
  dominantRun, groupChannels, assignOffsets, offsetRun, routeHitsObstacles,
} from './crossing-reduction';

const p = (x: number, y: number): RoutePoint => ({ x, y, index: 0 });

describe('resolveChannelGap', () => {
  it('null when disabled, default for true, object tunes it', () => {
    expect(resolveChannelGap(false)).toBeNull();
    expect(resolveChannelGap(undefined)).toBeNull();
    expect(resolveChannelGap(true)).toBe(DEFAULT_CHANNEL_GAP);
    expect(resolveChannelGap({ channelGap: 9 })).toBe(9);
    expect(resolveChannelGap({})).toBe(DEFAULT_CHANNEL_GAP);
  });
});

describe('segmentsCross / countCrossings', () => {
  it('detects a proper X, ignores shared endpoints and parallels', () => {
    expect(segmentsCross(p(0,0), p(10,10), p(0,10), p(10,0))).toBe(true);
    expect(segmentsCross(p(0,0), p(10,0), p(10,0), p(10,10))).toBe(false); // shared endpoint
    expect(segmentsCross(p(0,0), p(10,0), p(0,5), p(10,5))).toBe(false);   // parallel
  });
  it('counts crossings between two routes, never within one', () => {
    const x1 = [p(0,0), p(20,20)];
    const x2 = [p(0,20), p(20,0)];
    expect(countCrossings([x1, x2])).toBe(1);   // one proper X
    expect(countCrossings([x1])).toBe(0);       // a single route never self-counts
    const parallel = [p(0,0), p(20,0)];
    expect(countCrossings([x1, parallel])).toBe(0); // disjoint / non-crossing
  });
});

describe('dominantRun', () => {
  it('returns the longest INTERIOR axis-aligned run', () => {
    // src .. corner .. long horizontal run .. corner .. tgt
    const wp = [p(0,0), p(0,50), p(200,50), p(200,90), p(210,90)];
    const run = dominantRun(wp)!;
    expect(run.axis).toBe('h');
    expect(run.at).toBe(50);
    expect(run.from).toBe(0);
    expect(run.to).toBe(200);
    expect(run.i).toBe(1);   // interior (not the source at index 0)
    expect(run.j).toBe(2);
  });
  it('null when the only long run touches an endpoint', () => {
    const wp = [p(0,0), p(300,0), p(300,10)]; // longest run i=0 is the source — not interior
    expect(dominantRun(wp)).toBeNull();
  });
});

describe('groupChannels', () => {
  it('groups same-axis runs sharing a band + overlap; separates distant ones', () => {
    const mk = (edgeId: string, at: number, from: number, to: number, bary: number) =>
      ({ edgeId, run: { axis: 'h' as const, at, from, to, i: 1, j: 2 }, bary });
    const members = [
      mk('e1', 100, 0, 100, 20),
      mk('e2', 104, 20, 120, 60),   // within bandTol of e1, overlaps [0,100]∩[20,120]
      mk('e3', 400, 0, 100, 10),    // far cross-axis band → its own group
    ];
    const groups = groupChannels(members, 8);
    expect(groups.length).toBe(2);
    expect(groups.find(g => g.length === 2)!.map(m => m.edgeId).sort()).toEqual(['e1', 'e2']);
  });
});

describe('assignOffsets', () => {
  it('orders by barycenter and centres signed offsets', () => {
    const mk = (edgeId: string, bary: number) =>
      ({ edgeId, run: { axis: 'h' as const, at: 100, from: 0, to: 100, i: 1, j: 2 }, bary });
    // three members, barys 60 / 20 / 40 → sorted e2(20), e3(40), e1(60)
    const offsets = assignOffsets([mk('e1', 60), mk('e2', 20), mk('e3', 40)], 10);
    expect(offsets.get('e2')).toBeCloseTo(-10);
    expect(offsets.get('e3')).toBeCloseTo(0);
    expect(offsets.get('e1')).toBeCloseTo(10);
  });
  it('single member → no offset', () => {
    const m = { edgeId: 's', run: { axis: 'h' as const, at: 1, from: 0, to: 1, i: 1, j: 2 }, bary: 0 };
    expect(assignOffsets([m], 10).get('s')).toBe(0);
  });
});

describe('offsetRun', () => {
  it('shifts an h-run perpendicular, keeping orthogonality (neighbours stay vertical)', () => {
    const wp = [p(0,0), p(0,50), p(200,50), p(200,90), p(210,90)];
    const run = dominantRun(wp)!;
    const out = offsetRun(wp, run, 12);
    expect(out[1]).toEqual({ x: 0, y: 62, index: out[1].index });   // run start moved
    expect(out[2]).toEqual({ x: 200, y: 62, index: out[2].index }); // run end moved
    expect(out[0]).toEqual(wp[0]); // endpoints untouched
    expect(out[4]).toEqual(wp[4]);
    // neighbour (0→1) still vertical (x constant), run (1→2) still horizontal (y equal)
    expect(out[0].x).toBe(out[1].x);
    expect(out[1].y).toBe(out[2].y);
  });
  it('offset 0 returns an equivalent route (byte-identical d upstream)', () => {
    const wp = [p(0,0), p(0,50), p(200,50), p(200,90), p(210,90)];
    expect(offsetRun(wp, dominantRun(wp)!, 0)).toEqual(wp);
  });
});

describe('routeHitsObstacles', () => {
  it('true when a segment passes through a padded rect, false when clear', () => {
    const rect = { x: 50, y: 40, width: 40, height: 40 }; // 50..90 × 40..80
    const through = [p(0,60), p(200,60)]; // horizontal at y=60 crosses the rect
    const clear = [p(0,10), p(200,10)];
    expect(routeHitsObstacles(through, [rect], 0)).toBe(true);
    expect(routeHitsObstacles(clear, [rect], 0)).toBe(false);
  });
});
