---
title: Viewport
description: Pan, zoom, fitView, and coordinate conversion.
order: 1
---

# Viewport

The viewport determines which portion of the diagram is visible. AlpineFlow provides extensive options for controlling panning, zooming, coordinate conversion, and viewport animation.

Pan by dragging the background, scroll to zoom (pinch to zoom on touch), and click Fit View to reset:

::demo
```toolbar
<button id="demo-vp-fit" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fit View</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Pan & zoom me' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Drag to pan' } },
        { id: 'c', position: { x: 150, y: 120 }, data: { label: 'Scroll to zoom' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
        { id: 'e3', source: 'b', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    minZoom: 0.2,
    maxZoom: 4,
})" class="flow-container" style="height: 250px;"
   x-init="document.getElementById('demo-vp-fit').addEventListener('click', () => fitView({ padding: 0.2, duration: 300 }))">
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

## Pan and zoom

Enable or disable panning and zooming with config options:

```html
<div x-data="flowCanvas({
    pannable: true,
    zoomable: true,
    minZoom: 0.1,
    maxZoom: 4,
})">
```

### Mouse button control

Restrict which mouse button triggers panning with `panOnDrag`:

```html
<div x-data="flowCanvas({ panOnDrag: [0] })">
```

Pass an array of mouse button indices (0 = left, 1 = middle, 2 = right).

### Scroll panning

Use scroll events to pan instead of zoom:

```html
<div x-data="flowCanvas({
    panOnScroll: true,
    panOnScrollDirection: 'both',
    panOnScrollSpeed: 1,
})">
```

`panOnScrollDirection` accepts `'both'`, `'horizontal'`, or `'vertical'`. `panOnScrollSpeed` is a multiplier for scroll-to-pan speed.

## Keyboard pan

Hold the **Space** key to enter grab-cursor pan mode. While held, click and drag to pan the viewport regardless of other interaction settings.

## Viewport element

The viewport is the pannable, zoomable layer that contains all nodes. Place it as a direct child of the `flowCanvas()` scope element using the `x-flow-viewport` directive:

```html
<div x-data="flowCanvas({ ... })" class="flow-container">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">...</div>
        </template>
    </div>
</div>
```

The viewport element:

- Applies the viewport transform (`translate` + `scale`) to the element
- Creates and manages the edge SVG layer as its first child
- Reactively renders edge SVG elements from the `edges` array
- Handles edge visibility (hidden/filtered nodes hide their edges)
- Removes pre-rendered static edges when reactive edges take over (SSR hydration)
- Gets a `.flow-viewport` CSS class automatically

Edges are rendered automatically -- you don't write edge markup. Node templates go inside the viewport via `x-for`.

## fitView

Fit all nodes into the viewport with optional padding and animation:

```js
$flow.fitView({ padding: 0.2, duration: 300 })
```

- `padding` -- Fraction of viewport to leave as margin (default `0.1`).
- `duration` -- Animation duration in milliseconds. Omit or set to `0` for instant.

### On initialization

Automatically fit the view when the canvas first renders:

```html
<div x-data="flowCanvas({ fitViewOnInit: true })">
```

### Via directive

Use the `x-flow-action` directive on a button:

```html
<button x-flow-action:fit-view>Fit View</button>
```

Pan around, then click Fit View to animate back:

::demo
```toolbar
<button id="demo-fitview-btn" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fit View</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 150, y: 120 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
})" class="flow-container" style="height: 250px;"
   x-init="document.getElementById('demo-fitview-btn').addEventListener('click', () => fitView({ padding: 0.2, duration: 300 }))">
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

## setViewport / panBy / setCenter

### setViewport

Set an exact viewport position and zoom level:

```js
$flow.setViewport({ x: 100, y: 200, zoom: 1.5 }, { duration: 300 })
```

### panBy

Pan the viewport by a relative offset in screen pixels:

```js
$flow.panBy(dx, dy)
```

### setCenter

Center the viewport on specific flow coordinates:

```js
$flow.setCenter(x, y, zoom)
```

