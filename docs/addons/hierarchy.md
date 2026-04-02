---
title: Tree Layout
description: Tree and cluster layouts using d3-hierarchy.
order: 5
---

# Tree Layout

The Tree Layout addon provides tree and cluster layout algorithms using [d3-hierarchy](https://github.com/d3/d3-hierarchy). It is ideal for visualizing hierarchical data with a single root node, such as file systems, org charts, or decision trees.

Click the buttons to apply different layout directions:

::demo
```toolbar
<button id="demo-tree-tb" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Top → Bottom</button>
<button id="demo-tree-lr" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Left → Right</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'root', position: { x: 0, y: 0 }, data: { label: 'CEO' } },
        { id: 'eng', position: { x: 0, y: 0 }, data: { label: 'Engineering' } },
        { id: 'design', position: { x: 0, y: 0 }, data: { label: 'Design' } },
        { id: 'fe', position: { x: 0, y: 0 }, data: { label: 'Frontend' } },
        { id: 'be', position: { x: 0, y: 0 }, data: { label: 'Backend' } },
        { id: 'ux', position: { x: 0, y: 0 }, data: { label: 'UX' } },
    ],
    edges: [
        { id: 'e1', source: 'root', target: 'eng' },
        { id: 'e2', source: 'root', target: 'design' },
        { id: 'e3', source: 'eng', target: 'fe' },
        { id: 'e4', source: 'eng', target: 'be' },
        { id: 'e5', source: 'design', target: 'ux' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       $flow.treeLayout({ direction: 'TB', duration: 0 });
       document.getElementById('demo-tree-tb').addEventListener('click', () => $flow.treeLayout({ direction: 'TB', duration: 300 }));
       document.getElementById('demo-tree-lr').addEventListener('click', () => $flow.treeLayout({ direction: 'LR', duration: 300 }));
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
npm install d3-hierarchy
```

Then register the plugin:

```js
import AlpineFlowHierarchy from '@getartisanflow/alpineflow/hierarchy'

Alpine.plugin(AlpineFlowHierarchy)
```

## With WireFlow

If you're using [WireFlow](https://artisanflow.dev/docs/wireflow) (AlpineFlow's Livewire integration), the core is loaded from the WireFlow vendor bundle. Addons work seamlessly — they share a global registry with the core, regardless of how each was loaded.

```js
// Core from WireFlow vendor bundle
import AlpineFlow from '../../vendor/getartisanflow/wireflow/dist/alpineflow.bundle.esm.js';
// Addon from npm
import AlpineFlowHierarchy from '@getartisanflow/alpineflow/hierarchy';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineFlow);
    window.Alpine.plugin(AlpineFlowHierarchy);
});
```

## Usage

Trigger a tree layout from any Alpine expression or action using the `$flow` magic:

```js
$flow.treeLayout({ layoutType: 'tree', direction: 'TB' })
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `layoutType` | `string` | `'tree'` | Layout algorithm: `'tree'` (tidy tree) or `'cluster'` (dendrogram — all leaves at the same depth) |
| `direction` | `string` | `'TB'` | Layout direction: `'TB'` (top-bottom) or `'LR'` (left-right) |
| `nodeWidth` | `number` | `150` | Horizontal spacing allocated per node |
| `nodeHeight` | `number` | `100` | Vertical spacing allocated per node |
| `adjustHandles` | `boolean` | `true` | Automatically set handle positions to match the layout direction |
| `fitView` | `boolean` | `true` | Fit the viewport to the laid-out graph after layout completes |
| `duration` | `number` | `0` | Animation duration in milliseconds (0 for instant) |

### Tree vs. Cluster

- **Tree** (`'tree'`) — a tidy tree layout that minimizes the width of the tree while keeping nodes at their natural depth.
- **Cluster** (`'cluster'`) — a dendrogram layout that places all leaf nodes at the same depth, useful for comparing terminal nodes.

Toggle between tree and cluster — notice how cluster aligns all leaf nodes:

::demo
```toolbar
<button id="demo-tree-type" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Tree</button>
<button id="demo-cluster-type" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Cluster</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'root', position: { x: 0, y: 0 }, data: { label: 'Root' } },
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
        { id: 'b', position: { x: 0, y: 0 }, data: { label: 'B' } },
        { id: 'a1', position: { x: 0, y: 0 }, data: { label: 'A-1' } },
        { id: 'a2', position: { x: 0, y: 0 }, data: { label: 'A-2' } },
        { id: 'b1', position: { x: 0, y: 0 }, data: { label: 'B-1' } },
    ],
    edges: [
        { id: 'e1', source: 'root', target: 'a' },
        { id: 'e2', source: 'root', target: 'b' },
        { id: 'e3', source: 'a', target: 'a1' },
        { id: 'e4', source: 'a', target: 'a2' },
        { id: 'e5', source: 'b', target: 'b1' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       $flow.treeLayout({ layoutType: 'tree', direction: 'TB', duration: 0 });
       document.getElementById('demo-tree-type').addEventListener('click', () => $flow.treeLayout({ layoutType: 'tree', direction: 'TB', duration: 300 }));
       document.getElementById('demo-cluster-type').addEventListener('click', () => $flow.treeLayout({ layoutType: 'cluster', direction: 'TB', duration: 300 }));
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
