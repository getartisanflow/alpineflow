/**
 * Global store for collaboration instances.
 *
 * Collab objects (Yjs Doc, CollabBridge, CollabAwareness) contain circular
 * references that crash Alpine's deep-reactive proxy walker. Instead of
 * attaching them to the Alpine data object, they live here in a WeakMap
 * keyed by the canvas container element. Both flow-canvas.ts and the
 * x-flow-cursors directive import from this module.
 *
 * Uses globalThis to ensure a single shared instance across bundles —
 * when core loads from one bundle and the collab addon from another,
 * both must read/write the same WeakMap.
 */
import type { CollabBridge } from './bridge';
import type { CollabAwareness } from './awareness';

export interface CollabEntry {
  bridge: CollabBridge;
  awareness: CollabAwareness;
  doc: any;
  cursorCleanup?: () => void;
}

const COLLAB_STORE_KEY = '__alpineflow_collab_store__';

function getCollabStore(): WeakMap<HTMLElement, CollabEntry> {
  if (typeof globalThis !== 'undefined') {
    if (!(globalThis as any)[COLLAB_STORE_KEY]) {
      (globalThis as any)[COLLAB_STORE_KEY] = new WeakMap<HTMLElement, CollabEntry>();
    }
    return (globalThis as any)[COLLAB_STORE_KEY];
  }
  return new WeakMap<HTMLElement, CollabEntry>();
}

export const collabStore = getCollabStore();
