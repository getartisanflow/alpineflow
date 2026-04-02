// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import {
  HANDLE_CONNECTABLE_START_KEY,
  HANDLE_CONNECTABLE_END_KEY,
} from './flow-handle-connectable';
import { checkHandleLimits, applyValidationClasses } from './flow-handle';

// jsdom doesn't implement CSS.escape — minimal polyfill for simple IDs
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
});

describe('HANDLE_CONNECTABLE_START_KEY', () => {
  it('is the expected string constant', () => {
    expect(HANDLE_CONNECTABLE_START_KEY).toBe('_flowHandleConnectableStart');
  });

  it('can be set and read on an HTMLElement', () => {
    const el = document.createElement('div');
    el[HANDLE_CONNECTABLE_START_KEY] = false;
    expect(el[HANDLE_CONNECTABLE_START_KEY]).toBe(false);
  });

  it('defaults to undefined (connectable)', () => {
    const el = document.createElement('div');
    expect(el[HANDLE_CONNECTABLE_START_KEY]).toBeUndefined();
  });

  it('can be deleted', () => {
    const el = document.createElement('div');
    el[HANDLE_CONNECTABLE_START_KEY] = false;
    delete el[HANDLE_CONNECTABLE_START_KEY];
    expect(el[HANDLE_CONNECTABLE_START_KEY]).toBeUndefined();
  });
});

describe('HANDLE_CONNECTABLE_END_KEY', () => {
  it('is the expected string constant', () => {
    expect(HANDLE_CONNECTABLE_END_KEY).toBe('_flowHandleConnectableEnd');
  });

  it('can be set and read on an HTMLElement', () => {
    const el = document.createElement('div');
    el[HANDLE_CONNECTABLE_END_KEY] = false;
    expect(el[HANDLE_CONNECTABLE_END_KEY]).toBe(false);
  });

  it('defaults to undefined (connectable)', () => {
    const el = document.createElement('div');
    expect(el[HANDLE_CONNECTABLE_END_KEY]).toBeUndefined();
  });
});

/**
 * Helper to build a minimal DOM structure for validation tests.
 */
function buildContainer(
  nodes: {
    id: string;
    handles: {
      id: string;
      type: 'source' | 'target';
      connectableStart?: boolean;
      connectableEnd?: boolean;
    }[];
  }[],
) {
  const container = document.createElement('div');
  container.classList.add('flow-container');
  for (const node of nodes) {
    const nodeEl = document.createElement('div');
    nodeEl.setAttribute('x-flow-node', '');
    nodeEl.dataset.flowNodeId = node.id;
    for (const handle of node.handles) {
      const handleEl = document.createElement('div');
      handleEl.dataset.flowHandleId = handle.id;
      handleEl.dataset.flowHandleType = handle.type;
      if (handle.connectableStart !== undefined) {
        handleEl[HANDLE_CONNECTABLE_START_KEY] = handle.connectableStart;
      }
      if (handle.connectableEnd !== undefined) {
        handleEl[HANDLE_CONNECTABLE_END_KEY] = handle.connectableEnd;
      }
      nodeEl.appendChild(handleEl);
    }
    container.appendChild(nodeEl);
  }
  return container;
}

describe('applyValidationClasses with isConnectableEnd', () => {
  const mockCanvas = {
    edges: [],
    getNode: (id: string) => ({ id, connectable: true }),
    _config: undefined as any,
  };

  it('marks handle as invalid when isConnectableEnd is false', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source' }] },
      { id: 'b', handles: [{ id: 'target', type: 'target', connectableEnd: false }] },
    ]);

    applyValidationClasses(container, 'a', 'source', mockCanvas);

    const targetEl = container.querySelector('[data-flow-handle-id="target"]') as HTMLElement;
    expect(targetEl.classList.contains('flow-handle-invalid')).toBe(true);
    expect(targetEl.classList.contains('flow-handle-valid')).toBe(false);
  });

  it('marks handle as valid when isConnectableEnd is true', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source' }] },
      { id: 'b', handles: [{ id: 'target', type: 'target', connectableEnd: true }] },
    ]);

    applyValidationClasses(container, 'a', 'source', mockCanvas);

    const targetEl = container.querySelector('[data-flow-handle-id="target"]') as HTMLElement;
    expect(targetEl.classList.contains('flow-handle-valid')).toBe(true);
    expect(targetEl.classList.contains('flow-handle-invalid')).toBe(false);
  });

  it('marks handle as valid when isConnectableEnd is undefined (default)', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source' }] },
      { id: 'b', handles: [{ id: 'target', type: 'target' }] },
    ]);

    applyValidationClasses(container, 'a', 'source', mockCanvas);

    const targetEl = container.querySelector('[data-flow-handle-id="target"]') as HTMLElement;
    expect(targetEl.classList.contains('flow-handle-valid')).toBe(true);
  });

  it('does not add limit-reached class for non-connectable handle', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source' }] },
      { id: 'b', handles: [{ id: 'target', type: 'target', connectableEnd: false }] },
    ]);

    applyValidationClasses(container, 'a', 'source', mockCanvas);

    const targetEl = container.querySelector('[data-flow-handle-id="target"]') as HTMLElement;
    expect(targetEl.classList.contains('flow-handle-limit-reached')).toBe(false);
  });
});
