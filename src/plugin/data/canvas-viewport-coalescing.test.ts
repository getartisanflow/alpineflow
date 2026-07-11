// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { realCanvas } from './__real-canvas-harness';

// ── Controllable rAF queue ───────────────────────────────────────────────────
// The viewport pipeline coalesces side-effects to one requestAnimationFrame
// flush per frame. A manual queue lets each test decide exactly when that frame
// fires.
let rafCallbacks = new Map<number, FrameRequestCallback>();
let rafId = 0;

beforeEach(() => {
  rafCallbacks = new Map();
  rafId = 0;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = ++rafId;
    rafCallbacks.set(id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    rafCallbacks.delete(id);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function flushRaf(): void {
  const cbs = [...rafCallbacks.values()];
  rafCallbacks.clear();
  for (const cb of cbs) cb(0);
}

function makeCanvas(): { canvas: any; container: HTMLElement } {
  const canvas = realCanvas({ background: 'dots' });
  const container = document.createElement('div');
  canvas._container = container;
  // jsdom returns '' for CSS custom properties; make gap resolution deterministic.
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    getPropertyValue: () => '20px',
  } as unknown as CSSStyleDeclaration);
  return { canvas, container };
}

describe('viewport frame coalescing', () => {
  it('coalesces multiple transform changes in one frame into a single flush', () => {
    const { canvas, container } = makeCanvas();
    const events: any[] = [];
    container.addEventListener('flow-viewport-change', (e) => events.push((e as CustomEvent).detail));

    canvas._onViewportTransform({ x: 10, y: 0, zoom: 1 });
    canvas._onViewportTransform({ x: 20, y: 0, zoom: 1 });
    canvas._onViewportTransform({ x: 30, y: 0, zoom: 1.1 });

    expect(events.length).toBe(0); // nothing emitted until the frame flushes
    expect(canvas.viewport.zoom).toBe(1); // reactive state not yet written

    flushRaf();

    expect(events.length).toBe(1); // exactly one viewport-change for the frame
    expect(canvas.viewport.zoom).toBe(1.1); // reactive state = final value
    expect(canvas.viewport.x).toBe(30);
  });

  it('writes the viewport-element transform synchronously (event-rate), before the flush', () => {
    const { canvas } = makeCanvas();
    const vpEl = document.createElement('div');
    canvas._viewportEl = vpEl;

    canvas._onViewportTransform({ x: 30, y: 5, zoom: 1.1 });

    // Transform latency stays at event rate even though side-effects defer.
    expect(vpEl.style.transform).toBe('translate(30px, 5px) scale(1.1)');
  });

  it('screenToFlowPosition uses the live (pre-flush) viewport', () => {
    const { canvas } = makeCanvas();

    canvas._onViewportTransform({ x: 100, y: 0, zoom: 1 });

    // Reactive viewport is still {0,0,1}, but the live one is current.
    expect(canvas.viewport.x).toBe(0);
    expect(canvas._viewportLive).toEqual({ x: 100, y: 0, zoom: 1 });
    // (100 - rect.left(0) - liveVp.x(100)) / zoom(1) = 0
    expect(canvas.screenToFlowPosition(100, 0).x).toBe(0);
  });

  it('defers background/culling/zoom-level side-effects to the flush', () => {
    const { canvas, container } = makeCanvas();

    canvas._onViewportTransform({ x: 0, y: 0, zoom: 1 });
    expect(container.style.backgroundImage).toBe(''); // not applied per-event

    flushRaf();
    expect(container.style.backgroundImage).not.toBe(''); // applied once, on flush
  });

  it('move-end flushes synchronously and cancels the pending frame (no double flush)', () => {
    const { canvas, container } = makeCanvas();
    const changes: any[] = [];
    const ends: any[] = [];
    container.addEventListener('flow-viewport-change', (e) => changes.push((e as CustomEvent).detail));
    container.addEventListener('flow-viewport-move-end', (e) => ends.push((e as CustomEvent).detail));

    canvas._onViewportTransform({ x: 5, y: 0, zoom: 2 }); // schedules a frame
    expect(changes.length).toBe(0);

    canvas._onViewportMoveEnd({ x: 5, y: 0, zoom: 2 }); // commit end-state now

    expect(changes.length).toBe(1); // flushed synchronously
    expect(ends.length).toBe(1);
    expect(canvas.viewport.zoom).toBe(2);

    flushRaf(); // the pre-scheduled frame must have been cancelled
    expect(changes.length).toBe(1); // no second flush
  });

  it('relative viewport ops compound within one tick by reading the live base', () => {
    const canvas = realCanvas({ background: 'dots', maxZoom: 100 });
    canvas._container = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '20px',
    } as unknown as CSSStyleDeclaration);
    // d3-zoom's duration-0 setViewport applies the transform synchronously,
    // updating the live viewport before the call returns.
    canvas._panZoom = {
      setViewport: (vp: any) => {
        const cur = canvas._viewportLive ?? canvas.viewport;
        canvas._onViewportTransform({
          x: vp.x ?? cur.x,
          y: vp.y ?? cur.y,
          zoom: vp.zoom ?? cur.zoom,
        });
      },
    };

    canvas.zoomIn();
    const afterOne = canvas._viewportLive.zoom;
    canvas.zoomIn();
    const afterTwo = canvas._viewportLive.zoom;

    expect(afterOne).toBeGreaterThan(1);
    expect(afterTwo).toBeGreaterThan(afterOne); // compounded, not collapsed to one step
    expect(afterTwo / afterOne).toBeCloseTo(afterOne, 5); // equal ratio per step
  });

  it('emits viewport-move once per frame only when a user move occurred, then resets the flag', () => {
    const { canvas, container } = makeCanvas();
    const moves: any[] = [];
    container.addEventListener('flow-viewport-move', (e) => moves.push((e as CustomEvent).detail));

    canvas._onViewportTransform({ x: 10, y: 0, zoom: 1 });
    canvas._vpMoved = true; // onMove sets this for user-driven gestures
    flushRaf();
    expect(moves.length).toBe(1);
    expect(canvas._vpMoved).toBe(false);

    // A programmatic frame (no user move) must not emit viewport-move.
    canvas._onViewportTransform({ x: 20, y: 0, zoom: 1 });
    flushRaf();
    expect(moves.length).toBe(1);
  });
});
