---
title: Groups & Nesting
description: Parent-child hierarchies, drag-to-reparent, and child validation.
order: 4
---

# Groups & Nesting

AlpineFlow supports hierarchical node structures where parent nodes contain and manage child nodes. Groups enable visual organization, drag-to-reparent interactions, and validation rules for child membership.

Drag the children within the group — they expand the parent when near the boundary:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'group', type: 'group', position: { x: 0, y: 0 }, data: { label: 'My Group' }, style: { width: '280px', height: '180px' } },
        { id: 'child-1', parentId: 'group', position: { x: 20, y: 40 }, data: { label: 'Child A' }, expandParent: true },
        { id: 'child-2', parentId: 'group', position: { x: 20, y: 110 }, data: { label: 'Child B' }, expandParent: true },
    ],
    edges: [
        { id: 'e1', source: 'child-1', target: 'child-2' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <template x-if="node.type === 'group'">
                    <div x-flow-drag-handle class="px-2 py-1 text-xs font-mono font-medium opacity-60" x-text="node.data.label"></div>
                </template>
                <template x-if="node.type !== 'group'">
                    <div>
                        <div x-flow-handle:target></div>
                        <span x-text="node.data.label"></span>
                        <div x-flow-handle:source></div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Parent-child basics

To create a parent-child relationship, set `parentId` on the child node and `type: 'group'` on the parent node. Child node positions are **relative to their parent**, so `{ x: 10, y: 20 }` means 10px right and 20px down from the parent's top-left corner.

```js
nodes: [
    { id: 'group-1', type: 'group', position: { x: 100, y: 100 }, data: { label: 'My Group' }, width: 300, height: 200 },
    { id: 'child-1', parentId: 'group-1', position: { x: 10, y: 40 }, data: { label: 'Child Node' } },
    { id: 'child-2', parentId: 'group-1', position: { x: 10, y: 100 }, data: { label: 'Another Child' } },
]
```

Set `expandParent: true` on a child node to automatically expand the parent's dimensions when the child is dragged near the parent's boundary.

## Group styling

Group nodes receive the `.flow-node-group` CSS class, which applies a dashed border and semi-transparent background by default. The group label is rendered from `data.label` and appears at the top of the group.

```css
.flow-node-group {
    border: 2px dashed var(--flow-group-border-color);
    background: var(--flow-group-bg);
}
```

You can override these styles in your own CSS to customize group appearance.

## Nested groups

Multi-level nesting is fully supported. A group can be the child of another group, creating deep hierarchies. Z-index is auto-computed as `parent.zIndex + 1 + child.zIndex`, ensuring children always render above their parents without manual z-index management.

```js
nodes: [
    { id: 'outer', type: 'group', position: { x: 0, y: 0 } },
    { id: 'inner', type: 'group', parentId: 'outer', position: { x: 20, y: 40 } },
    { id: 'leaf', parentId: 'inner', position: { x: 10, y: 30 }, data: { label: 'Deep child' } },
]
```

## Drag-to-reparent

Nodes can be reparented by dragging them onto a droppable target. To make a node accept dropped children, set `droppable: true` on the target node.

```js
{ id: 'target', type: 'group', droppable: true, position: { x: 200, y: 200 }, data: { label: 'Drop here' } }
```

When a node is dragged onto a droppable node:

1. The node is **auto-detached** from its old parent (if any).
2. Its position is recalculated relative to the new parent.
3. A **circular guard** prevents reparenting a node to one of its own descendants.

You can also reparent programmatically:

```js
$flow.reparentNode('child-id', 'new-parent-id')
```

Drag the loose node onto either group to reparent it:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'group-a', type: 'group', position: { x: 0, y: 0 }, data: { label: 'Group A' }, droppable: true, style: { width: '180px', height: '120px' } },
        { id: 'group-b', type: 'group', position: { x: 280, y: 0 }, data: { label: 'Group B' }, droppable: true, style: { width: '180px', height: '120px' } },
        { id: 'loose', position: { x: 140, y: 160 }, data: { label: 'Drag me' } },
    ],
    edges: [],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <template x-if="node.type === 'group'">
                    <div x-flow-drag-handle class="px-2 py-1 text-xs font-mono font-medium opacity-60" x-text="node.data.label"></div>
                </template>
                <template x-if="node.type !== 'group'">
                    <div>
                        <div x-flow-handle:target></div>
                        <span x-text="node.data.label"></span>
                        <div x-flow-handle:source></div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</div>
