---
title: Whiteboard
description: Freehand drawing, highlighter, shapes, text, and eraser tools.
order: 1
---

# Whiteboard

The Whiteboard addon adds freehand drawing, highlighting, shape drawing, text placement, and erasing capabilities to your flow canvas.

::demo
```html
<div x-data="{
    ...flowCanvas({
        nodes: [],
        edges: [],
        background: 'dots',
        selectionOnDrag: true,
        panOnDrag: [2],
        fitViewOnInit: false,
        controls: false,
        pannable: false,
        zoomable: false,
    }),
    tool: null,
    toolSettings: { strokeColor: '#334155', strokeWidth: 2, opacity: 1 },
}"
    class="flow-container"
    x-flow-freehand.filled="tool === 'draw'"
    x-flow-highlighter="tool === 'highlighter'"
    x-flow-eraser="tool === 'eraser'"
    x-flow-arrow-draw="tool === 'arrow'"
    x-flow-circle-draw="tool === 'circle'"
    x-flow-rectangle-draw="tool === 'rectangle'"
    x-flow-text-tool="tool === 'text'"
    @flow-freehand-end="addNodes([{ id: 'ann-'+Date.now()+'-'+Math.random().toString(36).slice(2,5), position:{x:0,y:0}, draggable:false, selectable:false, class:'flow-node-annotation', data:{annotation:'drawing', pathData:$event.detail.pathData, strokeColor:$event.detail.strokeColor, opacity:$event.detail.opacity} }])"
    @flow-highlight-end="addNodes([{ id: 'ann-'+Date.now()+'-'+Math.random().toString(36).slice(2,5), position:{x:0,y:0}, draggable:false, selectable:false, class:'flow-node-annotation', data:{annotation:'highlight', pathData:$event.detail.pathData, strokeColor:$event.detail.strokeColor, opacity:$event.detail.opacity} }])"
    @flow-arrow-draw="addNodes([{ id: 'ann-'+Date.now()+'-'+Math.random().toString(36).slice(2,5), position:{x:0,y:0}, draggable:false, selectable:false, class:'flow-node-annotation', data:{annotation:'arrow', start:$event.detail.start, end:$event.detail.end, strokeColor:$event.detail.strokeColor, strokeWidth:$event.detail.strokeWidth, opacity:$event.detail.opacity} }])"
    @flow-circle-draw="addNodes([{ id: 'ann-'+Date.now()+'-'+Math.random().toString(36).slice(2,5), position:{x:0,y:0}, draggable:false, selectable:false, class:'flow-node-annotation', data:{annotation:'circle', cx:$event.detail.cx, cy:$event.detail.cy, rx:$event.detail.rx, ry:$event.detail.ry, strokeColor:$event.detail.strokeColor, strokeWidth:$event.detail.strokeWidth, opacity:$event.detail.opacity} }])"
    @flow-rectangle-draw="addNodes([{ id: 'ann-'+Date.now()+'-'+Math.random().toString(36).slice(2,5), position:{x:$event.detail.bounds.x,y:$event.detail.bounds.y}, draggable:false, selectable:false, class:'flow-node-annotation', data:{annotation:'rectangle', w:$event.detail.bounds.width, h:$event.detail.bounds.height, strokeColor:$event.detail.strokeColor, strokeWidth:$event.detail.strokeWidth, opacity:$event.detail.opacity} }])"
    @flow-text-draw="addNodes([{ id: 'ann-'+Date.now()+'-'+Math.random().toString(36).slice(2,5), position:{x:$event.detail.position.x, y:$event.detail.position.y}, draggable:false, selectable:false, class:'flow-node-annotation', data:{annotation:'text', text:'', strokeColor:$event.detail.strokeColor, fontSize:$event.detail.fontSize, opacity:$event.detail.opacity} }])"
    style="height: 300px;">
    <div class="canvas-overlay" @mousedown.stop @pointerdown.stop style="display:flex;flex-direction:column;gap:4px;position:absolute;top:8px;left:8px;z-index:20;">
        <div style="display:flex;gap:2px;">
            <button @click="tool = null" :class="tool === null ? 'text-violet border-violet/40 bg-violet/10' : 'bg-elevated text-text-faint hover:text-text-muted'" class="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] cursor-pointer">Select</button>
            <button @click="tool = 'draw'" :class="tool === 'draw' ? 'text-amber border-amber/40 bg-amber/10' : 'bg-elevated text-text-faint hover:text-text-muted'" class="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] cursor-pointer">Draw</button>
            <button @click="tool = 'highlighter'" :class="tool === 'highlighter' ? 'text-violet border-violet/40 bg-violet/10' : 'bg-elevated text-text-faint hover:text-text-muted'" class="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] cursor-pointer">Highlight</button>
            <button @click="tool = 'arrow'" :class="tool === 'arrow' ? 'text-teal border-teal/40 bg-teal/10' : 'bg-elevated text-text-faint hover:text-text-muted'" class="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] cursor-pointer">Arrow</button>
            <button @click="tool = 'circle'" :class="tool === 'circle' ? 'text-teal border-teal/40 bg-teal/10' : 'bg-elevated text-text-faint hover:text-text-muted'" class="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] cursor-pointer">Circle</button>
            <button @click="tool = 'rectangle'" :class="tool === 'rectangle' ? 'text-teal border-teal/40 bg-teal/10' : 'bg-elevated text-text-faint hover:text-text-muted'" class="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] cursor-pointer">Rect</button>
            <button @click="tool = 'text'" :class="tool === 'text' ? 'text-violet border-violet/40 bg-violet/10' : 'bg-elevated text-text-faint hover:text-text-muted'" class="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] cursor-pointer">Text</button>
            <button @click="tool = 'eraser'" :class="tool === 'eraser' ? 'text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10' : 'bg-elevated text-text-faint hover:text-text-muted'" class="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] cursor-pointer">Eraser</button>
        </div>
        <div style="display:flex;gap:2px;">
            <template x-for="c in ['#334155','#ef4444','#3b82f6','#22c55e','#f59e0b']" :key="c">
                <button @click="toolSettings.strokeColor = c" :style="'width:20px;height:20px;border-radius:50%;border:2px solid '+(toolSettings.strokeColor===c?c:'transparent')+';background:'+c+';cursor:pointer;'"></button>
            </template>
        </div>
    </div>
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <template x-if="node.data?.annotation === 'drawing' || node.data?.annotation === 'highlight'">
                    <svg style="position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;">
                        <path :d="node.data.pathData" :fill="node.data.strokeColor || '#334155'" :opacity="node.data.opacity ?? 1" stroke="none" />
                    </svg>
                </template>
                <template x-if="node.data?.annotation === 'rectangle'">
                    <div :style="'pointer-events:none;width:'+node.data.w+'px;height:'+node.data.h+'px;border:'+(node.data.strokeWidth||2)+'px dashed '+(node.data.strokeColor||'#94a3b8')+';background:rgba(148,163,184,0.08);border-radius:4px;opacity:'+(node.data.opacity??1)+';'"></div>
                </template>
                <template x-if="node.data?.annotation === 'arrow'">
                    <svg style="position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;">
                        <defs><marker :id="'am-'+node.id" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" :fill="node.data.strokeColor || '#334155'" /></marker></defs>
                        <line :x1="node.data.start.x" :y1="node.data.start.y" :x2="node.data.end.x" :y2="node.data.end.y" :stroke="node.data.strokeColor || '#334155'" :stroke-width="node.data.strokeWidth || 2" :opacity="node.data.opacity ?? 1" :marker-end="'url(#am-'+node.id+')'" />
                    </svg>
                </template>
                <template x-if="node.data?.annotation === 'circle'">
                    <svg style="position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;">
                        <ellipse :cx="node.data.cx" :cy="node.data.cy" :rx="node.data.rx" :ry="node.data.ry" fill="rgba(148,163,184,0.08)" :stroke="node.data.strokeColor || '#334155'" :stroke-width="node.data.strokeWidth || 2" :opacity="node.data.opacity ?? 1" />
                    </svg>
                </template>
                <template x-if="node.data?.annotation === 'text'">
                    <div contenteditable="true" @blur="node.data.text = $el.textContent; if (!$el.textContent.trim()) removeNodes([node.id])" :style="'font-size:'+(node.data.fontSize||18)+'px;color:'+(node.data.strokeColor||'#334155')+';min-width:50px;min-height:1em;outline:none;white-space:pre;opacity:'+(node.data.opacity??1)+';'" x-text="node.data.text" x-init="if (!node.data.text) $nextTick(() => $el.focus())"></div>
                </template>
                <template x-if="!node.data?.annotation">
                    <div>
                        <div x-flow-handle:target></div>
                        <span x-text="node.data?.label"></span>
                        <div x-flow-handle:source></div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Installation

```js
import AlpineFlowWhiteboard from '@getartisanflow/alpineflow/whiteboard'

