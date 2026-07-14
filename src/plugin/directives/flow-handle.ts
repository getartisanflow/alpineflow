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
import type { HandleType, HandlePosition, FlowEdge, FlowNode, Connection, XYPosition, PendingKeyboardConnect } from '../../core/types';
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from '../../core/geometry';
import { isValidConnection, checkConnectionRules } from '../../core/connections';
import { debug } from '../../core/debug';
import { HANDLE_VALIDATE_KEY } from './flow-handle-validate';
import { HANDLE_LIMIT_KEY } from './flow-handle-limit';
import { HANDLE_CONNECTABLE_START_KEY, HANDLE_CONNECTABLE_END_KEY } from './flow-handle-connectable';
import { DRAG_THRESHOLD, CONNECTION_ACTIVE_COLOR, CONNECTION_INVALID_COLOR } from '../../core/constants';
import { createConnectionLine, findSnapTarget, startConnectionAutoPan, type ConnectionLineInstance } from '../connection-utils';
import { isConnectable } from '../../core/node-flags';
import { buildDragValidationContext } from '../drag-validation';
import { buildHandleIndex, type HandleIndex } from '../handle-index';

let edgeIdCounter = 0;

/**
 * Per-container Escape listener registry for keyboard drag-to-connect.
 *
 * A canvas may contain N handles (N nodes × 2), and each handle's init used
 * to attach its own keydown listener to the shared `.flow-container`. On a
 * 10-node canvas that's 20 duplicate listeners — plus accumulation each time
 * a handle re-inits (x-if toggles, Livewire morphing, etc.).
 *
 * Instead we share ONE keydown listener per container, refcounted by the
 * number of keyboard-enabled handles currently bound. The first handle to
 * init attaches; subsequent handles bump the count; the last to clean up
 * removes the listener. Kept module-local so it lives alongside the
 * directive it serves and does not leak into the public canvas surface.
 */
