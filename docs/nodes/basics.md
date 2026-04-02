---
title: Node Basics
description: Creating, positioning, and configuring nodes.
order: 1
---

# Node Basics

Nodes are the primary building blocks of an AlpineFlow diagram. The `x-flow-node` directive binds a DOM element as a flow node, handling positioning, dragging, selection, and all visual state.

Drag the nodes to reposition them — edges follow automatically:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 250, y: 100 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'End' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
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

## Usage

Apply `x-flow-node` to any element inside a flow canvas. The expression must evaluate to a [FlowNode](#node-data-shape) object:

```html
<template x-for="node in nodes" :key="node.id">
    <div x-flow-node="node">
        <span x-text="node.data.label"></span>
    </div>
</template>
```

## What it does

- Positions the element absolutely using `node.position`
- Makes the node draggable via pointer events (d3-drag)
- Selects on click (Shift+click for multi-select — on touch devices, two-finger tap enters selection mode — see [Touch & Mobile](../interaction/touch.md))
- Applies CSS classes reactively: `.flow-node`, `.flow-node-selected`, `.flow-node-locked`, custom `node.class`
- Applies inline styles from `node.style`
- Applies dimensions from `node.dimensions`
- Respects per-node flags: `draggable`, `selectable`, `deletable`, `connectable`, `locked`, `hidden`

## Node data shape

Every node is a plain object with the following properties:

```js
{
    id: 'node-1',                             // Required. Unique string ID.
    position: { x: 100, y: 200 },            // Required. Flow-space coordinates.
    data: { label: 'My Node' },              // Optional. Arbitrary data for templates.
    type: 'default',                          // Optional. Maps to nodeTypes registry.
    class: 'my-class',                        // Optional. CSS class(es) added to the node element.
    style: 'background: red',                // Optional. Inline styles or style object.
    dimensions: { width: 200, height: 80 },  // Optional. Explicit dimensions.
    selected: false,                          // Optional. Selection state.
    draggable: true,                          // Optional. Per-node drag override.
    selectable: true,                         // Optional. Per-node selection override.
    connectable: true,                        // Optional. Per-node connection override.
    deletable: true,                          // Optional. Per-node delete override.
    hidden: false,                            // Optional. Hide from rendering.
    locked: false,                            // Optional. Fully freeze all interactions.
    resizable: true,                          // Optional. Per-node resize override (requires x-flow-resizer).
    parentId: 'group-1',                      // Optional. Makes this a child of another node.
    expandParent: false,                      // Optional. Grow parent when child reaches edge.
    zIndex: 0,                                // Optional. Explicit z-index.
    sourcePosition: 'bottom',                // Optional. Default handle position for sources.
    targetPosition: 'top',                   // Optional. Default handle position for targets.
    shape: 'diamond',                         // Optional. Node shape variant.
    rotation: 0,                              // Optional. Rotation angle in degrees.
    nodeOrigin: [0, 0],                       // Optional. Per-node anchor point override.
}
```

Only `id` and `position` are required. Everything else has sensible defaults.

## Per-node flags

Override global behavior on individual nodes by setting these flags:

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `draggable` | `boolean` | `true` | Can be dragged |
| `selectable` | `boolean` | `true` | Can be selected |
| `connectable` | `boolean` | `true` | Handles accept connections |
| `deletable` | `boolean` | `true` | Can be deleted via keyboard (desktop only — provide a delete button for touch users) |
| `locked` | `boolean` | `false` | Fully freeze -- no drag, delete, connect, select, or resize. Shows dashed border. Individual flags override when set explicitly. |
| `hidden` | `boolean` | `false` | Hidden from rendering |
| `resizable` | `boolean` | -- | Per-node resize override (requires `x-flow-resizer`) |

> **Note:** Setting `locked: true` freezes all interactions at once. If you need to lock a node but still allow selection, set `locked: true` and `selectable: true` -- explicit flags take precedence over the lock.

Try interacting with each node — the locked node has a dashed border, the non-draggable node can't be moved:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'normal', position: { x: 0, y: 0 }, data: { label: 'Normal' } },
        { id: 'locked', position: { x: 220, y: 0 }, data: { label: 'Locked' }, locked: true },
        { id: 'nodrag', position: { x: 440, y: 0 }, data: { label: 'No Drag' }, draggable: false },
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

## CSS classes

| Class | Applied when |
|-------|-------------|
| `.flow-node` | Always |
| `.flow-node-selected` | Node is selected |
| `.flow-node-locked` | `node.locked` is true |
| `.flow-node-group` | `node.type` is `'group'` |
| `.flow-node-hidden` | `node.hidden` is true |
| `.flow-node-{shape}` | Node has a shape (e.g., `.flow-node-diamond`) |

## Custom node content

Nodes can contain any HTML. Use the `nodrag` CSS class on interactive elements (buttons, inputs, sliders) to prevent them from triggering a node drag:

```html
<div x-flow-node="node">
    <div x-flow-drag-handle class="header" x-text="node.data.title"></div>
    <p x-text="node.data.description"></p>
    <img :src="node.data.avatar" class="nodrag">
    <div x-flow-handle:target.left></div>
    <div x-flow-handle:source.right></div>
</div>
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Send Email', description: 'Notify the user via SMTP' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Log Result', description: 'Write to audit trail' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <div x-flow-handle:target.left></div>
                <div style="font-weight: 600; font-size: 13px;" x-text="node.data.label"></div>
                <div style="font-size: 11px; opacity: 0.6;" x-text="node.data.description"></div>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Node types

Register custom templates per node type using `nodeTypes` in your canvas configuration. You can reference a `<template>` element by CSS selector or provide a render function.

### Template selector

```html
<!-- Template definition -->
<template id="input-node">
    <div class="input-node">
        <label x-text="node.data.label"></label>
        <input type="text" class="nodrag" :value="node.data.value">
        <div x-flow-handle:source.right></div>
    </div>
</template>

<!-- Config -->
<div x-data="flowCanvas({
    nodes: [
        { id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Name', value: '' } },
    ],
    nodeTypes: {
        'input': '#input-node',
    },
})">
```

### Render function

```js
nodeTypes: {
    'custom': (node, el) => {
        el.textContent = node.data.label;
    },
}
```

Each type gets its own template — nodes with `type: 'action'` use the action template automatically:

::demo
```html
<template id="demo-action-type">
    <div>
        <div x-flow-handle:target></div>
        <div style="font-weight: 600; font-size: 13px;" x-text="node.data.label"></div>
        <div style="font-size: 11px; opacity: 0.6;" x-text="node.data.description"></div>
        <div x-flow-handle:source></div>
    </div>
