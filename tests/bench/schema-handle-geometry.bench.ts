/// <reference types="vite/client" />
/**
 * Workstream G — schema edge measurement pass: DOM-measured vs state-derived.
 *
 * WHAT IS BEING MEASURED
 * ----------------------
 * Only the MEASUREMENT PHASE of an edge geometry pass — the part WS-G replaces. Everything
 * downstream (path generation, SVG writes, routing) is identical between the two paths and
 * is deliberately excluded, so the ratio here is not diluted by work neither path avoids.
 *
 * Per edge, the DOM path (`flow-edge.ts`, standard branch) does:
 *   2 × node rect          (rectCenter, for the mirror-handle side picker)
 *   2 × resolveHandlePosition   → querySelectorAll + pickClosestHandle (2 rects: real + mirror)
 *   2 × measureHandleCoords     → querySelectorAll + pickClosestHandle (2 rects) + handle rect
 *                                 + container rect
 * ≈ 12 `getBoundingClientRect` calls per edge. The state path does zero: two attribute reads,
 * one scan of `data.fields` per endpoint, and arithmetic.
 *
 * Real Chromium, real stylesheet, real Alpine, real `x-flow-schema` rows (this file runs
 * under `vitest.bench.config.ts`, which is browser-mode) — so the rects being read are real
 * layout, not stubs.
 *
 * WARM vs DIRTY LAYOUT — read before quoting a number
 * --------------------------------------------------
 * A `getBoundingClientRect` on a CLEAN layout tree is a cheap cached read. On a DIRTY one it
 * forces a synchronous reflow. Both benches are reported because they bracket reality:
 *
 *   - WARM  — nothing mutated between passes. This is the CONSERVATIVE number: it charges the
 *             DOM path only for reading, never for layout. It understates the real win.
 *   - DIRTY — a node's position is written before each pass, exactly as a drag does. The first
 *             rect read then pays for the reflow. This is the number that matters at
 *             Draftsman scale, where a drag reroutes edges every frame.
 *
 * The state path is measured against the same mutation in both, so the comparison is fair.
 */
import { bench, describe } from 'vitest';
import structuralCss from '../../css/structural.css?raw';
import themeCss from '../../css/theme-default.css?raw';
import { mountCanvas, nextFrame } from '../integration/helpers/mount';
import { resolveHandlePosition } from '../../src/plugin/directives/flow-edge';
import { computeSchemaHandlePoint, schemaFieldIndex } from '../../src/core/schema-geometry';
import type { FlowNode, SchemaMetrics, XYPosition } from '../../src/core/types';

const NODE_COUNT = 50;
const EDGE_COUNT = 100;
const FIELDS_PER_NODE = 6;

// ── Fixture ─────────────────────────────────────────────────────────────────

const FIELD_NAMES = ['id', 'user_id', 'team_id', 'email', 'created_at', 'updated_at'];

function makeNodes() {
    return Array.from({ length: NODE_COUNT }, (_, i) => ({
        id: `n${i}`,
        position: { x: (i % 10) * 340, y: Math.floor(i / 10) * 260 },
        data: {
            label: `table_${i}`,
            fields: FIELD_NAMES.slice(0, FIELDS_PER_NODE).map((name) => ({ name, type: 'uuid' })),
        },
    }));
}

function makeEdges() {
    return Array.from({ length: EDGE_COUNT }, (_, i) => ({
        id: `e${i}`,
        source: `n${i % NODE_COUNT}`,
        target: `n${(i + 7) % NODE_COUNT}`,
        sourceHandle: FIELD_NAMES[i % FIELDS_PER_NODE],
        targetHandle: FIELD_NAMES[(i + 3) % FIELDS_PER_NODE],
    }));
}

