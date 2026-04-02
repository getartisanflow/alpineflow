---
title: Click to Connect
description: Create edges by clicking source then target handle.
order: 2
---

# Click to Connect

Create edges by clicking handles instead of dragging -- useful for accessibility and precision.

Click a source handle (bottom), then click a target handle (top) to create an edge:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Click my handle' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Then click mine' } },
    ],
    edges: [],
    connectOnClick: true,
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

## Configuration

Enabled by default via `connectOnClick: true`.

```html
<div x-flow-canvas="{ connectOnClick: true }">
```

## How it works

1. Click a source handle to select it. The handle receives the `.flow-handle-active` CSS class.
2. Valid target handles highlight with `.flow-handle-valid`, invalid targets with `.flow-handle-invalid`.
3. Click a valid target handle to complete the connection.
4. Clicking empty space or pressing **Escape** cancels.

The same validation chain applies as with drag-to-connect: connectable flags, cycle prevention, duplicate checks, handle limits, handle validators, and `isValidConnection`.

## Disabling click-to-connect

Set `connectOnClick: false` to disable this behavior and require drag connections only:

```html
<div x-flow-canvas="{ connectOnClick: false }">
```
