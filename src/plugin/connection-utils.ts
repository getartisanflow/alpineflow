// ============================================================================
// Connection Drag Utilities
//
// Shared helpers for connection and reconnection drag operations. Used by
// both flow-handle and flow-edge directives to avoid duplicating the
// temporary SVG line, snap-to-handle, and auto-pan logic.
// ============================================================================

import type { XYPosition, Viewport, ConnectionLineProps, FlowCanvasConfig, FlowNode } from '../core/types';
import { isConnectable } from '../core/node-flags';
import {
  CONNECTION_ACTIVE_COLOR,
  CONNECTION_INVALID_COLOR,
  TEMP_LINE_STROKE_WIDTH,
  TEMP_LINE_DASH_PATTERN,
} from '../core/constants';
import { getBezierPath } from '../core/edge-paths/bezier';
import { getSmoothStepPath, getStepPath } from '../core/edge-paths/smoothstep';
import { getStraightPath } from '../core/edge-paths/straight';
import { createAutoPan, type AutoPanInstance } from '../core/auto-pan';
import { HANDLE_CONNECTABLE_START_KEY, HANDLE_CONNECTABLE_END_KEY } from './directives/flow-handle-connectable';

/**
 * Updatable connection line instance returned by `createConnectionLine()`.
 * Supports preset path types (straight, bezier, smoothstep, step) and a
 * fully custom SVG renderer callback.
 */
export interface ConnectionLineInstance {
  svg: SVGSVGElement;
  update(props: Omit<ConnectionLineProps, 'connectionLineType' | 'connectionLineStyle'>): void;
  destroy(): void;
}

/**
 * Create a connection line with configurable path type, style, and optional
 * custom renderer. Returns an updatable instance whose `update()` method
 * recomputes the SVG path from new coordinates.
 */
export function createConnectionLine(config: {
  connectionLineType?: FlowCanvasConfig['connectionLineType'];
  connectionLineStyle?: FlowCanvasConfig['connectionLineStyle'];
  connectionLine?: FlowCanvasConfig['connectionLine'];
  invalid?: boolean;
  containerEl?: HTMLElement;
}): ConnectionLineInstance {
  const lineType = config.connectionLineType ?? 'straight';

  const invalidColor = config.invalid
    ? (config.containerEl
        ? getComputedStyle(config.containerEl).getPropertyValue('--flow-connection-line-invalid').trim()
        : '')
      || CONNECTION_INVALID_COLOR
    : null;

  const style = {
    stroke: invalidColor ?? config.connectionLineStyle?.stroke
      ?? ((config.containerEl ? getComputedStyle(config.containerEl).getPropertyValue('--flow-edge-stroke-selected').trim() : '') || CONNECTION_ACTIVE_COLOR),
    strokeWidth: config.connectionLineStyle?.strokeWidth ?? Number(TEMP_LINE_STROKE_WIDTH),
    strokeDasharray: config.connectionLineStyle?.strokeDasharray ?? TEMP_LINE_DASH_PATTERN,
  };

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:1000;';

  let currentChild: SVGElement | null = null;

  function update(props: Omit<ConnectionLineProps, 'connectionLineType' | 'connectionLineStyle'>): void {
    const fullProps: ConnectionLineProps = {
      ...props,
      connectionLineType: lineType,
      connectionLineStyle: style,
    };

    // Custom renderer
    if (config.connectionLine) {
      if (currentChild) {
        currentChild.remove();
      }
      currentChild = config.connectionLine(fullProps);
      svg.appendChild(currentChild);
      return;
    }

    // Preset path rendering
    if (!currentChild) {
      currentChild = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      currentChild.setAttribute('fill', 'none');
      svg.appendChild(currentChild);
    }

    currentChild.setAttribute('stroke', style.stroke);
    currentChild.setAttribute('stroke-width', String(style.strokeWidth));
    currentChild.setAttribute('stroke-dasharray', style.strokeDasharray);

    const { fromX, fromY, toX, toY } = props;
    let pathD: string;

    switch (lineType) {
      case 'bezier': {
        const result = getBezierPath({ sourceX: fromX, sourceY: fromY, targetX: toX, targetY: toY });
        pathD = result.path;
        break;
      }
      case 'smoothstep': {
        const result = getSmoothStepPath({ sourceX: fromX, sourceY: fromY, targetX: toX, targetY: toY });
        pathD = result.path;
        break;
      }
      case 'step': {
        const result = getStepPath({ sourceX: fromX, sourceY: fromY, targetX: toX, targetY: toY });
        pathD = result.path;
        break;
      }
      default: {
        const result = getStraightPath({ sourceX: fromX, sourceY: fromY, targetX: toX, targetY: toY });
        pathD = result.path;
        break;
      }
    }

    currentChild.setAttribute('d', pathD);
  }

  function destroy(): void {
    svg.remove();
  }

  return { svg, update, destroy };
}

