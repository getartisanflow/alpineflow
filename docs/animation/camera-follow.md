---
title: Camera Follow
description: Track a node or particle with the viewport camera.
order: 5
---

# Camera Follow

Track a moving target with the viewport camera. The viewport smoothly follows via linear interpolation on each animation frame, keeping the target centered.

Click play to animate a node across the canvas — the camera follows it:

::demo
```toolbar
<button id="demo-follow-node" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-follow-node-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'mover', position: { x: 0, y: 0 }, data: { label: 'Follow me' } },
        { id: 'waypoint', position: { x: 500, y: 250 }, data: { label: 'Waypoint' }, draggable: false },
    ],
    edges: [],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       let anim = null;
       let followHandle = null;
       document.getElementById('demo-follow-node').addEventListener('click', () => {
           if (anim) anim.stop();
           if (followHandle) followHandle.stop();
           $flow.update({ nodes: { mover: { position: { x: 0, y: 0 } } } });
           anim = $flow.animate({
               nodes: { mover: { position: { x: 500, y: 250 } } },
           }, { duration: 3000, easing: 'easeInOut' });
           followHandle = $flow.follow(anim, { zoom: 2 });
       });
       document.getElementById('demo-follow-node-reset').addEventListener('click', () => {
           if (anim) { anim.stop(); anim = null; }
           if (followHandle) { followHandle.stop(); followHandle = null; }
           $flow.update({ nodes: { mover: { position: { x: 0, y: 0 } } } });
           $flow.fitView({ duration: 300 });
       });
   ">
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

## Programmatic API

```js
const handle = $flow.follow('node-1', {
    zoom: 1.5,     // optional target zoom level
    padding: 0.1,  // optional viewport padding
});

// Stop following
handle.stop();
```

Only one follow can be active at a time. Starting a new follow cancels the previous one.

## Follow Targets

The first argument accepts four target types:

| Target | Type | Behavior |
|---|---|---|
| Node ID | `string` | Centers on the node, respects `nodeOrigin` and dimensions |
| Position | `{ x, y }` | Centers on a fixed point in canvas coordinates |
| Particle handle | `ParticleHandle` | Tracks a moving particle; auto-stops when particle completes |
| Animation handle | `FlowAnimationHandle` | Tracks an animation in progress |

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `zoom` | `number` | Current zoom | Zoom level to maintain while following |

The follow loop uses a fixed lerp factor (0.08) for smoothing and does not currently expose tuning options like `speed` or `padding` — reserved for future use.

## Return Value

Returns a `FlowAnimationHandle`. In practice you'll mostly use `.stop()` (to end tracking) and `await .finished` (which resolves when the target is done). See [Animate & Update → FlowAnimationHandle](./animate.md#flowanimationhandle) for the full interface including `pause`/`resume`/`reverse`/`direction`/etc.

## Follow an Animated Node

```js
const anim = $flow.animate({
    nodes: { 'node-1': { position: { x: 800, y: 400 } } },
}, { duration: 3000 });

