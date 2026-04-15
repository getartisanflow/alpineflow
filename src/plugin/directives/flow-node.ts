// ============================================================================
// x-flow-node Directive
//
// Binds a DOM element as a draggable flow node. Manages d3-drag lifecycle,
// selection on click, and dispatches flow events. Respects per-node flags:
// draggable (default true) and selectable (default true).
//
// Usage: <div x-flow-node="node">...</div>
// ============================================================================

import type { Alpine } from 'alpinejs';
import { createDrag, type DragInstance } from '../../core/drag';
import type { FlowNode, FlowEdge, Viewport } from '../../core/types';
import { createAutoPan, type AutoPanInstance } from '../../core/auto-pan';
import { debug } from '../../core/debug';
import type { CoordinateExtent } from '../../core/types';
import {
  getDescendantIds,
  computeZIndex,
  clampToExtent,
  clampToParent,
  clampRootNodePosition,
  expandParentToFitChild,
} from '../../core/sub-flow';
import { computeHelperLines, nodeToBox, type NodeBox } from '../../core/helper-lines';
import { matchesModifier } from '../../core/keyboard-shortcuts';
import { getNodeRect, clampToAvoidOverlap } from '../../core/intersection';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../../core/geometry';
import { resolveChildValidation } from '../../core/child-validation';
import { collabStore } from '../../collab/store';
import { createConnectionLine, findSnapTarget, startConnectionAutoPan, type ConnectionLineInstance } from '../connection-utils';
import { applyValidationClasses, clearValidationClasses, checkHandleLimits, runHandleValidators } from './flow-handle';
import { isValidConnection } from '../../core/connections';
import { findProximityCandidate, type ProximityCandidate } from '../../core/proximity-connect';
import { isDraggable, isConnectable, isSelectable } from '../../core/node-flags';

const BLOCKED_ATTRS = new Set(['x-data', 'x-init', 'x-bind', 'href', 'src', 'action', 'formaction', 'srcdoc']);

let easyConnectEdgeCounter = 0;
let proximityEdgeCounter = 0;

/** Check if the easy-connect modifier key is held. */
export function isEasyConnectKey(
  e: PointerEvent | { altKey: boolean; metaKey: boolean; shiftKey: boolean },
  key: 'alt' | 'meta' | 'shift',
): boolean {
  switch (key) {
    case 'alt': return e.altKey;
    case 'meta': return e.metaKey;
    case 'shift': return e.shiftKey;
  }
}

/** Find the nearest source handle to a screen coordinate within a node element. */
export function findNearestSourceHandle(
  nodeEl: HTMLElement,
  clientX: number,
  clientY: number,
): HTMLElement | null {
  const handles = nodeEl.querySelectorAll('[data-flow-handle-type="source"]');
  if (handles.length === 0) return null;

  let closest: HTMLElement | null = null;
  let minDist = Infinity;

  handles.forEach((h) => {
    const el = h as HTMLElement;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((clientX - cx) ** 2 + (clientY - cy) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = el;
    }
  });

  return closest;
}

function renderHelperLines(
  horizontal: number[],
  vertical: number[],
  nodeBoxes: NodeBox[],
): SVGSVGElement {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const b of nodeBoxes) {
    minX = Math.min(minX, b.x);
    maxX = Math.max(maxX, b.x + b.width);
    minY = Math.min(minY, b.y);
    maxY = Math.max(maxY, b.y + b.height);
  }
  const pad = 50;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:500;';

  for (const y of horizontal) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(minX - pad));
    line.setAttribute('y1', String(y));
    line.setAttribute('x2', String(maxX + pad));
    line.setAttribute('y2', String(y));
    line.classList.add('flow-guide-path');
    svg.appendChild(line);
  }

  for (const x of vertical) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(x));
    line.setAttribute('y1', String(minY - pad));
    line.setAttribute('x2', String(x));
    line.setAttribute('y2', String(maxY + pad));
    line.classList.add('flow-guide-path');
    svg.appendChild(line);
  }

  return svg;
}


