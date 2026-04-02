---
title: Event Configuration
description: Event callbacks, error handling, and Livewire bridge.
order: 9
---

# Event Configuration

All event callbacks follow the `on{EventName}` pattern. See [Events](../api/events.md) for the full list with payload shapes.

## Event Callbacks

| Callback | Event | Description |
|----------|-------|-------------|
| `onInit` | — | Canvas fully initialized. |
| `onDestroy` | — | Canvas being destroyed. |
| `onNodeClick` | `node-click` | Node clicked. |
| `onNodeDragStart` | `node-drag-start` | Node drag started. |
| `onNodeDrag` | `node-drag` | Node being dragged (each frame). |
| `onNodeDragEnd` | `node-drag-end` | Node drag ended. |
| `onNodeResizeStart` | `node-resize-start` | Node resize started. |
| `onNodeResize` | `node-resize` | Node being resized. |
| `onNodeResizeEnd` | `node-resize-end` | Node resize ended. |
| `onEdgeClick` | `edge-click` | Edge clicked. |
| `onConnectStart` | `connect-start` | Connection drag started. |
| `onConnect` | `connect` | Connection successfully created. |
| `onMultiConnect` | `multi-connect` | Multiple connections created in one drag. |
| `onConnectEnd` | `connect-end` | Connection drag ended. |
| `onReconnectStart` | `reconnect-start` | Edge reconnection drag started. |
| `onReconnect` | `reconnect` | Edge successfully reconnected. |
| `onReconnectEnd` | `reconnect-end` | Edge reconnection drag ended. |
| `onViewportChange` | `viewport-change` | Viewport pan/zoom changed. |
| `onViewportMoveStart` | `viewport-move-start` | User gesture started. |
| `onViewportMove` | `viewport-move` | User gesture in progress. |
| `onViewportMoveEnd` | `viewport-move-end` | User gesture ended. |
| `onPaneClick` | `pane-click` | Canvas background clicked. |
| `onNodeContextMenu` | `node-context-menu` | Node right-clicked. |
| `onEdgeContextMenu` | `edge-context-menu` | Edge right-clicked. |
| `onPaneContextMenu` | `pane-context-menu` | Background right-clicked. |
| `onSelectionContextMenu` | `selection-context-menu` | Right-click with multi-selection. |
| `onSelectionChange` | `selection-change` | Selection changed. |
| `onNodesChange` | `nodes-change` | Nodes added or removed. |
| `onEdgesChange` | `edges-change` | Edges added or removed. |
| `onNodesPatch` | `nodes-patch` | Nodes patched. |
| `onEdgesPatch` | `edges-patch` | Edges patched. |
| `onNodeCollapse` | `node-collapse` | Node collapsed. |
| `onNodeExpand` | `node-expand` | Node expanded. |
| `onNodeCondense` | `node-condense` | Node condensed. |
| `onNodeUncondense` | `node-uncondense` | Node uncondensed. |
| `onBeforeDelete` | — | Before user-initiated deletion. Return subset to delete or `false` to cancel. Async. |

## Error Handling

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onError` | `(code, message) => void` | — | Global error/warning handler. Routes internal warnings through this callback. |

## Livewire Bridge

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `wireEvents` | `Record<string, string>` | — | Map AlpineFlow events to Livewire method names. Set automatically by WireFlow's Blade component. |
