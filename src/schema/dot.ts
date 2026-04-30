// ============================================================================
// alpineflow/schema — toDot
//
// Pure helper: renders the current `canvas.nodes` + `canvas.edges` as a valid
// graphviz DOT string. No canvas coupling, no mutation, never throws on
// malformed input.
//
// Useful for docs generation, static image output (via `dot -Tpng`), and
// PR-review attachments.
//
// Schema nodes render as HTML-like `<TABLE>` labels so field rows appear as
// rows inside the node box in any graphviz viewer. Each field row exposes a
// `PORT="<fieldName>"` so edges can reference a specific row when
// `sourceHandle`/`targetHandle` are set.
// ============================================================================

import type { DotExportOptions } from './types';

const DEFAULTS: Required<DotExportOptions> = {
    rankdir: 'LR',
    nodeShape: 'plaintext',
    includeFieldTypes: true,
    includeFieldKeys: true,
    graphName: 'schema',
};

/**
 * Escape a string for inclusion inside a graphviz HTML-like label (the content
 * between the `< ... >` delimiters). Only the five XML/HTML specials need
 * escaping; the surrounding `<TAG>` markup is emitted by the renderer and is
 * not user-supplied.
 */
function escapeHTML(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Escape a string for inclusion inside a graphviz quoted string (`"..."`).
 * Backslash must be doubled first so the subsequent quote-escaping doesn't
 * re-escape the backslashes it just added.
 */
function escapeQuoted(s: string): string {
    return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function renderNode(n: any, o: Required<DotExportOptions>): string {
    const id = String(n?.id ?? '');
    const label = String(n?.data?.label ?? '');
    const fields = Array.isArray(n?.data?.fields) ? n.data.fields : [];

    const colSpan = 1 + (o.includeFieldKeys ? 1 : 0) + (o.includeFieldTypes ? 1 : 0);

    const rows: string[] = [];
    rows.push(
        `      <TR><TD BGCOLOR="#f0f0f0" COLSPAN="${colSpan}"><B>${escapeHTML(label)}</B></TD></TR>`,
    );

    for (const f of fields) {
        const name = String(f?.name ?? '');
        const cells: string[] = [];

        if (o.includeFieldKeys) {
            const marker = f?.key === 'primary' ? 'PK' : f?.key === 'foreign' ? 'FK' : '';
            cells.push(`<TD>${marker}</TD>`);
        }
        cells.push(`<TD PORT="${escapeHTML(name)}">${escapeHTML(name)}</TD>`);
        if (o.includeFieldTypes) {
            cells.push(`<TD>${escapeHTML(String(f?.type ?? ''))}</TD>`);
        }

        rows.push(`      <TR>${cells.join('')}</TR>`);
    }

    return (
        `  "${escapeQuoted(id)}" [label=<\n` +
        `    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">\n` +
        `${rows.join('\n')}\n` +
        `    </TABLE>\n` +
        `  >];`
    );
}

function renderEdge(e: any): string {
    const source = `"${escapeQuoted(String(e?.source ?? ''))}"`;
    const target = `"${escapeQuoted(String(e?.target ?? ''))}"`;
    const sourcePort = e?.sourceHandle
        ? `:"${escapeQuoted(String(e.sourceHandle))}"`
        : '';
    const targetPort = e?.targetHandle
        ? `:"${escapeQuoted(String(e.targetHandle))}"`
        : '';
    const label = e?.label
        ? ` [label="${escapeQuoted(String(e.label))}"]`
        : '';
    return `  ${source}${sourcePort} -> ${target}${targetPort}${label};`;
}

/**
 * Render `canvas.nodes` + `canvas.edges` as a graphviz DOT string.
 *
 * Pure function: no canvas coupling, no mutation, safe on malformed input
 * (empty arrays, missing label, missing field type, etc.).
 */
export function toDot(
    canvas: { nodes: any[]; edges: any[] },
    opts: DotExportOptions = {},
): string {
    const o = { ...DEFAULTS, ...opts };

    const lines: string[] = [];
    lines.push(`digraph "${escapeQuoted(o.graphName)}" {`);
    lines.push(`  rankdir=${o.rankdir};`);
    lines.push(`  node [shape=${o.nodeShape}];`);

    for (const n of canvas?.nodes ?? []) {
        lines.push(renderNode(n, o));
    }

    for (const e of canvas?.edges ?? []) {
        lines.push(renderEdge(e));
    }

    lines.push('}');
    return lines.join('\n');
}
