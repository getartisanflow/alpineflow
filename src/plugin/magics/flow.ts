// ============================================================================
// $flow Magic
//
// Provides convenient access to the nearest flowCanvas data component
// from any descendant element.
//
// Usage: <button @click="$flow.addNodes({ id: '3', position: { x: 0, y: 0 }, data: {} })">
// ============================================================================

import type { Alpine } from 'alpinejs';

export function registerFlowMagic(Alpine: Alpine) {
  Alpine.magic('flow', (el) => {
    const flowEl = el.closest('[data-flow-canvas]') as HTMLElement | null;
    if (!flowEl) {
      console.warn('[alpinejs-flow] $flow used outside of a flowCanvas context');
      return {};
    }
    return Alpine.$data(flowEl);
  });
}
