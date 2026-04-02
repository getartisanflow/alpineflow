---
title: Interaction Configuration
description: Selection, touch, keyboard shortcuts, and accessibility.
order: 7
---

# Interaction Configuration

## Selection

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selectionMode` | `'partial' \| 'full'` | `'partial'` | `'partial'` selects on any overlap. `'full'` requires entire node inside selection box. |
| `selectionOnDrag` | `boolean` | `false` | Start selection box on plain left-click drag (no modifier). Pair with `panOnDrag: [2]` for whiteboard UX. |
| `selectionTool` | `'box' \| 'lasso'` | `'box'` | Selection shape: rectangular box or freeform lasso. |
| `lassoSelectsEdges` | `boolean` | `false` | Whether lasso selection also selects edges. |

## Touch

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `longPressAction` | `'context-menu' \| 'select' \| null` | `'context-menu'` | Action triggered by long-press on touch devices. |
| `longPressDuration` | `number` | `500` | Duration in ms before long-press triggers. |
| `touchSelectionMode` | `boolean` | `true` | Enable two-finger-tap to toggle touch selection mode. |

## Keyboard Shortcuts

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `keyboardShortcuts` | `KeyboardShortcuts` | — | Customize or disable shortcuts. Omit a key for default, set to `null` to disable. |
| `disableKeyboardA11y` | `boolean` | `false` | Disable arrow-key movement for selected nodes. |

See [Keyboard Shortcuts](../canvas/keyboard-shortcuts.md) for the full default mapping.

## Accessibility

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `announcements` | `boolean \| object` | `true` | Screen reader announcements. `false` to disable, or `{ formatMessage }` for custom messages. |

## See also

- [Selection](../canvas/selection.md)
- [Keyboard Shortcuts](../canvas/keyboard-shortcuts.md)
