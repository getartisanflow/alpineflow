---
title: Viewport Configuration
description: Pan, zoom, culling, and auto-pan options.
order: 6
---

# Viewport Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `translateExtent` | `CoordinateExtent` | — | Viewport pan boundaries `[[minX, minY], [maxX, maxY]]`. |
| `viewportCulling` | `boolean` | `true` | Only render nodes/edges visible in the viewport. |
| `cullingBuffer` | `number` | `100` | Buffer in flow-space pixels around viewport for culling. |
| `panOnDrag` | `boolean \| number[]` | `true` | `true` = left button, `false` = disabled, `[0,1,2]` = specific buttons. |
| `panOnScroll` | `boolean` | `false` | Pan on mouse wheel instead of zooming. Ctrl/Cmd+wheel zooms. |
| `panOnScrollDirection` | `string` | `'both'` | `'both'`, `'vertical'`, `'horizontal'`. |
| `panOnScrollSpeed` | `number` | `1` | Scroll pan sensitivity multiplier. |
| `panActivationKeyCode` | `string \| null` | `'Space'` | Key that temporarily enables panning when held. |
| `zoomActivationKeyCode` | `string \| null` | `null` | Key that forces zoom-on-wheel, overriding `panOnScroll`. |
| `zoomOnDoubleClick` | `boolean` | `true` | Zoom in on double-click. |
| `zoomLevels` | `false \| object` | `{ far: 0.4, medium: 0.75 }` | Contextual zoom thresholds. Sets `data-zoom-level` attribute. See [Contextual zoom](../canvas/contextual-zoom.md). |
| `autoPanSpeed` | `number` | `15` | Auto-pan speed multiplier. |
| `autoPanOnConnect` | `boolean` | `true` | Auto-pan when drawing connections near canvas edge. |

## Interaction Escape Hatches

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `noDragClassName` | `string` | `'nodrag'` | CSS class that prevents node dragging on that element. |
| `noPanClassName` | `string` | `'nopan'` | CSS class that prevents canvas pan/zoom on that element. |
| `noWheelClassName` | `string` | — | CSS class that prevents wheel zoom on that element. |

## See also

- [Viewport](../canvas/viewport.md)
