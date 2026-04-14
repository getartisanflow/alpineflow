---
title: Physics Motion
description: Spring, decay, inertia, and keyframes — duration-free motion for animate().
order: 2
---

# Physics Motion

The default `animate()` call interpolates from A to B over a fixed `duration` with an `easing` curve. For UI that needs to *feel* natural — pointer flicks, bouncing, rubber-band edges, settling springs — fixed-duration interpolation looks synthetic. Physics motion types model the motion instead of the path, so the result feels like real-world movement.

Pass a `motion:` config to `animate()` **instead of** `duration` + `easing`:

```js
// Duration-based — fixed timing, linear energy
$flow.animate({ nodes: { n: { position: { x: 400 } } } }, {
    duration: 600,
    easing: 'easeInOut',
});

// Physics-based — timing emerges from the motion model
$flow.animate({ nodes: { n: { position: { x: 400 } } } }, {
    motion: 'spring.wobbly',
});
```

::demo
```toolbar
<button id="demo-physics-hero-spring"  class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">spring.wobbly</button>
<button id="demo-physics-hero-decay"   class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">decay fling</button>
<button id="demo-physics-hero-inertia" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">inertia (bounds)</button>
<button id="demo-physics-hero-keyframes" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">keyframes</button>
<button id="demo-physics-hero-reset"   class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'h', position: { x: 40, y: 100 }, data: { label: 'Motion' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 240px;"
   x-init="
       const reset = () => $flow.update({ nodes: { h: { position: { x: 40, y: 100 } } } });
       document.getElementById('demo-physics-hero-spring').addEventListener('click', () => {
           reset();
           $flow.animate({ nodes: { h: { position: { x: 360, y: 100 } } } }, { motion: 'spring.wobbly' });
       });
       document.getElementById('demo-physics-hero-decay').addEventListener('click', () => {
           $flow.animate(
               { nodes: { h: { position: { x: 0, y: 0 } } } },
               { motion: { type: 'decay', velocity: { x: 1200, y: 0 } } },
           );
       });
       document.getElementById('demo-physics-hero-inertia').addEventListener('click', () => {
           $flow.animate(
               { nodes: { h: { position: { x: 0, y: 0 } } } },
               { motion: {
                   type: 'inertia',
                   velocity: { x: 1500, y: 600 },
                   bounds: { x: [0, 400], y: [0, 180] },
                   bounceStiffness: 300, bounceDamping: 30, timeConstant: 500,
               } },
           );
       });
       document.getElementById('demo-physics-hero-keyframes').addEventListener('click', () => {
           reset();
           $flow.animate({ nodes: { h: { position: { x: 40, y: 100 } } } }, {
               motion: { type: 'keyframes', values: [
                   { x: 40, y: 100 }, { x: 200, y: 20 }, { x: 360, y: 100 },
                   { x: 200, y: 180 }, { x: 40, y: 100 },
               ], duration: 2800 },
           });
       });
       document.getElementById('demo-physics-hero-reset').addEventListener('click', reset);
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

Four motion types ship built-in:

| Type | When to use |
|---|---|
| `spring` | Natural settle behavior — buttons, cards, modal transitions, "snap into place" motion |
| `decay` | Deceleration from an initial impulse — pointer flicks that coast to a stop, throwable cards |
| `inertia` | Decay + bounds with bouncing and snapTo — scrollers, swipeable lists, draggable panels with limits |
| `keyframes` | Tour a node through an explicit sequence of waypoints over a fixed duration |

All four respect `maxDuration` (default 5000ms) as a safety cap — if the motion hasn't settled by then, the animation force-completes at its latest interpolated value.

## Spring

A critically-damped harmonic oscillator. The node is attached to the target via a virtual spring; it accelerates, overshoots slightly (if underdamped), and settles.

Five string presets cover the common cases:

| Preset | Stiffness | Damping | Feel |
|---|---|---|---|
| `'spring.gentle'` | 120 | 14 | Calm, minor overshoot |
| `'spring.wobbly'` | 180 | 12 | Springy, clearly visible overshoot *(default when stiffness/damping are omitted)* |
| `'spring.stiff'` | 300 | 30 | Fast, almost no overshoot — "snap into place" |
| `'spring.slow'` | 60 | 15 | Drawn-out settle |
| `'spring.molasses'` | 40 | 30 | Slow, overdamped — no overshoot |

```js
$flow.animate({ nodes: { n: { position: { x: 400 } } } }, { motion: 'spring.wobbly' });
```

Or pass a `SpringMotion` object for full control:

```js
$flow.animate({ nodes: { n: { position: { x: 400 } } } }, {
    motion: {
        type: 'spring',
        stiffness: 200,     // spring constant (higher = faster)
        damping: 15,        // energy loss per frame (higher = less bounce)
        mass: 1,            // heavier mass = slower acceleration
        restVelocity: 0.01, // threshold below which motion is considered "settled"
        restDisplacement: 0.01,
    },
});
```

::demo
```toolbar
<button id="demo-spring-run" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Animate all 5 presets</button>
<button id="demo-spring-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'gentle',   position: { x: 40, y: 10  }, data: { label: 'spring.gentle' } },
        { id: 'wobbly',   position: { x: 40, y: 60  }, data: { label: 'spring.wobbly' } },
        { id: 'stiff',    position: { x: 40, y: 110 }, data: { label: 'spring.stiff' } },
        { id: 'slow',     position: { x: 40, y: 160 }, data: { label: 'spring.slow' } },
        { id: 'molasses', position: { x: 40, y: 210 }, data: { label: 'spring.molasses' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 290px;"
   x-init="
       let atRight = false;
       document.getElementById('demo-spring-run').addEventListener('click', () => {
           const x = atRight ? 40 : 320;
           atRight = !atRight;
           for (const preset of ['gentle', 'wobbly', 'stiff', 'slow', 'molasses']) {
               $flow.animate({ nodes: { [preset]: { position: { x } } } }, { motion: 'spring.' + preset });
           }
       });
       document.getElementById('demo-spring-reset').addEventListener('click', () => {
           atRight = false;
           for (const preset of ['gentle', 'wobbly', 'stiff', 'slow', 'molasses']) {
               $flow.update({ nodes: { [preset]: { position: { x: 40 } } } });
           }
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

## Decay

Exponential decay from an initial velocity — "throw this node and let it coast to a stop." The `target` in `animate(target, …)` is ignored for decay; the motion is driven entirely by the initial velocity and time constant.

`velocity` is the only required field. Pass a number to decay on the first axis, or `{ x, y }` for separate per-axis velocities:

```js
// Fling right at 1200 units/sec
$flow.animate({ nodes: { puck: { position: { x: 0, y: 0 } } } }, {
    motion: { type: 'decay', velocity: { x: 1200, y: 0 } },
});
```

Two presets:

| Preset | Feel |
|---|---|
| `'decay.smooth'` | Gentle deceleration, longer glide |
| `'decay.snappy'` | Sharper stop, shorter glide |

Full `DecayMotion` shape:

```ts
interface DecayMotion {
    type: 'decay';
    velocity: number | { x: number; y: number };
    power?: number;           // initial velocity multiplier (default 0.8). Higher = longer glide.
    timeConstant?: number;    // exponential decay time in ms (default 350). Higher = slower stop.
}
```

::demo
```toolbar
<button id="demo-decay-left"  class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fling left</button>
<button id="demo-decay-right" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fling right</button>
<button id="demo-decay-diag"  class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fling diagonal</button>
<button id="demo-decay-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'puck', position: { x: 200, y: 100 }, data: { label: 'Fling me' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 240px;"
   x-init="
       const fling = (velocity) => $flow.animate(
           { nodes: { puck: { position: { x: 0, y: 0 } } } },
           { motion: { type: 'decay', velocity } },
       );
       document.getElementById('demo-decay-left').addEventListener('click',  () => fling({ x: -1200, y: 0 }));
       document.getElementById('demo-decay-right').addEventListener('click', () => fling({ x:  1200, y: 0 }));
       document.getElementById('demo-decay-diag').addEventListener('click',  () => fling({ x:  900,  y: 600 }));
       document.getElementById('demo-decay-reset').addEventListener('click', () => $flow.update({ nodes: { puck: { position: { x: 200, y: 100 } } } }));
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

## Inertia

Decay plus **bounds** and **snap targets**. When the node hits a bound, it bounces back; when the motion settles, it can optionally snap to the nearest configured value.

```js
$flow.animate({ nodes: { ball: { position: { x: 0, y: 0 } } } }, {
    motion: {
        type: 'inertia',
        velocity: { x: 1500, y: 200 },
        bounds: { x: [0, 400], y: [0, 180] },   // bouncing walls
        bounceStiffness: 300,                    // bounciness (normalized around 500)
        bounceDamping: 30,                       // velocity loss per bounce, %
        snapTo: [{ x: 0 }, { x: 200 }, { x: 400 }],  // settle points
    },
});
```

Two presets:

| Preset | Feel |
|---|---|
| `'inertia.momentum'` | Glides and decelerates — good for swipe-to-pan |
| `'inertia.rails'` | Stiff bounce off bounds, moderate damping |

Full `InertiaMotion` shape:

```ts
interface InertiaMotion {
    type: 'inertia';
    velocity: number | { x: number; y: number };
    bounds?: Record<string, [number, number]>;   // [min, max] per property
    bounceStiffness?: number;                     // default 200
    bounceDamping?: number;                       // default 40 (percent velocity loss)
    snapTo?: Array<Record<string, number>>;       // settle candidates
    power?: number;                               // default 0.8
    timeConstant?: number;                        // default 350
}
```

`bounds` keys can be anything — not restricted to `'x'`/`'y'`. You could animate `{ scrollTop: [0, 800] }` on a scroll container, or `{ volume: [0, 100] }` on a slider.

::demo
```toolbar
<button id="demo-inertia-right" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Bounce right</button>
<button id="demo-inertia-diag"  class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Bounce diagonal</button>
<button id="demo-inertia-reset" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'ball', position: { x: 200, y: 100 }, data: { label: 'Bounce' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 240px;"
   x-init="
       const fling = (velocity) => $flow.animate(
           { nodes: { ball: { position: { x: 0, y: 0 } } } },
           { motion: {
               type: 'inertia',
               velocity,
               bounds: { x: [0, 400], y: [0, 180] },
               bounceStiffness: 300,
               bounceDamping: 30,
               timeConstant: 500,
           } },
       );
       document.getElementById('demo-inertia-right').addEventListener('click', () => fling({ x: 1500, y: 0 }));
       document.getElementById('demo-inertia-diag').addEventListener('click',  () => fling({ x: 1200, y: 800 }));
       document.getElementById('demo-inertia-reset').addEventListener('click', () => $flow.update({ nodes: { ball: { position: { x: 200, y: 100 } } } }));
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

## Keyframes

Tour a node through an explicit list of waypoints over a fixed duration. Unlike spring/decay/inertia, keyframes has a defined `duration` — the timing is not emergent.

```js
$flow.animate({ nodes: { n: { position: { x: 40, y: 100 } } } }, {
    motion: {
        type: 'keyframes',
        values: [
            { x: 40,  y: 100 },   // start
            { x: 200, y: 20  },   // top middle
            { x: 360, y: 100 },   // right
            { x: 200, y: 180 },   // bottom middle
            { x: 40,  y: 100 },   // back to start
        ],
        duration: 3000,   // total tour time
    },
});
```

Each waypoint is a `Record<string, number>` — keys match the property names you're animating. Waypoints are evenly spaced across `duration` by default; pass `offsets: [0, 0.2, 0.5, 0.8, 1]` for non-uniform timing.

Full `KeyframesMotion` shape:

```ts
interface KeyframesMotion {
    type: 'keyframes';
    values: Array<Record<string, number>>;
    offsets?: number[];             // 0..1, one per value; default evenly spaced
    between?: string | MotionConfig; // easing between waypoints (e.g. 'spring.gentle')
    duration?: number;              // default 5000ms
    loop?: boolean | number;        // replay on finish
}
```

Pass `between: 'spring.gentle'` to use spring physics to transition between each waypoint pair (instead of default linear interpolation) — useful for organic motion across the tour.

::demo
```toolbar
<button id="demo-kf-tour"   class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">5-waypoint tour</button>
<button id="demo-kf-eight"  class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Figure-8</button>
<button id="demo-kf-reset"  class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Reset</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'traveler', position: { x: 40, y: 100 }, data: { label: 'Tour' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 240px;"
   x-init="
       document.getElementById('demo-kf-tour').addEventListener('click', () => {
           $flow.animate({ nodes: { traveler: { position: { x: 40, y: 100 } } } }, {
               motion: { type: 'keyframes', values: [
                   { x: 40, y: 100 }, { x: 200, y: 20 }, { x: 360, y: 100 },
                   { x: 200, y: 180 }, { x: 40, y: 100 },
               ], duration: 3000 },
           });
       });
       document.getElementById('demo-kf-eight').addEventListener('click', () => {
           $flow.animate({ nodes: { traveler: { position: { x: 40, y: 100 } } } }, {
               motion: { type: 'keyframes', values: [
                   { x: 40, y: 100 }, { x: 120, y: 40 }, { x: 200, y: 100 },
                   { x: 280, y: 160 }, { x: 360, y: 100 }, { x: 280, y: 40 },
                   { x: 200, y: 100 }, { x: 120, y: 160 }, { x: 40, y: 100 },
               ], duration: 4000 },
           });
       });
       document.getElementById('demo-kf-reset').addEventListener('click', () => {
           $flow.update({ nodes: { traveler: { position: { x: 40, y: 100 } } } });
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

## When motion vs duration+easing

Physics motion is natural-feeling but non-deterministic in timing — a spring with the same stiffness/damping will take a different amount of time to settle depending on how far it has to travel. Duration-based interpolation is the opposite: predictable timing, synthetic feel.

Rule of thumb:

- **Use physics (`motion`)** when the *feel* matters: mouse-driven flicks, cards snapping back after a drag, natural settle after user input, emergent playful effects.
- **Use duration + easing** when *timing* matters: synchronized sequences (multiple nodes arriving at the same moment), choreographed reveals, deterministic demos.

Both go through the same animator — you can mix them across animations on different nodes, or use `keyframes` to get both (a fixed-duration tour with optional per-segment springs via `between`).

## maxDuration safety cap

Physics motions terminate when velocity drops below `restVelocity` AND displacement below `restDisplacement`. A pathological config (zero damping on a spring, for example) could theoretically never settle. `maxDuration` is a safety cap — when reached, the animation force-completes at its latest interpolated value.

```js
$flow.animate(..., {
    motion: 'spring.wobbly',
    maxDuration: 2000,   // force-settle after 2s even if still oscillating
});
```

Default is 5000ms. Lower it for time-sensitive UI; raise it for ambient background motion.

## MotionConfig type reference

```ts
type MotionConfig = SpringMotion | DecayMotion | InertiaMotion | KeyframesMotion;

interface SpringMotion {
    type: 'spring';
    stiffness?: number;        // default 180
    damping?: number;          // default 12
    mass?: number;             // default 1
    restVelocity?: number;     // default 0.01
    restDisplacement?: number; // default 0.01
}

interface DecayMotion {
    type: 'decay';
    velocity: number | { x: number; y: number };
    power?: number;            // default 0.8
    timeConstant?: number;     // default 350 (ms)
}

interface InertiaMotion {
    type: 'inertia';
    velocity: number | { x: number; y: number };
    bounds?: Record<string, [number, number]>;
    bounceStiffness?: number;  // default 200
    bounceDamping?: number;    // default 40 (percent)
    snapTo?: Array<Record<string, number>>;
    power?: number;
    timeConstant?: number;
}

interface KeyframesMotion {
    type: 'keyframes';
    values: Array<Record<string, number>>;
    offsets?: number[];
    between?: string | MotionConfig;
    duration?: number;         // default 5000 (ms)
    loop?: boolean | number;
}
```

Preset strings (passed as `motion: 'category.preset'`):

- **Spring:** `'spring.gentle'`, `'spring.wobbly'`, `'spring.stiff'`, `'spring.slow'`, `'spring.molasses'`
- **Decay:** `'decay.smooth'`, `'decay.snappy'`
- **Inertia:** `'inertia.momentum'`, `'inertia.rails'`

## See also

- [Animate & Update](./animate.md) — the general `animate()` / `update()` API and `AnimateOptions`
- [Path Motion](./paths.md) — move nodes along curves instead of interpolating coordinates directly
- [Timeline](./timeline.md) — sequence multiple animations; physics motion works inside timeline steps too
