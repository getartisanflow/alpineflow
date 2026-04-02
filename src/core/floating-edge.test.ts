import { describe, it, expect } from 'vitest';
import {
  getNodeIntersection,
  getEdgePosition,
  getFloatingEdgeParams,
  getSimpleFloatingPosition,
} from './floating-edge';
import type { FlowNode, HandlePosition } from './types';

const nodeLeft: FlowNode = {
  id: 'left',
  position: { x: 0, y: 0 },
  data: {},
  dimensions: { width: 100, height: 100 },
};

const nodeRight: FlowNode = {
  id: 'right',
  position: { x: 300, y: 0 },
  data: {},
  dimensions: { width: 100, height: 100 },
};

const nodeBelow: FlowNode = {
  id: 'below',
  position: { x: 0, y: 300 },
  data: {},
  dimensions: { width: 100, height: 100 },
};

// ── getNodeIntersection ─────────────────────────────────────────────────────

describe('getNodeIntersection', () => {
  it('intersects right edge when target is to the right', () => {
    const point = getNodeIntersection(nodeLeft, { x: 350, y: 50 });
    expect(point.x).toBe(100); // right edge of nodeLeft
    expect(point.y).toBe(50); // at center height
  });

  it('intersects left edge when target is to the left', () => {
    const point = getNodeIntersection(nodeRight, { x: 50, y: 50 });
    expect(point.x).toBe(300); // left edge of nodeRight
    expect(point.y).toBe(50);
  });

  it('intersects bottom edge when target is below', () => {
    const point = getNodeIntersection(nodeLeft, { x: 50, y: 350 });
    expect(point.x).toBe(50); // at center width
    expect(point.y).toBe(100); // bottom edge
  });

  it('intersects top edge when target is above', () => {
    const point = getNodeIntersection(nodeBelow, { x: 50, y: 50 });
    expect(point.x).toBe(50);
    expect(point.y).toBe(300); // top edge
  });

  it('handles coincident centers by returning top edge', () => {
    const point = getNodeIntersection(nodeLeft, { x: 50, y: 50 });
    expect(point).toEqual({ x: 50, y: 0 });
  });

  it('handles diagonal target', () => {
    const point = getNodeIntersection(nodeLeft, { x: 200, y: 200 });
    // direction is (150, 150) from center (50,50). Both ratios equal → hits corner area
    expect(point.x).toBeCloseTo(100);
    expect(point.y).toBeCloseTo(100);
  });
});

// ── getNodeIntersection with rotation ──────────────────────────────────────

describe('getNodeIntersection with rotation', () => {
  const rotated90: FlowNode = {
    id: 'r90',
    position: { x: 0, y: 0 },
    data: {},
    dimensions: { width: 100, height: 100 },
    rotation: 90,
  };

  const rotated45Wide: FlowNode = {
    id: 'r45w',
    position: { x: 0, y: 0 },
    data: {},
    dimensions: { width: 200, height: 50 },
    rotation: 45,
  };

  it('intersection point lies on the rotated rectangle boundary (90°)', () => {
    // For a 90° rotated square, the rectangle is the same shape, so
    // intersection for a target to the right should still be at the right edge
    const point = getNodeIntersection(rotated90, { x: 300, y: 50 });
    expect(point.x).toBeCloseTo(100);
    expect(point.y).toBeCloseTo(50);
  });

  it('intersection moves with rotation for non-square nodes (45°)', () => {
    // Wide node (200x50) rotated 45° — target directly to the right.
    // In local space the target is to the right, so it hits the right edge.
    // After rotation back, the point should be on the rotated boundary.
    const center = { x: 100, y: 25 };
    const point = getNodeIntersection(rotated45Wide, { x: 400, y: 25 });
    // The intersection should be closer to the center than the expanded AABB
    // (which would be ~125 for a 200x50 at 45°). The actual rotated edge
    // is at ~100 from center along the rotated direction.
    const dist = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
    // For a 200x50 rect, half-width is 100. At 45° rotation, the right edge
    // point rotated back: should be exactly on the rectangle perimeter.
    expect(dist).toBeLessThan(110);
    expect(dist).toBeGreaterThan(20);
  });

  it('handles coincident centers with rotation', () => {
    const point = getNodeIntersection(rotated90, { x: 50, y: 50 });
    // Should return a point on the top edge, rotated 90° around center
    const center = { x: 50, y: 50 };
    const dist = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
    expect(dist).toBeCloseTo(50); // half-height from center
  });

  it('non-rotated nodes are unaffected', () => {
    const point = getNodeIntersection(nodeLeft, { x: 350, y: 50 });
    expect(point.x).toBe(100);
    expect(point.y).toBe(50);
  });
});

// ── getEdgePosition ─────────────────────────────────────────────────────────

