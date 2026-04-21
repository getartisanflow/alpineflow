---
title: Schema
description: Schema designer addon — field CRUD with edge cascade, reference inference, JSON serialization, and three-scope inspector directives.
order: 7
---

# Schema

The Schema addon turns AlpineFlow into a generic typed-field schema designer. Use it to build ERDs, API payload shapes, GraphQL types, TypeScript-style contracts, event schemas, or form-builder configurations — anywhere a graph's nodes are "things with labelled, typed fields" and edges are "this field references that field".

The addon is intentionally decoupled from DB-specific terminology: fields have `name` and `type` (strings you define), plus optional `key`, `required`, `icon` decorations. Everything is plain data.

## Installation

```js
import Schema from '@getartisanflow/alpineflow/schema';

Alpine.plugin(Schema);
```

The subpath import mirrors every other AlpineFlow addon. The CDN entry (`alpineflow-schema.cdn.js`) auto-registers on `alpine:init`, so you can drop it in a `<script>` tag without wiring `Alpine.plugin` yourself.

## With WireFlow

If you're using [WireFlow](https://artisanflow.dev/docs/wireflow), the core is loaded from the WireFlow vendor bundle. Addons share a global registry with the core regardless of how each was loaded.

> Install `@getartisanflow/alpineflow` via npm to access addon sub-path imports.

```js
// Core from WireFlow vendor bundle
import AlpineFlow from '../../vendor/getartisanflow/wireflow/dist/alpineflow.bundle.esm.js';
// Addon from npm
import AlpineFlowSchema from '@getartisanflow/alpineflow/schema';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineFlow);
    window.Alpine.plugin(AlpineFlowSchema);
});
```

## Minimal example

Use the core [`x-flow-schema`](../nodes/schema.md) primitive to render the nodes, then call addon helpers from any scope to mutate fields:

```html
<div x-data="flowCanvas({
    nodes: [
        {
            id: 'user',
            position: { x: 0, y: 0 },
            data: {
                label: 'User',
                fields: [
                    { name: 'id',    type: 'uuid', key: 'primary' },
                    { name: 'email', type: 'text', required: true },
                ],
            },
        },
        {
            id: 'team',
            position: { x: 320, y: 0 },
            data: {
                label: 'Team',
                fields: [
                    { name: 'id',   type: 'uuid', key: 'primary' },
                    { name: 'name', type: 'text' },
                ],
            },
        },
    ],
    edges: [],
})" class="flow-container">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" x-flow-schema></div>
        </template>
    </div>

    <div x-flow-panel:top-right.static>
        <button @click="addField('user', { name: 'avatar_url', type: 'text' })">
            Add avatar_url
        </button>
    </div>
</div>
```

`addField`, `renameField`, `removeField`, `reorderFields`, `inferReferences`, `schemaToJSON`, and `schemaFromJSON` are bound onto the canvas scope when the addon is registered.

## Field CRUD API

All mutation helpers fail silently with a `reason` instead of throwing. They mutate the live reactive `canvas.nodes` / `canvas.edges` arrays, so the DOM updates automatically, and dispatch `schema:*` events on the canvas element for consumers that want to react without wrapping the calls.

### `addField(nodeId, field)`

Append a new field to `node.data.fields`.

```js
canvas.addField('user', { name: 'avatar_url', type: 'text' });
// → { applied: true }
```

**Returns:** `{ applied, reason? }`

| `reason` | When |
|---|---|
| `no-node` | `nodeId` does not exist on the canvas |
| `invalid-name` | Name is empty, longer than 40 chars, or does not match `/^[a-z][a-z0-9_]*$/` |
| `duplicate` | A field with that name already exists on the node |

On success dispatches `schema:field-added`.

### `renameField(nodeId, oldName, newName)`

Rename a field in place. Cascades to every edge whose `(source, sourceHandle)` or `(target, targetHandle)` references `(nodeId, oldName)`, rewriting the handle to `newName`.

```js
canvas.renameField('user', 'team_id', 'organization_id');
// → { applied: true, cascadedEdgeIds: ['e-user-team'] }
```

**Returns:** `{ applied, reason?, cascadedEdgeIds }`

| `reason` | When |
|---|---|
| `unchanged` | `oldName === newName` (no-op) |
| `invalid-name` | `newName` fails the name validator |
| `no-node` | `nodeId` does not exist |
| `no-field` | No field with `oldName` on that node |
| `duplicate` | A field with `newName` already exists on that node |

On success dispatches `schema:field-renamed`, plus `schema:edges-cascaded` if any edges were rewritten.

### `removeField(nodeId, fieldName)`

Remove a field. Cascade-drops every edge whose handle references it.

