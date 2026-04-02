// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import {
  findNearestSourceHandle,
  isEasyConnectKey,
} from './flow-node';

beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
});

describe('isEasyConnectKey', () => {
  it('returns true for altKey when key is alt', () => {
    expect(isEasyConnectKey({ altKey: true, metaKey: false, shiftKey: false } as PointerEvent, 'alt')).toBe(true);
  });

  it('returns false for altKey when key is meta', () => {
    expect(isEasyConnectKey({ altKey: true, metaKey: false, shiftKey: false } as PointerEvent, 'meta')).toBe(false);
  });

  it('returns true for metaKey when key is meta', () => {
    expect(isEasyConnectKey({ altKey: false, metaKey: true, shiftKey: false } as PointerEvent, 'meta')).toBe(true);
  });

  it('returns true for shiftKey when key is shift', () => {
    expect(isEasyConnectKey({ altKey: false, metaKey: false, shiftKey: true } as PointerEvent, 'shift')).toBe(true);
  });

  it('returns false when no modifier is held', () => {
    expect(isEasyConnectKey({ altKey: false, metaKey: false, shiftKey: false } as PointerEvent, 'alt')).toBe(false);
  });
});

describe('findNearestSourceHandle', () => {
  function makeNodeEl(handles: { id: string; left: number; top: number; width: number; height: number }[]) {
    const nodeEl = document.createElement('div');
    nodeEl.setAttribute('x-flow-node', '');
    nodeEl.dataset.flowNodeId = 'test-node';
    for (const h of handles) {
      const handleEl = document.createElement('div');
      handleEl.dataset.flowHandleId = h.id;
      handleEl.dataset.flowHandleType = 'source';
      handleEl.getBoundingClientRect = () => ({
        left: h.left, top: h.top, right: h.left + h.width, bottom: h.top + h.height,
        width: h.width, height: h.height, x: h.left, y: h.top, toJSON: () => {},
      });
      nodeEl.appendChild(handleEl);
    }
    return nodeEl;
  }

  it('returns null when no source handles exist', () => {
    const nodeEl = document.createElement('div');
    const result = findNearestSourceHandle(nodeEl, 100, 100);
    expect(result).toBeNull();
  });

  it('returns the only source handle', () => {
    const nodeEl = makeNodeEl([{ id: 'src', left: 200, top: 50, width: 10, height: 10 }]);
    const result = findNearestSourceHandle(nodeEl, 100, 100);
    expect(result?.dataset.flowHandleId).toBe('src');
  });

  it('returns the nearest handle when multiple exist', () => {
    const nodeEl = makeNodeEl([
      { id: 'far', left: 500, top: 500, width: 10, height: 10 },
      { id: 'near', left: 95, top: 95, width: 10, height: 10 },
    ]);
    const result = findNearestSourceHandle(nodeEl, 100, 100);
    expect(result?.dataset.flowHandleId).toBe('near');
  });
});
