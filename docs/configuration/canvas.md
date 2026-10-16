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
| `interactive` | `boolean` | `true` | Master interactivity switch. Set `false` to start the canvas **locked** (no pan, zoom, or drag) without a post-ready `toggleInteractive()` call. It overrides the per-axis `pannable`/`zoomable` at init (both forced off); `toggleInteractive()` (or the controls toggle) then restores the per-axis intent. Distinct from the per-node `locked` flag, which freezes a single node. |
| `containerHeight` | `'auto' \| 'fill' \| number \| string` | `'auto'` | Canvas container height. `'auto'` = the 400px fallback, `'fill'` = 100% of the parent, a `number` = pixels, or any CSS length string (`'80vh'`). Overrides the `--flow-container-height` CSS variable. |
| `minZoom` | `number` | `0.5` | Minimum zoom level. |
| `maxZoom` | `number` | `2` | Maximum zoom level. |
| `fitViewOnInit` | `boolean` | `false` | Auto-fit all nodes in view after initialization. |
| `background` | `string \| BackgroundLayer[]` | `'dots'` | Background pattern: `'dots'`, `'lines'`, `'cross'`, `'none'`, or array of layers. |
| `backgroundGap` | `number` | `20` | Grid spacing in pixels. Overrides `--flow-bg-pattern-gap`. |
| `patternColor` | `string` | — | Pattern color. Overrides `--flow-bg-pattern-color`. Supports `rgba()`. |
| `ariaLabel` | `string` | `canvas.label` message | ARIA label for the container. |
| `translations` | `FlowTranslations` | — | Partial message overrides; missing keys fall back to English. See [Translations](#translations). |
| `locale` | `string` | `<html lang>`, then `'en'` | Locale for plural forms in `translations`. Laravel-style `pt_BR` is accepted. |
| `colorMode` | `'light' \| 'dark' \| 'system'` | — | Color mode management. `'system'` tracks OS preference. Adds/removes `.dark` class. |
| `debug` | `boolean` | `false` | Enable debug logging to console. |

## Translations

Pass a partial `translations` dictionary to `flowCanvas`. Each canvas manages its own messages, omitted keys retain their English defaults.
No extra translation library is required.

```js
import de from '@getartisanflow/alpineflow/locales/de.json';

Alpine.data('germanDiagram', () => ({
    config: {
        controls: true,
        locale: 'de',
        translations: { ...de, 'controls.zoomIn': 'Näher heran' },
    },
}));
```

```html
<div x-data="germanDiagram">
    <div x-data="flowCanvas(config)" class="flow-container"></div>
</div>
```

Without a bundler, importing JSON in the browser needs an import attribute:
`import de from '/vendor/alpineflow/locales/de.json' with { type: 'json' };`.

The `FlowTranslations` interface lists every key with a short description of
where it appears; `locales/en.json` holds the English defaults.
The JSON dictionaries in `locales/` are the single source for engine messages;
the build copies them to `dist/locales/` for npm and downstream PHP consumers.

Keys are flat dotted strings grouped by where the message appears:

| Prefix | Covers |
|--------|--------|
| `controls.*` | Controls panel buttons and its ARIA label. |
| `canvas.*` | Container label, loading text, selection-mode indicator. |
| `a11y.*` | Accessible names of nodes, edges, handles and the control-point hint. |
| `announce.*` | Screen reader announcements. |
| `workflow.*` | Default labels of workflow nodes. |
| `schema.inspector.*` | Schema inspector UI. |

Developer diagnostics and condition expressions remain technical text.

Messages are plain text. Keep placeholders such as `:label`, `:source`, `:target`
and `:count` in your translations; values are substituted literally without
interpreting HTML. Empty strings and non-string values (as some translation
export tools write them) are ignored and fall back to English.

Every canvas exposes its resolved messages as `t(key, values)`, so custom
templates and toolbars can reuse them via `$flow`:

```html
<button @click="$flow.zoomIn()" :title="$flow.t('controls.zoomIn')">+</button>
<span x-text="$flow.t('announce.nodesSelected', { count: $flow.selectedNodes.size })"></span>
```

Messages that carry a `:count` exist once per CLDR plural category, suffixed
`_zero`, `_one`, `_two`, `_few`, `_many` or `_other` (i18next's convention), for
example `announce.nodesSelected_one` / `announce.nodesSelected_other`. The form is
picked with `Intl.PluralRules` for the canvas `locale`, so French treats `0` as
singular and Polish uses `_few` / `_many`. Provide the categories your language
needs; `_other` is used when a category is missing, and English fallbacks always
follow English plural rules. A specific form such as `_one` or `_two` may spell
the number out instead of using `:count`; `_other` must keep `:count`. For grammar beyond plurals, use the existing
`announcements.formatMessage` callback; it receives the canvas translator as
third argument, so it can delegate unhandled events to the default formatter
without losing translations.

`locale` defaults to `document.documentElement.lang`, which Laravel layouts set
from `app()->getLocale()`. Underscores are normalised (`pt_BR` → `pt-BR`) and an
invalid tag falls back to `en`.

Explicit `ariaLabel`, `loadingText`, node labels and custom announcement formatters
keep precedence. Messages are resolved once when the canvas is created and are
not reactive; recreate the canvas to change its language.

## See also

- [Background](../canvas/background.md)
- [Viewport](../canvas/viewport.md)
- [Theming](../theming/css-variables.md)
