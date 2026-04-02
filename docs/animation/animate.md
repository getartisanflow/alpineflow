---
title: Animate & Update
description: Programmatic property transitions.
order: 1
---

# Animate & Update

AlpineFlow provides two core methods for changing node, edge, and viewport properties: `update()` for instant changes and `animate()` for smooth transitions.

## update() vs animate()

Both methods accept the same `AnimateTargets` shape and `AnimateOptions`, but differ in their defaults:

| Method | Default Duration | Use Case |
|--------|-----------------|----------|
| `$flow.update()` | `0` (instant) | Snap properties to new values without visual transition |
| `$flow.animate()` | `300` ms | Smoothly interpolate properties over time |

```js
// Instant — node jumps to the new position
$flow.update({ nodes: { 'node-1': { position: { x: 300, y: 200 } } } });

// Smooth — node glides to the new position over 300ms
$flow.animate({ nodes: { 'node-1': { position: { x: 300, y: 200 } } } });

// update() with an explicit duration behaves identically to animate()
$flow.update(
  { nodes: { 'node-1': { position: { x: 300, y: 200 } } } },
  { duration: 500, easing: 'easeInOut' }
);
```

Click each button to see the difference — "Update" snaps instantly, "Animate" glides smoothly:

::demo
```toolbar
<button id="demo-update-btn" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Update (instant)</button>
<button id="demo-animate-btn" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Animate (smooth)</button>
<button id="demo-ua-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'u1', position: { x: 30, y: 15 }, data: { label: 'update()' } },
        { id: 'a1', position: { x: 250, y: 15 }, data: { label: 'animate()' } },
    ],
    edges: [],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 200px;"
   x-init="
       let uDown = false, aDown = false;
       document.getElementById('demo-update-btn').addEventListener('click', () => {
           uDown = !uDown;
           $flow.update({ nodes: { u1: { position: { x: 30, y: uDown ? 80 : 15 } } } });
       });
       document.getElementById('demo-animate-btn').addEventListener('click', () => {
           aDown = !aDown;
           $flow.animate({ nodes: { a1: { position: { x: 250, y: aDown ? 80 : 15 } } } }, { duration: 600, easing: 'easeInOut' });
       });
       document.getElementById('demo-ua-reset').addEventListener('click', () => {
           uDown = false; aDown = false;
           $flow.update({ nodes: {
               u1: { position: { x: 30, y: 15 } },
               a1: { position: { x: 250, y: 15 } },
           }});
       });
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <span x-text="node.data.label"></span>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## AnimateTargets

The `targets` object has three optional keys — `nodes`, `edges`, and `viewport`:

```ts
interface AnimateTargets {
    nodes?: Record<string, AnimateNodeTarget>;
    edges?: Record<string, AnimateEdgeTarget>;
    viewport?: AnimateViewportTarget;
}
```

### Node Targets (keyed by node ID)

| Property | Type | Animated? | Description |
|---|---|---|---|
| `position` | `{ x?, y? }` | Yes | Move node to position |
| `dimensions` | `{ width?, height? }` | Yes | Resize node |
| `style` | `string \| Record<string, string>` | Yes | CSS style interpolation |
| `class` | `string` | Instant | CSS class replacement |
| `data` | `Record<string, any>` | Instant | Merge into node data |
| `selected` | `boolean` | Instant | Selection state |
| `zIndex` | `number` | Instant | Z-index override |

### Edge Targets (keyed by edge ID)

| Property | Type | Animated? | Description |
|---|---|---|---|
| `color` | `string` | Yes | Stroke color interpolation |
| `strokeWidth` | `number` | Yes | Stroke width |
| `label` | `string` | Instant | Edge label text |
| `animated` | `boolean` | Instant | Dash animation toggle |
| `class` | `string` | Instant | CSS class replacement |

### Viewport Target

| Property | Type | Description |
|---|---|---|
| `pan` | `{ x?, y? }` | Pan to position |
| `zoom` | `number` | Zoom level |

## AnimateOptions

```ts
interface AnimateOptions {
    duration?: number;    // ms. 0 = instant. Default: 300 (animate) / 0 (update)
    easing?: EasingName | ((t: number) => number);  // Default: 'easeInOut'
    delay?: number;       // ms before starting. Default: 0
    loop?: boolean | 'reverse';  // true = forever, 'reverse' = ping-pong
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
}
```

Compare easing presets — all nodes move to the same target, each with a different curve:

::demo
```toolbar
<button id="demo-easing-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-easing-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'n1', position: { x: 10, y: 10 }, data: { label: 'linear' } },
        { id: 'n2', position: { x: 10, y: 60 }, data: { label: 'easeInOut' } },
        { id: 'n3', position: { x: 10, y: 110 }, data: { label: 'easeBounce' } },
        { id: 'n4', position: { x: 10, y: 160 }, data: { label: 'easeElastic' } },
    ],
    edges: [],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 280px;"
   x-init="
       const startX = 10, endX = 300, dur = 1500;
       let atEnd = false;
       document.getElementById('demo-easing-play').addEventListener('click', () => {
           const targetX = atEnd ? startX : endX;
           $flow.animate({ nodes: { n1: { position: { x: targetX } } } }, { duration: dur, easing: 'linear' });
           $flow.animate({ nodes: { n2: { position: { x: targetX } } } }, { duration: dur, easing: 'easeInOut' });
           $flow.animate({ nodes: { n3: { position: { x: targetX } } } }, { duration: dur, easing: 'easeBounce' });
           $flow.animate({ nodes: { n4: { position: { x: targetX } } } }, { duration: dur, easing: 'easeElastic' });
           atEnd = !atEnd;
       });
       document.getElementById('demo-easing-reset').addEventListener('click', () => {
           atEnd = false;
           $flow.update({ nodes: {
               n1: { position: { x: startX, y: 10 } },
               n2: { position: { x: startX, y: 60 } },
               n3: { position: { x: startX, y: 110 } },
               n4: { position: { x: startX, y: 160 } },
           }});
       });
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <span x-text="node.data.label" style="font-family: monospace; font-size: 12px;"></span>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## FlowAnimationHandle

