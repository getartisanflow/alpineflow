---
title: Connection Configuration
description: Connection creation, validation, and advanced connect modes.
order: 5
---

# Connection Configuration

Options that control how connections are created, validated, and what advanced connection modes are available.

Drag from a source handle to connect — the snap radius highlights valid targets as you approach:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Target A' } },
        { id: 'c', position: { x: 250, y: 100 }, data: { label: 'Target B' } },
    ],
    edges: [],
    connectionSnapRadius: 40,
    preventCycles: true,
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

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `isValidConnection` | `(connection: Connection) => boolean` | — | Custom validator. Called after built-in checks. Return `false` to reject. |
| `connectOnClick` | `boolean` | `true` | Click source handle, then click target handle to connect. |
| `connectionSnapRadius` | `number` | `20` | Pixel radius for snapping to nearby handles. `0` disables. |
| `connectionMode` | `'strict' \| 'loose'` | `'strict'` | `'strict'` = source→target only. `'loose'` = any handle to any handle. |
| `connectionLineType` | `string` | `'straight'` | Temp drag line path: `'bezier'`, `'smoothstep'`, `'straight'`, `'step'`. |
| `connectionLineStyle` | `object` | — | Style overrides: `{ stroke, strokeWidth, strokeDasharray }`. |
| `connectionLine` | `(props) => SVGElement` | — | Full custom renderer for the temp connection line. |
| `multiConnect` | `boolean` | `false` | Drag from one handle to create connections from ALL selected nodes' source handles. |
| `easyConnect` | `boolean` | `false` | Connect by holding a modifier key and dragging from node body. |
| `easyConnectKey` | `'alt' \| 'meta' \| 'shift'` | `'alt'` | Modifier key for easy connect. |
| `proximityConnect` | `boolean` | `false` | Auto-create edges when dragging nodes near each other. |
| `proximityConnectDistance` | `number` | `150` | Distance threshold for proximity connect. |
| `proximityConnectConfirm` | `boolean` | `false` | Show visual confirmation before proximity edge creation. |
| `onProximityConnect` | `(detail) => boolean \| void` | — | Validate or reject a proximity connection. |
| `preventCycles` | `boolean` | `false` | Reject connections that would create directed cycles. |
| `connectionRules` | `ConnectionRules` | — | Declarative type-based connection filtering. See [Connection rules](#connection-rules) below. |

## Connection rules

`connectionRules` provides declarative type-based connection filtering. It accepts a `ConnectionRules` object with two optional properties:

```ts
interface ConnectionRules {
  /** Map of source type → allowed target types. Unlisted source types are unrestricted. */
  byType?: Record<string, string[]>;
  /** Function-based validator. Return false to reject. */
  validate?: (connection: Connection, sourceNode: FlowNode, targetNode: FlowNode) => boolean;
}
```

```js
flowCanvas({
    connectionRules: {
        byType: {
            trigger: ['action', 'condition'],   // trigger nodes can only connect to action or condition
            condition: ['action'],               // condition nodes can only connect to action nodes
        },
        validate: (conn, source, target) => {
            // Custom logic — e.g., prevent connecting to self
            return source.id !== target.id;
        },
    },
})
```

Rules are checked before `isValidConnection`. If `byType` is set and the source node's type is listed, only the specified target types are allowed. Types not listed in `byType` are unrestricted. `validate` runs after `byType` and receives the full connection, source node, and target node.

## Connection mode

In `strict` mode (default), source handles can only connect to target handles. In `loose` mode, any handle can connect to any handle — source-to-source or target-to-target:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
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

## See also

- [Drag to Connect](../connections/drag-connect.md)
- [Click to Connect](../connections/click-to-connect.md)
- [Multi-Connect](../connections/multi-connect.md)
- [Easy Connect](../connections/easy-connect.md)
- [Proximity Connect](../connections/proximity-connect.md)
