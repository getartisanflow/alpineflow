// ============================================================================
// Alpine Reference
//
// Stores the Alpine instance passed during plugin registration so internal
// modules can access it without importing 'alpinejs' directly. This allows
// the bundle to work in environments where Alpine is provided externally
// (e.g. Livewire).
// ============================================================================

import type { Alpine } from 'alpinejs';

let _alpine: Alpine | null = null;

export function setAlpine(alpine: Alpine): void {
  _alpine = alpine;
}

export function getAlpine(): Alpine {
  if (!_alpine) {
    throw new Error('[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.');
  }
  return _alpine;
}