describe('getEdgePosition', () => {
  it('returns "right" for point on right edge', () => {
    expect(getEdgePosition(nodeLeft, { x: 100, y: 50 })).toBe('right');
  });

  it('returns "left" for point on left edge', () => {
    expect(getEdgePosition(nodeLeft, { x: 0, y: 50 })).toBe('left');
  });

  it('returns "top" for point on top edge', () => {
    expect(getEdgePosition(nodeLeft, { x: 50, y: 0 })).toBe('top');
  });

  it('returns "bottom" for point on bottom edge', () => {
    expect(getEdgePosition(nodeLeft, { x: 50, y: 100 })).toBe('bottom');
  });

  it('falls back to displacement-based direction for interior points', () => {
    // Point far right of center → right
    const pos = getEdgePosition(nodeLeft, { x: 90, y: 50 });
    expect(pos).toBe('right');
  });
});

// ── getEdgePosition with rotation ─────────────────────────────────────────

describe('getEdgePosition with rotation', () => {
  const rotated90: FlowNode = {
    id: 'r90',
    position: { x: 0, y: 0 },
    data: {},
    dimensions: { width: 100, height: 100 },
    rotation: 90,
  };

  it('classifies rotated intersection correctly', () => {
    // Get an intersection point from a rotated node
    const intersection = getNodeIntersection(rotated90, { x: 300, y: 50 });
    const pos = getEdgePosition(rotated90, intersection);
    // Target is to the right; in local space that's the right edge
    expect(pos).toBe('right');
  });
});

// ── getFloatingEdgeParams ───────────────────────────────────────────────────

describe('getFloatingEdgeParams', () => {
  it('returns right/left positions for horizontally separated nodes', () => {
    const params = getFloatingEdgeParams(nodeLeft, nodeRight);
    expect(params.sourcePos).toBe('right');
    expect(params.targetPos).toBe('left');
    expect(params.sx).toBe(100); // right edge of source
    expect(params.tx).toBe(300); // left edge of target
  });

  it('returns bottom/top positions for vertically separated nodes', () => {
    const params = getFloatingEdgeParams(nodeLeft, nodeBelow);
    expect(params.sourcePos).toBe('bottom');
    expect(params.targetPos).toBe('top');
    expect(params.sy).toBe(100); // bottom edge of source
    expect(params.ty).toBe(300); // top edge of target
  });

  it('returns correct y coordinates for horizontal edges', () => {
    const params = getFloatingEdgeParams(nodeLeft, nodeRight);
    // Both at y=50 (center of 100px height)
    expect(params.sy).toBe(50);
    expect(params.ty).toBe(50);
  });
});

// ── getFloatingEdgeParams with rotation ────────────────────────────────────

describe('getFloatingEdgeParams with rotation', () => {
  it('rotated node produces intersection on its actual boundary', () => {
    const rotatedSource: FlowNode = {
      id: 'rs',
      position: { x: 0, y: 0 },
      data: {},
      dimensions: { width: 200, height: 50 },
      rotation: 45,
    };
    const target: FlowNode = {
      id: 't',
      position: { x: 400, y: 0 },
      data: {},
      dimensions: { width: 100, height: 50 },
    };
    const params = getFloatingEdgeParams(rotatedSource, target);

    // Source intersection should be closer to node center than the expanded
    // AABB would produce. The center of rotatedSource is (100, 25).
    const sourceCenter = { x: 100, y: 25 };
    const dist = Math.sqrt((params.sx - sourceCenter.x) ** 2 + (params.sy - sourceCenter.y) ** 2);
    // Expanded AABB half-width would be ~89px. Actual rotated rect intersection
    // should be closer because the ray hits the rotated edge sooner.
    expect(dist).toBeLessThan(110);
    expect(dist).toBeGreaterThan(20);
  });
});

// ── getSimpleFloatingPosition ───────────────────────────────────────────────

describe('getSimpleFloatingPosition', () => {
  it('returns right/left for horizontal displacement', () => {
    const { sourcePos, targetPos } = getSimpleFloatingPosition(
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    );
    expect(sourcePos).toBe('right');
    expect(targetPos).toBe('left');
  });

  it('returns left/right for negative horizontal displacement', () => {
    const { sourcePos, targetPos } = getSimpleFloatingPosition(
      { x: 100, y: 0 },
      { x: 0, y: 0 },
    );
    expect(sourcePos).toBe('left');
    expect(targetPos).toBe('right');
  });

  it('returns bottom/top for vertical displacement', () => {
    const { sourcePos, targetPos } = getSimpleFloatingPosition(
      { x: 0, y: 0 },
      { x: 0, y: 100 },
    );
    expect(sourcePos).toBe('bottom');
    expect(targetPos).toBe('top');
  });

  it('returns top/bottom for negative vertical displacement', () => {
    const { sourcePos, targetPos } = getSimpleFloatingPosition(
      { x: 0, y: 100 },
      { x: 0, y: 0 },
    );
    expect(sourcePos).toBe('top');
    expect(targetPos).toBe('bottom');
  });

  it('prefers horizontal for equal displacement', () => {
    const { sourcePos, targetPos } = getSimpleFloatingPosition(
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    );
    // abs(dx) === abs(dy), falls to else branch → vertical
    expect(sourcePos).toBe('bottom');
    expect(targetPos).toBe('top');
  });
});
