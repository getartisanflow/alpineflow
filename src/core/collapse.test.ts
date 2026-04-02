import { describe, it, expect } from 'vitest';
import {
  getCollapseTargets,
  captureCollapseState,
  applyCollapse,
  applyExpand,
  rerouteEdgesForCollapse,
  restoreReroutedEdges,
} from './collapse';
import {
  collapsibleGroup,
  cgChild1,
  cgChild2,
  cgExternalNode,
  cgEdgeInternal,
  cgEdgeCrossing,
  collapseNodes,
  collapseEdges,
  groupNode,
  childNode1,
  childNode2,
  grandchildNode,
  subFlowNodes,
  triggerNode,
  outgoerA,
  outgoerB,
  outgoerC,
  externalSrc,
  edgeBasedNodes,
  edgeBasedEdges,
  groupWithCustomDims,
} from './__fixtures__/nodes';
import type { FlowNode, FlowEdge } from './types';

// ── getCollapseTargets ──────────────────────────────────────────────────

describe('getCollapseTargets', () => {
  it('returns descendants for group nodes', () => {
    const targets = getCollapseTargets('cg-1', collapseNodes, collapseEdges);
    expect(targets.has('cg-child-1')).toBe(true);
    expect(targets.has('cg-child-2')).toBe(true);
    expect(targets.has('cg-external')).toBe(false);
  });

  it('returns nested descendants for group nodes', () => {
    const targets = getCollapseTargets('group-1', subFlowNodes, []);
    expect(targets.has('child-1')).toBe(true);
    expect(targets.has('child-2')).toBe(true);
    expect(targets.has('grandchild-1')).toBe(true);
  });

  it('returns direct outgoers for regular nodes', () => {
    const targets = getCollapseTargets('trigger', edgeBasedNodes, edgeBasedEdges);
    expect(targets.has('outgoer-a')).toBe(true);
    expect(targets.has('outgoer-b')).toBe(true);
    expect(targets.has('outgoer-c')).toBe(false);
    expect(targets.has('ext-src')).toBe(false);
  });

  it('returns all downstream outgoers with recursive flag', () => {
    const targets = getCollapseTargets('trigger', edgeBasedNodes, edgeBasedEdges, { recursive: true });
    expect(targets.has('outgoer-a')).toBe(true);
    expect(targets.has('outgoer-b')).toBe(true);
    expect(targets.has('outgoer-c')).toBe(true);
    expect(targets.has('ext-src')).toBe(true);
  });

  it('returns empty set for nodes with no outgoers', () => {
    const targets = getCollapseTargets('outgoer-c', edgeBasedNodes, edgeBasedEdges);
    expect(targets.size).toBe(0);
  });

  it('does not include the trigger node itself', () => {
    const targets = getCollapseTargets('trigger', edgeBasedNodes, edgeBasedEdges, { recursive: true });
    expect(targets.has('trigger')).toBe(false);
  });

  it('handles cycles without infinite loop', () => {
    const nodes: FlowNode[] = [
      { id: 'a', position: { x: 0, y: 0 }, data: {} },
      { id: 'b', position: { x: 100, y: 0 }, data: {} },
    ];
    const edges: FlowEdge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'b', target: 'a' },
    ];
    const targets = getCollapseTargets('a', nodes, edges, { recursive: true });
    expect(targets.has('b')).toBe(true);
    expect(targets.has('a')).toBe(false);
  });

  it('returns empty set for unknown node', () => {
    const targets = getCollapseTargets('unknown', edgeBasedNodes, edgeBasedEdges);
    expect(targets.size).toBe(0);
  });
});

// ── captureCollapseState ────────────────────────────────────────────────

describe('captureCollapseState', () => {
  it('captures positions of target nodes', () => {
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(collapsibleGroup, collapseNodes, targets);
    expect(state.targetPositions.get('cg-child-1')).toEqual({ x: 20, y: 50 });
    expect(state.targetPositions.get('cg-child-2')).toEqual({ x: 200, y: 50 });
  });

  it('does not capture non-target positions', () => {
    const targets = new Set(['cg-child-1']);
    const state = captureCollapseState(collapsibleGroup, collapseNodes, targets);
    expect(state.targetPositions.has('cg-external')).toBe(false);
    expect(state.targetPositions.has('cg-child-2')).toBe(false);
  });

  it('captures originalDimensions for group nodes', () => {
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(collapsibleGroup, collapseNodes, targets);
    expect(state.originalDimensions).toEqual({ width: 400, height: 300 });
  });

  it('does not capture originalDimensions for regular nodes', () => {
    const targets = new Set(['outgoer-a', 'outgoer-b']);
    const state = captureCollapseState(triggerNode, edgeBasedNodes, targets);
    expect(state.originalDimensions).toBeUndefined();
  });

  it('initializes reroutedEdges as empty', () => {
    const targets = new Set(['cg-child-1']);
    const state = captureCollapseState(collapsibleGroup, collapseNodes, targets);
    expect(state.reroutedEdges.size).toBe(0);
  });
});

