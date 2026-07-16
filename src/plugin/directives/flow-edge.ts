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
import type { FlowEdge, FlowNode, HandlePosition, HandleType, Rect, Connection, XYPosition, SchemaMetrics, EndpointSpreadGrouping } from '../../core/types';
import type { MarkerType, MarkerConfig } from '../../core/markers';
import { computeSchemaHandlePoint, schemaFieldIndex } from '../../core/schema-geometry';
import { laneOffset, applyLaneOffset, resolveSpreadSpacing } from '../../core/endpoint-spread';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../../core/geometry';
import { normalizeMarker, getMarkerId } from '../../core/markers';
import { isConnectable } from '../../core/node-flags';
import { applyValidationClasses, clearValidationClasses, applyReconnectValidation, setDragLineValidating } from './flow-handle';
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

/**
 * Resolve a drop target for an edge-body reconnect drag and route it through
 * `applyReconnectValidation` so the async `connectValidator` gates the mutation
 * exactly like the handle-pip reconnect path does.
 *
 * The caller (flow-edge's onPointerUp) computes `dropNodeId` + `dropHandleId`
 * from the pointer event (snapped handle or elementFromPoint fallback); this
 * function:
 *
 *   - short-circuits `applied: false` if there is no drop node, or the drop
 *     node is not connectable (no validator call, no event emission — matches
 *     the prior inline chain's "snap back silently" behavior)
 *   - otherwise builds the `newConnection` based on `draggedEnd` and delegates
 *     to `applyReconnectValidation` which owns the sync + async validator chain
 *     plus mutation + `flow-connect-rejected` dispatch
 *   - on success, emits `reconnect` with `{ oldEdge, newConnection }` so
 *     listeners see the same payload they saw before the refactor
 *
 * Extracted so the edge-body reconnect path is unit-testable without
 * simulating full pointer drags through SVG.
 */
export async function resolveEdgeBodyReconnect(params: {
  dropNodeId: string | undefined;
  dropHandleId: string | undefined;
  draggedEnd: HandleType;
  edge: FlowEdge;
  canvas: any;
  containerEl: HTMLElement;
}): Promise<{ applied: boolean; reason?: string; newConnection?: Connection }> {
  const { dropNodeId, dropHandleId, draggedEnd, edge, canvas, containerEl } = params;

  if (!dropNodeId) {
    return { applied: false };
  }

  const dropNode = canvas.getNode(dropNodeId);
  if (dropNode && !isConnectable(dropNode)) {
    return { applied: false };
  }

  const newConnection: Connection = draggedEnd === 'target'
    ? { source: edge.source, sourceHandle: edge.sourceHandle, target: dropNodeId, targetHandle: dropHandleId }
    : { source: dropNodeId, sourceHandle: dropHandleId, target: edge.target, targetHandle: edge.targetHandle };

  const oldEdge = { ...edge };
  const result = await applyReconnectValidation({
    edge,
    newConnection,
    canvas,
    containerEl,
    endpoint: draggedEnd,
  });

  if (result.applied) {
    canvas._emit?.('reconnect', { oldEdge, newConnection });
    return { applied: true, newConnection };
  }

  return { applied: false, reason: result.reason, newConnection };
}

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
 * Return the center point of a DOMRect in screen coordinates.
 * Used with `pickClosestHandle` to disambiguate same-(id,type) handles.
 */
function rectCenter(r: DOMRect): XYPosition {
  return { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 };
}

/**
 * Pick the handle element whose center is geometrically closest to
 * `opposingCenter` (the OTHER endpoint's screen-space rect center).
 *
 * Used when a node has multiple handles sharing the same (id, type) — for
 * example schema nodes, which stamp a real left-side target plus an
 * invisible right-side mirror per row. The picker lets the edge route to
 * whichever side is physically closer, avoiding edges that jump to the
 * far side of the node when the source is repositioned.
 *
 * NOTE: `opposingCenter` is expected in SCREEN coordinates (from a
 * `getBoundingClientRect` center), matching the space the handle rects
 * live in here. When it's not available, falls back to the first match.
 */
function pickClosestHandle(
  handles: NodeListOf<Element> | Element[],
  opposingCenter: XYPosition | undefined,
): Element | null {
  const list = Array.from(handles);
  if (list.length === 0) return null;
  if (list.length === 1 || !opposingCenter) return list[0];
  let best: Element | null = null;
  let bestDist = Infinity;
  for (const h of list) {
    const r = (h as HTMLElement).getBoundingClientRect();
    const cx = (r.left + r.right) / 2;
    const cy = (r.top + r.bottom) / 2;
    const dx = cx - opposingCenter.x;
    const dy = cy - opposingCenter.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestDist) {
      bestDist = d2;
      best = h;
    }
  }
  return best;
}

