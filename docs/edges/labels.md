---
title: Labels
description: Text labels at center, source, or target positions.
order: 3
---

# Labels

Edges support three label positions. Labels are rendered as HTML `<div>` elements (not SVG `<text>`), so they support full HTML/CSS styling.

All three label positions — center, start, and end:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 330, y: 120 }, data: { label: 'Target' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', label: 'center', labelStart: 'start', labelEnd: 'end' },
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

## Label positions

| Property | Position | Default offset |
|----------|----------|----------------|
| `label` | Center of the path | `labelPosition: 0.5` (0 = source, 1 = target) |
| `labelStart` | Near the source end | `labelStartOffset: 30` (flow-coordinate pixels from source) |
| `labelEnd` | Near the target end | `labelEndOffset: 30` (flow-coordinate pixels from target) |

## Label visibility

Control when labels appear with `labelVisibility`:

| Value | Behavior |
|-------|----------|
| `'always'` | Always visible (default). |
| `'hover'` | Visible on hover or when the edge is selected. |
| `'selected'` | Visible only when the edge is selected. |

Hover each edge to see the label appear — the top edge is always visible, the bottom only on hover:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 300, y: 120 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', label: 'always', labelVisibility: 'always' },
        { id: 'e2', source: 'a', target: 'c', label: 'hover me', labelVisibility: 'hover' },
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

## HTML labels

Label text is written with `textContent`, so markup in a label shows as the tags themselves. Set `labelHtml: true` on the edge to render its labels as HTML instead — for a label that needs a line break, an icon, or a piece of emphasis:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Request' } },
        { id: 'b', position: { x: 330, y: 0 }, data: { label: 'Manager' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', label: 'over the limit<br><em>and no manager on shift</em>', labelHtml: true },
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

The flag covers all three positions — `label`, `labelStart` and `labelEnd` — and the value goes to `innerHTML` unchanged. Like any HTML you hand a framework, it is trusted: pass anything a user typed through your own escaping or sanitiser first.

## Example

```js
{
  id: 'e1',
  source: 'a',
  target: 'b',
  label: 'main',
  labelStart: '1',
  labelEnd: '*',
  labelVisibility: 'hover',
}
```

## See also

- [Edge Types](types.md) -- all available edge path types
- [Styling](styling.md) -- colors, stroke width, and CSS classes
- [Markers](markers.md) -- SVG arrowheads for edge endpoints
