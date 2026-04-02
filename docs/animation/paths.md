---
title: Path Motion
description: Move nodes along curves, orbits, and SVG paths.
order: 3
---

# Path Motion

Move nodes along arbitrary curves instead of straight-line interpolation. Path functions map a progress value (0-1) to `{ x, y }` coordinates, giving you orbits, waves, SVG paths, and more.

::demo
```toolbar
<button id="demo-path-orbit" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Orbit</button>
<button id="demo-path-wave" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Wave</button>
<button id="demo-path-stop" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Stop</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'center', position: { x: 180, y: 70 }, data: { label: 'Center' }, draggable: false },
        { id: 'mover', position: { x: 330, y: 70 }, data: { label: 'Mover' } },
    ],
    edges: [
        { id: 'e1', source: 'center', target: 'mover' },
    ],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 240px;"
   x-init="
       let handle = null;
       document.getElementById('demo-path-orbit').addEventListener('click', () => {
           if (handle) handle.stop();
           $flow.update({ nodes: { mover: { position: { x: 330, y: 70 } } } });
           handle = $flow.animate({
               nodes: { mover: { followPath: orbit({ cx: 200, cy: 80, radius: 80 }) } },
           }, { duration: 3000, loop: true, easing: 'linear' });
       });
       document.getElementById('demo-path-wave').addEventListener('click', () => {
           if (handle) handle.stop();
           $flow.update({ nodes: { mover: { position: { x: 10, y: 70 } } } });
           handle = $flow.animate({
               nodes: { mover: { followPath: wave({ startX: 10, startY: 80, endX: 380, endY: 80, amplitude: 50, frequency: 2 }) } },
           }, { duration: 3000, loop: 'reverse', easing: 'linear' });
       });
       document.getElementById('demo-path-stop').addEventListener('click', () => {
           if (handle) { handle.stop(); handle = null; }
           $flow.update({ nodes: { mover: { position: { x: 330, y: 70 } } } });
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

## Using with animate()

Pass a `followPath` to any node target. It overrides `position` — the node follows the curve instead of moving in a straight line:

```js
// Orbit around a point
$flow.animate({
    nodes: {
        'satellite': {
            followPath: orbit({ cx: 200, cy: 200, radius: 100 }),
        },
    },
}, { duration: 3000, loop: true, easing: 'linear' });

// Wave motion with ping-pong
$flow.animate({
    nodes: {
        'data': {
            followPath: wave({
                startX: 0, startY: 100,
                endX: 400, endY: 100,
                amplitude: 50,
                frequency: 2,
            }),
        },
    },
}, { duration: 2000, loop: 'reverse' });
```

`followPath` accepts a `PathFunction` (a `(t: number) => { x, y }` function) or an SVG path `d` string.

## Using with timeline

Path functions also work in timeline steps:

```js
$flow.timeline()
    .step({
        nodes: ['satellite'],
        followPath: orbit({ cx: 200, cy: 200, radius: 100 }),
        duration: 3000,
    })
    .step({
        nodes: ['satellite'],
        position: { x: 0, y: 0 },
        duration: 500,
    })
    .play();
```

## Built-in Path Functions

### orbit()

Circular or elliptical motion around a center point.

```js
orbit({
    cx: 200,            // Center X
    cy: 200,            // Center Y
    radius: 100,        // Radius (or use rx/ry for ellipse)
    rx: 150,            // Horizontal radius (overrides radius)
    ry: 80,             // Vertical radius (overrides radius)
    offset: 0,          // Start angle (0-1, where 1 = full rotation)
    clockwise: true,    // Direction
})
```

::demo
```toolbar
<button id="demo-orbit-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Play</button>
<button id="demo-orbit-stop" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Stop</button>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'hub', position: { x: 175, y: 80 }, data: { label: 'Hub' }, draggable: false },
        { id: 's1', position: { x: 320, y: 80 }, data: { label: 'A' } },
        { id: 's2', position: { x: 175, y: 210 }, data: { label: 'B' } },
        { id: 's3', position: { x: 30, y: 80 }, data: { label: 'C' } },
    ],
    edges: [
        { id: 'e1', source: 'hub', target: 's1', type: 'floating' },
        { id: 'e2', source: 'hub', target: 's2', type: 'floating' },
        { id: 'e3', source: 'hub', target: 's3', type: 'floating' },
    ],
    background: 'dots',
    controls: false,
    pannable: false,
    zoomable: false,
})" class="flow-container" style="height: 310px;"
   x-init="
       let handles = [];
       document.getElementById('demo-orbit-play').addEventListener('click', () => {
           handles.forEach(h => h.stop());
           handles = [
               $flow.animate({ nodes: { s1: { followPath: orbit({ cx: 195, cy: 95, radius: 110, offset: 0 }) } } }, { duration: 4000, loop: true, easing: 'linear' }),
               $flow.animate({ nodes: { s2: { followPath: orbit({ cx: 195, cy: 95, radius: 110, offset: 0.33 }) } } }, { duration: 4000, loop: true, easing: 'linear' }),
               $flow.animate({ nodes: { s3: { followPath: orbit({ cx: 195, cy: 95, radius: 110, offset: 0.66 }) } } }, { duration: 4000, loop: true, easing: 'linear' }),
           ];
       });
       document.getElementById('demo-orbit-stop').addEventListener('click', () => {
           handles.forEach(h => h.stop());
           handles = [];
           $flow.update({ nodes: {
               s1: { position: { x: 320, y: 80 } },
               s2: { position: { x: 175, y: 210 } },
               s3: { position: { x: 30, y: 80 } },
           }});
       });
   ">
    <div x-flow-viewport>
        <template x-for="node in nodes" :key="node.id">
            <div x-flow-node="node" :style="node.id === 'hub' ? 'opacity: 1' : ''">
                <template x-if="node.id !== 'hub'">
                    <div x-flow-handle:target></div>
                </template>
                <span x-text="node.data.label"></span>
                <template x-if="node.id !== 'hub'">
                    <div x-flow-handle:source></div>
                </template>
            </div>
        </template>
    </div>
