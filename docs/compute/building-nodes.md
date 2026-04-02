---
title: Building Compute Nodes
description: Designing nodes with input/output ports and configuration.
order: 4
---

# Building Compute Nodes

A compute node combines a visual template with a registered compute function. The template defines the ports (handles) and display, while the compute function defines the data transformation.

A constant node feeds its configured value to a formatter that outputs a string:

::demo
```toolbar
<button id="demo-build-compute" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Compute</button>
```
```html
<template id="demo-const-node">
    <div style="min-width: 110px;">
        <div x-flow-handle:target.left></div>
        <div style="font-weight: 600; font-size: 12px;" x-text="node.data.label"></div>
        <div style="font-size: 11px; opacity: 0.5;" x-text="'value: ' + node.data.value"></div>
        <div style="font-size: 12px; font-family: monospace; color: #22c55e;"
             x-text="node.data.$outputs ? Object.values(node.data.$outputs)[0] : ''"></div>
        <div x-flow-handle:source.right="'value'"></div>
    </div>
</template>
<template id="demo-format-node">
    <div style="min-width: 130px;">
        <div x-flow-handle:target.left="'input'"></div>
        <div style="font-weight: 600; font-size: 12px;" x-text="node.data.label"></div>
        <div style="font-size: 11px; opacity: 0.5;" x-text="'prefix: ' + node.data.prefix"></div>
        <div style="font-size: 12px; font-family: monospace; color: #22c55e;"
             x-text="node.data.$outputs ? node.data.$outputs.text : ''"></div>
        <div x-flow-handle:source.right="'text'"></div>
    </div>
</template>
<div x-data="flowCanvas({
    nodes: [
        { id: 'n1', type: 'const', position: { x: 0, y: 0 }, data: { label: 'Constant', value: 42 } },
        { id: 'n2', type: 'format', position: { x: 250, y: 0 }, data: { label: 'Formatter', prefix: 'Result: ' } },
    ],
    edges: [
        { id: 'e1', source: 'n1', sourceHandle: 'value', target: 'n2', targetHandle: 'input' },
    ],
    nodeTypes: { 'const': '#demo-const-node', 'format': '#demo-format-node' },
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       registerCompute('const', { compute: (inputs, data) => ({ value: data.value ?? 0 }) });
       registerCompute('format', { compute: (inputs, data) => ({ text: (data.prefix ?? '') + (inputs.input ?? '') }) });
       document.getElementById('demo-build-compute').addEventListener('click', () => compute());
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node"></div>
        </template>
    </div>
</div>
```
::enddemo

## Anatomy of a compute node

A compute node has three parts:

1. **Node data** — configuration stored in `node.data` (constants, labels, settings)
2. **Handles** — named input/output ports defined in the template
3. **Compute function** — transforms inputs + node data into outputs

```js
// 1. Node data
{ id: 'n1', type: 'multiplier', data: { label: 'x3', factor: 3 } }

// 2. Handles in the template
<div x-flow-handle:target.left="'input'"></div>
<div x-flow-handle:source.right="'output'"></div>

// 3. Compute function
registerCompute('multiplier', {
    compute(inputs, nodeData) {
        return { output: (inputs.input ?? 0) * (nodeData.factor ?? 1) };
    }
});
```

## Using node data for configuration

The second argument to `compute()` is the node's `data` object. Use it to make nodes configurable without changing the compute function:

```js
registerCompute('threshold', {
    compute(inputs, nodeData) {
        const value = inputs.value ?? 0;
        const limit = nodeData.limit ?? 100;
        return {
            pass: value >= limit,
            value: value,
        };
    }
});

// Two threshold nodes with different limits
{ id: 'low', type: 'threshold', data: { label: 'Low Check', limit: 10 } }
{ id: 'high', type: 'threshold', data: { label: 'High Check', limit: 100 } }
```

## Multiple input ports

Nodes can have any number of named input handles. Each handle name maps to a key in the `inputs` object:

```html
<!-- Three input ports -->
<div x-flow-handle:target.left="'a'" style="top: 20%;"></div>
<div x-flow-handle:target.left="'b'" style="top: 50%;"></div>
<div x-flow-handle:target.left="'c'" style="top: 80%;"></div>
```

```js
registerCompute('mixer', {
    compute(inputs) {
        return {
            mixed: (inputs.a ?? 0) + (inputs.b ?? 0) + (inputs.c ?? 0),
        };
    }
});
```

## Multiple output ports

Similarly, a node can produce multiple named outputs routed to different downstream nodes:

```html
<!-- Two output ports -->
<div x-flow-handle:source.right="'pass'" style="top: 30%;"></div>
<div x-flow-handle:source.right="'fail'" style="top: 70%;"></div>
```

```js
registerCompute('splitter', {
    compute(inputs) {
        const value = inputs.input ?? 0;
        return {
            pass: value >= 50 ? value : null,
            fail: value < 50 ? value : null,
        };
    }
});

// Route each output to different downstream nodes
{ source: 'splitter', sourceHandle: 'pass', target: 'success-handler', targetHandle: 'input' }
{ source: 'splitter', sourceHandle: 'fail', target: 'error-handler', targetHandle: 'input' }
```

## Combining with nodeTypes

For reusable compute nodes, pair `registerCompute` with `nodeTypes` templates:

```html
<!-- Template: handles + display -->
<template id="adder-node">
    <div>
        <div x-flow-handle:target.left="'a'" style="top: 30%;"></div>
        <div x-flow-handle:target.left="'b'" style="top: 70%;"></div>
        <div x-text="node.data.label"></div>
        <div x-text="node.data.$outputs?.sum ?? '—'"></div>
        <div x-flow-handle:source.right="'sum'"></div>
    </div>
</template>

<!-- Config: register both type and compute -->
<div x-data="flowCanvas({
    nodeTypes: { adder: '#adder-node' },
})" x-init="
    registerCompute('adder', {
        compute: (inputs) => ({ sum: (inputs.a ?? 0) + (inputs.b ?? 0) })
    });
">
```

Then use it:

```js
{ id: 'add1', type: 'adder', position: { x: 300, y: 0 }, data: { label: 'Add' } }
```

The template handles the visual layout, handles define the ports, and the compute function defines the math. All three are decoupled.

## See also

- [Overview](overview.md) -- registerCompute and port routing
- [Reactive Data](reactive-data.md) -- displaying $inputs and $outputs
- [Node Types](../nodes/basics.md#node-types) -- template registration
- [Named Handles](../handles/positions.md#multiple-handles) -- multiple handle ports