export function registerFlowNodeDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-node',
    (
      el,
      { expression },
      { evaluate, effect, cleanup },
    ) => {
      let dragInstance: DragInstance | null = null;
      let didDrag = false;
      let dragStartSelected = false;
      let groupDragStartPositions: Map<string, { x: number; y: number }> | null = null;
      let autoPan: AutoPanInstance | null = null;
      let helperLinesSvg: SVGSVGElement | null = null;
      let proximityPreviewLine: ConnectionLineInstance | null = null;
      let proximityCandidate: ProximityCandidate | null = null;
      let dropTargetId: string | null = null;
      let reorderDragActive = false;
      let reorderExcludeId: string | null = null;
      let reorderLastIdx = -1;
      let reorderParentId: string | null = null;
      let contentInjected = false;
      let prevNodeClasses: string[] = [];
      let prevShapeClass = '';
      let prevStyleProps: string[] = [];
      let lastDragNodeId: string | null = null;

      effect(() => {
        const node = evaluate(expression) as FlowNode;
        if (!node) return;

        // Store the node ID on the DOM element so child directives (handles) can read it
        el.dataset.flowNodeId = node.id;

        // One-time template injection from nodeTypes registry
        if (!contentInjected) {
          const canvasForTypes = Alpine.$data(el.closest('[x-data]') as HTMLElement);
          let injected = false;

          // Try nodeTypes registry first
          if (canvasForTypes?._config?.nodeTypes) {
            const nodeType = node.type ?? 'default';
            const typeConfig = canvasForTypes._config.nodeTypes[nodeType]
              ?? canvasForTypes._config.nodeTypes['default'];

            if (typeof typeConfig === 'string') {
              const tpl = document.querySelector(typeConfig) as HTMLTemplateElement;
              if (tpl?.content) {
                el.appendChild(tpl.content.cloneNode(true));
                injected = true;
              }
            } else if (typeof typeConfig === 'function') {
              typeConfig(node, el);
              injected = true;
            }
          }

          // If no nodeTypes matched and element is empty, inject default template:
          // target handle + label + source handle
          if (!injected && el.children.length === 0) {
            const target = document.createElement('div');
            target.setAttribute('x-flow-handle:target', '');
            const label = document.createElement('span');
            label.setAttribute('x-text', 'node.data.label');
            const source = document.createElement('div');
            source.setAttribute('x-flow-handle:source', '');
            el.appendChild(target);
            el.appendChild(label);
            el.appendChild(source);
            injected = true;
          }

          if (injected) {
            for (const child of Array.from(el.children)) {
              Alpine.addScopeToNode(child as HTMLElement, { node });
              Alpine.initTree(child as HTMLElement);
            }
          }

          contentInjected = true;
        }

        // ── Hidden flag ──────────────────────────────────────────
        if (node.hidden) {
          el.classList.add('flow-node-hidden');
          el.removeAttribute('tabindex');
          el.removeAttribute('role');
          el.removeAttribute('aria-label');
          dragInstance?.destroy();
          dragInstance = null;
          return;
        }
        el.classList.remove('flow-node-hidden');

        // Only recreate drag when node identity changes — not on every
        // position update. Destroying/recreating d3-drag on each effect
        // re-run is expensive (event listener teardown + setup) and causes
        // drag sluggishness because position writes trigger the effect
        // on every mousemove.
        if (lastDragNodeId !== node.id) {
          dragInstance?.destroy();
          dragInstance = null;
          lastDragNodeId = node.id;
        }

        // Walk up to find the flowCanvas data context
        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas?.viewport) return;

        // Auto-apply base class and group class
        // 'nopan' prevents d3-zoom from intercepting mousedowns on nodes
        el.classList.add('flow-node', 'nopan');
        if (node.type === 'group') {
          el.classList.add('flow-node-group');
        } else {
          el.classList.remove('flow-node-group');
        }

        // Auto-apply position (absolute for child nodes, direct for root)
        const absPos = node.parentId
          ? canvas.getAbsolutePosition(node.id)
          : (node.position ?? { x: 0, y: 0 });
        const nodeOrig = node.nodeOrigin ?? canvas._config?.nodeOrigin ?? [0, 0];
        const nw = node.dimensions?.width ?? 150;
        const nh = node.dimensions?.height ?? 40;
        el.style.left = (absPos.x - nw * nodeOrig[0]) + 'px';
        el.style.top = (absPos.y - nh * nodeOrig[1]) + 'px';

        // Auto-apply dimensions when explicitly set.
        // Height is conditional: containers (childLayout) and fixed-dim nodes need
        // inline height for child positioning or consumer-opted fixed sizing.
        // Plain leaf nodes get NO inline height — content determines height, and the
        // A1 ResizeObserver captures the natural post-render height back into
        // node.dimensions.
        if (node.dimensions) {
          // Access childLayout and fixedDimensions at the top of the effect block so
          // Alpine tracks them reactively in case they change after mount.
          const _childLayout = node.childLayout;
          const _fixedDimensions = node.fixedDimensions;
          el.style.width = node.dimensions.width + 'px';
          if (_childLayout || _fixedDimensions) {
            el.style.height = node.dimensions.height + 'px';
          } else {
            el.style.height = ''; // leaf node: let content determine height
          }
        }

        // Apply selected class reactively
        if (canvas.selectedNodes.has(node.id)) {
          el.classList.add('flow-node-selected');
        } else {
          el.classList.remove('flow-node-selected');
        }
        el.setAttribute('aria-selected', String(!!node.selected));

        // Validation state: toggle .flow-node-invalid based on _validationErrors
        if (node._validationErrors && node._validationErrors.length > 0) {
          el.classList.add('flow-node-invalid');
        } else {
          el.classList.remove('flow-node-invalid');
        }

        // Auto-apply node.class reactively (remove old, add new)
        for (const cls of prevNodeClasses) {
          el.classList.remove(cls);
        }
        const newClasses = node.class ? node.class.split(/\s+/).filter(Boolean) : [];
        for (const cls of newClasses) {
          el.classList.add(cls);
        }
        prevNodeClasses = newClasses;

        // Apply shape class reactively
        const newShape = node.shape ? `flow-node-${node.shape}` : '';
        if (prevShapeClass !== newShape) {
          if (prevShapeClass) el.classList.remove(prevShapeClass);
          if (newShape) el.classList.add(newShape);
          prevShapeClass = newShape;
        }

        // Apply inline clip-path for custom (non-built-in) shapes
        const canvasData = Alpine.$data(el.closest('[data-flow-canvas]') as HTMLElement);
        const customShapeDef = node.shape && canvasData?._shapeRegistry?.[node.shape];
        if (customShapeDef?.clipPath) {
          el.style.clipPath = customShapeDef.clipPath;
        } else {
          el.style.clipPath = '';
        }

        if (node.style) {
          const style = typeof node.style === 'string'
            ? Object.fromEntries(node.style.split(';').filter(Boolean).map(s => s.split(':').map(p => p.trim())))
            : node.style as Record<string, string>;
          const currentProps: string[] = [];
          for (const [prop, value] of Object.entries(style)) {
            if (prop && value) {
              el.style.setProperty(prop, value as string);
              currentProps.push(prop);
            }
          }
          for (const prop of prevStyleProps) {
            if (!currentProps.includes(prop)) {
              el.style.removeProperty(prop);
            }
          }
          prevStyleProps = currentProps;
        } else if (prevStyleProps.length > 0) {
          for (const prop of prevStyleProps) {
            el.style.removeProperty(prop);
          }
          prevStyleProps = [];
        }

        // Auto-apply rotation transform
        if (node.rotation) {
          el.style.transform = `rotate(${node.rotation}deg)`;
          el.style.transformOrigin = 'center';
        } else {
          el.style.transform = '';
        }

        // Keyboard focusability
        const focusable = node.focusable ?? (canvas._config?.nodesFocusable !== false);
        if (focusable) {
          el.setAttribute('tabindex', '0');
          el.setAttribute('role', node.ariaRole ?? 'group');
          el.setAttribute('aria-label', node.ariaLabel ?? (node.data?.label ? `Node: ${node.data.label}` : `Node ${node.id}`));
        } else {
          el.removeAttribute('tabindex');
          el.removeAttribute('role');
          el.removeAttribute('aria-label');
        }

        // Custom DOM attributes
        if (node.domAttributes) {
          for (const [key, val] of Object.entries(node.domAttributes)) {
            if (key.startsWith('on') || BLOCKED_ATTRS.has(key.toLowerCase())) continue;
            el.setAttribute(key, val);
          }
        }

        // Auto-apply connectable state class
        if (!isConnectable(node)) {
          el.classList.add('flow-node-no-connect');
        } else {
          el.classList.remove('flow-node-no-connect');
        }

        // Collapsed state
        if (node.collapsed) {
          el.classList.add('flow-node-collapsed');
        } else {
          el.classList.remove('flow-node-collapsed');
        }

        // Condensed state — re-measure dimensions after toggle
        const wasCondensed = el.classList.contains('flow-node-condensed');
        if (node.condensed) {
          el.classList.add('flow-node-condensed');
        } else {
          el.classList.remove('flow-node-condensed');
        }
        if (!!node.condensed !== wasCondensed) {
          requestAnimationFrame(() => {
            // Use offsetWidth/offsetHeight — unaffected by CSS transforms (rotation)
            node.dimensions = {
              width: el.offsetWidth,
              height: el.offsetHeight,
            };
            debug('condense', `Node "${node.id}" re-measured after condense toggle`, node.dimensions);
          });
        }

        // Filtered state — CSS-driven visibility (no early return)
        if (node.filtered) {
          el.classList.add('flow-node-filtered');
        } else {
          el.classList.remove('flow-node-filtered');
        }

        // Handle visibility mode
        const handlesMode = node.handles ?? 'visible';
        el.classList.remove('flow-handles-hidden', 'flow-handles-hover', 'flow-handles-select');
        if (handlesMode !== 'visible') {
          el.classList.add(`flow-handles-${handlesMode}`);
        }

        // z-index: CSS handles the common case (.flow-node: 2, .flow-node-group: 0).
        // Only set inline z-index for child nodes or explicit overrides so that
        // Alpine's :style string binding can't wipe the CSS default.
        let z = computeZIndex(node, canvas._nodeMap);
        const elevated = canvas._config?.elevateNodesOnSelect !== false && canvas.selectedNodes.has(node.id);
        if (elevated) {
          // Group nodes elevate to 1 (above other groups, below regular nodes).
          // Regular nodes get +1000 to float above everything else.
          z += node.type === 'group' ? Math.max(1 - z, 0) : 1000;
        }
        if (reorderDragActive) z += 1000;
        const cssDefault = node.type === 'group' ? 0 : 2;
        if (z !== cssDefault) {
          el.style.zIndex = String(z);
        } else {
          el.style.removeProperty('z-index');
        }

        // ── Draggable flag ─────────────────────────────────────────
        if (!isDraggable(node)) {
          el.classList.add('flow-node-locked');
          dragInstance?.destroy();
          dragInstance = null;
          return;
        }

        el.classList.remove('flow-node-locked');

        // Check for a drag handle child — if present, only that element initiates drag.
        // Note: on first render the child x-flow-drag-handle directive may not have
        // run yet, so the CSS class is also set by that directive as a fallback.
        const handleEl = el.querySelector('[data-flow-drag-handle]') as HTMLElement | null;
        if (handleEl) {
          el.classList.add('flow-node-has-handle');
        } else {
          el.classList.remove('flow-node-has-handle');
        }

        const containerEl = el.closest('.flow-container') as HTMLElement;

        // Reuse existing drag instance — only create when missing (first
        // render or after node identity change)
        if (dragInstance) return;

        dragInstance = createDrag(el, node.id, {
          container: containerEl ?? undefined,
          filterSelector: '[data-flow-drag-handle]',
          isLocked: () => canvas._animationLocked,
          noDragClassName: canvas._config?.noDragClassName ?? 'nodrag',
          dragThreshold: canvas._config?.nodeDragThreshold ?? 0,
          getViewport: () => canvas.viewport as Viewport,
          getNodePosition: () => {
            const n = canvas.getNode(node.id);
            if (!n) return { x: 0, y: 0 };
            return n.parentId
              ? canvas.getAbsolutePosition(n.id)
              : { x: n.position.x, y: n.position.y };
          },
          snapToGrid: canvas._config?.snapToGrid ?? false,

          onDragStart({ nodeId, position, sourceEvent }) {
            didDrag = false;
            dragStartSelected = false;
            groupDragStartPositions = null;
            // Mark node as dragging so collab bridge preserves local position
            const dragStartCollab = canvas._container ? collabStore.get(canvas._container) : undefined;
            if (dragStartCollab?.bridge) dragStartCollab.bridge.setDragging(nodeId, true);
            // Clean up any stale proximity state
            proximityPreviewLine?.destroy();
            proximityPreviewLine = null;
            proximityCandidate = null;
            // Clean up any stale drop target state
            if (dropTargetId && containerEl) {
              containerEl.querySelector(`[data-flow-node-id="${CSS.escape(dropTargetId)}"]`)
                ?.classList.remove('flow-node-drop-target');
            }
            dropTargetId = null;
            canvas._captureHistory?.();
            debug('drag', `Node "${nodeId}" drag start`, position);
            const n = canvas.getNode(nodeId);
            if (n) {
              // Auto-select dragged node if selectNodesOnDrag is enabled (default: true)
              if (canvas._config?.selectNodesOnDrag !== false && n.selectable !== false && !canvas.selectedNodes.has(nodeId)) {
                if (!matchesModifier(sourceEvent, canvas._shortcuts?.multiSelect)) {
                  canvas.deselectAll();
                }
                canvas.selectedNodes.add(nodeId);
                n.selected = true;
                canvas._emitSelectionChange();
                dragStartSelected = true;
              }

              canvas._emit('node-drag-start', { node: n });

              // If this node is part of a multi-selection, record starting positions
              // Exclude descendants of the dragged node — they follow via relative positioning
              if (canvas.selectedNodes.has(nodeId) && canvas.selectedNodes.size > 1) {
                const descendantIds = getDescendantIds(nodeId, canvas.nodes);
                groupDragStartPositions = new Map();
                for (const selectedId of canvas.selectedNodes) {
                  if (selectedId === nodeId || descendantIds.has(selectedId)) {
                    continue;
                  }
                  const other = canvas.getNode(selectedId);
                  if (other && other.draggable !== false) {
                    groupDragStartPositions.set(selectedId, { x: other.position.x, y: other.position.y });
                  }
                }
              }
            }

            // Start auto-pan if enabled
            if (canvas._config?.autoPanOnNodeDrag !== false && containerEl) {
                autoPan = createAutoPan({
                  container: containerEl,
                  speed: canvas._config?.autoPanSpeed ?? 15,
                  onPan(dx, dy) {
                    const zoom = canvas.viewport?.zoom || 1;

                    // Capture viewport before pan so we can measure actual delta
                    const vpBefore = { x: canvas.viewport.x, y: canvas.viewport.y };

                    // Pan the viewport (negative because CSS translate decreases to scroll right/down)
                    canvas._panZoom?.setViewport({
                      x: canvas.viewport.x - dx,
                      y: canvas.viewport.y - dy,
                      zoom,
                    });

                    // Actual delta applied (may differ from requested if translateExtent clamped it)
                    const actualDx = vpBefore.x - canvas.viewport.x;
                    const actualDy = vpBefore.y - canvas.viewport.y;

                    // If viewport didn't move at all, it's fully clamped by translateExtent
                    const vpHitBoundary = (actualDx === 0 && actualDy === 0);

                    // Compensate node position by actual viewport delta only
                    const currentNode = canvas.getNode(nodeId);
                    let nodeHitBoundary = false;
                    if (currentNode) {
                      const prevX = currentNode.position.x;
                      const prevY = currentNode.position.y;
                      currentNode.position.x += actualDx / zoom;
                      currentNode.position.y += actualDy / zoom;

                      // Clamp after auto-pan adjustment
                      const apClamped = clampRootNodePosition(currentNode.position, currentNode, canvas._config?.nodeExtent);
                      currentNode.position.x = apClamped.x;
                      currentNode.position.y = apClamped.y;

                      // Check if node position actually changed
                      nodeHitBoundary = (currentNode.position.x === prevX && currentNode.position.y === prevY);
                    }

                    // Move other selected nodes by actual delta too
                    if (groupDragStartPositions) {
                      for (const [otherId] of groupDragStartPositions) {
                        const other = canvas.getNode(otherId);
                        if (other) {
                          other.position.x += actualDx / zoom;
                          other.position.y += actualDy / zoom;

                          // Clamp after auto-pan adjustment
                          const gpClamped = clampRootNodePosition(other.position, other, canvas._config?.nodeExtent);
                          other.position.x = gpClamped.x;
                          other.position.y = gpClamped.y;
                        }
                      }
                    }

                    // Stop auto-pan if both viewport and node are at boundary
                    return vpHitBoundary && nodeHitBoundary;
                  },
                });
                // Initialize pointer position from the mousedown event so auto-pan
                // doesn't start with (0,0) — which is at the container edge and
                // would trigger immediate unwanted panning.
                if (sourceEvent instanceof MouseEvent) {
                  autoPan.updatePointer(sourceEvent.clientX, sourceEvent.clientY);
                }
                autoPan.start();
            }
          },

          onDrag({ nodeId, position, delta, sourceEvent }) {
            didDrag = true;
            const n = canvas.getNode(nodeId);
            if (n) {
              // For child nodes, convert absolute drag position to relative
              if (n.parentId) {
                const parentAbs = canvas.getAbsolutePosition(n.parentId);
                let relX = position.x - parentAbs.x;
                let relY = position.y - parentAbs.y;

                const childDims = n.dimensions ?? { width: 150, height: 50 };
                const parent = canvas.getNode(n.parentId);

                // ── Layout-parent reorder drag ────────────────────────────────
                if (parent?.childLayout) {
                  if (!reorderDragActive) {
                    el.classList.add('flow-reorder-dragging');
                    reorderParentId = n.parentId!;
                  }
                  reorderDragActive = true;
                  reorderExcludeId = nodeId;

                  // Position the dragged node freely (it's "lifted out" of flow).
                  // Nodes with extent: 'parent' stay clamped (locked to parent).
                  const canEscapeParent = n.extent !== 'parent';
                  n.position.x = position.x - parentAbs.x;
                  n.position.y = position.y - parentAbs.y;
                  if (!canEscapeParent && parent.dimensions) {
                    const clamped = clampToParent({ x: n.position.x, y: n.position.y }, childDims, parent.dimensions);
                    n.position.x = clamped.x;
                    n.position.y = clamped.y;
                  }

                  const dragW = n.dimensions?.width ?? 150;
                  const dragH = n.dimensions?.height ?? 50;

                  // ── Drop-target detection during reorder ──────────────────────
                  // Run BEFORE swap detection so reorderParentId is current.
                  if (canEscapeParent) {
                    const pw = parent.dimensions?.width ?? 150;
                    const ph = parent.dimensions?.height ?? 50;
                    const relCx = n.position.x + dragW / 2;
                    const relCy = n.position.y + dragH / 2;
                    // Hysteresis: require the center to be further inside to
                    // *enter* a target than to *stay* inside. Prevents jitter
                    // when the cursor hovers near a boundary.
                    const HYSTERESIS = 12;
                    // If already inside the original parent, use full bounds (easy to stay).
                    // If re-entering, require center to be inset by HYSTERESIS.
                    const pInset = reorderParentId === n.parentId ? 0 : HYSTERESIS;
                    const insideParent = relCx >= pInset && relCx <= pw - pInset
                      && relCy >= pInset && relCy <= ph - pInset;

                    // Build ancestor set — always exclude when inside parent,
                    // only exclude immediate parent when outside.
                    const ancestorIds = new Set<string>();
                    let walkId: string | undefined = n.parentId;
                    while (walkId) {
                      ancestorIds.add(walkId);
                      walkId = canvas.getNode(walkId)?.parentId;
                    }

                    const absCx = position.x + dragW / 2;
                    const absCy = position.y + dragH / 2;
                    const dragDescendants = getDescendantIds(n.id, canvas.nodes);
                    let bestTarget: FlowNode | null = null;

                    // When inside the original parent, exclude all ancestors
                    // (can only target non-ancestor groups like siblings).
                    // When outside, exclude only the immediate parent so the
                    // node can reach ancestor levels (e.g. Step 1).
                    // Also honour acceptsDrop predicates on targets.
                    const droppables = canvas.nodes.filter(
                      (o: FlowNode) => o.id !== n.id
                        && (o.droppable || o.childLayout) && !o.hidden
                        && !dragDescendants.has(o.id)
                        && (insideParent ? !ancestorIds.has(o.id) : o.id !== n.parentId)
                        && (!o.acceptsDrop || o.acceptsDrop(n)),
                    );

                    for (const d of droppables) {
                      const dAbsPos = d.parentId ? canvas.getAbsolutePosition(d.id) : d.position;
                      const dw = d.dimensions?.width ?? 150;
                      const dh = d.dimensions?.height ?? 50;
                      // Hysteresis: current target uses full bounds (easy to stay),
                      // other targets require center inset by HYSTERESIS (harder to enter).
                      const inset = d.id === dropTargetId ? 0 : HYSTERESIS;
                      if (absCx >= dAbsPos.x + inset && absCx <= dAbsPos.x + dw - inset
                        && absCy >= dAbsPos.y + inset && absCy <= dAbsPos.y + dh - inset) {
                        bestTarget = d;
                      }
                    }

                    const newTargetId = bestTarget?.id ?? null;
                    if (newTargetId !== dropTargetId) {
                      if (dropTargetId && containerEl) {
                        containerEl.querySelector(`[data-flow-node-id="${CSS.escape(dropTargetId)}"]`)
                          ?.classList.remove('flow-node-drop-target');
                      }
                      if (newTargetId && containerEl) {
                        containerEl.querySelector(`[data-flow-node-id="${CSS.escape(newTargetId)}"]`)
                          ?.classList.add('flow-node-drop-target');
                      }
                      dropTargetId = newTargetId;

                      // ── Cross-parent reorder: switch active layout parent ──
                      const newTarget = newTargetId ? canvas.getNode(newTargetId) : null;
                      const prevReorderParent = reorderParentId;

                      if (newTarget?.childLayout && newTargetId !== reorderParentId) {
                        // Hovering over a new layout group — switch swap detection.
                        // Old parent: omit dragged node entirely so it shrinks.
                        if (prevReorderParent) {
                          canvas.layoutChildren(prevReorderParent, { omitFromComputation: nodeId, shallow: true });
                          canvas.propagateLayoutUp(prevReorderParent, { omitFromComputation: nodeId });
                        }
                        reorderParentId = newTargetId;
                        // Assign order at end of new parent's sibling list
                        const newSiblings = canvas.nodes
                          .filter((s: FlowNode) => s.parentId === newTargetId && s.id !== nodeId)
                          .sort((a: FlowNode, b: FlowNode) => (a.order ?? Infinity) - (b.order ?? Infinity));
                        const insertIdx = newSiblings.length;
                        const ordered: FlowNode[] = [...newSiblings];
                        ordered.splice(insertIdx, 0, n);
                        for (let i = 0; i < ordered.length; i++) {
                          ordered[i].order = i;
                        }
                        reorderLastIdx = insertIdx;
                        // New parent: include dragged node in computation (grows)
                        // but don't apply its position (it's being dragged freely).
                        // Reset dimensions to initial/default so stretched size from
                        // the old parent doesn't inflate the new parent.
                        const initDims = canvas._initialDimensions?.get(nodeId);
                        const previewNode = { ...n, dimensions: initDims ? { ...initDims } : undefined };
                        canvas.layoutChildren(newTargetId, { excludeId: nodeId, includeNode: previewNode, shallow: true });
                        canvas.propagateLayoutUp(newTargetId, { includeNode: previewNode });
                      } else if (insideParent && reorderParentId !== n.parentId) {
                        // Re-entered the original parent
                        if (prevReorderParent && prevReorderParent !== n.parentId) {
                          canvas.layoutChildren(prevReorderParent, { omitFromComputation: nodeId, shallow: true });
                          canvas.propagateLayoutUp(prevReorderParent, { omitFromComputation: nodeId });
                        }
                        reorderParentId = n.parentId!;
                        reorderLastIdx = -1;
                      } else if (!newTargetId && !insideParent) {
                        // Outside all groups — free float, no layout
                        if (prevReorderParent) {
                          canvas.layoutChildren(prevReorderParent, { omitFromComputation: nodeId, shallow: true });
                          canvas.propagateLayoutUp(prevReorderParent, { omitFromComputation: nodeId });
                        }
                        reorderParentId = null;
                        reorderLastIdx = -1;
                      }
                    }
                  }

                  // ── Swap detection among siblings ─────────────────────────────
                  // Only runs when hovering over a layout group. When
                  // reorderParentId is null the node is free-floating.
                  if (reorderParentId) {
                    const activeReorderParent = canvas.getNode(reorderParentId);
                    const activeLayout = activeReorderParent?.childLayout ?? parent.childLayout;
                    const siblings = canvas.nodes
                      .filter((s: FlowNode) => s.parentId === reorderParentId && s.id !== nodeId)
                      .sort((a: FlowNode, b: FlowNode) => (a.order ?? Infinity) - (b.order ?? Infinity));

                    // Compute drag position in the active reorder parent's space.
                    // n.position is relative to the actual parent, so when the
                    // active reorder parent differs we convert from absolute.
                    let dragPosX: number, dragPosY: number;
                    if (reorderParentId !== n.parentId) {
                      const activeParentAbs = activeReorderParent?.parentId
                        ? canvas.getAbsolutePosition(reorderParentId)
                        : activeReorderParent?.position ?? { x: 0, y: 0 };
                      dragPosX = position.x - activeParentAbs.x;
                      dragPosY = position.y - activeParentAbs.y;
                    } else {
                      dragPosX = n.position.x;
                      dragPosY = n.position.y;
                    }

                    // Find which sibling slot the dragged node should occupy.
                    //
                    // Swap detection inspired by SortableJS (MIT, RubaXa/owenm).
                    // Uses directional thresholds with leading-edge comparison:
                    //   - Downward/rightward: dragged node's bottom/right edge vs
                    //     sibling's threshold point from the top/left.
                    //   - Upward/leftward: dragged node's top/left edge vs
                    //     sibling's inverted threshold point (from the bottom/right).
                    // This ensures the threshold represents actual overlap fraction
                    // regardless of the dragged node's size, and mirrors SortableJS's
                    // inverted swap zones that prevent swap glitching.
                    // See: https://github.com/SortableJS/Sortable/wiki/Swap-Thresholds-and-Direction
                    const threshold = activeLayout!.swapThreshold ?? 0.5;

                    // Initialise reorderLastIdx on first drag from the node's order
                    // so we don't fire a redundant layout and so the directional
                    // threshold inversion picks the right side from the start.
                    if (reorderLastIdx === -1) {
                      if (reorderParentId === n.parentId) {
                        const myOrder = n.order ?? 0;
                        reorderLastIdx = siblings.filter((s: FlowNode) => (s.order ?? 0) < myOrder).length;
                      } else {
                        // Entering a new parent — default to end slot
                        reorderLastIdx = siblings.length;
                      }
                    }

                    const curIdx = reorderLastIdx;
                    let targetIdx = siblings.length; // default: end
                    for (let i = 0; i < siblings.length; i++) {
                      const sib = siblings[i];
                      const sibW = sib.dimensions?.width ?? 150;
                      const sibH = sib.dimensions?.height ?? 50;
                      // Invert threshold for siblings above/left of the current slot
                      // so both directions require the same penetration fraction.
                      const t = i < curIdx ? (1 - threshold) : threshold;
                      const swapY = sib.position.y + sibH * t;
                      const swapX = sib.position.x + sibW * t;

                      if (activeLayout!.direction === 'grid') {
                        const dragCenter = {
                          x: dragPosX + dragW / 2,
                          y: dragPosY + dragH / 2,
                        };
                        const sibCenterY = sib.position.y + sibH / 2;
                        if (dragCenter.y < sib.position.y) { targetIdx = i; break; }
                        if (Math.abs(dragCenter.y - sibCenterY) < sibH / 2 && dragCenter.x < swapX) { targetIdx = i; break; }
                      } else if (activeLayout!.direction === 'vertical') {
                        // Use leading edge: top when moving up, bottom when moving down
                        const edge = i < curIdx ? dragPosY : dragPosY + dragH;
                        if (edge < swapY) { targetIdx = i; break; }
                      } else {
                        const edge = i < curIdx ? dragPosX : dragPosX + dragW;
                        if (edge < swapX) { targetIdx = i; break; }
                      }
                    }

                    // Only re-layout when the target slot actually changes
                    if (targetIdx !== reorderLastIdx) {
                      reorderLastIdx = targetIdx;

                      // Reassign order values with the dragged node at targetIdx
                      const ordered: FlowNode[] = [...siblings];
                      ordered.splice(targetIdx, 0, n);
                      for (let i = 0; i < ordered.length; i++) {
                        ordered[i].order = i;
                      }

                      // Defer sibling layout to next frame so the dragged node stays
                      // responsive — position writes don't block the current mousemove.
                      const reorderContainer = el.closest('.flow-container') as HTMLElement;
                      reorderContainer?.classList.add('flow-layout-animating');

                      if (canvas._layoutAnimFrame) cancelAnimationFrame(canvas._layoutAnimFrame);
                      const draggedId = n.id;
                      const layoutParentId = reorderParentId;
                      const isCrossParent = layoutParentId !== n.parentId;
                      canvas._layoutAnimFrame = requestAnimationFrame(() => {
                        if (isCrossParent && layoutParentId) {
                          // Cross-parent: include dragged node in target parent's
                          // computation (it grows), skip applying its position.
                          // Use initial/default dimensions so stretched size from
                          // the old parent doesn't inflate the new parent.
                          const draggedNode = canvas.getNode(draggedId);
                          let previewDrag: FlowNode | undefined;
                          if (draggedNode) {
                            const initD = canvas._initialDimensions?.get(draggedId);
                            previewDrag = { ...draggedNode, dimensions: initD ? { ...initD } : undefined };
                          }
                          canvas.layoutChildren(layoutParentId, {
                            excludeId: draggedId,
                            includeNode: previewDrag,
                            shallow: true,
                          });
                          canvas.propagateLayoutUp(layoutParentId, {
                            includeNode: previewDrag,
                          });
                        } else {
                          // Same-parent reorder: exclude dragged from position
                          // but keep it in computation
                          canvas.layoutChildren(layoutParentId, draggedId, true);
                        }

                        // Continue ticking edge re-measurement while CSS transitions run
                        const animStart = performance.now();
                        const animDuration = 300;
                        const tickEdges = () => {
                          canvas._layoutAnimTick++;
                          if (performance.now() - animStart < animDuration) {
                            canvas._layoutAnimFrame = requestAnimationFrame(tickEdges);
                          } else {
                            canvas._layoutAnimFrame = 0;
                          }
                        };
                        canvas._layoutAnimFrame = requestAnimationFrame(tickEdges);
                      });
                    }
                  }

                  // Feed pointer position to auto-pan
                  if (autoPan && sourceEvent instanceof MouseEvent) {
                    autoPan.updatePointer(sourceEvent.clientX, sourceEvent.clientY);
                  }

                  return; // Skip normal child drag logic
                }

                // Clamp to parent bounds if extent === 'parent'
                if (n.extent === 'parent' && parent?.dimensions) {
                  const clamped = clampToParent(
                    { x: relX, y: relY },
                    childDims,
                    parent.dimensions,
                  );
                  relX = clamped.x;
                  relY = clamped.y;
                } else if (Array.isArray(n.extent)) {
                  // Per-node coordinate extent in local (relative) space
                  const clamped = clampToExtent({ x: relX, y: relY }, n.extent as CoordinateExtent, childDims);
                  relX = clamped.x;
                  relY = clamped.y;
                }

                // preventChildEscape: clamp to parent bounds (stronger than extent: 'parent')
                if (!n.extent || n.extent !== 'parent') {
                  const parentRules = resolveChildValidation(
                    parent!,
                    canvas._config?.childValidationRules ?? {},
                  );
                  const preventEscape = parentRules?.preventChildEscape || !!parent?.childLayout;
                  if (preventEscape && parent?.dimensions) {
                    const clamped = clampToParent(
                      { x: relX, y: relY },
                      childDims,
                      parent.dimensions,
                    );
                    relX = clamped.x;
                    relY = clamped.y;
                  }
                }

                // Expand parent if expandParent is set
                if (n.expandParent && parent?.dimensions) {
                  const expanded = expandParentToFitChild(
                    { x: relX, y: relY },
                    childDims,
                    parent.dimensions,
                  );
                  if (expanded) {
                    parent.dimensions.width = expanded.width;
                    parent.dimensions.height = expanded.height;
                  }
                }

                n.position.x = relX;
                n.position.y = relY;
              } else {
                // Root node: apply per-node or global nodeExtent
                const clamped = clampRootNodePosition(position, n, canvas._config?.nodeExtent);
                n.position.x = clamped.x;
                n.position.y = clamped.y;
              }

              // When snapping to grid, the position jumps between grid points.
              // Flush the node's CSS position and bump edge re-measurement so
              // edges update immediately on the snap frame.
              if (canvas._config?.snapToGrid) {
                const nodeOrig = n.nodeOrigin ?? canvas._config?.nodeOrigin ?? [0, 0];
                const nw = n.dimensions?.width ?? 150;
                const nh = n.dimensions?.height ?? 40;
                const absPos = n.parentId ? canvas.getAbsolutePosition(n.id) : n.position;
                el.style.left = (absPos.x - nw * nodeOrig[0]) + 'px';
                el.style.top = (absPos.y - nh * nodeOrig[1]) + 'px';
                canvas._layoutAnimTick++;
              }

              canvas._emit('node-drag', { node: n, position });

              // Move other selected nodes by the same delta
              if (groupDragStartPositions) {
                for (const [otherId, startPos] of groupDragStartPositions) {
                  const other = canvas.getNode(otherId);
                  if (other) {
                    let newX = startPos.x + delta.x;
                    let newY = startPos.y + delta.y;

                    const otherClamped = clampRootNodePosition({ x: newX, y: newY }, other, canvas._config?.nodeExtent);
                    other.position.x = otherClamped.x;
                    other.position.y = otherClamped.y;
                  }
                }
              }

              // ── Helper lines ──────────────────────────────────────
              const hlConfig = canvas._config?.helperLines;
              if (hlConfig) {
                const hlSnap = typeof hlConfig === 'object' ? (hlConfig.snap ?? true) : true;
                const hlThreshold = typeof hlConfig === 'object' ? (hlConfig.threshold ?? 5) : 5;

                // Resolve absolute position for a node (child nodes store relative positions)
                const absBox = (nd: FlowNode): NodeBox => {
                  const pos = nd.parentId ? canvas.getAbsolutePosition(nd.id) : nd.position;
                  return nodeToBox({ ...nd, position: pos }, canvas._config?.nodeOrigin);
                };

                // Build dragged box (single node or selection group bounding box)
                const draggedNodes = (canvas.selectedNodes.size > 1 && canvas.selectedNodes.has(nodeId))
                  ? canvas.nodes.filter((nd: FlowNode) => canvas.selectedNodes.has(nd.id))
                  : [n];
                const draggedBoxes = draggedNodes.map(absBox);
                const draggedBox: NodeBox = {
                  id: nodeId,
                  x: Math.min(...draggedBoxes.map((b: NodeBox) => b.x)),
                  y: Math.min(...draggedBoxes.map((b: NodeBox) => b.y)),
                  width: Math.max(...draggedBoxes.map((b: NodeBox) => b.x + b.width)) - Math.min(...draggedBoxes.map((b: NodeBox) => b.x)),
                  height: Math.max(...draggedBoxes.map((b: NodeBox) => b.y + b.height)) - Math.min(...draggedBoxes.map((b: NodeBox) => b.y)),
                };

                // Other nodes (not in selection)
                const otherBoxes = (canvas.nodes as FlowNode[])
                  .filter((nd: FlowNode) =>
                    !canvas.selectedNodes.has(nd.id) &&
                    nd.id !== nodeId &&
                    nd.hidden !== true &&
                    nd.filtered !== true
                  )
                  .map(absBox);

                const result = computeHelperLines(draggedBox, otherBoxes, hlThreshold);

                // Apply snap offset
                if (hlSnap && (result.snapOffset.x !== 0 || result.snapOffset.y !== 0)) {
                  n.position.x += result.snapOffset.x;
                  n.position.y += result.snapOffset.y;
                  // Also offset group members
                  if (groupDragStartPositions) {
                    for (const [otherId] of groupDragStartPositions) {
                      const other = canvas.getNode(otherId);
                      if (other) {
                        other.position.x += result.snapOffset.x;
                        other.position.y += result.snapOffset.y;
                      }
                    }
                  }
                }

                // Render guide lines
                helperLinesSvg?.remove();
                if (result.horizontal.length > 0 || result.vertical.length > 0) {
                  const viewportEl = containerEl?.querySelector('.flow-viewport');
                  if (viewportEl) {
                    const allBoxes = (canvas.nodes as FlowNode[]).map(absBox);
                    helperLinesSvg = renderHelperLines(result.horizontal, result.vertical, allBoxes);
                    viewportEl.appendChild(helperLinesSvg);
                  }
                } else {
                  helperLinesSvg = null;
                }

                canvas._emit('helper-lines-change', {
                  horizontal: result.horizontal,
                  vertical: result.vertical,
                });
              }
            }

            // ── Collision prevention ──────────────────────────────────
            if (canvas._config?.preventOverlap) {
              const gap = typeof canvas._config.preventOverlap === 'number' ? canvas._config.preventOverlap : 5;
              const nw = n.dimensions?.width ?? DEFAULT_NODE_WIDTH;
              const nh = n.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
              const selectedIds = canvas.selectedNodes as Set<string>;
              const otherRects = canvas.nodes
                .filter((o: FlowNode) => o.id !== n.id && !o.hidden && !selectedIds.has(o.id))
                .map((o: FlowNode) => getNodeRect(o, canvas._config?.nodeOrigin));
              const clamped = clampToAvoidOverlap(n.position, nw, nh, otherRects, gap);
              n.position.x = clamped.x;
              n.position.y = clamped.y;
            }

            // ── Drop-target detection (reparent on drop) ──────────────────
            if (!n.parentId) {
              // Root node: check for droppable group targets (exclude own descendants)
              const dragDescendants = getDescendantIds(n.id, canvas.nodes);
              const droppables = canvas.nodes.filter(
                (o: FlowNode) => o.id !== n.id && o.droppable && !o.hidden
                  && !dragDescendants.has(o.id)
                  && (!o.acceptsDrop || o.acceptsDrop(n)),
              );
              const absRect = getNodeRect(n, canvas._config?.nodeOrigin);
              // When multiple droppables overlap, last-wins; topological order
              // puts children after parents, so inner groups win over outer groups.
              let bestTarget: FlowNode | null = null;
              const DROP_HYSTERESIS = 12;
              for (const d of droppables) {
                // Use absolute position for nested droppable groups
                const dAbsPos = d.parentId ? canvas.getAbsolutePosition(d.id) : d.position;
                const dw = d.dimensions?.width ?? DEFAULT_NODE_WIDTH;
                const dh = d.dimensions?.height ?? DEFAULT_NODE_HEIGHT;
                // Check if the dragged node's center is inside the droppable.
                // Hysteresis: current target uses full bounds, others require inset.
                const cx = absRect.x + absRect.width / 2;
                const cy = absRect.y + absRect.height / 2;
                const inset = d.id === dropTargetId ? 0 : DROP_HYSTERESIS;
                if (cx >= dAbsPos.x + inset && cx <= dAbsPos.x + dw - inset
                  && cy >= dAbsPos.y + inset && cy <= dAbsPos.y + dh - inset) {
                  bestTarget = d;
                }
              }

              const newTargetId = bestTarget?.id ?? null;
              if (newTargetId !== dropTargetId) {
                // Remove old highlight
                if (dropTargetId && containerEl) {
                  const oldEl = containerEl.querySelector(`[data-flow-node-id="${CSS.escape(dropTargetId)}"]`);
                  oldEl?.classList.remove('flow-node-drop-target');
                }
                // Add new highlight
                if (newTargetId && containerEl) {
                  const newEl = containerEl.querySelector(`[data-flow-node-id="${CSS.escape(newTargetId)}"]`);
                  newEl?.classList.add('flow-node-drop-target');
                }
                dropTargetId = newTargetId;
              }
            }

            // ── Proximity Connect preview ────────────────────────────────
            if (canvas._config?.proximityConnect) {
              const threshold = canvas._config.proximityConnectDistance ?? 150;
              const draggedDims = n.dimensions ?? { width: 150, height: 50 };
              const draggedCenter = {
                x: n.position.x + draggedDims.width / 2,
                y: n.position.y + draggedDims.height / 2,
              };

              const allCenters = canvas.nodes
                .filter((o: FlowNode) => o.id !== n.id && !o.hidden)
                .map((o: FlowNode) => ({
                  id: o.id,
                  center: {
                    x: o.position.x + (o.dimensions?.width ?? 150) / 2,
                    y: o.position.y + (o.dimensions?.height ?? 50) / 2,
                  },
                }));

              const candidate = findProximityCandidate(n.id, draggedCenter, allCenters, threshold);

              if (candidate) {
                // Check if edge already exists between this pair
                const edgeExists = canvas.edges.some(
                  (e: FlowEdge) =>
                    (e.source === candidate.source && e.target === candidate.target) ||
                    (e.source === candidate.target && e.target === candidate.source),
                );

                if (!edgeExists) {
                  proximityCandidate = candidate;

                  // Show/update preview line
                  if (!proximityPreviewLine) {
                    proximityPreviewLine = createConnectionLine({
                      connectionLineType: canvas._config?.connectionLineType,
                      connectionLineStyle: canvas._config?.connectionLineStyle,
                      connectionLine: canvas._config?.connectionLine,
                    });
                    const viewportEl = containerEl?.querySelector('.flow-viewport');
                    if (viewportEl) viewportEl.appendChild(proximityPreviewLine.svg);
                  }

                  proximityPreviewLine.update({
                    fromX: draggedCenter.x, fromY: draggedCenter.y,
                    toX: candidate.targetCenter.x, toY: candidate.targetCenter.y,
                    source: candidate.source,
                  });
                } else {
                  proximityPreviewLine?.destroy();
                  proximityPreviewLine = null;
                  proximityCandidate = null;
                }
              } else {
                proximityPreviewLine?.destroy();
                proximityPreviewLine = null;
                proximityCandidate = null;
              }
            }

            // Sync position and cursor to collab peers
            const dragCollab = canvas._container ? collabStore.get(canvas._container) : undefined;
            if (dragCollab?.bridge) {
              dragCollab.bridge.pushLocalNodeUpdate(nodeId, { position: n.position });
              if (groupDragStartPositions) {
                for (const [otherId] of groupDragStartPositions) {
                  const other = canvas.getNode(otherId);
                  if (other) {
                    dragCollab.bridge.pushLocalNodeUpdate(otherId, { position: other.position });
                  }
                }
              }
              // Update cursor position during drag — the container's mousemove
              // listener doesn't fire while d3-drag captures pointer events.
              if (dragCollab.awareness && sourceEvent instanceof MouseEvent && canvas._container) {
                const rect = canvas._container.getBoundingClientRect();
                const cx = (sourceEvent.clientX - rect.left - canvas.viewport.x) / canvas.viewport.zoom;
                const cy = (sourceEvent.clientY - rect.top - canvas.viewport.y) / canvas.viewport.zoom;
                dragCollab.awareness.updateCursor({ x: cx, y: cy });
              }
            }

            // Feed pointer position to auto-pan
            if (autoPan && sourceEvent instanceof MouseEvent) {
              autoPan.updatePointer(sourceEvent.clientX, sourceEvent.clientY);
            }
          },

          onDragEnd({ nodeId, position }) {
            debug('drag', `Node "${nodeId}" drag end`, position);

            // Unmark node as dragging so collab bridge resumes normal sync
            const dragEndCollab = canvas._container ? collabStore.get(canvas._container) : undefined;
            if (dragEndCollab?.bridge) dragEndCollab.bridge.setDragging(nodeId, false);

            // Stop auto-pan
            autoPan?.stop();
            autoPan = null;

            // Clean up helper lines
            helperLinesSvg?.remove();
            helperLinesSvg = null;
            if (canvas._config?.helperLines) {
              canvas._emit('helper-lines-change', { horizontal: [], vertical: [] });
            }

            const n = canvas.getNode(nodeId);
            if (n) {
              canvas._emit('node-drag-end', { node: n, position });
            }

            // ── Layout-parent reorder: snap to layout slot or reparent ───
            if (reorderDragActive && n?.parentId) {
              el.classList.remove('flow-reorder-dragging');
              const wasReorderParent = reorderParentId;
              reorderDragActive = false;
              reorderExcludeId = null;
              reorderLastIdx = -1;
              reorderParentId = null;

              // Stop animation tick loop and remove animation class before final
              // layout so DOM updates instantly and edges measure correct positions
              if (canvas._layoutAnimFrame) { cancelAnimationFrame(canvas._layoutAnimFrame); canvas._layoutAnimFrame = 0; }
              const reorderContainer = el.closest('.flow-container') as HTMLElement;
              reorderContainer?.classList.remove('flow-layout-animating');

              // If dragged over a drop target, reparent (layout runs inside reparentNode)
              if (dropTargetId) {
                if (containerEl) {
                  containerEl.querySelector(`[data-flow-node-id="${CSS.escape(dropTargetId)}"]`)
                    ?.classList.remove('flow-node-drop-target');
                }
                canvas.reparentNode(nodeId, dropTargetId);
                dropTargetId = null;
              } else if (wasReorderParent && wasReorderParent !== n.parentId) {
                // Was previewing in another group but dropped outside all
                // targets — fully remove from temp parent and snap back to own parent
                canvas.layoutChildren(wasReorderParent, { omitFromComputation: nodeId, shallow: true });
                canvas.propagateLayoutUp(wasReorderParent, { omitFromComputation: nodeId });
                canvas.layoutChildren(n.parentId);
                canvas._emit('child-reorder', {
                  nodeId,
                  parentId: n.parentId,
                  order: n.order,
                });
              } else {
                // Snap back into layout slot (or was free-floating)
                canvas.layoutChildren(n.parentId);
                canvas._emit('child-reorder', {
                  nodeId,
                  parentId: n.parentId,
                  order: n.order,
                });
              }

              groupDragStartPositions = null;
              didDrag = false;
              return; // Skip normal onDragEnd logic
            }

            // ── Reparent on drop / detach on drag-out ─────────────────────
            if (n && dropTargetId) {
              // Clean up drop target highlight
              if (containerEl) {
                const targetEl = containerEl.querySelector(`[data-flow-node-id="${CSS.escape(dropTargetId)}"]`);
                targetEl?.classList.remove('flow-node-drop-target');
              }
              canvas.reparentNode(nodeId, dropTargetId);
              dropTargetId = null;
            } else if (n && n.parentId && !dropTargetId) {
              // Check if child was dragged outside parent bounds (detach)
              const parentRules = resolveChildValidation(
                canvas.getNode(n.parentId)!,
                canvas._config?.childValidationRules ?? {},
              );
              const detachParent = canvas.getNode(n.parentId);
              if (!parentRules?.preventChildEscape && !detachParent?.childLayout) {
                if (detachParent?.dimensions) {
                  const relX = n.position.x;
                  const relY = n.position.y;
                  const childW = n.dimensions?.width ?? 150;
                  const childH = n.dimensions?.height ?? 50;
                  const outside =
                    relX + childW < 0 ||
                    relY + childH < 0 ||
                    relX > detachParent.dimensions.width ||
                    relY > detachParent.dimensions.height;
                  if (outside) {
                    canvas.reparentNode(nodeId, null);
                  }
                }
              }
              dropTargetId = null;
            } else {
              // Clean up in case drop target was set but node doesn't exist
              if (dropTargetId && containerEl) {
                const targetEl = containerEl.querySelector(`[data-flow-node-id="${CSS.escape(dropTargetId)}"]`);
                targetEl?.classList.remove('flow-node-drop-target');
              }
              dropTargetId = null;
            }

            // ── Proximity Connect: create edge on drop ────────────────────
            if (canvas._config?.proximityConnect && proximityCandidate) {
              const cand = proximityCandidate;
              proximityPreviewLine?.destroy();
              proximityPreviewLine = null;
              proximityCandidate = null;

              // Check callback
              let allowed = true;
              if (canvas._config.onProximityConnect) {
                const result = canvas._config.onProximityConnect({
                  source: cand.source,
                  target: cand.target,
                  distance: cand.distance,
                });
                if (result === false) allowed = false;
              }

              if (allowed) {
                const connection = {
                  source: cand.source,
                  sourceHandle: 'source',
                  target: cand.target,
                  targetHandle: 'target',
                };

                // Run validation chain
                if (isValidConnection(connection, canvas.edges, { preventCycles: canvas._config?.preventCycles })) {
                  const isHandleOk = containerEl ? checkHandleLimits(containerEl, connection, canvas.edges) : true;
                  const isValidatorOk = containerEl ? runHandleValidators(containerEl, connection) : true;
                  const isCustomOk = !canvas._config.isValidConnection || canvas._config.isValidConnection(connection);

                  if (isHandleOk && isValidatorOk && isCustomOk) {
                    // Optional confirmation animation
                    if (canvas._config.proximityConnectConfirm) {
                      const srcEl = containerEl?.querySelector(`[data-flow-node-id="${CSS.escape(cand.source)}"]`);
                      const tgtEl = containerEl?.querySelector(`[data-flow-node-id="${CSS.escape(cand.target)}"]`);
                      srcEl?.classList.add('flow-proximity-confirm');
                      tgtEl?.classList.add('flow-proximity-confirm');
                      setTimeout(() => {
                        srcEl?.classList.remove('flow-proximity-confirm');
                        tgtEl?.classList.remove('flow-proximity-confirm');
                      }, 400);
                    }

                    const edgeId = `e-${cand.source}-${cand.target}-${Date.now()}-${proximityEdgeCounter++}`;
                    canvas.addEdges({ id: edgeId, ...connection });
                    canvas._emit('connect', { connection });
                  }
                }
              }
            } else {
              // Clean up preview if drag ended without candidate
              proximityPreviewLine?.destroy();
              proximityPreviewLine = null;
              proximityCandidate = null;
            }

            groupDragStartPositions = null;
            // Reset so the next click isn't treated as a drag.
            // d3-drag already suppresses the click event immediately
            // after a real drag, so this is safe.
            didDrag = false;
          },
        });
      });

      // ── Easy Connect: modifier key + drag starts a connection ──────
      {
        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (canvas?._config?.easyConnect) {
          const easyConnectKey = canvas._config.easyConnectKey ?? 'alt';

          const onEasyConnectPointerDown = (e: PointerEvent) => {
            if (!isEasyConnectKey(e, easyConnectKey)) return;
            // Don't intercept if target is a handle (let normal handle logic run)
            if ((e.target as HTMLElement).closest('[data-flow-handle-type]')) return;

            const currentCanvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
            if (!currentCanvas) return;
            if (currentCanvas._animationLocked) return;

            const node = evaluate(expression) as FlowNode;
            if (!node) return;

            const sourceNode = currentCanvas.getNode(node.id);
            if (!sourceNode || sourceNode.connectable === false) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Find nearest source handle or use node center
            const sourceHandle = findNearestSourceHandle(el, e.clientX, e.clientY);
            const handleId = sourceHandle?.dataset.flowHandleId ?? 'source';

            el.classList.add('flow-easy-connecting');

            const containerEl = el.closest('.flow-container') as HTMLElement;
            if (!containerEl) return;

            // Compute source position (handle center or node center)
            const initZoom = currentCanvas.viewport?.zoom || 1;
            const initVpX = currentCanvas.viewport?.x || 0;
            const initVpY = currentCanvas.viewport?.y || 0;
            const initContainerRect = containerEl.getBoundingClientRect();

            let sourceX: number, sourceY: number;
            if (sourceHandle) {
              const handleRect = sourceHandle.getBoundingClientRect();
              sourceX = (handleRect.left + handleRect.width / 2 - initContainerRect.left - initVpX) / initZoom;
              sourceY = (handleRect.top + handleRect.height / 2 - initContainerRect.top - initVpY) / initZoom;
            } else {
              const nodeRect = el.getBoundingClientRect();
              sourceX = (nodeRect.left + nodeRect.width / 2 - initContainerRect.left - initVpX) / initZoom;
              sourceY = (nodeRect.top + nodeRect.height / 2 - initContainerRect.top - initVpY) / initZoom;
            }

            currentCanvas._emit('connect-start', { source: node.id, sourceHandle: handleId });

            const connectionLineInstance = createConnectionLine({
              connectionLineType: currentCanvas._config?.connectionLineType,
              connectionLineStyle: currentCanvas._config?.connectionLineStyle,
              connectionLine: currentCanvas._config?.connectionLine,
            });
            const viewportEl = containerEl.querySelector('.flow-viewport');
            if (viewportEl) viewportEl.appendChild(connectionLineInstance.svg);

            connectionLineInstance.update({ fromX: sourceX, fromY: sourceY, toX: sourceX, toY: sourceY, source: node.id, sourceHandle: handleId });

            currentCanvas.pendingConnection = { source: node.id, sourceHandle: handleId, position: { x: sourceX, y: sourceY } };
            applyValidationClasses(containerEl, node.id, handleId, currentCanvas);

            let connectAutoPan = startConnectionAutoPan(containerEl, currentCanvas, e.clientX, e.clientY);
            let snappedHandle: HTMLElement | null = null;
            const connectionSnapRadius = currentCanvas._config?.connectionSnapRadius ?? 20;

            const onPointerMove = (moveE: PointerEvent) => {
              const cursorFlowPos = currentCanvas.screenToFlowPosition(moveE.clientX, moveE.clientY);
              const snap = findSnapTarget({
                containerEl, handleType: 'target', excludeNodeId: node.id,
                cursorFlowPos, connectionSnapRadius,
                getNode: (id: string) => currentCanvas.getNode(id),
                toFlowPosition: (sx: number, sy: number) => currentCanvas.screenToFlowPosition(sx, sy),
              });

              if (snap.element !== snappedHandle) {
                snappedHandle?.classList.remove('flow-handle-active');
                snap.element?.classList.add('flow-handle-active');
                snappedHandle = snap.element;
              }

              connectionLineInstance.update({ fromX: sourceX, fromY: sourceY, toX: snap.position.x, toY: snap.position.y, source: node.id, sourceHandle: handleId });
              currentCanvas.pendingConnection = { ...currentCanvas.pendingConnection, position: snap.position };
              connectAutoPan?.updatePointer(moveE.clientX, moveE.clientY);
            };

            const onPointerUp = (upE: PointerEvent) => {
              connectAutoPan?.stop();
              connectAutoPan = null;
              document.removeEventListener('pointermove', onPointerMove);
              document.removeEventListener('pointerup', onPointerUp);

              connectionLineInstance.destroy();
              snappedHandle?.classList.remove('flow-handle-active');
              clearValidationClasses(containerEl);
              el.classList.remove('flow-easy-connecting');

              const dropPosition = currentCanvas.screenToFlowPosition(upE.clientX, upE.clientY);
              const connectEndBase = { source: node.id, sourceHandle: handleId, position: dropPosition };

              // Find target handle
              let targetHandle: HTMLElement | null = snappedHandle;
              if (!targetHandle) {
                const dropTarget = document.elementFromPoint(upE.clientX, upE.clientY);
                targetHandle = dropTarget?.closest('[data-flow-handle-type="target"]') as HTMLElement | null;
              }

              if (targetHandle) {
                const targetNodeEl = targetHandle.closest('[x-flow-node]') as HTMLElement | null;
                const targetNodeId = targetNodeEl?.dataset.flowNodeId;
                const targetHandleId = targetHandle.dataset.flowHandleId ?? 'target';

                if (targetNodeId) {
                  const connection = { source: node.id, sourceHandle: handleId, target: targetNodeId, targetHandle: targetHandleId };
                  if (isValidConnection(connection, currentCanvas.edges, { preventCycles: currentCanvas._config.preventCycles })) {
                    if (checkHandleLimits(containerEl, connection, currentCanvas.edges) &&
                        runHandleValidators(containerEl, connection) &&
                        (!currentCanvas._config?.isValidConnection || currentCanvas._config.isValidConnection(connection))) {
                      const edgeId = `e-${node.id}-${targetNodeId}-${Date.now()}-${easyConnectEdgeCounter++}`;
                      currentCanvas.addEdges({ id: edgeId, ...connection });
                      currentCanvas._emit('connect', { connection });
                      currentCanvas._emit('connect-end', { connection, ...connectEndBase });
                    } else {
                      currentCanvas._emit('connect-end', { connection: null, ...connectEndBase });
                    }
                  } else {
                    currentCanvas._emit('connect-end', { connection: null, ...connectEndBase });
                  }
                } else {
                  currentCanvas._emit('connect-end', { connection: null, ...connectEndBase });
                }
              } else {
                currentCanvas._emit('connect-end', { connection: null, ...connectEndBase });
              }

              currentCanvas.pendingConnection = null;
            };

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
          };

          el.addEventListener('pointerdown', onEasyConnectPointerDown, { capture: true });

          cleanup(() => {
            el.removeEventListener('pointerdown', onEasyConnectPointerDown, { capture: true });
          });
        }
      }

      // Handle selection via keyboard (Enter/Space)
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();

        const node = evaluate(expression) as FlowNode;
        if (!node) return;
        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas) return;
        if (canvas._animationLocked) return;
        if (!isSelectable(node)) return;

        canvas._emit('node-click', { node, event: e });
        e.stopPropagation();

        if (matchesModifier(e, canvas._shortcuts?.multiSelect)) {
          if (canvas.selectedNodes.has(node.id)) {
            canvas.selectedNodes.delete(node.id);
            node.selected = false;
          } else {
            canvas.selectedNodes.add(node.id);
            node.selected = true;
          }
        } else {
          canvas.deselectAll();
          canvas.selectedNodes.add(node.id);
          node.selected = true;
        }
        canvas._emitSelectionChange();
      };
      el.addEventListener('keydown', handleKeyDown);

      // Focus auto-pan: scroll viewport so focused node is visible
      const handleFocus = () => {
        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas?._config?.autoPanOnNodeFocus) return;
        const node = evaluate(expression) as FlowNode;
        if (!node) return;
        // Pan to center the node in the viewport
        const pos = node.parentId
          ? canvas.getAbsolutePosition(node.id)
          : node.position;
        canvas.setCenter(
          pos.x + (node.dimensions?.width ?? 150) / 2,
          pos.y + (node.dimensions?.height ?? 40) / 2,
        );
      };
      el.addEventListener('focus', handleFocus);

      // Handle selection via click (mouseup without drag movement)
      const handleClick = (e: MouseEvent) => {
        if (didDrag) return;

        const node = evaluate(expression) as FlowNode;
        if (!node) return;

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
        if (!canvas) return;
        if (canvas._animationLocked) return;

        // Always emit node-click, even if not selectable
        canvas._emit('node-click', { node, event: e });

        // ── Selectable flag ────────────────────────────────────────
        if (!isSelectable(node)) return;

        // Stop the click from reaching the canvas background deselect handler
        e.stopPropagation();

        // If drag start already handled selection (node wasn't previously selected),
        // skip re-processing to avoid toggling it back off
        if (dragStartSelected) {
          dragStartSelected = false;
          return;
        }

        if (matchesModifier(e, canvas._shortcuts?.multiSelect)) {
          // Toggle selection
          if (canvas.selectedNodes.has(node.id)) {
            canvas.selectedNodes.delete(node.id);
            node.selected = false;
            el.classList.remove('flow-node-selected');
            debug('selection', `Node "${node.id}" deselected (shift)`);
          } else {
            canvas.selectedNodes.add(node.id);
            node.selected = true;
            el.classList.add('flow-node-selected');
            debug('selection', `Node "${node.id}" selected (shift)`);
          }
        } else {
          // Single select — clear others first
          canvas.deselectAll();
          canvas.selectedNodes.add(node.id);
          node.selected = true;
          el.classList.add('flow-node-selected');
          debug('selection', `Node "${node.id}" selected`);
        }
        canvas._emitSelectionChange();
      };

      el.addEventListener('click', handleClick);

      // Handle right-click context menu
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const node = evaluate(expression) as FlowNode;
        if (!node) return;

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement) as any;
        if (!canvas) return;

        // When the node is part of a multi-selection, show selection menu instead
        if (canvas.selectedNodes.size > 1 && canvas.selectedNodes.has(node.id)) {
          const nodes = canvas.nodes.filter((n: FlowNode) => canvas.selectedNodes.has(n.id));
          canvas._emit('selection-context-menu', { nodes, event: e });
        } else {
          canvas._emit('node-context-menu', { node, event: e });
        }
      };
      el.addEventListener('contextmenu', handleContextMenu);

      // Measure node dimensions after first paint so edge paths can
      // connect to the correct handle positions (center-bottom / center-top).
      requestAnimationFrame(() => {
        const node = evaluate(expression) as FlowNode;
        if (!node) return;

        const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);

        // Use offsetWidth/offsetHeight — unaffected by CSS transforms (rotation).
        // getBoundingClientRect() returns the inflated axis-aligned bounding box
        // of rotated elements, which would make the node grow.
        node.dimensions = {
          width: el.offsetWidth,
          height: el.offsetHeight,
        };
        debug('init', `Node "${node.id}" measured`, node.dimensions);

        // Register element for CSS-based viewport culling (outside reactive system)
        canvas?._nodeElements?.set(node.id, el);

        // A1: Begin ResizeObserver tracking unless the node opts out.
        if (node.resizeObserver !== false && canvas?._resizeObserver) {
          canvas._resizeObserver.observe(el);
        }
      });

      cleanup(() => {
        dragInstance?.destroy();
        helperLinesSvg?.remove();
        helperLinesSvg = null;
        proximityPreviewLine?.destroy();
        proximityPreviewLine = null;
        el.removeEventListener('keydown', handleKeyDown);
        el.removeEventListener('focus', handleFocus);
        el.removeEventListener('click', handleClick);
        el.removeEventListener('contextmenu', handleContextMenu);

        // Unregister from viewport culling and ResizeObserver
        const nodeId = el.dataset.flowNodeId;
        if (nodeId) {
          const canvas = Alpine.$data(el.closest('[x-data]') as HTMLElement);
          canvas?._nodeElements?.delete(nodeId);
          canvas?._resizeObserver?.unobserve(el);
        }
      });
    },
  );
}
