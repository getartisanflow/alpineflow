---
title: Particles
description: Fire animated visuals along edge paths, arbitrary SVG paths, or between nodes.
order: 4
---

# Particles

Particles are short-lived SVG visuals that travel along a path. They power activity indicators, data-flow animations, success/error pulses, and any "something just moved from A to B" effect. A canvas-wide tick loop drives all live particles in a single `requestAnimationFrame` registration, so firing dozens concurrently is cheap.

Click "Fire" to send two sequential particles:

::demo
```toolbar
<button id="demo-particle-fire" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fire</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Source' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 500, y: 60 }, data: { label: 'Output' } },
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
})" class="flow-container" style="height: 250px;"
   x-init="
       const fireBtn = document.getElementById('demo-particle-fire');
       if (fireBtn) fireBtn.addEventListener('click', () => {
           $flow.sendParticle('e1', { color: '#DAA532', size: 5, duration: '1s' });
           setTimeout(() => {
               $flow.sendParticle('e2', { color: '#8B5CF6', size: 5, duration: '1s' });
           }, 500);
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

## Firing methods

`$flow` exposes five particle-emission methods. Pick based on where the particle should travel:

| Method | Path | Returns |
|---|---|---|
| `sendParticle(edgeId, options)` | Existing edge's rendered path | `ParticleHandle` |
| `sendParticleAlongPath(svgPath, options)` | Arbitrary SVG path string | `ParticleHandle` |
| `sendParticleBetween(sourceId, targetId, options)` | Straight line between two node centers | `ParticleHandle` |
| `sendParticleBurst(edgeId, options)` | Multiple particles on one edge, staggered | `ParticleBurstHandle` |
| `sendConverging(sourceEdgeIds, options)` | Particles on many edges that arrive at a target simultaneously | `ConvergingHandle` |

### sendParticle

The most common case — fire a particle along an existing edge.

```js
const handle = $flow.sendParticle('edge-1', {
    color: '#10b981',
    size: 6,
    duration: '1.5s',
    onComplete: () => console.log('arrived'),
});
```

If the edge doesn't exist, has no rendered path yet, or has an empty `d` attribute, `sendParticle` returns `undefined` and logs a `particle` debug entry. This is a silent no-op — no throws — so it's safe to fire opportunistically (e.g., from a `$watch` that may run before layout has measured).

### sendParticleAlongPath

Fire along any SVG path string, even on a canvas with no edges. The path is parsed via a hidden `<path>` element for `getPointAtLength` calculations and removed when the particle completes.

```js
// Arch from bottom-left to bottom-right, peaking in the middle
$flow.sendParticleAlongPath('M 60 180 Q 220 40 380 180', {
    color: '#F59E0B',
    duration: 1600,
});
```

::demo
```toolbar
<button id="demo-alongpath" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fire along path</button>
```
```html
<div x-data="flowCanvas({
    nodes: [], edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="
       const btn = document.getElementById('demo-alongpath');
       if (btn) btn.addEventListener('click', () => {
           $flow.sendParticleAlongPath('M 60 180 Q 220 40 380 180', {
               color: '#F59E0B', size: 5, duration: 1600,
           });
       });
   ">
    <div x-flow-viewport></div>
</div>
```
::enddemo

### sendParticleBetween

Fire a particle in a straight line between two node centers. Useful for "A messaged B" effects without needing a persistent edge.

```js
$flow.sendParticleBetween('node-a', 'node-b', {
    color: '#8B5CF6',
    duration: 800,
});
```

If either node is missing it returns `undefined`. The straight-line path is computed from each node's `position + dimensions/2`, so it respects measured node sizes.

### sendParticleBurst

Fire N particles on a single edge with staggered timing. Useful for "processing" indicators or emphasizing throughput.

```js
const burst = $flow.sendParticleBurst('edge-1', {
    count: 5,
    stagger: 120,          // ms between each particle start
    color: '#10b981',
    size: 5,
    duration: 1200,
});

