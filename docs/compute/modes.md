---
title: Manual vs Auto
description: Control when the compute engine runs.
order: 2
---

# Manual vs Auto

The compute engine supports two modes that control when data propagation runs.

## Manual mode (default)

In manual mode, computation only runs when you explicitly call `$flow.compute()`:

```js
flowCanvas({
    computeMode: 'manual', // default
})
```

This gives you full control over when data propagates — useful when you want to batch changes before computing, or trigger computation from a button or event.

Click "Compute" after changing the input values:

::demo
```toolbar
<button id="demo-manual-compute" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Compute</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', type: 'source', position: { x: 0, y: 0 }, data: { label: 'Source', value: 5 } },
        { id: 'b', type: 'double', position: { x: 250, y: 0 }, data: { label: 'Double' } },
    ],
    edges: [
        { id: 'e1', source: 'a', sourceHandle: 'out', target: 'b', targetHandle: 'in' },
    ],
    computeMode: 'manual',
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       registerCompute('source', { compute: (inputs, data) => ({ out: data.value ?? 0 }) });
       registerCompute('double', { compute: (inputs) => ({ result: (inputs.in ?? 0) * 2 }) });
       document.getElementById('demo-manual-compute').addEventListener('click', () => compute());
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" style="min-width: 100px;">
                <div x-flow-handle:target.left="'in'" x-show="node.type === 'double'"></div>
                <div style="font-weight: 600; font-size: 13px;" x-text="node.data.label"></div>
                <div style="font-size: 12px; font-family: monospace; opacity: 0.7;"
                     x-text="node.data.$outputs ? Object.values(node.data.$outputs)[0] : node.data.value ?? ''"></div>
                <div x-flow-handle:source.right="'out'" x-show="node.type === 'source'"></div>
                <div x-flow-handle:source.right="'result'" x-show="node.type === 'double'"></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

### Partial recomputation

Pass a node ID to `compute()` to only recompute that node and its downstream dependents:

```js
// Only recompute from node-3 forward
$flow.compute('node-3');
```

This skips upstream nodes that haven't changed, improving performance in large graphs.

## Auto mode

In auto mode, the engine re-propagates automatically whenever nodes or edges change (debounced at 16ms):

```js
flowCanvas({
    computeMode: 'auto',
})
```

Connect new edges or add nodes — computation runs automatically:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', type: 'source', position: { x: 0, y: 0 }, data: { label: 'Source', value: 10 } },
        { id: 'b', type: 'double', position: { x: 250, y: 0 }, data: { label: 'Double' } },
        { id: 'c', type: 'double', position: { x: 500, y: 0 }, data: { label: 'Double' } },
    ],
    edges: [
        { id: 'e1', source: 'a', sourceHandle: 'out', target: 'b', targetHandle: 'in' },
    ],
    computeMode: 'auto',
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       registerCompute('source', { compute: (inputs, data) => ({ out: data.value ?? 0 }) });
       registerCompute('double', { compute: (inputs) => ({ out: (inputs.in ?? 0) * 2 }) });
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" style="min-width: 100px;">
                <div x-flow-handle:target.left="'in'" x-show="node.type !== 'source'"></div>
                <div style="font-weight: 600; font-size: 13px;" x-text="node.data.label"></div>
                <div style="font-size: 12px; font-family: monospace; opacity: 0.7;"
                     x-text="node.data.$outputs ? Object.values(node.data.$outputs)[0] : node.data.value ?? ''"></div>
                <div x-flow-handle:source.right="'out'"></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

Auto mode triggers on `nodes-change` and `edges-change` events. It does **not** trigger when you modify `node.data` properties directly — call `compute()` manually for data-only changes.

## Choosing a mode

| Mode | Best for |
|------|----------|
| Manual | Forms, configuration editors, batch operations — compute on save/submit |
| Auto | Live data flow visualizations, real-time pipelines, educational tools |

## See also

- [Overview](overview.md) -- registerCompute and port routing
- [Reactive Data](reactive-data.md) -- displaying $inputs and $outputs
