import { describe, it, expect } from 'vitest';
import { isEdgeSelectable } from './edge-flags';

// ─────────────────────────────────────────────────────────────────────────────
// Two dials, and which one wins.
//
// The canvas-wide `edgesSelectable` config arrives as the default; the edge's own
// `selectable` is its right to disagree. Everything else in the library that pairs a
// per-element flag with a canvas-wide one behaves this way — `focusable` /
// `edgesFocusable` is the same shape — so an edge reads the same whichever flag you
// happen to look at first.
// ─────────────────────────────────────────────────────────────────────────────
describe('isEdgeSelectable', () => {
  it('is selectable when nobody has said otherwise', () => {
    expect(isEdgeSelectable({})).toBe(true);
  });

  it('follows the canvas when the edge has no opinion', () => {
    expect(isEdgeSelectable({}, false)).toBe(false);
    expect(isEdgeSelectable({}, true)).toBe(true);
  });

  it('lets one edge opt out of a canvas that allows selection', () => {
    expect(isEdgeSelectable({ selectable: false }, true)).toBe(false);
  });

  it('lets one edge opt in on a canvas that does not', () => {
    // The case that makes this a flag rather than a switch: a read-only canvas with
    // one line somebody is still meant to be able to pick.
    expect(isEdgeSelectable({ selectable: true }, false)).toBe(true);
  });
});
