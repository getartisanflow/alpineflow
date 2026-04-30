---
title: Fullscreen
description: Native Fullscreen API integration — toggle, target any ancestor, reactive state, DOM events, and browser-support caveats.
order: 2
---

# Fullscreen

AlpineFlow ships a thin wrapper around the browser's native Fullscreen API. By default the canvas container itself goes fullscreen, but the target is configurable — point it at an ancestor and your inspector panels, toolbars, or app shell stay visible inside the fullscreen viewport.

## Overview

Fullscreen is an opt-out feature of the built-in controls panel and an always-available helper on every canvas. Because the request flows through the browser's native API, the usual rules apply: it must be called from a user-gesture handler, `:fullscreen` CSS pseudo matches only on the fullscreened element (not its descendants), and some restricted contexts (older iframes, some sandboxed previews) will reject the request. The wrapper catches that rejection cleanly — it `console.warn`s instead of letting the promise escape unhandled.

## Built-in button

When `controls: true` is set on the canvas, the controls panel automatically renders a fullscreen toggle button alongside the zoom / fit / lock buttons. No consumer code is required.

```html
<div x-data="flowCanvas({ nodes, edges, controls: true })" class="flow-container">
    <div x-flow-viewport>
        <!-- nodes + edges -->
    </div>
</div>
```

The button icon swaps between "enter" and "exit" as `isFullscreen` toggles. Pass `controls: false` (or omit `controls`) if you want to provide your own UI.

## API

### `canvas.toggleFullscreen()`

Toggles fullscreen for the configured target. Must be called from a user-gesture handler (click, keyup, etc.) — calling it from a timer or `onmount` will be rejected by the browser.

```html
<button @click="toggleFullscreen()">Fullscreen</button>
```

When already fullscreen, calls `document.exitFullscreen()`. When not fullscreen, requests fullscreen on the resolved target.

### `canvas.isFullscreen`

Reactive boolean. Flips when the native `fullscreenchange` event fires — so it stays in sync even when the user exits via `Escape` or the browser chrome.

```html
<button
    @click="toggleFullscreen()"
    :aria-pressed="isFullscreen"
    x-text="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
></button>

<span x-show="isFullscreen" class="badge">Presenting</span>
```

Because it's a normal reactive Alpine property, you can bind it anywhere — drive a custom button's `aria-pressed`, toggle a status badge, or key a `<template x-if>` that swaps in presentation-specific UI.

## Configuring the fullscreen target

By default the canvas's own `.flow-container` element is the fullscreen target. Set `fullscreenTarget` on the canvas config to point somewhere else. Three forms are accepted.

### String — CSS selector

Resolved via `container.closest(selector)` first (so the selector can match an ancestor), then `document.querySelector(selector)` as a fallback.

```js
flowCanvas({
    nodes,
    edges,
    fullscreenTarget: '.app-frame',
});
```

If the selector matches nothing, a single `console.warn` is logged and the canvas falls back to the default container target.

### HTMLElement — direct reference

Useful when the element is already in scope (e.g., a ref from a wrapping Alpine component, or a DOM lookup run before canvas init).

```js
const frame = document.getElementById('designer-frame');

flowCanvas({
    nodes,
    edges,
    fullscreenTarget: frame,
});
```

### Function — resolver

`(container: HTMLElement) => HTMLElement | null`. Runs each time `toggleFullscreen()` is called, so it's the right choice when the target element is created lazily or swaps over the canvas's lifetime.

```js
flowCanvas({
    nodes,
    edges,
    fullscreenTarget: (container) => container.closest('.app-shell'),
});
```

A thrown resolver is caught and logged; the canvas falls back to the default container target without crashing.

## Events

A single `CustomEvent` dispatches on the canvas container whenever the fullscreen state flips. It bubbles, so a listener higher in the tree works too.

### `flow-fullscreen-change`

```ts
{ detail: { isFullscreen: boolean } }
```

```html
<div x-data="flowCanvas({ /* ... */ })"
     @flow-fullscreen-change="console.log('fullscreen:', $event.detail.isFullscreen)"
     class="flow-container">
```

Or via plain `addEventListener`:

