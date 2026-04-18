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

### group

```ts
$flow.group(name: string): FlowGroup
```

Get or create a named animation group. Groups let you animate multiple nodes as a unit:

```js
const g = $flow.group('sidebar');
g.animate({ position: { x: 300 } }, { duration: 500 });
g.set({ class: 'highlighted' });
```

### transaction

```ts
$flow.transaction(fn: () => void | Promise<void>): Transaction
```

Run a function as an atomic state change. If anything inside throws (or you call `tx.rollback()`), all node/edge positions revert to their snapshot before the function ran:

```js
const tx = await $flow.transaction(async () => {
    await $flow.animate({ nodes: { a: { position: { x: 500 } } } }, { duration: 300 }).finished;
    await $flow.animate({ nodes: { b: { position: { x: 500 } } } }, { duration: 300 }).finished;
});
// If something went wrong:
tx.rollback();
```

### getHandles

```ts
$flow.getHandles(filter?: { tag?: string; tags?: string[] }): FlowAnimationHandle[]
```

Retrieve all active animation handles, optionally filtered by tag. Useful for inspecting running animations.

### cancelAll / pauseAll / resumeAll

```ts
$flow.cancelAll(filter: { tag?: string; tags?: string[] }, options?: StopOptions): void
$flow.pauseAll(filter: { tag?: string; tags?: string[] }): void
$flow.resumeAll(filter: { tag?: string; tags?: string[] }): void
```

Bulk control for tagged animations. `cancelAll` accepts a `StopOptions` with `mode: 'jump-end' | 'rollback' | 'freeze'`:

```js
// Tag animations when creating them
$flow.animate({ nodes: { a: { position: { x: 300 } } } }, { tag: 'ambient', loop: true });

// Later, control all 'ambient' animations
$flow.pauseAll({ tag: 'ambient' });
$flow.resumeAll({ tag: 'ambient' });
$flow.cancelAll({ tag: 'ambient' }, { mode: 'rollback' });
```

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
