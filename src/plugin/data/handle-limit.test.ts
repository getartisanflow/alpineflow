// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import { HANDLE_LIMIT_KEY } from '../directives/flow-handle-limit';
import { checkHandleLimits } from '../directives/flow-handle';

// jsdom doesn't implement CSS.escape — minimal polyfill for simple IDs
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
});

describe('HANDLE_LIMIT_KEY', () => {
  it('is a string constant', () => {
    expect(typeof HANDLE_LIMIT_KEY).toBe('string');
    expect(HANDLE_LIMIT_KEY).toBe('_flowHandleLimit');
  });

  it('can be set and read on an HTMLElement', () => {
    const el = document.createElement('div');
    el[HANDLE_LIMIT_KEY] = 3;
    expect(el[HANDLE_LIMIT_KEY]).toBe(3);
  });

  it('can be deleted from an HTMLElement', () => {
    const el = document.createElement('div');
    el[HANDLE_LIMIT_KEY] = 1;
    delete el[HANDLE_LIMIT_KEY];
    expect(el[HANDLE_LIMIT_KEY]).toBeUndefined();
  });

  it('stores numeric value', () => {
    const el = document.createElement('div');
    el[HANDLE_LIMIT_KEY] = 5;
    expect(typeof el[HANDLE_LIMIT_KEY]).toBe('number');
    expect(el[HANDLE_LIMIT_KEY]).toBe(5);
  });
});

/**
 * Helper to build a minimal DOM structure for checkHandleLimits tests.
 * Returns the container element.
 */
function buildContainer(nodes: { id: string; handles: { id: string; type: 'source' | 'target'; limit?: number }[] }[]) {
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
      if (handle.limit !== undefined) {
        handleEl[HANDLE_LIMIT_KEY] = handle.limit;
      }
      nodeEl.appendChild(handleEl);
    }
    container.appendChild(nodeEl);
  }
  return container;
}

describe('checkHandleLimits', () => {
  it('returns true when no limit is set', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source' }] },
      { id: 'b', handles: [{ id: 'target', type: 'target' }] },
    ]);
    const result = checkHandleLimits(container, { source: 'a', target: 'b' }, []);
    expect(result).toBe(true);
  });

  it('returns true when count is under limit', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source' }] },
      { id: 'b', handles: [{ id: 'target', type: 'target', limit: 2 }] },
    ]);
    const edges = [{ source: 'x', target: 'b', targetHandle: 'target' }];
    const result = checkHandleLimits(container, { source: 'a', target: 'b' }, edges);
    expect(result).toBe(true);
  });

  it('returns false when target handle count equals limit', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source' }] },
      { id: 'b', handles: [{ id: 'target', type: 'target', limit: 1 }] },
    ]);
    const edges = [{ source: 'x', target: 'b', targetHandle: 'target' }];
    const result = checkHandleLimits(container, { source: 'a', target: 'b' }, edges);
    expect(result).toBe(false);
  });

  it('returns false when source handle count is at limit', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source', limit: 1 }] },
      { id: 'b', handles: [{ id: 'target', type: 'target' }] },
    ]);
    const edges = [{ source: 'a', sourceHandle: 'source', target: 'x' }];
    const result = checkHandleLimits(container, { source: 'a', target: 'b' }, edges);
    expect(result).toBe(false);
  });

  it('defaults missing sourceHandle to "source" when counting', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source', limit: 1 }] },
      { id: 'b', handles: [{ id: 'target', type: 'target' }] },
    ]);
    // Edge without explicit sourceHandle should match the default 'source'
    const edges = [{ source: 'a', target: 'x' }];
    const result = checkHandleLimits(container, { source: 'a', target: 'b' }, edges);
    expect(result).toBe(false);
  });

  it('defaults missing targetHandle to "target" when counting', () => {
    const container = buildContainer([
      { id: 'a', handles: [{ id: 'source', type: 'source' }] },
      { id: 'b', handles: [{ id: 'target', type: 'target', limit: 1 }] },
    ]);
    // Edge without explicit targetHandle should match the default 'target'
    const edges = [{ source: 'x', target: 'b' }];
    const result = checkHandleLimits(container, { source: 'a', target: 'b' }, edges);
    expect(result).toBe(false);
  });

  it('returns true when handle element is not in DOM', () => {
    // Empty container — no node elements
    const container = document.createElement('div');
    container.classList.add('flow-container');
    const result = checkHandleLimits(container, { source: 'a', target: 'b' }, []);
    expect(result).toBe(true);
  });
});
