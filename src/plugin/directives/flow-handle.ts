// ============================================================================
// x-flow-handle Directive
//
// Marks an element as a connection handle (source or target).
// Source handles support drag-to-connect: drag from a source to a target
// handle to create a new edge. Respects per-node `connectable` flag.
//
// Usage:
//   <div x-flow-handle:source></div>           — source handle (bottom, default)
//   <div x-flow-handle:target></div>           — target handle (top, default)
//   <div x-flow-handle:source.right></div>     — source on the right side
//   <div x-flow-handle:target.top.left="tl"></div> — target at top-left, id="tl"
//   <div x-flow-handle:source="{ id: 'h1', position: node.data.sourcePos }"></div>
//                                               — dynamic position via object expression
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { HandleType, HandlePosition, FlowEdge, FlowNode, Connection, XYPosition } from '../../core/types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../../core/geometry';
import { isValidConnection } from '../../core/connections';
import { debug } from '../../core/debug';
import { HANDLE_VALIDATE_KEY } from './flow-handle-validate';
import { HANDLE_LIMIT_KEY } from './flow-handle-limit';
import { HANDLE_CONNECTABLE_START_KEY, HANDLE_CONNECTABLE_END_KEY } from './flow-handle-connectable';
import { DRAG_THRESHOLD, CONNECTION_ACTIVE_COLOR, CONNECTION_INVALID_COLOR } from '../../core/constants';
import { createConnectionLine, findSnapTarget, startConnectionAutoPan, type ConnectionLineInstance } from '../connection-utils';
import { isConnectable } from '../../core/node-flags';

let edgeIdCounter = 0;

/**
 * Run per-handle validators for a connection.
 * Looks up source and target handle elements by node ID and handle ID,
 * reads the expando validator, and calls it. Returns false if either rejects.
 */
export function runHandleValidators(
  containerEl: HTMLElement,
  connection: Connection,
): boolean {
  // Source handle validator
  const sourceNodeEl = containerEl.querySelector(
    `[data-flow-node-id="${CSS.escape(connection.source)}"]`,
  );
  if (sourceNodeEl) {
    const sourceHandleEl = sourceNodeEl.querySelector(
      `[data-flow-handle-id="${CSS.escape(connection.sourceHandle ?? 'source')}"]`,
    ) as HTMLElement | null;
    if (sourceHandleEl?.[HANDLE_VALIDATE_KEY]) {
      if (!sourceHandleEl[HANDLE_VALIDATE_KEY]!(connection)) return false;
    }
  }

  // Target handle validator
  const targetNodeEl = containerEl.querySelector(
    `[data-flow-node-id="${CSS.escape(connection.target)}"]`,
  );
  if (targetNodeEl) {
    const targetHandleEl = targetNodeEl.querySelector(
      `[data-flow-handle-id="${CSS.escape(connection.targetHandle ?? 'target')}"]`,
    ) as HTMLElement | null;
    if (targetHandleEl?.[HANDLE_VALIDATE_KEY]) {
      if (!targetHandleEl[HANDLE_VALIDATE_KEY]!(connection)) return false;
    }
  }

  return true;
}

/**
 * Check connection limits on source and target handles.
 * Counts existing edges matching each handle and rejects if at/over the limit.
 */
export function checkHandleLimits(
  containerEl: HTMLElement,
  connection: Connection,
  edges: { source: string; target: string; sourceHandle?: string; targetHandle?: string }[],
): boolean {
  // Source handle limit
  const sourceNodeEl = containerEl.querySelector(
    `[data-flow-node-id="${CSS.escape(connection.source)}"]`,
  );
  if (sourceNodeEl) {
    const sourceHandleEl = sourceNodeEl.querySelector(
      `[data-flow-handle-id="${CSS.escape(connection.sourceHandle ?? 'source')}"]`,
    ) as HTMLElement | null;
    if (sourceHandleEl?.[HANDLE_LIMIT_KEY]) {
      const count = edges.filter(
        e => e.source === connection.source && (e.sourceHandle ?? 'source') === (connection.sourceHandle ?? 'source'),
      ).length;
      if (count >= sourceHandleEl[HANDLE_LIMIT_KEY]!) return false;
    }
  }

  // Target handle limit
  const targetNodeEl = containerEl.querySelector(
    `[data-flow-node-id="${CSS.escape(connection.target)}"]`,
  );
  if (targetNodeEl) {
    const targetHandleEl = targetNodeEl.querySelector(
      `[data-flow-handle-id="${CSS.escape(connection.targetHandle ?? 'target')}"]`,
    ) as HTMLElement | null;
    if (targetHandleEl?.[HANDLE_LIMIT_KEY]) {
      const count = edges.filter(
        e => e.target === connection.target && (e.targetHandle ?? 'target') === (connection.targetHandle ?? 'target'),
      ).length;
      if (count >= targetHandleEl[HANDLE_LIMIT_KEY]!) return false;
    }
  }

  return true;
}

/**
 * Apply .flow-handle-valid / .flow-handle-invalid classes to all target handles
 * in the container based on the validation chain for a hypothetical connection
 * from the given source.
 */
export function applyValidationClasses(
  containerEl: HTMLElement,
  sourceNodeId: string,
  sourceHandleId: string,
  canvas: any,
  excludeEdgeId?: string,
): void {
  const edges = excludeEdgeId
    ? (canvas.edges as FlowEdge[]).filter(e => e.id !== excludeEdgeId)
    : canvas.edges;
  const targetHandles = containerEl.querySelectorAll('[data-flow-handle-type="target"]');
  for (const targetEl of targetHandles) {
    const targetNodeEl = targetEl.closest('[x-flow-node]') as HTMLElement | null;
    const targetNodeId = targetNodeEl?.dataset.flowNodeId;
    if (!targetNodeId) continue;

    const targetHandleId = (targetEl as HTMLElement).dataset.flowHandleId ?? 'target';

    // Per-handle connectable guard
    if ((targetEl as HTMLElement)[HANDLE_CONNECTABLE_END_KEY] === false) {
      (targetEl as HTMLElement).classList.add('flow-handle-invalid');
      (targetEl as HTMLElement).classList.remove('flow-handle-valid', 'flow-handle-limit-reached');
      continue;
    }

    const connection = {
      source: sourceNodeId,
      sourceHandle: sourceHandleId,
      target: targetNodeId,
      targetHandle: targetHandleId,
    };

    // Run full validation chain
    const targetNode = canvas.getNode(targetNodeId);
    const builtInValid = targetNode?.connectable !== false
      && isValidConnection(connection, edges, { preventCycles: canvas._config?.preventCycles });
    const limitValid = builtInValid && checkHandleLimits(containerEl, connection, edges);
    const handleValid = limitValid && runHandleValidators(containerEl, connection);
    const globalValid = handleValid
      && (!canvas._config?.isValidConnection || canvas._config.isValidConnection(connection));

    if (globalValid) {
      (targetEl as HTMLElement).classList.add('flow-handle-valid');
      (targetEl as HTMLElement).classList.remove('flow-handle-invalid', 'flow-handle-limit-reached');
    } else {
      (targetEl as HTMLElement).classList.add('flow-handle-invalid');
      (targetEl as HTMLElement).classList.remove('flow-handle-valid');
      // Add limit-reached modifier when the rejection is due to the connection limit
      if (builtInValid && !limitValid) {
        (targetEl as HTMLElement).classList.add('flow-handle-limit-reached');
      } else {
        (targetEl as HTMLElement).classList.remove('flow-handle-limit-reached');
      }
    }
  }
}

