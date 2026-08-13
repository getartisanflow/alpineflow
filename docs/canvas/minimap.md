---
title: Minimap
description: Overview panel with viewport indicator.
order: 4
---

# Minimap

The minimap renders a scaled-down overview of the entire diagram in a corner of the canvas. A viewport indicator rectangle shows which portion of the diagram is currently visible.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'End' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    background: 'dots',
    minimap: true,
    minimapPannable: true,
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

## Enabling

Enable the minimap by setting the `minimap` config option:

```html
<div x-data="flowCanvas({ minimap: true })">
```

Control placement with `minimapPosition`:

```html
<div x-data="flowCanvas({ minimap: true, minimapPosition: 'bottom-right' })">
```

Supported positions: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'` (default).

### Size

The minimap is 200 by 150 unless it is told otherwise:

```html
<div x-data="flowCanvas({ minimap: true, minimapWidth: 160, minimapHeight: 60 })">
```

This is not only how big the picture is. The scale that fits the graph into it and the rectangle
that marks the viewport are both computed against the box, so a minimap whose ratio does not match
the canvas draws a viewport marker that is not the shape of the viewport.

A canvas that changes shape with the window wants a minimap that follows it. Nothing here watches —
what counts as "too big" is the page's business — so a consumer watching its own container calls:

```js
$flow.resizeMinimap(160, 60);
```

which redraws at the new size. A width or height that is not positive is ignored.

## Interaction

The minimap supports two interaction modes:

- **`minimapPannable`** -- Click or drag on the minimap to pan the main viewport to that location.
- **`minimapZoomable`** -- Scroll over the minimap to zoom the main viewport in or out.

```html
<div x-data="flowCanvas({
    minimap: true,
    minimapPannable: true,
    minimapZoomable: true,
})">
```

Both default to `false`, making the minimap view-only until explicitly enabled.

## Styling

### Node colors

Use `minimapNodeColor` to control how nodes appear in the minimap. Pass a static color string or a function for per-node colors:

```js
// Static color for all nodes
minimapNodeColor: '#6366f1'

// Per-node color based on type
minimapNodeColor: (node) => {
    if (node.type === 'input') return '#22c55e';
    if (node.type === 'output') return '#ef4444';
    return '#6366f1';
}
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'input', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Input' } },
        { id: 'process', position: { x: 250, y: 0 }, data: { label: 'Process' } },
        { id: 'output', type: 'output', position: { x: 500, y: 0 }, data: { label: 'Output' } },
    ],
    edges: [
        { id: 'e1', source: 'input', target: 'process' },
        { id: 'e2', source: 'process', target: 'output' },
    ],
    background: 'dots',
    minimap: true,
    minimapPannable: true,
    minimapNodeColor: function(node) {
        if (node.type === 'input') return '#22c55e';
        if (node.type === 'output') return '#ef4444';
        return '#6366f1';
    },
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

### Viewport mask

The `minimapMaskColor` option sets the color of the area outside the current viewport indicator:

```js
minimapMaskColor: 'rgba(0, 0, 0, 0.15)'
```

### CSS variables

Fine-tune minimap appearance with CSS variables:

| Variable | Description |
|----------|-------------|
| `--flow-minimap-bg` | Minimap background color |
| `--flow-minimap-border` | Border around the minimap panel |
| `--flow-minimap-node-color` | Default node fill color |
| `--flow-minimap-mask-color` | Viewport mask overlay color |
| `--flow-minimap-border-radius` | Corner rounding of the minimap panel |
