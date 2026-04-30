// @vitest-environment jsdom
// ============================================================================
// findCanvasScope — ancestor / single-canvas fallback / multi-canvas warn.
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alpine from 'alpinejs';
import { findCanvasScope, captureStampFocus, restoreStampFocus } from './shared';

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

    it('captureStampFocus returns null when focus is outside the root', () => {
        const root = document.createElement('div');
        const input = document.createElement('input');
        input.setAttribute('data-field', 'name');
        document.body.appendChild(root);
        document.body.appendChild(input);
        input.focus();

        expect(captureStampFocus(root)).toBeNull();
    });

    it('captureStampFocus returns null when the focused element has no data-field', () => {
        const root = document.createElement('div');
        const input = document.createElement('input');
        root.appendChild(input);
        document.body.appendChild(root);
        input.focus();

        expect(captureStampFocus(root)).toBeNull();
    });

    it('captureStampFocus captures field + selection range for a focused input', () => {
        const root = document.createElement('div');
        const input = document.createElement('input');
        input.setAttribute('data-field', 'name');
        input.value = 'abcdef';
        root.appendChild(input);
        document.body.appendChild(root);
        input.focus();
        input.setSelectionRange(2, 4);

        const captured = captureStampFocus(root);
        expect(captured).toEqual({
            field: 'name',
            tagName: 'input',
            selectionStart: 2,
            selectionEnd: 4,
        });
    });

    it('restoreStampFocus refocuses by data-field and restores selection', () => {
        const root = document.createElement('div');
        const input = document.createElement('input');
        input.setAttribute('data-field', 'name');
        input.value = 'abcdef';
        root.appendChild(input);
        document.body.appendChild(root);

        restoreStampFocus(root, {
            field: 'name',
            tagName: 'input',
            selectionStart: 1,
            selectionEnd: 3,
        });

        expect(document.activeElement).toBe(input);
        expect(input.selectionStart).toBe(1);
        expect(input.selectionEnd).toBe(3);
    });

    it('restoreStampFocus is a no-op when candidate is missing or tag mismatches', () => {
        const root = document.createElement('div');
        const ta = document.createElement('textarea');
        ta.setAttribute('data-field', 'name');
        root.appendChild(ta);
        document.body.appendChild(root);

        // Tag mismatch: captured as input, new element is textarea — no focus.
        restoreStampFocus(root, {
            field: 'name',
            tagName: 'input',
            selectionStart: 0,
            selectionEnd: 0,
        });
        expect(document.activeElement).not.toBe(ta);

        // Null captured is a no-op.
        expect(() => restoreStampFocus(root, null)).not.toThrow();
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
