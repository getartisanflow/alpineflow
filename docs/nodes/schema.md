---
title: Schema Nodes
description: Dedicated node type for database tables, GraphQL types, API schemas — any structured object with a list of labelled fields.
order: 8
---

# Schema Nodes

The `x-flow-schema` directive turns a node into a structured table display — header + one row per field + per-row labelled handles. It's the right primitive for ERD diagrams, GraphQL schema viewers, API payload designers, and anything where users drag connections between specific fields of one object and another.

## Minimal example

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
    },
  ],
  edges: [],
})">
  <div x-flow-viewport>
    <template x-for="node in nodes" :key="node.id">
      <div x-flow-node="node" x-flow-schema></div>
    </template>
  </div>
</div>
```

The directive reads `node.data.label` and `node.data.fields` at init and re-runs on any mutation to those properties. Each field becomes one row with:

- a **target handle on the left** (for incoming edges)
- the field name + optional icon prefix
- a **type pill on the right**
- a **source handle on the right** (for outgoing edges)

Both handles carry `data-flow-handle-id="<field.name>"` — edges between schema nodes set `sourceHandle` and `targetHandle` to field names, and AlpineFlow's handle infrastructure resolves the coordinates automatically.

## Field shape

```ts
interface FlowSchemaField {
  name: string;
  type: string;
  key?: 'primary' | 'foreign';
  required?: boolean;
  icon?: string;
}
```

Only `name` and `type` are load-bearing. The rest drive CSS decorations:

| Flag            | Class added                          | Default theme               |
| --------------- | ------------------------------------ | --------------------------- |
| `key: primary`  | `flow-schema-row--pk`                | PK badge (amber)            |
| `key: foreign`  | `flow-schema-row--fk`                | FK badge (violet)           |
| `required`      | `flow-schema-row--required`          | red asterisk suffix         |
| `icon`          | renders `.flow-schema-row-icon` span | inline prefix (emoji / text) |

## Connecting fields

An edge between two schema nodes specifies which field on each side it attaches to:

```js
{
  id: 'user-team',
  source: 'user',
  sourceHandle: 'team_id',
  target: 'team',
  targetHandle: 'id',
}
```

Users drag from a row's right-edge handle to another row's left-edge handle — AlpineFlow records `sourceHandle` / `targetHandle` from the handle ids automatically.

## Custom rendering

The directive fully owns the node element's contents. For custom rendering, skip the directive and write your own template:

```html
<div x-flow-node="node">
  <div class="my-header" x-text="node.data.label"></div>
  <template x-for="field in node.data.fields" :key="field.name">
    <div class="my-row">
      <div x-flow-handle:target.left="field.name"></div>
      <span x-text="field.name"></span>
      <span x-text="field.type"></span>
      <div x-flow-handle:source.right="field.name"></div>
    </div>
  </template>
</div>
```

The handle ids + positions + per-row structure are the only things edge wiring cares about — everything else is yours.

## See Also

- [Schema Addon](../addons/schema.md) — field CRUD with edge cascade, reference inference, JSON serialization, and inspector directives built on top of this primitive
