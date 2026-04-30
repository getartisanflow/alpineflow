---
title: Connect Validator
description: Async server-gated connection validation with pending affordances, DOM events, and WireFlow integration.
order: 1
---

# Connect Validator

`connectValidator` is an async hook that gates an in-flight connection on work that cannot be resolved synchronously — a server round-trip, a policy check, a rate-limit lookup. It runs after every synchronous check has passed (node `connectable`, cycle prevention, duplicate detection, `connectionRules`, handle limits, per-handle validators, `isValidConnection`) and is the last gate before an edge is committed.

Reach for it when your validator needs I/O. For static rules — graph shape, handle type compatibility, a configured map of allowed types — use the cheaper synchronous hooks instead. See [sync vs. async](#sync-vs-async) below.

## Signature

```ts
connectValidator?: (connection: Connection) => Promise<
  | boolean
  | { allowed: boolean; reason?: string }
>;
```

The `Connection` passed in is the same shape used by every other validator in the chain:

```ts
interface Connection {
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
}
```

### Return shapes

| Return value | Outcome |
|--------------|---------|
| `true` | Allow. Edge commits, `connect` event fires. |
| `false` | Silently reject. Edge is discarded, `flow-connect-rejected` fires with no `reason`. |
| `{ allowed: true }` | Allow. Same as returning `true`. |
| `{ allowed: false }` | Reject. Same as returning `false`. |
| `{ allowed: false, reason: 'text' }` | Reject with a reason. The reason is attached to `flow-connect-rejected.detail.reason` and logged to `console.warn`. |
| Throws | Treated as `{ allowed: false }`. The error is logged via the `connection` debug channel but the rejection carries no reason. |

## Minimal example

A validator that flips a coin. Plain AlpineFlow, no server:

```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 300, y: 0 }, data: { label: 'Target' } },
    ],
    edges: [],
    async connectValidator(connection) {
        await new Promise(r => setTimeout(r, 400));
        if (Math.random() > 0.5) return true;
        return { allowed: false, reason: 'Unlucky — try again.' };
    },
})" class="flow-container" style="height: 250px;">
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

While the promise is pending, both handles pulse via `.flow-handle-validating` and the drag line runs marching-ants via `.flow-connect-line--validating`.

## Full example — server round-trip

```js
flowCanvas({
    nodes,
    edges,
    async connectValidator(connection) {
        const response = await fetch('/api/connections/can-connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(connection),
        });

        if (!response.ok) {
            return { allowed: false, reason: 'Server unreachable.' };
        }

        const { allowed, reason } = await response.json();
        return allowed ? true : { allowed: false, reason };
    },
});
```

Your server responds with e.g. `{"allowed": false, "reason": "Duplicate dependency would create an import cycle."}` on conflict, or `{"allowed": true}` on success. The edge only commits on success; the `connect` event only fires on success.

## CSS hooks

Two classes toggle during validation:

| Class | Element | When |
|-------|---------|------|
| `.flow-handle-validating` | Source + target handle DOM elements | Added when the validator is awaited, removed when it settles (resolve, reject, or throw). |
| `.flow-connect-line--validating` | The temporary drag-line `<svg>` (and its inner `<path>`) | Added on the drag-to-connect path only — click-to-connect has no drag line to decorate. |

The default theme ships a 700 ms outward pulse on `.flow-handle-validating` and a 600 ms marching-ants dash on `.flow-connect-line--validating`. Override either by writing your own rule, or by swapping the class name via `validatingHandleClass` in the canvas config:

```js
flowCanvas({
    validatingHandleClass: 'my-pending-ring',
    async connectValidator(connection) { /* ... */ },
});
```

## DOM events

Three `CustomEvent`s dispatch on the canvas container (`.flow-container`) and bubble:

### `flow-connect-validating`

Fires when the validator starts awaiting. Payload:

```ts
{ detail: { connection: Connection } }
```

### `flow-connect-validated`

Fires when the validator settles — both on allow and on reject. Payload:

```ts
{ detail: { connection: Connection; allowed: boolean; reason?: string } }
```

### `flow-connect-rejected`

Fires whenever a connection is rejected, from any stage of the validation chain (including sync stages). Payload:

```ts
{
  detail: {
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    reason?: string;  // always present as a key; undefined for sync rejections
  }
}
```

`reason` is always defined as a key in the detail (even when undefined) so you can destructure without existence checks.

## Default rejection behavior

When any stage rejects a connection — sync or async — AlpineFlow guarantees two things without any listener wiring:

1. A `console.warn('[alpineflow] connection rejected:', reason)` is logged (or `'[alpineflow] connection rejected'` with no trailing arg when `reason` is undefined). This surfaces rejections during development without silent drops.
2. A `flow-connect-rejected` `CustomEvent` is dispatched on the canvas container.

Listen for the event to render your own toast, inline error, or other UI:

```html
<div x-data="flowCanvas({ /* ... */ })"
     @flow-connect-rejected="$event.detail.reason && showToast($event.detail.reason)"
     class="flow-container">