Alpine.plugin(AlpineFlowWhiteboard)
```

No additional peer dependencies are required.

## With WireFlow

If you're using [WireFlow](https://artisanflow.dev/docs/wireflow) (AlpineFlow's Livewire integration), the core is loaded from the WireFlow vendor bundle. Addons work seamlessly — they share a global registry with the core, regardless of how each was loaded.

> Install `@getartisanflow/alpineflow` via npm to access addon sub-path imports.

```js
// Core from WireFlow vendor bundle
import AlpineFlow from '../../vendor/getartisanflow/wireflow/dist/alpineflow.bundle.esm.js';
// Addon from npm
import AlpineFlowWhiteboard from '@getartisanflow/alpineflow/whiteboard';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineFlow);
    window.Alpine.plugin(AlpineFlowWhiteboard);
});
```

## Directives

All whiteboard directives are placed on the `.flow-container` element. The expression for each directive is a boolean that controls whether the tool is currently active.

| Directive | Description |
|---|---|
| `x-flow-freehand` | Freehand pen drawing with pressure-sensitive strokes |
| `x-flow-highlighter` | Semi-transparent highlighter strokes |
| `x-flow-arrow-draw` | Click-and-drag to draw arrow annotations |
| `x-flow-circle-draw` | Click-and-drag to draw circle annotations |
| `x-flow-rectangle-draw` | Click-and-drag to draw rectangle annotations |
| `x-flow-text-tool` | Click to place editable text annotations |
| `x-flow-eraser` | Drag to paint over elements, release to delete |

### Basic usage

```html
<div x-data="flowCanvas({ nodes, edges })" class="flow-container"
     x-flow-freehand="activeTool === 'freehand'"
     x-flow-highlighter="activeTool === 'highlighter'"
     x-flow-arrow-draw="activeTool === 'arrow'"
     x-flow-circle-draw="activeTool === 'circle'"
     x-flow-rectangle-draw="activeTool === 'rectangle'"
     x-flow-text-tool="activeTool === 'text'"
     x-flow-eraser="activeTool === 'eraser'">
