---
title: $flow Magic
description: Programmatic API for controlling the flow canvas.
order: 1
---

# $flow Magic

`$flow` is an Alpine.js magic property available inside any `flowCanvas()` scope. It provides programmatic access to the nearest flow canvas instance, returning the full Alpine data object with all reactive state and methods.

```html
<div x-data="flowCanvas({ nodes: [...], edges: [...] })">
  <button @click="$flow.addNodes({ id: 'new', position: { x: 100, y: 100 }, data: { label: 'New' } })">
    Add Node
  </button>
</div>
```

`$flow` works from any descendant element -- it walks up the DOM to find the nearest `[data-flow-canvas]` container. If used outside a `flowCanvas()` scope, it logs a warning and returns an empty object.

---

## Sections

| Section | Description |
|---------|-------------|
| [State](state.md) | Reactive properties |
| [Nodes](nodes.md) | Node CRUD and queries |
| [Edges](edges.md) | Edge CRUD |
| [Selection](selection.md) | Selection and filtering |
| [Viewport](viewport.md) | Pan, zoom, coordinates |
| [Hierarchy](hierarchy.md) | Parent/child, collapse, condense, transform |
| [Update & Animation](animation.md) | update(), animate(), timeline, particles, follow |
| [Layout](layout.md) | Auto-layout algorithms |
| [State Management](state-management.md) | Serialization, clipboard, history, config |

---

## Quick Reference

All `$flow` methods and properties at a glance:

### Reactive State

| Property | Type | Description |
|----------|------|-------------|
| `nodes` | `FlowNode[]` | All nodes |
| `edges` | `FlowEdge[]` | All edges |
| `viewport` | `Viewport` | Current `{ x, y, zoom }` |
| `selectedNodes` | `Set<string>` | Selected node IDs |
| `selectedEdges` | `Set<string>` | Selected edge IDs |
| `selectedRows` | `Set<string>` | Selected row IDs |
| `ready` | `boolean` | Canvas initialized |
| `isLoading` | `boolean` | Loading state |
| `isInteractive` | `boolean` | Pan/zoom/drag enabled |
| `canUndo` | `boolean` | Undo available |
| `canRedo` | `boolean` | Redo available |
| `colorMode` | `string` | Resolved color mode |
| `contextMenu` | `object` | Context menu state |
| `pendingConnection` | `object?` | Active connection drag |

### Methods

