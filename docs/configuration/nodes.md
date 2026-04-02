---
title: Node Configuration
description: Node behavior options, data shape, and type registry.
order: 3
---

# Node Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `nodeOrigin` | `[number, number]` | `[0, 0]` | Default anchor point. `[0,0]` = top-left, `[0.5,0.5]` = center. Per-node `nodeOrigin` overrides. |
| `nodeExtent` | `CoordinateExtent` | — | Global position boundaries `[[minX, minY], [maxX, maxY]]`. |
| `snapToGrid` | `false \| [number, number]` | `false` | Snap node positions to grid. Pass `[gridX, gridY]` to enable. |
| `helperLines` | `boolean \| object` | `false` | Show alignment guides during drag. `true` for defaults, or `{ snap: true, threshold: 5 }`. |
| `preventOverlap` | `boolean \| number` | `false` | Prevent dragged nodes from overlapping. Pass a number for custom gap in pixels. |
| `elevateNodesOnSelect` | `boolean` | `true` | Bump z-index of selected nodes above unselected nodes. |
| `selectNodesOnDrag` | `boolean` | `true` | Automatically select nodes when drag starts. |
| `nodeDragThreshold` | `number` | `0` | Minimum pixel distance before a drag starts. |
| `nodesFocusable` | `boolean` | `true` | Allow nodes to receive keyboard focus via Tab. |
| `autoPanOnNodeDrag` | `boolean` | `true` | Auto-pan when dragging nodes near canvas edge. |
| `autoPanOnNodeFocus` | `boolean` | `false` | Auto-pan viewport when a node receives keyboard focus. |

## Node types

Register custom node types to render different templates per node:

```js
flowCanvas({
    nodeTypes: {
        'custom': '#my-node-template',     // CSS selector for <template>
        'dynamic': (node, el) => { ... },  // Render function
    },
})
```

See [Directives > flow-node](../nodes/basics.md) for template details.

## Node data shape

```js
{
    id: 'node-1',                         // Required. Unique string ID.
    position: { x: 100, y: 200 },        // Required. Flow-space coordinates.
    data: { label: 'My Node' },           // Optional. Arbitrary data for templates.
    type: 'default',                      // Optional. Maps to nodeTypes registry.
    class: 'my-class',                    // Optional. CSS class(es) added to the node element.
    style: 'background: red',            // Optional. Inline styles or style object.
    dimensions: { width: 200, height: 80 }, // Optional. Explicit dimensions.
    selected: false,                      // Optional. Selection state.
    draggable: true,                      // Optional. Per-node drag override.
    connectable: true,                    // Optional. Per-node connection override.
    deletable: true,                      // Optional. Per-node delete override.
    hidden: false,                        // Optional. Hide from rendering.
    locked: false,                        // Optional. Fully freeze — no drag, delete, connect, select, resize.
    parentId: 'group-1',                  // Optional. Makes this a child of another node.
    expandParent: false,                  // Optional. Grow parent when child reaches edge.
    zIndex: 0,                            // Optional. Explicit z-index.
    sourcePosition: 'bottom',            // Optional. Default handle position for sources.
    targetPosition: 'top',               // Optional. Default handle position for targets.
    shape: 'diamond',                     // Optional. Node shape variant.
    rotation: 0,                          // Optional. Rotation angle in degrees.
    nodeOrigin: [0, 0],                   // Optional. Per-node anchor point override.
}
```

## See also

- [x-flow-node](../nodes/basics.md)
- [Shapes](../nodes/shapes.md)
- [Groups](../nodes/groups.md)
