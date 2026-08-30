// @vitest-environment jsdom
// ============================================================================
// animate({ viewport }) — who is told where the canvas ended up
//
// The pan/zoom controller keeps a transform of its own. An animated viewport
// change writes the reactive state and the DOM and, until now, left that
// transform where it was — so the next gesture resumed from before the
// animation and the whole graph jumped.
// ============================================================================

import { describe, it, expect, vi } from 'vitest';
import { mockCtx } from './__test-utils';
import { createAnimationMixin } from './canvas-animation';
import { setAlpine } from '../alpine-ref';

setAlpine({ raw: (x: any) => x } as any);

/** An animator that hands back the options, so a test can end the animation itself. */
function captureAnimator(ctx: any) {
  ctx._animator = {
    animate: vi.fn(() => ({
      pause: vi.fn(), resume: vi.fn(), stop: vi.fn(), reverse: vi.fn(),
      finished: Promise.resolve(),
    })),
  };

  return () => (ctx._animator.animate as any).mock.calls[0][1];
}

function panZoom() {
  return { setViewport: vi.fn(), getTransform: vi.fn(), update: vi.fn(), destroy: vi.fn() } as any;
}

describe('createAnimationMixin — the viewport at the end', () => {
  it('hands the final viewport back to the pan/zoom controller', () => {
    const ctx = mockCtx();
    ctx._panZoom = panZoom();
    const options = captureAnimator(ctx);

    const mixin = createAnimationMixin(ctx);

    mixin.animate({ viewport: { pan: { x: 400, y: 120 }, zoom: 1.5 } }, { duration: 300 });

    // Mid-flight the controller knows nothing: the animation writes the state and the DOM, and
    // handing it a half-way transform every frame is what the flush is for.
    expect(ctx._panZoom!.setViewport).not.toHaveBeenCalled();

    // The animator applies the last frame and finishes.
    const entries = (ctx._animator!.animate as any).mock.calls[0][0];
    for (const entry of entries) entry.apply(entry.to);
    options().onComplete?.();

    expect(ctx._panZoom!.setViewport).toHaveBeenCalledWith({ x: 400, y: 120, zoom: 1.5 });
  });

  it('says nothing to it about an animation that never touched the viewport', () => {
    // It is the controller's own business otherwise, and telling it what it already knows on
    // every node move would be noise at best.
    const ctx = mockCtx();
    ctx._panZoom = panZoom();
    ctx._nodeMap.set('n1', { id: 'n1', position: { x: 0, y: 0 }, data: {} });
    const options = captureAnimator(ctx);

    const mixin = createAnimationMixin(ctx);

    mixin.animate({ nodes: { n1: { position: { x: 100, y: 0 } } } }, { duration: 300 });
    options().onComplete?.();

    expect(ctx._panZoom!.setViewport).not.toHaveBeenCalled();
  });

  it('leaves the instant path alone, which told it all along', () => {
    // With no duration the viewport is set through the controller in the first place — see
    // `fitBounds` — so there is nothing to hand back.
    const ctx = mockCtx();
    ctx._panZoom = panZoom();

    const mixin = createAnimationMixin(ctx);

    mixin.animate({ viewport: { pan: { x: 10, y: 10 }, zoom: 2 } }, { duration: 0 });

    expect(ctx.viewport).toEqual({ x: 10, y: 10, zoom: 2 });
  });
});
