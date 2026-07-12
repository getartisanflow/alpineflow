// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowHandleDirective } from './flow-handle';
import * as handleIndexModule from '../handle-index';
import type { FlowEdge } from '../../core/types';

// jsdom doesn't implement CSS.escape — minimal polyfill for simple IDs
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
  // jsdom doesn't implement elementFromPoint; the pointer-drag drop path calls
  // it when no handle is snapped. Returning null models "dropped on empty space".
  if (typeof document.elementFromPoint !== 'function') {
    document.elementFromPoint = () => null;
  }
  registerFlowHandleDirective(Alpine);
});

/**
 * Clear a DOM node without using innerHTML (XSS-safe pattern).
 */
function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

const mountedHosts: HTMLElement[] = [];
afterEach(() => {
  while (mountedHosts.length > 0) {
    const el = mountedHosts.pop();
    el?.remove();
  }
});

type MountOptions = {
  keyboardConnect?: boolean;
  edges?: FlowEdge[];
  preventCycles?: boolean;
  isValidConnection?: (conn: any) => boolean;
  connectValidator?: (conn: any) => Promise<boolean | { allowed: boolean; reason?: string }>;
};

/**
 * Build a minimal Alpine scope exposing the canvas-like API that the
 * flow-handle directive reads (config, edges, getNode, _emit, addEdges, etc.).
 * Mounts it in the DOM and initializes Alpine so directives wire up.
 */
function mount(opts: MountOptions = {}) {
  clearChildren(document.body);

  const host = document.createElement('div');
  host.classList.add('flow-container');

  const capturedEdges: FlowEdge[] = [...(opts.edges ?? [])];

  const canvas = {
    edges: capturedEdges,
    _edgeMap: new Map(),
    _nodeMap: new Map(),
    selectedNodes: new Set<string>(),
    pendingConnection: null as any,
    _pendingReconnection: null as any,
    _connectValidating: false,
    _animationLocked: false,
    _config: {
      keyboardConnect: opts.keyboardConnect,
      preventCycles: opts.preventCycles,
      isValidConnection: opts.isValidConnection,
      connectValidator: opts.connectValidator,
    },
    _container: host,
    _announcer: null,
    viewport: { x: 0, y: 0, zoom: 1 },
    getNode(id: string) {
      return { id, connectable: true };
    },
    addEdges(edge: FlowEdge | FlowEdge[]) {
      const toAdd = Array.isArray(edge) ? edge : [edge];
      for (const e of toAdd) capturedEdges.push(e);
    },
    _emit() {},
    _captureHistory() {},
    screenToFlowPosition() {
      return { x: 0, y: 0 };
    },
  };

  // Expose the canvas stub as an Alpine scope function so `Alpine.$data(host)`
  // returns our mock — the flow-handle directive walks up to the nearest
  // `[x-data]` element and calls `Alpine.$data(el)` on it.
  (window as any).canvasScope = () => canvas;
  host.setAttribute('x-data', 'canvasScope()');

  // Two nodes with a source + target handle each
  const makeNode = (id: string) => {
    const nodeEl = document.createElement('div');
    nodeEl.setAttribute('x-flow-node', '');
    nodeEl.dataset.flowNodeId = id;
    nodeEl.setAttribute('data-flow-node-id', id);
    const src = document.createElement('div');
    src.setAttribute('x-flow-handle:source', '');
    src.dataset.flowHandleId = 'source';
    nodeEl.appendChild(src);
    const tgt = document.createElement('div');
    tgt.setAttribute('x-flow-handle:target', '');
    tgt.dataset.flowHandleId = 'target';
    nodeEl.appendChild(tgt);
    return { nodeEl, src, tgt };
  };

  const a = makeNode('a');
  const b = makeNode('b');
  host.appendChild(a.nodeEl);
  host.appendChild(b.nodeEl);

  document.body.appendChild(host);
  mountedHosts.push(host);

  Alpine.initTree(host);

  return {
    host,
    canvas,
    capturedEdges,
    sourceA: a.src,
    targetA: a.tgt,
    sourceB: b.src,
    targetB: b.tgt,
  };
}

function keydown(el: Element | Document, key: string) {
  const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  el.dispatchEvent(ev);
  return ev;
}

