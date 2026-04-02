---
title: Particles
description: Fire animated dots along edge paths.
order: 4
---

# Particles

Send visual particles along edge paths. Particles are SVG circles that follow an edge's `<path>` using `getPointAtLength`, creating a flowing dot effect.

Click "Fire" to send particles along the edges:

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

## Sending a Particle

```js
const handle = $flow.sendParticle('edge-1', {
    color: '#10b981',      // default: --flow-edge-dot-fill
    size: 6,               // default: --flow-edge-dot-size (4)
    duration: '1.5s',      // default: --flow-edge-dot-duration (2s)
    class: 'my-particle',
    onComplete: () => console.log('arrived'),
});
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `--flow-edge-dot-fill` | Fill color of the particle circle |
| `size` | `number` | `--flow-edge-dot-size` (4) | Radius of the particle circle in pixels |
| `duration` | `string` | `--flow-edge-dot-duration` (2s) | Animation duration (CSS time value) |
| `class` | `string` | — | Additional CSS class(es) to apply to the particle element |
| `onComplete` | `() => void` | — | Callback fired when the particle reaches the end of the path |

## ParticleHandle

`sendParticle()` returns a `ParticleHandle` for tracking and controlling the particle:

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

## Property Cascade

Particle properties resolve in priority order:

1. **Call options** -- explicit values passed to `sendParticle()`
2. **Edge-level properties** -- `particleSize`, `particleColor`, `animationDuration` on the edge object
3. **CSS variables** -- `--flow-edge-dot-size`, `--flow-edge-dot-fill`, `--flow-edge-dot-duration`

## CSS Styling

Particle circles have the class `.flow-edge-particle`. Additional classes can be added via the `class` option:

```css
/* Style all particles */
.flow-edge-particle {
    filter: drop-shadow(0 0 3px currentColor);
}

/* Style specific particles */
.my-particle {
    filter: drop-shadow(0 0 6px #10b981);
}
```

## Viewport Culling

Particles are not created on edges hidden by viewport culling. This prevents wasted work for off-screen edges.

## Combining with Camera Follow

Particles can be tracked by the camera using `$flow.follow()`:

```js
const particle = $flow.sendParticle('edge-1', { duration: '3s' });
$flow.follow(particle, { zoom: 2 });
// Camera follows the particle along the edge, then stops automatically
```

See [Camera Follow](./camera-follow.md) for details.

## Continuous Stream

Fire particles on a loop for ambient flowing effects:

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
    controls: false,
    pannable: false,
    zoomable: false,
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
