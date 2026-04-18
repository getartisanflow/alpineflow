# Changelog

## v0.2.1-alpha — 2026-04-14

Tier A — measurement & layout lifecycle. Builder-focused improvements that eliminate the root cause of stale-measurement workarounds and make AlpineFlow reactive to real dimensional changes.

### Added
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
- `flow-condition` node type: 10 declarative comparison operators (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`, `startsWith`, `endsWith`, `exists`) with dot-path traversal for nested data access
- `flow-wait` node type for introducing configurable delays in execution
- Edge state CSS classes: `.flow-edge-entering`, `.flow-edge-completed`, `.flow-edge-taken`, `.flow-edge-untaken` — applied automatically during `$flow.run()` execution
- `$flow.executionLog` reactive array — records each step's node ID, state, timestamp, and output as execution progresses
- `$flow.resetExecutionLog()` helper — clears the execution log
- Generic addon setup callback mechanism: `registerAddon({ setup(canvas) { … } })` for attaching custom behavior to any canvas instance

---

### Fixed (late — landed after initial Tier A entry)
- `ResizeObserver` now reads border-box dimensions instead of content-box — fixes `fitView` over-zooming on nodes that have CSS padding or border (the node appeared smaller to the algorithm than it rendered)
- A2 "parent via `parentId`" is now treated as a third container signal alongside `childLayout` and `fixedDimensions` — fixes group nodes that use `parentId` without `childLayout` losing their explicit height after measurement
- `classList.add` on edge elements now splits space-separated `class` strings before applying — fixes multi-class values being applied as a single token (e.g. `class: 'foo bar'` now adds two classes instead of one invalid class)

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
