---
title: Loading State
description: Loading overlay with default and custom indicators.
order: 8
---

# Loading State

The `x-flow-loading` directive displays a loading overlay while the canvas initializes or while data is being fetched. It covers the canvas with a semi-transparent backdrop and either a built-in pulsing indicator or your own custom content.

Click "Load Data" to simulate a 2-second data fetch with a loading overlay:

::demo
```toolbar
<button id="demo-loading-trigger" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Load Data</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       document.getElementById('demo-loading-trigger').addEventListener('click', () => {
           setLoading(true);
           setTimeout(() => setLoading(false), 2000);
       });
   ">
    <div x-flow-loading.fade></div>
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

## Usage

Place the directive as a direct child of the flow container:

```html
<div x-data="flowCanvas({ ... })" class="flow-container">
    <div x-flow-loading></div>
    <div x-flow-viewport>...</div>
</div>
```

If the element has no children, a default pulsing node indicator with "Loading..." text is shown. Add custom content to replace it:

```html
<div x-flow-loading>
    <p>Fetching diagram data...</p>
</div>
```

## Modifiers

| Modifier | Description |
|----------|-------------|
| `.fade` | Fade out smoothly (300ms) when loading completes instead of disappearing instantly |

```html
<div x-flow-loading.fade></div>
```

## Controlling Loading State

### Automatic

The overlay shows automatically during canvas initialization (`isLoading` is `true` until `ready` flips). No manual setup is needed for the initial load.

### Manual

Use `setLoading()` to control the loading state programmatically — for example, while fetching data from an API:

```js
// Show loading overlay
$flow.setLoading(true);

// Fetch data, then hide
const data = await fetch('/api/flow').then(r => r.json());
$flow.fromObject(data);
$flow.setLoading(false);
```

The `isLoading` property is `true` when either the canvas hasn't finished initializing OR the user has called `setLoading(true)`.

## Custom Content

Replace the default indicator with your own:

::demo
```toolbar
<button id="demo-loading-custom" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Load Data</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       document.getElementById('demo-loading-custom').addEventListener('click', () => {
           setLoading(true);
           setTimeout(() => setLoading(false), 2000);
       });
   ">
    <div x-flow-loading.fade style="flex-direction: column; gap: 8px;">
        <div style="font-size: 20px;">⏳</div>
        <div style="font-size: 13px; opacity: 0.6;">Fetching diagram data...</div>
    </div>
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

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--flow-loading-bg` | `rgba(255, 255, 255, 0.85)` | Overlay background |
| `--flow-loading-indicator-color` | `rgba(0, 0, 0, 0.08)` | Default indicator pulse color |
| `--flow-loading-text-color` | `rgba(0, 0, 0, 0.4)` | Default indicator text color |

## See also

- [Save & Restore](../interaction/save-restore.md) -- persist and restore canvas state
- [$flow Magic > setLoading](../api/flow-magic/state-management.md) -- programmatic API
