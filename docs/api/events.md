---
title: Events
description: All events emitted by AlpineFlow with payload shapes.
order: 2
---

# Events

AlpineFlow emits events for every significant interaction, structural change, and lifecycle transition. Events can be consumed in three ways.

Click nodes, drag them, create connections — the devtools panel logs every event:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Click me' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Drag me' } },
    ],
    edges: [],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
    debug: true,
})" class="flow-container" style="height: 500px;">
    <div x-flow-devtools></div>
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Listening to Events

### 1. Config Callbacks

Pass callback functions in the `flowCanvas()` configuration. The callback name follows the pattern `on` + PascalCase event name.

```html
<div x-data="flowCanvas({
  nodes: [...],
  onNodeClick: (detail) => console.log('Clicked:', detail.node.id),
  onConnect: (detail) => console.log('Connected:', detail.connection),
})">
```

Every config callback also receives the **canvas context** as an optional second argument, so a handler can drive the canvas without reaching for a global reference. It is the same object exposed as `$flow` inside the canvas element:

```js
flowCanvas({
  onDrop: (detail, ctx) => ctx.addNodes(makeNodeFrom(detail)),
  onConnect: (detail, ctx) => ctx.fitView(),
})
```

The context is passed as a second argument only — it is **never** added to the event `detail`, which stays a plain, serializable object for the DOM `CustomEvent` dispatch (and WireFlow). Existing handlers that take only `(detail)` are unaffected.

### 2. Alpine Event Directives

Events are dispatched as DOM `CustomEvent`s on the container with a `flow-` prefix. Use Alpine's `@` directive to listen.

```html
<div x-data="flowCanvas({ nodes: [...] })"
     @flow-node-click="console.log('Clicked:', $event.detail.node.id)"
     @flow-connect.window="handleConnect($event.detail)">
```

Events bubble, so you can also listen on parent elements or `window`.

### 3. Direct DOM Listeners

For vanilla JavaScript integration:

```js
document.querySelector('[data-flow-canvas]')
  .addEventListener('flow-node-click', (e) => {
    console.log('Clicked:', e.detail.node.id);
  });
```

---

## Node Interaction Events

### node-click

Fired when a node is clicked.

```ts
{ node: FlowNode; event: MouseEvent }
```

Config callback: `onNodeClick`

### node-drag-start

Fired when a node drag operation begins.

```ts
{ node: FlowNode }
```

Config callback: `onNodeDragStart`

### node-drag

Fired continuously during a node drag.

```ts
{ node: FlowNode; position: XYPosition }
```

Config callback: `onNodeDrag`

### node-drag-end

Fired when a node drag operation ends.

```ts
{ node: FlowNode; position: XYPosition }
```

Config callback: `onNodeDragEnd`

### node-resize-start

Fired when a node resize begins (via `x-flow-resizer`).

```ts
{ node: FlowNode; dimensions: Dimensions }
```

Config callback: `onNodeResizeStart`

### node-resize

Fired continuously during a node resize.

```ts
{ node: FlowNode; dimensions: Dimensions }
```

Config callback: `onNodeResize`

### node-resize-end

Fired when a node resize ends.

```ts
{ node: FlowNode; dimensions: Dimensions }
```

Config callback: `onNodeResizeEnd`

### node-context-menu

Fired when a node is right-clicked.

```ts
{ node: FlowNode; event: MouseEvent }
```

Config callback: `onNodeContextMenu`

### node-collapse

Fired when a node is collapsed (descendants hidden).

```ts
{ node: FlowNode; descendants: string[] }
```

Config callback: `onNodeCollapse`

### node-expand

Fired when a node is expanded (descendants restored).

```ts
{ node: FlowNode; descendants: string[] }
```

Config callback: `onNodeExpand`

### node-condense

Fired when a node switches to condensed (summary) view.

```ts
{ node: FlowNode }
```

Config callback: `onNodeCondense`

### node-uncondense

Fired when a node restores full row view.

```ts
{ node: FlowNode }
```

Config callback: `onNodeUncondense`

---

## Edge Interaction Events

### edge-click

Fired when an edge is clicked.

```ts
{ edge: FlowEdge; event: MouseEvent }
```

Config callback: `onEdgeClick`

### edge-context-menu

Fired when an edge is right-clicked.

```ts
{ edge: FlowEdge; event: MouseEvent }
```

Config callback: `onEdgeContextMenu`

---

## Connection Events

### connect-start

Fired when a connection drag begins from a source handle.

```ts
{ source: string; sourceHandle?: string }
```

Config callback: `onConnectStart`

### connect

Fired when a connection is successfully created (single connection).

```ts
{ connection: Connection }
```

Where `Connection` is `{ source: string; sourceHandle?: string; target: string; targetHandle?: string }`.

Config callback: `onConnect`

### multi-connect

Fired when multiple connections are created in a single multi-connect drag.

```ts
{ connections: Connection[] }
```

Config callback: `onMultiConnect`

### connect-end

Fired when a connection drag ends (whether successful or cancelled).

```ts
{
  connection: Connection | null;
  source: string;
  sourceHandle?: string;
  position: XYPosition;
}
```

