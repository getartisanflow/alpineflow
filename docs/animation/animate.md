---
title: Animate & Update
description: Programmatic property transitions.
order: 1
---

# Animate & Update

AlpineFlow provides two core methods for changing node, edge, and viewport properties: `update()` for instant changes and `animate()` for smooth transitions.

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

> **Note:** Animating `dimensions.height` auto-sets `fixedDimensions: true` on the target node at animation start — the explicit height persists after the animation completes. Reset `fixedDimensions` to `false` on the node to let it return to content-driven sizing.
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
    // Timing
    duration?: number;    // ms. 0 = instant. Default: 300 (animate) / 0 (update)
    easing?: EasingName | ((t: number) => number);  // Default: 'easeInOut'
    delay?: number;       // ms before starting. Default: 0
    loop?: boolean | 'ping-pong';  // true = forever, 'ping-pong' = bounce back and forth
    startAt?: 'start' | 'end';  // 'end' snaps to target and plays backward. Default: 'start'.

    // Physics — use instead of duration+easing
    motion?: MotionConfig | string;   // e.g. 'spring.wobbly' or { type: 'spring', stiffness: 100 }
    maxDuration?: number;              // safety cap for physics motion (ms). Default: 5000.

    // Lifecycle callbacks
    onStart?: () => void;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;

    // Tagging — group animations so `$flow.cancelAll({ tag })` can stop them together
    tag?: string;
    tags?: string[];

    // State-aware cancellation — `while:` auto-cancels when the predicate returns false
    while?: () => boolean;
    whileStopMode?: 'jump-end' | 'rollback' | 'freeze';  // how to stop. Default: 'jump-end'.
}
```

`loop: 'reverse'` still works and is aliased to `'ping-pong'` for backwards compatibility.

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
    // Transport
    pause(): void;
    resume(): void;
    play(): void;                        // revive a finished handle and play from current position
    playForward(): void;                  // set direction 'forward' and play
    playBackward(): void;                 // set direction 'backward' and play
    reverse(): void;                      // flip direction and keep playing
    restart(options?: { direction?: 'forward' | 'backward' }): void;
    stop(options?: StopOptions): void;    // see "Stop modes" below

    // State (all readonly)
    readonly direction: 'forward' | 'backward';
    readonly isFinished: boolean;
    readonly currentValue: Map<string, number | string>;  // current per-key interpolated values
    readonly finished: Promise<void>;
}

interface StopOptions {
    mode?: 'jump-end' | 'rollback' | 'freeze';  // default 'jump-end'
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

Start a slow animation, then use the controls to pause, resume, reverse, or stop it. Buttons are disabled when they'd be a no-op (e.g. Start while running, Reverse while idle):

::demo
```toolbar
<button id="demo-handle-start" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body disabled:opacity-40 disabled:cursor-not-allowed">Start</button>
<button id="demo-handle-pause" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body disabled:opacity-40 disabled:cursor-not-allowed" disabled>Pause</button>
<button id="demo-handle-resume" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body disabled:opacity-40 disabled:cursor-not-allowed" disabled>Resume</button>
<button id="demo-handle-reverse" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body disabled:opacity-40 disabled:cursor-not-allowed" disabled>Reverse</button>
<button id="demo-handle-stop" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body disabled:opacity-40 disabled:cursor-not-allowed" disabled>Stop</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'mover', position: { x: 0, y: 50 }, data: { label: 'Controlled' } },
    ],
    edges: [],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let handle = null;
       let paused = false;
       const startPos = { x: 0, y: 50 };
       const endPos = { x: 400, y: 50 };
       const btns = {
           start:   document.getElementById('demo-handle-start'),
           pause:   document.getElementById('demo-handle-pause'),
           resume:  document.getElementById('demo-handle-resume'),
           reverse: document.getElementById('demo-handle-reverse'),
           stop:    document.getElementById('demo-handle-stop'),
       };
       const syncButtons = () => {
           const running = !!handle && !handle.isFinished;
           btns.start.disabled   = running;
           btns.pause.disabled   = !running || paused;
           btns.resume.disabled  = !running || !paused;
           btns.reverse.disabled = !running;
           btns.stop.disabled    = !running;
       };
       btns.start.addEventListener('click', () => {
           if (handle && !handle.isFinished) return;
           $flow.update({ nodes: { mover: { position: startPos } } });
           paused = false;
           handle = $flow.animate(
               { nodes: { mover: { position: endPos } } },
               { duration: 3000, easing: 'linear', onComplete: syncButtons },
           );
           syncButtons();
       });
       btns.pause.addEventListener('click',   () => { handle?.pause();   paused = true;  syncButtons(); });
       btns.resume.addEventListener('click',  () => { handle?.resume();  paused = false; syncButtons(); });
       btns.reverse.addEventListener('click', () => handle?.reverse());
       btns.stop.addEventListener('click',    () => {
           handle?.stop();
           $flow.update({ nodes: { mover: { position: startPos } } });
           handle = null;
           paused = false;
           syncButtons();
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

## Stop modes

`handle.stop()` and `$flow.cancelAll(filter)` both accept a `mode` option that decides what the final visual state looks like when the animation ends:

| Mode | Behavior |
|---|---|
| `'jump-end'` *(default)* | Snap to target values — the animation completes instantly |
| `'rollback'` | Revert to the values captured when the animation started |
| `'freeze'` | Leave nodes at whatever interpolated value they happen to be at |

```js
// Snap the node to its destination
handle.stop({ mode: 'jump-end' });

// Revert to the starting values
handle.stop({ mode: 'rollback' });

// Leave it wherever it is — useful for user-cancellation UX
handle.stop({ mode: 'freeze' });
```

This matters for UX choices — "user cancelled, keep their in-progress position" is freeze; "operation failed, undo everything we changed" is rollback; "success, commit the destination" is jump-end.

Start three 4-second animations, then click "Stop all" — each one uses a different mode so you can see them side-by-side:

::demo
```toolbar
<button id="demo-stopmode-start" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Start all</button>
<button id="demo-stopmode-stop" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Stop all</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'jump',   position: { x: 40, y: 20  }, data: { label: 'jump-end  → snaps to target' } },
        { id: 'roll',   position: { x: 40, y: 80  }, data: { label: 'rollback  → reverts to start' } },
        { id: 'freeze', position: { x: 40, y: 140 }, data: { label: 'freeze    → stays mid-flight' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let handles = {};
       const startAll = () => {
           $flow.update({ nodes: {
               jump:   { position: { x: 40 } },
               roll:   { position: { x: 40 } },
               freeze: { position: { x: 40 } },
           }});
           handles.jump   = $flow.animate({ nodes: { jump:   { position: { x: 360 } } } }, { duration: 4000, easing: 'linear' });
           handles.roll   = $flow.animate({ nodes: { roll:   { position: { x: 360 } } } }, { duration: 4000, easing: 'linear' });
           handles.freeze = $flow.animate({ nodes: { freeze: { position: { x: 360 } } } }, { duration: 4000, easing: 'linear' });
       };
       document.getElementById('demo-stopmode-start').addEventListener('click', startAll);
       document.getElementById('demo-stopmode-stop').addEventListener('click', () => {
           handles.jump?.stop({ mode: 'jump-end' });
           handles.roll?.stop({ mode: 'rollback' });
           handles.freeze?.stop({ mode: 'freeze' });
       });
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node">
                <span x-text="node.data.label" style="font-family: monospace; font-size: 11px;"></span>
            </div>
        </template>
    </div>
</div>
```
::enddemo

## Transactions

A transaction wraps several animations so you can roll them all back as a unit:

```js
const tx = $flow.transaction(async () => {
    $flow.animate({ nodes: { a: { position: { x: 360 } } } }, { duration: 2500 });
    await new Promise(r => setTimeout(r, 500));
    $flow.animate({ nodes: { b: { position: { x: 360 } } } }, { duration: 2500 });
    await new Promise(r => setTimeout(r, 500));
    $flow.animate({ nodes: { c: { position: { x: 360 } } } }, { duration: 2500 });
});

// Sometime later — revert everything the transaction animated
tx.rollback();
```

`tx.rollback()` stops every tracked animation with `'freeze'` mode, then re-applies the pre-transaction values for every property that was touched. The canvas ends up exactly where it was before the transaction started, even for animations that had already completed.

`tx.commit()` is the no-op counterpart — it marks the transaction as finalized and resolves `tx.finished`. Async `fn` returns commit automatically when it resolves; thrown errors auto-rollback.

Start the transaction, then click rollback mid-sequence — all three nodes freeze in place, then snap back to the origin:

::demo
```toolbar
<button id="demo-tx-run" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Run transaction</button>
<button id="demo-tx-rollback" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Rollback</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 40, y: 20  }, data: { label: 'A' } },
        { id: 'b', position: { x: 40, y: 80  }, data: { label: 'B' } },
        { id: 'c', position: { x: 40, y: 140 }, data: { label: 'C' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let tx = null;
       document.getElementById('demo-tx-run').addEventListener('click', () => {
           $flow.update({ nodes: {
               a: { position: { x: 40 } },
               b: { position: { x: 40 } },
               c: { position: { x: 40 } },
           }});
           tx = $flow.transaction(async () => {
               $flow.animate({ nodes: { a: { position: { x: 360 } } } }, { duration: 2500, easing: 'linear' });
               await new Promise(r => setTimeout(r, 500));
               $flow.animate({ nodes: { b: { position: { x: 360 } } } }, { duration: 2500, easing: 'linear' });
               await new Promise(r => setTimeout(r, 500));
               $flow.animate({ nodes: { c: { position: { x: 360 } } } }, { duration: 2500, easing: 'linear' });
           });
       });
       document.getElementById('demo-tx-rollback').addEventListener('click', () => tx?.rollback());
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

## Groups

Tag multiple animations with a shared name so you can stop, pause, or resume them together:

```js
const ambient = $flow.group('ambient');

ambient.animate({ nodes: { g1: { position: { x: 360 } } } }, { duration: 5000 });
ambient.animate({ nodes: { g2: { position: { x: 360 } } } }, { duration: 5000 });
ambient.animate({ nodes: { g3: { position: { x: 360 } } } }, { duration: 5000 });

// Later — stop every handle tagged 'ambient'
ambient.cancelAll({ mode: 'rollback' });
ambient.pauseAll();
ambient.resumeAll();
```

`FlowGroup` auto-tags every animation it creates, so callers never touch the `tag` option directly. You can still tag animations manually via `AnimateOptions.tag` / `.tags` and use `$flow.cancelAll({ tag: 'ambient' })` for the same effect.

::demo
```toolbar
<button id="demo-group-start" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Start group</button>
<button id="demo-group-rollback" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">cancelAll({ mode: 'rollback' })</button>
<button id="demo-group-jump" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">cancelAll() jump-end</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'g1', position: { x: 40, y: 20  }, data: { label: 'g1 (ambient)' } },
        { id: 'g2', position: { x: 40, y: 80  }, data: { label: 'g2 (ambient)' } },
        { id: 'g3', position: { x: 40, y: 140 }, data: { label: 'g3 (ambient)' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let group = null;
       document.getElementById('demo-group-start').addEventListener('click', () => {
           $flow.update({ nodes: {
               g1: { position: { x: 40 } },
               g2: { position: { x: 40 } },
               g3: { position: { x: 40 } },
           }});
           group = $flow.group('ambient');
           group.animate({ nodes: { g1: { position: { x: 360 } } } }, { duration: 5000, easing: 'linear' });
           group.animate({ nodes: { g2: { position: { x: 360 } } } }, { duration: 5000, easing: 'linear' });
           group.animate({ nodes: { g3: { position: { x: 360 } } } }, { duration: 5000, easing: 'linear' });
       });
       document.getElementById('demo-group-rollback').addEventListener('click', () => group?.cancelAll({ mode: 'rollback' }));
       document.getElementById('demo-group-jump').addEventListener('click', () => group?.cancelAll());
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

## State-aware cancellation

Sometimes an animation should stop when some state flips — e.g. "run this pulse while the node is hovered." Pass a `while:` predicate that the engine evaluates once per frame:

```js
let hovering = true;

$flow.animate(
    { nodes: { n: { position: { x: 360 } } } },
    {
        duration: 6000,
        easing: 'linear',
        while: () => hovering,
        whileStopMode: 'freeze',   // stay where the animation was when predicate flipped
    },
);

// Later — flip the predicate
hovering = false;
// animation auto-terminates on the next frame with 'freeze' stop mode
```

`while:` is **terminal** — when the predicate returns false, the animation stops (with `whileStopMode`) and the handle ends. It's not a pause/resume gate; toggling the predicate back to `true` won't resume the animation. Think of it as a kill switch that fires when a condition changes.

::demo
```toolbar
<button id="demo-while-run" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Run while active</button>
<button id="demo-while-toggle" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Toggle active</button>
<span id="demo-while-state" class="font-mono text-[10px] text-text-faint">active = true</span>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'w', position: { x: 40, y: 80 }, data: { label: 'Animates while active' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 200px;"
   x-init="
       let active = true;
       const label = document.getElementById('demo-while-state');
       document.getElementById('demo-while-run').addEventListener('click', () => {
           active = true;
           label.textContent = 'active = true';
           $flow.update({ nodes: { w: { position: { x: 40 } } } });
           $flow.animate(
               { nodes: { w: { position: { x: 360 } } } },
               { duration: 6000, easing: 'linear', while: () => active, whileStopMode: 'freeze' },
           );
       });
       document.getElementById('demo-while-toggle').addEventListener('click', () => {
           active = !active;
           label.textContent = 'active = ' + active + (active ? '' : ' → animation terminates next frame');
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

## Direction state machine

A `FlowAnimationHandle` carries a `direction` (`'forward'` or `'backward'`) that controls which way it plays. The control methods adjust both `direction` and playback state:

| Call | Effect |
|---|---|
| `handle.play()` | Revive (if finished) and play from the current value in the current `direction` |
| `handle.playForward()` | Set `direction = 'forward'` and play |
| `handle.playBackward()` | Set `direction = 'backward'` and play |
| `handle.reverse()` | Flip `direction` and keep playing |
| `handle.restart({ direction })` | Jump to the appropriate end and play in the given direction (defaults to the current one) |

```js
const handle = $flow.animate({ nodes: { n: { position: { x: 360 } } } }, { duration: 1500 });
await handle.finished;

handle.playBackward();        // replay in reverse without resetting
handle.playForward();         // play forward again from current position
handle.restart({ direction: 'backward' });  // jump to the end and play backward
```

This is the difference between `reverse()` (which always flips the current direction) and `playBackward()` (which forces backward regardless of prior direction). `restart()` is useful for "rewind and go" UX — it snaps to the start of the chosen direction before playing.

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

Hover over each node — it animates on mouse enter and reverses on mouse leave. Shown as an imperative pattern; the `x-flow-animate` directive above is the declarative equivalent.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 20,  y: 60 }, data: { label: 'Hover me', baseY: 60 } },
        { id: 'b', position: { x: 220, y: 0  }, data: { label: 'Or me',   baseY: 0  } },
        { id: 'c', position: { x: 420, y: 60 }, data: { label: 'Or me',   baseY: 60 } },
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
                 @mouseenter="$flow.animate({ nodes: { [node.id]: { position: { y: node.data.baseY - 10 } } } }, { duration: 200, easing: 'easeOut' })"
                 @mouseleave="$flow.animate({ nodes: { [node.id]: { position: { y: node.data.baseY      } } } }, { duration: 200, easing: 'easeOut' })">
                <div x-flow-handle:target></div>
                <span x-text="node.data.label"></span>
                <div x-flow-handle:source></div>
            </div>
        </template>
    </div>
</div>
```
::enddemo
