---
title: Handle Validation
description: Connection validators and connection limits.
order: 2
---

# Handle Validation

AlpineFlow provides per-handle validation and connection limits to control which connections are allowed.

## x-flow-handle-validate

Attaches a custom validator function to a handle. The validator is called during connection completion, after built-in checks (cycle prevention, duplicate detection, connectable state), and must return a boolean.

Must be placed on an element that also has `x-flow-handle`.

Try connecting "Source" to "Blocked" — the connection is rejected. "Allowed" accepts it:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'source', position: { x: 0, y: 60 }, data: { label: 'Source' } },
        { id: 'allowed', position: { x: 300, y: 0 }, data: { label: 'Allowed' } },
        { id: 'blocked', position: { x: 300, y: 120 }, data: { label: 'Blocked' } },
    ],
    edges: [],
    isValidConnection(conn) {
        return conn.target !== 'blocked';
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

### Validator expression

A function that receives a `Connection` object and returns `boolean`:

```ts
(connection: Connection) => boolean
```

The `Connection` object has the following properties:

| Property       | Type                | Description                |
|----------------|---------------------|----------------------------|
| `source`       | `string`            | Source node ID             |
| `sourceHandle` | `string | undefined`| Source handle ID           |
| `target`       | `string`            | Target node ID             |
| `targetHandle` | `string | undefined`| Target handle ID           |

### Validator usage

```html
<!-- Inline validator -->
<div x-flow-handle:target="'input'"
     x-flow-handle-validate="(conn) => conn.source !== 'restricted-node'">
</div>
```

Validators on both the source and target handles are checked. If either returns `false`, the connection is rejected.

### Validation chain order

When a connection is attempted, checks run in this order:

1. Node `connectable` flag
2. Built-in checks (cycle prevention, duplicate edges)
3. Handle limits (`x-flow-handle-limit`)
4. Handle validators (`x-flow-handle-validate`)
5. Global `isValidConnection` callback

### Visual feedback

During a drag, the connection line and target handles reflect validation state:

- **Valid handles** receive the `.flow-handle-valid` CSS class (default: green ring).
- **Invalid handles** receive the `.flow-handle-invalid` CSS class (default: red ring).
- **Connection line** turns red (`--flow-connection-line-invalid`) when hovering over an invalid target.

## x-flow-handle-limit

Sets the maximum number of connections a handle can have. When the handle already has that many connections, new connections to or from it are rejected.

Must be placed on an element that also has `x-flow-handle`.

The target node below accepts only 1 connection — try connecting both sources:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source A' } },
        { id: 'b', position: { x: 0, y: 120 }, data: { label: 'Source B' } },
        { id: 'c', position: { x: 350, y: 60 }, data: { label: 'Limit: 1' } },
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
            <template x-if="node.id === 'c'">
                <div x-flow-node="node">
                    <div x-flow-handle:target x-flow-handle-limit="1"></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source></div>
                </div>
            </template>
        </template>
        <template x-for="node in nodes" :key="'s-' + node.id">
            <template x-if="node.id !== 'c'">
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

### Limit expression

A number representing the maximum connection count. Values of `0` or below are ignored (no limit).

### Limit usage

```html
<!-- Target accepts only one connection -->
<div x-flow-handle:target="'input'" x-flow-handle-limit="1"></div>

<!-- Source can have up to 3 outgoing connections -->
<div x-flow-handle:source="'output'" x-flow-handle-limit="3"></div>
```

```html
<!-- Dynamic limit from node data -->
<div x-flow-handle:target="'input'" x-flow-handle-limit="node.data.maxInputs"></div>
```

When a connection is rejected because of a limit, the target handle receives the `.flow-handle-limit-reached` CSS class in addition to `.flow-handle-invalid`, so you can style it distinctly:

```css
.flow-handle-limit-reached {
    background: orange;
}
```
