// ============================================================================
// Connection Drag Utilities
//
// Shared helpers for connection and reconnection drag operations. Used by
// both flow-handle and flow-edge directives to avoid duplicating the
// temporary SVG line, snap-to-handle, and auto-pan logic.
// ============================================================================

import type { XYPosition, Viewport, ConnectionLineProps, FlowCanvasConfig, FlowNode } from '../core/types';
import { isConnectable } from '../core/node-flags';
import type { HandleIndex } from './handle-index';
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
  svg.setAttribute('class', 'flow-connect-line');
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
 *
 * When `index` is provided (connect-drag / reconnect gestures build one on
 * pointerdown), this reads the precomputed flow-space handle centers with
 * ZERO further DOM queries or measurements. Without an index (one-shot / other
 * callers) the legacy container-wide querySelectorAll + getBoundingClientRect
 * sweep runs unchanged. The two paths are behaviorally identical — see
 * src/plugin/connection-utils.test.ts's "indexed parity" battery.
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
  index?: HandleIndex;
}): { element: HTMLElement | null; position: XYPosition } {
  if (params.connectionSnapRadius <= 0) {
    return { element: null, position: params.cursorFlowPos };
  }

  // Indexed path: flow-space handle centers are invariant under viewport pan
  // (auto-pan included) and nodes cannot move during a connect drag, so the
  // drag-start index needs no refresh — reusing it here does ZERO further DOM
  // reads. If a future feature moves nodes mid-connect-drag, the index must
  // be rebuilt (or this branch must re-measure) to stay correct.
  if (params.index) {
    const candidates = params.connectionMode === 'loose'
      ? params.index.all
      : params.index.byType(params.handleType);

    let closestElement: HTMLElement | null = null;
    let closestPos = params.cursorFlowPos;
    let minDist = params.connectionSnapRadius;

    for (const rec of candidates) {
      if (rec.nodeId === params.excludeNodeId) continue;
      if (params.targetNodeId && rec.nodeId !== params.targetNodeId) continue;

      const node = params.getNode(rec.nodeId);
      if (node && !isConnectable(node)) continue;

      // Per-handle connectable guard uses the DRAG's handleType (NOT the
      // candidate's type) — matches the legacy guard below.
      if (params.handleType === 'target' ? !rec.connectableEnd : !rec.connectableStart) continue;

      const dx = params.cursorFlowPos.x - rec.flowX;
      const dy = params.cursorFlowPos.y - rec.flowY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        minDist = dist;
        closestElement = rec.el;
        closestPos = { x: rec.flowX, y: rec.flowY };
      }
    }

    return { element: closestElement, position: closestPos };
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
      // Reactive `viewport` is frame-coalesced; setViewport updates `_viewportLive`
      // synchronously, so measure the applied delta against that (reading reactive
      // `viewport` here would always yield 0 and kill the auto-pan loop).
      const liveVp = () => canvas._viewportLive ?? canvas.viewport;
      const vpBefore = { x: liveVp().x, y: liveVp().y };
      canvas._panZoom?.setViewport({
        x: liveVp().x - dx,
        y: liveVp().y - dy,
        zoom: liveVp().zoom,
      });
      const actualDx = vpBefore.x - liveVp().x;
      const actualDy = vpBefore.y - liveVp().y;
      return actualDx === 0 && actualDy === 0;
    },
  });
  instance.updatePointer(clientX, clientY);
  instance.start();
  return instance;
}