/**
 * Look up a handle's declared position from the DOM.
 *
 * When multiple handles share the same (id, type) — e.g. schema-node rows
 * with mirror handles on the opposite side — `opposingCenter` (the other
 * endpoint's screen-space rect center) is used to pick the one closest to
 * that endpoint. Without `opposingCenter`, the first match wins.
 */
export function resolveHandlePosition(
  container: Element,
  nodeId: string,
  handleId: string | undefined,
  handleType: 'source' | 'target',
  node?: FlowNode,
  opposingCenter?: XYPosition,
  providedNodeEl?: HTMLElement | null,
): HandlePosition {
  // Prefer the caller-resolved node element (O(1) via canvas._nodeElements);
  // fall back to a container-wide query only when it wasn't provided. All
  // handle lookups below are already scoped to this element.
  const nodeEl = providedNodeEl ?? container.querySelector(`[data-flow-node-id="${CSS.escape(nodeId)}"]`);
  if (nodeEl) {
    // Try exact handle ID scoped to the correct type. Schema nodes and other
    // "row-per-field" layouts have a source + target on each row with the same
    // handle id — without the type filter, querySelector grabs whichever
    // appears first in the DOM and the edge lands on the wrong side.
    if (handleId) {
      const typed = nodeEl.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(handleId)}"][data-flow-handle-type="${handleType}"]`,
      );
      let handleEl = pickClosestHandle(typed, opposingCenter);
      if (!handleEl) {
        const untyped = nodeEl.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(handleId)}"]`,
        );
        handleEl = pickClosestHandle(untyped, opposingCenter);
      }
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
 * Row index of the field this endpoint's handle names, or `-1` when its handle
 * center must NOT be derived from state.
 *
 * Doubles as the eligibility check: every condition here exists because the DOM
 * path would pick up something the state path cannot see, and `-1` sends the
 * caller to `measureHandleCoords` — correctness is never traded for the rect
 * saving. Returning the index (rather than a boolean) keeps each endpoint to a
 * SINGLE scan of `fields`: the caller threads it straight into
 * `computeSchemaHandlePoint`.
 *
 *  - no `data.fields` array → not a schema node at all
 *  - `hidden` / `collapsed` / `condensed` → the node's rows are not laid out the
 *    way `SchemaMetrics` describes (condensed nodes swap in a summary view via
 *    consumer `x-show`, so `data.fields` no longer maps to rendered rows)
 *  - `rotation` → `getBoundingClientRect` folds in the CSS transform for free;
 *    arithmetic on `node.position` cannot
 *  - a non-default per-node `nodeOrigin` → the node's painted top-left is not its
 *    position; see the block below
 *  - no finite `dimensions` → the right-hand handle x is `position.x + width`
 *  - not rendered by `x-flow-schema`, or viewport-culled, or non-uniform rows →
 *    see the three blocks below
 *  - the handle id must name a field EXACTLY (see `schemaFieldIndex`)
 *
 * `nodeEl` is the endpoint's registered node element (`canvas._nodeElements`).
 * Only its ATTRIBUTES and INLINE STYLE are read here — never a rect — so the fast
 * path keeps its zero-`getBoundingClientRect` guarantee.
 */