/**
 * Give a handle a non-zero measured box. buildHandleIndex (used by the
 * index-backed connect-drag path) skips zero-size handles, and jsdom reports
 * all-zero rects by default — so the drag would index nothing without this.
 */
function stubRect(
  el: HTMLElement,
  rect: { left: number; top: number; width: number; height: number },
): void {
  el.getBoundingClientRect = () =>
    ({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      x: rect.left,
      y: rect.top,
      toJSON: () => {},
    }) as DOMRect;
}

function pointer(target: Element | Document, type: string, x = 0, y = 0): void {
  target.dispatchEvent(
    new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true }),
  );
}

describe('keyboard drag-to-connect focusability attributes', () => {
  it('sets tabindex, role, aria-label on source + target handles when keyboardConnect:true', () => {
    const { sourceA, targetB } = mount({ keyboardConnect: true });

    expect(sourceA.getAttribute('tabindex')).toBe('0');
    expect(sourceA.getAttribute('role')).toBe('button');
    expect(sourceA.getAttribute('aria-label')).toMatch(/source handle/i);

    expect(targetB.getAttribute('tabindex')).toBe('0');
    expect(targetB.getAttribute('role')).toBe('button');
    expect(targetB.getAttribute('aria-label')).toMatch(/target handle/i);
  });

  it('does NOT set any a11y attributes when keyboardConnect is absent', () => {
    const { sourceA, targetB } = mount({});

    expect(sourceA.getAttribute('tabindex')).toBeNull();
    expect(sourceA.getAttribute('role')).toBeNull();
    expect(sourceA.getAttribute('aria-label')).toBeNull();

    expect(targetB.getAttribute('tabindex')).toBeNull();
    expect(targetB.getAttribute('role')).toBeNull();
    expect(targetB.getAttribute('aria-label')).toBeNull();
  });

  it('does NOT set any a11y attributes when keyboardConnect:false', () => {
    const { sourceA, targetB } = mount({ keyboardConnect: false });

    expect(sourceA.getAttribute('tabindex')).toBeNull();
    expect(sourceA.getAttribute('role')).toBeNull();
    expect(targetB.getAttribute('tabindex')).toBeNull();
    expect(targetB.getAttribute('role')).toBeNull();
  });
});

describe('keyboard drag-to-connect: arming via source handle', () => {
  it('Enter on a focused source handle arms a pending connection', () => {
    const { canvas, sourceA } = mount({ keyboardConnect: true });

    keydown(sourceA, 'Enter');

    expect(canvas._pendingKeyboardConnect).toBeTruthy();
    expect(canvas._pendingKeyboardConnect?.sourceNodeId).toBe('a');
    expect(canvas._pendingKeyboardConnect?.sourceHandleId).toBe('source');
    expect(sourceA.classList.contains('flow-handle-connect-pending')).toBe(true);
  });

  it('Space on a focused source handle arms a pending connection (parity with Enter)', () => {
    const { canvas, sourceA } = mount({ keyboardConnect: true });

    keydown(sourceA, ' ');

    expect(canvas._pendingKeyboardConnect?.sourceNodeId).toBe('a');
    expect(sourceA.classList.contains('flow-handle-connect-pending')).toBe(true);
  });

  it('re-arming on a different source replaces the pending state and moves the class', () => {
    const host = mount({ keyboardConnect: true });
    const { canvas, sourceA, sourceB } = host;

    keydown(sourceA, 'Enter');
    expect(sourceA.classList.contains('flow-handle-connect-pending')).toBe(true);

    keydown(sourceB, 'Enter');
    expect(canvas._pendingKeyboardConnect?.sourceNodeId).toBe('b');
    expect(sourceB.classList.contains('flow-handle-connect-pending')).toBe(true);
    // A must no longer be armed
    expect(sourceA.classList.contains('flow-handle-connect-pending')).toBe(false);
  });
});

