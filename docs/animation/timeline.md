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
interface TimelineStep<TContext = Record<string, any>> {
    id?: string;            // optional name for this step (shows up in events)

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

    // Composition
    parallel?: TimelineStep<TContext>[];   // run all in parallel
    timeline?: FlowTimeline;               // sub-timeline — play another timeline as one step
    independent?: boolean;                 // sub-timeline: run with its own context instead of inheriting

    // Conditional
    when?: (ctx: StepContext<TContext>) => boolean;  // run only if true
    else?: TimelineStep<TContext>;                    // alternative step when `when` returns false

    // Awaitable — pause until a promise resolves (or timeout fires)
    await?: Promise<any> | { finished: Promise<any> } | (() => Promise<any> | { finished: Promise<any> });
    timeout?: number;       // ms cap on the await

    // Timing
    duration?: number;
    easing?: EasingName | ((t: number) => number);
    delay?: number;
    lock?: boolean;

    // Hooks
    onStart?: (ctx: StepContext<TContext>) => void;
    onProgress?: (progress: number, ctx: StepContext<TContext>) => void;
    onComplete?: (ctx: StepContext<TContext>) => void;
}
```

> **Note:** Animating `dimensions.height` auto-sets `fixedDimensions: true` on the target node at animation start — the explicit height persists after the animation completes. Reset `fixedDimensions` to `false` on the node to let it return to content-driven sizing.

Steps can also be **functions** of context — `tl.step((ctx) => ({ nodes: [ctx.current], position: { x: ctx.targetX } }))` — which lets one step shape depend on data computed earlier in the timeline. See *Context* below.

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

## Context

A timeline carries a mutable **context object** that every step callback can read and write. It's how one step passes data to the next without closures.

```ts
$flow.timeline<{ winner: string }>()
    .step({ nodes: ['a'], position: { x: 200 }, duration: 300,
        onComplete: (ctx) => { ctx.context.winner = 'a'; } })
    .step((ctx) => ({
        nodes: [ctx.context.winner],   // ← computed from prior step
        position: { x: 400 },
        duration: 300,
    }))
    .play();
```

The `TContext` generic parameter on `$flow.timeline<TContext>()` gives you autocomplete and type-checking on `ctx.context`. Initialize it with `setContext()`:

```ts
interface MyCtx { winner: string; score: number; }
const tl = $flow.timeline<MyCtx>().setContext({ winner: '', score: 0 });
```

`ctx` in every callback is `StepContext<TContext>` — it also exposes `stepIndex`, `stepId`, and `timeline` (the parent handle).

## Conditional steps

Use `when:` to gate a step on state computed earlier, and optionally `else:` to fall back:

```js
$flow.timeline()
    .step({ nodes: ['a'], position: { x: 200 }, duration: 300,
        onComplete: (ctx) => { ctx.context.path = Math.random() > 0.5 ? 'left' : 'right'; } })
    .step({
        when: (ctx) => ctx.context.path === 'left',
        nodes: ['a'], position: { x: 100, y: 100 }, duration: 400,
        else: { nodes: ['a'], position: { x: 300, y: 100 }, duration: 400 },
    })
    .play();
