/// <reference types="vite/client" />
/**
 * Edges must end on their handles after every viewport + geometry change.
 *
 * Edges do not re-run on pan/zoom (their paths are flow-space and scale with the
 * viewport transform), so a measurement taken at a bad moment is never corrected by
 * a later viewport frame. These cases are the bad moments: the DOM transform and the
 * reactive `viewport` disagreeing within a tick, an instant layout, and an endpoint
 * that was culled or hidden when its edge last measured.
 *
 * The oracle is independent of the edge code: each drawn path end, projected to the
 * screen through the path's own CTM, is compared with the centre of the handle element
 * it attaches to. No markers are used, so the two must coincide.
 */
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import structuralCss from '../../css/structural.css?raw';
import themeCss from '../../css/theme-default.css?raw';
import { mountCanvas, unmountAll, nextFrame, wait } from './helpers/mount';

const TOLERANCE = 1;

beforeAll(() => {
    if (document.getElementById('edge-endpoint-sync-css')) return;
    const style = document.createElement('style');
    style.id = 'edge-endpoint-sync-css';
    style.textContent = `${structuralCss}\n${themeCss}`;
    document.head.appendChild(style);
});

afterEach(() => unmountAll());

function paintedZoom(canvas: HTMLElement): number {
    const viewportEl = canvas.querySelector('.flow-viewport') as HTMLElement;
    return new DOMMatrixReadOnly(getComputedStyle(viewportEl).transform).a || 1;
}

/** Largest distance, in flow px, between a drawn end of the edge and its handle's centre. */
function endpointDrift(canvas: HTMLElement, edgeId: string, source: string, target: string): number {
    const path = canvas.querySelectorAll(`g[data-flow-edge-id="${edgeId}"] path`)[1] as SVGPathElement;
    const ctm = path.getScreenCTM()!;
    const length = path.getTotalLength();
    const ends: Array<[string, 'source' | 'target', number]> = [[source, 'source', 0], [target, 'target', length]];
    let worst = 0;
    for (const [nodeId, type, at] of ends) {
        const handle = canvas.querySelector(`[data-flow-node-id="${nodeId}"] [data-flow-handle-type="${type}"]`)!;
        const rect = handle.getBoundingClientRect();
        expect(rect.width, `${nodeId} ${type} handle is laid out`).toBeGreaterThan(0);
        const pt = path.getPointAtLength(at);
        const drawn = new DOMPoint(pt.x, pt.y).matrixTransform(ctm);
        const distance = Math.hypot(drawn.x - (rect.left + rect.width / 2), drawn.y - (rect.top + rect.height / 2));
        worst = Math.max(worst, distance / paintedZoom(canvas));
    }
    return worst;
}

/**
 * Nodes whose target handle sits near the top of a tall left side, so the fallback an
 * unmeasurable handle gets (the middle of the node's side) is far from where it really is.
 */
function tallNodeTemplate(): HTMLElement {
    const viewport = document.createElement('div');
    viewport.setAttribute('x-flow-viewport', '');
    const template = document.createElement('template');
    template.setAttribute('x-for', 'node in nodes');
    template.setAttribute(':key', 'node.id');
    const node = document.createElement('div');
    node.setAttribute('x-flow-node', 'node');
    const body = document.createElement('div');
    body.style.cssText = 'height: 160px; width: 140px; overflow: hidden';
    body.setAttribute('x-text', "node.data?.label ?? ''");
    node.appendChild(body);
    const targetHandle = document.createElement('div');
    targetHandle.setAttribute('x-flow-handle:target.left', '');
    targetHandle.setAttribute('x-show', 'node.data?.showPort !== false');
    targetHandle.setAttribute(':style', "{ top: node.data?.portTop ?? '20px' }");
    node.appendChild(targetHandle);
    const sourceHandle = document.createElement('div');
    sourceHandle.setAttribute('x-flow-handle:source.right', '');
    node.appendChild(sourceHandle);
    template.content.appendChild(node);
    viewport.appendChild(template);
    return viewport;
}

const twoNodes = {
    nodes: [
        { id: 'a', position: { x: 100, y: 100 }, data: { label: 'A' } },
        { id: 'b', position: { x: 400, y: 250 }, data: { label: 'B' } },
    ],
    edges: [{ id: 'e1', source: 'a', target: 'b' }],
};

describe('edge endpoints stay on their handles', () => {
    it('after setViewport() and a node move in the same tick', async () => {
        const { canvas, scope, flow } = await mountCanvas(structuredClone(twoNodes));
        await nextFrame(5);

        flow.setViewport({ x: -80, y: 30, zoom: 1.2 });
        scope.getNode('a').position.x += 40;
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after a node is released while auto-pan is scrolling', async () => {
        const { canvas, scope } = await mountCanvas(structuredClone(twoNodes));
        await nextFrame(5);

        const nodeEl = canvas.querySelector('[data-flow-node-id="a"]') as HTMLElement;
        const nodeRect = nodeEl.getBoundingClientRect();
        const mouse = (type: string, target: EventTarget, x: number, y: number) =>
            target.dispatchEvent(new MouseEvent(type, {
                bubbles: true, cancelable: true, view: window, clientX: x, clientY: y,
                button: 0, buttons: type === 'mouseup' ? 0 : 1,
            }));

        let x = nodeRect.left + nodeRect.width / 2;
        const y = nodeRect.top + nodeRect.height / 2;
        const inPanZone = canvas.getBoundingClientRect().right - 8;
        mouse('mousedown', nodeEl, x, y);
        for (let i = 0; i < 12; i++) {
            x += (inPanZone - x) / 3;
            mouse('mousemove', window, x, y);
            await nextFrame(1);
        }
        mouse('mousemove', window, inPanZone, y);
        await nextFrame(8);
        mouse('mouseup', window, inPanZone, y);
        await wait(300);

        expect(scope.viewport.x, 'auto-pan ran').toBeLessThan(-5);
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    for (const fitView of [true, false]) {
        it(`after an instant layout (duration 0, fitView ${fitView})`, async () => {
            const { canvas, scope } = await mountCanvas(structuredClone(twoNodes));
            await nextFrame(5);

            scope._applyLayout(new Map([['a', { x: 50, y: 40 }], ['b', { x: 1500, y: 1100 }]]), { duration: 0, fitView });
            await wait(300);

            expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
        });
    }

    it('after a culled endpoint is panned back into view', async () => {
        const { canvas, scope, flow } = await mountCanvas({
            viewportCulling: true,
            nodes: [
                { id: 'a', position: { x: 100, y: 100 }, data: {} },
                { id: 'b', position: { x: 2000, y: 100 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'a', target: 'b' }],
        }, tallNodeTemplate());
        await nextFrame(5);

        const bEl = canvas.querySelector('[data-flow-node-id="b"]') as HTMLElement;
        flow.setViewport({ x: -1, y: 0, zoom: 1 });
        await nextFrame(3);
        expect(bEl.style.display, 'B is culled').toBe('none');

        // The edge re-measures while B is culled.
        scope.getNode('a').position.y += 5;
        await nextFrame(3);

        // Zoom out until both nodes are on screen.
        flow.setViewport({ x: 0, y: 0, zoom: 0.35 });
        await wait(300);

        expect(bEl.style.display, 'B is visible again').not.toBe('none');
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after culling switches off with a culled endpoint', async () => {
        const { canvas, scope, flow } = await mountCanvas({
            viewportCulling: 'auto',
            cullingAutoThreshold: 3,
            nodes: [
                { id: 'a', position: { x: 100, y: 100 }, data: {} },
                { id: 'b', position: { x: 2000, y: 100 }, data: {} },
                { id: 'c', position: { x: 100, y: 400 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'a', target: 'b' }],
        }, tallNodeTemplate());
        await nextFrame(5);

        const bEl = canvas.querySelector('[data-flow-node-id="b"]') as HTMLElement;
        flow.setViewport({ x: -1, y: 0, zoom: 1 });
        await nextFrame(3);
        expect(bEl.style.display, 'B is culled').toBe('none');

        scope.getNode('a').position.y += 5;
        await nextFrame(3);

        // Dropping below the threshold turns culling off on the next viewport frame.
        flow.removeNodes(['c']);
        await nextFrame(3);
        flow.setViewport({ x: 0, y: 0, zoom: 0.35 });
        await wait(300);

        expect(bEl.style.display, 'B is visible again').toBe('');
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after a hidden endpoint is shown again', async () => {
        const { canvas, scope } = await mountCanvas(structuredClone(twoNodes), tallNodeTemplate());
        await nextFrame(5);

        scope.getNode('b').hidden = true;
        await nextFrame(3);
        // The edge re-measures while B is hidden.
        scope.getNode('a').position.y += 30;
        await nextFrame(3);
        scope.getNode('b').hidden = false;
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after a collapsed group is expanded', async () => {
        // While collapsed, the edge is re-pointed at the (visible) group, so the edge
        // itself never hides: only the child it returns to was hidden.
        const { canvas, flow } = await mountCanvas({
            nodes: [
                { id: 'g', type: 'group', position: { x: 300, y: 50 }, data: {} },
                { id: 'c1', parentId: 'g', position: { x: 20, y: 20 }, data: {} },
                { id: 'x', position: { x: 20, y: 320 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'x', target: 'c1' }],
        }, tallNodeTemplate());
        await nextFrame(5);

        flow.collapseNode('g', { animate: false });
        await wait(200);
        flow.expandNode('g', { animate: false });
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'x', 'c1')).toBeLessThan(TOLERANCE);
    });

    it('after two connected nodes move in the same tick', async () => {
        const { canvas, scope } = await mountCanvas(structuredClone(twoNodes));
        await nextFrame(5);

        // The edge re-runs on A's move, before B's own effect has moved B.
        scope.getNode('a').position.x += 60;
        scope.getNode('b').position.x += 60;
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after two connected nodes move in the same tick with a centred nodeOrigin', async () => {
        const { canvas, scope } = await mountCanvas({ ...structuredClone(twoNodes), nodeOrigin: [0.5, 0.5] });
        await nextFrame(5);

        scope.getNode('a').position.x += 60;
        scope.getNode('b').position.x += 60;
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after a group and a node connected to its child move in the same tick', async () => {
        const { canvas, scope } = await mountCanvas({
            nodes: [
                { id: 'g', type: 'group', position: { x: 300, y: 50 }, data: {} },
                { id: 'c1', parentId: 'g', position: { x: 20, y: 20 }, data: {} },
                { id: 'x', position: { x: 20, y: 320 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'x', target: 'c1' }],
        });
        await nextFrame(5);

        // The edge re-runs on X's move, before the effects that move G and its child.
        scope.getNode('x').position.x += 30;
        scope.getNode('g').position.x += 40;
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'x', 'c1')).toBeLessThan(TOLERANCE);
    });

    it('after the nodes array is replaced (WireFlow sync mode)', async () => {
        const { canvas, scope, flow } = await mountCanvas(structuredClone(twoNodes));
        await nextFrame(5);

        // What `$wire.entangle('nodes')` does when the server moves nodes: a new array.
        scope.nodes = JSON.parse(JSON.stringify(scope.nodes))
            .map((n: any) => ({ ...n, position: { x: n.position.x + 60, y: n.position.y + 20 } }));
        await wait(300);

        expect(flow.getNode('a').position.x, 'getNode returns the new node').toBe(160);
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after a node object is swapped in place', async () => {
        const { canvas, scope, flow } = await mountCanvas(structuredClone(twoNodes));
        await nextFrame(5);

        const index = scope.nodes.findIndex((n: any) => n.id === 'b');
        scope.nodes[index] = { ...JSON.parse(JSON.stringify(scope.nodes[index])), position: { x: 460, y: 250 } };
        await nextFrame(3);
        // Re-run the edge: it must not move B back from the stale lookup.
        scope.getNode('a').position.y += 10;
        await wait(300);

        expect(flow.getNode('b').position.x, 'getNode returns the new node').toBe(460);
        const bEl = canvas.querySelector('[data-flow-node-id="b"]') as HTMLElement;
        expect(bEl.style.left, 'B stays where its node says').toBe('460px');
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after the whole canvas is hidden, a node moves, and it is shown again', async () => {
        // Like switching tabs: while the canvas is display:none, no node has a layout.
        const { el, canvas, scope } = await mountCanvas(structuredClone(twoNodes), tallNodeTemplate());
        await nextFrame(5);

        el.style.display = 'none';
        await nextFrame(2);
        scope.getNode('a').position.y += 30;
        await wait(100);
        el.style.display = '';
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after measuring inside a scaled container (a modal scaling in)', async () => {
        const { el, canvas, scope } = await mountCanvas(structuredClone(twoNodes), tallNodeTemplate());
        await nextFrame(5);

        el.style.transformOrigin = '0 0';
        el.style.transform = 'scale(0.8)';
        await nextFrame(2);
        scope._layoutAnimTick++; // the edge re-measures while the container is scaled
        await wait(100);
        el.style.transform = '';
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after a port hidden with x-show is shown', async () => {
        const graph = structuredClone(twoNodes);
        (graph.nodes[1].data as Record<string, unknown>).showPort = false;
        const { canvas, scope } = await mountCanvas(graph, tallNodeTemplate());
        await wait(200);

        scope.getNode('b').data.showPort = true;
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after a port moves inside its node (a style binding)', async () => {
        const { canvas, scope } = await mountCanvas(structuredClone(twoNodes), tallNodeTemplate());
        await nextFrame(5);

        // B keeps its size, so nothing reactive tells the edge.
        scope.getNode('b').data.portTop = '110px';
        await wait(300);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('after an animated viewport and node move', async () => {
        // `animate()` updates the reactive viewport but not `_viewportLive`, so this
        // guards against measuring with the live viewport instead of the painted one.
        const { canvas, flow } = await mountCanvas(structuredClone(twoNodes));
        await nextFrame(5);

        flow.animate(
            { nodes: { a: { position: { x: 250, y: 60 } } }, viewport: { pan: { x: -120, y: 40 }, zoom: 1.4 } },
            { duration: 250 },
        );
        await wait(600);

        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });
});

/** Count writes to the edge's visible path `d` until `stop()` is called. */
function countRedraws(canvas: HTMLElement, edgeId: string): { stop(): number } {
    const path = canvas.querySelectorAll(`g[data-flow-edge-id="${edgeId}"] path`)[1];
    let redraws = 0;
    const observer = new MutationObserver((records) => { redraws += records.length; });
    observer.observe(path, { attributes: true, attributeFilter: ['d'] });
    return { stop: () => { observer.disconnect(); return redraws; } };
}

describe('edges redraw only when they need to', () => {
    it('panning and zooming leave every edge path untouched', async () => {
        const { canvas, flow } = await mountCanvas(structuredClone(twoNodes));
        await nextFrame(5);

        const redraws = countRedraws(canvas, 'e1');
        for (let i = 1; i <= 10; i++) {
            flow.setViewport({ x: -20 * i, y: 10 * i, zoom: 1 + i * 0.05 });
            await nextFrame(1);
        }
        await nextFrame(3);

        expect(redraws.stop()).toBe(0);
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('culling an endpoint and panning it back leaves an unchanged edge untouched', async () => {
        const { canvas, scope, flow } = await mountCanvas({
            viewportCulling: true,
            nodes: [
                { id: 'a', position: { x: 100, y: 100 }, data: {} },
                { id: 'b', position: { x: 2000, y: 100 }, data: {} },
            ],
            edges: [{ id: 'e1', source: 'a', target: 'b' }],
        }, tallNodeTemplate());
        // Start with both nodes on screen and the edge measured against them.
        flow.setViewport({ x: 0, y: 0, zoom: 0.35 });
        await nextFrame(3);
        scope._layoutAnimTick++;
        await wait(100);

        const bEl = canvas.querySelector('[data-flow-node-id="b"]') as HTMLElement;
        const redraws = countRedraws(canvas, 'e1');
        flow.setViewport({ x: -1, y: 0, zoom: 1 });
        await nextFrame(3);
        expect(bEl.style.display, 'B is culled').toBe('none');
        flow.setViewport({ x: 0, y: 0, zoom: 0.35 });
        await wait(300);

        expect(bEl.style.display, 'B is visible again').not.toBe('none');
        expect(redraws.stop()).toBe(0);
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('changing a node’s content without moving its ports leaves the edge untouched', async () => {
        const { canvas, scope } = await mountCanvas(structuredClone(twoNodes), tallNodeTemplate());
        await nextFrame(5);

        const redraws = countRedraws(canvas, 'e1');
        scope.getNode('b').data.label = 'B, renamed';
        await wait(300);

        expect(redraws.stop()).toBe(0);
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });

    it('hiding and showing an endpoint leaves an unchanged edge untouched', async () => {
        const { canvas, scope } = await mountCanvas(structuredClone(twoNodes), tallNodeTemplate());
        await nextFrame(5);

        const redraws = countRedraws(canvas, 'e1');
        scope.getNode('b').hidden = true;
        await nextFrame(3);
        scope.getNode('b').hidden = false;
        await wait(300);

        expect(redraws.stop()).toBe(0);
        expect(endpointDrift(canvas, 'e1', 'a', 'b')).toBeLessThan(TOLERANCE);
    });
});
