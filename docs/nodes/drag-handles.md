---
title: Drag Handles
description: Restrict node dragging to a specific element.
order: 2
---

# Drag Handles

The `x-flow-drag-handle` directive restricts node dragging to a specific handle element rather than allowing the entire node surface to initiate a drag. This is useful for nodes with interactive content like buttons, inputs, or text areas that should not trigger dragging.

The first node drags from anywhere. The second only from its header. The third only from the grip icon:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'default', position: { x: 0, y: 0 }, data: { label: 'Default' } },
        { id: 'handle', position: { x: 220, y: 0 }, data: { label: 'Header Handle' } },
        { id: 'icon', position: { x: 440, y: 0 }, data: { label: 'Icon Handle' } },
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
            <template x-if="node.id === 'default'">
                <div x-flow-node="node">
                    <div x-flow-handle:target></div>
                    <span x-text="node.data.label"></span>
                    <div x-flow-handle:source></div>
                </div>
            </template>
        </template>
        <template x-for="node in nodes" :key="'h-' + node.id">
            <template x-if="node.id === 'handle'">
                <div x-flow-node="node">
                    <div x-flow-handle:target></div>
                    <div x-flow-drag-handle x-text="node.data.label"></div>
                    <div style="padding: 6px 12px; font-size: 13px;">Body content</div>
                    <div x-flow-handle:source></div>
                </div>
            </template>
        </template>
        <template x-for="node in nodes" :key="'i-' + node.id">
            <template x-if="node.id === 'icon'">
                <div x-flow-node="node">
                    <div x-flow-handle:target></div>
                    <div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px;">
                        <div x-flow-drag-handle style="background: none; border: none; padding: 0; cursor: grab; color: var(--flow-drag-handle-color, #94a3b8); display: flex;">
                            <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="2" cy="2" r="1.2"/><circle cx="8" cy="2" r="1.2"/><circle cx="2" cy="7" r="1.2"/><circle cx="8" cy="7" r="1.2"/><circle cx="2" cy="12" r="1.2"/><circle cx="8" cy="12" r="1.2"/></svg>
                        </div>
                        <span x-text="node.data.label"></span>
                    </div>
                    <div x-flow-handle:source></div>
                </div>
            </template>
        </template>
    </div>
</div>
```
::enddemo

## Usage

Place `x-flow-drag-handle` on any element inside an `x-flow-node`:

```html
<div x-flow-node="node">
    <div x-flow-drag-handle class="node-header">Title</div>
    <div class="node-body">
        <p>Content that does NOT start a drag.</p>
    </div>
</div>
```

Only a `pointerdown` event originating from within the `x-flow-drag-handle` element will start a drag operation. Pointer events on the rest of the node are ignored for dragging purposes.

## Signature

| Part | Value |
|------|-------|
| Expression | None |
| Modifiers | None |

## Behavior

- **Must be placed inside an `x-flow-node` element.** The directive has no effect outside a node.
- The directive automatically adds a CSS class and `data-*` attributes to the handle element for styling and internal identification.
- The parent `x-flow-node` element receives the `.flow-node-has-handle` CSS class, which you can target to adjust cursor or visual styles on the node body.

## Styling

When a drag handle is present, you typically want to show a grab cursor only on the handle and a default cursor on the rest of the node:

```css
.flow-node-has-handle {
    cursor: default;
}

[x-flow-drag-handle] {
    cursor: grab;
}

[x-flow-drag-handle]:active {
    cursor: grabbing;
}
```

The default theme provides built-in styles for drag handles using the following CSS variables:

| Variable | Description |
|----------|-------------|
| `--flow-drag-handle-bg` | Background color of the drag handle |
| `--flow-drag-handle-border-bottom` | Bottom border separating handle from body |
| `--flow-drag-handle-color` | Text color within the drag handle |
| `--flow-drag-handle-padding` | Padding inside the drag handle |
| `--flow-drag-handle-border-radius` | Border radius of the drag handle |

## See also

- [Node Basics](basics.md) -- core node directive and configuration
- [Styling](styling.md) -- CSS classes and theming
