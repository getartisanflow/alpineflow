// @vitest-environment jsdom
// ============================================================================
// Delegated handle pointerdown — one listener per canvas, not one per handle.
//
// The behavioral risk in this workstream is EVENT ORDERING, not state recovery
// (see the inventory in handle-delegation.ts). Every test below locks in one
// link of the propagation chain that the per-handle listeners used to provide
// implicitly by sitting deeper in the tree than everything else.
// ============================================================================

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowHandleDirective } from './directives/flow-handle';
import { registerSchemaReorderableDirective } from '../schema/reorderable';
import { installHandleDelegation } from './handle-delegation';
import type { FlowEdge } from '../core/types';

beforeAll(() => {
  // jsdom doesn't implement CSS.escape — minimal polyfill for simple IDs
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => String(value);
  }
  // jsdom doesn't implement elementFromPoint; the drop path calls it when no
  // handle is snapped. Returning null models "dropped on empty space".
  if (typeof document.elementFromPoint !== 'function') {
    document.elementFromPoint = () => null;
  }
  // The reorderable directive tries to take pointer capture on pointerdown.
  for (const m of ['setPointerCapture', 'releasePointerCapture'] as const) {
    if (typeof (HTMLElement.prototype as any)[m] !== 'function') {
      (HTMLElement.prototype as any)[m] = function (): void {};
    }
  }
  if (typeof (HTMLElement.prototype as any).hasPointerCapture !== 'function') {
    (HTMLElement.prototype as any).hasPointerCapture = function (): boolean { return false; };
  }

  registerFlowHandleDirective(Alpine);
  registerSchemaReorderableDirective(Alpine);
});

