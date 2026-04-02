---
title: Timeline
description: Multi-step sequenced animations.
order: 2
---

# Timeline

The timeline API sequences multi-step animations with parallel execution, looping, lock mode, and edge transitions. Timelines can be created programmatically via `$flow.timeline()` or declaratively with the `x-flow-timeline` directive.

::demo
```toolbar
<button id="demo-intro-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-intro-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 200, y: 60 }, data: { label: 'Input' } },
        { id: 'b', position: { x: 200, y: 60 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 200, y: 60 }, data: { label: 'Output' } },
    ],
    edges: [],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       const origin = { x: 200, y: 60 };
       document.getElementById('demo-intro-play').addEventListener('click', () => {
           $flow.timeline()
               .lock()
               .parallel([
                   { nodes: ['a'], position: { x: 20, y: 60 }, duration: 500, easing: 'easeOut' },
                   { nodes: ['b'], position: { x: 200, y: 60 }, duration: 500, easing: 'easeOut' },
                   { nodes: ['c'], position: { x: 380, y: 60 }, duration: 500, easing: 'easeOut' },
               ])
               .step({
                   addEdges: [{ id: 'e1', source: 'a', target: 'b' }],
                   edgeTransition: 'draw',
                   duration: 400,
               })
               .step({
                   addEdges: [{ id: 'e2', source: 'b', target: 'c' }],
                   edgeTransition: 'draw',
                   duration: 400,
               })
               .play();
       });
       document.getElementById('demo-intro-reset').addEventListener('click', () => {
           removeEdges(['e1', 'e2']);
           $flow.update({ nodes: {
               a: { position: origin },
               b: { position: origin },
               c: { position: origin },
           }});
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

### Creating a Timeline

```js
const tl = $flow.timeline();
```

### Chain API

Build a timeline by chaining `step()`, `parallel()`, `loop()`, `lock()`, and `play()`:

```js
tl.step({ nodes: ['a'], position: { x: 100 }, duration: 500 })
  .step({ nodes: ['b'], position: { x: 200 }, duration: 300 })
  .parallel([
      { nodes: ['c'], position: { x: 300 }, duration: 400 },
      { nodes: ['d'], position: { x: 400 }, duration: 400 },
  ])
  .loop(2)    // loop 2 times (0 = infinite)
  .lock()     // disable user input during playback
  .play();
