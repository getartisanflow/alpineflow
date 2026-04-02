import type { Doc as YDoc } from 'yjs';
import type { Awareness } from 'y-protocols/awareness';

// -- Provider Interface ---

export type CollabStatus = 'connecting' | 'connected' | 'disconnected';

export interface CollabProvider {
  /** Connect the provider to a Yjs document and awareness instance. */
  connect(doc: YDoc, awareness: Awareness): void;
  /** Disconnect from the remote peer(s). */
  disconnect(): void;
  /** Permanently tear down the provider and release resources. */
  destroy(): void;

  readonly connected: boolean;
  readonly roomId: string;

  on(event: 'status', cb: (status: CollabStatus) => void): void;
  on(event: 'sync', cb: (synced: boolean) => void): void;
  off(event: string, cb: (...args: any[]) => void): void;
}

// -- User & Awareness ---

export interface CollabUser {
  name: string;
  color: string;
}

export interface CollabAwarenessState {
  user: CollabUser;
  cursor: { x: number; y: number } | null;
  selectedNodes: string[];
  viewport: { x: number; y: number; zoom: number };
}

// -- Collab Config (passed in flowCanvas config) ---

export interface CollabConfig {
  provider: CollabProvider;
  user: CollabUser;
  /** Show remote user cursors. Default true. */
  cursors?: boolean;
  /** Show remote user selections. Default true. */
  selections?: boolean;
  /** Cursor broadcast throttle in ms. Default 20. */
  throttle?: number;
}

// -- Collab Instance (exposed as $flow.collab) ---

export interface CollabInstance {
  /** All connected users (reactive). */
  readonly users: CollabUser[];
  /** Number of connected users. */
  readonly userCount: number;
  /** Local user info. */
  readonly me: CollabUser;
  /** Whether the provider is currently connected. */
  readonly connected: boolean;
  /** Current connection status. */
  readonly status: CollabStatus;
}