</div>
```

## Tool Settings

Configure drawing properties via `toolSettings` — an object with `strokeColor`, `strokeWidth`, and `opacity`. The directives read this from the Alpine scope via `Alpine.$data(el).toolSettings`.

### With raw Alpine (recommended pattern)

Spread `flowCanvas()` into a parent scope alongside `tool` and `toolSettings`:

```html
<div x-data="{
    ...flowCanvas(exampleDefaults({ nodes, edges, selectionOnDrag: true, panOnDrag: [2] })),
    tool: null,
    toolSettings: { strokeColor: '#334155', strokeWidth: 2, opacity: 1 },
}"
    class="flow-container"
    x-flow-freehand.filled="tool === 'draw'"
    x-flow-highlighter="tool === 'highlighter'"
    x-flow-eraser="tool === 'eraser'"
    x-flow-rectangle-draw="tool === 'rectangle'"
    x-flow-arrow-draw="tool === 'arrow'"
    x-flow-circle-draw="tool === 'circle'"
    x-flow-text-tool="tool === 'text'"
>
    <!-- Toolbar inside the canvas -->
    <div class="canvas-overlay" @mousedown.stop @pointerdown.stop>
        <button @click="tool = null">Select</button>
        <button @click="tool = 'draw'">Draw</button>
        <!-- ... -->
    </div>

    <!-- Viewport + node templates -->
    <div x-flow-viewport>...</div>
</div>
```

> **Important:** Toolbar elements inside the `.flow-container` must use the `canvas-overlay` class with `@mousedown.stop @pointerdown.stop`. Drawing directives use capture-phase pointer handlers that intercept all events inside the container — without `canvas-overlay`, tool buttons won't respond to clicks while a drawing tool is active. On touch devices, ensure toolbar buttons are large enough to tap comfortably (44×44px minimum is recommended) — see [Touch & Mobile](../interaction/touch.md).

### With WireFlow `<x-flow>`

Since `<x-flow>` creates its own `x-data="flowCanvas({...})"`, you can't define `tool` and `toolSettings` in a parent scope — directives on the `<x-flow>` element evaluate in the flowCanvas scope, not the parent. Use `x-init` with `Object.assign($data, ...)` to inject properties into the flowCanvas scope:

```blade
<x-flow
    :nodes="$nodes"
    :edges="$edges"
    :config="['selectionOnDrag' => true, 'panOnDrag' => [2]]"
    x-init="Object.assign($data, {
        tool: null,
        toolSettings: { strokeColor: '#334155', strokeWidth: 2, opacity: 1 },
    })"
    x-flow-freehand.filled="tool === 'draw'"
    x-flow-highlighter="tool === 'highlighter'"
    x-flow-eraser="tool === 'eraser'"
    x-flow-rectangle-draw="tool === 'rectangle'"
    x-flow-arrow-draw="tool === 'arrow'"
    x-flow-circle-draw="tool === 'circle'"
    x-flow-text-tool="tool === 'text'"
