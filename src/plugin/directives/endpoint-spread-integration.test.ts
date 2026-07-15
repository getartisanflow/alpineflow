// @vitest-environment jsdom
// ============================================================================
// Endpoint spread — integration at the edge seam (WS-2, Tasks 4 & 5)
//
// Mounts real x-flow-edge / x-flow-schema / x-flow-handle directives against a
// stubbed CSS box model (copied from flow-edge-schema-geometry.test.ts — the
// established `d`-string test path), supplies a hand-built
// `_endpointSpreadGrouping` on the canvas (Task 3 proves the real grouping on a
// real canvas), and asserts the seam applies the lane offset to the shared
// target handle: fanned when on, byte-identical to spread-off when off.
// ============================================================================

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { registerFlowEdgeDirective } from './flow-edge';
import { registerFlowHandleDirective } from './flow-handle';
import { registerFlowSchemaDirective } from './flow-schema';
import type { EndpointSpreadGrouping } from '../../core/types';

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

// ── The emulated CSS box model (subset of flow-edge-schema-geometry.test.ts) ──
const CONTAINER_LEFT = 37;
const CONTAINER_TOP = 19;
const HEADER_H = 34;
const ROW_H = 26;
const ROW_BORDER = 1;
const LAST_ROW_H = ROW_H - ROW_BORDER;
const HANDLE = 10;

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
  endpointSpread?: boolean | { spacing?: number };
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
  /** Hand-built endpoint-spread grouping placed on the canvas. */
  grouping?: EndpointSpreadGrouping | null;
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

function rowHeightAt(index: number, count: number): number {
  return index === count - 1 ? LAST_ROW_H : ROW_H;
}

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

function installLayout(nodes: FixtureNode[], insets: Insets): ReturnType<typeof vi.spyOn> {
  const byId = (id: string | undefined): FixtureNode | undefined =>
    nodes.find((n) => n.id === id);

  const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect');
  spy.mockImplementation(function (this: Element): DOMRect {
    const el = this as HTMLElement;

    if (el.classList.contains('flow-container')) {
      return fakeRect(CONTAINER_LEFT, CONTAINER_TOP, 1400, 1200);
    }

    const nodeEl = el.closest('[data-flow-node-id]') as HTMLElement | null;
    const node = byId(nodeEl?.dataset.flowNodeId);
    if (!nodeEl || !node) return fakeRect(0, 0, 0, 0);

    const dims = node.dimensions ?? { width: 220, height: schemaHeight(FIELDS.length, insets) };
    const nx = CONTAINER_LEFT + node.position.x;
    const ny = CONTAINER_TOP + node.position.y;
    const nw = dims.width;
    const nh = dims.height;
    if (el === nodeEl) return fakeRect(nx, ny, nw, nh);

    const cLeft = nx + insets.left;
    const cTop = ny + insets.top;
    const cWidth = nw - (insets.left + insets.right);

    if (el.classList.contains('flow-schema-header')) {
      return fakeRect(cLeft, cTop, cWidth, HEADER_H);
    }

    if (el.classList.contains('flow-schema-body')) {
      const rows = el.children.length;
      const bodyH = rows === 0 ? 0 : (rows - 1) * ROW_H + LAST_ROW_H;
      return fakeRect(cLeft, cTop + HEADER_H, cWidth, bodyH);
    }

    const rowPos = (row: HTMLElement): { index: number; count: number } => {
      const siblings = Array.from(row.parentElement?.children ?? []);
      return { index: siblings.indexOf(row), count: siblings.length };
    };
    const rowTop = (row: HTMLElement): number => cTop + HEADER_H + rowPos(row).index * ROW_H;

    if (el.classList.contains('flow-schema-row')) {
      const { index, count } = rowPos(el);
      return fakeRect(cLeft, rowTop(el), cWidth, rowHeightAt(index, count));
    }

    if (el.classList.contains('flow-schema-handle')) {
      const row = el.closest('.flow-schema-row') as HTMLElement | null;
      if (!row) return fakeRect(0, 0, 0, 0);
      const isMirror = el.classList.contains('flow-schema-handle--mirror');
      const isTarget = el.classList.contains('flow-schema-handle--target');
      const onLeft = isTarget !== isMirror;
      const cx = onLeft ? cLeft : cLeft + cWidth;
      const { index, count } = rowPos(row);
      const cy = rowTop(row) + handleOffsetAt(index, count);
      return fakeRect(cx - HANDLE / 2, cy - HANDLE / 2, HANDLE, HANDLE);
    }

    return fakeRect(0, 0, 0, 0);
  } as unknown as () => DOMRect);

  return spy;
}

