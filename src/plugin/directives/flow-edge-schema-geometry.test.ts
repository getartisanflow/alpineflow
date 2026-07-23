// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowEdgeDirective } from './flow-edge';
import { registerFlowHandleDirective } from './flow-handle';
import { registerFlowSchemaDirective } from './flow-schema';

// ============================================================================
// Schema handle geometry — state-derived endpoints vs the DOM oracle (Task G3)
//
// The acceptance gate for Workstream G. `x-flow-edge` may derive a schema
// edge's endpoints from state (`canvas._schemaMetrics` + `computeSchemaHandlePoint`)
// instead of measuring handle DOM. That fast path is only correct if it lands
// endpoints in EXACTLY the same place the legacy DOM path does — same handle
// side, same coordinates, same post-marker shortening, same route.
//
// ── How the DOM stubs are built (read before touching them) ─────────────────
// jsdom has no layout engine, so every `getBoundingClientRect` in this file is
// stubbed. The stubs are generated from an EMULATED CSS BOX MODEL, derived from
// css/structural.css — never from `computeSchemaHandlePoint`. If the oracle's
// rects came out of the function under test, every parity assertion here would
// be tautological.
//
// The model, straight off the stylesheet:
//   .flow-node       box-sizing: border-box; border: <BORDER>px  (node.dimensions
//                    is the BORDER-BOX size; node.position is its top-left)
//   .flow-schema-*   header + body stack vertically inside the node's content
//                    box, no gaps
//   .flow-schema-row              border-bottom: 1px           (theme-default.css)
//   .flow-schema-row:last-child   border-bottom: none          → the LAST row is one
//                    border SHORTER than the rows above it. Modelled here because the
//                    real browser does it, and an earlier version of this stub — which
//                    transcribed structural.css only and so made every row uniform —
//                    was blind to it. That blindness let a 1px-per-node model error
//                    through this suite; the real-browser parity test
//                    (tests/integration/schema-handle-geometry-parity.test.ts) caught it.
//   .flow-schema-handle           top: 50%; translateY(-50%)   → centered on the row's
//                    PADDING box, which the border-bottom above shrinks. So the handle
//                    center is NOT the row's box center — it sits half a border higher.
//                    Same story: invisible to a structural.css-only transcription.
//   .flow-schema-handle--target   left: 0;  translateX(-50%)   → centered ON the row's left edge
//   .flow-schema-handle--source   right: 0; translateX(50%)    → centered ON the row's right edge
//   --mirror variants swap those two sides (invisible, still laid out)
//
// Screen space = container origin + viewport pan + flow coords × zoom, which is
// what the real `.flow-viewport` CSS transform produces. The DOM path converts
// back out of screen space itself (container rect + viewport + zoom), so the two
// paths only agree if the state path's arithmetic is genuinely right.
// ============================================================================

if (typeof globalThis.CSS === 'undefined') {
  (globalThis as unknown as { CSS: Partial<typeof CSS> }).CSS = {};
}
if (typeof CSS.escape !== 'function') {
  CSS.escape = (value: string) => String(value);
}

beforeAll(() => {
  registerFlowHandleDirective(Alpine);
  registerFlowSchemaDirective(Alpine);
  registerFlowEdgeDirective(Alpine);
});

const SVG_NS = 'http://www.w3.org/2000/svg';

// ── The emulated CSS box model ──────────────────────────────────────────────
const CONTAINER_LEFT = 37;
const CONTAINER_TOP = 19;
const HEADER_H = 34;
const ROW_H = 26;
/** The theme's row border-bottom, dropped on `:last-child` — so the last row is shorter. */
const ROW_BORDER = 1;
const LAST_ROW_H = ROW_H - ROW_BORDER;
const HANDLE = 10;

/** Node border-box → content-box insets. Real CSS is symmetric (border only). */
interface Insets {
  left: number;
  right: number;
  top: number;
}
const SYMMETRIC: Insets = { left: 1, right: 1, top: 1 };

interface FixtureNode {
  id: string;
  position: { x: number; y: number };
  dimensions?: { width: number; height: number };
  data: Record<string, unknown>;
  hidden?: boolean;
  collapsed?: boolean;
  condensed?: boolean;
  rotation?: number;
  /** Per-node anchor override. The renderer shifts the element by `dimensions × origin`. */
  nodeOrigin?: [number, number];
  /** Renders as a plain (non-schema) node with one left target + one right source. */
  plain?: boolean;
  /**
   * Renders hand-rolled field rows + field-keyed handles WITHOUT `x-flow-schema`
   * — the "skip the directive and write x-for + handles manually" pattern that
   * flow-schema.ts's own docblock invites. Same `data.fields` shape, arbitrary
   * row geometry.
   */
  custom?: boolean;
  [k: string]: unknown;
}

interface FixtureEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceHandle?: string;
  targetHandle?: string;
  markerStart?: string;
  markerEnd?: string;
  [k: string]: unknown;
}

interface MountOptions {
  nodes: FixtureNode[];
  edges: FixtureEdge[];
  config?: Record<string, unknown>;
  insets?: Insets;
  zoom?: number;
  viewport?: { x: number; y: number };
  /** WireFlow-style markup: `x-flow-schema` on a child of the `.flow-node` element. */
  slot?: boolean;
}

function fakeRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

function schemaFields(names: string[]): Array<{ name: string; type: string }> {
  return names.map((name) => ({ name, type: 'uuid' }));
}

/** Height a schema node needs for `n` rows under the emulated box model. */
function schemaHeight(rows: number, insets: Insets): number {
  return insets.top + HEADER_H + (rows - 1) * ROW_H + LAST_ROW_H + insets.top;
}

