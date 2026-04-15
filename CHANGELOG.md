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
