// ============================================================================
// x-flow-edge Directive
//
// Binds to an SVG <g> element and reactively updates the edge path, markers,
// labels, and selection state. Includes an invisible interaction path for
// click-to-select.
//
// Usage: <g x-flow-edge="edge"></g>
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { FlowEdge, FlowNode, HandlePosition, HandleType, Rect, Connection } from '../../core/types';
import type { MarkerType, MarkerConfig } from '../../core/markers';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../../core/geometry';
import { normalizeMarker, getMarkerId } from '../../core/markers';
import { isValidConnection } from '../../core/connections';
import { isConnectable } from '../../core/node-flags';
import { runHandleValidators, applyValidationClasses, clearValidationClasses, checkHandleLimits } from './flow-handle';
import {
  createConnectionLine,
  findSnapTarget,
  startConnectionAutoPan,
  type ConnectionLineInstance,
} from '../connection-utils';
import { CONNECTION_ACTIVE_COLOR, DEFAULT_STROKE_COLOR, DRAG_THRESHOLD, DEFAULT_RECONNECT_SNAP_RADIUS } from '../../core/constants';
import { getFloatingEdgeParams } from '../../core/floating-edge';
import { debug } from '../../core/debug';
import { toAbsoluteNode } from '../../core/sub-flow';
import { isGradient, getGradientId, upsertGradientDef, removeGradientDef } from '../../core/gradients';
import {
  getHandleCoords,
  toCardinalPosition,
  getHandleOutwardDirection,
  shortenEndpoint,
  getEdgePath,
} from '../../core/edge-utils';
import { matchesModifier } from '../../core/keyboard-shortcuts';

const BLOCKED_ATTRS = new Set(['x-data', 'x-init', 'x-bind', 'href', 'src', 'action', 'formaction', 'srcdoc']);

function resolveAnimationMode(animated: boolean | string | undefined): 'none' | 'dash' | 'pulse' | 'dot' {
  if (animated === true || animated === 'dash') return 'dash';
  if (animated === 'pulse') return 'pulse';
  if (animated === 'dot') return 'dot';
  return 'none';
}


/**
 * Infer which side a handle belongs to from its ID suffix.
 * Returns 'left' or 'right' if the ID ends with '-l' or '-r', else null.
 */
function inferSideFromHandleId(handleId: string): HandlePosition | null {
  if (handleId.endsWith('-l')) return 'left';
  if (handleId.endsWith('-r')) return 'right';
  return null;
}

/**
 * Rotate a cardinal handle position to account for node rotation.
 * Maps the handle's local outward direction through the node's rotation
 * and returns the nearest world-space cardinal direction. This ensures
 * path generators (smoothstep, bezier, etc.) route edges correctly
 * from rotated handles.
 */
function rotateHandlePos(position: HandlePosition, rotation: number | undefined): HandlePosition {
  if (!rotation) return position;

  const dir = getHandleOutwardDirection(position);
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rx = dir.x * cos - dir.y * sin;
  const ry = dir.x * sin + dir.y * cos;

  if (Math.abs(rx) > Math.abs(ry)) {
    return rx > 0 ? 'right' : 'left';
  }
  return ry > 0 ? 'bottom' : 'top';
}

/**
 * Look up a handle's declared position from the DOM.
 */
export function resolveHandlePosition(
  container: Element,
  nodeId: string,
  handleId: string | undefined,
  handleType: 'source' | 'target',
  node?: FlowNode,
): HandlePosition {
  const nodeEl = container.querySelector(`[data-flow-node-id="${CSS.escape(nodeId)}"]`);
  if (nodeEl) {
    // Try exact handle ID first
    if (handleId) {
      const handleEl = nodeEl.querySelector(`[data-flow-handle-id="${CSS.escape(handleId)}"]`);
      if (handleEl) {
        return (handleEl.getAttribute('data-flow-handle-position') as HandlePosition)
          ?? (handleType === 'source' ? 'bottom' : 'top');
      }
    }
    // If exact ID not found (e.g. condensed node), try a handle on the same
    // side inferred from the handle ID suffix ('-l' → left, '-r' → right).
    if (handleId) {
      const side = inferSideFromHandleId(handleId);
      if (side) {
        const sideEl = nodeEl.querySelector(`[data-flow-handle-position="${side}"]`);
        if (sideEl) return side;
      }
    }
    // Fall back to any handle of the same type on the node
    const fallbackEl = nodeEl.querySelector(`[data-flow-handle-type="${handleType}"]`);
    if (fallbackEl) {
      return (fallbackEl.getAttribute('data-flow-handle-position') as HandlePosition)
        ?? (handleType === 'source' ? 'bottom' : 'top');
    }
  }

  // Fall back to per-node defaults before hardcoded default
  if (node) {
    const nodeDefault = handleType === 'source' ? node.sourcePosition : node.targetPosition;
    if (nodeDefault) return nodeDefault;
  }

  return handleType === 'source' ? 'bottom' : 'top';
}

interface HandleMeasurement {
  x: number;
  y: number;
  handleWidth: number;
  handleHeight: number;
}

/**
 * Measure a handle element's actual center position in flow coordinates.
 * Converts the handle's screen position directly via the container rect
 * and viewport, so CSS transforms (e.g. rotation) are correctly accounted for.
 * Returns null if the handle element cannot be found.
 */
function measureHandleCoords(
  container: Element,
  nodeId: string,
  _node: FlowNode,
  handleId: string | undefined,
  handleType: 'source' | 'target',
  zoom: number,
  viewport: { x: number; y: number },
): HandleMeasurement | null {
  const nodeEl = container.querySelector(`[data-flow-node-id="${CSS.escape(nodeId)}"]`) as HTMLElement | null;
  if (!nodeEl) return null;

  let handleEl: HTMLElement | null = null;

  if (handleId) {
    // 1. Try exact handle ID
    handleEl = nodeEl.querySelector(`[data-flow-handle-id="${CSS.escape(handleId)}"]`);
    // 2. If not found, try a handle on the same side (for condensed nodes)
    if (!handleEl) {
      const side = inferSideFromHandleId(handleId);
      if (side) {
        handleEl = nodeEl.querySelector(`[data-flow-handle-position="${side}"]`);
      }
    }
  } else {
    // No handle ID — fall back to any handle of the same type
    handleEl = nodeEl.querySelector(`[data-flow-handle-type="${handleType}"]`);
  }
  if (!handleEl) return null;

  const handleRect = handleEl.getBoundingClientRect();

  // Hidden handles (display:none) return zero-size rects — fall back to computed position
  if (handleRect.width === 0 && handleRect.height === 0) return null;

  // Convert handle center from screen space to flow space via the container,
  // bypassing the node rect entirely. This correctly handles CSS transforms
  // (rotation, scale) because getBoundingClientRect includes transforms.
  const containerRect = container.getBoundingClientRect();
  const handleCenterX = handleRect.left + handleRect.width / 2;
  const handleCenterY = handleRect.top + handleRect.height / 2;

  return {
    x: (handleCenterX - containerRect.left - viewport.x) / zoom,
    y: (handleCenterY - containerRect.top - viewport.y) / zoom,
    handleWidth: handleRect.width / zoom,
    handleHeight: handleRect.height / zoom,
  };
}


