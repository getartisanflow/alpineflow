---
title: Save & Restore
description: Snapshot canvas state to memory or localStorage.
order: 5
---

# Save & Restore

AlpineFlow provides multiple ways to save and restore canvas state: the `x-flow-snapshot` directive for declarative save/restore, the `x-flow-action:export` directive for image export, and the programmatic `toObject()` / `fromObject()` API for custom persistence.

Move the nodes around, then click Save. Move them again, then click Restore to return to the saved state:

::demo
```toolbar
<button id="demo-save" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Save</button>
<button id="demo-restore" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body" disabled>Restore</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 125, y: 100 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'c' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       let saved = null;
       const saveBtn = document.getElementById('demo-save');
       const restoreBtn = document.getElementById('demo-restore');
       if (saveBtn) saveBtn.addEventListener('click', () => {
           saved = $flow.toObject();
           restoreBtn.disabled = false;
       });
       if (restoreBtn) restoreBtn.addEventListener('click', () => {
           if (saved) $flow.fromObject(saved);
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

## x-flow-snapshot Directive

Declaratively save and restore the full canvas state (nodes, edges, viewport) with a single directive.

### Usage

```html
<!-- Save current state under the key "draft" -->
<button x-flow-snapshot:save="'draft'">Save Draft</button>

<!-- Restore the "draft" snapshot -->
<button x-flow-snapshot:restore="'draft'">Restore Draft</button>

<!-- Persist to localStorage instead of in-memory -->
<button x-flow-snapshot:save.persist="'draft'">Save to Storage</button>
<button x-flow-snapshot:restore.persist="'draft'">Restore from Storage</button>
```

### Signature

| Part | Value |
|------|-------|
| Argument | **Required.** `:save` or `:restore` |
| Modifier | `.persist` -- use `localStorage` instead of in-memory storage |
| Expression | **Required.** A snapshot key string |

### `:save` Behavior

Captures the current canvas state (nodes, edges, and viewport transform) and stores it under the given key.

### `:restore` Behavior

Loads a previously saved snapshot and applies it to the canvas, replacing the current state.

### `.persist` Modifier

Without `.persist`, snapshots are held in memory and lost on page refresh. With `.persist`, snapshots are written to `localStorage` using the key format:

```
alpineflow-snapshot-{key}
```

For example, `x-flow-snapshot:save.persist="'draft'"` writes to `localStorage` key `alpineflow-snapshot-draft`.

### Auto-Disable

A restore button is **automatically disabled** when no snapshot exists for the given key. This applies to both in-memory and persisted snapshots.

## Programmatic API: toObject / fromObject

For custom persistence workflows (saving to a database, syncing with a server, etc.), use the `$flow` magic methods.

### toObject()

```ts
$flow.toObject(): { nodes: FlowNode[]; edges: FlowEdge[]; viewport: Viewport }
```

Serialize the current canvas state as a deep-cloned plain object. Suitable for saving to a database or localStorage. Emits a `save` event.

### fromObject()

```ts
$flow.fromObject(obj: {
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  viewport?: Partial<Viewport>;
}): void
```

Restore canvas state from a previously serialized object. Replaces the current nodes, edges, and viewport.

### Custom Persistence Example

```js
// Save to localStorage manually
const state = $flow.toObject();
localStorage.setItem('my-flow', JSON.stringify(state));

// Restore from localStorage
const saved = JSON.parse(localStorage.getItem('my-flow'));
if (saved) {
    $flow.fromObject(saved);
}
```

## Export as Image

The `x-flow-action:export` directive exports the canvas as an image file:

```html
<button x-flow-action:export="{ filename: 'flow.png' }">Export PNG</button>

<button x-flow-action:export="{ filename: 'my-diagram.png', scale: 2 }">
  Export HD
</button>
```

Click "Export PNG" to download the canvas as an image:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Input' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'Output' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
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
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
    <div x-flow-panel:bottom-right.static style="background: none; border: none; box-shadow: none; --flow-panel-min-height: 0; --flow-panel-min-width: 0; padding: 8px;">
        <button x-flow-action:export="{ filename: 'flow.png' }" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Export PNG</button>
    </div>
</div>
```
::enddemo
