# Changelog

## Unreleased

### Performance — avoidant edges at schema scale
- Avoidant/orthogonal edges no longer subscribe to every node's position. Obstacle geometry is read non-reactively, so a single node write no longer re-routes the whole edge graph; routes refresh on the `_layoutAnimTick` signal (bumped at drag-end and during layout animation).
- Row-highlight tracks only the specific row keys an edge touches instead of `selectedRows.size`, so selecting a row re-runs only the edges connected to it rather than every edge.
- Edge endpoint elements resolve in O(1) via the canvas node-element registry (`_nodeElements`) instead of container-wide `[data-flow-node-id]` queries.
- Orthogonal/avoidant pathfinding uses a binary min-heap + scanline adjacency (was a linear-scan priority queue with an all-pairs neighbour test). Obstacles are pruned to a corridor around the edge (with a full-set fallback validated against the complete obstacle set), and routes are memoized in a 512-entry LRU cache keyed by endpoints + obstacle geometry.
- Benchmarks (`npm run bench`, chromium): a single dense-field route drops 0.159 ms → 0.042 ms (~3.75×); a repeated full-graph pass of 60 edges drops 8.13 ms → 0.24 ms (~34×, memo cache); a short local edge amid 100 spread-out obstacles routes on a <50-point grid (~0.004 ms) instead of 160+ points unpruned.

### Changed (alpha-breaking) — avoidant edge routing
- Obstacle geometry for avoidant/orthogonal edges is now non-reactive. A node moved by a data mutation (not a drag) that does not bump `_layoutAnimTick` will not re-route dependent edges until the next tick. Interactive drags bump the tick at drag-end, so drag-driven moves are unaffected.
- After the Dijkstra rewrite, routes across dense obstacle fields may choose different waypoints among equal-cost shortest paths. Path length and obstacle avoidance are unchanged — only the specific corners of a tie-broken route may differ, so an avoidant edge can render a visually different (but equally short) path.

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
