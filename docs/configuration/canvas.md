---
title: Canvas Configuration
description: Background, zoom limits, color mode, and debug options.
order: 2
---

# Canvas Configuration

Core options that control the canvas appearance and viewport behavior.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Node B' } },
        { id: 'c', position: { x: 125, y: 100 }, data: { label: 'Node C' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'a', target: 'c' },
    ],
    background: 'cross',
    backgroundGap: 30,
    fitViewOnInit: true,
    minZoom: 0.5,
    maxZoom: 3,
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
</div>
```
::enddemo

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pannable` | `boolean` | `true` | Enable viewport panning. |
| `zoomable` | `boolean` | `true` | Enable viewport zooming. |
| `minZoom` | `number` | `0.5` | Minimum zoom level. |
| `maxZoom` | `number` | `2` | Maximum zoom level. |
| `fitViewOnInit` | `boolean` | `false` | Auto-fit all nodes in view after initialization. |
| `background` | `string \| BackgroundLayer[]` | `'dots'` | Background pattern: `'dots'`, `'lines'`, `'cross'`, `'none'`, or array of layers. |
| `backgroundGap` | `number` | `20` | Grid spacing in pixels. Overrides `--flow-bg-pattern-gap`. |
| `patternColor` | `string` | — | Pattern color. Overrides `--flow-bg-pattern-color`. Supports `rgba()`. |
| `ariaLabel` | `string` | `'Flow diagram'` | ARIA label for the container. |
| `colorMode` | `'light' \| 'dark' \| 'system'` | — | Color mode management. `'system'` tracks OS preference. Adds/removes `.dark` class. |
| `debug` | `boolean` | `false` | Enable debug logging to console. |

## See also

- [Background](../canvas/background.md)
- [Viewport](../canvas/viewport.md)
- [Theming](../theming/css-variables.md)
