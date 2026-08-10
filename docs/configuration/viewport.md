---
title: Viewport Configuration
description: Pan, zoom, culling, and auto-pan options.
order: 6
---

# Viewport Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `translateExtent` | `CoordinateExtent` | — | Viewport pan boundaries `[[minX, minY], [maxX, maxY]]`. |
| `viewportCulling` | `boolean \| 'auto'` | `'auto'` | Only render nodes/edges visible in the viewport. `'auto'` turns culling on once the node count reaches `cullingAutoThreshold`; `true`/`false` force it on/off. |
| `cullingAutoThreshold` | `number` | `150` | Node-count threshold at/above which `viewportCulling: 'auto'` activates culling. |
| `cullingBuffer` | `number` | `100` | Buffer in flow-space pixels around viewport for culling. |
| `panOnDrag` | `boolean \| number[]` | `true` | `true` = left button, `false` = disabled, `[0,1,2]` = specific buttons. |
| `panOnScroll` | `boolean` | `false` | Pan on mouse wheel instead of zooming. Ctrl/Cmd+wheel zooms. |
| `panOnScrollDirection` | `string` | `'both'` | `'both'`, `'vertical'`, `'horizontal'`. |
| `panOnScrollSpeed` | `number` | `1` | Scroll pan sensitivity multiplier. |
| `panActivationKeyCode` | `string \| null` | `'Space'` | Key that temporarily enables panning when held. |
| `zoomActivationKeyCode` | `string \| null` | `null` | Key that forces zoom-on-wheel, overriding `panOnScroll`. |
| `zoomOnDoubleClick` | `boolean \| 'step' \| 'toggle'` | `true` | `true`/`'step'` = d3's stepped zoom, `'toggle'` = jump-to-level and back, `false` = disabled. See [Double-click zoom](#double-click-zoom). |
| `dblClickZoomLevel` | `number` | `1.5` | Level `'toggle'` mode animates to. Clamped to `[minZoom, maxZoom]`; ignored in `'step'` mode. |
| `dblClickZoomOutLevel` | `number \| 'fit' \| 'min'` | `'min'` | Where `'toggle'` zooms out to when there is no remembered viewport. `'fit'` frames the whole graph; a number is a fixed level about the cursor. See [Double-click zoom](#double-click-zoom). |
| `zoomLevels` | `false \| object` | `{ far: 0.4, medium: 0.75 }` | Contextual zoom thresholds. Sets `data-zoom-level` attribute. See [Contextual zoom](../canvas/contextual-zoom.md). |
| `autoPanSpeed` | `number` | `15` | Auto-pan speed multiplier. |
| `autoPanOnConnect` | `boolean` | `true` | Auto-pan when drawing connections near canvas edge. |

## Double-click zoom

`zoomOnDoubleClick` picks between two gestures.

**`true` / `'step'` (default)** — d3-zoom's native handler. Each double-click multiplies the zoom by 2, `shift`+double-click divides it by 2, and both repeat until the scale extent is reached.

**`'toggle'`** — one double-click jumps to `dblClickZoomLevel` centred on the cursor and remembers where you came from; the next one puts that viewport back *exactly*. Useful when the canvas has a natural "reading" zoom and you want a one-gesture round trip to it.

```js
flowCanvas({
  zoomOnDoubleClick: 'toggle',
  dblClickZoomLevel: 1.5,   // the "readable" level
})
```

If you reach the level some other way — the wheel, `setViewport()` — there is no remembered viewport to go back to, so a double-click there zooms out to `minZoom` about the cursor instead of doing nothing. Panning or zooming by hand discards the remembered viewport, so a later toggle-out never jumps to a view you have since left.

### Where the toggle zooms out to

That fallback is what `dblClickZoomOutLevel` sets. A remembered viewport always wins over it — the option only decides what happens when there is nothing to restore.

```js
flowCanvas({
  zoomOnDoubleClick: 'toggle',
  dblClickZoomLevel: 1,        // double-click → 100% about the cursor
  dblClickZoomOutLevel: 'fit', // double-click again → the whole graph
})
```

| Value | Second double-click goes to |
|-------|-----------------------------|
| `'min'` (default) | `minZoom`, about the cursor. |
| `'fit'` | The viewport that frames every visible node — what `fitView()` computes. On a canvas with nothing to fit (no nodes, or none measured yet), falls back to `'min'` rather than going dead. |
| `number` | That level, about the cursor. Clamped to `[minZoom, maxZoom]`. |

`'fit'` suits a canvas people read rather than survey — a workflow, a schema — where the gesture reads as "closer" and then "show me all of it", and where `minZoom` is an arbitrary floor that frames nothing in particular.

Two things to know about `'toggle'`:

- `dblClickZoomLevel` must sit above the level it zooms back out to (`minZoom`, or a numeric `dblClickZoomOutLevel`), otherwise there is no room to zoom back out into. If it does not, AlpineFlow keeps d3's stepped handler rather than installing a gesture that would stall.
- Like `'step'`, it stays live under `zoomable: false` — that flag gates pointer-gesture zooming (wheel, pinch), never double-click, so a canvas that disables wheel zoom to run its own (e.g. pinch-only via `ctrl`+wheel) keeps the double-click gesture in either mode. Disable double-click zoom itself with `zoomOnDoubleClick: false`.

**`false`** — no double-click zoom at all.

## Interaction Escape Hatches

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `noDragClassName` | `string` | `'nodrag'` | CSS class that prevents node dragging on that element. |
| `noPanClassName` | `string` | `'nopan'` | CSS class that prevents canvas panning (drag) on that element. Does not block wheel zoom — use `noWheelClassName` for that. |
| `noWheelClassName` | `string` | `'nowheel'` | CSS class that prevents wheel zoom on that element. Opt-in — no element carries it by default. |

## See also

- [Viewport](../canvas/viewport.md)
