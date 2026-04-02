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

### toImage

```ts
$flow.toImage(options?: ToImageOptions): Promise<string>
```

Export the canvas as a data URL image. Requires `html-to-image` as a peer dependency. Supports custom width, height, padding, background, scope (`'all'` or `'viewport'`), overlay inclusion, and automatic file download via `filename`.

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