/** Row `index` of `count` is the last one ⇒ it lost its border-bottom ⇒ it's shorter. */
function rowHeightAt(index: number, count: number): number {
  return index === count - 1 ? LAST_ROW_H : ROW_H;
}

/**
 * Handle center, as an offset from its row's TOP.
 *
 * `top: 50%` resolves against the row's PADDING box — border-box minus its borders — so a
 * row carrying the theme's `border-bottom` centers its handle half a border ABOVE its own
 * box center. The last row has no border-bottom, so its padding box IS its border box.
 * Both cases land on the same number under this stylesheet (LAST_ROW_H / 2), which is a
 * coincidence worth stating explicitly rather than collapsing.
 */
function handleOffsetAt(index: number, count: number): number {
  const isLast = index === count - 1;
  const paddingBoxH = isLast ? LAST_ROW_H : ROW_H - ROW_BORDER;
  return paddingBoxH / 2;
}

const mounted: HTMLElement[] = [];
let rectSpy: ReturnType<typeof vi.spyOn> | null = null;

afterEach(() => {
  while (mounted.length > 0) {
    const host = mounted.pop()!;
    Alpine.destroyTree(host);
    host.remove();
  }
  rectSpy?.mockRestore();
  rectSpy = null;
});

function flush(): Promise<void> {
  return new Promise<void>((resolve) => Alpine.nextTick(() => resolve()));
}

let canvasSeq = 0;

/**
 * Install the layout stub. Rects are computed from the CSS box model above and
 * the LIVE node state, so moving a node re-lays-out its rows and handles just
 * like a browser would.
 */
function installLayout(
  nodes: FixtureNode[],
  insets: Insets,
  zoom: number,
  viewport: { x: number; y: number },
  configOrigin: [number, number] | undefined,
): ReturnType<typeof vi.spyOn> {
  const byId = (id: string | undefined): FixtureNode | undefined =>
    nodes.find((n) => n.id === id);

  const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect');
  spy.mockImplementation(function (this: Element): DOMRect {
    const el = this as HTMLElement;

    if (el.classList.contains('flow-container')) {
      return fakeRect(CONTAINER_LEFT, CONTAINER_TOP, 1200, 800);
    }

    const nodeEl = el.closest('[data-flow-node-id]') as HTMLElement | null;
    const node = byId(nodeEl?.dataset.flowNodeId);
    if (!nodeEl || !node) return fakeRect(0, 0, 0, 0);

    // A viewport-culled node carries inline `display: none` (flow-canvas
    // `_applyCulling`). A `display:none` element has no box at all: the browser
    // returns an all-zero rect for it AND for every descendant. Model that
    // faithfully — it is precisely what makes the DOM path DEGRADE on a culled
    // endpoint (0×0 handle rect ⇒ measureHandleCoords returns null ⇒ the endpoint
    // collapses to the node-edge midpoint), and the state path must match that.
    if (nodeEl.style.display === 'none') return fakeRect(0, 0, 0, 0);

    // Node border box, in screen space. A node with no `dimensions` in state
    // still occupies a box in the browser — the DOM path can measure it, the
    // state path cannot. Hence the fallback default here.
    const dims = node.dimensions ?? { width: 220, height: schemaHeight(FIELDS.length, insets) };
    // `nodeOrigin` moves the painted box, not `node.position`: the renderer writes
    // `left = absPos.x − width × origin[0]` (flow-node.ts), and the node's OWN origin
    // wins over the canvas config's. `toAbsoluteNode` does not undo that for a root
    // node, so under a non-default origin `node.position` is no longer the border-box
    // top-left — which is exactly why such a node is ineligible for the state path.
    const origin = node.nodeOrigin ?? configOrigin ?? [0, 0];
    const nx = CONTAINER_LEFT + viewport.x + (node.position.x - dims.width * origin[0]) * zoom;
    const ny = CONTAINER_TOP + viewport.y + (node.position.y - dims.height * origin[1]) * zoom;
    const nw = dims.width * zoom;
    const nh = dims.height * zoom;
    if (el === nodeEl) return fakeRect(nx, ny, nw, nh);

    // Content box (inside border + padding) — where the schema stack lives.
    const cLeft = nx + insets.left * zoom;
    const cTop = ny + insets.top * zoom;
    const cWidth = nw - (insets.left + insets.right) * zoom;

    // WireFlow slot wrapper: `.flow-schema-node` as a child of `.flow-node`.
    // A block child fills its parent's content box.
    if (el.classList.contains('flow-schema-node')) {
      return fakeRect(cLeft, cTop, cWidth, nh - 2 * insets.top * zoom);
    }

    if (el.classList.contains('flow-schema-header')) {
      return fakeRect(cLeft, cTop, cWidth, HEADER_H * zoom);
    }

    // The body stacks directly under the header and is exactly as tall as its rows
    // (no gap, no padding — see .flow-schema-body / .flow-schema-row in structural.css),
    // with the last row a border shorter (theme-default.css `:last-child`).
    if (el.classList.contains('flow-schema-body')) {
      const rows = el.children.length;
      const bodyH = rows === 0 ? 0 : (rows - 1) * ROW_H + LAST_ROW_H;
      return fakeRect(cLeft, cTop + HEADER_H * zoom, cWidth, bodyH * zoom);
    }

    /** Row index + sibling count — every row ABOVE the last is a full ROW_H tall. */
    const rowPos = (row: HTMLElement): { index: number; count: number } => {
      const siblings = Array.from(row.parentElement?.children ?? []);
      return { index: siblings.indexOf(row), count: siblings.length };
    };
    const rowTop = (row: HTMLElement): number =>
      cTop + (HEADER_H + rowPos(row).index * ROW_H) * zoom;

    if (el.classList.contains('flow-schema-row')) {
      const { index, count } = rowPos(el);
      return fakeRect(cLeft, rowTop(el), cWidth, rowHeightAt(index, count) * zoom);
    }

    if (el.classList.contains('flow-schema-handle')) {
      const row = el.closest('.flow-schema-row') as HTMLElement | null;
      if (!row) return fakeRect(0, 0, 0, 0);
      // Side comes straight from the stylesheet's rules, NOT from any directive
      // attribute: real target → left, real source → right, mirrors swap.
      const isMirror = el.classList.contains('flow-schema-handle--mirror');
      const isTarget = el.classList.contains('flow-schema-handle--target');
      const onLeft = isTarget !== isMirror;
      const cx = onLeft ? cLeft : cLeft + cWidth;
      const { index, count } = rowPos(row);
      const cy = rowTop(row) + handleOffsetAt(index, count) * zoom;
      const size = HANDLE * zoom;
      return fakeRect(cx - size / 2, cy - size / 2, size, size);
    }

    // Plain-node handles: vertically centered, on the node's left/right edge.
    if (el.classList.contains('flow-handle')) {
      const onLeft = el.dataset.flowHandlePosition === 'left';
      const cx = onLeft ? nx : nx + nw;
      const cy = ny + nh / 2;
      const size = HANDLE * zoom;
      return fakeRect(cx - size / 2, cy - size / 2, size, size);
    }

    return fakeRect(0, 0, 0, 0);
  } as unknown as () => DOMRect);

  return spy;
}

