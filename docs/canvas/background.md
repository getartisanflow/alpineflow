---
title: Background
description: Dot, line, and cross grid patterns.
order: 2
---

# Background

AlpineFlow renders a configurable grid pattern behind the diagram. The background moves and scales with the viewport to provide spatial context while panning and zooming.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 80, y: 60 }, data: { label: 'Node' } },
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
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Patterns

Set the background pattern with the `background` config option:

```html
<div x-data="flowCanvas({ background: 'dots' })">
```

Available patterns:

| Value | Description |
|-------|-------------|
| `'dots'` | Dot grid (default) |
| `'lines'` | Horizontal and vertical lines |
| `'cross'` | Crosshair marks at grid intersections |
| `'none'` | No background pattern |

**Lines**:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 80, y: 60 }, data: { label: 'Node' } },
    ],
    edges: [],
    background: 'lines',
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
            </div>
        </template>
    </div>
</div>
```
::enddemo

**Cross**:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 80, y: 60 }, data: { label: 'Node' } },
    ],
    edges: [],
    background: 'cross',
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
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Customization

### Grid spacing

Control the distance between grid points or lines with `backgroundGap`:

```html
<div x-data="flowCanvas({ background: 'dots', backgroundGap: 20 })">
```

The default gap is `20` pixels.

### Pattern color

Set the pattern color with `patternColor`. Any valid CSS color value works, including `rgba` for transparency:

```html
<div x-data="flowCanvas({
    background: 'lines',
    patternColor: 'rgba(0, 0, 0, 0.08)',
})">
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 80, y: 60 }, data: { label: 'Node' } },
    ],
    edges: [],
    background: 'dots',
    patternColor: 'rgba(218, 165, 50, 0.5)',
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
            </div>
        </template>
    </div>
</div>
```
::enddemo

### CSS variables

Override background styling globally through CSS variables:

| Variable | Description |
|----------|-------------|
| `--flow-bg-color` | Canvas background fill color |
| `--flow-bg-pattern-color` | Pattern element color (dots, lines, crosses) |
| `--flow-bg-pattern-gap` | Grid spacing |

## Multi-layer

For richer grids, pass an array of `BackgroundLayer` objects. Each layer renders independently, allowing you to combine patterns at different scales:

```html
<div x-data="flowCanvas({
    background: [
        { type: 'dots', gap: 20 },
        { type: 'lines', gap: 100, color: 'rgba(0, 0, 0, 0.05)' },
    ],
})">
```

This example draws a fine dot grid with a coarser line grid overlaid on top, creating a subdivided grid effect.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 80, y: 60 }, data: { label: 'Node' } },
    ],
    edges: [],
    background: [
        { type: 'dots', gap: 20 },
        { type: 'lines', gap: 80, color: 'rgba(218, 165, 50, 0.3)' },
    ],
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
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Dark mode

Pattern colors auto-adjust when using the default theme's CSS variables. The theme file sets appropriate values for both light and dark modes, so backgrounds remain visible without manual configuration.

To customize dark mode colors explicitly, override the CSS variables within a dark mode selector in your stylesheet.