::demo
```toolbar
<button id="demo-vpapi-set" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">setViewport</button>
<button id="demo-vpapi-pan" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">panBy</button>
<button id="demo-vpapi-center" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">setCenter</button>
<button id="demo-vpapi-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 150, y: 120 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
})" class="flow-container" style="height: 250px;"
   x-init="
        document.getElementById('demo-vpapi-set').addEventListener('click', () => setViewport({ x: -50, y: -30, zoom: 1.5 }, { duration: 300 }));
        document.getElementById('demo-vpapi-pan').addEventListener('click', () => panBy(-80, -40));
        document.getElementById('demo-vpapi-center').addEventListener('click', () => setCenter(150, 60, 2));
        document.getElementById('demo-vpapi-reset').addEventListener('click', () => fitView({ padding: 0.2, duration: 300 }));
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

## fitBounds

Fit a specific rectangular area into the viewport:

```js
$flow.fitBounds(
    { x: 0, y: 0, width: 500, height: 300 },
    { padding: 0.1, duration: 300 }
)
```

Useful for focusing on a subset of nodes or a particular region of the diagram.

Click each button to focus on a different region:

::demo
```toolbar
<button id="demo-bounds-left" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Left group</button>
<button id="demo-bounds-right" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Right group</button>
<button id="demo-bounds-all" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">All</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Left A' } },
        { id: 'b', position: { x: 0, y: 100 }, data: { label: 'Left B' } },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'Right A' } },
        { id: 'd', position: { x: 500, y: 100 }, data: { label: 'Right B' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'c', target: 'd' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
})" class="flow-container" style="height: 250px;"
   x-init="
        document.getElementById('demo-bounds-left').addEventListener('click', () => fitBounds({ x: -20, y: -20, width: 200, height: 180 }, { padding: 0.2, duration: 300 }));
        document.getElementById('demo-bounds-right').addEventListener('click', () => fitBounds({ x: 480, y: -20, width: 200, height: 180 }, { padding: 0.2, duration: 300 }));
        document.getElementById('demo-bounds-all').addEventListener('click', () => fitView({ padding: 0.2, duration: 300 }));
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

## Coordinate conversion

Convert between screen (DOM) coordinates and flow (diagram) coordinates:

```js
// Screen position to flow position
const flowPos = $flow.screenToFlowPosition(clientX, clientY)

// Flow position to screen position
const screenPos = $flow.flowToScreenPosition(flowX, flowY)
```

These are essential when handling native DOM events (e.g., mouse clicks) and mapping them onto the diagram's coordinate space.

## Viewport boundaries

Restrict how far the user can pan with `translateExtent`:

```html
<div x-data="flowCanvas({
    translateExtent: [[-1000, -1000], [2000, 2000]],
})">
```

The value is `[[minX, minY], [maxX, maxY]]` in flow coordinates. The viewport will not pan beyond these bounds.

Try panning — the viewport stops at the boundary edges. To also constrain node positions, use `nodeExtent`:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 50, y: 30 }, data: { label: 'Pan is limited' } },
        { id: 'b', position: { x: 300, y: 30 }, data: { label: 'Try it' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    translateExtent: [[-100, -100], [600, 200]],
    nodeExtent: [[-100, -100], [600, 200]],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
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

## Viewport culling

Viewport culling skips rendering nodes and edges that are outside the visible area, improving performance for large diagrams:

```html
<div x-data="flowCanvas({
    viewportCulling: true,
    cullingBuffer: 100,
})">
```

- `viewportCulling` -- Enable culling (default `false`). Opt-in for large diagrams.
- `cullingBuffer` -- Extra pixels beyond the viewport edge before an element is culled (default `100`). A larger buffer prevents pop-in when panning quickly.

## Auto-pan

Automatically pan the viewport when the user drags a node or connection near the canvas edge:

```html
<div x-data="flowCanvas({
    autoPanOnNodeDrag: true,
    autoPanOnConnect: true,
    autoPanSpeed: 1,
})">
```

- `autoPanOnNodeDrag` -- Pan while dragging a node near the edge.
- `autoPanOnConnect` -- Pan while drawing a connection near the edge.
- `autoPanSpeed` -- Speed multiplier for auto-pan velocity.

## Events

Listen for viewport changes on the canvas element:

| Event | Description |
|-------|-------------|
| `viewport-change` | Fires whenever the viewport position or zoom changes |
| `viewport-move-start` | Fires when a pan/zoom interaction begins |
| `viewport-move` | Fires continuously during a pan/zoom interaction |
| `viewport-move-end` | Fires when a pan/zoom interaction ends |

```html
<div
    x-data="flowCanvas()"
    @viewport-change="console.log('viewport:', $event.detail)"
>
```
