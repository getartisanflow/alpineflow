---
title: Handle Positions
description: Placing connection handles on nodes.
order: 1
---

# Handle Positions

The `x-flow-handle` directive marks an element as a connection handle -- either a **source** (initiates connections) or a **target** (receives connections). Handles must be placed inside an element with `x-flow-node`.

Default positions — target on top, source on bottom:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
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
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Argument

The argument is **required** and specifies the handle type:

| Argument  | Description                                              |
|-----------|----------------------------------------------------------|
| `:source` | Initiates connections (cursor changes to crosshair)      |
| `:target` | Receives connections                                     |

```html
<div x-flow-node="node">
    <div x-flow-handle:target></div>
    <span x-text="node.data.label"></span>
    <div x-flow-handle:source></div>
</div>
```

## Position modifiers

Control where the handle is placed on the node border:

| Modifier   | Description   | Default for |
|------------|---------------|-------------|
| `.top`     | Top edge      | target      |
| `.right`   | Right edge    | --          |
| `.bottom`  | Bottom edge   | source      |
| `.left`    | Left edge     | --          |

When no position modifier is provided, the default is `bottom` for source handles and `top` for target handles.

Left-to-right flow — source on right, target on left:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Target' } },
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
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

### Corner placement

Position modifiers can be **combined** for corner placement:

| Compound modifier  | Position       |
|--------------------|----------------|
| `.top.left`        | Top-left       |
| `.top.right`       | Top-right      |
| `.bottom.left`     | Bottom-left    |
| `.bottom.right`    | Bottom-right   |

```html
<!-- Target at top-left corner with custom ID -->
<div x-flow-handle:target.top.left="'tl'"></div>
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 150, y: 0 }, data: { label: 'Corner Handles' } },
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
            <div x-flow-node="node">
                <div x-flow-handle:target.top.left="'tl'"></div>
                <div x-flow-handle:target.top.right="'tr'"></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.bottom.left="'bl'"></div>
                <div x-flow-handle:source.bottom.right="'br'"></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Dynamic position via expression

The expression is **optional** and can be either a string (handle ID) or an object with `id` and `position` properties.

### String expression (handle ID)

```html
<div x-flow-handle:source="'output'"></div>
<div x-flow-handle:target="'input'"></div>
```

When omitted, the handle ID defaults to the argument name (`"source"` or `"target"`).

### Object expression (ID and dynamic position)

```html
<div x-flow-handle:source="{ id: 'out', position: dynamicPos }"></div>
```

| Property   | Type             | Description                                |
|------------|------------------|--------------------------------------------|
| `id`       | `string`         | Handle identifier (falls back to type)     |
| `position` | `HandlePosition` | Reactively updates the handle's position   |

This is useful when the handle position needs to change at runtime based on component state.

Click the buttons to move the source handle — the edge re-routes automatically:

::demo
```toolbar
<button id="demo-dynpos-top" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Top</button>
<button id="demo-dynpos-right" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Right</button>
<button id="demo-dynpos-bottom" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Bottom</button>
<button id="demo-dynpos-left" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Left</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Dynamic' }, sourcePosition: 'bottom' },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Target' }, targetPosition: 'left' },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
        document.getElementById('demo-dynpos-top').addEventListener('click', () => { getNode('a').sourcePosition = 'top' });
        document.getElementById('demo-dynpos-right').addEventListener('click', () => { getNode('a').sourcePosition = 'right' });
        document.getElementById('demo-dynpos-bottom').addEventListener('click', () => { getNode('a').sourcePosition = 'bottom' });
        document.getElementById('demo-dynpos-left').addEventListener('click', () => { getNode('a').sourcePosition = 'left' });
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

## Per-node handle positions

Set default handle positions on individual nodes with `sourcePosition` and `targetPosition`. Handles without a position modifier inherit the node's setting:

```js
nodes: [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Left to Right' },
      sourcePosition: 'right', targetPosition: 'left' },
    { id: 'b', position: { x: 0, y: 150 }, data: { label: 'Top to Bottom' },
      sourcePosition: 'bottom', targetPosition: 'top' },
]
```

