---
title: Toolbars
description: Floating toolbars for nodes and edges.
order: 2
---

# Toolbars

AlpineFlow provides two toolbar directives -- `x-flow-node-toolbar` for nodes and `x-flow-edge-toolbar` for edges. Both counter-scale against the current viewport zoom (applying `1/zoom`) so the toolbar remains readable at any zoom level.

Select a node to see its toolbar, or click the edge to see the edge toolbar:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 80 }, data: { label: 'Select me' } },
        { id: 'b', position: { x: 300, y: 80 }, data: { label: 'Or me' } },
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
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
                <div x-flow-node-toolbar:top x-show="node.selected" class="flex gap-1">
                    <button class="rounded px-2 py-1 text-xs font-mono bg-elevated border border-border-subtle text-text-muted hover:text-text-body cursor-pointer" @click="removeNodes([node.id])">Delete</button>
                </div>
            </div>
        </template>
        <template x-for="edge in edges" :key="edge.id">
            <g x-flow-edge="edge">
                <div x-flow-edge-toolbar x-show="edge.selected" class="flex gap-1">
                    <button class="rounded px-2 py-1 text-xs font-mono bg-elevated border border-border-subtle text-text-muted hover:text-text-body cursor-pointer" @click="removeEdges([edge.id])">Delete Edge</button>
                </div>
            </g>
        </template>
    </div>
</div>
```
::enddemo

## Node Toolbar

The `x-flow-node-toolbar` directive renders a floating toolbar anchored to one side of a node. It **must** be placed inside an element with `x-flow-node`.

### Position (Argument)

The argument controls which side of the node the toolbar appears on:

| Argument | Description |
|----------|-------------|
| `:top` | Above the node **(default)** |
| `:bottom` | Below the node |
| `:left` | To the left of the node |
| `:right` | To the right of the node |

### Alignment (Modifiers)

Alignment modifiers shift the toolbar along the chosen edge:

| Modifier | Description |
|----------|-------------|
| `.start` | Align to the start (left for top/bottom, top for left/right) |
| `.center` | Center along the edge **(default)** |
| `.end` | Align to the end (right for top/bottom, bottom for left/right) |

### Offset

Use the `data-offset` attribute to set a custom gap (in pixels) between the node and the toolbar:

```html
<div x-flow-node-toolbar:top data-offset="12">
    <!-- 12px gap above the node -->
</div>
```

### Node toolbar example

```html
<div x-flow-node="node">
    <span x-text="node.data.label"></span>

    <!-- Toolbar below the node, aligned to the end -->
    <div x-flow-node-toolbar:bottom.end>
        <button @click="deleteNode(node.id)">Delete</button>
        <button @click="duplicateNode(node.id)">Duplicate</button>
    </div>
</div>
```

## Edge Toolbar

The `x-flow-edge-toolbar` directive renders a floating toolbar positioned along an edge's SVG path. It **must** be placed inside an `x-flow-edge` element.

> **Important:** Edges are auto-rendered by the viewport, so there's no place to put a toolbar by default. To use edge toolbars, render edges explicitly with `x-flow-edge` inside an `x-for` loop. The toolbar goes inside the `<g>` element and is automatically relocated to an HTML overlay.

### Explicit edge rendering

Edge toolbars require the explicit edge template pattern:

```html
<div x-flow-viewport>
    <!-- Nodes as usual -->
    <template x-for="node in nodes" :key="node.id">
        <div x-flow-node="node">...</div>
    </template>

    <!-- Explicit edge loop — required for edge toolbars -->
    <template x-for="edge in edges" :key="edge.id">
        <g x-flow-edge="edge">
            <div x-flow-edge-toolbar x-show="edge.selected">
                <button @click="removeEdges([edge.id])">Delete</button>
            </div>
        </g>
    </template>
</div>
```

The `x-flow-edge` directive handles all SVG path rendering — the `<g>` element is just a container. The toolbar `<div>` is moved out of SVG into the viewport as an HTML overlay automatically.

### Path Position (Expression)

The expression accepts a number between `0` and `1` representing the position along the edge path:

| Value | Position |
|-------|----------|
| `0` | Start of the path (source node) |
| `0.5` | Midpoint of the path **(default)** |
| `1` | End of the path (target node) |

### Below Modifier

| Modifier | Description |
|----------|-------------|
| `.below` | Position the toolbar below the path instead of above it |

### Edge toolbar example

Select the edge to see a toolbar at its midpoint:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 350, y: 100 }, data: { label: 'Target' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
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
        <template x-for="edge in edges" :key="edge.id">
            <g x-flow-edge="edge">
                <div x-flow-edge-toolbar x-show="edge.selected" class="flex gap-1">
                    <button class="rounded px-2 py-1 text-xs font-mono bg-elevated border border-border-subtle text-text-muted hover:text-text-body cursor-pointer" @click="removeEdges([edge.id])">Delete Edge</button>
                </div>
            </g>
        </template>
    </div>
</div>
```
::enddemo