>
```

> **Important:** Do NOT pass `toolSettings` inside the `config` prop. It must be a top-level Alpine scope property, not a config option.

### Listening for drawing events in WireFlow

Drawing tool events (`flow-freehand-end`, `flow-rectangle-draw`, etc.) are dispatched on the `.flow-container` element. In WireFlow, you can't use `@@event` attributes on `<x-flow>` (Livewire 4 crashes on custom event names with hyphens). Instead, attach listeners in `x-init`:

```blade
<x-flow
    x-init="
        Object.assign($data, { tool: null, toolSettings: { ... } });
        $el.addEventListener('flow-freehand-end', (e) => {
            addNodes([{
                id: 'ann-' + Date.now(),
                position: { x: 0, y: 0 },
                class: 'flow-node-annotation',
                data: { annotation: 'drawing', pathData: e.detail.pathData },
            }]);
        });
    "
>
```

## Complete Example

A working whiteboard with freehand, highlighter, arrow, rectangle, circle, text, and eraser tools. This shows the full pattern including event listeners and annotation node templates.

### Event listeners

Each tool emits an event when a drawing action completes. You must handle these events to create annotation nodes:

```html
@flow-freehand-end="addNodes([{
    id: 'ann-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    position: { x: 0, y: 0 },
    draggable: false, selectable: false,
    class: 'flow-node-annotation',
    data: { annotation: 'drawing', pathData: $event.detail.pathData, strokeColor: $event.detail.strokeColor, opacity: $event.detail.opacity },
}])"

@flow-highlight-end="addNodes([{
    id: 'ann-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    position: { x: 0, y: 0 },
    draggable: false, selectable: false,
    class: 'flow-node-annotation',
    data: { annotation: 'highlight', pathData: $event.detail.pathData, strokeColor: $event.detail.strokeColor, opacity: $event.detail.opacity },
}])"

@flow-rectangle-draw="addNodes([{
    id: 'ann-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    position: { x: $event.detail.bounds.x, y: $event.detail.bounds.y },
    draggable: false, selectable: false,
    class: 'flow-node-annotation',
    data: { annotation: 'rectangle', w: $event.detail.bounds.width, h: $event.detail.bounds.height, strokeColor: $event.detail.strokeColor, strokeWidth: $event.detail.strokeWidth, opacity: $event.detail.opacity },
}])"

@flow-arrow-draw="addNodes([{
    id: 'ann-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    position: { x: 0, y: 0 },
    draggable: false, selectable: false,
    class: 'flow-node-annotation',
    data: { annotation: 'arrow', start: $event.detail.start, end: $event.detail.end, strokeColor: $event.detail.strokeColor, strokeWidth: $event.detail.strokeWidth, opacity: $event.detail.opacity },
}])"

@flow-circle-draw="addNodes([{
    id: 'ann-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    position: { x: 0, y: 0 },
    draggable: false, selectable: false,
    class: 'flow-node-annotation',
    data: { annotation: 'circle', cx: $event.detail.cx, cy: $event.detail.cy, rx: $event.detail.rx, ry: $event.detail.ry, strokeColor: $event.detail.strokeColor, strokeWidth: $event.detail.strokeWidth, opacity: $event.detail.opacity },
}])"

