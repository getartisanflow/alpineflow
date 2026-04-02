---
title: Multi-Connect
description: Create connections from all selected nodes at once.
order: 3
---

# Multi-Connect

Create edges from multiple selected nodes in a single drag.

Select both left nodes (Shift+click), then drag from either source handle to the target:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 0, y: 120 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 350, y: 60 }, data: { label: 'Target' } },
    ],
    edges: [],
    multiConnect: true,
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

## Configuration

```html
<div x-flow-canvas="{ multiConnect: true }">
```

## How it works

1. Select multiple nodes (Shift+click or drag-select — on touch devices, two-finger tap enters selection mode — see [Touch & Mobile](../interaction/touch.md)).
2. Drag from any selected node's source handle.
3. Connection lines appear from **all** selected nodes' source handles to the cursor.
4. Drop on a valid target to create all valid connections in a single batch.
5. The `multi-connect` event fires with the array of created connections.

Each connection in the batch is validated individually through the standard validation chain. Connections that fail validation are silently skipped -- only valid connections are created.
