// ============================================================================
// FlowHistory — Snapshot-based Undo/Redo
//
// Maintains past/future stacks of { nodes, edges } snapshots serialized as
// JSON strings. String storage roughly halves retained memory vs keeping 50
// live object graphs, makes duplicate-state dedup an O(1) string compare, and
// costs nothing extra — `JSON.stringify` was already paid on every capture.
// ============================================================================

import type { FlowNode, FlowEdge } from './types';

export interface HistorySnapshot {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/**
 * Snapshots are stored as JSON strings. Serialization uses JSON (not
 * structuredClone) because Alpine.js wraps reactive arrays/objects in Proxy,
 * which structuredClone cannot handle (throws DataCloneError).
 *
 * **Warning:** Only JSON-serializable data is preserved. Functions, Symbols,
 * Maps, Sets, and `undefined` values stored in `node.data` or `edge.data`
 * will be silently dropped during undo/redo.
 */
export class FlowHistory {
  private past: string[] = [];
  private future: string[] = [];
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
    this.commit(JSON.stringify(current));
  }

  /** Serialize without pushing — pair with commit() for deferred capture. */
  snapshot(current: HistorySnapshot): string {
    return JSON.stringify(current);
  }

  /** Push a snapshot taken earlier via snapshot(). Dedups against the top of the stack. */
  commit(snapshotJson: string): void {
    if (this._suspendDepth > 0) return;
    if (this.past.length > 0 && this.past[this.past.length - 1] === snapshotJson) return;
    this.past.push(snapshotJson);
    this.future = [];
    if (this.past.length > this.maxSize) this.past.shift();
  }

  undo(current: HistorySnapshot): HistorySnapshot | null {
    if (this.past.length === 0) return null;
    this.future.push(JSON.stringify(current));
    return JSON.parse(this.past.pop()!);
  }

  redo(current: HistorySnapshot): HistorySnapshot | null {
    if (this.future.length === 0) return null;
    this.past.push(JSON.stringify(current));
    return JSON.parse(this.future.pop()!);
  }

  get canUndo(): boolean { return this.past.length > 0; }
  get canRedo(): boolean { return this.future.length > 0; }
}
