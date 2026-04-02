---
title: Installation
description: Install AlpineFlow via npm or CDN.
order: 1
---

# Installation

## npm (recommended)

```bash
npm install @getartisanflow/alpineflow alpinejs
```

Register AlpineFlow as an Alpine plugin:

```js
import Alpine from 'alpinejs';
import AlpineFlow from '@getartisanflow/alpineflow';

Alpine.plugin(AlpineFlow);
Alpine.start();
```

> **Livewire users:** Alpine is already bundled with Livewire. Don't import Alpine separately — just register the plugin on the `alpine:init` event. See [Livewire integration](#livewire).

### CSS

AlpineFlow requires structural CSS. A default theme is optional but recommended:

```css
/* Both structural + default theme */
@import '@getartisanflow/alpineflow/css';
@import '@getartisanflow/alpineflow/theme';
```

Or import structural CSS only and bring your own theme:

```css
@import '@getartisanflow/alpineflow/css';
```

See [Theming](../theming/_index.md) for CSS variable customization.

## CDN

For prototyping or non-bundler setups:

```html
<link rel="stylesheet" href="https://unpkg.com/@getartisanflow/alpineflow/dist/alpineflow.css">
<link rel="stylesheet" href="https://unpkg.com/@getartisanflow/alpineflow/dist/alpineflow-theme.css">

<script defer src="https://unpkg.com/alpinejs@3/dist/cdn.min.js"></script>
<script defer src="https://unpkg.com/@getartisanflow/alpineflow/dist/alpineflow.js"></script>
```

The CDN build auto-registers with Alpine via the `alpine:init` event. No manual plugin registration needed.

## Livewire

If you're using [WireFlow](https://github.com/getartisanflow/wireflow) (the Livewire integration), AlpineFlow is bundled automatically — no npm install required. See the [WireFlow docs](https://github.com/getartisanflow/wireflow) for setup.

If you're using AlpineFlow directly in a Livewire app (without WireFlow), register it on the `alpine:init` event since Livewire manages Alpine's lifecycle:

```js
import AlpineFlow from '@getartisanflow/alpineflow';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineFlow);
});
```

> **Do not** call `Alpine.start()` — Livewire handles that.

## Optional Addons

AlpineFlow's core is lightweight. Layout engines, collaboration, and whiteboard tools are separate sub-path imports that require their own peer dependencies:

| Addon | Import | Peer Dependency |
|-------|--------|-----------------|
| Dagre layout | `@getartisanflow/alpineflow/dagre` | `@dagrejs/dagre` |
| Force layout | `@getartisanflow/alpineflow/force` | `d3-force` |
| Tree layout | `@getartisanflow/alpineflow/hierarchy` | `d3-hierarchy` |
| ELK layout | `@getartisanflow/alpineflow/elk` | `elkjs` |
| Whiteboard | `@getartisanflow/alpineflow/whiteboard` | — |
| Collaboration | `@getartisanflow/alpineflow/collab` | `yjs`, `y-websocket`, `y-protocols` |

Example — adding dagre layout:

```bash
npm install @dagrejs/dagre
```

```js
import AlpineFlow from '@getartisanflow/alpineflow';
import AlpineFlowDagre from '@getartisanflow/alpineflow/dagre';

Alpine.plugin(AlpineFlow);
Alpine.plugin(AlpineFlowDagre);
```

See [Addons](../addons/_index.md) for detailed setup per addon.

## Requirements

- Alpine.js 3.15+
- Modern browser (ES2020+)
