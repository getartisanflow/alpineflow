---
title: Hierarchy & Transform
description: Parent/child layout, collapse, condense, and rotation.
order: 7
---

# Hierarchy

### layoutChildren

```ts
$flow.layoutChildren(parentId: string, options?: {
  excludeId?: string;
  omitFromComputation?: string;
  includeNode?: FlowNode;
  shallow?: boolean;
  stretchedSize?: Dimensions;
}): void
```

Compute and apply child layout for a parent node. Recursively lays out nested layout parents bottom-up (unless `shallow` is true). Applies computed positions, dimension overrides with min/max constraint clamping, and auto-sizes the parent.

As of v0.2.1-alpha, `addNodes` and mutations to `node.childLayout` properties (`columns`, `gap`, `padding`, `headerHeight`, `direction`, `stretch`) trigger `layoutChildren` automatically. Manual calls remain useful when repositioning children by directly mutating `node.position` without going through `addNodes`, or when you need `{ shallow: true }`.

### propagateLayoutUp

```ts
$flow.propagateLayoutUp(startParentId: string, opts?: {
  excludeId?: string;
  omitFromComputation?: string;
  includeNode?: FlowNode;
}): void
```

Walk up from a parent through ancestor layout parents, calling `layoutChildren(shallow)` at each level so parent resizes propagate through the hierarchy.

### reorderChild

```ts
$flow.reorderChild(nodeId: string, newOrder: number): void
```

Reorder a child within its layout parent. Reassigns order values for all siblings, runs `layoutChildren`, and emits a `child-reorder` event.

### reparentNode

```ts
$flow.reparentNode(nodeId: string, newParentId: string | null): boolean
```

Reparent a node into a new parent (or detach from current parent by passing `null`). Handles position conversion between coordinate spaces, validates child constraints on both old and new parents, guards against circular reparenting. Returns `true` on success, `false` if validation rejects.

---

## Collapse / Expand

| Method | Signature | Description |
|---|---|---|
| `collapseNode` | `(id: string, options?: { animate?: boolean; recursive?: boolean }): void` | Collapse a node -- hide its descendants/outgoers. Group nodes shrink to `collapsedDimensions`. Optionally animates (default: true). |
| `expandNode` | `(id: string, options?: { animate?: boolean }): void` | Expand a previously collapsed node -- restore descendants and rerouted edges. |
| `toggleNode` | `(id: string, options?: { animate?: boolean; recursive?: boolean }): void` | Toggle collapse/expand state. |
| `isCollapsed` | `(id: string): boolean` | Check if a node is collapsed. |
| `getCollapseTargetCount` | `(id: string): number` | Get the number of nodes that would be hidden when collapsing this node. |
| `getDescendantCount` | `(id: string): number` | Get the number of descendants (via `parentId` hierarchy) of a node. |

---

## Condense

| Method | Signature | Description |
|---|---|---|
| `condenseNode` | `(id: string): void` | Condense a node -- switch to summary view, hiding internal rows. |
| `uncondenseNode` | `(id: string): void` | Uncondense a node -- restore full row view. |
| `toggleCondense` | `(id: string): void` | Toggle condensed state. |
| `isCondensed` | `(id: string): boolean` | Check if a node is condensed. |

---

## Transform

### rotateNode

```ts
$flow.rotateNode(id: string, angle: number): void
```

Set a node's rotation angle in degrees. The CSS transform is applied by the `x-flow-node` directive.

---

## Compute

### registerCompute

```ts
$flow.registerCompute(nodeType: string, definition: ComputeDefinition): void
```

Register a compute function for a node type. Used by the data propagation engine to compute derived values based on incoming edges.

### compute

```ts
$flow.compute(startNodeId?: string): Map<string, Record<string, any>>
```

Run the compute engine, propagating data through nodes in topological order. When `startNodeId` is provided, only recomputes from that node forward. Returns a map of node ID to computed output data. Emits `compute-complete`.

---

## Validation

### validateParent

```ts
$flow.validateParent(nodeId: string): { valid: boolean; errors: string[] }
```

Validate a parent node's child constraints. Returns validation result with any error messages.

### validateAll

```ts
$flow.validateAll(): Map<string, { valid: boolean; errors: string[] }>
```

Validate all parent nodes. Returns a map of parent node ID to validation result.

### getValidationErrors

```ts
$flow.getValidationErrors(nodeId: string): string[]
```

Get cached validation errors for a node. Returns an empty array if valid.