/**
 * Remove .flow-handle-valid / .flow-handle-invalid from all target handles.
 */
export function clearValidationClasses(containerEl: HTMLElement): void {
  const targetHandles = containerEl.querySelectorAll('[data-flow-handle-type="target"]');
  for (const targetEl of targetHandles) {
    (targetEl as HTMLElement).classList.remove('flow-handle-valid', 'flow-handle-invalid', 'flow-handle-limit-reached');
  }
}

export function registerFlowHandleDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-handle',
    (
      el,
      { value, modifiers, expression },
      { evaluate, effect, cleanup },
    ) => {
      const type: HandleType = value === 'source' ? 'source' : 'target';

      // Position priority: compound modifier > single modifier > data attribute > node default > default
      const hasTop = modifiers.includes('top');
      const hasBottom = modifiers.includes('bottom');
      const hasLeft = modifiers.includes('left');
      const hasRight = modifiers.includes('right');
      const hasExplicitModifier = hasTop || hasBottom || hasLeft || hasRight;

      let position: HandlePosition;
      if (hasTop && hasLeft) position = 'top-left';
      else if (hasTop && hasRight) position = 'top-right';
      else if (hasBottom && hasLeft) position = 'bottom-left';
      else if (hasBottom && hasRight) position = 'bottom-right';
      else if (hasTop) position = 'top';
      else if (hasRight) position = 'right';
      else if (hasBottom) position = 'bottom';
      else if (hasLeft) position = 'left';
      else position = (el.getAttribute('data-flow-handle-position') as HandlePosition)
        ?? (type === 'source' ? 'bottom' : 'top');

      // Handle ID priority: expression > pre-existing data attribute > type
      // Expression can be a string (handle ID) or an object { id?, position? }
      let handleId: string;
      let expressionHasPosition = false;

      if (expression) {
        const evaluated = evaluate(expression);
        if (evaluated && typeof evaluated === 'object' && !Array.isArray(evaluated)) {
          // Object expression: { id?: string, position?: HandlePosition }
          handleId = evaluated.id || el.getAttribute('data-flow-handle-id') || type;
          if (evaluated.position) {
            position = evaluated.position;
            expressionHasPosition = true;
          }
        } else {
          handleId = evaluated || el.getAttribute('data-flow-handle-id') || type;
        }
      } else {
        handleId = el.getAttribute('data-flow-handle-id') || type;
      }

      // Hide individual handle via .hidden modifier
      if (modifiers.includes('hidden')) {
        el.style.display = 'none';
      }

      // Store handle metadata on the element for measurement
      el.dataset.flowHandleType = type;
      el.dataset.flowHandlePosition = position;
      el.dataset.flowHandleId = handleId;

      // Mark handles with explicit modifiers so layout algorithms skip them
      if (hasExplicitModifier) {
        el.dataset.flowHandleExplicit = 'true';
      }

      // Reactively update position from object expression when it has a position property
      if (expressionHasPosition && expression) {
        el.dataset.flowHandleExplicit = 'true';
        effect(() => {
          const evaluated = evaluate(expression);
          if (evaluated && typeof evaluated === 'object' && !Array.isArray(evaluated) && evaluated.position) {
            el.dataset.flowHandlePosition = evaluated.position;
          }
        });
      }

      // When no explicit modifier and no expression-based position, reactively inherit from node.sourcePosition/targetPosition
      if (!hasExplicitModifier && !expressionHasPosition) {
        const getNodeData = (): FlowNode | undefined => {
          const nodeEl = el.closest('[x-flow-node]') as HTMLElement | null;
          const nodeId = nodeEl?.dataset.flowNodeId;
          if (!nodeId) return undefined;
          const canvasEl = el.closest('[x-data]') as HTMLElement | null;
          if (!canvasEl) return undefined;
          const canvas = Alpine.$data(canvasEl);
          return canvas?.getNode?.(nodeId);
        };

        effect(() => {
          const node = getNodeData();
          if (!node) return;
          const nodeDefault = type === 'source' ? node.sourcePosition : node.targetPosition;
          if (nodeDefault) {
            el.dataset.flowHandlePosition = nodeDefault;
          }
        });
      }

      // Add base styling hook
      el.classList.add('flow-handle', `flow-handle-${type}`);

      // Find the parent node element to get the node ID
      const getNodeId = (): string | null => {
        const nodeEl = el.closest('[x-flow-node]');
        if (!nodeEl) return null;
        // The node ID is stored by x-flow-node on the element
        return nodeEl.getAttribute('data-flow-node-id') ?? null;
      };

      const getCanvas = () => {
        const canvasEl = el.closest('[x-data]') as HTMLElement | null;
        return canvasEl ? Alpine.$data(canvasEl) : null;
      };

      if (type === 'source') {
        // ── Source handle: initiate drag-to-connect ──────────────────
        let activeConnectionCleanup: (() => void) | null = null;

        // ── Multi-connect helpers ────────────────────────────────────
        type MultiConnectLine = {
          line: ConnectionLineInstance;
          sourceNodeId: string;
          sourceHandleId: string;
          sourcePos: XYPosition;
          valid: boolean;
        };

        const onPointerDown = (e: PointerEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const canvas = getCanvas();
          const nodeEl = el.closest('[x-flow-node]') as HTMLElement | null;
          if (!canvas || !nodeEl) return;
          if (canvas._animationLocked) return;

          const sourceNodeId = nodeEl.dataset.flowNodeId;
          if (!sourceNodeId) return;

          // ── Connectable guard (source) ─────────────────────────
          const sourceNode = canvas.getNode(sourceNodeId);
          if (sourceNode && !isConnectable(sourceNode)) return;
          if (el[HANDLE_CONNECTABLE_START_KEY] === false) return;

          const startX = e.clientX;
          const startY = e.clientY;
          let dragStarted = false;

          // If we already have a pending click-to-connect, cancel it first
          if (canvas.pendingConnection && (canvas._config?.connectOnClick !== false)) {
            canvas._emit('connect-end', {
              connection: null,
              source: canvas.pendingConnection.source,
              sourceHandle: canvas.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 },
            });
            canvas.pendingConnection = null;
            canvas._container?.classList.remove('flow-connecting');
            const prevContainer = el.closest('.flow-container') as HTMLElement;
            if (prevContainer) clearValidationClasses(prevContainer);
          }

          // Drag setup variables (deferred until threshold)
          let tempSvg: SVGSVGElement | null = null;
          let connectionLineInstance: ConnectionLineInstance | null = null;
          let snappedHandle: HTMLElement | null = null;
          let connectAutoPan: ReturnType<typeof startConnectionAutoPan> = null;
          let ghostEl: HTMLElement | null = null;
          const connectionSnapRadius = canvas._config?.connectionSnapRadius ?? 20;
          const containerEl = el.closest('.flow-container') as HTMLElement;

          let sourceX = 0;
          let sourceY = 0;
          let multiConnectMode = false;
          let multiConnectLines: Map<string, MultiConnectLine> = new Map();

          const initDrag = () => {
            dragStarted = true;
            debug('connection', `Connection drag started from node "${sourceNodeId}" handle "${handleId}"`);
            canvas._emit('connect-start', { source: sourceNodeId, sourceHandle: handleId });

            if (!containerEl) return;

            connectionLineInstance = createConnectionLine({
              connectionLineType: canvas._config?.connectionLineType,
              connectionLineStyle: canvas._config?.connectionLineStyle,
              connectionLine: canvas._config?.connectionLine,
              containerEl: containerEl!,
            });
            tempSvg = connectionLineInstance.svg;

            const handleRect = el.getBoundingClientRect();
            const initContainerRect = containerEl.getBoundingClientRect();
            const initZoom = canvas.viewport?.zoom || 1;
            const initVpX = canvas.viewport?.x || 0;
            const initVpY = canvas.viewport?.y || 0;

            sourceX = (handleRect.left + handleRect.width / 2 - initContainerRect.left - initVpX) / initZoom;
            sourceY = (handleRect.top + handleRect.height / 2 - initContainerRect.top - initVpY) / initZoom;

            connectionLineInstance.update({ fromX: sourceX, fromY: sourceY, toX: sourceX, toY: sourceY, source: sourceNodeId, sourceHandle: handleId });

            const viewportEl = containerEl.querySelector('.flow-viewport');
            if (viewportEl) viewportEl.appendChild(tempSvg);

            canvas.pendingConnection = {
              source: sourceNodeId,
              sourceHandle: handleId,
              position: { x: sourceX, y: sourceY },
            };

            connectAutoPan = startConnectionAutoPan(containerEl, canvas, startX, startY);

            applyValidationClasses(containerEl, sourceNodeId, handleId, canvas);

            // Create ghost node preview when onEdgeDrop is configured
            if (canvas._config?.onEdgeDrop) {
              const previewFn = canvas._config.edgeDropPreview;
              const detail = { source: sourceNodeId, sourceHandle: handleId };
              const previewResult = previewFn ? previewFn(detail) : 'New Node';

              if (previewResult !== null) {
                ghostEl = document.createElement('div');
                ghostEl.className = 'flow-ghost-node';

                const ghostHandle = document.createElement('div');
                ghostHandle.className = 'flow-ghost-handle';
                ghostEl.appendChild(ghostHandle);

                if (typeof previewResult === 'string') {
                  const label = document.createElement('span');
                  label.textContent = previewResult;
                  ghostEl.appendChild(label);
                } else {
                  ghostEl.appendChild(previewResult);
                }

                ghostEl.style.left = `${sourceX}px`;
                ghostEl.style.top = `${sourceY}px`;

                const viewportEl = containerEl.querySelector('.flow-viewport');
                if (viewportEl) viewportEl.appendChild(ghostEl);
              }
            }
          };

          const getMultiConnectSources = (): Array<{ nodeId: string; handleId: string; pos: XYPosition }> => {
            const selected = [...canvas.selectedNodes] as string[];
            const result: Array<{ nodeId: string; handleId: string; pos: XYPosition }> = [];
            const containerRect = containerEl!.getBoundingClientRect();
            const zoom = canvas.viewport?.zoom || 1;
            const vpX = canvas.viewport?.x || 0;
            const vpY = canvas.viewport?.y || 0;

            for (const id of selected) {
              if (id === sourceNodeId) continue;
              const nodeEl = containerEl?.querySelector(`[data-flow-node-id="${CSS.escape(id)}"]`);
              const srcHandle = nodeEl?.querySelector('[data-flow-handle-type="source"]') as HTMLElement | null;
              if (!srcHandle) continue;

              const handleRect = srcHandle.getBoundingClientRect();
              result.push({
                nodeId: id,
                handleId: srcHandle.dataset.flowHandleId ?? 'source',
                pos: {
                  x: (handleRect.left + handleRect.width / 2 - containerRect.left - vpX) / zoom,
                  y: (handleRect.top + handleRect.height / 2 - containerRect.top - vpY) / zoom,
                },
              });
            }
            return result;
          };

          const enterMultiConnect = (cursorFlowPos: XYPosition) => {
            multiConnectMode = true;

            // Move the primary connection line into the multi-connect set
            if (connectionLineInstance) {
              multiConnectLines.set(sourceNodeId, {
                line: connectionLineInstance,
                sourceNodeId: sourceNodeId,
                sourceHandleId: handleId,
                sourcePos: { x: sourceX, y: sourceY },
                valid: true,
              });
              connectionLineInstance = null;
            }

            // Create lines for each other selected node's source handle
            const sources = getMultiConnectSources();
            const viewportEl = containerEl!.querySelector('.flow-viewport');

            for (const src of sources) {
              const line = createConnectionLine({
                connectionLineType: canvas._config?.connectionLineType,
                connectionLineStyle: canvas._config?.connectionLineStyle,
                connectionLine: canvas._config?.connectionLine,
                containerEl: containerEl!,
              });

              line.update({
                fromX: src.pos.x, fromY: src.pos.y,
                toX: cursorFlowPos.x, toY: cursorFlowPos.y,
                source: src.nodeId, sourceHandle: src.handleId,
              });

              if (viewportEl) viewportEl.appendChild(line.svg);

              multiConnectLines.set(src.nodeId, {
                line,
                sourceNodeId: src.nodeId,
                sourceHandleId: src.handleId,
                sourcePos: src.pos,
                valid: true,
              });
            }
          };

          const onPointerMove = (moveEvent: PointerEvent) => {
            if (!dragStarted) {
              const dx = moveEvent.clientX - startX;
              const dy = moveEvent.clientY - startY;
              if (Math.abs(dx) >= DRAG_THRESHOLD || Math.abs(dy) >= DRAG_THRESHOLD) {
                initDrag();
                // Auto-activate multi-connect when enabled and multiple nodes selected
                if (canvas._config?.multiConnect && canvas.selectedNodes.size > 1 && canvas.selectedNodes.has(sourceNodeId)) {
                  const cursorFlowPos = canvas.screenToFlowPosition(moveEvent.clientX, moveEvent.clientY);
                  enterMultiConnect(cursorFlowPos);
                }
              } else {
                return;
              }
            }

            const cursorFlowPos = canvas.screenToFlowPosition(moveEvent.clientX, moveEvent.clientY);

            if (multiConnectMode) {
              // Find nearest target handle for all lines to converge on
              const snap = findSnapTarget({
                containerEl: containerEl!,
                handleType: 'target',
                excludeNodeId: sourceNodeId,
                cursorFlowPos,
                connectionSnapRadius,
                getNode: (id: string) => canvas.getNode(id),
                toFlowPosition: (sx: number, sy: number) => canvas.screenToFlowPosition(sx, sy),
                connectionMode: canvas._config?.connectionMode,
              });

              if (snap.element !== snappedHandle) {
                snappedHandle?.classList.remove('flow-handle-active');
                snap.element?.classList.add('flow-handle-active');
                snappedHandle = snap.element;
              }

              // Determine target info for validation
              const targetNodeEl = snap.element?.closest('[x-flow-node]') as HTMLElement | null;
              const targetNodeId = targetNodeEl?.dataset.flowNodeId ?? null;
              const targetHandleId = snap.element?.dataset.flowHandleId ?? 'target';
              const normalColor = canvas._config?.connectionLineStyle?.stroke
                ?? (getComputedStyle(containerEl!).getPropertyValue('--flow-edge-stroke-selected').trim() || CONNECTION_ACTIVE_COLOR);

              for (const entry of multiConnectLines.values()) {
                entry.line.update({
                  fromX: entry.sourcePos.x, fromY: entry.sourcePos.y,
                  toX: snap.position.x, toY: snap.position.y,
                  source: entry.sourceNodeId, sourceHandle: entry.sourceHandleId,
                });

                // Validate per-source when snapped to a target handle
                if (snap.element && targetNodeId) {
                  const connection = {
                    source: entry.sourceNodeId,
                    sourceHandle: entry.sourceHandleId,
                    target: targetNodeId,
                    targetHandle: targetHandleId,
                  };
                  const targetNode = canvas.getNode(targetNodeId);
                  const builtInValid = targetNode?.connectable !== false
                    && entry.sourceNodeId !== targetNodeId
                    && isValidConnection(connection, canvas.edges, { preventCycles: canvas._config?.preventCycles });
                  const limitValid = builtInValid && checkHandleLimits(containerEl!, connection, canvas.edges);
                  const handleValid = limitValid && runHandleValidators(containerEl!, connection);
                  const globalValid = handleValid
                    && (!canvas._config?.isValidConnection || canvas._config.isValidConnection(connection));

                  entry.valid = globalValid;
                  const path = entry.line.svg.querySelector('path');
                  if (path) {
                    if (!globalValid) {
                      const invalidColor = getComputedStyle(containerEl!).getPropertyValue('--flow-connection-line-invalid').trim() || CONNECTION_INVALID_COLOR;
                      path.setAttribute('stroke', invalidColor);
                    } else {
                      path.setAttribute('stroke', normalColor);
                    }
                  }
                } else {
                  entry.valid = true;
                  const path = entry.line.svg.querySelector('path');
                  if (path) path.setAttribute('stroke', normalColor);
                }
              }

              canvas.pendingConnection = { ...canvas.pendingConnection, position: snap.position };
              connectAutoPan?.updatePointer(moveEvent.clientX, moveEvent.clientY);
              return;
            }

            const snap = findSnapTarget({
              containerEl,
              handleType: 'target',
              excludeNodeId: sourceNodeId,
              cursorFlowPos,
              connectionSnapRadius,
              getNode: (id: string) => canvas.getNode(id),
              toFlowPosition: (sx: number, sy: number) => canvas.screenToFlowPosition(sx, sy),
            });

            if (snap.element !== snappedHandle) {
              snappedHandle?.classList.remove('flow-handle-active');
              snap.element?.classList.add('flow-handle-active');
              snappedHandle = snap.element;
            }

            // Position ghost node and adjust connection line target
            if (ghostEl) {
              if (snap.element) {
                // Snapped to a real handle — hide ghost, line goes to handle
                ghostEl.style.display = 'none';
                connectionLineInstance?.update({ fromX: sourceX, fromY: sourceY, toX: snap.position.x, toY: snap.position.y, source: sourceNodeId, sourceHandle: handleId });
              } else {
                // No snap — show ghost at cursor, line goes to ghost handle
                ghostEl.style.display = '';
                ghostEl.style.left = `${cursorFlowPos.x}px`;
                ghostEl.style.top = `${cursorFlowPos.y}px`;
                // Ghost handle is at top-center of ghost node; connection line targets that point
                connectionLineInstance?.update({ fromX: sourceX, fromY: sourceY, toX: cursorFlowPos.x, toY: cursorFlowPos.y, source: sourceNodeId, sourceHandle: handleId });
              }
            } else {
              connectionLineInstance?.update({ fromX: sourceX, fromY: sourceY, toX: snap.position.x, toY: snap.position.y, source: sourceNodeId, sourceHandle: handleId });
            }

            canvas.pendingConnection = { ...canvas.pendingConnection, position: snap.position };
            connectAutoPan?.updatePointer(moveEvent.clientX, moveEvent.clientY);
          };

          const onPointerUp = (upEvent: PointerEvent) => {
            connectAutoPan?.stop();
            connectAutoPan = null;
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            activeConnectionCleanup = null;

            if (multiConnectMode) {
              const dropPosition = canvas.screenToFlowPosition(upEvent.clientX, upEvent.clientY);

              // Find the single drop target handle
              let targetHandle: HTMLElement | null = snappedHandle;
              if (!targetHandle) {
                const dropTarget = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
                targetHandle = dropTarget?.closest('[data-flow-handle-type="target"]') as HTMLElement | null;
              }

              const targetNodeEl = targetHandle?.closest('[x-flow-node]') as HTMLElement | null;
              const targetNodeId = targetNodeEl?.dataset.flowNodeId ?? null;
              const targetHandleId = targetHandle?.dataset.flowHandleId ?? 'target';

              const validEdges: Array<{ id: string; source: string; sourceHandle: string; target: string; targetHandle: string }> = [];
              const validConnections: Connection[] = [];
              const invalidEntries: MultiConnectLine[] = [];
              const validEntries: MultiConnectLine[] = [];

              if (targetHandle && targetNodeId) {
                const targetNode = canvas.getNode(targetNodeId);

                for (const entry of multiConnectLines.values()) {
                  const connection = {
                    source: entry.sourceNodeId,
                    sourceHandle: entry.sourceHandleId,
                    target: targetNodeId,
                    targetHandle: targetHandleId,
                  };

                  const builtInValid = targetNode?.connectable !== false
                    && entry.sourceNodeId !== targetNodeId
                    && isValidConnection(connection, canvas.edges, { preventCycles: canvas._config?.preventCycles });
                  const limitValid = builtInValid && checkHandleLimits(containerEl!, connection, canvas.edges);
                  const handleValid = limitValid && runHandleValidators(containerEl!, connection);
                  const globalValid = handleValid
                    && (!canvas._config?.isValidConnection || canvas._config.isValidConnection(connection));

                  if (globalValid) {
                    const edgeId = `e-${entry.sourceNodeId}-${targetNodeId}-${Date.now()}-${edgeIdCounter++}`;
                    validEdges.push({ id: edgeId, ...connection });
                    validConnections.push(connection);
                    validEntries.push(entry);
                  } else {
                    invalidEntries.push(entry);
                  }
                }
              } else {
                invalidEntries.push(...multiConnectLines.values());
              }

              for (const entry of validEntries) {
                entry.line.destroy();
              }

              if (validEdges.length > 0) {
                canvas.addEdges(validEdges);
                for (const connection of validConnections) {
                  canvas._emit('connect', { connection });
                }
                canvas._emit('multi-connect', { connections: validConnections });
              }

              if (invalidEntries.length > 0) {
                setTimeout(() => {
                  for (const entry of invalidEntries) {
                    entry.line.destroy();
                  }
                }, 100);
              }

              snappedHandle?.classList.remove('flow-handle-active');
              canvas._emit('connect-end', {
                connection: validConnections.length > 0 ? validConnections[0] : null,
                source: sourceNodeId,
                sourceHandle: handleId,
                position: dropPosition,
              });

              multiConnectLines.clear();
              multiConnectMode = false;
              clearValidationClasses(containerEl);
              canvas.pendingConnection = null;
              canvas._container?.classList.remove('flow-connecting');
              return;
            }

            if (!dragStarted) {
              // Click (no drag): start click-to-connect
              if (canvas._config?.connectOnClick !== false) {
                debug('connection', `Click-to-connect started from node "${sourceNodeId}" handle "${handleId}"`);
                canvas._emit('connect-start', { source: sourceNodeId, sourceHandle: handleId });
                canvas.pendingConnection = {
                  source: sourceNodeId,
                  sourceHandle: handleId,
                  position: { x: 0, y: 0 },
                };
                canvas._container?.classList.add('flow-connecting');
                applyValidationClasses(containerEl, sourceNodeId, handleId, canvas);
              }
              return;
            }

            // Drag completed: existing drag-to-connect logic
            connectionLineInstance?.destroy();
            connectionLineInstance = null;
            ghostEl?.remove();
            ghostEl = null;
            snappedHandle?.classList.remove('flow-handle-active');
            clearValidationClasses(containerEl);

            const dropPosition = canvas.screenToFlowPosition(upEvent.clientX, upEvent.clientY);
            const connectEndBase = { source: sourceNodeId, sourceHandle: handleId, position: dropPosition };

            let targetHandle: HTMLElement | null = snappedHandle;
            if (!targetHandle) {
              const dropTarget = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
              targetHandle = dropTarget?.closest('[data-flow-handle-type="target"]') as HTMLElement | null;
            }

            if (targetHandle) {
              const targetNodeEl = targetHandle.closest('[x-flow-node]') as HTMLElement | null;
              const targetNodeId = targetNodeEl?.dataset.flowNodeId;
              const targetHandleId = targetHandle.dataset.flowHandleId ?? 'target';

              if (targetNodeId) {
                if (targetHandle[HANDLE_CONNECTABLE_END_KEY] === false) {
                  debug('connection', 'Connection rejected (handle not connectable end)');
                  canvas._emit('connect-end', { connection: null, ...connectEndBase });
                  canvas.pendingConnection = null;
                  return;
                }

                const targetNode = canvas.getNode(targetNodeId);
                if (targetNode && !isConnectable(targetNode)) {
                  debug('connection', `Connection rejected (target "${targetNodeId}" not connectable)`);
                  canvas._emit('connect-end', { connection: null, ...connectEndBase });
                  canvas.pendingConnection = null;
                  return;
                }

                const connection = {
                  source: sourceNodeId,
                  sourceHandle: handleId,
                  target: targetNodeId,
                  targetHandle: targetHandleId,
                };

                if (isValidConnection(connection, canvas.edges, { preventCycles: canvas._config?.preventCycles })) {
                  if (!checkHandleLimits(containerEl, connection, canvas.edges)) {
                    debug('connection', 'Connection rejected (handle limit)', connection);
                    canvas._emit('connect-end', { connection: null, ...connectEndBase });
                    canvas.pendingConnection = null;
                    return;
                  }
                  if (!runHandleValidators(containerEl, connection)) {
                    debug('connection', 'Connection rejected (per-handle validator)', connection);
                    canvas._emit('connect-end', { connection: null, ...connectEndBase });
                    canvas.pendingConnection = null;
                    return;
                  }
                  if (canvas._config?.isValidConnection && !canvas._config.isValidConnection(connection)) {
                    debug('connection', 'Connection rejected (custom validator)', connection);
                    canvas._emit('connect-end', { connection: null, ...connectEndBase });
                    canvas.pendingConnection = null;
                    return;
                  }

                  const edgeId = `e-${sourceNodeId}-${targetNodeId}-${Date.now()}-${edgeIdCounter++}`;
                  canvas.addEdges({ id: edgeId, ...connection });
                  debug('connection', `Connection created: ${sourceNodeId} → ${targetNodeId}`, connection);
                  canvas._emit('connect', { connection });
                  canvas._emit('connect-end', { connection, ...connectEndBase });
                } else {
                  debug('connection', 'Connection rejected (invalid)', connection);
                  canvas._emit('connect-end', { connection: null, ...connectEndBase });
                }
              } else {
                canvas._emit('connect-end', { connection: null, ...connectEndBase });
              }
            } else {
              if (canvas._config?.onEdgeDrop) {
                const centeredPosition = {
                  x: dropPosition.x - DEFAULT_NODE_WIDTH / 2,
                  y: dropPosition.y - DEFAULT_NODE_HEIGHT / 2,
                };
                const newNode = canvas._config.onEdgeDrop({
                  source: sourceNodeId,
                  sourceHandle: handleId,
                  position: centeredPosition,
                });
                if (newNode) {
                  const connection: Connection = {
                    source: sourceNodeId,
                    sourceHandle: handleId,
                    target: newNode.id,
                    targetHandle: 'target',
                  };
                  // Per-handle: only source validator fires; target node is not yet in DOM
                  if (!checkHandleLimits(containerEl, connection, canvas.edges)) {
                    debug('connection', 'Edge drop: connection rejected (handle limit)');
                    canvas._emit('connect-end', { connection: null, ...connectEndBase });
                  } else if (!runHandleValidators(containerEl, connection)) {
                    debug('connection', 'Edge drop: connection rejected (per-handle validator)');
                    canvas._emit('connect-end', { connection: null, ...connectEndBase });
                  } else if (!canvas._config.isValidConnection || canvas._config.isValidConnection(connection)) {
                    canvas.addNodes(newNode);
                    const edgeId = `e-${sourceNodeId}-${newNode.id}-${Date.now()}-${edgeIdCounter++}`;
                    canvas.addEdges({ id: edgeId, ...connection });
                    debug('connection', `Edge drop: created node "${newNode.id}" and edge`, connection);
                    canvas._emit('connect', { connection });
                    canvas._emit('connect-end', { connection, ...connectEndBase });
                  } else {
                    debug('connection', 'Edge drop: connection rejected by validator');
                    canvas._emit('connect-end', { connection: null, ...connectEndBase });
                  }
                } else {
                  debug('connection', 'Edge drop: callback returned null');
                  canvas._emit('connect-end', { connection: null, ...connectEndBase });
                }
              } else {
                debug('connection', 'Connection cancelled (no target)');
                canvas._emit('connect-end', { connection: null, ...connectEndBase });
              }
            }

            canvas.pendingConnection = null;
          };

          document.addEventListener('pointermove', onPointerMove);
          document.addEventListener('pointerup', onPointerUp);
          document.addEventListener('pointercancel', onPointerUp);

          activeConnectionCleanup = () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('pointercancel', onPointerUp);
            connectAutoPan?.stop();
            connectionLineInstance?.destroy();
            connectionLineInstance = null;
            ghostEl?.remove();
            ghostEl = null;
            for (const entry of multiConnectLines.values()) {
                entry.line.destroy();
            }
            multiConnectLines.clear();
            multiConnectMode = false;
            snappedHandle?.classList.remove('flow-handle-active');
            clearValidationClasses(containerEl);
            canvas.pendingConnection = null;
            canvas._container?.classList.remove('flow-connecting');
          };
        };

        el.addEventListener('pointerdown', onPointerDown);

        // Highlight source handles during source-end reconnection
        const onReconnectPointerEnter = () => {
          const canvas = getCanvas();
          if (!canvas?._pendingReconnection || canvas._pendingReconnection.draggedEnd !== 'source') return;

          const nodeId = getNodeId();
          if (nodeId) {
            const node = canvas.getNode(nodeId);
            if (node && !isConnectable(node)) return;
          }
          if (el[HANDLE_CONNECTABLE_START_KEY] === false) return;

          el.classList.add('flow-handle-active');
        };

        const onReconnectPointerLeave = () => {
          el.classList.remove('flow-handle-active');
        };

        el.addEventListener('pointerenter', onReconnectPointerEnter);
        el.addEventListener('pointerleave', onReconnectPointerLeave);

        cleanup(() => {
          activeConnectionCleanup?.();
          el.removeEventListener('pointerdown', onPointerDown);
          el.removeEventListener('pointerenter', onReconnectPointerEnter);
          el.removeEventListener('pointerleave', onReconnectPointerLeave);
          el.classList.remove('flow-handle', `flow-handle-${type}`);
        });
      } else {
        // ── Target handle: highlight on hover during connection drag ──
        const onPointerEnter = () => {
          const canvas = getCanvas();
          if (!canvas?.pendingConnection) return;

          // ── Connectable guard (target hover) ───────────────────
          const nodeId = getNodeId();
          if (nodeId) {
            const node = canvas.getNode(nodeId);
            if (node && !isConnectable(node)) return;
          }
          if (el[HANDLE_CONNECTABLE_END_KEY] === false) return;

          el.classList.add('flow-handle-active');
        };

        const onPointerLeave = () => {
          el.classList.remove('flow-handle-active');
        };

        el.addEventListener('pointerenter', onPointerEnter);
        el.addEventListener('pointerleave', onPointerLeave);

        // ── Target handle: click to complete click-to-connect ──────
        const onTargetClick = (e: MouseEvent) => {
          const canvas = getCanvas();
          if (!canvas?.pendingConnection) return;
          if (canvas._config?.connectOnClick === false) return;

          e.preventDefault();
          e.stopPropagation();

          const targetNodeId = getNodeId();
          if (!targetNodeId) return;

          if (el[HANDLE_CONNECTABLE_END_KEY] === false) {
            debug('connection', `Click-to-connect rejected (handle not connectable end)`);
            canvas._emit('connect-end', { connection: null, source: canvas.pendingConnection.source, sourceHandle: canvas.pendingConnection.sourceHandle, position: { x: 0, y: 0 } });
            canvas.pendingConnection = null;
            canvas._container?.classList.remove('flow-connecting');
            const ctcContainer = el.closest('.flow-container') as HTMLElement;
            if (ctcContainer) clearValidationClasses(ctcContainer);
            return;
          }

          const targetNode = canvas.getNode(targetNodeId);
          if (targetNode && !isConnectable(targetNode)) {
            debug('connection', `Click-to-connect rejected (target "${targetNodeId}" not connectable)`);
            canvas._emit('connect-end', { connection: null, source: canvas.pendingConnection.source, sourceHandle: canvas.pendingConnection.sourceHandle, position: { x: 0, y: 0 } });
            canvas.pendingConnection = null;
            canvas._container?.classList.remove('flow-connecting');
            const cContainer = el.closest('.flow-container') as HTMLElement;
            if (cContainer) clearValidationClasses(cContainer);
            return;
          }

          const connection: Connection = {
            source: canvas.pendingConnection.source,
            sourceHandle: canvas.pendingConnection.sourceHandle,
            target: targetNodeId,
            targetHandle: handleId,
          };

          const connectEndBase = { source: canvas.pendingConnection.source, sourceHandle: canvas.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };

          if (isValidConnection(connection, canvas.edges, { preventCycles: canvas._config?.preventCycles })) {
            const clickContainerEl = el.closest('.flow-container') as HTMLElement;
            if (clickContainerEl && !checkHandleLimits(clickContainerEl, connection, canvas.edges)) {
              debug('connection', 'Click-to-connect rejected (handle limit)', connection);
              canvas._emit('connect-end', { connection: null, ...connectEndBase });
              canvas.pendingConnection = null;
              canvas._container?.classList.remove('flow-connecting');
              clearValidationClasses(clickContainerEl);
              return;
            }
            if (clickContainerEl && !runHandleValidators(clickContainerEl, connection)) {
              debug('connection', 'Click-to-connect rejected (per-handle validator)', connection);
              canvas._emit('connect-end', { connection: null, ...connectEndBase });
              canvas.pendingConnection = null;
              canvas._container?.classList.remove('flow-connecting');
              if (clickContainerEl) clearValidationClasses(clickContainerEl);
              return;
            }
            if (canvas._config?.isValidConnection && !canvas._config.isValidConnection(connection)) {
              debug('connection', 'Click-to-connect rejected (custom validator)', connection);
              canvas._emit('connect-end', { connection: null, ...connectEndBase });
              canvas.pendingConnection = null;
              canvas._container?.classList.remove('flow-connecting');
              if (clickContainerEl) clearValidationClasses(clickContainerEl);
              return;
            }

            const edgeId = `e-${connection.source}-${connection.target}-${Date.now()}-${edgeIdCounter++}`;
            canvas.addEdges({ id: edgeId, ...connection });
            debug('connection', `Click-to-connect: ${connection.source} → ${connection.target}`, connection);
            canvas._emit('connect', { connection });
            canvas._emit('connect-end', { connection, ...connectEndBase });
          } else {
            debug('connection', 'Click-to-connect rejected (invalid)', connection);
            canvas._emit('connect-end', { connection: null, ...connectEndBase });
          }

          canvas.pendingConnection = null;
          canvas._container?.classList.remove('flow-connecting');
          const endContainer = el.closest('.flow-container') as HTMLElement;
          if (endContainer) clearValidationClasses(endContainer);
        };

        el.addEventListener('click', onTargetClick);

        // ── Target handle: pointerdown for edge reconnection ──────
        let activeReconnectCleanup: (() => void) | null = null;

        const onTargetPointerDown = (e: PointerEvent) => {
          if (e.button !== 0) return;

          const canvas = getCanvas();
          const nodeId = getNodeId();
          if (!canvas || !nodeId) return;
          if (canvas._animationLocked) return;

          // Global reconnectable guard
          if (canvas._config?.edgesReconnectable === false) return;

          // Already reconnecting?
          if (canvas._pendingReconnection) return;

          // Find edge(s) connected to this target handle
          const matchingEdges = (canvas.edges as FlowEdge[]).filter(
            (edge: FlowEdge) =>
              edge.target === nodeId &&
              (edge.targetHandle ?? 'target') === handleId,
          );
          if (matchingEdges.length === 0) return;

          // Prefer the selected edge; if none selected require exactly one match
          const connectedEdge =
            matchingEdges.find((edge: FlowEdge) => edge.selected) ??
            (matchingEdges.length === 1 ? matchingEdges[0] : null);
          if (!connectedEdge) return;

          // Per-edge reconnectable guard
          const edgeReconnectable = connectedEdge.reconnectable ?? true;
          if (edgeReconnectable === false || edgeReconnectable === 'source') return;

          e.preventDefault();
          e.stopPropagation();

          const startX = e.clientX;
          const startY = e.clientY;
          let dragging = false;
          let reconnectCleanedUp = false;
          let snappedHandle: HTMLElement | null = null;
          const connectionSnapRadius = canvas._config?.connectionSnapRadius ?? 20;

          const containerEl = el.closest('.flow-container') as HTMLElement;
          if (!containerEl) return;

          // Compute source handle (anchor) center in flow coordinates
          const sourceNodeEl = containerEl.querySelector(
            `[data-flow-node-id="${CSS.escape(connectedEdge.source)}"]`,
          ) as HTMLElement | null;
          const sourceHandleSelector = connectedEdge.sourceHandle
            ? `[data-flow-handle-id="${CSS.escape(connectedEdge.sourceHandle)}"]`
            : `[data-flow-handle-type="source"]`;
          const sourceHandleEl = sourceNodeEl?.querySelector(sourceHandleSelector) as HTMLElement | null;

          const cRect = containerEl.getBoundingClientRect();
          const initZoom = canvas.viewport?.zoom || 1;
          const initVpX = canvas.viewport?.x || 0;
          const initVpY = canvas.viewport?.y || 0;

          let anchorX: number;
          let anchorY: number;
          if (sourceHandleEl) {
            const shRect = sourceHandleEl.getBoundingClientRect();
            anchorX = (shRect.left + shRect.width / 2 - cRect.left - initVpX) / initZoom;
            anchorY = (shRect.top + shRect.height / 2 - cRect.top - initVpY) / initZoom;
          } else {
            // Fallback: estimate source node bottom-center
            const sourceNode = canvas.getNode(connectedEdge.source);
            if (!sourceNode) return;
            const w = sourceNode.dimensions?.width ?? DEFAULT_NODE_WIDTH;
            const h = sourceNode.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
            anchorX = sourceNode.position.x + w / 2;
            anchorY = sourceNode.position.y + h;
          }

          let tempSvg: SVGSVGElement | null = null;
          let reconnectLineInstance: ConnectionLineInstance | null = null;
          let connectAutoPan: ReturnType<typeof startConnectionAutoPan> = null;
          let lastMoveX = startX;
          let lastMoveY = startY;

          const startReconnectionDrag = () => {
            dragging = true;

            // Dim the edge via its tagged <g>
            const edgeGEl = containerEl.querySelector(
              `[data-flow-edge-id="${connectedEdge.id}"]`,
            );
            if (edgeGEl) {
              edgeGEl.classList.add('flow-edge-reconnecting');
            }

            canvas._emit('reconnect-start', { edge: connectedEdge, handleType: 'target' as HandleType });
            debug('reconnect', `Reconnection drag started from target handle on edge "${connectedEdge.id}"`);

            // Create connection line for visual feedback
            reconnectLineInstance = createConnectionLine({
              connectionLineType: canvas._config?.connectionLineType,
              connectionLineStyle: canvas._config?.connectionLineStyle,
              connectionLine: canvas._config?.connectionLine,
              containerEl: containerEl!,
            });
            tempSvg = reconnectLineInstance.svg;

            const flowPos = canvas.screenToFlowPosition(startX, startY);
            reconnectLineInstance.update({
              fromX: anchorX, fromY: anchorY,
              toX: flowPos.x, toY: flowPos.y,
              source: connectedEdge.source, sourceHandle: connectedEdge.sourceHandle,
            });

            const viewportEl = containerEl.querySelector('.flow-viewport');
            if (viewportEl) {
              viewportEl.appendChild(tempSvg);
            }

            // Set pendingConnection for target handle highlighting
            canvas.pendingConnection = {
              source: connectedEdge.source,
              sourceHandle: connectedEdge.sourceHandle,
              position: flowPos,
            };

            // Set _pendingReconnection
            canvas._pendingReconnection = {
              edge: connectedEdge,
              draggedEnd: 'target' as HandleType,
              anchorPosition: { x: anchorX, y: anchorY },
              position: flowPos,
            };

            // Auto-pan
            connectAutoPan = startConnectionAutoPan(containerEl, canvas, lastMoveX, lastMoveY);

            applyValidationClasses(containerEl, connectedEdge.source, connectedEdge.sourceHandle ?? 'source', canvas, connectedEdge.id);
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

            const cursorFlowPos = canvas.screenToFlowPosition(moveE.clientX, moveE.clientY);

            const snap = findSnapTarget({
              containerEl,
              handleType: 'target',
              excludeNodeId: connectedEdge.source,
              cursorFlowPos,
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
              fromX: anchorX, fromY: anchorY,
              toX: snap.position.x, toY: snap.position.y,
              source: connectedEdge.source, sourceHandle: connectedEdge.sourceHandle,
            });

            if (canvas.pendingConnection) {
              canvas.pendingConnection = {
                ...canvas.pendingConnection,
                position: snap.position,
              };
            }
            if (canvas._pendingReconnection) {
              canvas._pendingReconnection = {
                ...canvas._pendingReconnection,
                position: snap.position,
              };
            }

            connectAutoPan?.updatePointer(moveE.clientX, moveE.clientY);
          };

          const cleanupReconnection = () => {
            if (reconnectCleanedUp) return;
            reconnectCleanedUp = true;

            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('pointercancel', onPointerUp);
            connectAutoPan?.stop();
            connectAutoPan = null;
            reconnectLineInstance?.destroy();
            reconnectLineInstance = null;
            tempSvg = null;
            snappedHandle?.classList.remove('flow-handle-active');
            activeReconnectCleanup = null;

            // Undim the edge
            const edgeGEl = containerEl.querySelector(
              `[data-flow-edge-id="${connectedEdge.id}"]`,
            );
            if (edgeGEl) {
              edgeGEl.classList.remove('flow-edge-reconnecting');
            }

            clearValidationClasses(containerEl);
            canvas.pendingConnection = null;
            canvas._pendingReconnection = null;
          };

          const onPointerUp = (upE: PointerEvent) => {
            if (!dragging) {
              cleanupReconnection();
              return;
            }

            // Use snapped handle if available, otherwise fall back to elementFromPoint
            let targetHandleEl: HTMLElement | null = snappedHandle;
            if (!targetHandleEl) {
              const dropTarget = document.elementFromPoint(upE.clientX, upE.clientY);
              targetHandleEl = dropTarget?.closest('[data-flow-handle-type="target"]') as HTMLElement | null;
            }

            let successful = false;

            if (targetHandleEl) {
              const targetNodeEl = targetHandleEl.closest('[x-flow-node]') as HTMLElement | null;
              const dropNodeId = targetNodeEl?.dataset.flowNodeId;
              const dropHandleId = targetHandleEl.dataset.flowHandleId;

              if (dropNodeId) {
                const dropNode = canvas.getNode(dropNodeId);
                if (dropNode?.connectable !== false) {
                  const newConnection: Connection = {
                    source: connectedEdge.source,
                    sourceHandle: connectedEdge.sourceHandle,
                    target: dropNodeId,
                    targetHandle: dropHandleId,
                  };

                  // Filter out current edge from duplicate check
                  const otherEdges = canvas.edges.filter(
                    (e: FlowEdge) => e.id !== connectedEdge.id,
                  );

                  if (isValidConnection(newConnection, otherEdges, { preventCycles: canvas._config?.preventCycles })) {
                    if (!checkHandleLimits(containerEl, newConnection, otherEdges)) {
                      debug('reconnect', 'Reconnection rejected (handle limit)', newConnection);
                    } else if (!runHandleValidators(containerEl, newConnection)) {
                      debug('reconnect', 'Reconnection rejected (per-handle validator)', newConnection);
                    } else if (!canvas._config?.isValidConnection || canvas._config.isValidConnection(newConnection)) {
                      const oldEdge = { ...connectedEdge };

                      // Capture history before mutation
                      canvas._captureHistory?.();

                      // Mutate in place (Alpine reactivity picks up changes)
                      connectedEdge.target = newConnection.target;
                      connectedEdge.targetHandle = newConnection.targetHandle;

                      successful = true;
                      debug('reconnect', `Edge "${connectedEdge.id}" reconnected (target)`, newConnection);
                      canvas._emit('reconnect', { oldEdge, newConnection });
                    }
                  }
                }
              }
            }

            if (!successful) {
              debug('reconnect', `Edge "${connectedEdge.id}" reconnection cancelled — snapping back`);
            }

            canvas._emit('reconnect-end', { edge: connectedEdge, successful });
            cleanupReconnection();
          };

          document.addEventListener('pointermove', onPointerMove);
          document.addEventListener('pointerup', onPointerUp);
          document.addEventListener('pointercancel', onPointerUp);
          activeReconnectCleanup = cleanupReconnection;
        };

        el.addEventListener('pointerdown', onTargetPointerDown);

        cleanup(() => {
          activeReconnectCleanup?.();
          el.removeEventListener('pointerdown', onTargetPointerDown);
          el.removeEventListener('pointerenter', onPointerEnter);
          el.removeEventListener('pointerleave', onPointerLeave);
          el.removeEventListener('click', onTargetClick);
          el.classList.remove('flow-handle', `flow-handle-${type}`, 'flow-handle-active');
        });
      }
    },
  );
}