function schemaTemplate(): HTMLElement {
    const viewport = document.createElement('div');
    viewport.setAttribute('x-flow-viewport', '');
    const template = document.createElement('template');
    template.setAttribute('x-for', 'node in nodes');
    template.setAttribute(':key', 'node.id');
    const node = document.createElement('div');
    node.setAttribute('x-flow-node', 'node');
    node.setAttribute('x-flow-schema', '');
    template.content.appendChild(node);
    viewport.appendChild(template);
    return viewport;
}

// ── Mount once, at module load, so the benches themselves are synchronous ────

const style = document.createElement('style');
style.textContent = `${structuralCss}\n${themeCss}`;
document.head.appendChild(style);

const edges = makeEdges();

const { canvas, scope } = await mountCanvas(
    // Culling would blank most of a 50-node canvas at this size and rob the DOM path of the
    // rects it is supposed to be paying for. Off, so both paths do a FULL pass.
    { nodes: makeNodes(), edges, viewportCulling: false },
    schemaTemplate(),
);

for (let i = 0; i < 120; i++) {
    const ready =
        scope._schemaMetrics != null
        && (scope.nodes as FlowNode[]).every((n) => n.dimensions?.width && n.dimensions?.height);
    if (ready) break;
    await nextFrame();
}
await nextFrame(2);

const metrics = scope._schemaMetrics as SchemaMetrics;
const nodes = scope.nodes as FlowNode[];
const nodeMap = new Map(nodes.map((n) => [n.id, n]));
const nodeEls = new Map<string, HTMLElement>(
    nodes.map((n) => [n.id, canvas.querySelector(`[data-flow-node-id="${n.id}"]`) as HTMLElement]),
);

if (!metrics) throw new Error('[bench] _schemaMetrics never landed — the fast path is not measurable');
for (const [id, el] of nodeEls) {
    if (!el) throw new Error(`[bench] node element ${id} not rendered`);
}

// ── The DOM measurement path, replayed ──────────────────────────────────────
// `measureHandleCoords` / `pickClosestHandle` / `rectCenter` are module-private in
// flow-edge.ts, so they are reproduced here VERBATIM. `resolveHandlePosition` is the real
// exported one. Keep these in sync with flow-edge.ts if that file's DOM branch ever changes —
// this bench is only meaningful while it measures the same work.

function rectCenter(r: DOMRect): XYPosition {
    return { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 };
}

function pickClosestHandle(
    handles: NodeListOf<Element> | Element[],
    opposingCenter: XYPosition | undefined,
): Element | null {
    const list = Array.from(handles);
    if (list.length === 0) return null;
    if (list.length === 1 || !opposingCenter) return list[0];
    let best: Element | null = null;
    let bestDist = Infinity;
    for (const h of list) {
        const r = (h as HTMLElement).getBoundingClientRect();
        const dx = (r.left + r.right) / 2 - opposingCenter.x;
        const dy = (r.top + r.bottom) / 2 - opposingCenter.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestDist) {
            bestDist = d2;
            best = h;
        }
    }
    return best;
}

interface HandleMeasurement { x: number; y: number; handleWidth: number; handleHeight: number }

function measureHandleCoords(
    container: Element,
    handleId: string,
    handleType: 'source' | 'target',
    zoom: number,
    viewport: { x: number; y: number },
    opposingCenter: XYPosition | undefined,
    nodeEl: HTMLElement,
): HandleMeasurement | null {
    const typed = nodeEl.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(handleId)}"][data-flow-handle-type="${handleType}"]`,
    );
    const handleEl = pickClosestHandle(typed, opposingCenter) as HTMLElement | null;
    if (!handleEl) return null;

    const handleRect = handleEl.getBoundingClientRect();
    if (handleRect.width === 0 && handleRect.height === 0) return null;

    const containerRect = container.getBoundingClientRect();
    return {
        x: (handleRect.left + handleRect.width / 2 - containerRect.left - viewport.x) / zoom,
        y: (handleRect.top + handleRect.height / 2 - containerRect.top - viewport.y) / zoom,
        handleWidth: handleRect.width / zoom,
        handleHeight: handleRect.height / zoom,
    };
}

