// ============================================================================
// Drag Controller
//
// Wraps d3-drag for node dragging. Reworked from @xyflow/system XYDrag
// (MIT License, Copyright 2019-2025 webkid GmbH) to use callbacks instead of
// store mutations. Calculates snapped positions and multi-selection drag.
// ============================================================================

import { drag, type DragBehavior } from 'd3-drag';
import { select, type Selection } from 'd3-selection';
import type { XYPosition, Viewport } from './types';

export interface DragOptions {
  /** Called when a drag gesture starts */
  onDragStart?: (event: DragStartEvent) => void;
  /** Called during dragging with the new position */
  onDrag?: (event: DragMoveEvent) => void;
  /** Called when a drag gesture ends */
  onDragEnd?: (event: DragEndEvent) => void;
  /** Get the current viewport for coordinate conversion */
  getViewport: () => Viewport;
  /** Get the current node position in flow coordinates (for offset-preserving drag) */
  getNodePosition: () => XYPosition;
  /** Snap to grid: false or [gridX, gridY] */
  snapToGrid?: false | [number, number];
  /** CSS selector to restrict drag initiation. At event time, the dragged
   *  element is queried for a descendant matching this selector; if found,
   *  only pointer events originating within that descendant start a drag.
   *  When no match exists the drag is unrestricted (whole element). */
  filterSelector?: string;
  /** Fixed container for d3 pointer coordinates (prevents viewport transform from affecting drag) */
  container?: HTMLElement;
  /** Return true to block drag initiation (e.g. during animation lock). */
  isLocked?: () => boolean;
  /** CSS class name that prevents drag when on or inside event target. */
  noDragClassName?: string;
  /** Minimum pixel distance before drag starts. Default: 0 */
  dragThreshold?: number;
}

export interface DragStartEvent {
  nodeId: string;
  position: XYPosition;
  sourceEvent: MouseEvent | TouchEvent;
}

export interface DragMoveEvent {
  nodeId: string;
  position: XYPosition;
  delta: XYPosition;
  sourceEvent: MouseEvent | TouchEvent;
}

export interface DragEndEvent {
  nodeId: string;
  position: XYPosition;
  sourceEvent: MouseEvent | TouchEvent;
}

export interface DragInstance {
  /** Clean up d3 drag listeners */
  destroy(): void;
}

/**
 * Snap a position to the nearest grid point.
 */
function snapPosition(position: XYPosition, grid: [number, number]): XYPosition {
  return {
    x: grid[0] * Math.round(position.x / grid[0]),
    y: grid[1] * Math.round(position.y / grid[1]),
  };
}

/**
 * Make a node element draggable.
 *
 * @example
 * ```ts
 * const dragger = createDrag(nodeEl, 'node-1', {
 *   getViewport: () => canvas.viewport,
 *   getNodePosition: () => canvas.getNode('node-1').position,
 *   onDrag: ({ nodeId, position }) => {
 *     canvas.getNode(nodeId).position = position;
 *   },
 * });
 * ```
 */
export function createDrag(
  element: HTMLElement,
  nodeId: string,
  options: DragOptions,
): DragInstance {
  const { onDragStart, onDrag, onDragEnd, getViewport, getNodePosition, snapToGrid = false, filterSelector, container, isLocked, noDragClassName, dragThreshold = 0 } = options;

  let startPosition: XYPosition = { x: 0, y: 0 };

  /** Convert a d3 drag event position to flow coordinates. */
  function eventToFlowPosition(event: { x: number; y: number }): XYPosition {
    const viewport = getViewport();
    return {
      x: (event.x - viewport.x) / viewport.zoom,
      y: (event.y - viewport.y) / viewport.zoom,
    };
  }

  const sel: Selection<HTMLElement, unknown, null, undefined> = select(element);

  const dragBehavior: DragBehavior<HTMLElement, unknown, unknown> = drag<HTMLElement, unknown>()
    // Tell d3 where the dragged element actually is (in screen coordinates)
    // so the node doesn't jump to the cursor on click.
    .subject(() => {
      const viewport = getViewport();
      const nodePos = getNodePosition();
      return {
        x: nodePos.x * viewport.zoom + viewport.x,
        y: nodePos.y * viewport.zoom + viewport.y,
      };
    })
    .on('start', (event) => {
      startPosition = eventToFlowPosition(event);
      onDragStart?.({ nodeId, position: startPosition, sourceEvent: event.sourceEvent });
    })
    .on('drag', (event) => {
      let position = eventToFlowPosition(event);

      if (snapToGrid) {
        position = snapPosition(position, snapToGrid);
      }

      const delta: XYPosition = {
        x: position.x - startPosition.x,
        y: position.y - startPosition.y,
      };

      onDrag?.({ nodeId, position, delta, sourceEvent: event.sourceEvent });
    })
    .on('end', (event) => {
      let position = eventToFlowPosition(event);

      if (snapToGrid) {
        position = snapPosition(position, snapToGrid);
      }

      onDragEnd?.({ nodeId, position, sourceEvent: event.sourceEvent });
    });

  if (container) {
    dragBehavior.container(() => container);
  }

  if (dragThreshold > 0) {
    dragBehavior.clickDistance(dragThreshold);
  }

  dragBehavior.filter((event: any) => {
    if (isLocked?.()) return false;
    if (noDragClassName && (event.target as HTMLElement)?.closest?.('.' + noDragClassName)) return false;
    if (filterSelector) {
      const handle = element.querySelector(filterSelector);
      return handle ? handle.contains(event.target as Node) : true;
    }
    return true;
  });

  sel.call(dragBehavior);

  return {
    destroy() {
      sel.on('.drag', null);
    },
  };
}
