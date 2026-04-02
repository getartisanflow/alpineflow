import { describe, it, expect } from 'vitest';
import { getActionDef, isActionDisabled, getAriaAttr } from './flow-action';

describe('getActionDef', () => {
  it('returns undo action definition', () => {
    const def = getActionDef('undo');
    expect(def).not.toBeNull();
    expect(def!.method).toBe('undo');
    expect(def!.aria).toBe('disabled');
  });

  it('returns redo action definition', () => {
    const def = getActionDef('redo');
    expect(def!.method).toBe('redo');
    expect(def!.aria).toBe('disabled');
  });

  it('returns fit-view with passExpression', () => {
    const def = getActionDef('fit-view');
    expect(def!.method).toBe('fitView');
    expect(def!.passExpression).toBe(true);
  });

  it('returns zoom-in action definition', () => {
    const def = getActionDef('zoom-in');
    expect(def!.method).toBe('zoomIn');
    expect(def!.aria).toBe('disabled');
  });

  it('returns zoom-out action definition', () => {
    const def = getActionDef('zoom-out');
    expect(def!.method).toBe('zoomOut');
    expect(def!.aria).toBe('disabled');
  });

  it('returns toggle-interactive with aria-pressed', () => {
    const def = getActionDef('toggle-interactive');
    expect(def!.method).toBe('toggleInteractive');
    expect(def!.aria).toBe('pressed');
  });

  it('returns clear action definition', () => {
    const def = getActionDef('clear');
    expect(def!.method).toBe('$clear');
    expect(def!.aria).toBe('disabled');
  });

  it('returns reset with no auto-disable', () => {
    const def = getActionDef('reset');
    expect(def!.method).toBe('$reset');
    expect(def!.disabledWhen).toBeUndefined();
  });

  it('returns export with passExpression', () => {
    const def = getActionDef('export');
    expect(def!.method).toBe('toImage');
    expect(def!.passExpression).toBe(true);
  });

  it('returns null for unknown action', () => {
    expect(getActionDef('unknown')).toBeNull();
  });
});

describe('isActionDisabled', () => {
  it('undo disabled when canUndo is false', () => {
    expect(isActionDisabled('undo', { canUndo: false })).toBe(true);
  });

  it('undo enabled when canUndo is true', () => {
    expect(isActionDisabled('undo', { canUndo: true })).toBe(false);
  });

  it('redo disabled when canRedo is false', () => {
    expect(isActionDisabled('redo', { canRedo: false })).toBe(true);
  });

  it('redo enabled when canRedo is true', () => {
    expect(isActionDisabled('redo', { canRedo: true })).toBe(false);
  });

  it('zoom-in disabled at maxZoom', () => {
    expect(isActionDisabled('zoom-in', { viewport: { zoom: 2 }, _config: { maxZoom: 2 } })).toBe(true);
  });

  it('zoom-in enabled below maxZoom', () => {
    expect(isActionDisabled('zoom-in', { viewport: { zoom: 1.5 }, _config: { maxZoom: 2 } })).toBe(false);
  });

  it('zoom-out disabled at minZoom', () => {
    expect(isActionDisabled('zoom-out', { viewport: { zoom: 0.5 }, _config: { minZoom: 0.5 } })).toBe(true);
  });

  it('zoom-out enabled above minZoom', () => {
    expect(isActionDisabled('zoom-out', { viewport: { zoom: 1 }, _config: { minZoom: 0.5 } })).toBe(false);
  });

  it('zoom uses default bounds when config missing', () => {
    expect(isActionDisabled('zoom-in', { viewport: { zoom: 2 } })).toBe(true);
    expect(isActionDisabled('zoom-out', { viewport: { zoom: 0.5 } })).toBe(true);
  });

  it('clear disabled when no nodes', () => {
    expect(isActionDisabled('clear', { nodes: [] })).toBe(true);
  });

  it('clear enabled when nodes exist', () => {
    expect(isActionDisabled('clear', { nodes: [{ id: '1' }] })).toBe(false);
  });

  it('actions without disabledWhen always return false', () => {
    expect(isActionDisabled('fit-view', {})).toBe(false);
    expect(isActionDisabled('reset', {})).toBe(false);
    expect(isActionDisabled('export', {})).toBe(false);
    expect(isActionDisabled('toggle-interactive', {})).toBe(false);
  });
});

describe('getAriaAttr', () => {
  it('returns disabled for stateful actions', () => {
    expect(getAriaAttr('undo')).toBe('disabled');
    expect(getAriaAttr('redo')).toBe('disabled');
    expect(getAriaAttr('zoom-in')).toBe('disabled');
    expect(getAriaAttr('zoom-out')).toBe('disabled');
    expect(getAriaAttr('clear')).toBe('disabled');
  });

  it('returns pressed for toggle actions', () => {
    expect(getAriaAttr('toggle-interactive')).toBe('pressed');
  });

  it('returns null for stateless actions', () => {
    expect(getAriaAttr('fit-view')).toBeNull();
    expect(getAriaAttr('reset')).toBeNull();
    expect(getAriaAttr('export')).toBeNull();
  });

  it('returns null for unknown action', () => {
    expect(getAriaAttr('unknown')).toBeNull();
  });
});
