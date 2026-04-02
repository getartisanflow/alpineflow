---
title: Custom Themes
description: Build your own theme from structural CSS.
order: 3
---

# Custom Themes

AlpineFlow separates layout from appearance, letting you build a fully custom theme on top of the structural CSS layer.

## CSS architecture

AlpineFlow ships three CSS layers:

| File | Purpose | Required? |
|---|---|---|
| `structural.css` | Positioning, z-index, cursors, transforms, `var()` references | Yes |
| `theme-default.css` | Neutral zinc/slate theme with light + dark mode | Optional |
| `theme-flux.css` | Tailwind v4 / Flux UI native theme using design tokens | Optional |

The barrel file `alpineflow.css` imports structural + default:

```css
/* alpineflow.css */
@import './alpineflow/structural.css';
@import './alpineflow/theme-default.css';
```

## Structural-only mode

Import just `structural.css` for positioning and interaction with zero visual opinions:

```css
@import './alpineflow/structural.css';
/* Bring your own theme below */
```

All positioning, z-indexing, cursors, and transforms work. Every visual property reads from `var(--flow-*)` with minimal fallbacks (transparent backgrounds, no shadows, no borders). Set the variables you care about and leave the rest.

This is useful when embedding AlpineFlow into a design system with its own tokens.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 20, y: 30 }, data: { label: 'Custom' } },
        { id: 'b', position: { x: 250, y: 30 }, data: { label: 'Theme' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 180px; --flow-node-bg: #1e1b4b; --flow-node-color: #e0e7ff; --flow-node-border-color: #4338ca; --flow-node-border-top: 3px solid #818cf8; --flow-bg-dot-color: #312e81; --flow-edge-stroke: #6366f1;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <div x-flow-handle:target.left></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source.right></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Accent stripe

The default theme adds a distinctive colored top border to nodes via `--flow-node-border-top`:

```css
/* Light mode: subtle zinc stripe */
--flow-node-border-top: 2.5px solid #d4d4d8;

/* Dark mode: slightly brighter */
--flow-node-border-top: 2.5px solid #52525b;
```

The structural CSS applies this with a fallback:

```css
.flow-node {
    border-top: var(--flow-node-border-top, var(--flow-node-border));
}
```

To disable the accent stripe and use the same border on all sides:

```css
.flow-container {
    --flow-node-border-top: var(--flow-node-border);
}
```

To use a brand-colored stripe:

```css
.flow-container {
    --flow-node-border-top: 2.5px solid #3b82f6;
}
```

## Flux theme

The Flux theme maps all `--flow-*` variables to Tailwind v4 design tokens and Flux UI's `--color-accent` system. Flowcharts automatically match your app's look and adapt to any TweakFlux preset (Dracula, Nord, Catppuccin, etc.).

```css
@import './alpineflow/structural.css';
@import './alpineflow/theme-flux.css';
```

Key mappings:

| AlpineFlow Variable | Flux Token |
|---|---|
| `--flow-node-hover-border-color` | `var(--color-accent)` |
| `--flow-node-selected-border-color` | `var(--color-accent)` |
| `--flow-edge-stroke-selected` | `var(--color-accent)` |
| `--flow-node-bg` | `var(--color-white)` / `var(--color-zinc-800)` |
| `--flow-node-border` | `var(--color-zinc-200)` / `var(--color-zinc-700)` |
| `--flow-node-border-radius` | `var(--radius-lg)` |
| `--flow-node-shadow` | `var(--shadow-xs)` |
| `--flow-selection-bg` | `color-mix(in oklab, var(--color-accent) 6%, transparent)` |

The Flux theme uses `color-mix(in oklab, ...)` for accent transparencies, matching Flux UI's convention.

## Building a custom theme file

Create a new CSS file that sets `--flow-*` variables on `.flow-container`:

```css
/* my-theme.css */
.flow-container {
    --flow-bg-color: #1e1e2e;
    --flow-node-bg: #313244;
    --flow-node-color: #cdd6f4;
    --flow-node-border: 1px solid #45475a;
    --flow-node-border-radius: 8px;
    --flow-node-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    --flow-edge-stroke: #6c7086;
    --flow-handle-bg: #89b4fa;
    /* ... set as many or as few variables as needed */
}
```

Import it after the structural layer:

```css
@import './alpineflow/structural.css';
@import './my-theme.css';
```

Any variables you don't set will use the structural layer's minimal fallbacks.
