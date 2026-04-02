// ============================================================================
// x-flow-snapshot Directive
//
// Declarative state capture/restore.
//
// Usage:
//   <button x-flow-snapshot:save="'checkpoint'">Save</button>
//   <button x-flow-snapshot:restore="'checkpoint'">Restore</button>
//   <button x-flow-snapshot:save.persist="'my-flow'">Save to Storage</button>
//   <button x-flow-snapshot:restore.persist="'my-flow'">Load from Storage</button>
// ============================================================================

import type { Alpine } from 'alpinejs';

type SnapshotAction = 'save' | 'restore';

export interface SnapshotParseResult {
  action: SnapshotAction;
  persist: boolean;
}

export function parseSnapshotDirective(
  arg: string,
  modifiers: string[],
): SnapshotParseResult | null {
  if (arg !== 'save' && arg !== 'restore') return null;
  return { action: arg, persist: modifiers.includes('persist') };
}

// Module-scoped in-memory snapshot storage
const snapshots = new Map<string, object>();

export function saveSnapshot(key: string, data: object): void {
  snapshots.set(key, data);
}

export function getSnapshot(key: string): object | null {
  return snapshots.get(key) ?? null;
}

export function hasSnapshot(key: string): boolean {
  return snapshots.has(key);
}

export function clearAllSnapshots(): void {
  snapshots.clear();
}

export function getLocalStorageKey(key: string): string {
  return `alpineflow-snapshot-${key}`;
}

export function registerFlowSnapshotDirective(Alpine: Alpine) {
  Alpine.directive(
    'flow-snapshot',
    (el, { value, expression, modifiers }, { evaluate, effect, cleanup }) => {
      const parsed = parseSnapshotDirective(value, modifiers);
      if (!parsed) return;

      const canvasEl = el.closest('[data-flow-canvas]') as HTMLElement;
      if (!canvasEl) return;

      const canvas = Alpine.$data(canvasEl) as any;
      if (!canvas) return;

      const onClick = () => {
        if (!expression) return;
        const key = evaluate(expression) as string;
        if (!key) return;

        if (parsed.action === 'save') {
          const data = canvas.toObject();
          if (parsed.persist) {
            localStorage.setItem(getLocalStorageKey(key), JSON.stringify(data));
          } else {
            saveSnapshot(key, data);
          }
        } else {
          let data: object | null = null;
          if (parsed.persist) {
            const raw = localStorage.getItem(getLocalStorageKey(key));
            if (raw) {
              try { data = JSON.parse(raw); } catch { /* ignore malformed */ }
            }
          } else {
            data = getSnapshot(key);
          }
          if (data) {
            canvas.fromObject(data);
          }
        }
      };

      el.addEventListener('click', onClick);

      // Reactive disabled state for restore buttons
      if (parsed.action === 'restore') {
        effect(() => {
          if (!expression) return;
          const key = evaluate(expression) as string;
          if (!key) return;

          let exists: boolean;
          if (parsed.persist) {
            exists = localStorage.getItem(getLocalStorageKey(key)) !== null;
          } else {
            void canvas.nodes.length;
            exists = hasSnapshot(key);
          }

          (el as HTMLButtonElement).disabled = !exists;
          el.setAttribute('aria-disabled', String(!exists));
        });
      }

      cleanup(() => {
        el.removeEventListener('click', onClick);
      });
    },
  );
}
