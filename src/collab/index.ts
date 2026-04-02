// ============================================================================
// alpinejs-flow/collab — Real-Time Collaboration Addon
//
// Opt-in module for collaborative editing. Requires yjs peer dependency.
// Import separately from the main plugin:
//
//   import { WebSocketProvider, ReverbProvider } from 'alpinejs-flow/collab';
//
// ============================================================================

import type { Alpine } from 'alpinejs';
import { registerAddon } from '../core/registry';
import { Doc, applyUpdate, encodeStateAsUpdate, encodeStateVector } from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { CollabBridge } from './bridge';
import { CollabAwareness } from './awareness';
import { registerFlowCursorsDirective } from './directives/flow-cursors';
import { setYjsFunctions } from './providers/reverb';

export interface CollabFactory {
  Doc: typeof Doc;
  Awareness: typeof Awareness;
  CollabBridge: typeof CollabBridge;
  CollabAwareness: typeof CollabAwareness;
}

export default function AlpineFlowCollab(Alpine: Alpine) {
  registerFlowCursorsDirective(Alpine);
  // Share yjs function references from this module's import so providers
  // use the exact same yjs instance as the Doc constructor.
  setYjsFunctions({ applyUpdate, encodeStateAsUpdate, encodeStateVector });
  registerAddon('collab', {
    Doc,
    Awareness,
    CollabBridge,
    CollabAwareness,
  } satisfies CollabFactory);
}

export { CollabBridge } from './bridge';
export { CollabAwareness } from './awareness';
export { WebSocketProvider } from './providers/websocket';
export { ReverbProvider } from './providers/reverb';
export { InMemoryProvider, linkProviders } from './providers/in-memory';
export { registerFlowCursorsDirective } from './directives/flow-cursors';

export type {
  CollabProvider,
  CollabConfig,
  CollabInstance,
  CollabUser,
  CollabAwarenessState,
  CollabStatus,
} from './types';