function schemaFieldIndexForEndpoint(
  node: FlowNode | undefined,
  handleId: string | undefined,
  nodeEl: HTMLElement | null | undefined,
  metrics: SchemaMetrics,
): number {
  if (!node || !handleId) return -1;
  if (node.hidden || node.collapsed || node.condensed) return -1;
  if (node.rotation) return -1;

  // `nodeOrigin` is a PER-NODE property as well as a canvas config, and the node's own
  // value WINS: `flow-node` places the element at `absPos − dimensions × (node.nodeOrigin
  // ?? config.nodeOrigin ?? [0,0])`. `toAbsoluteNode` returns a ROOT node unchanged and
  // `getAbsolutePosition` folds in only the PARENTS' origins — never the node's own — so
  // under a per-node origin `node.position` is NOT the rendered border-box top-left, and
  // every state-derived endpoint on this node would land `dimensions × origin` away from
  // where the browser painted the handle. The canvas-level gate at the call site checks
  // only `config.nodeOrigin`, which a node carrying its own origin sails straight past.
  // Checking here covers BOTH endpoints — a node's own geometry AND its role as the
  // opposing node in `schemaHandleSide` (whose `nodeCenterX` reads the same unshifted
  // position, so an unguarded origin can flip the side too).
  const origin = node.nodeOrigin;
  if (origin && (origin[0] !== 0 || origin[1] !== 0)) return -1;

  // Rendered by `x-flow-schema`? Only then do the cached `SchemaMetrics` describe
  // this node's rows. A hand-rolled node (skip the directive, write `x-for` +
  // handles — a pattern flow-schema.ts's own docs invite) carries the SAME
  // `data.fields` shape and the same field-keyed handle ids with entirely different
  // row geometry, and state cannot tell the two apart. The directive stamps the
  // attribute on the NODE element, which works under both plain-directive and
  // WireFlow slot markup. No registered element ⇒ ineligible ⇒ DOM path ⇒ safe.
  if (!nodeEl?.hasAttribute('data-flow-schema-node')) return -1;

  // Viewport-culled? `_applyCulling` writes inline `display: none` on off-screen
  // node elements, and an edge still renders when only ONE endpoint is visible. The
  // DOM path DEGRADES on a culled endpoint — its handle rect is 0×0, so
  // `measureHandleCoords` returns null and the endpoint collapses to the node-edge
  // midpoint (`getHandleCoords`), with the side inferred from DOM order. The state
  // path cannot see `display: none` and would emit true row geometry instead, so
  // every edge crossing the culling boundary would render DIFFERENTLY than it does
  // today. Matching the degradation is DELIBERATE, not an oversight: this workstream
  // changes how endpoints are computed, never where they land. (Culling is 'auto' at
  // ≥150 nodes — precisely the scale this fast path exists for.)
  if (nodeEl.style.display === 'none') return -1;

  const width = node.dimensions?.width;
  const height = node.dimensions?.height;
  if (typeof width !== 'number' || !Number.isFinite(width)) return -1;
  if (typeof height !== 'number' || !Number.isFinite(height)) return -1;

  const fields = (node.data as { fields?: Array<{ name: string }> } | undefined)?.fields;
  if (!Array.isArray(fields) || fields.length === 0) return -1;

  // Are the rows actually uniform? The metrics are measured ONCE, from the first
  // schema node to render, and everything downstream assumes every schema node's
  // rows match them. Nothing enforces that: `.flow-schema-row-name` has no
  // `white-space: nowrap`, so a consumer who pins `dimensions.width` and writes a
  // long field name gets a WRAPPED, taller row — and every row below it would have
  // its endpoint land one row off, silently. `node.dimensions` is the measured
  // BORDER BOX (flow-canvas reads `borderBoxSize`), so the row model must reproduce
  // the node's height exactly. Two adds; catches wrapped rows, non-uniform rows and
  // bespoke markup, all of which fall back to the DOM path — which measures each
  // handle individually and is immune.
  //
  // The last row is `rowHeightLast`, not `rowHeight` — the theme removes its
  // border-bottom. Modelling it as `rowHeight` overshoots EVERY schema node's real
  // border box by that border, which used to fail this very check and disqualify the
  // whole canvas from the fast path (caught by the real-browser parity test; jsdom has
  // no stylesheet to be wrong about).
  const expectedHeight =
    metrics.insetTop
    + metrics.headerHeight
    + (fields.length - 1) * metrics.rowHeight
    + metrics.rowHeightLast
    + metrics.insetBottom;
  if (Math.abs(expectedHeight - height) > 0.5) return -1;

  return schemaFieldIndex(fields, handleId);
}

/**
 * Which side of a schema node an endpoint's handle sits on — replicating
 * `pickClosestHandle` without touching the DOM.
 *
 * Each schema row stamps a real handle plus an invisible mirror on the opposite
 * side, sharing one (id, type). The DOM path takes whichever is closer to the
 * OPPOSING endpoint's node-rect center. Both candidates share the row's center
 * y, so the y term cancels and the decision collapses to a comparison of the
 * opposing node's center x against the midpoint of this node's two candidate
 * handle x's.
 *
 * The tie-break is ASYMMETRIC on purpose. `pickClosestHandle` uses a strict
 * `d2 < bestDist`, so an exact tie leaves the FIRST handle in DOM order winning
 * — and `renderRow` appends the real target (left) before its right mirror, but
 * the real source (right) before its left mirror. So a tie sends a source right
 * and a target left. A vertically stacked pair of equal-width nodes hits this
 * exactly; symmetric rounding would flip the target to the wrong side.
 */
function schemaHandleSide(
  node: FlowNode,
  absolutePosition: XYPosition,
  handleType: 'source' | 'target',
  opposingCenterX: number,
  metrics: SchemaMetrics,
): 'left' | 'right' {
  const width = node.dimensions?.width ?? DEFAULT_NODE_WIDTH;
  const midX =
    absolutePosition.x + (metrics.insetLeft + (width - metrics.insetRight)) / 2;

  return handleType === 'source'
    ? (opposingCenterX >= midX ? 'right' : 'left')  // tie → right (real source is first in DOM)
    : (opposingCenterX > midX ? 'right' : 'left');  // tie → left  (real target is first in DOM)
}

/** Flow-space center x of a node — what `rectCenter(nodeEl.getBoundingClientRect())` yields. */
function nodeCenterX(node: FlowNode): number {
  return node.position.x + (node.dimensions?.width ?? DEFAULT_NODE_WIDTH) / 2;
}

