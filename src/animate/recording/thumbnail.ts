import type { CanvasSnapshot, InFlightAnimation } from './types';

export interface ThumbnailRenderOptions {
    width: number;
    height: number;
    inFlight?: InFlightAnimation[];
}

export interface ThumbnailRenderer {
    render: (state: CanvasSnapshot, options: ThumbnailRenderOptions) => string;
}

const REGISTRY = new Map<string, ThumbnailRenderer>();

export function registerThumbnailRenderer(name: string, renderer: ThumbnailRenderer): void {
    REGISTRY.set(name, renderer);
}

export function getThumbnailRenderer(name: string): ThumbnailRenderer | undefined {
    return REGISTRY.get(name);
}

export function hasThumbnailRenderer(name: string): boolean {
    return REGISTRY.has(name);
}

function computeBoundingBox(
    nodes: CanvasSnapshot['nodes'],
    pad: number = 20,
): { minX: number; minY: number; vbWidth: number; vbHeight: number } | null {
    const nodeList = Object.values(nodes);
    if (nodeList.length === 0) {
        return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of nodeList) {
        const nx = node.position?.x ?? 0;
        const ny = node.position?.y ?? 0;
        const nw = node.dimensions?.width ?? 150;
        const nh = node.dimensions?.height ?? 40;
        minX = Math.min(minX, nx);
        minY = Math.min(minY, ny);
        maxX = Math.max(maxX, nx + nw);
        maxY = Math.max(maxY, ny + nh);
    }

    minX -= pad;
    minY -= pad;
    maxX += pad;
    maxY += pad;

    return { minX, minY, vbWidth: maxX - minX, vbHeight: maxY - minY };
}

function buildEdgeLines(state: CanvasSnapshot): string {
    let out = '';
    for (const edge of Object.values(state.edges)) {
        const source = state.nodes[edge.source!];
        const target = state.nodes[edge.target!];
        if (!source || !target) { continue; }
        const sx = (source.position?.x ?? 0) + (source.dimensions?.width ?? 150) / 2;
        const sy = (source.position?.y ?? 0) + (source.dimensions?.height ?? 40) / 2;
        const tx = (target.position?.x ?? 0) + (target.dimensions?.width ?? 150) / 2;
        const ty = (target.position?.y ?? 0) + (target.dimensions?.height ?? 40) / 2;
        out += `<line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="currentColor" stroke-width="1" opacity="0.5"/>`;
    }
    return out;
}

export const faithfulRenderer: ThumbnailRenderer = {
    render(state, { width, height }) {
        const nodes = Object.values(state.nodes);
        if (nodes.length === 0) {
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
        }

        const bbox = computeBoundingBox(state.nodes);
        if (!bbox) {
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
        }

        const { minX, minY, vbWidth, vbHeight } = bbox;
        let svg = `<svg width="${width}" height="${height}" viewBox="${minX} ${minY} ${vbWidth} ${vbHeight}" xmlns="http://www.w3.org/2000/svg">`;

        svg += buildEdgeLines(state);

        for (const node of nodes) {
            const nx = node.position?.x ?? 0;
            const ny = node.position?.y ?? 0;
            const nw = node.dimensions?.width ?? 150;
            const nh = node.dimensions?.height ?? 40;
            svg += `<rect x="${nx}" y="${ny}" width="${nw}" height="${nh}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
        }

        svg += '</svg>';
        return svg;
    },
};

export const outlineRenderer: ThumbnailRenderer = {
    render(state, { width, height }) {
        const nodes = Object.values(state.nodes);
        if (nodes.length === 0) {
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
        }

        const bbox = computeBoundingBox(state.nodes);
        if (!bbox) {
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
        }

        const { minX, minY, vbWidth, vbHeight } = bbox;
        let svg = `<svg width="${width}" height="${height}" viewBox="${minX} ${minY} ${vbWidth} ${vbHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Edges slightly stronger than faithful
        for (const edge of Object.values(state.edges)) {
            const source = state.nodes[edge.source!];
            const target = state.nodes[edge.target!];
            if (!source || !target) { continue; }
            const sx = (source.position?.x ?? 0) + (source.dimensions?.width ?? 150) / 2;
            const sy = (source.position?.y ?? 0) + (source.dimensions?.height ?? 40) / 2;
            const tx = (target.position?.x ?? 0) + (target.dimensions?.width ?? 150) / 2;
            const ty = (target.position?.y ?? 0) + (target.dimensions?.height ?? 40) / 2;
            svg += `<line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
        }

        // Nodes as outlines only (no fill)
        for (const node of nodes) {
            const nx = node.position?.x ?? 0;
            const ny = node.position?.y ?? 0;
            const nw = node.dimensions?.width ?? 150;
            const nh = node.dimensions?.height ?? 40;
            svg += `<rect x="${nx}" y="${ny}" width="${nw}" height="${nh}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
        }

        svg += '</svg>';
        return svg;
    },
};

export const activityRenderer: ThumbnailRenderer = {
    render(state, { width, height, inFlight }) {
        const nodes = Object.values(state.nodes);
        if (nodes.length === 0) {
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
        }

        const bbox = computeBoundingBox(state.nodes);
        if (!bbox) {
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
        }

        // Extract active node IDs from inFlight animations
        const activeNodeIds = new Set<string>();
        if (inFlight) {
            for (const anim of inFlight) {
                if (anim.targets?.nodes) {
                    for (const id of Object.keys(anim.targets.nodes)) {
                        activeNodeIds.add(id);
                    }
                }
            }
        }

        const { minX, minY, vbWidth, vbHeight } = bbox;
        let svg = `<svg width="${width}" height="${height}" viewBox="${minX} ${minY} ${vbWidth} ${vbHeight}" xmlns="http://www.w3.org/2000/svg">`;

        svg += buildEdgeLines(state);

        for (const node of nodes) {
            const nx = node.position?.x ?? 0;
            const ny = node.position?.y ?? 0;
            const nw = node.dimensions?.width ?? 150;
            const nh = node.dimensions?.height ?? 40;
            const isActive = activeNodeIds.has(node.id ?? '');

            if (isActive) {
                // Accent: bright fill, full opacity
                svg += `<rect x="${nx}" y="${ny}" width="${nw}" height="${nh}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>`;
            } else {
                // Greyed out
                svg += `<rect x="${nx}" y="${ny}" width="${nw}" height="${nh}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
            }
        }

        svg += '</svg>';
        return svg;
    },
};

registerThumbnailRenderer('faithful', faithfulRenderer);
registerThumbnailRenderer('outline', outlineRenderer);
registerThumbnailRenderer('activity', activityRenderer);
