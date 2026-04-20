// ============================================================================
// Bidirectional Edge Collapse
//
// When `canvas.collapseBidirectionalEdges` is enabled, reciprocal edge pairs
// (A→B + B→A) can be rendered as a single path with markers at BOTH ends.
// Both edges remain in `canvas.edges`; only rendering changes.
//
// Pure helpers — no DOM access.
// ============================================================================

/** A pair of reciprocal edges identified by id. */
export interface BidirectionalPair {
  /** The edge that remains visible and renders a dual (start + end) marker. */
  primaryId: string;
  /** The edge that is hidden from rendering because its partner already draws the pair. */
  mirrorId: string;
}

/**
 * Detect reciprocal edge pairs (A→B + B→A). Each edge participates in at most
 * one pair; the first matching mirror wins. Self-loops (source === target) are
 * ignored.
 */
export function detectBidirectionalPairs<E extends { id: string; source: string; target: string }>(
  edges: E[],
): BidirectionalPair[] {
  const pairs: BidirectionalPair[] = [];
  const seen = new Set<string>();

  for (const edge of edges) {
    if (seen.has(edge.id)) {
      continue;
    }
    if (edge.source === edge.target) {
      continue;
    }
    const mirror = edges.find(
      (e) =>
        e.id !== edge.id
        && e.source === edge.target
        && e.target === edge.source
        && !seen.has(e.id),
    );
    if (mirror) {
      pairs.push({ primaryId: edge.id, mirrorId: mirror.id });
      seen.add(edge.id);
      seen.add(mirror.id);
    }
  }

  return pairs;
}

/**
 * Decorate edges with collapse flags. Primary edges in a reciprocal pair get
 * `_renderDualMarker`; mirror edges get `_hiddenByCollapse`. Non-paired edges
 * are returned unchanged (flag fields are `undefined`).
 */
export function collapseBidirectionalPairs<E extends { id: string; source: string; target: string }>(
  edges: E[],
): Array<E & { _renderDualMarker?: boolean; _hiddenByCollapse?: boolean }> {
  const pairs = detectBidirectionalPairs(edges);
  const primaryIds = new Set(pairs.map((p) => p.primaryId));
  const mirrorIds = new Set(pairs.map((p) => p.mirrorId));

  return edges.map((e) => ({
    ...e,
    _renderDualMarker: primaryIds.has(e.id) || undefined,
    _hiddenByCollapse: mirrorIds.has(e.id) || undefined,
  }));
}