```

If both `when` returns false AND `else` is absent, the step is skipped silently.

::demo
```toolbar
<button id="demo-tl-cond-play"   class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-tl-cond-toggle" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Toggle isPremium</button>
<span id="demo-tl-cond-state" class="font-mono text-[10px] text-text-faint">isPremium = true</span>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'gate',    position: { x: 40, y: 30  }, data: { label: 'Start (gate)' } },
        { id: 'premium', position: { x: 40, y: 100 }, data: { label: 'Premium path' } },
        { id: 'upsell',  position: { x: 40, y: 170 }, data: { label: 'Upsell path' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 260px;"
   x-init="
       let isPremium = true;
       const state = document.getElementById('demo-tl-cond-state');
       document.getElementById('demo-tl-cond-toggle').addEventListener('click', () => {
           isPremium = !isPremium;
           state.textContent = 'isPremium = ' + isPremium;
       });
       document.getElementById('demo-tl-cond-play').addEventListener('click', () => {
           $flow.update({ nodes: {
               gate:    { position: { x: 40 } },
               premium: { position: { x: 40 } },
               upsell:  { position: { x: 40 } },
           }});
           const flag = isPremium;
           $flow.timeline()
               .step({ nodes: ['gate'], position: { x: 200 }, duration: 500, easing: 'easeOut' })
               .step({
                   when: () => flag,
                   nodes: ['premium'], position: { x: 360 }, duration: 600, easing: 'easeOut',
                   else: { nodes: ['upsell'], position: { x: 360 }, duration: 600, easing: 'easeOut' },
               })
               .play();
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

## Awaitable steps

Pause the timeline until an external promise resolves. The `await` value can be a bare `Promise`, an object with a `finished` promise (e.g. a `FlowAnimationHandle` or `ReplayHandle`), or a function that returns one.

```js
$flow.timeline()
    .step({ nodes: ['trigger'], position: { x: 200 }, duration: 300 })
    .step({
        await: () => fetch('/api/ready').then(r => r.json()),
        timeout: 5000,   // ms — step auto-resolves on timeout to avoid stalls
    })
    .step({ nodes: ['result'], position: { x: 400 }, duration: 300 })
    .play();
```

Good for "wait until the user confirms" or "wait for a network call" pauses mid-sequence. `timeout` is recommended — without it, a never-resolving promise stalls the whole timeline.

::demo
```toolbar
<button id="demo-tl-await-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<span id="demo-tl-await-status" class="font-mono text-[10px] text-text-faint">idle</span>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'pre',  position: { x: 40, y: 30  }, data: { label: 'Pre (step 1)' } },
        { id: 'post', position: { x: 40, y: 110 }, data: { label: 'Post (step 3)' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       const status = document.getElementById('demo-tl-await-status');
       document.getElementById('demo-tl-await-play').addEventListener('click', () => {
           $flow.update({ nodes: {
               pre:  { position: { x: 40 } },
               post: { position: { x: 40 } },
           }});
           status.textContent = 'running step 1…';
           $flow.timeline()
               .step({ nodes: ['pre'], position: { x: 360 }, duration: 600, easing: 'easeOut',
                       onComplete: () => { status.textContent = 'awaiting 1500ms promise…'; } })
               .step({ await: () => new Promise(r => setTimeout(r, 1500)) })
               .step({ nodes: ['post'], position: { x: 360 }, duration: 600, easing: 'easeOut',
                       onStart: () => { status.textContent = 'step 3 started'; },
                       onComplete: () => { status.textContent = 'done'; } })
               .play();
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

## Sub-timelines

Embed a whole timeline as a single step. Useful for reusing named sequences or grouping related steps:

```js
const intro = $flow.timeline()
    .step({ nodes: ['title'], position: { y: 40 }, duration: 400 })
    .step({ nodes: ['subtitle'], position: { y: 80 }, duration: 300 });

$flow.timeline()
    .step({ timeline: intro })                   // play the whole intro as step 1
    .step({ nodes: ['cta'], position: { x: 300 }, duration: 400 })
    .play();
```

By default the sub-timeline **inherits** the parent's context (shared object). Pass `independent: true` to give it a fresh isolated context:

```js
.step({ timeline: subflow, independent: true })
```

::demo
```toolbar
<button id="demo-tl-sub-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'main',  position: { x: 40,  y: 30  }, data: { label: 'Main A' } },
        { id: 'main2', position: { x: 40,  y: 90  }, data: { label: 'Main B' } },
        { id: 'bg',    position: { x: 200, y: 160 }, data: { label: 'Background' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 240px;"
   x-init="
       document.getElementById('demo-tl-sub-play').addEventListener('click', () => {
           $flow.update({ nodes: {
               main:  { position: { x: 40  } },
               main2: { position: { x: 40  } },
               bg:    { position: { x: 200 } },
           }});
           // Reusable sub-timeline — bg drifts out-and-back
           const bgDrift = $flow.timeline()
               .step({ nodes: ['bg'], position: { x: 340 }, duration: 500 })
               .step({ nodes: ['bg'], position: { x: 60  }, duration: 500 });
           // Parent embeds it as a single step
           $flow.timeline()
               .step({ nodes: ['main'],  position: { x: 360 }, duration: 600 })
               .step({ timeline: bgDrift })
               .step({ nodes: ['main2'], position: { x: 360 }, duration: 600 })
               .play();
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

## Interactive pause

`tl.pause()` can take a callback that receives a `resume` function — useful when the pause should be driven by UI (a button, a confirmation modal, a user action):

```js
tl.step({ nodes: ['a'], position: { x: 200 }, duration: 300 })
  .pause((resume) => {
      // called when the timeline hits this pause — show UI
      document.getElementById('continue-btn').addEventListener('click', () => {
          resume({ chosenPath: 'left' });   // optional: merge into context
      }, { once: true });
  })
  .step((ctx) => ({ nodes: [ctx.context.chosenPath === 'left' ? 'a' : 'b'], position: { x: 400 } }))
  .play();
```

Without a callback, `tl.pause()` just stops the timeline until something else calls `tl.play()` again.

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
| `state` | `'idle' \| 'playing' \| 'paused' \| 'stopped'` | Current playback state (reactive). |

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