```js
containerEl.addEventListener('flow-fullscreen-change', (e) => {
    if (e.detail.isFullscreen) {
        document.body.classList.add('presenting');
    } else {
        document.body.classList.remove('presenting');
    }
});
```

The event fires once per state change — entering and exiting both produce exactly one event.

## Common pattern — wrapper-ancestor fullscreen

The default (canvas-only fullscreen) is fine for a plain flow diagram. It starts to feel awkward once you add UI outside the canvas: a left-rail inspector, a right-rail properties panel, a toolbar that floats above. Fullscreening just the canvas hides all of that.

The fix is to wrap everything you want to stay visible in a single DOM element and point `fullscreenTarget` at it.

```html
<div class="designer-frame grid grid-cols-[1fr_320px] gap-4">
    <div x-data="flowCanvas({
        nodes,
        edges,
        controls: true,
        fullscreenTarget: '.designer-frame',
    })" class="flow-container">
        <div x-flow-viewport>
            <!-- nodes + edges -->
        </div>
    </div>

    <aside x-schema-node-inspector>
        <!-- inspector content -->
    </aside>
</div>
```

Now the fullscreen button on the canvas's controls panel puts the whole designer — flow plus inspector — into fullscreen mode.

The API Schema Designer example in the ArtisanFlow site uses this pattern. See the WireFlow docs for the Blade-component shorthand: `<x-schema-designer>` and `<x-flow>` both forward a `fullscreenTarget` prop through to this option.

## Browser support

The Fullscreen API is broadly supported in all evergreen browsers. A few caveats:

- **Safari < 16.4** — lacks the unprefixed `requestFullscreen` / `fullscreenchange`. The current implementation detects the missing API via a `typeof req !== 'function'` check, `console.warn`s, and no-ops cleanly. No crash, and `isFullscreen` stays `false`.
- **Restricted iframes** — some embeds (sandboxed previews, cross-origin frames without `allow="fullscreen"`) reject the request. The promise rejection is caught and logged as a `console.warn`.
- **Touch / mobile** — iOS Safari limits fullscreen to `<video>` elements; the element-level fullscreen API is effectively unavailable. The same warn-and-noop path applies.

## Gotchas

### `:fullscreen` CSS pseudo only matches the fullscreened element

The `:fullscreen` selector matches the element that is currently fullscreen — not its descendants. Consumer CSS like `.flow-container:fullscreen { border: 0 }` only applies when the flow-container itself is the fullscreen target. Once you configure `fullscreenTarget` to point at an ancestor, the flow-container is no longer `:fullscreen`; the ancestor is.

If you need to style the container differently while an ancestor is fullscreen, listen for `flow-fullscreen-change` and toggle a class yourself, or use the `.designer-frame:fullscreen .flow-container` descendant selector.

### Native fullscreen replaces the entire viewport

Anything outside the fullscreen target is hidden — browser chrome, app headers, global sidebars, notifications. If you need those to stay visible, your fullscreen target has to include them. Otherwise, accept that they're hidden while fullscreen is active (and users can always press `Escape` to exit).

### The request must come from a user gesture

`toggleFullscreen()` called from a timer, a network response, or an `onmount` hook will be rejected by the browser with a "permissions" error. Always wire the call to a user-gesture event (`click`, `keyup`, `pointerup`).

### Exiting fullscreen via `Escape` is handled by the browser

You don't need to listen for `keydown.escape` yourself — the browser exits fullscreen automatically on `Escape`, and the native `fullscreenchange` event fires, which flips `canvas.isFullscreen` back to `false`. If you have other `Escape` handlers on the canvas (e.g., clearing selection), they'll fire in addition to the fullscreen exit — that's fine, just be aware that both happen on the same keystroke when fullscreen is active.

## See also

- [Schema Addon](../addons/schema.md) — the three-scope inspector directives that pair well with wrapper-ancestor fullscreen
- [WireFlow `<x-flow>` component](https://github.com/getartisanflow/wireflow/blob/main/docs/components/flow.md) — `fullscreenTarget` prop reference
- [WireFlow `<x-schema-designer>` preset](https://github.com/getartisanflow/wireflow/blob/main/docs/components/schema-designer.md) — ships with `fullscreenTarget` wired through for ready-made designer layouts