describe('keyboard drag-to-connect: completing on target handle', () => {
  it('Enter on target handle with armed source creates an edge via validator pipeline', () => {
    const { canvas, capturedEdges, sourceA, targetB } = mount({ keyboardConnect: true });

    keydown(sourceA, 'Enter');
    expect(capturedEdges.length).toBe(0);

    keydown(targetB, 'Enter');
    expect(capturedEdges.length).toBe(1);
    const edge = capturedEdges[0];
    expect(edge.source).toBe('a');
    expect(edge.target).toBe('b');
    expect(edge.sourceHandle).toBe('source');
    expect(edge.targetHandle).toBe('target');
    // Pending state cleared after completion
    expect(canvas._pendingKeyboardConnect).toBeNull();
    expect(sourceA.classList.contains('flow-handle-connect-pending')).toBe(false);
  });

  it('Space on target handle with armed source also completes (parity with Enter)', () => {
    const { capturedEdges, sourceA, targetB } = mount({ keyboardConnect: true });

    keydown(sourceA, 'Enter');
    keydown(targetB, ' ');
    expect(capturedEdges.length).toBe(1);
  });

  it('Enter on target handle with no pending connection is a no-op (no edge created)', () => {
    const { capturedEdges, targetB } = mount({ keyboardConnect: true });

    keydown(targetB, 'Enter');
    expect(capturedEdges.length).toBe(0);
  });
});

describe('keyboard drag-to-connect: Escape cancels pending state', () => {
  it('Escape clears the pending connection and removes the class, no edge fires', () => {
    const { host, canvas, capturedEdges, sourceA } = mount({ keyboardConnect: true });

    keydown(sourceA, 'Enter');
    expect(canvas._pendingKeyboardConnect).toBeTruthy();

    // Dispatch Escape on the container — not document — to avoid global hijack
    keydown(host, 'Escape');

    expect(canvas._pendingKeyboardConnect).toBeNull();
    expect(sourceA.classList.contains('flow-handle-connect-pending')).toBe(false);
    expect(capturedEdges.length).toBe(0);
  });

  it('attaches only ONE Escape listener per container, regardless of handle count', () => {
    // Count 'keydown' listener attachments on the container element. With N
    // handles in a single .flow-container we should still only ever get ONE
    // shared Escape listener — not one per handle — otherwise Escape would
    // trigger clearPending N times (and bigger canvases accumulate listeners
    // on Alpine re-init / Livewire morphing).
    clearChildren(document.body);
    const host = document.createElement('div');
    host.classList.add('flow-container');

    let keydownListenerCount = 0;
    const origAdd = host.addEventListener.bind(host);
    host.addEventListener = ((type: string, ...rest: any[]) => {
      if (type === 'keydown') keydownListenerCount += 1;
      return origAdd(type, ...(rest as [any, any?]));
    }) as any;

    const canvas = {
      edges: [] as FlowEdge[],
      _edgeMap: new Map(),
      _nodeMap: new Map(),
      selectedNodes: new Set<string>(),
      pendingConnection: null as any,
      _pendingReconnection: null as any,
      _connectValidating: false,
      _animationLocked: false,
      _config: { keyboardConnect: true },
      _container: host,
      _announcer: null,
      viewport: { x: 0, y: 0, zoom: 1 },
      getNode(id: string) { return { id, connectable: true }; },
      addEdges() {},
      _emit() {},
      _captureHistory() {},
      screenToFlowPosition() { return { x: 0, y: 0 }; },
    };
    (window as any).canvasScope = () => canvas;
    host.setAttribute('x-data', 'canvasScope()');

    // Mount 4 handles (2 nodes × source+target) inside the same container
    for (const id of ['a', 'b']) {
      const nodeEl = document.createElement('div');
      nodeEl.setAttribute('x-flow-node', '');
      nodeEl.dataset.flowNodeId = id;
      nodeEl.setAttribute('data-flow-node-id', id);
      const src = document.createElement('div');
      src.setAttribute('x-flow-handle:source', '');
      src.dataset.flowHandleId = 'source';
      nodeEl.appendChild(src);
      const tgt = document.createElement('div');
      tgt.setAttribute('x-flow-handle:target', '');
      tgt.dataset.flowHandleId = 'target';
      nodeEl.appendChild(tgt);
      host.appendChild(nodeEl);
    }

    document.body.appendChild(host);
    mountedHosts.push(host);
    Alpine.initTree(host);

    // Exactly one keydown listener on the container (the shared Escape handler)
    expect(keydownListenerCount).toBe(1);
  });
});