function clearChildren(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** Give an element a measurable box — buildHandleIndex skips zero-size handles. */
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

function pointer(target: Element | Document, type: string, x = 0, y = 0, button = 0): PointerEvent {
  const ev = new PointerEvent(type, {
    clientX: x, clientY: y, button, bubbles: true, cancelable: true,
  });
  target.dispatchEvent(ev);
  return ev;
}

/**
 * Record every `addEventListener` type registered on `el` from now on.
 * Used instead of a prototype-wide spy so the assertion is scoped to exactly
 * the elements we care about and doesn't depend on mock-context internals.
 */
function recordListeners(el: HTMLElement): string[] {
  const types: string[] = [];
  const original = el.addEventListener.bind(el);
  el.addEventListener = ((type: string, ...rest: unknown[]) => {
    types.push(type);
    return (original as any)(type, ...rest);
  }) as typeof el.addEventListener;
  return types;
}

type MountOptions = {
  /** Written straight into `_config`. `false` = revert to per-handle listeners. */
  delegatedHandleEvents?: boolean;
  edges?: FlowEdge[];
  edgesReconnectable?: boolean;
  /** Render each node's handles inside an `x-schema-reorderable` row. */
  schemaRows?: boolean;
  /**
   * Wrap each node's handles in a nested PLAIN `[x-data]` scope — any Alpine
   * component a user drops inside a node (a disclosure, a menu, a form). This is
   * legal, common markup and the handles inside it are still OUR handles: Alpine's
   * `$data` merges the whole ancestor scope stack, so the directive resolves the
   * canvas through it. The delegated listener must not disown them.
   */
  nestedScope?: boolean;
  /**
   * Mount a REAL second canvas (its own `.flow-container` + `.flow-viewport` +
   * node + handle, driven by its own delegated listener) inside the parent's
   * viewport. This — not a bare `[x-data]` — is what "nested canvas" means.
   */
  nestedCanvas?: boolean;
};

const teardown: Array<() => void> = [];
afterEach(() => {
  while (teardown.length > 0) teardown.pop()?.();
  clearChildren(document.body);
});

/**
 * A `.flow-container` [x-data] canvas holding a real `.flow-viewport` with two
 * nodes, each with a source + target handle. Mirrors production markup closely
 * enough that the delegated listener lands where flow-canvas puts it.
 */
function mount(opts: MountOptions = {}) {
  clearChildren(document.body);

  const capturedEdges: FlowEdge[] = [...(opts.edges ?? [])];
  const emitted: Array<{ event: string; detail: any }> = [];

  const host = document.createElement('div');
  host.classList.add('flow-container');

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
      delegatedHandleEvents: opts.delegatedHandleEvents,
      edgesReconnectable: opts.edgesReconnectable,
      // Deterministic drag: no rAF autopan loop, generous snap radius.
      autoPanOnConnect: false,
      connectionSnapRadius: 50,
    } as Record<string, unknown>,
    _container: host,
    _announcer: null,
    viewport: { x: 0, y: 0, zoom: 1 },
    getNode(id: string) {
      return { id, connectable: true, position: { x: 0, y: 0 } };
    },
    addEdges(edge: FlowEdge | FlowEdge[]) {
      for (const e of Array.isArray(edge) ? edge : [edge]) capturedEdges.push(e);
    },
    addNodes() {},
    _emit(event: string, detail: any) {
      emitted.push({ event, detail });
    },
    _captureHistory() {},
    screenToFlowPosition(x: number, y: number) {
      return { x, y };
    },
  };

  (window as any).canvasScope = () => canvas;
  host.setAttribute('x-data', 'canvasScope()');

  const viewport = document.createElement('div');
  viewport.className = 'flow-viewport';
  host.appendChild(viewport);

  const makeNode = (id: string, xOffset: number) => {
    const nodeEl = document.createElement('div');
    nodeEl.setAttribute('x-flow-node', '');
    nodeEl.setAttribute('data-flow-node-id', id);

    // Handles live inside a row when we're modelling a schema node, so the row
    // (an ANCESTOR of the handle) can compete for the same pointerdown.
    let handleParent: HTMLElement = nodeEl;
    let row: HTMLElement | null = null;
    if (opts.schemaRows) {
      row = document.createElement('div');
      row.className = 'flow-schema-row';
      row.setAttribute('x-schema-reorderable', '');
      nodeEl.appendChild(row);
      // A second row so siblingRows() has something to reorder against.
      const row2 = document.createElement('div');
      row2.className = 'flow-schema-row';
      row2.setAttribute('x-schema-reorderable', '');
      nodeEl.appendChild(row2);
      handleParent = row;
    }

    if (opts.nestedScope) {
      const scope = document.createElement('div');
      scope.setAttribute('x-data', '{ open: false }');
      handleParent.appendChild(scope);
      handleParent = scope;
    }

    const src = document.createElement('div');
    src.setAttribute('x-flow-handle:source', '');
    src.dataset.flowHandleId = 'source';
    handleParent.appendChild(src);

    const tgt = document.createElement('div');
    tgt.setAttribute('x-flow-handle:target', '');
    tgt.dataset.flowHandleId = 'target';
    handleParent.appendChild(tgt);

    viewport.appendChild(nodeEl);

    // Distinct, measurable boxes so buildHandleIndex + findSnapTarget work.
    stubRect(src, { left: xOffset, top: 100, width: 20, height: 10 });
    stubRect(tgt, { left: xOffset, top: 0, width: 20, height: 10 });

    return { nodeEl, src, tgt, row };
  };

  const a = makeNode('a', 0);
  const b = makeNode('b', 300);

  // ── A REAL nested canvas: its own .flow-container + .flow-viewport ──────────
  // A second flowCanvas mounted inside the parent's viewport (a sub-flow preview,
  // a minimap-style inset). Its handles belong to IT, and are driven by ITS own
  // delegated listener — never by the parent's.
  let nested: {
    container: HTMLElement;
    viewport: HTMLElement;
    canvas: typeof canvas;
    source: HTMLElement;
    capturedEdges: FlowEdge[];
    emitted: Array<{ event: string; detail: any }>;
  } | null = null;

  if (opts.nestedCanvas) {
    const nestedEdges: FlowEdge[] = [];
    const nestedEmitted: Array<{ event: string; detail: any }> = [];

    const nestedContainer = document.createElement('div');
    nestedContainer.classList.add('flow-container');

    const nestedCanvas = {
      ...canvas,
      edges: nestedEdges,
      _container: nestedContainer,
      addEdges(edge: FlowEdge | FlowEdge[]) {
        for (const e of Array.isArray(edge) ? edge : [edge]) nestedEdges.push(e);
      },
      _emit(event: string, detail: any) {
        nestedEmitted.push({ event, detail });
      },
    };

    (window as any).nestedCanvasScope = () => nestedCanvas;
    nestedContainer.setAttribute('x-data', 'nestedCanvasScope()');

    const nestedViewport = document.createElement('div');
    nestedViewport.className = 'flow-viewport';
    nestedContainer.appendChild(nestedViewport);

    const nestedNode = document.createElement('div');
    nestedNode.setAttribute('x-flow-node', '');
    nestedNode.setAttribute('data-flow-node-id', 'nested-a');

    const nestedSource = document.createElement('div');
    nestedSource.setAttribute('x-flow-handle:source', '');
    nestedSource.dataset.flowHandleId = 'source';
    nestedNode.appendChild(nestedSource);
    nestedViewport.appendChild(nestedNode);

    viewport.appendChild(nestedContainer);
    stubRect(nestedContainer, { left: 500, top: 300, width: 200, height: 200 });
    stubRect(nestedSource, { left: 520, top: 400, width: 20, height: 10 });

    nested = {
      container: nestedContainer,
      viewport: nestedViewport,
      canvas: nestedCanvas as typeof canvas,
      source: nestedSource,
      capturedEdges: nestedEdges,
      emitted: nestedEmitted,
    };
  }

  document.body.appendChild(host);
  stubRect(host, { left: 0, top: 0, width: 800, height: 600 });

  // Record listener registrations from this point on — i.e. only those the
  // directives themselves add during initTree.
  const listeners = {
    sourceA: recordListeners(a.src),
    targetA: recordListeners(a.tgt),
    sourceB: recordListeners(b.src),
    targetB: recordListeners(b.tgt),
  };

  Alpine.initTree(host);

  // flow-canvas installs this at init; here we do it by hand on the same
  // element (`.flow-viewport`) and in the same phase (capture). A nested canvas
  // installs its own, exactly as a second flowCanvas instance would.
  if (opts.delegatedHandleEvents !== false) {
    teardown.push(installHandleDelegation(viewport, canvas));
    if (nested) {
      teardown.push(installHandleDelegation(nested.viewport, nested.canvas));
    }
  }

  teardown.push(() => {
    Alpine.destroyTree(host);
    host.remove();
  });

  return {
    host, viewport, canvas, capturedEdges, emitted, listeners, nested,
    nodeA: a.nodeEl, sourceA: a.src, targetA: a.tgt, rowA: a.row,
    nodeB: b.nodeEl, sourceB: b.src, targetB: b.tgt,
  };
}

