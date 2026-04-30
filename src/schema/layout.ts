// ============================================================================
// alpineflow/schema — schemaLayout wrapper
//
// Thin wrapper around the host canvas's layout engines (dagre → tree → grid)
// with schema-friendly defaults. When `deriveFromReferences` is set, uses
// `inferReferences()` output as the graph topology instead of `canvas.edges`.
//
// Detection is runtime-only: the schema subpath addon must NOT hard-depend on
// the dagre / hierarchy addons. If neither is registered, the grid fallback
// (pure math, zero external deps) is always available.
// ============================================================================

import type { SchemaLayoutOptions } from './types';
import { inferReferences } from './references';

type Algorithm = 'dagre' | 'tree' | 'grid';

const DEFAULT_ORDER: readonly Algorithm[] = ['dagre', 'tree', 'grid'] as const;

/**
 * Apply a schema-tuned layout to the canvas.
 *
 * - Prefers the dagre addon (exposed via `canvas.layout()`), falls through to
 *   the hierarchy addon (`canvas.treeLayout()`), then to a pure-math grid
 *   fallback that is always available.
 * - When `opts.deriveFromReferences` is true, the underlying layout sees the
 *   reference graph derived from `inferReferences(canvas.nodes)` instead of
 *   the canvas's explicit edges. The original edges are restored afterwards,
 *   even if the layout call throws.
 */
export async function schemaLayout(
    canvas: any,
    opts: SchemaLayoutOptions = {},
): Promise<void> {
    const direction = opts.direction ?? 'LR';
    const nodeSpacing = opts.nodeSpacing ?? 80;
    const rankSpacing = opts.rankSpacing ?? 160;

    const preferred = resolvePreferredOrder(opts.algorithm);

    // Swap edges in-place when deriving from references so whichever algorithm
    // runs downstream sees the inferred topology. Splice is used so Alpine's
    // reactive proxy tracks the mutation.
    const swap = opts.deriveFromReferences ? prepareEdgeSwap(canvas) : null;

    try {
        for (const algo of preferred) {
            if (algo === 'dagre' && tryDagre(canvas, direction, nodeSpacing, rankSpacing)) {
                return;
            }
            if (algo === 'tree' && tryTree(canvas, direction, nodeSpacing, rankSpacing)) {
                return;
            }
            if (algo === 'grid') {
                applyGridLayout(canvas.nodes ?? [], nodeSpacing, rankSpacing, direction);
                return;
            }
        }

        // Should be unreachable because 'grid' is always in the fallback chain
        // when no explicit algorithm was requested. Reachable only when the
        // consumer pinned algorithm:'dagre' or 'tree' and that addon was
        // missing — in which case we warn and no-op.
        // eslint-disable-next-line no-console
        console.warn(
            '[alpineflow/schema] schemaLayout: no layout algorithm available. ' +
                'Register @getartisanflow/alpineflow/dagre (or hierarchy), or pass ' +
                '{ algorithm: "grid" } for the always-available fallback.',
        );
    } finally {
        if (swap) {
            swap.restore();
        }
    }
}

function resolvePreferredOrder(pinned?: Algorithm): Algorithm[] {
    if (!pinned) {
        return [...DEFAULT_ORDER];
    }
    // When the consumer pins an algorithm, honour that first and only that —
    // they've opted out of the fallback chain. The grid path still counts as
    // "always available" and terminates immediately.
    return [pinned];
}

interface EdgeSwap {
    restore: () => void;
}

function prepareEdgeSwap(canvas: any): EdgeSwap | null {
    const edges = canvas.edges;
    if (!Array.isArray(edges)) {
        return null;
    }

    const original = edges.slice();
    const inferred = inferReferences(canvas.nodes ?? []).map((suggestion, index) => ({
        id: `schema-layout-inferred-${index}`,
        source: suggestion.fromNodeId,
        target: suggestion.toNodeId,
        sourceHandle: suggestion.fromFieldName,
        targetHandle: suggestion.toFieldName,
    }));

    edges.splice(0, edges.length, ...inferred);

    return {
        restore: () => {
            edges.splice(0, edges.length, ...original);
        },
    };
}

function tryDagre(
    canvas: any,
    direction: 'LR' | 'TB' | 'BT' | 'RL',
    nodeSpacing: number,
    rankSpacing: number,
): boolean {
    // `canvas.layout()` is the dagre entry point exposed by the core. When the
    // dagre addon isn't registered it throws a dedicated error — we treat that
    // as "not available" and fall through to the next algorithm.
    if (typeof canvas.layout !== 'function') {
        return false;
    }
    try {
        canvas.layout({
            direction,
            nodesep: nodeSpacing,
            ranksep: rankSpacing,
        });
        return true;
    } catch {
        return false;
    }
}

function tryTree(
    canvas: any,
    direction: 'LR' | 'TB' | 'BT' | 'RL',
    nodeSpacing: number,
    rankSpacing: number,
): boolean {
    if (typeof canvas.treeLayout !== 'function') {
        return false;
    }
    // The hierarchy engine only recognises TB / LR / BT / RL; pass through
    // as-is. It derives its own spacing from `nodeWidth` / `nodeHeight`, so
    // translate our logical spacing to those knobs.
    try {
        canvas.treeLayout({
            direction,
            nodeWidth: nodeSpacing + 200,
            nodeHeight: rankSpacing + 80,
        });
        return true;
    } catch {
        return false;
    }
}

function applyGridLayout(
    nodes: any[],
    nodeSpacing: number,
    rankSpacing: number,
    direction: 'LR' | 'TB' | 'BT' | 'RL',
): void {
    const count = nodes.length;
    if (count === 0) {
        return;
    }

    const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
    const rows = Math.ceil(count / cols);
    const cellWidth = nodeSpacing + 300;
    const cellHeight = rankSpacing + 200;

    for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        let x = col * cellWidth;
        let y = row * cellHeight;

        // Grid is axis-symmetric, so TB / LR collapse to the same arrangement;
        // BT and RL simply mirror the relevant axis so consumers who care about
        // the visual direction still see the right flow.
        if (direction === 'BT') {
            y = (rows - 1 - row) * cellHeight;
        } else if (direction === 'RL') {
            x = (cols - 1 - col) * cellWidth;
        }

        nodes[i].position = { x, y };
    }
}
