// ============================================================================
// SVG Markers
//
// Generates SVG <marker> definitions for edge arrowheads and other end markers.
// Supports built-in types (arrow, arrowclosed) and custom marker registration.
// ============================================================================

import { DEFAULT_STROKE_COLOR } from './constants';

export type MarkerType = 'arrow' | 'arrowclosed' | (string & {});

export interface MarkerConfig {
  type: MarkerType;
  color?: string;
  width?: number;
  height?: number;
  orient?: string;
  offset?: number;
}

/**
 * Render function for a custom marker. Receives the marker config (with resolved
 * defaults for color, width, height, orient) and the unique SVG id. Must return
 * a complete `<marker>...</marker>` SVG string.
 */
export type CustomMarkerRenderer = (config: {
  id: string;
  color: string;
  width: number;
  height: number;
  orient: string;
}) => string;

// ── Custom marker registry ─────────────────────────────────────────────────

const customMarkers = new Map<string, CustomMarkerRenderer>();

/**
 * Register a custom marker type. The renderer receives resolved defaults and
 * must return a complete `<marker>` SVG element string.
 *
 * @example
 * registerMarker('diamond', ({ id, color, width, height, orient }) => `
 *   <marker id="${id}" viewBox="0 0 20 20" markerWidth="${width}" markerHeight="${height}"
 *     orient="${orient}" markerUnits="strokeWidth" refX="10" refY="10">
 *     <polygon points="10,0 20,10 10,20 0,10" fill="${color}" />
 *   </marker>
 * `);
 *
 * // Then use on edges:
 * { id: 'e1', source: 'a', target: 'b', markerEnd: 'diamond' }
 */
export function registerMarker(type: string, renderer: CustomMarkerRenderer): void {
  customMarkers.set(type, renderer);
}

/** Escape a string for safe use inside an HTML/SVG attribute value. */
function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Normalize a marker shorthand (string type) into a full MarkerConfig.
 */
export function normalizeMarker(marker: MarkerType | MarkerConfig): MarkerConfig {
  return typeof marker === 'string' ? { type: marker } : marker;
}

/**
 * Generate a unique marker ID for deduplication in SVG defs.
 */
export function getMarkerId(marker: MarkerConfig, flowId: string): string {
  return `${flowId}__${marker.type}__${(marker.color ?? DEFAULT_STROKE_COLOR).replace(/[^a-zA-Z0-9]/g, '_')}`;
}

/**
 * Generate SVG marker element markup string.
 */
export function getMarkerSvg(marker: MarkerConfig, id: string): string {
  const color = escapeAttr(marker.color ?? DEFAULT_STROKE_COLOR);
  const rawW = Number(marker.width ?? 12.5);
  const rawH = Number(marker.height ?? 12.5);
  const w = Number.isFinite(rawW) && rawW > 0 ? rawW : 12.5;
  const h = Number.isFinite(rawH) && rawH > 0 ? rawH : 12.5;
  const orient = escapeAttr(marker.orient ?? 'auto-start-reverse');
  const safeId = escapeAttr(id);

  if (marker.type === 'arrow') {
    return `<marker
      id="${safeId}"
      viewBox="-10 -10 20 20"
      markerWidth="${w}"
      markerHeight="${h}"
      orient="${orient}"
      markerUnits="strokeWidth"
      refX="0"
      refY="0"
    >
      <polyline
        stroke="${color}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        fill="none"
        points="-5,-4 0,0 -5,4"
      />
    </marker>`;
  }

  if (marker.type === 'arrowclosed') {
    return `<marker
      id="${safeId}"
      viewBox="-10 -10 20 20"
      markerWidth="${w}"
      markerHeight="${h}"
      orient="${orient}"
      markerUnits="strokeWidth"
      refX="0"
      refY="0"
    >
      <polyline
        stroke="${color}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        fill="${color}"
        points="-5,-4 0,0 -5,4 -5,-4"
      />
    </marker>`;
  }

  // Custom marker — look up in registry
  const renderer = customMarkers.get(marker.type);
  if (renderer) {
    return renderer({ id: safeId, color, width: w, height: h, orient });
  }

  // Unknown type — fall back to arrowclosed
  return getMarkerSvg({ ...marker, type: 'arrowclosed' }, id);
}
