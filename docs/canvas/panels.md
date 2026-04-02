---
title: Panels
description: Draggable and resizable overlay panels.
order: 7
---

# Panels

The `x-flow-panel` directive creates a draggable and resizable overlay panel anchored to a corner or edge of the flow container. Panels are commonly used for controls, minimaps, legends, or inspector sidebars.

This directive **must** be a direct child of the flow container element.

Drag the panel to reposition it, or drag its corner to resize:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 125, y: 100 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'c' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;">
    <div x-flow-panel:top-right style="padding: 8px 12px; font-size: 12px;">
        <div style="font-weight: 600; margin-bottom: 4px;">Inspector</div>
        <div style="opacity: 0.6;">Drag to move, corner to resize</div>
    </div>
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

## Position

The directive argument sets the initial anchor position within the flow container.

| Argument | Description |
|----------|-------------|
| `top-left` | Top-left corner |
| `top-right` | Top-right corner **(default)** |
| `bottom-left` | Bottom-left corner |
| `bottom-right` | Bottom-right corner |
| `top` | Centered along the top edge |
| `bottom` | Centered along the bottom edge |
| `left` | Centered along the left edge |
| `right` | Centered along the right edge |

## Modifiers

| Modifier | Description |
|----------|-------------|
| `.locked` | Disable dragging (resizing still allowed) |
| `.static` | Disable both dragging and resizing |
| `.no-resize` | Disable resizing (dragging still allowed) |
| `.constrained` | Clamp panel position to the viewport bounds |
| `.fill-width` | Stretch to fill the container width |
| `.fill-height` | Stretch to fill the container height |
| `.fill` | Stretch to fill both width and height |

## Behavior

- **Draggable** by default -- click and drag the panel to reposition it.
- **Resizable** by default -- a resize handle is rendered in the appropriate corner.
- Emits `panel-drag` and `panel-resize` events on the flow container when the user interacts with the panel.

## Usage

A controls panel anchored to the bottom-left:

```html
<div x-flow-panel:bottom-left.no-resize>
    <button @click="zoomIn()">+</button>
    <button @click="zoomOut()">-</button>
    <button @click="fitView()">Fit</button>
</div>
```

A static legend panel that cannot be moved or resized:

```html
<div x-flow-panel:top-left.static>
    <h4>Legend</h4>
    <ul>
        <li>Blue = Active</li>
        <li>Gray = Inactive</li>
    </ul>
</div>
```

A constrained, full-height inspector sidebar:

```html
<div x-flow-panel:right.fill-height.constrained>
    <template x-if="selectedNode">
        <div>
            <h3 x-text="selectedNode.data.label"></h3>
            <p x-text="selectedNode.data.description"></p>
        </div>
    </template>
</div>
```

The left panel is static (can't move or resize). The right panel is draggable but not resizable:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 100, y: 30 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 30 }, data: { label: 'Node B' } },
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
    <div x-flow-panel:top-left.static style="padding: 8px 12px; font-size: 11px;">
        <div style="font-weight: 600;">Legend</div>
        <div style="opacity: 0.6;">Static — can't move</div>
    </div>
    <div x-flow-panel:bottom-right.no-resize style="padding: 8px 12px; font-size: 11px;">
        <div style="font-weight: 600;">Info</div>
        <div style="opacity: 0.6;">Drag me — no resize</div>
    </div>
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

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `panel-drag` | `{ x, y }` | Fired when the panel is dragged to a new position |
| `panel-resize` | `{ width, height }` | Fired when the panel is resized |

## Styling

Customize panel appearance with CSS variables:

| Variable | Description |
|----------|-------------|
| `--flow-panel-bg` | Panel background |
| `--flow-panel-border` | Panel border |
| `--flow-panel-border-radius` | Panel corner radius |
| `--flow-panel-min-width` | Panel minimum width |
| `--flow-panel-min-height` | Panel minimum height |
| `--flow-panel-resize-bg` | Resize grip background |
| `--flow-panel-resize-border-radius` | Resize grip radius |
| `--flow-panel-resize-hover-bg` | Resize grip hover |
