/// <reference types="vite/client" />
/**
 * Workstream G — REAL-BROWSER parity gate for state-derived schema handle geometry.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The unit-level parity suite (`src/plugin/directives/flow-edge-schema-geometry.test.ts`)
 * runs in jsdom, which has no layout engine: every `getBoundingClientRect` there is a
 * hand-written stub that TRANSCRIBES the CSS box model out of `css/structural.css`. That
 * leaves one hole it cannot close by construction — if the stylesheet's schema rules ever
 * change (padding on the body, a gap between header and rows, handles no longer centred on
 * the row edge), the transcription and `computeSchemaHandlePoint` could drift away from the
 * REAL stylesheet *together* and the suite would stay green while production rendered wrong.
 *
 * This file closes it. Real Chromium, real `css/structural.css` + `css/theme-default.css`,
 * real Alpine, real `x-flow-schema` rows, real layout. Two independent proofs:
 *
 *   1. GEOMETRY  — for every edge endpoint, the STATE-derived point
 *      (`computeSchemaHandlePoint` fed the canvas's own `_schemaMetrics`) must agree, within
 *      1px, with the REAL measured centre of the handle element the DOM path would have
 *      picked — measured with `getBoundingClientRect` and converted to flow space by exactly
 *      the arithmetic `measureHandleCoords` uses.
 *
 *   2. RENDERED OUTPUT — the same fixture mounted twice, once with `schemaHandleGeometry:
 *      'auto'` and once with `'dom'`, must produce byte-identical `d` attributes on every
 *      edge path. That is the end-to-end "routes render identical" proof: a bezier's control
 *      points and a smoothstep's corners both derive from the endpoints AND the resolved
 *      handle side, so a wrong side or a shifted endpoint cannot hide inside a matching `d`.
 *
 * Both proofs are preceded by an assertion that the fast path is ACTUALLY ENGAGED (zero
 * handle/node `getBoundingClientRect` calls during a reroute). Without it, a silent fallback
 * to the DOM path would make proof 2 pass tautologically.
 *
 * The DOM path is the ORACLE. If the two disagree here, the STATE path is wrong.
 */
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import structuralCss from '../../css/structural.css?raw';
import themeCss from '../../css/theme-default.css?raw';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';
import { computeSchemaHandlePoint, schemaFieldIndex } from '../../src/core/schema-geometry';
import type { FlowNode, SchemaMetrics, XYPosition } from '../../src/core/types';

// ─────────────────────────────────────────────────────────────────────────────
// Real stylesheet
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inject the SHIPPED stylesheets into the test document.
 *
 * `?raw` (rather than a plain `import '…css'`) so the bytes land verbatim regardless of how
 * Vitest is configured to treat CSS imports — an empty stylesheet would silently gut the
 * whole point of this file. `assertStylesheetLive()` below fails loudly if it ever does.
 */
function injectRealStylesheets(): void {
    if (document.getElementById('alpineflow-real-css')) return;
    const style = document.createElement('style');
    style.id = 'alpineflow-real-css';
    style.textContent = `${structuralCss}\n${themeCss}`;
    document.head.appendChild(style);
}

/**
 * Guard: prove the real stylesheet is actually cascading before any parity claim is made.
 * Without CSS, schema rows collapse and every assertion below would compare two flavours of
 * nothing. Each check reads a value that ONLY the shipped stylesheet can produce.
 */
