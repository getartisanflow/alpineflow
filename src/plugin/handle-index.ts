// ============================================================================
// HandleIndex
//
// One measured DOM pass over connection handles per drag gesture. Building
// this index reads `getBoundingClientRect()` for every handle exactly once
// and converts each handle's screen-space center to a flow-space position.
// Because nodes don't move and panning doesn't change flow-space positions
// during a connect-drag, the captured flow-space centers stay valid for the
// entire gesture — callers build the index once on pointerdown and reuse it
// on every subsequent pointermove instead of re-querying and re-measuring
// the DOM per event.
// ============================================================================

import type { XYPosition } from '../core/types';
import { HANDLE_LIMIT_KEY } from './directives/flow-handle-limit';
import { HANDLE_VALIDATE_KEY } from './directives/flow-handle-validate';
import {
  HANDLE_CONNECTABLE_START_KEY,
  HANDLE_CONNECTABLE_END_KEY,
} from './directives/flow-handle-connectable';

/** A single measured connection handle, captured once per drag gesture. */
export interface HandleRecord {
  el: HTMLElement;
  nodeId: string;
  handleId: string; // dataset.flowHandleId ?? 'source'/'target'
  type: 'source' | 'target';
  isMirror: boolean; // classList contains 'flow-schema-handle--mirror'
  flowX: number; // flow-space center
  flowY: number;
  connectableStart: boolean; // HANDLE_CONNECTABLE_START_KEY !== false at build time
  connectableEnd: boolean;
  hasValidator: boolean; // HANDLE_VALIDATE_KEY present
  limit: number | null; // HANDLE_LIMIT_KEY value
}

/** Indexed view over the handles measured by `buildHandleIndex()`. */
export interface HandleIndex {
  all: HandleRecord[];
  byType(type: 'source' | 'target'): HandleRecord[];
  /** Real handle preferred over mirror. */
  get(nodeId: string, handleId: string, type: 'source' | 'target'): HandleRecord | undefined;
}

/**
 * Build a `HandleIndex` by making one measured pass over every connection
 * handle inside `containerEl`. Captures each handle's flow-space center
 * ONCE per drag — nodes don't move and panning doesn't change flow-space
 * positions, so the captured centers stay valid for the whole gesture.
 * Consumers (A2 validation, A3 snap-targeting) should build this once on
 * pointerdown and reuse it across every pointermove, rather than re-querying
 * and re-measuring the DOM per event.
 *
 * This is a read-only pass: it never writes to the DOM, so it never
 * triggers layout thrash.
 */
export function buildHandleIndex(
  containerEl: HTMLElement,
  toFlowPosition: (screenX: number, screenY: number) => XYPosition,
): HandleIndex {
  const all: HandleRecord[] = [];
  const byKey = new Map<string, HandleRecord>();
  const nodeIdCache = new Map<HTMLElement, string | null>();

  const els = containerEl.querySelectorAll<HTMLElement>('[data-flow-handle-type]');
  for (const el of els) {
    // Resolve owning node once per node element, not per handle.
    const nodeEl = el.closest('[data-flow-node-id]') as HTMLElement | null;
    if (!nodeEl) continue;
    let nodeId = nodeIdCache.get(nodeEl);
    if (nodeId === undefined) {
      nodeId = nodeEl.dataset.flowNodeId ?? null;
      nodeIdCache.set(nodeEl, nodeId);
    }
    if (!nodeId) continue;

    const rect = el.getBoundingClientRect(); // READ phase only — no writes in this loop
    if (rect.width === 0 && rect.height === 0) continue; // display:none handles

    const type = el.dataset.flowHandleType as 'source' | 'target';
    const center = toFlowPosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const record: HandleRecord = {
      el,
      nodeId,
      handleId: el.dataset.flowHandleId ?? type,
      type,
      isMirror: el.classList.contains('flow-schema-handle--mirror'),
      flowX: center.x,
      flowY: center.y,
      connectableStart: el[HANDLE_CONNECTABLE_START_KEY] !== false,
      connectableEnd: el[HANDLE_CONNECTABLE_END_KEY] !== false,
      hasValidator: el[HANDLE_VALIDATE_KEY] != null,
      limit: el[HANDLE_LIMIT_KEY] ?? null,
    };
    all.push(record);
    const key = `${nodeId}|${record.handleId}|${type}`;
    const existing = byKey.get(key);
    if (!existing || (existing.isMirror && !record.isMirror)) byKey.set(key, record);
  }

  const sources = all.filter((r) => r.type === 'source');
  const targets = all.filter((r) => r.type === 'target');
  return {
    all,
    byType: (t) => (t === 'source' ? sources : targets),
    get: (nodeId, handleId, type) => byKey.get(`${nodeId}|${handleId}|${type}`),
  };
}
