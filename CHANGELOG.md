# Changelog

## Unreleased

### Added — canvas-level `interactive` config to start locked

`isInteractive` was hardcoded `true` at init, so "start locked" needed a userland flag plus a post-ready `toggleInteractive()`. The `FlowCanvasConfig` now accepts **`interactive?: boolean`** (default `true`): set it `false` and the canvas initialises locked — pan and zoom off — with no follow-up call. `interactive` is a **master overlay** on the per-axis `pannable`/`zoomable` options: when `false` it forces both axes off at init regardless of those options, and `toggleInteractive()` restores the per-axis intent (an axis you set `false` stays off when unlocking). Additive and non-breaking — the default preserves today's behaviour. Also clarifies the distinction from the per-node `FlowNode.locked` flag (which freezes a single node) in both JSDoc sites.

### Changed — `fitView()` now returns `Promise<boolean>` (observable fit)

`fitView()` previously returned `void` and, when any node still lacked measured `dimensions`, deferred up to 10 animation frames and then **silently gave up** without fitting — so "did it actually fit?" was unobservable. It now returns a promise that resolves **`true`** once the fit runs, or **`false`** when the retry budget is exhausted with nodes still unmeasured. The rAF-retry behaviour is unchanged; only completion became observable. Runtime-non-breaking: callers that ignore the return value (including the internal `fitViewOnInit` path) are unaffected. TypeScript consumers who annotated the call as `: void` will see a compile note.

### Added — schema-addon methods are now typed on `CanvasContext`

The schema addon attaches `addField` / `renameField` / `removeField` / `reorderFields` / `inferReferences` / `schemaToJSON` / `schemaFromJSON` / `validateSchema` / `diffSchemas` / `toDot` / `schemaLayout` onto the canvas at runtime, but none were declared on the `CanvasContext` type — so consumers had to import the standalone `addField(canvas, …)` helpers and cast. Importing `@getartisanflow/alpineflow/schema` now pulls in a module augmentation that declares all eleven methods (with their real result shapes — e.g. `addField(...)` returns `{ applied: boolean; reason?: string }`), so `canvas.addField('users', { name: 'email', type: 'string' })` type-checks directly. The result interfaces (`AddFieldResult`, `RenameFieldOpResult`, `RemoveFieldOpResult`, `ReorderFieldsOpResult`) are now exported from the schema entry so return values can be named. Purely additive and type-level — the augmentation is scoped to the schema entry's types (a core-only import is unaffected) and the runtime bundle is unchanged.

### Added — ELK `rectpacking` + `aspectRatio` + raw `layoutOptions` escape hatch

