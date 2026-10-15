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

## Adding a language

The canvas UI text (controls, accessible names, screen reader announcements, workflow and schema defaults) lives in `locales/`, one flat JSON file per language. A new language is a PR with one JSON file, no TypeScript needed.

1. **Name the file with a BCP 47 tag, using a hyphen:** `locales/fr.json`, `locales/pt-BR.json` (not `pt_BR.json`).
2. **Start from `locales/en.json`** and translate the values. You may leave keys out: a missing key falls back to English. Don't add keys that `en.json` doesn't have, apart from the extra plural forms in step 4.
3. **Keep every placeholder** (`:label`, `:id`, `:source`, `:target`, `:count`, …) spelled exactly as in English. Values are inserted literally, so messages are plain text, never HTML.
4. **Give plural messages the forms your language needs.** Messages with a `:count` end in a CLDR plural category: English ships `_one` and `_other` (`announce.nodesSelected_one`, `announce.nodesSelected_other`). Other languages may also need `_zero`, `_two`, `_few` or `_many`. List your language's categories with:

   ```bash
   node -p "new Intl.PluralRules('pl').resolvedOptions().pluralCategories"
   # [ 'few', 'many', 'one', 'other' ]
   ```

   or look the language up in the [CLDR plural rules chart](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html). Drop the forms your language doesn't have: Japanese, for example, only has `_other`, so it keeps none of the `_one` keys. Every plural message you translate needs an `_other` form. It must keep `:count` and is used whenever a category is missing. The other forms may spell the number out instead of using `:count` (for example, "one node").
5. **Validate:**

   ```bash
   npm run test -- src/core/translations.test.ts
   ```

   The locale-file check reads every file in `locales/`. For a broken file, it names the file and lists all of its problems at once: a file name `Intl.PluralRules` doesn't recognise as a locale (such as `german.json`), unknown keys, non-string values, misspelled or missing placeholders, plural categories the language doesn't have, and plural messages without an `_other` form.

   ```
   AssertionError: locales/pt-BR.json: expected [ …(2) ] to deeply equal []

   - Expected
   + Received

   - []
   + [
   +   "a11y.nodeLabel: missing placeholder :label",
   +   "announce.nodesSelected needs an _other form",
   + ]
   ```

That's all the language needs. The build publishes the file as `@getartisanflow/alpineflow/locales/<locale>.json`. [WireFlow](https://github.com/getartisanflow/wireflow) regenerates its Laravel translation files from these JSON files when it syncs each AlpineFlow release (`pt-BR.json` becomes `lang/pt_BR/canvas.php`). Canvas messages therefore never need a WireFlow PR. Text that belongs to WireFlow's own Blade components, such as the workflow buttons and the execution log, is translated in the WireFlow repo.

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
