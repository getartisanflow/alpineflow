---
title: Record & Replay
description: Capture canvas animations and replay them deterministically with scrub, speed, and reverse controls.
order: 6
---

# Record & Replay

`$flow.record()` captures every canvas API call made during a function — `animate`, `update`, `sendParticle*`, `addNodes`/`removeNodes`, and the viewport changes that flow through those methods. The returned `Recording` is a **serializable, time-indexable artifact** — you can replay it at any speed, scrub through it, rewind it, render thumbnails at arbitrary timestamps, save it as JSON, and play it back on a different canvas later.

This is the layer that powers session replays, demo captures, "rewind the last 5 seconds" debugging tools, and interactive scrubber UIs.

Record a sequence, then drag the slider to scrub through it:

::demo
```toolbar
<button id="demo-scrub-prepare" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Record for scrub</button>
<input id="demo-scrub-slider" type="range" min="0" max="3400" step="1" value="0" disabled class="w-48 align-middle">
<span id="demo-scrub-time" class="font-mono text-[10px] text-text-faint">0 / 0ms</span>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'n', position: { x: 40, y: 90 }, data: { label: 'Scrub me' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let recording = null;
       let handle = null;
       const slider = document.getElementById('demo-scrub-slider');
       const timeLabel = document.getElementById('demo-scrub-time');
       document.getElementById('demo-scrub-prepare').addEventListener('click', async () => {
           $flow.update({ nodes: { n: { position: { x: 40, y: 90 } } } });
           recording = await $flow.record(async () => {
               $flow.animate({ nodes: { n: { position: { x: 360, y: 90  } } } }, { duration: 1200, easing: 'easeInOut' });
               await new Promise(r => setTimeout(r, 1300));
               $flow.animate({ nodes: { n: { position: { x: 200, y: 170 } } } }, { duration: 800,  easing: 'easeInOut' });
               await new Promise(r => setTimeout(r, 900));
               $flow.animate({ nodes: { n: { position: { x: 40,  y: 20  } } } }, { duration: 1000, easing: 'easeInOut' });
               await new Promise(r => setTimeout(r, 1100));
           });
           if (handle) handle.stop();
           handle = $flow.replay(recording, { paused: true });
           slider.max = Math.round(recording.duration);
           slider.value = 0;
           slider.disabled = false;
           timeLabel.textContent = '0 / ' + Math.round(recording.duration) + 'ms';
       });
       slider.addEventListener('input', (e) => {
           if (!handle) return;
           const t = Number(e.target.value);
           handle.scrubTo(t);
           timeLabel.textContent = t + ' / ' + slider.max + 'ms';
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

## Recording a sequence

Pass any sync or async function to `$flow.record()`. Every canvas API call made during that function — `animate`, `update`, `sendParticle*`, `addNodes`/`removeNodes`, etc. — is captured with a virtual timestamp.

```js
const recording = await $flow.record(async () => {
    $flow.animate({ nodes: { n1: { position: { x: 360 } } } }, { duration: 600 });
    await new Promise(r => setTimeout(r, 700));
    $flow.animate({ nodes: { n1: { position: { x: 200 } } } }, { duration: 500 });
});

