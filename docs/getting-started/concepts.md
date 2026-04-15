---
title: Core Concepts
description: How AlpineFlow directives and data flow work.
order: 3
---

# Core Concepts

AlpineFlow builds on Alpine.js to turn declarative HTML into interactive flow diagrams. Understanding these six concepts will help you work with every part of the library.

## The flow container

Every flow starts with a container element that has two things: the `flow-container` CSS class and an `x-data="flowCanvas({...})"` attribute.

```html
<div x-data="flowCanvas({ nodes: [...], edges: [...] })" class="flow-container" style="height: 500px;">
    <!-- viewport, nodes, etc. -->
</div>
```

Both are required for different reasons:

- **`x-data="flowCanvas({...})"`** registers the Alpine data component that manages all flow state — nodes, edges, viewport position, selection, history, and more. This is where you pass your initial configuration.
- **`class="flow-container"`** applies the structural CSS that sets up positioning, overflow clipping, and the coordinate system the viewport operates within. Without it, nodes won't position correctly and pan/zoom won't work.

The container must have an explicit height (via `style`, a CSS class, or a parent layout) since flow diagrams don't have intrinsic dimensions.

## Directives

AlpineFlow extends Alpine with `x-flow-*` directives that attach flow behavior to HTML elements. The naming convention follows a consistent pattern:

- **`x-flow-{feature}`** — the base directive, e.g. `x-flow-viewport`, `x-flow-node`, `x-flow-handle`
- **Arguments via colon** — pass a role or type after a colon, e.g. `x-flow-handle:source` (a source handle) or `x-flow-handle:target` (a target handle)
- **Modifiers via dot** — append behavior modifiers with dots, e.g. `x-flow-handle:source.right` (a source handle positioned on the right edge) or `x-flow-collapse.group` (collapse with group semantics)

This mirrors Alpine's own syntax (`x-on:click.prevent`, `x-bind:class`), so if you know Alpine, the pattern is familiar.

Some commonly used directives:

| Directive | Purpose |
|-----------|---------|
| `x-flow-viewport` | Wraps the pannable/zoomable layer |
| `x-flow-node="node"` | Makes an element a positioned, draggable node |
| `x-flow-handle:source` | Adds a connection handle for outgoing edges |
| `x-flow-handle:target` | Adds a connection handle for incoming edges |
| `x-flow-drag-handle` | Restricts node dragging to a specific child element |
| `x-flow-action:fitView` | Binds a button click to a flow action |

See [Nodes](../nodes/basics.md) for the full reference.

## The viewport

The `x-flow-viewport` directive creates the pannable and zoomable layer. All nodes must be placed inside it:

```html
<div x-data="flowCanvas({...})" class="flow-container">
    <div x-flow-viewport>
        <!-- nodes go here -->
    </div>
</div>
```

The viewport translates mouse drags into panning and scroll wheel events into zooming. It applies a CSS transform to move and scale all child content together. Elements placed outside the viewport (like toolbars or overlays) stay fixed relative to the container.

Edges are **not** placed inside the viewport manually. AlpineFlow renders an SVG edge layer automatically based on the `edges` array — you never write edge markup.

## Reactive data

The `nodes` and `edges` arrays you pass to `flowCanvas()` become reactive Alpine data. Mutating them updates the UI immediately:

```js
// Adding a node at runtime
$flow.addNodes({ id: 'c', position: { x: 100, y: 200 }, data: { label: 'New' } });

// Removing an edge
edges = edges.filter(e => e.id !== 'e1');

// Updating a node's data
nodes.find(n => n.id === 'a').data.label = 'Updated';
```

This works because Alpine's reactivity system tracks property access and triggers re-renders when values change. There is no separate "setState" or "dispatch" step — direct mutation is the intended pattern.

Key points:
- **Nodes** require `id`, `position: { x, y }`, and `data` (an object for your custom properties)
- **Edges** require `id`, `source` (node ID), and `target` (node ID)
- Edges are rendered automatically from the array — no edge templates or markup needed
- Adding, removing, or modifying items in either array triggers a UI update

For bulk additions or batched state changes, wrap them in [`$flow.batch(fn)`](../api/flow-magic/nodes.md#batch) so AlpineFlow runs a single reconciliation after your callback instead of one per mutation.

## The $flow magic

AlpineFlow registers a `$flow` magic property (available via Alpine's magic system) that gives you programmatic access to the canvas from any expression inside the flow container:

```html
<button @click="$flow.fitView()">Fit View</button>
<button @click="$flow.zoomTo(1.5)">Zoom to 150%</button>
<button @click="$flow.addNodes({ id: 'x', position: { x: 0, y: 0 }, data: { label: 'Added' } })">
    Add Node
</button>
```

Common `$flow` methods include:

| Method | Description |
|--------|-------------|
| `fitView(options?)` | Pan and zoom to fit all (or selected) nodes in view |
| `addNodes(node \| nodes[])` | Add one or more nodes to the canvas |
| `removeNodes(ids[])` | Remove nodes (and their connected edges) |
| `setViewport(viewport, options?)` | Set pan and zoom level |
| `animate(targets, options?)` | Smoothly transition node, edge, or viewport properties |
| `getNode(id)` | Retrieve a node by ID |
| `toObject()` | Export the full flow state as a serializable object |

See [$flow Magic](../api/flow-magic/index.md) for the complete API.

## Scope rules

Alpine evaluates attributes in the scope of the nearest `x-data` ancestor. This creates an important subtlety: **directives placed on the same element as `x-data` evaluate in that element's own scope, not a parent's.**

This means that on the `flowCanvas` element itself, you cannot reference variables from a parent `x-data`:

```html
<!-- This WON'T work — parentVar is not in scope on the flowCanvas element -->
<div x-data="{ parentVar: 'hello' }">
    <div x-data="flowCanvas({...})" :class="parentVar">
        ...
    </div>
</div>
```

If you need parent data accessible inside the flow container (common in WireFlow/Livewire setups), use `Object.assign($data, ...)` to merge it into the flow's scope, or restructure so the parent data lives on the same element:

```html
<!-- Option 1: merge via Object.assign in x-init -->
<div
    x-data="flowCanvas({...})"
    x-init="Object.assign($data, { parentVar: 'hello' })"
    class="flow-container"
>
    ...
</div>
```

This is particularly relevant when using WireFlow, where Livewire's `wire:model` bindings need to coexist with the `flowCanvas` data scope.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 20, y: 30 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 250, y: 30 }, data: { label: 'Target' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 180px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <div x-flow-handle:target.left></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo
