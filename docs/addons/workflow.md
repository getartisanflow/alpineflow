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
    particleOptions: { renderer: 'orb', color: '#8B5CF6', size: 5, duration: 500 },
});

// Control the run
handle.pause();
handle.resume();
handle.stop();
await handle.finished;
```

### Auto-reset

Each call to `$flow.run()` automatically:

1. Resets all node `runState` values (via `resetStates()`)
2. Clears edge CSS classes from the previous run
3. Clears the execution log

No manual cleanup is needed between consecutive runs.

## Handlers

| Handler | Called when | Return value |
|---------|-------------|--------------|
| `onEnter(node, ctx)` | Before a node runs (async allowed) | Object → merged into `ctx.payload` + stored in `ctx.nodeResults[nodeId]` |
| `onExit(node, ctx)` | After a node completes (async allowed) | Object → merged into `ctx.payload` + stored in `ctx.nodeResults[nodeId + ':exit']` |
| `pickBranch(node, edges, ctx)` | When a node has multiple outgoing edges (async allowed) | Edge ID string → that edge is traversed; `null` → fall through to default behavior (parallel if multiple edges, linear if one) |
| `onComplete(ctx)` | When the graph walk finishes | — |
| `onError(err, node, ctx)` | When `onEnter` throws | — |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `payload` | `{}` | Initial context payload passed to handlers |
| `defaultDurationMs` | `0` | Pacing delay between each node (visual effect) |
| `particleOnEdges` | `false` | Fire `$flow.sendParticle()` on each traversed edge |
| `particleOptions` | `{}` | Options passed to `sendParticle()` — `renderer`, `color`, `size`, `duration`, etc. |
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
    evaluate: (payload) => payload.amount > 1000 && payload.region === 'US',
}
```

## Wait nodes

Nodes with `type: 'flow-wait'` pause execution for a set duration without calling `onEnter`/`onExit`:

```js
{ id: 'cooldown', type: 'flow-wait', data: { durationMs: 2000 } }
```

## Parallel branches

When a node has multiple outgoing edges and no `pickBranch` handler selects a single edge, **all edges are followed concurrently** via `Promise.all`. A shared `visited` Set prevents convergence (fan-in) nodes from running twice.

```
trigger ──┬──> slack ──────┬──> condition ──> welcome
          └──> audit-log ──┘           └──> nudge
```

In this topology:
- **Fan-out**: `trigger` has two outgoing edges → both `slack` and `audit-log` run in parallel
- **Fan-in**: Both branches converge at `condition` → the first branch to arrive claims it, the second skips (already visited)

Use `pickBranch` to select a single branch at decision points. Return `null` to fall through to the default parallel behavior:

```js
pickBranch: (node, outEdges, ctx) => {
    if (node.id === 'condition') {
        const annual = ctx.payload.plan === 'annual';
        return outEdges.find(e => e.sourceHandle === (annual ? 'true' : 'false'))?.id ?? null;
    }
    return null; // trigger: null = parallel (two edges); others: null = linear (one edge)
},
```

The execution log records `parallel:fork` events:

```js
{ type: 'parallel:fork', nodeId: 'trigger', payload: { branches: ['slack', 'audit-log'] } }
```

## Auto-skip

When a run completes, any node that was never visited (e.g., the untaken branch terminal at a condition) is automatically set to `runState: 'skipped'`. This provides visual feedback via the `.flow-node-skipped` CSS class without any consumer code.

## $workflowRun magic

The addon registers a `$workflowRun` Alpine magic that lets **any Alpine scope** invoke `$flow.run()` on the nearest canvas — no DOM traversal needed.

```html
<!-- Parent scope (toolbar, sidebar) — NOT inside the canvas -->
<div x-data="{ isRunning: false }">
    <button @click="$workflowRun('trigger', handlers, options)">
        Run workflow
    </button>

    <!-- Canvas scope -->
    <div x-data="flowCanvas({...})" class="flow-container">
        ...
    </div>
</div>
```

`$workflowRun` searches up (ancestor), then down (descendant), then falls back to `document.querySelector('.flow-container')`. It accepts the same three arguments as `$flow.run()`:

```js
$workflowRun(startId, handlers, options)
```

## Edge state CSS classes

During execution, the addon auto-applies CSS classes to edges:

| Class | Applied when |
|-------|--------------|
| `.flow-edge-entering` | Node is running — incoming edges pulse |
| `.flow-edge-completed` | Node completed — incoming edges settle |
| `.flow-edge-taken` | Edge was traversed by the run helper |
| `.flow-edge-untaken` | Edge was NOT chosen at a branch point (requires `muteUntakenBranches: true`) |
| `.flow-edge-failed` | Node failed — incoming edges turn red |

All five classes are styled by the shipped themes. Override via CSS variables on `.flow-container`:

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

### Log entry schema

Each entry has a `t` (timestamp) and `type`, plus optional fields depending on the event:

| Field | Type | Present on |
|-------|------|------------|
| `t` | `number` | All entries (Unix ms timestamp) |
| `type` | `string` | All entries |
| `nodeId` | `string` | `node:enter`, `node:exit`, `run:error`, `run:stopped`, `parallel:fork`, `wait:start`, `wait:end` |
| `edgeId` | `string` | `edge:taken`, `edge:untaken` |
| `payload` | `object` | `run:started`, `run:complete`, `run:error` (contains `{ error }`) , `parallel:fork` (contains `{ branches }`) |
| `runtimeMs` | `number` | `node:exit`, `wait:end` — elapsed time for that node |
| `outputs` | `object` | `node:exit` — the value returned from `onEnter` |

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

## Execution replay

`$flow.replayExecution()` replays a recorded execution log, re-applying state transitions and edge classes with scaled timing:

```js
// Replay at 2× speed
const replay = $flow.replayExecution(executionLog, { speed: 2 });

// Control playback
replay.pause();
replay.resume();
replay.stop();

await replay.finished; // resolves when replay completes
```

The replay reads timestamps from log entries to preserve the original timing between events (scaled by `speed`). It applies `setNodeState`, edge CSS classes, and particle emissions just as the original run did.

| Option | Default | Description |
|--------|---------|-------------|
| `speed` | `1` | Playback speed multiplier (2 = twice as fast) |
| `particleOnEdges` | `false` | Fire particles during replay |
| `particleOptions` | `{}` | Particle options for replay |

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

## Condition node template — `x-flow-condition` directive

Renders a workflow condition node with a header, a pretty-printed expression body, and three handles (target + true/false sources).

```blade
<x-flow :nodes="$nodes" :edges="$edges">
    <x-slot:node>
        <template x-if="node.type === 'flow-condition'">
            <div x-flow-condition class="flow-condition-node"></div>
        </template>
    </x-slot:node>
</x-flow>
```

Reads from `node.data`:

- `condition: { field, op, value }` — declarative condition (or use `evaluate` for custom logic)
- `evaluate: (payload) => boolean` — escape hatch for arbitrary predicates
- `label?: string` — optional header override (defaults to `Condition`)
- `direction?: 'horizontal' | 'vertical'` — default `'horizontal'`; can also be passed as the directive value (`x-flow-condition="'vertical'"`)
- `evaluateLabel?: string` — body override when `evaluate` is used

The directive renders body text via `prettyPrintCondition()` for declarative conditions, or `evaluateLabel` / `'[custom evaluator]'` when `evaluate` is set. textContent only — no innerHTML anywhere.

### Branch-taken decoration

When a run picks a branch, the addon sets `node.data._branchTaken` to the chosen `sourceHandle` (`'true'` or `'false'`). The directive reflects this via `data-flow-condition-branch-taken="..."` on the host. The default theme highlights the chosen handle with a soft glow and dims the other to `opacity: 0.4`.

`canvas.resetStates()` clears `_branchTaken` on all condition nodes alongside the existing runState reset.

### Replay mirror

`$flow.replayExecution()` mirrors `_branchTaken` when applying `edge:taken` events whose source is a condition node, so replays produce the same visual decoration as the original run.

## Canvas-level run state

The workflow addon attaches three new properties on every canvas:

```js
canvas.runState           // 'idle' | 'running' | 'paused' | 'stopped'
canvas.stopRun()          // forwards to the active FlowRunHandle's stop()
canvas._currentRunHandle  // direct access (escape hatch — populated during runs)
```

`runState` is a reactive getter derived from the active `FlowRunHandle`. It drives `<x-flow-run-button>`, `<x-flow-stop-button>`, and any consumer code reacting to "is a run in flight".

## `validateWorkflow()`

`canvas.validateWorkflow()` runs a pure validation pass over the canvas's nodes + edges and returns `{ valid: boolean, issues: WorkflowValidationIssue[] }`. Issue codes:

| Severity | Code | Meaning |
| --- | --- | --- |
| error | `dangling-edge` | Edge source/target node doesn't exist. |
| error | `duplicate-node-id` | Two nodes share an id. |
| error | `missing-condition` | A `flow-condition` has neither `condition` nor `evaluate`. |
| error | `condition-missing-branch` | A `flow-condition` lacks its `true` or `false` outgoing edge. |
| error | `unhandled-source-handle` | A `flow-condition` outgoing edge has a `sourceHandle` other than `true`/`false`. |
| error | `wait-missing-duration` | A `flow-wait` node has non-numeric or missing `data.durationMs`. |
| warning | `unreachable-node` | A node has no incoming and no outgoing edges. |
| warning | `cycle` | A directed cycle exists in the graph. |

`valid` is `true` iff no error-severity issues are present.

## UI primitive factories — `Alpine.data`

The workflow addon registers five `Alpine.data` factories used by the matching WireFlow Blade components:

| Factory | Used by |
| --- | --- |
| `flowReplayControls` | `<x-flow-replay-controls>` — duck-typed playback toolbar (Play/Pause/Restart/Speed/scrubber/progress). |
| `flowExecutionLog` | `<x-flow-execution-log>` — dense reactive event viewer with filter dropdown and click-to-highlight. |
| `flowRunButton` | `<x-flow-run-button>` — workflow run trigger that auto-disables during runs. |
| `flowStopButton` | `<x-flow-stop-button>` — halts an active run; hidden by default when idle. |
| `flowResetButton` | `<x-flow-reset-button>` — clears node runState and the execution log. |

Each factory resolves the surrounding canvas via the closest `.flow-container` ancestor or a `:target` selector when used outside the canvas. They consume canvas surfaces (`canvas.run`, `canvas.stopRun`, `canvas.replayExecution`, `canvas.executionLog`, `canvas.resetStates`, `canvas.resetExecutionLog`) — no imports from animate addon internals — so the replay-controls factory works against either `$flow.replay()` or `$flow.replayExecution()` handles via runtime capability detection.

See WireFlow's [workflow addon page](https://artisanflow.dev/wireflow/docs/addons/workflow) for usage of each component.

## See Also

- [runState (D2)](../migration/v0.2.1-alpha.md#runstate-d2)
- [$flow Magic](../api/flow-magic/index.md)
