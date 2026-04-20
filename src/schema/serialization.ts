import type { SchemaGraphJSON } from './types';

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
 * Import a schema graph, replacing the canvas's nodes + edges arrays in place.
 * In-place mutation (splice) preserves Alpine reactivity on the live refs.
 */
export function schemaFromJSON(
    canvas: { nodes: any[]; edges: any[] },
    json: SchemaGraphJSON,
): void {
    if (!json || typeof (json as any).version !== 'number') {
        throw new Error('[alpineflow/schema] schemaFromJSON: missing or invalid version');
    }
    if (json.version !== 1) {
        throw new Error(`[alpineflow/schema] schemaFromJSON: unsupported version ${json.version}`);
    }

    const newNodes = (json.nodes ?? []).map((n) => ({
        id: n.id,
        position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
        data: {
            label: n.label,
            fields: (n.fields ?? []).map((f) => ({ ...f })),
        },
    }));

    const newEdges = (json.edges ?? []).map((e) => {
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

    canvas.nodes.splice(0, canvas.nodes.length, ...newNodes);
    canvas.edges.splice(0, canvas.edges.length, ...newEdges);
}