/** One full ~100-edge measurement pass, the way the DOM branch does it. */
function domMeasurementPass(): number {
    const vp = { x: scope.viewport.x, y: scope.viewport.y };
    const zoom = scope.viewport.zoom || 1;
    let acc = 0;

    for (const edge of edges) {
        const sourceNode = nodeMap.get(edge.source)!;
        const targetNode = nodeMap.get(edge.target)!;
        const sourceEl = nodeEls.get(edge.source)!;
        const targetEl = nodeEls.get(edge.target)!;

        const sourceCenter = rectCenter(sourceEl.getBoundingClientRect());
        const targetCenter = rectCenter(targetEl.getBoundingClientRect());

        const sourcePos = resolveHandlePosition(
            canvas, edge.source, edge.sourceHandle, 'source', sourceNode, targetCenter, sourceEl,
        );
        const targetPos = resolveHandlePosition(
            canvas, edge.target, edge.targetHandle, 'target', targetNode, sourceCenter, targetEl,
        );

        const src = measureHandleCoords(canvas, edge.sourceHandle, 'source', zoom, vp, targetCenter, sourceEl);
        const tgt = measureHandleCoords(canvas, edge.targetHandle, 'target', zoom, vp, sourceCenter, targetEl);

        // Consume the results so nothing can be optimized away.
        acc += (src?.x ?? 0) + (tgt?.y ?? 0) + sourcePos.length + targetPos.length;
    }
    return acc;
}

// ── The state-derived path ──────────────────────────────────────────────────
// `schemaHandleSide` is module-private in flow-edge.ts; reproduced verbatim (the asymmetric
// tie-break included). Everything else is the real exported implementation.

function nodeCenterX(node: FlowNode): number {
    return node.position.x + (node.dimensions?.width ?? 150) / 2;
}

function schemaHandleSide(
    node: FlowNode,
    handleType: 'source' | 'target',
    opposingCenterX: number,
): 'left' | 'right' {
    const width = node.dimensions?.width ?? 150;
    const midX = node.position.x + (metrics.insetLeft + (width - metrics.insetRight)) / 2;
    return handleType === 'source'
        ? (opposingCenterX >= midX ? 'right' : 'left')
        : (opposingCenterX > midX ? 'right' : 'left');
}

/** Eligibility, as `schemaFieldIndexForEndpoint` does it: attributes + state, never a rect. */
function schemaFieldIndexForEndpoint(node: FlowNode, handleId: string, nodeEl: HTMLElement): number {
    if (node.hidden || node.collapsed || node.condensed) return -1;
    if (node.rotation) return -1;
    if (!nodeEl.hasAttribute('data-flow-schema-node')) return -1;
    if (nodeEl.style.display === 'none') return -1;

    const width = node.dimensions?.width;
    const height = node.dimensions?.height;
    if (typeof width !== 'number' || !Number.isFinite(width)) return -1;
    if (typeof height !== 'number' || !Number.isFinite(height)) return -1;

    const fields = (node.data as { fields?: Array<{ name: string }> }).fields;
    if (!Array.isArray(fields) || fields.length === 0) return -1;

    const expectedHeight =
        metrics.insetTop + metrics.headerHeight
        + (fields.length - 1) * metrics.rowHeight + metrics.rowHeightLast
        + metrics.insetBottom;
    if (Math.abs(expectedHeight - height) > 0.5) return -1;

    return schemaFieldIndex(fields, handleId);
}

