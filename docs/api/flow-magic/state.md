---
title: Reactive State
description: Reactive properties available on $flow.
order: 2
---

# Reactive State

These properties are reactive -- Alpine automatically re-renders when they change.

| Property | Type | Description |
|---|---|---|
| `nodes` | `FlowNode[]` | Reactive array of all nodes on the canvas. |
| `edges` | `FlowEdge[]` | Reactive array of all edges on the canvas. |
| `viewport` | `Viewport` | Current viewport state `{ x, y, zoom }`. |
| `selectedNodes` | `Set<string>` | Set of currently selected node IDs. |
| `selectedEdges` | `Set<string>` | Set of currently selected edge IDs. |
| `selectedRows` | `Set<string>` | Set of selected row IDs (format: `nodeId.attrId`). |
| `ready` | `boolean` | Whether the canvas has completed initialization and first node measurement. |
| `isLoading` | `boolean` | True when the canvas is initializing OR user has set loading. Computed from `ready` and user loading flag. |
| `isInteractive` | `boolean` | Whether pan/zoom/drag interactivity is enabled. |
| `canUndo` | `boolean` | Whether an undo operation is available. Requires `history: true` in config. |
| `canRedo` | `boolean` | Whether a redo operation is available. Requires `history: true` in config. |
| `colorMode` | `'light' \| 'dark' \| undefined` | The current resolved color mode. Requires `colorMode` in config. |
| `contextMenu` | `object` | Context menu state: `{ show, type, x, y, node, edge, position, nodes }`. |
| `pendingConnection` | `object \| null` | Active connection drag: `{ source, sourceHandle?, position }` or null. |
