---
title: Gradients
description: Linear gradient colors along edge strokes.
order: 4
---

# Gradients

Set `color` to a gradient object for a two-color linear gradient along the edge stroke:

```js
{
  id: 'e1',
  source: 'a',
  target: 'b',
  color: { from: '#22c55e', to: '#ef4444' },
}
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 300, y: 100 }, data: { label: 'Target' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', color: { from: '#DAA532', to: '#8B5CF6' }, strokeWidth: 2 },
    ],
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

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string \| { from, to }` | CSS variable | Solid color string or gradient object. |
| `gradientDirection` | `'source-target' \| 'target-source'` | `'source-target'` | Which end of the edge gets the `from` color. |

The top edge flows amber-to-violet (default direction). The bottom edge reverses it with `gradientDirection: 'target-source'`:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 300, y: 120 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', color: { from: '#DAA532', to: '#8B5CF6' }, strokeWidth: 2 },
        { id: 'e2', source: 'a', target: 'c', color: { from: '#DAA532', to: '#8B5CF6' }, gradientDirection: 'target-source', strokeWidth: 2 },
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

## How it works

The gradient is implemented as an SVG `<linearGradient>` in `userSpaceOnUse` coordinates, updated reactively as nodes move. Each unique gradient pair produces its own `<linearGradient>` element in SVG `<defs>`.

## See also

- [Edge Types](types.md) -- all available edge path types
- [Styling](styling.md) -- colors, stroke width, and CSS classes
- [Markers](markers.md) -- marker colors can complement gradient edges
