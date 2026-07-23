// @vitest-environment jsdom
// ============================================================================
// resolveCanvasEl (WS2) — shared canvas resolver so flow directives placed
// OUTSIDE the canvas element (a toolbar, a sidebar) still find their canvas.
// ============================================================================

import { describe, it, expect, vi, afterEach } from 'vitest';
import { resolveCanvasEl, _resetResolveCanvasWarned } from './resolve-canvas';

afterEach(() => {
  document.body.innerHTML = '';
  _resetResolveCanvasWarned();
  vi.restoreAllMocks();
});

function makeCanvas(id?: string): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('data-flow-canvas', '');
  if (id) el.id = id;
  document.body.appendChild(el);
  return el;
}

describe('resolveCanvasEl', () => {
  it('resolves via data-flow-target selector when the host is outside the canvas', () => {
    const canvas = makeCanvas('er');
    const host = document.createElement('button');
    host.setAttribute('data-flow-target', '#er');
    document.body.appendChild(host);

    expect(resolveCanvasEl(host)).toBe(canvas);
  });

  it('walks up to an ancestor carrying data-flow-target (toolbar wrapper sets it once)', () => {
    const canvas = makeCanvas('er');
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-flow-target', '#er');
    const host = document.createElement('button');
    wrapper.appendChild(host);
    document.body.appendChild(wrapper);

    expect(resolveCanvasEl(host)).toBe(canvas);
  });

  it('falls back to the single canvas in the document when the host has no target and is outside', () => {
    const canvas = makeCanvas();
    const host = document.createElement('button');
    document.body.appendChild(host);

    expect(resolveCanvasEl(host)).toBe(canvas);
  });

  it('returns null and warns once when there is no target and 2+ canvases exist', () => {
    makeCanvas('a');
    makeCanvas('b');
    const host = document.createElement('button');
    document.body.appendChild(host);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(resolveCanvasEl(host)).toBeNull();
    expect(resolveCanvasEl(host)).toBeNull();
    // Warned only once despite two ambiguous resolutions.
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('returns null and warns when there is no target and no canvas exists', () => {
    const host = document.createElement('button');
    document.body.appendChild(host);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(resolveCanvasEl(host)).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('prefers closest() when the host is inside a canvas (even with other canvases present)', () => {
    const other = makeCanvas('other');
    const canvas = makeCanvas('own');
    const host = document.createElement('button');
    canvas.appendChild(host);

    // Inside its own canvas — closest wins over the single-canvas fallback.
    expect(resolveCanvasEl(host)).toBe(canvas);
    expect(resolveCanvasEl(host)).not.toBe(other);
  });
});