Both `update()` and `animate()` return a `FlowAnimationHandle` for controlling the in-flight animation:

```ts
interface FlowAnimationHandle {
    pause(): void;
    resume(): void;
    stop(): void;
    reverse(): void;
    readonly finished: Promise<void>;
}
```

```js
const handle = $flow.animate({
    nodes: {
        'node-1': { position: { x: 300, y: 100 } },
        'node-2': { position: { x: 500, y: 200 }, style: { opacity: '0.8' } },
    },
    edges: {
        'edge-1': { color: '#10b981', strokeWidth: 3 },
    },
}, {
    duration: 500,
    easing: 'easeOut',
    onComplete: () => console.log('done'),
});

// Control the animation
handle.pause();
handle.resume();
```

Start a slow animation, then use the controls to pause, resume, reverse, or stop it:

::demo
```toolbar
<button id="demo-handle-start" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Start</button>
<button id="demo-handle-pause" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Pause</button>
<button id="demo-handle-resume" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Resume</button>
<button id="demo-handle-reverse" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reverse</button>
<button id="demo-handle-stop" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Stop</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'mover', position: { x: 0, y: 50 }, data: { label: 'Controlled' } },
        { id: 'target', position: { x: 450, y: 50 }, data: { label: 'Target' }, draggable: false },
    ],
    edges: [
        { id: 'e1', source: 'mover', target: 'target' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let handle = null;
       let done = false;
       const startPos = { x: 0, y: 50 };
       const endPos = { x: 400, y: 50 };
       function go(from, to, edgeColor, edgeWidth) {
           $flow.update({ nodes: { mover: { position: from } } });
           done = false;
           handle = $flow.animate({
               nodes: { mover: { position: to } },
               edges: { e1: { color: edgeColor, strokeWidth: edgeWidth } },
           }, { duration: 3000, easing: 'linear', onComplete: () => { done = true; } });
       }
       document.getElementById('demo-handle-start').addEventListener('click', () => {
           if (handle) handle.stop();
           go(startPos, endPos, '#10b981', 3);
       });
       document.getElementById('demo-handle-pause').addEventListener('click', () => handle?.pause());
       document.getElementById('demo-handle-resume').addEventListener('click', () => handle?.resume());
       document.getElementById('demo-handle-reverse').addEventListener('click', () => {
           if (!handle) return;
           if (done) {
               go(endPos, startPos, null, null);
           } else {
               handle.reverse();
           }
       });
       document.getElementById('demo-handle-stop').addEventListener('click', () => {
           if (handle) { handle.stop(); handle = null; }
           done = false;
           $flow.update({ nodes: { mover: { position: startPos } }, edges: { e1: { color: null, strokeWidth: null } } });
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

## Per-Element Timing Overrides

Individual targets can override the global duration and easing using `_duration` and `_easing`:

```js
$flow.animate({
    nodes: {
        'fast-node': { position: { x: 100 }, _duration: 200 },
        'slow-node': { position: { x: 500 }, _duration: 1000 },
    },
}, { duration: 500 }); // default for targets without _duration
```

A target with `_duration: 0` applies its changes instantly while other targets animate.

## Named Animations

Register reusable animation sequences by name, then trigger them from anywhere:

```js
// Register
$flow.registerAnimation('intro', [
    { nodes: ['a', 'b', 'c'], position: { x: 0, y: 0 }, duration: 0 },
    { nodes: ['a'], position: { x: 100, y: 50 }, duration: 500 },
    { nodes: ['b'], position: { x: 300, y: 50 }, duration: 500 },
    { nodes: ['c'], position: { x: 200, y: 200 }, duration: 500 },
]);

