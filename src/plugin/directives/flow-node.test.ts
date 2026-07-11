import { describe, it, expect } from 'vitest';
import { commitDragHistory } from './flow-node';
import { FlowHistory } from '../../core/history';

/**
 * The drag lifecycle in flow-node uses d3-drag, which drag.test.ts documents as
 * impractical to drive in jsdom. The capture-on-commit *decision* is extracted
 * into the pure `commitDragHistory` helper so it can be unit-tested against a
 * real FlowHistory. The closure in the directive holds the pending snapshot and
 * the `didDrag` flag exactly as the plan specifies; this exercises the gate.
 */
function makeHistoryCanvas(nodes: any[] = []) {
  const history = new FlowHistory();
  const canvas = {
    nodes,
    edges: [] as any[],
    _history: history,
    _snapshotHistory(): string | null {
      return history.snapshot({ nodes: this.nodes, edges: this.edges });
    },
    _commitHistory(snapshot: string | null): void {
      if (snapshot !== null) history.commit(snapshot);
    },
  };
  return { canvas, history };
}

describe('commitDragHistory — drag capture-on-commit', () => {
  it('does not commit a history entry for a plain click (didDrag = false)', () => {
    const { canvas, history } = makeHistoryCanvas([{ id: 'n1', position: { x: 0, y: 0 } }]);
    const pending = canvas._snapshotHistory(); // taken on pointerdown (drag start)
    // pointer never moved past the threshold — didDrag stays false
    commitDragHistory(canvas, false, pending);
    expect(history.canUndo).toBe(false);
  });

  it('commits exactly one entry restoring the pre-drag state when the node moved', () => {
    const { canvas, history } = makeHistoryCanvas([{ id: 'n1', position: { x: 0, y: 0 } }]);
    const pending = canvas._snapshotHistory(); // pre-drag snapshot
    canvas.nodes[0].position.x = 40; // drag moved the node
    commitDragHistory(canvas, true, pending);

    expect(history.canUndo).toBe(true);
    const restored = history.undo({ nodes: canvas.nodes, edges: canvas.edges });
    expect(restored!.nodes[0].position.x).toBe(0); // pre-drag position restored
    expect(history.canUndo).toBe(false); // exactly one entry existed
  });

  it('does not commit when there is no pending snapshot (history disabled)', () => {
    const { canvas, history } = makeHistoryCanvas([{ id: 'n1', position: { x: 0, y: 0 } }]);
    commitDragHistory(canvas, true, null);
    expect(history.canUndo).toBe(false);
  });
});
