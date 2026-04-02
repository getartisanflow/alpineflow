---
title: Edge Cases
description: Cycles, missing inputs, and error handling.
order: 5
---

# Edge Cases

The compute engine handles several edge cases gracefully. Understanding these behaviors helps you build robust compute flows.

## Unregistered node types

Nodes without a registered compute function are **silently skipped**. They don't produce outputs and don't block downstream computation.

```js
// Only 'source' is registered — 'display' has no compute
registerCompute('source', { compute: () => ({ out: 10 }) });

// 'display' node is skipped, no error thrown
{ id: 'n1', type: 'source', ... }
{ id: 'n2', type: 'display', ... }  // no compute registered
```

This is intentional — not every node type needs computation. Display-only nodes, groups, and annotation nodes can coexist in the same graph without registering compute functions.

## Missing inputs

When an input port has no incoming edge, its value is `undefined` in the `inputs` object. Always provide defaults:

```js
registerCompute('adder', {
    compute(inputs) {
        // Safe: defaults to 0 if not connected
        return { sum: (inputs.a ?? 0) + (inputs.b ?? 0) };
    }
});
```

A node with three input ports but only one connected will have two `undefined` values in `inputs`. The compute function runs regardless — it's up to you to handle missing values.

## Disconnected nodes

Nodes with no incoming edges receive an empty `inputs` object (`{}`). Source nodes (the start of a pipeline) always operate this way:

```js
registerCompute('constant', {
    compute(inputs, nodeData) {
        // inputs is {} — this node generates data from its own config
        return { value: nodeData.value ?? 0 };
    }
});
```

## Cycles

The engine uses Kahn's algorithm for topological sorting. If the graph contains cycles (A → B → A), the cycle is broken by processing the remaining nodes after the acyclic portion completes.

Cyclic nodes are appended at the end and computed with whatever inputs are available at that point. This prevents infinite loops but means cycle results may be incomplete or stale.

> **Tip:** Use `preventCycles: true` in your canvas config to prevent users from creating cyclic connections in the first place.

```js
flowCanvas({
    preventCycles: true, // reject edges that would create cycles
})
```

## Compute function errors

If a compute function throws an error, that node's outputs are not written and downstream nodes receive `undefined` for that port. The engine continues processing other nodes — one failing node doesn't break the entire graph.

```js
registerCompute('risky', {
    compute(inputs) {
        // If this throws, downstream nodes get undefined
        const result = JSON.parse(inputs.raw);
        return { parsed: result };
    }
});
```

For production use, wrap risky operations in try/catch within your compute function:

```js
registerCompute('safe-parser', {
    compute(inputs) {
        try {
            return { parsed: JSON.parse(inputs.raw), error: null };
        } catch (e) {
            return { parsed: null, error: e.message };
        }
    }
});
```

## Partial recomputation scope

When calling `compute(startNodeId)`, only the start node and its downstream dependents are recomputed. Upstream nodes retain their previous `$outputs`.

If an upstream node's data changed but you only recompute from a midpoint, the upstream change won't propagate. Call `compute()` without arguments to recompute the entire graph.

```js
// Full recomputation — all nodes
$flow.compute();

// Partial — only from 'node-3' downstream
$flow.compute('node-3');
```

## Nodes added after registerCompute

Compute definitions are registered on the engine globally. Adding new nodes with an already-registered type works immediately — the next `compute()` call includes them.

In auto mode (`computeMode: 'auto'`), adding a node triggers a `nodes-change` event which automatically runs `compute()`.

## See also

- [Overview](overview.md) -- registerCompute and port routing
- [Manual vs Auto](modes.md) -- controlling when computation runs
- [Configuration](../configuration/features.md#compute-engine) -- preventCycles and computeMode