function getPointAtPercent(pathEl: SVGPathElement, t: number): { x: number; y: number } {
  const len = pathEl.getTotalLength();
  const pt = pathEl.getPointAtLength(len * Math.max(0, Math.min(1, t)));
  return { x: pt.x, y: pt.y };
}

function isNearEndpoint(px: number, py: number, ex: number, ey: number, r: number): boolean {
  const dx = px - ex;
  const dy = py - ey;
  return Math.sqrt(dx * dx + dy * dy) <= r;
}

/** Distance from point P to line segment AB. */
function pointToSegmentDist(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.sqrt((p.x - projX) ** 2 + (p.y - projY) ** 2);
}

export function registerFlowEdgeDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-edge',
    (
      el,
      { expression },
      { evaluate, effect, cleanup },
    ) => {
      const gEl = el as unknown as SVGGElement;
      gEl.style.pointerEvents = 'auto';

      // Interaction path (wide invisible hit area for clicks)
      const interactionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      interactionPath.setAttribute('fill', 'none');
      // Use inline styles so `.flow-edges path` CSS can't override them
      interactionPath.style.stroke = 'transparent';
      interactionPath.style.strokeWidth = '20'; // initial default; updated reactively in effect()
      interactionPath.style.pointerEvents = 'stroke';
      interactionPath.style.cursor = 'pointer';
      gEl.appendChild(interactionPath);

      // Visible path
      let pathEl = el.querySelector('path:not(:first-child)') as SVGPathElement | null;
      if (!pathEl) {
        pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('fill', 'none');
        pathEl.setAttribute('stroke-width', '1.5');
        pathEl.style.pointerEvents = 'none';
        gEl.appendChild(pathEl);
      }

      // Label elements (created lazily, live in the flow-viewport as HTML overlays)
      let labelEl: HTMLDivElement | null = null;
      let labelStartEl: HTMLDivElement | null = null;
      let labelEndEl: HTMLDivElement | null = null;

      // Dot animation state
      let dotCircle: SVGCircleElement | null = null;
      let currentAnimMode: 'none' | 'dash' | 'pulse' | 'dot' = 'none';
      let currentGradientId: string | null = null;
      let currentEdgeClass: string | null = null;

      function ensureDotAnimation(dotGEl: SVGGElement, pathD: string, containerEl: Element, edge: FlowEdge, durationOverride?: string): void {
        if (!dotCircle) {
          dotCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dotCircle.classList.add('flow-edge-dot');
          dotCircle.style.pointerEvents = 'none';
          dotGEl.appendChild(dotCircle);
        }

        const flowContainer = containerEl.closest('.flow-container') as HTMLElement | null;
        const styles = flowContainer ? getComputedStyle(flowContainer) : null;
        const radius = edge.particleSize ?? (parseFloat(styles?.getPropertyValue('--flow-edge-dot-size').trim() ?? '4') || 4);
        const duration = durationOverride || styles?.getPropertyValue('--flow-edge-dot-duration').trim() || '2s';

        dotCircle.setAttribute('r', String(radius));

        if (edge.particleColor) {
          dotCircle.style.fill = edge.particleColor;
        } else {
          dotCircle.style.removeProperty('fill');
        }

        // Recreate <animateMotion> when path changes (SMIL doesn't support reactive updates)
        const existingMotion = dotCircle.querySelector('animateMotion');
        if (existingMotion) existingMotion.remove();

        const motion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        motion.setAttribute('dur', duration);
        motion.setAttribute('repeatCount', 'indefinite');
        motion.setAttribute('path', pathD);
        dotCircle.appendChild(motion);
      }

      function removeDotAnimation(): void {
        dotCircle?.remove();
        dotCircle = null;
      }

      // Cached endpoint positions (flow coordinates, before marker shortening)
      let lastSrcCoords: { x: number; y: number } | null = null;
      let lastTgtCoords: { x: number; y: number } | null = null;

      // Cached visible endpoint positions (after marker shortening)
      let lastVisibleSrcCoords: { x: number; y: number } | null = null;
      let lastVisibleTgtCoords: { x: number; y: number } | null = null;

      // ── Edge selection handler (extracted for reuse) ───────────
      const handleEdgeClick = (e: MouseEvent) => {
        e.stopPropagation();

        const edge = evaluate(expression) as FlowEdge;
        if (!edge) return;

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas) return;

        canvas._emit('edge-click', { edge, event: e });

        if (matchesModifier(e, canvas._shortcuts?.multiSelect)) {
          if (canvas.selectedEdges.has(edge.id)) {
            canvas.selectedEdges.delete(edge.id);
            edge.selected = false;
            debug('selection', `Edge "${edge.id}" deselected (shift)`);
          } else {
            canvas.selectedEdges.add(edge.id);
            edge.selected = true;
            debug('selection', `Edge "${edge.id}" selected (shift)`);
          }
        } else {
          canvas.deselectAll();
          canvas.selectedEdges.add(edge.id);
          edge.selected = true;
          debug('selection', `Edge "${edge.id}" selected`);
        }
        canvas._emitSelectionChange();
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const edge = evaluate(expression) as FlowEdge;
        if (!edge) return;

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas) return;

        const ctxTarget = e.target as SVGElement;
        if (ctxTarget.classList.contains('flow-edge-control-point')) {
          const idx = parseInt(ctxTarget.dataset.pointIndex ?? '', 10);
          if (!isNaN(idx)) {
            canvas._emit('edge-control-point-context-menu', {
              edge,
              pointIndex: idx,
              position: { x: e.clientX, y: e.clientY },
              event: e,
            });
            return;
          }
        }

        canvas._emit('edge-context-menu', { edge, event: e });
      };

      const handleDblClick = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const edge = evaluate(expression) as FlowEdge;
        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!edge || !canvas) return;

        const resolvedEdgeType = edge.type ?? canvas._config?.defaultEdgeType ?? 'bezier';
        if (resolvedEdgeType !== 'editable') return;

        const target = e.target as SVGElement;

        if (target.classList.contains('flow-edge-control-point')) {
          const idx = parseInt(target.dataset.pointIndex ?? '', 10);
          if (!isNaN(idx) && edge.controlPoints) {
            canvas._captureHistory?.();
            edge.controlPoints.splice(idx, 1);
            canvas._emit('edge-control-point-change', { edge, action: 'remove', index: idx });
          }
          return;
        }

        if (target.classList.contains('flow-edge-midpoint')) {
          const segIdx = parseInt(target.dataset.segmentIndex ?? '', 10);
          if (!isNaN(segIdx)) {
            const flowPos = canvas.screenToFlowPosition(e.clientX, e.clientY);
            if (!edge.controlPoints) edge.controlPoints = [];
            canvas._captureHistory?.();
            edge.controlPoints.splice(segIdx, 0, { x: flowPos.x, y: flowPos.y });
            canvas._emit('edge-control-point-change', { edge, action: 'add', index: segIdx });
          }
          return;
        }

        if (target.closest('path')) {
          const flowPos = canvas.screenToFlowPosition(e.clientX, e.clientY);
          if (!edge.controlPoints) edge.controlPoints = [];

          const allPts = [
            lastSrcCoords ?? { x: 0, y: 0 },
            ...edge.controlPoints,
            lastTgtCoords ?? { x: 0, y: 0 },
          ];

          let bestIdx = 0;
          let bestDist = Infinity;
          for (let i = 0; i < allPts.length - 1; i++) {
            const d = pointToSegmentDist(flowPos, allPts[i], allPts[i + 1]);
            if (d < bestDist) { bestDist = d; bestIdx = i; }
          }

          canvas._captureHistory?.();
          edge.controlPoints.splice(bestIdx, 0, { x: flowPos.x, y: flowPos.y });
          canvas._emit('edge-control-point-change', { edge, action: 'add', index: bestIdx });
        }
      };

      const handleControlPointPointerDown = (e: PointerEvent) => {
        const target = e.target as SVGElement;
        if (!target.classList.contains('flow-edge-control-point') || e.button !== 0) return;

        e.stopPropagation();
        e.preventDefault();

        const edge = evaluate(expression) as FlowEdge;
        if (!edge?.controlPoints) return;

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas) return;

        const idx = parseInt(target.dataset.pointIndex ?? '', 10);
        if (isNaN(idx)) return;

        target.classList.add('dragging');
        let hasMoved = false;

        const onMove = (me: PointerEvent) => {
          if (!hasMoved) {
            canvas._captureHistory?.();
            hasMoved = true;
          }

          let pos = canvas.screenToFlowPosition(me.clientX, me.clientY);

          const snap = canvas._config?.snapToGrid;
          if (snap) {
            pos = {
              x: Math.round(pos.x / snap[0]) * snap[0],
              y: Math.round(pos.y / snap[1]) * snap[1],
            };
          }

          edge.controlPoints![idx] = pos;
        };

        const onUp = () => {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
          target.classList.remove('dragging');
          if (hasMoved) {
            canvas._emit('edge-control-point-change', { edge, action: 'move', index: idx });
          }
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
      };

      gEl.addEventListener('contextmenu', handleContextMenu);
      gEl.addEventListener('dblclick', handleDblClick);
      gEl.addEventListener('pointerdown', handleControlPointPointerDown, true);

      // ── Pointerdown: click vs. reconnection drag ──────────────
      let activeReconnectCleanup: (() => void) | null = null;

      const handlePointerDown = (e: PointerEvent) => {
        // Only primary button
        if (e.button !== 0) return;
        e.stopPropagation();

        const edge = evaluate(expression) as FlowEdge;
        if (!edge) return;

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas) return;

        // Check if pointer is near an endpoint for reconnection
        const reconnectSnapRadius = canvas._config?.reconnectSnapRadius ?? DEFAULT_RECONNECT_SNAP_RADIUS;
        const globalReconnectable = canvas._config?.edgesReconnectable !== false;
        const edgeReconnectable = edge.reconnectable ?? true;

        let draggedEnd: HandleType | null = null;

        if (globalReconnectable && edgeReconnectable !== false && lastSrcCoords && lastTgtCoords) {
          const flowPos = canvas.screenToFlowPosition(e.clientX, e.clientY);

          // Check both handle center and visible (marker-adjusted) endpoint
          const nearSrc = isNearEndpoint(flowPos.x, flowPos.y, lastSrcCoords.x, lastSrcCoords.y, reconnectSnapRadius)
            || (lastVisibleSrcCoords && isNearEndpoint(flowPos.x, flowPos.y, lastVisibleSrcCoords.x, lastVisibleSrcCoords.y, reconnectSnapRadius));
          const nearTgt = isNearEndpoint(flowPos.x, flowPos.y, lastTgtCoords.x, lastTgtCoords.y, reconnectSnapRadius)
            || (lastVisibleTgtCoords && isNearEndpoint(flowPos.x, flowPos.y, lastVisibleTgtCoords.x, lastVisibleTgtCoords.y, reconnectSnapRadius));

          if (nearTgt && (edgeReconnectable === true || edgeReconnectable === 'target')) {
            draggedEnd = 'target';
          } else if (nearSrc && (edgeReconnectable === true || edgeReconnectable === 'source')) {
            draggedEnd = 'source';
          }
        }

        if (!draggedEnd) {
          // Not near endpoint — simple click (use pointerup-once)
          const onUp = (upE: PointerEvent) => {
            document.removeEventListener('pointerup', onUp);
            handleEdgeClick(upE as unknown as MouseEvent);
          };
          document.addEventListener('pointerup', onUp, { once: true });
          return;
        }

        // Near an endpoint — track movement for drag threshold
        const startX = e.clientX;
        const startY = e.clientY;
        let dragging = false;
        let reconnectCleanedUp = false;
        let snappedHandle: HTMLElement | null = null;
        const connectionSnapRadius = canvas._config?.connectionSnapRadius ?? 20;

        // Connection line for visual feedback
        let tempSvg: SVGSVGElement | null = null;
        let reconnectLineInstance: ConnectionLineInstance | null = null;
        let connectAutoPan: ReturnType<typeof startConnectionAutoPan> = null;
        let lastMoveX = startX;
        let lastMoveY = startY;

        const containerEl = el.closest('.flow-container') as HTMLElement;
        if (!containerEl) return;

        // Anchor = the end that stays fixed
        const anchorCoords = draggedEnd === 'target' ? lastSrcCoords! : lastTgtCoords!;

        const startReconnectionDrag = () => {
          dragging = true;

          // Dim the edge
          gEl.classList.add('flow-edge-reconnecting');

          // Emit event
          canvas._emit('reconnect-start', { edge, handleType: draggedEnd });
          debug('reconnect', `Reconnection drag started on edge "${edge.id}" (${draggedEnd} end)`);

          // Create connection line for visual feedback
          reconnectLineInstance = createConnectionLine({
            connectionLineType: canvas._config?.connectionLineType,
            connectionLineStyle: canvas._config?.connectionLineStyle,
            connectionLine: canvas._config?.connectionLine,
            containerEl: (gEl.closest('.flow-container') as HTMLElement) ?? undefined,
          });
          tempSvg = reconnectLineInstance.svg;

          const flowPos = canvas.screenToFlowPosition(startX, startY);
          reconnectLineInstance.update({
            fromX: anchorCoords.x, fromY: anchorCoords.y,
            toX: flowPos.x, toY: flowPos.y,
            source: edge.source, sourceHandle: edge.sourceHandle,
          });

          const viewportEl = containerEl.querySelector('.flow-viewport');
          if (viewportEl) {
            viewportEl.appendChild(tempSvg);
          }

          // Set pendingConnection for handle highlighting
          if (draggedEnd === 'target') {
            canvas.pendingConnection = {
              source: edge.source,
              sourceHandle: edge.sourceHandle,
              position: flowPos,
            };
          }

          // Set _pendingReconnection
          canvas._pendingReconnection = {
            edge,
            draggedEnd: draggedEnd!,
            anchorPosition: { ...anchorCoords },
            position: flowPos,
          };

          // Auto-pan
          connectAutoPan = startConnectionAutoPan(containerEl, canvas, lastMoveX, lastMoveY);

          if (draggedEnd === 'target') {
            applyValidationClasses(containerEl, edge.source, edge.sourceHandle ?? 'source', canvas, edge.id);
          }
        };

        const onPointerMove = (moveE: PointerEvent) => {
          lastMoveX = moveE.clientX;
          lastMoveY = moveE.clientY;

          if (!dragging) {
            const dist = Math.sqrt(
              (moveE.clientX - startX) ** 2 + (moveE.clientY - startY) ** 2,
            );
            if (dist >= DRAG_THRESHOLD) {
              startReconnectionDrag();
            }
            return;
          }

          // Update temp line
          const flowPos = canvas.screenToFlowPosition(moveE.clientX, moveE.clientY);

          // Connection snap: find closest handle within radius
          const snap = findSnapTarget({
            containerEl,
            handleType: draggedEnd === 'target' ? 'target' : 'source',
            excludeNodeId: draggedEnd === 'target' ? edge.source : edge.target,
            cursorFlowPos: flowPos,
            connectionSnapRadius,
            getNode: (id: string) => canvas.getNode(id),
            toFlowPosition: (sx: number, sy: number) => canvas.screenToFlowPosition(sx, sy),
          });

          if (snap.element !== snappedHandle) {
            snappedHandle?.classList.remove('flow-handle-active');
            snap.element?.classList.add('flow-handle-active');
            snappedHandle = snap.element;
          }

          reconnectLineInstance?.update({
            fromX: anchorCoords.x, fromY: anchorCoords.y,
            toX: snap.position.x, toY: snap.position.y,
            source: edge.source, sourceHandle: edge.sourceHandle,
          });

          // Update pending states
          const snapFlowPos = snap.position;
          if (draggedEnd === 'target' && canvas.pendingConnection) {
            canvas.pendingConnection = {
              ...canvas.pendingConnection,
              position: snapFlowPos,
            };
          }
          if (canvas._pendingReconnection) {
            canvas._pendingReconnection = {
              ...canvas._pendingReconnection,
              position: snapFlowPos,
            };
          }

          connectAutoPan?.updatePointer(moveE.clientX, moveE.clientY);
        };

        const cleanupReconnection = () => {
          if (reconnectCleanedUp) return;
          reconnectCleanedUp = true;

          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', onPointerUp);
          connectAutoPan?.stop();
          connectAutoPan = null;
          reconnectLineInstance?.destroy();
          reconnectLineInstance = null;
          tempSvg = null;
          snappedHandle?.classList.remove('flow-handle-active');
          activeReconnectCleanup = null;
          gEl.classList.remove('flow-edge-reconnecting');
          clearValidationClasses(containerEl);
          canvas.pendingConnection = null;
          canvas._pendingReconnection = null;
        };

        const onPointerUp = (upE: PointerEvent) => {
          if (!dragging) {
            // Below threshold — treat as click
            cleanupReconnection();
            handleEdgeClick(upE as unknown as MouseEvent);
            return;
          }

          // Use snapped handle if available, otherwise fall back to elementFromPoint
          let handleEl: HTMLElement | null = snappedHandle;
          let dropTarget: Element | null = null;
          if (!handleEl) {
            dropTarget = document.elementFromPoint(upE.clientX, upE.clientY);
            const handleSelector = draggedEnd === 'target'
              ? '[data-flow-handle-type="target"]'
              : '[data-flow-handle-type="source"]';
            handleEl = dropTarget?.closest(handleSelector) as HTMLElement | null;
          }

          // Fall back to the node element itself (for handle-less nodes like floating edges)
          const nodeEl = handleEl
            ? handleEl.closest('[data-flow-node-id]') as HTMLElement | null
            : dropTarget?.closest('[data-flow-node-id]') as HTMLElement | null;

          const dropNodeId = nodeEl?.dataset.flowNodeId;
          const dropHandleId = handleEl?.dataset.flowHandleId;
          let successful = false;

          // Guard-clause chain: each condition must pass to proceed with reconnection
          if (!dropNodeId) {
            // No drop target — snap back
          } else if ((() => { const dn = canvas.getNode(dropNodeId); return dn && !isConnectable(dn); })()) {
            // Target node is not connectable
          } else {
            const newConnection: Connection = draggedEnd === 'target'
              ? { source: edge.source, sourceHandle: edge.sourceHandle, target: dropNodeId, targetHandle: dropHandleId }
              : { source: dropNodeId, sourceHandle: dropHandleId, target: edge.target, targetHandle: edge.targetHandle };

            const otherEdges = canvas.edges.filter((e: FlowEdge) => e.id !== edge.id);

            if (!isValidConnection(newConnection, otherEdges, { preventCycles: canvas._config?.preventCycles })) {
              debug('reconnect', 'Reconnection rejected (invalid connection)');
            } else if (!checkHandleLimits(containerEl, newConnection, otherEdges)) {
              debug('reconnect', 'Reconnection rejected (handle limit)');
            } else if (!runHandleValidators(containerEl, newConnection)) {
              debug('reconnect', 'Reconnection rejected (per-handle validator)');
            } else if (canvas._config?.isValidConnection && !canvas._config.isValidConnection(newConnection)) {
              debug('reconnect', 'Reconnection rejected (custom validator)');
            } else {
              const oldEdge = { ...edge };
              canvas._captureHistory?.();

              if (draggedEnd === 'target') {
                edge.target = newConnection.target;
                edge.targetHandle = newConnection.targetHandle;
              } else {
                edge.source = newConnection.source;
                edge.sourceHandle = newConnection.sourceHandle;
              }

              successful = true;
              debug('reconnect', `Edge "${edge.id}" reconnected (${draggedEnd})`, newConnection);
              canvas._emit('reconnect', { oldEdge, newConnection });
            }
          }

          if (!successful) {
            debug('reconnect', `Edge "${edge.id}" reconnection cancelled — snapping back`);
          }

          canvas._emit('reconnect-end', { edge, successful });
          cleanupReconnection();
        };

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
        activeReconnectCleanup = cleanupReconnection;
      };

      gEl.addEventListener('pointerdown', handlePointerDown);

      // ── Hover feedback: show grab cursor near reconnectable endpoints ──
      const handlePointerMove = (e: PointerEvent) => {
        const edge = evaluate(expression) as FlowEdge;
        if (!edge) return;

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas) return;

        const globalReconnectable = canvas._config?.edgesReconnectable !== false;
        const edgeReconnectable = edge.reconnectable ?? true;

        if (!globalReconnectable || edgeReconnectable === false || !lastSrcCoords || !lastTgtCoords) {
          gEl.style.removeProperty('cursor');
          interactionPath.style.cursor = 'pointer';
          return;
        }

        const reconnectSnapRadius = canvas._config?.reconnectSnapRadius ?? DEFAULT_RECONNECT_SNAP_RADIUS;
        const flowPos = canvas.screenToFlowPosition(e.clientX, e.clientY);

        const nearSrc = (isNearEndpoint(flowPos.x, flowPos.y, lastSrcCoords.x, lastSrcCoords.y, reconnectSnapRadius)
          || (lastVisibleSrcCoords && isNearEndpoint(flowPos.x, flowPos.y, lastVisibleSrcCoords.x, lastVisibleSrcCoords.y, reconnectSnapRadius)))
          && (edgeReconnectable === true || edgeReconnectable === 'source');
        const nearTgt = (isNearEndpoint(flowPos.x, flowPos.y, lastTgtCoords.x, lastTgtCoords.y, reconnectSnapRadius)
          || (lastVisibleTgtCoords && isNearEndpoint(flowPos.x, flowPos.y, lastVisibleTgtCoords.x, lastVisibleTgtCoords.y, reconnectSnapRadius)))
          && (edgeReconnectable === true || edgeReconnectable === 'target');

        if (nearSrc || nearTgt) {
          gEl.style.cursor = 'grab';
          interactionPath.style.cursor = 'grab';
        } else {
          gEl.style.removeProperty('cursor');
          interactionPath.style.cursor = 'pointer';
        }
      };
      gEl.addEventListener('pointermove', handlePointerMove);

      // Handle selection via keyboard (Enter/Space)
      const handleEdgeKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        e.stopPropagation();

        const edge = evaluate(expression) as FlowEdge;
        if (!edge) return;
        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas) return;

        canvas._emit('edge-click', { edge, event: e });

        if (matchesModifier(e, canvas._shortcuts?.multiSelect)) {
          if (canvas.selectedEdges.has(edge.id)) {
            canvas.selectedEdges.delete(edge.id);
            edge.selected = false;
          } else {
            canvas.selectedEdges.add(edge.id);
            edge.selected = true;
          }
        } else {
          canvas.deselectAll();
          canvas.selectedEdges.add(edge.id);
          edge.selected = true;
        }
        canvas._emitSelectionChange();
      };
      gEl.addEventListener('keydown', handleEdgeKeyDown);

      // Focus-visible class for SVG (keyboard-only — skip mouse/pointer focus)
      const handleEdgeFocus = () => {
        if (gEl.matches(':focus-visible')) {
          gEl.classList.add('flow-edge-focused');
        }
      };
      const handleEdgeBlur = () => gEl.classList.remove('flow-edge-focused');
      gEl.addEventListener('focus', handleEdgeFocus);
      gEl.addEventListener('blur', handleEdgeBlur);

      // Prevent mousedown from bubbling to the container's d3-zoom handler.
      // pointerdown fires before mousedown — stopPropagation on pointerdown
      // does NOT suppress the separate mousedown event that d3-zoom listens for.
      const handleMouseDown = (e: MouseEvent) => { e.stopPropagation(); };
      gEl.addEventListener('mousedown', handleMouseDown);

      // Hover detection for label visibility (labels are separate DIV elements
      // in the viewport, not children of this <g>, so CSS :hover won't cascade)
      const handleEdgeMouseEnter = () => {
        for (const lbl of [labelEl, labelStartEl, labelEndEl]) {
          if (lbl) lbl.classList.add('flow-edge-hovered');
        }
      };
      const handleEdgeMouseLeave = () => {
        for (const lbl of [labelEl, labelStartEl, labelEndEl]) {
          if (lbl) lbl.classList.remove('flow-edge-hovered');
        }
      };
      gEl.addEventListener('mouseenter', handleEdgeMouseEnter);
      gEl.addEventListener('mouseleave', handleEdgeMouseLeave);

      effect(() => {
        const edge = evaluate(expression) as FlowEdge;
        if (!edge || !pathEl) return;

        // Tag <g> with edge ID so handle-initiated reconnection can find it
        gEl.setAttribute('data-flow-edge-id', edge.id);

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas?.nodes) return;

        // Resolve edge type using fallback: edge.type ?? canvas.defaultEdgeType ?? 'bezier'
        const resolvedEdgeType = edge.type ?? canvas._config?.defaultEdgeType ?? 'bezier';

        // Reactive dependency — bumped each frame during layout animation
        // so edges re-measure DOM handle positions while CSS transitions run.
        void canvas._layoutAnimTick;

        const rawSource = canvas.getNode(edge.source);
        const rawTarget = canvas.getNode(edge.target);
        if (!rawSource || !rawTarget) return;

        // Read sourcePosition/targetPosition to register Alpine reactive
        // dependencies so edges re-render when handle positions change.
        void rawSource.sourcePosition;
        void rawTarget.targetPosition;

        // Wrap with absolute positions so all downstream calculations use flow-space coords
        const sourceNode = toAbsoluteNode(rawSource, canvas._nodeMap, canvas._config?.nodeOrigin);
        const targetNode = toAbsoluteNode(rawTarget, canvas._nodeMap, canvas._config?.nodeOrigin);

        const container = el.closest('[x-data]') as Element;

        let sourcePos: HandlePosition;
        let targetPos: HandlePosition;
        let srcMeasurement: HandleMeasurement | null;
        let tgtMeasurement: HandleMeasurement | null;

        if (resolvedEdgeType === 'floating') {
          // ── Floating: compute endpoints from node geometry ──
          const floating = getFloatingEdgeParams(sourceNode, targetNode);
          sourcePos = floating.sourcePos;
          targetPos = floating.targetPos;

          // Synthetic zero-size measurement (no physical handle)
          srcMeasurement = { x: floating.sx, y: floating.sy, handleWidth: 0, handleHeight: 0 };
          tgtMeasurement = { x: floating.tx, y: floating.ty, handleWidth: 0, handleHeight: 0 };

          lastSrcCoords = { x: floating.sx, y: floating.sy };
          lastTgtCoords = { x: floating.tx, y: floating.ty };
        } else {
          // ── Standard: resolve from handle elements ──
          sourcePos = resolveHandlePosition(container, edge.source, edge.sourceHandle, 'source', rawSource);
          targetPos = resolveHandlePosition(container, edge.target, edge.targetHandle, 'target', rawTarget);

          // Read zoom/viewport from the raw object to avoid creating a reactive
          // dependency on viewport.zoom.  Edge paths are in flow-space and
          // scale via CSS transform — they don't need recomputation on zoom.
          const rawViewport = Alpine.raw(canvas).viewport ?? { x: 0, y: 0, zoom: 1 };
          const zoom = rawViewport.zoom || 1;

          // Track rotation so edges re-render when nodes rotate.
          // Also rotate the handle cardinal direction to world space so path
          // generators route in the correct direction from rotated handles.
          const srcRotation = rawSource.rotation;
          const tgtRotation = rawTarget.rotation;
          sourcePos = rotateHandlePos(sourcePos, srcRotation);
          targetPos = rotateHandlePos(targetPos, tgtRotation);

          srcMeasurement = measureHandleCoords(container, edge.source, sourceNode, edge.sourceHandle, 'source', zoom, rawViewport);
          tgtMeasurement = measureHandleCoords(container, edge.target, targetNode, edge.targetHandle, 'target', zoom, rawViewport);

          // Cache handle center coords for reconnection hit-detection
          const fallbackSrc = getHandleCoords(sourceNode, sourcePos, canvas._shapeRegistry, canvas._config?.nodeOrigin);
          const fallbackTgt = getHandleCoords(targetNode, targetPos, canvas._shapeRegistry, canvas._config?.nodeOrigin);
          lastSrcCoords = srcMeasurement ?? fallbackSrc;
          lastTgtCoords = tgtMeasurement ?? fallbackTgt;
        }

        // Shorten endpoints so markers sit outside the handle boundary
        const adjustedSrc = shortenEndpoint(srcMeasurement ?? lastSrcCoords!, sourcePos, srcMeasurement, edge.markerStart);
        const adjustedTgt = shortenEndpoint(tgtMeasurement ?? lastTgtCoords!, targetPos, tgtMeasurement, edge.markerEnd);

        // Cache visible endpoints for reconnection hit-detection
        lastVisibleSrcCoords = adjustedSrc;
        lastVisibleTgtCoords = adjustedTgt;

        // Compute obstacle rects for orthogonal routing (performance-gated)
        let obstacleRects: Rect[] | undefined;
        if (resolvedEdgeType === 'orthogonal' || resolvedEdgeType === 'avoidant') {
          obstacleRects = canvas.nodes
            .filter((n: FlowNode) => n.id !== edge.source && n.id !== edge.target)
            .map((n: FlowNode) => {
              const abs = toAbsoluteNode(n, canvas._nodeMap, canvas._config?.nodeOrigin);
              return {
                x: abs.position.x,
                y: abs.position.y,
                width: abs.dimensions?.width ?? DEFAULT_NODE_WIDTH,
                height: abs.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
              };
            });
        }

        const { path, labelPosition } = getEdgePath(edge, sourceNode, targetNode, sourcePos, targetPos, adjustedSrc, adjustedTgt, canvas._config?.edgeTypes, obstacleRects, canvas._shapeRegistry, canvas._config?.nodeOrigin, canvas._config?.defaultEdgeType);
        pathEl.setAttribute('d', path);
        interactionPath.setAttribute('d', path);

        // ── Editable edge control points ──────────────────────────
        const isEditable = resolvedEdgeType === 'editable';
        const showPoints = isEditable && (edge.showControlPoints || edge.selected);

        // Clear previous control point elements
        gEl.querySelectorAll('.flow-edge-control-point, .flow-edge-midpoint').forEach(cpEl => cpEl.remove());

        if (showPoints) {
          const points = edge.controlPoints ?? [];
          const zoom = canvas.viewport?.zoom ?? 1;
          const pointRadius = 6 / zoom; // counter-scale
          const midpointRadius = 5 / zoom;

          // Build full waypoint chain
          const srcPt = lastSrcCoords ?? { x: 0, y: 0 };
          const tgtPt = lastTgtCoords ?? { x: 0, y: 0 };
          const allPoints = [srcPt, ...points, tgtPt];
          const segCount = allPoints.length - 1;

          // Place midpoint ghosts on the actual SVG path curve (not linear midpoints)
          const totalLen = pathEl.getTotalLength?.() ?? 0;
          if (totalLen > 0) {
            // Find approximate path-length for each waypoint
            const waypointLens: number[] = [0];
            const sampleCount = 200;
            let wpIdx = 1;
            for (let s = 1; s <= sampleCount && wpIdx < allPoints.length; s++) {
              const len = (s / sampleCount) * totalLen;
              const pt = pathEl.getPointAtLength(len);
              const wp = allPoints[wpIdx];
              const dx = pt.x - wp.x;
              const dy = pt.y - wp.y;
              if (dx * dx + dy * dy < 25) { // within 5px
                waypointLens.push(len);
                wpIdx++;
              }
            }
            // Fill remaining if not all found
            while (waypointLens.length <= segCount) {
              waypointLens.push(totalLen);
            }

            for (let i = 0; i < segCount; i++) {
              const midLen = (waypointLens[i] + waypointLens[i + 1]) / 2;
              const pt = pathEl.getPointAtLength(midLen);
              const mid = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              mid.classList.add('flow-edge-midpoint');
              mid.setAttribute('cx', String(pt.x));
              mid.setAttribute('cy', String(pt.y));
              mid.setAttribute('r', String(midpointRadius));
              mid.dataset.segmentIndex = String(i);
              const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
              titleEl.textContent = 'Double-click to add control point';
              mid.appendChild(titleEl);
              gEl.appendChild(mid);
            }
          }

          // Render control point handles
          for (let i = 0; i < points.length; i++) {
            const cp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            cp.classList.add('flow-edge-control-point');
            cp.setAttribute('cx', String(points[i].x));
            cp.setAttribute('cy', String(points[i].y));
            cp.setAttribute('r', String(pointRadius));
            cp.dataset.pointIndex = String(i);
            gEl.appendChild(cp);
          }
        }

        // ── Editable edge cursor ──────────────────────────────────
        interactionPath.style.cursor = isEditable ? 'crosshair' : 'pointer';

        // ── Interaction width (per-edge → config default → 20) ──
        interactionPath.style.strokeWidth = String(
          edge.interactionWidth ?? canvas._config?.defaultInteractionWidth ?? 20,
        );

        // ── Markers ──────────────────────────────────────────────
        if (edge.markerStart) {
          const cfg = normalizeMarker(edge.markerStart);
          const id = getMarkerId(cfg, canvas._id);
          pathEl.setAttribute('marker-start', `url(#${id})`);
        } else {
          pathEl.removeAttribute('marker-start');
        }

        if (edge.markerEnd) {
          const cfg = normalizeMarker(edge.markerEnd);
          const id = getMarkerId(cfg, canvas._id);
          pathEl.setAttribute('marker-end', `url(#${id})`);
        } else {
          pathEl.removeAttribute('marker-end');
        }

        // ── Stroke width (inline style to override .flow-edges path CSS) ──
        const baseStrokeWidth = edge.strokeWidth ?? 1.5;

        // ── Animation mode ───────────────────────────────────────
        const mode = resolveAnimationMode(edge.animated);

        if (mode !== currentAnimMode) {
          pathEl.classList.remove('flow-edge-animated', 'flow-edge-pulse');
          if (currentAnimMode === 'dot') removeDotAnimation();
          currentAnimMode = mode;
        }

        switch (mode) {
          case 'dash':  pathEl.classList.add('flow-edge-animated'); break;
          case 'pulse': pathEl.classList.add('flow-edge-pulse'); break;
          case 'dot':   ensureDotAnimation(gEl, path, container, edge, edge.animationDuration); break;
        }

        // Per-edge animation duration override
        if (edge.animationDuration && mode !== 'none') {
          if (mode === 'dash' || mode === 'pulse') {
            pathEl.style.animationDuration = edge.animationDuration;
          }
          // Dot duration is applied inside ensureDotAnimation via the edge reference
        } else if (mode === 'dash' || mode === 'pulse') {
          pathEl.style.removeProperty('animation-duration');
        }

        // ── Custom CSS class ─────────────────────────────────────
        // Remove previous class from group if it changed.
        // edge.class may be a space-separated string of multiple tokens
        // (e.g. "flow-edge-entering flow-edge-taken") — spread into individual
        // tokens for classList operations which do not accept space-separated strings.
        if (currentEdgeClass && currentEdgeClass !== edge.class) {
          gEl.classList.remove(...currentEdgeClass.split(' ').filter(Boolean));
        }
        if (edge.class) {
          const animClass = mode === 'dash' ? ' flow-edge-animated' : mode === 'pulse' ? ' flow-edge-pulse' : '';
          pathEl.setAttribute('class', edge.class + animClass);
          // Also apply to the SVG group so edge styling can be driven at group level
          gEl.classList.add(...edge.class.split(' ').filter(Boolean));
          currentEdgeClass = edge.class;
        } else {
          // Remove edge.class from group if it was previously set but now cleared
          if (currentEdgeClass) {
            gEl.classList.remove(...currentEdgeClass.split(' ').filter(Boolean));
            currentEdgeClass = null;
          }
        }

        // ── Selection class + selected stroke styling ────────────
        gEl.setAttribute('aria-selected', String(!!edge.selected));
        if (edge.selected) {
          gEl.classList.add('flow-edge-selected');
          pathEl.style.strokeWidth = String(Math.max(baseStrokeWidth + 1, 2.5));
          pathEl.style.stroke = 'var(--flow-edge-stroke-selected, ' + CONNECTION_ACTIVE_COLOR + ')';
        } else {
          gEl.classList.remove('flow-edge-selected');
          pathEl.style.strokeWidth = String(baseStrokeWidth);

          const defsEl = canvas._markerDefsEl?.querySelector('defs') ?? null;

          if (isGradient(edge.color)) {
            // Gradient edge — create/update the <linearGradient> def
            if (defsEl) {
              const gradId = getGradientId(canvas._id, edge.id);
              const reversed = edge.gradientDirection === 'target-source';

              // Use source/target handle positions for gradient coordinates
              const sx = lastSrcCoords!.x, sy = lastSrcCoords!.y;
              const tx = lastTgtCoords!.x, ty = lastTgtCoords!.y;

              // TODO(future): Support radial gradients — check for gradient.type === 'radial'
              // and create <radialGradient> instead of <linearGradient>
              // TODO(future): Support path-following gradients — would need SVG <pattern>
              // with a gradient texture applied along the path curve
              upsertGradientDef(
                defsEl,
                gradId,
                reversed ? { from: edge.color.to, to: edge.color.from } : edge.color,
                sx, sy, tx, ty,
              );

              pathEl.style.stroke = `url(#${gradId})`;
              currentGradientId = gradId;
            }
          } else if (edge.color) {
            // Solid color — remove gradient if previously was gradient
            if (currentGradientId) {
              const defsForRemove = defsEl;
              if (defsForRemove) removeGradientDef(defsForRemove, currentGradientId);
              currentGradientId = null;
            }
            pathEl.style.stroke = edge.color;
          } else {
            // No color — remove gradient if present, clear inline stroke so CSS classes apply
            if (currentGradientId) {
              const defsForRemove = defsEl;
              if (defsForRemove) removeGradientDef(defsForRemove, currentGradientId);
              currentGradientId = null;
            }
            pathEl.style.removeProperty('stroke');
          }
        }

        // ── Row-highlight: highlight edges connected to selected rows ──
        const rowHighlighted = canvas.selectedRows?.size > 0 && !edge.selected && (
          (edge.sourceHandle && canvas.selectedRows.has(edge.sourceHandle.replace(/-[lr]$/, ''))) ||
          (edge.targetHandle && canvas.selectedRows.has(edge.targetHandle.replace(/-[lr]$/, '')))
        );

        if (rowHighlighted) {
          gEl.classList.add('flow-edge-row-highlighted');
          if (!edge.selected) {
            pathEl.style.strokeWidth = String(Math.max(baseStrokeWidth + 0.5, 2));
            pathEl.style.stroke = getComputedStyle(gEl.closest('.flow-container') as Element)
              .getPropertyValue('--flow-edge-row-highlight-color').trim() || '#3b82f6';
          }
        } else {
          gEl.classList.remove('flow-edge-row-highlighted');
        }

        // ── Keyboard focusability ────────────────────────────────
        const edgeFocusable = edge.focusable ?? (canvas._config?.edgesFocusable !== false);
        if (edgeFocusable) {
          gEl.setAttribute('tabindex', '0');
          gEl.setAttribute('role', edge.ariaRole ?? 'group');
          gEl.setAttribute('aria-label', edge.ariaLabel ?? (edge.label ? `Edge: ${edge.label}` : `Edge from ${edge.source} to ${edge.target}`));
        } else {
          gEl.removeAttribute('tabindex');
          gEl.removeAttribute('role');
          gEl.removeAttribute('aria-label');
        }

        // Custom DOM attributes
        if (edge.domAttributes) {
          for (const [key, val] of Object.entries(edge.domAttributes)) {
            if (key.startsWith('on') || BLOCKED_ATTRS.has(key.toLowerCase())) continue;
            gEl.setAttribute(key, val);
          }
        }

        // ── Labels ───────────────────────────────────────────────
        const ensureLabel = (
          existing: HTMLDivElement | null,
          text: string | undefined,
          cssClass: string,
          viewport: Element | null,
          edgeId: string,
        ): HTMLDivElement | null => {
          if (text) {
            // If closure lost reference (e.g., directive re-init), reclaim from DOM
            if (!existing && viewport) {
              const isStart = cssClass.includes('flow-edge-label-start');
              const isEnd = cssClass.includes('flow-edge-label-end');
              let selector = `[data-flow-edge-id="${edgeId}"].flow-edge-label`;
              if (isStart) selector += '.flow-edge-label-start';
              else if (isEnd) selector += '.flow-edge-label-end';
              else selector += ':not(.flow-edge-label-start):not(.flow-edge-label-end)';
              existing = viewport.querySelector(selector) as HTMLDivElement | null;
            }
            if (!existing) {
              existing = document.createElement('div');
              existing.className = cssClass;
              existing.dataset.flowEdgeId = edgeId;
              if (viewport) viewport.appendChild(existing);
            }
            existing.textContent = text;
            return existing;
          }
          if (existing) { existing.remove(); }
          return null;
        };

        const viewport = el.closest('.flow-viewport');
        const labelVis = edge.labelVisibility ?? 'always';

        // Center label (uses labelPosition percentage or default midpoint)
        labelEl = ensureLabel(labelEl, edge.label, 'flow-edge-label', viewport, edge.id);
        if (labelEl) {
          if (pathEl.getTotalLength?.()) {
            const t = edge.labelPosition ?? 0.5;
            const pt = getPointAtPercent(pathEl, t);
            labelEl.style.left = `${pt.x}px`;
            labelEl.style.top = `${pt.y}px`;
          } else {
            labelEl.style.left = `${labelPosition.x}px`;
            labelEl.style.top = `${labelPosition.y}px`;
          }
        }

        // Start label (fixed pixel offset from source end)
        labelStartEl = ensureLabel(labelStartEl, edge.labelStart, 'flow-edge-label flow-edge-label-start', viewport, edge.id);
        if (labelStartEl) {
          if (pathEl.getTotalLength?.()) {
            const len = pathEl.getTotalLength();
            const offset = edge.labelStartOffset ?? 30;
            const pt = pathEl.getPointAtLength(Math.min(offset, len / 2));
            labelStartEl.style.left = `${pt.x}px`;
            labelStartEl.style.top = `${pt.y}px`;
          }
        }

        // End label (fixed pixel offset from target end)
        labelEndEl = ensureLabel(labelEndEl, edge.labelEnd, 'flow-edge-label flow-edge-label-end', viewport, edge.id);
        if (labelEndEl) {
          if (pathEl.getTotalLength?.()) {
            const len = pathEl.getTotalLength();
            const offset = edge.labelEndOffset ?? 30;
            const pt = pathEl.getPointAtLength(Math.max(len - offset, len / 2));
            labelEndEl.style.left = `${pt.x}px`;
            labelEndEl.style.top = `${pt.y}px`;
          }
        }

        // Apply label visibility classes and custom edge class
        for (const lbl of [labelEl, labelStartEl, labelEndEl]) {
          if (!lbl) continue;
          lbl.classList.toggle('flow-edge-label-hover', labelVis === 'hover');
          lbl.classList.toggle('flow-edge-label-on-select', labelVis === 'selected');
          lbl.classList.toggle('flow-edge-label-selected', !!edge.selected);
          // Forward edge.class to label so label styling can track edge state
          if (edge.class) {
            lbl.classList.add(edge.class);
          } else if (currentEdgeClass) {
            lbl.classList.remove(currentEdgeClass);
          }
        }
      });

      cleanup(() => {
        // Remove gradient def if this edge had one
        if (currentGradientId) {
          const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
          const defsEl = canvas?._markerDefsEl?.querySelector('defs');
          if (defsEl) removeGradientDef(defsEl, currentGradientId);
        }

        activeReconnectCleanup?.();
        removeDotAnimation();
        gEl.removeEventListener('contextmenu', handleContextMenu);
        gEl.removeEventListener('dblclick', handleDblClick);
        gEl.removeEventListener('pointerdown', handleControlPointPointerDown, true);
        gEl.removeEventListener('pointerdown', handlePointerDown);
        gEl.removeEventListener('pointermove', handlePointerMove);
        gEl.removeEventListener('keydown', handleEdgeKeyDown);
        gEl.removeEventListener('focus', handleEdgeFocus);
        gEl.removeEventListener('blur', handleEdgeBlur);
        gEl.removeEventListener('mousedown', handleMouseDown);
        gEl.removeEventListener('mouseenter', handleEdgeMouseEnter);
        gEl.removeEventListener('mouseleave', handleEdgeMouseLeave);
        labelEl?.remove();
        labelStartEl?.remove();
        labelEndEl?.remove();
      });
    },
  );
}