@flow-text-draw="addNodes([{
    id: 'ann-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    position: { x: $event.detail.position.x, y: $event.detail.position.y },
    draggable: false, selectable: false,
    class: 'flow-node-annotation',
    data: { annotation: 'text', text: '', strokeColor: $event.detail.strokeColor, fontSize: $event.detail.fontSize, opacity: $event.detail.opacity },
}])"
```

These event attributes go on the same element as the `x-flow-freehand` directives (the `.flow-container`).

> **WireFlow note:** In WireFlow's `<x-flow>`, use `$el.addEventListener()` in `x-init` instead of `@event` attributes. See [Listening for drawing events in WireFlow](#listening-for-drawing-events-in-wireflow) above.

### Annotation node templates

Annotations are stored as nodes with `class: 'flow-node-annotation'` and a `data.annotation` field that identifies the type. Your `x-for` node template must render each type:

```html
<template x-for="node in nodes" :key="node.id">
    <div x-flow-node="node">
        <!-- Freehand / Highlighter: filled SVG path -->
        <template x-if="node.data?.annotation === 'drawing' || node.data?.annotation === 'highlight'">
            <svg style="position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;">
                <path :d="node.data.pathData"
                      :fill="node.data.strokeColor || '#334155'"
                      :opacity="node.data.opacity ?? 1"
                      stroke="none" />
            </svg>
        </template>

        <!-- Rectangle: dashed border div -->
        <template x-if="node.data?.annotation === 'rectangle'">
            <div :style="'pointer-events:none;width:'+node.data.w+'px;height:'+node.data.h+'px;border:'+(node.data.strokeWidth||2)+'px dashed '+(node.data.strokeColor||'rgba(148,163,184,0.7)')+';background:rgba(148,163,184,0.08);border-radius:4px;opacity:'+(node.data.opacity??1)+';'"></div>
        </template>

        <!-- Arrow: SVG line with arrowhead marker -->
        <template x-if="node.data?.annotation === 'arrow'">
            <svg style="position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;">
                <defs>
                    <marker :id="'arrow-marker-'+node.id" viewBox="0 0 10 10" refX="10" refY="5"
                            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" :fill="node.data.strokeColor || '#334155'" />
                    </marker>
                </defs>
                <line :x1="node.data.start.x" :y1="node.data.start.y"
                      :x2="node.data.end.x" :y2="node.data.end.y"
                      :stroke="node.data.strokeColor || '#334155'"
                      :stroke-width="node.data.strokeWidth || 2"
                      :opacity="node.data.opacity ?? 1"
                      :marker-end="'url(#arrow-marker-'+node.id+')'" />
            </svg>
        </template>

        <!-- Circle: SVG ellipse -->
        <template x-if="node.data?.annotation === 'circle'">
            <svg style="position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;">
                <ellipse :cx="node.data.cx" :cy="node.data.cy"
                         :rx="node.data.rx" :ry="node.data.ry"
                         fill="rgba(148,163,184,0.08)"
                         :stroke="node.data.strokeColor || '#334155'"
                         :stroke-width="node.data.strokeWidth || 2"
                         :opacity="node.data.opacity ?? 1" />
            </svg>
        </template>

        <!-- Text: contenteditable div -->
        <template x-if="node.data?.annotation === 'text'">
            <div contenteditable="true"
                 @blur="node.data.text = $el.textContent; if (!$el.textContent.trim()) removeNodes([node.id])"
                 :style="'font-size:'+(node.data.fontSize||18)+'px;color:'+(node.data.strokeColor||'#334155')+';min-width:50px;min-height:1em;outline:none;white-space:pre;opacity:'+(node.data.opacity??1)+';'"
                 x-text="node.data.text"
                 x-init="if (!node.data.text) $nextTick(() => $el.focus())"></div>
        </template>

        <!-- Regular node (non-annotation) -->
        <template x-if="!node.data?.annotation">
            <div>
                <span x-text="node.data?.label"></span>
            </div>
        </template>
    </div>
</template>
```

Key points:
- Annotation SVGs use `position:absolute;width:1px;height:1px;overflow:visible` to render at flow coordinates without affecting node sizing
- `draggable: false` and `selectable: false` prevent annotations from being interacted with as nodes
- `.flow-node-annotation` CSS class strips default node styling (background, border, shadow)
- The eraser tool doesn't need an event listener — it deletes nodes directly

## Annotations as Nodes

All annotations are stored as regular nodes via `addNodes()`. This means they automatically integrate with:

- **Undo/redo** — annotation creation and deletion are part of the history stack.
- **Collaboration** — annotations sync across users via Yjs shared types.

The `.flow-node-annotation` CSS class is applied to annotation nodes, which strips the default node styling (background, border, shadow) so the drawn content renders cleanly.

## Events

Each tool emits a custom event when a drawing action completes:

| Event | Emitted by |
|---|---|
| `flow-freehand-end` | `x-flow-freehand` |
| `flow-highlight-end` | `x-flow-highlighter` |
| `flow-arrow-draw` | `x-flow-arrow-draw` |
| `flow-circle-draw` | `x-flow-circle-draw` |
| `flow-rectangle-draw` | `x-flow-rectangle-draw` |
| `flow-text-draw` | `x-flow-text-tool` |

## Eraser

The eraser tool uses a drag-to-paint interaction model. Drag over elements to mark them for deletion, then release to remove them. Internally, it uses segment-rect intersection to determine which elements fall under the eraser path.

## See Also

- [Installation > Addons](../getting-started/installation.md#optional-addons)