// ── applyCollapse ───────────────────────────────────────────────────────

describe('applyCollapse', () => {
  it('sets hidden on all target nodes', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });

    expect(nodes.find(n => n.id === 'cg-child-1')!.hidden).toBe(true);
    expect(nodes.find(n => n.id === 'cg-child-2')!.hidden).toBe(true);
  });

  it('does not hide the trigger node', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });

    expect(nodes[0].hidden).toBeFalsy();
  });

  it('sets collapsed flag', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });

    expect(nodes[0].collapsed).toBe(true);
  });

  it('shrinks group dimensions when provided', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });

    expect(nodes[0].dimensions).toEqual({ width: 150, height: 60 });
  });

  it('keeps dimensions when collapsedDimensions omitted (regular nodes)', () => {
    const nodes = structuredClone(edgeBasedNodes);
    const trigger = nodes.find(n => n.id === 'trigger')!;
    const originalDims = { ...trigger.dimensions! };
    const targets = new Set(['outgoer-a', 'outgoer-b']);
    const state = captureCollapseState(trigger, nodes, targets);
    applyCollapse(trigger, nodes, state);

    expect(trigger.dimensions).toEqual(originalDims);
    expect(trigger.collapsed).toBe(true);
  });

  it('does not hide external nodes', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });

    expect(nodes.find(n => n.id === 'cg-external')!.hidden).toBeFalsy();
  });
});

// ── applyExpand ─────────────────────────────────────────────────────────

describe('applyExpand', () => {
  it('restores hidden state on targets', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });
    applyExpand(nodes[0], nodes, state);

    expect(nodes.find(n => n.id === 'cg-child-1')!.hidden).toBeFalsy();
    expect(nodes.find(n => n.id === 'cg-child-2')!.hidden).toBeFalsy();
  });

  it('restores group dimensions', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });
    applyExpand(nodes[0], nodes, state);

    expect(nodes[0].dimensions).toEqual({ width: 400, height: 300 });
  });

  it('restores positions', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });
    // Simulate position change during animation
    nodes.find(n => n.id === 'cg-child-1')!.position = { x: 0, y: 0 };
    applyExpand(nodes[0], nodes, state);

    expect(nodes.find(n => n.id === 'cg-child-1')!.position).toEqual({ x: 20, y: 50 });
  });

  it('clears collapsed flag', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });
    applyExpand(nodes[0], nodes, state);

    expect(nodes[0].collapsed).toBeFalsy();
  });

  it('skips dimension restore when restoreDimensions is false', () => {
    const nodes = structuredClone(collapseNodes);
    const targets = new Set(['cg-child-1', 'cg-child-2']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });
    applyExpand(nodes[0], nodes, state, false);

    expect(nodes[0].dimensions).toEqual({ width: 150, height: 60 });
    expect(nodes[0].collapsed).toBeFalsy();
  });

  it('keeps nested collapsed groups collapsed', () => {
    const nodes: FlowNode[] = structuredClone(subFlowNodes);
    nodes.find(n => n.id === 'child-1')!.collapsed = true;
    const grandchild = nodes.find(n => n.id === 'grandchild-1')!;
    grandchild.hidden = true;

    const targets = new Set(['child-1', 'child-2', 'grandchild-1']);
    const state = captureCollapseState(nodes[0], nodes, targets);
    applyCollapse(nodes[0], nodes, state, { width: 150, height: 60 });
    applyExpand(nodes[0], nodes, state);

    const child1 = nodes.find(n => n.id === 'child-1')!;
    expect(child1.hidden).toBeFalsy();
    expect(child1.collapsed).toBe(true);
    expect(grandchild.hidden).toBe(true);
  });

  it('does not skip dimension restore for regular nodes (no originalDimensions)', () => {
    const nodes = structuredClone(edgeBasedNodes);
    const trigger = nodes.find(n => n.id === 'trigger')!;
    const originalDims = { ...trigger.dimensions! };
    const targets = new Set(['outgoer-a', 'outgoer-b']);
    const state = captureCollapseState(trigger, nodes, targets);
    applyCollapse(trigger, nodes, state);
    applyExpand(trigger, nodes, state);

    expect(trigger.dimensions).toEqual(originalDims);
  });
});

// ── rerouteEdgesForCollapse ─────────────────────────────────────────────

