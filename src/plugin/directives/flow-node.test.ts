// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { commitDragHistory, reparentWithoutCapture } from './flow-node';
import { FlowHistory } from '../../core/history';
import { mockCtx } from '../data/__test-utils';
import type { FlowNode } from '../../core/types';

function node(id: string, x = 0, y = 0): FlowNode {
  return { id, type: 'default', position: { x, y }, data: {} } as FlowNode;
}

/**
 * The drag lifecycle in flow-node uses d3-drag, which drag.test.ts documents as
 * impractical to drive in jsdom. The two decisions the directive makes are
 * extracted into pure helpers so they can be unit-tested against a real
 * FlowHistory: `commitDragHistory` (commit only if the node moved) and
 * `reparentWithoutCapture` (suppress reparentNode's own capture during a drag).
 * The real canvas wrappers (_snapshotHistory/_commitHistory) are exercised via
 * mockCtx, not a hand-rolled copy.
 */
describe('commitDragHistory — drag capture-on-commit', () => {
  it('does not commit a history entry for a plain click (didDrag = false)', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history, nodes: [node('n1')] });
    const pending = ctx._snapshotHistory(); // taken on pointerdown (drag start)
    // pointer never moved past the threshold — didDrag stays false
    commitDragHistory(ctx, false, pending);
    expect(history.canUndo).toBe(false);
  });

  it('commits exactly one entry restoring the pre-drag state when the node moved', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history, nodes: [node('n1', 0, 0)] });
    const pending = ctx._snapshotHistory(); // pre-drag snapshot
    ctx.nodes[0].position.x = 40; // drag moved the node
    commitDragHistory(ctx, true, pending);

    expect(history.canUndo).toBe(true);
    const restored = history.undo({ nodes: ctx.nodes, edges: ctx.edges });
    expect(restored!.nodes[0].position.x).toBe(0); // pre-drag position restored
    expect(history.canUndo).toBe(false); // exactly one entry existed
  });

  it('does not commit when there is no pending snapshot (history disabled)', () => {
    const history = new FlowHistory();
    const ctx = mockCtx({ _history: history, nodes: [node('n1')] });
    commitDragHistory(ctx, true, null);
    expect(history.canUndo).toBe(false);
  });
});

describe('reparentWithoutCapture — no double-capture during a reparent drag', () => {
  /** A canvas whose reparentNode captures history internally (like the real one). */
  function makeReparentCanvas() {
    const history = new FlowHistory();
    const canvas = {
      nodes: [node('n1')],
      edges: [] as unknown[],
      _history: history,
      _suspendHistory: () => history.suspend(),
      _resumeHistory: () => history.resume(),
      reparentCalls: 0,
      reparentNode(_nodeId: string, _parentId: string | null): boolean {
        this.reparentCalls++;
        history.capture({ nodes: this.nodes as never, edges: this.edges as never });
        return true;
      },
    };
    return { canvas, history };
  }

  it('suppresses reparentNode\'s own capture (no entry pushed during the drag)', () => {
    const { canvas, history } = makeReparentCanvas();
    reparentWithoutCapture(canvas, 'n1', 'p1');
    expect(canvas.reparentCalls).toBe(1); // reparent still happened
    expect(history.canUndo).toBe(false); // but it did not push an entry
  });

  it('balances suspend/resume so later captures still work', () => {
    const { canvas, history } = makeReparentCanvas();
    reparentWithoutCapture(canvas, 'n1', 'p1');
    history.capture({ nodes: [node('x')], edges: [] });
    expect(history.canUndo).toBe(true); // suspend depth was released
  });

  it('releases the suspend depth even if reparentNode throws', () => {
    const history = new FlowHistory();
    const canvas = {
      _suspendHistory: () => history.suspend(),
      _resumeHistory: () => history.resume(),
      reparentNode(): boolean {
        throw new Error('boom');
      },
    };
    expect(() => reparentWithoutCapture(canvas, 'n1', 'p1')).toThrow('boom');
    history.capture({ nodes: [node('x')], edges: [] });
    expect(history.canUndo).toBe(true); // finally released the suspend
  });
});
