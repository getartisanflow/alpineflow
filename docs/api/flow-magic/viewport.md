---
title: Viewport
description: Pan, zoom, fit-view, and coordinate conversion.
order: 6
---

# Viewport

### setViewport

```ts
$flow.setViewport(viewport: Partial<Viewport>, options?: { duration?: number }): void
```

Set the viewport programmatically (pan and/or zoom). When `duration` is specified, the transition is animated.

### zoomIn / zoomOut

```ts
$flow.zoomIn(options?: { duration?: number }): void
$flow.zoomOut(options?: { duration?: number }): void
```

Zoom in or out by a step factor, clamped to `minZoom`/`maxZoom`.

### setCenter

```ts
$flow.setCenter(x: number, y: number, zoom?: number, options?: { duration?: number }): void
```

Center the viewport on flow coordinate `(x, y)` at the given zoom level (defaults to current zoom).

### panBy

```ts
$flow.panBy(dx: number, dy: number, options?: { duration?: number }): void
```

Pan the viewport by a delta `(dx, dy)` in pixels.

### fitView

```ts
$flow.fitView(options?: { padding?: number; duration?: number }): void
```

Fit all visible nodes into the viewport. Defers via `requestAnimationFrame` if any node lacks measured dimensions (up to 10 retries).

### fitBounds

```ts
$flow.fitBounds(
  rect: { x: number; y: number; width: number; height: number },
  options?: { padding?: number; duration?: number }
): void
```

Fit a specific rectangle into the viewport. When `duration` is specified, the transition is animated.

### getViewportForBounds

```ts
$flow.getViewportForBounds(
  bounds: { x: number; y: number; width: number; height: number },
  padding?: number
): Viewport
```

Compute the viewport (pan + zoom) that frames the given bounds within the container, respecting min/max zoom and padding. Does not apply the viewport -- returns it for inspection.

### getContainerDimensions

```ts
$flow.getContainerDimensions(): { width: number; height: number }
```

Get the current pixel width and height of the container element.

### toggleInteractive

```ts
$flow.toggleInteractive(): void
```

Toggle pan/zoom interactivity on and off.

---

# Coordinates

### screenToFlowPosition

```ts
$flow.screenToFlowPosition(x: number, y: number): XYPosition
```

Convert screen coordinates (e.g. from a pointer event) to flow coordinates, accounting for viewport pan and zoom.

### flowToScreenPosition

```ts
$flow.flowToScreenPosition(x: number, y: number): XYPosition
```

Convert flow coordinates to screen coordinates.

### getAbsolutePosition

```ts
$flow.getAbsolutePosition(nodeId: string): XYPosition
```

Get the absolute position of a node, resolving relative positions through the parent hierarchy.
