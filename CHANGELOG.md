# Changelog

## v0.2.1-alpha — 2026-04-14

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
