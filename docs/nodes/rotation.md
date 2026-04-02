---
title: Rotatable Nodes
description: Add rotation handles to nodes.
order: 6
---

# Rotatable Nodes

The `x-flow-rotate` directive adds a rotation handle to a flow node, allowing users to rotate the node by dragging the handle around the node's center.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'free', position: { x: 0, y: 0 }, data: { label: 'Free rotation' } },
        { id: 'snap', position: { x: 250, y: 0 }, data: { label: 'Snap 15°' }, rotation: 345 },
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
            <div x-flow-node="node">
                <div x-show="node.id === 'free'" x-flow-rotate></div>
                <div x-show="node.id === 'snap'" x-flow-rotate.snap></div>
                <span x-text="node.data.label"></span>
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
        <div x-flow-rotate></div>
        <div x-text="node.data.label"></div>
    </div>
</template>
```

## Snap modifier

Use the `.snap` modifier to constrain rotation to fixed increments. The default snap increment is 15 degrees, or pass a custom value as the expression:

```html
<!-- Free rotation (continuous) -->
<div x-flow-rotate></div>

<!-- Snap to 15-degree increments (default) -->
<div x-flow-rotate.snap></div>

<!-- Snap to 45-degree increments -->
<div x-flow-rotate.snap="45"></div>

<!-- Snap to 90-degree increments -->
<div x-flow-rotate.snap="90"></div>
```

## Behavior

- Updates `node.rotation` in degrees (0--359).
- The rotation is calculated relative to the node's center point.
- The handle is rendered outside the node boundary, offset by `--flow-rotate-handle-offset`.

## CSS variables

Customize the rotation handle appearance:

| Variable | Default | Description |
|----------|---------|-------------|
| `--flow-rotate-handle-bg` | `#fff` | Background color of the rotation handle |
| `--flow-rotate-handle-border` | `#6b7280` | Border color of the rotation handle |
| `--flow-rotate-handle-size` | `20px` | Width and height of the rotation handle |
| `--flow-rotate-handle-offset` | `30px` | Distance from the node edge to the handle |

```css
.flow-canvas {
    --flow-rotate-handle-bg: #e0f2fe;
    --flow-rotate-handle-border: #0284c7;
    --flow-rotate-handle-size: 16px;
    --flow-rotate-handle-offset: 24px;
}
```

## See also

- [Node Basics](basics.md) -- core node directive and rotation property
- [Resize](resize.md) -- add resize handles
- [Styling](styling.md) -- CSS variables and theming
