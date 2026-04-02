---
title: Undo & Redo
description: Track changes and revert with keyboard or buttons.
order: 6
---

# Undo & Redo

AlpineFlow includes a built-in history system that tracks changes to the flow diagram and supports undo/redo via keyboard shortcuts, declarative action buttons, or the programmatic API.

Drag nodes, delete edges, then undo to restore:

::demo
```toolbar
<button id="demo-undo-btn" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Undo</button>
<button id="demo-redo-btn" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Redo</button>
```
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
})" class="flow-container" style="height: 250px;"
   x-init="
       document.getElementById('demo-undo-btn').addEventListener('click', () => $flow.undo());
       document.getElementById('demo-redo-btn').addEventListener('click', () => $flow.redo());
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

## Enabling History

Enable history tracking in your canvas config:

```html
<div x-data="flowCanvas({
  history: true,
  historyMaxSize: 50,
})">
```

| Option | Default | Description |
|--------|---------|-------------|
| `history` | `false` | Enable or disable history tracking |
| `historyMaxSize` | `50` | Maximum number of history entries to retain |

When the history stack exceeds `historyMaxSize`, the oldest entries are discarded.

## Keyboard Shortcuts

With history enabled, the standard keyboard shortcuts are active (desktop only — use `x-flow-action:undo` buttons for touch — see [Touch & Mobile](touch.md)):

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd` + `Z` | Undo last action |
| `Ctrl/Cmd` + `Shift` + `Z` | Redo last undone action |
| `Ctrl` + `Y` | Redo (alternative) |

## Programmatic API

Access history methods and state through the `$flow` magic:

```js
// Undo the last action
$flow.undo()

// Redo the last undone action
$flow.redo()

// Check if undo/redo is available (reactive properties)
$flow.canUndo  // boolean
$flow.canRedo  // boolean
```

Example with reactive button state:

```html
<button @click="$flow.undo()" :disabled="!$flow.canUndo">Undo</button>
<button @click="$flow.redo()" :disabled="!$flow.canRedo">Redo</button>
```

## x-flow-action Buttons

The `x-flow-action` directive provides declarative shorthand that auto-disables the button when the action is unavailable:

```html
<button x-flow-action:undo>Undo</button>
<button x-flow-action:redo>Redo</button>
```

These buttons are automatically disabled when there is nothing to undo or redo, without requiring manual `:disabled` bindings. Appropriate `aria-disabled` attributes are managed for accessibility.

The undo/redo buttons auto-disable based on history state:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Drag me' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Then undo' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    history: true,
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;">
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

### Other Available Actions

The `x-flow-action` directive supports additional actions beyond undo/redo:

| Action | Description |
|--------|-------------|
| `:undo` | Undo the last canvas change |
| `:redo` | Redo the last undone change |
| `:fit-view` | Pan and zoom so all nodes are visible |
| `:zoom-in` | Increase zoom by one step |
| `:zoom-out` | Decrease zoom by one step |
| `:toggle-interactive` | Toggle whether the canvas accepts user interaction |
| `:clear` | Remove all nodes and edges |
| `:reset` | Restore the canvas to its initial state |
| `:export` | Export the canvas as an image |

All action buttons are automatically disabled when their action is unavailable.

## What's Tracked

The history system records the following changes:

- **Node add/remove** -- adding or deleting nodes
- **Edge add/remove** -- adding or deleting edges
- **Node position changes** -- dragging nodes to new positions
- **Selection changes** -- selecting and deselecting nodes/edges
- **Property changes** -- modifying node or edge data, labels, styles, or other properties

Each history entry captures the full state diff, allowing precise restoration on undo/redo.

## Animation Suspension

History tracking is **automatically suspended during animation playback** (e.g., `fitView` transitions, layout animations, timeline playback). This prevents intermediate animation frames from flooding the history stack with entries that don't represent intentional user actions.

Once the animation completes, history tracking resumes and records the final state as a single entry.

## Loading Overlay

Use the `x-flow-loading` directive to show a loading overlay while restoring large saved states. See [Loading State](../canvas/loading.md) for full documentation.

## Debugging with DevTools

The `x-flow-devtools` directive provides a debug overlay with event logging, state inspection, and activity tracking -- useful for understanding history behavior during development. See the [API reference](../api/flow-magic/state-management.md) for details.