```

Click play to see each node move in sequence:

::demo
```toolbar
<button id="demo-seq-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-seq-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 10, y: 10 }, data: { label: 'Step 1' } },
        { id: 'b', position: { x: 10, y: 70 }, data: { label: 'Step 2' } },
        { id: 'c', position: { x: 10, y: 130 }, data: { label: 'Step 3' } },
    ],
    edges: [],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       document.getElementById('demo-seq-play').addEventListener('click', () => {
           $flow.timeline()
               .step({ nodes: ['a'], position: { x: 350, y: 10 }, duration: 400, easing: 'easeOut' })
               .step({ nodes: ['b'], position: { x: 350, y: 70 }, duration: 400, easing: 'easeOut' })
               .step({ nodes: ['c'], position: { x: 350, y: 130 }, duration: 400, easing: 'easeOut' })
               .play();
       });
       document.getElementById('demo-seq-reset').addEventListener('click', () => {
           $flow.update({ nodes: {
               a: { position: { x: 10, y: 10 } },
               b: { position: { x: 10, y: 70 } },
               c: { position: { x: 10, y: 130 } },
           }});
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

### TimelineStep Properties

```ts
interface TimelineStep {
    // Node targeting
    nodes?: string[];
    position?: Partial<XYPosition>;
    dimensions?: Partial<Dimensions>;
    style?: string | Record<string, string>;
    class?: string;
    data?: Record<string, any>;
    selected?: boolean;
    zIndex?: number;

    // Path-based motion
    followPath?: PathFunction | string;  // SVG path string or function
    guidePath?: { visible?: boolean; class?: string; autoRemove?: boolean };

    // Edge targeting
    edges?: string[];
    edgeColor?: string;
    edgeStrokeWidth?: number;
    edgeClass?: string;
    edgeLabel?: string;
    edgeAnimated?: boolean | EdgeAnimationMode;

    // Edge lifecycle
    addEdges?: FlowEdge[];
    removeEdges?: string[];
    edgeTransition?: 'none' | 'draw' | 'fade';

    // Viewport
    viewport?: Partial<Viewport>;
    fitView?: boolean;
    panTo?: string;      // node ID to center on
    fitViewPadding?: number;

    // Parallel container
    parallel?: TimelineStep[];

    // Timing
    duration?: number;
    easing?: EasingName | ((t: number) => number);
    delay?: number;
    lock?: boolean;

    // Hooks
    onStart?: (ctx: StepContext) => void;
    onProgress?: (progress: number, ctx: StepContext) => void;
    onComplete?: (ctx: StepContext) => void;
}
```

### Timeline State

`tl.state` is a readonly property: `'idle'` | `'playing'` | `'paused'` | `'stopped'`.

### Timeline Events

The timeline emits events throughout its lifecycle:

| Event | Description |
|---|---|
| `play` | Playback started |
| `step` | A step began executing |
| `step-complete` | A step finished |
| `pause` | Playback paused |
| `resume` | Playback resumed |
| `interrupt` | Playback was interrupted |
| `complete` | All steps finished |
| `reverse` | Direction reversed |
| `loop` | A loop iteration completed |
| `stop` | Playback stopped |
| `reset` | Timeline was reset |

```js
tl.on('step-complete', ({ stepIndex }) => {
    console.log(`Step ${stepIndex} done`);
});
```

## Edge Transitions

When adding or removing edges within a timeline step, `edgeTransition` controls the visual effect:

| Transition | Effect |
|---|---|
| `'draw'` | Path traces from source to target (or retracts on remove) |
| `'fade'` | Opacity fades in/out |
| `'none'` | Instant appear/disappear (default) |

Click play to see edges draw in, then fade out:

::demo
```toolbar
<button id="demo-edge-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-edge-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 20, y: 50 }, data: { label: 'Start' } },
        { id: 'b', position: { x: 200, y: 50 }, data: { label: 'Middle' } },
        { id: 'c', position: { x: 380, y: 50 }, data: { label: 'End' } },
    ],
    edges: [],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 200px;"
   x-init="
       document.getElementById('demo-edge-play').addEventListener('click', () => {
           $flow.timeline()
               .step({
                   addEdges: [{ id: 'e1', source: 'a', target: 'b' }],
                   edgeTransition: 'draw',
                   duration: 600,
               })
               .step({
                   addEdges: [{ id: 'e2', source: 'b', target: 'c' }],
                   edgeTransition: 'draw',
                   duration: 600,
               })
               .step({ duration: 500 })
               .step({
                   removeEdges: ['e1', 'e2'],
                   edgeTransition: 'fade',
                   duration: 400,
               })
               .play();
       });
       document.getElementById('demo-edge-reset').addEventListener('click', () => {
           removeEdges(['e1', 'e2']);
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

## Lock Mode

When `lock()` is called on the timeline or a step has `lock: true`, a canvas-level `_animationLocked` flag disables all user input (drag, pan, zoom, selection, connection, keyboard) during playback. The flag is cleared during pause points and on completion.

## Undo/Redo Interaction

History capture is suspended during timeline playback. When the timeline completes (or is interrupted), the entire result is captured as a single undo entry.

## Easing Presets

| Name | Curve |
|---|---|
| `'linear'` | Constant speed |
| `'easeIn'` | Quadratic ease-in |
| `'easeOut'` | Quadratic ease-out |
| `'easeInOut'` | Quadratic ease-in-out (default) |
| `'easeBounce'` | Bounce at end |
| `'easeElastic'` | Elastic overshoot |
| `'easeBack'` | Slight overshoot in-out |

### Custom Easing Function

Pass any `(t: number) => number` function where `t` goes from 0 to 1:

```js
$flow.animate(targets, {
    duration: 500,
    easing: (t) => t * t * t,  // cubic ease-in
});
```

## x-flow-timeline Directive

Bind a reactive timeline definition from Alpine data for declarative multi-step animations.

### Configuration Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `steps` | `Array` | `[]` | Array of `step()` and `parallel()` entries. |
| `autoplay` | `boolean` | `true` | Start playback automatically when the directive initializes. |
| `loop` | `boolean \| number` | `false` | Loop playback. `true` loops indefinitely; a number sets the loop count. |
| `lock` | `boolean` | `false` | Disable user interaction with the canvas during playback. |
| `speed` | `number` | `1` | Playback speed multiplier. `2` is double speed, `0.5` is half speed. |
| `overflow` | `'queue' \| 'latest'` | `'queue'` | Behavior when a new timeline triggers while one is playing. |
| `autoFitView` | `boolean` | `false` | Automatically fit the viewport at each step. |
| `fitViewPadding` | `number` | `50` | Padding in pixels when `autoFitView` is enabled. |
| `respectReducedMotion` | `boolean` | `true` | Skip animations when the OS has reduced motion enabled. |

### Step Types

**Sequential:** steps execute one after another.

```js
steps: [
    { nodes: ['a'], position: { x: 100, y: 0 }, duration: 400 },
    { nodes: ['b'], position: { x: 200, y: 0 }, duration: 400 },
    { viewport: { zoom: 1.5 }, duration: 600 },
]
```

**Parallel:** wrap multiple steps in a `parallel` array to run at the same time.

```js
steps: [
    { parallel: [
        { nodes: ['a'], position: { x: 100, y: 0 }, duration: 400 },
        { nodes: ['b'], position: { x: 200, y: 0 }, duration: 400 },
    ]},
    { viewport: { zoom: 1 }, duration: 600 },
]
```

The timeline advances to the next entry only after all parallel steps complete.

Click play to see both nodes move at the same time:

::demo
```toolbar
<button id="demo-par-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-par-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 200, y: 10 }, data: { label: 'Node A' } },
        { id: 'b', position: { x: 200, y: 100 }, data: { label: 'Node B' } },
    ],
    edges: [],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       document.getElementById('demo-par-play').addEventListener('click', () => {
           $flow.timeline()
               .parallel([
                   { nodes: ['a'], position: { x: 20, y: 10 }, duration: 600, easing: 'easeInOut' },
                   { nodes: ['b'], position: { x: 380, y: 100 }, duration: 600, easing: 'easeInOut' },
               ])
               .parallel([
                   { nodes: ['a'], position: { x: 200, y: 10 }, duration: 600, easing: 'easeInOut' },
                   { nodes: ['b'], position: { x: 200, y: 100 }, duration: 600, easing: 'easeInOut' },
               ])
               .play();
       });
       document.getElementById('demo-par-reset').addEventListener('click', () => {
           $flow.update({ nodes: {
               a: { position: { x: 200, y: 10 } },
               b: { position: { x: 200, y: 100 } },
           }});
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

### Element API

The directive exposes a playback API on the host element via `el.__timeline`:

| Method / Property | Type | Description |
|---|---|---|
| `play()` | `() => void` | Start or resume playback. |
| `stop()` | `() => void` | Stop and hold at the current position. |
| `reset()` | `() => void` | Stop and reset all animated properties to initial values. |
| `state` | `'idle' \| 'playing' \| 'stopped'` | Current playback state (reactive). |

```html
<div x-flow-timeline="timelineConfig" x-ref="tl"></div>

<button @click="$refs.tl.__timeline.play()">Play</button>
<button @click="$refs.tl.__timeline.stop()">Stop</button>
<button @click="$refs.tl.__timeline.reset()">Reset</button>
<span x-text="$refs.tl.__timeline.state"></span>
```

### Full Directive Example

```html
<div x-data="{
    timeline: {
        autoplay: false,
        loop: 2,
        lock: true,
        speed: 1,
        respectReducedMotion: true,
        steps: [
            { nodes: ['intro'], style: { opacity: '1' }, duration: 600 },
            { parallel: [
                { nodes: ['left'], position: { x: -200, y: 0 }, duration: 500 },
                { nodes: ['right'], position: { x: 200, y: 0 }, duration: 500 },
            ]},
            {
                addEdges: [{ id: 'connect', source: 'left', target: 'right' }],
                edgeTransition: 'draw',
                duration: 800,
            },
            { viewport: { zoom: 1, x: 0, y: 0 }, duration: 600 },
        ],
    },
}">
    <div x-flow-timeline="timeline" x-ref="tl"></div>
    <button @click="$refs.tl.__timeline.play()">Play Demo</button>
</div>
```

## Demo

A combined timeline — nodes spread out, edges draw in, then particles flow:

::demo
```toolbar
<button id="demo-full-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-full-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 200, y: 60 }, data: { label: 'Input' } },
        { id: 'b', position: { x: 200, y: 60 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 200, y: 60 }, data: { label: 'Output' } },
    ],
    edges: [],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       const origin = { x: 200, y: 60 };
       document.getElementById('demo-full-play').addEventListener('click', () => {
           $flow.timeline()
               .lock()
               .parallel([
                   { nodes: ['a'], position: { x: 20, y: 60 }, duration: 500, easing: 'easeOut' },
                   { nodes: ['b'], position: { x: 200, y: 60 }, duration: 500, easing: 'easeOut' },
                   { nodes: ['c'], position: { x: 380, y: 60 }, duration: 500, easing: 'easeOut' },
               ])
               .step({
                   addEdges: [{ id: 'e1', source: 'a', target: 'b' }],
                   edgeTransition: 'draw',
                   duration: 500,
               })
               .step({
                   addEdges: [{ id: 'e2', source: 'b', target: 'c' }],
                   edgeTransition: 'draw',
                   duration: 500,
               })
               .step({
                   onStart: () => {
                       $flow.sendParticle('e1', { color: '#DAA532', size: 5, duration: '1s' });
                       setTimeout(() => $flow.sendParticle('e2', { color: '#8B5CF6', size: 5, duration: '1s' }), 400);
                   },
                   duration: 1200,
               })
               .play();
       });
       document.getElementById('demo-full-reset').addEventListener('click', () => {
           removeEdges(['e1', 'e2']);
           $flow.update({ nodes: {
               a: { position: origin },
               b: { position: origin },
               c: { position: origin },
           }});
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
