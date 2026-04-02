import { describe, it, expect } from 'vitest';

/**
 * Unit-test the noDragClassName filter logic in isolation.
 *
 * We can't easily instantiate d3-drag in JSDOM (no DOM env installed), so we
 * extract and test the filter predicate directly using lightweight mocks.
 * The filter logic mirrors createDrag's .filter() callback in drag.ts.
 */

/** Mirrors the filter logic from createDrag -- extracted for testability. */
function shouldAllowDrag(
  event: { target?: any },
  element: { querySelector: (sel: string) => any },
  opts: { isLocked?: () => boolean; filterSelector?: string; noDragClassName?: string },
): boolean {
  if (opts.isLocked?.()) return false;
  if (opts.noDragClassName && event.target?.closest?.('.' + opts.noDragClassName)) return false;
  if (opts.filterSelector) {
    const handle = element.querySelector(opts.filterSelector);
    return handle ? handle.contains(event.target) : true;
  }
  return true;
}

/**
 * Create a mock element that has the given classes and optionally a parent
 * chain. `closest` walks the class list of self and ancestors.
 */
function mockTarget(classes: string[], ancestorClasses: string[][] = []) {
  const classSet = new Set(classes);
  const allSets = [classSet, ...ancestorClasses.map((c) => new Set(c))];

  return {
    closest(selector: string): any {
      // selector is always '.<className>' in our usage
      const cls = selector.startsWith('.') ? selector.slice(1) : selector;
      for (const s of allSets) {
        if (s.has(cls)) return {}; // truthy = found
      }
      return null;
    },
  };
}

/** Mock element with a querySelector that always returns null (no handle). */
const mockElement = { querySelector: () => null };

describe('drag filter noDragClassName', () => {
  it('blocks drag when target has noDragClassName', () => {
    const target = mockTarget(['nodrag']);
    const event = { target };
    expect(shouldAllowDrag(event, mockElement, { noDragClassName: 'nodrag' })).toBe(false);
  });

  it('allows drag when target lacks noDragClassName', () => {
    const target = mockTarget(['other-class']);
    const event = { target };
    expect(shouldAllowDrag(event, mockElement, { noDragClassName: 'nodrag' })).toBe(true);
  });

  it('blocks drag when target is inside a noDragClassName ancestor', () => {
    const target = mockTarget([], [['nodrag']]);
    const event = { target };
    expect(shouldAllowDrag(event, mockElement, { noDragClassName: 'nodrag' })).toBe(false);
  });

  it('respects custom class name', () => {
    const target = mockTarget(['my-no-drag']);
    const event = { target };
    expect(shouldAllowDrag(event, mockElement, { noDragClassName: 'my-no-drag' })).toBe(false);
  });

  it('allows drag when noDragClassName is undefined', () => {
    const target = mockTarget(['nodrag']);
    const event = { target };
    expect(shouldAllowDrag(event, mockElement, {})).toBe(true);
  });

  it('blocks drag on noDragClassName even when inside a drag handle', () => {
    const target = mockTarget(['nodrag']);
    const handle = { contains: () => true };
    const el = { querySelector: () => handle };
    const event = { target };
    expect(shouldAllowDrag(event, el, {
      filterSelector: '[data-flow-drag-handle]',
      noDragClassName: 'nodrag',
    })).toBe(false);
  });
});