/**
 * Find the closest connectable handle within a snap radius.
 *
 * Queries the container for all handles of the given type, skips handles on
 * the excluded node and non-connectable nodes, then returns the closest one
 * (if any) along with its flow-space position.
 */
export function findSnapTarget(params: {
  containerEl: HTMLElement;
  handleType: 'source' | 'target';
  excludeNodeId: string;
  cursorFlowPos: XYPosition;
  connectionSnapRadius: number;
  getNode: (id: string) => { connectable?: boolean; locked?: boolean } | undefined;
  toFlowPosition: (screenX: number, screenY: number) => XYPosition;
  targetNodeId?: string;
  connectionMode?: 'strict' | 'loose';
}): { element: HTMLElement | null; position: XYPosition } {
  if (params.connectionSnapRadius <= 0) {
    return { element: null, position: params.cursorFlowPos };
  }

  // In loose mode, snap to handles of any type (not just the opposite type)
  const selector = params.connectionMode === 'loose'
    ? '[data-flow-handle-type]'
    : `[data-flow-handle-type="${params.handleType}"]`;
  const handles = params.containerEl.querySelectorAll(selector);

  let closestElement: HTMLElement | null = null;
  let closestPos = params.cursorFlowPos;
  let minDist = params.connectionSnapRadius;

  handles.forEach((th) => {
    const handleEl = th as HTMLElement;
    const nodeEl = handleEl.closest('[x-flow-node]') as HTMLElement | null;
    if (!nodeEl || nodeEl.dataset.flowNodeId === params.excludeNodeId) return;

    // Optional per-node filter for multi-connect
    if (params.targetNodeId && nodeEl.dataset.flowNodeId !== params.targetNodeId) return;

    const nodeId = nodeEl.dataset.flowNodeId;
    if (nodeId) {
      const node = params.getNode(nodeId);
      if (node && !isConnectable(node)) return;
    }

    // Per-handle connectable guard
    const connectableKey = params.handleType === 'target' ? HANDLE_CONNECTABLE_END_KEY : HANDLE_CONNECTABLE_START_KEY;
    if (handleEl[connectableKey] === false) return;

    const rect = handleEl.getBoundingClientRect();
    // Hidden handles (display:none) return zero-size rects — skip them
    if (rect.width === 0 && rect.height === 0) return;
    const hPos = params.toFlowPosition(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
    const dist = Math.sqrt(
      (params.cursorFlowPos.x - hPos.x) ** 2 + (params.cursorFlowPos.y - hPos.y) ** 2,
    );

    if (dist < minDist) {
      minDist = dist;
      closestElement = handleEl;
      closestPos = hPos;
    }
  });

  return { element: closestElement, position: closestPos };
}

/**
 * Start auto-pan behavior for a connection drag. Returns the AutoPanInstance
 * (or null if auto-pan is disabled via config). The instance should be stopped
 * when the drag ends.
 */
export function startConnectionAutoPan(
  containerEl: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas: Record<string, any>,
  clientX: number,
  clientY: number,
): AutoPanInstance | null {
  if (canvas._config?.autoPanOnConnect === false) return null;

  const instance = createAutoPan({
    container: containerEl,
    speed: canvas._config?.autoPanSpeed ?? 15,
    onPan(dx: number, dy: number) {
      const vpBefore = { x: canvas.viewport.x, y: canvas.viewport.y };
      canvas._panZoom?.setViewport({
        x: canvas.viewport.x - dx,
        y: canvas.viewport.y - dy,
        zoom: canvas.viewport.zoom,
      });
      const actualDx = vpBefore.x - canvas.viewport.x;
      const actualDy = vpBefore.y - canvas.viewport.y;
      return actualDx === 0 && actualDy === 0;
    },
  });
  instance.updatePointer(clientX, clientY);
  instance.start();
  return instance;
}
