---
title: Reactive Data
description: Displaying computed inputs and outputs in node templates.
order: 3
---

# Reactive Data

After `compute()` runs, each node's `data` object is updated with `$inputs` and `$outputs` properties. These are reactive — Alpine templates that reference them update automatically.

::demo
```toolbar
<button id="demo-reactive-compute" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Compute</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', type: 'const', position: { x: 0, y: 0 }, data: { label: 'Input A', value: 4 } },
        { id: 'b', type: 'const', position: { x: 0, y: 100 }, data: { label: 'Input B', value: 6 } },
        { id: 'c', type: 'multiply', position: { x: 280, y: 50 }, data: { label: 'Multiply' } },
    ],
    edges: [
        { id: 'e1', source: 'a', sourceHandle: 'value', target: 'c', targetHandle: 'a' },
        { id: 'e2', source: 'b', sourceHandle: 'value', target: 'c', targetHandle: 'b' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       registerCompute('const', { compute: (inputs, data) => ({ value: data.value ?? 0 }) });
       registerCompute('multiply', { compute: (inputs) => ({ product: (inputs.a ?? 0) * (inputs.b ?? 0) }) });
       document.getElementById('demo-reactive-compute').addEventListener('click', () => compute());
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" style="min-width: 120px;">
                <div x-flow-handle:target.left="'a'" x-show="node.type === 'multiply'" style="top: 30%;"></div>
                <div x-flow-handle:target.left="'b'" x-show="node.type === 'multiply'" style="top: 70%;"></div>
                <div style="font-weight: 600; font-size: 13px;" x-text="node.data.label"></div>
                <div style="font-size: 11px; opacity: 0.5;" x-text="node.data.$inputs ? 'in: ' + JSON.stringify(node.data.$inputs) : ''"></div>
                <div style="font-size: 12px; font-family: monospace; color: #22c55e;"
                     x-text="node.data.$outputs ? 'out: ' + JSON.stringify(node.data.$outputs) : ''"></div>
                <div x-flow-handle:source.right="'value'" x-show="node.type === 'const'"></div>
                <div x-flow-handle:source.right="'product'" x-show="node.type === 'multiply'"></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## $inputs and $outputs

After each `compute()` call, the engine writes two properties to every computed node's `data`:

| Property | Type | Description |
|----------|------|-------------|
| `node.data.$inputs` | `Record<string, any>` | Input values gathered from upstream edges, keyed by target handle name |
| `node.data.$outputs` | `Record<string, any>` | Output values returned by the compute function, keyed by source handle name |

These are plain objects on the reactive `data` — any Alpine expression that reads them will update when computation runs.

## Using in templates

Display computed values directly in node markup:

```html
<div x-flow-node="node">
    <span x-text="node.data.label"></span>

    <!-- Show the computed output -->
    <span x-text="node.data.$outputs?.result ?? 'pending'"></span>

    <!-- Show what inputs were received -->
    <span x-text="node.data.$inputs?.a ?? '—'"></span>
</div>
```

## Conditional rendering

Show different content based on whether computation has run:

```html
<template x-if="node.data.$outputs">
    <div x-text="'Result: ' + node.data.$outputs.sum"></div>
</template>
<template x-if="!node.data.$outputs">
    <div style="opacity: 0.5;">Not computed</div>
</template>
```

## Events

The `compute-complete` event fires after each `compute()` call with the full results map:

```js
@compute-complete="console.log($event.detail.results)"
```

The `results` detail is a `Map<string, Record<string, any>>` — node ID to output data for every node that had a registered compute function.

## See also

- [Overview](overview.md) -- registerCompute and port routing
- [Manual vs Auto](modes.md) -- choosing when computation runs
