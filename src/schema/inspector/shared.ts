// ============================================================================
// Shared helpers for the three inspector directives.
//
// Keeps the per-scope files focused on the (scope-specific) default UI and
// helper wiring. Selection lookup, canvas discovery, default-ui detection,
// and stamping utilities live here.
// ============================================================================

import type { Alpine } from 'alpinejs';

export type InspectorScope = 'node' | 'row' | 'edge';

/**
 * Pick the primary selection id from a reactive `Set<string>`.
 *
 * JS Sets preserve insertion order, so the most recently selected id is the
 * last element. For an empty set we return null.
 *
 * Iterating the set here also registers a reactive dependency with Alpine so
 * callers inside an `effect` re-run when the set changes.
 */
export function lastInSet(set: Set<string> | null | undefined): string | null {
    if (!set || set.size === 0) {
        return null;
    }
    let last: string | null = null;
    for (const id of set) {
        last = id;
    }
    return last;
}

/** Parse a row id of the form "nodeId.fieldName" — first dot only. */
export function parseRowId(
    rowId: string | null,
): { nodeId: string; fieldName: string } | null {
    if (!rowId) {
        return null;
    }
    const dot = rowId.indexOf('.');
    if (dot < 1 || dot === rowId.length - 1) {
        return null;
    }
    return { nodeId: rowId.slice(0, dot), fieldName: rowId.slice(dot + 1) };
}

/**
 * Resolve the flow canvas Alpine scope associated with an inspector element.
 *
 * Three-step lookup:
 *   1. Nearest ancestor `.flow-container` — inspector nested inside the canvas
 *      viewport (preset side-panel pattern).
 *   2. If none, and exactly one `.flow-container` exists on the page, use it —
 *      supports outside-canvas placements (e.g. a page-level right sidebar
 *      that's a sibling of the canvas). Single canvas = unambiguous.
 *   3. Multiple canvases without an ancestor match — log a one-shot warning
 *      and bail out; the caller must nest the inspector inside the target
 *      canvas (an explicit selector prop is on the v0.2.2 roadmap).
 */
export function findCanvasScope(
    Alpine: Alpine,
    el: HTMLElement,
): any | null {
    // 1. Closest ancestor .flow-container — inside-canvas placement.
    const ancestor = el.closest('.flow-container') as HTMLElement | null;
    if (ancestor) {
        try {
            return Alpine.$data(ancestor) ?? null;
        } catch {
            /* fall through to page-level fallbacks */
        }
    }

    // 2. Single .flow-container on the page — outside-canvas placement.
    const containers = document.querySelectorAll('.flow-container');
    if (containers.length === 1) {
        try {
            return Alpine.$data(containers[0] as HTMLElement) ?? null;
        } catch {
            /* fall through to warning / null */
        }
    }

    // 3. Multiple canvases and no ancestor — warn once, return null.
    if (
        containers.length > 1
        && !(window as any).__alpineflowSchemaMultiCanvasWarned
    ) {
        (window as any).__alpineflowSchemaMultiCanvasWarned = true;
        console.warn(
            '[alpineflow/schema] inspector directive found multiple .flow-container elements on the page; '
            + 'place inspector inside the canvas OR scope the directive expression to a specific canvas '
            + '(multi-canvas scope selector is on the v0.2.2 roadmap).',
        );
    }

    return null;
}

/**
 * Locate the opt-in default-UI template directly inside the directive element.
 *
 * Scoped to `:scope > template[x-schema-default-ui]` so nested inspector
 * consumers can't accidentally collide with a parent scaffold.
 */
export function findDefaultUiTemplate(el: HTMLElement): HTMLTemplateElement | null {
    return el.querySelector(
        ':scope > template[x-schema-default-ui]',
    ) as HTMLTemplateElement | null;
}

/**
 * Remove any previously-stamped default-UI content so the next render can
 * replace it cleanly. We mark our managed root with a data attribute and only
 * touch that — host children (siblings of the template) are never disturbed.
 */
export function clearStampedUi(el: HTMLElement): void {
    const existing = el.querySelector(':scope > [data-schema-default-ui-root]');
    if (existing) {
        existing.remove();
    }
}

/**
 * Append a managed root after the template and return it for content stamping.
 * The managed root carries `data-schema-default-ui-root` so we can find and
 * replace it on every re-render.
 */
export function createStampRoot(el: HTMLElement): HTMLElement {
    const root = document.createElement('div');
    root.setAttribute('data-schema-default-ui-root', '');
    el.appendChild(root);
    return root;
}

/**
 * Snapshot of a focused input inside a stamp root so we can re-focus the
 * equivalent element after a re-stamp. Identity is resolved via `data-field`
 * (our own marker on inspector inputs) and a tag-name match.
 */
export interface StampFocusSnapshot {
    field: string;
    tagName: string;
    selectionStart: number | null;
    selectionEnd: number | null;
}

/**
 * Capture the currently-focused element within a stamp root so re-stamps can
 * restore focus. Returns `null` when focus isn't within the root, or the
 * focused element has no `data-field` identity marker.
 */
export function captureStampFocus(
    root: HTMLElement | null | undefined,
): StampFocusSnapshot | null {
    if (!root) {
        return null;
    }
    const active = document.activeElement;
    if (!active || !(active instanceof HTMLElement) || !root.contains(active)) {
        return null;
    }
    const field = active.getAttribute('data-field');
    if (!field) {
        return null;
    }
    let selectionStart: number | null = null;
    let selectionEnd: number | null = null;
    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
        try {
            selectionStart = active.selectionStart;
            selectionEnd = active.selectionEnd;
        } catch {
            /* Some input types (e.g. checkbox, number) throw on selection access. */
        }
    }
    return {
        field,
        tagName: active.tagName.toLowerCase(),
        selectionStart,
        selectionEnd,
    };
}

/**
 * Escape an attribute value for safe embedding in a CSS selector. Prefers
 * the native `CSS.escape` when available (all modern browsers) and falls
 * back to a minimal escaper for environments without it (e.g. older jsdom).
 */
function escapeAttrValue(value: string): string {
    if (typeof (globalThis as any).CSS !== 'undefined' && typeof (globalThis as any).CSS.escape === 'function') {
        return (globalThis as any).CSS.escape(value);
    }
    return value.replace(/["\\]/g, '\\$&');
}

/**
 * Restore focus after a re-stamp. Looks up the element by `data-field` within
 * the new root (requiring a matching tag name) and re-focuses it, restoring
 * the selection range when possible. Silent on failure — focus preservation
 * is best-effort and must never crash the re-stamp cycle.
 */
export function restoreStampFocus(
    root: HTMLElement | null | undefined,
    captured: StampFocusSnapshot | null,
): void {
    if (!root || !captured) {
        return;
    }
    const candidate = root.querySelector<HTMLElement>(
        `[data-field="${escapeAttrValue(captured.field)}"]`,
    );
    if (!candidate) {
        return;
    }
    if (candidate.tagName.toLowerCase() !== captured.tagName) {
        return;
    }
    try {
        candidate.focus({ preventScroll: true });
        if (
            (candidate instanceof HTMLInputElement || candidate instanceof HTMLTextAreaElement)
            && captured.selectionStart !== null
            && captured.selectionEnd !== null
        ) {
            candidate.setSelectionRange(captured.selectionStart, captured.selectionEnd);
        }
    } catch {
        /* silent — focus failures shouldn't crash the re-stamp */
    }
}
