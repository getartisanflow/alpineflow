---
title: Workflow
description: Workflow execution helper for AlpineFlow — run workflows, evaluate conditions, mirror edge state.
order: 6
---

# Workflow Addon

The workflow addon adds `$flow.run()` — a structured execution helper that walks your graph, manages node run-state transitions, evaluates conditions, fires particles, mirrors edge state via CSS classes, and maintains a reactive execution log.

## Installation

```js
import AlpineFlow from '@getartisanflow/alpineflow';
import AlpineFlowWorkflow from '@getartisanflow/alpineflow/workflow';

Alpine.plugin(AlpineFlow);
Alpine.plugin(AlpineFlowWorkflow);
```

## Quick start

```js
const handle = await $flow.run('trigger-node', {
    onEnter: async (node, ctx) => {
        console.log(`Running ${node.data.title}...`);
        return { result: await processNode(node, ctx.payload) };
    },
    onComplete: (ctx) => console.log('Workflow complete!', ctx.payload),
    onError: (err, node) => console.error(`Failed at ${node.id}:`, err),
}, {
    payload: { customer: 'Acme Co', plan: 'annual' },
    defaultDurationMs: 700,
    particleOnEdges: true,
});

// Control the run
handle.pause();
handle.resume();
handle.stop();
await handle.finished;
```

## Handlers

| Handler | Called when | Return value |
|---------|-------------|--------------|
| `onEnter(node, ctx)` | Before a node runs (async allowed) | Object → merged into `ctx.payload` + stored in `ctx.nodeResults[nodeId]` |
| `onExit(node, ctx)` | After a node completes (async allowed) | Object → merged into `ctx.payload` + stored in `ctx.nodeResults[nodeId + ':exit']` |
| `pickBranch(node, edges, ctx)` | When a node has multiple outgoing edges (async allowed) | Edge ID string → that edge is traversed |
| `onComplete(ctx)` | When the graph walk finishes | — |
| `onError(err, node, ctx)` | When `onEnter` throws | — |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `payload` | `{}` | Initial context payload passed to handlers |
| `defaultDurationMs` | `0` | Pacing delay between each node (visual effect) |
| `particleOnEdges` | `false` | Fire `$flow.sendParticle()` on each traversed edge |
| `lock` | `false` | Disable canvas interaction during execution |
| `muteUntakenBranches` | `false` | Apply `.flow-edge-untaken` to non-chosen edges at branch points |
| `logLimit` | `500` | Max execution log entries (FIFO eviction) |

## Condition nodes

Nodes with `type: 'flow-condition'` are auto-evaluated. Define the condition declaratively in `node.data.condition`:

```js
{
    id: 'is-annual',
    type: 'flow-condition',
    data: {
        condition: { field: 'plan', op: 'equals', value: 'annual' },
    },
}
```

Outgoing edges use `sourceHandle: 'true'` and `sourceHandle: 'false'`:

```js
{ id: 'e-yes', source: 'is-annual', target: 'welcome', sourceHandle: 'true' },
{ id: 'e-no',  source: 'is-annual', target: 'nudge',   sourceHandle: 'false' },
```

### Supported operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Strict equality | `{ field: 'plan', op: 'equals', value: 'annual' }` |
| `notEquals` | Strict inequality | `{ field: 'status', op: 'notEquals', value: 'cancelled' }` |
| `in` | Value in array | `{ field: 'region', op: 'in', value: ['US', 'CA'] }` |
| `notIn` | Value not in array | `{ field: 'role', op: 'notIn', value: ['admin'] }` |
| `greaterThan` | Numeric > | `{ field: 'amount', op: 'greaterThan', value: 100 }` |
| `lessThan` | Numeric < | `{ field: 'age', op: 'lessThan', value: 18 }` |
| `greaterThanOrEqual` | Numeric >= | `{ field: 'score', op: 'greaterThanOrEqual', value: 80 }` |
| `lessThanOrEqual` | Numeric <= | `{ field: 'retries', op: 'lessThanOrEqual', value: 3 }` |
| `exists` | Not null/undefined | `{ field: 'email', op: 'exists' }` |
| `matches` | Regex match | `{ field: 'code', op: 'matches', value: '^PRO-\\d+$' }` |

Dot-path field access: `{ field: 'customer.address.country', op: 'equals', value: 'US' }`.

For complex logic, use `node.data.evaluate`:

```js
data: {
    evaluate: (payload, ctx) => payload.amount > 1000 && payload.region === 'US',
}
```

## Wait nodes

Nodes with `type: 'flow-wait'` pause execution for a set duration without calling `onEnter`/`onExit`:

```js
{ id: 'cooldown', type: 'flow-wait', data: { durationMs: 2000 } }
```

## Edge state CSS classes

During execution, the addon auto-applies CSS classes to edges:

| Class | Applied when |
|-------|--------------|
| `.flow-edge-entering` | Node is running — incoming edges pulse |
| `.flow-edge-completed` | Node completed — incoming edges settle |
| `.flow-edge-taken` | Edge was traversed by the run helper |
| `.flow-edge-untaken` | Edge was NOT chosen at a branch point (requires `muteUntakenBranches: true`) |

All four classes are styled by the shipped themes. Override via CSS variables on `.flow-container`:

```css
.flow-container {
    --flow-edge-entering-stroke: #8B5CF6;
    --flow-edge-completed-stroke: #14B8A6;
    --flow-edge-taken-stroke: #14B8A6;
    --flow-edge-untaken-opacity: 0.35;
}
```

## Execution log

`$flow.executionLog` is a reactive array of structured events pushed during execution:

```js
$flow.executionLog
// [
//   { t: 1712756000100, type: 'run:started', payload: {...} },
//   { t: 1712756000105, type: 'node:enter', nodeId: 'trigger' },
//   { t: 1712756000605, type: 'node:exit', nodeId: 'trigger', runtimeMs: 500 },
//   { t: 1712756000610, type: 'edge:taken', edgeId: 'e1' },
//   ...
//   { t: 1712756004035, type: 'run:complete', payload: {...} },
// ]

$flow.resetExecutionLog(); // clear
```

Capped at `options.logLimit` (default 500) with FIFO eviction.

## Run handle

`$flow.run()` returns a `FlowRunHandle`:

```js
const handle = await $flow.run('start', handlers, options);

handle.pause();   // pause between nodes
handle.resume();  // continue from pause
handle.stop();    // abort execution

handle.isPaused;  // boolean
handle.isStopped; // boolean

const ctx = await handle.finished; // resolves when run completes
```

## WireFlow usage

In WireFlow Blade templates, use from Alpine scope:

```blade
<x-flow :nodes="$nodes" :edges="$edges">
    <x-flow-panel position="top-right">
        <button x-on:click="$flow.run('trigger', {
            onEnter: async (node, ctx) => { /* ... */ },
        }, { particleOnEdges: true, defaultDurationMs: 700 })">
            Run workflow
        </button>
    </x-flow-panel>
</x-flow>
```

Server-side `$this->flowSetNodeState()` and `$this->flowResetStates()` complement the addon for server-driven state pushes. The addon's `$flow.run()` handles client-side orchestration.

## See Also

- [runState (D2)](../migration/v0.2.1-alpha.md#runstate-d2)
- [$flow Magic](../api/flow-magic/index.md)
