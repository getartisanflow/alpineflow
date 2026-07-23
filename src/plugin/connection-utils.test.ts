// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createConnectionLine, findSnapTarget, startConnectionAutoPan, type ConnectionLineInstance } from './connection-utils';
import { createAutoPan } from '../core/auto-pan';
import { buildHandleIndex } from './handle-index';
import {
  HANDLE_CONNECTABLE_START_KEY,
  HANDLE_CONNECTABLE_END_KEY,
} from './directives/flow-handle-connectable';
import type { XYPosition } from '../core/types';

// Capture the onPan callback passed to createAutoPan so we can exercise the real
// delta-measurement logic without driving the rAF loop.
vi.mock('../core/auto-pan', () => ({
  createAutoPan: vi.fn(),
}));

describe('createConnectionLine', () => {
  describe('straight (default)', () => {
    it('returns svg and update/destroy functions', () => {
      const instance = createConnectionLine({});
      expect(instance.svg).toBeInstanceOf(SVGSVGElement);
      expect(typeof instance.update).toBe('function');
      expect(typeof instance.destroy).toBe('function');
    });

    it('renders an SVG path element', () => {
      const instance = createConnectionLine({});
      instance.update({ fromX: 0, fromY: 0, toX: 100, toY: 100, source: 'a' });
      const path = instance.svg.querySelector('path');
      expect(path).not.toBeNull();
    });

    it('update sets the d attribute with a straight line', () => {
      const instance = createConnectionLine({});
      instance.update({ fromX: 0, fromY: 0, toX: 100, toY: 100, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      expect(path.getAttribute('d')).toContain('M0,0');
      expect(path.getAttribute('d')).toContain('100,100');
    });

    it('applies default stroke style', () => {
      const instance = createConnectionLine({});
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      expect(path.getAttribute('stroke')).toBeTruthy();
      expect(path.getAttribute('stroke-width')).toBeTruthy();
      expect(path.getAttribute('stroke-dasharray')).toBeTruthy();
    });

    it('destroy removes svg from parent', () => {
      const instance = createConnectionLine({});
      const parent = document.createElement('div');
      parent.appendChild(instance.svg);
      instance.destroy();
      expect(parent.children.length).toBe(0);
    });
  });

  describe('bezier type', () => {
    it('renders a bezier path with C command', () => {
      const instance = createConnectionLine({ connectionLineType: 'bezier' });
      instance.update({ fromX: 0, fromY: 0, toX: 200, toY: 100, source: 'a' });
      const d = instance.svg.querySelector('path')!.getAttribute('d')!;
      expect(d).toContain('C');
    });
  });

  describe('smoothstep type', () => {
    it('renders a smoothstep path', () => {
      const instance = createConnectionLine({ connectionLineType: 'smoothstep' });
      instance.update({ fromX: 0, fromY: 0, toX: 200, toY: 100, source: 'a' });
      const d = instance.svg.querySelector('path')!.getAttribute('d')!;
      expect(d).toMatch(/[MLQ]/);
    });
  });

  describe('step type', () => {
    it('renders a step path', () => {
      const instance = createConnectionLine({ connectionLineType: 'step' });
      instance.update({ fromX: 0, fromY: 0, toX: 200, toY: 100, source: 'a' });
      const d = instance.svg.querySelector('path')!.getAttribute('d')!;
      expect(d).toMatch(/[ML]/);
    });
  });

  describe('custom style', () => {
    it('applies custom stroke properties', () => {
      const instance = createConnectionLine({
        connectionLineStyle: { stroke: '#ff0000', strokeWidth: 4, strokeDasharray: '10 5' },
      });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      expect(path.getAttribute('stroke')).toBe('#ff0000');
      expect(path.getAttribute('stroke-width')).toBe('4');
      expect(path.getAttribute('stroke-dasharray')).toBe('10 5');
    });
  });

  describe('custom renderer', () => {
    it('calls the custom function on update', () => {
      const customEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const customFn = vi.fn(() => customEl);
      const instance = createConnectionLine({ connectionLine: customFn });
      instance.update({ fromX: 10, fromY: 20, toX: 30, toY: 40, source: 'n1', sourceHandle: 'h1' });
      expect(customFn).toHaveBeenCalledTimes(1);
      expect(customFn).toHaveBeenCalledWith(expect.objectContaining({
        fromX: 10, fromY: 20, toX: 30, toY: 40,
        source: 'n1', sourceHandle: 'h1',
      }));
    });

    it('appends custom element to svg', () => {
      const customEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const customFn = vi.fn(() => customEl);
      const instance = createConnectionLine({ connectionLine: customFn });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      expect(instance.svg.contains(customEl)).toBe(true);
    });

    it('replaces previous custom element on subsequent update', () => {
      let callCount = 0;
      const customFn = vi.fn(() => {
        callCount++;
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        el.id = `custom-${callCount}`;
        return el;
      });
      const instance = createConnectionLine({ connectionLine: customFn });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      instance.update({ fromX: 0, fromY: 0, toX: 100, toY: 100, source: 'a' });
      expect(instance.svg.querySelector('#custom-1')).toBeNull();
      expect(instance.svg.querySelector('#custom-2')).not.toBeNull();
    });
  });

  describe('invalid flag', () => {
    it('uses invalid stroke color when invalid: true', () => {
      const instance = createConnectionLine({ invalid: true });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      // Falls back to hardcoded color since JSDOM has no CSS vars
      expect(path.getAttribute('stroke')).toBe('#ef4444');
    });

    it('uses normal stroke color when invalid: false', () => {
      const instance = createConnectionLine({ invalid: false });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      // Should be the default CONNECTION_ACTIVE_COLOR, not invalid red
      expect(path.getAttribute('stroke')).not.toBe('#ef4444');
    });

    it('uses containerEl CSS variable when provided', () => {
      const container = document.createElement('div');
      container.style.setProperty('--flow-connection-line-invalid', '#ff0000');
      const instance = createConnectionLine({ invalid: true, containerEl: container });
      instance.update({ fromX: 0, fromY: 0, toX: 50, toY: 50, source: 'a' });
      const path = instance.svg.querySelector('path')!;
      // JSDOM doesn't resolve CSS vars from inline style, so this tests the fallback path
      expect(path.getAttribute('stroke')).toBeTruthy();
    });
  });
});

describe('findSnapTarget', () => {
  function setupHandles() {
    const container = document.createElement('div');

    // Node A with a target handle
    const nodeA = document.createElement('div');
    nodeA.setAttribute('x-flow-node', '');
    nodeA.dataset.flowNodeId = 'a';
    const handleA1 = document.createElement('div');
    handleA1.dataset.flowHandleType = 'target';
    handleA1.dataset.flowHandleId = 'h1';
    handleA1.getBoundingClientRect = () => ({ left: 100, top: 100, width: 10, height: 10, right: 110, bottom: 110, x: 100, y: 100, toJSON: () => {} } as DOMRect);
    nodeA.appendChild(handleA1);
    container.appendChild(nodeA);

    // Node B with a target handle
    const nodeB = document.createElement('div');
    nodeB.setAttribute('x-flow-node', '');
    nodeB.dataset.flowNodeId = 'b';
    const handleB1 = document.createElement('div');
    handleB1.dataset.flowHandleType = 'target';
    handleB1.dataset.flowHandleId = 'h1';
    handleB1.getBoundingClientRect = () => ({ left: 200, top: 200, width: 10, height: 10, right: 210, bottom: 210, x: 200, y: 200, toJSON: () => {} } as DOMRect);
    nodeB.appendChild(handleB1);
    container.appendChild(nodeB);

    return { container, nodeA, nodeB, handleA1, handleB1 };
  }

  it('filters to handles on targetNodeId when provided', () => {
    const { container, handleB1 } = setupHandles();
    // Cursor at (110, 110) is closer to node A's handle at center (105,105)
    // than node B's handle at center (205,205). Without targetNodeId filter,
    // this would snap to node A. With targetNodeId='b', it must skip A and
    // only consider B (which is still within the large snap radius).
    const result = findSnapTarget({
      containerEl: container,
      handleType: 'target',
      excludeNodeId: 'source',
      cursorFlowPos: { x: 110, y: 110 },
      connectionSnapRadius: 200,
      getNode: () => ({}),
      toFlowPosition: (sx, sy) => ({ x: sx, y: sy }),
      targetNodeId: 'b',
    });
    expect(result.element).toBe(handleB1);
  });

  it('returns null when targetNodeId has no handles in range', () => {
    const { container } = setupHandles();
    const result = findSnapTarget({
      containerEl: container,
      handleType: 'target',
      excludeNodeId: 'source',
      cursorFlowPos: { x: 0, y: 0 },
      connectionSnapRadius: 5,
      getNode: () => ({}),
      toFlowPosition: (sx, sy) => ({ x: sx, y: sy }),
      targetNodeId: 'b',
    });
    expect(result.element).toBeNull();
  });
});

// ============================================================================
// findSnapTarget — indexed parity (Task A3)
//
// The LEGACY branch (querySelectorAll + per-handle getBoundingClientRect) is
// the ORACLE. Every fixture below runs the SAME DOM through both the legacy
// call (no `index`) and the indexed call (`index` built from that DOM via
// buildHandleIndex) and asserts the two return the SAME element and (within
// float tolerance) the SAME position. If the indexed path diverges on any
// fixture, the parity assertion fails.
//
// `Element.prototype.getBoundingClientRect` is replaced with a single
// prototype-level mock backed by a WeakMap (rather than stubbing each
// element's own property, as the older fixture above does) so that ALL rect
// reads — from both the legacy loop and buildHandleIndex's measuring pass —
// go through one spy. That is what lets the "zero rect reads" assertion mean
// anything: an own-property override would be invisible to a prototype spy.
// ============================================================================
describe('findSnapTarget — indexed parity (Task A3)', () => {
  let rectMap: WeakMap<Element, { left: number; top: number; width: number; height: number }>;
  let rectSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    rectMap = new WeakMap();
    rectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const r = rectMap.get(this) ?? { left: 0, top: 0, width: 0, height: 0 };
      return {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
        right: r.left + r.width,
        bottom: r.top + r.height,
        x: r.left,
        y: r.top,
        toJSON: () => {},
      } as DOMRect;
    });
  });

  afterEach(() => {
    rectSpy.mockRestore();
  });

  function stubRect(
    el: HTMLElement,
    rect: { left: number; top: number; width: number; height: number },
  ): void {
    rectMap.set(el, rect);
  }

  interface HandleSpec {
    type: 'source' | 'target';
    id?: string; // dataset.flowHandleId; defaults to type
    rect?: { left: number; top: number; width: number; height: number };
    connectableStart?: boolean;
    connectableEnd?: boolean;
  }

  interface NodeSpec {
    id: string;
    connectable?: boolean;
    handles: HandleSpec[];
  }

  /** Real DOM node elements carry BOTH markers: legacy resolves via [x-flow-node], the index via [data-flow-node-id]. */
  function buildDom(nodes: NodeSpec[]): HTMLElement {
    const container = document.createElement('div');

    for (const n of nodes) {
      const nodeEl = document.createElement('div');
      nodeEl.setAttribute('x-flow-node', '');
      nodeEl.dataset.flowNodeId = n.id;

      for (const h of n.handles) {
        const el = document.createElement('div');
        el.dataset.flowHandleType = h.type;
        el.dataset.flowHandleId = h.id ?? h.type;
        stubRect(el, h.rect ?? { left: 100, top: 100, width: 10, height: 10 });
        if (h.connectableStart === false) {
          el[HANDLE_CONNECTABLE_START_KEY] = false;
        }
        if (h.connectableEnd === false) {
          el[HANDLE_CONNECTABLE_END_KEY] = false;
        }
        nodeEl.appendChild(el);
      }

      container.appendChild(nodeEl);
    }

    return container;
  }

  function buildGetNode(nodes: NodeSpec[]) {
    const nodeMap = new Map(nodes.map((n) => [n.id, { id: n.id, connectable: n.connectable }]));
    return (id: string) => nodeMap.get(id);
  }

  /** Identity transform — handle centers only need to be comparable, not converted. */
  function toFlow(screenX: number, screenY: number): XYPosition {
    return { x: screenX, y: screenY };
  }

  function closePos(a: XYPosition, b: XYPosition): void {
    expect(a.x).toBeCloseTo(b.x, 5);
    expect(a.y).toBeCloseTo(b.y, 5);
  }

  /**
   * Run legacy then indexed against the SAME DOM + params and assert
   * byte-identical `{element, position}`. Returns the legacy result so
   * callers can additionally lock the concrete expected outcome (so the
   * battery can't pass vacuously on both paths agreeing on the wrong answer).
   */
  function assertParity(
    container: HTMLElement,
    params: Omit<Parameters<typeof findSnapTarget>[0], 'containerEl' | 'index'>,
  ): { element: HTMLElement | null; position: XYPosition } {
    const legacy = findSnapTarget({ containerEl: container, ...params });
    const index = buildHandleIndex(container, toFlow);
    const indexed = findSnapTarget({ containerEl: container, ...params, index });

    expect(indexed.element).toBe(legacy.element);
    closePos(indexed.position, legacy.position);
    return legacy;
  }

  it('indexed snap returns the same element/position as legacy with ZERO getBoundingClientRect calls', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'target', rect: { left: 100, top: 100, width: 10, height: 10 } }] },
      { id: 'b', handles: [{ type: 'target', rect: { left: 200, top: 200, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    const params = {
      handleType: 'target' as const,
      excludeNodeId: 'source',
      cursorFlowPos: { x: 108, y: 108 },
      connectionSnapRadius: 50,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    };

    const legacy = findSnapTarget({ containerEl: container, ...params });
    expect(legacy.element).not.toBeNull(); // fixture must actually exercise a real snap, not a vacuous null/null

    const index = buildHandleIndex(container, toFlow);
    rectSpy.mockClear();
    const indexed = findSnapTarget({ containerEl: container, ...params, index });

    expect(rectSpy).not.toHaveBeenCalled();
    expect(indexed.element).toBe(legacy.element);
    closePos(indexed.position, legacy.position);
  });

  it('excludeNodeId: index path skips the excluded node exactly like legacy', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'target', rect: { left: 100, top: 100, width: 10, height: 10 } }] },
      { id: 'b', handles: [{ type: 'target', rect: { left: 200, top: 200, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    const legacy = assertParity(container, {
      handleType: 'target',
      excludeNodeId: 'a',
      cursorFlowPos: { x: 105, y: 105 }, // closest to a's handle, but a is excluded
      connectionSnapRadius: 200,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    });
    expect(legacy.element?.dataset.flowNodeId).toBeUndefined(); // handle el itself has no flowNodeId
    expect((legacy.element?.closest('[x-flow-node]') as HTMLElement | null)?.dataset.flowNodeId).toBe('b');
  });

  it('targetNodeId: index path filters to the single target node exactly like legacy', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'target', rect: { left: 100, top: 100, width: 10, height: 10 } }] },
      { id: 'b', handles: [{ type: 'target', rect: { left: 200, top: 200, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    const legacy = assertParity(container, {
      handleType: 'target',
      excludeNodeId: 'source',
      cursorFlowPos: { x: 110, y: 110 }, // closer to a's handle than b's
      connectionSnapRadius: 200,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
      targetNodeId: 'b',
    });
    expect((legacy.element?.closest('[x-flow-node]') as HTMLElement | null)?.dataset.flowNodeId).toBe('b');
  });

  it('non-connectable node (getNode → connectable:false): index path skips it exactly like legacy', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', connectable: false, handles: [{ type: 'target', rect: { left: 100, top: 100, width: 10, height: 10 } }] },
      { id: 'b', handles: [{ type: 'target', rect: { left: 200, top: 200, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    const legacy = assertParity(container, {
      handleType: 'target',
      excludeNodeId: 'source',
      cursorFlowPos: { x: 105, y: 105 }, // closest to a's handle, but a is non-connectable
      connectionSnapRadius: 200,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    });
    expect((legacy.element?.closest('[x-flow-node]') as HTMLElement | null)?.dataset.flowNodeId).toBe('b');
  });

  it('connectableEnd===false (dragging toward a target): index path skips it exactly like legacy', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'target', connectableEnd: false, rect: { left: 100, top: 100, width: 10, height: 10 } }] },
      { id: 'b', handles: [{ type: 'target', rect: { left: 200, top: 200, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    const legacy = assertParity(container, {
      handleType: 'target', // drag's own handleType is 'target' → guard reads connectableEnd
      excludeNodeId: 'source',
      cursorFlowPos: { x: 105, y: 105 },
      connectionSnapRadius: 200,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    });
    expect((legacy.element?.closest('[x-flow-node]') as HTMLElement | null)?.dataset.flowNodeId).toBe('b');
  });

  it('connectableStart===false (dragging toward a source): index path skips it exactly like legacy', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source', connectableStart: false, rect: { left: 100, top: 100, width: 10, height: 10 } }] },
      { id: 'b', handles: [{ type: 'source', rect: { left: 200, top: 200, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    const legacy = assertParity(container, {
      handleType: 'source', // drag's own handleType is 'source' → guard reads connectableStart
      excludeNodeId: 'target-node',
      cursorFlowPos: { x: 105, y: 105 },
      connectionSnapRadius: 200,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    });
    expect((legacy.element?.closest('[x-flow-node]') as HTMLElement | null)?.dataset.flowNodeId).toBe('b');
  });

  it('connectionMode "loose": index path (index.all) matches legacy candidates of both types', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source', rect: { left: 100, top: 100, width: 10, height: 10 } }] },
      { id: 'b', handles: [{ type: 'target', rect: { left: 300, top: 300, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    // Cursor is right on top of the SOURCE handle — dragging a 'target' handle
    // (looking for targets) would normally never match it in strict mode, but
    // loose mode snaps to handles of ANY type.
    const legacy = assertParity(container, {
      handleType: 'target',
      excludeNodeId: 'source-node',
      cursorFlowPos: { x: 105, y: 105 },
      connectionSnapRadius: 50,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
      connectionMode: 'loose',
    });
    expect((legacy.element?.closest('[x-flow-node]') as HTMLElement | null)?.dataset.flowNodeId).toBe('a');
  });

  it('connectionMode strict (default): index path (index.byType) matches legacy — same fixture as loose returns null instead', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'source', rect: { left: 100, top: 100, width: 10, height: 10 } }] },
      { id: 'b', handles: [{ type: 'target', rect: { left: 300, top: 300, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    // Same fixture and cursor as the loose-mode test above, but strict mode
    // only considers 'target' handles — the nearby source handle can't match,
    // and the target handle at (300,300) is out of radius.
    const legacy = assertParity(container, {
      handleType: 'target',
      excludeNodeId: 'source-node',
      cursorFlowPos: { x: 105, y: 105 },
      connectionSnapRadius: 50,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    });
    expect(legacy.element).toBeNull();
  });

  it('connectionSnapRadius <= 0: both paths short-circuit to {element: null} with ZERO rect reads', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'target', rect: { left: 100, top: 100, width: 10, height: 10 } }] },
    ];
    const container = buildDom(nodes);
    const params = {
      handleType: 'target' as const,
      excludeNodeId: 'source',
      cursorFlowPos: { x: 100, y: 100 },
      connectionSnapRadius: 0,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    };

    rectSpy.mockClear();
    const legacy = findSnapTarget({ containerEl: container, ...params });
    expect(legacy).toEqual({ element: null, position: params.cursorFlowPos });
    expect(rectSpy).not.toHaveBeenCalled();

    const index = buildHandleIndex(container, toFlow);
    rectSpy.mockClear();
    const indexed = findSnapTarget({ containerEl: container, ...params, index });
    expect(indexed).toEqual({ element: null, position: params.cursorFlowPos });
    expect(rectSpy).not.toHaveBeenCalled();
  });

  it('snap radius: a handle just OUTSIDE the radius returns null identically on both paths', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'target', rect: { left: 100, top: 100, width: 10, height: 10 } }] }, // center (105,105)
    ];
    const container = buildDom(nodes);
    // Distance from (105, 200) to (105, 105) is exactly 95 — just outside a radius of 94.
    const legacy = assertParity(container, {
      handleType: 'target',
      excludeNodeId: 'source',
      cursorFlowPos: { x: 105, y: 200 },
      connectionSnapRadius: 94,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    });
    expect(legacy.element).toBeNull();
  });

  it('snap radius: the same handle just INSIDE the radius returns it identically on both paths', () => {
    const nodes: NodeSpec[] = [
      { id: 'a', handles: [{ type: 'target', rect: { left: 100, top: 100, width: 10, height: 10 } }] }, // center (105,105)
    ];
    const container = buildDom(nodes);
    const legacy = assertParity(container, {
      handleType: 'target',
      excludeNodeId: 'source',
      cursorFlowPos: { x: 105, y: 200 },
      connectionSnapRadius: 96,
      getNode: buildGetNode(nodes),
      toFlowPosition: toFlow,
    });
    expect((legacy.element?.closest('[x-flow-node]') as HTMLElement | null)?.dataset.flowNodeId).toBe('a');
  });
});

