import { describe, it, expect } from 'vitest';
import { FlowHistory, type HistorySnapshot } from './history';

function makeSnapshot(label: string): HistorySnapshot {
  return {
    nodes: [{ id: label, position: { x: 0, y: 0 }, data: { label } }],
    edges: [],
  };
}

describe('FlowHistory', () => {
  // ── capture ─────────────────────────────────────────────────────────────

  describe('capture', () => {
    it('stores a snapshot', () => {
      const history = new FlowHistory();
      history.capture(makeSnapshot('s1'));
      expect(history.canUndo).toBe(true);
    });

    it('deep-clones the snapshot (mutation-safe)', () => {
      const history = new FlowHistory();
      const snap = makeSnapshot('s1');
      history.capture(snap);
      snap.nodes[0].id = 'mutated';

      const restored = history.undo(makeSnapshot('current'));
      expect(restored!.nodes[0].id).toBe('s1');
    });

    it('clears the redo stack on capture', () => {
      const history = new FlowHistory();
      history.capture(makeSnapshot('s1'));
      history.capture(makeSnapshot('s2'));
      history.undo(makeSnapshot('s3'));
      expect(history.canRedo).toBe(true);

      history.capture(makeSnapshot('s4'));
      expect(history.canRedo).toBe(false);
    });

    it('respects maxSize by evicting oldest', () => {
      const history = new FlowHistory(3);
      history.capture(makeSnapshot('s1'));
      history.capture(makeSnapshot('s2'));
      history.capture(makeSnapshot('s3'));
      history.capture(makeSnapshot('s4')); // evicts s1

      const r1 = history.undo(makeSnapshot('current'));
      expect(r1!.nodes[0].id).toBe('s4');
      const r2 = history.undo(makeSnapshot('current'));
      expect(r2!.nodes[0].id).toBe('s3');
      const r3 = history.undo(makeSnapshot('current'));
      expect(r3!.nodes[0].id).toBe('s2');
      // s1 was evicted
      expect(history.canUndo).toBe(false);
    });
  });

  // ── undo ──────────────────────────────────────────────────────────────

  describe('undo', () => {
    it('returns the last captured snapshot', () => {
      const history = new FlowHistory();
      history.capture(makeSnapshot('s1'));
      history.capture(makeSnapshot('s2'));

      const result = history.undo(makeSnapshot('current'));
      expect(result!.nodes[0].id).toBe('s2');
    });

    it('returns null when nothing to undo', () => {
      const history = new FlowHistory();
      expect(history.undo(makeSnapshot('current'))).toBeNull();
    });

    it('pushes current state onto redo stack', () => {
      const history = new FlowHistory();
      history.capture(makeSnapshot('s1'));
      history.undo(makeSnapshot('current'));
      expect(history.canRedo).toBe(true);
    });
  });

  // ── redo ──────────────────────────────────────────────────────────────

  describe('redo', () => {
    it('returns the last undone snapshot', () => {
      const history = new FlowHistory();
      history.capture(makeSnapshot('s1'));
      history.capture(makeSnapshot('s2'));
      history.undo(makeSnapshot('current'));

      const result = history.redo(makeSnapshot('after-undo'));
      expect(result!.nodes[0].id).toBe('current');
    });

    it('returns null when nothing to redo', () => {
      const history = new FlowHistory();
      expect(history.redo(makeSnapshot('current'))).toBeNull();
    });

    it('supports multiple undo/redo cycles', () => {
      const history = new FlowHistory();
      history.capture(makeSnapshot('s1'));
      history.capture(makeSnapshot('s2'));

      const u1 = history.undo(makeSnapshot('s3'));
      expect(u1!.nodes[0].id).toBe('s2');

      const u2 = history.undo(makeSnapshot('s2'));
      expect(u2!.nodes[0].id).toBe('s1');

      const r1 = history.redo(makeSnapshot('s1'));
      expect(r1!.nodes[0].id).toBe('s2');

      const r2 = history.redo(makeSnapshot('s2'));
      expect(r2!.nodes[0].id).toBe('s3');
    });
  });

  // ── suspend / resume ─────────────────────────────────────────────────

  describe('suspend / resume', () => {
    it('capture is a no-op while suspended', () => {
      const history = new FlowHistory();
      history.suspend();
      history.capture(makeSnapshot('s1'));
      expect(history.canUndo).toBe(false);
    });

    it('capture works again after resume', () => {
      const history = new FlowHistory();
      history.suspend();
      history.capture(makeSnapshot('ignored'));
      history.resume();
      history.capture(makeSnapshot('kept'));
      expect(history.canUndo).toBe(true);
    });

    it('nested suspend requires matching resume count', () => {
      const history = new FlowHistory();
      history.suspend();
      history.suspend();
      history.resume(); // still suspended (depth 1)
      history.capture(makeSnapshot('still-ignored'));
      expect(history.canUndo).toBe(false);

      history.resume(); // now resumed (depth 0)
      history.capture(makeSnapshot('kept'));
      expect(history.canUndo).toBe(true);
    });

    it('resume below zero is a no-op', () => {
      const history = new FlowHistory();
      history.resume(); // should not throw or go negative
      history.capture(makeSnapshot('s1'));
      expect(history.canUndo).toBe(true);
    });
  });

  // ── canUndo / canRedo ─────────────────────────────────────────────────

  describe('canUndo / canRedo', () => {
    it('starts with both false', () => {
      const history = new FlowHistory();
      expect(history.canUndo).toBe(false);
      expect(history.canRedo).toBe(false);
    });

    it('canUndo is true after capture', () => {
      const history = new FlowHistory();
      history.capture(makeSnapshot('s1'));
      expect(history.canUndo).toBe(true);
    });

    it('canRedo is true after undo', () => {
      const history = new FlowHistory();
      history.capture(makeSnapshot('s1'));
      history.undo(makeSnapshot('current'));
      expect(history.canRedo).toBe(true);
      expect(history.canUndo).toBe(false);
    });
  });
});
