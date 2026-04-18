---
title: Feature Configuration
description: History, loading, drop zone, shapes, child validation, compute, and auto-layout.
order: 8
---

# Feature Configuration

Optional features that extend the core canvas behavior. Enable them via config options.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 125, y: 100 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'c' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    history: true,
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;">
    <div class="canvas-overlay" @mousedown.stop @pointerdown.stop style="position:absolute;top:8px;left:8px;z-index:20;display:flex;gap:4px;">
        <button x-flow-action:undo class="rounded border border-border-subtle bg-elevated px-2 py-1 font-mono text-[10px] text-text-muted cursor-pointer hover:text-text-body disabled:opacity-40 disabled:cursor-default">Undo</button>
        <button x-flow-action:redo class="rounded border border-border-subtle bg-elevated px-2 py-1 font-mono text-[10px] text-text-muted cursor-pointer hover:text-text-body disabled:opacity-40 disabled:cursor-default">Redo</button>
    </div>
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

## History (Undo/Redo)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `history` | `boolean` | `false` | Enable undo/redo history tracking. |
| `historyMaxSize` | `number` | `50` | Max snapshots to retain. |

When enabled, `Ctrl+Z` / `Ctrl+Y` (or `Cmd` on Mac) trigger undo/redo. See [History](../interaction/undo-redo.md).

## Auto-Layout

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoLayout` | `AutoLayoutConfig` | — | Auto-layout on structural changes. See [Layout addons](../addons/dagre.md). |

## Loading

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `loading` | `boolean` | `false` | Show loading overlay until `setLoading(false)` is called. |
| `loadingText` | `string` | `'Loading…'` | Custom text for the loading indicator. |

See [x-flow-loading](../canvas/loading.md).

## Drop Zone

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onDrop` | `(detail) => FlowNode \| null` | — | Handle drops from `x-flow-draggable` elements. Return a `FlowNode` to add it, or falsy to cancel. |
| `onEdgeDrop` | `(detail) => FlowNode \| null` | — | Handle connection drops on empty canvas. Return a `FlowNode` to auto-create and connect it. |
| `edgeDropPreview` | `(detail) => string \| HTMLElement \| null` | — | Customize the ghost node shown during edge-drop drag. |
| `dropMimeTypes` | `string[]` | — | MIME types accepted by the canvas drop zone (e.g. `['text/plain', 'application/json']`). When set, only drags carrying at least one of these types trigger `onDrop`. |

## Custom Shapes

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `shapeTypes` | `Record<string, ShapeDefinition>` | — | Custom shape definitions merged with built-ins. Each entry provides `perimeterPoint` and optional `clipPath`. |

See [Shapes](../nodes/shapes.md).

## Child Validation

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `childValidationRules` | `Record<string, ChildValidation>` | — | Per-type child validation rules. Keys are node type strings. |
| `onChildValidationFail` | `(detail) => void` | — | Called when validation rejects an operation. |

See [Groups](../nodes/groups.md).

## Compute Engine

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `computeMode` | `'auto' \| 'manual'` | `'manual'` | `'manual'` = explicit `$flow.compute()` calls. `'auto'` = re-propagate on changes (debounced). |