describe('startConnectionAutoPan (frame-coalesced viewport)', () => {
  // A canvas whose _panZoom.setViewport updates the LIVE viewport synchronously
  // but defers the reactive `viewport` write — exactly what the rAF-coalesced
  // pipeline does. onPan must measure its applied delta against the live value.
  function coalescedCanvas() {
    const canvas: any = {
      _config: {},
      viewport: { x: 0, y: 0, zoom: 1 }, // reactive — NOT updated synchronously
      _viewportLive: { x: 0, y: 0, zoom: 1 },
      _panZoom: {
        setViewport(vp: any) {
          canvas._viewportLive = { x: vp.x, y: vp.y, zoom: vp.zoom };
        },
      },
    };
    return canvas;
  }

  function captureOnPan() {
    let captured: { onPan: (dx: number, dy: number) => boolean } | null = null;
    (createAutoPan as unknown as ReturnType<typeof vi.fn>).mockImplementation((opts: any) => {
      captured = opts;
      return { updatePointer: vi.fn(), start: vi.fn(), stop: vi.fn() };
    });
    return () => captured!;
  }

  it('onPan measures the applied delta via _viewportLive so the loop keeps running', () => {
    const get = captureOnPan();
    const canvas = coalescedCanvas();
    startConnectionAutoPan(document.createElement('div'), canvas, 0, 0);

    const hitBoundary = get().onPan(15, 0);

    expect(hitBoundary).toBe(false); // panned → not at boundary → loop continues
    expect(canvas._viewportLive.x).toBe(-15);
  });

  it('reports boundary (stops) only when the viewport truly cannot move', () => {
    const get = captureOnPan();
    const canvas = coalescedCanvas();
    canvas._panZoom.setViewport = () => {}; // simulate translateExtent clamp: no movement
    startConnectionAutoPan(document.createElement('div'), canvas, 0, 0);

    expect(get().onPan(15, 0)).toBe(true); // no movement → boundary → stop
  });
});