function mount(opts: MountOptions) {
  const insets = opts.insets ?? SYMMETRIC;
  const zoom = opts.zoom ?? 1;
  const viewport = opts.viewport ?? { x: 11, y: -7 };

  const configOrigin = (opts.config?.nodeOrigin as [number, number] | undefined) ?? undefined;

  rectSpy = installLayout(opts.nodes, insets, zoom, viewport, configOrigin);

  const canvas = {
    nodes: opts.nodes,
    edges: opts.edges,
    viewport: { ...viewport, zoom },
    selectedNodes: new Set<string>(),
    selectedEdges: new Set<string>(),
    selectedRows: new Set<string>(),
    _id: 'parity-canvas',
    _layoutAnimTick: 0,
    _zoomLevel: 'close' as const,
    _config: { ...(opts.config ?? {}) } as Record<string, unknown>,
    _shapeRegistry: undefined as unknown,
    _nodeMap: new Map<string, FixtureNode>(),
    _nodeElements: new Map<string, HTMLElement>(),
    _schemaMetrics: null as unknown,
    _obstacleSnapshot: null as unknown,
    _edgeDirtyTicks: new Map<string, number>(),
    _edgeCorridors: new Map<string, unknown>(),
    _draggingNodeIds: new Set<string>(),
    getNode(id: string) {
      return this.nodes.find((n) => n.id === id);
    },
    getEdge(id: string) {
      return this.edges.find((e) => e.id === id);
    },
    selectRow(key: string) {
      this.selectedRows.add(key);
    },
    deselectAll() {},
    _emitSelectionChange() {},
  };

  const scopeName = `__parityCanvas_${canvasSeq++}`;
  (window as unknown as Record<string, unknown>)[scopeName] = () => canvas;

  const host = document.createElement('div');
  host.className = 'flow-container';
  host.setAttribute('x-data', `${scopeName}()`);

  opts.nodes.forEach((n, i) => {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'flow-node';
    nodeEl.setAttribute('data-flow-node-id', n.id);
    nodeEl.setAttribute('x-data', `{ node: nodes[${i}] }`);

    if (n.plain) {
      const target = document.createElement('div');
      target.className = 'flow-handle';
      target.setAttribute('x-flow-handle:target.left', JSON.stringify('in'));
      nodeEl.appendChild(target);
      const source = document.createElement('div');
      source.className = 'flow-handle';
      source.setAttribute('x-flow-handle:source.right', JSON.stringify('out'));
      nodeEl.appendChild(source);
    } else if (n.custom) {
      // Hand-rolled rows: field-keyed handles, no schema directive, so no
      // `data-flow-schema-node` stamp and no uniform-row guarantee.
      const fields = (n.data.fields ?? []) as Array<{ name: string }>;
      for (const field of fields) {
        const row = document.createElement('div');
        row.className = 'custom-row';
        const target = document.createElement('div');
        target.className = 'flow-handle';
        target.setAttribute('x-flow-handle:target.left', JSON.stringify(field.name));
        row.appendChild(target);
        const source = document.createElement('div');
        source.className = 'flow-handle';
        source.setAttribute('x-flow-handle:source.right', JSON.stringify(field.name));
        row.appendChild(source);
        nodeEl.appendChild(row);
      }
    } else if (opts.slot) {
      // WireFlow markup: the schema directive owns a CHILD of the node element.
      const schemaEl = document.createElement('div');
      schemaEl.className = 'flow-schema-node';
      schemaEl.setAttribute('x-flow-schema', '');
      nodeEl.appendChild(schemaEl);
    } else {
      // Directive markup: x-flow-node + x-flow-schema on the same element.
      nodeEl.classList.add('flow-schema-node');
      nodeEl.setAttribute('x-flow-schema', '');
    }

    host.appendChild(nodeEl);
    canvas._nodeElements.set(n.id, nodeEl);
  });

  const svg = document.createElementNS(SVG_NS, 'svg');
  host.appendChild(svg);

  const groups: SVGGElement[] = [];
  opts.edges.forEach((_, i) => {
    const g = document.createElementNS(SVG_NS, 'g') as SVGGElement;
    g.setAttribute('x-flow-edge', `edges[${i}]`);
    svg.appendChild(g);
    groups.push(g);
  });

  document.body.appendChild(host);
  mounted.push(host);
  Alpine.initTree(host);

  const data = Alpine.$data(host) as unknown as typeof canvas;

  const pathD = (i: number): string => {
    const paths = groups[i].querySelectorAll('path');
    return (paths[paths.length - 1] as SVGPathElement).getAttribute('d') ?? '';
  };

  return { host, data, groups, pathD, spy: rectSpy! };
}

