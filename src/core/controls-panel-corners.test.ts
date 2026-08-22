// @vitest-environment jsdom
// ============================================================================
// Controls panel — which buttons get the corners of the strip
//
// The rounding rules are CSS, so they are read out of the stylesheet and run
// against a DOM rather than restated here: a test that repeats the selector it
// is checking proves only that somebody typed it twice.
// ============================================================================

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** The rounding selectors as they ship. */
function cornerSelectors(): string[] {
  // From the project root rather than from `import.meta.url`: this file runs under jsdom, where
  // the module URL is an http one and `fileURLToPath` refuses it.
  const css = readFileSync(resolve(process.cwd(), 'css/structural.css'), 'utf8');

  return [...css.matchAll(/^(\.flow-controls-(?:vertical|horizontal)[^{]*:(?:first|last|only)-child)\s*\{/gm)]
    .map((match) => match[1].trim());
}

let selectors: string[];

beforeAll(() => {
  selectors = cornerSelectors();
});

/**
 * A strip with a wrapped control in the middle of it: a trigger that needs something to anchor a
 * fly-out to. This is the shape the descendant selector got wrong — the trigger is the first child
 * of its wrapper, so it was handed the corners of a button that opens the column.
 */
function strip(orientation: 'vertical' | 'horizontal') {
  const controls = document.createElement('div');
  controls.className = `flow-controls flow-controls-${orientation}`;

  const first = document.createElement('button');
  const wrapper = document.createElement('div');
  const wrapped = document.createElement('button');
  const flyout = document.createElement('div');
  const last = document.createElement('button');

  wrapper.append(wrapped, flyout);
  controls.append(first, wrapper, last);
  document.body.append(controls);

  return { controls, first, wrapped, last };
}

describe('the controls strip rounds its own children', () => {
  it('finds the rules it is about to check', () => {
    // Six: first, last and only, for each orientation. A regex that matched nothing would make
    // everything below vacuously true.
    expect(selectors).toHaveLength(6);
  });

  it('leaves a wrapped control square in the middle of the strip', () => {
    for (const orientation of ['vertical', 'horizontal'] as const) {
      const { wrapped } = strip(orientation);

      for (const selector of selectors) {
        expect(wrapped.matches(selector), `${selector} matched a wrapped control`).toBe(false);
      }
    }
  });

  it('still rounds the real ends of the strip', () => {
    const { first, last } = strip('vertical');

    expect(first.matches('.flow-controls-vertical > button:first-child')).toBe(true);
    expect(last.matches('.flow-controls-vertical > button:last-child')).toBe(true);
  });

  it('rounds a strip of one on every corner', () => {
    const controls = document.createElement('div');
    controls.className = 'flow-controls flow-controls-vertical';
    const only = document.createElement('button');
    controls.append(only);
    document.body.append(controls);

    expect(only.matches('.flow-controls-vertical > button:only-child')).toBe(true);
  });
});
