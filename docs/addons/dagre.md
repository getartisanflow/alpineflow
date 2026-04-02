---
title: Dagre Layout
description: Automatic hierarchical layout using the dagre algorithm.
order: 3
---

# Dagre Layout

The Dagre Layout addon provides automatic hierarchical graph layout using the [dagre](https://github.com/dagrejs/dagre) algorithm. It is well-suited for directed acyclic graphs, org charts, and tree-like structures.

Click the buttons to apply different layout directions:

::demo
```toolbar
<button id="demo-dagre-tb" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Top → Bottom</button>
<button id="demo-dagre-lr" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Left → Right</button>
<button id="demo-dagre-bt" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Bottom → Top</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 50, y: 50 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 100, y: 100 }, data: { label: 'Review' } },
        { id: 'd', position: { x: 150, y: 50 }, data: { label: 'Approve' } },
        { id: 'e', position: { x: 200, y: 150 }, data: { label: 'End' } },
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
        document.getElementById('demo-dagre-tb').addEventListener('click', () => $flow.layout({ direction: 'TB', duration: 300 }));
        document.getElementById('demo-dagre-lr').addEventListener('click', () => $flow.layout({ direction: 'LR', duration: 300 }));
        document.getElementById('demo-dagre-bt').addEventListener('click', () => $flow.layout({ direction: 'BT', duration: 300 }));
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
npm install @dagrejs/dagre
```

Then register the plugin:

```js
import AlpineFlowDagre from '@getartisanflow/alpineflow/dagre'

Alpine.plugin(AlpineFlowDagre)
```

## With WireFlow

If you're using [WireFlow](https://artisanflow.dev/docs/wireflow) (AlpineFlow's Livewire integration), the core is loaded from the WireFlow vendor bundle. Addons work seamlessly — they share a global registry with the core, regardless of how each was loaded.

```js
// Core from WireFlow vendor bundle
import AlpineFlow from '../../vendor/getartisanflow/wireflow/dist/alpineflow.bundle.esm.js';
// Addon from npm
import AlpineFlowDagre from '@getartisanflow/alpineflow/dagre';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineFlow);
    window.Alpine.plugin(AlpineFlowDagre);
});
```

## Usage

Trigger a layout from any Alpine expression or action using the `$flow` magic:

```js
$flow.layout({ direction: 'TB', duration: 300 })
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `direction` | `string` | `'TB'` | Layout direction: `'TB'` (top-bottom), `'LR'` (left-right), `'BT'` (bottom-top), `'RL'` (right-left) |
| `nodesep` | `number` | `50` | Horizontal spacing between nodes in the same rank |
| `ranksep` | `number` | `50` | Spacing between ranks (layers) |
| `adjustHandles` | `boolean` | `true` | Automatically set handle positions to match the layout direction |
| `fitView` | `boolean` | `true` | Fit the viewport to the laid-out graph after layout completes |
| `duration` | `number` | `0` | Animation duration in milliseconds (0 for instant) |

## Auto-Layout

You can configure dagre as the automatic layout algorithm. When enabled, the graph re-layouts on structural changes (node/edge additions and removals):

```html
<div x-data="flowCanvas({
    nodes,
    edges,
    autoLayout: {
        algorithm: 'dagre',
        direction: 'LR',
    },
})">
</div>
```

Add a node and watch the layout update automatically:

::demo
```toolbar
<button id="demo-autolayout-add" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Add Node</button>
<button id="demo-autolayout-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Root' } },
        { id: 'b', position: { x: 0, y: 0 }, data: { label: 'Child 1' } },
        { id: 'c', position: { x: 0, y: 0 }, data: { label: 'Child 2' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
    ],
    autoLayout: { algorithm: 'dagre', direction: 'TB' },
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
})" class="flow-container" style="height: 250px;"
   x-init="
        let counter = 0;
        document.getElementById('demo-autolayout-add').addEventListener('click', () => {
            counter++;
            let parent = nodes[Math.floor(Math.random() * nodes.length)].id;
            let id = 'new-' + counter;
            addNodes([{ id, position: { x: 0, y: 0 }, data: { label: 'Node ' + counter } }]);
            addEdges([{ id: 'enew-' + counter, source: parent, target: id }]);
        });
        document.getElementById('demo-autolayout-reset').addEventListener('click', () => {
            counter = 0;
            removeNodes(nodes.map(n => n.id));
            $nextTick(() => {
                addNodes([
                    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Root' } },
                    { id: 'b', position: { x: 0, y: 0 }, data: { label: 'Child 1' } },
                    { id: 'c', position: { x: 0, y: 0 }, data: { label: 'Child 2' } },
                ]);
                addEdges([
                    { id: 'e1', source: 'a', target: 'b' },
                    { id: 'e2', source: 'a', target: 'c' },
                ]);
            });
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

## See Also

- [Configuration > Auto-Layout](../configuration/features.md#auto-layout)
- [$flow Magic](../api/flow-magic/index.md)