The ELK layout wrapper accepts three additions (thanks to [@ronnorthrip](https://github.com/ronnorthrip)): the **`rectpacking`** algorithm for unconnected boxes (edges are dropped for it — rectpacking ignores them by design), an **`aspectRatio`** option (width / height target, maps to `elk.aspectRatio`, honoured by rectpacking and several other algorithms), and a **`layoutOptions`** escape hatch — raw `elk.*` ids merged last, so any ELK option (e.g. `elk.rectpacking.orderBySize`) is reachable without a wrapper change. All three thread through `canvas.applyElkLayout()`.

### Workstream 3 — avoidant crossing reduction (opt-in)

**Added**
- `avoidantCrossingReduction` config (default **off**) + `setCrossingReduction()` runtime knob, with the matching `flow:setCrossingReduction` wire command. When enabled, a per-canvas plan pass groups avoidant edges that share a corridor (base-route channels), computes barycenter-ordered lane offsets, and fans stacked edges apart via a post-route interior-run shift with obstacle revert — so edges funnelling through the same gap separate into ordered lanes instead of drawing coincident. Accepts `true` or `{ channelGap: px }` (default gap 12). Off === pre-WS-3 baseline routing, byte-identical `d` strings.

### Fixed — edges with a buried endpoint no longer collapse to a straight bezier

When a third-party node sat on top of an edge's endpoint handle (or the stub point the router leaves from) — easy to hit after `scramble()` scatters nodes into overlaps — that node's padded rect swallowed the endpoint, every outgoing path segment was blocked, and `findRoute` returned `null`, so avoidant/orthogonal edges silently fell back to a straight bezier until the connected node was dragged. Obstacles whose padded rect contains a route endpoint or its stub offset are now **excluded from routing for that edge**: a node sitting on your handle can't be routed around anyway, and the route still avoids everything else. Genuinely unroutable layouts (endpoint ringed by non-covering obstacles) still fall back to bezier.

### Fixed — wheel zoom now works while the pointer is over a node

Nodes carry the `noPanClassName` class (default `nopan`) so dragging a node moves the node and doesn't pan the canvas. But the pan/zoom filter blocked **every** gesture whose target was inside a `.nopan` element — including `wheel` — so scroll- and pinch-zoom silently did nothing whenever the cursor was over a node, which for a dense graph is most of the canvas.

The filter now exempts `wheel` from the `noPanClassName` check: `nopan` gates panning (drag) only, and wheel zoom is gated separately by `noWheelClassName` (matching the react-flow/xyflow split this was modelled on). Panning over a node and double-click zoom are unaffected.

### Added — `nowheel` class to opt an element out of wheel zoom

`noWheelClassName` now defaults to `'nowheel'`, the symmetric counterpart to `noPanClassName`'s `'nopan'`. Add `class="nowheel"` to any element on the canvas — a scrollable panel or list, say — and the wheel scrolls its content instead of zooming the canvas. This is purely additive: unlike `nopan` (which nodes carry automatically), no element carries `nowheel` by default, so existing behavior is unchanged until you apply the class. Override `noWheelClassName` in the canvas config to use a different class name, or set it to `undefined` to disable the feature entirely.

### Fixed — a drop released over a panel, the controls or the minimap no longer adds a node

The drop-zone listener is attached to the flow container, and the floating overlays (`.flow-panel`, `.flow-controls`, `.flow-minimap`, and any `.canvas-overlay` such as the devtools panel) live *inside* that container with `pointer-events: auto` and a `z-index` above the canvas surface. Their drag events therefore bubbled to the same listener, and the canvas treated them as a drop on the surface — adding a node at the position **behind** the overlay.

The most common way to hit this is the in-canvas node palette: drag an item out, change your mind, release it back over the palette, and instead of cancelling you got a node hidden underneath the panel. Releasing over the zoom controls or the minimap did the same.

`dragover` and `drop` now both ignore events whose target is inside an overlay, so the browser shows the "no drop" cursor while over one and the release is a cancel. Drops on the canvas surface and onto nodes are unaffected — `targetNode` resolution still works exactly as before.

### Fixed — canvas shortcuts no longer hijack keys inside `contenteditable` and nested controls

Typing inside a node was destructive. The canvas keydown handler decided whether a keystroke belonged to the user by reading `e.target.tagName` and bailing only on `INPUT`/`TEXTAREA` — but a rich-text editor, a JSON editor, or an inline-editable node label renders a **`contenteditable` `<div>`**, whose `tagName` is `'DIV'`. Every canvas shortcut therefore fired while the user was typing: **Backspace deleted the whole selected node** instead of a character, the arrow keys **moved the node** instead of the caret, and Ctrl/Cmd+Z/C/X/V hit the canvas history and clipboard instead of the text.

The check now lives in one exported helper, `isEditableTarget(target)`, which returns true for `INPUT`, `TEXTAREA`, `SELECT` **and** any element with `isContentEditable`. All six shortcut guards (delete, selection-tool toggle, arrow-nudge, undo, redo, copy/paste/cut) call it.

A second path had the same shape: `x-flow-node` treats Enter/Space as "select this node", but `keydown` bubbles, so it `preventDefault()`ed those keys for **any** focused descendant — no spaces or newlines in a nested input, and nested `<button>`s could not be activated by keyboard at all. Activation is now gated on the event target being the node wrapper itself, via the exported `isNodeActivationKey(e, el)`.

Not a breaking change: both helpers only *widen* the set of targets the canvas keeps its hands off, so any node that already behaved correctly is unaffected.
### Added — opt-in `'toggle'` mode for double-click zoom, plus `dblClickZoomLevel`

Double-click zoom comes from d3-zoom, which only ever zooms **in** — one ×2 step per double-click (`shift` to step out), capped at `maxZoom`. That is the right default, but it makes "get me to a readable level and back" an unpredictable number of clicks, and once at `maxZoom` a plain double-click does nothing.

`zoomOnDoubleClick` now accepts a mode as well as a boolean:

| Value | Behaviour |
|---|---|
| `true` / `'step'` *(default)* | d3-zoom's native handler, unchanged — ×2 in, `shift`+double-click out, repeatable |
| `'toggle'` | jump to `dblClickZoomLevel` about the cursor; the next double-click restores the previous viewport exactly |
| `false` | disabled |

In `'toggle'` mode the gesture is a true round trip: the first double-click animates to `dblClickZoomLevel` (default `1.5`) keeping the point under the pointer fixed and remembering the viewport it left, and the second puts that viewport back precisely rather than approximating it with a zoom-out. Reach the level some other way — wheel, `setViewport()` — and there is nothing to restore, so the gesture zooms out to `minZoom` about the cursor instead of stalling. Panning or zooming by hand discards the remembered viewport, so a toggle-out never returns to a view the user has since left.

New **`dblClickZoomLevel`** sets that level, clamped to `[minZoom, maxZoom]`. It must clear `minZoom` for the toggle to have anywhere to return to; if clamping pushes it onto `minZoom`, AlpineFlow keeps d3's stepped handler rather than installing a gesture that would stall on the second click.

Not a breaking change: the default is byte-for-byte the previous behaviour — d3's handler stays bound, `shift`+double-click keeps working, and `dblClickZoomLevel` is only consulted in `'toggle'` mode. Both modes treat `zoomable: false` the same way the pan-zoom filter always has: it gates pointer-gesture zooming (wheel, pinch), never double-click — so a canvas that disables wheel zoom to drive zooming itself (e.g. pinch-only) keeps the double-click gesture, and `zoomOnDoubleClick: false` remains the switch for turning that gesture off.

### Added — custom edge generators receive the `edge`

Custom edge path generators registered via `flowCanvas({ edgeTypes })` are now called with the `edge` as a second argument — `edgeTypes[type](params, edge)` — where before they saw only the endpoint coordinates. That limitation forced any per-edge routing data (waypoints, lane/channel assignments) to be smuggled in through a **separate closure per edge**; because that data lived in a function rather than on the model, it was lost on `toObject()`/`fromObject()`, so a custom-routed edge came back unrouted after a reload or snapshot restore. A generator can now read its route straight off `edge.data`, where it serializes with the edge and survives the round-trip.

Not a breaking change: the `edge` argument is optional and appended after the existing `params`, so every existing single-parameter generator keeps working unchanged. Thanks to [@ronnorthrip](https://github.com/ronnorthrip) for the report and change.

### Added — schema render hooks: `x-flow-schema` customization without forking the directive

`x-flow-schema` owns the DOM it builds, so consumers previously had to replace the whole directive to customize a node. Four new `flowCanvas({ … })` hooks augment its output per-render instead — read from the canvas config on every render, no-ops when unset, and firing only for `x-flow-schema` nodes:

- **`schemaRowClass` / `schemaNodeClass`** — declarative styling. Pure functions of the field/node data that return CSS class names; AlpineFlow applies and **reconciles** them (classes you stop returning are removed) and never touches the directive's own structural classes (`flow-schema-row`, `--pk`/`--fk`/`--required`) or anything a decorator added. Return a bare class value to class the row/host, or a per-slot map to target the row's `icon`/`name`/`type`/handle sub-slots (or a node's `header`/`body`) individually.
- **`schemaRowDecorator` / `schemaNodeDecorator`** — imperative DOM. Handed the already-built slot elements (`{ row, field, nodeId, slots, isNew }` / `{ host, header, body, node, isNew }`) to mutate — render a field's `description`, add a header badge, etc. They run every render (after the directive writes its own content), so must be idempotent; a throwing hook is caught and logged, never aborting the render.

All hook types are exported from the package root. Height-preserving decoration is free; changing a row's or header's height falls the node back to DOM-measured edge geometry (still correct, not the fast path). Thanks to [@ronnorthrip](https://github.com/ronnorthrip) for the feature.

### Fixed — node effect no longer throws on a detached-node teardown race

A node's reactive style/class effect could fire once more after the node was detached (e.g. rapid mount/unmount); its custom-shape lookup called `Alpine.$data(el.closest('[data-flow-canvas]'))`, and on a detached node `closest` returns `null`, so `Alpine.$data(null)` threw `Cannot read properties of null (reading '_x_dataStack')` asynchronously — a stray unhandled error. The lookup is now guarded (a detached node has no custom shape to apply). Pre-existing; surfaced while stabilizing the schema-directive test suite.

### Added — `toImage()` exports edges, plus `scale`, `format` (PNG/JPEG/SVG), and `quality` options

`toImage()` / `$flow.toImage()` now renders **edges** into the exported image. `html-to-image` serializes the DOM into an SVG `foreignObject` and preserves paint expressed as presentation *attributes* but drops paint that comes from a stylesheet — and AlpineFlow's edges are stroked purely by CSS, so every edge used to rasterize invisible while nodes came through fine. The capture now bakes each SVG shape's *computed* paint (stroke, fill, markers, dash, opacity) onto the elements for the duration of the capture (resolving `var(--flow-edge-*)` to concrete colours) and restores them afterward.

New export options:
- **`scale`** multiplies the raster resolution without changing the layout — `scale: 2` renders a 1920×1080 export at 3840×2160 for crisp/retina output. The capture is vector, so it re-renders sharp rather than upscaling. Clamped to what the browser can actually allocate (an over-large canvas otherwise yields a silently blank PNG) and falls back to `1` for non-finite/non-positive values.
- **`format`** selects the output — `'png'` (default, honours `scale`), `'jpeg'` (honours `scale` + `quality`), or `'svg'` (vector, ignores `scale`). Background is carried in the SVG markup for vector output and painted behind the raster for PNG/JPEG, so JPEG's missing alpha channel never encodes as black.
- **`quality`** (0–1, default `0.92`) applies to JPEG only; out-of-range values clamp, invalid ones fall back. Note: SVG export is currently *much* larger than PNG (a `html-to-image` limitation — it inlines each element's full computed style), so it's the wrong choice for saving space on large canvases; see the [`toImage` docs](docs/api/flow-magic/state-management.md#toimage).

Not a breaking change: edges appearing is a fix (they were meant to be there), `scale`/`format`/`quality` are optional and default to the previous behaviour (a 1× PNG), and `html-to-image` remains a regular dependency, so `toImage()` continues to work with no consumer action. Thanks to [@ronnorthrip](https://github.com/ronnorthrip) for the report, fix, and format work.

### Changed — avoidant edges use rounded corners, not a Catmull-Rom spline

Avoidant edges smoothed their orthogonal route with a Catmull-Rom spline, whose tangents overshoot: the curve hooked at the handle stub and bulged *past* every sharp corner, so the edges looked exaggerated. Avoidant now keeps the straight runs and rounds each corner with a **bounded cubic-bezier fillet** (`buildRoundedPath`, default radius `AVOIDANT_CORNER_RADIUS = 40`, clamped per-corner to half the shorter adjacent segment). The fillet lives inside the corner, so the curve **hugs the route and can't overshoot** — smooth and bezier-like, but visually distinct from `orthogonal`'s tight bends. This changes the exact `d` string of every avoidant edge. The Catmull-Rom builder is retained for the freeform `editable` edge type, which is unchanged.

### Fixed — schema edges detached after `animate()`

`animate()` (and the `scramble` / reset-grid layout moves built on it) drives edges each frame through `_refreshEdgePaths`, a simplified imperative path that draws a node-centre, no-obstacle bezier for speed. Once the animation settled, nothing re-ran the reactive edge effect, so **schema edges stayed detached at the node centre with their avoidant routing lost** (worst on a layout move whose final positions equal the current ones, e.g. reset-grid on an already-gridded graph — the reactive position write is a no-op so it never re-triggers). `animate()` now runs the same settle the history-restore path uses — bump `_layoutAnimTick` (re-measure) + `_commitNodeGeometry` (rebuild the obstacle snapshot) once on completion — so edges snap back to their real handles and routes. Pre-existing; unrelated to the routing-quality workstreams.

Schema-scale performance pass — fixes undo/zoom/edge performance at Draftsman scale (~50 nodes × 25 fields, ~100 edges). Landed as independent workstreams.

### Node drag — split position effect

**Performance**
- Dragging a node re-ran the *entire* node effect (base / selected / validation / runState / shape / custom classes, dimensions, inline styles, rotation) on **every pointermove**, because the node's `position` was one dependency of that monolithic effect. The `left`/`top` write is now its own lean effect, so a position-only change (i.e. every drag frame) re-positions the element without re-running the heavy effect — matching the lean `_flushNodePositions` fast-path the animation loop already used. Large drag-smoothness win at schema scale; behaviour is otherwise identical.

### Workstream 1 — history capture hygiene
Stops the undo/redo stack from filling with no-op snapshots and roughly halves retained history memory. Capture-side only; the undo/redo *restore* path is unchanged.

**Breaking / Behavior Changes**
- **Row/node selection no longer creates history entries.** Selecting or deselecting a schema row (row selection generally) no longer captures a history snapshot — selection state lives outside the `{nodes, edges}` snapshot, so those captures were byte-identical no-ops that flooded the 50-slot stack. Selection is no longer undoable.
- **Identical consecutive history states are deduped.** Both `FlowHistory` (canvas) and the schema history addon skip a snapshot equal to the top of the stack, so a capture that doesn't change the graph never adds an undo step.
- Node drag captures history on **commit** — only when the node actually moved — instead of on pointer-down, so a plain click-to-select no longer pushes an undo entry.
- Arrow-key nudge captures **once per physical keypress**; holding a key (auto-repeat) no longer pushes an entry per repeat, and keys that move nothing / an empty selection capture nothing.

**Fixed**
- A reparent/detach **drag** now records a single undo entry (previously two — `reparentNode`'s own capture plus the drag's deferred snapshot); one undo fully reverts both position and parent.
- A schema `renameField` / `removeField` that **cascades edges** now records exactly one undoable step instead of two byte-identical snapshots, so the first undo is never a visual no-op.
- A net-no-op schema `batch()` no longer leaves a duplicate-of-top undo step.

**Infrastructure**
- `FlowHistory` stores snapshots as JSON strings (≈half the retained memory of 50 live object graphs) with O(1) duplicate-state dedup; adds `snapshot()` / `commit()` for deferred capture.
- New canvas wrappers `_snapshotHistory()` / `_commitHistory()` support capture-on-commit flows.
- New pure, unit-tested helpers: `commitDragHistory` and `reparentWithoutCapture` (flow-node), `shouldCaptureNudge` (keyboard-shortcuts) — the drag/keydown decisions are extracted so they're testable without driving d3-drag in jsdom.

### Workstream 2 — identity-preserving undo/restore
Rebuilds the undo/redo *restore* path (the capture side is Workstream 1). Undo/redo, `fromObject`, and the schema addon now restore state by **merging into the existing reactive node/edge objects** instead of replacing the `nodes`/`edges` arrays wholesale — surviving ids keep their object identity, so only genuinely-changed entities re-run their effects (no full schema re-stamp, no double edge re-measure) and live Alpine scopes stay attached. This also fixes a cluster of correctness bugs.

**Breaking / Behavior Changes**
- **Undo/redo now emit a `restore` event.** `undo()` / `redo()` dispatch `flow-restore` with `{ nodes, edges, source: 'undo' | 'redo' }` (previously they mutated state silently). The `nodes`/`edges` payload matches `fromObject`'s existing `restore` event (which carries `{ nodes, edges, viewport }`), plus a `source` tag so consumers can distinguish undo/redo; wire-bridge and collaboration observers are now notified of undo/redo the same way they are notified of `fromObject`.

**Performance**
- Undo / redo / `fromObject` / `schemaFromJSON` restore by identity-preserving merge (`mergeEntitiesById`) — property writes are skipped when deep-equal, so Alpine effects re-run only for real changes. Array identity is kept via `splice`.
- Schema field-op cascades (`renameField` / `removeField`) mutate the affected edge objects in place instead of replacing the whole `edges` array, so only the cascaded edges' reactivity fires.
- Schema nodes reconcile field rows keyed by `field.name` — a single field change updates one row in place (or adds/removes/reorders just the affected rows) instead of tearing down and re-initializing every row (~180 elements per node on one keystroke).
- Node "has children" container detection reads a reactive parent→children index by key (`_childrenIds`, O(1)) instead of each node effect scanning the whole `nodes` array (O(N) subscriptions per effect, O(N²) on any array change); appending an unrelated node no longer re-runs every node's effect.

**Fixed**
- **C1 — orphaned edge scopes after undo.** Undo/redo restored edges by replacing `ctx.edges` wholesale, orphaning every live edge Alpine scope. Edges are now merged onto the same reactive objects, so their scopes stay bound.
- **C2 — frozen canvas after a schema-addon undo.** `schemaFromJSON` spliced in brand-new node/edge objects without rebuilding `_nodeMap` / `_edgeMap`, so `getNode`/`getEdge` returned orphaned objects and drags wrote to dead proxies. It now merges in place, rebuilds both maps, and preserves non-schema node props (`dimensions`, `type`, …).
- **C3 — stale `selected` flags after undo.** Snapshots captured while a node/edge was selected carried `selected: true`; restoring them left the node visually selected but out of the selection set. Undo/redo now clear restored `selected` flags and the selection sets stay consistent.
- **C4 — child-layout watchers bound to old proxies.** Because surviving nodes keep their identity across undo, the `childLayout` watchers bound to node proxies stay live instead of pointing at replaced objects.

**Infrastructure**
- New `mergeEntitiesById` (identity-preserving entity merge with deep-equal-skip writes) and `reconcileChildrenIndex` (in-place parent→children index with key-level reactive writes) helpers, both unit-tested.
- New reactive canvas field `_childrenIds`, reconciled inside `_rebuildNodeMap` (so every parentId-affecting mutation path keeps it current).

### Workstream 3 — zoom/pan pipeline coalescing

**Performance**
- **Frame-coalesced viewport pipeline** — zoom/pan side-effects (reactive `viewport` write, background, culling, zoom-level, context-menu close, viewport events) now run once per animation frame instead of once per wheel event (120Hz+ on trackpads). Only the CSS transform is written at event rate. (WS3 · T16)
- **Background gap caching** — the `--flow-bg-pattern-gap` CSS variable is resolved via `getComputedStyle` at most once and cached (invalidated on theme change), removing a forced style recalc from every viewport frame; `backgroundImage` is only rewritten when it actually changes. (T15)
- **Lean minimap viewport getter** — the minimap viewport indicator updates through a new `getViewportState` option that reads only viewport + container size, skipping the full `toAbsoluteNodes` node remap it previously ran on every viewport change. (T17)
- **Devtools per-frame work removed** — the event log does no work while the panel is collapsed, and the reactive display is split into a viewport effect and a data effect so a viewport frame no longer re-serializes the current selection. (T18)
- **Throttled Livewire viewport bridge** — `viewport-change` / `viewport-move` wire events are trailing-throttled to one Livewire round-trip per 150 ms window (the final viewport wins). (T19)

**Breaking / Behavior Changes**
- Zoom side-effects (viewport events, background, culling) now fire at most once per animation frame — `onViewportChange` fires at rAF cadence rather than per wheel event.
- `canvas.viewport` (the reactive state consumers watch) now settles on the **next animation frame** after a viewport change — this includes programmatic `setViewport` / `zoomIn` / `zoomOut` / `fitView` / `panBy`. Synchronous coordinate math should read the live viewport, which `screenToFlowPosition` / `flowToScreenPosition` now do internally (`canvas._viewportLive`). Gesture end (`viewport-move-end`) still commits the end-state synchronously.
- **Test-facing:** tests that assert `canvas.viewport` immediately after a programmatic viewport change must now flush a `requestAnimationFrame` first.

### Workstream 4 — avoidant edges at schema scale

**Performance**
- Avoidant/orthogonal edges no longer subscribe to every node's position. Obstacle geometry is read non-reactively, so a single node write no longer re-routes the whole edge graph; routes refresh on the `_layoutAnimTick` signal (bumped at node drag-end, resize, reorder/reparent, and during layout animation).
- Row-highlight tracks only the specific row keys an edge touches instead of `selectedRows.size`, so selecting a row re-runs only the edges connected to it rather than every edge.
- Edge endpoint elements resolve in O(1) via the canvas node-element registry (`_nodeElements`) instead of container-wide `[data-flow-node-id]` queries.
- Orthogonal/avoidant pathfinding uses a binary min-heap + scanline adjacency (was a linear-scan priority queue with an all-pairs neighbour test). Obstacles are pruned to a corridor around the edge (with a full-set fallback validated against the complete obstacle set), and routes are memoized in a 512-entry LRU cache keyed by endpoints + obstacle geometry.
- Benchmarks (`npm run bench`, chromium): a single dense-field route drops 0.159 ms → 0.042 ms (~3.75×); a repeated full-graph pass of 60 edges drops 8.13 ms → 0.24 ms (~34×, memo cache); a short local edge amid 100 spread-out obstacles routes on a <50-point grid (~0.004 ms) instead of 160+ points unpruned.

**Breaking / Behavior Changes**
- Obstacle geometry for avoidant/orthogonal edges is now non-reactive. A node moved by a programmatic data mutation that does not bump `_layoutAnimTick` will not re-route dependent edges until the next tick. Interactive gestures (drag, resize, reorder/reparent) bump the tick, so gesture-driven moves re-route as before.
- After the Dijkstra rewrite, routes across dense obstacle fields may choose different waypoints among equal-cost shortest paths. Path length and obstacle avoidance are unchanged — only the specific corners of a tie-broken route may differ, so an avoidant edge can render a visually different (but equally short) path.

### Workstream A — connect-drag at scale

Makes drag-to-connect usable at Draftsman scale (~50 schema nodes × 25 fields → ~5,000 handle elements). Behaviour is identical to before — the same validation chain and the same snap results, computed without the per-handle DOM work.

**Performance**
- Starting a drag-to-connect measured every target handle through `applyValidationClasses`, which ran `isValidConnection` (an O(edges) scan + optional cycle walk) plus `checkHandleLimits` and `runHandleValidators` — each doing container-wide `querySelector`s — for every handle (~10,000 full-DOM queries before the drag line moved). A `HandleIndex` is now built once at drag start (a single read-only measured pass that stores flow-space handle centers) and the validation chain is precomputed once per drag into a `DragValidationContext`, so each handle is classified in O(1) with zero DOM queries. (WS-A · A1/A2)
- Per-pointermove snap targeting (`findSnapTarget`) no longer runs `querySelectorAll` + per-handle `closest`/`getBoundingClientRect` (~2,500 rect reads per move); it reads the drag-start index instead. Bench (chromium, 2,500 handles): a snap query drops ~1.62 ms → ~0.0099 ms (~163×), with zero `getBoundingClientRect`. (A3)

**Behavior**
- The handle index is captured once at drag start and reused for the whole gesture. This is exact because node positions do not change during a connect-drag and viewport pan (auto-pan included) does not move flow-space handle centers. Handle connectability and visibility are likewise snapshotted at drag start, so a handle whose connectable/visible state changed mid-gesture would not be re-measured until the next drag — the documented index-validity contract. Non-drag callers of `applyValidationClasses` / `findSnapTarget` are unchanged (they use the existing DOM path).

**Infrastructure**
- New `buildHandleIndex` (`src/plugin/handle-index.ts`) — read-only measured pass producing `HandleRecord`s (flow-space centers plus a snapshot of the connectable/limit/validator expandos), with a real-handle-preferred `get(nodeId, handleId, type)`.
- New `buildDragValidationContext` (`src/plugin/drag-validation.ts`) — precomputes the existing-target and cycle-forbidden sets and per-handle edge counts once per drag; `applyValidationClasses` gains an optional `HandleIndex` fast path and keeps the legacy DOM path (`legacyApplyValidationClasses`) for non-drag callers.
- `findSnapTarget` gains an optional `HandleIndex` param; the connect-drag and reconnect gestures thread a gesture-scoped index, built at gesture start and cleared on every end/cancel path.

### Workstream B — small measured wins
Two low-risk perf touch-ups surfaced by the schema-scale review. Both are pure performance changes — label positions and node ordering are behaviourally identical.

**Performance**
- Edge labels cache the path length keyed by the `d` attribute. Positioning a center/start/end label previously forced `SVGPathElement.getTotalLength()` up to 5× per edge per effect run (including once inside the center-label helper); the length is now measured at most once while `d` is unchanged, so selection- and label-only re-runs skip the repeated `getTotalLength` measurement (the per-label `getPointAtLength` placement still runs). A changed path re-measures.
- `addNodes` keeps the `nodes` array identity for flat batches. Appending nodes without a `parentId` no longer re-sorts and reassigns `nodes`, so the array reference is stable and effects that read it don't invalidate on every add. A batch that includes a child — or whose flat node is the parent of a child added in an earlier call (a forward reference) — still sorts topologically, now in place via `splice`, so array identity is preserved even then. Topological ordering stays identical to the previous behaviour in every case.

### Workstream C — shared router + dirty-corridor invalidation

Builds on Workstream 4. Where WS4 made a single route fast, WS C stops the *whole graph* from redoing obstacle work on every commit: obstacles are built once per geometry commit and shared across edges, and a node move re-routes only the edges whose corridor it actually affects. Routing itself (path selection, cost, tie-breaking, appearance) is unchanged — this is purely a speed pass.

**Performance**
- Avoidant/orthogonal edges no longer each rebuild an obstacle array from the full node list on every effect run. A new `_commitNodeGeometry()` builds the obstacle geometry **once per geometry commit** into a shared, non-reactive `_obstacleSnapshot` and maintains a `SpatialGrid`; each edge just filters the shared snapshot for its own endpoints. Bench (`npm run bench`, chromium): obstacle construction for a full-graph pass of 50 nodes × 100 edges is **4.23× faster** (8.0k → 33.9k ops/s).
- **Dirty-corridor invalidation.** A geometry commit dirties only the edges a changed node can actually affect — those that touch it (source/target) or whose last-routed corridor (endpoint bbox ± `CORRIDOR_MARGIN`, the same margin the router uses to prune obstacles) contains the node's old or new rect. The per-edge `_edgeDirtyTicks` signal is key-scoped, so on commit paths that do **not** also re-measure handles (`addNodes` / `removeNodes` / ResizeObserver / programmatic moves) an unaffected edge's effect does not run at all — moving one corner node among 100 spread-out edges dirties **1** edge, not 100. Node **drag-end** additionally bumps `_layoutAnimTick` for handle re-measurement, so there every edge's effect still runs, but only corridor-affected edges recompute a route; the rest resolve from the value-keyed route cache without pathfinding. Combined with the shared snapshot (which removes the per-edge obstacle rebuild), drag-end is far cheaper than before even though it is not selective at the effect level.
- The `_layoutAnimTick` signal is retained purely for handle re-measurement during layout animation; it no longer doubles as the whole-graph routing trigger.

**Breaking / Behavior Changes**
- **Hidden nodes are no longer treated as routing obstacles.** A `hidden` node previously still deflected other edges' avoidant/orthogonal routes even though it (and its own edges) were not rendered; it no longer does, so a route passing where a hidden node sits may differ. This is the only route-appearance change in the workstream — all other routes are unchanged (the router's value-keyed cache hits on the identical obstacle set and order).
- The dirty-corridor guarantee is exact on the router's primary (corridor-pruned) path. A far obstacle that only participates via the router's full-set retry path, moved by a programmatic mutation that does not bump `_layoutAnimTick`, may not re-route a distant edge until the next tick — the same non-reactive-obstacle caveat class as Workstream 4. Interactive gestures still bump the tick and re-measure all edges.
- During a live resize or reorder drag, other edges' obstacle geometry reflects the last *committed* node positions and refreshes at commit cadence (ResizeObserver commits per frame during resize; reorder commits at drag-end) rather than on every pointermove. Routes converge exactly at rest; only the transient in-gesture avoidance may lag by a frame (resize) or until drop (reorder).

**Infrastructure**
- `flow-canvas`: non-reactive `_obstacleSnapshot` (mutated in place across commits to keep its reactive identity stable) + `_spatialGrid` (`SpatialGrid`), reactive `_obstacleEpoch`, and `_commitNodeGeometry(changedNodeIds?)` wired at every geometry commit point (node drag-end, reorder/reparent, ResizeObserver dimension write, `addNodes` / `removeNodes`, undo/redo, `fromObject`, and once at init).
- Per-edge dirty tracking: reactive key-scoped `_edgeDirtyTicks` + plain `_edgeCorridors`, driven by `_markDirtyEdges(changedNodeIds?, prevSnapshot?)`. Stale entries are pruned in `removeEdges`, in `removeNodes` (cascade edge removal), and on full invalidation (undo/redo/`fromObject`).
- `CORRIDOR_MARGIN` is now exported from `edge-paths/orthogonal.ts` so the invalidation corridor and the router's obstacle pruning share one constant.

### Workstream D — interaction degradation + zoom LOD

Builds on Workstream C. Where WS C stops unaffected edges from re-routing, WS D degrades edge *fidelity* while it can't be perceived anyway — during a drag and at low zoom — so dense avoidant graphs stay responsive under interaction. Both mechanisms reuse WS C's committed-geometry pipeline (`_commitNodeGeometry` re-routes properly on drop) and the existing bucketed `_zoomLevel`.

**Breaking / Behavior Changes**
- **`avoidantSimplifyOnDrag` — new, defaults to `true` (ON).** While a node is being dragged, avoidant/orthogonal edges that touch it skip pathfinding and render as a simplified bezier curve for the duration of the gesture, then re-route properly on drop (via WS C's `_commitNodeGeometry`). This is a visible in-gesture appearance change: an edge touching a dragged node curves/straightens while the drag is in flight and snaps back to its routed path on release. Set `avoidantSimplifyOnDrag: false` to keep full pathfinding on every drag frame (the previous behaviour).

**Performance**
- Dragging a node no longer runs avoidant/orthogonal pathfinding for its incident edges on every pointermove — the router falls back to its empty-obstacle bezier fast path for the gesture. A new reactive `_draggingNodeIds` Set is read key-scoped (`.has(edge.source)` / `.has(edge.target)`), so only edges actually touching a dragged node re-run when the drag begins or ends; group-drag members are included so their edges degrade too. (Task D1)
- **Opt-in zoom-level LOD (`edgeLod: { simplifyAt: 'far' | 'medium' }`, default off).** When set, edges render as a plain straight line once the viewport zoom bucket is at or below `simplifyAt`, skipping pathfinding and curvature at zoom levels where the detail isn't legible. Endpoint measurement is unaffected; markers, labels and CSS classes keep the edge's configured type — only the path geometry simplifies, and the label anchor follows that simplified path. It reads the already-bucketed reactive `_zoomLevel`, so an edge recomputes only when a zoom *threshold* is crossed, not on every wheel tick. When `edgeLod` is unset the edge effect never reads `_zoomLevel`, so the default render gains **zero** new reactive dependencies. (Task D2)

**Infrastructure**
- `flow-canvas`: reactive `_draggingNodeIds: Set<string>`, populated in `flow-node` `onDragStart` (dragged node + group-drag members) and cleared unconditionally on drag end; the clear and the geometry commit coalesce into a single reactive flush so affected edges re-route exactly once with the final geometry. Also pruned when a dragged node is removed (`removeNodes`) or its directive is torn down mid-gesture, so an interrupted drag (e.g. a collaborator deletes the node, or the node unmounts) can't strand an id and pin a later re-added/undo-restored node's edges to the simplified path.
- New config flags `avoidantSimplifyOnDrag?: boolean` and `edgeLod?: false | { simplifyAt: 'far' | 'medium' }` on `FlowCanvasConfig`.

### Workstream E — viewport culling overhaul

Reworks viewport culling from an opt-in, per-frame full scan into a grid-backed, transition-only mechanism that also culls edges — and turns it on automatically at scale. Builds on Workstream C's `SpatialGrid`.

**Breaking / Behavior Changes**
- **`viewportCulling` default changes from `false` to `'auto'`.** Culling now turns on automatically once the canvas reaches `cullingAutoThreshold` nodes (default **150**); below that it stays off. This is a default-behavior change: large diagrams that previously rendered every node/edge now cull off-screen ones out of the box (off-screen nodes and edges get `display: none`). `viewportCulling: true` still forces culling on at any node count and `viewportCulling: false` still forces it off — set `false` to restore the previous always-render behaviour. `cullingBuffer` is unchanged.
- **Edges are now culled too.** Previously culling only toggled nodes despite documenting "nodes and edges"; an edge's `<svg>` is now hidden when both its endpoints are off-screen *and* its last-routed corridor doesn't intersect the viewport (edges with no recorded corridor are never hidden — conservatively visible).

**Performance**
- **Transition-only display writes.** Culling no longer writes `el.style.display` unconditionally every viewport frame; a node/edge is written only when it actually crosses the visible/off-screen boundary (guarded by its current inline `display`), eliminating the per-frame mutation-record churn devtools amplifies.
- **Grid-backed visibility queries.** The per-frame candidate set comes from `_spatialGrid.query(bounds)` (Workstream C's committed-geometry grid) instead of scanning all nodes and running `getAbsolutePosition` per node every frame. The expensive geometry predicate now runs only over the on-screen candidate set; the visible set is byte-identical to the previous linear scan (verified by a 200-node × 20-viewport parity oracle). A node mid-drag is unioned in from the reactive `_draggingNodeIds` set (Workstream D) so its stale committed grid cell never causes it to be culled while dragged into view.

**Fixed**
- Hidden nodes are now kept in the `SpatialGrid` (they were already excluded from the routing obstacle snapshot and remain so). Because culling sources its candidates from the grid and filters `hidden` itself, a node un-hidden *between* geometry commits (group expand, wire `showNode`) is re-shown correctly instead of being stranded off the candidate set. (Refines Workstream C's `_commitNodeGeometry`: the grid now indexes every node; only the obstacle snapshot excludes hidden nodes.)
- A node that is off-screen at the first cull pass — or added off-screen while culling is active — is now hidden. The node write syncs every registered element to the computed visible set (mirroring the edge loop) rather than only diffing against the previous frame, so a node present in neither the visible nor the previous set is no longer left rendered.
- Edge culling no longer fights the hidden/collapse effect: culling skips edges hidden via `hidden`/`_hiddenByCollapse`/hidden-endpoint (which `flow-viewport` renders with inline `display:none`), so a hidden or collapsed edge is not un-hidden when its corridor or endpoint pans into view, and `_uncullEverything` restores only culling-hidden edges.

**Infrastructure**
- `flow-canvas`: `_applyCulling` gated by `viewportCulling ?? 'auto'` + `cullingAutoThreshold ?? 150`; new `_uncullEverything()` restores display on all tracked elements and resets the tracking sets when culling deactivates (threshold drop or config change), tracked via `_cullingWasActive`. New plain `_culledEdgeIds` set (rebuilt each frame, so removed edges can't leak entries).
- New config fields `viewportCulling?: boolean | 'auto'` and `cullingAutoThreshold?: number` on `FlowCanvasConfig`; `docs/configuration/viewport.md` and `docs/canvas/viewport.md` updated for the new default.

### Workstream F — delegated handle pointer listeners

Replaces the per-handle `pointerdown` listener with a single delegated listener per canvas. A schema graph at Draftsman scale carries ~5,000 handles, so the old scheme registered ~5,000 listeners at mount and re-registered them on every schema row re-stamp.

**Breaking / Behavior Changes**
- **`flowCanvas.destroy()` now actually runs — its entire body executes for the first time.** Mixins are applied onto the canvas data object with `Object.defineProperties`, and the animation mixin exposed a method named `destroy()`, which silently OVERWROTE the canvas's own. The whole ~140-line teardown has been dead code since `9855d68`. The animation mixin's method is now `_destroyAnimations()` and the canvas's `destroy()` calls it, so both run. **Treat this as a behavior change, not just a bug fix:** the following now happen when a canvas is destroyed, where previously *nothing* did.
    - The `flow-destroy` DOM event fires and **`config.onDestroy` is invoked.** Apps that already pass an `onDestroy` (or listen for `@flow-destroy`) will see it run for the first time — code in it that was never exercised now is.
    - **`document.exitFullscreen()` is called** if the canvas being destroyed is the one holding fullscreen.
    - **`$store.flow` no longer retains dead canvases.** `unregister()` now runs, so destroyed canvases stop accumulating in the store for the life of the page. `$store.flow.activeId` is nulled when the active canvas is destroyed (it previously kept pointing at a dead canvas indefinitely; it does not yet promote a surviving canvas in its place).
    - **The wire-bridge's `$wire.on` listeners are unregistered.**
    - The global `keydown` listener, every container listener, `_panZoom`, `_minimap`, `_controls`, `_selectionBox`, `_lasso`, `_announcer`, the shared `ResizeObserver`, the collab bridge/awareness, and the delegated handle listener are all disposed.
- **The canvas does NOT destroy a caller-supplied collab provider.** `destroy()` disposes only what the canvas itself constructed — the collab bridge, the awareness instance and the cursor layer. `config.collab.provider` was constructed by the app and handed in, so the app owns it: a provider shared by two canvases survives one of them being destroyed. If you want the provider torn down with the canvas, destroy it yourself. (An explicit `ownsProvider` opt-in may be added later.)

**Performance**
- **One `pointerdown` listener per canvas instead of one per handle.** Installed on `.flow-viewport` in the capture phase at canvas init; it resolves the pressed handle with `closest('[data-flow-handle-type]')` and starts the same connect / reconnect gesture the per-handle listener used to. Mount and re-stamp no longer pay a listener registration per handle. Keyboard/a11y bindings, hover affordances and click-to-connect stay per-handle — the delegation covers `pointerdown` only.

**Behaviour note — the one semantic delegation does not preserve**
- A source handle now stops the event during the CAPTURE phase at the viewport, so the `pointerdown` never reaches the handle element or its descendants. Previously the handle's own target-phase listener called `stopPropagation()` (not `stopImmediatePropagation()`), so listeners ON the handle and on its children still fired. **If you put your own `pointerdown` listener on markup inside a source handle, it no longer fires.** Move it outside the handle, or set `delegatedHandleEvents: false`. This is inherent to the capture-phase placement, which is what keeps a handle press from also dragging the node or reordering a schema row.

**Infrastructure**
- New `src/plugin/handle-delegation.ts` exporting `installHandleDelegation(rootEl, canvas)`; the canvas installs it in `_initHandleDelegation()` and tears it down in `destroy()`. Handle ownership is discriminated on the canvas root (`.flow-container`), so a nested canvas is never driven by its parent's listener while a handle inside a nested plain `[x-data]` scope within a node still works normally.
- The two pointerdown bodies are extracted to module scope in `flow-handle.ts` as `startSourceHandlePointerInteraction` / `startTargetHandlePointerInteraction`, behind the `startHandlePointerInteraction` dispatcher. Behaviour is unchanged, including the deliberate source/target propagation asymmetry (a target handle with no reconnectable edge still falls through to the node drag) and the capture-phase ordering that keeps an active whiteboard tool ahead of the handles.
- New config `delegatedHandleEvents?: boolean` (default `true`). Set `false` to restore the per-handle listeners. Read once at init; not runtime-patchable. Documented in `docs/configuration/connections.md`.
- If the canvas has no `.flow-viewport`, the listener falls back to `.flow-container` and now emits a `debug('init', …)` line — that fallback loses the whiteboard-tool capture-ordering guarantee, so it should be diagnosable rather than silent.
- The delegated listener follows a REPLACED viewport. `x-flow-viewport` registers its element through the new `_registerViewportEl()`, which re-binds the listener if it is currently installed on a different element. The listener otherwise stays on the detached original and every handle in the canvas goes silently inert — delegation removed the safety net that used to cover this (per-handle listeners re-attached on every re-stamp).
- `destroy()` is hardened at its one USER-callback boundary: a throwing `onDestroy` / `formatAnnouncement` is caught and logged instead of escaping. Alpine invokes `destroy()` unwrapped inside `cleanupAttributes()`, so a throw there aborts Alpine's own cleanup loop mid-way — the remaining directive `undo()`s never run and `_x_dataStack` leaks.
- New architecture test (`canvas-mixin-shadowing.test.ts`) asserts that no mixin key collides with a `flowCanvas` own-property key. This is the class of bug that hid `destroy()` for so long: the merge is last-write-wins, and TypeScript cannot see the collision because the mixins are separate objects. It intercepts the real `Object.defineProperties` merge rather than duplicating the mixin list, so it cannot drift.
- The init-time canvas lookup in `flow-handle.ts` is hoisted and shared. `getCanvas()` costs a `closest('[x-data]')` plus an `Alpine.$data()` (which mints a fresh `mergeProxies` Proxy); it was being paid up to three times per handle at init, i.e. ~15,000 times at Draftsman scale. The pointer gestures still resolve the canvas fresh on every press.
### Workstream G — state-derived schema handle geometry

A schema edge's endpoints are now DERIVED from state rather than MEASURED from the DOM. `x-flow-schema` renders uniform rows, so once the header/row/handle geometry is measured once per canvas (`SchemaMetrics`), every field handle's center is arithmetic on the node's `position` / `dimensions` / `fields` — no `getBoundingClientRect`, no `querySelectorAll`. Endpoints land in exactly the same place: the legacy DOM path stays untouched as both the fallback and the parity oracle, and a jsdom parity suite plus a real-Chromium one assert the two paths render byte-identical `d` attributes. Routing, path selection and appearance are unchanged.

**Added**
- **`schemaHandleGeometry: 'auto' | 'dom'` — new, defaults to `'auto'`.** `'auto'` derives schema-edge endpoints from state; `'dom'` restores the legacy per-edge handle measurement as an escape hatch (for layouts whose rows aren't uniform or aren't rendered by `x-flow-schema`). Endpoints are identical either way — only how they are computed changes.

**Behavior / Fallback contract**
- The fast path applies only when **every** condition holds for **both** endpoints: the edge names a `sourceHandle`/`targetHandle` that matches a `data.fields` entry EXACTLY, both nodes are rendered by `x-flow-schema` (stamped `data-flow-schema-node`), both carry finite measured `dimensions` whose height reproduces the uniform-row model, and neither is `hidden`, `collapsed`, `condensed`, `rotation`-transformed, viewport-culled (`display: none`), nor carrying a non-default `nodeOrigin` (per-node **or** canvas config — the node's own value wins, and `getAbsolutePosition` never folds it in for a root node, so its `position` would not be its painted top-left). Anything else silently falls back to DOM measurement per endpoint. Correctness is never traded for the rect saving.
- A viewport-culled endpoint is DELIBERATELY declined rather than "fixed": the DOM path degrades on a culled node (0×0 handle rect ⇒ node-edge midpoint), and the state path matches that degradation exactly so no edge crossing the culling boundary changes where it lands.

**Changed (alpha-breaking)**
- **The exported `SchemaMetrics` type gained required fields.** It now carries `insetLeft` / `insetRight` / `insetTop` / `insetBottom`, `rowHeightLast`, `handleOffsetY`, `handleOffsetYLast`, and `handleWidth` / `handleHeight`; `rowHeight` is now a row **STRIDE** (one row's top to the next row's top), not a row height. Anyone constructing a `SchemaMetrics` by hand must update — reading `canvas._schemaMetrics` is unaffected.

**Fixed**
- **The last schema row was 1px shorter than the others, and nothing modelled it.** `theme-default.css` gives `.flow-schema-row` a `border-bottom` and drops it again on `:last-child`, so inferring row geometry from a single row height overshot every schema node's real border box by that border. Row geometry is now MEASURED (stride + final-row height + handle offsets) instead of inferred. The same measurement corrects a 0.5px handle-center offset on every NON-final row: `.flow-schema-handle` is `top: 50%`, which resolves against the row's PADDING box, so the row's border-bottom pulls the handle center half a border above the row's box center. (Both were invisible to jsdom, which has no cascade to get wrong; the real-browser parity test caught them.)

**Performance**
- A 100-edge schema measurement pass is **2.3–3.7× faster** (real-Chromium bench, `tests/bench/schema-handle-geometry.bench.ts`: 50 schema nodes × 6 fields, 100 edges, measurement phase only) — 2.32× on a warm layout tree, 3.67× when the whole node layer has moved and the rect reads would force a reflow. The fast path performs **zero** `getBoundingClientRect` calls (asserted in the parity suite), where the DOM path does ~12 rect reads + 4 `querySelectorAll` per edge. Honest framing: this is not the order of magnitude the plan projected — on a warm tree Chromium's rect reads are cheap and the DOM path's cost is dominated by its `querySelectorAll` calls; the ratio widens only when the layout tree is genuinely dirty, which is the case the fast path exists for.

**Infrastructure**
- `SchemaMetrics` moved to `core/types` (keeping `core` free of plugin imports); new pure `core/schema-geometry.ts` (`schemaFieldIndex`, `computeSchemaHandlePoint`). `x-flow-schema` measures `canvas._schemaMetrics` once per canvas — deferred out of the render effect via `Alpine.nextTick`, from the first schema node rendering **≥2 rows** (a row stride needs two rows), and invalidated on `colorMode` change. Edges consume it and upgrade from the DOM path to the fast path one tick after the first schema render.

### Workstream — avoidant routing quality: detours (WS-1)

Improves `avoidant` (and `orthogonal`) route **quality** without changing route length. The
router's Dijkstra now runs over `(vertex, arrival-axis)` state and orders routes
**lexicographically**: primary Manhattan length (unchanged — never traded), secondary a
`bend + corridor-deviation` cost. Among equal-length routes it now picks the one with the
fewest corners that stays closest to the direct corridor, deterministically. This is an
**always-on** quality change (no config); endpoints, obstacle avoidance, fallback behavior,
and route length are unchanged.

- Route cache key is now versioned by the cost constants so tuned/config-driven cost can't
  return stale cached routes.

### Workstream — avoidant routing quality: endpoint bundling (WS-2)

New opt-in `avoidantEndpointSpread` (canvas `boolean | { spacing }`, default off) with a
per-node `endpointSpread` override. When on, edges sharing an endpoint handle (e.g. many FKs →
`users.id`) fan across that handle's **row extent** into deterministic lanes ordered by the
opposite endpoint's position, instead of stacking on the exact centre. **Row height never
changes** — a fan wider than the row condenses to fit. Off (the default) is byte-identical to
WS-1; a single-edge handle is untouched even when on. Lanes are computed once per commit
(`_computeEndpointGrouping`, mirroring the obstacle snapshot) and only the re-laned edges
re-route.

## v0.2.1-alpha — 2026-04-14

> Companion release: [WireFlow v0.2.1-alpha](https://github.com/getartisanflow/wireflow/blob/main/CHANGELOG.md#v021-alpha--2026-04-14) ships the matching server-side surface (`<x-schema-designer>`, `WithSchemaDesigner`, validator rules, `@connect-validate` bridge) plus the post-Phase-5 `<x-flow>` / `<x-schema-designer>` polish that pairs with the fullscreen + row-select + cascade fixes below.

Tier A — measurement & layout lifecycle. Builder-focused improvements that eliminate the root cause of stale-measurement workarounds and make AlpineFlow reactive to real dimensional changes.

### Added
- `x-flow-schema` directive — renders a schema node (header + labelled field rows + per-row target/source handles). Accepts `node.data.label` and `node.data.fields: FlowSchemaField[]`. Decorations for primary / foreign / required fields ship in the default theme.
- New public types `FlowSchemaField` and `SchemaNodeData` exported from the top-level package.
- Shared `ResizeObserver` on the canvas — `node.dimensions` stays in sync with rendered content (A1)
- `canvas.batch(fn)` / `$flow.batch(fn)` suspends layout reconciliation during bulk mutations; ref-counted, throw-safe, forwards fn's return value (A6)
- Reactive `childLayout` property watchers — mutating `columns` / `gap` / `padding` / `headerHeight` / `direction` / `stretch` triggers re-layout automatically (A3)
- `addNodes` now lays out affected parent containers, consistent with `removeNodes` (A4)
- Optional `FlowNode` properties: `fixedDimensions`, `resizeObserver`; clarified semantics for pre-existing `minDimensions` / `maxDimensions` as `Partial<Dimensions>` clamps applied by the observer (A2 + A5)
- Cross-frame loop safety net — a parent laid out in >5 consecutive frames is suppressed with a `console.warn` until the next user mutation clears the counter

### Changed (alpha-breaking)
- Leaf nodes (no `childLayout`, no `fixedDimensions`) no longer receive inline `style.height` — content drives their height. Set `fixedDimensions: true` to restore the old behavior.
- Layout dedup: at most one `layoutChildren` per parent per animation frame. Tests that counted duplicate layouts for the same mutation should expect lower counts.
- Resize drag, `compute()` output, and animation of `dimensions.height` now auto-promote affected nodes to `fixedDimensions: true` (system-authoritative height writes).

### Infrastructure
- New `canvas-layout-dedup.ts` primitive with RAF-aligned `safeLayoutChildren`
- New `canvas-batch.ts` — ref-counted suspend/resume wrapper
- New `clamp-dimensions.ts` pure utility for min/max clamping

### Benchmark
500-node canvas, mean ms (baseline → post-Tier-A):
- initial mount: 71.2 → ~75 (~+5%)
- add 50 nodes: 92.5 → ~97 (~+5%)
- drag 100 steps: 75.0 → ~76–85 (high variance, flat on average)

All within the no-regression target. See [migration guide](docs/migration/v0.2.1-alpha.md) for full details.

---

Tier B — DOM utilities, drag-and-drop DX, and edge defaults.

### Added
- `canvas.getNodeElement(id)` — returns the DOM element for a node by ID (B2)
- `canvas.getNodeIdFromElement(el)` — resolves the node ID from a DOM element within a node (B2)
- Enhanced drop zone: `dropMimeTypes` canvas config, deepest-container detection for nested groups, `.flow-canvas-drag-over` class while a drag is active, `getNodeAtPoint(x, y)` utility (B3)
- `.flow-node-dragging` class auto-applied to the node element during drag; removed on drop (B4)
- `defaultEdgeType` canvas config — sets the default edge type for all runtime-created connections (B5)
- `edge.class` forwarded to the edge label element in addition to the path element (B6)

### Changed
- `text-align: center` on node content moved from structural CSS to the default theme — custom themes that relied on the structural rule must add it explicitly (B1, alpha-breaking)

---

Tier C — type attributes, auto-layout scoping, and connection rules.

### Added
- `data-flow-node-type` attribute applied to node DOM elements, reflecting `node.type` (or `'default'`) (C1)
- `connectionRules` canvas config — declarative type-based connection filtering; each rule specifies allowed source/target type pairs (C4)

### Changed (alpha-breaking)
- Auto-layout (`layout()`, `forceLayout()`, `treeLayout()`, `elkLayout()`) excludes parented nodes (children) by default. Pass `{ includeChildren: true }` to the layout call to restore the previous behavior. (C2)

### Fixed
- `fitView` vertical centering regression guard — no behavioral change, prevents an off-by-one when `ready` fires before the viewport height is measured (C3)

---

Tier D2 — first-class node run state.

### Added
- `node.runState` reserved property: `'pending' | 'running' | 'completed' | 'failed' | 'skipped'` (D2)
- `.flow-node-{state}` CSS classes auto-applied when `runState` changes (`flow-node-pending`, `flow-node-running`, etc.) (D2)
- Theme defaults for run states: `running` → pulse animation, `failed` → flash animation, `skipped` → dim (D2)
- `$flow.setNodeState(id, state)` helper — sets `node.runState` and updates DOM classes (D2)
- `$flow.resetStates(ids?)` helper — clears `runState` on all nodes (or specified IDs) (D2)
- Wire-bridge commands: `flow:setNodeState`, `flow:resetStates` (D2)

---

Workflow addon — `@getartisanflow/alpineflow/workflow` subpath.

### Added
- New `@getartisanflow/alpineflow/workflow` subpath export with a tree-shakeable workflow execution engine
- `$flow.run(options)` execution helper: resolves the graph from a start node, invokes per-node handlers, supports configurable pacing (delay between steps), and exposes `pause()`, `resume()`, and `stop()` controls
- `flow-condition` node type: 10 declarative comparison operators (`equals`, `notEquals`, `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual`, `in`, `notIn`, `exists`, `matches`) with dot-path traversal for nested data access
- `flow-wait` node type for introducing configurable delays in execution
- **Parallel branches** — when a node has multiple outgoing edges and no `pickBranch` handler selects a single one, all branches execute concurrently via `Promise.all`. A shared visited Set prevents fan-in nodes from running twice
- **`$flow.replayExecution(log, options)`** — replays a recorded execution log with scaled timing, re-applying node states, edge classes, and particles. Returns a `ReplayHandle` with `pause()`, `resume()`, `stop()`, and `finished` promise. Named `replayExecution` to avoid collision with the core animation `replay()` method
- **Auto-skip** — when a run completes, any unvisited node is automatically set to `runState: 'skipped'` for visual feedback
- **Auto-reset** — `$flow.run()` clears all node states, edge classes, and the execution log before each run
- **`$workflowRun` Alpine magic** — lets any Alpine scope invoke `$flow.run()` on the nearest canvas without DOM traversal. Searches up (ancestor), then down (descendant), then `document.querySelector`
- `particleOptions` run option — passed through to `sendParticle()` for renderer/color/size/duration customization
- Edge state CSS classes: `.flow-edge-entering`, `.flow-edge-completed`, `.flow-edge-taken`, `.flow-edge-untaken`, `.flow-edge-failed` — applied automatically during `$flow.run()` execution
- `$flow.executionLog` reactive array — records each step's node ID, state, timestamp, and output as execution progresses
- `$flow.resetExecutionLog()` helper — clears the execution log
- Generic addon setup callback mechanism: `registerAddon({ setup(canvas) { … } })` for attaching custom behavior to any canvas instance
- `pickBranch` returning `null` now falls through to default behavior (parallel if multiple edges, linear if one) instead of stopping traversal

---

### Fixed (late — landed after initial Tier A entry)
- `ResizeObserver` now reads border-box dimensions instead of content-box — fixes `fitView` over-zooming on nodes that have CSS padding or border (the node appeared smaller to the algorithm than it rendered)
- A2 "parent via `parentId`" is now treated as a third container signal alongside `childLayout` and `fixedDimensions` — fixes group nodes that use `parentId` without `childLayout` losing their explicit height after measurement
- `classList.add` on edge elements now splits space-separated `class` strings before applying — fixes multi-class values being applied as a single token (e.g. `class: 'foo bar'` now adds two classes instead of one invalid class)

---

Core polish — schema primitive async validation + a11y + edge rendering.

### Added
- `connectValidator` now wires into the edge-reconnect paths (both handle-pip drag and edge-body drag) — moving an edge endpoint now runs through the same server-gated validator as creating a new connection
- `.flow-connect-line--validating` class pulses on the live drag line during async validator awaits (marching-ants affordance while a server round-trip is pending)
- `flow-connect-rejected` DOM event dispatched on the canvas container whenever a validator chain rejects, with `{source, target, sourceHandle, targetHandle, reason}` detail; plus a `console.warn('[alpineflow] connection rejected: <reason>')` for dev discoverability when no toast UI is wired
- `canvas.collapseBidirectionalEdges: true` option collapses reciprocal edge pairs (A→B + B→A) into a single path with markers at both ends; both edges remain in `canvas.edges` — only rendering changes
- `canvas.keyboardConnect: true` option — opt-in keyboard drag-to-connect. Source + target handles become focusable (`tabindex="0"`, `role="button"`, `aria-label`). `Enter`/`Space` on a focused source handle arms a pending connection (with `.flow-handle-connect-pending` outline); `Enter`/`Space` on a target handle completes it through the same validator pipeline; `Escape` on the canvas cancels
- `PendingKeyboardConnect` internal state type, added to the canvas context alongside `_pendingConnection` / `_pendingReconnection`

### Docs
- New `docs/guides/connect-validator.md` — complete reference for the async validator hook, including DOM event detail shapes, CSS hooks, WireFlow `@connect-validate` bridge, and sync-vs-async decision guidance

---

Schema addon — `@getartisanflow/alpineflow/schema` subpath.

### Added
- New `@getartisanflow/alpineflow/schema` subpath export — generic typed-field schema designer helpers (ERDs, API shapes, GraphQL, TypeScript, event contracts, form configs)
- Field CRUD helpers attached to the canvas scope when the plugin registers:
  - `addField(nodeId, field)` — append with name validation (`/^[a-z][a-z0-9_]*$/` + max 40 chars) and silent duplicate rejection
  - `renameField(nodeId, oldName, newName)` — rewrite plus automatic edge-handle cascade
  - `removeField(nodeId, fieldName)` — drop plus cascade-drop of edges touching the handle
  - `reorderFields(nodeId, orderedNames)` — permutation with explicit duplicate + mismatch guards
  - Every helper returns `{applied, reason}` — silent fail, never throws
- Event surface dispatched on the canvas container:
  - `schema:field-added` `{nodeId, field}`
  - `schema:field-renamed` `{nodeId, oldName, newName, cascadedEdgeIds}`
  - `schema:field-removed` `{nodeId, fieldName, droppedEdgeIds}`
  - `schema:edges-cascaded` `{nodeId, fieldName, edgeIds, operation: 'rename' | 'remove'}`
- `canvas.inferReferences()` — conservative pattern-match helper: scans `<stem>_id` fields, emits `ReferenceSuggestion[]` against nodes whose id equals the stem. No self-references, no pluralization heuristics
- `canvas.schemaToJSON()` / `canvas.schemaFromJSON(json)` — stable graph serialization with `version: 1` throw-on-mismatch; `schemaFromJSON` uses `splice` to preserve Alpine reactivity on the live array refs
- Three-scope inspector Alpine directives — `x-schema-node-inspector`, `x-schema-row-inspector`, `x-schema-edge-inspector`. Each exposes `inspector` + `selectedNode`/`selectedRow`/`selectedEdge` to the subtree via `Alpine.addScopeToNode`. Opt-in default UI via `<template x-schema-default-ui>` child; absent template = host children are sovereign
- `selectedRow` model: `"nodeId.fieldName"` dot-format (matches the existing canvas `selectedRows` Set convention)
- Public types: `FlowSchemaField`, `SchemaNodeData`, `ReferenceSuggestion`, `SchemaGraphJSON`, `AddFieldOptions`, `RenameFieldResult`, `RemoveFieldResult`, `ReorderFieldsResult`

### Docs
- New `docs/addons/schema.md` — full addon API reference with install, examples, CRUD signatures, event table, inference + serialization, inspector directives, and WireFlow forward reference

---

Polish — fullscreen, row-select integration, CSS cascade.

### Added
- **Fullscreen support** — `canvas.toggleFullscreen()` + reactive `isFullscreen` flag. Built-in controls panel renders a fullscreen toggle button when `controls: true`. Fires `flow-fullscreen-change` CustomEvent on the container. Target element defaults to `.flow-container`; overridable via the new `fullscreenTarget` config (below). (`dfa963e`)
- **`fullscreenTarget` canvas config** — accepts a CSS selector (resolved via `closest()` with `querySelector()` fallback), an `HTMLElement`, or a resolver function `(container) => HTMLElement`. Useful when a page wraps the canvas + ancillary UI (inspectors, toolbars) that should stay visible in fullscreen. (`54bafe7`)
- **`x-flow-row-select` auto-stamped on schema rows** — the `x-flow-schema` directive now stamps `x-flow-row-select="'<nodeId>.<fieldName>'"` on each row it generates, using the same `selectedRows` Set the addon's row-inspector scaffolding reads from. Previously the row-scope inspector had no data source for schema nodes. (`9d3f6da`)
- **Outside-canvas inspector scope resolution** — `findCanvasScope()` now resolves `.flow-container` specifically (with ancestor-first + single-canvas-on-page fallback) so schema inspector directives work whether they live inside the canvas OR in a page-level sibling layout (e.g., a right-side panel outside the flow). Multi-canvas pages with outside inspectors get a one-shot warn. (`f56b79e`)

### Fixed
- **`.flow-container` defaults wrapped in `:where()`** — zero-specificity declarations at `css/structural.css` for `--flow-container-height`, base positioning, and default CSS variables. Consumer rules like `.my-wrapper .flow-container { height: 100% }` now win cleanly at `(0,2,0)` instead of source-order-tying with the element's own `(0,1,0)` rule. (CSS variables declared on the element itself still override ancestor values — that's a CSS inheritance rule, not a specificity one.) (`cfa6f47`)

### Docs
- New `docs/guides/fullscreen.md` — complete reference for the fullscreen API, including `fullscreenTarget` config forms, CSS hooks, DOM events, browser support, and common wrapper-ancestor patterns
- `docs/addons/schema.md` — short "Row selection" note documenting the auto-stamped `x-flow-row-select` on schema rows

---

Schema addon Phase A+B — validation, diff, layout, history, reorder, keyboard nav.

### Added (Phase A pure additions)
- **Extended field metadata** — `FlowSchemaField` gains optional `description`, `deprecated`, `tags[]`, `defaultValue`. Type-only; consumer templates render via slot overrides. (`97cb5ea`)
- **Node `kind` discriminator** — optional `SchemaNodeData.kind: string` stamps `data-flow-schema-kind="..."` on the node element for CSS theming (e.g., 'entity' | 'query' | 'enum'). (`97cb5ea`)
- **`canvas.validateSchema()`** — structured issue list: `{severity, code, nodeId?, fieldName?, edgeId?, message}[]`. Codes: `dangling-edge`, `missing-primary-key`, `duplicate-field`, `duplicate-node-id`, `disconnected-node`, `cycle`. (`fbe6f87`)
- **`canvas.diffSchemas(before, after, opts?)`** — computes structured deltas between two `SchemaGraphJSON` snapshots: added/removed/renamed nodes, added/removed/renamed fields, changed types, added/removed edges. Supports consumer field-rename hints + optional node-rename heuristic. (`2ecbdd7`)
- **`canvas.toDot(opts?)`** — graphviz DOT exporter with HTML-like table node rendering, configurable rankdir, optional PK/FK markers, optional type column. (`91eea23`)
- **`fieldTypeRegistry` canvas option** — optional `string[]` that swaps the inspector default-UI "Add field" type input for a `<select>` populated from the registry. Order preserved. (`d2b669b`)
- **`canvas.schemaLayout(opts?)`** — reference-aware layout wrapper. Prefers `canvas.layout()` (dagre) → `canvas.treeLayout()` → grid fallback. Supports `deriveFromReferences: true` to layout by inferred FK graph rather than explicit edges. (`9fc7ccb`)
- **`attachSchemaHistory(canvas, opts?)`** — bounded undo/redo scaffolding. Listens to `schema:*` events, snapshots via `schemaToJSON`, applies via `schemaFromJSON`. Supports `batch(fn)` transactions (rolls back on throw). Opt-in; not auto-attached. Default limit 50 snapshots. (`f631e8f`)

### Added (Phase B interactive additions)
- **`x-schema-reorderable` directive** — drag-to-reorder schema rows. Opt-in via `canvas.rowsReorderable: true` (auto-stamps on x-flow-schema rows) or manual stamping. Commits via `canvas.reorderFields()`. 4px movement threshold + capture-phase click suppression keeps row-select untouched. (`83e1bd2`)
- **Keyboard field navigation** — when `canvas.keyboardConnect: true`, schema rows become focusable (`tabindex="0"`, `role="row"`, live `aria-label`). Arrow Up/Down navigates within a node; Tab / Shift+Tab moves between nodes; Enter/Space selects the focused row; Escape blurs. Natural tab-out at canvas edges. (`ce55a4a`)

### Dist
- Rebuilt `dist/alpineflow-schema.esm.js` with all Phase A+B additions.

---

Follow-up fixes — easy-connect validator, containerHeight config, inspector focus preservation.

### Added
- **`canvas.containerHeight` config** — non-breaking opt-in to override the default 400px container height. Accepts `'auto'` (default), `'fill'` (100% of parent), a number (pixels), or any CSS length string (`'80vh'`, `'calc(100vh - 60px)'`). Sets `--flow-container-height` inline on the canvas element, so it wins over the `:where(.flow-container)` fallback without fighting CSS specificity. (`113c409`)

### Fixed
- **Easy-connect now awaits `connectValidator`** — the alt-drag easy-connect path was bypassing the async validator gate. Refactored to fully delegate to `applyConnectValidation` (same helper used by drag-to-connect, click-to-connect, and both reconnect paths), eliminating ~20 LOC of duplicated sync-chain code. Consumers with `connectValidator` configured now get consistent server-side gating across every connection path. (`0f6dbf9`)
- **Schema inspector preserves input focus across reactive re-stamps** — the default-UI stamping destroyed the focused element on any reactive tick, which could cause rename inputs to blur mid-type. The three inspector directives now capture the focused element's identity (`data-field` + tag + selection range) before teardown and restore it on the rebuilt subtree. (`63ff511`)

---

Workflow addon foundations — validate helper + wait-node directive.

### Added
- `canvas.validateWorkflow()` — pure validator returning `{valid, issues[]}`. Issue codes: `dangling-edge`, `duplicate-node-id`, `missing-condition`, `condition-missing-branch`, `unhandled-source-handle`, `wait-missing-duration` (errors); `unreachable-node`, `cycle` (warnings). Mirrors `validateSchema()` — pure, no mutation, never throws.
- `x-flow-wait` directive — renders the standard wait-node template: header with optional icon, label (defaults to "Wait"), and formatted duration (`500ms` / `2.5s` / `1m 30s`); top target handle and bottom source handle. Reads `node.data.durationMs`, `node.data.label`, `node.data.icon`. textContent only — no innerHTML.
- Structural + theme CSS for `.flow-wait-node` (uses existing theme tokens — no new CSS variables introduced).

---

Workflow addon UI primitives — condition directive + canvas runState + Alpine.data factories.

### Added
- `x-flow-condition` directive — renders the condition-node template with header, pretty-printed expression body, target handle, and labelled `true`/`false` source handles. Honors `node.data.direction` (`'horizontal'` default | `'vertical'`) and the directive expression. Reflects `node.data._branchTaken` via `data-flow-condition-branch-taken` for theme-driven branch decoration. textContent only.
- Branch-taken state in `run.ts`: when a `flow-condition` node picks an outgoing edge, `node.data._branchTaken = chosenEdge.sourceHandle` (`'true'` / `'false'`). Mirrored in `replay.ts` on `edge:taken` events whose source is a condition node so replays produce the same decoration.
- `canvas.resetStates()` extended to clear `_branchTaken` on every condition node alongside the existing runState reset.
- Canvas-level run tracking: `canvas._currentRunHandle: FlowRunHandle | null`, `canvas.runState: 'idle' | 'running' | 'paused' | 'stopped'` (reactive getter), `canvas.stopRun()` (forwards to active handle).
- New `WorkflowRunState` type exported.
- `prettyPrintCondition()` helper — pure utility that turns a `FlowCondition` descriptor into a compact human-readable string. Mirrored on the PHP side by `FlowConditionNode::prettyPrintCondition()`.
- `Alpine.data('flowReplayControls', …)` factory — duck-typed playback toolbar wiring. Auto-binds to `canvas.lastReplayHandle` or lazy-builds `replayExecution(executionLog)`. Capability detection: scrubber when `scrubTo` exists; progress bar otherwise.
- `Alpine.data('flowExecutionLog', …)` factory — dense reactive event-log wiring. Filter modes (`all`/`errors`/`lifecycle`), auto-scroll-while-running, click-to-highlight via `flow:highlight-node` CustomEvent dispatch.
- `Alpine.data('flowRunButton', …)`, `'flowStopButton'`, `'flowResetButton'` factories — read from `runState`, drive `canvas.run` / `canvas.stopRun` / `canvas.resetStates` + `resetExecutionLog`.
- Structural + theme CSS for `.flow-condition-node`, `.flow-replay-controls`, `.flow-execution-log`, `.flow-run-button`, `.flow-stop-button`, `.flow-reset-button` — reuses existing tokens; no new CSS variables.

### Docs
- `docs/addons/workflow.md` extended with condition directive + canvas runState + UI primitive factory reference.

---

Workflow addon — lazy canvas resolution.

### Fixed
- `flowRunButton`, `flowStopButton`, `flowResetButton`, `flowReplayControls`, and `flowExecutionLog` Alpine.data factories now lazy re-resolve their cached `_canvas` reference if a required canvas method is missing at click/getter time. Previously, when a button was rendered as a sibling/ancestor of the `.flow-container` (DOM-order: button before canvas), the button's `init()` cached a stale empty proxy from `Alpine.$data()` and click-time method calls threw `TypeError: this._canvas.run is not a function`. The factories are now tolerant of arbitrary DOM order.
- `flowExecutionLog.filteredEvents` reads from the canvas at getter time instead of caching the source array reference at init — the visible log now stays in sync with the canvas's `executionLog`/sourceExpr regardless of mount order.

---

Audit follow-ups — docs, tests, and internal notes.

### Docs
- `docs/addons/workflow.md` — added an `x-flow-wait` directive section (sibling to the existing `x-flow-condition` directive section). Documents the rendered DOM, the `node.data` shape (`durationMs`, `label`, `icon`), the duration-format table, and the pairing with `flow-wait` workflow nodes.
- `CLAUDE.md` — committed the repo-internal working notes (tech stack, build/test commands, branching rules) for human and AI contributors working inside the package.

### Internal
- `src/plugin/directives/flow-condition.test.ts` — added five error-path tests covering invalid `_branchTaken` values, missing/non-object `condition` shapes, and garbage direction expressions.
- `src/schema/inspector/shared.ts` — `findCanvasScope()` JSDoc now documents the cached-at-init assumption with a forward reference to the workflow addon's `ensureCanvas` pattern for future portal/tab-switched inspector placements.

## v0.1.2-alpha — 2026-04-03

### Fixed
- Removed direct `alpinejs` import from bundle — Alpine is now received through the plugin parameter, making the bundle compatible with Livewire (which provides Alpine at runtime)
- WireFlow bundle no longer requires `alpinejs` as an external dependency

## v0.1.1-alpha — 2026-04-03

### Fixed
- Widened `y-websocket` peer dependency to `^2.0.0 || ^3.0.0` to support both versions
- Updated `picomatch` to fix high severity ReDoS vulnerability (dev dependency)

## v0.1.0-alpha — 2026-04-02

Initial alpha release.

### Features
- Directive-driven API (`x-flow-*`) for Alpine.js
- 7 built-in edge types (bezier, smoothstep, straight, orthogonal, avoidant, editable, floating)
- Node shapes, groups, nesting, resize, and rotation
- Connection modes (drag, click, proximity, multi-connect, easy connect)
- Canvas controls, minimap, background patterns, panels, keyboard shortcuts
- Full animation engine with timeline, particles, path motion (orbit, wave, pendulum, drift), and camera follow
- Compute flows with manual and auto modes
- Interaction tools (context menus, toolbars, collapse, drag from sidebar, save/restore, undo/redo, touch support)
- Theming with CSS variables and dark mode
- Addons: whiteboard, dagre layout, force layout, tree layout, ELK layout, collaboration (Yjs)
- TypeScript types included
