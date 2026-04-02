---
title: Keyboard Shortcuts
description: Default key bindings and customization.
order: 6
---

# Keyboard Shortcuts

AlpineFlow provides a comprehensive set of keyboard shortcuts for navigating, editing, and managing flow diagrams. All shortcuts work when the canvas or a node has focus. On touch devices, keyboard shortcuts are not available — use `x-flow-action` buttons instead (see [Touch & Mobile](../interaction/touch.md)).

Click a node, then try arrow keys to move it, Delete to remove it, or Shift+click to multi-select:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Select me' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Arrow keys' } },
        { id: 'c', position: { x: 125, y: 100 }, data: { label: 'Delete me' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'c' },
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

## Default shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Delete selected nodes and edges |
| `Shift` + drag | Draw a selection box |
| `Shift` + click | Toggle multi-select (add/remove from selection) |
| `Arrow keys` | Move selected nodes by 5px |
| `Shift` + arrow keys | Move selected nodes by 20px |
| `Ctrl/Cmd` + `C` | Copy selected nodes |
| `Ctrl/Cmd` + `V` | Paste copied nodes |
| `Ctrl/Cmd` + `X` | Cut selected nodes |
| `Ctrl/Cmd` + `Z` | Undo |
| `Ctrl/Cmd` + `Shift` + `Z` | Redo |
| `Escape` | Cancel current action / deselect all |
| `Alt` (hold) | Toggle selection mode during drag |
| `L` | Toggle between box and lasso selection |
| `Tab` | Focus navigation between nodes |
| `Space` (hold) | Pan mode (grab cursor) |

## Customizing

Override default key bindings through the `keyboardShortcuts` config option. Each entry maps a key code string to an action:

```html
<div x-data="flowCanvas({
  keyboardShortcuts: {
    delete: 'Delete',
    undo: 'ctrl+z',
    redo: 'ctrl+shift+z',
    selectAll: 'ctrl+a',
    copy: 'ctrl+c',
    paste: 'ctrl+v',
    cut: 'ctrl+x',
  }
})">
```

Set any key to `null` to disable that particular shortcut:

```js
keyboardShortcuts: {
  delete: null,    // Disable delete key
  cut: null,       // Disable cut
}
```

Same flow, but Delete is disabled and arrow step is 20px instead of 5px:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Select me' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Arrow keys' } },
        { id: 'c', position: { x: 125, y: 100 }, data: { label: 'Can\'t delete' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'c' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    keyboardShortcuts: {
        delete: null,
        moveStep: 20,
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

## Disabling

To disable arrow-key movement for accessibility reasons (e.g., when nodes contain focusable form inputs), set `disableKeyboardA11y: true`:

```html
<div x-data="flowCanvas({
  disableKeyboardA11y: true,
})">
```

This disables arrow-key node movement and Tab-based focus navigation while leaving other shortcuts (delete, copy/paste, undo/redo) intact.

To disable all keyboard shortcuts entirely, set each one to `null` individually in the `keyboardShortcuts` config.
