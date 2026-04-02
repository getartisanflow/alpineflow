---
title: Configuration
description: All flowCanvas() configuration options.
order: 1
---

# Configuration

All options are passed to `flowCanvas()`. Every option has a sensible default — most flows only need `nodes` and `edges`.

```html
<div x-data="flowCanvas({
    nodes: [...],
    edges: [...],
    background: 'dots',
    controls: true,
})">
```

## Sections

| Section | Description |
|---------|-------------|
| [Canvas](canvas.md) | Background, zoom limits, color mode, debug |
| [Nodes](nodes.md) | Node options, data shape, type registry |
| [Edges](edges.md) | Edge options, data shape, type registry |
| [Connections](connections.md) | Drag-connect, click-to-connect, validation, multi/easy/proximity connect |
| [Viewport](viewport.md) | Pan, zoom, culling, auto-pan |
| [Interaction](interaction.md) | Selection, touch, keyboard shortcuts, accessibility |
| [Features](features.md) | History, loading, drop zone, shapes, child validation, compute, auto-layout |
| [Events](events.md) | Event callbacks, error handling, Livewire bridge |

## Data

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `nodes` | `FlowNode[]` | `[]` | Initial nodes. See [Node data shape](nodes.md#node-data-shape). |
| `edges` | `FlowEdge[]` | `[]` | Initial edges. See [Edge data shape](edges.md#edge-data-shape). |
| `viewport` | `Partial<Viewport>` | `{ x: 0, y: 0, zoom: 1 }` | Initial viewport position and zoom. |