`connection` is `null` if the drag was cancelled without creating an edge.

Config callback: `onConnectEnd`

---

## Reconnection Events

### reconnect-start

Fired when an edge endpoint reconnection drag begins.

```ts
{ edge: FlowEdge; handleType: HandleType }
```

Where `HandleType` is `'source' | 'target'`.

Config callback: `onReconnectStart`

### reconnect

Fired when an edge is successfully reconnected to a new handle.

```ts
{ oldEdge: FlowEdge; newConnection: Connection }
```

Config callback: `onReconnect`

### reconnect-end

Fired when an edge reconnection drag ends.

```ts
{ edge: FlowEdge; successful: boolean }
```

Config callback: `onReconnectEnd`

---

## Viewport Events

### viewport-change

Fired whenever the viewport state changes (any pan or zoom).

```ts
{ viewport: Viewport }
```

Config callback: `onViewportChange`

### viewport-move-start

Fired when a user gesture (pan/zoom) starts.

```ts
{ viewport: Viewport }
```

Config callback: `onViewportMoveStart`

### viewport-move

Fired each frame during a user gesture (pan/zoom).

```ts
{ viewport: Viewport }
```

Config callback: `onViewportMove`

### viewport-move-end

Fired when a user gesture (pan/zoom) ends.

```ts
{ viewport: Viewport }
```

Config callback: `onViewportMoveEnd`

---

## Canvas Events

### pane-click

Fired when the canvas background (empty space) is clicked.

```ts
{ event: MouseEvent; position: XYPosition }
```

`position` is in flow coordinates.

Config callback: `onPaneClick`

### pane-context-menu

Fired when the canvas background is right-clicked.

```ts
{ event: MouseEvent; position: XYPosition }
```

Config callback: `onPaneContextMenu`

---

## Selection Events

### selection-change

Fired whenever the set of selected nodes, edges, or rows changes.

```ts
{
  nodes: string[];   // selected node IDs
  edges: string[];   // selected edge IDs
  rows: string[];    // selected row IDs
}
```

Config callback: `onSelectionChange`

### selection-context-menu

Fired when opening a context menu with multiple nodes selected — a right-click on the pane, a
right-click on one of the selected nodes, or a long press on a touch device.

```ts
{ nodes: FlowNode[]; edges: FlowEdge[]; event: MouseEvent }
```

`edges` carries the selected edges, which is what lets a menu item act on the whole selection
rather than on its nodes alone. It is an empty array when only nodes are selected.

Config callback: `onSelectionContextMenu`

---

## Structure Events

### nodes-change

Fired when nodes are added or removed.

```ts
{ type: 'add' | 'remove'; nodes: FlowNode[]; origin: 'drop' | 'paste' | 'api' | 'load' }
```

`origin` tells you what caused the change so you can react only to user intent — `'drop'` (drag-drop), `'paste'` (clipboard), `'load'` (bulk `fromObject`/`replaceNodes`), or `'api'` (a direct `addNodes`/`removeNodes` call, the default). The mutators accept a `{ source }` option to override it: `$flow.addNodes(nodes, { source: 'load' })`.

Config callback: `onNodesChange`

### edges-change

Fired when edges are added or removed.

```ts
{ type: 'add' | 'remove'; edges: FlowEdge[]; origin: 'drop' | 'paste' | 'api' | 'load' }
```

Same `origin` discriminator as `nodes-change`. `$flow.addEdges` / `$flow.removeEdges` accept `{ source }` to override the default `'api'`.

Config callback: `onEdgesChange`

### nodes-patch

Fired when nodes are patched (partial updates).

```ts
{ patches: Record<string, DeepPartial<FlowNode>> }
```

Config callback: `onNodesPatch`

### edges-patch

Fired when edges are patched (partial updates).

```ts
{ patches: Record<string, DeepPartial<FlowEdge>> }
```

Config callback: `onEdgesPatch`

### node-filter-change

Fired when a node-level filter is applied or cleared.

```ts
{ filtered: FlowNode[]; visible: FlowNode[] }
```

---

## Row Events

### row-select

Fired when a row is selected.

```ts
{ rowId: string; nodeId: string; attrId: string }
```

### row-deselect

Fired when a row is deselected.

```ts
{ rowId: string; nodeId: string; attrId: string }
```

### row-selection-change

Fired whenever the set of selected rows changes.

```ts
{ selectedRows: string[] }
```

---

## Lifecycle Events

### init

Fired after the canvas is fully initialized.

```ts
undefined
```

Config callback: `onInit`

### destroy

Fired when the canvas is being destroyed (cleanup).

```ts
undefined
```

Config callback: `onDestroy`

---

## Additional Events

These events are emitted internally but do not have dedicated config callbacks. Listen via DOM event directives.