function assertStylesheetLive(canvas: HTMLElement): void {
    const schemaEl = canvas.querySelector('.flow-schema-node') as HTMLElement;
    const rowEl = canvas.querySelector('.flow-schema-row') as HTMLElement;
    const handleEl = canvas.querySelector('.flow-schema-handle') as HTMLElement;
    expect(schemaEl, 'schema node rendered').toBeTruthy();

    // .flow-schema-node { display: flex; flex-direction: column; min-width: 220px }
    expect(getComputedStyle(schemaEl).flexDirection).toBe('column');
    expect(schemaEl.getBoundingClientRect().width).toBeGreaterThanOrEqual(220);
    // .flow-schema-row { position: relative; padding: .375rem .75rem } — real height, real layout
    expect(getComputedStyle(rowEl).position).toBe('relative');
    expect(rowEl.getBoundingClientRect().height).toBeGreaterThan(0);
    // .flow-handle { width/height: var(--flow-handle-size) } — the handle box has real size
    expect(handleEl.getBoundingClientRect().width).toBeGreaterThan(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// The DOM oracle, replayed in test code
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `pickClosestHandle` from `flow-edge.ts` (not exported), replayed verbatim — including the
 * STRICT `<`, which is what makes an exact tie fall to the FIRST handle in DOM order and
 * gives the tie-break its asymmetry (source ties right, target ties left).
 */
function pickClosestHandleOracle(handles: Element[], opposingCenter: XYPosition): Element | null {
    if (handles.length === 0) return null;
    if (handles.length === 1) return handles[0];
    let best: Element | null = null;
    let bestDist = Infinity;
    for (const h of handles) {
        const r = h.getBoundingClientRect();
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

/** The handle element `measureHandleCoords` would resolve for this endpoint. */
function oracleHandleEl(
    nodeEl: HTMLElement,
    opposingNodeEl: HTMLElement,
    handleId: string,
    handleType: 'source' | 'target',
): HTMLElement {
    const opposingRect = opposingNodeEl.getBoundingClientRect();
    const opposingCenter: XYPosition = {
        x: (opposingRect.left + opposingRect.right) / 2,
        y: (opposingRect.top + opposingRect.bottom) / 2,
    };
    const typed = Array.from(
        nodeEl.querySelectorAll(
            `[data-flow-handle-id="${CSS.escape(handleId)}"][data-flow-handle-type="${handleType}"]`,
        ),
    );
    const picked = pickClosestHandleOracle(typed, opposingCenter) as HTMLElement | null;
    expect(picked, `DOM path resolves a handle for ${handleType}:${handleId}`).toBeTruthy();
    return picked!;
}

/**
 * Real measured handle centre, in flow space — the exact conversion `measureHandleCoords`
 * performs (`(screenCentre − containerLeft − viewport) / zoom`).
 */
function measuredHandleCentre(
    container: HTMLElement,
    handleEl: HTMLElement,
    viewport: { x: number; y: number; zoom: number },
): XYPosition {
    const r = handleEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
        x: (r.left + r.width / 2 - containerRect.left - viewport.x) / viewport.zoom,
        y: (r.top + r.height / 2 - containerRect.top - viewport.y) / viewport.zoom,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fixture
// ─────────────────────────────────────────────────────────────────────────────

const FIELDS = [
    { name: 'id', type: 'uuid', key: 'primary' },
    { name: 'user_id', type: 'uuid', key: 'foreign' },
    { name: 'email', type: 'text' },
    { name: 'created_at', type: 'ts' },
];

/**
 * Four schema nodes, identical field sets so every node settles at the same intrinsic width
 * (`min-width: 220px` dominates the content) — which is what makes the vertical stack an
 * EXACT tie rather than an approximate one.
 *
 *   a (0,0) ───────────► b (420,40)      right ⇒ source right / target left
 *   b ─────────────────► a               left  ⇒ source left  / target right
 *   a ──┐
 *   c (0,300)  same x, same width, directly BELOW a
 *       └──────────────► the TIE: both candidate handle x's straddle the opposing node's
 *                        centre x exactly. Source must go RIGHT, target must go LEFT.
 *   d (420,300)                          diagonal, plus a marker'd edge (shortenEndpoint)
 */
function fixtureNodes() {
    return [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'users', fields: [...FIELDS] } },
        { id: 'b', position: { x: 420, y: 40 }, data: { label: 'orders', fields: [...FIELDS] } },
        { id: 'c', position: { x: 0, y: 300 }, data: { label: 'events', fields: [...FIELDS] } },
        { id: 'd', position: { x: 420, y: 300 }, data: { label: 'audits', fields: [...FIELDS] } },
    ];
}

function fixtureEdges() {
    return [
        // horizontal, both directions — (right, left) and (left, right)
        { id: 'e-ab', source: 'a', target: 'b', sourceHandle: 'id', targetHandle: 'user_id' },
        { id: 'e-ba', source: 'b', target: 'a', sourceHandle: 'id', targetHandle: 'user_id', type: 'smoothstep' },
        // VERTICAL STACK — the asymmetric tie-break, exercised in both directions
        { id: 'e-ac', source: 'a', target: 'c', sourceHandle: 'created_at', targetHandle: 'id' },
        { id: 'e-ca', source: 'c', target: 'a', sourceHandle: 'user_id', targetHandle: 'created_at', type: 'straight' },
        // diagonal + a marker'd edge: shortenEndpoint derives its offset from
        // min(handleWidth, handleHeight) / 2, so this is what proves the metrics'
        // handle size is carried into the synthetic measurement instead of a zero.
        { id: 'e-ad', source: 'a', target: 'd', sourceHandle: 'email', targetHandle: 'email', markerEnd: 'arrow' },
        { id: 'e-db', source: 'd', target: 'b', sourceHandle: 'id', targetHandle: 'created_at', type: 'smoothstep' },
        // deeper row indices, so an off-by-one row would surface
        { id: 'e-cd', source: 'c', target: 'd', sourceHandle: 'created_at', targetHandle: 'created_at' },
        { id: 'e-bc', source: 'b', target: 'c', sourceHandle: 'email', targetHandle: 'email', type: 'straight' },
    ];
}

/** `<div x-flow-viewport><template x-for><div x-flow-node x-flow-schema>` — real markup. */
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

interface Mounted {
    canvas: HTMLElement;
    scope: any;
    flow: any;
    metrics: SchemaMetrics;
}

/**
 * Mount the fixture and wait for BOTH async settlements the fast path depends on:
 * `node.dimensions` (ResizeObserver) and `canvas._schemaMetrics` (measured on the tick after
 * the first schema node renders). Polls rather than guessing a frame count.
 */
async function mountFixture(config: Record<string, unknown> = {}): Promise<Mounted> {
    const { canvas, scope, flow } = await mountCanvas(
        { nodes: fixtureNodes(), edges: fixtureEdges(), ...config },
        schemaTemplate(),
    );

    for (let i = 0; i < 60; i++) {
        const ready =
            scope._schemaMetrics != null
            && (scope.nodes as FlowNode[]).every((n) => n.dimensions?.width && n.dimensions?.height);
        if (ready) break;
        await nextFrame();
    }
    await nextFrame(2);

    expect(scope._schemaMetrics, 'canvas._schemaMetrics measured from real layout').toBeTruthy();
    assertStylesheetLive(canvas);

    return { canvas, scope, flow, metrics: scope._schemaMetrics as SchemaMetrics };
}

/** Every `d` on every edge path, keyed by edge id — the rendered-output fingerprint. */
function edgePathData(canvas: HTMLElement): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const g of Array.from(canvas.querySelectorAll('g[data-flow-edge-id]'))) {
        const id = g.getAttribute('data-flow-edge-id')!;
        out[id] = Array.from(g.querySelectorAll('path')).map((p) => p.getAttribute('d') ?? '');
    }
    return out;
}

/**
 * Force a full edge-geometry re-run while counting `getBoundingClientRect` calls made against
 * handle / node elements — i.e. exactly the reads the fast path is supposed to eliminate.
 * Returns the count. Zero ⇒ the fast path is genuinely engaged, and the numbers the parity
 * assertions compare are provably the STATE path's, not a silent fallback's.
 */
async function reroutingRectReads(m: Mounted): Promise<number> {
    const original = Element.prototype.getBoundingClientRect;
    let count = 0;
    Element.prototype.getBoundingClientRect = function (this: Element) {
        if (
            this instanceof Element
            && (this.hasAttribute?.('data-flow-handle-id') || this.hasAttribute?.('data-flow-node-id'))
        ) {
            count++;
        }
        return original.call(this);
    };
    try {
        // A position write is what a drag does — the geometry effect re-runs for every edge
        // touching the node, which is the pass this workstream is about.
        const a = (m.scope.nodes as FlowNode[]).find((n) => n.id === 'a')!;
        a.position = { x: a.position.x + 7, y: a.position.y + 3 };
        await nextFrame(2);
    } finally {
        Element.prototype.getBoundingClientRect = original;
    }
    return count;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('WS-G — real-browser schema handle geometry parity', () => {
    beforeAll(() => injectRealStylesheets());
    afterEach(() => unmountAll());

    /**
     * PROOF 1 — the geometry itself, against real layout.
     *
     * The side is taken FROM THE ORACLE (the `data-flow-handle-position` of the handle the DOM
     * path picks), so this assertion is purely about the box-model arithmetic: given the side
     * the browser actually laid the handle out on, does `computeSchemaHandlePoint` + the real
     * `_schemaMetrics` land on the handle's real centre? That is the exact question jsdom
     * cannot answer. (Whether the state path picks the SAME side is proved separately, and
     * end-to-end, by PROOF 2 — a wrong side moves the endpoint to the other x and the `d`
     * would diverge.)
     */
    it.each([
        { label: 'zoom 1, panned viewport', viewport: { x: 23, y: -17, zoom: 1 } },
        { label: 'zoom 1.25, panned viewport', viewport: { x: -31, y: 12, zoom: 1.25 } },
    ])(
        'state-derived endpoints match the REAL measured handle centres — $label',
        async ({ viewport }) => {
            const m = await mountFixture({ viewport });

            // The fast path must actually be ON, or everything below is measuring the DOM path
            // against itself.
            expect(await reroutingRectReads(m)).toBe(0);
            await nextFrame();

            const nodes = m.scope.nodes as FlowNode[];
            const byId = new Map(nodes.map((n) => [n.id, n]));
            const vp = { x: m.scope.viewport.x, y: m.scope.viewport.y, zoom: m.scope.viewport.zoom };

            let endpointsChecked = 0;

            for (const edge of fixtureEdges()) {
                for (const end of ['source', 'target'] as const) {
                    const nodeId = end === 'source' ? edge.source : edge.target;
                    const oppId = end === 'source' ? edge.target : edge.source;
                    const handleId = end === 'source' ? edge.sourceHandle : edge.targetHandle;

                    const node = byId.get(nodeId)!;
                    const nodeEl = m.canvas.querySelector(
                        `[data-flow-node-id="${nodeId}"]`,
                    ) as HTMLElement;
                    const oppEl = m.canvas.querySelector(
                        `[data-flow-node-id="${oppId}"]`,
                    ) as HTMLElement;

                    // — the oracle: the handle element the DOM path would pick, really measured
                    const handleEl = oracleHandleEl(nodeEl, oppEl, handleId, end);
                    const side = handleEl.getAttribute('data-flow-handle-position') as 'left' | 'right';
                    expect(['left', 'right']).toContain(side);
                    const measured = measuredHandleCentre(m.canvas, handleEl, vp);

                    // — the state path: arithmetic only
                    const fieldIndex = schemaFieldIndex(
                        (node.data as { fields?: Array<{ name: string }> }).fields,
                        handleId,
                    );
                    expect(fieldIndex).toBeGreaterThanOrEqual(0);
                    const derived = computeSchemaHandlePoint(
                        node,
                        node.position,
                        fieldIndex,
                        side,
                        m.metrics,
                    );
                    expect(derived, 'state path resolves a point').toBeTruthy();

                    const where = `${edge.id} ${end} (${nodeId}.${handleId}, ${side})`;
                    expect(
                        Math.abs(derived!.x - measured.x),
                        `${where} — Δx  state ${derived!.x} vs real ${measured.x}`,
                    ).toBeLessThanOrEqual(1);
                    expect(
                        Math.abs(derived!.y - measured.y),
                        `${where} — Δy  state ${derived!.y} vs real ${measured.y}`,
                    ).toBeLessThanOrEqual(1);
                    endpointsChecked++;
                }
            }

            expect(endpointsChecked).toBe(fixtureEdges().length * 2);
        },
    );

    /**
     * The vertically-stacked equal-width pair, called out explicitly: `a` and `c` share an x
     * and a width, so the opposing node's centre x lands EXACTLY on the midpoint of the two
     * candidate handle x's. `pickClosestHandle`'s strict `<` then leaves the first handle in
     * DOM order winning — and `renderRow` appends the real target (left) before its mirror,
     * but the real source (right) before its mirror. So the browser must hand us: source on
     * the RIGHT, target on the LEFT. A symmetric tie-break would flip the target.
     */
    it('the DOM oracle resolves the vertical-stack tie asymmetrically (source right, target left)', async () => {
        const m = await mountFixture();

        const nodes = m.scope.nodes as FlowNode[];
        const a = nodes.find((n) => n.id === 'a')!;
        const c = nodes.find((n) => n.id === 'c')!;
        // The tie is only a tie if the pair really is equal-width and column-aligned.
        expect(a.position.x).toBe(c.position.x);
        expect(a.dimensions!.width).toBe(c.dimensions!.width);

        const aEl = m.canvas.querySelector('[data-flow-node-id="a"]') as HTMLElement;
        const cEl = m.canvas.querySelector('[data-flow-node-id="c"]') as HTMLElement;

        // a → c : a is the source, c is the target
        expect(
            oracleHandleEl(aEl, cEl, 'created_at', 'source').getAttribute('data-flow-handle-position'),
        ).toBe('right');
        expect(
            oracleHandleEl(cEl, aEl, 'id', 'target').getAttribute('data-flow-handle-position'),
        ).toBe('left');

        // c → a : roles swap, the sides do not — the tie-break is a property of the handle
        // TYPE (DOM order), not of which node sits on top.
        expect(
            oracleHandleEl(cEl, aEl, 'user_id', 'source').getAttribute('data-flow-handle-position'),
        ).toBe('right');
        expect(
            oracleHandleEl(aEl, cEl, 'created_at', 'target').getAttribute('data-flow-handle-position'),
        ).toBe('left');
    });

    /**
     * PROOF 2 — rendered output. Same fixture, two canvases, one difference: the config flag.
     * Every path `d` must be identical. This covers the endpoints AND the resolved handle side
     * AND the route, in a real browser, through the real production code path.
     */
    it.each([
        { label: 'default viewport', viewport: undefined },
        { label: 'panned + zoomed viewport', viewport: { x: -31, y: 12, zoom: 1.25 } },
    ])('renders IDENTICAL edge paths under auto vs dom geometry — $label', async ({ viewport }) => {
        const cfg = viewport ? { viewport } : {};

        const auto = await mountFixture(cfg);
        expect(await reroutingRectReads(auto)).toBe(0); // fast path genuinely engaged
        await nextFrame(2);

        const dom = await mountFixture({ ...cfg, schemaHandleGeometry: 'dom' });
        // …and the control really is on the DOM path (it measures handle rects).
        expect(await reroutingRectReads(dom)).toBeGreaterThan(0);
        await nextFrame(2);

        const autoPaths = edgePathData(auto.canvas);
        const domPaths = edgePathData(dom.canvas);

        expect(Object.keys(autoPaths).sort()).toEqual(fixtureEdges().map((e) => e.id).sort());
        expect(autoPaths).toEqual(domPaths);
    });

    /**
     * Marker'd edge, isolated. `shortenEndpoint` pulls the endpoint back by
     * `min(handleWidth, handleHeight) / 2 + markerPadding`; if the fast path had zeroed the
     * handle box (rather than carrying the measured size out of `SchemaMetrics`), that
     * endpoint would sit ~5px inside where the DOM path puts it — and ONLY on marker'd edges,
     * which is exactly the kind of thing a `d`-equality test on unmarked edges would miss.
     */
    it('carries the real handle size through shortenEndpoint on a marker\'d edge', async () => {
        const auto = await mountFixture();
        const dom = await mountFixture({ schemaHandleGeometry: 'dom' });

        const autoD = edgePathData(auto.canvas)['e-ad'];
        const domD = edgePathData(dom.canvas)['e-ad'];

        expect(autoD.length).toBeGreaterThan(0);
        expect(autoD).toEqual(domD);
        expect(auto.metrics.handleWidth).toBeGreaterThan(0);
        expect(auto.metrics.handleHeight).toBeGreaterThan(0);
    });

    /**
     * The metrics themselves, sanity-checked against real layout. If the stylesheet grows a
     * padding on `.flow-schema-body`, or the header stops being the first thing in the box,
     * the row model breaks — and `insetTop + header + n·row + insetBottom` stops reproducing
     * the node's real border-box height. That identity is what the eligibility check in
     * `flow-edge.ts` relies on to detect non-uniform rows, so pin it to REAL geometry here.
     */
    it('the measured SchemaMetrics reproduce the real node border box', async () => {
        const m = await mountFixture();
        const { insetTop, insetBottom, headerHeight, rowHeight, rowHeightLast } = m.metrics;

        const node = (m.scope.nodes as FlowNode[]).find((n) => n.id === 'a')!;
        const modelled =
            insetTop + headerHeight
            + (FIELDS.length - 1) * rowHeight + rowHeightLast
            + insetBottom;

        // node.dimensions is the border box, rounded to an integer by the ResizeObserver.
        expect(Math.abs(modelled - node.dimensions!.height)).toBeLessThanOrEqual(0.5);
        expect(rowHeight).toBeGreaterThan(0);
        expect(headerHeight).toBeGreaterThan(0);

        // The regression this whole file exists to catch: under the shipped theme the last
        // row really IS shorter (`:last-child` drops its border-bottom). If these ever come
        // back equal, either the theme changed or the metric stopped being measured — and a
        // uniform-row model silently disqualifies every schema node from the fast path.
        expect(rowHeightLast).toBeLessThan(rowHeight);
    });
});
