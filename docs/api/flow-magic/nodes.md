---
title: Node Operations
description: Add, remove, get, and query nodes.
order: 3
---

# Node Operations

### addNodes

```ts
$flow.addNodes(nodes: FlowNode | FlowNode[], options?: { center?: boolean }): void
```

Add one or more nodes to the canvas. Accepts a single node or an array.

When `options.center` is set, nodes are placed off-screen for measurement, then repositioned centered on their intended position after dimensions are known.

Validates child constraints before accepting each node. Captures history, sorts topologically, rebuilds the node map, pushes collab updates, runs child layout, and schedules auto-layout.

### removeNodes

```ts
$flow.removeNodes(ids: string | string[]): void
```

Remove one or more nodes by ID. Cascades removal to all descendants (via `parentId` hierarchy). Removes connected edges and optionally creates reconnection bridges (when `reconnectOnDelete` is enabled). Validates child constraints before allowing removal.

### batch

```ts
$flow.batch<T>(fn: () => T): T
```

Suspend layout reconciliation for the duration of `fn`, then run a single reconciliation pass after it returns. Ref-counted — nested `batch()` calls join the outer batch rather than triggering early reconciliation. Returns `fn`'s return value. Uses `try/finally` internally so a throwing `fn` still reconciles before the error propagates.

Use `batch()` whenever a single logical operation adds, removes, or reparents multiple nodes that share a parent. Without it, each mutation triggers a layout pass; with it, exactly one pass runs per affected parent.

```js
// Without batch(): 100 addNodes calls → up to 100 layout passes per parent.
// With batch(): one layout pass per parent after all nodes are added.
$flow.batch(() => {
    $flow.addNodes(allNodes);
    $flow.addEdges(allEdges);
});
```

### getNode

```ts
$flow.getNode(id: string): FlowNode | undefined
```

Look up a node by ID. Returns the reactive node object or `undefined`.

### getNodesBounds

```ts
$flow.getNodesBounds(nodeIds?: string[]): { x: number; y: number; width: number; height: number }
```

Get the bounding rectangle of the specified nodes. When no IDs are provided, returns bounds for all visible (non-hidden) nodes.

### getOutgoers

```ts
$flow.getOutgoers(nodeId: string): FlowNode[]
```

Get all nodes connected via outgoing edges from the given node.

### getIncomers

```ts
$flow.getIncomers(nodeId: string): FlowNode[]
```

Get all nodes connected via incoming edges to the given node.

### getConnectedEdges

```ts
$flow.getConnectedEdges(nodeId: string): FlowEdge[]
```

Get all edges connected to a node (both incoming and outgoing).

### areNodesConnected

```ts
$flow.areNodesConnected(nodeA: string, nodeB: string, directed?: boolean): boolean
```

Check if two nodes are connected by an edge. When `directed` is true (default: `false`), only checks source-to-target direction.

### getIntersectingNodes

```ts
$flow.getIntersectingNodes(nodeOrId: FlowNode | string, partially?: boolean): FlowNode[]
```

Get nodes whose bounding rectangle overlaps the given node. Accepts either a `FlowNode` object or a node ID string. When `partially` is false, requires full containment.

### isNodeIntersecting

```ts
$flow.isNodeIntersecting(nodeOrId: FlowNode | string, targetOrId: FlowNode | string, partially?: boolean): boolean
```

Check if two nodes' bounding rectangles overlap. Accepts either `FlowNode` objects or node ID strings.
