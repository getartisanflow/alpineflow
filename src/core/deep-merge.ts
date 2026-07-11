/**
 * Deep-merge `source` into `target` in place.
 *
 * Rules:
 * - Objects are recursively merged (keys added/overwritten, unmentioned keys preserved).
 * - Arrays are replaced, not merged.
 * - `null` explicitly removes a key.
 * - `undefined` values are ignored (key is not touched).
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
): T {
  for (const key of Object.keys(source)) {
    // Guard against prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

    const val = source[key];

    // undefined → skip
    if (val === undefined) continue;

    // null → delete key
    if (val === null) {
      delete (target as any)[key];
      continue;
    }

    // Arrays → replace (not merge)
    if (Array.isArray(val)) {
      (target as any)[key] = [...val];
      continue;
    }

    // Plain objects → recurse
    if (typeof val === 'object' && val.constructor === Object) {
      if (
        typeof (target as any)[key] !== 'object' ||
        (target as any)[key] === null ||
        Array.isArray((target as any)[key])
      ) {
        (target as any)[key] = {};
      }
      deepMerge((target as any)[key], val);
      continue;
    }

    // Primitives → overwrite
    (target as any)[key] = val;
  }

  return target;
}

function jsonEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return a === b;
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Merge `incoming` entities into `existing` by id, PRESERVING the original
 * object references for ids present in both. Property writes are skipped when
 * deep-equal, so Alpine effects watching those objects only re-run for real
 * changes. Returns the merged list in `incoming` order.
 */
export function mergeEntitiesById<T extends { id: string }>(
  existing: T[],
  incoming: T[],
  opts: { deleteMissing?: boolean } = {},
): T[] {
  const deleteMissing = opts.deleteMissing ?? true;
  const existingById = new Map(existing.map((e) => [e.id, e]));
  const merged: T[] = [];
  for (const inc of incoming) {
    const cur = existingById.get(inc.id);
    if (!cur) {
      merged.push(inc);
      continue;
    }
    if (deleteMissing) {
      for (const key of Object.keys(cur)) {
        if (key !== 'id' && !(key in inc)) delete (cur as Record<string, unknown>)[key];
      }
    }
    for (const [key, value] of Object.entries(inc)) {
      if (key === 'id') continue;
      if (!jsonEqual((cur as Record<string, unknown>)[key], value)) {
        (cur as Record<string, unknown>)[key] = value;
      }
    }
    merged.push(cur);
  }
  return merged;
}
