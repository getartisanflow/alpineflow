---
title: Drag from Sidebar
description: Add nodes by dragging from an external palette.
order: 4
---

# Drag from Sidebar

The `x-flow-draggable` directive creates a draggable element that can be dropped onto the flow canvas to add new nodes. It is typically used in a sidebar or palette outside the canvas.

Drag items from the palette onto the canvas:

::demo
```html
<div x-data style="display: flex; gap: 8px;">
    <div style="display: flex; flex-direction: column; gap: 4px; min-width: 90px;">
        <div x-flow-draggable="'input'" class="rounded border border-border-subtle bg-elevated px-3 py-2 font-mono text-[11px] text-text-muted cursor-grab" draggable="true">Input</div>
        <div x-flow-draggable="'process'" class="rounded border border-border-subtle bg-elevated px-3 py-2 font-mono text-[11px] text-text-muted cursor-grab" draggable="true">Process</div>
        <div x-flow-draggable="'output'" class="rounded border border-border-subtle bg-elevated px-3 py-2 font-mono text-[11px] text-text-muted cursor-grab" draggable="true">Output</div>
    </div>
    <div x-data="flowCanvas({
        nodes: [
            { id: 'start', position: { x: 50, y: 60 }, data: { label: 'Start' } },
        ],
        edges: [],
        background: 'dots',
        fitViewOnInit: true,
        controls: false,
        pannable: false,
        zoomable: false,
        onDrop({ data, position }) {
            return { id: 'drop-' + Date.now(), position, data: { label: data } };
        },
    })" class="flow-container" style="height: 220px; flex: 1;">
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
</div>
```
::enddemo

## x-flow-draggable Directive

### Expression

The expression provides the data to attach to the drag event. This can be a string or an object and will be available in the canvas `onDrop` callback:

```html
<!-- String -->
<div x-flow-draggable="'input-node'">Input Node</div>

<!-- Object -->
<div x-flow-draggable="{ type: 'database', label: 'Users Table' }">Database Node</div>
```

## Sidebar Palette Pattern

```html
<aside class="node-palette">
    <h2>Nodes</h2>
    <div x-flow-draggable="'input'">Input</div>
    <div x-flow-draggable="'transform'">Transform</div>
    <div x-flow-draggable="'output'">Output</div>
</aside>

<div x-data="flowCanvas({
    onDrop({ data, position }) {
        return {
            id: crypto.randomUUID(),
            position,
            data: { label: data, type: data },
        };
    }
})">
    <!-- canvas content -->
</div>
```

## Object Data

When the expression evaluates to an object, the full object is available in `onDrop`:

```html
<div x-flow-draggable="{ type: 'api', method: 'GET', label: 'API Call' }">
    API Call
</div>
```

```js
onDrop({ data, position }) {
    // data = { type: 'api', method: 'GET', label: 'API Call' }
    return {
        id: crypto.randomUUID(),
        position,
        data,
    };
}
```

Drag items with object data — the label and type are passed through:

::demo
```html
<div x-data style="display: flex; gap: 8px;">
    <div style="display: flex; flex-direction: column; gap: 4px; min-width: 90px;">
        <div x-flow-draggable="{ type: 'api', label: 'GET /users' }" class="rounded border border-border-subtle bg-elevated px-3 py-2 font-mono text-[11px] text-text-muted cursor-grab" draggable="true">API Call</div>
        <div x-flow-draggable="{ type: 'db', label: 'Users Table' }" class="rounded border border-border-subtle bg-elevated px-3 py-2 font-mono text-[11px] text-text-muted cursor-grab" draggable="true">Database</div>
    </div>
    <div x-data="flowCanvas({
        nodes: [],
        edges: [],
        background: 'dots',
        fitViewOnInit: false,
        controls: false,
        pannable: false,
        zoomable: false,
        onDrop({ data, position }) {
            return { id: 'drop-' + Date.now(), position, data: { label: data.label } };
        },
    })" class="flow-container" style="height: 220px; flex: 1;">
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
</div>
```
::enddemo

## Behavior

- Sets `draggable="true"` on the element.
- On `dragstart`, serializes the expression value and attaches it to the drag event using the `application/alpineflow` MIME type.
- The flow canvas listens for `drop` events with this MIME type and invokes the `onDrop` callback with the deserialized data and the drop position in canvas coordinates.

## Canvas Configuration: onDrop

The `onDrop` callback must be defined in the `flowCanvas` configuration for dropped items to create nodes:

```js
flowCanvas({
    nodes: [],
    edges: [],
    onDrop({ event, data, position, targetNode }) {
        // `event`      - the native DragEvent
        // `data`       - the deserialized expression value from x-flow-draggable
        // `position`   - { x, y } in canvas coordinates
        // `targetNode` - the node under the cursor, or null
        return { id: 'new', position, data: { label: data } };
    }
})
```
