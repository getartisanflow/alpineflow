# AlpineFlow — Internal Working Notes

These are notes for developers (human or AI) working **inside** this repo. The public API is documented in `docs/` and on https://artisanflow.dev. This file is committed to the public repository — keep it factual about how the package is built and tested, not about downstream/consumer-site workflows.

## Tech stack

- **TypeScript** (strict)
- **Vite** for the bundler (three configs: `vite.config.ts`, `vite.bundle.config.ts`, `vite.addons.config.ts`)
- **Vitest** for testing — jsdom for unit tests (`vitest.config.ts`), Playwright for browser tests (`vitest.browser.config.ts`)
- **No** ESLint / Prettier / Biome — formatting is managed by Vite + tsc, plus convention. Match sibling-file style.

## Build

```bash
npm run build           # full pipeline: vite build && tsc && build:css && build:bundle && build:addons
npm run build:bundle    # core bundle only
npm run build:addons    # all 8 subpath addons (whiteboard, dagre, force, hierarchy, elk, collab, workflow, schema)
npm run build:css       # copy structural + theme CSS into dist/
```

The full `build` is the source of truth — always run it before claiming a change is shipped. Dist files in `dist/` are committed (downstream consumers symlink/copy this directory).

After every build, verify the new symbols are actually in the bundle (`grep` the output, don't trust the build to be silent on tree-shaking elimination).

## Test

```bash
npm run test            # vitest run — fast, jsdom, runs everything in src/**/*.test.ts
npm run test:watch      # vitest interactive
npm run test:browser    # Playwright-driven browser tests
npm run test:all        # both
npm run bench           # vitest bench --run
```

**Every change requires test coverage.** Pure logic → vitest. DOM-touching directives → vitest with jsdom. End-to-end UX → browser test.

Filter to a single file when iterating: `npm run test -- src/workflow/run.test.ts`.

## Subpath addons

```
lib/<addon>.ts          → entry file (thin re-export)
src/<addon>/            → implementation + tests
package.json exports    → ./<addon> map
dist/alpineflow-<addon>.esm.js → built output
```

Currently shipped: `whiteboard`, `collab`, `dagre`, `force`, `hierarchy`, `elk`, `workflow`, `schema`.

Adding a new addon means: creating `src/<name>/` with index.ts + tests, adding `lib/<name>.ts`, extending `package.json` exports + the `build:addons` script, and adding a doc page at `docs/addons/<name>.md`.

All addons use the `registerAddon('<name>', { setup(canvas) { … } })` pattern from `src/core/registry.ts` to attach methods/state onto canvas instances.

## Theming & CSS

- Structural rules live in `css/structural.css` — pure layout, no colors
- Theme defaults live in `css/theme-default.css` — uses CSS custom properties
- **Reuse existing tokens** (`--flow-node-bg`, `--flow-handle-color`, `--flow-text-muted`, etc.). Do not add new CSS variables without explicit owner approval — every variable becomes part of the theming contract for consumers
- Both files are copied into `dist/` by `build:css`

## Branching & releases

- **`dev`** is the integration branch
- **Feature workflow:** cut a `feature/<kebab-topic>` branch off `dev`, do the work there, open a PR back to `dev` once tests pass. The PR gets reviewed and merged into `dev` (typically by the owner). Don't push commits directly to `dev`
- **`main`** mirrors the latest tagged release. **Never push to main directly. Never merge dev → main without owner approval**
- **Never tag a version**. Tags are cut by the owner after manual verification across alpineflow + wireflow + the consuming site
- **CHANGELOG.md** is append-only. Group entries under the current alpha version block; keep `### Added` / `### Changed (alpha-breaking)` / `### Fixed` / `### Docs` subsections consistent with prior entries. Add each entry as its change merges into the version branch — don't batch them at release. Before any tag, audit that **every** merged PR has both a CHANGELOG entry and its reference-doc update (a lagging block silently ships incomplete)

## Conventions

- Strict TypeScript — explicit return types on exported functions, no implicit `any`
- Tests colocated next to source (`src/foo/bar.ts` → `src/foo/bar.test.ts`)
- Match sibling-file style (imports order, comment density, error handling)
- Docstrings on exported APIs; sparse inline comments — only when the *why* is non-obvious
- No new dependencies (`dependencies` or `peerDependencies`) without owner approval
- New canvas methods that need to be server-callable from Livewire/wireflow must include a matching `flow:<command>` listener in `src/core/wire-bridge.ts` so wireflow's `WithWireFlow` trait can dispatch them
- **Docs + CHANGELOG travel with the change.** Any change to public surface — a config option, method, event, callback, or exported type — updates its reference doc under `docs/` *and* adds an entry to the active version block *in the same PR/commit*. Never defer either to release; the pre-tag audit is a backstop for catching misses, not the place to first write them

## Don't

- Don't bypass the build (`tsc --noEmit` is fine for typecheck during dev, but the dist is what consumers use — always run the full `npm run build` before claiming done)
- Don't skip tests with `it.skip` / `it.only` in committed code
- Don't add a workaround in a consumer when the right fix is in core/addon
- Don't change the dependency graph or peer-dependency requirements without checking the impact on downstream wireflow + artisanflow