/** Centre of the stubbed box for node B's target handle. */
const TARGET_B_CENTER = { x: 310, y: 5 };

describe('installHandleDelegation — listener count', () => {
  it('attaches ZERO per-handle pointerdown listeners when delegation is active', () => {
    const h = mount();

    for (const [name, types] of Object.entries(h.listeners)) {
      const pointerdowns = types.filter(t => t === 'pointerdown');
      expect(pointerdowns, `${name} attached ${pointerdowns.length} pointerdown listener(s)`).toEqual([]);
    }
  });

  it('still attaches the per-handle a11y / hover listeners (scope guard: pointerdown ONLY)', () => {
    const h = mount();

    // Source handles keep their reconnect-hover affordance…
    expect(h.listeners.sourceA).toContain('pointerenter');
    expect(h.listeners.sourceA).toContain('pointerleave');
    // …and target handles keep hover + click-to-connect.
    expect(h.listeners.targetB).toContain('pointerenter');
    expect(h.listeners.targetB).toContain('click');
  });
});

describe('drag-to-connect end to end via delegation', () => {
  it('creates the edge when dragging source A onto target B', () => {
    const h = mount();

    pointer(h.sourceA, 'pointerdown', 10, 105);
    pointer(document, 'pointermove', 220, 220); // past DRAG_THRESHOLD → drag starts
    pointer(document, 'pointermove', TARGET_B_CENTER.x, TARGET_B_CENTER.y); // snap to B
    pointer(document, 'pointerup', TARGET_B_CENTER.x, TARGET_B_CENTER.y);

    expect(h.capturedEdges).toHaveLength(1);
    expect(h.capturedEdges[0]).toMatchObject({
      source: 'a', sourceHandle: 'source', target: 'b', targetHandle: 'target',
    });
    expect(h.emitted.map(e => e.event)).toContain('connect');
  });

  it('applies + clears the validation classes across the drag', () => {
    const h = mount();

    pointer(h.sourceA, 'pointerdown', 10, 105);
    pointer(document, 'pointermove', 220, 220);
    expect(h.targetB.classList.contains('flow-handle-valid')).toBe(true);
    expect(h.targetA.classList.contains('flow-handle-invalid')).toBe(true); // self-connection

    pointer(document, 'pointerup', 220, 220);
    for (const el of [h.targetA, h.targetB]) {
      expect(el.classList.contains('flow-handle-valid')).toBe(false);
      expect(el.classList.contains('flow-handle-invalid')).toBe(false);
    }
  });

  it('calls preventDefault on the handle press (this is what suppresses the node drag)', () => {
    const h = mount();
    // d3-drag binds mousedown/touchstart on the node, not pointerdown — it is
    // only suppressed because the pointerdown is defaultPrevented, which stops
    // the browser synthesising the compatibility mouse event. jsdom does not
    // synthesise those, so this assertion is the closest the unit suite can get;
    // the real regression is covered in tests/integration/handle-delegation.
    const ev = pointer(h.sourceA, 'pointerdown', 10, 105);
    expect(ev.defaultPrevented).toBe(true);

    pointer(document, 'pointerup', 10, 105);
  });

  it('ignores a pointerdown that does not land on a handle', () => {
    const h = mount();

    pointer(h.nodeA, 'pointerdown', 10, 105);
    pointer(document, 'pointermove', 220, 220);

    expect(h.canvas.pendingConnection).toBeNull();
    expect(h.emitted).toHaveLength(0);
  });

  it('resolves the handle when the press lands on a DESCENDANT of the handle', () => {
    const h = mount();
    const pip = document.createElement('span');
    h.sourceA.appendChild(pip);

    pointer(pip, 'pointerdown', 10, 105);
    pointer(document, 'pointermove', 220, 220);

    expect(h.canvas.pendingConnection).not.toBeNull();
    pointer(document, 'pointerup', 220, 220);
  });
});