| Event | Payload | When |
|---|---|---|
| `save` | `{ nodes, edges, viewport }` | `toObject()` is called |
| `restore` | `{ nodes?, edges?, viewport?, origin }` | `fromObject()` / `$clear()` / `$reset()` / `replaceNodes()` / `undo()` / `redo()` |
| `copy` | `{ nodeCount, edgeCount }` | Clipboard copy |
| `paste` | `{ nodes, edges }` | Clipboard paste |
| `cut` | `{ nodeCount, edgeCount }` | Clipboard cut |
| `layout` | `{ type, direction?, ... }` | Layout algorithm applied |
| `compute-complete` | `{ results: Map }` | Compute engine finishes |
| `node-reparent` | `{ node, oldParentId, newParentId }` | Node reparented |
| `child-reorder` | `{ nodeId, parentId, order }` | Child reordered in layout parent |
| `panel-reset` | `undefined` | `resetPanels()` called |
| `helper-lines-change` | `{ horizontal: number[], vertical: number[] }` | Alignment guides update during drag |

The `restore` event's `origin` field is `'undo' | 'redo' | 'load'` — `'undo'`/`'redo'` from history, and `'load'` from `fromObject()` / `$reset()` / `$clear()` / `replaceNodes()`. Listen via the `flow-restore` DOM event: `@flow-restore="syncSidebar($event.detail)"`. See the [v0.2.1-alpha migration guide](../migration/v0.2.1-alpha.md) for the field's history (it superseded an unreleased `source` tag).

---

## Quick Reference

All events at a glance:

| Event | Payload | Config Callback |
|---|---|---|
| `node-click` | `{ node, event }` | `onNodeClick` |
| `node-drag-start` | `{ node }` | `onNodeDragStart` |
| `node-drag` | `{ node, position }` | `onNodeDrag` |
| `node-drag-end` | `{ node, position }` | `onNodeDragEnd` |
| `node-resize-start` | `{ node, dimensions }` | `onNodeResizeStart` |
| `node-resize` | `{ node, dimensions }` | `onNodeResize` |
| `node-resize-end` | `{ node, dimensions }` | `onNodeResizeEnd` |
| `node-context-menu` | `{ node, event }` | `onNodeContextMenu` |
| `node-collapse` | `{ node, descendants }` | `onNodeCollapse` |
| `node-expand` | `{ node, descendants }` | `onNodeExpand` |
| `node-condense` | `{ node }` | `onNodeCondense` |
| `node-uncondense` | `{ node }` | `onNodeUncondense` |
| `edge-click` | `{ edge, event }` | `onEdgeClick` |
| `edge-context-menu` | `{ edge, event }` | `onEdgeContextMenu` |
| `connect-start` | `{ source, sourceHandle? }` | `onConnectStart` |
| `connect` | `{ connection }` | `onConnect` |
| `multi-connect` | `{ connections }` | `onMultiConnect` |
| `connect-end` | `{ connection?, source, sourceHandle?, position }` | `onConnectEnd` |
| `reconnect-start` | `{ edge, handleType }` | `onReconnectStart` |
| `reconnect` | `{ oldEdge, newConnection }` | `onReconnect` |
| `reconnect-end` | `{ edge, successful }` | `onReconnectEnd` |
| `viewport-change` | `{ viewport }` | `onViewportChange` |
| `viewport-move-start` | `{ viewport }` | `onViewportMoveStart` |
| `viewport-move` | `{ viewport }` | `onViewportMove` |
| `viewport-move-end` | `{ viewport }` | `onViewportMoveEnd` |
| `pane-click` | `{ event, position }` | `onPaneClick` |
| `pane-context-menu` | `{ event, position }` | `onPaneContextMenu` |
| `selection-change` | `{ nodes, edges, rows }` | `onSelectionChange` |
| `selection-context-menu` | `{ nodes, edges, event }` | `onSelectionContextMenu` |
| `nodes-change` | `{ type, nodes, origin }` | `onNodesChange` |
| `edges-change` | `{ type, edges, origin }` | `onEdgesChange` |
| `nodes-patch` | `{ patches }` | `onNodesPatch` |
| `edges-patch` | `{ patches }` | `onEdgesPatch` |
| `node-filter-change` | `{ filtered, visible }` | — |
| `row-select` | `{ rowId, nodeId, attrId }` | — |
| `row-deselect` | `{ rowId, nodeId, attrId }` | — |
| `row-selection-change` | `{ selectedRows }` | — |
| `init` | — | `onInit` |
| `destroy` | — | `onDestroy` |
| `save` | `{ nodes, edges, viewport }` | — |
| `restore` | `{ nodes?, edges?, viewport?, origin }` | — |
| `copy` | `{ nodeCount, edgeCount }` | — |
| `paste` | `{ nodes, edges }` | — |
| `cut` | `{ nodeCount, edgeCount }` | — |
| `layout` | `{ type, direction?, ... }` | — |
| `compute-complete` | `{ results: Map }` | — |
| `node-reparent` | `{ node, oldParentId, newParentId }` | — |
| `child-reorder` | `{ nodeId, parentId, order }` | — |
| `panel-reset` | — | — |
| `helper-lines-change` | `{ horizontal, vertical }` | — |

---

## See Also

- [Configuration > Event Callbacks](../configuration/events.md) -- Configuring callbacks
- [$flow Magic](flow-magic/index.md) -- Programmatic API