/** Mount, then let the deferred `_schemaMetrics` measurement land and edges re-run. */
async function mountSettled(opts: MountOptions) {
  const handle = mount(opts);
  await flush();
  await flush();
  return handle;
}

/** Re-run every edge effect without touching node state. */
async function reroute(data: { _layoutAnimTick: number }): Promise<void> {
  data._layoutAnimTick++;
  await flush();
}

/** `M<sx>,<sy> L<tx>,<ty>` → the four numbers (straight edges only). */
function straightEndpoints(d: string): { sx: number; sy: number; tx: number; ty: number } {
  const m = /^M(-?[\d.]+),(-?[\d.]+) L(-?[\d.]+),(-?[\d.]+)$/.exec(d);
  if (!m) throw new Error(`not a straight path: ${d}`);
  return { sx: +m[1], sy: +m[2], tx: +m[3], ty: +m[4] };
}

/** Rect reads that only the DOM handle-geometry path performs. */
function geometryRectCalls(spy: ReturnType<typeof vi.spyOn>): number {
  return spy.mock.instances.filter((el) => {
    const e = el as unknown as Element;
    if (!(e instanceof Element)) return false;
    return (
      e.matches('[data-flow-handle-id]') ||
      e.matches('[data-flow-node-id]') ||
      e.matches('.flow-container')
    );
  }).length;
}

// ── Fixtures ────────────────────────────────────────────────────────────────

const FIELDS = ['id', 'email', 'team_id', 'created_at'];
/** Node `d`'s single field — its only row is also its last row. */
const SINGLE_FIELD = ['uuid'];

/**
 * 3 schema nodes × 4 fields, plus a ONE-row node.
 *   a → b   b is to the RIGHT of a
 *   c       is directly BELOW a: identical x, identical width ⇒ the two candidate
 *           handle x's straddle the opposing node's center x EXACTLY, so
 *           `pickClosestHandle`'s strict `<` tie-break decides the side. Source
 *           ties right, target ties left (DOM order in `renderRow`).
 *   d       has a SINGLE field. Its only row is also `:last-child`, so it lost its
 *           border-bottom: `rowHeightLast` / `handleOffsetYLast` are the ones that
 *           apply and the `(n − 1) × rowHeight` stride term is zero. The metrics can
 *           never be measured FROM such a node (a stride needs two rows), so a 1-row
 *           node is only ever a CONSUMER of another node's metrics — the most
 *           delicate invariant on this path, hence a fixture node of its own.
 */
function schemaFixture(insets: Insets = SYMMETRIC): FixtureNode[] {
  const h = schemaHeight(FIELDS.length, insets);
  return [
    { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 220, height: h }, data: { label: 'A', fields: schemaFields(FIELDS) } },
    { id: 'b', position: { x: 500, y: 40 }, dimensions: { width: 220, height: h }, data: { label: 'B', fields: schemaFields(FIELDS) } },
    { id: 'c', position: { x: 0, y: 400 }, dimensions: { width: 220, height: h }, data: { label: 'C', fields: schemaFields(FIELDS) } },
    { id: 'd', position: { x: 500, y: 420 }, dimensions: { width: 220, height: schemaHeight(1, insets) }, data: { label: 'D', fields: schemaFields(SINGLE_FIELD) } },
  ];
}

/** Edges covering both non-tied side combinations + both tie directions + a route. */
function schemaEdges(): FixtureEdge[] {
  return [
    // b is right of a ⇒ source right, target left. Bezier control points depend
    // on the resolved handle POSITIONS, so `d` equality proves those match too.
    { id: 'e-right-left', source: 'a', target: 'b', sourceHandle: 'email', targetHandle: 'team_id', type: 'bezier', markerEnd: 'arrow' },
    // a is left of b ⇒ source left, target right. Straight + unmarked, so `d`
    // exposes the RAW handle centers.
    { id: 'e-left-right', source: 'b', target: 'a', sourceHandle: 'id', targetHandle: 'created_at', type: 'straight' },
    // Vertical stack ⇒ exact tie. Markers on BOTH ends, so `d` exposes the
    // post-`shortenEndpoint` coords and therefore the handleWidth/handleHeight
    // carried into the synthetic measurement.
    { id: 'e-tie-down', source: 'a', target: 'c', sourceHandle: 'id', targetHandle: 'id', type: 'straight', markerStart: 'arrow', markerEnd: 'arrow' },
    { id: 'e-tie-up', source: 'c', target: 'a', sourceHandle: 'created_at', targetHandle: 'created_at', type: 'smoothstep' },
    // Routing must be untouched by this task.
    { id: 'e-avoidant', source: 'a', target: 'b', sourceHandle: 'team_id', targetHandle: 'email', type: 'avoidant' },
    // The 1-row boundary: d's only row is its last row. Marked, so `d` also exposes
    // the post-`shortenEndpoint` coords on a single-row endpoint.
    { id: 'e-single-row', source: 'a', target: 'd', sourceHandle: 'created_at', targetHandle: 'uuid', type: 'straight', markerEnd: 'arrow' },
  ];
}

// ── Parity ──────────────────────────────────────────────────────────────────