```

Or with a plain `addEventListener`:

```js
containerEl.addEventListener('flow-connect-rejected', (e) => {
    if (e.detail.reason) {
        myToast.warning(e.detail.reason);
    }
});
```

## WireFlow bridge

WireFlow exposes `connectValidator` via the `@connect-validate` attribute. Attach it to `<x-flow>` and point it at a Livewire method:

```blade
<x-flow :nodes="$nodes" :edges="$edges" @connect-validate="canConnect" />
```

The matching server method receives the four connection fields as positional arguments:

```php
public function canConnect(
    string $source,
    string $target,
    ?string $sourceHandle,
    ?string $targetHandle,
): bool|array {
    if ($source === $target) {
        return ['allowed' => false, 'reason' => 'Self-connections are not supported.'];
    }
    return true;
}
```

Return `true` to allow, `false` to silently reject, or `['allowed' => false, 'reason' => '...']` to reject with a user-facing message. When a `reason` is returned, WireFlow automatically dispatches a `flux-toast` (`{ variant: 'warning', text: reason }`) on top of the standard DOM event — override this by listening for `flow-connect-validated` yourself.

See [WireFlow → server events → `@connect-validate`](https://github.com/getartisanflow/wireflow/blob/main/docs/server/events.md) for the full bridge reference.

## Sync vs. async — when to use which {#sync-vs-async}

| Use | Hook |
|-----|------|
| Graph shape — cycle prevention, duplicate edges | built-in (`preventCycles`) |
| Handle type compatibility by `node.type` | `connectionRules.byType` |
| Cross-node logic that only depends on graph state | `connectionRules.validate` |
| Per-handle static constraints | `x-flow-handle-validate` |
| Global sync check over the full connection | `isValidConnection` |
| Anything requiring I/O — duplicate checks against a server, policy, rate limits, authz | `connectValidator` |

Prefer the cheapest hook that can express your rule. The async validator runs last and only if every synchronous gate has already approved the connection, so you never pay the network round-trip for rejections the sync chain can catch.

## Gotchas

### Only one validator runs at a time

The canvas tracks an internal `_connectValidating` flag for the duration of the await. While it is set, rapid drops and click-to-connect attempts are ignored. This prevents overlapping server requests and race conditions on the committed edge set, but it also means users can't queue up validations — they must wait for the current one to settle before the next drop registers.

### Throwing is rejection without a reason

If the validator throws (or rejects the returned promise), AlpineFlow treats it as `{ allowed: false }` with no reason. The error is logged through the `connection` debug channel but is not surfaced to the user. Wrap your own `try`/`catch` and return `{ allowed: false, reason: 'Something went wrong.' }` if you want the rejection to carry a message.

### The validator runs on drop, not on drag

Validation is a pointerup / click-completion gate, not a drag-time hover gate. Hover styling during drag (`.flow-handle-valid` / `.flow-handle-invalid`) reflects only the synchronous chain. If your async check would reject the connection, the user still sees "valid" styling during drag and only learns of the rejection once they release. Use sync hooks to provide drag-time feedback when it matters.

### The pending-line class is drag-only

`.flow-connect-line--validating` is only applied on the drag-to-connect path because that is the only path with a temporary SVG line to decorate. Click-to-connect and reconnect drags still pulse the handles via `.flow-handle-validating`, but you will not see the marching-ants dash on those flows.
