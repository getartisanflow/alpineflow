import type { SchemaGraphJSON } from './types';
import { mergeEntitiesById } from '../core/deep-merge';

/**
 * Export schema graph as a stable JSON shape. Strips internal underscore-prefixed
 * flags and only keeps the documented public fields.
 */
export function schemaToJSON(canvas: {
    nodes: Array<any>;
    edges: Array<any>;
}): SchemaGraphJSON {
    const nodes = (canvas.nodes ?? []).map((n) => ({
        id: n.id,
        label: n.data?.label ?? '',
        fields: (n.data?.fields ?? []).map((f: any) => ({ ...f })),
        position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
    }));

    const edges = (canvas.edges ?? []).map((e) => {
        const edge: any = { id: e.id, source: e.source, target: e.target };
        if (e.sourceHandle !== undefined) {
            edge.sourceHandle = e.sourceHandle;
        }
        if (e.targetHandle !== undefined) {
            edge.targetHandle = e.targetHandle;
        }
        if (e.label !== undefined) {
            edge.label = e.label;
        }
        return edge;
    });

    return { version: 1, nodes, edges };
}

/**
 * Import a schema graph, MERGING it into the canvas's live nodes + edges arrays.
 *
 * Surviving ids keep their original object references (mutated to match the
 * imported schema), so `getNode`/`getEdge`, drag handlers, and edge effects all
 * stay bound to the live objects. `deleteMissing: false` because the schema JSON
 * is intentionally partial — non-schema props (`dimensions`, `type`, …) must
 * survive a round-trip. After merging, the node/edge lookup maps are rebuilt so
 * `getNode`/`getEdge` return the merged objects rather than orphaned ones.
 */
export function schemaFromJSON(
    canvas: {
        nodes: any[];
        edges: any[];
        _rebuildNodeMap?: () => void;
        _rebuildEdgeMap?: () => void;
        _layoutAnimTick?: number;
    },
    json: SchemaGraphJSON,
): void {
    if (!json || typeof (json as any).version !== 'number') {
        throw new Error('[alpineflow/schema] schemaFromJSON: missing or invalid version');
    }
    if (json.version !== 1) {
        throw new Error(`[alpineflow/schema] schemaFromJSON: unsupported version ${json.version}`);
    }

    const incomingNodes = (json.nodes ?? []).map((n) => ({
        id: n.id,
        position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
        data: {
            label: n.label,
            fields: (n.fields ?? []).map((f) => ({ ...f })),
        },
    }));

    const incomingEdges = (json.edges ?? []).map((e) => {
        const edge: any = { id: e.id, source: e.source, target: e.target };
        if (e.sourceHandle !== undefined) {
            edge.sourceHandle = e.sourceHandle;
        }
        if (e.targetHandle !== undefined) {
            edge.targetHandle = e.targetHandle;
        }
        if (e.label !== undefined) {
            edge.label = e.label;
        }
        return edge;
    });

    const mergedNodes = mergeEntitiesById(canvas.nodes, incomingNodes, { deleteMissing: false });
    canvas.nodes.splice(0, canvas.nodes.length, ...mergedNodes);
    const mergedEdges = mergeEntitiesById(canvas.edges, incomingEdges, { deleteMissing: false });
    canvas.edges.splice(0, canvas.edges.length, ...mergedEdges);
    canvas._rebuildNodeMap?.();
    canvas._rebuildEdgeMap?.();
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
            canvas._layoutAnimTick = (canvas._layoutAnimTick ?? 0) + 1;
        });
    }
}
