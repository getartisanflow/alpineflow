---
title: Resizable Nodes
description: Add resize handles to nodes.
order: 5
---

# Resizable Nodes

The `x-flow-resizer` directive adds interactive resize handles to a flow node, allowing users to drag edges and corners to change the node's dimensions.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Resize me' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Fixed' }, resizable: false },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
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
                <div x-flow-resizer></div>
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Usage

Place the directive inside an element with `x-flow-node`:

```html
<template x-for="node in $flow.nodes" :key="node.id">
    <div x-flow-node="node">
        <div x-flow-resizer="{ minWidth: 120, minHeight: 80 }"></div>
        <div x-text="node.data.label"></div>
    </div>
</template>
```

## Constraints

Pass an optional constraints object as the directive expression:

```html
<div x-flow-resizer="{ minWidth: 100, maxWidth: 500, minHeight: 60, maxHeight: 400 }">
```

| Property | Type | Description |
|----------|------|-------------|
| `minWidth` | `number` | Minimum width in pixels |
| `maxWidth` | `number` | Maximum width in pixels |
| `minHeight` | `number` | Minimum height in pixels |
| `maxHeight` | `number` | Maximum height in pixels |

If no expression is provided, the node can be resized without constraints.

Try resizing — the left node is constrained, the right node resizes freely:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'constrained', position: { x: 0, y: 0 }, data: { label: 'Constrained' } },
        { id: 'free', position: { x: 300, y: 0 }, data: { label: 'No constraints' } },
    ],
    edges: [],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <template x-if="node.id === 'constrained'">
                <div x-flow-node="node">
                    <div x-flow-resizer="{ minWidth: 100, minHeight: 50, maxWidth: 250, maxHeight: 150 }"></div>
                    <span x-text="node.data.label"></span>
                </div>
            </template>
        </template>
        <template x-for="node in nodes" :key="'f-' + node.id">
            <template x-if="node.id === 'free'">
                <div x-flow-node="node">
                    <div x-flow-resizer></div>
                    <span x-text="node.data.label"></span>
                </div>
            </template>
        </template>
    </div>
</div>
```
::enddemo

## Modifiers

Control which resize handles are rendered:

| Modifier | Description |
|----------|-------------|
| _(none)_ | All 8 handles (4 corners + 4 edges) |
| `.corners` | 4 corner handles only |
| `.edges` | 4 edge handles only |
| `.bottom` | Bottom edge handle only |
| `.right` | Right edge handle only |
| `.top` | Top edge handle only |
| `.left` | Left edge handle only |

Modifiers can be combined to show specific handles:

```html
<!-- Only the bottom-right corner -->
<div x-flow-resizer.bottom.right>

<!-- All four corners -->
<div x-flow-resizer.corners>

<!-- All four edges -->
<div x-flow-resizer.edges>
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'corners', position: { x: 0, y: 0 }, data: { label: 'Corners only' } },
        { id: 'edges', position: { x: 220, y: 0 }, data: { label: 'Edges only' } },
        { id: 'bottom-right', position: { x: 440, y: 0 }, data: { label: 'Bottom + Right' } },
    ],
    edges: [],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <div x-show="node.id === 'corners'" x-flow-resizer.corners></div>
                <div x-show="node.id === 'edges'" x-flow-resizer.edges></div>
                <div x-show="node.id === 'bottom-right'" x-flow-resizer.bottom.right></div>
                <span x-text="node.data.label"></span>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Behavior

- Respects the per-node `resizable` flag. If `node.resizable` is `false`, the handles will not appear.
- Respects grid snapping when enabled in the canvas configuration. Resized dimensions snap to the grid increment.
- During a resize, the node's `width` and `height` properties are updated in real time.

The first node snaps to a 20px grid when resized. The second has `resizable: false` — no handles appear:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'snap', position: { x: 0, y: 0 }, data: { label: 'Snap 20px' } },
        { id: 'disabled', position: { x: 300, y: 0 }, data: { label: 'Not resizable' }, resizable: false },
    ],
    edges: [],
    snapToGrid: [20, 20],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <div x-flow-resizer></div>
                <span x-text="node.data.label"></span>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Events

The following events are dispatched during a resize operation:

| Event | Payload | Description |
|-------|---------|-------------|
| `node-resize-start` | `{ node, handle, initialWidth, initialHeight }` | Fired when resizing begins |
| `node-resize` | `{ node, handle, width, height }` | Fired continuously on resize |
| `node-resize-end` | `{ node, handle, width, height }` | Fired when resizing completes |

## See also

- [Node Basics](basics.md) -- per-node flags including `resizable`
- [Rotation](rotation.md) -- add rotation handles