interface ResolvedEndpoints {
  sourcePos: HandlePosition;
  targetPos: HandlePosition;
  srcMeasurement: HandleMeasurement;
  tgtMeasurement: HandleMeasurement;
}

/**
 * Both endpoints of a schema→schema edge, derived from state — the fast path.
 *
 * Returns `null` whenever the caller must fall back to DOM measurement: either
 * endpoint being ineligible (see `schemaFieldIndexForEndpoint`) disqualifies the
 * whole edge. The handle box size comes from the metrics rather than being zeroed:
 * `shortenEndpoint` derives its marker offset from
 * `min(handleWidth, handleHeight) / 2`, so zeros would pull every marker'd endpoint
 * ~5px off where the DOM path puts it.
 *
 * `sourceNode` / `targetNode` are the ABSOLUTE-position wrappers; `rawSource` /
 * `rawTarget` are the state nodes carrying `data.fields`. `nodeElements` is the
 * canvas's node-element registry — read for attributes/inline style only, never
 * for a rect.
 */
function resolveSchemaEndpoints(
  rawSource: FlowNode,
  rawTarget: FlowNode,
  sourceNode: FlowNode,
  targetNode: FlowNode,
  sourceHandle: string | undefined,
  targetHandle: string | undefined,
  nodeElements: Map<string, HTMLElement> | undefined,
  metrics: SchemaMetrics,
): ResolvedEndpoints | null {
  // One scan of `fields` per endpoint: the index resolved by the eligibility check
  // is the same one the geometry needs. Bail on the source before touching the
  // target — the common non-schema edge costs a single attribute read.
  const srcIndex = schemaFieldIndexForEndpoint(rawSource, sourceHandle, nodeElements?.get(rawSource.id), metrics);
  if (srcIndex < 0) return null;
  const tgtIndex = schemaFieldIndexForEndpoint(rawTarget, targetHandle, nodeElements?.get(rawTarget.id), metrics);
  if (tgtIndex < 0) return null;

  const srcSide = schemaHandleSide(rawSource, sourceNode.position, 'source', nodeCenterX(targetNode), metrics);
  const tgtSide = schemaHandleSide(rawTarget, targetNode.position, 'target', nodeCenterX(sourceNode), metrics);

  const src = computeSchemaHandlePoint(rawSource, sourceNode.position, srcIndex, srcSide, metrics);
  const tgt = computeSchemaHandlePoint(rawTarget, targetNode.position, tgtIndex, tgtSide, metrics);
  if (!src || !tgt) return null;

  const size = { handleWidth: metrics.handleWidth, handleHeight: metrics.handleHeight };
  return {
    sourcePos: src.position,
    targetPos: tgt.position,
    srcMeasurement: { x: src.x, y: src.y, ...size },
    tgtMeasurement: { x: tgt.x, y: tgt.y, ...size },
  };
}

/**
 * Measure a handle element's actual center position in flow coordinates.
 * Converts the handle's screen position directly via the container rect
 * and viewport, so CSS transforms (e.g. rotation) are correctly accounted for.
 * Returns null if the handle element cannot be found.
 *
 * When a node has multiple handles sharing the same (id, type) — e.g.
 * schema-node rows with opposite-side mirror handles — `opposingCenter`
 * (the OTHER endpoint's screen-space rect center) is used to pick the
 * geometrically closest match. Without it, the first match wins.
 */
function measureHandleCoords(
  container: Element,
  nodeId: string,
  _node: FlowNode,
  handleId: string | undefined,
  handleType: 'source' | 'target',
  zoom: number,
  viewport: { x: number; y: number },
  opposingCenter?: XYPosition,
  providedNodeEl?: HTMLElement | null,
): HandleMeasurement | null {
  // Prefer the caller-resolved node element (O(1) via canvas._nodeElements);
  // fall back to a container-wide query only when it wasn't provided.
  const nodeEl = providedNodeEl ?? (container.querySelector(`[data-flow-node-id="${CSS.escape(nodeId)}"]`) as HTMLElement | null);
  if (!nodeEl) return null;

  let handleEl: HTMLElement | null = null;

  if (handleId) {
    // 1. Try exact handle ID scoped to the correct type (schema-style nodes
    //    have same-id target + source per row; type disambiguates). When
    //    multiple match (e.g. real + mirror), pick the geometrically closest
    //    to the opposing endpoint. Fall back to id-only for backward compat
    //    with nodes that only have one handle per id.
    const typed = nodeEl.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(handleId)}"][data-flow-handle-type="${handleType}"]`,
    );
    handleEl = pickClosestHandle(typed, opposingCenter) as HTMLElement | null;
    if (!handleEl) {
      const untyped = nodeEl.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(handleId)}"]`,
      );
      handleEl = pickClosestHandle(untyped, opposingCenter) as HTMLElement | null;
    }
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