console.log(recording.duration);         // ~1200ms
console.log(recording.events.length);    // number of captured API calls
console.log(recording.checkpoints.length); // periodic canvas snapshots
```

The recording is a plain object — no live references to the canvas, no open handles. You can store it in `localStorage`, send it over the wire, or drop it into a test fixture.

### RecordOptions

```ts
interface RecordOptions {
    checkpointInterval?: number;          // default 500ms
    captureMetadata?: Record<string, any>; // attached to recording.metadata
    maxDuration?: number;                  // safety cap, default 60000ms
}
```

- `checkpointInterval` — how often a full canvas snapshot is captured during recording. Larger intervals reduce recording size; smaller intervals enable faster scrubbing.
- `captureMetadata` — arbitrary data attached to the final `Recording.metadata`. Useful for tagging recordings (e.g., user ID, browser, experiment bucket).
- `maxDuration` — throws if the recording exceeds this. Guards against runaway loops.

### What gets captured

The recorder hooks these canvas API methods:

- **State changes:** `animate`, `update`
- **Particles:** `sendParticle`, `sendParticleAlongPath`, `sendParticleBetween`, `sendParticleBurst`, `sendConverging`
- **Structural:** `addNodes`, `removeNodes`, `addEdges`, `removeEdges`
- **Viewport:** only via `animate({ viewport: {...} })` or `update({ viewport: {...} })` — direct camera methods are a [known gap](#known-gaps).

Record a richer multi-subject sequence — moving nodes, firing beams, and changing edge colors — then replay it at the original speed:

::demo
```toolbar
<button id="demo-complex-record" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Record pipeline</button>
<button id="demo-complex-replay" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Replay</button>
<span id="demo-complex-log" class="font-mono text-[10px] text-text-faint">no recording</span>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'src',  position: { x: 20,  y: 80  }, data: { label: 'Source' } },
        { id: 'proc', position: { x: 210, y: 40  }, data: { label: 'Process' } },
        { id: 'sink', position: { x: 410, y: 80  }, data: { label: 'Sink' } },
    ],
    edges: [
        { id: 'e1', source: 'src',  target: 'proc', type: 'bezier' },
        { id: 'e2', source: 'proc', target: 'sink', type: 'bezier' },
    ],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 260px;"
   x-init="
       let recording = null;
       const log = document.getElementById('demo-complex-log');
       document.getElementById('demo-complex-record').addEventListener('click', async () => {
           $flow.update({ nodes: {
               src:  { position: { x: 20,  y: 80  } },
               proc: { position: { x: 210, y: 40  } },
               sink: { position: { x: 410, y: 80  } },
           } });
           log.textContent = 'recording…';
           recording = await $flow.record(async () => {
               $flow.sendParticle('e1', {
                   renderer: 'beam', length: 50, width: 4, duration: 900,
                   gradient: [
                       { offset: 0, color: '#8B5CF6', opacity: 0 },
                       { offset: 1, color: '#fff', opacity: 1 },
                   ],
               });
               await new Promise(r => setTimeout(r, 700));
               $flow.animate({ nodes: { proc: { position: { x: 210, y: 120 } } } }, { duration: 500 });
               await new Promise(r => setTimeout(r, 600));
               $flow.sendParticle('e2', {
                   renderer: 'beam', length: 50, width: 4, duration: 900,
                   gradient: [
                       { offset: 0, color: '#D946EF', opacity: 0 },
                       { offset: 1, color: '#fff', opacity: 1 },
                   ],
               });
               await new Promise(r => setTimeout(r, 1000));
           });
           log.textContent = 'captured ' + recording.events.length + ' events, ' + Math.round(recording.duration) + 'ms';
       });
       document.getElementById('demo-complex-replay').addEventListener('click', async () => {
           if (!recording) { log.textContent = 'record first'; return; }
           log.textContent = 'replaying…';
           const handle = $flow.replay(recording);
           await handle.finished;
           log.textContent = 'replay complete';
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

### Known gaps

The recorder hooks canvas API calls — anything that sidesteps those methods isn't captured. These are tracked for v0.2.0-alpha and may be closed before release:

- **User drags** — moving a node by mouse/touch writes to `node.position` directly via Alpine reactivity. The drag doesn't flow through `animate`/`update`, so the recorder doesn't see it.
- **Direct viewport methods** — `$flow.setViewport()`, `$flow.fitView()`, `$flow.zoomIn()` / `zoomOut()`, `$flow.setCenter()`, `$flow.panBy()`, `$flow.follow()`, and user-driven pan/zoom (mouse wheel, middle-drag). These talk to the pan/zoom subsystem directly. Only viewport changes made through `$flow.animate({ viewport: {...} })` or `$flow.update({ viewport: {...} })` are captured today.
- **Particle burst `variant` callbacks** — the `variant(i, total)` function in `sendParticleBurst` isn't serializable, so it's stripped during capture. On replay, every particle in the burst fires with the shared base options (count, stagger, color, size, duration) — per-index variation is lost.

The planned fix for the first two is a single "interaction sampler" — a per-frame diff of node positions and viewport that emits synthetic `update` events when anything changes outside of recorded API calls. It would be opt-in via a `captureInteractions` flag on `RecordOptions` so default behavior stays identical.

### Checkpoints and in-flight animations

Every `checkpointInterval` ms during recording, the recorder snapshots the full canvas state *and* serializes every in-flight animation's `from`/`to`/`progress`/`startTime`. When you scrub into the middle of an animation, the engine restores the checkpoint AND rehydrates those mid-flight animations so the visible state at `t = 1500` matches what the user actually saw at that moment.

This means scrubbing works correctly even if you haven't replayed from `t=0` — the engine always has enough context to reproduce the exact mid-animation state.

## Replaying

`$flow.replay(recording, options)` returns a `ReplayHandle` that plays the recording back on the current canvas.

```js
const handle = $flow.replay(recording);
await handle.finished;        // resolves when playback completes
```

By default, replay starts immediately and applies the recording's `initialState` to the canvas before the first event. The same canvas API calls (`animate`, `sendParticle`, etc.) fire in order at their captured timestamps.

### ReplayOptions

```ts
interface ReplayOptions {
    speed?: number;             // playback speed multiplier, default 1.0
    from?: number;              // start at this virtual-ms, default 0
    to?: number;                // end at this virtual-ms, default recording.duration
    loop?: boolean | number;    // repeat forever or N times
    paused?: boolean;           // start in paused state
    skipInitialState?: boolean; // leave canvas untouched at start
}
```

Common patterns:

```js
// Start paused, drive with a scrubber
const handle = $flow.replay(recording, { paused: true });

// 2x speed
$flow.replay(recording, { speed: 2.0 });

// Reverse playback
$flow.replay(recording, { speed: -1.0 });

// Loop forever for a demo reel
$flow.replay(recording, { loop: true });

// Play the last second only
$flow.replay(recording, { from: recording.duration - 1000 });
```

## Playback controls

```js
handle.play();    // begin / resume playback
handle.pause();   // stop ticking, keep current position
handle.stop();   // return to `from`, reset engine
```

`handle.speed` is both readable and settable. Negative values play backward:

```js
handle.speed = 2;      // 2x fast-forward
handle.speed = -1;     // reverse at real-time speed
handle.speed = 0.5;    // slow-motion
```

State and direction are exposed as readable properties:

```ts
handle.state      // 'idle' | 'playing' | 'paused' | 'ended'
handle.direction  // 'forward' | 'backward' (computed from speed)
handle.currentTime  // current virtual-ms
handle.duration    // recording's total duration
```

`handle.finished` is a promise that resolves when playback reaches the end (and isn't looping). Good for `await`-driven sequences.

Record a short sequence, then play it at 1×, 2×, or in reverse:

::demo
```toolbar
<button id="demo-play-record" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Record</button>
<button id="demo-play-play" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body" disabled>Play</button>
<button id="demo-play-pause" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body" disabled>Pause</button>
<button id="demo-play-stop" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body" disabled>Stop</button>
<select id="demo-play-speed" class="rounded-md border border-border-subtle bg-elevated px-2 py-1 font-mono text-[11px] text-text-muted" disabled>
    <option value="0.5">0.5×</option>
    <option value="1" selected>1×</option>
    <option value="2">2×</option>
    <option value="-1">−1× (reverse)</option>
</select>
```
```html
<div x-data="flowCanvas({
    nodes: [
        { id: 'p', position: { x: 40, y: 80 }, data: { label: 'Playback' } },
    ],
    edges: [],
    background: 'dots',
    controls: false, pannable: false, zoomable: false,
})" class="flow-container" style="height: 220px;"
   x-init="
       let recording = null;
       let handle = null;
       const btns = {
           rec: document.getElementById('demo-play-record'),
           play: document.getElementById('demo-play-play'),
           pause: document.getElementById('demo-play-pause'),
           stop: document.getElementById('demo-play-stop'),
       };
       const speedSel = document.getElementById('demo-play-speed');
       const enable = (enabled) => {
           ['play','pause','stop'].forEach(k => btns[k].disabled = !enabled);
           speedSel.disabled = !enabled;
       };
       btns.rec.addEventListener('click', async () => {
           $flow.update({ nodes: { p: { position: { x: 40, y: 80 } } } });
           recording = await $flow.record(async () => {
               $flow.animate({ nodes: { p: { position: { x: 360 } } } }, { duration: 1200, easing: 'linear' });
               await new Promise(r => setTimeout(r, 1300));
               $flow.animate({ nodes: { p: { position: { x: 40  } } } }, { duration: 1200, easing: 'linear' });
               await new Promise(r => setTimeout(r, 1300));
           });
           if (handle) handle.stop();
           handle = $flow.replay(recording, { paused: true });
           enable(true);
       });
       btns.play.addEventListener('click', () => {
           if (!handle || handle.state === 'ended') {
               handle = $flow.replay(recording, { paused: true });
               handle.speed = Number(speedSel.value);
           }
           handle.play();
       });
       btns.pause.addEventListener('click', () => handle?.pause());
       btns.stop.addEventListener('click', () => handle?.stop());
       speedSel.addEventListener('change', (e) => {
           if (handle) handle.speed = Number(e.target.value);
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

## Interactive scrubbing

`handle.scrubTo(t)` jumps to any virtual time instantly — the engine restores the nearest prior checkpoint and walks forward to `t`. This is O(log n + events-in-window), not O(full-recording).

Accepts numeric milliseconds, `'50%'` style strings, `'start'`, or `'end'`:

```js
handle.scrubTo(1500);      // ms
handle.scrubTo('50%');
handle.scrubTo('end');
```

`handle.seek(t)` is an alias. See the hero demo at the top of this page for a live scrubber.

## Serializing recordings

`Recording` is JSON-safe — non-serializable values (functions, DOM refs) are stripped at capture time with a `console.warn`.

```js
const recording = await $flow.record(async () => { /* … */ });

// Persist
localStorage.setItem('demo', JSON.stringify(recording.toJSON()));

// Restore later (possibly on a different canvas, different session)
import { Recording } from '@getartisanflow/alpineflow';
const restored = Recording.fromJSON(JSON.parse(localStorage.getItem('demo')));
const handle = $flow.replay(restored);
```

`Recording.fromJSON` checks the `version` field and throws if the recording was produced by a newer AlpineFlow version than the consumer can handle.

## Introspection

A recording exposes several query methods for building custom scrubber UIs, thumbnails, and analytics:

| Method | Returns | Use for |
|---|---|---|
| `getStateAt(t)` | `CanvasSnapshot` at time `t` | Thumbnails, offline analysis |
| `getSubjects()` | `Array<{ kind, id, firstSeenT, lastSeenT }>` | Timeline gantt views — "who appeared when" |
| `getActivityFor(id)` | `Array<{ startT, endT, reason }>` | Gantt bars for a specific node/edge |
| `getValueTrack(path)` | `Array<{ t, v }>` sampled from checkpoints | Plotting a property's curve over time (e.g. `'nodes.n.position.x'`) |
| `renderThumbnailAt(t, options)` | SVG string | Static thumbnails for timeline previews |

```js
// Plot a node's x-position over the recording
const track = recording.getValueTrack('nodes.puck.position.x');
// [{ t: 0, v: 40 }, { t: 500, v: 151 }, { t: 1000, v: 342 }, …]

// Render a thumbnail at the midpoint
const svg = recording.renderThumbnailAt(recording.duration / 2, {
    width: 320, height: 180,
});
```

Record a sequence, then render a strip of thumbnails at evenly-spaced times. Click a thumbnail to jump the live canvas to that moment:

::demo
```toolbar
<button id="demo-thumb-record" class="rounded-md border border-border-subtle bg-elevated px-3 py-1 font-mono text-[11px] text-text-muted cursor-pointer hover:text-text-body">Record for thumbnails</button>
<span id="demo-thumb-log" class="font-mono text-[10px] text-text-faint">no recording</span>
```
```html
<div>
    <div x-data="flowCanvas({
        nodes: [
            { id: 't1', position: { x: 40,  y: 30  }, data: { label: 'A' } },
            { id: 't2', position: { x: 40,  y: 120 }, data: { label: 'B' } },
        ],
        edges: [],
        background: 'dots',
        controls: false, pannable: false, zoomable: false,
    })" class="flow-container" style="height: 220px;"
       x-init="
           let recording = null;
           let handle = null;
           const log = document.getElementById('demo-thumb-log');
           const strip = document.getElementById('demo-thumb-strip');
           const parser = new DOMParser();
           document.getElementById('demo-thumb-record').addEventListener('click', async () => {
               $flow.update({ nodes: {
                   t1: { position: { x: 40,  y: 30  } },
                   t2: { position: { x: 40,  y: 120 } },
               } });
               log.textContent = 'recording…';
               recording = await $flow.record(async () => {
                   $flow.animate({ nodes: { t1: { position: { x: 360, y: 30  } } } }, { duration: 900 });
                   await new Promise(r => setTimeout(r, 500));
                   $flow.animate({ nodes: { t2: { position: { x: 360, y: 120 } } } }, { duration: 900 });
                   await new Promise(r => setTimeout(r, 1000));
               });
               if (handle) handle.stop();
               handle = $flow.replay(recording, { paused: true });
               log.textContent = 'recorded ' + Math.round(recording.duration) + 'ms — click a thumbnail';
               while (strip.firstChild) strip.removeChild(strip.firstChild);
               const count = 8;
               for (let i = 0; i < count; i++) {
                   const t = (i / (count - 1)) * recording.duration;
                   const svgString = recording.renderThumbnailAt(t, { width: 120, height: 68 });
                   const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
                   const svgEl = svgDoc.documentElement;
                   const btn = document.createElement('button');
                   btn.className = 'shrink-0 rounded border border-border-subtle bg-surface p-1 cursor-pointer hover:border-violet';
                   btn.appendChild(svgEl);
                   const label = document.createElement('div');
                   label.className = 'font-mono text-[9px] text-text-faint mt-1';
                   label.textContent = Math.round(t) + 'ms';
                   btn.appendChild(label);
                   btn.addEventListener('click', () => handle?.scrubTo(t));
                   strip.appendChild(btn);
               }
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
    <div id="demo-thumb-strip" class="flex gap-1 p-2 border-t border-border-subtle bg-elevated overflow-x-auto"></div>
</div>
```
::enddemo

Thumbnails use a pluggable renderer system — `'faithful'` is the default. See the source for custom thumbnail renderers.

## Recording on a different canvas

Recordings are canvas-agnostic. A recording from one canvas can replay on another as long as the target canvas has the same nodes/edges (by `id`) that appear in the recording's `initialState`. If the recording contains `node-add` / `node-remove` events, the replay will structurally reconcile the target canvas on each frame — adding and removing elements as the recording dictates — using the target canvas's `addNodes` / `removeNodes` / `addEdges` / `removeEdges` methods if available.

## Common patterns

### Onboarding demo loop

```js
// Record once at app init, loop forever
const demo = await $flow.record(async () => {
    $flow.animate({ nodes: { welcome: { position: { x: 200 } } } }, { duration: 600 });
    await new Promise(r => setTimeout(r, 800));
    $flow.sendParticle('e1', { renderer: 'beam', duration: 1200 });
    await new Promise(r => setTimeout(r, 1400));
});

$flow.replay(demo, { loop: true });
```

### Timeline scrubber with thumbnails

```js
const recording = await $flow.record(async () => { /* session */ });

// Generate 10 thumbnails for a timeline strip
const thumbs = Array.from({ length: 10 }, (_, i) => ({
    t: (i / 9) * recording.duration,
    svg: recording.renderThumbnailAt(
        (i / 9) * recording.duration,
        { width: 120, height: 68 },
    ),
}));
```

### "Rewind the last 5 seconds" debugging *(future)*

A rolling-buffer pattern — record continuously, keep the last N seconds, rewind when something breaks — is on the roadmap but **not yet supported**. It needs an explicit `recorder.stop()` (or `AbortSignal`) that lets the caller end `record()` from outside the recorded function without losing the captured events. Today `$flow.record(fn)` must see `fn` resolve naturally before the `Recording` is available, so continuous buffering isn't possible.

Tracking for a post-v0.2.0-alpha addition.

## API summary

```ts
// Capture
$flow.record(fn: () => Promise<void> | void, options?: RecordOptions): Promise<Recording>

// Playback
$flow.replay(recording: Recording, options?: ReplayOptions): ReplayHandle

// Recording (returned by record)
class Recording {
    readonly version: number;
    readonly duration: number;
    readonly initialState: Readonly<CanvasSnapshot>;
    readonly events: ReadonlyArray<RecordingEvent>;
    readonly checkpoints: ReadonlyArray<Checkpoint>;
    readonly metadata: Readonly<Record<string, any>>;

    toJSON(): RecordingData;
    static fromJSON(data: RecordingData): Recording;

    getStateAt(t: number): CanvasSnapshot;
    getSubjects(): Array<{ kind, id, firstSeenT, lastSeenT }>;
    getActivityFor(id: string): Array<{ startT, endT, reason }>;
    getValueTrack(path: string): Array<{ t, v }>;
    renderThumbnailAt(t: number, options): string;
}

// ReplayHandle (returned by replay)
class ReplayHandle {
    readonly recording: Recording;
    readonly finished: Promise<void>;
    readonly duration: number;
    readonly currentTime: number;
    readonly state: 'idle' | 'playing' | 'paused' | 'ended';
    readonly direction: 'forward' | 'backward';
    speed: number;

    play(): void;
    pause(): void;
    stop(): void;
    scrubTo(t: number | string): void;
    seek(t: number | string): void;   // alias of scrubTo

    getStateAt(t: number): CanvasSnapshot;
    eventsUpTo(t: number): RecordingEvent[];
}
```
