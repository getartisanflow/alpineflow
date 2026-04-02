// ============================================================================
// FlowHistory — Snapshot-based Undo/Redo
//
// Maintains past/future stacks of { nodes, edges } snapshots.
// Each capture deep-clones the current state before a mutation.
// ============================================================================

import type { FlowNode, FlowEdge } from './types';

export interface HistorySnapshot {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/**
 * Deep-clone a snapshot. Uses JSON round-trip instead of structuredClone
 * because Alpine.js wraps reactive arrays/objects in Proxy, which
 * structuredClone cannot handle (throws DataCloneError).
 *
 * **Warning:** Only JSON-serializable data is preserved. Functions, Symbols,
 * Maps, Sets, and `undefined` values stored in `node.data` or `edge.data`
 * will be silently dropped during undo/redo.
 */
function clone(snapshot: HistorySnapshot): HistorySnapshot {
  return JSON.parse(JSON.stringify(snapshot));
}

export class FlowHistory {
  private past: HistorySnapshot[] = [];
  private future: HistorySnapshot[] = [];
  private maxSize: number;
  private _suspendDepth = 0;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  suspend(): void {
    this._suspendDepth++;
  }

  resume(): void {
    if (this._suspendDepth > 0) this._suspendDepth--;
  }

  capture(current: HistorySnapshot): void {
    if (this._suspendDepth > 0) return;
    this.past.push(clone(current));
    this.future = [];
    if (this.past.length > this.maxSize) this.past.shift();
  }

  undo(current: HistorySnapshot): HistorySnapshot | null {
    if (this.past.length === 0) return null;
    this.future.push(clone(current));
    return this.past.pop()!;
  }

  redo(current: HistorySnapshot): HistorySnapshot | null {
    if (this.future.length === 0) return null;
    this.past.push(clone(current));
    return this.future.pop()!;
  }

  get canUndo(): boolean { return this.past.length > 0; }
  get canRedo(): boolean { return this.future.length > 0; }
}
