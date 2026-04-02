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