describe('rerouteEdgesForCollapse', () => {
  it('reroutes external→hidden edges to trigger', () => {
    const edges = structuredClone(edgeBasedEdges);
    const hiddenSet = new Set(['outgoer-a', 'outgoer-b']);
    const saved = rerouteEdgesForCollapse('trigger', edges, hiddenSet);

    // ext-src → outgoer-a should become ext-src → trigger
    const extToA = edges.find(e => e.id === 'e-ext-a')!;
    expect(extToA.target).toBe('trigger');
    expect(saved.get('e-ext-a')!.target).toBe('outgoer-a');
  });

  it('reroutes hidden→external edges to trigger', () => {
    const edges = structuredClone(edgeBasedEdges);
    const hiddenSet = new Set(['outgoer-a', 'outgoer-b']);
    rerouteEdgesForCollapse('trigger', edges, hiddenSet);

    // outgoer-b → ext-src should become trigger → ext-src
    const bToExt = edges.find(e => e.id === 'e-b-ext')!;
    expect(bToExt.source).toBe('trigger');
  });

  it('hides trigger→hidden edges (prevents self-loops)', () => {
    const edges = structuredClone(edgeBasedEdges);
    const hiddenSet = new Set(['outgoer-a', 'outgoer-b']);
    rerouteEdgesForCollapse('trigger', edges, hiddenSet);

    const triggerToA = edges.find(e => e.id === 'e-t-a')!;
    const triggerToB = edges.find(e => e.id === 'e-t-b')!;
    expect(triggerToA.hidden).toBe(true);
    expect(triggerToB.hidden).toBe(true);
  });

  it('hides hidden↔hidden edges', () => {
    const edges: FlowEdge[] = [
      { id: 'e-a-b', source: 'outgoer-a', target: 'outgoer-b' },
    ];
    const hiddenSet = new Set(['outgoer-a', 'outgoer-b']);
    rerouteEdgesForCollapse('trigger', edges, hiddenSet);

    expect(edges[0].hidden).toBe(true);
  });

  it('does not touch unrelated edges', () => {
    const extraEdge: FlowEdge = { id: 'unrelated', source: 'x', target: 'y' };
    const edges = [...structuredClone(edgeBasedEdges), extraEdge];
    const hiddenSet = new Set(['outgoer-a', 'outgoer-b']);
    const saved = rerouteEdgesForCollapse('trigger', edges, hiddenSet);

    expect(saved.has('unrelated')).toBe(false);
    const unrelated = edges.find(e => e.id === 'unrelated')!;
    expect(unrelated.source).toBe('x');
    expect(unrelated.target).toBe('y');
  });

  it('returns saved originals for all affected edges', () => {
    const edges = structuredClone(edgeBasedEdges);
    const hiddenSet = new Set(['outgoer-a', 'outgoer-b']);
    const saved = rerouteEdgesForCollapse('trigger', edges, hiddenSet);

    expect(saved.has('e-t-a')).toBe(true);
    expect(saved.has('e-t-b')).toBe(true);
    expect(saved.has('e-ext-a')).toBe(true);
    expect(saved.has('e-b-ext')).toBe(true);
  });

  it('works with group collapse (legacy edge fixtures)', () => {
    const edges = structuredClone(collapseEdges);
    const hiddenSet = new Set(['cg-child-1', 'cg-child-2']);
    const saved = rerouteEdgesForCollapse('cg-1', edges, hiddenSet);

    // Internal edge: hidden
    expect(edges.find(e => e.id === 'cg-e-internal')!.hidden).toBe(true);
    // Crossing edge: child-2 → external becomes cg-1 → external
    expect(edges.find(e => e.id === 'cg-e-crossing')!.source).toBe('cg-1');
    expect(saved.get('cg-e-crossing')!.source).toBe('cg-child-2');
  });
});

// ── restoreReroutedEdges ────────────────────────────────────────────────

describe('restoreReroutedEdges', () => {
  it('restores original source/target', () => {
    const edges = structuredClone(edgeBasedEdges);
    const hiddenSet = new Set(['outgoer-a', 'outgoer-b']);
    const saved = rerouteEdgesForCollapse('trigger', edges, hiddenSet);
    restoreReroutedEdges(edges, saved);

    const extToA = edges.find(e => e.id === 'e-ext-a')!;
    expect(extToA.target).toBe('outgoer-a');
    const bToExt = edges.find(e => e.id === 'e-b-ext')!;
    expect(bToExt.source).toBe('outgoer-b');
  });

  it('unhides previously hidden edges', () => {
    const edges = structuredClone(edgeBasedEdges);
    const hiddenSet = new Set(['outgoer-a', 'outgoer-b']);
    const saved = rerouteEdgesForCollapse('trigger', edges, hiddenSet);
    restoreReroutedEdges(edges, saved);

    const triggerToA = edges.find(e => e.id === 'e-t-a')!;
    expect(triggerToA.hidden).toBeFalsy();
  });
});
