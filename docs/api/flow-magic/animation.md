---
title: Update & Animation
description: update(), animate(), timeline, particles, and camera follow.
order: 8
---

# Update & Animation

### update

```ts
$flow.update(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle
```

The core method for applying property changes to nodes, edges, and/or the viewport. Defaults to instant (duration: 0). Pass a duration for smooth transitions. Returns a handle with `pause()`, `resume()`, `stop()`, `reverse()`, and a `finished` promise.

```js
// Instant update (default)
$flow.update({ nodes: { 'node-1': { position: { x: 300, y: 200 } } } });

// Update with smooth transition
$flow.update(
  { nodes: { 'node-1': { position: { x: 300, y: 200 } } } },
  { duration: 500, easing: 'easeInOut' }
);
```

### animate

```ts
$flow.animate(targets: AnimateTargets, options?: AnimateOptions): FlowAnimationHandle
```

Convenience wrapper around `update()` that defaults to 300ms smooth transition. Use `update()` for instant changes.

```js
// Smooth transition (300ms default)
$flow.animate({ nodes: { 'node-1': { position: { x: 300, y: 200 } } } });

// Custom timing
$flow.animate(
  { nodes: { 'node-1': { position: { x: 300, y: 200 } } } },
  { duration: 800, easing: 'easeInOut' }
);
```

### timeline

```ts
$flow.timeline(): FlowTimeline
```

Create a new `FlowTimeline` wired to this canvas. Timelines support sequential steps, parallel groups, and lifecycle events (`play`, `pause`, `stop`, `complete`). Lock flag and history suspension are automatically managed.

### registerAnimation / unregisterAnimation

```ts
$flow.registerAnimation(name: string, steps: any[]): void
$flow.unregisterAnimation(name: string): void
```

Register or unregister a named animation (used by the `x-flow-animate` directive).

### playAnimation

```ts
$flow.playAnimation(name: string): Promise<void>
```

Play a named animation registered via `x-flow-animate`. Builds a timeline from the registered steps and plays it.

### follow

```ts
$flow.follow(
  target: string | FlowAnimationHandle | ParticleHandle | XYPosition,
  options?: FollowOptions
): FlowAnimationHandle
```

Track a target with the viewport camera. The target can be a node ID, a `ParticleHandle`, an animation handle, or a static `XYPosition`. The viewport smoothly follows via linear interpolation each frame. Call `.stop()` on the returned handle to stop following.

### sendParticle

```ts
$flow.sendParticle(edgeId: string, options?: ParticleOptions): ParticleHandle | undefined
```

Fire a particle along an edge path. Returns a `ParticleHandle` with `getCurrentPosition()`, `stop()`, and `finished` promise. Options cascade: explicit options > edge properties > CSS variables.
