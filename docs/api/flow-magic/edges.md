---
title: Edge Operations
description: Add, remove, get edges and their DOM elements.
order: 4
---

# Edge Operations

### addEdges

```ts
$flow.addEdges(edges: FlowEdge | FlowEdge[]): void
```

Add one or more edges to the canvas. Merges `defaultEdgeOptions` from config onto new edges (edge-specific properties override defaults).

### removeEdges

```ts
$flow.removeEdges(ids: string | string[]): void
```

Remove one or more edges by ID.

### getEdge

```ts
$flow.getEdge(id: string): FlowEdge | undefined
```

Look up an edge by ID. Returns the reactive edge object or `undefined`.

### getEdgePathElement

```ts
$flow.getEdgePathElement(id: string): SVGPathElement | null
```

Get the visible SVG `<path>` element for an edge. The visible path is the second `<path>` child (the first is the invisible interaction hit area).

### getEdgeElement

```ts
$flow.getEdgeElement(id: string): SVGElement | HTMLElement | null
```

Get the container element (SVG group) for an edge.
