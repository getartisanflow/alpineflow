---
title: Edge Styling
description: Colors, stroke width, CSS classes, and status colors.
order: 7
---

# Edge Styling

Control edge appearance with inline properties or CSS classes.

Custom color and stroke width on each edge:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 300, y: 120 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', color: '#DAA532', strokeWidth: 3 },
        { id: 'e2', source: 'a', target: 'c', color: '#8B5CF6', strokeWidth: 1 },
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

## Style properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string \| { from, to }` | `--flow-edge-stroke` | Stroke color or [gradient](gradients.md). |
| `strokeWidth` | `number` | `1.5` | Visible stroke width in SVG units. |
| `interactionWidth` | `number` | `20` (from `defaultInteractionWidth`) | Invisible hit area width for click/hover detection. |
| `class` | `string` | -- | CSS class(es) added to the edge `<g>` element. |
| `style` | `string \| Record<string, string>` | -- | Inline styles on the edge element. |

## Status classes

AlpineFlow provides six built-in status classes for semantic edge coloring. Apply them via the `class` property:

```js
{ id: 'e1', source: 'a', target: 'b', class: 'flow-edge-success' }
```

| Class | Color | Use case |
|-------|-------|----------|
| `flow-edge-success` | `#10b981` (green) | Successful or valid connections. |
| `flow-edge-warning` | `#f59e0b` (amber) | Connections that need attention. |
| `flow-edge-danger` | `#ef4444` (red) | Error or invalid connections. |
| `flow-edge-info` | `#3b82f6` (blue) | Informational or neutral connections. |
| `flow-edge-primary` | `#8b5cf6` (purple) | Primary or highlighted connections. |
| `flow-edge-highlight` | `#64748b` (slate) | Subtle emphasis without a semantic color. |

All status classes set `stroke-width: 2.5` in addition to their color. These colors are defined in the theme CSS and can be overridden by customizing the theme file.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Success' } },
        { id: 'c', position: { x: 300, y: 60 }, data: { label: 'Warning' } },
        { id: 'd', position: { x: 300, y: 120 }, data: { label: 'Danger' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', class: 'flow-edge-success' },
        { id: 'e2', source: 'a', target: 'c', class: 'flow-edge-warning' },
        { id: 'e3', source: 'a', target: 'd', class: 'flow-edge-danger' },
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

## Interaction width

Each edge has an invisible hit area that makes it easier to click and hover. The `interactionWidth` property controls this area's width in SVG units. The default is `20`, set globally via `defaultInteractionWidth` in the canvas config.

A narrow interaction width requires precise clicks, while a wide one makes edges easy to select — useful for touch devices or dense diagrams.

```js
// Per-edge override
{ id: 'e1', source: 'a', target: 'b', interactionWidth: 5 }

// Global default
flowCanvas({ defaultInteractionWidth: 30 })
```

::demo
```html
<style>
    .show-hit-area .flow-edge-svg path:first-child {
        stroke: rgba(139, 92, 246, 0.15) !important;
    }
</style>
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 350, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 0, y: 100 }, data: { label: 'Node C' } },
        { id: 'd', position: { x: 350, y: 100 }, data: { label: 'Node D' } },
    ],
    edges: [
        { id: 'narrow', source: 'a', target: 'b', interactionWidth: 5, label: 'Narrow (5px)' },
        { id: 'wide', source: 'c', target: 'd', interactionWidth: 50, label: 'Wide (50px)' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container show-hit-area" style="height: 220px;">
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

## Combining properties

Properties can be combined freely:

```js
{
  id: 'e1',
  source: 'a',
  target: 'b',
  color: '#8b5cf6',
  strokeWidth: 3,
  class: 'my-custom-edge',
  animated: 'pulse',
  markerEnd: 'arrowclosed',
}
```

When both `color` and a status class are set, the inline `color` property takes precedence over the CSS class color.

## See also

- [Edge Types](types.md) -- all available edge path types and configuration
- [Gradients](gradients.md) -- gradient colors along edge strokes
- [Markers](markers.md) -- SVG arrowheads for edge endpoints
- [Animation](animation.md) -- dash, pulse, and dot animation modes
- [Labels](labels.md) -- text labels along edges
