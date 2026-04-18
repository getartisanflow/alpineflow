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

### getNodeElement

```ts
$flow.getNodeElement(id: string): HTMLElement | undefined
```

Returns the rendered DOM element for a node by ID, or `undefined` if the node is not currently in the DOM (hidden, unmounted, or the ID does not exist). Useful for imperative DOM operations such as measuring, scrolling into view, or applying focus.

### getNodeIdFromElement

```ts
$flow.getNodeIdFromElement(el: Element): string | undefined
```

Resolves the node ID from any DOM element that lives inside a flow node. Walks up the DOM to find the nearest `[data-flow-node]` ancestor and returns its `data-flow-node-id` attribute value. Returns `undefined` if `el` is not inside any node element.

### getNodeAtPoint

```ts
$flow.getNodeAtPoint(x: number, y: number): FlowNode | undefined
```

Returns the topmost node whose rendered bounding box contains the given canvas-space coordinates `(x, y)`. When multiple nodes overlap the point, the one with the highest `zIndex` (or last in DOM order on a tie) is returned. Returns `undefined` if no node covers the point.

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

### setNodeState

```ts
$flow.setNodeState(id: string, state: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'): void
```

Set the `runState` property on a node and update its DOM classes. The previous `.flow-node-{state}` class is removed and the new one (`flow-node-pending`, `flow-node-running`, `flow-node-completed`, `flow-node-failed`, `flow-node-skipped`) is added automatically.

The `node.runState` property is reserved by AlpineFlow — avoid setting it directly to ensure DOM classes stay in sync.

### resetStates

```ts
$flow.resetStates(ids?: string[]): void
```

Clear `runState` on all nodes (or only the nodes whose IDs are in `ids`). Removes any `.flow-node-{state}` CSS classes and sets `runState` back to `undefined`.
