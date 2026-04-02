import type { FlowNode, FlowEdge } from '../types';

// ── Standard test nodes ────────────────────────────────────────────────────

export const nodeA: FlowNode = {
  id: 'a',
  position: { x: 0, y: 0 },
  data: { label: 'Node A' },
  dimensions: { width: 150, height: 50 },
};

export const nodeB: FlowNode = {
  id: 'b',
  position: { x: 200, y: 100 },
  data: { label: 'Node B' },
  dimensions: { width: 150, height: 50 },
};

export const nodeC: FlowNode = {
  id: 'c',
  position: { x: 400, y: 200 },
  data: { label: 'Node C' },
  dimensions: { width: 150, height: 50 },
};

export const nodeD: FlowNode = {
  id: 'd',
  position: { x: 100, y: 300 },
  data: { label: 'Node D' },
  dimensions: { width: 150, height: 50 },
};

export const hiddenNode: FlowNode = {
  id: 'hidden',
  position: { x: 600, y: 0 },
  data: { label: 'Hidden Node' },
  dimensions: { width: 150, height: 50 },
  hidden: true,
};

export const undeletableNode: FlowNode = {
  id: 'undeletable',
  position: { x: 600, y: 100 },
  data: { label: 'Undeletable Node' },
  dimensions: { width: 150, height: 50 },
  deletable: false,
};

export const hiddenEdge: FlowEdge = {
  id: 'e-hidden',
  source: 'a',
  target: 'hidden',
  hidden: true,
};

export const undeletableEdge: FlowEdge = {
  id: 'e-undeletable',
  source: 'a',
  target: 'b',
  deletable: false,
};

// ── Group / sub-flow nodes ────────────────────────────────────────────────

export const groupNode: FlowNode = {
  id: 'group-1',
  type: 'group',
  position: { x: 50, y: 50 },
  data: { label: 'Group' },
  dimensions: { width: 400, height: 300 },
};

export const childNode1: FlowNode = {
  id: 'child-1',
  parentId: 'group-1',
  position: { x: 20, y: 30 },
  data: { label: 'Child 1' },
  dimensions: { width: 100, height: 40 },
};

export const childNode2: FlowNode = {
  id: 'child-2',
  parentId: 'group-1',
  position: { x: 150, y: 80 },
  data: { label: 'Child 2' },
  dimensions: { width: 100, height: 40 },
};

export const grandchildNode: FlowNode = {
  id: 'grandchild-1',
  parentId: 'child-1',
  position: { x: 10, y: 10 },
  data: { label: 'Grandchild' },
  dimensions: { width: 60, height: 30 },
};

// ── Standard test edges ───────────────────────────────────────────────────

export const edgeAB: FlowEdge = {
  id: 'e-a-b',
  source: 'a',
  target: 'b',
};

export const edgeBC: FlowEdge = {
  id: 'e-b-c',
  source: 'b',
  target: 'c',
};

export const edgeAC: FlowEdge = {
  id: 'e-a-c',
  source: 'a',
  target: 'c',
};

export const edgeBD: FlowEdge = {
  id: 'e-b-d',
  source: 'b',
  target: 'd',
};

// ── Convenience arrays ────────────────────────────────────────────────────

export const nodes: FlowNode[] = [nodeA, nodeB, nodeC, nodeD];
export const edges: FlowEdge[] = [edgeAB, edgeBC, edgeAC, edgeBD];

export const subFlowNodes: FlowNode[] = [
  groupNode,
  childNode1,
  childNode2,
  grandchildNode,
];

// ── Collapsible group nodes ─────────────────────────────────────────────

export const collapsibleGroup: FlowNode = {
  id: 'cg-1',
  type: 'group',
  position: { x: 100, y: 100 },
  data: { label: 'Collapsible Group' },
  dimensions: { width: 400, height: 300 },
};

