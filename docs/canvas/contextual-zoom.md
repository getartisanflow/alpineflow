---
title: Contextual Zoom
description: Show and hide content based on zoom level.
order: 9
---

# Contextual Zoom

The `x-flow-detail` directive provides progressive disclosure — showing or hiding content within nodes based on the current zoom level. Show a summary when zoomed out and reveal details when zoomed in.

Zoom in and out (scroll wheel or pinch) to see content change:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'card', position: { x: 0, y: 0 }, data: { label: 'Task Card', summary: '3 subtasks', details: 'Review design specs, update wireframes, and submit for approval.' } },
        { id: 'card2', position: { x: 300, y: 0 }, data: { label: 'Deploy', summary: '2 steps', details: 'Run CI pipeline and push to production.' } },
    ],
    edges: [
        { id: 'e1', source: 'card', target: 'card2' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: true,
    minZoom: 0.2,
    maxZoom: 3,
})" class="flow-container" style="height: 250px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" style="min-width: 140px;">
                <div x-flow-handle:target.left></div>
                <div style="font-weight: 600; font-size: 13px;" x-text="node.data.label"></div>
                <div x-flow-detail.far style="font-size: 11px; opacity: 0.5;" x-text="node.data.summary"></div>
                <div x-flow-detail.close style="font-size: 11px; opacity: 0.6; max-width: 180px;" x-text="node.data.details"></div>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Preset Modifiers

Three preset modifiers map to configurable zoom thresholds:

| Modifier | Visible when | Default threshold |
|----------|-------------|-------------------|
| `.far` | zoom < `far` | zoom < 0.4 |
| `.medium` | `far` <= zoom <= `medium` | 0.4 <= zoom <= 0.75 |
| `.close` | zoom > `medium` | zoom > 0.75 |

```html
<div x-flow-node="node">
    <!-- Always visible: the node title -->
    <h3>Task Card</h3>

    <!-- Only visible when zoomed out (overview) -->
    <span x-flow-detail.far>3 subtasks</span>

    <!-- Visible at a medium zoom range -->
    <ul x-flow-detail.medium>
        <li>Subtask A</li>
        <li>Subtask B</li>
        <li>Subtask C</li>
    </ul>

    <!-- Only visible when zoomed in close -->
    <div x-flow-detail.close>
        <p>Detailed description and metadata...</p>
    </div>
</div>
```

This is ideal for task boards, org charts, and any diagram where nodes contain varying levels of detail. At a high level, users see node titles and counts. When they zoom into a specific area, full content appears.

## Custom Thresholds

Instead of using preset modifiers, pass an expression with explicit `min` and/or `max` values:

```html
<!-- Visible only between 0.5x and 2x zoom -->
<div x-flow-detail="{ min: 0.5, max: 2 }">Custom range content</div>

<!-- Visible above 1.5x zoom (no upper bound) -->
<div x-flow-detail="{ min: 1.5 }">High zoom content</div>

<!-- Visible below 0.3x zoom (no lower bound) -->
<div x-flow-detail="{ max: 0.3 }">Overview-only content</div>
```

When `min` is omitted it defaults to `0`. When `max` is omitted it defaults to `Infinity`.

Custom thresholds give you fine-grained control for specific elements without changing the global presets.

## Configuring Global Thresholds

The default threshold values (`far: 0.4`, `medium: 0.75`) come from the canvas `zoomLevels` configuration. Override them globally:

```html
<div x-data="flowCanvas({
    zoomLevels: {
        far: 0.3,
        medium: 0.6,
    },
})">
```

All `x-flow-detail` directives using preset modifiers (`.far`, `.medium`, `.close`) will use the updated thresholds.

## Use Cases

| Zoom level | What to show | Example |
|------------|-------------|---------|
| **Far** (zoomed out) | Minimal — titles, badges, counts | "3 tasks", status dot |
| **Medium** | Moderate — lists, short descriptions | Subtask names, assignees |
| **Close** (zoomed in) | Full — rich content, forms, metadata | Full descriptions, edit controls, timestamps |

### Combining presets

Elements without `x-flow-detail` are always visible. Combine with detail elements to create a natural hierarchy:

```html
<div x-flow-node="node">
    <!-- Always visible -->
    <div class="node-title" x-text="node.data.title"></div>

    <!-- Far: just a count badge -->
    <span x-flow-detail.far class="badge" x-text="node.data.itemCount + ' items'"></span>

    <!-- Medium: show the list -->
    <ul x-flow-detail.medium>
        <template x-for="item in node.data.items" :key="item">
            <li x-text="item"></li>
        </template>
    </ul>

    <!-- Close: show everything including actions -->
    <div x-flow-detail.close>
        <p x-text="node.data.description"></p>
        <button class="nodrag" @click="editNode(node.id)">Edit</button>
    </div>
</div>
```

## Behavior

The directive toggles the element's `display` property. When the current zoom level falls outside the element's range, `display` is set to `none`. When inside the range, the inline `display` style is removed so the element returns to its natural display value.

This means:
- No layout shift for hidden elements — they take up zero space when hidden
- CSS transitions on `display` won't work (use `opacity` if you need animated transitions)
- The element's natural `display` value is preserved (block, flex, inline, etc.)

## See also

- [Viewport](viewport.md) — zoom controls and configuration
- [Keyboard Shortcuts](keyboard-shortcuts.md) — zoom shortcuts