/** The same ~100-edge pass, derived from state. Zero `getBoundingClientRect`. */
function stateMeasurementPass(): number {
    let acc = 0;

    for (const edge of edges) {
        const sourceNode = nodeMap.get(edge.source)!;
        const targetNode = nodeMap.get(edge.target)!;

        const srcIndex = schemaFieldIndexForEndpoint(sourceNode, edge.sourceHandle, nodeEls.get(edge.source)!);
        if (srcIndex < 0) continue;
        const tgtIndex = schemaFieldIndexForEndpoint(targetNode, edge.targetHandle, nodeEls.get(edge.target)!);
        if (tgtIndex < 0) continue;

        const srcSide = schemaHandleSide(sourceNode, 'source', nodeCenterX(targetNode));
        const tgtSide = schemaHandleSide(targetNode, 'target', nodeCenterX(sourceNode));

        const src = computeSchemaHandlePoint(sourceNode, sourceNode.position, srcIndex, srcSide, metrics);
        const tgt = computeSchemaHandlePoint(targetNode, targetNode.position, tgtIndex, tgtSide, metrics);

        acc += (src?.x ?? 0) + (tgt?.y ?? 0) + srcSide.length + tgtSide.length;
    }
    return acc;
}

// Guard: if the fast path silently bailed for every edge, `stateMeasurementPass` would be
// benchmarking `continue` and the comparison would be a lie.
let eligible = 0;
for (const edge of edges) {
    const s = schemaFieldIndexForEndpoint(nodeMap.get(edge.source)!, edge.sourceHandle, nodeEls.get(edge.source)!);
    const t = schemaFieldIndexForEndpoint(nodeMap.get(edge.target)!, edge.targetHandle, nodeEls.get(edge.target)!);
    if (s >= 0 && t >= 0) eligible++;
}
if (eligible !== edges.length) {
    throw new Error(`[bench] only ${eligible}/${edges.length} edges take the fast path — numbers would be meaningless`);
}

/** Move ONE node, as a single-node drag does — leaves the layout tree dirty for the next pass. */
let nudge = 0;
function dirtyLayout(): void {
    const el = nodeEls.get('n0')!;
    const node = nodeMap.get('n0')!;
    nudge = (nudge + 1) % 20;
    node.position = { x: nudge, y: 0 };
    el.style.left = `${nudge}px`;
}

/**
 * Move EVERY node — a layout animation, a fitView, a multi-select drag. The whole node layer
 * is dirty, so the DOM path's first rect read pays for a full relayout of all 50 schema
 * subtrees (~1,250 rows, ~5,000 handles). This is the pathological case the fast path exists
 * to protect, and the only one where the measurement phase is genuinely reflow-bound.
 */
function dirtyAllLayout(): void {
    nudge = (nudge + 1) % 20;
    for (const node of nodes) {
        const el = nodeEls.get(node.id)!;
        const x = node.position.x + (nudge % 2 === 0 ? 1 : -1);
        node.position = { x, y: node.position.y };
        el.style.left = `${x}px`;
    }
}

// ── Benches ─────────────────────────────────────────────────────────────────

describe(`schema edge measurement pass — ${EDGE_COUNT} edges × ${NODE_COUNT} nodes × ${FIELDS_PER_NODE} fields (warm layout)`, () => {
    bench('DOM-measured (getBoundingClientRect per handle)', () => {
        domMeasurementPass();
    });

    bench('state-derived (computeSchemaHandlePoint)', () => {
        stateMeasurementPass();
    });
});

describe(`schema edge measurement pass — ${EDGE_COUNT} edges, ONE node moved first (models a single-node drag)`, () => {
    bench('DOM-measured — first rect read forces a reflow', () => {
        dirtyLayout();
        domMeasurementPass();
    });

    bench('state-derived — no rect read, no forced reflow', () => {
        dirtyLayout();
        stateMeasurementPass();
    });
});

describe(`schema edge measurement pass — ${EDGE_COUNT} edges, ALL ${NODE_COUNT} nodes moved first (layout animation / multi-drag)`, () => {
    bench('DOM-measured — reflows the whole node layer', () => {
        dirtyAllLayout();
        domMeasurementPass();
    });

    bench('state-derived — reads nothing, so nothing to reflow', () => {
        dirtyAllLayout();
        stateMeasurementPass();
    });
});