describe('keyboard drag-to-connect: validator pipeline respected', () => {
  it('rejects the connection and fires flow-connect-rejected when isValidConnection returns false', () => {
    const { host, capturedEdges, sourceA, targetB } = mount({
      keyboardConnect: true,
      isValidConnection: () => false,
    });

    const rejected: any[] = [];
    host.addEventListener('flow-connect-rejected', (e: any) => rejected.push(e.detail));

    keydown(sourceA, 'Enter');
    keydown(targetB, 'Enter');

    expect(capturedEdges.length).toBe(0);
    expect(rejected.length).toBe(1);
    expect(rejected[0].source).toBe('a');
    expect(rejected[0].target).toBe('b');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Pointer connect-drag: the index lifecycle (build-at-start, clear-on-end).
//
// Reuses the same directive-mount harness above (mount() → Alpine.initTree wires
// the source-handle pointerdown listener). Drives a real pointerdown → pointermove
// (past DRAG_THRESHOLD) → pointerup/pointercancel so the assertions exercise the
// directive's own drag lifecycle, not applyValidationClasses in isolation:
//   • drag START must apply the index-backed validation classes, and
//   • every drag END/cancel path must clear them (which also releases the
//     per-gesture closure index for the next gesture).
// ─────────────────────────────────────────────────────────────────────────────
describe('pointer connect-drag: index-backed validation-class lifecycle', () => {
  /**
   * Prepare a mounted canvas for a deterministic, side-effect-free drag:
   * measurable handles (so buildHandleIndex includes them), snap radius 0 (no
   * snap target / no edge created), and autopan off (no rAF loop).
   */
  function armDrag(h: ReturnType<typeof mount>): void {
    for (const el of [h.sourceA, h.targetA, h.sourceB, h.targetB]) {
      stubRect(el, { left: 100, top: 50, width: 20, height: 10 });
    }
    (h.canvas as any)._config.autoPanOnConnect = false;
    (h.canvas as any)._config.connectionSnapRadius = 0;
  }

  it('builds the handle index AND applies validation classes when a drag passes the threshold', () => {
    const h = mount();
    armDrag(h);
    // Spy calls through, so a real index is still built and classes still apply.
    // Asserting the build happened is what distinguishes "index-backed at start"
    // from a silent fall-through to the legacy path if the build were ever dropped.
    const buildSpy = vi.spyOn(handleIndexModule, 'buildHandleIndex');

    pointer(h.sourceA, 'pointerdown', 100, 100);
    pointer(document, 'pointermove', 220, 220); // Δ120 ≫ DRAG_THRESHOLD (5)

    // Drag START built the per-gesture index...
    expect(buildSpy).toHaveBeenCalledTimes(1);
    // ...and applied the validation classes: the target on the SOURCE node is a
    // self-connection (invalid); the other node's target is valid.
    expect(h.targetB.classList.contains('flow-handle-valid')).toBe(true);
    expect(h.targetA.classList.contains('flow-handle-invalid')).toBe(true);

    // Cleanup so the document-level move/up listeners don't leak into siblings.
    pointer(document, 'pointerup', 220, 220);
    buildSpy.mockRestore();
  });

  it('clears every validation class on a normal pointerup', () => {
    const h = mount();
    armDrag(h);

    pointer(h.sourceA, 'pointerdown', 100, 100);
    pointer(document, 'pointermove', 220, 220);
    expect(h.targetB.classList.contains('flow-handle-valid')).toBe(true); // applied

    pointer(document, 'pointerup', 220, 220);

    for (const el of [h.targetA, h.targetB]) {
      expect(el.classList.contains('flow-handle-valid')).toBe(false);
      expect(el.classList.contains('flow-handle-invalid')).toBe(false);
      expect(el.classList.contains('flow-handle-limit-reached')).toBe(false);
    }
  });

  it('clears every validation class on a cancelled drag (pointercancel)', () => {
    const h = mount();
    armDrag(h);

    pointer(h.sourceA, 'pointerdown', 100, 100);
    pointer(document, 'pointermove', 220, 220);
    expect(h.targetA.classList.contains('flow-handle-invalid')).toBe(true); // applied

    pointer(document, 'pointercancel', 220, 220);

    for (const el of [h.targetA, h.targetB]) {
      expect(el.classList.contains('flow-handle-valid')).toBe(false);
      expect(el.classList.contains('flow-handle-invalid')).toBe(false);
      expect(el.classList.contains('flow-handle-limit-reached')).toBe(false);
    }
  });
});
