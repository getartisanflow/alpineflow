---
title: Edge Types
description: Built-in edge path types and custom edge registration.
order: 1
---

# Edge Types

Edges are the connections between [nodes](../nodes/basics.md). AlpineFlow provides seven built-in edge types, each using a different path algorithm. Set the `type` property on an edge to choose one:

```js
{ id: 'e1', source: 'a', target: 'b', type: 'smoothstep' }
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a1', position: { x: 0, y: 0 }, data: { label: 'Bezier' } },
        { id: 'a2', position: { x: 85, y: 130 }, data: { label: 'Bezier' } },
        { id: 'b1', position: { x: 220, y: 0 }, data: { label: 'Smoothstep' } },
        { id: 'b2', position: { x: 305, y: 130 }, data: { label: 'Smoothstep' } },
        { id: 'c1', position: { x: 440, y: 0 }, data: { label: 'Straight' } },
        { id: 'c2', position: { x: 525, y: 130 }, data: { label: 'Straight' } },
    ],
    edges: [
        { id: 'e1', source: 'a1', target: 'a2', type: 'bezier' },
        { id: 'e2', source: 'b1', target: 'b2', type: 'smoothstep' },
        { id: 'e3', source: 'c1', target: 'c2', type: 'straight' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;">
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

## Built-in types

| Type | Description | When to use |
|------|-------------|-------------|
| `bezier` | Smooth cubic bezier curve (default). | General-purpose connections where aesthetics matter. |
| `smoothstep` | Right-angle segments with rounded corners. | Flowcharts and structured diagrams. |
| `straight` | Direct line from source to target. | Simple, minimal layouts or very short connections. |
| `orthogonal` | Right-angle routing around obstacle nodes using visibility-graph pathfinding. Falls back to `smoothstep` when no obstacles exist. | Dense diagrams where edges must not cross nodes. |
| `avoidant` | Smooth Catmull-Rom splines routed around obstacle nodes. Uses the same pathfinding as `orthogonal` but renders curves instead of right angles. Falls back to `bezier` when no obstacles exist. | Same as orthogonal, but when smoother curves are preferred. |
| `editable` | User-controlled waypoints with multiple interpolation styles. Supports double-click to add/remove control points. | When users need to manually shape edge paths. See [Editable Edges](editable.md). |
| `floating` | Auto-computes endpoints from node borders instead of fixed [handles](../handles/). Uses `pathType` to pick the underlying path generator. | Nodes with dynamic sizes or when handle placement is unknown. |

## Floating edges

Set `type: 'floating'` so endpoints are computed dynamically from node borders instead of fixed handle positions:

```js
{
  id: 'e1',
  source: 'a',
  target: 'b',
  type: 'floating',
  pathType: 'smoothstep',
}
```

The edge finds the intersection of the center-to-center line with each node's rectangular boundary. As nodes move, connection points slide along the border automatically.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `pathType` | `'bezier' \| 'smoothstep' \| 'straight'` | `'bezier'` | Which path generator to use for the floating edge. |

Floating edges work well when nodes have dynamic or unknown sizes, or when you want a cleaner look without explicit handle placement.

Drag the nodes around — the edge endpoints slide along the borders:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 100 }, data: { label: 'Node B' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', type: 'floating' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <span x-text="node.data.label"></span>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Custom edge types

Register custom edge types via the `edgeTypes` config option. Any `type` string that does not match a built-in name is looked up in this registry:

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

The function receives source/target coordinates and positions and must return an object with `path` (an SVG path string) and `labelPosition` (an `{ x, y }` point for label placement).

## Edge data shape

Every edge object accepts these properties:

```js
{
    id: 'edge-1',                         // Required. Unique string ID.
    source: 'node-a',                     // Required. Source node ID.
    target: 'node-b',                     // Required. Target node ID.
    sourceHandle: 'output-1',             // Optional. Source handle ID.
    targetHandle: 'input-1',              // Optional. Target handle ID.
    type: 'bezier',                       // Optional. 'bezier', 'smoothstep', 'step', 'straight',
                                          //   'orthogonal', 'avoidant', 'editable', or custom.
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

## Edge configuration options

These options are set on the `flowCanvas()` config object:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultEdgeOptions` | `Partial<FlowEdge>` | -- | Properties merged into edges created at runtime (drag-connect, click-to-connect, edge-drop). Does not affect initial edges. |
| `defaultInteractionWidth` | `number` | `20` | Invisible hit area width for edge clicks. |
| `edgesReconnectable` | `boolean` | `true` | Allow edge endpoints to be dragged to different handles. |
| `reconnectSnapRadius` | `number` | `10` | Proximity radius for endpoint snap during reconnection. |
| `edgesFocusable` | `boolean` | `true` | Allow edges to receive keyboard focus via Tab. |
| `reconnectOnDelete` | `boolean` | `false` | Auto-bridge predecessors to successors when deleting middle nodes. |

## Programmatic edge management

Add and remove edges via the `$flow` magic. See the [Edges API reference](../api/flow-magic/edges.md) for all available methods.

::demo
```toolbar
<button id="demo-edges-add" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Connect A → C</button>
<button id="demo-edges-remove" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Remove All</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 200, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 400, y: 0 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       document.getElementById('demo-edges-add').addEventListener('click', () => {
           if (!getEdge('e-ac')) addEdges([{ id: 'e-ac', source: 'a', target: 'c' }]);
       });
       document.getElementById('demo-edges-remove').addEventListener('click', () => {
           removeEdges(edges.map(e => e.id));
       });
   ">
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

## See also

- [Markers](markers.md) -- SVG arrowheads for edge endpoints
- [Labels](labels.md) -- text labels along edges
- [Gradients](gradients.md) -- gradient colors along edge strokes
- [Animation](animation.md) -- dash, pulse, and dot animation modes
- [Editable Edges](editable.md) -- user-controlled waypoints
- [Styling](styling.md) -- colors, stroke width, CSS classes
- [Handles](../handles/) -- connection points on nodes