```
::enddemo

### Constraining children to parent

Set `extent: 'parent'` on a child node to prevent it from being dragged outside its parent's bounds:

```js
{ id: 'child-1', parentId: 'group-1', extent: 'parent', position: { x: 10, y: 40 }, data: { label: 'Locked in' } }
```

The children below can't leave their group:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'group', type: 'group', position: { x: 0, y: 0 }, data: { label: 'Contained' }, style: { width: '420px', height: '160px' } },
        { id: 'c1', parentId: 'group', extent: 'parent', position: { x: 20, y: 50 }, data: { label: 'Locked A' } },
        { id: 'c2', parentId: 'group', extent: 'parent', position: { x: 240, y: 50 }, data: { label: 'Locked B' } },
    ],
    edges: [
        { id: 'e1', source: 'c1', target: 'c2' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <template x-if="node.type === 'group'">
                    <div x-flow-drag-handle class="px-2 py-1 text-xs font-mono font-medium opacity-60" x-text="node.data.label"></div>
                </template>
                <template x-if="node.type !== 'group'">
                    <div>
                        <div x-flow-handle:target></div>
                        <span x-text="node.data.label"></span>
                        <div x-flow-handle:source></div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Child validation

Define validation rules per node type using `childValidationRules` in your config:

| Property | Type | Description |
|----------|------|-------------|
| `allowedTypes` | `string[]` | Node types permitted as children |
| `minChildren` | `number` | Minimum number of children required |
| `maxChildren` | `number` | Maximum number of children allowed |
| `maxDepth` | `number` | Maximum nesting depth from this node |
| `custom` | `(parent, child) => boolean` | Custom validator function |

```js
childValidationRules: {
    group: {
        allowedTypes: ['task', 'note'],
        maxChildren: 10,
        maxDepth: 3,
        custom: (parent, child) => child.data.priority !== 'low',
    },
}
```

Validation runs on drag, delete, and programmatic add. Invalid states apply CSS classes for visual feedback:

- `.flow-node-invalid` on nodes that fail validation
- `.flow-node-drop-target` on the target during a valid drag-over

Use the `onChildValidationFail` callback to handle failures:

```js
onChildValidationFail: (parent, child, reason) => {
    console.warn(`Cannot add ${child.id} to ${parent.id}: ${reason}`)
}
```

## Child layout

AlpineFlow provides methods for automatic child layout within groups:

- **`layoutChildren(parentId)`** -- auto-stacks children vertically within the parent, evenly spaced.
- **`propagateLayoutUp()`** -- recalculates parent dimensions bottom-up after layout changes.
- **`reorderChild(nodeId, newOrder)`** -- moves a child to a new position in the visual order.

```js
$flow.layoutChildren('group-1')
$flow.reorderChild('child-2', 0) // Move to first position
```

Click "Layout" to auto-stack children within the group:

::demo
```toolbar
<button id="demo-childlayout" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Layout</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'group', type: 'group', position: { x: 0, y: 0 }, data: { label: 'Tasks' }, dimensions: { width: 200, height: 300 }, childLayout: { direction: 'column', gap: 8, padding: 10 } },
        { id: 't1', parentId: 'group', position: { x: 50, y: 80 }, data: { label: 'Task 1' } },
        { id: 't2', parentId: 'group', position: { x: 10, y: 30 }, data: { label: 'Task 2' } },
        { id: 't3', parentId: 'group', position: { x: 80, y: 200 }, data: { label: 'Task 3' } },
    ],
    edges: [],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="document.getElementById('demo-childlayout').addEventListener('click', () => $flow.layoutChildren('group'))">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <template x-if="node.type === 'group'">
                    <div x-flow-drag-handle class="px-2 py-1 text-xs font-mono font-medium opacity-60" x-text="node.data.label"></div>
                </template>
                <template x-if="node.type !== 'group'">
                    <div>
                        <span x-text="node.data.label"></span>
                    </div>
                </template>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Collapse and expand