describe('whiteboard suppression — an active draw tool still wins', () => {
  it('does not start a connect-drag when a container-level capture listener stops the event', () => {
    const h = mount();

    // Exactly what flow-freehand / flow-eraser / flow-*-draw do when the tool
    // activates: container, capture phase, stopImmediatePropagation.
    const toolPresses: PointerEvent[] = [];
    h.host.addEventListener('pointerdown', (e) => {
      toolPresses.push(e as PointerEvent);
      e.stopImmediatePropagation();
    }, true);

    pointer(h.sourceA, 'pointerdown', 10, 105);
    pointer(document, 'pointermove', 220, 220);

    expect(toolPresses).toHaveLength(1); // the tool saw the press…
    expect(h.canvas.pendingConnection).toBeNull(); // …and the handle did not.
    expect(h.emitted).toHaveLength(0);
  });
});

describe('row-reorder suppression — capture phase is load-bearing', () => {
  it('a source-handle press does not start a schema row reorder', () => {
    const h = mount({ schemaRows: true });
    const row = h.rowA!;
    stubRect(row, { left: 0, top: 90, width: 200, height: 30 });

    pointer(h.sourceA, 'pointerdown', 10, 105);

    expect(row.classList.contains('flow-schema-row-dragging')).toBe(false);

    pointer(document, 'pointerup', 10, 105);
  });

  it('control: a press on the row ITSELF does start a reorder', () => {
    const h = mount({ schemaRows: true });
    const row = h.rowA!;
    stubRect(row, { left: 0, top: 90, width: 200, height: 30 });

    pointer(row, 'pointerdown', 10, 105);

    expect(row.classList.contains('flow-schema-row-dragging')).toBe(true);

    pointer(document, 'pointerup', 10, 105);
  });
});

describe('target fall-through — the source/target asymmetry survives delegation', () => {
  it('does NOT stop propagation when the target handle has no reconnectable edge', () => {
    const h = mount();
    const seen: PointerEvent[] = [];
    h.nodeB.addEventListener('pointerdown', (e) => seen.push(e as PointerEvent));

    pointer(h.targetB, 'pointerdown', 310, 5);

    // No edge ends on this handle → the press must fall through to whatever sits
    // underneath (node drag, row reorder).
    expect(seen).toHaveLength(1);
    expect(seen[0].defaultPrevented).toBe(false);
  });

  it('DOES stop propagation when the target handle has a reconnectable edge', () => {
    const h = mount({ edges: [{ id: 'e1', source: 'a', target: 'b', targetHandle: 'target' } as FlowEdge] });
    const seen: PointerEvent[] = [];
    h.nodeB.addEventListener('pointerdown', (e) => seen.push(e as PointerEvent));

    pointer(h.targetB, 'pointerdown', 310, 5);

    expect(seen).toHaveLength(0); // reconnect gesture claimed the press
    pointer(document, 'pointerup', 310, 5);
  });

  it('a source-handle press always stops propagation, even with no edges', () => {
    const h = mount();
    const seen: PointerEvent[] = [];
    h.nodeA.addEventListener('pointerdown', (e) => seen.push(e as PointerEvent));

    pointer(h.sourceA, 'pointerdown', 10, 105);

    expect(seen).toHaveLength(0);
    pointer(document, 'pointerup', 10, 105);
  });
});

