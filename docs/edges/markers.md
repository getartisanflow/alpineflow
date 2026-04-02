---
title: Markers
description: SVG arrowheads for edge endpoints.
order: 2
---

# Markers

Markers are SVG arrowheads rendered at edge endpoints. Two built-in types are available:

| Marker | Visual | Description |
|--------|--------|-------------|
| `'arrow'` | Open chevron | Unfilled polyline arrowhead. |
| `'arrowclosed'` | Filled triangle | Closed and filled arrowhead. |

**`arrow`** (open) and **`arrowclosed`** (filled):

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 300, y: 80 }, data: { label: 'Target' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', markerStart: 'arrow', markerEnd: 'arrowclosed' },
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

## Usage

Use the `markerEnd` and `markerStart` properties on an edge. Both accept a shorthand string or a full `MarkerConfig` object:

```js
// Shorthand string
{ id: 'e1', source: 'a', target: 'b', markerEnd: 'arrowclosed' }

// Full MarkerConfig object
{
  id: 'e2',
  source: 'a',
  target: 'b',
  markerEnd: {
    type: 'arrowclosed',
    color: '#ef4444',
    width: 15,
    height: 15,
  },
  markerStart: 'arrow',
}
```

## MarkerConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'arrow' \| 'arrowclosed'` | -- | Required. Marker shape. |
| `color` | `string` | CSS `--flow-edge-stroke` | Stroke and fill color. |
| `width` | `number` | `12.5` | Marker width in stroke-width units. |
| `height` | `number` | `12.5` | Marker height in stroke-width units. |
| `orient` | `string` | `'auto-start-reverse'` | SVG `orient` attribute. |
| `offset` | `number` | auto | Explicit distance to shift the endpoint away from the handle center. When omitted, computed automatically from handle radius and marker depth. |

Custom colored markers with `MarkerConfig` — bidirectional edge with markers on both ends:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 80 }, data: { label: 'Node B' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b',
          markerStart: { type: 'arrow', color: '#DAA532', width: 20, height: 20 },
          markerEnd: { type: 'arrowclosed', color: '#8B5CF6', width: 20, height: 20 },
        },
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

## Custom markers

Register custom marker shapes with `$flow.registerMarker(type, renderer)`. The renderer function receives resolved defaults and must return a complete SVG `<marker>` element string.

### Renderer parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique marker ID for the SVG `<defs>` element |
| `color` | `string` | Resolved color (from edge config or theme default) |
| `width` | `number` | Marker width in stroke-width units |
| `height` | `number` | Marker height in stroke-width units |
| `orient` | `string` | SVG `orient` attribute (usually `'auto-start-reverse'`) |

### Registration

Register via `$flow` at runtime or via ES import at build time:

```js
// Runtime (inline Alpine expressions, WireFlow x-init)
$flow.registerMarker('diamond', ({ id, color, width, height, orient }) => `
    <marker id="${id}" viewBox="0 0 20 20" markerWidth="${width}" markerHeight="${height}"
        orient="${orient}" markerUnits="strokeWidth" refX="20" refY="10">
        <polygon points="10,0 20,10 10,20 0,10" fill="${color}" />
    </marker>
`);

// Build-time (ES import)
import { registerMarker } from '@getartisanflow/alpineflow';
registerMarker('diamond', ({ id, color, width, height, orient }) => `...`);
```

Both methods share the same global registry. Then reference the type on any edge:

```js
{ id: 'e1', source: 'a', target: 'b', markerEnd: 'diamond' }

// With MarkerConfig for custom color/size:
{ id: 'e2', source: 'a', target: 'b', markerEnd: { type: 'diamond', color: '#14B8A6', width: 15, height: 15 } }
```

Custom diamond marker in teal:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Custom' } },
        { id: 'b', position: { x: 300, y: 80 }, data: { label: 'Marker' } },
    ],
    edges: [],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       $flow.registerMarker('diamond', ({ id, color, width, height, orient }) =>
           '<marker id=\'' + id + '\' viewBox=\'0 0 20 20\' markerWidth=\'' + width + '\' markerHeight=\'' + height + '\' orient=\'' + orient + '\' markerUnits=\'strokeWidth\' refX=\'20\' refY=\'10\'><polygon points=\'10,0 20,10 10,20 0,10\' fill=\'' + color + '\' /></marker>'
       );
       addEdges([{ id: 'e1', source: 'a', target: 'b',
           markerEnd: { type: 'diamond', color: '#14B8A6', width: 15, height: 15 },
           color: '#14B8A6', strokeWidth: 2 }]);
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

## Deduplication

Markers are deduplicated in SVG `<defs>` -- identical configurations (same type and color) share a single `<marker>` element regardless of how many edges use them.

## See also

- [Edge Types](types.md) -- all available edge path types
- [Styling](styling.md) -- colors, stroke width, and CSS classes
- [Gradients](gradients.md) -- gradient colors along edge strokes