$flow.follow(anim, { zoom: 1.5 });
```

The top demo shows this in action — the camera tracks the animation handle as the node moves.

## Follow a Particle

Fire a particle and have the camera track it along the edge path. The follow auto-stops when the particle completes:

```js
const particle = $flow.sendParticle('edge-1', { duration: '3s' });
$flow.follow(particle, { zoom: 2 });
```

::demo
```toolbar
<button id="demo-follow-particle" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fire & Follow</button>
<button id="demo-follow-particle-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 300, y: 150 }, data: { label: 'Middle' } },
        { id: 'c', position: { x: 600, y: 0 }, data: { label: 'End' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       let p1 = null, p2 = null, followHandle = null, cancelled = false;
       document.getElementById('demo-follow-particle').addEventListener('click', () => {
           if (p1) p1.stop();
           if (p2) p2.stop();
           if (followHandle) followHandle.stop();
           cancelled = false;
           p1 = $flow.sendParticle('e1', { color: '#DAA532', size: 6, duration: '2s' });
           followHandle = $flow.follow(p1, { zoom: 2 });
           p1.finished.then(() => {
               if (cancelled) return;
               p2 = $flow.sendParticle('e2', { color: '#8B5CF6', size: 6, duration: '2s' });
               followHandle = $flow.follow(p2, { zoom: 2 });
               p2.finished.then(() => {
                   if (cancelled) return;
                   $flow.fitView({ duration: 500 });
               });
           });
       });
       document.getElementById('demo-follow-particle-reset').addEventListener('click', () => {
           cancelled = true;
           if (p1) { p1.stop(); p1 = null; }
           if (p2) { p2.stop(); p2 = null; }
           if (followHandle) { followHandle.stop(); followHandle = null; }
           $flow.fitView({ duration: 300 });
       });
   ">
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

## Follow a Static Position

Pan the camera to a fixed point in the canvas:

```js
$flow.follow({ x: 500, y: 300 }, { zoom: 1 });
```

::demo
```toolbar
<button id="demo-follow-pos-a" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Go to (0, 0)</button>
<button id="demo-follow-pos-b" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Go to (400, 200)</button>
<button id="demo-follow-pos-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fit View</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Origin' } },
        { id: 'b', position: { x: 400, y: 200 }, data: { label: 'Far away' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let followHandle = null;
       document.getElementById('demo-follow-pos-a').addEventListener('click', () => {
           if (followHandle) followHandle.stop();
           followHandle = $flow.follow({ x: 0, y: 0 }, { zoom: 2 });
       });
       document.getElementById('demo-follow-pos-b').addEventListener('click', () => {
           if (followHandle) followHandle.stop();
           followHandle = $flow.follow({ x: 400, y: 200 }, { zoom: 2 });
       });
       document.getElementById('demo-follow-pos-reset').addEventListener('click', () => {
           if (followHandle) { followHandle.stop(); followHandle = null; }
           $flow.fitView({ duration: 300 });
       });
   ">
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

## x-flow-follow Directive

Pan the camera to keep a node centered using a declarative directive on any clickable element.

### Usage

```html
<!-- Follow a node by ID -->
<button x-flow-follow="'node-1'">Follow Node 1</button>

<!-- Follow with options -->
<button x-flow-follow="{ target: 'node-1', zoom: 1.5 }">
  Follow (zoomed)
</button>

<!-- Toggle: click again to stop following -->
<button x-flow-follow.toggle="'node-1'">Toggle Follow</button>
```

### Expression

The expression accepts either a plain node ID string or an options object:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `target` | `string` | — | The node ID to follow (required when using object form) |
| `zoom` | `number` | Current zoom | Zoom level to maintain while following |

Drag a node around — the button starts/stops the camera tracking it:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'tracked', position: { x: 0, y: 0 }, data: { label: 'Drag me around' } },
        { id: 'static1', position: { x: 300, y: 0 }, data: { label: 'Static' }, draggable: false },
        { id: 'static2', position: { x: 150, y: 150 }, data: { label: 'Static' }, draggable: false },
    ],
    edges: [
        { id: 'e1', source: 'tracked', target: 'static1' },
        { id: 'e2', source: 'tracked', target: 'static2' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
})" class="flow-container" style="height: 250px;">
    <div class="canvas-overlay" @mousedown.stop @pointerdown.stop style="position:absolute;top:8px;left:8px;z-index:20;">
        <button x-flow-follow.toggle="{ target: 'tracked', zoom: 2 }" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Toggle Follow</button>
    </div>
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

### `.toggle` Modifier

Without `.toggle`, clicking the button always starts following. With `.toggle`, clicking while already following the same target will stop following.

### CSS Classes

| Class | Applied To | Meaning |
|-------|-----------|---------|
| `flow-following` | The follow button element | The camera is currently following |

```css
[x-flow-follow].flow-following {
  background-color: var(--flow-accent);
  color: white;
}
```
