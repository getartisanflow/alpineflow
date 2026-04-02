// ============================================================================
// Child Layout Computation
//
// Pure functions for arranging children within a layout parent.
// Computes positions, optional dimension overrides, and parent auto-size.
// No DOM or Alpine dependencies — works with plain FlowNode objects.
// ============================================================================

import type { FlowNode, ChildLayout, XYPosition, Dimensions } from './types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from './geometry';

/** Default gap between children in px. */
const DEFAULT_GAP = 8;

/** Default padding inside the parent in px. */
const DEFAULT_PADDING = 12;

/** Default grid columns. */
const DEFAULT_COLUMNS = 2;

/** Result of a child layout computation. */
export interface ChildLayoutResult {
  /** New positions for each child (relative to parent). */
  positions: Map<string, XYPosition>;
  /** Dimension overrides for stretched children. Only populated when stretch applies. */
  dimensions: Map<string, Dimensions>;
  /** Computed parent dimensions to fit all children. */
  parentDimensions: Dimensions;
}

/** Get the effective dimensions of a node, falling back to defaults. */
function getNodeDims(node: FlowNode): Dimensions {
  return {
    width: node.dimensions?.width ?? DEFAULT_NODE_WIDTH,
    height: node.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
  };
}

/** Resolve the default stretch mode for a direction. */
function resolveStretch(config: ChildLayout): 'none' | 'width' | 'height' | 'both' {
  if (config.stretch) return config.stretch;
  switch (config.direction) {
    case 'vertical': return 'width';
    case 'horizontal': return 'height';
    case 'grid': return 'both';
  }
}

/** Sort children by order (then array index as tiebreaker). */
function sortByOrder(children: FlowNode[]): FlowNode[] {
  return [...children].sort((a, b) => {
    const oa = a.order ?? Infinity;
    const ob = b.order ?? Infinity;
    if (oa !== ob) return oa - ob;
    return 0; // preserve insertion order (stable sort)
  });
}

/**
 * Compute child positions, dimension overrides, and parent auto-size
 * for a layout parent. Pure function — does not mutate any nodes.
 *
 * @param availableSize - When the parent has been externally sized (e.g. stretched
 *   by its own parent), children stretch to fill this space instead of just maxW/maxH.
 */
export function computeChildLayout(
  children: FlowNode[],
  config: ChildLayout,
  availableSize?: Dimensions,
): ChildLayoutResult {
  const gap = config.gap ?? DEFAULT_GAP;
  const padding = config.padding ?? DEFAULT_PADDING;
  const headerHeight = config.headerHeight ?? 0;
  const stretch = resolveStretch(config);
  const sorted = sortByOrder(children);

  const positions = new Map<string, XYPosition>();
  const dimensions = new Map<string, Dimensions>();

  if (sorted.length === 0) {
    // When externally sized (stretched by parent), retain that size even
    // when empty. Otherwise fall back to minimal padding-only dimensions.
    return {
      positions,
      dimensions,
      parentDimensions: availableSize
        ? { width: availableSize.width, height: availableSize.height }
        : { width: padding * 2, height: padding * 2 + headerHeight },
    };
  }

  // Available inner space when parent has been externally sized
  const innerW = availableSize ? availableSize.width - padding * 2 : 0;
  const innerH = availableSize ? availableSize.height - padding * 2 - headerHeight : 0;

  if (config.direction === 'vertical') {
    return layoutVertical(sorted, gap, padding, headerHeight, stretch, innerW, positions, dimensions);
  } else if (config.direction === 'horizontal') {
    return layoutHorizontal(sorted, gap, padding, headerHeight, stretch, innerH, positions, dimensions);
  } else {
    return layoutGrid(sorted, gap, padding, headerHeight, stretch, config.columns ?? DEFAULT_COLUMNS, innerW, innerH, positions, dimensions);
  }
}

