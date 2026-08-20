/**
 * Minimal edge shape for flag checking — allows partial edge objects
 * from contexts where the full FlowEdge type isn't available.
 */
interface EdgeLike {
  selectable?: boolean;
}

/**
 * Can this edge be selected by a pointer?
 *
 * `defaultValue` carries the canvas-wide `edgesSelectable` config, so an edge that
 * says nothing follows the canvas and one that states a preference keeps it:
 *   { selectable: true },  canvas off → selectable (explicit override wins)
 *   { },                   canvas off → not selectable
 *   { selectable: false }, canvas on  → not selectable
 *   { },                   canvas on  → selectable
 *
 * Edges have no `locked`, so unlike `isSelectable` for nodes there is nothing else
 * to weigh — this is the whole rule.
 */
export function isEdgeSelectable(edge: EdgeLike, defaultValue = true): boolean {
  return edge.selectable ?? defaultValue;
}
