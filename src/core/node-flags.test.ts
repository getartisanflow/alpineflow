import { describe, it, expect } from 'vitest';
import { isSelectable, isDraggable, isDeletable } from './node-flags';

// ─────────────────────────────────────────────────────────────────────────────
// `isSelectable` gained a default, and the order of precedence has to survive it.
//
// A node weighs three things: its own `selectable`, the canvas-wide `nodesSelectable`
// arriving as the default, and `locked`. The rule the rest of the file already keeps —
// an explicit individual flag beats `locked` — must keep beating it when the canvas is
// the one saying no, or `locked: true, selectable: true` would mean two different
// things depending on a config the node cannot see.
// ─────────────────────────────────────────────────────────────────────────────
describe('isSelectable', () => {
  it('is selectable when nobody has said otherwise', () => {
    expect(isSelectable({})).toBe(true);
  });

  it('follows the canvas when the node has no opinion', () => {
    expect(isSelectable({}, false)).toBe(false);
  });

  it('lets one node opt out of a canvas that allows selection', () => {
    expect(isSelectable({ selectable: false }, true)).toBe(false);
  });

  it('lets one node opt in on a canvas that does not', () => {
    expect(isSelectable({ selectable: true }, false)).toBe(true);
  });

  it('still blocks a locked node, and still lets it override', () => {
    expect(isSelectable({ locked: true })).toBe(false);
    expect(isSelectable({ locked: true, selectable: true })).toBe(true);
    // And the override holds when the refusal comes from the canvas instead.
    expect(isSelectable({ locked: true, selectable: true }, false)).toBe(true);
  });

  it('leaves the other flags where they were', () => {
    // The signature changed on one of five. The rest take no default and must not.
    expect(isDraggable({ locked: true })).toBe(false);
    expect(isDeletable({ deletable: false })).toBe(false);
    expect(isDraggable({})).toBe(true);
  });
});