function mount(opts: MountOptions) {
  const insets = SYMMETRIC;
  rectSpy = installLayout(opts.nodes, insets);

  const canvas = {
    nodes: opts.nodes,
    edges: opts.edges,
    viewport: { x: 11, y: -7, zoom: 1 },
    selectedNodes: new Set<string>(),
    selectedEdges: new Set<string>(),
    selectedRows: new Set<string>(),
    _id: 'spread-canvas',
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
    _endpointSpreadGrouping: opts.grouping ?? null,
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

  const scopeName = `__spreadCanvas_${canvasSeq++}`;
  (window as unknown as Record<string, unknown>)[scopeName] = () => canvas;

  const host = document.createElement('div');
  host.className = 'flow-container';
  host.setAttribute('x-data', `${scopeName}()`);

  opts.nodes.forEach((n, i) => {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'flow-node';
    nodeEl.setAttribute('data-flow-node-id', n.id);
    nodeEl.setAttribute('x-data', `{ node: nodes[${i}] }`);
    nodeEl.classList.add('flow-schema-node');
    nodeEl.setAttribute('x-flow-schema', '');
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

/** The final coordinate pair of a `d` string (= the exact target endpoint). */
function targetEndpoint(d: string): string {
  const pairs = [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)];
  const last = pairs[pairs.length - 1];
  return last ? `${last[1]},${last[2]}` : d;
}

/** Target-endpoint Y coordinate as a number. */
function targetY(d: string): number {
  const pairs = [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)];
  const last = pairs[pairs.length - 1];
  return last ? +last[2] : NaN;
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const FIELDS = ['id', 'email', 'team_id', 'created_at'];

/**
 * Three source schema nodes stacked vertically (y 0/300/600) all pointing at
 * ONE field handle on a hub node to their right, plus the hub. All avoidant.
 */
function fanFixture(): FixtureNode[] {
  const h = schemaHeight(FIELDS.length, SYMMETRIC);
  return [
    { id: 'src1', position: { x: 0, y: 0 }, dimensions: { width: 220, height: h }, data: { label: 'S1', fields: schemaFields(FIELDS) } },
    { id: 'src2', position: { x: 0, y: 300 }, dimensions: { width: 220, height: h }, data: { label: 'S2', fields: schemaFields(FIELDS) } },
    { id: 'src3', position: { x: 0, y: 600 }, dimensions: { width: 220, height: h }, data: { label: 'S3', fields: schemaFields(FIELDS) } },
    { id: 'hub', position: { x: 600, y: 250 }, dimensions: { width: 220, height: h }, data: { label: 'HUB', fields: schemaFields(FIELDS) } },
  ];
}

function fanEdges(): FixtureEdge[] {
  return [
    { id: 'e1', source: 'src1', target: 'hub', sourceHandle: 'id', targetHandle: 'email', type: 'avoidant' },
    { id: 'e2', source: 'src2', target: 'hub', sourceHandle: 'id', targetHandle: 'email', type: 'avoidant' },
    { id: 'e3', source: 'src3', target: 'hub', sourceHandle: 'id', targetHandle: 'email', type: 'avoidant' },
  ];
}

/** Lanes ordered by source Y ascending: src1(0) → 0, src2(300) → 1, src3(600) → 2. */
function fanGrouping(): EndpointSpreadGrouping {
  return new Map([
    ['hub|email', { count: 3, lanes: new Map([['e1', 0], ['e2', 1], ['e3', 2]]) }],
  ]);
}

/** `n` source schema nodes stacked in ascending Y, all into `hub|email`, + hub. */
function bigFanFixture(n: number): FixtureNode[] {
  const h = schemaHeight(FIELDS.length, SYMMETRIC);
  const nodes: FixtureNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({ id: `s${i}`, position: { x: 0, y: i * 120 }, dimensions: { width: 220, height: h }, data: { label: `S${i}`, fields: schemaFields(FIELDS) } });
  }
  nodes.push({ id: 'hub', position: { x: 600, y: (n * 120) / 2 }, dimensions: { width: 220, height: h }, data: { label: 'HUB', fields: schemaFields(FIELDS) } });
  return nodes;
}

function bigFanEdges(n: number): FixtureEdge[] {
  return Array.from({ length: n }, (_, i) => ({ id: `e${i}`, source: `s${i}`, target: 'hub', sourceHandle: 'id', targetHandle: 'email', type: 'avoidant' as const }));
}

function bigFanGrouping(n: number): EndpointSpreadGrouping {
  const lanes = new Map<string, number>();
  for (let i = 0; i < n; i++) lanes.set(`e${i}`, i); // sources already ascending in Y
  return new Map([['hub|email', { count: n, lanes }]]);
}

/** A hub target handle carrying exactly one edge. */
function singleFixture(): FixtureNode[] {
  const h = schemaHeight(FIELDS.length, SYMMETRIC);
  return [
    { id: 'src1', position: { x: 0, y: 0 }, dimensions: { width: 220, height: h }, data: { label: 'S1', fields: schemaFields(FIELDS) } },
    { id: 'hub', position: { x: 600, y: 0 }, dimensions: { width: 220, height: h }, data: { label: 'HUB', fields: schemaFields(FIELDS) } },
  ];
}

function singleEdges(): FixtureEdge[] {
  return [{ id: 'e1', source: 'src1', target: 'hub', sourceHandle: 'id', targetHandle: 'email', type: 'avoidant' }];
}

function singleGrouping(): EndpointSpreadGrouping {
  return new Map([['hub|email', { count: 1, lanes: new Map([['e1', 0]]) }]]);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('endpoint spread — seam integration', () => {
  it('fans 3 shared-handle edges into distinct endpoints when on; shares one when off', async () => {
    const on = await mountSettled({
      nodes: fanFixture(),
      edges: fanEdges(),
      config: { avoidantEndpointSpread: true },
      grouping: fanGrouping(),
    });
    const onEnds = fanEdges().map((_, i) => targetEndpoint(on.pathD(i)));
    expect(new Set(onEnds).size).toBe(3); // fanned

    const off = await mountSettled({
      nodes: fanFixture(),
      edges: fanEdges(),
      // avoidantEndpointSpread unset, no grouping → gate off
    });
    const offEnds = fanEdges().map((_, i) => targetEndpoint(off.pathD(i)));
    expect(new Set(offEnds).size).toBe(1); // all stacked on the handle centre
  });

  it('off === baseline: routes are byte-identical when the config gate is off, even if a grouping exists', async () => {
    // Baseline: spread fully off (no config, no grouping).
    const baseline = await mountSettled({ nodes: fanFixture(), edges: fanEdges() });
    const baseDs = fanEdges().map((_, i) => baseline.pathD(i));

    // Config-gate proof: grouping present but `avoidantEndpointSpread` UNSET →
    // resolveSpreadSpacing(undefined) === null → the seam must skip the offset.
    const configOff = await mountSettled({ nodes: fanFixture(), edges: fanEdges(), grouping: fanGrouping() });
    fanEdges().forEach((edge, i) => {
      expect(`${edge.id}: ${configOff.pathD(i)}`).toBe(`${edge.id}: ${baseDs[i]}`);
    });

    // Grouping-presence gate proof: config ON but grouping null → `if (grouping)`
    // is false → identical to baseline.
    const groupingNull = await mountSettled({ nodes: fanFixture(), edges: fanEdges(), config: { avoidantEndpointSpread: true }, grouping: null });
    fanEdges().forEach((edge, i) => {
      expect(`${edge.id}: ${groupingNull.pathD(i)}`).toBe(`${edge.id}: ${baseDs[i]}`);
    });
  });

  it('condenses a high fan-in within the row extent (never grows the row)', async () => {
    const N = 12;
    const ROW_EXTENT = ROW_H; // _schemaMetrics.rowHeight under this box model

    // Centre = the un-fanned target Y (spread off).
    const off = await mountSettled({ nodes: bigFanFixture(N), edges: bigFanEdges(N) });
    const centre = targetY(off.pathD(0));

    const on = await mountSettled({
      nodes: bigFanFixture(N),
      edges: bigFanEdges(N),
      config: { avoidantEndpointSpread: { spacing: 5 } },
      grouping: bigFanGrouping(N),
    });
    for (let i = 0; i < N; i++) {
      const y = targetY(on.pathD(i));
      // Desired span 11×5 = 55 > 26 → clamped to the row extent; every endpoint
      // stays within extent/2 of the centre, so the row never grows.
      expect(Math.abs(y - centre)).toBeLessThanOrEqual(ROW_EXTENT / 2 + 0.5);
    }
  });

  it('is deterministic: the same spread fixture renders identical d strings twice', async () => {
    const a = await mountSettled({ nodes: fanFixture(), edges: fanEdges(), config: { avoidantEndpointSpread: true }, grouping: fanGrouping() });
    const aDs = fanEdges().map((_, i) => a.pathD(i));

    const b = await mountSettled({ nodes: fanFixture(), edges: fanEdges(), config: { avoidantEndpointSpread: true }, grouping: fanGrouping() });
    fanEdges().forEach((edge, i) => {
      expect(`${edge.id}: ${b.pathD(i)}`).toBe(`${edge.id}: ${aDs[i]}`);
    });
  });

  it('leaves a single-edge handle untouched whether spread is on or off (lane 0, count 1)', async () => {
    const on = await mountSettled({ nodes: singleFixture(), edges: singleEdges(), config: { avoidantEndpointSpread: true }, grouping: singleGrouping() });
    const onD = on.pathD(0);

    const off = await mountSettled({ nodes: singleFixture(), edges: singleEdges() });
    expect(onD).toBe(off.pathD(0));
  });
});
