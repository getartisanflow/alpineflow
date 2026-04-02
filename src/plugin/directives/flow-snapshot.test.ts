import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseSnapshotDirective,
  saveSnapshot,
  getSnapshot,
  hasSnapshot,
  getLocalStorageKey,
  clearAllSnapshots,
} from './flow-snapshot';

describe('parseSnapshotDirective', () => {
  it('parses save action', () => {
    expect(parseSnapshotDirective('save', [])).toEqual({ action: 'save', persist: false });
  });

  it('parses restore action', () => {
    expect(parseSnapshotDirective('restore', [])).toEqual({ action: 'restore', persist: false });
  });

  it('parses save with persist', () => {
    expect(parseSnapshotDirective('save', ['persist'])).toEqual({ action: 'save', persist: true });
  });

  it('parses restore with persist', () => {
    expect(parseSnapshotDirective('restore', ['persist'])).toEqual({ action: 'restore', persist: true });
  });

  it('returns null for unknown action', () => {
    expect(parseSnapshotDirective('delete', [])).toBeNull();
    expect(parseSnapshotDirective('', [])).toBeNull();
  });
});

describe('snapshot store', () => {
  beforeEach(() => { clearAllSnapshots(); });

  it('saves and retrieves a snapshot', () => {
    const data = { nodes: [{ id: '1' }], edges: [] };
    saveSnapshot('test', data);
    expect(getSnapshot('test')).toEqual(data);
  });

  it('returns null for missing key', () => {
    expect(getSnapshot('missing')).toBeNull();
  });

  it('hasSnapshot reflects state correctly', () => {
    expect(hasSnapshot('test')).toBe(false);
    saveSnapshot('test', {});
    expect(hasSnapshot('test')).toBe(true);
  });

  it('overwrites existing snapshot', () => {
    saveSnapshot('test', { a: 1 });
    saveSnapshot('test', { b: 2 });
    expect(getSnapshot('test')).toEqual({ b: 2 });
  });
});

describe('getLocalStorageKey', () => {
  it('prefixes key correctly', () => {
    expect(getLocalStorageKey('my-flow')).toBe('alpineflow-snapshot-my-flow');
  });
});
