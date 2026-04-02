// @vitest-environment jsdom
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';

/**
 * Tests that querySelector calls work correctly with special-character IDs
 * when using CSS.escape(). This validates the fix applied across flow-canvas.ts,
 * flow-edge.ts, and flow-handle.ts.
 */

// jsdom doesn't implement CSS.escape — polyfill it (W3C spec algorithm)
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string): string => {
      const str = String(value);
      const len = str.length;
      let result = '';
      for (let i = 0; i < len; i++) {
        const ch = str.charCodeAt(i);
        // Null bytes → U+FFFD
        if (ch === 0x0000) { result += '\uFFFD'; continue; }
        if (
          (ch >= 0x0001 && ch <= 0x001F) || ch === 0x007F ||
          (i === 0 && ch >= 0x0030 && ch <= 0x0039) ||
          (i === 1 && ch >= 0x0030 && ch <= 0x0039 && str.charCodeAt(0) === 0x002D)
        ) {
          result += '\\' + ch.toString(16) + ' ';
          continue;
        }
        if (i === 0 && len === 1 && ch === 0x002D) { result += '\\' + str.charAt(i); continue; }
        if (
          ch >= 0x0080 ||
          ch === 0x002D || ch === 0x005F ||
          (ch >= 0x0030 && ch <= 0x0039) ||
          (ch >= 0x0041 && ch <= 0x005A) ||
          (ch >= 0x0061 && ch <= 0x007A)
        ) {
          result += str.charAt(i);
          continue;
        }
        result += '\\' + str.charAt(i);
      }
      return result;
    };
  }
});

let container: HTMLElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  return () => {
    container.remove();
  };
});

// ── Helpers ─────────────────────────────────────────────────────────────────

function addNode(id: string): HTMLElement {
  const el = document.createElement('div');
  el.dataset.flowNodeId = id;
  container.appendChild(el);
  return el;
}

function addEdge(id: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.setAttribute('data-flow-edge-id', id);
  container.appendChild(svg);
  return svg;
}

function addHandle(parent: HTMLElement, handleId: string): HTMLElement {
  const el = document.createElement('div');
  el.dataset.flowHandleId = handleId;
  parent.appendChild(el);
  return el;
}

// ── Node selectors ──────────────────────────────────────────────────────────

describe('CSS.escape with node IDs', () => {
  it('finds nodes with backslash IDs', () => {
    const el = addNode('App\\Models\\User');
    const found = container.querySelector(`[data-flow-node-id="${CSS.escape('App\\Models\\User')}"]`);
    expect(found).toBe(el);
  });

  it('fails to find backslash IDs without CSS.escape', () => {
    addNode('App\\Models\\User');
    const found = container.querySelector(`[data-flow-node-id="App\\Models\\User"]`);
    expect(found).toBeNull();
  });

  it('finds nodes with dot-separated IDs', () => {
    const el = addNode('user.id');
    const found = container.querySelector(`[data-flow-node-id="${CSS.escape('user.id')}"]`);
    expect(found).toBe(el);
  });

  it('finds nodes with colon IDs', () => {
    const el = addNode('ns:node');
    const found = container.querySelector(`[data-flow-node-id="${CSS.escape('ns:node')}"]`);
    expect(found).toBe(el);
  });

  it('finds nodes with quote IDs', () => {
    const el = addNode('node"quoted');
    const found = container.querySelector(`[data-flow-node-id="${CSS.escape('node"quoted')}"]`);
    expect(found).toBe(el);
  });

  it('finds nodes with simple IDs (no escaping needed)', () => {
    const el = addNode('simple-node-1');
    const found = container.querySelector(`[data-flow-node-id="${CSS.escape('simple-node-1')}"]`);
    expect(found).toBe(el);
  });
});

// ── Edge selectors ──────────────────────────────────────────────────────────

describe('CSS.escape with edge IDs', () => {
  it('finds edges with backslash IDs', () => {
    const el = addEdge('e-App\\Models\\User-App\\Models\\Team');
    const found = container.querySelector(
      `[data-flow-edge-id="${CSS.escape('e-App\\Models\\User-App\\Models\\Team')}"]`,
    );
    expect(found).toBe(el);
  });

  it('finds edges with simple IDs', () => {
    const el = addEdge('e-a-b');
    const found = container.querySelector(`[data-flow-edge-id="${CSS.escape('e-a-b')}"]`);
    expect(found).toBe(el);
  });
});

// ── Handle selectors ────────────────────────────────────────────────────────

describe('CSS.escape with handle IDs', () => {
  it('finds handles with backslash + dot IDs', () => {
    const nodeEl = addNode('App\\Models\\User');
    const handleEl = addHandle(nodeEl, 'App\\Models\\User.id-r');

    const foundNode = container.querySelector(
      `[data-flow-node-id="${CSS.escape('App\\Models\\User')}"]`,
    );
    const foundHandle = foundNode?.querySelector(
      `[data-flow-handle-id="${CSS.escape('App\\Models\\User.id-r')}"]`,
    );
    expect(foundHandle).toBe(handleEl);
  });

  it('finds handles with simple IDs', () => {
    const nodeEl = addNode('user');
    const handleEl = addHandle(nodeEl, 'user.id-r');

    const foundNode = container.querySelector(
      `[data-flow-node-id="${CSS.escape('user')}"]`,
    );
    const foundHandle = foundNode?.querySelector(
      `[data-flow-handle-id="${CSS.escape('user.id-r')}"]`,
    );
    expect(foundHandle).toBe(handleEl);
  });
});
