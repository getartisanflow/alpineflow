---
title: Collaboration
description: Real-time multi-user editing with Yjs.
order: 2
---

# Collaboration

The Collaboration addon enables real-time multi-user editing of flow diagrams using [Yjs](https://yjs.dev/) conflict-free replicated data types (CRDTs).

> **Live demo:** See the [Live Collaboration example](/examples/collaboration) — two side-by-side canvases syncing nodes, edges, cursors, and whiteboard annotations in real time.

## Installation

Install the required peer dependencies:

```bash
npm install yjs y-websocket y-protocols
```

Then register the plugin:

```js
import AlpineFlowCollab from '@getartisanflow/alpineflow/collab'

Alpine.plugin(AlpineFlowCollab)
```

## With WireFlow

If you're using [WireFlow](https://artisanflow.dev/docs/wireflow) (AlpineFlow's Livewire integration), the core is loaded from the WireFlow vendor bundle. Addons work seamlessly — they share a global registry with the core, regardless of how each was loaded.

The `yjs`, `y-websocket`, and `y-protocols` peer dependencies are still required.

> Install `@getartisanflow/alpineflow` via npm to access addon sub-path imports.

```js
// Core from WireFlow vendor bundle
import AlpineFlow from '../../vendor/getartisanflow/wireflow/dist/alpineflow.bundle.esm.js';
// Addon from npm
import AlpineFlowCollab from '@getartisanflow/alpineflow/collab';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineFlow);
    window.Alpine.plugin(AlpineFlowCollab);
});
```

## Configuration

Pass a `collab` object in your flow canvas configuration with a provider instance:

```js
import { WebSocketProvider } from '@getartisanflow/alpineflow/collab'

const provider = new WebSocketProvider({
    roomId: 'my-room',
    url: 'ws://localhost:1234',
    user: { name: 'Alice', color: '#ef4444' },
});
```

```html
<div x-data="flowCanvas({
    nodes,
    edges,
    collab: {
        provider,
        user: {
            name: 'Alice',
            color: '#ef4444',
        },
    },
})">
</div>
```

## Providers

Three provider types are available:

| Provider | Description | Requires |
|---|---|---|
| `WebSocketProvider` | Standard y-websocket connection | A y-websocket server |
| `ReverbProvider` | Laravel Reverb/Pusher integration | Laravel Echo + Reverb |
| `InMemoryProvider` | Local testing, no server | Nothing |

### WebSocket provider