function getPointAtPercent(pathEl: SVGPathElement, t: number, totalLength?: number): { x: number; y: number } {
  const len = totalLength ?? pathEl.getTotalLength();
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

      // Cached label-path length, keyed by the path `d` attribute. getTotalLength()
      // forces SVG geometry, so avoid re-measuring an unchanged path across effect
      // re-runs (e.g. selection/label-only updates that don't change routing).
      let cachedPathD: string | null = null;
      let cachedTotalLength = 0;

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

        const onPointerUp = async (upE: PointerEvent) => {
          if (!dragging) {
            // Below threshold — treat as click
            cleanupReconnection();
            handleEdgeClick(upE as unknown as MouseEvent);
            return;
          }

          // Guard against overlapping drops while an async connectValidator is pending.
          if (canvas._connectValidating) return;

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

          // Pulse the drag line while the async connectValidator (if any) awaits.
          // The class is a no-op on sync paths — setDragLineValidating only
          // adds/removes; the validator lifecycle inside applyReconnectValidation
          // is synchronous when no validator is configured.
          const dragLineEl = reconnectLineInstance?.svg ?? null;
          setDragLineValidating(dragLineEl, true);
          let result: Awaited<ReturnType<typeof resolveEdgeBodyReconnect>>;
          try {
            result = await resolveEdgeBodyReconnect({
              dropNodeId,
              dropHandleId,
              draggedEnd: draggedEnd!,
              edge,
              canvas,
              containerEl,
            });
          } finally {
            setDragLineValidating(dragLineEl, false);
          }

          if (result.applied) {
            debug('reconnect', `Edge "${edge.id}" reconnected (${draggedEnd})`, result.newConnection);
          } else {
            debug('reconnect', `Edge "${edge.id}" reconnection cancelled — snapping back`, { reason: result.reason });
          }

          canvas._emit('reconnect-end', { edge, successful: result.applied });
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

        // ── WS-D zoom LOD ────────────────────────────────────────────────
        // Opt-in: at/under the configured zoom bucket, render as a straight
        // line (skip pathfinding + curvature). Only read `_zoomLevel` when
        // `edgeLod` is set, so the default path gains no new reactive dep.
        // `_zoomLevel` is bucketed, so this fires only on threshold crossings.
        const edgeLod = canvas._config?.edgeLod;
        let effectiveEdgeType = resolvedEdgeType;
        if (edgeLod) {
          const level = canvas._zoomLevel; // reactive, bucketed
          const simplify = edgeLod.simplifyAt === 'medium'
            ? (level === 'medium' || level === 'far')
            : level === 'far';
          if (simplify) {
            effectiveEdgeType = 'straight';
          }
        }

        // Reactive dependency — bumped each frame during layout animation
        // so edges re-measure DOM handle positions while CSS transitions run.
        void canvas._layoutAnimTick;
        // Reactive dependency — routing signal. Bumped per-edge by
        // _markDirtyEdges when a commit affects THIS edge's corridor, so only
        // the affected edges re-route instead of the whole edge graph.
        void canvas._edgeDirtyTicks?.get(edge.id);

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

        // ── Schema handle geometry (WS-G) ─────────────────────────────────
        // Schema rows are uniform, so once `_schemaMetrics` is cached every
        // handle center on a schema node is arithmetic — no rect reads. Resolved
        // BEFORE the standard branch so the fast path never touches the DOM.
        //
        // Reading `_schemaMetrics` here DOES track a dependency on the property's
        // identity (Alpine.raw() doesn't unwrap the merge-scope proxy — see the
        // `_obstacleSnapshot` note below). That is intended: metrics go
        // null → object exactly once, one tick after the first schema node
        // renders, so each edge re-runs once and upgrades from the DOM path to
        // this one. A colorMode change nulls the cache and it re-measures. It is
        // a one-time transition, not a per-frame dependency.
        //
        // `nodeOrigin` is a hard disqualifier: `toAbsoluteNode` only applies it
        // to nodes with a `parentId`, so under a non-default origin a ROOT node's
        // rendered top-left is `position − dimensions × origin`, not `position`,
        // and the arithmetic below would desync from what the browser painted.
        const schemaMetrics = canvas._schemaMetrics as SchemaMetrics | null | undefined;
        const configOrigin = canvas._config?.nodeOrigin;
        const schemaEndpoints =
          resolvedEdgeType !== 'floating'
          && canvas._config?.schemaHandleGeometry !== 'dom'
          && !!schemaMetrics
          && (!configOrigin || (configOrigin[0] === 0 && configOrigin[1] === 0))
            ? resolveSchemaEndpoints(
                rawSource,
                rawTarget,
                sourceNode,
                targetNode,
                edge.sourceHandle,
                edge.targetHandle,
                canvas._nodeElements as Map<string, HTMLElement> | undefined,
                schemaMetrics,
              )
            : null;

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
        } else if (schemaEndpoints) {
          // ── Schema fast path (WS-G): endpoints from state, zero rect reads ──
          sourcePos = schemaEndpoints.sourcePos;
          targetPos = schemaEndpoints.targetPos;
          srcMeasurement = schemaEndpoints.srcMeasurement;
          tgtMeasurement = schemaEndpoints.tgtMeasurement;
          lastSrcCoords = { x: srcMeasurement.x, y: srcMeasurement.y };
          lastTgtCoords = { x: tgtMeasurement.x, y: tgtMeasurement.y };
        } else {
          // ── Standard: resolve from handle elements ──
          // Compute screen-space centers of each endpoint node ONCE so the
          // handle-geometry picker (for nodes with same-(id,type) mirrors,
          // e.g. schema rows) can choose whichever side of the node is
          // physically closer to the OPPOSING endpoint.
          // Resolve endpoint elements in O(1) via the canvas node-element
          // registry, falling back to a container-wide query when an element
          // isn't registered (test mounts, mid-init edge cases).
          const sourceNodeEl = (canvas._nodeElements?.get(edge.source)
            ?? container.querySelector(`[data-flow-node-id="${CSS.escape(edge.source)}"]`)) as HTMLElement | null;
          const targetNodeEl = (canvas._nodeElements?.get(edge.target)
            ?? container.querySelector(`[data-flow-node-id="${CSS.escape(edge.target)}"]`)) as HTMLElement | null;
          const sourceCenter = sourceNodeEl ? rectCenter(sourceNodeEl.getBoundingClientRect()) : undefined;
          const targetCenter = targetNodeEl ? rectCenter(targetNodeEl.getBoundingClientRect()) : undefined;

          sourcePos = resolveHandlePosition(container, edge.source, edge.sourceHandle, 'source', rawSource, targetCenter, sourceNodeEl);
          targetPos = resolveHandlePosition(container, edge.target, edge.targetHandle, 'target', rawTarget, sourceCenter, targetNodeEl);

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

          srcMeasurement = measureHandleCoords(container, edge.source, sourceNode, edge.sourceHandle, 'source', zoom, rawViewport, targetCenter, sourceNodeEl);
          tgtMeasurement = measureHandleCoords(container, edge.target, targetNode, edge.targetHandle, 'target', zoom, rawViewport, sourceCenter, targetNodeEl);

          // Cache handle center coords for reconnection hit-detection
          const fallbackSrc = getHandleCoords(sourceNode, sourcePos, canvas._shapeRegistry, canvas._config?.nodeOrigin);
          const fallbackTgt = getHandleCoords(targetNode, targetPos, canvas._shapeRegistry, canvas._config?.nodeOrigin);
          lastSrcCoords = srcMeasurement ?? fallbackSrc;
          lastTgtCoords = tgtMeasurement ?? fallbackTgt;
        }

        // Shorten endpoints so markers sit outside the handle boundary
        let adjustedSrc = shortenEndpoint(srcMeasurement ?? lastSrcCoords!, sourcePos, srcMeasurement, edge.markerStart);
        let adjustedTgt = shortenEndpoint(tgtMeasurement ?? lastTgtCoords!, targetPos, tgtMeasurement, edge.markerEnd);

        // WS-2: fan edges that share an endpoint handle across the row extent.
        // Gated: no-op unless spread is enabled for the endpoint's node. The lane
        // index/count come from the canvas grouping pass; the offset shifts the
        // attach point (and thus the route-cache key) so routing stays correct.
        if (resolvedEdgeType === 'orthogonal' || resolvedEdgeType === 'avoidant') {
          const grouping = Alpine.raw(canvas._endpointSpreadGrouping) as EndpointSpreadGrouping | null | undefined;
          if (grouping) {
            const srcSpacing = resolveSpreadSpacing(rawSource.endpointSpread ?? canvas._config?.avoidantEndpointSpread);
            if (srcSpacing !== null) {
              const g = grouping.get(`${edge.source}|${edge.sourceHandle ?? ''}`);
              const lane = g?.lanes.get(edge.id);
              if (g && lane !== undefined && g.count > 1) {
                const srcExtent = canvas._schemaMetrics?.rowHeight ?? srcMeasurement?.handleHeight ?? 0;
                adjustedSrc = applyLaneOffset(adjustedSrc, sourcePos, laneOffset(lane, g.count, srcExtent, srcSpacing));
              }
            }
            const tgtSpacing = resolveSpreadSpacing(rawTarget.endpointSpread ?? canvas._config?.avoidantEndpointSpread);
            if (tgtSpacing !== null) {
              const g = grouping.get(`${edge.target}|${edge.targetHandle ?? ''}`);
              const lane = g?.lanes.get(edge.id);
              if (g && lane !== undefined && g.count > 1) {
                const tgtExtent = canvas._schemaMetrics?.rowHeight ?? tgtMeasurement?.handleHeight ?? 0;
                adjustedTgt = applyLaneOffset(adjustedTgt, targetPos, laneOffset(lane, g.count, tgtExtent, tgtSpacing));
              }
            }
          }
        }

        // Cache visible endpoints for reconnection hit-detection
        lastVisibleSrcCoords = adjustedSrc;
        lastVisibleTgtCoords = adjustedTgt;

        // Compute obstacle rects for orthogonal routing (performance-gated).
        //
        // Obstacles now come from the shared `_obstacleSnapshot` (built once
        // per commit by `_commitNodeGeometry`, Workstream C) rather than each
        // edge rebuilding its own obstacle array per effect run. Re-routing is
        // triggered per-edge via `_edgeDirtyTicks` (read at the top of this
        // effect): `_markDirtyEdges` bumps only the edges whose corridor could
        // actually be affected by the changed node(s), so unaffected edges
        // don't re-run at all. `_layoutAnimTick` remains only the MEASUREMENT
        // signal (re-measure handle DOM during layout animation) — it is not a
        // routing dependency.
        //
        // NB: `canvas` is Alpine's merged-scope proxy, which Alpine.raw() does
        // not unwrap, so we unwrap the genuine reactive nested properties
        // instead (`Alpine.raw(canvas._obstacleSnapshot)` / `Alpine.raw(canvas.nodes)`).
        let obstacleRects: Rect[] | undefined;
        if (resolvedEdgeType === 'orthogonal' || resolvedEdgeType === 'avoidant') {
          // WS-D: while an endpoint node is being dragged, skip pathfinding and
          // let the router fall back to a bezier curve (empty-obstacle fast
          // path). `Set.has(id)` is key-scoped, so only edges touching the
          // dragged node re-run when `_draggingNodeIds` changes.
          const simplifyingOnDrag = canvas._config?.avoidantSimplifyOnDrag !== false
            && (canvas._draggingNodeIds?.has(edge.source) || canvas._draggingNodeIds?.has(edge.target));
          if (simplifyingOnDrag) {
            obstacleRects = undefined;
          } else {
            const snapshot = Alpine.raw(canvas._obstacleSnapshot) as
              | Array<{ id: string; x: number; y: number; width: number; height: number }>
              | null
              | undefined;
            if (snapshot) {
              // Shared snapshot (built once per commit). Filter out this edge's
              // own endpoints. Structurally assignable to Rect[] (extra `id` is
              // ignored by the router). Preserves node order from the snapshot,
              // which preserves `raw.nodes` order — so the router's VALUE-keyed
              // route cache still hits (same rects, same order as the legacy
              // per-edge build) and routes come out unchanged.
              obstacleRects = snapshot.filter((r) => r.id !== edge.source && r.id !== edge.target);
            } else {
              // Fallback for minimal mounts that never triggered a geometry
              // commit — legacy per-edge build, byte-identical to the prior
              // behavior so routes are unchanged when no snapshot exists yet.
              const rawNodes = Alpine.raw(canvas.nodes) as FlowNode[];
              const rawNodeMap = new Map<string, FlowNode>(rawNodes.map((n): [string, FlowNode] => [n.id, n]));
              const nodeOrigin = canvas._config?.nodeOrigin;
              obstacleRects = rawNodes
                .filter((n: FlowNode) => n.id !== edge.source && n.id !== edge.target)
                .map((n: FlowNode) => {
                  const abs = toAbsoluteNode(n, rawNodeMap, nodeOrigin);
                  return {
                    x: abs.position.x,
                    y: abs.position.y,
                    width: abs.dimensions?.width ?? DEFAULT_NODE_WIDTH,
                    height: abs.dimensions?.height ?? DEFAULT_NODE_HEIGHT,
                  };
                });
            }
          }
        }

        // WS-3: crossing-reduction lane offset for this edge (0 when off/absent).
        let channelOffset = 0;
        if (resolvedEdgeType === 'orthogonal' || resolvedEdgeType === 'avoidant') {
          const plan = Alpine.raw(canvas._crossingPlan) as Map<string, number> | null | undefined;
          channelOffset = plan?.get(edge.id) ?? 0;
        }

        // Only the path geometry uses the LOD-resolved type; everything else
        // (markers, labels, edge classes) keeps the configured type via `edge`.
        const pathEdge = effectiveEdgeType === resolvedEdgeType ? edge : { ...edge, type: effectiveEdgeType };
        const { path, labelPosition } = getEdgePath(pathEdge, sourceNode, targetNode, sourcePos, targetPos, adjustedSrc, adjustedTgt, canvas._config?.edgeTypes, obstacleRects, canvas._shapeRegistry, canvas._config?.nodeOrigin, canvas._config?.defaultEdgeType, channelOffset);
        pathEl.setAttribute('d', path);
        interactionPath.setAttribute('d', path);

        // Record this edge's endpoint-bbox corridor AFTER routing so
        // `_markDirtyEdges` can test future changed-node rects against it
        // (mirrors `corridorObstacles()`'s own CORRIDOR_MARGIN expansion in
        // orthogonal.ts — an obstacle outside this range is pruned by the
        // router itself, so it provably cannot change this edge's route).
        // Non-reactive: written on the raw Map so recording a corridor never
        // triggers other edges' effects.
        if (resolvedEdgeType === 'orthogonal' || resolvedEdgeType === 'avoidant') {
          const rawCorridors = Alpine.raw(canvas._edgeCorridors) as
            | Map<string, { minX: number; minY: number; maxX: number; maxY: number }>
            | undefined;
          rawCorridors?.set(edge.id, {
            minX: Math.min(adjustedSrc.x, adjustedTgt.x),
            minY: Math.min(adjustedSrc.y, adjustedTgt.y),
            maxX: Math.max(adjustedSrc.x, adjustedTgt.x),
            maxY: Math.max(adjustedSrc.y, adjustedTgt.y),
          });
        }

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
        // When `_renderDualMarker` is set (bidirectional-edge collapse has
        // picked this edge as the primary of a reciprocal pair), mirror the
        // end marker onto the start so one path carries arrows at both ends.
        if (edge.markerStart != null) {
          const cfg = normalizeMarker(edge.markerStart);
          const id = getMarkerId(cfg, canvas._id);
          pathEl.setAttribute('marker-start', `url(#${id})`);
        } else if (edge._renderDualMarker && edge.markerEnd) {
          const cfg = normalizeMarker(edge.markerEnd);
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
        // Track only the specific row keys this edge touches — NOT
        // selectedRows.size. Reading `.size` is an iterate-level dependency, so
        // any row select/deselect would re-run EVERY edge effect (re-pathfinding
        // the whole avoidant graph). `has(key)` tracks that key alone; `clear()`
        // still notifies previously-present keys, so un-highlighting works.
        const rowHighlighted = !edge.selected && (
          (edge.sourceHandle ? canvas.selectedRows?.has(edge.sourceHandle.replace(/-[lr]$/, '')) : false) ||
          (edge.targetHandle ? canvas.selectedRows?.has(edge.targetHandle.replace(/-[lr]$/, '')) : false)
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

        // Lazily measure + cache the path length, keyed by the `d` attribute set
        // above. Only called when a label actually needs it, so edges without
        // labels still never force SVG geometry.
        const getCachedTotalLength = (): number => {
          const currentD = pathEl.getAttribute('d') ?? '';
          if (currentD !== cachedPathD) {
            cachedPathD = currentD;
            cachedTotalLength = typeof pathEl.getTotalLength === 'function' ? (pathEl.getTotalLength() || 0) : 0;
          }
          return cachedTotalLength;
        };

        // Center label (uses labelPosition percentage or default midpoint)
        labelEl = ensureLabel(labelEl, edge.label, 'flow-edge-label', viewport, edge.id);
        if (labelEl) {
          const totalLength = getCachedTotalLength();
          if (totalLength > 0) {
            const t = edge.labelPosition ?? 0.5;
            const pt = getPointAtPercent(pathEl, t, totalLength);
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
          const totalLength = getCachedTotalLength();
          if (totalLength > 0) {
            const offset = edge.labelStartOffset ?? 30;
            const pt = pathEl.getPointAtLength(Math.min(offset, totalLength / 2));
            labelStartEl.style.left = `${pt.x}px`;
            labelStartEl.style.top = `${pt.y}px`;
          }
        }

        // End label (fixed pixel offset from target end)
        labelEndEl = ensureLabel(labelEndEl, edge.labelEnd, 'flow-edge-label flow-edge-label-end', viewport, edge.id);
        if (labelEndEl) {
          const totalLength = getCachedTotalLength();
          if (totalLength > 0) {
            const offset = edge.labelEndOffset ?? 30;
            const pt = pathEl.getPointAtLength(Math.max(totalLength - offset, totalLength / 2));
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
          // Forward edge.class to label so label styling can track edge state.
          // edge.class may be space-separated ("flow-edge-taken flow-edge-entering")
          // — split into individual tokens for classList operations.
          if (edge.class) {
            lbl.classList.add(...edge.class.split(' ').filter(Boolean));
          } else if (currentEdgeClass) {
            lbl.classList.remove(...currentEdgeClass.split(' ').filter(Boolean));
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