```js
canvas.removeField('user', 'team_id');
// → { applied: true, droppedEdgeIds: ['e-user-team'] }
```

**Returns:** `{ applied, reason?, droppedEdgeIds }`

| `reason` | When |
|---|---|
| `no-node` | `nodeId` does not exist |
| `no-field` | No field with that name on the node |

On success dispatches `schema:field-removed`, plus `schema:edges-cascaded` if any edges were dropped.

### `reorderFields(nodeId, orderedNames)`

Reorder fields on a node to match the supplied name array. `orderedNames` must be an exact permutation of the node's existing field names — same length, same set, no duplicates.

```js
canvas.reorderFields('user', ['id', 'email', 'avatar_url', 'created_at']);
// → { applied: true }
```

**Returns:** `{ applied, reason? }`

| `reason` | When |
|---|---|
| `no-node` | `nodeId` does not exist |
| `mismatch` | `orderedNames` is not an array, contains duplicates, has a different length, or references names that don't exist on the node |

## Event surface

All four events are dispatched on the canvas container element (`.flow-container`) with `bubbles: true`. Listen via `@schema-field-added`, `@schema-field-renamed`, etc., or with `addEventListener`.

| Event | `detail` |
|---|---|
| `schema:field-added` | `{ nodeId, field }` |
| `schema:field-renamed` | `{ nodeId, oldName, newName, cascadedEdgeIds }` |
| `schema:field-removed` | `{ nodeId, fieldName, droppedEdgeIds }` |
| `schema:edges-cascaded` | `{ nodeId, fieldName, edgeIds, operation }` |

`schema:edges-cascaded` fires **in addition to** the triggering event (rename or remove) whenever at least one edge changed. The `operation` discriminator is either `'rename'` or `'remove'`. On a rename, `fieldName` is the new name.

```html
<div x-data="flowCanvas({...})"
     @schema-field-renamed="console.log($event.detail)"
     @schema-edges-cascaded="
        if ($event.detail.operation === 'rename') {
            toast.info(`${$event.detail.edgeIds.length} edges updated`);
        } else {
            toast.warning(`${$event.detail.edgeIds.length} edges dropped`);
        }
     ">
    ...
</div>
```

A throwing listener will not roll back the mutation — the state change has already landed before dispatch. Listener errors are caught and logged via `console.error` so they never abort the helper.

## `inferReferences(nodes)` helper

Pure function: scans every node's fields for the `<stem>_id` pattern and emits a suggestion whenever `<stem>` exactly matches another node's id. No canvas mutation, no events, no self-references.

```js
import { inferReferences } from '@getartisanflow/alpineflow/schema';

const suggestions = inferReferences(canvas.nodes);
// or, via the canvas helper:
canvas.inferReferences();
```

**Returns:** `ReferenceSuggestion[]`

```ts
interface ReferenceSuggestion {
    fromNodeId: string;
    fromFieldName: string;   // e.g. "team_id"
    toNodeId: string;        // the matched node id (stem)
    toFieldName: string;     // that node's primary field if flagged, else its first field, else "id"
    confidence: 'exact' | 'stem';
}
```

Turn suggestions into real edges with `addEdges()`:

```js
canvas.addEdges(
    canvas.inferReferences().map((s, i) => ({
        id: `ref-${i}`,
        source: s.fromNodeId,
        sourceHandle: s.fromFieldName,
        target: s.toNodeId,
        targetHandle: s.toFieldName,
    })),
);
```

The helper is intentionally conservative: only exact stem matches (`team_id` → node id `team`). There is no fuzzy matching, no pluralization (`users_id` will not match node `user`). Extend it in consumer code if you need softer matching.

## Serialization

### `schemaToJSON(canvas)`

Export the canvas as a stable `SchemaGraphJSON` shape — only the documented public fields, with internal flags stripped.

```js
const json = canvas.schemaToJSON();
JSON.stringify(json, null, 2);
```

**Shape:**

```ts
interface SchemaGraphJSON {
    version: 1;
    nodes: Array<{
        id: string;
        label: string;
        fields: FlowSchemaField[];
        position: { x: number; y: number };
    }>;
    edges: Array<{
        id: string;
        source: string;
        sourceHandle?: string;
        target: string;
        targetHandle?: string;
        label?: string;
    }>;
}
```

### `schemaFromJSON(canvas, json)`

Replace the canvas's nodes + edges arrays in place. In-place mutation (via `splice`) preserves Alpine reactivity — any `x-for` bound to `canvas.nodes` / `canvas.edges` rewires without a remount.

```js
canvas.schemaFromJSON(JSON.parse(stored));
```

