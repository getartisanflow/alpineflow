// ── Keyboard Shortcuts ──────────────────────────────────────────────
// Utilities for configurable keyboard shortcut resolution and matching.

export type KeyCode = string;

export interface KeyboardShortcuts {
  /** Key(s) for deleting selected elements. Default: ['Delete', 'Backspace'] */
  delete?: KeyCode | KeyCode[] | null;

  /** Modifier key to activate selection box (rubber-band). Default: 'Shift' */
  selectionBox?: KeyCode | null;

  /** Modifier key for multi-select (click to add). Default: 'Shift' */
  multiSelect?: KeyCode | null;

  /** Key(s) for arrow-key node movement. Default: ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'] */
  moveNodes?: KeyCode | KeyCode[] | null;

  /** Base movement step in pixels. Default: 5 */
  moveStep?: number;

  /** Modifier key that multiplies movement step. Default: 'Shift' */
  moveStepModifier?: KeyCode | null;

  /** Multiplier applied when moveStepModifier is held. Default: 4 */
  moveStepMultiplier?: number;

  /** Key for copy (with Ctrl/Cmd). Default: 'c' */
  copy?: KeyCode | null;

  /** Key for paste (with Ctrl/Cmd). Default: 'v' */
  paste?: KeyCode | null;

  /** Key for cut (with Ctrl/Cmd). Default: 'x' */
  cut?: KeyCode | null;

  /** Key for undo (with Ctrl/Cmd). Default: 'z' */
  undo?: KeyCode | null;

  /** Key for redo (with Ctrl/Cmd+Shift). Default: 'z' */
  redo?: KeyCode | null;

  /** Key for escape/cancel. Default: 'Escape' */
  escape?: KeyCode | null;

  /** Modifier key to temporarily toggle selection mode during a drag. Default: 'Alt' */
  selectionModeToggle?: KeyCode | null;

  /** Key to toggle between box and lasso selection tools. Default: 'l' */
  selectionToolToggle?: KeyCode | null;
}

export const SHORTCUT_DEFAULTS: Readonly<Required<KeyboardShortcuts>> = {
  delete: ['Delete', 'Backspace'],
  selectionBox: 'Shift',
  multiSelect: 'Shift',
  moveNodes: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  moveStep: 5,
  moveStepModifier: 'Shift',
  moveStepMultiplier: 4,
  copy: 'c',
  paste: 'v',
  cut: 'x',
  undo: 'z',
  redo: 'z',
  escape: 'Escape',
  selectionModeToggle: 'Alt',
  selectionToolToggle: 'l',
};

/** Merge user-provided shortcuts with defaults. `null` = disabled, `undefined`/missing = use default. */
export function resolveShortcuts(user?: Partial<KeyboardShortcuts>): Required<KeyboardShortcuts> {
  if (!user) return { ...SHORTCUT_DEFAULTS };
  const resolved = { ...SHORTCUT_DEFAULTS } as Record<string, unknown>;
  for (const key of Object.keys(user) as (keyof KeyboardShortcuts)[]) {
    if (key in user) {
      resolved[key] = user[key];
    }
  }
  return resolved as Required<KeyboardShortcuts>;
}

/** Check if a keyboard event's key matches a configured shortcut. Case-insensitive for single characters (Shift changes 'w' to 'W'). */
export function matchesKey(eventKey: string, configured: KeyCode | KeyCode[] | null | undefined): boolean {
  if (configured === null || configured === undefined) return false;
  const key = eventKey.length === 1 ? eventKey.toLowerCase() : eventKey;
  if (Array.isArray(configured)) {
    return configured.some(c => (c.length === 1 ? c.toLowerCase() : c) === key);
  }
  return (configured.length === 1 ? configured.toLowerCase() : configured) === key;
}

/** Check if a modifier key is held on an event. Maps 'Shift'→shiftKey, 'Control'→ctrlKey, etc. */
export function matchesModifier(
  event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean; altKey: boolean },
  configured: KeyCode | null | undefined,
): boolean {
  if (configured === null || configured === undefined) return false;
  switch (configured) {
    case 'Shift': return event.shiftKey;
    case 'Control': return event.ctrlKey;
    case 'Meta': return event.metaKey;
    case 'Alt': return event.altKey;
    default: return false;
  }
}