export const cgChild1: FlowNode = {
  id: 'cg-child-1',
  parentId: 'cg-1',
  position: { x: 20, y: 50 },
  data: { label: 'CG Child 1' },
  dimensions: { width: 100, height: 40 },
};

export const cgChild2: FlowNode = {
  id: 'cg-child-2',
  parentId: 'cg-1',
  position: { x: 200, y: 50 },
  data: { label: 'CG Child 2' },
  dimensions: { width: 100, height: 40 },
};

export const cgExternalNode: FlowNode = {
  id: 'cg-external',
  position: { x: 600, y: 150 },
  data: { label: 'External' },
  dimensions: { width: 100, height: 40 },
};

export const cgEdgeInternal: FlowEdge = {
  id: 'cg-e-internal',
  source: 'cg-child-1',
  target: 'cg-child-2',
};

export const cgEdgeCrossing: FlowEdge = {
  id: 'cg-e-crossing',
  source: 'cg-child-2',
  target: 'cg-external',
};

export const collapseNodes: FlowNode[] = [
  collapsibleGroup, cgChild1, cgChild2, cgExternalNode,
];

export const collapseEdges: FlowEdge[] = [
  cgEdgeInternal, cgEdgeCrossing,
];

// ── Edge-based collapse nodes (regular nodes, no parentId) ──────────────

export const triggerNode: FlowNode = {
  id: 'trigger',
  position: { x: 100, y: 100 },
  data: { label: 'Trigger' },
  dimensions: { width: 150, height: 50 },
};

export const outgoerA: FlowNode = {
  id: 'outgoer-a',
  position: { x: 300, y: 50 },
  data: { label: 'Outgoer A' },
  dimensions: { width: 150, height: 50 },
};

export const outgoerB: FlowNode = {
  id: 'outgoer-b',
  position: { x: 300, y: 200 },
  data: { label: 'Outgoer B' },
  dimensions: { width: 150, height: 50 },
};

export const outgoerC: FlowNode = {
  id: 'outgoer-c',
  position: { x: 500, y: 125 },
  data: { label: 'Outgoer C (2nd level)' },
  dimensions: { width: 150, height: 50 },
};

export const externalSrc: FlowNode = {
  id: 'ext-src',
  position: { x: -100, y: 125 },
  data: { label: 'External Source' },
  dimensions: { width: 150, height: 50 },
};

export const edgeBasedNodes: FlowNode[] = [
  triggerNode, outgoerA, outgoerB, outgoerC, externalSrc,
];

export const edgeTriggerToA: FlowEdge = { id: 'e-t-a', source: 'trigger', target: 'outgoer-a' };
export const edgeTriggerToB: FlowEdge = { id: 'e-t-b', source: 'trigger', target: 'outgoer-b' };
export const edgeAToC: FlowEdge = { id: 'e-a-c', source: 'outgoer-a', target: 'outgoer-c' };
export const edgeExtToA: FlowEdge = { id: 'e-ext-a', source: 'ext-src', target: 'outgoer-a' };
export const edgeBToExt: FlowEdge = { id: 'e-b-ext', source: 'outgoer-b', target: 'ext-src' };

export const edgeBasedEdges: FlowEdge[] = [
  edgeTriggerToA, edgeTriggerToB, edgeAToC, edgeExtToA, edgeBToExt,
];

// ── Group with custom collapsed dimensions ──────────────────────────────

export const groupWithCustomDims: FlowNode = {
  id: 'grp-custom',
  type: 'group',
  position: { x: 100, y: 100 },
  data: { label: 'Custom Dims Group' },
  dimensions: { width: 400, height: 300 },
  collapsedDimensions: { width: 200, height: 80 },
};

// ── DOMRect mock ──────────────────────────────────────────────────────────

export function makeDOMRect(
  x: number,
  y: number,
  width: number,
  height: number,
): DOMRect {
  return {
    x,
    y,
    width,
    height,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    toJSON() {},
  } as DOMRect;
}