// Play
await $flow.playAnimation('intro');

// Unregister when no longer needed
$flow.unregisterAnimation('intro');
```

Named animations are also the mechanism behind the `x-flow-animate` directive's argument syntax:

```html
<div x-flow-animate:intro="introSteps"></div>
<button @click="$flow.playAnimation('intro')">Play Intro</button>
```

## x-flow-animate Directive

Trigger one-shot animations on nodes, edges, or the viewport from DOM events.

### Basic Usage

```html
<button x-flow-animate="{ nodes: ['node-1'], position: { x: 300, y: 100 }, duration: 500, easing: 'easeInOut' }">
    Move Node
</button>
```

### Step Shape

```js
{
    nodes: ['id'],           // target node IDs
    edges: ['id'],           // target edge IDs
    viewport: true,          // target the viewport

    // Node properties
    position: { x, y },
    dimensions: { width, height },
    style: { ... },
    class: 'name',
    data: { key: value },
    selected: true,
    zIndex: 10,

    // Edge properties
    color: '#ff0000',
    strokeWidth: 3,
    label: 'new label',
    animated: true,
    class: 'name',

    // Viewport properties
    pan: { x, y },
    zoom: 1.5,

    // Timing
    duration: 500,
    easing: 'easeInOut',
    delay: 0,
}
```

### Sequential Steps

When an array of steps is provided, they execute sequentially:

```html
<button x-flow-animate="[
    { nodes: ['a'], position: { x: 100, y: 0 }, duration: 300 },
    { nodes: ['b'], position: { x: 200, y: 0 }, duration: 300 },
]">
    Move A then B
</button>
```

### Named Animations via Argument

Use `:name` to register a named animation that can be triggered programmatically via `playAnimation()`:

```html
<div x-flow-animate:intro="[
    { nodes: ['a', 'b'], position: { x: 0, y: 0 }, duration: 600 },
    { viewport: true, zoom: 1, duration: 400 },
]"></div>
```

```js
$flow.playAnimation('intro');
```

### Modifiers

| Modifier | Description |
|---|---|
| `.click` | Trigger on click (default). |
| `.mouseenter` | Trigger on mouse enter. |
| `.once` | Play the animation only once; subsequent triggers are ignored. |
| `.reverse` | Automatically reverse the animation when triggered again. |
| `.queue` | Queue the animation instead of cancelling the previous one. |

### Examples

**Mouseenter with auto-reverse** -- nodes move to the target position on hover; triggering again returns them:

```html
<div x-flow-animate.mouseenter.reverse="{
    nodes: ['preview'],
    position: { x: 0, y: -50 },
    style: { opacity: '1' },
    duration: 300,
}">
    Hover to preview
</div>
```

**One-shot intro:**

```html
<button x-flow-animate.click.once="[
    { nodes: ['step-1'], style: { opacity: '1' }, duration: 400 },
    { nodes: ['step-2'], style: { opacity: '1' }, duration: 400 },
    { viewport: true, zoom: 1, pan: { x: 0, y: 0 }, duration: 600 },
]">
    Play Intro
</button>
```

## Demo

Hover over each node to see it react — the directive handles the animation and auto-reverses on mouse leave:

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Hover me' } },
        { id: 'b', position: { x: 200, y: 0 }, data: { label: 'Or me' } },
        { id: 'c', position: { x: 400, y: 60 }, data: { label: 'Or me' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 230px;">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node"
                 x-flow-animate.mouseenter.reverse="{
                     nodes: [node.id],
                     style: { transform: 'scale(1.08) translateY(-10px)' },
                     duration: 250,
                     easing: 'easeOut',
                 }">
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo
