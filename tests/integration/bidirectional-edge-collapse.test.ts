/**
 * Bidirectional edge collapse (v0.2.1-alpha Task 5).
 *
 * When `canvas.collapseBidirectionalEdges: true`, reciprocal edge pairs
 * (A→B + B→A) render as a single path with markers at BOTH ends. The mirror
 * edge's SVG is hidden via `display: none`; the primary edge's path gains a
 * `marker-start` attribute in addition to `marker-end`. Both edges still exist
 * in `canvas.edges` — only rendering changes.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { mountCanvas, unmountAll, nextFrame } from './helpers/mount';

describe('bidirectional edge collapse', () => {
    afterEach(() => unmountAll());

    it('hides the mirror edge and draws dual markers on the primary', async () => {
        const { canvas } = await mountCanvas({
            collapseBidirectionalEdges: true,
            nodes: [
                { id: 'n1', position: { x: 0, y: 0 }, data: {} },
                { id: 'n2', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [
                { id: 'a', source: 'n1', target: 'n2', markerEnd: 'arrow' },
                { id: 'b', source: 'n2', target: 'n1', markerEnd: 'arrow' },
            ],
        });
        await nextFrame(2);

        const primarySvg = canvas.querySelector('[data-flow-edge-id="a"]')?.closest('svg') as SVGSVGElement | null;
        const mirrorSvg = canvas.querySelector('[data-flow-edge-id="b"]')?.closest('svg') as SVGSVGElement | null;
        expect(primarySvg).not.toBeNull();
        expect(mirrorSvg).not.toBeNull();

        // Mirror edge SVG hidden via inline display style.
        expect(mirrorSvg!.style.display).toBe('none');
        // Primary edge SVG remains visible.
        expect(primarySvg!.style.display).not.toBe('none');

        // Primary path has BOTH marker-start and marker-end.
        // The visible path is the second <path> inside the <g> (first is the invisible hit area).
        const primaryPath = primarySvg!.querySelector('path:not(:first-child)') as SVGPathElement | null;
        expect(primaryPath).not.toBeNull();
        expect(primaryPath!.getAttribute('marker-start')).toMatch(/^url\(#/);
        expect(primaryPath!.getAttribute('marker-end')).toMatch(/^url\(#/);
    });

    it('does not collapse when the option is disabled', async () => {
        const { canvas } = await mountCanvas({
            nodes: [
                { id: 'n1', position: { x: 0, y: 0 }, data: {} },
                { id: 'n2', position: { x: 200, y: 0 }, data: {} },
            ],
            edges: [
                { id: 'a', source: 'n1', target: 'n2', markerEnd: 'arrow' },
                { id: 'b', source: 'n2', target: 'n1', markerEnd: 'arrow' },
            ],
        });
        await nextFrame(2);

        const aSvg = canvas.querySelector('[data-flow-edge-id="a"]')?.closest('svg') as SVGSVGElement | null;
        const bSvg = canvas.querySelector('[data-flow-edge-id="b"]')?.closest('svg') as SVGSVGElement | null;
        expect(aSvg!.style.display).not.toBe('none');
        expect(bSvg!.style.display).not.toBe('none');

        const aPath = aSvg!.querySelector('path:not(:first-child)') as SVGPathElement | null;
        // Without collapse, edge 'a' has only marker-end.
        expect(aPath!.getAttribute('marker-start')).toBeNull();
        expect(aPath!.getAttribute('marker-end')).toMatch(/^url\(#/);
    });
});
