---
title: Proximity Connect
description: Auto-create edges when dragging nodes near each other.
order: 5
---

# Proximity Connect

Auto-create edges when dragging nodes close together. When a node is dragged within a configurable distance of another node, an edge is automatically created between them.

Drag a node close to another to auto-create an edge:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Drag me close' } },
        { id: 'b', position: { x: 350, y: 60 }, data: { label: 'To me' } },
    ],
    edges: [],
    proximityConnect: true,
    proximityConnectDistance: 150,
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
<div x-flow-canvas="{
  proximityConnect: true,
  proximityConnectDistance: 150,
  proximityConnectConfirm: false,
  onProximityConnect({ source, target, distance }) {
    // Return false to reject
  },
}">
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `proximityConnect` | `boolean` | `false` | Enable proximity connections. |
| `proximityConnectDistance` | `number` | `150` | Distance threshold in flow pixels. |
| `proximityConnectConfirm` | `boolean` | `false` | Show visual confirmation before creating the edge. |
| `onProximityConnect` | `function` | -- | Callback to validate or reject. Return `false` to prevent the edge. |

## Direction inference

Direction is inferred automatically: the node further left becomes the source. If X positions are similar (within 30px), the higher node becomes the source.

## Validation callback

Use `onProximityConnect` to add custom logic before the edge is created:

```html
<div x-flow-canvas="{
  proximityConnect: true,
  onProximityConnect({ source, target, distance }) {
    const sourceNode = getNode(source);
    const targetNode = getNode(target);
    // Only allow connections between compatible types
    return sourceNode.type !== targetNode.type;
  },
}">
```

The callback receives `source` (node ID), `target` (node ID), and `distance` (pixels). Return `false` to prevent the edge from being created.

Drag "Source" close to either target — "Blocked" will reject the connection:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'source', position: { x: 0, y: 60 }, data: { label: 'Source' } },
        { id: 'allowed', position: { x: 350, y: 0 }, data: { label: 'Allowed' } },
        { id: 'blocked', position: { x: 350, y: 120 }, data: { label: 'Blocked' } },
    ],
    edges: [],
    proximityConnect: true,
    proximityConnectDistance: 150,
    onProximityConnect({ target }) {
        return target !== 'blocked';
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

## Confirmation mode

When `proximityConnectConfirm` is `true`, a visual indicator is shown when nodes are close enough to connect, but the edge is not created until the user releases the drag. This gives users a chance to see the proposed connection before committing.

Drag a node close — notice the preview edge appears before you release:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Drag me close' } },
        { id: 'b', position: { x: 350, y: 60 }, data: { label: 'To me' } },
    ],
    edges: [],
    proximityConnect: true,
    proximityConnectDistance: 150,
    proximityConnectConfirm: true,
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
