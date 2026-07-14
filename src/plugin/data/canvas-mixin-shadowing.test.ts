// @vitest-environment jsdom
// ============================================================================
// ARCHITECTURE TEST — no mixin may shadow a flowCanvas own property
//
// flowCanvas() builds its methods as a plain object literal (`self`), then flattens
// each mixin onto it with `Object.defineProperties`. That is a LAST-WRITE-WINS merge:
// any mixin key that matches a key already on `self` silently replaces the canvas's
// own implementation. No error, no warning, no type error — the mixins are separate
// objects, so TypeScript never sees the collision either.
//
// This is not hypothetical. The animation mixin exported `destroy()`, which overwrote
// flowCanvas's own `destroy()` — taking the ENTIRE ~140-line canvas teardown out of the
// lifecycle. Listeners were never removed, the panZoom instance was never destroyed,
// `$store.flow` retained dead canvases, `onDestroy` never fired. It shipped that way,
// undetected, because nothing asserted the merge was collision-free. It was found only
// because Workstream F put a cleanup call in that body and noticed it never ran.
//
// `destroy` will not be the last collision — the canvas literal defines a large surface
// and mixins are added routinely. This test is the durable guard.
//
// HOW: rather than duplicate the mixin list here (which would drift), intercept the
// merge itself. `Object.defineProperties` is spied for the duration of one real
// flowCanvas() construction; every call whose target is the canvas object IS a mixin
// application. The keys already on the target at the FIRST such call are the canvas's
// own literal keys; the keys carried by each call are that mixin's. The intersection
// must be empty.
// ============================================================================

import { describe, it, expect } from 'vitest';
import { realCanvas } from './__real-canvas-harness';

interface MixinApplication {
  /** Keys this `Object.defineProperties` call flattened onto the canvas. */
  keys: string[];
}

interface MergeTrace {
  /** Own keys of the flowCanvas object literal, before any mixin was applied. */
  canvasOwnKeys: string[];
  /** One entry per mixin, in application order. */
  mixins: MixinApplication[];
}

/**
 * Build a real flowCanvas while recording how the mixin merge happened.
 *
 * The spy sees every `Object.defineProperties` call made during construction, including
 * any a mixin factory makes internally on its OWN objects; those are filtered out
 * afterwards by identity against the canvas that was ultimately returned.
 */
function traceMixinMerge(): MergeTrace {
  const calls: { target: object; before: string[]; keys: string[] }[] = [];
  const original = Object.defineProperties;

  Object.defineProperties = function (target: any, props: any) {
    calls.push({
      target,
      before: Object.getOwnPropertyNames(target),
      keys: Object.getOwnPropertyNames(props),
    });
    return original(target, props);
  } as typeof Object.defineProperties;

  let canvas: object;
  try {
    canvas = realCanvas();
  } finally {
    Object.defineProperties = original;
  }

  const ontoCanvas = calls.filter((c) => c.target === canvas);
  if (ontoCanvas.length === 0) {
    throw new Error(
      'no Object.defineProperties call targeted the canvas — flowCanvas() no longer applies its '
      + 'mixins that way, so this test is not checking anything. Rewrite it against the new merge.',
    );
  }

  return {
    canvasOwnKeys: ontoCanvas[0].before,
    mixins: ontoCanvas.map((c) => ({ keys: c.keys })),
  };
}

describe('flowCanvas mixin merge — architecture', () => {
  it('applies its mixins via Object.defineProperties (guards the test above)', () => {
    const trace = traceMixinMerge();

    // Sanity: the trace actually saw a real merge, so an empty-collision result below
    // means "no collisions" and not "nothing was inspected".
    expect(trace.mixins.length).toBeGreaterThan(5);
    expect(trace.canvasOwnKeys).toContain('destroy');
    expect(trace.canvasOwnKeys).toContain('init');
    expect(trace.mixins.some((m) => m.keys.length > 0)).toBe(true);
  });

  it('no mixin key collides with a flowCanvas own-property key', () => {
    const trace = traceMixinMerge();
    const canvasOwn = new Set(trace.canvasOwnKeys);

    const collisions: string[] = [];
    trace.mixins.forEach((mixin, i) => {
      for (const key of mixin.keys) {
        if (!canvasOwn.has(key)) continue;
        // Identify the offending mixin by its other keys — the merge is anonymous, and
        // hard-coding the mixin list here would just drift out of sync with the source.
        const fingerprint = mixin.keys.filter((k) => k !== key).slice(0, 4).join(', ');
        collisions.push(
          `mixin #${i} (keys include: ${fingerprint}) defines "${key}", which SHADOWS `
          + `flowCanvas's own "${key}" — the canvas's implementation is silently discarded`,
        );
      }
    });

    // Rename the mixin's method (the canvas's `destroy()` calls the animation mixin's
    // teardown as `_destroyAnimations()` for exactly this reason) or call through to it
    // from the canvas's own — do not let the merge overwrite the canvas.
    expect(collisions).toEqual([]);
  });
});
