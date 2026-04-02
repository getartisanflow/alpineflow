---
title: Controls Panel
description: Built-in zoom, fit-view, and interactivity buttons.
order: 3
---

# Controls Panel

The controls panel provides built-in buttons for common viewport operations like zooming, fitting the view, and toggling interactivity.

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
    controls: true,
    fitViewOnInit: true,
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

Enable the controls panel with the `controls` config option:

```html
<div x-data="flowCanvas({ controls: true })">
```

### Position

Set placement with `controlsPosition`:

```html
<div x-data="flowCanvas({ controls: true, controlsPosition: 'bottom-left' })">
```

Supported positions: `'top-left'`, `'top-right'`, `'bottom-left'` (default), `'bottom-right'`.

### Orientation

Controls stack vertically by default. Switch to horizontal layout:

```html
<div x-data="flowCanvas({ controls: true, controlsOrientation: 'horizontal' })">
```

**Horizontal orientation** with bottom-right placement:

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
    controls: true,
    controlsPosition: 'bottom-right',
    controlsOrientation: 'horizontal',
    fitViewOnInit: true,
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

## Buttons

Toggle individual buttons with these config options:

| Option | Description | Default |
|--------|-------------|---------|
| `controlsShowZoom` | Show zoom in (+) and zoom out (-) buttons | `true` |
| `controlsShowFitView` | Show a button that fits all nodes into the viewport | `true` |
| `controlsShowInteractive` | Show a button that toggles pan, zoom, and drag interactivity | `true` |
| `controlsShowResetPanels` | Show a button that resets panel positions to their defaults | `false` |

```html
<div x-data="flowCanvas({
    controls: true,
    controlsShowZoom: true,
    controlsShowFitView: true,
    controlsShowInteractive: false,
    controlsShowResetPanels: false,
})">
```

## External container

Render the controls panel outside the canvas element by providing a CSS selector with `controlsContainer`:

```html
<div id="sidebar-controls"></div>

<div x-data="flowCanvas({
    controls: true,
    controlsContainer: '#sidebar-controls',
})">
```

This is useful when you want the controls to appear in a sidebar, toolbar, or any other part of the page layout.

> **Styling note:** External controls live outside the `.flow-container` element, so they don't inherit theme CSS variables. Add `.flow-container` to the external container element, or set the `--flow-controls-*` variables on it directly.

::demo
```toolbar
<div id="demo-external-controls" class="flow-container flex items-center gap-2 rounded-lg border border-border-subtle bg-elevated px-4 py-2" style="height: auto; min-height: 0;">
    <span class="font-mono text-[10px] text-text-faint">External controls:</span>
    <div id="demo-controls-target" class="flex gap-1"></div>
</div>
```
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
    controls: true,
    controlsContainer: '#demo-controls-target',
    controlsOrientation: 'horizontal',
    fitViewOnInit: true,
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

## Styling

Customize button appearance with CSS variables:

| Variable | Description |
|----------|-------------|
| `--flow-controls-btn-bg` | Button background color |
| `--flow-controls-btn-border` | Button border |
| `--flow-controls-btn-color` | Button icon/text color |
| `--flow-controls-btn-hover-bg` | Button background on hover |
| `--flow-controls-gap` | Gap between buttons |
| `--flow-controls-btn-width` | Button width |
| `--flow-controls-btn-height` | Button height |
| `--flow-controls-btn-border-radius` | Button corner rounding |