This is useful when different nodes in the same flow need different orientations — for example, a horizontal pipeline feeding into a vertical decision tree.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 50 }, data: { label: 'L->R Node' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'b', position: { x: 250, y: 50 }, data: { label: 'L->R Node' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'T->B Node' }, sourcePosition: 'bottom', targetPosition: 'top' },
        { id: 'd', position: { x: 500, y: 130 }, data: { label: 'T->B Node' }, sourcePosition: 'bottom', targetPosition: 'top' },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
        { id: 'e3', source: 'c', target: 'd' },
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

## Position resolution order

Handle position is resolved in this priority order:

1. Compound modifier (e.g., `.top.left`)
2. Single modifier (e.g., `.right`)
3. Object expression `position` property
4. `data-flow-handle-position` HTML attribute
5. Parent node's `sourcePosition` / `targetPosition` property (reactive)
6. Default: `bottom` for source, `top` for target

## Multiple handles

A node can have any number of source and target handles. Add multiple `x-flow-handle` directives and position them independently:

```html
<div x-flow-node="node">
    <div x-flow-handle:target.left="'in-1'" style="top: 25%;"></div>
    <div x-flow-handle:target.left="'in-2'" style="top: 75%;"></div>
    <span x-text="node.data.label"></span>
    <div x-flow-handle:source.right="'out-1'" style="top: 25%;"></div>
    <div x-flow-handle:source.right="'out-2'" style="top: 75%;"></div>
</div>
```

When a node has multiple handles of the same type, each handle needs a unique **name** to distinguish it. Pass a string expression to the directive to assign the name:

```html
<!-- Named handles -->
<div x-flow-handle:source.right="'out-1'"></div>
<div x-flow-handle:source.right="'out-2'"></div>

<!-- Unnamed (defaults to 'source' / 'target') -->
<div x-flow-handle:source></div>
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 20 }, data: { label: 'Multi Output' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Target A' } },
        { id: 'c', position: { x: 300, y: 120 }, data: { label: 'Target B' } },
    ],
    edges: [
        { id: 'e1', source: 'a', sourceHandle: 'out-1', target: 'b', targetHandle: 'target' },
        { id: 'e2', source: 'a', sourceHandle: 'out-2', target: 'c', targetHandle: 'target' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <template x-if="node.id === 'a'">
                <div x-flow-node="node" style="min-height: 70px; display: flex; align-items: center; justify-content: center;">
                    <div x-flow-handle:target.left></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source.right="'out-1'" style="top: 25%;"></div>
                    <div x-flow-handle:source.right="'out-2'" style="top: 75%;"></div>
                </div>
            </template>
        </template>
        <template x-for="node in nodes" :key="'t-' + node.id">
            <template x-if="node.id !== 'a'">
                <div x-flow-node="node">
                    <div x-flow-handle:target.left></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source.right></div>
                </div>
            </template>
        </template>
    </div>
</div>
```
::enddemo

### Routing edges to named handles

Reference handle names on edges with `sourceHandle` and `targetHandle` to route connections to specific ports:

```js
edges: [
    { id: 'e1', source: 'nodeA', sourceHandle: 'out-1', target: 'nodeB', targetHandle: 'in-1' },
    { id: 'e2', source: 'nodeA', sourceHandle: 'out-2', target: 'nodeC', targetHandle: 'in-1' },
]
```

When omitted, edges connect to the first handle of the matching type. When specified, the edge path starts or ends at the exact position of the named handle — even if multiple handles share the same side of the node.

This pattern is the foundation for building data-flow editors, pipeline builders, and any diagram where nodes have distinct input/output ports.

### Hidden modifier

The `.hidden` modifier hides the handle visually while keeping it functional:

```html
<div x-flow-handle:source.hidden></div>
```

## CSS classes

| Class                       | Applied when                                   |
|-----------------------------|------------------------------------------------|
| `.flow-handle`              | Always                                         |
| `.flow-handle-source`       | Handle type is source                          |
| `.flow-handle-target`       | Handle type is target                          |
| `.flow-handle-active`       | Handle is being hovered or snapped during drag |
| `.flow-handle-valid`        | Target can accept the pending connection       |
| `.flow-handle-invalid`      | Target cannot accept the pending connection    |
| `.flow-handle-limit-reached`| Connection rejected specifically due to limit  |

During a connection drag, all target handles in the canvas receive either `.flow-handle-valid` or `.flow-handle-invalid` so you can style valid drop targets differently from invalid ones.
