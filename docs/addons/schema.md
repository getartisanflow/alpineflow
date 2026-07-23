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

### What's in the addon

- Core primitives: [Field CRUD](#field-crud-api), [`inferReferences`](#inferreferencesnodes-helper), [`schemaToJSON` / `schemaFromJSON`](#serialization), [inspector scaffolding](#inspector-scaffolding)
- Field metadata: [extended optional props](#field-metadata-extended), [node `kind` discriminator](#node-kinds)
- Inspection + transforms: [`validateSchema`](#validateschema), [`diffSchemas`](#diffschemasbefore-after-opts), [DOT export](#dot-export), [field type registry](#field-type-registry), [`schemaLayout`](#schemalayoutopts), [history](#history)
- Interaction: [row reordering](#row-reordering), [keyboard field navigation](#keyboard-field-navigation)

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

## Customizing rendering

The `x-flow-schema` directive owns the node's DOM, but you rarely have to fork it to customize it. Three tiers, cheapest first:

1. **Field metadata + CSS** — flags on each field toggle classes you style (see [the field flags](../nodes/schema.md#field-shape) and [Field metadata (extended)](#field-metadata-extended)). Zero JavaScript.
2. **Hooks** — augment the directive's output per-render *without* replacing it: **class resolvers** (declarative styling) and **decorators** (imperative DOM).
3. **Roll your own** — skip the directive entirely for total control.

### Hooks

All four hooks are `flowCanvas({ … })` config options, read from the canvas config on **every render**. They fire only for nodes rendered by `x-flow-schema`, and are no-ops when unset.

The directive builds these slots, and the hooks reach them:

- **node-level** — the node container, the header, the body
- **row-level** (per field) — the row, the icon, the name, the type, and the four handles (target, source, and their two opposite-side mirrors)

#### Class resolvers — declarative styling

`schemaRowClass` and `schemaNodeClass` are **pure functions of the data** that return CSS class names. AlpineFlow applies them and reconciles: classes you stop returning are removed, and it never touches the directive's own structural classes (`flow-schema-row`, `--pk`, `--fk`, `--required`) or anything a decorator added. No `toggle`/cleanup logic on your side — return the same value twice and nothing changes.

```js
flowCanvas({
  // Tint email rows.
  schemaRowClass: ({ field }) => (field.name === 'email' ? 'bg-red-500/10' : null),
  // Class the whole node by its kind.
  schemaNodeClass: ({ node }) => `kind-${node.data.kind}`,
})
```

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        {
            id: 'user',
            position: { x: 0, y: 0 },
            data: {
                label: 'User',
                fields: [
                    { name: 'id',         type: 'uuid',      key: 'primary' },
                    { name: 'email',      type: 'text',      required: true },
                    { name: 'team_id',    type: 'uuid',      key: 'foreign' },
                    { name: 'created_at', type: 'timestamp' },
                ],
            },
        }
    ],
    edges: [],
    schemaRowClass: ({ field }) => (field.name === 'email' ? 'bg-red-500/10' : null),
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 340px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" x-flow-schema></div>
        </template>
    </div>
</div>
```
::enddemo

Return a **bare** class value (a string, or an array of strings) to class the row itself (or, for `schemaNodeClass`, the node host). Return a **per-slot map** to target the sub-slots individually:

```js
flowCanvas({
  schemaRowClass: ({ field }) => ({
    row:  field.required && 'font-medium',
    name: field.key === 'primary' && 'text-amber-500',
    type: 'font-mono opacity-70',
  }),
  schemaNodeClass: ({ node }) => ({ header: 'bg-slate-800', body: 'divide-y divide-white/5' }),
})
```

| Resolver          | Bare value classes… | Map keys                                                                 |
| ----------------- | ------------------- | ------------------------------------------------------------------------ |
| `schemaRowClass`  | the row             | `row`, `icon`, `name`, `type`, `target`, `source`, `mirrorTarget`, `mirrorSource` |
| `schemaNodeClass` | the node host       | `node`, `header`, `body`                                                  |

Each slot reconciles independently: omit a key to leave that slot alone, return it falsy to clear the classes you set there before. The context is `{ field, node, nodeId, isNew }` for rows and `{ node, isNew }` for nodes.

> **Styling a child from the row is often enough.** A class on the row (or host) plus a descendant CSS rule — `.my-row .flow-schema-row-type { … }` — reaches every sub-slot without the map. Reach for the per-slot map specifically when you want a *utility class directly on a child* (Tailwind utilities don't compose through descendants).

#### Decorators — imperative DOM

When you need to add or change DOM — render a field's `description`, add a badge, wire in an extra element — use `schemaRowDecorator` / `schemaNodeDecorator`. They hand you the already-built slot **elements** to mutate.

```js
flowCanvas({
  schemaRowDecorator: ({ row, field, slots }) => {
    // Render a description the base row omits, after the type pill.
    let desc = row.querySelector('.row-desc');
    if (field.description) {
      if (!desc) {
        desc = document.createElement('span');
        desc.className = 'row-desc';
        slots.type.after(desc);
      }
      desc.textContent = field.description;
    } else {
      desc?.remove();
    }
  },
  schemaNodeDecorator: ({ header, node }) => {
    // A field-count badge in the header.
    let badge = header.querySelector('.count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'count';
      header.appendChild(badge);
    }
    badge.textContent = String(node.data.fields.length);
  },
})
```

The row context is `{ row, field, nodeId, slots, isNew }`, where `slots` is `{ icon, name, type, target, source, mirrorTarget, mirrorSource }` (`icon` is `null` when the field has none). The node context is `{ host, header, body, node, isNew }`.

> **Decorators run every render and must be idempotent.** The directive re-runs on any data change and calls your decorator *after* writing its own content — it sets the header text and the name/type text, which clobbers child elements you added there. So **reuse-or-create** (guard with `querySelector`) rather than appending unconditionally; the every-render call then keeps your additions in sync. `isNew` distinguishes a freshly-built slot from a reused one.

A throwing hook is caught and logged — it never aborts the render.

> **Geometry note.** Changing a row's or the header's *height* breaks the uniform-row assumption behind state-derived edge geometry; such nodes fall back to DOM measurement (still correct, just not the fast path). Purely additive, height-preserving decoration is free.

### Roll your own

The directive fully owns the node element's contents. To take over completely, skip the directive and write your own template:

```html
<div x-flow-node="node" class="w-96">
  <div class="my-header text-center text-2xl" x-text="node.data.label"></div>
  <div class="flex w-full">
    <template x-for="field in node.data.fields" :key="field.name">
      <div class="p-2 flex-1 text-center" x-text="field.name"></div>
    </template>
  </div>
</div>
```

The handle ids + positions + per-row structure are the only things edge wiring cares about — everything else is yours.

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

### Row selection

Schema rows are automatically row-selectable. The `x-flow-schema` directive stamps `x-flow-row-select="'<nodeId>.<fieldName>'"` on every field row it renders, so clicking a row populates `canvas.selectedRows` with a `"nodeId.fieldName"` id in the same dot-separated format the row inspector expects. No extra directive or wiring is required on the consumer side — drop an `<aside x-schema-row-inspector>` on the page and row clicks flow through to it.

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

## Field metadata (extended)

Every field carries `name` + `type` plus four optional decoration flags (`key`, `required`, `icon`, and the metadata fields below). These are type-only — the default `x-flow-schema` row renders just the icon / name / type. Consumer templates (or the WireFlow [`<x-schema-field>`](https://artisanflow.dev/docs/wireflow/components/schema-field) primitive with a slot override) can read any of them — as can the schema render [hooks](#hooks), the simplest way to surface these fields without leaving the default row: a `schemaRowDecorator` to render the value, or a `schemaRowClass` to style by it.

| Key           | Type       | Purpose                                                               |
| ------------- | ---------- | --------------------------------------------------------------------- |
| `description` | `string`   | Longer-form doc string — render in a tooltip or hover popover.        |
| `deprecated`  | `boolean`  | Flag the field as stale — typically strikethrough + dim.              |
| `tags`        | `string[]` | Free-form labels (e.g., `['pii']`, `['indexed']`) — render as pills.  |
| `defaultValue`| `unknown`  | Display-only default, rendered after the type if your template opts in.|

The type additions are purely informational — they don't change the default render, serialize through `schemaToJSON` / `schemaFromJSON`, and survive `renameField` / `removeField` / `reorderFields`.

## Node kinds

`SchemaNodeData.kind: string` stamps `data-flow-schema-kind="..."` on the node root element. Use it to theme entities, queries, enums, and aggregates differently without touching the component:

```css
.flow-node[data-flow-schema-kind="entity"] .flow-schema-header { background: var(--color-sky-100); }
.flow-node[data-flow-schema-kind="query"]  .flow-schema-header { background: var(--color-violet-100); }
.flow-node[data-flow-schema-kind="enum"]   .flow-schema-header { background: var(--color-amber-100); }
```

No enum is enforced — pick any discriminator set that matches your domain.

## `validateSchema()`

Returns a structured, human-readable issue list — a snapshot of what's broken in the graph right now. Purely a read; no mutation, no events.

```js
const issues = canvas.validateSchema();
```

**Issue shape:**

```ts
interface SchemaIssue {
    severity: 'error' | 'warning';
    code: 'dangling-edge' | 'missing-primary-key' | 'duplicate-field'
        | 'duplicate-node-id' | 'disconnected-node' | 'cycle';
    nodeId?: string;
    fieldName?: string;
    edgeId?: string;
    message: string;
}
```

| Code                    | Severity  | When                                                                                |
| ----------------------- | --------- | ----------------------------------------------------------------------------------- |
| `dangling-edge`         | `error`   | Edge references a node / handle that no longer exists.                              |
| `duplicate-field`       | `error`   | Two fields on the same node share a name.                                           |
| `duplicate-node-id`     | `error`   | Two nodes share the same id.                                                        |
| `missing-primary-key`   | `warning` | Node has fields but none is flagged `key: 'primary'`.                               |
| `disconnected-node`     | `warning` | Node has no incoming or outgoing edges.                                             |
| `cycle`                 | `warning` | Reference cycle detected in the edge graph (e.g., A → B → A).                       |

Wire it into a save flow, CI export, or a live inspector panel — the return is plain data, so diff/display logic is entirely up to the consumer.

## `diffSchemas(before, after, opts?)`

Computes structured deltas between two `SchemaGraphJSON` snapshots. Useful for migration scripts, review UIs, and undo-visualizers.

```js
const before = canvas.schemaToJSON();
// … user edits …
const after = canvas.schemaToJSON();

const diff = canvas.diffSchemas(before, after, {
    fieldRenames: [{ nodeId: 'user', from: 'team_id', to: 'organization_id' }],
    detectRenames: true,
});
```

**Options:**

| Option           | Type                                                         | Default | Purpose                                                                                                                                    |
| ---------------- | ------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `fieldRenames`   | `{ nodeId: string, from: string, to: string }[]`             | `[]`    | Authoritative hints — fields in this list are recorded as renames, not add+remove pairs.                                                   |
| `detectRenames`  | `boolean`                                                    | `false` | Best-effort node rename heuristic — a simultaneously-added + removed node with identical field shapes is treated as a rename.              |

**Returns:**

```ts
interface SchemaDiff {
    nodes: { added: Node[]; removed: Node[]; renamed: { from: string; to: string }[] };
    fields: {
        added: { nodeId: string; field: FlowSchemaField }[];
        removed: { nodeId: string; fieldName: string }[];
        renamed: { nodeId: string; from: string; to: string }[];
        changedTypes: { nodeId: string; fieldName: string; from: string; to: string }[];
    };
    edges: { added: Edge[]; removed: Edge[] };
}
```

All deltas are plain arrays — feed them into a review UI, a changelog generator, or a migration codemod without further parsing.

## DOT export

`canvas.toDot(opts?)` emits a graphviz DOT string using HTML-like table node rendering — pipe it to `dot -Tsvg` for print-ready schema diagrams, commit into docs, or embed in a README.

```js
const dot = canvas.toDot({
    rankdir: 'LR',
    showTypes: true,
    showKeys: true,
});
// → 'digraph schema {\n  rankdir=LR;\n  node [shape=plain];\n  user [label=<…>];\n  …'
```

**Options:**

| Option       | Type                    | Default | Purpose                                                                     |
| ------------ | ----------------------- | ------- | --------------------------------------------------------------------------- |
| `rankdir`    | `'LR' \| 'TB' \| 'RL' \| 'BT'` | `'LR'`  | Graph layout direction passed straight to DOT.                              |
| `showTypes`  | `boolean`               | `true`  | Include the type column in the HTML-like label.                             |
| `showKeys`   | `boolean`               | `true`  | Prefix primary / foreign fields with `[PK]` / `[FK]`.                       |

Output is deterministic for the same canvas state, so DOT diffs cleanly in code review.

## Field type registry

`fieldTypeRegistry: string[]` on `flowCanvas({...})` swaps the inspector default-UI "Add field" free-text type input for a `<select>` populated from the registry, preserving declaration order. Empty / missing registry keeps the text input.

```js
flowCanvas({
    fieldTypeRegistry: ['uuid', 'text', 'bigint', 'timestamp', 'jsonb', 'bool'],
    // …
});
```

Common presets:

- **Database types:** `['uuid', 'bigint', 'int', 'text', 'varchar', 'bool', 'timestamp', 'jsonb']`
- **GraphQL types:** `['ID', 'String', 'Int', 'Float', 'Boolean', '[String]', 'Date']`
- **TypeScript types:** `['string', 'number', 'boolean', 'Date', 'string[]', 'Record<string, unknown>']`

Consumer inspectors with custom UI read the same registry via `canvas.fieldTypeRegistry` to drive their own `<select>` controls.

## `schemaLayout(opts?)`

Reference-aware wrapper around the core auto-layout APIs. Tries `canvas.layout()` (dagre, when registered) first, falls back to `canvas.treeLayout()`, then to a simple grid if neither is present. Handy when the addon is loaded standalone without committing to a layout addon.

```js
canvas.schemaLayout({
    direction: 'LR',
    deriveFromReferences: true,
});
```

**Options:**

| Option                 | Type                           | Default | Purpose                                                                                              |
| ---------------------- | ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------- |
| `direction`            | `'LR' \| 'TB' \| 'RL' \| 'BT'` | `'LR'`  | Passed to the underlying layout call.                                                                |
| `deriveFromReferences` | `boolean`                      | `false` | Temporarily compute edges from `inferReferences()` and lay out by that FK graph, then restore edges. |

The fallback chain means `schemaLayout` always does something — pick it over a raw `canvas.layout()` call when you want "arrange nicely" without caring which layout is registered.

## History

`attachSchemaHistory(canvas, opts?)` returns a handle for bounded undo/redo. Opt-in — not auto-attached — so the addon stays inert until you need it.

```js
import { attachSchemaHistory } from '@getartisanflow/alpineflow/schema';

const history = attachSchemaHistory(canvas, { limit: 100 });
history.batch(() => {
    canvas.addField('user', { name: 'avatar_url', type: 'text' });
    canvas.renameField('user', 'team_id', 'organization_id');
});
history.undo();  // rolls back both in one step
history.redo();
```

**Handle shape:**

```ts
interface SchemaHistoryHandle {
    undo(): boolean;
    redo(): boolean;
    canUndo: boolean;   // reactive
    canRedo: boolean;   // reactive
    clear(): void;
    batch<T>(fn: () => T): T;   // rolls back on throw
    dispose(): void;
}
```

**Options:**

| Option   | Type     | Default | Purpose                                                   |
| -------- | -------- | ------- | --------------------------------------------------------- |
| `limit`  | `number` | `50`    | Max snapshots retained. Oldest is dropped past the limit. |

Internally the handle subscribes to `schema:*` events and snapshots via `schemaToJSON`. Undo / redo re-apply with `schemaFromJSON`. The handle sets a feedback-loop guard during apply so the resulting `schema:*` events don't re-enter the undo stack. `batch(fn)` suspends snapshotting and records one snapshot at close; throwing inside rolls back to the pre-batch state without recording.

## Row reordering

Set `rowsReorderable: true` on the canvas to stamp `x-schema-reorderable` on every row the `x-flow-schema` directive produces:

```js
flowCanvas({ rowsReorderable: true, /* … */ });
```

Or stamp manually on specific rows if you want to scope it:

```html
<div x-flow-node="node" x-flow-schema>
    <template x-for="field in node.data.fields" :key="field.name">
        <div class="flow-schema-row" x-schema-reorderable>…</div>
    </template>
</div>
```

On commit the directive calls `canvas.reorderFields(nodeId, orderedNames)` — so the same mismatch guards apply, and the event surface fires normally.

**UX details:**

- 4px movement threshold before the drag starts — a simple click stays a click.
- Capture-phase click suppression on the dragged row prevents row-select from firing after drop.
- Drop between any two rows on the same node; cross-node drags are rejected (silent fail).

## Keyboard field navigation

When `keyboardConnect: true` is set on the canvas, schema rows become focusable for keyboard-only field navigation:

```js
flowCanvas({ keyboardConnect: true, /* … */ });
```

Each row gets:

- `tabindex="0"`
- `role="row"`
- `aria-label="<nodeLabel>: <fieldName> — <fieldType>"` (recomputed live as data changes)

**Key map (on a focused row):**

| Key             | Action                                                             |
| --------------- | ------------------------------------------------------------------ |
| `ArrowDown`     | Focus next row in the same node.                                   |
| `ArrowUp`       | Focus previous row in the same node.                               |
| `Tab`           | Focus first row of the next node. Natural tab-out at the last one. |
| `Shift+Tab`     | Focus last row of the previous node. Natural tab-out at the first.|
| `Enter` / Space | Select the focused row (populates `canvas.selectedRows`).          |
| `Escape`        | Blur the row — restores default tab order.                         |

Keyboard selection fires the same `row-select` path as a click, so an `<x-schema-row-inspector>` on the page picks up the selection immediately.

## WireFlow integration

WireFlow ships a companion preset (`<x-schema-designer>`) and three slot-overridable inspector Blade components that wrap the directives above with richer styling and server-side cascade via the `WithSchemaDesigner` trait. The `<x-schema-field>` Blade primitive surfaces the full handle + class wiring as a single composable row — use it inside an `<x-slot:node>` override to build custom schema templates. It's the same addon — WireFlow just bundles everything with Blade. See the WireFlow docs for the components.

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