The `version` field is required. `schemaFromJSON` throws if `version` is missing or not `1`:

```
[alpineflow/schema] schemaFromJSON: missing or invalid version
[alpineflow/schema] schemaFromJSON: unsupported version 2
```

This is the only API that throws — all other helpers return a status object.

## Inspector scaffolding

Three directives mount a reactive "inspector" scope on any container element. Each one exposes the appropriate selection (node, row, or edge) plus helper wrappers that target the current selection without threading ids through every call.

| Directive | Exposes | Helpers |
|---|---|---|
| `x-schema-node-inspector` | `selectedNode` | `inspector.addField`, `renameField`, `removeField`, `reorderFields` |
| `x-schema-row-inspector` | `selectedRow` (`{nodeId, fieldName}`) | `inspector.renameField`, `removeField`, `updateField` |
| `x-schema-edge-inspector` | `selectedEdge` | `inspector.updateEdge`, `setLabel`, `removeEdge` |

Place the directive on any element — typically a sidebar panel next to the canvas. The directive walks up to the nearest `[x-data]` scope to find the canvas, so the inspector can live outside the canvas element.

### Default UI opt-in

Inspectors render nothing by default: the directive injects scope only. To stamp a minimal structural HTML skeleton (so consumers can style with CSS without writing templates), place a `<template x-schema-default-ui>` element as a direct child:

```html
<aside x-schema-node-inspector>
    <template x-schema-default-ui></template>
</aside>
```

When the template is present the addon appends a managed `<div data-schema-default-ui-root>` containing an empty state or the current selection's fields (plus an add-field form for the node inspector, form inputs for the row inspector, a label/delete form for the edge inspector). The managed root is rebuilt on every selection change — sibling children of the template are left alone.

If you omit the template you own the content completely; the scope (`inspector`, `selectedNode` / `selectedRow` / `selectedEdge`) is still available to your markup.

### Node inspector example

```html
<div x-data="flowCanvas({...})" class="flow-container">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" x-flow-schema></div>
        </template>
    </div>
</div>

<aside x-schema-node-inspector>
    <h2 x-text="selectedNode?.data?.label ?? 'No selection'"></h2>
    <template x-if="selectedNode">
        <ul>
            <template x-for="field in selectedNode.data.fields" :key="field.name">
                <li>
                    <span x-text="field.name"></span>
                    <button @click="inspector.removeField(field.name)">remove</button>
                </li>
            </template>
        </ul>
    </template>
</aside>
```

### Row inspector

The row inspector's `selectedRow` resolves from `canvas.selectedRows` — each entry is a dot-separated `"nodeId.fieldName"` string (first dot only; field names can contain further dots). The helper parses the id into `{ nodeId, fieldName }`:

```html
<aside x-schema-row-inspector>
    <template x-if="selectedRow">
        <div>
            Editing <code x-text="selectedRow.nodeId + '.' + selectedRow.fieldName"></code>
            <button @click="inspector.removeField()">remove</button>
            <input type="checkbox" @change="inspector.updateField({ required: $event.target.checked })">
        </div>
    </template>
</aside>
```

Use `inspector.renameField(newName)` when changing the name so edges cascade. `inspector.updateField(patch)` skips the `name` key for exactly this reason — it mutates arbitrary other props (`type`, `required`, etc.) in place.

### Edge inspector

```html
<aside x-schema-edge-inspector>
    <template x-if="selectedEdge">
        <div>
            <input :value="selectedEdge.label"
                   @change="inspector.setLabel($event.target.value)">
            <button @click="inspector.removeEdge()">delete</button>
        </div>
    </template>
</aside>
```

`inspector.removeEdge()` delegates to `canvas.removeEdges` if available, otherwise splices out of `canvas.edges` directly.

## WireFlow integration

WireFlow ships a companion preset (`<x-schema-designer>`) and three slot-overridable inspector Blade components that wrap the directives above with richer styling and server-side cascade via the `WithSchemaDesigner` trait. It's the same addon — WireFlow just bundles everything with Blade. See the WireFlow docs for the components.

## Type reference

The authoritative TypeScript types live in `src/schema/types.ts`:

- `AddFieldOptions`
- `RenameFieldResult`, `RemoveFieldResult`, `ReorderFieldsResult`
- `ReferenceSuggestion`
- `SchemaGraphJSON`

The field shape (`FlowSchemaField`) is defined in `src/core/types.ts` — see [Schema Nodes](../nodes/schema.md#field-shape).

## See Also

- [Schema Nodes](../nodes/schema.md) — the `x-flow-schema` primitive this addon builds on
- [Installation > Addons](../getting-started/installation.md#optional-addons)