The `x-flow-collapse` directive toggles the collapsed state of a node, hiding its descendant nodes and any edges connected to them.

```html
<button x-flow-collapse="node.id">
    <span x-text="node.collapsed ? 'Expand' : 'Collapse'"></span>
</button>
```

### Collapse modifiers

| Modifier | Description |
|----------|-------------|
| `.instant` | Skip the collapse/expand animation |
| `.all` | Collapse or expand all collapsible nodes at once |
| `.expand` | Expand only -- never collapse. Useful for "expand all" buttons |
| `.children` | Collapse/expand the children of the specified node, not the node itself |

Modifiers can be combined:

```html
<!-- Instantly expand all nodes -->
<button x-flow-collapse.all.expand.instant>Expand All</button>

<!-- Collapse children of a specific node without animation -->
<button x-flow-collapse.children.instant="node.id">Collapse Children</button>
```

### Collapse events

| Event | Payload | Description |
|-------|---------|-------------|
| `node-collapse` | `{ node, nodeId }` | Fired when a node is collapsed |
| `node-expand` | `{ node, nodeId }` | Fired when a node is expanded |

Click the collapse button to hide the group's children:

::demo
```toolbar
<button id="demo-collapse-groups" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Toggle Collapse</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'input', position: { x: 0, y: 80 }, data: { label: 'Input' } },
        { id: 'group', type: 'group', position: { x: 200, y: 0 }, data: { label: 'Processing' }, dimensions: { width: 280, height: 180 } },
        { id: 'step-1', parentId: 'group', position: { x: 20, y: 40 }, data: { label: 'Step 1' } },
        { id: 'step-2', parentId: 'group', position: { x: 20, y: 110 }, data: { label: 'Step 2' } },
        { id: 'output', position: { x: 560, y: 80 }, data: { label: 'Output' } },
    ],
    edges: [
        { id: 'e1', source: 'input', target: 'step-1' },
        { id: 'e2', source: 'step-1', target: 'step-2' },
        { id: 'e3', source: 'step-2', target: 'output' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       document.getElementById('demo-collapse-groups').addEventListener('click', () => {
           const group = getNode('group');
           if (group.collapsed) {
               $flow.expandNode('group');
           } else {
               $flow.collapseNode('group');
           }
       });
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <template x-if="node.type === 'group'">
                    <div x-flow-drag-handle class="px-2 py-1 text-xs font-mono font-medium opacity-60" x-text="node.data.label"></div>
                </template>
                <template x-if="node.type !== 'group'">
                    <div>
                        <div x-flow-handle:target></div>
                        <span x-text="node.data.label"></span>
                        <div x-flow-handle:source></div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Condense

The `x-flow-condense` directive toggles a node between its full view and a condensed (summary) view. Unlike collapse, which hides children, condense changes how the node itself is displayed.

```html
<button x-flow-condense="node.id">
    <span x-text="node.condensed ? 'Show Full' : 'Show Summary'"></span>
</button>
```

Use `x-show` to switch between full and condensed content:

```html
<div x-flow-node="node">
    <button x-flow-condense="node.id">Toggle</button>

    <!-- Full view -->
    <div x-show="!node.condensed">
        <h3 x-text="node.data.title"></h3>
        <p x-text="node.data.description"></p>
        <ul>
            <template x-for="item in node.data.items" :key="item.id">
                <li x-text="item.label"></li>
            </template>
        </ul>
    </div>

    <!-- Condensed view -->
    <div x-show="node.condensed">
        <h3 x-text="node.data.title"></h3>
        <span x-text="node.data.items.length + ' items'"></span>
    </div>
</div>
```

Condensed nodes receive the `.flow-node-condensed` CSS class, which applies `overflow: hidden` by default. Style the condensed state with CSS:

```css
.flow-node-condensed {
    max-height: 48px;
    transition: max-height 0.2s ease;
}
```

### Condense events

| Event | Payload | Description |
|-------|---------|-------------|
| `node-condense` | `{ node, nodeId }` | Fired when a node is condensed |
| `node-uncondense` | `{ node, nodeId }` | Fired when a node is restored to full view |

## See also

- [Node Basics](basics.md) -- core node directive and data shape
- [Styling](styling.md) -- CSS classes and theming
