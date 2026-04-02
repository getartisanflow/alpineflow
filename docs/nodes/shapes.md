---
title: Shapes
description: Built-in node shapes and custom shape registration.
order: 3
---

# Shapes

AlpineFlow ships with seven built-in node shapes and supports registering custom shapes. Shapes control the visual outline, clip-path, and handle positioning of a node.

**Rectangle** (default), **circle**, and **stadium** use border-radius:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'rect', position: { x: 0, y: 0 }, data: { label: 'Rectangle' } },
        { id: 'circle', position: { x: 220, y: 0 }, shape: 'circle', data: { label: 'Circle' } },
        { id: 'stadium', position: { x: 400, y: 0 }, shape: 'stadium', data: { label: 'Stadium' } },
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

## Built-in shapes

Set the `shape` property on a node to apply a shape:

```js
{ id: 'decision', position: { x: 100, y: 100 }, shape: 'diamond', data: { label: 'Yes/No?' } }
```

| Shape | CSS class | Technique |
|-------|-----------|-----------|
| `diamond` | `.flow-node-diamond` | `clip-path` (rotated square) |
| `hexagon` | `.flow-node-hexagon` | `clip-path` (6-point polygon) |
| `parallelogram` | `.flow-node-parallelogram` | `clip-path` (skewed rectangle) |
| `triangle` | `.flow-node-triangle` | `clip-path` (3-point polygon) |
| `circle` | `.flow-node-circle` | `border-radius: 50%` |
| `cylinder` | `.flow-node-cylinder` | `clip-path` (rounded rectangle with elliptical caps) |
| `stadium` | `.flow-node-stadium` | `border-radius: 9999px` |

Nodes without a `shape` property render as standard rectangles.

## Shape rendering

Clipped shapes (diamond, hexagon, parallelogram, triangle, cylinder) use a **background-as-border** pattern. The outer element's background acts as the border color, while a `::after` pseudo-element provides the inner fill with a slightly inset clip-path.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'diamond', position: { x: 0, y: 0 }, shape: 'diamond', data: { label: 'Diamond' } },
        { id: 'hexagon', position: { x: 180, y: 0 }, shape: 'hexagon', data: { label: 'Hexagon' } },
        { id: 'para', position: { x: 360, y: 0 }, shape: 'parallelogram', data: { label: 'Parallel' } },
        { id: 'tri', position: { x: 540, y: 0 }, shape: 'triangle', data: { label: 'Triangle' } },
        { id: 'cyl', position: { x: 700, y: 0 }, shape: 'cylinder', data: { label: 'Cylinder' } },
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

When a node is selected, the outer background changes to the accent color, giving the appearance of a colored border following the shape outline:

```css
.flow-node-diamond {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    background: var(--flow-shape-border-color);
}

.flow-node-diamond::after {
    clip-path: polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%);
    background: var(--flow-node-bg);
}
```

The inset is 2px by default (3px when selected) to create the border appearance.

## Handle positions

Each shape has **perimeter-aware handle positions** defined in CSS. Handles snap to the actual shape edge rather than the rectangular bounding box. For example, a diamond's left handle sits at the leftmost point of the diamond (the midpoint of the left edge), not at the top-left corner of the bounding box.

Handle positions are computed to match the `perimeterPoint()` values in `shapes.ts`, ensuring that edges connect visually to the shape outline.

## Custom shapes

Register custom shapes via `config.shapeTypes`. Each shape definition requires a `perimeterPoint` function and an optional `clipPath` CSS string:

```js
shapeTypes: {
    octagon: {
        perimeterPoint(width, height, position) {
            // Return { x, y } coordinates on the octagon perimeter
            // for the given handle position ('top', 'right', 'bottom', 'left')
            const inset = Math.min(width, height) * 0.3;
            // ... compute point based on position
            return { x, y };
        },
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
    },
}
```

Then apply it to nodes:

```js
{ id: 'n1', shape: 'octagon', position: { x: 0, y: 0 }, data: { label: 'Custom' } }
```

The node will receive the CSS class `.flow-node-octagon`. Add corresponding styles in your CSS for the background-as-border pattern and handle positioning.

## Shape CSS variable

| Variable | Description |
|----------|-------------|
| `--flow-shape-border-color` | Border fill color for clipped shapes |

Override this variable to change the border appearance of all shaped nodes:

```css
.flow-container {
    --flow-shape-border-color: #64748b;
}
```

## See also

- [Node Basics](basics.md) -- node directive and data shape
- [Styling](styling.md) -- CSS classes and theming
