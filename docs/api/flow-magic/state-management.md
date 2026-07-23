---
title: State Management
description: Serialization, clipboard, history, and runtime config.
order: 11
---

# Clipboard & History

| Method | Signature | Description |
|---|---|---|
| `copy` | `(): void` | Copy selected nodes and their internal edges to the clipboard. |
| `paste` | `(): void` | Paste nodes/edges from the clipboard with new IDs and an accumulating 20px offset. Selects all pasted items. |
| `cut` | `(): Promise<void>` | Copy selected nodes to clipboard, then delete them. |
| `undo` | `(): void` | Undo the last structural change. Requires `history: true`. |
| `redo` | `(): void` | Redo the last undone change. Requires `history: true`. |

---

# State

### toObject

```ts
$flow.toObject(): { nodes: FlowNode[]; edges: FlowEdge[]; viewport: Viewport }
```

Serialize the current canvas state as a deep-cloned plain object. Suitable for saving to a database or local storage. Emits a `save` event.

### fromObject

```ts
$flow.fromObject(obj: {
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  viewport?: Partial<Viewport>;
}): void
```

Restore canvas state from a saved object. Deep-clones incoming data, sorts nodes topologically, rebuilds maps, and applies viewport. Emits a `restore` event.

### $reset

```ts
$flow.$reset(): void
```

Reset the canvas to its initial configuration state (the config passed to `flowCanvas()`).

### $clear

```ts
$flow.$clear(): void
```

Clear all nodes and edges, resetting the viewport to origin `{ x: 0, y: 0, zoom: 1 }`.

### replaceNodes / setNodes

```ts
$flow.replaceNodes(nodes: FlowNode[], edges?: FlowEdge[]): Promise<void>
$flow.setNodes(nodes: FlowNode[]): Promise<void>
```

First-class whole-graph replace, built on the same identity-preserving `fromObject` path (surviving ids keep their live objects; new ids mount fresh and measure). Both emit `restore` with `origin: 'load'` and return a promise that **resolves once the new nodes are measured** — so an immediate `fitView()` fits, with no manual `await nextFrame()`.

- `replaceNodes(nodes, edges?)` swaps the whole graph. `edges` defaults to empty, so `replaceNodes(nodes)` is a genuine whole-graph replace.
- `setNodes(nodes)` replaces just the nodes and keeps the current edges (react-flow-style).

```js
await $flow.replaceNodes(newNodes, newEdges);
await $flow.fitView();   // the new nodes are measured — this fits
```

These are the first-class alternative to the old `$clear()` + `addNodes()` workaround. Server-callable via the `flow:replaceNodes` / `flow:setNodes` wire commands.

### toImage

```ts
$flow.toImage(options?: ToImageOptions): Promise<string>
```

Export the canvas as a data URL image. `html-to-image` ships as a dependency of AlpineFlow, so this works out of the box. Supports custom width, height, padding, background, scope (`'all'` or `'viewport'`), output `format`, overlay inclusion, resolution multiplier via `scale`, and automatic file download via `filename`.

#### Formats

`format` selects what you get back. The capture is vector either way, so SVG is the intermediate handed straight back rather than extra work.

| Format | Output | Notes |
|---|---|---|
| `'png'` (default) | Rasterized, lossless | Honours `scale`. Best for diagrams — flat colour and text compress well. |
| `'jpeg'` | Rasterized, lossy | Honours `scale` and `quality`. Smaller than PNG, but lossy compression fringes text edges. |
| `'svg'` | Vector | Ignores `scale`. Sharp at any size — but see the file-size warning below. |

> **Warning: SVG files are much larger than you'd expect.** Vector output is *not* the
> small option here. A real 44-node schema graph measured **0.32 MB as PNG and 49.5 MB
> as SVG**.
>
> This is a shortcoming of `html-to-image`, the library that performs the capture — not
> of SVG itself, which is a compact format, nor of anything AlpineFlow controls. Rather
> than emitting the stylesheet once and letting elements share it, html-to-image inlines
> each element's **entire computed style** into its own `style` attribute. Every node
> row, badge and handle ends up carrying a full style declaration, most of it identical
> to its neighbours' and most of it irrelevant. In the capture above, 4,908 `style`
> attributes averaging ~10 KB each accounted for about **98% of the file**. Size
> therefore tracks element count, not visual complexity.
>
> SVG is still the right choice when you need to edit the result as vectors (Figma,
> Illustrator, Inkscape) or scale it arbitrarily. Just don't reach for it to save space,
> and think twice before offering it as a one-click download on large canvases.

```js
// A 2x PNG of the whole graph
await $flow.toImage({ scale: 2, filename: 'graph.png' })

// Vector export — no resolution to pick
await $flow.toImage({ format: 'svg', filename: 'graph.svg' })
```

`quality` (0-1, default `0.92`) applies to JPEG only and is ignored for other formats. Out-of-range values clamp; invalid ones fall back to the default.

#### Scale

`scale` raises the raster resolution without changing the layout — `scale: 2` renders a 1920x1080 export at 3840x2160. The capture is vector, so it re-renders sharp rather than upscaling. It's clamped to what the browser can actually allocate (an over-large canvas would otherwise produce a silently blank image). It has no effect on `format: 'svg'`, which has no raster resolution to multiply.

#### Background

`background` fills behind the capture. It is a *backdrop*, not an override — where the canvas paints its own background (as the default themes do), that wins, and `background` shows through only in transparent regions. This is consistent across all three formats. It matters most for JPEG, which has no alpha channel: without a fill, transparent areas would encode as solid black.

### setLoading

```ts
$flow.setLoading(value: boolean): void
```

Set the user-controlled loading state. When true, `isLoading` becomes true and the loading overlay is shown.

### patchConfig

```ts
$flow.patchConfig(changes: Partial<PatchableConfig>): void
```

Update runtime config options (zoom limits, background, snapping, debug mode, color mode, auto-layout, and more). See [Configuration](../../configuration/index.md) for the full list of patchable options.

### setCrossingReduction

```ts
$flow.setCrossingReduction(value: boolean | { channelGap?: number }): void
```

Toggle avoidant-edge crossing reduction at runtime and re-route immediately — the runtime equivalent of the [`avoidantCrossingReduction`](../../configuration/edges.md#edge-routing) config. Pass `true` to enable with the default lane gap, `{ channelGap: px }` to tune the separation between lanes, or `false` to return to the non-reduced (byte-identical) routing. Server-callable via the `flow:setCrossingReduction` wire command.

### closeContextMenu

```ts
$flow.closeContextMenu(): void
```

Programmatically close the context menu.

### resetPanels

```ts
$flow.resetPanels(): void
```

Reset all panels by dispatching a `flow-panel-reset` event on the container.

---

## See Also

- [Configuration](../../configuration/index.md) -- FlowCanvasConfig options
- [Events](../events.md) -- All events emitted by AlpineFlow
- [Animation](../../animation/animate.md) -- Animation system deep-dive
