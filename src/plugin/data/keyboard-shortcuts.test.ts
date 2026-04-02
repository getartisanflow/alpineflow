import { describe, it, expect } from 'vitest';
import {
  SHORTCUT_DEFAULTS,
  resolveShortcuts,
  matchesKey,
  matchesModifier,
} from '../../core/keyboard-shortcuts';

describe('resolveShortcuts', () => {
  it('returns all defaults when no user config', () => {
    expect(resolveShortcuts()).toEqual(SHORTCUT_DEFAULTS);
  });

  it('returns all defaults for undefined', () => {
    expect(resolveShortcuts(undefined)).toEqual(SHORTCUT_DEFAULTS);
  });

  it('returns all defaults for empty object', () => {
    expect(resolveShortcuts({})).toEqual(SHORTCUT_DEFAULTS);
  });

  it('overrides a single key', () => {
    const result = resolveShortcuts({ delete: 'Delete' });
    expect(result.delete).toBe('Delete');
    expect(result.escape).toBe('Escape');
  });

  it('null disables a shortcut', () => {
    const result = resolveShortcuts({ delete: null });
    expect(result.delete).toBeNull();
  });

  it('overrides numeric values', () => {
    const result = resolveShortcuts({ moveStep: 10, moveStepMultiplier: 2 });
    expect(result.moveStep).toBe(10);
    expect(result.moveStepMultiplier).toBe(2);
  });

  it('overrides array values', () => {
    const result = resolveShortcuts({ moveNodes: ['w', 'a', 's', 'd'] });
    expect(result.moveNodes).toEqual(['w', 'a', 's', 'd']);
  });

  it('does not mutate SHORTCUT_DEFAULTS', () => {
    const before = { ...SHORTCUT_DEFAULTS };
    resolveShortcuts({ delete: null });
    expect(SHORTCUT_DEFAULTS).toEqual(before);
  });
});

describe('matchesKey', () => {
  it('matches single string', () => {
    expect(matchesKey('Delete', 'Delete')).toBe(true);
  });

  it('rejects non-matching string', () => {
    expect(matchesKey('Backspace', 'Delete')).toBe(false);
  });

  it('matches key in array', () => {
    expect(matchesKey('Backspace', ['Delete', 'Backspace'])).toBe(true);
  });

  it('rejects key not in array', () => {
    expect(matchesKey('Enter', ['Delete', 'Backspace'])).toBe(false);
  });

  it('returns false for null (disabled)', () => {
    expect(matchesKey('Delete', null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(matchesKey('Delete', undefined)).toBe(false);
  });

  it('is case-sensitive for multi-char keys', () => {
    expect(matchesKey('delete', 'Delete')).toBe(false);
  });

  it('is case-insensitive for single-char keys (Shift changes case)', () => {
    expect(matchesKey('W', 'w')).toBe(true);
    expect(matchesKey('w', 'W')).toBe(true);
  });

  it('matches Shift+letter in array', () => {
    expect(matchesKey('W', ['w', 's', 'a', 'd'])).toBe(true);
    expect(matchesKey('D', ['w', 's', 'a', 'd'])).toBe(true);
  });
});

describe('matchesModifier', () => {
  const noMods = { shiftKey: false, ctrlKey: false, metaKey: false, altKey: false };

  it('matches Shift', () => {
    expect(matchesModifier({ ...noMods, shiftKey: true }, 'Shift')).toBe(true);
  });

  it('rejects Shift when not held', () => {
    expect(matchesModifier(noMods, 'Shift')).toBe(false);
  });

  it('matches Control', () => {
    expect(matchesModifier({ ...noMods, ctrlKey: true }, 'Control')).toBe(true);
  });

  it('matches Meta', () => {
    expect(matchesModifier({ ...noMods, metaKey: true }, 'Meta')).toBe(true);
  });

  it('matches Alt', () => {
    expect(matchesModifier({ ...noMods, altKey: true }, 'Alt')).toBe(true);
  });

  it('returns false for null (disabled)', () => {
    expect(matchesModifier({ ...noMods, shiftKey: true }, null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(matchesModifier({ ...noMods, shiftKey: true }, undefined)).toBe(false);
  });

  it('returns false for unknown modifier string', () => {
    expect(matchesModifier({ ...noMods, shiftKey: true }, 'Super')).toBe(false);
  });
});