function layoutVertical(
  sorted: FlowNode[],
  gap: number,
  padding: number,
  headerHeight: number,
  stretch: string,
  availableInnerW: number,
  positions: Map<string, XYPosition>,
  dimensions: Map<string, Dimensions>,
): ChildLayoutResult {
  let maxW = 0;
  const dims = sorted.map(n => getNodeDims(n));
  for (const d of dims) maxW = Math.max(maxW, d.width);
  // When parent provides available space, use it as the stretch target
  // (both expanding small children AND constraining oversized ones).
  // When no available space, use the widest child as the stretch target.
  const stretchW = availableInnerW > 0 ? availableInnerW : maxW;

  let y = padding + headerHeight;
  for (let i = 0; i < sorted.length; i++) {
    const node = sorted[i];
    const d = dims[i];
    positions.set(node.id, { x: padding, y });

    if (stretch === 'width' || stretch === 'both') {
      dimensions.set(node.id, { width: stretchW, height: d.height });
    }

    y += d.height + gap;
  }
  y -= gap;
  y += padding;

  return {
    positions,
    dimensions,
    parentDimensions: { width: stretchW + padding * 2, height: y },
  };
}

function layoutHorizontal(
  sorted: FlowNode[],
  gap: number,
  padding: number,
  headerHeight: number,
  stretch: string,
  availableInnerH: number,
  positions: Map<string, XYPosition>,
  dimensions: Map<string, Dimensions>,
): ChildLayoutResult {
  let maxH = 0;
  const dims = sorted.map(n => getNodeDims(n));
  for (const d of dims) maxH = Math.max(maxH, d.height);
  const stretchH = availableInnerH > 0 ? availableInnerH : maxH;

  let x = padding;
  for (let i = 0; i < sorted.length; i++) {
    const node = sorted[i];
    const d = dims[i];
    positions.set(node.id, { x, y: padding + headerHeight });

    if (stretch === 'height' || stretch === 'both') {
      dimensions.set(node.id, { width: d.width, height: stretchH });
    }

    x += d.width + gap;
  }
  x -= gap;
  x += padding;

  return {
    positions,
    dimensions,
    parentDimensions: { width: x, height: stretchH + padding * 2 + headerHeight },
  };
}

function layoutGrid(
  sorted: FlowNode[],
  gap: number,
  padding: number,
  headerHeight: number,
  stretch: string,
  configColumns: number,
  availableInnerW: number,
  availableInnerH: number,
  positions: Map<string, XYPosition>,
  dimensions: Map<string, Dimensions>,
): ChildLayoutResult {
  // Clamp columns to actual child count — more columns than children
  // creates empty cells and wastes space.
  const columns = Math.min(configColumns, sorted.length);
  const dims = sorted.map(n => getNodeDims(n));

  let cellW = 0;
  let cellH = 0;
  for (const d of dims) {
    cellW = Math.max(cellW, d.width);
    cellH = Math.max(cellH, d.height);
  }

  // Use available space if parent was externally sized (both expand and constrain)
  const availCellW = availableInnerW > 0 ? (availableInnerW - (columns - 1) * gap) / columns : 0;
  if (availCellW > 0) cellW = availCellW;
  const rows = Math.ceil(sorted.length / columns);
  const availCellH = availableInnerH > 0 ? (availableInnerH - (rows - 1) * gap) / rows : 0;
  if (availCellH > 0) cellH = availCellH;

  for (let i = 0; i < sorted.length; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = padding + col * (cellW + gap);
    const y = padding + headerHeight + row * (cellH + gap);
    positions.set(sorted[i].id, { x, y });

    if (stretch === 'both') {
      dimensions.set(sorted[i].id, { width: cellW, height: cellH });
    } else if (stretch === 'width') {
      dimensions.set(sorted[i].id, { width: cellW, height: dims[i].height });
    } else if (stretch === 'height') {
      dimensions.set(sorted[i].id, { width: dims[i].width, height: cellH });
    }
  }

  return {
    positions,
    dimensions,
    parentDimensions: {
      width: columns * cellW + (columns - 1) * gap + padding * 2,
      height: rows * cellH + (rows - 1) * gap + padding * 2 + headerHeight,
    },
  };
}