describe('delegatedHandleEvents: false — the revert path', () => {
  it('restores the per-handle pointerdown listeners', () => {
    const h = mount({ delegatedHandleEvents: false });

    expect(h.listeners.sourceA.filter(t => t === 'pointerdown')).toEqual(['pointerdown']);
    expect(h.listeners.targetB.filter(t => t === 'pointerdown')).toEqual(['pointerdown']);
  });

  it('still connects end to end with no delegated listener installed', () => {
    const h = mount({ delegatedHandleEvents: false });

    pointer(h.sourceA, 'pointerdown', 10, 105);
    pointer(document, 'pointermove', 220, 220);
    pointer(document, 'pointermove', TARGET_B_CENTER.x, TARGET_B_CENTER.y);
    pointer(document, 'pointerup', TARGET_B_CENTER.x, TARGET_B_CENTER.y);

    expect(h.capturedEdges).toHaveLength(1);
    expect(h.capturedEdges[0]).toMatchObject({ source: 'a', target: 'b' });
  });
});

describe('multi-canvas safety', () => {
  // Ownership is discriminated on the CANVAS ROOT (`.flow-container`), not on the
  // nearest `[x-data]`. A nested canvas necessarily has its own container; a plain
  // Alpine scope inside a node does not. Both tests below have to hold at once —
  // the second is the one that broke when ownership was keyed off `[x-data]`.

  it('a parent canvas does not drive a handle that belongs to a nested CANVAS', () => {
    const h = mount({ nestedCanvas: true });
    const nested = h.nested!;

    pointer(nested.source, 'pointerdown', 530, 405);
    pointer(document, 'pointermove', 600, 500);

    // The parent's listener saw the press (it is on an ancestor, in capture) and
    // must have declined it.
    expect(h.canvas.pendingConnection).toBeNull();
    expect(h.emitted).toHaveLength(0);

    // …while the nested canvas's OWN listener drove it. Without this the
    // assertion above would pass vacuously on a listener that fires for nobody.
    expect(nested.canvas.pendingConnection).not.toBeNull();
    expect(nested.emitted.map(e => e.event)).toContain('connect-start');

    pointer(document, 'pointerup', 600, 500);
  });

  it('DOES drive a handle sitting inside a nested plain [x-data] scope within a node', () => {
    // <div x-flow-node><div x-data="{ open: false }"><div x-flow-handle:source>
    // Any Alpine component inside a node. Alpine's $data merges the whole ancestor
    // scope stack, so this handle has always resolved the canvas and always worked.
    // Delegation must not make it inert.
    const h = mount({ nestedScope: true });

    pointer(h.sourceA, 'pointerdown', 10, 105);
    pointer(document, 'pointermove', 220, 220);
    pointer(document, 'pointermove', TARGET_B_CENTER.x, TARGET_B_CENTER.y);
    pointer(document, 'pointerup', TARGET_B_CENTER.x, TARGET_B_CENTER.y);

    expect(h.capturedEdges).toHaveLength(1);
    expect(h.capturedEdges[0]).toMatchObject({
      source: 'a', sourceHandle: 'source', target: 'b', targetHandle: 'target',
    });
    expect(h.emitted.map(e => e.event)).toContain('connect');
  });
});

describe('gesture teardown', () => {
  it('aborts an in-flight connect-drag when the handle is destroyed mid-gesture', () => {
    const h = mount();

    pointer(h.sourceA, 'pointerdown', 10, 105);
    pointer(document, 'pointermove', 220, 220);
    expect(h.canvas.pendingConnection).not.toBeNull();

    // x-if toggle / Livewire morph / schema re-stamp: the handle's directive is
    // cleaned up while its gesture is still live.
    Alpine.destroyTree(h.nodeA);

    expect(h.canvas.pendingConnection).toBeNull();
    expect(h.host.classList.contains('flow-connecting')).toBe(false);
  });
});
