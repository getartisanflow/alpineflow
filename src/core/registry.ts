/**
 * Addon registry — singleton via window global.
 *
 * When AlpineFlow core is loaded from one bundle (e.g., WireFlow's
 * alpineflow.bundle.esm.js) and addons are loaded from separate ESM
 * files, each bundle gets its own module scope. A module-scoped Map
 * would create disconnected registries — addons would register on
 * their copy, but the core would check its own empty copy.
 *
 * Using a window global ensures all bundles share one registry,
 * regardless of how they're loaded (CDN, npm, Vite, WireFlow bundle).
 */

const REGISTRY_KEY = '__alpineflow_registry__';

export function getRegistry(): Map<string, any> {
  if (typeof globalThis !== 'undefined') {
    if (!(globalThis as any)[REGISTRY_KEY]) {
      (globalThis as any)[REGISTRY_KEY] = new Map<string, any>();
    }
    return (globalThis as any)[REGISTRY_KEY];
  }
  // Fallback for environments without globalThis (shouldn't happen in modern runtimes)
  return new Map<string, any>();
}

export function registerAddon(name: string, value: any): void {
  getRegistry().set(name, value);
}

export function getAddon<T = any>(name: string): T | undefined {
  return getRegistry().get(name);
}

/** Remove a single addon by name. */
export function unregisterAddon(name: string): void {
  getRegistry().delete(name);
}

/** Test-only: clear all registered addons. */
export function _resetRegistry(): void {
  getRegistry().clear();
}
