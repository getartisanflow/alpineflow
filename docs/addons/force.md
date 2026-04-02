---
title: Force Layout
description: Force-directed graph layout using d3-force.
order: 4
---

# Force Layout

The Force Layout addon provides force-directed graph layout using [d3-force](https://github.com/d3/d3-force). It produces organic, physics-based layouts where connected nodes attract and unconnected nodes repel each other.

Click "Apply" to run the force simulation — nodes settle into a balanced arrangement:

::demo
```toolbar
<button id="demo-force-apply" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Apply</button>
<button id="demo-force-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 50, y: 50 }, data: { label: 'A' } },
        { id: 'b', position: { x: 60, y: 60 }, data: { label: 'B' } },
        { id: 'c', position: { x: 70, y: 70 }, data: { label: 'C' } },
        { id: 'd', position: { x: 80, y: 80 }, data: { label: 'D' } },
        { id: 'e', position: { x: 90, y: 90 }, data: { label: 'E' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
        { id: 'e3', source: 'b', target: 'd' },
        { id: 'e4', source: 'c', target: 'd' },
        { id: 'e5', source: 'd', target: 'e' },
        { id: 'e6', source: 'c', target: 'e' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       document.getElementById('demo-force-apply').addEventListener('click', () => $flow.forceLayout({ duration: 500 }));
       document.getElementById('demo-force-reset').addEventListener('click', () => {
           let i = 0;
           for (const n of nodes) { n.position = { x: 50 + i * 10, y: 50 + i * 10 }; i++; }
           fitView({ padding: 0.2 });
       });
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

## Installation

Install the required peer dependency:

```bash
npm install d3-force
```

Then register the plugin:

```js
import AlpineFlowForce from '@getartisanflow/alpineflow/force'

Alpine.plugin(AlpineFlowForce)
```

## With WireFlow

If you're using [WireFlow](https://artisanflow.dev/docs/wireflow) (AlpineFlow's Livewire integration), the core is loaded from the WireFlow vendor bundle. Addons work seamlessly — they share a global registry with the core, regardless of how each was loaded.

```js
// Core from WireFlow vendor bundle
import AlpineFlow from '../../vendor/getartisanflow/wireflow/dist/alpineflow.bundle.esm.js';
// Addon from npm
import AlpineFlowForce from '@getartisanflow/alpineflow/force';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineFlow);
    window.Alpine.plugin(AlpineFlowForce);
});
```

## Usage

Trigger a force layout from any Alpine expression or action using the `$flow` magic:

```js
$flow.forceLayout({ charge: -500, duration: 500 })
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `strength` | `number` | `0.1` | Link force strength — how strongly connected nodes pull toward each other |
| `distance` | `number` | `100` | Ideal link distance between connected nodes |
| `charge` | `number` | `-300` | Charge force (negative values repel, positive attract) |
| `iterations` | `number` | `300` | Number of simulation ticks to run |
| `center` | `{ x, y }` | `undefined` | Center point for the centering force |
| `fitView` | `boolean` | `true` | Fit the viewport to the laid-out graph after layout completes |
| `duration` | `number` | `0` | Animation duration in milliseconds (0 for instant) |

Try different charge values — stronger repulsion spreads nodes further apart:

::demo
```toolbar
<button id="demo-force-tight" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Tight (-100)</button>
<button id="demo-force-normal" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Normal (-300)</button>
<button id="demo-force-spread" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Spread (-800)</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
        { id: 'b', position: { x: 10, y: 10 }, data: { label: 'B' } },
        { id: 'c', position: { x: 20, y: 20 }, data: { label: 'C' } },
        { id: 'd', position: { x: 30, y: 30 }, data: { label: 'D' } },
        { id: 'e', position: { x: 40, y: 40 }, data: { label: 'E' } },
        { id: 'f', position: { x: 50, y: 50 }, data: { label: 'F' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
        { id: 'e3', source: 'b', target: 'd' },
        { id: 'e4', source: 'c', target: 'e' },
        { id: 'e5', source: 'd', target: 'f' },
        { id: 'e6', source: 'e', target: 'f' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       document.getElementById('demo-force-tight').addEventListener('click', () => $flow.forceLayout({ charge: -100, duration: 500 }));
       document.getElementById('demo-force-normal').addEventListener('click', () => $flow.forceLayout({ charge: -300, duration: 500 }));
       document.getElementById('demo-force-spread').addEventListener('click', () => $flow.forceLayout({ charge: -800, duration: 500 }));
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

## See Also

- [Configuration > Auto-Layout](../configuration/features.md#auto-layout)
- [$flow Magic](../api/flow-magic/index.md)