await burst.finished;       // resolves when all 5 arrive
```

Pass `variant(i, count)` to customize each particle individually:

```js
$flow.sendParticleBurst('edge-1', {
    count: 4,
    stagger: 150,
    duration: 1500,
    variant: (i, total) => ({
        // Fade-in color over the burst
        color: i === 0 ? '#ef4444' : i === total - 1 ? '#10b981' : '#f59e0b',
        size: 4 + i,
    }),
});
```

`ParticleBurstHandle` exposes `handles` (grows as particles fire), `finished` (resolves after all arrive), and `stopAll()` to cancel pending timers plus stop live particles.

::demo
```toolbar
<button id="demo-burst-fire" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fire burst</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'bsrc', position: { x: 40,  y: 60 }, data: { label: 'Source' } },
        { id: 'bdst', position: { x: 320, y: 60 }, data: { label: 'Target' } },
    ],
    edges: [ { id: 'e1', source: 'bsrc', target: 'bdst', type: 'bezier' } ],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 200px;"
   x-init="
       document.getElementById('demo-burst-fire').addEventListener('click', () => {
           $flow.sendParticleBurst('e1', {
               count: 6,
               stagger: 120,
               renderer: 'orb',
               duration: 1000,
               variant: (i) => ({
                   color: i % 2 === 0 ? '#8B5CF6' : '#06B6D4',
                   size: 4 + (i % 3),
               }),
           });
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

### sendConverging

Fire particles from several edges that all reach the same target node at the same time. By default (`synchronize: 'arrival'`) shorter paths get proportionally shorter durations and delayed starts so every particle lands on frame together.

```js
$flow.sendConverging(['e-src-1', 'e-src-2', 'e-src-3'], {
    targetNodeId: 'sink',
    duration: 1500,          // the longest path takes this long
    color: '#8B5CF6',
    size: 5,
    onAllArrived: () => {
        $flow.animate({ nodes: { sink: { data: { status: 'ready' } } } });
    },
});
```

Pass `synchronize: 'departure'` to fire every particle at once (they'll arrive at different times proportional to their path lengths).

::demo
```toolbar
<button id="demo-conv-fire" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fire converging</button>
<span id="demo-conv-log" class="font-mono text-[10px] text-text-faint">idle</span>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'ca', position: { x: 40,  y: 20  }, data: { label: 'Src A' } },
        { id: 'cb', position: { x: 40,  y: 80  }, data: { label: 'Src B' } },
        { id: 'cc', position: { x: 40,  y: 140 }, data: { label: 'Src C' } },
        { id: 'ct', position: { x: 340, y: 80  }, data: { label: 'Sink' } },
    ],
    edges: [
        { id: 'ea', source: 'ca', target: 'ct', type: 'bezier' },
        { id: 'eb', source: 'cb', target: 'ct', type: 'bezier' },
        { id: 'ec', source: 'cc', target: 'ct', type: 'bezier' },
    ],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 240px;"
   x-init="
       const log = document.getElementById('demo-conv-log');
       document.getElementById('demo-conv-fire').addEventListener('click', () => {
           log.textContent = 'converging…';
           $flow.sendConverging(['ea', 'eb', 'ec'], {
               targetNodeId: 'ct',
               synchronize: 'arrival',
               renderer: 'pulse',
               color: '#06B6D4',
               size: 4,
               duration: 1400,
               onAllArrived: () => { log.textContent = 'all arrived'; },
           });
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

## Built-in renderers

A renderer decides what the particle actually draws. Pick one via `renderer: 'name'`:

| Name | Shape | Best for |
|---|---|---|
| `circle` *(default)* | Filled circle | Default dot, simple data-flow effects |
| `orb` | Glowing double-circle with a pulsing scale | Attention-grabbing highlights, live status |
| `beam` | Traveling segment of the path with optional gradient | Tracers, laser-like effects, "shots fired" |
| `pulse` | Expanding ring that fades out | Ripple/activity on arrival |
| `image` | Custom SVG symbol (`#id`) or external image URL | Logos, icons, branded particles |

```js
$flow.sendParticle('e1', { renderer: 'orb', color: '#8B5CF6', size: 6 });
$flow.sendParticle('e1', { renderer: 'beam', length: 40, width: 3 });
$flow.sendParticle('e1', { renderer: 'pulse', color: '#10b981', size: 8 });
$flow.sendParticle('e1', { renderer: 'image', href: '#star-symbol', size: 20 });
```

Fire each of the built-ins plus a custom rotating "star" renderer along the same bezier edge to compare:

::demo
```toolbar
<button id="demo-rnds-circle"   class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">circle</button>
<button id="demo-rnds-orb"      class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">orb</button>
<button id="demo-rnds-beam"     class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">beam</button>
<button id="demo-rnds-gbeam"    class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">gradient beam</button>
<button id="demo-rnds-pulse"    class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">pulse</button>
<button id="demo-rnds-star"     class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">star (custom)</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'src', position: { x: 40,  y: 60 }, data: { label: 'Source' } },
        { id: 'dst', position: { x: 400, y: 60 }, data: { label: 'Target' } },
    ],
    edges: [ { id: 'e1', source: 'src', target: 'dst', type: 'bezier' } ],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       // Register the custom star renderer once (per page), then wire buttons
       queueMicrotask(() => {
           if (!$flow.registerParticleRenderer) return;
           const NS = 'http://www.w3.org/2000/svg';
           $flow.registerParticleRenderer('star', {
               create: (svgLayer, options) => {
                   const el = document.createElementNS(NS, 'path');
                   el.setAttribute('d', 'M 0,-10 L 3,-3 L 10,-3 L 5,2 L 7,10 L 0,5 L -7,10 L -5,2 L -10,-3 L -3,-3 Z');
                   el.setAttribute('fill', options.color ?? 'gold');
                   svgLayer.appendChild(el);
                   return el;
               },
               update: (el, { x, y, progress }) => {
                   el.setAttribute('transform', 'translate(' + x + ',' + y + ') rotate(' + (progress * 360) + ')');
               },
               destroy: (el) => el.remove(),
           });
       });
       const fire = (name) => {
           if (name === 'beam') {
               $flow.sendParticle('e1', {
                   renderer: 'beam', length: 40, width: 3, color: '#8B5CF6', duration: 1200,
               });
           } else if (name === 'gbeam') {
               $flow.sendParticle('e1', {
                   renderer: 'beam', length: 60, width: 4, duration: 1200,
                   gradient: [
                       { offset: 0,    color: '#8B5CF6', opacity: 0 },
                       { offset: 0.5,  color: '#D946EF', opacity: 0.6 },
                       { offset: 0.85, color: '#F97316', opacity: 1 },
                       { offset: 1,    color: '#fff',    opacity: 1 },
                   ],
               });
           } else if (name === 'star') {
               $flow.sendParticle('e1', { renderer: 'star', color: 'gold', duration: 1500 });
           } else {
               $flow.sendParticle('e1', { renderer: name, color: '#8B5CF6', size: name === 'orb' ? 6 : 5, duration: 1200 });
           }
       };
       document.getElementById('demo-rnds-circle').addEventListener('click', () => fire('circle'));
       document.getElementById('demo-rnds-orb').addEventListener('click',    () => fire('orb'));
       document.getElementById('demo-rnds-beam').addEventListener('click',   () => fire('beam'));
       document.getElementById('demo-rnds-gbeam').addEventListener('click',  () => fire('gbeam'));
       document.getElementById('demo-rnds-pulse').addEventListener('click',  () => fire('pulse'));
       document.getElementById('demo-rnds-star').addEventListener('click',   () => fire('star'));
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

## Beam renderer

The beam is the one renderer that reads the backing SVG path and follows its curvature. Its two unique features are **gradients** and **follow-through**.

### Path-aware curvature

Unlike `circle` or `orb` (which only care about `x, y`), the beam renders as a segment of the actual path using `stroke-dasharray`. On curves, kinked edges, and bezier paths it bends naturally instead of jutting out at corners.

```js
$flow.sendParticle('bezier-edge', {
    renderer: 'beam',
    length: 40,     // SVG user units
    width: 3,       // stroke thickness
    color: '#8B5CF6',
});
```

### Multi-stop gradient

Pass `gradient` as an array of color stops. `offset: 0` is the **tail** (back of the beam); `offset: 1` is the **head** (the leading edge that arrives first). When `gradient` is set, `color` is ignored.

```js
// Bright-head tracer — classic photogenic pattern
$flow.sendParticleAlongPath('M 60 180 Q 220 40 380 180', {
    renderer: 'beam',
    length: 80,
    width: 5,
    duration: 1600,
    gradient: [
        { offset: 0,    color: '#8B5CF6', opacity: 0 },    // transparent tail
        { offset: 0.5,  color: '#D946EF', opacity: 0.6 },  // magenta rise
        { offset: 0.85, color: '#F97316', opacity: 1 },    // warm head
        { offset: 1,    color: '#fff',    opacity: 1 },    // bright tip
    ],
});
```

Each stop is `{ offset: 0..1, color: string, opacity?: number }`. Use a 2-stop gradient for a simple fading tail:

```js
// Simple fading tail
gradient: [
    { offset: 0, color: '#8B5CF6', opacity: 0 },
    { offset: 1, color: '#8B5CF6', opacity: 1 },
]
```

::demo
```toolbar
<button id="demo-beam-gradient" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Fire gradient beam</button>
```
```html
<div x-data="flowCanvas({
    nodes: [], edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 260px;"
   x-init="
       const btn = document.getElementById('demo-beam-gradient');
       if (btn) btn.addEventListener('click', () => {
           $flow.sendParticleAlongPath('M 60 180 Q 220 40 380 180', {
               renderer: 'beam',
               length: 80, width: 5,
               duration: 1600,
               gradient: [
                   { offset: 0,    color: '#8B5CF6', opacity: 0 },
                   { offset: 0.5,  color: '#D946EF', opacity: 0.6 },
                   { offset: 0.85, color: '#F97316', opacity: 1 },
                   { offset: 1,    color: '#fff',    opacity: 1 },
               ],
           });
       });
   ">
    <div x-flow-viewport></div>
</div>
```
::enddemo

### Follow-through

By default, the beam's tail continues past the target after the head arrives — the trail "catches up" and fades off. This looks more natural than the beam vanishing the instant the head hits its destination.

In this mode, `duration` is the **total beam lifetime** (emerge → fully exit). That means `onComplete` fires after the tail exits, not when the head arrives.

If you need `onComplete` to fire at head-arrival time (e.g., to trigger a downstream effect as the beam "hits"), opt out:

```js
$flow.sendParticle('e1', {
    renderer: 'beam',
    followThrough: false,       // duration = head-reaches-target time
    duration: 800,
    onComplete: () => {
        $flow.animate({ nodes: { target: { data: { hit: true } } } });
    },
});
```

### Beam-specific options

| Option | Default | Effect |
|---|---|---|
| `length` | `30` | Beam length in SVG user units (how long the traveling segment is) |
| `width` | `4` | Beam thickness (`stroke-width`) |
| `color` | `#8B5CF6` | Solid stroke color (**ignored** if `gradient` is set) |
| `gradient` | — | Array of `{ offset, color, opacity? }` stops painted tail→head |
| `followThrough` | `true` | If `false`, `duration` means "head reaches target" and the beam stops the instant the head arrives |

### When the path is missing

The beam falls back to a rigid oriented rectangle if no backing `pathEl` is available on the render state. In practice this only happens if you're writing a custom renderer and want beam-like behavior in a non-path context — all five built-in firing methods provide `pathEl`.

## ParticleHandle

Every `sendParticle*` method returns a `ParticleHandle`:

```ts
interface ParticleHandle {
    getCurrentPosition(): XYPosition | null;  // null after completion
    stop(): void;
    readonly finished: Promise<void>;
}
```

```js
const handle = $flow.sendParticle('edge-1', { duration: '3s' });

// Check position mid-flight
const pos = handle.getCurrentPosition(); // { x: 150, y: 80 }

// Wait for completion
await handle.finished;

// Or stop early
handle.stop();
```

`stopAll()` on `ParticleBurstHandle` / `ConvergingHandle` cancels pending timers AND stops all live particles.

## Options reference

All firing methods accept `ParticleOptions` (burst and converging extend it):

| Option | Type | Default | Renderer | Description |
|---|---|---|---|---|
| `renderer` | `string` | `'circle'` | — | Named renderer (`circle`, `orb`, `beam`, `pulse`, `image`, or a custom registered name) |
| `color` | `string` | `--flow-edge-dot-fill` | most | Particle color. Beam ignores this when `gradient` is set |
| `size` | `number` | `--flow-edge-dot-size` (4) | most | Radius (circle/orb/pulse) or width/height (image) in SVG user units |
| `duration` | `string \| number` | `--flow-edge-dot-duration` (2s) | all | CSS time string (`'2s'`, `'300ms'`) or numeric milliseconds |
| `speed` | `number` | — | all | SVG units per second. Overrides `duration` if both are set |
| `class` | `string` | — | all | CSS class(es) added to the particle element |
| `onComplete` | `() => void` | — | all | Fired when the particle reaches the path end (or is stopped). For `beam` with `followThrough: true` (default), fires after the tail exits |
| `length` | `number` | `30` | `beam` | Beam length in SVG user units |
| `width` | `number` | `4` | `beam` | Beam stroke thickness |
| `gradient` | `Array<{offset, color, opacity?}>` | — | `beam` | Multi-stop gradient painted tail→head |
| `followThrough` | `boolean` | `true` | `beam` | If `false`, duration means "head reaches target" |
| `href` | `string` | — | `image` | SVG symbol reference (`#my-symbol`) or external image URL |

`BurstOptions` adds `count`, `stagger`, and `variant(i, total)`. `ConvergingOptions` adds `targetNodeId`, `synchronize` (`'arrival'` or `'departure'`), and `onAllArrived`.

## Property cascade

Particle properties resolve in priority order:

1. **Call options** — explicit values passed to `sendParticle*()`
2. **Edge-level properties** — `particleSize`, `particleColor`, `animationDuration` on the edge object
3. **CSS variables** — `--flow-edge-dot-size`, `--flow-edge-dot-fill`, `--flow-edge-dot-duration`

This makes it easy to set a canvas-wide default via CSS, override per-edge when an edge has a particular personality, and force-override from code for one-off effects.

## Custom renderers

Register your own named renderer to use with `renderer: 'your-name'`. A renderer is three functions:

```ts
interface ParticleRenderer {
    create: (svgLayer: SVGElement, options: ParticleOptions) => SVGElement;
    update: (el: SVGElement, state: ParticleRenderState) => void;
    destroy: (el: SVGElement) => void;
}
```

Called once at emission (`create`), every frame while traveling (`update`), and once at completion (`destroy`). The `state` passed to `update` gives you everything you need to position the visual:

```ts
interface ParticleRenderState {
    x: number;                           // absolute position on the path
    y: number;
    progress: number;                    // 0..1
    velocity: { x: number; y: number };  // frame-over-frame delta (use for angle)
    pathLength: number;                  // total length of the backing path
    elapsed: number;                     // ms since start
    pathEl?: SVGPathElement;             // the backing path, if any
}
```

```js
import { registerParticleRenderer } from '@getartisanflow/alpineflow';

registerParticleRenderer('star', {
    create(svgLayer, options) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('d', 'M 0,-8 L 2,-2 8,-2 3,1 5,8 0,4 -5,8 -3,1 -8,-2 -2,-2 Z');
        el.setAttribute('fill', options.color ?? 'gold');
        svgLayer.appendChild(el);
        return el;
    },
    update(el, { x, y, elapsed }) {
        const rot = (elapsed * 0.1) % 360;
        el.setAttribute('transform', `translate(${x},${y}) rotate(${rot})`);
    },
    destroy(el) { el.remove(); },
});

// …then anywhere in your app
$flow.sendParticle('e1', { renderer: 'star', color: 'gold' });
```

The registry is global — register once at app boot, use anywhere. Returning `SVGElement` is required; the engine uses the element identity for cleanup.

## CSS styling

The `circle` renderer adds `.flow-edge-particle` by default. All renderers honor the `class` option:

```css
.flow-edge-particle {
    filter: drop-shadow(0 0 3px currentColor);
}

.my-particle {
    filter: drop-shadow(0 0 6px #10b981);
}
```

```js
$flow.sendParticle('e1', { class: 'my-particle' });
```

## Viewport culling

When `viewportCulling: true` is set on the canvas, particles are not emitted on edges currently hidden by culling. This prevents wasted work for off-screen edges. Particles already in flight continue rendering even if their edge scrolls out of view.

## Combining with camera follow

`$flow.follow()` accepts a `ParticleHandle` directly — the camera will track the particle, then stop when it completes.

```js
const particle = $flow.sendParticle('edge-1', { duration: '3s' });
$flow.follow(particle, { zoom: 2 });
```

See [Camera Follow](./camera-follow.md) for details.

## Continuous stream

Fire particles on a loop for ambient flowing effects. Use `setInterval` and vary color/duration for variety.

::demo
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Input' } },
        { id: 'b', position: { x: 250, y: 0 }, data: { label: 'Process' } },
        { id: 'c', position: { x: 500, y: 0 }, data: { label: 'Output' } },
    ],
    edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
    ],
    background: 'dots',
    fitViewOnInit: true,
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 250px;"
   x-init="$nextTick(() => {
       const colors = ['#DAA532', '#8B5CF6', '#14B8A6', '#C26C48'];
       const edges = ['e1', 'e2'];
       const fire = () => {
           const edge = edges[Math.floor(Math.random() * edges.length)];
           const color = colors[Math.floor(Math.random() * colors.length)];
           $flow.sendParticle(edge, { color, size: 4, duration: '1.5s' });
       };
       setInterval(fire, 600);
       fire();
   })">
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
