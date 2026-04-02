---
title: Handle Connectable
description: Control which handles can initiate or receive connections.
order: 3
---

# Handle Connectable

The `x-flow-handle-connectable` directive controls whether a specific handle can initiate connections, receive connections, or both. This operates independently of the node-level `connectable` flag, giving per-handle control.

Must be placed on an element that also has `x-flow-handle`.

Try connecting from each node — the left node's source cannot initiate, and the right node's target cannot receive:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Can\'t start' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Can\'t receive' } },
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
            <template x-if="node.id === 'a'">
                <div x-flow-node="node">
                    <div x-flow-handle:target></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source x-flow-handle-connectable.start="false"></div>
                </div>
            </template>
        </template>
        <template x-for="node in nodes" :key="'b-' + node.id">
            <template x-if="node.id === 'b'">
                <div x-flow-node="node">
                    <div x-flow-handle:target x-flow-handle-connectable.end="false"></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source></div>
                </div>
            </template>
        </template>
    </div>
</div>
```
::enddemo

## Expression

A boolean value. When `false`, the specified direction is disabled. Defaults to `true` when no expression is provided.

## Modifiers

| Modifier | Description                                    |
|----------|------------------------------------------------|
| _(none)_ | Controls both initiating and receiving          |
| `.start` | Controls only initiating connections (drag out) |
| `.end`   | Controls only receiving connections (drop in)   |

## Usage

### Disable starting connections

```html
<div x-flow-handle:source="'output'" x-flow-handle-connectable.start="false"></div>
```

The left node's source handle is disabled — try dragging from it (nothing happens). You can still connect to it from the right node:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'no-start', position: { x: 0, y: 0 }, data: { label: 'No Start' } },
        { id: 'normal', position: { x: 300, y: 0 }, data: { label: 'Normal' } },
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
            <template x-if="node.id === 'no-start'">
                <div x-flow-node="node">
                    <div x-flow-handle:target></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source x-flow-handle-connectable.start="false"></div>
                </div>
            </template>
        </template>
        <template x-for="node in nodes" :key="'n-' + node.id">
            <template x-if="node.id === 'normal'">
                <div x-flow-node="node">
                    <div x-flow-handle:target></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source></div>
                </div>
            </template>
        </template>
    </div>
</div>
```
::enddemo

### Disable receiving connections

```html
<div x-flow-handle:target="'input'" x-flow-handle-connectable.end="false"></div>
```

The right node's target handle is disabled — it shows as invalid when you try to drop a connection on it:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'source', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'no-end', position: { x: 300, y: 0 }, data: { label: 'No Receive' } },
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
            <template x-if="node.id === 'no-end'">
                <div x-flow-node="node">
                    <div x-flow-handle:target x-flow-handle-connectable.end="false"></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source></div>
                </div>
            </template>
        </template>
        <template x-for="node in nodes" :key="'s-' + node.id">
            <template x-if="node.id !== 'no-end'">
                <div x-flow-node="node">
                    <div x-flow-handle:target></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source></div>
                </div>
            </template>
        </template>
    </div>
</div>
```
::enddemo

### Disable both directions

```html
<div x-flow-handle:source="'output'" x-flow-handle-connectable="false"></div>
```

### Reactive connectable

```html
<!-- Conditionally accept connections based on data -->
<div x-flow-handle:target="'input'"
     x-flow-handle-connectable.end="node.data.acceptsInput">
</div>
```

## Behavior details

When `_flowHandleConnectableStart` is `false` on a source handle, dragging from it does nothing. When `_flowHandleConnectableEnd` is `false` on a target handle, it is marked `.flow-handle-invalid` during connection drags and cannot receive connections. Undefined values default to connectable.

## Interaction with node-level connectable

The node-level `connectable` flag (`node.connectable`) is checked first in the validation chain. If a node has `connectable: false`, all its handles are non-connectable regardless of `x-flow-handle-connectable`. The per-handle directive provides finer-grained control when the node itself is connectable.

## Interaction with locked state

When the canvas is locked, all interactions including connections are disabled. The `x-flow-handle-connectable` directive has no effect while the canvas is locked.
