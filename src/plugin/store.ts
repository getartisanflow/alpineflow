// ============================================================================
// Flow Store
//
// Global Alpine store for tracking multiple flowCanvas instances.
// Useful when a page has more than one flow editor.
//
// Access: Alpine.store('flow').get('my-flow-id')
// ============================================================================

import type { Alpine } from 'alpinejs';
import type { FlowInstance } from '../core/types';

interface FlowInstanceInternal extends FlowInstance {
  _active: boolean;
  _container: HTMLElement | null;
}

export function registerFlowStore(Alpine: Alpine) {
  Alpine.store('flow', {
    instances: {} as Record<string, FlowInstance>,
    activeId: null as string | null,

    register(id: string, instance: FlowInstance) {
      this.instances[id] = instance;
    },

    unregister(id: string) {
      if (this.activeId === id) this.activeId = null;
      delete this.instances[id];
    },

    get(id: string): FlowInstance | null {
      return this.instances[id] ?? null;
    },

    activate(id: string) {
      if (this.activeId === id) return;
      // Deactivate previous
      if (this.activeId) {
        const prev = this.instances[this.activeId] as FlowInstanceInternal | undefined;
        if (prev) {
          prev._active = false;
          prev._container?.classList.remove('flow-canvas-active');
        }
      }
      this.activeId = id;
      const inst = this.instances[id] as FlowInstanceInternal | undefined;
      if (inst) {
        inst._active = true;
        inst._container?.classList.add('flow-canvas-active');
      }
    },
  });
}