| Method | Signature | Page |
|--------|-----------|------|
| `addNodes` | `(nodes, options?) → void` | [Nodes](nodes.md) |
| `removeNodes` | `(ids) → void` | [Nodes](nodes.md) |
| `getNode` | `(id) → FlowNode?` | [Nodes](nodes.md) |
| `getNodesBounds` | `(ids?) → Rect` | [Nodes](nodes.md) |
| `getOutgoers` | `(nodeId) → FlowNode[]` | [Nodes](nodes.md) |
| `getIncomers` | `(nodeId) → FlowNode[]` | [Nodes](nodes.md) |
| `getConnectedEdges` | `(nodeId) → FlowEdge[]` | [Nodes](nodes.md) |
| `areNodesConnected` | `(a, b, directed?) → boolean` | [Nodes](nodes.md) |
| `getIntersectingNodes` | `(node, partially?) → FlowNode[]` | [Nodes](nodes.md) |
| `isNodeIntersecting` | `(node, target, partially?) → boolean` | [Nodes](nodes.md) |
| `addEdges` | `(edges) → void` | [Edges](edges.md) |
| `removeEdges` | `(ids) → void` | [Edges](edges.md) |
| `getEdge` | `(id) → FlowEdge?` | [Edges](edges.md) |
| `getEdgePathElement` | `(id) → SVGPathElement?` | [Edges](edges.md) |
| `getEdgeElement` | `(id) → SVGElement?` | [Edges](edges.md) |
| `deselectAll` | `() → void` | [Selection](selection.md) |
| `selectRow` | `(rowId) → void` | [Selection](selection.md) |
| `deselectRow` | `(rowId) → void` | [Selection](selection.md) |
| `toggleRowSelect` | `(rowId) → void` | [Selection](selection.md) |
| `setRowFilter` | `(nodeId, filter) → void` | [Selection](selection.md) |
| `clearNodeFilter` | `() → void` | [Selection](selection.md) |
| `setNodeFilter` | `(predicate) → void` | [Selection](selection.md) |
| `setViewport` | `(viewport, options?) → void` | [Viewport](viewport.md) |
| `zoomIn` | `(options?) → void` | [Viewport](viewport.md) |
| `zoomOut` | `(options?) → void` | [Viewport](viewport.md) |
| `setCenter` | `(x, y, zoom?, options?) → void` | [Viewport](viewport.md) |
| `panBy` | `(dx, dy, options?) → void` | [Viewport](viewport.md) |
| `fitView` | `(options?) → void` | [Viewport](viewport.md) |
| `fitBounds` | `(rect, options?) → void` | [Viewport](viewport.md) |
| `getViewportForBounds` | `(bounds, padding?) → Viewport` | [Viewport](viewport.md) |
| `toggleInteractive` | `() → void` | [Viewport](viewport.md) |
| `screenToFlowPosition` | `(x, y) → XYPosition` | [Viewport](viewport.md) |
| `flowToScreenPosition` | `(x, y) → XYPosition` | [Viewport](viewport.md) |
| `getAbsolutePosition` | `(nodeId) → XYPosition` | [Viewport](viewport.md) |
| `layoutChildren` | `(parentId, options?) → void` | [Hierarchy](hierarchy.md) |
| `propagateLayoutUp` | `(parentId, opts?) → void` | [Hierarchy](hierarchy.md) |
| `reorderChild` | `(nodeId, newOrder) → void` | [Hierarchy](hierarchy.md) |
| `reparentNode` | `(nodeId, newParentId) → boolean` | [Hierarchy](hierarchy.md) |
| `collapseNode` | `(id, options?) → void` | [Hierarchy](hierarchy.md) |
| `expandNode` | `(id, options?) → void` | [Hierarchy](hierarchy.md) |
| `toggleNode` | `(id, options?) → void` | [Hierarchy](hierarchy.md) |
| `isCollapsed` | `(id) → boolean` | [Hierarchy](hierarchy.md) |
| `condenseNode` | `(id) → void` | [Hierarchy](hierarchy.md) |
| `uncondenseNode` | `(id) → void` | [Hierarchy](hierarchy.md) |
| `toggleCondense` | `(id) → void` | [Hierarchy](hierarchy.md) |
| `rotateNode` | `(id, angle) → void` | [Hierarchy](hierarchy.md) |
| `registerCompute` | `(nodeType, definition) → void` | [Hierarchy](hierarchy.md) |
| `compute` | `(startNodeId?) → Map` | [Hierarchy](hierarchy.md) |
| `validateParent` | `(nodeId) → { valid, errors }` | [Hierarchy](hierarchy.md) |
| `validateAll` | `() → Map` | [Hierarchy](hierarchy.md) |
| `update` | `(targets, options?) → FlowAnimationHandle` | [Animation](animation.md) |
| `animate` | `(targets, options?) → FlowAnimationHandle` | [Animation](animation.md) |
| `timeline` | `() → FlowTimeline` | [Animation](animation.md) |
| `registerAnimation` | `(name, steps) → void` | [Animation](animation.md) |
| `playAnimation` | `(name) → Promise<void>` | [Animation](animation.md) |
| `follow` | `(target, options?) → FlowAnimationHandle` | [Animation](animation.md) |
| `sendParticle` | `(edgeId, options?) → ParticleHandle?` | [Animation](animation.md) |
| `layout` | `(options?) → void` | [Layout](layout.md) |
| `forceLayout` | `(options?) → void` | [Layout](layout.md) |
| `treeLayout` | `(options?) → void` | [Layout](layout.md) |
| `elkLayout` | `(options?) → Promise<void>` | [Layout](layout.md) |
| `copy` | `() → void` | [State](state-management.md) |
| `paste` | `() → void` | [State](state-management.md) |
| `cut` | `() → Promise<void>` | [State](state-management.md) |
| `undo` | `() → void` | [State](state-management.md) |
| `redo` | `() → void` | [State](state-management.md) |
| `toObject` | `() → { nodes, edges, viewport }` | [State](state-management.md) |
| `fromObject` | `(obj) → void` | [State](state-management.md) |
| `$reset` | `() → void` | [State](state-management.md) |
| `$clear` | `() → void` | [State](state-management.md) |
| `toImage` | `(options?) → Promise<string>` | [State](state-management.md) |
| `setLoading` | `(value) → void` | [State](state-management.md) |
| `patchConfig` | `(changes) → void` | [State](state-management.md) |
| `closeContextMenu` | `() → void` | [State](state-management.md) |
| `resetPanels` | `() → void` | [State](state-management.md) |
