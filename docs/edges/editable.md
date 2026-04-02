---
title: Editable Edges
description: User-controlled waypoints and path interpolation.
order: 6
---

# Editable Edges

Set `type: 'editable'` to allow users to place and drag waypoints along an edge:

```js
{
  id: 'e1',
  source: 'a',
  target: 'b',
  type: 'editable',
  controlPoints: [{ x: 300, y: 150 }],
  pathStyle: 'catmull-rom',
}
```

Double-click the edge to add waypoints. Drag them to reshape. Double-click a waypoint to remove it:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 400, y: 60 }, data: { label: 'End' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', type: 'editable', controlPoints: [{ x: 200, y: 160 }], pathStyle: 'catmull-rom', showControlPoints: true },
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
                <div x-flow-handle:target.left></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Interaction

- **Double-click on the edge path** to add a new control point at the click position.
- **Double-click on an existing control point** to remove it.
- **Double-click on a midpoint indicator** to insert a control point at that segment.
- **Drag a control point** to reposition it.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `controlPoints` | `{ x, y }[]` | `[]` | Array of waypoint positions in flow coordinates. |
| `pathStyle` | `'linear' \| 'step' \| 'smoothstep' \| 'catmull-rom' \| 'bezier'` | `'bezier'` | Interpolation between control points. |
| `showControlPoints` | `boolean` | `false` | Always show control point handles (vs. only when selected). |

## Path styles

- **`linear`** -- Straight line segments between each waypoint.
- **`step`** -- Orthogonal L-bends with sharp corners (border radius 0).
- **`smoothstep`** -- Orthogonal routing with rounded corners between each pair of waypoints.
- **`catmull-rom`** / **`bezier`** -- Smooth Catmull-Rom spline through all waypoints (these two are equivalent).

**Linear** — straight segments between waypoints:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 400, y: 60 }, data: { label: 'End' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', type: 'editable', controlPoints: [{ x: 200, y: 160 }], pathStyle: 'linear', showControlPoints: true },
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
                <div x-flow-handle:target.left></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

**Smoothstep** — orthogonal routing with rounded corners:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 400, y: 60 }, data: { label: 'End' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', type: 'editable', controlPoints: [{ x: 200, y: 160 }], pathStyle: 'smoothstep', showControlPoints: true },
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
                <div x-flow-handle:target.left></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

**Catmull-Rom** — smooth spline through all waypoints:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 400, y: 60 }, data: { label: 'End' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', type: 'editable', controlPoints: [{ x: 200, y: 160 }], pathStyle: 'catmull-rom', showControlPoints: true },
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
                <div x-flow-handle:target.left></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Events

Editable edges emit events when control points are modified:

| Event | Payload | When |
|-------|---------|------|
| `edge-control-point-change` | `{ edge, action, index }` | Control point added, removed, or moved. |
| `edge-control-point-context-menu` | `{ edge, index, event, position }` | Right-click on a control point. |

The `action` field is `'add'`, `'remove'`, or `'move'`. The `index` is the position in the `controlPoints` array.

### Listening for changes

```html
<div x-data="flowCanvas({
    edges: [{
        id: 'e1', source: 'a', target: 'b',
        type: 'editable',
        controlPoints: [],
        pathStyle: 'catmull-rom',
    }],
})"
    @edge-control-point-change="
        console.log($event.detail.action, $event.detail.edge.id, $event.detail.index);
        // $event.detail.edge.controlPoints is already updated reactively
    "
>
```

## Persisting control points

Control points are stored on the edge object and update reactively. To save them to a backend:

```js
// Via config callback
onEdgesPatch: (detail) => {
    // Save to server whenever edges change
    fetch('/api/edges', {
        method: 'POST',
        body: JSON.stringify(detail.patches),
    });
}

// Or listen for the specific event
@edge-control-point-change="
    const edge = $event.detail.edge;
    $wire.saveEdgeControlPoints(edge.id, edge.controlPoints);
"
```

The `controlPoints` array is part of the edge object, so it is included in `$flow.toObject()` serialization and restored by `$flow.fromObject()`.

## Complete example

```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 50, y: 100 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 500, y: 100 }, data: { label: 'End' } },
    ],
    edges: [{
        id: 'e1',
        source: 'a',
        target: 'b',
        type: 'editable',
        controlPoints: [{ x: 275, y: 200 }],
        pathStyle: 'catmull-rom',
        showControlPoints: true,
    }],
})" class="flow-container" style="height: 400px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <div x-flow-handle:target.left></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```

Double-click the edge to add waypoints. Drag waypoints to reshape the path. Double-click a waypoint to remove it.

## See also

- [Edge Types](types.md) -- all available edge path types and the edge data shape
- [Styling](styling.md) -- colors, stroke width, and CSS classes
