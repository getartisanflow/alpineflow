// @vitest-environment jsdom
// ============================================================================
// findCanvasScope — ancestor / single-canvas fallback / multi-canvas warn.
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { findCanvasScope } from './shared';

function clearBody(): void {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
}

describe('findCanvasScope', () => {
    beforeEach(() => {
        clearBody();
        (window as any).__alpineflowSchemaMultiCanvasWarned = false;
    });

    it('finds the canvas when the element is a descendant of .flow-container', () => {
        const canvas = document.createElement('div');
        canvas.classList.add('flow-container');
        canvas.setAttribute('x-data', '{ marker: "inside" }');
        const inspector = document.createElement('div');
        canvas.appendChild(inspector);
        document.body.appendChild(canvas);
        Alpine.initTree(canvas);

        const scope = findCanvasScope(Alpine as any, inspector);
        expect(scope?.marker).toBe('inside');
    });

    it('falls back to the single .flow-container when the element is outside', () => {
        const canvas = document.createElement('div');
        canvas.classList.add('flow-container');
        canvas.setAttribute('x-data', '{ marker: "outside" }');
        document.body.appendChild(canvas);
        Alpine.initTree(canvas);

        // Sibling of the canvas — not a descendant.
        const inspector = document.createElement('div');
        document.body.appendChild(inspector);

        const scope = findCanvasScope(Alpine as any, inspector);
        expect(scope?.marker).toBe('outside');
    });

    it('returns null and warns once when multiple canvases exist and element is outside', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const canvasA = document.createElement('div');
        canvasA.classList.add('flow-container');
        canvasA.setAttribute('x-data', '{ marker: "A" }');
        const canvasB = document.createElement('div');
        canvasB.classList.add('flow-container');
        canvasB.setAttribute('x-data', '{ marker: "B" }');
        document.body.appendChild(canvasA);
        document.body.appendChild(canvasB);
        Alpine.initTree(canvasA);
        Alpine.initTree(canvasB);

        const inspector = document.createElement('div');
        document.body.appendChild(inspector);

        const scope = findCanvasScope(Alpine as any, inspector);
        expect(scope).toBeNull();
        expect(warnSpy).toHaveBeenCalledOnce();
        warnSpy.mockRestore();
    });
});
