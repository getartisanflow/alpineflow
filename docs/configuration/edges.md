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
| `edgesSelectable` | `boolean` | `true` | Allow edges to be selected by clicking or a selection box. Overridden per-edge by `edge.selectable`. Programmatic selection is unaffected. |
| `reconnectOnDelete` | `boolean` | `false` | Auto-bridge predecessors to successors when deleting middle nodes. |
| `avoidantSimplifyOnDrag` | `boolean` | `true` | While a node is dragged, avoidant/orthogonal edges touching it skip pathfinding and render as a plain bezier for the duration of the gesture, then re-route on drop. Set `false` to keep full pathfinding during drags. |
| `avoidantCrossingReduction` | `boolean \| { channelGap?: number }` | `false` | Reduce crossings between avoidant edges that share a corridor by fanning them into ordered lanes. `{ channelGap }` tunes the px separation. Off (the default) is byte-identical to the non-reduced route. See [Edge routing](#edge-routing). |
| `avoidantEndpointSpread` | `boolean \| { spacing?: number }` | — (off) | Fan multiple avoidant edges that share one handle apart at the endpoint. `{ spacing }` tunes the gap; never changes row height. Per-node override via `FlowNode.endpointSpread`. Off is byte-identical to spread-off. |
| `schemaHandleGeometry` | `'auto' \| 'dom'` | `'auto'` | How schema-edge endpoints are computed. `'auto'` derives them arithmetically from node position/dimensions/fields (2.3–3.8× faster, zero `getBoundingClientRect`); `'dom'` always measures the handle elements — an escape hatch for layouts whose rows aren't uniform or aren't rendered by `x-flow-schema`. Endpoints are identical either way. |
| `edgeLod` | `false \| { simplifyAt: 'far' \| 'medium' }` | `false` | Level-of-detail: simplify edge rendering when the viewport is zoomed out past the given `zoomLevels` band. |
| `collapseBidirectionalEdges` | `boolean` | `false` | Render a reciprocal pair (A→B + B→A) as a single path with a marker at each end instead of two overlapping edges. |

## Custom edge types

A generator receives the endpoint `params` and, as an optional second argument, the
`edge` itself:

```js
flowCanvas({
    edgeTypes: {
        'custom': ({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }, edge) => ({
            path: `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`,
            labelPosition: { x: (sourceX + targetX) / 2, y: (sourceY + targetY) / 2 },
        }),
    },
})
```

The `edge` argument lets a single generator read per-edge routing data straight off
the edge (e.g. precomputed waypoints stashed on `edge.data`) instead of needing a
separate closure per edge. Because that data lives on the edge, it also survives
`toObject()` / `fromObject()` serialization — a custom-routed edge reloads correctly.
The argument is optional, so existing one-parameter generators keep working unchanged.

## Edge routing

Avoidant and orthogonal edges route around node obstacles. Three opt-in / defaulted knobs tune that routing:

- **Crossing reduction** — `avoidantCrossingReduction` groups avoidant edges that funnel through the same gap and fans them into barycenter-ordered lanes, so they separate instead of drawing coincident. Enable declaratively (`true` or `{ channelGap }`) or toggle at runtime with [`$flow.setCrossingReduction(value)`](../api/flow-magic/state-management.md#setcrossingreduction). Off is byte-identical to the non-reduced route.
- **Endpoint spread** — `avoidantEndpointSpread` fans multiple edges sharing one handle apart at the endpoint (per-node override via `FlowNode.endpointSpread`). It never changes row height; at high fan-in the fan condenses within the row.
- **Drag simplification** — `avoidantSimplifyOnDrag` (default on) renders incident edges as a plain bezier during a node drag and re-routes them on drop, keeping drags smooth on dense graphs.

These are covered in the [v0.2.1-alpha migration guide](../migration/v0.2.1-alpha.md) alongside the other routing behavior shifts.

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
