---
title: Collapse & Condense
description: Hide descendants or switch to summary view.
order: 3
---

# Collapse & Condense

AlpineFlow supports collapsing node hierarchies to hide descendants and condensing nodes into summary views.

Click the buttons to collapse and expand the group — child nodes are hidden when collapsed:

::demo
```toolbar
<button id="demo-collapse-toggle" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Toggle Collapse</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'group', type: 'group', position: { x: 0, y: 0 }, data: { label: 'Team' }, dimensions: { width: 300, height: 180 } },
        { id: 'child1', position: { x: 20, y: 40 }, data: { label: 'Alice' }, parentId: 'group' },
        { id: 'child2', position: { x: 160, y: 40 }, data: { label: 'Bob' }, parentId: 'group' },
        { id: 'child3', position: { x: 90, y: 110 }, data: { label: 'Carol' }, parentId: 'group' },
        { id: 'outside', position: { x: 380, y: 60 }, data: { label: 'Manager' } },
    ],
    edges: [
        { id: 'e1', source: 'child1', target: 'child3' },
        { id: 'e2', source: 'child2', target: 'child3' },
        { id: 'e3', source: 'group', target: 'outside' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       document.getElementById('demo-collapse-toggle').addEventListener('click', () => {
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
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Collapse API

Collapse and expand nodes programmatically via `$flow`:

```js
// Collapse a node — hides all descendants
$flow.collapseNode('group-1');

// Expand a collapsed node — reveals descendants
$flow.expandNode('group-1');

// Toggle
const node = $flow.getNode('group-1');
node.collapsed ? $flow.expandNode('group-1') : $flow.collapseNode('group-1');
```

See the [Hierarchy API reference](../api/flow-magic/hierarchy.md) for all available methods.

## Collapse with x-flow-collapse directive

The `x-flow-collapse` directive adds a clickable collapse/expand toggle to a group node:

```html
<div x-flow-node="node">
    <div x-flow-collapse></div>
    <span x-text="node.data.label"></span>
</div>
```

The directive renders a toggle button that calls `collapseNode()` / `expandNode()` on click. It auto-hides on non-group nodes.

## Related

- [Nodes & Groups](../nodes/groups.md) -- parent-child relationships, batch modifiers, and full collapse/condense documentation
- [Contextual Zoom](../canvas/contextual-zoom.md) -- show/hide content within nodes based on zoom level using `x-flow-detail`
- [Hierarchy API](../api/flow-magic/hierarchy.md) -- collapseNode, expandNode, reparentNode, and more
