---
title: ELK Layout
description: Advanced layout algorithms via Eclipse Layout Kernel.
order: 6
---

# ELK Layout

The ELK Layout addon provides access to the full suite of layout algorithms from the [Eclipse Layout Kernel](https://www.eclipse.org/elk/) via [elkjs](https://github.com/kieler/elkjs). ELK offers comprehensive layout strategies including layered, stress, tree, radial, and force.

Click to apply different layout directions:

::demo
```toolbar
<button id="demo-elk-down" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Down</button>
<button id="demo-elk-right" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Right</button>
<button id="demo-elk-up" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Up</button>
<button id="demo-elk-left" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Left</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 50, y: 50 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 100, y: 0 }, data: { label: 'Review' } },
        { id: 'd', position: { x: 150, y: 50 }, data: { label: 'Approve' } },
        { id: 'e', position: { x: 200, y: 100 }, data: { label: 'End' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
        { id: 'e3', source: 'b', target: 'd' },
        { id: 'e4', source: 'c', target: 'd' },
        { id: 'e5', source: 'd', target: 'e' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       $flow.elkLayout({ direction: 'DOWN', duration: 0 });
       document.getElementById('demo-elk-down').addEventListener('click', () => $flow.elkLayout({ direction: 'DOWN', duration: 300 }));
       document.getElementById('demo-elk-right').addEventListener('click', () => $flow.elkLayout({ direction: 'RIGHT', duration: 300 }));
       document.getElementById('demo-elk-up').addEventListener('click', () => $flow.elkLayout({ direction: 'UP', duration: 300 }));
       document.getElementById('demo-elk-left').addEventListener('click', () => $flow.elkLayout({ direction: 'LEFT', duration: 300 }));
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
npm install elkjs
```

Then register the plugin:

```js
import AlpineFlowElk from '@getartisanflow/alpineflow/elk'

Alpine.plugin(AlpineFlowElk)
```

## With WireFlow

If you're using [WireFlow](https://artisanflow.dev/docs/wireflow) (AlpineFlow's Livewire integration), the core is loaded from the WireFlow vendor bundle. Addons work seamlessly — they share a global registry with the core, regardless of how each was loaded.

```js
// Core from WireFlow vendor bundle
import AlpineFlow from '../../vendor/getartisanflow/wireflow/dist/alpineflow.bundle.esm.js';
// Addon from npm
import AlpineFlowElk from '@getartisanflow/alpineflow/elk';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineFlow);
    window.Alpine.plugin(AlpineFlowElk);
});
```

## Usage

Trigger an ELK layout from any Alpine expression or action using the `$flow` magic:

```js
$flow.elkLayout({ algorithm: 'layered', direction: 'DOWN' })
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `algorithm` | `string` | `'layered'` | Layout algorithm (see table below) |
| `direction` | `string` | `'DOWN'` | Layout direction: `'DOWN'`, `'RIGHT'`, `'UP'`, `'LEFT'` |
| `nodeSpacing` | `number` | `50` | Minimum spacing between nodes |
| `layerSpacing` | `number` | `50` | Minimum spacing between layers (for layered/mrtree algorithms) |
| `adjustHandles` | `boolean` | `true` | Automatically set handle positions to match the layout direction |
| `fitView` | `boolean` | `true` | Fit the viewport to the laid-out graph after layout completes |
| `duration` | `number` | `0` | Animation duration in milliseconds (0 for instant) |

### Algorithms

| Algorithm | Description |
|---|---|
| `'layered'` | Layer-based approach for directed graphs. Produces clean hierarchical layouts with minimal edge crossings. |
| `'stress'` | Stress-minimization layout. Positions nodes so that graph-theoretic distances match geometric distances. |
| `'mrtree'` | Tree layout optimized for graphs with a tree structure. |
| `'radial'` | Places nodes in concentric circles radiating outward from a root node. |
| `'force'` | Force-directed layout similar to d3-force but with ELK's implementation. |

Try different algorithms — each produces a distinct arrangement:

::demo
```toolbar
<button id="demo-elk-layered" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Layered</button>
<button id="demo-elk-stress" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Stress</button>
<button id="demo-elk-mrtree" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">MR Tree</button>
<button id="demo-elk-force" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Force</button>
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
       $flow.elkLayout({ algorithm: 'layered', duration: 0 });
       document.getElementById('demo-elk-layered').addEventListener('click', () => $flow.elkLayout({ algorithm: 'layered', duration: 300 }));
       document.getElementById('demo-elk-stress').addEventListener('click', () => $flow.elkLayout({ algorithm: 'stress', duration: 300 }));
       document.getElementById('demo-elk-mrtree').addEventListener('click', () => $flow.elkLayout({ algorithm: 'mrtree', duration: 300 }));
       document.getElementById('demo-elk-force').addEventListener('click', () => $flow.elkLayout({ algorithm: 'force', duration: 300 }));
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