type ContainerEscEntry = { count: number; handler: (e: KeyboardEvent) => void };
const containerEscListeners = new WeakMap<HTMLElement, ContainerEscEntry>();

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
    const sh = connection.sourceHandle ?? 'source';
    const sourceHandleEl = (
      sourceNodeEl.querySelector(
        `[data-flow-handle-id="${CSS.escape(sh)}"][data-flow-handle-type="source"]`,
      ) ?? sourceNodeEl.querySelector(`[data-flow-handle-id="${CSS.escape(sh)}"]`)
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
    const th = connection.targetHandle ?? 'target';
    const targetHandleEl = (
      targetNodeEl.querySelector(
        `[data-flow-handle-id="${CSS.escape(th)}"][data-flow-handle-type="target"]`,
      ) ?? targetNodeEl.querySelector(`[data-flow-handle-id="${CSS.escape(th)}"]`)
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
    const sh = connection.sourceHandle ?? 'source';
    const sourceHandleEl = (
      sourceNodeEl.querySelector(
        `[data-flow-handle-id="${CSS.escape(sh)}"][data-flow-handle-type="source"]`,
      ) ?? sourceNodeEl.querySelector(`[data-flow-handle-id="${CSS.escape(sh)}"]`)
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
    const th = connection.targetHandle ?? 'target';
    const targetHandleEl = (
      targetNodeEl.querySelector(
        `[data-flow-handle-id="${CSS.escape(th)}"][data-flow-handle-type="target"]`,
      ) ?? targetNodeEl.querySelector(`[data-flow-handle-id="${CSS.escape(th)}"]`)
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
 *
 * When `index` is provided (connect-drag / reconnect gestures build one on
 * pointerdown), validation runs O(1) per handle off a precomputed context with
 * ZERO further DOM queries or measurements. Without an index (one-shot callers:
 * click-to-connect, easy-connect, edge-body reconnect) the legacy container-wide
 * querySelector sweep runs unchanged. The two paths are behaviorally identical
 * — see src/plugin/drag-validation.test.ts's characterization battery.
 */
export function applyValidationClasses(
  containerEl: HTMLElement,
  sourceNodeId: string,
  sourceHandleId: string,
  canvas: any,
  excludeEdgeId?: string,
  index?: HandleIndex,
): void {
  if (!index) {
    legacyApplyValidationClasses(containerEl, sourceNodeId, sourceHandleId, canvas, excludeEdgeId);
    return;
  }

  const vctx = buildDragValidationContext(canvas, sourceNodeId, sourceHandleId, excludeEdgeId);

  // Hoist the SOURCE-side limit once: legacy checkHandleLimits checks the source
  // handle first, so a source already at its limit rejects EVERY target.
  const srcRec = index.get(sourceNodeId, sourceHandleId, 'source');
  const sourceLimitHit =
    srcRec?.limit != null &&
    (vctx.sourceCounts.get(`${sourceNodeId}|${sourceHandleId}`) ?? 0) >= srcRec.limit;

  // READ every record first, WRITE all classes after — no interleaved DOM
  // read/write so the browser never re-lays-out mid-loop.
  const results: Array<{ el: HTMLElement; valid: boolean; limitHit: boolean }> = [];

  for (const rec of index.byType('target')) {
    // Per-handle connectable guard reads the SPECIFIC element (mirror vs real),
    // matching legacy's `targetEl[HANDLE_CONNECTABLE_END_KEY] === false`.
    if (!rec.connectableEnd) {
      results.push({ el: rec.el, valid: false, limitHit: false });
      continue;
    }

    const connection: Connection = {
      source: sourceNodeId,
      sourceHandle: sourceHandleId,
      target: rec.nodeId,
      targetHandle: rec.handleId,
    };

    const targetNode = canvas.getNode(rec.nodeId);
    const builtInValid =
      targetNode?.connectable !== false &&
      rec.nodeId !== sourceNodeId &&
      !vctx.existingTargets.has(`${rec.nodeId}|${rec.handleId}`) &&
      !vctx.cycleForbidden.has(rec.nodeId);

    // Legacy checkHandleLimits / runHandleValidators re-resolve the target
    // handle by (nodeId, handleId) via querySelector, which returns the REAL
    // handle before its mirror. `index.get` applies the same real-preference, so
    // a mirror record inherits the real handle's limit + validator (its own are
    // permissive defaults). The connectable guard above intentionally uses the
    // specific element; only the limit/validator lookups are authoritative.
    const authoritative = index.get(rec.nodeId, rec.handleId, 'target') ?? rec;

    let limitValid = builtInValid && !sourceLimitHit;
    if (limitValid && authoritative.limit != null) {
      limitValid = (vctx.targetCounts.get(`${rec.nodeId}|${rec.handleId}`) ?? 0) < authoritative.limit;
    }

    let handleValid = limitValid;
    // Source validator: matches legacy runHandleValidators (rejects on any falsy
    // return) and is evaluated per-target since the connection carries `target`.
    if (handleValid && srcRec?.hasValidator) {
      handleValid = !!srcRec.el[HANDLE_VALIDATE_KEY]!(connection);
    }
    if (handleValid && authoritative.hasValidator) {
      handleValid = !!authoritative.el[HANDLE_VALIDATE_KEY]!(connection);
    }

    const globalValid =
      handleValid &&
      (!canvas._config?.isValidConnection || canvas._config.isValidConnection(connection));

    results.push({ el: rec.el, valid: globalValid, limitHit: builtInValid && !limitValid });
  }

  for (const r of results) {
    // classList.toggle(cls, cond) reproduces the legacy add/remove pairs exactly.
    r.el.classList.toggle('flow-handle-valid', r.valid);
    r.el.classList.toggle('flow-handle-invalid', !r.valid);
    r.el.classList.toggle('flow-handle-limit-reached', r.limitHit);
  }
}

/**
 * Legacy container-wide validation sweep — the behavioral ORACLE. Runs one
 * querySelectorAll over target handles and, per target, a full isValidConnection
 * + checkHandleLimits + runHandleValidators chain (each doing its own
 * querySelectors). Retained verbatim as the fallback for one-shot callers that
 * don't build a HandleIndex.
 */
export function legacyApplyValidationClasses(
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

/**
 * Toggle `.flow-connect-line--validating` on the temporary drag-line SVG while
 * an async `connectValidator` is awaiting. Call sites wrap the validator await
 * with `setDragLineValidating(svg, true)` … `finally { setDragLineValidating(svg, false) }`
 * so the pending affordance is guaranteed to clear even if the validator throws.
 *
 * Safe to call with `null`/`undefined` — the drag line may not exist on all
 * paths (e.g. click-to-connect) and the helper is a no-op in that case.
 */
export function setDragLineValidating(
  el: Element | null | undefined,
  on: boolean,
): void {
  if (!el) return;
  if (on) {
    el.classList.add('flow-connect-line--validating');
  } else {
    el.classList.remove('flow-connect-line--validating');
  }
}

/**
 * Single chokepoint for every "connection rejected" path (drag-to-connect,
 * click-to-connect, handle-pip reconnect, edge-body reconnect). Guarantees:
 *
 *   1. A consistent `flow-connect-rejected` CustomEvent on `containerEl` with
 *      detail `{reason, source, target, sourceHandle, targetHandle}`. `reason`
 *      is always present as a key, even when undefined (sync rejections don't
 *      carry a reason).
 *   2. A discoverable `console.warn('[alpineflow] connection rejected: ...')`
 *      so devs see the rejection in the console without wiring any listener.
 *
 * Extracted so future rejection paths can't diverge on detail shape or forget
 * to warn. Safe to call with a nullish container (no-op) — the drag-line
 * lifecycle sometimes tears down the container before rejection dispatches.
 */
export function dispatchConnectRejected(
  containerEl: Element | null | undefined,
  detail: {
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    reason?: string;
  },
): void {
  // Keep `reason` in the detail shape even when undefined so consumers can
  // destructure without existence checks.
  const eventDetail = {
    source: detail.source,
    target: detail.target,
    sourceHandle: detail.sourceHandle,
    targetHandle: detail.targetHandle,
    reason: detail.reason,
  };

  if (!containerEl) return;

  if (detail.reason !== undefined) {
    console.warn('[alpineflow] connection rejected:', detail.reason);
  } else {
    console.warn('[alpineflow] connection rejected');
  }

  containerEl.dispatchEvent(new CustomEvent('flow-connect-rejected', {
    detail: eventDetail,
    bubbles: true,
  }));
}

/**
 * Run the optional async `connectValidator` gate.
 *
 * Returns { allowed: true } when no validator is configured. Otherwise:
 *   - Adds `validatingClass` to the source + target handle elements.
 *   - Dispatches a `flow-connect-validating` CustomEvent on `containerEl`.
 *   - Awaits the validator (thrown errors become `{ allowed: false }`).
 *   - Removes the class and dispatches `flow-connect-validated` with detail
 *     `{ connection, allowed, reason }`.
 *
 * Extracted so it can be unit-tested without simulating pointer drags.
 */
export async function runConnectValidator(
  validator: ((conn: Connection) => Promise<boolean | { allowed: boolean; reason?: string }>) | undefined,
  connection: Connection,
  sourceEl: Element | null,
  targetEl: Element | null,
  containerEl: Element,
  validatingClass: string,
): Promise<{ allowed: boolean; reason?: string }> {
  if (!validator) return { allowed: true };

  sourceEl?.classList.add(validatingClass);
  targetEl?.classList.add(validatingClass);
  containerEl.dispatchEvent(new CustomEvent('flow-connect-validating', {
    detail: { connection },
    bubbles: true,
  }));

  let result: boolean | { allowed: boolean; reason?: string };
  try {
    result = await validator(connection);
  } catch (err) {
    debug('connection', 'connectValidator threw', err);
    result = false;
  } finally {
    sourceEl?.classList.remove(validatingClass);
    targetEl?.classList.remove(validatingClass);
  }

  const allowed = typeof result === 'boolean' ? result : !!result?.allowed;
  const reason = typeof result === 'object' && result && 'reason' in result ? result.reason : undefined;
  containerEl.dispatchEvent(new CustomEvent('flow-connect-validated', {
    detail: { connection, allowed, reason },
    bubbles: true,
  }));

  return { allowed, reason };
}

/**
 * Validate + apply an edge-endpoint reconnect.
 *
 * Runs the same validator chain as drag-to-connect (sync `isValidConnection`,
 * `connectionRules`, handle limits, per-handle validators, global
 * `isValidConnection`, then the async `connectValidator`). On success mutates
 * the edge in place (`edge.target`, `edge.targetHandle` — or the source pair
 * when `endpoint === 'source'`) and captures history. On rejection leaves the
 * edge unchanged and dispatches a `flow-connect-rejected` CustomEvent on
 * `containerEl` with the offending `{source, target, sourceHandle, targetHandle,
 * reason}` so consumers can show their own UI.
 *
 * Extracted so it can be unit-tested without simulating pointer drags.
 */
export async function applyReconnectValidation(params: {
  edge: FlowEdge;
  newConnection: Connection;
  canvas: any;
  containerEl: HTMLElement;
  endpoint?: HandleType;
}): Promise<{ applied: boolean; reason?: string }> {
  const { edge, newConnection, canvas, containerEl } = params;
  const endpoint: HandleType = params.endpoint ?? 'target';

  const otherEdges = (canvas.edges as FlowEdge[]).filter(
    (e: FlowEdge) => e.id !== edge.id,
  );

  const reject = (reason?: string): { applied: false; reason?: string } => {
    dispatchConnectRejected(containerEl, {
      source: newConnection.source,
      target: newConnection.target,
      sourceHandle: newConnection.sourceHandle,
      targetHandle: newConnection.targetHandle,
      reason,
    });
    return { applied: false, reason };
  };

  // ── Sync chain ─────────────────────────────────────────────────────────
  if (!isValidConnection(newConnection, otherEdges, { preventCycles: canvas._config?.preventCycles })) {
    return reject();
  }
  if (!checkConnectionRules(newConnection, canvas._config?.connectionRules, canvas._nodeMap)) {
    return reject();
  }
  if (!checkHandleLimits(containerEl, newConnection, otherEdges)) {
    return reject();
  }
  if (!runHandleValidators(containerEl, newConnection)) {
    return reject();
  }
  if (canvas._config?.isValidConnection && !canvas._config.isValidConnection(newConnection)) {
    return reject();
  }

  // ── Async validator gate ───────────────────────────────────────────────
  const asyncValidator = canvas._config?.connectValidator;
  if (asyncValidator) {
    const validatingClass = canvas._config?.validatingHandleClass ?? 'flow-handle-validating';
    const { sourceEl, targetEl } = findHandleElements(containerEl, newConnection);
    canvas._connectValidating = true;
    let asyncResult: { allowed: boolean; reason?: string };
    try {
      asyncResult = await runConnectValidator(
        asyncValidator, newConnection, sourceEl, targetEl, containerEl, validatingClass,
      );
    } finally {
      canvas._connectValidating = false;
    }
    if (!asyncResult.allowed) {
      return reject(asyncResult.reason);
    }
  }

  // ── Apply — mutate the edge in place so Alpine reactivity picks up ────
  canvas._captureHistory?.();
  if (endpoint === 'source') {
    edge.source = newConnection.source;
    edge.sourceHandle = newConnection.sourceHandle;
  } else {
    edge.target = newConnection.target;
    edge.targetHandle = newConnection.targetHandle;
  }

  return { applied: true };
}

/**
 * Validate + apply a new connection (drag-to-connect / keyboard-connect).
 *
 * Runs the same validator chain used by pointer drag-to-connect (sync
 * `isValidConnection`, `connectionRules`, handle limits, per-handle validators,
 * global `isValidConnection`, then the async `connectValidator`). On success,
 * creates the edge via `canvas.addEdges`, emits `connect`, and returns
 * `{ applied: true, edge }`. On rejection, dispatches `flow-connect-rejected`
 * on `containerEl` (single chokepoint) and returns `{ applied: false, reason }`.
 *
 * Used by the keyboard drag-to-connect path; the pointer drag-to-connect
 * handler keeps its inline chain for now (drag lifecycle + ghost-node + multi-
 * connect logic is tightly coupled to the pointer event loop). Both paths end
 * up firing the same events and dispatching the same rejection shape so
 * consumers see a consistent API.
 */
export async function applyConnectValidation(params: {
  connection: Connection;
  canvas: any;
  containerEl: HTMLElement;
}): Promise<{ applied: boolean; reason?: string; edge?: FlowEdge }> {
  const { connection, canvas, containerEl } = params;
  const edges = canvas.edges as FlowEdge[];

  const reject = (reason?: string): { applied: false; reason?: string } => {
    dispatchConnectRejected(containerEl, {
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      reason,
    });
    return { applied: false, reason };
  };

  // Target connectability guard
  const targetNode = canvas.getNode?.(connection.target);
  if (targetNode && !isConnectable(targetNode)) {
    return reject();
  }

  // ── Sync chain ─────────────────────────────────────────────────────────
  if (!isValidConnection(connection, edges, { preventCycles: canvas._config?.preventCycles })) {
    return reject();
  }
  if (!checkConnectionRules(connection, canvas._config?.connectionRules, canvas._nodeMap)) {
    return reject();
  }
  if (!checkHandleLimits(containerEl, connection, edges)) {
    return reject();
  }
  if (!runHandleValidators(containerEl, connection)) {
    return reject();
  }
  if (canvas._config?.isValidConnection && !canvas._config.isValidConnection(connection)) {
    return reject();
  }

  // ── Async validator gate ───────────────────────────────────────────────
  const asyncValidator = canvas._config?.connectValidator;
  if (asyncValidator) {
    const validatingClass = canvas._config?.validatingHandleClass ?? 'flow-handle-validating';
    const { sourceEl, targetEl } = findHandleElements(containerEl, connection);
    canvas._connectValidating = true;
    let asyncResult: { allowed: boolean; reason?: string };
    try {
      asyncResult = await runConnectValidator(
        asyncValidator, connection, sourceEl, targetEl, containerEl, validatingClass,
      );
    } finally {
      canvas._connectValidating = false;
    }
    if (!asyncResult.allowed) {
      return reject(asyncResult.reason);
    }
  }

  // ── Apply — create the edge ───────────────────────────────────────────
  const edgeId = `e-${connection.source}-${connection.target}-${Date.now()}-${edgeIdCounter++}`;
  const edge = { id: edgeId, ...connection } as FlowEdge;
  canvas.addEdges(edge);
  canvas._emit?.('connect', { connection });

  return { applied: true, edge };
}

/**
 * Resolve the source + target handle DOM elements for a connection within a
 * container. Returns null for any handle it cannot locate. Used by the
 * drag-to-connect + reconnect paths so the async validator can pulse both
 * sides of the pending edge.
 */
function findHandleElements(
  containerEl: HTMLElement,
  connection: Connection,
): { sourceEl: HTMLElement | null; targetEl: HTMLElement | null } {
  const sourceNodeEl = containerEl.querySelector(
    `[data-flow-node-id="${CSS.escape(connection.source)}"]`,
  );
  const sh = connection.sourceHandle ?? 'source';
  const sourceEl = (
    sourceNodeEl?.querySelector(
      `[data-flow-handle-id="${CSS.escape(sh)}"][data-flow-handle-type="source"]`,
    ) ?? sourceNodeEl?.querySelector(`[data-flow-handle-id="${CSS.escape(sh)}"]`)
    ?? null
  ) as HTMLElement | null;

  const targetNodeEl = containerEl.querySelector(
    `[data-flow-node-id="${CSS.escape(connection.target)}"]`,
  );
  const th = connection.targetHandle ?? 'target';
  const targetEl = (
    targetNodeEl?.querySelector(
      `[data-flow-handle-id="${CSS.escape(th)}"][data-flow-handle-type="target"]`,
    ) ?? targetNodeEl?.querySelector(`[data-flow-handle-id="${CSS.escape(th)}"]`)
    ?? null
  ) as HTMLElement | null;

  return { sourceEl, targetEl };
}

/** One connection line inside a multi-connect gesture. */
type MultiConnectLine = {
  line: ConnectionLineInstance;
  sourceNodeId: string;
  sourceHandleId: string;
  sourcePos: XYPosition;
  valid: boolean;
};

/**
 * Teardown for the gesture a handle currently has in flight, keyed by the
 * handle element that started it.
 *
 * Before delegation these were two closure slots inside the directive
 * (`activeConnectionCleanup` / `activeReconnectCleanup`): written by the
 * pointerdown handler when a gesture starts, nulled when it ends, and read by
 * the directive's `cleanup()` so a handle torn down mid-drag (x-if toggle,
 * Livewire morph, schema row re-stamp) aborts its own in-flight gesture instead
 * of leaking document listeners and a drag SVG. The handler bodies now live at
 * module scope, so the slot moves onto a WeakMap keyed by the handle element —
 * preserving the per-handle teardown granularity exactly. Entries are deleted on
 * every end/cancel path, mirroring today's `= null`.
 *
 * A handle is either a source or a target, never both, so one map serves both
 * gesture kinds without collision.
 */
const activeHandleGestureCleanups = new WeakMap<HTMLElement, () => void>();

/**
 * Start the SOURCE-handle pointer interaction: drag-to-connect, click-to-connect,
 * multi-connect and edge-drop all begin here.
 *
 * Extracted verbatim from the per-handle `pointerdown` listener so the delegated
 * listener (one per canvas — see `../handle-delegation.ts`) can drive any handle
 * without the directive attaching 5,000 listeners. Everything it needs is
 * recoverable from `handleEl`: the handle id from `dataset.flowHandleId`, the
 * node from `closest('[x-flow-node]')`, the connectable flag from the expando.
 *
 * Propagation semantics are load-bearing and preserved exactly: `preventDefault()`
 * + `stopPropagation()` fire UNCONDITIONALLY as the first two statements, before
 * any guard. `preventDefault()` is what suppresses the compatibility mouse events
 * that d3-drag binds on the node, i.e. it is the only thing stopping a handle
 * press from also dragging the node; `stopPropagation()` is what stops a schema
 * row from starting a reorder. Do not move them behind a guard.
 */
export function startSourceHandlePointerInteraction(
  handleEl: HTMLElement,
  canvas: any,
  e: PointerEvent,
): void {
  e.preventDefault();
  e.stopPropagation();

  const handleId = handleEl.dataset.flowHandleId ?? 'source';
  const nodeEl = handleEl.closest('[x-flow-node]') as HTMLElement | null;
  if (!canvas || !nodeEl) return;
  if (canvas._animationLocked) return;

  const sourceNodeId = nodeEl.dataset.flowNodeId;
  if (!sourceNodeId) return;

  // ── Connectable guard (source) ─────────────────────────
  const sourceNode = canvas.getNode(sourceNodeId);
  if (sourceNode && !isConnectable(sourceNode)) return;
  if (handleEl[HANDLE_CONNECTABLE_START_KEY] === false) return;

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
    const prevContainer = handleEl.closest('.flow-container') as HTMLElement;
    if (prevContainer) clearValidationClasses(prevContainer);
  }

  // Drag setup variables (deferred until threshold)
  let tempSvg: SVGSVGElement | null = null;
  let connectionLineInstance: ConnectionLineInstance | null = null;
  let snappedHandle: HTMLElement | null = null;
  let connectAutoPan: ReturnType<typeof startConnectionAutoPan> = null;
  let ghostEl: HTMLElement | null = null;
  const connectionSnapRadius = canvas._config?.connectionSnapRadius ?? 20;
  const containerEl = handleEl.closest('.flow-container') as HTMLElement;

  // Handle index for the whole gesture: built once on drag-start (see
  // initDrag), read O(1) per handle by applyValidationClasses on every
  // pointermove and, in a follow-up, by findSnapTarget. Nulled on every
  // end/cancel path so a stale index can't leak into the next gesture.
  let dragHandleIndex: HandleIndex | null = null;

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

    const handleRect = handleEl.getBoundingClientRect();
    const initContainerRect = containerEl.getBoundingClientRect();
    // Live viewport: reactive `viewport` may lag a frame behind a zoom.
    const liveVp = canvas._viewportLive ?? canvas.viewport;
    const initZoom = liveVp?.zoom || 1;
    const initVpX = liveVp?.x || 0;
    const initVpY = liveVp?.y || 0;

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

    // Measure every handle ONCE for the gesture. Valid for the whole
    // drag: nodes don't move during a connect-drag and viewport panning
    // doesn't change flow-space handle centers. If a future feature moves
    // nodes mid-connect-drag, rebuild this on those moves. The same
    // screen→flow transform findSnapTarget uses keeps centers consistent.
    dragHandleIndex = buildHandleIndex(
      containerEl,
      (sx: number, sy: number) => canvas.screenToFlowPosition(sx, sy),
    );

    applyValidationClasses(containerEl, sourceNodeId, handleId, canvas, undefined, dragHandleIndex);

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
    // Live viewport: reactive `viewport` may lag a frame behind a zoom.
    const liveVp = canvas._viewportLive ?? canvas.viewport;
    const zoom = liveVp?.zoom || 1;
    const vpX = liveVp?.x || 0;
    const vpY = liveVp?.y || 0;

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
        index: dragHandleIndex ?? undefined,
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
          const rulesValid = builtInValid && checkConnectionRules(connection, canvas._config?.connectionRules, canvas._nodeMap);
          const limitValid = rulesValid && checkHandleLimits(containerEl!, connection, canvas.edges);
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
      index: dragHandleIndex ?? undefined,
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

  const onPointerUp = async (upEvent: PointerEvent) => {
    connectAutoPan?.stop();
    connectAutoPan = null;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    // Mirror the listener set registered on drag-start (move/up/cancel)
    // and torn down by the gesture cleanup — otherwise each drop
    // leaks an orphan `pointercancel` handler on `document`.
    document.removeEventListener('pointercancel', onPointerUp);
    activeHandleGestureCleanups.delete(handleEl);
    // The gesture is ending; drop the index before any early return so a
    // stale one can never leak into a later drag. (A click that never
    // dragged never built one — it stays null and the click-to-connect
    // apply below falls through to the legacy path.)
    dragHandleIndex = null;

    // Guard against overlapping drops while an async connectValidator is pending.
    if (canvas._connectValidating) return;

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
          const rulesValid = builtInValid && checkConnectionRules(connection, canvas._config?.connectionRules, canvas._nodeMap);
          const limitValid = rulesValid && checkHandleLimits(containerEl!, connection, canvas.edges);
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
        // Click-to-connect is a one-shot, not a drag gesture:
        // dragHandleIndex is null here, so this uses the legacy path.
        applyValidationClasses(containerEl, sourceNodeId, handleId, canvas, undefined, dragHandleIndex ?? undefined);
      }
      return;
    }

    // Drag completed: existing drag-to-connect logic.
    //
    // NB: the drag-line SVG is intentionally kept alive past this point so
    // the async connectValidator (if any) can pulse it via
    // `.flow-connect-line--validating`. It is destroyed in the `finally`
    // at the bottom of this block so every return path still cleans up.
    const dragLineEl = connectionLineInstance?.svg ?? null;
    ghostEl?.remove();
    ghostEl = null;
    snappedHandle?.classList.remove('flow-handle-active');
    clearValidationClasses(containerEl);

    const dropPosition = canvas.screenToFlowPosition(upEvent.clientX, upEvent.clientY);
    const connectEndBase = { source: sourceNodeId, sourceHandle: handleId, position: dropPosition };

    try {

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
          if (!checkConnectionRules(connection, canvas._config?.connectionRules, canvas._nodeMap)) {
            debug('connection', 'Connection rejected (connection rules)', connection);
            dispatchConnectRejected(containerEl, connection);
            canvas._emit('connect-end', { connection: null, ...connectEndBase });
            canvas.pendingConnection = null;
            return;
          }
          if (!checkHandleLimits(containerEl, connection, canvas.edges)) {
            debug('connection', 'Connection rejected (handle limit)', connection);
            dispatchConnectRejected(containerEl, connection);
            canvas._emit('connect-end', { connection: null, ...connectEndBase });
            canvas.pendingConnection = null;
            return;
          }
          if (!runHandleValidators(containerEl, connection)) {
            debug('connection', 'Connection rejected (per-handle validator)', connection);
            dispatchConnectRejected(containerEl, connection);
            canvas._emit('connect-end', { connection: null, ...connectEndBase });
            canvas.pendingConnection = null;
            return;
          }
          if (canvas._config?.isValidConnection && !canvas._config.isValidConnection(connection)) {
            debug('connection', 'Connection rejected (custom validator)', connection);
            dispatchConnectRejected(containerEl, connection);
            canvas._emit('connect-end', { connection: null, ...connectEndBase });
            canvas.pendingConnection = null;
            return;
          }

          // Async validator gate
          const asyncValidator = canvas._config?.connectValidator;
          if (asyncValidator) {
            const validatingClass = canvas._config?.validatingHandleClass ?? 'flow-handle-validating';
            const { sourceEl, targetEl } = findHandleElements(containerEl, connection);
            canvas._connectValidating = true;
            setDragLineValidating(dragLineEl, true);
            let asyncResult: { allowed: boolean; reason?: string };
            try {
              asyncResult = await runConnectValidator(
                asyncValidator, connection, sourceEl, targetEl, containerEl, validatingClass,
              );
            } finally {
              canvas._connectValidating = false;
              setDragLineValidating(dragLineEl, false);
            }
            if (!asyncResult.allowed) {
              debug('connection', 'Connection rejected (async connectValidator)', { connection, reason: asyncResult.reason });
              dispatchConnectRejected(containerEl, { ...connection, reason: asyncResult.reason });
              canvas._emit('connect-end', { connection: null, ...connectEndBase });
              canvas.pendingConnection = null;
              return;
            }
          }

          const edgeId = `e-${sourceNodeId}-${targetNodeId}-${Date.now()}-${edgeIdCounter++}`;
          canvas.addEdges({ id: edgeId, ...connection });
          debug('connection', `Connection created: ${sourceNodeId} → ${targetNodeId}`, connection);
          canvas._emit('connect', { connection });
          canvas._emit('connect-end', { connection, ...connectEndBase });
        } else {
          debug('connection', 'Connection rejected (invalid)', connection);
          dispatchConnectRejected(containerEl, connection);
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
    } finally {
      // Tear down the drag-line SVG regardless of which path produced the
      // outcome (success, sync rejection, async rejection, or early return).
      setDragLineValidating(dragLineEl, false);
      connectionLineInstance?.destroy();
      connectionLineInstance = null;
    }

    canvas.pendingConnection = null;
  };

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);

  activeHandleGestureCleanups.set(handleEl, () => {
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
    dragHandleIndex = null;
    canvas.pendingConnection = null;
    canvas._container?.classList.remove('flow-connecting');
  });
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

      // ── Keyboard drag-to-connect (a11y, opt-in) ───────────────────────
      // When canvas._config.keyboardConnect is true, make this handle focusable
      // and wire Enter/Space/Escape to drive a connection flow equivalent to
      // pointer drag-to-connect. Source handles arm a pending connection;
      // target handles complete it; Escape cancels. Attributes are only set
      // when the feature is enabled so existing tab order is preserved on apps
      // that haven't opted in.
      let keyboardBindingsCleanup: (() => void) | null = null;
      {
        const initCanvas = getCanvas();
        if (initCanvas?._config?.keyboardConnect) {
          el.setAttribute('tabindex', '0');
          el.setAttribute('role', 'button');
          el.setAttribute('aria-label', `${type} handle ${handleId}`);

          const clearPending = (canvas: { _pendingKeyboardConnect?: PendingKeyboardConnect | null } | null | undefined) => {
            const prev = canvas?._pendingKeyboardConnect;
            if (!prev) return;
            const containerEl = el.closest('.flow-container') as HTMLElement | null;
            if (containerEl) {
              const prevEl = containerEl.querySelector(
                `[data-flow-node-id="${CSS.escape(prev.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(prev.sourceHandleId)}"][data-flow-handle-type="source"]`,
              );
              (prevEl as HTMLElement | null)?.classList.remove('flow-handle-connect-pending');
            }
            if (canvas) canvas._pendingKeyboardConnect = null;
          };

          const onKeyDown = (e: KeyboardEvent) => {
            const isActivate = e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar';
            if (!isActivate) return;

            const canvas = getCanvas();
            if (!canvas) return;
            if (canvas._animationLocked) return;

            const nodeId = getNodeId();
            if (!nodeId) return;

            if (type === 'source') {
              // Guard: node / handle must be connectable as start
              const sourceNode = canvas.getNode?.(nodeId);
              if (sourceNode && !isConnectable(sourceNode)) return;
              if (el[HANDLE_CONNECTABLE_START_KEY] === false) return;

              e.preventDefault();
              e.stopPropagation();

              // Re-arming: clear previous pending first
              clearPending(canvas);

              canvas._pendingKeyboardConnect = {
                sourceNodeId: nodeId,
                sourceHandleId: handleId,
              };
              el.classList.add('flow-handle-connect-pending');

              // Route to the existing aria-live announcer when present.
              // If no announcer is configured on this canvas, skip silently —
              // we don't invent a new live region here.
              canvas._announcer?.announce?.(`Connecting from ${type} handle ${handleId}. Focus a target handle and press Enter to connect.`);
            } else {
              // target handle: complete pending connection (if any)
              if (!canvas._pendingKeyboardConnect) return;

              const targetNode = canvas.getNode?.(nodeId);
              if (targetNode && !isConnectable(targetNode)) return;
              if (el[HANDLE_CONNECTABLE_END_KEY] === false) return;

              e.preventDefault();
              e.stopPropagation();

              const { sourceNodeId, sourceHandleId } = canvas._pendingKeyboardConnect;
              const connection: Connection = {
                source: sourceNodeId,
                sourceHandle: sourceHandleId,
                target: nodeId,
                targetHandle: handleId,
              };

              const containerEl = el.closest('.flow-container') as HTMLElement | null;
              // Clear pending state + class before running the pipeline — the
              // validator is async, and we don't want the pending affordance
              // stuck on a no-longer-armed source if the user re-focuses mid-
              // validation.
              clearPending(canvas);

              if (!containerEl) return;

              // Fire-and-forget the async validator pipeline. Rejections
              // dispatch flow-connect-rejected via the shared helper; success
              // emits `connect` + adds the edge.
              void applyConnectValidation({ connection, canvas, containerEl }).then((result) => {
                if (result.applied) {
                  canvas._announcer?.announce?.(`Connected ${sourceNodeId} to ${nodeId}.`);
                }
              });
            }
          };

          el.addEventListener('keydown', onKeyDown);

          // Shared Escape listener on the canvas container (not document) so
          // we don't hijack keys on other focusable apps on the page. Only one
          // listener is attached per container regardless of how many handles
          // init — see `containerEscListeners` at the top of this module.
          const containerEl = el.closest('.flow-container') as HTMLElement | null;
          if (containerEl) {
            const existing = containerEscListeners.get(containerEl);
            if (existing) {
              existing.count += 1;
            } else {
              const handler = (e: KeyboardEvent) => {
                if (e.key !== 'Escape') return;
                // Look up the canvas fresh each fire — the container outlives
                // any individual handle, so closing over `getCanvas()` (which
                // closes over `el`) would leak if that handle is torn down.
                const canvasEl =
                  containerEl.matches('[x-data]')
                    ? containerEl
                    : (containerEl.closest('[x-data]') as HTMLElement | null)
                      ?? (containerEl.querySelector('[x-data]') as HTMLElement | null);
                if (!canvasEl) return;
                const canvas = Alpine.$data(canvasEl) as
                  | { _pendingKeyboardConnect?: PendingKeyboardConnect | null }
                  | null;
                if (!canvas?._pendingKeyboardConnect) return;
                clearPending(canvas);
              };
              containerEl.addEventListener('keydown', handler);
              containerEscListeners.set(containerEl, { count: 1, handler });
            }
          }

          keyboardBindingsCleanup = () => {
            el.removeEventListener('keydown', onKeyDown);
            if (containerEl) {
              const entry = containerEscListeners.get(containerEl);
              if (entry) {
                entry.count -= 1;
                if (entry.count <= 0) {
                  containerEl.removeEventListener('keydown', entry.handler);
                  containerEscListeners.delete(containerEl);
                }
              }
            }
            el.removeAttribute('tabindex');
            el.removeAttribute('role');
            el.removeAttribute('aria-label');
            el.classList.remove('flow-handle-connect-pending');
          };
        }
      }

      if (type === 'source') {
        // ── Source handle: initiate drag-to-connect ──────────────────
        // The gesture body lives at module scope (startSourceHandlePointerInteraction)
        // so the delegated canvas-level listener can drive any handle. The canvas is
        // still resolved fresh on every press, exactly as before.
        const onPointerDown = (e: PointerEvent) => {
          startSourceHandlePointerInteraction(el, getCanvas(), e);
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
          // Abort any gesture this handle still has in flight (see
          // `activeHandleGestureCleanups`), then drop its slot.
          activeHandleGestureCleanups.get(el)?.();
          activeHandleGestureCleanups.delete(el);
          keyboardBindingsCleanup?.();
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
        const onTargetClick = async (e: MouseEvent) => {
          const canvas = getCanvas();
          if (!canvas?.pendingConnection) return;
          if (canvas._config?.connectOnClick === false) return;
          if (canvas._connectValidating) return;

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
            if (!checkConnectionRules(connection, canvas._config?.connectionRules, canvas._nodeMap)) {
              debug('connection', 'Click-to-connect rejected (connection rules)', connection);
              dispatchConnectRejected(clickContainerEl, connection);
              canvas._emit('connect-end', { connection: null, ...connectEndBase });
              canvas.pendingConnection = null;
              canvas._container?.classList.remove('flow-connecting');
              if (clickContainerEl) clearValidationClasses(clickContainerEl);
              return;
            }
            if (clickContainerEl && !checkHandleLimits(clickContainerEl, connection, canvas.edges)) {
              debug('connection', 'Click-to-connect rejected (handle limit)', connection);
              dispatchConnectRejected(clickContainerEl, connection);
              canvas._emit('connect-end', { connection: null, ...connectEndBase });
              canvas.pendingConnection = null;
              canvas._container?.classList.remove('flow-connecting');
              clearValidationClasses(clickContainerEl);
              return;
            }
            if (clickContainerEl && !runHandleValidators(clickContainerEl, connection)) {
              debug('connection', 'Click-to-connect rejected (per-handle validator)', connection);
              dispatchConnectRejected(clickContainerEl, connection);
              canvas._emit('connect-end', { connection: null, ...connectEndBase });
              canvas.pendingConnection = null;
              canvas._container?.classList.remove('flow-connecting');
              if (clickContainerEl) clearValidationClasses(clickContainerEl);
              return;
            }
            if (canvas._config?.isValidConnection && !canvas._config.isValidConnection(connection)) {
              debug('connection', 'Click-to-connect rejected (custom validator)', connection);
              dispatchConnectRejected(clickContainerEl, connection);
              canvas._emit('connect-end', { connection: null, ...connectEndBase });
              canvas.pendingConnection = null;
              canvas._container?.classList.remove('flow-connecting');
              if (clickContainerEl) clearValidationClasses(clickContainerEl);
              return;
            }

            // Async validator gate
            const asyncValidator = canvas._config?.connectValidator;
            if (asyncValidator && clickContainerEl) {
              const validatingClass = canvas._config?.validatingHandleClass ?? 'flow-handle-validating';
              const { sourceEl, targetEl } = findHandleElements(clickContainerEl, connection);
              canvas._connectValidating = true;
              let asyncResult: { allowed: boolean; reason?: string };
              try {
                asyncResult = await runConnectValidator(
                  asyncValidator, connection, sourceEl, targetEl, clickContainerEl, validatingClass,
                );
              } finally {
                canvas._connectValidating = false;
              }
              if (!asyncResult.allowed) {
                debug('connection', 'Click-to-connect rejected (async connectValidator)', { connection, reason: asyncResult.reason });
                dispatchConnectRejected(clickContainerEl, { ...connection, reason: asyncResult.reason });
                canvas._emit('connect-end', { connection: null, ...connectEndBase });
                canvas.pendingConnection = null;
                canvas._container?.classList.remove('flow-connecting');
                clearValidationClasses(clickContainerEl);
                return;
              }
            }

            const edgeId = `e-${connection.source}-${connection.target}-${Date.now()}-${edgeIdCounter++}`;
            canvas.addEdges({ id: edgeId, ...connection });
            debug('connection', `Click-to-connect: ${connection.source} → ${connection.target}`, connection);
            canvas._emit('connect', { connection });
            canvas._emit('connect-end', { connection, ...connectEndBase });
          } else {
            debug('connection', 'Click-to-connect rejected (invalid)', connection);
            const invalidContainerEl = el.closest('.flow-container') as HTMLElement;
            dispatchConnectRejected(invalidContainerEl, connection);
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
          // Live viewport: reactive `viewport` may lag a frame behind a zoom.
          const liveVp = canvas._viewportLive ?? canvas.viewport;
          const initZoom = liveVp?.zoom || 1;
          const initVpX = liveVp?.x || 0;
          const initVpY = liveVp?.y || 0;

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

          // Separate index for this reconnect gesture (its own pointer scope),
          // built once on drag-start and cleared in cleanupReconnection.
          let reconnectHandleIndex: HandleIndex | null = null;

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

            // Measure handles once for this reconnect gesture (same rationale +
            // transform as the connect-drag path). Excludes the edge being
            // reconnected from duplicate/limit accounting via its id.
            reconnectHandleIndex = buildHandleIndex(
              containerEl,
              (sx: number, sy: number) => canvas.screenToFlowPosition(sx, sy),
            );

            applyValidationClasses(containerEl, connectedEdge.source, connectedEdge.sourceHandle ?? 'source', canvas, connectedEdge.id, reconnectHandleIndex);
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
              index: reconnectHandleIndex ?? undefined,
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
            reconnectHandleIndex = null;
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

          const onPointerUp = async (upE: PointerEvent) => {
            if (!dragging) {
              cleanupReconnection();
              return;
            }

            // Guard against overlapping drops while an async connectValidator is pending.
            if (canvas._connectValidating) return;

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

                  const oldEdge = { ...connectedEdge };
                  const reconnectDragLineEl = reconnectLineInstance?.svg ?? null;
                  setDragLineValidating(reconnectDragLineEl, true);
                  let result: { applied: boolean; reason?: string };
                  try {
                    result = await applyReconnectValidation({
                      edge: connectedEdge,
                      newConnection,
                      canvas,
                      containerEl,
                      endpoint: 'target',
                    });
                  } finally {
                    setDragLineValidating(reconnectDragLineEl, false);
                  }

                  if (result.applied) {
                    successful = true;
                    debug('reconnect', `Edge "${connectedEdge.id}" reconnected (target)`, newConnection);
                    canvas._emit('reconnect', { oldEdge, newConnection });
                  } else {
                    debug('reconnect', 'Reconnection rejected', { connection: newConnection, reason: result.reason });
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
          keyboardBindingsCleanup?.();
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
