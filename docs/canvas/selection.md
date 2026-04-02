---
title: Selection
description: Click, multi-select, selection box, and lasso.
order: 5
---

# Selection

AlpineFlow supports click selection, multi-select, rectangular selection boxes, freeform lasso selection, and programmatic selection control. Selection state drives deletion, clipboard operations, group drag, and custom UI.

Click a node to select it. Shift+click to add to the selection. Shift+drag on the background to draw a selection box:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 200, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 400, y: 0 }, data: { label: 'Node C' } },
        { id: 'd', position: { x: 200, y: 100 }, data: { label: 'Node D' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
        { id: 'e3', source: 'b', target: 'd' },
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

## Click selection

Click a node or edge to select it. The previously selected items are deselected.

**Shift+click** toggles the clicked item in/out of the current selection without clearing it (on touch devices, two-finger tap enters selection mode — see [Touch & Mobile](../interaction/touch.md)). This works for both nodes and edges.

Selected nodes receive the `.flow-node-selected` CSS class. Selected edges receive `.flow-edge-selected`.

## Selection box

Draw a rectangle on the canvas to select multiple nodes at once.

**Default trigger:** Shift+drag on the canvas background (not on a node — on touch devices, two-finger tap enters selection mode — see [Touch & Mobile](../interaction/touch.md)).

A semi-transparent box is drawn from the drag start to the current pointer position. Nodes inside the box are selected in real-time as the box grows or shrinks. On pointer release, the box disappears and the selection is finalized.

### Selection mode

The `selectionMode` config controls containment testing:

| Mode | Behavior |
|---|---|
| `'partial'` (default) | Any overlap between the node and the box selects the node |
| `'full'` | The entire node must be inside the box |

```js
flowCanvas({
    selectionMode: 'full',
})
```

**Runtime toggle:** Hold the Alt key (configurable via `keyboardShortcuts.selectionModeToggle`) during a box drag to temporarily switch to the opposite mode. When `selectionMode` is `'partial'`, holding Alt switches to `'full'` for that drag, and vice versa.

Full mode uses distinct CSS variables for visual feedback:

| Variable | Description |
|---|---|
| `--flow-selection-full-bg` | Fill color in full mode |
| `--flow-selection-full-border-color` | Border color in full mode |
| `--flow-lasso-stroke-full` | Lasso stroke in full mode |

Drag on the background to draw a selection box — nodes inside are selected:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 200, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 400, y: 0 }, data: { label: 'Node C' } },
        { id: 'd', position: { x: 200, y: 100 }, data: { label: 'Node D' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
        { id: 'e3', source: 'b', target: 'd' },
    ],
    selectionOnDrag: true,
    panOnDrag: [2],
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

## Lasso selection

Freeform selection by drawing an arbitrary shape around nodes.

```js
flowCanvas({
    selectionTool: 'lasso',
})
```

| Config | Type | Default | Description |
|---|---|---|---|
| `selectionTool` | `'box' \| 'lasso'` | `'box'` | Selection tool shape |
| `lassoSelectsEdges` | `boolean` | `false` | Whether lasso also captures edges |

When `selectionTool` is `'lasso'`, dragging on the canvas draws a freeform path instead of a rectangle. Nodes whose bounds intersect (or are fully contained by, depending on `selectionMode`) the lasso shape are selected.

### Toggle between box and lasso

Press **L** (configurable via `keyboardShortcuts.selectionToolToggle`) to toggle between box and lasso selection tools at runtime.

Draw a freeform shape around nodes to select them:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 200, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 400, y: 0 }, data: { label: 'Node C' } },
        { id: 'd', position: { x: 200, y: 100 }, data: { label: 'Node D' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
        { id: 'e3', source: 'b', target: 'd' },
    ],
    selectionTool: 'lasso',
    selectionOnDrag: true,
    panOnDrag: [2],
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

## Selection on drag

By default, box/lasso selection requires the Shift modifier. For a whiteboard-style UX where left-click drag selects immediately:

```js
flowCanvas({
    selectionOnDrag: true,
    panOnDrag: [2],       // right-click to pan instead
})
```

With `selectionOnDrag: true`, a plain left-click drag on the canvas starts a selection box (or lasso). Pair with `panOnDrag: [2]` to move panning to right-click.

## Programmatic selection

### Node and edge properties

Each node and edge has a `selected` boolean property:

```js
// Select a node
const node = $flow.getNode('node-1');
node.selected = true;

// Check if an edge is selected
const edge = $flow.getEdge('edge-1');
console.log(edge.selected); // true or false
```

### Selection sets

The canvas maintains reactive `Set` objects tracking selected IDs:

| Property | Type | Description |
|---|---|---|
| `selectedNodes` | `Set<string>` | IDs of selected nodes |
| `selectedEdges` | `Set<string>` | IDs of selected edges |
| `selectedRows` | `Set<string>` | IDs of selected rows |

### `deselectAll()`

Clear all selections at once:

```js
$flow.deselectAll();
```

This sets `selected = false` on every selected node and edge, clears all three Sets, removes `.flow-node-selected` / `.flow-edge-selected` / `.flow-row-selected` CSS classes, and emits a `selection-change` event.

### Selecting via `animate()`

The `animate()` API can set selection state as an instant property:

```js
$flow.animate({
    nodes: {
        'node-1': { selected: true },
        'node-2': { selected: false },
    },
}, { duration: 0 });
```

## Events

### `selection-change`

Emitted whenever the selection changes (click, box select, lasso, programmatic, deselect).

```js
// Listen via Alpine
@selection-change.camel="handleSelection($event.detail)"
```

The event detail contains:

```ts
{
    nodes: string[];  // array of selected node IDs
    edges: string[];  // array of selected edge IDs
    rows: string[];   // array of selected row IDs
}
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| **Click** | Select node/edge (deselects others) |
| **Shift+Click** | Toggle node/edge in multi-selection |
| **Shift+Drag** | Selection box (or lasso) on canvas |
| **Tab** | Cycle keyboard focus through nodes and edges |
| **Enter / Space** | Select the focused node or edge |
| **Shift+Enter / Shift+Space** | Toggle focused item in multi-selection |
| **Delete / Backspace** | Delete selected nodes and edges |
| **Ctrl+A / Cmd+A** | Select all nodes |
| **L** | Toggle between box and lasso selection tool |
| **Alt** (held during drag) | Toggle selection mode (partial / full) |

All shortcut keys are configurable via the `keyboardShortcuts` config option.

## Z-index elevation

By default, selected nodes are elevated above unselected nodes so they render on top during multi-select drag operations. Disable with:

```js
flowCanvas({
    elevateNodesOnSelect: false,
})
```

## Selection box styling

The selection box and lasso are styled via CSS variables:

| Variable | Default (theme) | Description |
|---|---|---|
| `--flow-selection-bg` | `rgba(100,116,139,0.06)` | Box fill color |
| `--flow-selection-border` | `1px solid rgba(100,116,139,0.3)` | Box border |
| `--flow-selection-border-radius` | `2px` | Box corner radius |
| `--flow-lasso-stroke` | `rgba(100,116,139,0.5)` | Lasso outline |
