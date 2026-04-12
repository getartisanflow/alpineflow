// ============================================================================
// Transaction — Groups animation handles with rollback capability
//
// A Transaction captures property snapshots lazily (first touch per key) and
// tracks all AnimationHandles created while it is active. On rollback, all
// tracked handles are frozen and all touched properties revert to their
// pre-transaction values.
// ============================================================================

import type { AnimationHandle } from './animator';

export type TransactionState = 'active' | 'committed' | 'rolled-back';

export class Transaction {
  private _handles: AnimationHandle[] = [];
  private _state: TransactionState = 'active';
  private _propertySnapshots = new Map<string, { value: number | string; apply: (v: number | string) => void }>();
  private _resolveFinished!: () => void;
  readonly finished: Promise<void>;

  constructor() {
    this.finished = new Promise<void>((resolve) => {
      this._resolveFinished = resolve;
    });
  }

  get state(): TransactionState { return this._state; }
  get handles(): ReadonlyArray<AnimationHandle> { return this._handles; }

  /** Called by the Animator when a new handle is created inside this transaction. */
  trackHandle(handle: AnimationHandle): void {
    if (this._state !== 'active') { return; }
    this._handles.push(handle);
  }

  /**
   * Called by the Animator the FIRST time a property key is touched inside this transaction.
   * Captures the pre-transaction value for rollback (lazy snapshot — only first touch per key).
   */
  captureProperty(key: string, value: number | string, apply: (v: number | string) => void): void {
    if (this._state !== 'active') { return; }
    // Only capture the first time — lazy snapshot
    if (!this._propertySnapshots.has(key)) {
      this._propertySnapshots.set(key, { value, apply });
    }
  }

  commit(): void {
    if (this._state !== 'active') { return; }
    this._state = 'committed';
    this._resolveFinished();
  }

  rollback(): void {
    if (this._state !== 'active') { return; }
    // Stop all tracked handles with freeze (don't jump to end)
    for (const handle of this._handles) {
      handle.stop({ mode: 'freeze' });
    }
    // Revert all captured properties
    for (const [, snap] of this._propertySnapshots) {
      snap.apply(snap.value);
    }
    this._state = 'rolled-back';
    this._resolveFinished();
  }
}
