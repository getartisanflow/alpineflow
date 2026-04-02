---
title: Context Menus
description: Right-click menus for nodes, edges, and the canvas.
order: 1
---

# Context Menus

The `x-flow-context-menu` directive provides right-click context menus for nodes, edges, the background pane, and multi-element selections (long-press on touch devices). Visibility, positioning, and dismissal are managed automatically.

Right-click any node or the background to try it:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Right-click me' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Me too' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
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
    <div x-flow-context-menu.node class="rounded-lg border border-border-subtle bg-elevated shadow-lg py-1 min-w-[140px]">
        <button class="block w-full text-left px-3 py-1.5 text-sm text-text-muted hover:bg-surface cursor-pointer" @click="removeNodes([contextMenu.node.id]); closeContextMenu()">Delete</button>
    </div>
    <div x-flow-context-menu.pane class="rounded-lg border border-border-subtle bg-elevated shadow-lg py-1 min-w-[140px]">
        <button class="block w-full text-left px-3 py-1.5 text-sm text-text-muted hover:bg-surface cursor-pointer" @click="
            const pos = contextMenu.event ? $flow.screenToFlowPosition(contextMenu.event.clientX, contextMenu.event.clientY) : { x: Math.random() * 300, y: Math.random() * 150 };
            addNodes([{ id: 'n-'+Date.now(), position: pos, data: { label: 'New Node' } }]);
            closeContextMenu();
        ">Add Node</button>
    </div>
</div>
```
::enddemo

## Scope Modifier (Required)

One scope modifier is **required** to specify what the context menu targets.

| Modifier | Description |
|----------|-------------|
| `.node` | Context menu for individual nodes |
| `.edge` | Context menu for individual edges |
| `.pane` | Context menu for the background pane |
| `.selection` | Context menu for a multi-element selection |

## Expression: Offset Config

An optional expression provides offset adjustments for the menu position:

```html
<div x-flow-context-menu.node="{ offsetX: 4, offsetY: 4 }">
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `offsetX` | `number` | `0` | Horizontal offset in pixels |
| `offsetY` | `number` | `0` | Vertical offset in pixels |

## Scoped Data: `contextMenu`

Inside the context menu element, a `contextMenu` object provides details about the right-click (or long-press) event:

| Property | Scope | Description |
|----------|-------|-------------|
| `contextMenu.node` | `.node` | The node that was right-clicked |
| `contextMenu.edge` | `.edge` | The edge that was right-clicked |
| `contextMenu.selection` | `.selection` | Array of selected elements |
| `contextMenu.event` | all | The original pointer event |

## Dismissal

The context menu is automatically dismissed when the user:

- Clicks anywhere outside the menu
- Scrolls the viewport
- Presses `Escape`

Call `closeContextMenu()` from within menu items to dismiss after an action.

## Keyboard Navigation

ARIA roles are applied automatically. The menu supports:

- **Arrow Up / Arrow Down** -- move between menu items
- **Tab** -- move to the next item
- **Enter** -- activate the focused item
- **Escape** -- close the menu

## Node Context Menu

Right-click a node to delete or duplicate it:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 40 }, data: { label: 'Right-click me' } },
        { id: 'b', position: { x: 300, y: 40 }, data: { label: 'Or me' } },
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
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
    <div x-flow-context-menu.node class="rounded-lg border border-border-subtle bg-elevated shadow-lg py-1 min-w-[140px]">
        <button class="block w-full text-left px-3 py-1.5 text-sm text-text-muted hover:bg-surface cursor-pointer" @click="removeNodes([contextMenu.node.id]); closeContextMenu()">Delete</button>
        <button class="block w-full text-left px-3 py-1.5 text-sm text-text-muted hover:bg-surface cursor-pointer" @click="addNodes([{ id: 'd-'+Date.now(), position: { x: contextMenu.node.position.x + 30, y: contextMenu.node.position.y + 30 }, data: { label: 'Copy' } }]); closeContextMenu()">Duplicate</button>
    </div>
</div>
```
::enddemo

## Pane Context Menu

Right-click the background to add a new node at the click position:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 100, y: 60 }, data: { label: 'Existing Node' } },
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
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
    <div x-flow-context-menu.pane class="rounded-lg border border-border-subtle bg-elevated shadow-lg py-1 min-w-[140px]">
        <button class="block w-full text-left px-3 py-1.5 text-sm text-text-muted hover:bg-surface cursor-pointer" @click="
            const pos = contextMenu.event ? $flow.screenToFlowPosition(contextMenu.event.clientX, contextMenu.event.clientY) : { x: Math.random() * 300, y: Math.random() * 150 };
            addNodes([{ id: 'n-'+Date.now(), position: pos, data: { label: 'New Node' } }]);
            closeContextMenu();
        ">Add Node</button>
    </div>
</div>
```
::enddemo

## Edge Context Menu

Right-click the edge to delete it:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 350, y: 100 }, data: { label: 'Target' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
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
    <div x-flow-context-menu.edge class="rounded-lg border border-border-subtle bg-elevated shadow-lg py-1 min-w-[140px]">
        <button class="block w-full text-left px-3 py-1.5 text-sm text-text-muted hover:bg-surface cursor-pointer" @click="removeEdges([contextMenu.edge.id]); closeContextMenu()">Delete Edge</button>
    </div>
</div>
```
::enddemo