describe('schema edge geometry — state path vs DOM oracle', () => {
  it('state-derived endpoints match the DOM-measured ones for every edge, with zero rect reads', async () => {
    const oracle = await mountSettled({
      nodes: schemaFixture(),
      edges: schemaEdges(),
      config: { schemaHandleGeometry: 'dom' },
    });
    const expected = schemaEdges().map((_, i) => oracle.pathD(i));
    // Sanity: the oracle really did measure DOM.
    expect(geometryRectCalls(oracle.spy)).toBeGreaterThan(0);
    Alpine.destroyTree(oracle.host);
    oracle.host.remove();
    mounted.pop();
    rectSpy?.mockRestore();

    const fast = await mountSettled({ nodes: schemaFixture(), edges: schemaEdges() });

    // Prove the fast path is what produced these paths: a full reroute must not
    // read a single node/handle/container rect.
    fast.spy.mockClear();
    await reroute(fast.data);
    expect(geometryRectCalls(fast.spy)).toBe(0);

    schemaEdges().forEach((edge, i) => {
      expect(`${edge.id}: ${fast.pathD(i)}`).toBe(`${edge.id}: ${expected[i]}`);
    });
  });

  it('resolves the asymmetric tie-break exactly like pickClosestHandle (source ties right, target ties left)', async () => {
    // c sits directly below a with the same width, so both candidate handles are
    // equidistant from the opposing node's center. `pickClosestHandle` uses a
    // strict `<`, so the FIRST handle in DOM order wins — and `renderRow` appends
    // the real source (right) before its mirror, but the real target (left)
    // before its mirror. Hence: source → right, target → left.
    const fast = await mountSettled({ nodes: schemaFixture(), edges: schemaEdges() });
    fast.spy.mockClear();
    await reroute(fast.data);
    expect(geometryRectCalls(fast.spy)).toBe(0); // these numbers came from state
    const { sx, sy, tx, ty } = straightEndpoints(fast.pathD(2)); // e-tie-down, a → c

    // The handle's center, not the row's box center — the row's border-bottom shrinks the
    // padding box that `top: 50%` resolves against. See `handleOffsetAt`.
    const rowCenter = (idx: number) =>
      SYMMETRIC.top + HEADER_H + idx * ROW_H + handleOffsetAt(idx, FIELDS.length);
    const rightX = 220 - SYMMETRIC.right;
    const leftX = SYMMETRIC.left;
    // Marker offset: handle radius (HANDLE/2) + marker padding (12.5 × 1.5 × 5/20 × 0.4).
    const offset = HANDLE / 2 + 12.5 * 1.5 * (5 / 20) * 0.4;

    // source on node a, field `id` (row 0) → RIGHT edge, pushed further right by markerStart
    expect(sx).toBeCloseTo(rightX + offset, 6);
    expect(sy).toBeCloseTo(rowCenter(0), 6);
    // target on node c (y = 400), field `id` (row 0) → LEFT edge, pushed further left by markerEnd
    expect(tx).toBeCloseTo(leftX - offset, 6);
    expect(ty).toBeCloseTo(400 + rowCenter(0), 6);
  });

  it('carries the real handle size into the synthetic measurement (marker offset survives)', async () => {
    // If handleWidth/handleHeight were left at 0, `shortenEndpoint` would use a
    // radius of 0 instead of HANDLE/2 and every marker'd endpoint would sit 5px
    // closer to the handle than the DOM path puts it.
    const nodes = schemaFixture();
    const edges: FixtureEdge[] = [
      { id: 'bare', source: 'a', target: 'c', sourceHandle: 'id', targetHandle: 'id', type: 'straight' },
      { id: 'marked', source: 'a', target: 'c', sourceHandle: 'id', targetHandle: 'id', type: 'straight', markerStart: 'arrow', markerEnd: 'arrow' },
    ];
    const fast = await mountSettled({ nodes, edges });
    fast.spy.mockClear();
    await reroute(fast.data);
    expect(geometryRectCalls(fast.spy)).toBe(0); // these numbers came from state
    const bare = straightEndpoints(fast.pathD(0));
    const marked = straightEndpoints(fast.pathD(1));

    const offset = HANDLE / 2 + 12.5 * 1.5 * (5 / 20) * 0.4;
    expect(marked.sx - bare.sx).toBeCloseTo(offset, 6);
    expect(marked.tx - bare.tx).toBeCloseTo(-offset, 6);
  });

  it('lands the only handle of a SINGLE-row schema node exactly where the DOM path does', async () => {
    // The 1-row boundary. A one-field node's only row is also `:last-child`, so it
    // carries no border-bottom: `rowHeightLast` and `handleOffsetYLast` are the terms
    // that apply, and the `(n − 1) × rowHeight` stride term is zero. Metrics can never
    // be measured from such a node (a stride needs two rows — flow-schema.ts skips
    // 1-row nodes), so it is purely a CONSUMER of another node's metrics: the row-count
    // arithmetic, the uniform-height cross-check and the last-row offset all have to
    // hold at n = 1 without a single measurement of their own. The big parity test above
    // already compares `e-single-row` against the oracle; this one pins the numbers to
    // the box model directly, so a regression names itself instead of just "paths differ".
    const fast = await mountSettled({ nodes: schemaFixture(), edges: schemaEdges() });
    fast.spy.mockClear();
    await reroute(fast.data);
    expect(geometryRectCalls(fast.spy)).toBe(0); // these numbers came from state

    const { sx, sy, tx, ty } = straightEndpoints(fast.pathD(5)); // e-single-row, a → d
    const offset = HANDLE / 2 + 12.5 * 1.5 * (5 / 20) * 0.4; // markerEnd shortening

    // source: node a, field `created_at` — a's LAST row (index 3 of 4) ⇒ handleOffsetYLast.
    // d is to the right of a, so the source sits on a's RIGHT edge. Unmarked end.
    expect(sx).toBeCloseTo(220 - SYMMETRIC.right, 6);
    expect(sy).toBeCloseTo(
      SYMMETRIC.top + HEADER_H + 3 * ROW_H + handleOffsetAt(3, FIELDS.length),
      6,
    );

    // target: node d (500, 420), its ONLY field — row 0 AND the last row, so the stride
    // term vanishes and the last-row offset applies. a is to d's left ⇒ d's LEFT edge,
    // pushed further left by markerEnd.
    expect(tx).toBeCloseTo(500 + SYMMETRIC.left - offset, 6);
    expect(ty).toBeCloseTo(420 + SYMMETRIC.top + HEADER_H + handleOffsetAt(0, 1), 6);
  });

  it('matches the DOM oracle under a non-unit zoom', async () => {
    const oracle = await mountSettled({
      nodes: schemaFixture(),
      edges: schemaEdges(),
      config: { schemaHandleGeometry: 'dom' },
      zoom: 1.5,
    });
    const expected = schemaEdges().map((_, i) => oracle.pathD(i));
    Alpine.destroyTree(oracle.host);
    oracle.host.remove();
    mounted.pop();
    rectSpy?.mockRestore();

    const fast = await mountSettled({ nodes: schemaFixture(), edges: schemaEdges(), zoom: 1.5 });
    fast.spy.mockClear();
    await reroute(fast.data);
    expect(geometryRectCalls(fast.spy)).toBe(0);

    schemaEdges().forEach((edge, i) => {
      expect(`${edge.id}: ${fast.pathD(i)}`).toBe(`${edge.id}: ${expected[i]}`);
    });
  });

  it('matches the DOM oracle in WireFlow slot markup (x-flow-schema on a child of .flow-node)', async () => {
    const oracle = await mountSettled({
      nodes: schemaFixture(),
      edges: schemaEdges(),
      config: { schemaHandleGeometry: 'dom' },
      slot: true,
    });
    const expected = schemaEdges().map((_, i) => oracle.pathD(i));
    Alpine.destroyTree(oracle.host);
    oracle.host.remove();
    mounted.pop();
    rectSpy?.mockRestore();

    const fast = await mountSettled({ nodes: schemaFixture(), edges: schemaEdges(), slot: true });
    fast.spy.mockClear();
    await reroute(fast.data);
    expect(geometryRectCalls(fast.spy)).toBe(0);

    schemaEdges().forEach((edge, i) => {
      expect(`${edge.id}: ${fast.pathD(i)}`).toBe(`${edge.id}: ${expected[i]}`);
    });
  });

  // Asymmetric insets are not what structural.css produces today (the node has a
  // border but no padding, so left/right insets match). They're here because the
  // side-selection midpoint must be the midpoint of the two HANDLE x's, not the
  // node's center x — a distinction only an asymmetric node can expose. They are
  // also the only way to reach the (right, right) / (left, left) side pairs.
  it.each([
    { name: 'right-biased insets ⇒ both endpoints right', insets: { left: 4, right: 6, top: 3 } },
    { name: 'left-biased insets ⇒ both endpoints left', insets: { left: 6, right: 4, top: 3 } },
  ])('matches the DOM oracle with $name', async ({ insets }) => {
    const nodes = () => {
      const h = schemaHeight(FIELDS.length, insets);
      return [
        { id: 'a', position: { x: 0, y: 0 }, dimensions: { width: 200, height: h }, data: { label: 'A', fields: schemaFields(FIELDS) } },
        { id: 'c', position: { x: 0, y: 400 }, dimensions: { width: 200, height: h }, data: { label: 'C', fields: schemaFields(FIELDS) } },
      ];
    };
    const edges: FixtureEdge[] = [
      { id: 'stack', source: 'a', target: 'c', sourceHandle: 'email', targetHandle: 'team_id', type: 'straight', markerEnd: 'arrow' },
    ];

    const oracle = await mountSettled({ nodes: nodes(), edges, insets, config: { schemaHandleGeometry: 'dom' } });
    const expected = oracle.pathD(0);
    Alpine.destroyTree(oracle.host);
    oracle.host.remove();
    mounted.pop();
    rectSpy?.mockRestore();

    const fast = await mountSettled({ nodes: nodes(), edges, insets });
    fast.spy.mockClear();
    await reroute(fast.data);
    expect(geometryRectCalls(fast.spy)).toBe(0);
    expect(fast.pathD(0)).toBe(expected);
  });

  it('renders a viewport-culled (display:none) endpoint identically to the DOM path', async () => {
    // `_applyCulling` writes inline `display: none` on off-screen NODE elements, and
    // an edge still renders when only ONE of its endpoints is visible. The DOM path
    // DEGRADES on a culled endpoint: the handle's rect is 0×0, `measureHandleCoords`
    // returns null, and the endpoint falls back to `getHandleCoords` (the node-edge
    // midpoint, side inferred from DOM order). The state path cannot see
    // `display:none` and would happily emit true row geometry — so every edge
    // crossing the culling boundary would render DIFFERENTLY than it does today.
    // Culling turns on at ≥150 nodes, i.e. exactly this workstream's target scale.
    // The fast path must therefore DECLINE a culled endpoint and match the
    // degradation exactly: this task changes how endpoints are computed, never
    // where they land.
    const cull = (h: { data: { _nodeElements: Map<string, HTMLElement> } }): void => {
      h.data._nodeElements.get('b')!.style.display = 'none';
    };

    const oracle = await mountSettled({
      nodes: schemaFixture(),
      edges: schemaEdges(),
      config: { schemaHandleGeometry: 'dom' },
    });
    cull(oracle);
    await reroute(oracle.data);
    const expected = schemaEdges().map((_, i) => oracle.pathD(i));
    Alpine.destroyTree(oracle.host);
    oracle.host.remove();
    mounted.pop();
    rectSpy?.mockRestore();

    const fast = await mountSettled({ nodes: schemaFixture(), edges: schemaEdges() });
    cull(fast);
    fast.spy.mockClear();
    await reroute(fast.data);

    // The edges touching the culled node must have taken the DOM path.
    expect(geometryRectCalls(fast.spy)).toBeGreaterThan(0);
    schemaEdges().forEach((edge, i) => {
      expect(`${edge.id}: ${fast.pathD(i)}`).toBe(`${edge.id}: ${expected[i]}`);
    });
  });

  it('re-derives endpoints from state when a node moves', async () => {
    const fast = await mountSettled({ nodes: schemaFixture(), edges: schemaEdges() });
    const before = fast.pathD(0);

    fast.spy.mockClear();
    fast.data.getNode('b')!.position.x = 900;
    await flush();

    expect(fast.pathD(0)).not.toBe(before);
    expect(geometryRectCalls(fast.spy)).toBe(0);
  });
});

