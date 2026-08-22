# Contributing to AlpineFlow

Thanks for your interest in improving AlpineFlow — the framework-agnostic flow-diagram engine behind the [ArtisanFlow](https://artisanflow.dev) ecosystem (it also powers the [WireFlow](https://github.com/getartisanflow/wireflow) Livewire bridge).

## ⚠️ Open pull requests against `dev`, not `main`

This is the one thing that trips people up. GitHub defaults the base branch to `main`, but **`main` only ever mirrors the latest tagged release** — all work integrates through **`dev`** first.

When you open a PR, **switch the base branch to `dev`**. PRs opened against `main` will be asked to retarget.

## Branch model

- **`dev`** — the integration branch. Everything lands here first.
- **`main`** — mirrors the latest tagged release. Never the target of a feature PR.
- Cut your branch from `dev`:

  ```bash
  git checkout dev && git pull
  git checkout -b feature/<short-kebab-topic>
  ```

## Getting set up

```bash
npm install
```

AlpineFlow is written in strict **TypeScript** and bundled with **Vite**. There's no ESLint/Prettier/Biome — formatting is handled by the compiler plus convention, so **match the style of the file you're editing**.

## Tests — required

Every change needs test coverage. Pure logic and DOM-touching directives → Vitest (jsdom); end-to-end UX → a browser test.

```bash
npm run test                        # vitest run (fast, jsdom)
npm run test -- src/foo/bar.test.ts # filter to one file
npm run test:browser                # Playwright browser tests
npm run test:all                    # both
```

## Don't commit `dist/`

The compiled output in `dist/` is a release artifact — the maintainer rebuilds it from the *merged* source at integration, as its own `chore: rebuild dist` commit. A bundle rebuilt on a feature branch goes stale the moment another branch merges, and its ~3k-line diff turns every PR into a conflict magnet, so **leave `dist/` alone**.

Just make sure your source compiles and builds cleanly:

```bash
npm run build   # full pipeline: vite build && tsc && css + bundle + addons
```

If the build modified anything under `dist/`, revert it before you push (`git checkout -- dist/`) — your PR should contain source and tests only.

## Conventions

- Strict TypeScript — explicit return types on exported functions, no implicit `any`
- Tests colocated next to source (`src/foo/bar.ts` → `src/foo/bar.test.ts`)
- Docstrings on exported APIs; sparse inline comments (only when the *why* isn't obvious)
- Reuse existing CSS tokens (`--flow-*`); don't add new theme variables without discussing — each one becomes part of the theming contract for consumers

## Before you open a PR

- [ ] Base branch is **`dev`**
- [ ] `npm run test` passes
- [ ] Source compiles (`npm run build` succeeds) — but **no `dist/` changes committed**
- [ ] New behavior has a test
- [ ] No new `dependencies` / `peerDependencies` without discussing first
- [ ] No `CHANGELOG.md` entries — the maintainer compiles them at release
- [ ] No version bumps or tags — releases are cut by the maintainer

## Reporting bugs / requesting features

Use the [issue templates](.github/ISSUE_TEMPLATE) — bug report and feature/example request forms. A minimal reproduction makes bugs far faster to fix.

Thanks again! 🙌