</template>
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', type: 'action', position: { x: 0, y: 0 }, data: { label: 'Fetch Data', description: 'GET /api/users' } },
        { id: 'b', type: 'action', position: { x: 250, y: 100 }, data: { label: 'Transform', description: 'Map response' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    nodeTypes: {
        'action': '#demo-action-type',
    },
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node"></div>
        </template>
    </div>
</div>
```
::enddemo

## Programmatic node management

Add, remove, and query nodes via the `$flow` magic. See the [Nodes API reference](../api/flow-magic/nodes.md) for all available methods.

::demo
```toolbar
<button id="demo-nodes-add" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Add Node</button>
<button id="demo-nodes-remove" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Remove Last</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
    ],
    edges: [],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let count = 0;
       document.getElementById('demo-nodes-add').addEventListener('click', () => {
           count++;
           addNodes([{ id: 'new-' + count, position: { x: Math.random() * 400, y: Math.random() * 100 }, data: { label: 'New ' + count } }]);
       });
       document.getElementById('demo-nodes-remove').addEventListener('click', () => {
           if (nodes.length > 0) removeNodes([nodes[nodes.length - 1].id]);
       });
   ">
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

## See also

- [Drag Handles](drag-handles.md) -- restrict drag to a specific element
- [Shapes](shapes.md) -- built-in and custom node shapes
- [Groups](groups.md) -- parent-child hierarchies and nesting
- [Resize](resize.md) -- add resize handles to nodes
- [Rotation](rotation.md) -- add rotation handles to nodes
- [Styling](styling.md) -- CSS classes, status colors, and theming
