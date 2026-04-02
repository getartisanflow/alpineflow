---
title: Dark Mode
description: Class-based dark mode with system preference support.
order: 2
---

# Dark Mode

AlpineFlow uses class-based dark mode, the same convention as Tailwind CSS v4.

## Class-based

Place `.dark` on an ancestor element or on `.flow-container` itself:

```html
<!-- .dark on <html> (framework convention) -->
<html class="dark">
  <div x-data="flowCanvas({ ... })" class="flow-container">
```

```html
<!-- .dark directly on the container -->
<div x-data="flowCanvas({ ... })" class="flow-container dark">
```

## System preference

Your host framework (Flux UI, Tailwind, etc.) typically toggles the `.dark` class based on `prefers-color-scheme`. AlpineFlow responds automatically.

## `colorMode` config option

For self-managed color mode without a framework:

```js
flowCanvas({
    colorMode: 'system', // 'light' | 'dark' | 'system'
})
```

| Value | Behavior |
|---|---|
| `'light'` | Removes `.dark` from the container |
| `'dark'` | Adds `.dark` to the container |
| `'system'` | Watches `prefers-color-scheme` via `matchMedia`, toggles `.dark` automatically |
| `undefined` | No color mode management (default) -- inherit from ancestor |

The resolved mode is available as a reactive getter: `$flow.colorMode` returns `'light'` or `'dark'`.


## Toggling at runtime

Toggle dark mode programmatically:

```js
// Via colorMode config
$flow.updateConfig({ colorMode: 'dark' });

// Or directly via class
document.querySelector('.flow-container').classList.toggle('dark');
```

## Background patterns

Pattern colors auto-adjust when using the default theme's CSS variables. The theme file sets appropriate values for both light and dark modes, so backgrounds remain visible without manual configuration.

To customize dark mode colors explicitly, override the CSS variables within a dark mode selector in your stylesheet.
