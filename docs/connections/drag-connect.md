---
title: Drag to Connect
description: Create edges by dragging between handles.
order: 1
---

# Drag to Connect

The default connection method. Drag from a source handle to a target handle to create an edge.

Drag from any source handle (bottom) to a target handle (top) to create a connection:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 250, y: 100 }, data: { label: 'Target A' } },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'Target B' } },
    ],
    edges: [],
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

## How it works

1. Pointer down on a source handle starts the connection.
2. A temporary dashed line follows the cursor.
3. Valid target handles highlight as the cursor approaches (within `connectionSnapRadius`).
4. Release on a valid target handle to create the edge.
5. Release on empty space to cancel (or trigger `onEdgeDrop` if configured).

Auto-pan activates when dragging near the canvas edge (controlled by `autoPanOnConnect`, default `true`).

## Connection line

Customize the temporary line shown during connection drag.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `connectionLineType` | `'straight' \| 'bezier' \| 'smoothstep' \| 'step'` | `'straight'` | Path algorithm for the temporary line. |
| `connectionLineStyle` | `{ stroke?, strokeWidth?, strokeDasharray? }` | Themed defaults | Style overrides for the line. |
| `connectionLine` | `(props: ConnectionLineProps) => SVGElement` | -- | Full custom renderer. When set, overrides `connectionLineType`. Receives `fromX`, `fromY`, `toX`, `toY`, `source`, `sourceHandle`. |

**Straight** (default):

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Drag from me' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'To me' } },
    ],
    edges: [],
    connectionLineType: 'straight',
    defaultEdgeOptions: { type: 'straight' },
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

**Bezier**:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Drag from me' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'To me' } },
    ],
    edges: [],
    connectionLineType: 'bezier',
    defaultEdgeOptions: { type: 'bezier' },
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

**Smoothstep**:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Drag from me' } },
        { id: 'b', position: { x: 300, y: 100 }, data: { label: 'To me' } },
    ],
    edges: [],
    connectionLineType: 'smoothstep',
    defaultEdgeOptions: { type: 'smoothstep' },
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

**Step**:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Drag from me' } },
        { id: 'b', position: { x: 300, y: 100 }, data: { label: 'To me' } },
    ],
    edges: [],
    connectionLineType: 'step',
    defaultEdgeOptions: { type: 'step' },
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

## Edge reconnection

Drag existing edge endpoints to reconnect them to different handles.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `edgesReconnectable` | `boolean` | `true` | Global toggle for edge reconnection. |
| `reconnectSnapRadius` | `number` | `10` | Proximity radius in flow pixels for detecting endpoint hover. |

Try dragging either end of the edge to reconnect it to a different node:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    edgesReconnectable: true,
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

### Per-edge control

Each edge has a `reconnectable` property:

| Value | Behavior |
|-------|----------|
| `true` | Both endpoints can be dragged (default). |
| `false` | Neither endpoint can be dragged. |
| `'source'` | Only the source endpoint can be dragged. |
| `'target'` | Only the target endpoint can be dragged. |

### Reconnection events

| Event | Payload | When |
|-------|---------|------|
| `reconnect-start` | `{ edge, handleType }` | Drag begins on an edge endpoint. |
| `reconnect` | `{ oldEdge, newConnection }` | Edge successfully reconnected. |
| `reconnect-end` | `{ edge, successful }` | Drag ends (whether successful or cancelled). |

### Connection mode

The `connectionMode` config controls handle matching during both new connections and reconnection:

| Value | Behavior |
|-------|----------|
| `'strict'` | Source handles only snap to target handles (default). |
| `'loose'` | Source handles can snap to any handle type. |

In `loose` mode, you can connect source-to-source or target-to-target:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Node B' } },
    ],
    edges: [],
    connectionMode: 'loose',
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

## isValidConnection callback

The `isValidConnection` callback provides a final custom check after all built-in validation has passed:

```html
<div x-flow-canvas="{
  isValidConnection(connection) {
    // connection has: source, sourceHandle, target, targetHandle
    return connection.source !== 'locked-node';
  },
}">
```

This runs as the last step in the validation chain, after connectable flags, cycle prevention, duplicate checks, handle limits, and handle validators.

Try connecting to the "Blocked" node — the connection will be rejected:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'source', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'allowed', position: { x: 250, y: 0 }, data: { label: 'Allowed' } },
        { id: 'blocked', position: { x: 500, y: 0 }, data: { label: 'Blocked' } },
    ],
    edges: [],
    isValidConnection(connection) {
        return connection.target !== 'blocked';
    },
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

## Edge drop

Create a new node when a connection is dropped on empty canvas space.

| Property | Type | Description |
|----------|------|-------------|
| `onEdgeDrop` | `(detail) => FlowNode \| null` | Return a node object to auto-create it and connect it to the source. Return `null` to cancel. |
| `edgeDropPreview` | `(detail) => string \| HTMLElement \| null` | Customize the ghost preview shown during drag. String for label text, HTMLElement for custom content, null to hide. |

The auto-created edge uses `defaultEdgeOptions` and passes through `isValidConnection`.

Drag from a handle and release on empty space to auto-create a node:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'start', position: { x: 100, y: 60 }, data: { label: 'Start' } },
    ],
    edges: [],
    onEdgeDrop({ source, sourceHandle, position }) {
        return {
            id: 'new-' + Date.now(),
            position,
            data: { label: 'New Node' },
        };
    },
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
