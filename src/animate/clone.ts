/**
 * Framework-agnostic deep clone helper.
 *
 * Uses `structuredClone` when possible (preserves Dates, Maps, Sets, RegExps,
 * typed arrays, etc.) and falls back to a JSON roundtrip when the input isn't
 * structured-cloneable — typically when a reactive proxy (Alpine, Vue, etc.)
 * or a plain object with function properties is passed in.
 *
 * The fallback silently drops non-JSON values (functions, Symbols, undefined).
 * A dev-mode warning fires once per session so consumers know when the
 * fallback is active.
 */
let warnedOnCloneFallback = false;

export function safeClone<T>(value: T): T {
    try {
        return structuredClone(value);
    } catch {
        if (!warnedOnCloneFallback) {
            warnedOnCloneFallback = true;
            if (typeof console !== 'undefined') {
                console.warn(
                    '[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session.',
                );
            }
        }
        return JSON.parse(JSON.stringify(value));
    }
}
