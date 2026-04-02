import type { Awareness } from 'y-protocols/awareness';
import type { CollabUser, CollabAwarenessState, CollabInstance, CollabStatus } from './types';

/**
 * CollabAwareness — Manages cursor positions, selections, and presence.
 *
 * Wraps the Yjs awareness protocol. Each user broadcasts their cursor position,
 * selected nodes, and viewport. Remote awareness states are exposed as a
 * reactive `users` array for rendering cursors and presence UI.
 */
export class CollabAwareness implements CollabInstance {
  private awareness: Awareness;
  private localUser: CollabUser;
  private destroyed = false;
  private _users: CollabUser[] = [];
  private _remoteStates: Map<number, CollabAwarenessState> = new Map();
  private changeHandler: (changes: { added: number[]; updated: number[]; removed: number[] }) => void;
  private _onChangeCallbacks: Array<() => void> = [];

  status: CollabStatus = 'connected';

  constructor(awareness: Awareness, user: CollabUser) {
    this.awareness = awareness;
    this.localUser = user;

    // Set initial local state
    awareness.setLocalState({
      user,
      cursor: null,
      selectedNodes: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    } satisfies CollabAwarenessState);

    // Listen for awareness changes (remote users joining, moving cursors, etc.)
    this.changeHandler = () => {
      if (this.destroyed) return;
      this.rebuildUsers();
    };
    awareness.on('change', this.changeHandler);
  }

  // -- Public API --

  get me(): CollabUser {
    return this.localUser;
  }

  get users(): CollabUser[] {
    return this._users;
  }

  get userCount(): number {
    return this._users.length + 1; // +1 for self
  }

  get connected(): boolean {
    return !this.destroyed;
  }

  /** Get all remote awareness states (for cursor rendering). */
  getRemoteStates(): Map<number, CollabAwarenessState> {
    return this._remoteStates;
  }

  /** Subscribe to awareness changes. Returns unsubscribe function. */
  onChange(cb: () => void): () => void {
    this._onChangeCallbacks.push(cb);
    return () => {
      this._onChangeCallbacks = this._onChangeCallbacks.filter((c) => c !== cb);
    };
  }

  // -- Local state updates --

  updateCursor(pos: { x: number; y: number } | null): void {
    if (this.destroyed) return;
    const current = this.awareness.getLocalState() ?? {};
    this.awareness.setLocalState({ ...current, cursor: pos });
  }

  updateSelection(nodeIds: string[]): void {
    if (this.destroyed) return;
    const current = this.awareness.getLocalState() ?? {};
    this.awareness.setLocalState({ ...current, selectedNodes: nodeIds });
  }

  updateViewport(viewport: { x: number; y: number; zoom: number }): void {
    if (this.destroyed) return;
    const current = this.awareness.getLocalState() ?? {};
    this.awareness.setLocalState({ ...current, viewport });
  }

  // -- Internal --

  private rebuildUsers(): void {
    const states = this.awareness.getStates();
    const localId = this.awareness.clientID;
    const users: CollabUser[] = [];
    this._remoteStates.clear();

    states.forEach((state, clientId) => {
      if (clientId === localId) return;
      if (state?.user) {
        users.push(state.user as CollabUser);
        this._remoteStates.set(clientId, state as CollabAwarenessState);
      }
    });

    this._users = users;

    for (const cb of this._onChangeCallbacks) cb();
  }

  // -- Lifecycle --

  destroy(): void {
    this.destroyed = true;
    this.awareness.off('change', this.changeHandler);
    this.awareness.setLocalState(null);
    this._users = [];
    this._remoteStates.clear();
  }
}