Uses [y-websocket](https://github.com/yjs/y-websocket) for binary WebSocket transport — the most efficient option. Requires a y-websocket server.

```js
import { WebSocketProvider } from '@getartisanflow/alpineflow/collab'

const provider = new WebSocketProvider({
    roomId: 'diagram-1',
    url: 'ws://localhost:1234',
    user: { name: 'Alice', color: '#3b82f6' },
});
```

```js
collab: {
    provider,
    user: { name: 'Alice', color: '#3b82f6' },
}
```

### Laravel Reverb provider

Uses Laravel Echo private channels with whisper events. Encodes Yjs updates as base64 text since Reverb/Pusher only supports text frames.

The provider handles **peer-to-peer state sync** automatically — when a new user connects, it requests the current document state from existing peers via whisper, ensuring all clients start from the same Yjs state.

```js
import { ReverbProvider } from '@getartisanflow/alpineflow/collab'

const provider = new ReverbProvider({
    roomId: 'diagram-1',
    channel: 'flow.{roomId}',
    user: { name: 'Alice', color: '#3b82f6' },
});
```

```js
collab: {
    provider,
    user: { name: 'Alice', color: '#3b82f6' },
}
```

> **Important:** Laravel Echo must be initialized before the flow canvas mounts. The provider accesses `window.Echo` to join the private channel.

#### Reverb channel authorization

The channel name follows the pattern you specify (e.g., `flow.{roomId}`). Register the authorization route in your Laravel `channels.php`:

```php
Broadcast::channel('flow.{roomId}', function ($user, $roomId) {
    return ['id' => $user->id, 'name' => $user->name];
});
```

#### Optional: server-side state persistence

Pass a `stateUrl` to load the initial document state from your server instead of peer sync:

```js
const provider = new ReverbProvider({
    roomId: 'diagram-1',
    channel: 'flow.{roomId}',
    user: { name: 'Alice', color: '#3b82f6' },
    stateUrl: '/api/flow/{roomId}/state',
});
```

The provider fetches `GET /api/flow/diagram-1/state` and expects `{ state: "<base64-encoded Yjs update>" }`. This is useful for persisting diagram state between sessions.

### InMemoryProvider

For testing and demos, `InMemoryProvider` requires no server. Use `linkProviders()` to synchronize two in-memory providers:

```js
import { InMemoryProvider, linkProviders } from '@getartisanflow/alpineflow/collab'

const providerA = new InMemoryProvider({ roomId: 'my-room' })
const providerB = new InMemoryProvider({ roomId: 'my-room' })

linkProviders(providerA, providerB)
```

> **Inline scripts:** `InMemoryProvider` and `linkProviders` are named exports from the collab module. If you need to access them from a `<script type="module">` block (e.g., on a demo page), expose them on `window` after importing:
>
> ```js
> import { InMemoryProvider, linkProviders } from '@getartisanflow/alpineflow/collab'
> window.InMemoryProvider = InMemoryProvider
> window.linkProviders = linkProviders
> ```
>
> This is only needed for inline scripts — standard bundled imports work without this step.

See the [Live Collaboration example](/examples/collaboration) for a working two-canvas demo using InMemoryProvider.

## Awareness

The collaboration layer syncs awareness information across all connected users, including:

- **Cursor positions** — each user's pointer location on the canvas
- **User presence** — who is currently viewing the diagram
- **Selection sync** — which nodes/edges each user has selected

### Awareness state shape

Each connected user broadcasts this state:

```ts
{
    user: { name: string; color: string },     // User identity
    cursor: { x: number; y: number } | null,   // Pointer position (flow coords)
    selectedNodes: string[],                     // Currently selected node IDs
    viewport: { x: number; y: number; zoom: number }, // User's viewport
}
```

### Remote cursors

Place the `x-flow-cursors` directive inside the viewport so cursors render in flow coordinates and track correctly at any zoom level:

```html
<div x-data="flowCanvas({
    nodes, edges,
    collab: {
        provider: 'websocket',
        url: 'ws://localhost:1234',
        room: 'my-room',
        user: { name: 'Alice', color: '#3b82f6' },
    },
})" class="flow-container">
    <div x-flow-viewport>
        <!-- Remote cursors — place inside viewport -->
        <div x-flow-cursors></div>

        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <span x-text="node.data.label"></span>
            </div>
        </template>
    </div>
</div>
```

Each remote cursor renders as:
- An SVG arrow pointer filled with the user's `color`
- A name label badge positioned beside the arrow
- Smooth CSS transitions (100ms ease-out) as the cursor moves

The cursor elements have the class `.flow-collab-cursor` with children `.flow-collab-cursor-arrow` (SVG path) and `.flow-collab-cursor-label` (name badge). Override these to customize appearance:

```css
/* Larger name labels */
.flow-collab-cursor-label {
    font-size: 13px;
    padding: 3px 10px;
}

/* Hide name labels */
.flow-collab-cursor-label {
    display: none;
}
```

### Collab config options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cursors` | `boolean` | `true` | Show remote user cursors |
| `selections` | `boolean` | `true` | Show remote user selections |
| `throttle` | `number` | `20` | Cursor broadcast throttle in milliseconds |

### User presence via `$flow.collab`

When collaboration is active, `$flow.collab` exposes:

| Property | Type | Description |
|----------|------|-------------|
| `users` | `CollabUser[]` | All connected users (reactive) |
| `userCount` | `number` | Number of connected users |
| `me` | `CollabUser` | Local user info `{ name, color }` |
| `connected` | `boolean` | Whether the provider is currently connected |
| `status` | `string` | `'connecting'`, `'connected'`, or `'disconnected'` |

#### Displaying a user presence list

```html
<div x-flow-panel:top-right.static>
    <div class="text-sm font-medium" x-text="'Online: ' + ($flow.collab?.userCount ?? 0)"></div>
    <template x-for="user in ($flow.collab?.users ?? [])" :key="user.name">
        <div class="flex items-center gap-2 text-xs">
            <span class="w-2 h-2 rounded-full" :style="'background:' + user.color"></span>
            <span x-text="user.name"></span>
        </div>
    </template>
</div>
```

#### Connection status indicator

```html
<div class="flex items-center gap-1 text-xs">
    <span class="w-2 h-2 rounded-full"
          :class="{
              'bg-green-500': $flow.collab?.status === 'connected',
              'bg-yellow-500': $flow.collab?.status === 'connecting',
              'bg-red-500': $flow.collab?.status === 'disconnected',
          }"></span>
    <span x-text="$flow.collab?.status ?? 'offline'"></span>
</div>
```

## Complete example

A full collaborative canvas with cursors, user presence list, and connection status. This example uses `WebSocketProvider` — swap with `ReverbProvider` for Laravel projects.

```js
import { WebSocketProvider } from '@getartisanflow/alpineflow/collab'

window.collabProvider = new WebSocketProvider({
    roomId: 'demo-room',
    url: 'ws://localhost:1234',
    user: { name: 'Alice', color: '#3b82f6' },
});
```

```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 50, y: 50 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 300, y: 150 }, data: { label: 'Node B' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b', markerEnd: 'arrowclosed' },
    ],
    background: 'dots',
    controls: true,
    collab: {
        provider: collabProvider,
        user: {
            name: 'Alice',
            color: '#3b82f6',
        },
        cursors: true,
        selections: true,
    },
})"
    class="flow-container"
    style="height: 500px;"
>
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <div x-flow-handle:target.top></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.bottom></div>
            </div>
        </template>
    </div>

    <!-- User presence panel -->
    <div x-flow-panel:top-right.static style="padding: 8px 12px; font-size: 12px;">
        <div class="flex items-center gap-1 mb-2">
            <span class="w-2 h-2 rounded-full"
                  :class="{
                      'bg-green-500': $flow.collab?.status === 'connected',
                      'bg-yellow-500': $flow.collab?.status === 'connecting',
                      'bg-red-500': $flow.collab?.status === 'disconnected',
                  }"></span>
            <span x-text="($flow.collab?.userCount ?? 0) + ' online'"></span>
        </div>
        <template x-for="user in ($flow.collab?.users ?? [])" :key="user.name">
            <div class="flex items-center gap-2 py-0.5">
                <span class="w-2.5 h-2.5 rounded-full" :style="'background:' + user.color"></span>
                <span x-text="user.name"></span>
            </div>
        </template>
    </div>
</div>
```

## Sync Behavior

All node and edge changes automatically sync across connected clients via Yjs shared types. This includes:

- Adding, removing, and updating nodes
- Adding, removing, and updating edges
- Node position changes (drag)
- Annotation drawing (when used with the [Whiteboard](./whiteboard.md) addon)
- Undo/redo operations

Viewport position and zoom are intentionally NOT synced — each user maintains their own independent view, similar to Figma.

## How it works

The collab addon uses Yjs CRDTs (Conflict-free Replicated Data Types) to merge concurrent edits without conflicts:

1. **CollabBridge** maps Alpine reactive state (nodes/edges arrays) to Yjs shared types (`Y.Map`)
2. Local changes → `doc.transact()` → Yjs generates an update binary → provider broadcasts it
3. Remote updates arrive → `applyUpdate(doc, update)` → Yjs observers fire → bridge pulls changes back to Alpine
4. **CollabAwareness** tracks ephemeral state (cursors, selections) via the Yjs awareness protocol

The bridge uses an origin flag (`'collab-bridge-local'`) to prevent echo loops — local changes skip the observer, remote changes trigger a pull.

## Troubleshooting

### yjs must be a single copy

The collab system requires that all parts of the stack (core, addon, provider) use the **same copy** of the `yjs` npm package. If your bundler creates duplicate copies, `applyUpdate` will silently fail — updates arrive but don't modify the document.

Check for duplicates:

```bash
npm ls yjs
```

You should see a single deduped version. If you see multiple, fix your dependency tree:

```bash
npm dedupe
```

### Reverb: ensure Echo is initialized first

The `ReverbProvider` accesses `window.Echo` when `connect()` is called. If Echo isn't initialized yet, the provider logs a warning and silently fails. Make sure your Laravel Echo bootstrap runs before the flow canvas mounts.

### Reverb: peer-to-peer sync timing

When using `ReverbProvider` without `stateUrl`, the provider requests state from existing peers via whisper on connect. There's a 500ms window for peers to respond before the bridge initializes from local state. If peers are slow to respond (e.g., high-latency connections), the new client may create its own state independently, causing divergent Yjs histories.

For production use, provide a `stateUrl` endpoint that serves the persisted Yjs state — this eliminates the peer timing dependency.

### Reverb: accept_client_events_from

Reverb's `accept_client_events_from` setting in `config/reverb.php` controls which channels can send whispers (client events). The default `'members'` only allows whispers on **presence channels**. For private channel collab, set it to `'all'`:

```php
// config/reverb.php → apps
'accept_client_events_from' => 'all',
```

Only two values are valid: `'all'` or `'members'`. Any other value (including `'authenticated'`) silently blocks all whispers. **Restart Reverb after changing this.**

### Reverb: message size limits

Yjs updates can be larger than Reverb's default 10KB message limit. Increase both limits in `config/reverb.php`:

```php
'max_message_size' => 500_000, // 500KB
'max_request_size' => 500_000, // 500KB
```

### WireFlow: cursor positioning

In WireFlow, the `x-flow-cursors` element renders in the default slot, which is **outside** the viewport div. Remote cursors use flow-space coordinates and need the viewport's CSS transform to position correctly. Move the element into the viewport on mount:

```html
<div x-flow-cursors x-init="$nextTick(() => {
    const viewport = $el.closest('.flow-container')?.querySelector('.flow-viewport');
    if (viewport && !viewport.contains($el)) viewport.appendChild($el);
})"></div>
```

This is not needed in AlpineFlow where you place `x-flow-cursors` directly inside the viewport.

## See Also

- [Installation > Addons](../getting-started/installation.md#optional-addons)
- [Configuration > collab](../configuration/index.md)
