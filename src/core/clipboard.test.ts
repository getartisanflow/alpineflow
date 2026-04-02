import { describe, it, expect, beforeEach } from 'vitest';
import { copySelection, pasteClipboard, cutSelection, clearClipboard } from './clipboard';
import type { FlowNode, FlowEdge } from './types';

function makeNode(id: string, x = 0, y = 0, selected = false): FlowNode {
  return {
    id,
    position: { x, y },
    data: { label: id },
    selected,
  };
}

function makeEdge(id: string, source: string, target: string, selected = false): FlowEdge {
  return { id, source, target, selected };
}

describe('clipboard', () => {
  beforeEach(() => {
    clearClipboard();
  });

  describe('copySelection', () => {
    it('captures selected nodes', () => {
      const nodes = [makeNode('a', 0, 0, true), makeNode('b', 100, 0, false)];
      const result = copySelection(nodes, []);
      expect(result.nodeCount).toBe(1);
    });

    it('captures internal edges only', () => {
      const nodes = [
        makeNode('a', 0, 0, true),
        makeNode('b', 100, 0, true),
        makeNode('c', 200, 0, false),
      ];
      const edges = [
        makeEdge('e1', 'a', 'b'),  // both selected — included
        makeEdge('e2', 'a', 'c'),  // c not selected — excluded
      ];
      const result = copySelection(nodes, edges);
      expect(result.nodeCount).toBe(2);
      expect(result.edgeCount).toBe(1);
    });

    it('ignores edges with one endpoint outside selection', () => {
      const nodes = [makeNode('a', 0, 0, true), makeNode('b', 100, 0, false)];
      const edges = [makeEdge('e1', 'a', 'b')];
      const result = copySelection(nodes, edges);
      expect(result.edgeCount).toBe(0);
    });

    it('deep-clones node data', () => {
      const nodes = [makeNode('a', 0, 0, true)];
      nodes[0].data = { label: 'original', nested: { value: 1 } };
      copySelection(nodes, []);
      nodes[0].data.nested.value = 999;
      const pasted = pasteClipboard();
      expect(pasted!.nodes[0].data.nested.value).toBe(1);
    });
  });

  describe('pasteClipboard', () => {
    it('returns null when clipboard is empty', () => {
      expect(pasteClipboard()).toBeNull();
    });

    it('generates unique IDs', () => {
      const nodes = [makeNode('a', 0, 0, true)];
      copySelection(nodes, []);
      const result = pasteClipboard()!;
      expect(result.nodes[0].id).not.toBe('a');
      expect(result.nodes[0].id).toContain('a-copy-');
    });

    it('remaps edge source and target', () => {
      const nodes = [makeNode('a', 0, 0, true), makeNode('b', 100, 0, true)];
      const edges = [makeEdge('e1', 'a', 'b')];
      copySelection(nodes, edges);
      const result = pasteClipboard()!;
      expect(result.edges[0].source).not.toBe('a');
      expect(result.edges[0].target).not.toBe('b');
      expect(result.edges[0].source).toBe(result.nodes[0].id);
      expect(result.edges[0].target).toBe(result.nodes[1].id);
    });

    it('offsets positions by 20px on first paste', () => {
      const nodes = [makeNode('a', 50, 100, true)];
      copySelection(nodes, []);
      const result = pasteClipboard()!;
      expect(result.nodes[0].position).toEqual({ x: 70, y: 120 });
    });

    it('accumulates offset on successive pastes', () => {
      const nodes = [makeNode('a', 50, 100, true)];
      copySelection(nodes, []);
      pasteClipboard();
      const result2 = pasteClipboard()!;
      expect(result2.nodes[0].position).toEqual({ x: 90, y: 140 });
    });

    it('resets offset after new copy', () => {
      const nodes = [makeNode('a', 50, 100, true)];
      copySelection(nodes, []);
      pasteClipboard(); // offset = 20
      pasteClipboard(); // offset = 40
      copySelection(nodes, []); // reset
      const result = pasteClipboard()!;
      expect(result.nodes[0].position).toEqual({ x: 70, y: 120 });
    });

    it('marks pasted nodes as selected', () => {
      const nodes = [makeNode('a', 0, 0, true)];
      copySelection(nodes, []);
      const result = pasteClipboard()!;
      expect(result.nodes[0].selected).toBe(true);
    });

    it('marks pasted edges as selected', () => {
      const nodes = [makeNode('a', 0, 0, true), makeNode('b', 100, 0, true)];
      const edges = [makeEdge('e1', 'a', 'b')];
      copySelection(nodes, edges);
      const result = pasteClipboard()!;
      expect(result.edges[0].selected).toBe(true);
    });
  });

  describe('cutSelection', () => {
    it('returns selected node IDs', () => {
      const nodes = [makeNode('a', 0, 0, true), makeNode('b', 100, 0, false)];
      const result = cutSelection(nodes, []);
      expect(result.nodeIds).toEqual(['a']);
    });

    it('populates clipboard for subsequent paste', () => {
      const nodes = [makeNode('a', 0, 0, true)];
      cutSelection(nodes, []);
      const pasted = pasteClipboard();
      expect(pasted).not.toBeNull();
      expect(pasted!.nodes).toHaveLength(1);
    });

    it('includes selected edge even when its endpoints are not selected', () => {
      const nodes = [makeNode('a', 0, 0, false), makeNode('b', 100, 0, false)];
      const edges = [makeEdge('e1', 'a', 'b', true)];
      const result = cutSelection(nodes, edges);
      expect(result.edgeCount).toBe(1);
    });
  });

  describe('copySelection includes independently selected edges', () => {
    it('captures edge with selected: true even when both endpoints are unselected', () => {
      const nodes = [makeNode('a', 0, 0, false), makeNode('b', 100, 0, false)];
      const edges = [makeEdge('e1', 'a', 'b', true)];
      const result = copySelection(nodes, edges);
      expect(result.edgeCount).toBe(1);
      expect(result.nodeCount).toBe(0);
    });

    it('captures edge with selected: true alongside internal edges', () => {
      const nodes = [
        makeNode('a', 0, 0, true),
        makeNode('b', 100, 0, true),
        makeNode('c', 200, 0, false),
      ];
      const edges = [
        makeEdge('e1', 'a', 'b'),       // internal — both endpoints selected
        makeEdge('e2', 'a', 'c', true),  // selected edge — c not selected
      ];
      const result = copySelection(nodes, edges);
      expect(result.edgeCount).toBe(2);
    });
  });
});
