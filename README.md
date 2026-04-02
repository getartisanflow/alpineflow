# AlpineFlow

A directive-driven flow diagram and node-graph engine for [Alpine.js](https://alpinejs.dev) -- interactive flowcharts, diagrams, and visual editors with a simple `x-flow-*` API.

## Install

```bash
npm install @getartisanflow/alpineflow alpinejs
```

## Quick Start

```js
import Alpine from 'alpinejs';
import AlpineFlow from '@getartisanflow/alpineflow';

Alpine.plugin(AlpineFlow);
Alpine.start();
```

```html
<div x-data="flowCanvas({
    nodes: [
        { id: '1', position: { x: 0, y: 0 }, data: { label: 'Hello' } },
        { id: '2', position: { x: 200, y: 100 }, data: { label: 'World' } },
    ],
    edges: [
        { id: 'e1', source: '1', target: '2' },
    ],
})">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" x-text="node.data.label"></div>
        </template>
    </div>
</div>
```

## CSS

```css
@import '@getartisanflow/alpineflow/css';        /* structural (required) */
@import '@getartisanflow/alpineflow/theme';      /* default theme (optional) */
```

## Features

- **Directive-driven API** -- build flows with `x-flow-*` directives, no framework boilerplate
- **7 edge types** -- bezier, smoothstep, straight, orthogonal, avoidant, editable, floating
- **Node shapes, groups & nesting** -- resize, rotate, and compose complex layouts
- **Connection modes** -- drag, click, proximity, multi-connect, easy connect
- **Canvas controls** -- minimap, background patterns, panels, keyboard shortcuts
- **Animation engine** -- timeline, particles, path motion (orbit, wave, pendulum, drift), camera follow
- **Compute flows** -- manual and auto modes for data-driven pipelines
- **Interactions** -- context menus, toolbars, collapse, drag from sidebar, save/restore, undo/redo, touch support
- **Theming** -- CSS variables and dark mode
- **TypeScript** -- full type definitions included

## Optional Addons

```bash
# Layout engines (install only what you need)
npm install @dagrejs/dagre    # for @getartisanflow/alpineflow/dagre
npm install elkjs             # for @getartisanflow/alpineflow/elk
npm install d3-force          # for @getartisanflow/alpineflow/force
npm install d3-hierarchy      # for @getartisanflow/alpineflow/hierarchy

# Whiteboard tools
import AlpineFlowWhiteboard from '@getartisanflow/alpineflow/whiteboard';

# Real-time collaboration
npm install yjs y-websocket y-protocols
import AlpineFlowCollab from '@getartisanflow/alpineflow/collab';
```

## Documentation

Full documentation is available at [artisanflow.dev](https://artisanflow.dev).

Follow the journey of building AlpineFlow and WireFlow at [zachiler.dev](https://zachiler.dev).

## Acknowledgements

AlpineFlow was inspired by [React Flow](https://reactflow.dev) and its core architecture. Special thanks to the React Flow team for pioneering the open-source node-based UI space.

## License

MIT -- Created by [Zac Hiler](https://github.com/zachiler)
