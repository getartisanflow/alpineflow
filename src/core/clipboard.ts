// ============================================================================
// Clipboard Manager
//
// Pure functions for copy/paste/cut of selected nodes and edges.
// Uses a module-level clipboard variable shared across all canvas instances
// on the same page, enabling cross-canvas copy/paste.
// ============================================================================

import type { FlowNode, FlowEdge } from './types';

interface ClipboardData {
  nodes: FlowNode[];
  edges: FlowEdge[];
  pasteCount: number;
}

let clipboard: ClipboardData | null = null;

const PASTE_OFFSET = 20;

/**
 * Deep-clone a value. Uses JSON round-trip instead of structuredClone
 * because Alpine.js wraps reactive arrays/objects in Proxy, which
 * structuredClone cannot handle (throws DataCloneError).
 *
 * Note: Only JSON-serializable values in node.data / edge.data are preserved.
 * Map, Set, Date, RegExp, undefined, and function values will be silently dropped.
 */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Generate a unique ID for a pasted node/edge.
 */
function generateCopyId(originalId: string): string {
  return `${originalId}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Copy selected nodes and their internal edges to the clipboard.
 * "Internal" means both source and target are in the selection.
 */
export function copySelection(
  nodes: FlowNode[],
  edges: FlowEdge[],
): { nodeCount: number; edgeCount: number } {
  const selectedNodes = nodes.filter((n) => n.selected);
  const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));

  const selectedEdges = edges.filter(
    (e) => e.selected || (selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)),
  );

  clipboard = {
    nodes: clone(selectedNodes),
    edges: clone(selectedEdges),
    pasteCount: 0,
  };

  return { nodeCount: selectedNodes.length, edgeCount: selectedEdges.length };
}

/**
 * Paste clipboard contents with new IDs and accumulating offset.
 * Returns null if clipboard is empty.
 */
export function pasteClipboard(): { nodes: FlowNode[]; edges: FlowEdge[] } | null {
  if (!clipboard || clipboard.nodes.length === 0) return null;

  clipboard.pasteCount++;
  const offset = clipboard.pasteCount * PASTE_OFFSET;
  const idMap = new Map<string, string>();

  const newNodes = clipboard.nodes.map((n) => {
    const newId = generateCopyId(n.id);
    idMap.set(n.id, newId);
    return {
      ...n,
      id: newId,
      data: clone(n.data),
      position: { x: n.position.x + offset, y: n.position.y + offset },
      selected: true,
    };
  });

  const newEdges = clipboard.edges.map((e) => ({
    ...e,
    id: generateCopyId(e.id),
    source: idMap.get(e.source)!,
    target: idMap.get(e.target)!,
    selected: true,
  }));

  return { nodes: newNodes, edges: newEdges };
}

/**
 * Copy selected nodes to clipboard and return their IDs for removal.
 */
export function cutSelection(
  nodes: FlowNode[],
  edges: FlowEdge[],
): { nodeIds: string[]; edgeCount: number; nodeCount: number } {
  const result = copySelection(nodes, edges);
  const nodeIds = nodes.filter((n) => n.selected).map((n) => n.id);
  return { nodeIds, ...result };
}

/**
 * Clear the clipboard.
 */
export function clearClipboard(): void {
  clipboard = null;
}
