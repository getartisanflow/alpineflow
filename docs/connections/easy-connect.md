---
title: Easy Connect
description: Connect by holding a modifier key and dragging from the node body.
order: 4
---

# Easy Connect

Connect nodes without requiring precise handle targeting. Hold a modifier key and drag from anywhere on a node's body to start a connection.

Hold **Alt/Option** and drag from anywhere on a node to start a connection:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Alt + drag me' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Drop here' } },
    ],
    edges: [],
    easyConnect: true,
    easyConnectKey: 'alt',
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

```html
<div x-flow-canvas="{ easyConnect: true, easyConnectKey: 'alt' }">
```

## How it works

Hold the modifier key and drag from anywhere on a node's body. AlpineFlow finds the nearest source handle on that node and starts a connection from it. The connection then behaves exactly like a standard drag-to-connect -- drop on a valid target handle to create the edge.

## Modifier keys

| Value | Key |
|-------|-----|
| `'alt'` | Alt/Option (default) |
| `'meta'` | Cmd (macOS) / Win (Windows) |
| `'shift'` | Shift |

```html
<!-- Use Shift as the modifier key -->
<div x-flow-canvas="{ easyConnect: true, easyConnectKey: 'shift' }">
```

Easy connect uses the same validation chain as standard drag connections. The only difference is how the connection is initiated -- from the node body instead of a specific handle.
