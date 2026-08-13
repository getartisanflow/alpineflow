---
title: Layout
description: Auto-layout algorithms -- dagre, force, tree, ELK.
order: 9
---

# Layout

### layout (Dagre)

```ts
$flow.layout(options?: {
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  nodesep?: number;
  ranksep?: number;
  adjustHandles?: boolean;
  fitView?: boolean;
  duration?: number;
}): void
```

Apply Dagre (directed acyclic graph) layout. Requires the dagre addon: `Alpine.plugin(AlpineFlowDagre)`.

All four emit a [`layout` event](../events.md#additional-events) carrying `positions` — what the
layout decided, keyed by node id. Read it there rather than off the nodes: with a `duration` the
event fires while they are still animating towards those coordinates, so the model is one layout
behind until the motion finishes.

```html
<div @flow-layout="$wire.saveLayout($event.detail.positions)">
```

### forceLayout

```ts
$flow.forceLayout(options?: {
  strength?: number;
  distance?: number;
  charge?: number;
  iterations?: number;
  center?: { x: number; y: number };
  fitView?: boolean;
  duration?: number;
}): void
```

Apply force-directed layout. Requires the force addon: `Alpine.plugin(AlpineFlowForce)`.

### treeLayout

```ts
$flow.treeLayout(options?: {
  layoutType?: 'tree' | 'cluster';
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  nodeWidth?: number;
  nodeHeight?: number;
  adjustHandles?: boolean;
  fitView?: boolean;
  duration?: number;
}): void
```

Apply hierarchy/tree layout. Requires the hierarchy addon: `Alpine.plugin(AlpineFlowHierarchy)`.

### elkLayout

```ts
$flow.elkLayout(options?: {
  algorithm?: 'layered' | 'force' | 'mrtree' | 'radial' | 'stress';
  direction?: 'DOWN' | 'RIGHT' | 'UP' | 'LEFT';
  nodeSpacing?: number;
  layerSpacing?: number;
  adjustHandles?: boolean;
  fitView?: boolean;
  duration?: number;
}): Promise<void>
```

Apply ELK (Eclipse Layout Kernel) layout. Async because ELK's layout returns a Promise. Requires the ELK addon: `Alpine.plugin(AlpineFlowElk)`.