</div>
```
::enddemo

### wave()

Sinusoidal oscillation along a start-end axis with perpendicular displacement.

```js
wave({
    startX: 0,          // Start X
    startY: 100,        // Start Y
    endX: 400,          // End X
    endY: 100,          // End Y
    amplitude: 30,      // Wave height (default: 30)
    frequency: 1,       // Number of full cycles (default: 1)
    offset: 0,          // Phase offset (0-1)
})
```

### along()

Follow an SVG path `d` string with optional reverse and subsection control.

```js
// Follow entire path
along('M 0 0 C 100 0 200 100 300 50')

// Follow path backwards, only the middle 50%
along('M 0 0 C 100 0 200 100 300 50', {
    reverse: true,
    startAt: 0.25,
    endAt: 0.75,
})
```

You can also pass an SVG path string directly to `followPath` without wrapping in `along()`:

```js
$flow.animate({
    nodes: {
        'n1': { followPath: 'M 0 100 Q 200 0 400 100' },
    },
}, { duration: 2000 });
```

### pendulum()

Swinging arc around a pivot point. The node hangs below the pivot.

```js
pendulum({
    cx: 200,            // Pivot X
    cy: 50,             // Pivot Y
    radius: 100,        // Arm length
    angle: 60,          // Max swing angle in degrees (default: 60)
    offset: 0,          // Phase offset (0-1)
})
```

### drift()

Smooth pseudo-random wandering using sine-sum noise. Great for ambient "breathing" effects.

```js
drift({
    originX: 200,       // Center X
    originY: 200,       // Center Y
    range: 20,          // Max displacement (default: 20)
    speed: 1,           // Speed multiplier (default: 1)
    seed: 0,            // Vary pattern per node (default: 0)
})
```

### stagger()

Distributes offset values across multiple items. Useful for staggering orbit start positions or wave phases so multiple nodes don't overlap:

```js
const offsets = stagger(0.25, { from: 0 });

// offsets(0, 4) → 0, offsets(1, 4) → 0.25, offsets(2, 4) → 0.5, offsets(3, 4) → 0.75

// Use with orbit to evenly distribute satellites
['s1', 's2', 's3', 's4'].forEach((id, i, arr) => {
    $flow.animate({
        nodes: { [id]: { followPath: orbit({ cx: 200, cy: 200, radius: 100, offset: offsets(i, arr.length) }) } },
    }, { duration: 4000, loop: true, easing: 'linear' });
});
```

## Guide Paths

When using an SVG path string, you can show a visible guide overlay:

```js
$flow.animate({
    nodes: {
        'n1': {
            followPath: 'M 0 100 Q 200 0 400 100',
            guidePath: {
                visible: true,
                class: 'my-guide',
                autoRemove: true,   // Remove guide when animation ends (default)
            },
        },
    },
}, { duration: 2000 });
```

Guide paths get the `.flow-guide-path` CSS class:

```css
.flow-guide-path {
    stroke: var(--flow-accent);
    stroke-width: 1;
    stroke-dasharray: 4 4;
    fill: none;
    opacity: 0.4;
}
```

## Custom Path Functions

Any function with the signature `(t: number) => { x: number, y: number }` works as a path:

```js
// Figure-eight
const figure8 = (t) => ({
    x: 200 + 100 * Math.sin(t * Math.PI * 2),
    y: 100 + 50 * Math.sin(t * Math.PI * 4),
});

$flow.animate({
    nodes: { 'n1': { followPath: figure8 } },
}, { duration: 4000, loop: true, easing: 'linear' });
```

## See also

- [Animate & Update](animate.md) -- core animation API
- [Timeline](timeline.md) -- multi-step sequenced animations
- [Camera Follow](camera-follow.md) -- track a moving node with the viewport
