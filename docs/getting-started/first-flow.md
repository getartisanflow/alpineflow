---
title: First Flow
description: Build your first flow diagram.
order: 2
---

# First Flow

This tutorial walks you through building your first flow diagram, starting with the bare minimum and progressively layering on features.

## Minimal example

After [installing](installation.md) AlpineFlow, this is all you need to render an interactive flow:

```html
<div
    x-data="flowCanvas({
        nodes: [
            { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Start' } },
            { id: 'b', position: { x: 250, y: 100 }, data: { label: 'End' } },
        ],
        edges: [
            { id: 'e1', source: 'a', target: 'b' },
        ],
    })"
    class="flow-container"
    style="height: 400px;"
>
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

This gives you:
- Two draggable nodes connected by an edge
- Pan and zoom (mouse drag + scroll wheel)
- Connection handles for creating new edges (drag from a handle)

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 30, y: 30 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 280, y: 30 }, data: { label: 'Node B' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 180px;">
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

### What's happening

| Element | Purpose |
|---------|---------|
| `flowCanvas({...})` | Alpine data component — manages all state (nodes, edges, viewport) |
| `.flow-container` | CSS class that sets up the canvas dimensions and overflow |
| `x-flow-viewport` | The pannable/zoomable viewport layer |
| `x-flow-node="node"` | Renders a node and makes it draggable |
| `x-flow-handle:target` | Connection handle that accepts incoming edges |
| `x-flow-handle:source` | Connection handle that starts outgoing edges |

Edges are rendered automatically from the `edges` array — you don't write edge markup.

## Adding features

Enable common features by passing config options to `flowCanvas()`:

```html
<div x-data="flowCanvas({
    nodes: [...],
    edges: [...],
    background: 'dots',        // dot grid background
    controls: true,            // zoom/fit-view buttons
    minimap: true,             // overview panel
    snapToGrid: [20, 20],     // snap nodes to 20px grid
    fitViewOnInit: true,       // auto-fit all nodes on load
    history: true,             // enable undo/redo (Ctrl+Z / Ctrl+Y)
})" class="flow-container" style="height: 500px;">
```

Each option is independent — use only what you need. See [Configuration](../configuration/index.md) for the full list.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Input' } },
        { id: 'b', position: { x: 250, y: 100 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'Output' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    background: 'dots',
    controls: true,
    minimap: true,
    fitViewOnInit: true,
})" class="flow-container" style="height: 280px;">
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

## Custom node content

Nodes can contain any HTML. Use Alpine directives for dynamic content:

```html
<div x-flow-node="node" class="my-custom-node">
    <div x-flow-drag-handle x-text="node.data.title"></div>
    <p x-text="node.data.description"></p>
    <div x-flow-handle:target.left></div>
    <div x-flow-handle:source.right></div>
</div>
```

- `x-flow-drag-handle` restricts dragging to the title bar instead of the entire node
- Handle position modifiers (`.left`, `.right`, `.top`, `.bottom`) control placement

See [Nodes](../nodes/basics.md) and [Handles](../handles/_index.md) for full details.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 20, y: 20 }, data: { title: 'Task', description: 'Drag the title bar to move' } },
        { id: 'b', position: { x: 300, y: 20 }, data: { title: 'Result', description: 'Content area is not draggable' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 200px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" style="width: 200px; padding: 0;">
                <div x-flow-handle:target.left></div>
                <div x-flow-drag-handle style="padding: 6px 10px; font-weight: 600; font-size: 12px; cursor: grab; border-bottom: 1px solid var(--flow-node-border-color);">
                    <span x-text="node.data.title"></span>
                </div>
                <div style="padding: 8px 10px; font-size: 11px; opacity: 0.7;">
                    <span x-text="node.data.description"></span>
                </div>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Styling

All visual properties are controlled via CSS variables. Override them on `.flow-container`:

```css
.flow-container {
    --flow-node-bg: #1e293b;
    --flow-node-border: 1px solid #334155;
    --flow-node-color: #e2e8f0;
    --flow-edge-stroke: #475569;
}
```

See [Theming](../theming/_index.md) for the complete variable reference.

## Next steps

- [Core Concepts](concepts.md) — how directives, viewport, and reactive data work
- [Configuration](../configuration/index.md) — all `flowCanvas()` options
- [Directives](../nodes/basics.md) — node, handle, toolbar, and more
- [Edge Types](../edges/types.md) — straight, smoothstep, bezier, and custom edges
- [Connections](../connections/_index.md) — drag-connect, validation, click-to-connect
- [$flow Magic](../api/flow-magic/index.md) — programmatic control via `$flow`
