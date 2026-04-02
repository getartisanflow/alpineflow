---
title: Touch & Mobile
description: Touch device support, gestures, and mobile optimization.
order: 7
---

# Touch & Mobile

AlpineFlow works on touch devices out of the box. Panning, zooming (pinch), node dragging, and handle connections all use pointer events that support both mouse and touch input.

Drag nodes, pinch to zoom, and connect handles — all touch-native:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Drag me' } },
        { id: 'b', position: { x: 200, y: 0 }, data: { label: 'Connect me' } },
        { id: 'c', position: { x: 100, y: 100 }, data: { label: 'Touch me' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: true,
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

## What works on touch

| Action | Touch gesture |
|--------|--------------|
| Pan viewport | One-finger drag on background |
| Zoom | Pinch with two fingers |
| Drag node | One-finger drag on node |
| Connect handles | Drag from handle dot to another |
| Select node | Tap a node |
| Context menu | Long-press (500ms) |
| Selection mode | Two-finger tap (toggle) |

## What requires a keyboard

These features are desktop-only since they rely on keyboard input:

- **Shift+click** multi-select — use touch selection mode instead (see below)
- **Delete / Backspace** to remove nodes — provide a button or context menu action
- **Arrow keys** to nudge nodes
- **Ctrl+Z / Ctrl+Y** undo/redo — provide `x-flow-action:undo` / `x-flow-action:redo` buttons
- **Ctrl+C / Ctrl+V** copy/paste
- **Drag from sidebar** — HTML5 drag-and-drop is not supported on mobile browsers

## Touch selection mode

On desktop, Shift+drag draws a selection box. On touch devices, **two-finger tap** toggles touch selection mode. While active, one-finger drag on the background draws a selection box instead of panning.

A "Selection Mode" indicator appears at the top of the canvas. Tap with two fingers again to exit.

```js
flowCanvas({
    touchSelectionMode: true, // default: true
})
```

Set `touchSelectionMode: false` to disable this feature.

## Long press

Long-press (hold for 500ms) triggers context menus on touch devices — the same menus that right-click triggers on desktop.

```js
flowCanvas({
    longPressAction: 'context-menu', // default
    longPressDuration: 500,          // ms before trigger
})
```

| Value | Behavior |
|-------|----------|
| `'context-menu'` | Long-press fires the context menu (default) |
| `'select'` | Long-press toggles multi-select on the pressed node |
| `null` | Disable long-press entirely |

## Handle hit areas

On touch screens (`@media (pointer: coarse)`), handle hit areas are automatically expanded to 44x44px — Apple's minimum recommended touch target size. The visual handle dot stays small; only the invisible tap target grows.

This is handled entirely in CSS and requires no configuration.

## Configuration tips

For a touch-optimized canvas:

```js
flowCanvas({
    // Controls give touch users zoom/fit without pinch
    controls: true,

    // History with button UI (no keyboard shortcuts)
    history: true,

    // Context menus via long-press
    longPressAction: 'context-menu',

    // Larger snap radius for fat-finger connections
    connectionSnapRadius: 30,

    // Selection mode via two-finger tap
    touchSelectionMode: true,
})
```

Pair with `x-flow-action` buttons for undo/redo, zoom, and fit view — these replace the keyboard shortcuts that aren't available on touch:

```html
<div class="canvas-overlay" @mousedown.stop @pointerdown.stop>
    <button x-flow-action:undo>Undo</button>
    <button x-flow-action:redo>Redo</button>
    <button x-flow-action:fit-view>Fit</button>
</div>
```

## CSS variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--flow-touch-selection-bg` | `rgba(59, 130, 246, 0.9)` | Selection mode indicator background |
| `--flow-touch-selection-color` | `#fff` | Selection mode indicator text color |

## See also

- [Controls Panel](../canvas/controls.md) — built-in zoom/fit buttons
- [Context Menus](context-menus.md) — right-click and long-press menus
- [Selection](../canvas/selection.md) — selection box and lasso
- [Keyboard Shortcuts](../canvas/keyboard-shortcuts.md) — desktop keyboard bindings