// ── Fallback contract ───────────────────────────────────────────────────────

describe('schema edge geometry — fallback contract', () => {
  /** Mount fast-path-eligible config, reroute, and report whether DOM was read. */
  async function readsDom(opts: MountOptions): Promise<boolean> {
    const handle = await mountSettled(opts);
    handle.spy.mockClear();
    await reroute(handle.data);
    return geometryRectCalls(handle.spy) > 0;
  }

  it('defaults to the fast path with no config at all (schemaHandleGeometry: "auto")', async () => {
    expect(await readsDom({ nodes: schemaFixture(), edges: schemaEdges() })).toBe(false);
  });

  it('falls back to the DOM path when schemaHandleGeometry is "dom"', async () => {
    expect(
      await readsDom({
        nodes: schemaFixture(),
        edges: schemaEdges(),
        config: { schemaHandleGeometry: 'dom' },
      }),
    ).toBe(true);
  });

  it('falls back when _schemaMetrics has not landed yet', async () => {
    // Mount but do NOT let the deferred measurement land: the first edge run
    // has no metrics to work from and must measure DOM.
    const handle = mount({ nodes: schemaFixture(), edges: schemaEdges() });
    expect(handle.data._schemaMetrics).toBeNull();
    expect(geometryRectCalls(handle.spy)).toBeGreaterThan(0);
    expect(handle.pathD(0)).not.toBe('');
    await flush();
    await flush();
  });

  it.each([
    { name: 'a hidden endpoint', patch: { hidden: true } },
    { name: 'a collapsed endpoint', patch: { collapsed: true } },
    { name: 'a condensed endpoint', patch: { condensed: true } },
    { name: 'a rotated endpoint', patch: { rotation: 30 } },
  ])('falls back to the DOM path for $name', async ({ patch }) => {
    const nodes = schemaFixture();
    Object.assign(nodes[1], patch);
    expect(await readsDom({ nodes, edges: schemaEdges() })).toBe(true);
  });

  it('falls back when the config sets a non-default nodeOrigin', async () => {
    // `toAbsoluteNode` only applies nodeOrigin to nodes with a parentId, so a
    // ROOT node's rendered top-left is `position - dimensions × origin` while the
    // state path would still read `position`. Ineligible.
    expect(
      await readsDom({
        nodes: schemaFixture(),
        edges: schemaEdges(),
        config: { nodeOrigin: [0.5, 0.5] },
      }),
    ).toBe(true);
  });

  it('falls back when a NODE sets a non-default nodeOrigin, and renders identically', async () => {
    // `nodeOrigin` is a PER-NODE property as well as a canvas config (FlowNode.nodeOrigin),
    // and the node's own value WINS over the config's: the renderer places the element at
    // `absPos − dimensions × (node.nodeOrigin ?? config.nodeOrigin ?? [0,0])` (flow-node.ts).
    // `toAbsoluteNode` returns a ROOT node unchanged and `getAbsolutePosition` applies only
    // the PARENTS' origins — never the node's own — so under a per-node origin `node.position`
    // is NOT the rendered border-box top-left, and every state-derived endpoint on that node
    // would land `dimensions × origin` away from where the browser painted the handle (110px
    // / 55px for a 220 × 110 node at [0.5, 0.5]). The node-center x that decides the SIDE is
    // read from the same unshifted position, so the side pick can flip too — which is why the
    // guard lives in `schemaFieldIndexForEndpoint`: both endpoints pass through it, so one
    // check covers the node's own geometry AND its role as the opposing node in the side pick.
    // Checking only `config.nodeOrigin` (as the canvas-level gate does) misses this entirely:
    // under a default config, such a node clears every other gate — unrotated, visible,
    // stamped, uniform rows.
    const patched = (): FixtureNode[] => {
      const nodes = schemaFixture();
      nodes[1].nodeOrigin = [0.5, 0.5];
      return nodes;
    };

    const oracle = await mountSettled({
      nodes: patched(),
      edges: schemaEdges(),
      config: { schemaHandleGeometry: 'dom' },
    });
    const expected = schemaEdges().map((_, i) => oracle.pathD(i));
    Alpine.destroyTree(oracle.host);
    oracle.host.remove();
    mounted.pop();
    rectSpy?.mockRestore();

    const handle = await mountSettled({ nodes: patched(), edges: schemaEdges() });
    handle.spy.mockClear();
    await reroute(handle.data);

    // Every edge touching the origin-shifted node must have taken the DOM path…
    expect(geometryRectCalls(handle.spy)).toBeGreaterThan(0);
    // …and landed exactly where the oracle puts it.
    schemaEdges().forEach((edge, i) => {
      expect(`${edge.id}: ${handle.pathD(i)}`).toBe(`${edge.id}: ${expected[i]}`);
    });
  });

  it('falls back for a plain (non-schema) endpoint but still renders the edge', async () => {
    const nodes = schemaFixture();
    nodes.push({
      id: 'p',
      position: { x: 900, y: 0 },
      dimensions: { width: 150, height: 40 },
      data: {},
      plain: true,
    });
    const edges: FixtureEdge[] = [
      { id: 'mixed', source: 'a', target: 'p', sourceHandle: 'email', targetHandle: 'in', type: 'bezier' },
    ];
    const handle = await mountSettled({ nodes, edges });
    handle.spy.mockClear();
    await reroute(handle.data);

    expect(geometryRectCalls(handle.spy)).toBeGreaterThan(0);
    expect(handle.pathD(0)).toMatch(/^M/);
  });

  it('falls back when an edge carries no handle id', async () => {
    const edges: FixtureEdge[] = [{ id: 'no-handle', source: 'a', target: 'b', type: 'bezier' }];
    expect(await readsDom({ nodes: schemaFixture(), edges })).toBe(true);
  });

  it('resolves a `-l`/`-r` suffixed id on the fast path, matching the DOM oracle', async () => {
    // A trailing `-l`/`-r` pins a SIDE on the named field's row: `team_id-r` is the
    // `team_id` row's right handle. Both oracles resolve the same row + side — the
    // DOM path scopes its query to (id + type + position), the state path pins the
    // side in `resolveSchemaEndpoints` — so the fast path handles it WITHOUT falling
    // back to DOM, and still produces the identical path.
    const edges: FixtureEdge[] = [
      { id: 'suffixed', source: 'a', target: 'b', sourceHandle: 'team_id-r', targetHandle: 'email-l', type: 'straight' },
    ];
    const nodes = schemaFixture();

    const oracle = await mountSettled({ nodes: schemaFixture(), edges, config: { schemaHandleGeometry: 'dom' } });
    const expected = oracle.pathD(0);
    Alpine.destroyTree(oracle.host);
    oracle.host.remove();
    mounted.pop();
    rectSpy?.mockRestore();

    const handle = await mountSettled({ nodes, edges });
    handle.spy.mockClear();
    await reroute(handle.data);
    expect(geometryRectCalls(handle.spy)).toBe(0);
    expect(handle.pathD(0)).toBe(expected);
  });

  it("falls back when a node's measured height disagrees with the uniform-row model", async () => {
    // The fast path makes "uniform rows, measured once from the first schema node"
    // load-bearing. Nothing enforces it: `.flow-schema-row-name` has no
    // `white-space: nowrap`, so a consumer who pins `dimensions.width` and writes a
    // long field name gets a WRAPPED, taller row — and every row below it would have
    // its endpoint land one row off, silently. `node.dimensions` is the measured
    // BORDER BOX, so the row model must reproduce the node's height exactly:
    //   insetTop + headerHeight + (n − 1) × rowHeight + rowHeightLast + insetBottom
    // `rowHeight` is a row STRIDE and the LAST row is shorter (the theme drops its
    // border-bottom on `:last-child`), so the last row gets its own measured term —
    // modelling it as `rowHeight` overshoots every schema node by that border. A few
    // adds, and wrapped / non-uniform / bespoke rows all fall back to the DOM path,
    // which measures each handle and is immune.
    const nodes = schemaFixture();
    nodes[1].dimensions!.height += 18; // as if one field name wrapped to two lines
    const edges: FixtureEdge[] = [
      { id: 'wrapped', source: 'a', target: 'b', sourceHandle: 'id', targetHandle: 'email', type: 'straight' },
    ];
    expect(await readsDom({ nodes, edges })).toBe(true);
  });

  it('falls back for a hand-rolled node that carries data.fields but no schema directive', async () => {
    // flow-schema.ts's own docblock invites consumers to skip the directive and write
    // `x-for` + handles manually. Such a node has the same `data.fields` shape and the
    // same field-keyed handle ids, but its row geometry is its own business — the
    // cached SchemaMetrics describe `x-flow-schema`'s layout, not this one. State
    // alone cannot tell the two apart, so eligibility requires the `data-flow-schema-node`
    // stamp that the schema directive puts on the node element.
    const nodes = schemaFixture();
    nodes.push({
      id: 'x',
      position: { x: 900, y: 0 },
      // Dimensions deliberately AGREE with the schema row model, so this test
      // isolates the directive check from the height cross-check above.
      dimensions: { width: 220, height: schemaHeight(FIELDS.length, SYMMETRIC) },
      data: { label: 'X', fields: schemaFields(FIELDS) },
      custom: true,
    });
    const edges: FixtureEdge[] = [
      { id: 'hand-rolled', source: 'a', target: 'x', sourceHandle: 'email', targetHandle: 'team_id', type: 'straight' },
    ];

    const handle = await mountSettled({ nodes, edges });
    handle.spy.mockClear();
    await reroute(handle.data);

    expect(geometryRectCalls(handle.spy)).toBeGreaterThan(0);
    expect(handle.pathD(0)).toMatch(/^M/);
  });

  it('falls back when a node has no dimensions in state', async () => {
    const nodes = schemaFixture();
    delete (nodes[1] as { dimensions?: unknown }).dimensions;
    const edges: FixtureEdge[] = [
      { id: 'nodims', source: 'a', target: 'b', sourceHandle: 'id', targetHandle: 'id', type: 'straight' },
    ];
    expect(await readsDom({ nodes, edges })).toBe(true);
  });
});
