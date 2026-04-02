---
title: Node Styling
description: CSS classes, status colors, and custom styling.
order: 7
---

# Node Styling

AlpineFlow provides a comprehensive set of CSS classes and variables for styling nodes. You can apply per-node classes and inline styles, use built-in status classes for visual states, and customize the appearance through CSS variables.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'default', position: { x: 0, y: 0 }, data: { label: 'Default' } },
        { id: 'success', position: { x: 180, y: 0 }, data: { label: 'Success' }, class: 'flow-node-success' },
        { id: 'warning', position: { x: 360, y: 0 }, data: { label: 'Warning' }, class: 'flow-node-warning' },
        { id: 'danger', position: { x: 0, y: 80 }, data: { label: 'Danger' }, class: 'flow-node-danger' },
        { id: 'info', position: { x: 180, y: 80 }, data: { label: 'Info' }, class: 'flow-node-info' },
        { id: 'primary', position: { x: 360, y: 80 }, data: { label: 'Primary' }, class: 'flow-node-primary' },
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
            <div x-flow-node="node">
                <span x-text="node.data.label"></span>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Node CSS classes

These classes are applied automatically based on node state:

| Class | Applied when |
|-------|-------------|
| `.flow-node` | Always present on every node |
| `.flow-node-selected` | Node is currently selected |
| `.flow-node-locked` | `node.locked` is `true` (dashed border) |
| `.flow-node-group` | `node.type` is `'group'` |
| `.flow-node-hidden` | `node.hidden` is `true` (display: none) |
| `.flow-node-has-handle` | Node contains an `x-flow-drag-handle` |
| `.flow-node-condensed` | Node is in condensed view |
| `.flow-node-invalid` | Node fails child validation |
| `.flow-node-drop-target` | Node is a valid drop target during drag |
| `.flow-node-annotation` | Whiteboard annotation node (no background/border) |
| `.flow-node-{shape}` | Node has a shape (e.g., `.flow-node-diamond`, `.flow-node-circle`) |

## Status classes

Apply status classes to nodes for semantic color coding. Set them via the `class` property on a node:

```js
{ id: '1', position: { x: 0, y: 0 }, class: 'flow-node-success', data: { label: 'Completed' } }
```

| Class | Purpose | Suggested color |
|-------|---------|-----------------|
| `.flow-node-success` | Completed or approved states | Green |
| `.flow-node-warning` | Needs attention or pending review | Amber/Yellow |
| `.flow-node-danger` | Error or failed states | Red |
| `.flow-node-info` | Informational or neutral highlights | Blue |
| `.flow-node-primary` | Primary or active emphasis | Brand/Accent |

Style these classes in your theme CSS to match your design system:

```css
.flow-node-success { border-color: #22c55e; border-top-color: #22c55e; }
.flow-node-warning { border-color: #f59e0b; border-top-color: #f59e0b; }
.flow-node-danger  { border-color: #ef4444; border-top-color: #ef4444; }
.flow-node-info    { border-color: #3b82f6; border-top-color: #3b82f6; }
.flow-node-primary { border-color: #8b5cf6; border-top-color: #8b5cf6; }
```

## Custom CSS via node properties

### Classes

Set `class` on a node to add custom CSS classes:

```js
{ id: '1', position: { x: 0, y: 0 }, class: 'my-custom-node highlight', data: { label: 'Styled' } }
```

Multiple classes can be space-separated. These are applied in addition to the automatic `.flow-node` class.

### Inline styles

Set `style` on a node for inline styles:

```js
{ id: '1', position: { x: 0, y: 0 }, style: 'background: #fef3c7; border-color: #f59e0b;', data: { label: 'Custom' } }
```

Both nodes use inline `style` for custom appearance:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Dashed' }, style: 'border-style: dashed;' },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Custom BG' }, style: 'background: rgba(139, 92, 246, 0.15); border-color: #8B5CF6;' },
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
</div>
```
::enddemo

## Accent stripe

Nodes have a configurable top border stripe controlled by the `--flow-node-border-top` CSS variable. This provides a subtle accent that differentiates the top edge:

```css
.flow-container {
    /* Light mode */
    --flow-node-border-top: 2.5px solid #d4d4d8;
}

@media (prefers-color-scheme: dark) {
    .flow-container {
        --flow-node-border-top: 2.5px solid #52525b;
    }
}
```

Override per node using the `style` property:

```js
{ id: '1', style: 'border-top: 3px solid #3b82f6;', data: { label: 'Blue accent' } }
```

## CSS variables for node appearance

These variables control the default look of all nodes. Override them on `.flow-container` or any parent element:

| Variable | Description |
|----------|-------------|
| `--flow-node-bg` | Node background color |
| `--flow-node-color` | Node text color |
| `--flow-node-border` | Node border shorthand (e.g., `1px solid #e4e4e7`) |
| `--flow-node-border-top` | Top border accent stripe |
| `--flow-node-border-radius` | Border radius |
| `--flow-node-padding` | Inner padding |
| `--flow-node-shadow` | Box shadow |
| `--flow-node-min-width` | Minimum node width |
| `--flow-node-transition` | Transition for state changes |
| `--flow-node-hover-border-color` | Border color on hover |
| `--flow-node-selected-border-color` | Border color when selected |
| `--flow-node-selected-shadow` | Box shadow when selected |
| `--flow-node-focus-outline` | Focus outline for keyboard navigation |
| `--flow-node-focus-outline-offset` | Focus outline offset |

### Group-specific variables

| Variable | Description |
|----------|-------------|
| `--flow-group-border-color` | Group node dashed border color |
| `--flow-group-bg` | Group node background (typically semi-transparent) |
| `--flow-node-group-padding` | Padding inside group nodes |
| `--flow-node-group-border-radius` | Border radius for group nodes |
| `--flow-node-group-font-size` | Font size for group labels |
| `--flow-node-group-text-transform` | Text transform for group labels |
| `--flow-node-group-letter-spacing` | Letter spacing for group labels |

### Shape variable

| Variable | Description |
|----------|-------------|
| `--flow-shape-border-color` | Border fill color for clipped shapes |

## Example: custom theme

```css
.flow-container {
    --flow-node-bg: #1e293b;
    --flow-node-color: #e2e8f0;
    --flow-node-border: 1px solid #334155;
    --flow-node-border-top: 3px solid #6366f1;
    --flow-node-border-radius: 12px;
    --flow-node-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    --flow-node-hover-border-color: #6366f1;
    --flow-node-selected-border-color: #818cf8;
    --flow-node-selected-shadow: 0 0 0 2px #818cf8;
}
```

## See also

- [Node Basics](basics.md) -- node `class` and `style` properties
- [Shapes](shapes.md) -- shape-specific CSS classes and variables
- [Groups](groups.md) -- group node styling
