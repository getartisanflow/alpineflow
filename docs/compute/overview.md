---
title: Overview
description: Data propagation through node graphs.
order: 1
---

# Compute Flows

The compute engine propagates data through your flow graph in topological order. Register compute functions per node type, connect nodes with edges, and the engine routes outputs to inputs through handle port names.

Two number nodes feed into an adder — click "Compute" to propagate:

::demo
```toolbar
<button id="demo-compute-run" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Compute</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'num1', type: 'number', position: { x: 0, y: 0 }, data: { label: 'Number', value: 3 } },
        { id: 'num2', type: 'number', position: { x: 0, y: 100 }, data: { label: 'Number', value: 7 } },
        { id: 'add', type: 'adder', position: { x: 300, y: 50 }, data: { label: 'Add' } },
    ],
    edges: [
        { id: 'e1', source: 'num1', sourceHandle: 'value', target: 'add', targetHandle: 'a' },
        { id: 'e2', source: 'num2', sourceHandle: 'value', target: 'add', targetHandle: 'b' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       registerCompute('number', { compute: (inputs, data) => ({ value: data.value ?? 0 }) });
       registerCompute('adder', { compute: (inputs) => ({ sum: (inputs.a ?? 0) + (inputs.b ?? 0) }) });
       document.getElementById('demo-compute-run').addEventListener('click', () => compute());
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" style="min-width: 120px;">
                <div x-flow-handle:target.left="'a'" x-show="node.type === 'adder'" style="top: 30%;"></div>
                <div x-flow-handle:target.left="'b'" x-show="node.type === 'adder'" style="top: 70%;"></div>
                <div style="font-weight: 600; font-size: 13px;" x-text="node.data.label"></div>
                <div style="font-size: 12px; font-family: monospace; opacity: 0.7;"
                     x-text="node.data.$outputs ? Object.values(node.data.$outputs).join(', ') : node.data.value ?? ''"></div>
                <div x-flow-handle:source.right="'value'" x-show="node.type === 'number'"></div>
                <div x-flow-handle:source.right="'sum'" x-show="node.type === 'adder'"></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## How it works

1. **Register** compute functions for each node type via `registerCompute()`
2. **Connect** nodes with edges — handle names route data between ports
3. **Run** `compute()` to propagate data in topological order
4. **Read** results from `node.data.$outputs` (reactive)

The engine sorts nodes topologically (sources first, sinks last) and runs each node's compute function with gathered inputs from upstream edges.

## registerCompute

Register a compute function for a node type:

```js
$flow.registerCompute('adder', {
    compute(inputs, nodeData) {
        return { sum: (inputs.a ?? 0) + (inputs.b ?? 0) };
    }
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputs` | `Record<string, any>` | Values gathered from upstream edges, keyed by target handle name |
| `nodeData` | `Record<string, any>` | The node's `data` object — use for node-specific configuration |
| **returns** | `Record<string, any>` | Output values keyed by source handle name |

## Port routing

Data flows through edges via **handle port names**. The edge's `sourceHandle` maps to an output key, and `targetHandle` maps to an input key:

```js
// Edge routes "value" output from num1 to "a" input on adder
{ source: 'num1', sourceHandle: 'value', target: 'adder', targetHandle: 'a' }
```

When handles are unnamed (no `sourceHandle` / `targetHandle`), the port name defaults to `'default'`:

```js
// Compute function using default port
registerCompute('passthrough', {
    compute: (inputs) => ({ default: inputs.default })
});
```

## See also

- [Manual vs Auto](modes.md) -- choosing when computation runs
- [Reactive Data](reactive-data.md) -- displaying computed values in node templates
- [Configuration](../configuration/features.md#compute-engine) -- `computeMode` option
