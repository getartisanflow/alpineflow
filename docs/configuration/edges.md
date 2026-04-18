---
title: Edge Configuration
description: Edge behavior options, data shape, and type registry.
order: 4
---

# Edge Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultEdgeType` | `string` | `'bezier'` | Default edge type for all runtime-created connections (drag-connect, click-to-connect, edge-drop). Overridden per-edge by `edge.type`. |
| `defaultEdgeOptions` | `Partial<FlowEdge>` | — | Properties merged into edges created at runtime (drag-connect, click-to-connect, edge-drop). Does not affect initial edges. |
| `defaultInteractionWidth` | `number` | `20` | Invisible hit area width for edge clicks. |
| `edgesReconnectable` | `boolean` | `true` | Allow edge endpoints to be dragged to different handles. |
| `reconnectSnapRadius` | `number` | `10` | Proximity radius for endpoint snap during reconnection. |
| `edgesFocusable` | `boolean` | `true` | Allow edges to receive keyboard focus via Tab. |
| `reconnectOnDelete` | `boolean` | `false` | Auto-bridge predecessors to successors when deleting middle nodes. |

## Custom edge types

```js
flowCanvas({
    edgeTypes: {
        'custom': ({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }) => ({
            path: `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`,
            labelPosition: { x: (sourceX + targetX) / 2, y: (sourceY + targetY) / 2 },
        }),
    },
})
```

## Edge data shape

```js
{
    id: 'edge-1',                         // Required. Unique string ID.
    source: 'node-a',                     // Required. Source node ID.
    target: 'node-b',                     // Required. Target node ID.
    sourceHandle: 'output-1',             // Optional. Source handle ID.
    targetHandle: 'input-1',              // Optional. Target handle ID.
    type: 'bezier',                       // Optional. 'bezier', 'smoothstep', 'step', 'straight', 'orthogonal', 'avoidant', 'editable', or custom.
    label: 'connects to',                 // Optional. Center label text.
    labelStart: 'from',                   // Optional. Label near source.
    labelEnd: 'to',                       // Optional. Label near target.
    color: '#ff0000',                     // Optional. Stroke color string or gradient object.
    strokeWidth: 2,                       // Optional. Stroke width.
    animated: true,                       // Optional. true/'dash', 'pulse', or 'dot'.
    markerStart: 'arrow',                 // Optional. Start marker: 'arrow', 'arrowclosed', or MarkerConfig.
    markerEnd: 'arrowclosed',             // Optional. End marker.
    selected: false,                      // Optional. Selection state.
    hidden: false,                        // Optional. Hide from rendering.
    deletable: true,                      // Optional. Per-edge delete override.
    class: 'my-edge',                     // Optional. CSS class on the SVG path.
    interactionWidth: 20,                 // Optional. Per-edge hit area width.
}
```

## See also

- [Edges](../edges/_index.md)
- [Animation](../edges/animation.md)
