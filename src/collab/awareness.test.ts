import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { CollabAwareness } from './awareness';
import type { CollabUser } from './types';

describe('CollabAwareness', () => {
  let doc: Y.Doc;
  let awareness: Awareness;
  let collabAwareness: CollabAwareness;
  const user: CollabUser = { name: 'Alice', color: '#8b5cf6' };

  beforeEach(() => {
    vi.useFakeTimers();
    doc = new Y.Doc();
    awareness = new Awareness(doc);
    collabAwareness = new CollabAwareness(awareness, user);
  });

  afterEach(() => {
    collabAwareness.destroy();
    vi.useRealTimers();
  });

  it('sets local user on init', () => {
    const local = awareness.getLocalState();
    expect(local?.user).toEqual(user);
    expect(local?.cursor).toBeNull();
    expect(local?.selectedNodes).toEqual([]);
  });

  it('returns local user as me', () => {
    expect(collabAwareness.me).toEqual(user);
  });

  it('updates cursor position', () => {
    collabAwareness.updateCursor({ x: 100, y: 200 });
    const local = awareness.getLocalState();
    expect(local?.cursor).toEqual({ x: 100, y: 200 });
  });

  it('clears cursor when null', () => {
    collabAwareness.updateCursor({ x: 100, y: 200 });
    collabAwareness.updateCursor(null);
    const local = awareness.getLocalState();
    expect(local?.cursor).toBeNull();
  });

  it('updates selected nodes', () => {
    collabAwareness.updateSelection(['node-1', 'node-2']);
    const local = awareness.getLocalState();
    expect(local?.selectedNodes).toEqual(['node-1', 'node-2']);
  });

  it('reports connected status', () => {
    expect(collabAwareness.connected).toBe(true);
  });

  it('tracks user count (at least self)', () => {
    expect(collabAwareness.userCount).toBeGreaterThanOrEqual(1);
  });

  it('cleans up on destroy', () => {
    collabAwareness.destroy();
    // Should not throw when awareness fires after destroy
    awareness.setLocalState(null);
  });
});
