/**
 * Minimal node shape for flag checking — allows partial node objects
 * from connection-utils and other contexts where the full FlowNode
 * type isn't available.
 */
interface NodeLike {
  locked?: boolean;
  draggable?: boolean;
  deletable?: boolean;
  connectable?: boolean;
  selectable?: boolean;
  resizable?: boolean;
}

/**
 * Check if a node allows a specific interaction.
 *
 * When `locked` is true, all interactions are blocked unless the
 * individual flag explicitly overrides. For example:
 *   { locked: true, draggable: true } → draggable (explicit override wins)
 *   { locked: true } → not draggable (locked blocks)
 *   { draggable: false } → not draggable (individual flag blocks)
 *   { } → draggable (default is true)
 */
function isAllowed(node: NodeLike, flag: boolean | undefined, defaultValue = true): boolean {
  // Explicit individual flag always wins
  if (flag !== undefined) return flag;
  // If locked, block
  if (node.locked) return false;
  // Default
  return defaultValue;
}

export function isDraggable(node: NodeLike): boolean {
  return isAllowed(node, node.draggable);
}

export function isDeletable(node: NodeLike): boolean {
  return isAllowed(node, node.deletable);
}

export function isConnectable(node: NodeLike): boolean {
  return isAllowed(node, node.connectable);
}

export function isSelectable(node: NodeLike): boolean {
  return isAllowed(node, node.selectable);
}

export function isResizable(node: NodeLike): boolean {
  return isAllowed(node, node.resizable);
}
